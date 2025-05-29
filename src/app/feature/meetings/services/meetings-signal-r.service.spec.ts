import { TestBed } from '@angular/core/testing';

import { MeetingsSignalRService } from './meetings-signal-r.service';

describe('MeetingsSignalRService', () => {
  let service: MeetingsSignalRService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MeetingsSignalRService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
