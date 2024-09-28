import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
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
  @ViewChild('summarydescriptionInput') summarydescriptionInput!: ElementRef;
  @ViewChild('descriptionInput') descriptionInput!: ElementRef;
  createForm: FormGroup;
  hostID: any;
  imageSource: string;
  currentStep = 1;
  isPictureEmpty = false; isNameEmpty = false; isDescriptionEmpty = false; isSummaryEmpty = false;
  showsuccessToast = false;
  showfailToast = false;
  isAPILoading = false;
  generatedDescriptions: string[] = [];
  generatedSummaryDescriptions: any[] = [];
  isLoading = false;
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
    this.imageSource = this.randomImageService.getRandomImageSource();
  }

  createClub() {
    if (this.createForm.valid) {
      this.isAPILoading = true;
      this.hostID = Number(localStorage.getItem('ID'));
      const formData = {
        ownerID: this.hostID, // Assuming hostID is already available
        name: this.sanitizePipe.transform(this.createForm.get('name')?.value),
        description: this.sanitizePipe.transform(this.createForm.get('description')?.value),
        pictureLink: "pictureLink",
        summaryDescription: this.sanitizePipe.transform(this.createForm.get('summaryDescription')?.value),
        categories: ["Literature"]      };
      console
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
      });
    }
  }

  nextStep() {
    if (!this.createForm.get('pictureLink') || this.createForm.get('pictureLink')?.value === '') {
      this.isPictureEmpty = true;
      return;
    }
    if (this.currentStep < 3) {
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
      this.isNameEmpty = false;
      ++this.currentStep;
  }
  nextStep2() {
    if (!this.createForm.get('summaryDescription') || this.createForm.get('summaryDescription')?.value === '' || !this.createForm.get('description') || this.createForm.get('description')?.value === '' ) {
      this.isSummaryEmpty = true;
      this.isDescriptionEmpty = true;
      return;
    }
    if (this.currentStep < 3) {
      this.isSummaryEmpty = false;
      this.isDescriptionEmpty = false;
      ++this.currentStep;
    }
  }

  previousStep() {
    if (this.currentStep > 1) {
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

    if (missingDetails.length > 0) {
      alert('Please fill in the following details: ' + missingDetails.join(', '));
      return;
    }
    else {
      this.createClub();
    }
  }

isSummaryDescriptionSelected = false;
selectedSummaryDescription = '';
selectSummaryDescription(description: string) {
  this.summarydescriptionInput.nativeElement.value = description;
  this.selectedSummaryDescription = description;
  this.isSummaryDescriptionSelected = true;
  this.createForm.get('summaryDescription')?.setValue(description); // Update form control
}


clearSummaryDescription() {
  this.selectedSummaryDescription = '';
  this.isSummaryDescriptionSelected = false;
  this.summarydescriptionInput.nativeElement.value = "";
  this.createForm.get('summaryDescription')?.setValue(''); // Update form control
}

isDescriptionSelected = false;
selectedDescription = '';
selectDescription(description: string) {
  this.descriptionInput.nativeElement.value = description
  this.selectedDescription = description;
  this.isDescriptionSelected = true;
  this.createForm.get('description')?.setValue(description); // Update form control

}


clearDescription() {
  this.selectedDescription = '';
  this.isDescriptionSelected = false;
  this.descriptionInput.nativeElement.value = "";
  this.createForm.get('description')?.setValue(''); // Update form control

}

suggestDescriptions() {
  console.log(this.createForm.get('name')?.value);
  const name = this.createForm.get('name')?.value;
  if (!name) {
    window.alert("event title is required to generate description suggestions");
    return;
  }
  this.isLoading = true; // Set loading state to true
  fetch(` https://capstone-middleware-178c57c6a187.herokuapp.com/generate-s-descriptions?social_club_title="${name}"`, {
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
  fetch(` https://capstone-middleware-178c57c6a187.herokuapp.com/generate-ss-descriptions?social_club_title="${name}"`, {
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