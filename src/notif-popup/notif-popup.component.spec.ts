import { render, screen, fireEvent } from '@testing-library/angular';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import '@testing-library/jest-dom';
import { NotifPopupComponent } from './notif-popup.component';

describe('NotifPopupComponent', () => {
  beforeEach(async () => {
    await render(NotifPopupComponent, {
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
    expect(NotifPopupComponent).toBeTruthy();
  });

});
