import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { catchError, of, tap } from 'rxjs';
import { Router } from '@angular/router';
import { createClient } from 'contentful-management';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css',
})
export class SettingsComponent implements OnInit {
  employeeData: any; // Define employeeData property
  selectedTab: string = 'details';
  name: string = '';
  surname: string = '';
  description: string = '';
  email: string = '';
  x: string = '';
  linkedIn: string = '';
  gitHub: string = '';
  currentPassword: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  employeePictureLink: string = '';
  makeContactInfoPublic: boolean = false;
  makeScreenerPublic: boolean = false;
  avatar: File | null = null;
  file: any;
  pictureChanged: boolean = false;

  constructor(private http: HttpClient, private router: Router) {}

  selectTab(tab: string) {
    this.selectedTab = tab;
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
            console.log('Changes saved', response);
            // Optionally update the local storage with the new data
            const newEmployeeData = { ...this.employeeData, ...updatedData };
            localStorage.setItem('employeeData', JSON.stringify(newEmployeeData));
            this.employeeData = newEmployeeData;
          }),
          catchError((error: any) => {
            console.error('Error saving changes:', error);
            return of(null); // Return observable of null or handle error as needed
          })
        )
        .subscribe(() => {
          alert('Changes saved');
          //navigate to profile page
          this.router.navigate(['/profile']);
        });
    };
  
    saveData();
  }
  

  deleteAccount() {
    // Delete account logic here
    console.log('Account deleted');
  }
}
