import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SocialClubListingCardComponent } from './socialClubListingCard.component';

describe('SocialClubListingCardComponent', () => {
  let component: SocialClubListingCardComponent;
  let fixture: ComponentFixture<SocialClubListingCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SocialClubListingCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SocialClubListingCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
