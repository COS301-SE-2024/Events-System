import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SocialClubComponent } from './socialClub.component';

describe('SocialClubComponent', () => {
  let component: SocialClubComponent;
  let fixture: ComponentFixture<SocialClubComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SocialClubComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SocialClubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
