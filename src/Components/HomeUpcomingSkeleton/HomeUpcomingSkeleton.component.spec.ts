import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeUpcomingSkeletonComponent } from './HomeUpcomingSkeleton.component';

describe('HomeUpcomingSkeletonComponent', () => {
  let component: HomeUpcomingSkeletonComponent;
  let fixture: ComponentFixture<HomeUpcomingSkeletonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeUpcomingSkeletonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeUpcomingSkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
