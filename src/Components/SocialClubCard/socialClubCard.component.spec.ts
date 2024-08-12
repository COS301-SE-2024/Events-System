import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SocialClubCardComponent } from './socialClubCard.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

describe('SocialClubCardComponent', () => {
  let component: SocialClubCardComponent;
  let fixture: ComponentFixture<SocialClubCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, FormsModule, RouterTestingModule, SocialClubCardComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(SocialClubCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display social club details correctly', () => {
    component.socialClubID = 'testSocialClubID';
    component.socialClubName = 'Test Social Club';
    component.socialClubCreator = 'John Doe';
    fixture.detectChanges();

    const imgElement = fixture.debugElement.query(By.css('img'));
    expect(imgElement.nativeElement.src).toContain('assets/pexels-rahulp9800-1652361.jpg');

    const nameElement = fixture.debugElement.query(By.css('h2.font-semibold'));
    expect(nameElement.nativeElement.textContent).toContain('Test Social Club');

    const creatorElement = fixture.debugElement.query(By.css('h2:not(.font-semibold)'));
    expect(creatorElement.nativeElement.textContent).toContain('John Doe');
  });
});
