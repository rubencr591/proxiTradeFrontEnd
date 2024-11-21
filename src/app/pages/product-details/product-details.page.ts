import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { Marker } from 'src/app/model/marker';
import { Product } from 'src/app/model/product';
import { OfferService } from 'src/app/services/offer.service';
import { ProductService } from 'src/app/services/product.service';
import { UserService } from 'src/app/services/user.service';
import { register } from 'swiper/element/bundle';

declare var google;

register();

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.page.html',
  styleUrls: ['./product-details.page.scss'],
})
export class ProductDetailsPage implements OnInit{

  product: Product = {
    id: 0,
    name: '',
    description: '',
    category: { id: -1, name: '' },
    salePrice: 0,
    latitude: 0,
    longitude: 0,
    availability: false, 
    productOwnerId: '', 
    images: [],
  };
  loading: any;
  private productId: any;
  isModalOpen = false;
  selectedImageIndex = 0;
  marker: Marker = null;
  myproduct:boolean = false;
  productOwner: any;

  constructor(
    private productService: ProductService,
    private activateRoute: ActivatedRoute,
    private router:Router,
    private loadingController: LoadingController,
    private offerService:OfferService,
    private userService: UserService,
    private alertController: AlertController
  ) {
  
  }

  ngOnInit(): void {
    const encodedProductInfo =  this.activateRoute.snapshot.paramMap.get('productInfo');

    let productInfo = atob(encodedProductInfo).split(';');



    if(productInfo.length > 1){
      this.productId = productInfo[0];
      this.myproduct = productInfo[1] == 'true';
    }else{
      this.productId = productInfo[0];
    }


    this.getProduct();
  }


  async loadMap() {
    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

    const mapEle: HTMLElement = document.getElementById('map');

    const myLatLng = {
      lat: this.product.latitude,
      lng: this.product.longitude
    };

    const map = new google.maps.Map(mapEle, {
      center: myLatLng,
      zoom: 15,
      mapId: 'DEMO_MAP_ID'
    });

    const marker = new google.maps.marker.AdvancedMarkerElement({
      map,
      position: myLatLng,
      title: 'Place where it is sold',
    });
  }

  async getProduct() {
    this.loading = await this.loadingController.create({
      message: 'Loading...',
    });
    await this.loading.present();
    this.productService.getProductById(parseInt(this.productId)).subscribe((product) => {
      if (this.loading) {
        this.loading.dismiss();
      }
      this.product = product;
      this.getOwner();


      this.loadMap();
    });
  }

  async getOwner(){
    this.userService.getUserById(this.product.productOwnerId).subscribe((user) => {
      this.productOwner = user;
    });
  }


  openChat(){
    this.offerService.setSelectedProduct(this.product);
    this.router.navigate(['/tabs/tab2']);

  }

  openModal(index: number) {
    this.selectedImageIndex = index;
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  async editProduct(){
    this.router.navigate(['/create-product', this.product.id]);
  }

  async buyProduct() {
    this.router.navigate(['/payment-method',  this.product.id ]);
  }

  async deleteProduct(){
    this.productService.deleteProduct(this.product.id).subscribe(() => {
      this.alertController.create({
        header: 'Success',
        message: 'Product deleted successfully',
        buttons: ['OK']
      }).then(alert => alert.present());
      this.router.navigate(['/tabs/tab3']);
    });
  }


}
