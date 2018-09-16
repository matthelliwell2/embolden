import {inject, TestBed} from '@angular/core/testing'

import {StitchCentralService} from './stitch-central.service'

describe('StitchCentralService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StitchCentralService]
    });
  });

  it('should be created', inject([StitchCentralService], (service: StitchCentralService) => {
    expect(service).toBeTruthy();
  }));
});
