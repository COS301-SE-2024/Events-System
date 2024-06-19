import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MyEventsCardSkeletonComponent } from './MyEventsCardSkeleton.component';

describe('MyEventsCardSkeletonComponent', () => {
  let component: MyEventsCardSkeletonComponent;
  let fixture: ComponentFixture<MyEventsCardSkeletonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyEventsCardSkeletonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MyEventsCardSkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
