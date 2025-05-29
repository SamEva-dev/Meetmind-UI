import { TestBed } from '@angular/core/testing';

import { DashboardSignalRService } from './dashboard-signal-r.service';

describe('DashboardSignalRService', () => {
  let service: DashboardSignalRService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DashboardSignalRService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
