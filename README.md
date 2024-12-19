# LightBnB Project

## Purpose

- A simple multi-page AirBnB clone built with Node.js, Express, and PostgreSQL. With this app you can search for properties, make reservations, and manage the listings. It connects to a PostgreSQL database to retrieve and display property information using SQL queries.

## Getting Started

- To start this project locally, follow these steps:
- Install dependencies using `npm install`
- Start PostgreSQL by using: `sudo service postgresql start`
- Log in to database using: `psql -U development -d lightbnb`
  - Pass: `development`
- Run the app using: `npm run local` and view it at `localhost:3000` in your browser
- Suggested user account:

```
    Name: John Stevens
    Email: charliebattle@yahoo.com
    Password: password
```

## Final Product

!["Screenshot of Homepage "](https://github.com/pheyboer/LightBnB/blob/master/docs/lightbnb1.png)
!["screenshot of Homepage when Logged In "](https://github.com/pheyboer/LightBnB/blob/master/docs/lightbnb2.png)
!["Screenshot of Create Listing Page "](https://github.com/pheyboer/LightBnB/blob/master/docs/lightbnb3.png)

## Features

- User authentication (Sign up, Log in, Log out)
- View, create, and manage property listings
- Reservation system to book properties
- Search filtering (city, price, etc.)
- User profile

## Dependencies

The following dependencies are using in this project:

```js
"bcrypt": "^5.1.1",
"cookie-session": "^1.3.3",
"express": "^4.17.1",
"nodemon": "^1.19.1",
"pg": "^8.13.1"
```
