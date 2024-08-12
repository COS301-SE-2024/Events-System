import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SeriesCenterComponent } from './seriesCenter.component';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

// Mock component for testing
@Component({
  selector: 'app-seriescentercard',
  template: '<div class="series-center-card"></div>',
})
class MockSeriesCenterCardComponent {
  @Input() seriesId!: string;
  @Input() name!: string;
}

describe('SeriesCenterComponent', () => {
  let component: SeriesCenterComponent;
  let fixture: ComponentFixture<SeriesCenterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        MockSeriesCenterCardComponent,
      ],
      imports: [FormsModule, SeriesCenterComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ id: 'test-id' }),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SeriesCenterComponent);
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

  it('should display series cards when filteredEvents is populated', () => {
    component.filteredEvents = [
      { seriesId: '1', name: 'Series 1' },
      { seriesId: '2', name: 'Series 2' },
    ];
    fixture.detectChanges();

    const seriesCards = fixture.debugElement.queryAll(By.css('app-seriescentercard'));
    expect(seriesCards.length).toBe(2);
  });

  it('should display the filter input', () => {
    const filterInput = fixture.debugElement.query(By.css('input[type="text"]'));
    expect(filterInput).toBeTruthy();
  });

  it('should display the cancel and save buttons', () => {
    const cancelButton = fixture.debugElement.query(By.css('.btn-outline'));
    const saveButton = fixture.debugElement.query(By.css('.btn-outline.btn-primary'));
    expect(cancelButton).toBeTruthy();
    expect(saveButton).toBeTruthy();
  });

  it('should close the drawer when cancel button is clicked', () => {
    const drawerToggle = fixture.debugElement.query(By.css('#my-drawer-4')).nativeElement;
    drawerToggle.checked = true;
    fixture.detectChanges();

    const cancelButton = fixture.debugElement.query(By.css('.btn-outline'));
    cancelButton.triggerEventHandler('click', null);
    fixture.detectChanges();

    expect(drawerToggle.checked).toBe(false);
  });

  it('should close the drawer when save button is clicked', () => {
    const drawerToggle = fixture.debugElement.query(By.css('#my-drawer-4')).nativeElement;
    drawerToggle.checked = true;
    fixture.detectChanges();

    const saveButton = fixture.debugElement.query(By.css('.btn-outline.btn-primary'));
    saveButton.triggerEventHandler('click', null);
    fixture.detectChanges();

    expect(drawerToggle.checked).toBe(false);
  });
});
