import { render, screen, fireEvent } from '@testing-library/angular';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import '@testing-library/jest-dom';
import { NotificationsComponent } from './notifications.component';

describe('NotificationsComponent', () => {
  beforeEach(async () => {
    await render(NotificationsComponent, {
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ id: 'testId' })
          }
        }
      ]
    });
  });

  it('should create', () => {
    expect(NotificationsComponent).toBeTruthy();
  });

});
