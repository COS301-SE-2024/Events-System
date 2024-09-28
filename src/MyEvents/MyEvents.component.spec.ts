import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { By } from '@angular/platform-browser';

import { of } from 'rxjs';
import { Component, Input } from '@angular/core';
import { MyEventsComponent } from './MyEvents.component';
import { RouterTestingModule } from '@angular/router/testing';

// Mock components
@Component({
  selector: 'app-ghost-social-club-card',
  template: '<div>Skeleton</div>',
})
class MockMyEventsCardSkeletonComponent {}

@Component({
  selector: 'app-my-events-card',
  template: '<div>Event Card</div>',
})
class MockMyEventsCardComponent {
  @Input() eventID!: string;
  @Input() ID!: string;
  @Input() eventString!: string;
  @Input() eventTitle!: string;
}

describe('MyEventsComponent', () => {
  let component: MyEventsComponent;
  let fixture: ComponentFixture<MyEventsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, MyEventsComponent],
      declarations: [
        MockMyEventsCardSkeletonComponent,
        MockMyEventsCardComponent,
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ id: 'testId' }),
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyEventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display skeletons when loading', () => {
    component.isLoading = true;
    fixture.detectChanges();
    const skeletons = fixture.debugElement.queryAll(By.css('app-ghost-social-club-card'));
    expect(skeletons.length).toBe(9);
  });

  it('should display event cards when not loading', () => {
    component.isLoading = false;
    component.events = [
      { eventId: '1', title: 'Event 1' },
      { eventId: '2', title: 'Event 2' },
    ];
    fixture.detectChanges();
    const eventCards = fixture.debugElement.queryAll(By.css('app-my-events-card'));
    expect(eventCards.length).toBe(2);
  });

  it('should have a create event button', () => {
    const createEventButton = fixture.debugElement.query(By.css('button[routerLink="/createevent"]'));
    expect(createEventButton).toBeTruthy();
  });
});
