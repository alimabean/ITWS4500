import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class WeatherJsonService {
	weatherUrl = 'api.openweathermap.org/data/2.5/weather?lat=35&lon=139';

	getWeather() {
		return this.http.get(this.weatherUrl);
	}

  constructor(private http: HttpClient) { }
}
