import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { SearchComponent } from './search.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
describe('SearchComponent', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, RouterTestingModule, SearchComponent, BrowserAnimationsModule],
      schemas: [NO_ERRORS_SCHEMA], // Ignore unknown elements and attributes
      providers: [
        { provide: ActivatedRoute, useValue: { snapshot: { params: {} } } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update search term on input', () => {
    const inputElement = fixture.debugElement.query(By.css('input[placeholder="Search for events, hosts and social clubs..."]')).nativeElement;
    inputElement.value = 'test search';
    inputElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(component.searchTerm).toBe('test search');
  });

  it('should display loading state', () => {
    component.loading = true;
    fixture.detectChanges();

    const ghostCards = fixture.debugElement.queryAll(By.css('app-ghost-search-event-card'));
    expect(ghostCards.length).toBe(9);
  });

  it('should display filtered events', () => {
    component.loading = false;
    component.showEvents = true;
    component.filteredEvents = [
      { eventId: 1, title: 'Event 1', description: 'Description 1', startTime: '10:00', endTime: '12:00', startDate: '2023-01-01', endDate: '2023-01-01', location: 'Location 1', socialClub: 'Club 1' }
    ];
    fixture.detectChanges();

    const eventCards = fixture.debugElement.queryAll(By.css('app-search-event-card'));
    expect(eventCards.length).toBe(1);
  });

  it('should display filtered hosts', () => {
    component.loading = false;
    component.showHosts = true;
    component.filteredHosts = [
      { firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com', employee_picture_link: 'link', employeeDescription: 'Bio', employeeId: 1 }
    ];
    fixture.detectChanges();

    const hostCards = fixture.debugElement.queryAll(By.css('app-search-host-card'));
    expect(hostCards.length).toBe(1);
  });

  it('should display filtered social clubs', () => {
    component.loading = false;
    component.showSocialClubs = true;
    component.filteredSocialClubs = [
      { id: 1, name: 'Club 1', summaryDescription: 'Summary', description: 'Description' }
    ];
    fixture.detectChanges();

    const clubCards = fixture.debugElement.queryAll(By.css('app-search-social-club-card'));
    expect(clubCards.length).toBe(1);
  });
});
