import { render, screen, fireEvent } from '@testing-library/angular';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import '@testing-library/jest-dom';
import { HostCheckinComponent } from './host-checkin.component';

describe('HostCheckinComponent', () => {
  beforeEach(async () => {
    await render(HostCheckinComponent, {
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
});