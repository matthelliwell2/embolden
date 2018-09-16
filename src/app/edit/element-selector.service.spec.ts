import {inject, TestBed} from '@angular/core/testing'

import {ElementSelectorService} from './element-selector.service'

describe('ElementSelectorService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ElementSelectorService]
    });
  });

  it('should be created', inject([ElementSelectorService], (service: ElementSelectorService) => {
    expect(service).toBeTruthy();
  }));
});
