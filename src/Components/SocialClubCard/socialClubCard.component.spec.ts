import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SocialClubCardComponent } from './socialClubCard.component';

describe('SocialClubCardComponent', () => {
  let component: SocialClubCardComponent;
  let fixture: ComponentFixture<SocialClubCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SocialClubCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SocialClubCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
