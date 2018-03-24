import { Component, OnInit, ViewChild } from '@angular/core';
import { WeatherService } from '../service/weather.service';
import { } from '@types/googlemaps';

@Component({
  selector: 'app-weather-map',
  templateUrl: './weather-map.component.html',
  styleUrls: ['./weather-map.component.css']
})
export class WeatherMapComponent implements OnInit {
  @ViewChild('map') mapElement: any;
  map: google.maps.Map;
  weatherURL = 'http://api.openweathermap.org/data/2.5/box/city?bbox=';
  weatherAPI = "d5041a6dc019d7e004bab2920be96d54";
  geoJSON;

  options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
  }

  constructor(private service: WeatherService) { }

  ngOnInit() {
    this.getPosition();
  }

  // Retrieve the geolocation of the user and set the map to their location if provided
  // Otherwise default to lat, lon: 50, 50
  getPosition() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.setMap(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          this.setMap(50, 50);
        },
        this.options);
    }
    else {
      this.setMap(50, 50);
    }
  }

  // Initialize the google map with a set of lat, lon
  setMap(lat, lon) {
    this.map = new google.maps.Map(this.mapElement.nativeElement, {
      center: new google.maps.LatLng(lat, lon),
      zoom: 5,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    var infoWindow = new google.maps.InfoWindow();
    
    this.map.data.addListener('click', (event) => {
      this.addInfoWindow(event, infoWindow);
    });

    google.maps.event.addListener(this.map, 'idle', () => {
      let bounds = this.map.getBounds();
      let NE = bounds.getNorthEast();
      let SW = bounds.getSouthWest();
      this.getWeather(NE.lat(), NE.lng(), SW.lat(), SW.lng());
    });
  }

  // Outline of the weather infowindow
  addInfoWindow(event, infoWindow) {
    infoWindow.setContent(
    "<img src=" + event.feature.getProperty("icon") + ">"
     + "<br /><strong>" + event.feature.getProperty("city") + "</strong>"
     + "<br />" + event.feature.getProperty("temperature") + "&deg;C"
     + "<br />" + event.feature.getProperty("weather")
     );
    infoWindow.setOptions({
        position:{
          lat: event.latLng.lat(),
          lng: event.latLng.lng()
        },
        pixelOffset: {
          width: 0,
          height: -15
        }
      });
    infoWindow.open(this.map);
  }

  // Boundaries of the current map view
  getCoords() {
    console.log('getting coords');
    let bounds = this.map.getBounds();
    let NE = bounds.getNorthEast();
    let SW = bounds.getSouthWest();
    this.getWeather(NE.lat(), NE.lng(), SW.lat(), SW.lng());
  }

  // Create the request string and utilize our service to make a get request
  // Subscribe to content and pass along json
  getWeather(northLat, eastLng, southLat, westLng) {
    var requestString = "http://api.openweathermap.org/data/2.5/box/city?bbox="
                        + westLng + "," + northLat + "," //left top
                        + eastLng + "," + southLat + "," //right bottom
                        + this.map.getZoom()
                        + "&cluster=yes&format=json"
                        + "&APPID=" + this.weatherAPI;

    this.service.send(requestString).subscribe(res => this.processResults(res));
  };

  // Iterate through the cities in view for their weather
  processResults(weatherInfo) {
    if (weatherInfo.list.length > 0) {
      this.resetData();
      for (let i = 0; i < weatherInfo.list.length; i++) {
        this.geoJSON.features.push(this.jsonToGeoJson(weatherInfo.list[i]));
      }
      this.map.data.addGeoJson(this.geoJSON);
    }
  }

  // Extract the features we are using and rename for ease of use
  jsonToGeoJson(weatherItem) {
    var feature = {
      type: "Feature",
      properties: {
        city: weatherItem.name,
        weather: weatherItem.weather[0].main,
        temperature: weatherItem.main.temp,
        icon: "http://openweathermap.org/img/w/"
              + weatherItem.weather[0].icon  + ".png",
      },
      geometry: {
        type: "Point",
        coordinates: [weatherItem.coord.Lon, weatherItem.coord.Lat]
      }
    };

    this.map.data.setStyle((feature) => {
      return {
        icon: {
          url: feature.getProperty('icon'),
          anchor: new google.maps.Point(25, 25)
        }
      };
    });

    return feature;
  }

  // Remove infoWindows not in view
  resetData() {
    this.geoJSON = {
      type: "FeatureCollection",
      features: []
    };
    this.map.data.forEach((feature) => {
      this.map.data.remove(feature);
    });
  }

}
