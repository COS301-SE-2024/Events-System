import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MyseriescardComponent } from './myseriescard.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

describe('MyseriescardComponent', () => {
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

  it('should display series details in alert section', () => {
    component.name = 'Test Series';
    component.seriesId = 'testId';
    fixture.detectChanges();

    const alertElement = fixture.debugElement.query(By.css('div[role="alert"]'));
    expect(alertElement).toBeTruthy();

    const titleElement = alertElement.query(By.css('span'));
    expect(titleElement.nativeElement.textContent).toContain('Test Series');

    const moreDetailsButton = alertElement.query(By.css('button:nth-child(1)'));
    expect(moreDetailsButton.nativeElement.getAttribute('ng-reflect-router-link')).toBe('/series,testId');

    const editButton = alertElement.query(By.css('button:nth-child(2)'));
    expect(editButton.nativeElement.getAttribute('ng-reflect-router-link')).toBe('/updateseries,testId');

    const deleteButton = alertElement.query(By.css('button:nth-child(3)'));
    expect(deleteButton.nativeElement.getAttribute('ng-reflect-router-link')).toBe('/deleteseries,testId');
  });

  it('should display series details in collapse section', () => {
    component.name = 'Test Series';
    component.seriesId = 'testId';
    fixture.detectChanges();

    const collapseElement = fixture.debugElement.query(By.css('.collapse'));
    expect(collapseElement).toBeTruthy();

    const titleElement = collapseElement.query(By.css('.collapse-title'));
    expect(titleElement.nativeElement.textContent).toContain('Test Series');

    const moreDetailsButton = collapseElement.query(By.css('button:nth-child(1)'));
    expect(moreDetailsButton.nativeElement.getAttribute('ng-reflect-router-link')).toBe('/series,testId');

    const editButton = collapseElement.query(By.css('button:nth-child(2)'));
    expect(editButton.nativeElement.getAttribute('ng-reflect-router-link')).toBe('/updateseries,testId');

    const deleteButton = collapseElement.query(By.css('button:nth-child(3)'));
    expect(deleteButton.nativeElement.getAttribute('ng-reflect-router-link')).toBe('/deleteseries,testId');
  });

  it('should display modal with delete confirmation', () => {
    fixture.detectChanges();

    const modalElement = fixture.debugElement.query(By.css('.modal'));
    expect(modalElement).toBeTruthy();

    const modalTitle = modalElement.query(By.css('h3'));
    expect(modalTitle.nativeElement.textContent).toContain('Delete Agriculture Series');

    const modalContent = modalElement.query(By.css('p'));
    expect(modalContent.nativeElement.textContent).toContain('Are you sure you want to delete this Series?');

    const cancelButton = modalElement.query(By.css('.btn-warning'));
    expect(cancelButton.nativeElement.textContent).toContain('Cancel');

    const deleteButton = modalElement.query(By.css('.btn-error'));
    expect(deleteButton.nativeElement.textContent).toContain('Delete my Series');
  });
});
