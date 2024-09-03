import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SearchHostCardComponent } from './searchHostCard.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

describe('SearchHostCardComponent', () => {
  let component: SearchHostCardComponent;
  let fixture: ComponentFixture<SearchHostCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, FormsModule, RouterTestingModule, SearchHostCardComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchHostCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display host details correctly', () => {
    component.hostName = 'John Doe';
    component.hostBio = 'This is a test host bio.';
    component.hostEmail = 'john.doe@example.com';
    component.hostId = 'testHostId';
    fixture.detectChanges();

    const initialsElement = fixture.debugElement.query(By.css('.text-3xl'));
    expect(initialsElement.nativeElement.textContent).toContain(component.getInitials());

    const nameElement = fixture.debugElement.query(By.css('.font-poppins'));
    expect(nameElement.nativeElement.textContent).toContain('John Doe');

    const bioElement = fixture.debugElement.query(By.css('.font-roboto.text-sm'));
    expect(bioElement.nativeElement.textContent).toContain('This is a test host bio.');

    const emailElement = fixture.debugElement.query(By.css('.font-roboto.text-base'));
    expect(emailElement.nativeElement.textContent).toContain('john.doe@example.com');

  });
});
