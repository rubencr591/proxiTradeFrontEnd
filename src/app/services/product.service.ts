import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, defaultIfEmpty, map, Observable, of, Subject } from 'rxjs';
import { Product } from '../model/product';
import { Image } from '../model/image';
import { Category } from '../model/category';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private apiUrl = environment.urlBackend + "api/products"; 

  private products: Product[] = [];

  public products$: Subject<Product[]>;

  private myProducts: Product[] = [];

  public myProducts$: Subject<Product[]>;

  constructor(private http: HttpClient) { 

    this.products$ = new Subject<Product[]>();
    this.myProducts$ = new Subject<Product[]>();
  }


  getProductsObs(): Observable<Product[]> {
    return this.products$.asObservable();
  }

  getMyProductsObs(): Observable<Product[]> {
    return this.myProducts$.asObservable();
  }

  setProducts(products: Product[]) {
    this.products = products;
    this.products$.next(this.products);
  }

  setMyProducts(products: Product[]) {
    this.myProducts = products;
    this.myProducts$.next(this.myProducts);
  }

  getProductById(id: number): Observable<Product> {
    const url = `${this.apiUrl}/product/${id}`;
    return this.http.get<any>(url).pipe(
      map(product => {
        const newProduct = new Product();
        newProduct.id = product.id;
        newProduct.name = product.name;
        newProduct.description = product.description;
        const category = new Category();
        category.id = product.category;
        category.name = product.categoryName;
        newProduct.category = category;
        newProduct.salePrice = product.salePrice;
        newProduct.availability = product.availability;
        newProduct.images = product.images;
        newProduct.productOwnerId = product.productOwnerId;
        newProduct.latitude = product.latitude;
        newProduct.longitude = product.longitude;

        if (newProduct.images) {
          newProduct.images = newProduct.images.map(image => {
            if (image.base64) {
              const extension = Image.detectImageExtension(image.base64);
              if (extension) {
                image.base64 = `data:image/${extension};base64,${image.base64}`;
              }
            }
            return image;
          });
        }
        return newProduct;
      })
    );
  }

   getProducts() {
    const url = `${this.apiUrl}/someProducts`;
  
    this.http.get<Product[]>(url).pipe(
      catchError(() => of([])), 
      defaultIfEmpty([]),       
      map(products => {
          if(products == null){return [];}
          return products.map(product => {
            if (product.images) {
              product.images = product.images.map(image => {
                if (image.base64) {
                  const extension = Image.detectImageExtension(image.base64);
                  if (extension) {
                    image.base64 = `data:image/${extension};base64,${image.base64}`;
                  }
                }
                return image;
              });
            }
            return product;
          })
        }
      )
    ).subscribe((products) => {
      this.setProducts(products);
    });
  }

  
  getProductsByUser() {
    const url = `${this.apiUrl}/myProducts`;
  
    this.http.get<Product[]>(url).pipe(
      catchError(() => of([])), 
      defaultIfEmpty([]),      
      map(products => {
        if(products == null){return [];}
        return products.map(product => {
          if (product.images) {
            product.images = product.images.map(image => {
              if (image.base64) {
                const extension = Image.detectImageExtension(image.base64);
                if (extension) {
                  image.base64 = `data:image/${extension};base64,${image.base64}`;
                }
              }
              return image;
            });
          }
          return product;
        });
      }) 
    ).subscribe((products) => {
      this.setMyProducts(products);
    });
  }

  getNearbyProducts(){
    const url = `${this.apiUrl}/nearby`;
    this.http.get<Product[]>(url).pipe(
      catchError(() => of([])), 
      defaultIfEmpty([]),      
      map(products => {
        if(products == null){return [];}
        return products.map(product => {
          if (product.images) {
            product.images = product.images.map(image => {
              if (image.base64) {
                const extension = Image.detectImageExtension(image.base64);
                if (extension) {
                  image.base64 = `data:image/${extension};base64,${image.base64}`;
                }
              }
              return image;
            });
          }
          return product;
        });
      }) 
    ).subscribe((products) => {
      this.setProducts(products);
    });  
  }


  getCategoryProducts():Observable<Category[]>{
    const url = `${this.apiUrl}/categories`;
    return this.http.get<Category[]>(url);
  }

  createProduct(product: Product): Observable<Product> {
    const url = this.apiUrl + "/create";
    const productToSend = {
      name : product.name,
      description : product.description,
      category : product.category.id,
      categoryName : product.category.name,
      salePrice : product.salePrice,
      latitude: product.latitude,
      longitude: product.longitude,
      productOwnerId: product.productOwnerId,
      availability : product.availability,
      images : product.images
    }

    return this.http.post<Product>(url, productToSend);
  }

  updateProduct(id: number, product: Product): Observable<Product> {
    const url = `${this.apiUrl}/update`;

    const body ={
      id: product.id,
      name: product.name,
      description: product.description,
      category: product.category.id,
      categoryName: product.category.name,
      salePrice: product.salePrice,
      availability: product.availability,
      images: product.images
    }
    return this.http.put<Product>(url, body);
  }


  deleteProduct(id: number): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<void>(url);
  }
}
