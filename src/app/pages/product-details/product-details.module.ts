import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ProductDetailsPageRoutingModule } from './product-details-routing.module';
import { ProductDetailsPage } from './product-details.page';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProductDetailsPageRoutingModule,
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA],
  declarations: [ProductDetailsPage]
})
export class ProductDetailsPageModule {}
