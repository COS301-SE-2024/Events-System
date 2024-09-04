import { Component, OnInit } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'; 
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { RandomImageServiceService } from 'src/app/random-image-service.service';
import { DomSanitizer } from '@angular/platform-browser';
import { SanitizePipe } from 'src/app/sanitization.pipe';
@Component({
  selector: 'app-social-club-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule, RouterModule],
  templateUrl: './socialClubCreate.component.html',
  styleUrl: './socialClubCreate.component.css',
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('400ms', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('10ms', style({ opacity: 0 }))
      ])
    ]),
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('500ms', style({ opacity: 1 })),
      ]),
      transition(':leave', [
        animate('200ms', style({ opacity: 0 })),
      ]),
    ]),
  ]
})
export class SocialClubCreateComponent implements OnInit {
  createForm: FormGroup;
  hostID: any;
  imageSource: string;
  currentStep = 1;
  isPictureEmpty = false; isNameEmpty = false; isDescriptionEmpty = false; isCategoriesEmpty = false; isSummaryEmpty = false;
  showsuccessToast = false;
  showfailToast = false;
  isAPILoading = false;
  sanitizePipe: SanitizePipe;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private http: HttpClient,
    private randomImageService: RandomImageServiceService,
    private sanitizer: DomSanitizer
  )
  {
    this.sanitizePipe = new SanitizePipe(this.sanitizer);

    this.createForm = this.fb.group({
      ownerID: [],
      name: [],
      description: [],
      pictureLink: [],
      summaryDescription: [],
      categories: []
    });
    this.imageSource = '';
  }

  ngOnInit(): void {
    this.checkCookies();
    this.imageSource = this.randomImageService.getRandomImageSource();
  }

  createClub() {
    if (this.createForm.valid) {
      this.isAPILoading = true;
        try{
          fetch('https://events-system-back.wn.r.appspot.com/api/v1/auth/' + this.getCookie("jwt"), {
            method: 'GET',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json'
            }
          })
          .then(response => response.json())
          .then(data => {
            // Show the success toast
            this.hostID = data;

            const formData = {
              ownerID: this.hostID,
              name: this.sanitizePipe.transform(this.createForm.get('name')?.value),
              description: this.sanitizePipe.transform(this.createForm.get('description')?.value),
              pictureLink: this.sanitizePipe.transform(this.createForm.get('pictureLink')?.value),
              summaryDescription: this.sanitizePipe.transform(this.createForm.get('summaryDescription')?.value),
              categories: [this.sanitizePipe.transform(this.createForm.get('categories')?.value)]
            };
            // console.log("Form data: " + JSON.stringify(formData));
            
            try {
              fetch('https://events-system-back.wn.r.appspot.com/api/socialclubs', {
                method: 'POST',
                credentials: 'include',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
              })
              .then(response => response.json())
              .then(() => {
                // Show the success toast
                //console.log(data);
                this.showsuccessToast = true;
                this.isAPILoading = false;
                setTimeout(() => {
                  this.showsuccessToast = false;
                  window.history.back();
                }, 5000);
              })
              .catch((error) => {
                this.showfailToast = true;
                this.isAPILoading = false;

                setTimeout(() => {
                  this.showfailToast = false;
                }, 10000);
                console.error('Error:', error);
              });
            }
            catch (error)
            {
              console.error('Error:', error);
              console.error('Error during club creation:', error);
            }
          });
        }
        catch (error) {
          console.error('Error:', error);
          console.error('Error during ownerID retrieval:', error);
        }
       //this.hostID = localStorage.getItem("ID");

 
     //this.router.navigate(['/socialclublisting']);
       }
  }

  nextStep() {
    if (!this.createForm.get('pictureLink') || this.createForm.get('pictureLink')?.value === '') {
      this.isPictureEmpty = true;
      return;
    }
    if (this.currentStep < 3) {
      //this.createForm.setValue({ pcitureLink: this.createForm.get('pictureLink')?.value });
      this.isPictureEmpty = false;
      ++this.currentStep;
    }
  }
  nextStep1() {
    if (!this.createForm.get('name') || this.createForm.get('name')?.value === '') {
      this.isNameEmpty = true;
      return;
    }
    if (this.currentStep < 3)
      //console.log("Name: " + this.createForm.get('name')?.value);
      //sessionStorage.setItem(`name`, this.createForm.get('name')?.value)
      this.isNameEmpty = false;
      ++this.currentStep;
  }
  nextStep2() {
    if (!this.createForm.get('summaryDescription') || this.createForm.get('summaryDescription')?.value === '' || !this.createForm.get('description') || this.createForm.get('description')?.value === '' || !this.createForm.get('categories') || this.createForm.get('categories')?.value === '') {
      this.isSummaryEmpty = true;
      this.isDescriptionEmpty = true;
      this.isCategoriesEmpty = true;
      return;
    }
    if (this.currentStep < 3) {
      this.isSummaryEmpty = false;
      this.isDescriptionEmpty = false;
      this.isCategoriesEmpty = false;
      ++this.currentStep;
    }
  }

  previousStep() {
    if (this.currentStep > 0) {
      --this.currentStep;
    }
  }
  navigateToStep(step: number) {
    this.currentStep = step;
  }
  goBack(): void {
    window.history.back();
  }
  isLiteratureSelected = false;
  isEducationSelected = false;

  toggleLiterature() {
    this.isLiteratureSelected = !this.isLiteratureSelected;
  }
  toggleEducation() {
    this.isEducationSelected = !this.isEducationSelected;
  }

  preSubmit(){
    const missingDetails = [];
  
    if (!this.createForm.get('name') || this.createForm.get('name')?.value === '') {
      missingDetails.push('Name');
    }
    if (!this.createForm.get('description') || this.createForm.get('description')?.value === '') {
      missingDetails.push('Description');
    }
    if (!this.createForm.get('summaryDescription') || this.createForm.get('summaryDescription')?.value === '') {
      missingDetails.push('Summary');
    }
    if (!this.createForm.get('categories') || this.createForm.get('categories')?.value === '') {
      missingDetails.push('Categories');
    }

    if (missingDetails.length > 0) {
      alert('Please fill in the following details: ' + missingDetails.join(', '));
      return;
    }
    else {
      this.createClub();
    }
  }

  async checkCookies() {
    // Get all cookies
    const cookies = document.cookie.split('; ');

    // Find the cookie by name
    let accessToken = null;
    let refreshToken = null;
    for (const cookie of cookies) {
        const [name, value] = cookie.split('=');
        if (name === "jwt") {
            accessToken = decodeURIComponent(value);
            break;
        }
    }
    for (const cookie of cookies) {
      const [name, value] = cookie.split('=');
      if (name === "refresh") {
          refreshToken = decodeURIComponent(value);
          break;
      }
  }
    
    if(!accessToken)        //If access token expired
    {
      if(!refreshToken)     //If refresh token expired
      {
        this.router.navigate(["/login"]);
      }

      try {
        const response = await fetch("https://events-system-back.wn.r.appspot.com/api/v1/auth/refresh-token", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.getCookie("refresh")}`
            },
            body: JSON.stringify(FormData)
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const authData = await response.json();
        document.cookie = `jwt=${authData.access_token}; path=/; expires=` + new Date(new Date().getTime() + 15 * 60 * 1000).toUTCString();
        document.cookie = `refresh=${authData.refresh_token}; path=/; expires=` + new Date(new Date().getTime() + 24* 60 * 60 * 1000).toUTCString();
        console.log('Token refresh successful');
        // Handle the response data as needed
      } catch (error) {
          console.error('Error refreshing token');
          // Handle errors appropriately
      }
    }
  }


  getCookie(cookieName: string) {
    const name = cookieName + '=';
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookieArray = decodedCookie.split(';');

    for (let i = 0; i < cookieArray.length; i++) {
        const cookie = cookieArray[i].trim();
        if (cookie.indexOf(name) === 0) {
            return cookie.substring(name.length, cookie.length);
        }
    }
    return null;
}

}
