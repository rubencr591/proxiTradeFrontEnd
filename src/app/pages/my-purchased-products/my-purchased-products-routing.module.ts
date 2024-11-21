import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MyPurchasedProductsPage } from './my-purchased-products.page';

const routes: Routes = [
  {
    path: '',
    component: MyPurchasedProductsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyPurchasedProductsPageRoutingModule {}
