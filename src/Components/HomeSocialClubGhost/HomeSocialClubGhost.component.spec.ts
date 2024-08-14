import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeSocialClubGhostComponent } from './HomeSocialClubGhost.component';

describe('HomeSocialClubGhostComponent', () => {
  let component: HomeSocialClubGhostComponent;
  let fixture: ComponentFixture<HomeSocialClubGhostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeSocialClubGhostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeSocialClubGhostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
