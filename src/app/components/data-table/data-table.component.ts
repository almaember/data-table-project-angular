import { Component, OnInit, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';
import { OrdersService } from '../../services/orders.service';
import { Order } from '../../models/order/order';
import { Select2OptionData } from 'ng-select2';
import { WebhooksService } from 'src/app/services/webhooks.service';
import { AdminService } from 'src/app/services/admin.service';
import { MatDialog } from '@angular/material/dialog';
import { SzemDialogComponent } from '../szem-dialog/szem-dialog.component';
declare var $: any;

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.css']
})

export class DataTableComponent implements OnInit {
  @ViewChild('startDate', { static: true }) sdate: ElementRef;
  @ViewChild('endDate', { static: true }) edate: ElementRef;
  @ViewChild('publishStartDate', { static: true }) psdate: ElementRef;
  @ViewChild('publishEndDate', { static: true }) pedate: ElementRef;

  constructor(
    public ordersService: OrdersService,
    public webhooksService: WebhooksService,
    public adminService: AdminService,
    public dialog: MatDialog,
  ) { }

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['id', 'wooid', 'kozzeteve', 'szem', 'szamlazasinev', 'vegosszeg', 'fizetesimod', 'allapot', 'termekneve',
    'datum', 'mennyiseg', 'vasznak', 'megjegyzes', 'megerkezett',];

  data: Order[];
  countOfOrders: number;
  productNamesForSelect2: Array<Select2OptionData>;
  billingNamesForSelect2: Array<Select2OptionData>;
  productFilterValue: string;
  nameFilterValue: string;
  url: string;
  authority: number;
  query = {
    // Pagination (page) event
    previousPageIndex: 0,
    pageIndex: 0,
    pageSize: 50,
    length: 0,
    // Sort (matSortChange) event
    active: 'id',
    direction: 'desc',
    // Filter by date
    isFilterByDate: false,
    startDate: '',
    endDate: '',
    // Filter by publishdate
    isFilterByPublishDate: false,
    publishStartDate: '',
    publishEndDate: '',
    // Filter by product
    isFilterByProduct: false,
    productName: '',
    // Filter by name
    isFilterByName: false,
    billingName: '',
  };
  // If you modify this please modify in the generateExcel.js file too
  states = [
    { name: 'Ez az állapot nem létezik! ', value: 'missing-status' },
    { name: 'Fizetésre vár', value: 'on-hold', },
    { name: 'Fizetésre vár (készpénz)', value: 'processing' },
    { name: 'Teljesítve', value: 'completed' },
    { name: 'Visszamondva', value: 'cancelled', },
    { name: 'Visszatérítve', value: 'refunded' },
    { name: 'Sikertelen', value: 'failed' },
    { name: 'Fizetés folyamatban', value: 'pending' }
  ];
  newStatusObject = {
    eventRowID: 0,
    eventWooID: 0,
    newStatus: '',
  };

  ngOnInit() {
    // For jquery datepicker
    $(function () {
      $('#dateStart').datepicker({
        dateFormat: 'yy-mm-dd'
      });
    });
    $(function () {
      $('#dateEnd').datepicker({
        dateFormat: 'yy-mm-dd'
      });
    });

    $(function () {
      $('#publishDateStart').datepicker({
        dateFormat: 'yy-mm-dd'
      });
    });
    $(function () {
      $('#publishDateEnd').datepicker({
        dateFormat: 'yy-mm-dd'
      });
    });

    this.adminService.getAuthority().subscribe(response => {
      this.authority = response.authority;
    });

    this.countData();
    this.getData();
    // Create products filter select list
    this.fillProductOptions();
    this.fillNameOptions();
  }

  getData() {
    this.query.isFilterByProduct = !this.query.productName || this.query.productName === 'productFilterOff' ? false : true;
    this.query.isFilterByName = !this.query.billingName || this.query.billingName === 'nameFilterOff' ? false : true;
    this.ordersService.getAllOrders(this.query).subscribe(orders => {
      this.data = orders;
      this.generateExcelDownloadUrl();
    });

  }

  countData() {
    this.ordersService.countAllOrders(this.query).subscribe(countOfOrders => {
      this.countOfOrders = countOfOrders[0]['counted_data'];
    });
  }

  paginatorChange($paginatorEvent) {
    this.query.previousPageIndex = $paginatorEvent.previousPageIndex;
    this.query.pageIndex = $paginatorEvent.pageIndex;
    this.query.pageSize = $paginatorEvent.pageSize;
    this.query.length = $paginatorEvent.length;
    this.getData();
  }

  sortChange($sortEvent) {
    this.query.active = $sortEvent.active;
    this.query.direction = $sortEvent.direction;
    this.getData();
  }

  modifyDateFilterAndApplyAllFilters() {
    this.query.isFilterByDate = true;
    this.query.isFilterByPublishDate = true;
    this.query.startDate = this.sdate.nativeElement.value;
    this.query.endDate = this.edate.nativeElement.value;
    this.query.publishStartDate = this.psdate.nativeElement.value;
    this.query.publishEndDate = this.pedate.nativeElement.value;

    if (this.sdate.nativeElement.value === '' && this.edate.nativeElement.value === '') {
      this.query.isFilterByDate = false;
    }

    if (this.psdate.nativeElement.value === '' && this.pedate.nativeElement.value === '') {
      this.query.isFilterByPublishDate = false;
    }

    this.countData();
    this.getData();
  }

  turnOffFilters() {
    // Clear query
    this.query.isFilterByProduct = false;
    this.query.isFilterByName = false;
    this.query.isFilterByDate = false;
    this.query.isFilterByPublishDate = false;
    this.query.productName = '';
    this.query.billingName = '';
    // Clear date filter values
    this.sdate.nativeElement.value = '';
    this.edate.nativeElement.value = '';
    this.psdate.nativeElement.value = '';
    this.pedate.nativeElement.value = '';

    this.countData();
    this.getData();
  }

  // Customer arrived checkbox function
  customerArrived(row, megerkezett) {
    const orderId = parseInt(row.id, 10);
    this.ordersService.modifyCustomerArrivedStatus(orderId, megerkezett).subscribe(megerkezett => {
      row.megerkezett = megerkezett;
    });
  }

  // Customer arrived checkbox function
  changeRowColor(changeEvent) {
    if (changeEvent.target.checked === true) {
      changeEvent.path[2].classList.remove('table-row-not-arrived');
      changeEvent.path[2].classList.add('table-row-arrived');
    } else if (changeEvent.target.checked === false) {
      changeEvent.path[2].classList.remove('table-row-arrived');
      changeEvent.path[2].classList.add('table-row-not-arrived');
    }
  }

  fillProductOptions() {
    this.ordersService.getProductNames().subscribe(
      data => {
        this.productNamesForSelect2 = data.map(data => { return { id: data.termekneve, text: data.termekneve } });
        this.productNamesForSelect2.unshift({ id: 'productFilterOff', text: 'Nincs szűrés termékre' });
      }
    )
  }

  fillNameOptions() {
    this.ordersService.getBillingNames().subscribe(
      data => {
        this.billingNamesForSelect2 = data.map(data => { return { id: data.szamlazasinev, text: data.szamlazasinev } });
        this.billingNamesForSelect2.unshift({ id: 'nameFilterOff', text: 'Nincs szűrés névre' });
      }
    )
  }

  generateExcelDownloadUrl() {
    this.url = '/api/orders/excel';
    this.url += `?active=${this.query.active}`;
    this.url += `&direction=${this.query.direction}`;
    this.url += `&isFilterByDate=${this.query.isFilterByDate}`;
    this.url += `&startDate=${this.query.startDate}`;
    this.url += `&endDate=${this.query.endDate}`;
    this.url += `&isFilterByPublishDate=${this.query.isFilterByPublishDate}`;
    this.url += `&publishStartDate=${this.query.publishStartDate}`;
    this.url += `&publishEndDate=${this.query.publishEndDate}`;
    this.url += `&isFilterByProduct=${!this.query.productName || this.query.productName === 'productFilterOff' ? false : true}`;
    this.url += `&productName=${this.query.productName}`;
    this.url += `&isFilterByName=${!this.query.billingName || this.query.billingName === 'nameFilterOff' ? false : true}`;
    this.url += `&billingName=${this.query.billingName}`;
  }

  // Modify row status and send the new status to the database
  modifyRowStatusMaxAuth(row) {
    if (row.id === this.newStatusObject.eventRowID) {
      row.statusLoading = true;
      this.webhooksService.modifyPaymentStatus(this.newStatusObject.eventWooID, this.newStatusObject.newStatus).subscribe(
        data => {
          row.statusLoading = false;
          this.getData();
        }
      )
    }
  }

  modifyRowStatusMinAuth(row) {
    row.statusLoading = true;
    this.webhooksService.modifyPaymentStatus(row.wooid, 'completed').subscribe(
      data => {
        row.statusLoading = false;
        this.getData();
      }
    )
  }

  selectValueChanged(event, row) {
    this.newStatusObject.eventRowID = row.id;
    this.newStatusObject.eventWooID = row.wooid;
    this.newStatusObject.newStatus = event.target.value;
  }

  openSzemPopup(orderId) {
    const dialogRef = this.dialog.open(SzemDialogComponent, {
      width: '700px',
      data: orderId
    });
  }

}
