import { Location } from "./location";

export class User {
    private uid: string;
    email: string;
    name: string;
    password: string;
    phone: number;
    profilePicture: string;
    location: Location;
    kmRatio: number;


    
    constructor(id: string, email: string, name: string, password: string, phone:number){
        this.uid = id;
        this.email = email;
        this.name = name;
        this.password = password;
        this.phone = phone;

    }

    setUid(uid: string){
        this.uid = uid;
    }

    setPhone(phone: number){
        this.phone = phone;
    }

    setProfilePicture(profilePicture: string){
        this.profilePicture = profilePicture;
    }
    setLocation(location: Location){
        this.location = location;
    }

    setKmRatio(kmRatio: number){
        this.kmRatio = kmRatio;
    }


    getUID(): string{
        return this.uid;
    }

    getEmail(): string{
        return this.email;
    }

    getName(): string{
        return this.name;
    }

    getPassword(): string{
        return this.password;
    }

    getPhone(): number{
        return this.phone;
    }

    getKmRatio(): number{
        return this.kmRatio;
    }



    getProfilePicture(): string{
        return this.profilePicture;
    }

    getLocation(): Location{
        return this.location;
    }



}