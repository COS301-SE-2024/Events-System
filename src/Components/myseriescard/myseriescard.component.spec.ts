import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MyseriescardComponent } from './myseriescard.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

describe('MySeriesCardComponent', () => {
  let component: MyseriescardComponent;
  let fixture: ComponentFixture<MyseriescardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, FormsModule, RouterTestingModule, MyseriescardComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(MyseriescardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display series details', () => {
    component.name = 'Test Series';
    component.description = 'This is a test series description';
    component.imageSource = 'test-image.jpg';
    component.seriesId = 'testId';
    fixture.detectChanges();

    const titleElement = fixture.debugElement.query(By.css('.font-karla'));
    expect(titleElement.nativeElement.textContent).toContain('Test Series');

    const descriptionElement = fixture.debugElement.query(By.css('.font-roboto'));
    expect(descriptionElement.nativeElement.textContent).toContain('This is a test series description');

    const imageElement = fixture.debugElement.query(By.css('img'));
    expect(imageElement.nativeElement.src).toContain('test-image.jpg');
  });

  it('should have correct router links', () => {
    component.seriesId = 'testId';
    fixture.detectChanges();

    const buttons = fixture.debugElement.queryAll(By.css('button'));
    expect(buttons.length).toBe(3);

    const previewButton = buttons[0];
    expect(previewButton.nativeElement.getAttribute('ng-reflect-router-link')).toBe('/series,testId');

    const editButton = buttons[1];
    expect(editButton.nativeElement.getAttribute('ng-reflect-router-link')).toBe('/updateseries,testId');

    const deleteButton = buttons[2];
    expect(deleteButton.nativeElement.getAttribute('ng-reflect-router-link')).toBe('/deleteseries,testId');
  });
});