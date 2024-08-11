import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SocialClubCardSkeletonComponent } from './SocialClubCardSkeleton.component';

describe('SocialClubCardSkeletonComponent', () => {
  let component: SocialClubCardSkeletonComponent;
  let fixture: ComponentFixture<SocialClubCardSkeletonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SocialClubCardSkeletonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SocialClubCardSkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
