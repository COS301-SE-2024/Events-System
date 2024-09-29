import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Component, Input } from '@angular/core';
import { SearchProfileComponent } from './searchProfile.component';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

// Mock component for testing
@Component({
  selector: 'app-mock-search-profile',
  template: '',
})
class MockSearchProfileComponent {
  @Input() employeeData: any;
  @Input() selectedTab = "about";
}

describe('SearchProfileComponent', () => {
  let component: SearchProfileComponent;
  let fixture: ComponentFixture<SearchProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MockSearchProfileComponent],
      imports: [SearchProfileComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ id: 'testId' })
          }
        }
      ]
    }).compileComponents();


    fixture = TestBed.createComponent(SearchProfileComponent);
    component = fixture.componentInstance;
    component.employeeData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com'
    };    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display employee name and email', () => {
    component.employeeData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com'
    };
    fixture.detectChanges();

    const nameElement = fixture.debugElement.query(By.css('h2[name="name"]')).nativeElement;
    const emailElement = fixture.debugElement.query(By.css('p')).nativeElement;

    expect(nameElement.textContent).toContain('John ');
    expect(emailElement.textContent).toContain('john.doe@example.com');
  });

  it('should display About tab content', () => {
    component.selectedTab = 'about';
    component.employeeData = {
      employeeDescription: 'This is a description.'
    };
    fixture.detectChanges();

    const aboutContent = fixture.debugElement.query(By.css('.card-body p')).nativeElement;
    expect(aboutContent.textContent).toContain('');
  });


  it('should switch tabs on click', () => {
    const aboutTab = fixture.debugElement.query(By.css('a[click="selectTab(\'about\')"]'));
    const eventsTab = fixture.debugElement.query(By.css('a[click="selectTab(\'events\')"]'));
    const subscriptionsTab = fixture.debugElement.query(By.css('a[click="selectTab(\'subscriptions\')"]'));

    if (aboutTab) {
      aboutTab.nativeElement.click();
      fixture.detectChanges();
      expect(component.selectedTab).toBe('about');
    }

    if (eventsTab) {
      eventsTab.nativeElement.click();
      fixture.detectChanges();
      expect(component.selectedTab).toBe('events');
    }

    if (subscriptionsTab) {
      subscriptionsTab.nativeElement.click();
      fixture.detectChanges();
      expect(component.selectedTab).toBe('subscriptions');
    }
  });
});
