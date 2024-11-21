import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';

import { Location } from 'src/app/model/location';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

declare var google;

@Component({
  selector: 'app-address',
  templateUrl: './address.page.html',
  styleUrls: ['./address.page.scss'],
})
export class AddressPage implements OnInit, AfterViewInit{
  @ViewChild('addressInput') addressInput: ElementRef; 

  addressForm: FormGroup;

  private latitude: number;
  private longitude: number;
  private loading: any;
  private edit: boolean;

  constructor(private fb: FormBuilder, 
    private router: Router,
    private userService: UserService,
    private authService: AuthService,
    private activateRoute: ActivatedRoute,
    private alertController: AlertController,
    private loadingController: LoadingController,
  ) {}

  ngOnInit() {

    if(this.userService.getCurrentUser() == undefined) {
      this.router.navigate(['/register']);
    }

    this.addressForm = this.fb.group({
      street: ['', [Validators.required]],
      postalCode: ['', [Validators.required]],
      number: ['', [Validators.required]],
      country: ['', [Validators.required]],
      province: ['', [Validators.required]],
      community: ['', [Validators.required]],
      city: ['', [Validators.required]]
    });



    this.edit = this.activateRoute.snapshot.paramMap.get('edit') === 'true';

    if (this.edit) {
        this.patchFormEdit();
    }

  }

  ngAfterViewInit():void {


    setTimeout(() => {
      this.initializeAddressAutocomplete();
    });  }
      
    initializeAddressAutocomplete() {
      const input = this.addressInput.nativeElement as HTMLInputElement;
      const options = {
        componentRestrictions: { country: "es" },
        fields: ["address_components", "geometry", "icon", "name"],
        strictBounds: false,
      };
    
      const autocomplete = new google.maps.places.Autocomplete(input, options);
    
      autocomplete.addListener('place_changed', async () => {
        const place = autocomplete.getPlace();
        if (place.geometry) {
    
          // Obtener coordenadas
          this.latitude = place.geometry.location.lat();
          this.longitude = place.geometry.location.lng();
    
          // Limpiar los valores actuales del formulario
          this.addressForm.patchValue({
            street: '',
            country: '',
            province: '',
            community: '',
            city: '',
            postalCode: '',
            number: ''
          });
    
          // Mapear componentes de dirección a nombres de campo
          const addressComponents = {};
          place.address_components.forEach(component => {

            const componentType = component.types[0];

            switch (componentType) {
              case 'route':
                addressComponents['street'] = component.long_name;
                break;
              case 'country':
                addressComponents['country'] = component.long_name;
                break;
              case 'administrative_area_level_1':
                addressComponents['community'] = component.long_name;
                break;
              case 'administrative_area_level_2':
                addressComponents['province'] = component.long_name;
                break;
              case 'locality':
                addressComponents['city'] = component.long_name;
                break;
              case 'postal_code':
                addressComponents['postalCode'] = component.long_name;
                break;
              case 'street_number':
                addressComponents['number'] = component.long_name;
                break;
              default:
                break;
            }
          });


    
          // Asignar valores a los campos del formulario si están disponibles
          this.addressForm.patchValue(addressComponents);

          await this.validateAddress().then((isValidAddress) => {
            this.loading.dismiss();
            if (!isValidAddress) {
              this.presentErrorAlert('Invalid address');
            }
          }
          );

        } else {
          alert('No address available');
        }
      });
    }
    


  async saveAddress() {
    if (this.addressForm.valid) {

  
      const isValidAddress = await this.validateAddress();
      if (isValidAddress && !this.edit) {
        this.loading.message = 'Creating user...';
  
        const location = new Location(
          this.addressForm.value.street,
          this.addressForm.value.postalCode,
          this.addressForm.value.number,
          this.addressForm.value.country,
          this.addressForm.value.province,
          this.addressForm.value.city,
          this.addressForm.value.community,
          this.latitude,
          this.longitude
        );
        this.userService.setLocationCurrentUser(location);
  
        try {
          await this.authService.register().then((success) => {
            if (success) {
              this.loading.dismiss();
              this.router.navigate(['/tabs']);
            } else {
              this.loading.dismiss();
            }
          });
        } catch (error) {
          this.loading.dismiss();
          console.error('Error al registrar:', error);
          this.router.navigate(['/register']);
        }
      }else if(isValidAddress && this.edit){
        this.loading.message = 'Updating address...';
  
        const location = new Location(
          this.addressForm.value.street,
          this.addressForm.value.postalCode,
          this.addressForm.value.number,
          this.addressForm.value.country,
          this.addressForm.value.province,
          this.addressForm.value.city,
          this.addressForm.value.community,
          this.latitude,
          this.longitude
        );
        this.userService.setLocationCurrentUser(location);
  
          this.userService.updateUserLocation().subscribe((success) => {
            if (success) {
              this.loading.dismiss();
              this.router.navigate(['/tabs']);
            } else {
              this.loading.dismiss();
            }
          });

      } else {
        this.loading.dismiss();
        this.presentErrorAlert('Invalid address');

      }
    }
  }

  private async validateAddress(): Promise<boolean> {
    this.loading = await this.loadingController.create({
      message: 'Validating address...',
    });
    await this.loading.present();
    
    return new Promise((resolve, reject) => {
      const address = `${this.addressForm.value.street} ${this.addressForm.value.number}, ${this.addressForm.value.city}, ${this.addressForm.value.province}, ${this.addressForm.value.country}, ${this.addressForm.value.postalCode}`;
  
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ address }, (results, status) => {
        if (status === google.maps.GeocoderStatus.OK && results[0]) {
          // Check if the address components match the user input
          const result = results[0];
          const addressComponents = result.address_components;
          const components = {
            street: '',
            number: '',
            city: '',
            province: '',
            country: '',
            community: '',
            postalCode: ''
          };
  
          for (const component of addressComponents) {
            const types = component.types;
            if (types.includes('route')) {
              components.street = component.long_name;
            } else if (types.includes('street_number')) {
              components.number = component.long_name;
            } else if (types.includes('locality')) {
              components.city = component.long_name;
            } else if (types.includes('administrative_area_level_1')) {
              components.community = component.long_name;   
            } else if(types.includes('administrative_area_level_2')){
              components.province = component.long_name;
            }else if (types.includes('country')) {
              components.country = component.long_name;
            } else if (types.includes('postal_code')) {
              components.postalCode = component.long_name;
            }
          }

  
          const normalizeString = (str: string) => {
            return str.trim().toLowerCase()
                      .normalize("NFD")
                      .replace(/[\u0300-\u036f]/g, "")
                      .replace(/[^\w\s]/gi, ''); 
          };


  
          if (
            normalizeString(components.street) == normalizeString(this.addressForm.value.street) &&
            normalizeString(components.number) == normalizeString(this.addressForm.value.number) &&
            normalizeString(components.city) == normalizeString(this.addressForm.value.city) &&
            normalizeString(components.province) == normalizeString(this.addressForm.value.province) &&
            normalizeString(components.country) == normalizeString(this.addressForm.value.country) &&
            normalizeString(components.community) == normalizeString(this.addressForm.value.community) &&
            components.postalCode == this.addressForm.value.postalCode){
  

              if( result.geometry.location.lat() == undefined || result.geometry.location.lng() == undefined){
                resolve(false);
              }

              this.latitude = result.geometry.location.lat();
              this.longitude = result.geometry.location.lng();
              resolve(true);
          } else {
              resolve(false);
          }
        } else {
          resolve(false);
        }
      });
    });
  }
  

  async patchFormEdit(){
    this.userService.getCurrentUserInfo().subscribe((user) => {
      this.addressForm.patchValue({
        street: user.location.street,
        postalCode: user.location.postalCode,
        number: user.location.numberLetter,
        country: user.location.country,
        province: user.location.province,
        community: user.location.community,
        city: user.location.city
      });
      this.latitude = user.location.latitude;
      this.longitude = user.location.longitude;
    }
  );
  }

  async presentErrorAlert(errorMessage: string) {
    const alert = await this.alertController.create({
      header: 'Error',
      message: errorMessage,
      buttons: ['OK']
    });

    await alert.present();
  }

  ngOnDestroy() {
    this.addressForm.patchValue({
      street: '',
      postalCode: '',
      number: '',
      country: '',
      province: '',
      community: '',
      city: ''
    });

  }

  goBack() {
    if(this.edit){
      this.router.navigate(['/tabs/tab3']);
    }else{
      this.router.navigate(['/register']);

    }
  }
}