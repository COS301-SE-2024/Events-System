import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SeriescentercardComponent } from './seriescentercard.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

describe('SeriesCenterCardComponent', () => {
  let component: SeriescentercardComponent;
  let fixture: ComponentFixture<SeriescentercardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, FormsModule, RouterTestingModule, SeriescentercardComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(SeriescentercardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display series details correctly', () => {
    component.seriesId = 'testSeriesId';
    component.imageSource = 'test-image.jpg';
    component.name = 'Test Series';
    fixture.detectChanges();

    const backgroundImageElement = fixture.debugElement.query(By.css('.bg-cover'));
    expect(backgroundImageElement.nativeElement.style.backgroundImage).toContain('test-image.jpg');

    const nameElement = fixture.debugElement.query(By.css('h2'));
    expect(nameElement.nativeElement.textContent).toContain('Test Series');
  });
});
