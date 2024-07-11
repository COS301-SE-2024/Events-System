import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SocialClubListingComponent } from './socialClubListing.component';

describe('SocialClubListingComponent', () => {
  let component: SocialClubListingComponent;
  let fixture: ComponentFixture<SocialClubListingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SocialClubListingComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SocialClubListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
