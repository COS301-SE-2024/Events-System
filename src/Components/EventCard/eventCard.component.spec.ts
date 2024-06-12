import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventCardComponent } from './eventCard.component';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('EventComponent', () => {
  let component: EventCardComponent;
  let fixture: ComponentFixture<EventCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EventCardComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ id: 'testId' }) // Add your own mock values here
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EventCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});