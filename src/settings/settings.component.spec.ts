import { TestBed } from '@angular/core/testing';
import { SettingsComponent } from './settings.component';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('SettingsComponent', () => {
  let component: SettingsComponent;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ id: 'testId' }) // Add your own mock values here
          }
        }
      ]
    });

    const fixture = TestBed.createComponent(SettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});