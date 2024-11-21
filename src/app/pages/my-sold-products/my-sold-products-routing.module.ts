import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MySoldProductsPage } from './my-sold-products.page';

const routes: Routes = [
  {
    path: '',
    component: MySoldProductsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MySoldProductsPageRoutingModule {}
