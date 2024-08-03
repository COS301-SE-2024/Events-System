import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SeriescentercardComponent } from './seriescentercard.component';

describe('SeriescentercardComponent', () => {
  let component: SeriescentercardComponent;
  let fixture: ComponentFixture<SeriescentercardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeriescentercardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SeriescentercardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
