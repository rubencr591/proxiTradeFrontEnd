import { Component, OnInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { Category } from 'src/app/model/category';
import { Product } from 'src/app/model/product';
import { User } from 'src/app/model/user';
import { AuthService } from 'src/app/services/auth.service';
import { ProductService } from 'src/app/services/product.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.page.html',
  styleUrls: ['./create-product.page.scss'],
})
export class CreateProductPage implements OnInit{


    product: Product = {
      id: null,
      name: '',
      description: '',
      category: null,
      salePrice: null,
      availability: true, 
      productOwnerId: '', 
      images: []
    };

    selectedCategoryId: number;

    categories: Category[];

    loading: any;

    idProduct: number;

    
  
    constructor(private productService: ProductService, private router: Router, 
      private alertCtrl: AlertController, private loadingController: LoadingController,
      private activatedRouter:ActivatedRoute) {

    }

    ngOnInit(): void {
    
    this.idProduct = parseInt(this.activatedRouter.snapshot.paramMap.get('id')) || null; 

    this.productService.getCategoryProducts().subscribe((categories) => {
      this.categories = categories;
      if(this.idProduct != null){
        this.getProduct();
      }
    });




  }

  async getProduct(){
    this.productService.getProductById(this.idProduct).subscribe((product) => {
      this.product = product;
      this.selectedCategoryId = product.category.id;
    });
  }


    onFileChange(event) {
      if(this.product.images.length >= 5 || this.product.images.length + event.target.files.length > 5){
        this.showAlert('Error', 'You can only upload a maximum of 5 images.');
        return;
      }
      const files = event.target.files;
      if (files.length > 5) {
        this.showAlert('Error', 'You can only upload a maximum of 5 images.');
        return;
      }
      for (let i = 0; i < files.length; i++) {
        const reader = new FileReader();
        reader.readAsDataURL(files[i]);
        reader.onload = () => {
          this.product.images.push({ base64: reader.result as string });
        };
      }
    }
  
    async createProduct() {
      if (!this.product.name || !this.product.description || !this.selectedCategoryId || !this.product.salePrice ||
           this.product.images.length === 0) {
        let errorMessage = 'Please fill in all fields:\n';
        if (!this.product.name) errorMessage += 'Name\n';
        if (!this.product.description) errorMessage += 'Description\n';
        if (!this.selectedCategoryId) errorMessage += 'Category\n';
        if (!this.product.salePrice) errorMessage += 'Sale Price\n';
        if (this.product.images.length === 0) errorMessage += 'At least one image';
        
        this.showAlert('Error', errorMessage);
        return;
      }

      let selectedCategory = this.categories.find(category => category.id === this.selectedCategoryId);
      this.product.category = selectedCategory;

      this.loading = await this.loadingController.create({
        message: 'Creating product...',
      });
      await this.loading.present();
  
      this.productService.createProduct(this.product).subscribe(
        async (product) => {
          if (product != null) {
            this.loading.dismiss();
      
            // Muestra un mensaje al usuario de que el producto se ha creado correctamente
            const alert = await this.alertCtrl.create({
              header: 'Success',
              message: 'Product created successfully.',
              buttons: ['OK']
            });
        
            await alert.present();
        
            this.router.navigate(['/tabs/tab3']).then(() => {
              this.productService.getProductsByUser();
            });
          }
        },
        async (error) => {
          console.error('Error creating product:', error);
          this.loading.dismiss();
      

        }
      );
    }


    async editProduct() {
      if (!this.product.name || !this.product.description || !this.selectedCategoryId || !this.product.salePrice ||
           this.product.images.length === 0) {
        let errorMessage = 'Please fill in all fields:\n';
        if (!this.product.name) errorMessage += 'Name\n';
        if (!this.product.description) errorMessage += 'Description\n';
        if (!this.selectedCategoryId) errorMessage += 'Category\n';
        if (!this.product.salePrice) errorMessage += 'Sale Price\n';
        if (this.product.images.length === 0) errorMessage += 'At least one image';
        
        this.showAlert('Error', errorMessage);
        return;
      }

      let selectedCategory = this.categories.find(category => category.id === this.selectedCategoryId);
      this.product.category = selectedCategory;

      this.loading = await this.loadingController.create({
        message: 'Editing product...',
      });
      await this.loading.present();
  
      this.productService.updateProduct(this.idProduct,this.product).subscribe(async (product) => {
        if(product != null){

        this.loading.dismiss();
              // Muestra un mensaje al usuario de que el producto se ha creado correctamente
        const alert = await this.alertCtrl.create({
          header: 'Success',
          message: 'Product edited successfully.',
          buttons: ['OK']
        });
    
        await alert.present();
    
        this.router.navigate(['/tabs/tab3']).then(() => {
          this.productService.getProductsByUser();
        });
        }
    
      });
    }

    deleteImage(image: any) {
      this.product.images = this.product.images.filter(img => img !== image);
    }
  
    async showAlert(header: string, message: string) {
      const alert = await this.alertCtrl.create({
        header: header,
        message: message,
        buttons: ['OK']
      });
  
      await alert.present();
    }
  
}
