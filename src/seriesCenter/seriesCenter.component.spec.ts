import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SeriesCenterComponent } from './seriesCenter.component';

describe('SeriesCenterComponent', () => {
  let component: SeriesCenterComponent;
  let fixture: ComponentFixture<SeriesCenterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeriesCenterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SeriesCenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
