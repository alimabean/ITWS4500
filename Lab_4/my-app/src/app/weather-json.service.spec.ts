import { TestBed, inject } from '@angular/core/testing';

import { WeatherJsonService } from './weather-json.service';

describe('WeatherJsonService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WeatherJsonService]
    });
  });

  it('should be created', inject([WeatherJsonService], (service: WeatherJsonService) => {
    expect(service).toBeTruthy();
  }));
});
