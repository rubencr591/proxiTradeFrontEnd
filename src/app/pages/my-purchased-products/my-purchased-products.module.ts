import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MyPurchasedProductsPageRoutingModule } from './my-purchased-products-routing.module';

import { MyPurchasedProductsPage } from './my-purchased-products.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MyPurchasedProductsPageRoutingModule
  ],
  declarations: [MyPurchasedProductsPage]
})
export class MyPurchasedProductsPageModule {}
