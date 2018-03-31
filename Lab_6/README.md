Lab 6: Twitter ETL WebApp | Node 8.9.4

Backend: port 5000 | Express | Socket.io

Frontend: port 3000 | Angular 2 | Angular Material

Downloading file in Backend vs Frontend?: (I went with client-side downloading)

Backend:
- This is fine for local projects such as this, but how would a client    get the file if the server exists on a different computer?

- The file can be downloaded as soon as tweets are pulled, but this can   result in many (many) files downloaded

- However additional information that is not displayed to the user will   not have to be sent over, faster api to client

Frontend:
- User gets a modal asking if they want to proceed with downloading the   file

- Slower API, transmitting larger file with superfluous information  
  that isn't displayed

- Processing file on frontend can slow browser, in a barebones project    such as this the slowdown is insignificant