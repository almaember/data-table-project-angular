import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { WebhooksService } from 'src/app/services/webhooks.service';
import { AdminService } from 'src/app/services/admin.service';

@Component({
  selector: 'app-szem-dialog',
  templateUrl: './szem-dialog.component.html',
  styleUrls: ['./szem-dialog.component.css']
})
export class SzemDialogComponent {

  orderData: any = '';
  authority: number;
  wooBillGenerated;

  constructor(
    private webhooksService: WebhooksService,
    public adminService: AdminService,
    public dialogRef: MatDialogRef<SzemDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public orderId: number
  ) {
    this.webhooksService.getWcOrder(orderId).subscribe(orderData => {
      this.orderData = orderData;
      this.wooBillGenerated = orderData.meta_data.filter(items => items.key == '_wc_billingo_id');
    });
  }

  ngOnInit() {
    this.adminService.getAuthority().subscribe(response => {
      this.authority = response.authority;
    });
  }

  onCloseClick(): void {
    this.dialogRef.close();
  }


}
