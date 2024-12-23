const properties = require('./json/properties.json');
const users = require('./json/users.json');
const { Pool } = require('pg');

const pool = new Pool({
  user: 'development',
  password: 'development',
  host: 'localhost',
  database: 'lightbnb',
  port: 5432,
});

/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
// Refactored getUsersWithEmail
const getUserWithEmail = (email) => {
  return pool
    .query(`SELECT * FROM users WHERE email = $1`, [email])
    .then((result) => {
      return result.rows[0];
    })
    .catch((err) => {
      console.log('Error with Email', err.message);
    });
};

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */

// Refactored getUsersWithId
const getUserWithId = (id) => {
  return pool
    .query(`SELECT * FROM users WHERE id = $1`, [id])
    .then((result) => {
      return result.rows[0];
    })
    .catch((err) => {
      console.log('Error with ID', err.message);
    });
};

/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */

// Refactored addUser
const addUser = (user) => {
  return pool
    .query(
      `INSERT INTO users (name, email, password)
      VALUES ($1, $2, $3)
      RETURNING *`,
      [user.name, user.email, user.password]
    )
    .then((result) => {
      return result.rows[0];
    })
    .catch((err) => {
      console.log(err.message);
    });
};

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */

// Refactored getAllReservations
const getAllReservations = (guest_id, limit = 10) => {
  return pool
    .query(
      `SELECT reservations.id, properties.title, properties.cost_per_night, reservations.start_date, avg(rating) as average_rating
        FROM reservations
        JOIN properties ON reservations.property_id = properties.id
        JOIN property_reviews ON properties.id = property_reviews.property_id
        WHERE reservations.guest_id = $1
        GROUP BY properties.id, reservations.id
        ORDER BY reservations.start_date
        LIMIT $2;`,
      [guest_id, limit]
    )
    .then((result) => {
      return result.rows;
    })
    .catch((err) => {
      console.log('Error with Reservation', err.message);
    });
};

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */

// Refactored function to include filtering
const getAllProperties = function (options, limit = 10) {
  // 1 Array to hold parameters for the query
  const queryParams = [];
  // 2 Start query with all information that comes before WHERE clause
  let queryString = `
  SELECT properties.*, avg(property_reviews.rating) as average_rating
  FROM properties
  LEFT JOIN property_reviews ON properties.id = property_id
  `;

  // Implementing WHERE 1-1 Clause
  const whereClause = [];

  // 3 Filtering by city
  if (options.city) {
    queryParams.push(`%${options.city}%`);
    whereClause.push(`city LIKE $${queryParams.length} `);
  }

  // Filter properties belonging to the owner
  if (options.owner_id) {
    queryParams.push(options.owner_id);
    whereClause.push(`properties.owner_id = $${queryParams.length} `);
  }

  // Filter Min price per night
  if (options.minimum_price_per_night) {
    queryParams.push(options.minimum_price_per_night * 100);
    whereClause.push(`cost_per_night >= $${queryParams.length} `);
  }

  // Filter max price per night
  if (options.maximum_price_per_night) {
    queryParams.push(options.maximum_price_per_night * 100);
    whereClause.push(`cost_per_night <= $${queryParams.length} `);
  }

  // Filter minimum rating
  if (options.minimum_rating) {
    queryParams.push(options.minimum_rating);
    whereClause.push(`avg(property_reviews.rating) >= $${queryParams.length} `);
  }

  // WHERE clause for added conditions
  if (whereClause.length > 0) {
    queryString += ' WHERE ' + whereClause.join(' AND ');
  }

  // 4 Group by property ID, order by cost per night, and LIMIT CLAUSE
  // Add any query that comes after the WHERE clause
  queryParams.push(limit);
  queryString += `
  GROUP BY properties.id
  ORDER BY cost_per_night
  LIMIT $${queryParams.length};
  `;

  // 5
  console.log(queryString, queryParams);

  // 6 Run the query
  return pool.query(queryString, queryParams).then((res) => res.rows);
};

/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */

// Refactored Code
const addProperty = function (property) {
  const addPropertyQueryParams = [];
  let addPropertyQueryString = `
    INSERT INTO properties (
      owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, street, city, province, post_code, country, parking_spaces, number_of_bathrooms, number_of_bedrooms
    )
    VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14
    )
    RETURNING *;
  `;

  addPropertyQueryParams.push(
    property.owner_id,
    property.title,
    property.description,
    property.thumbnail_photo_url,
    property.cover_photo_url,
    property.cost_per_night,
    property.street,
    property.city,
    property.province,
    property.post_code,
    property.country,
    property.parking_spaces,
    property.number_of_bathrooms,
    property.number_of_bedrooms
  );

  console.log(addPropertyQueryString, addPropertyQueryParams);

  return pool
    .query(addPropertyQueryString, addPropertyQueryParams)
    .then((res) => res.rows[0])
    .catch((err) => {
      console.log('Error Adding Property', err.message);
    });
};

module.exports = {
  getUserWithEmail,
  getUserWithId,
  addUser,
  getAllReservations,
  getAllProperties,
  addProperty,
};
