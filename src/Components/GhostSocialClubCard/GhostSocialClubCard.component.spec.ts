import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GhostSocialClubCardComponent } from './GhostSocialClubCard.component';

describe('GhostSocialClubCardComponent', () => {
  let component: GhostSocialClubCardComponent;
  let fixture: ComponentFixture<GhostSocialClubCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GhostSocialClubCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GhostSocialClubCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
