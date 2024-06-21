import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeEventCardComponent } from './HomeEventCard.component';

describe('HomeEventCardComponent', () => {
  let component: HomeEventCardComponent;
  let fixture: ComponentFixture<HomeEventCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeEventCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeEventCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
