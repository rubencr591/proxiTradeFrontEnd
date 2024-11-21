import { Component, OnDestroy, OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';
import { UserService } from 'src/app/services/user.service';
import { LoadingController } from '@ionic/angular';
import { NavigationEnd, Router } from '@angular/router';
import { filter, Subscription } from 'rxjs';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit, OnDestroy {
  products: any[];
  loading: any;
  myUser = this.userService.getCurrentUser();
  routerSubscription: Subscription;
  segmentValue: string = 'all';
  categories: any[];
  selectedCategoryId: number; 
  filter: string = 'all';
  firstLoad: boolean = true;

  constructor(
    private productService: ProductService,
    private userService: UserService,
    private loadingController: LoadingController,
    private router: Router
  ) {
    this.productService.getProductsObs().subscribe((products: any[]) => {
      if(!this.selectedCategoryId || this.selectedCategoryId === 0){
        this.products = products;
      }else{
        this.products = products.filter(product => product.category === this.selectedCategoryId);
      }
    
      if (this.loading) {
        this.loading.dismiss();
      }
    });

  }

  async ionViewWillEnter() {
    if(!this.firstLoad){
      await this.filterProducts();
      await  this.getCategories();
    }
    this.firstLoad = false;

  }

  async ngOnInit() {

    this.loading = await this.loadingController.create({
      message: 'Loading...',
    }); 
    this.loadProducts();


    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        if (event.urlAfterRedirects === '/tabs/tab1') {
          this.loadProducts();
          this.getCategories();
        }
      });


  }

  async getCategories() {
    this.categories = [];
    this.categories.push({id: 0, name: 'All'});

    this.productService.getCategoryProducts().subscribe((categories) => {
    
      this.categories = this.categories.concat(categories);
     });
    }

  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }



  async loadProducts() {
    await this.loading.present();
    this.productService.getProducts();
  }

  async loadNearbyProducts() {
    await this.loading.present();
    this.productService.getNearbyProducts();
  }
  

  async filterProducts() {
    this.loading = await this.loadingController.create({
      message: 'Loading...',
    });
    if(this.segmentValue === 'all'){
      this.loadProducts();

    }else if(this.segmentValue === 'nearby'){
      this.loadNearbyProducts();
    }
  }

  selectProduct(product: any) {
    const encodedProductId = btoa(product.id);
    this.segmentValue = 'all'
    this.router.navigate(['/product-details', encodedProductId]);
  }

  async onCategoryChange() {
    if(this.segmentValue === 'all'){
      await this.loadProducts();
    }else if(this.segmentValue === 'nearby'){
      await this.loadNearbyProducts();
    }
  }
}

