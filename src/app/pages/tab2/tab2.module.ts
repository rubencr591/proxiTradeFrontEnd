import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab2Page } from './tab2.page';
import { Tab2PageRoutingModule } from './tab2-routing.module';
import { UserListModalComponent } from 'src/app/components/user-list-modal/user-list-modal.component';
import { OfferModalComponent } from 'src/app/components/offer-modal/offer-modal.component';



@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    Tab2PageRoutingModule
  ],
  declarations: [Tab2Page, UserListModalComponent, OfferModalComponent],
  
})
export class Tab2PageModule {}
