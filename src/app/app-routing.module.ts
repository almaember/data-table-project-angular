import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DataTableComponent } from './components/data-table/data-table.component';


const routes: Routes = [
  { path: '**', component: DataTableComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
