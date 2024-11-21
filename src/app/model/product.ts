import { Category } from "./category";
import { Image } from "./image";

export class Product{
    id?: number;
    name?: string;
    description?: string;
    category?: Category;
    salePrice?: number;
    latitude?: number;
    longitude?: number;
    availability?: boolean;
    productOwnerId?: string;
    images?: Image[];

    constructor( ){
        this.id = 0;
        this.name = '';
        this.description = '';
        this.category = { id: -1, name: '' };
        this.salePrice = 0;
        this.latitude = 0;
        this.longitude = 0;
        this.availability = false; 
        this.productOwnerId = ''; 
        this.images = [];
    }
}