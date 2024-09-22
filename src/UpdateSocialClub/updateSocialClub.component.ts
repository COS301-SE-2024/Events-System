import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'; 
import { HttpClientModule, HttpClient  } from '@angular/common/http';
import { RandomImageServiceService } from 'src/app/random-image-service.service';
import { DomSanitizer } from '@angular/platform-browser';
import { SanitizePipe } from 'src/app/sanitization.pipe';
@Component({
  selector: 'app-update-social-club',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule, RouterModule],
  templateUrl: './updateSocialClub.component.html',
  styleUrl: './updateSocialClub.component.css',
})

export class UpdateSocialClubComponent implements OnInit{
  clubID = '';
  imageSource: string;
  updateForm: FormGroup;
  isAPILoading = false;
  showsuccessToast = false;
  showfailToast = false;
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

    this.updateForm = this.fb.group({
      name: [],
      description: [],
      pictureLink: [],
      summaryDescription: [],
      categories: []
    });
    this.imageSource = '';
  }

  ngOnInit(): void{
    this.isAPILoading = true;
    this.imageSource = this.randomImageService.getRandomImageSource();

    this.route.params.subscribe(params => {   // Get the event ID from the URL
      this.clubID = params['id'];

      try {
        fetch('https://events-system-back.wn.r.appspot.com/api/socialclubs/' + this.clubID, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          }
        })
        .then(response => response.json())
        .then(data => {
          // Show the success toast
          this.updateForm.setValue({
            name: data.name,
            description: data.description,
            pictureLink: data.pictureLink || "assets/pexels-rahulp9800-1652361.jpg",
            summaryDescription: data.summaryDescription,
            categories: data.categories
          });

          this.isAPILoading = false;
        })
        .catch((error) => {
          this.showfailToast = true;
          this.isAPILoading = false;

          setTimeout(() => {
            this.showfailToast = false;
          }, 10000);
        });
      }
      catch (error)
      {
        this.showfailToast = true;
        this.isAPILoading = false;

        setTimeout(() => {
          this.showfailToast = false;
        }, 10000);
      }
    });
  }
  
  async updateClub() {
    this.isAPILoading = true;

      this.route.params.subscribe(params => {   // Get the event ID from the URL
    
        this.clubID = params['id'];
        const formData = {
          name: this.sanitizePipe.transform(this.updateForm.get('name')?.value),
          description: this.sanitizePipe.transform(this.updateForm.get('description')?.value),
          pictureLink: this.sanitizePipe.transform(this.updateForm.get('pictureLink')?.value),
          summaryDescription: this.sanitizePipe.transform(this.updateForm.get('summaryDescription')?.value),
          categories: [this.sanitizePipe.transform(this.updateForm.get('categories')?.value)]
        };
        
        try{
          fetch('https://events-system-back.wn.r.appspot.com/api/socialclubs/' + this.clubID, {
            method: 'PATCH',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
          })
          .then(() => {
            // Show the success toast
            this.showsuccessToast = true;
            this.isAPILoading = false;

            setTimeout(() => {
              this.showsuccessToast = false;
              window.history.back();
              // this.router.navigate(['/socialclublisting']);
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
        catch (error) {
          this.showfailToast = true;
          this.isAPILoading = false;

          setTimeout(() => {
            this.showfailToast = false;
          }, 10000);
        }
      }
    );
  }
}
