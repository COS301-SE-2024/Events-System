import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { catchError, of, tap } from 'rxjs';
import { Router } from '@angular/router';
import { createClient } from 'contentful-management';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css',
})

export class SettingsComponent implements OnInit {
  employeeData: any; // Define employeeData property
  selectedTab= 'details';
  name = '';
  surname= '';
  description= '';
  email= '';
  x= '';
  linkedIn= '';
  gitHub= '';
  currentPassword= '';
  newPassword= '';
  confirmPassword= '';
  employeePictureLink= '';
  makeContactInfoPrivate = false;
  makeSurnamePrivate = false;
  isAPILoading = false;
  showdeletesuccessToast = false;
  showchangesuccessToast = false;
  showdeletefailToast = false;
  showchangefailToast = false;

  avatar: File | null = null;
  file: any;
  pictureChanged = false;

  constructor(private http: HttpClient, private router: Router) {}

  selectTab(tab: string) {
    this.selectedTab = tab;
  }

  toggleContactInfoPrivate() {
    this.makeContactInfoPrivate = !this.makeContactInfoPrivate;
  }

  toggleSurnamePrivate() {
    this.makeSurnamePrivate = !this.makeSurnamePrivate;
  }

  onAvatarChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.file = input.files[0];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.employeeData.employeePictureLink = e.target.result;
        this.pictureChanged = true;
        // Optionally, upload the new image to the server here
      };
      reader.readAsDataURL(this.file);
    }
  }

  ngOnInit(): void {
    const storedEmployeeData = localStorage.getItem('employeeData');
    if (storedEmployeeData) {
      this.employeeData = JSON.parse(storedEmployeeData);
    } else {
      // Handle case where employeeData is not available in localStorage
    }
  }

  async uploadFileToContentful(file: File) {
    const client = createClient({
      accessToken: 'CMA TOKEN',
    });

    const space = await client.getSpace('ox5lffnpftbk');
    const environment = await space.getEnvironment('master');

    const asset = await environment.createAssetFromFiles({
      fields: {
        title: {
          'en-US': file.name,
        },
        file: {
          'en-US': {
            contentType: file.type,
            fileName: file.name,
            file: this.file,
          },
        },
        description: {}
      },
    });

    const processedAsset = await asset.processForAllLocales();
    const publishedAsset = await processedAsset.publish();

    return publishedAsset.fields.file['en-US'].url;
  }

  saveChanges() {
    this.isAPILoading = true;
    const updatedData: any = {};
  
    if (this.name) updatedData.firstName = this.name;
    if (this.surname) updatedData.lastName = this.surname;
    if (this.description) updatedData.employeeDescription = this.description;
    if (this.email) updatedData.email = this.email;
    if (this.x) updatedData.twitter = this.x;
    if (this.linkedIn) updatedData.linkedin = this.linkedIn;
    if (this.gitHub) updatedData.github = this.gitHub;
  
    const uploadFile = async () => {
      if (this.pictureChanged && this.file) {
        try {
          const fileUrl = await this.uploadFileToContentful(this.file);
          updatedData.employeePictureLink = fileUrl;
        } catch (error) {
          console.error('Error uploading file:', error);
        }
      }
    };
  
    const id = localStorage.getItem('ID');
  
    const saveData = async () => {


      if (this.pictureChanged) {
        await uploadFile();
      }
  
      this.http.patch(`https://events-system-back.wn.r.appspot.com/api/employees/${id}`, updatedData)
        .pipe(
          tap((response: any) => {

            // console.log('Changes saved', response);
            // Optionally update the local storage with the new data
            const newEmployeeData = { ...this.employeeData, ...updatedData };
            localStorage.setItem('employeeData', JSON.stringify(newEmployeeData));
            this.employeeData = newEmployeeData;
          }),
          catchError((error: any) => {
            this.showchangefailToast = true;
            this.isAPILoading = false;
            console.error('Error saving changes:', error);
            return of(null); // Return observable of null or handle error as needed
          })
        )
        .subscribe(() => {
        this.showchangesuccessToast = true;
        this.isAPILoading = false;
        setTimeout(() => {
          this.showchangesuccessToast = false;
          this.router.navigate(['/profile']);
        }, 2000);
          // alert('Changes saved');
          //navigate to profile page
          // this.router.navigate(['/profile']);
        });
    };
  
    saveData();
  }
  

  deleteAccount() {
    this.isAPILoading = true;

    const id = localStorage.getItem('ID');
    if (id) {
      this.http.delete(`https://events-system-back.wn.r.appspot.com/api/employees/${id}`)
        .pipe(
          tap((response: any) => {
            this.showdeletesuccessToast = true;
            this.isAPILoading = false;
            setTimeout(() => {
              this.showdeletesuccessToast = false;
              this.router.navigate(['/login']);
            }, 5000);
            //console.log('Account deleted', response);
            // alert('Account deleted');
            //localStorage.removeItem('employeeData');
            //localStorage.removeItem('ID');
            //These are done whenever the login page is loaded
            // this.router.navigate(['/login']);
          }),
          catchError((error: any) => {
            this.showdeletefailToast = true;
            this.isAPILoading = false;
            return of(null); // Return observable of null or handle error as needed
          })
        )
        .subscribe();
    } else {
      console.error('No ID found in localStorage');
    }
  }
}
