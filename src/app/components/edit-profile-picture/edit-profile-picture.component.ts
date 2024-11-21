import { Component, OnInit } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { ModalController } from '@ionic/angular';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-edit-profile-picture',
  templateUrl: './edit-profile-picture.component.html',
  styleUrls: ['./edit-profile-picture.component.scss'],
})
export class EditProfilePictureComponent   {
  isCapturingPhoto: boolean = false;


    constructor(
      private camera: Camera,
      private modalController: ModalController,
      private platform: Platform
    ) {}


    async takePhoto() {
      this.isCapturingPhoto = true; // Mostrar el indicador de carga
      
      let base64Image;
      if (this.platform.is('cordova')) {
        // Lógica para tomar la foto en dispositivos móviles
        const options: CameraOptions = {
          quality: 100,
          destinationType: this.camera.DestinationType.DATA_URL,
          sourceType: this.camera.PictureSourceType.CAMERA,
          encodingType: this.camera.EncodingType.JPEG,
          mediaType: this.camera.MediaType.PICTURE
        };
        const imageData = await this.camera.getPicture(options);
        base64Image = 'data:image/jpeg;base64,' + imageData;
      } else {
        // Lógica para tomar la foto en la web
        base64Image = await this.getWebCameraPicture();
        await this.stopWebCamera();
      }
      
      this.modalController.dismiss(base64Image);
      this.isCapturingPhoto = false; // Ocultar el indicador de carga
    }
    
    
    async selectPhoto() {
      let base64Image;
      if (this.platform.is('cordova')) {
        const options: CameraOptions = {
          quality: 100,
          destinationType: this.camera.DestinationType.DATA_URL,
          sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
          encodingType: this.camera.EncodingType.JPEG,
          mediaType: this.camera.MediaType.PICTURE
        };
        const imageData = await this.camera.getPicture(options);
        base64Image = 'data:image/jpeg;base64,' + imageData;
      } else {
        base64Image = await this.getWebPicture();
      }
      this.modalController.dismiss(base64Image);
    }
    
    async getWebCameraPicture(): Promise<string> {
      return new Promise((resolve, reject) => {
        const video = document.createElement('video');
    
        navigator.mediaDevices.getUserMedia({ video: true, audio: false })
          .then(stream => {
            video.srcObject = stream;
            video.play();
    
            video.onloadedmetadata = () => {
              video.width = video.videoWidth;
              video.height = video.videoHeight;
            };
    
            video.oncanplaythrough = async () => {
              const canvas = document.createElement('canvas');
              canvas.width = video.videoWidth;
              canvas.height = video.videoHeight;
              const context = canvas.getContext('2d');
              context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
              const imageDataUrl = canvas.toDataURL('image/jpeg');
              
              // Detener la webcam después de tomar la foto
              stream.getTracks().forEach(track => track.stop());
              
              resolve(imageDataUrl);
            };
          })
          .catch(reject);
      });
    }
    
    
    async getWebPicture(): Promise<string> {
      return new Promise((resolve, reject) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = () => {
          const file = input.files[0];
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target.result.toString());
          reader.onerror = (e) => reject(e);
          reader.readAsDataURL(file);
        };
        input.click();
      });
    }

  async stopWebCamera() {
    navigator.mediaDevices.getUserMedia({ video: true, audio: false })
      .then(stream => {
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
      })
      .catch(error => {
        console.error('Error al detener la webcam:', error);
      });
  }

  close() {
    this.modalController.dismiss();
  }

}
