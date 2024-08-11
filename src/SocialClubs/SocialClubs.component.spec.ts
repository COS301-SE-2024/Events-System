import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SocialClubsComponent } from './SocialClubs.component';

describe('SocialClubsComponent', () => {
  let component: SocialClubsComponent;
  let fixture: ComponentFixture<SocialClubsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SocialClubsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SocialClubsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
