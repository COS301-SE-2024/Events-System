import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeFeaturedEventComponent } from './HomeFeaturedEvent.component';

describe('HomeFeaturedEventComponent', () => {
  let component: HomeFeaturedEventComponent;
  let fixture: ComponentFixture<HomeFeaturedEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeFeaturedEventComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeFeaturedEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
