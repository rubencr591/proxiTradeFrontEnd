export class Location {
    street: string;
    postalCode: string;
    numberLetter: string;
    country: string;
    province: string;
    city: string;
    latitude: number;
    longitude: number;
    community: string;

    constructor(street: string, postalCode: string, numberLetter: string, country: string, province: string, city: string, community:string, latitude: number, longitude: number) {
        this.street = street;
        this.postalCode = postalCode;
        this.numberLetter = numberLetter;
        this.country = country;
        this.province = province;
        this.city = city;
        this.community = community;
        this.latitude = latitude;
        this.longitude = longitude;
    }

}