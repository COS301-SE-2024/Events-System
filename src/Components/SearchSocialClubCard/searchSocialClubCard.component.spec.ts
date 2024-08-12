import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SearchSocialClubCardComponent } from './searchSocialClubCard.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

describe('SearchSocialClubCardComponent', () => {
  let component: SearchSocialClubCardComponent;
  let fixture: ComponentFixture<SearchSocialClubCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, FormsModule, SearchSocialClubCardComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchSocialClubCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display club details correctly', () => {
    component.imageSource = 'test-image.jpg';
    component.clubName = 'Test Club';
    component.clubDescription = 'This is a test club description.';
    fixture.detectChanges();

    const imgElement = fixture.debugElement.query(By.css('img'));
    expect(imgElement.nativeElement.src).toContain('test-image.jpg');

    const nameElement = fixture.debugElement.query(By.css('.font-karla'));
    expect(nameElement.nativeElement.textContent).toContain('Test Club');

    const descriptionElement = fixture.debugElement.query(By.css('.font-roboto.text-primary'));
    expect(descriptionElement.nativeElement.textContent).toContain('This is a test club description.');

    const joinButton = fixture.debugElement.query(By.css('button:first-of-type'));
    expect(joinButton.nativeElement.textContent).toContain('Join Club');

    const leaveButton = fixture.debugElement.query(By.css('button:last-of-type'));
    expect(leaveButton.nativeElement.textContent).toContain('Leave Club');
  });
});
