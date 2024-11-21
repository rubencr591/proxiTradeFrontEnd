import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MySoldProductsPageRoutingModule } from './my-sold-products-routing.module';

import { MySoldProductsPage } from './my-sold-products.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MySoldProductsPageRoutingModule
  ],
  declarations: [MySoldProductsPage]
})
export class MySoldProductsPageModule {}
