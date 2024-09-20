import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'; 
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { RandomImageServiceService } from 'src/app/random-image-service.service';

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
  @ViewChild('summarydescriptionInput') summarydescriptionInput!: ElementRef;
  @ViewChild('descriptionInput') descriptionInput!: ElementRef;
  createForm: FormGroup;
  hostID: any;
  imageSource: string;
  currentStep = 1;
  isPictureEmpty = false; isNameEmpty = false; isDescriptionEmpty = false; isCategoriesEmpty = false; isSummaryEmpty = false;
  showsuccessToast = false;
  showfailToast = false;
  isAPILoading = false;
  generatedDescriptions: string[] = [];
  generatedSummaryDescriptions: any[] = [];
  isLoading = false;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private http: HttpClient,
    private randomImageService: RandomImageServiceService
  )
  {
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
              name: this.createForm.get('name')?.value,
              description: this.createForm.get('description')?.value,
              pictureLink: this.createForm.get('pictureLink')?.value,
              summaryDescription: this.createForm.get('summaryDescription')?.value,
              categories: [this.createForm.get('categories')?.value]
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
isSummaryDescriptionSelected = false;
selectedSummaryDescription = '';
selectSummaryDescription(description: string) {
  this.summarydescriptionInput.nativeElement.value = description;
  this.selectedSummaryDescription = description;
  this.isSummaryDescriptionSelected = true;
}


clearSummaryDescription() {
  this.selectedSummaryDescription = '';
  this.isSummaryDescriptionSelected = false;
  this.summarydescriptionInput.nativeElement.value = "";
}

isDescriptionSelected = false;
selectedDescription = '';
selectDescription(description: string) {
  this.descriptionInput.nativeElement.value = description
  this.selectedDescription = description;
  this.isDescriptionSelected = true;
}


clearDescription() {
  this.selectedDescription = '';
  this.isDescriptionSelected = false;
  this.descriptionInput.nativeElement.value = "";

}

suggestDescriptions() {
  console.log(this.createForm.get('name')?.value);
  const name = this.createForm.get('name')?.value;
  if (!name) {
    window.alert("event title is required to generate description suggestions");
    return;
  }
  this.isLoading = true; // Set loading state to true
  fetch(`https://safe-dawn-94912-2365567c9819.herokuapp.com/generate-s-descriptions?social_club_title="${name}"`, {
    method: 'POST',
  })
  .then(response => response.json())
  .then(data => {
    console.log("descriptions", data);
    this.isLoading = false; // Set loading state to false

    if (Array.isArray(data.descriptions) && data.descriptions.length > 0) {
      const concatenatedDescriptions = data.descriptions[0];
      // Split the concatenated descriptions into an array
      const descriptions = concatenatedDescriptions.split(/\d\.\s/).filter(Boolean);
      this.generatedDescriptions = [];
      
      // Add each description sequentially with a delay
      descriptions.forEach((description: any, index: any) => {
        setTimeout(() => {
          this.generatedDescriptions.push(description);
          // Trigger change detection if necessary
        }, index * 500); // Adjust the delay (5000ms = 5s) as needed
      });
    } else {
      console.error('Error: descriptions is not in the expected format');
    }
  })
  .catch(error => {
    console.error('Error fetching suggested descriptions:', error);
    this.isLoading = false;
  });
}

suggestSummaryDescriptions() {
  console.log(this.createForm.get('name')?.value);
  const name = this.createForm.get('name')?.value;
  if (!name) {
    window.alert("event title is required to generate description suggestions");
    return;
  }
  this.isLoading = true; // Set loading state to true
  fetch(`https://safe-dawn-94912-2365567c9819.herokuapp.com/generate-ss-descriptions?social_club_title="${name}"`, {
    method: 'POST',
  })
  .then(response => response.json())
  .then(data => {
    console.log("descriptions", data);
    this.isLoading = false; // Set loading state to false

    if (Array.isArray(data.descriptions) && data.descriptions.length > 0) {
      const concatenatedDescriptions = data.descriptions[0];
      // Split the concatenated descriptions into an array
      const descriptions = concatenatedDescriptions.split(/\d\.\s/).filter(Boolean);
      this.generatedDescriptions = [];
      
      // Add each description sequentially with a delay
      descriptions.forEach((description: any, index: any) => {
        setTimeout(() => {
          this.generatedSummaryDescriptions.push(description);
          // Trigger change detection if necessary
        }, index * 500); // Adjust the delay (5000ms = 5s) as needed
      });
    } else {
      console.error('Error: descriptions is not in the expected format');
    }
  })
  .catch(error => {
    console.error('Error fetching suggested descriptions:', error);
    this.isLoading = false;
  });
}
}
