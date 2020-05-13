import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { DataTableComponent } from './components/data-table/data-table.component';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { NgSelect2Module } from 'ng-select2';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';


import { AppComponent } from './app.component';
import { SzemDialogComponent } from './components/szem-dialog/szem-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    DataTableComponent,
    SzemDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NoopAnimationsModule,
    MatIconModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatSelectModule,
    MatSortModule,
    MatButtonModule,
    MatDialogModule,
    NgSelect2Module,
    FormsModule
  ],
  entryComponents: [
    SzemDialogComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
