import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class WeatherService {

  constructor(private http: HttpClient) {  }

  send(requestString: string) {
    console.log("requesting weather");
    return this.http.get(requestString);
  }

}
