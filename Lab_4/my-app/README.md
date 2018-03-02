Lab 4:

Created with Angular 2 (5):

CSS mixins can be viewed in app.component.css:
	I set the max width for the component based on the screen size

The main code portion of this lab can be found in folder: weather-display

weather-display.component.ts - 
	This includes the ajax call (using angular's built in HttpClient) to retrieve the weather based on the user's current location.

weather-display.component.html -
	displays weather when the `weather` value is not null: when the http request is complete and weather is set to the returned json object.

Bootstrap is used in the app.component.html to set the appropriate widths based on device type. (accounting for iPhone 6-8, iPad 3-Pro, and retina display macbook(pro)s)