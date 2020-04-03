import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TenantAdminComponent } from './tenant-admin.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import {TenantAdminRoutingModule} from './tenant-admin-routing.module';
import { LoginComponent } from './login/login.component';
import {AngularMaterialModule} from '../angular-material/angular-material.module';
import {ReactiveFormsModule} from '@angular/forms';
import {ClientsListComponent} from './clients-list/clients-list.component';
import {ClientsCreateComponent} from './clients-create/clients-create.component';



@NgModule({
  declarations: [TenantAdminComponent, DashboardComponent, LoginComponent, ClientsListComponent, ClientsCreateComponent],
  imports: [
    CommonModule,
    TenantAdminRoutingModule,
    AngularMaterialModule,
    ReactiveFormsModule
  ]
})
export class TenantAdminModule { }
