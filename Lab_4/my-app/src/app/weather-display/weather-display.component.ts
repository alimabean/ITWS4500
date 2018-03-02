import { Component, OnInit } from '@angular/core';
import { WeatherJsonService } from '../weather-json.service';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map'
 
@Component({
  selector: 'app-weather-display',
  templateUrl: './weather-display.component.html',
  styleUrls: ['./weather-display.component.css']
})

export class WeatherDisplayComponent implements OnInit {
	weatherURL = 'http://api.openweathermap.org/data/2.5/weather?'; //lat=35&lon=139';
	weatherAPI = "d5041a6dc019d7e004bab2920be96d54";
	weather = null;
	currLocation = null;

	// Http call to retrieve weather absed on user's geolocation
	getWeather() {
	 this.http.get(
		this.weatherURL +
		'lat=' + this.currLocation[0] +
		'&lon=' + this.currLocation[1] +
		"&cluster=yes&format=json" +
	  "&APPID=" +
	  this.weatherAPI)
		// callBack function to set the weather
		.subscribe(res => {this.weather = res; console.log(this.weather)});
	}

	// Retrieve user's geolocation using html5's built in geolocation service
	getLocation() {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition((position) => {
				this.currLocation = [position.coords.latitude, position.coords.longitude];
				this.getWeather();
			});
		}
	}

  constructor(private http: HttpClient) { }

  ngOnInit() {  	
  	this.getLocation();
  }

}
