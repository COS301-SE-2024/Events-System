import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EventsComponent } from './events.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('EventsComponent', () => {
  let component: EventsComponent;
  let fixture: ComponentFixture<EventsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule, BrowserAnimationsModule, EventsComponent],
      schemas: [NO_ERRORS_SCHEMA] // Ignore unknown elements and attributes
    }).compileComponents();

    fixture = TestBed.createComponent(EventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the filter button', () => {
    const filterButton = fixture.debugElement.query(By.css('.btn-primary.drawer-button'));
    expect(filterButton).toBeTruthy();
  });

  it('should display skeleton screen when loading', () => {
    component.isLoading = true;
    fixture.detectChanges();
    const skeletonScreen = fixture.debugElement.query(By.css('app-ghost-event-card'));
    expect(skeletonScreen).toBeTruthy();
  });


  it('should toggle drawer when filter button is clicked', () => {
    const drawerToggle = fixture.debugElement.query(By.css('#my-drawer-3')).nativeElement;
    const filterButton = fixture.debugElement.query(By.css('.btn-primary.drawer-button')).nativeElement;
    filterButton.click();
    fixture.detectChanges();
    expect(drawerToggle.checked).toBe(true);
  });
  
  it('should call filterEvents when a club checkbox is clicked', () => {
    component.socialClubs = [{ name: 'Club 1' }, { name: 'Club 2' }];
    component.otherCheckboxes = [false, false];
    fixture.detectChanges();
    const clubCheckbox = fixture.debugElement.queryAll(By.css('.menu input[type="checkbox"]'))[1].nativeElement;
    clubCheckbox.click();
    fixture.detectChanges();
    expect(component.otherCheckboxes[0]).toBe(true);
  });
  
  it('should update search term when input is provided', () => {
    const searchInput = fixture.debugElement.query(By.css('input[placeholder="Search by title"]')).nativeElement;
    searchInput.value = 'Event';
    searchInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(component.searchTerm).toBe('Event');
  });
  
  it('should update search location when input is provided', () => {
    const locationInput = fixture.debugElement.query(By.css('input[placeholder="Search by Location"]')).nativeElement;
    locationInput.value = 'Location';
    locationInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(component.searchLocation).toBe('Location');
  });
  
  
  
  it('should close drawer when save button is clicked', () => {
    const saveButton = fixture.debugElement.query(By.css('button.btn-primary')).nativeElement;
    saveButton.click();
    fixture.detectChanges();
    const drawerToggle = fixture.debugElement.query(By.css('#my-drawer-3')).nativeElement;
    expect(drawerToggle.checked).toBe(false);
  });
});
