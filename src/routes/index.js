// src/routes/index.js

const express = require('express');

// version and author from package.json
const { version, author } = require('../../package.json');

const { authenticate } = require('../auth');

const { createSuccessResponse, createErrorResponse } = require('../../src/response');

// Create a router that we can use to mount our API
const router = express.Router();

/**
 * Expose all of our API routes on /v1/* to include an API version.
 * Protect them all with middleware so you have to be authenticated
 * in order to access things.
 */
router.use(`/v1`, authenticate(), require('./api'));

/**
 * Define a simple health check route. If the server is running
 * we'll respond with a 200 OK.  If not, the server isn't healthy.
 */
router.get('/', (req, res) => {
  res.setHeader('Cache-Control', 'no-cache');

  try {
    // Instead of manually constructing the response, use createSuccessResponse
    const healthCheckResponse = createSuccessResponse({
      author,
      githubUrl: 'https://github.com/KevinChristian0409/fragments',
      version,
    });

    res.status(200).json(healthCheckResponse);
  } catch (error) {
    // If an error occurs, use createErrorResponse
    const errorResponse = createErrorResponse(500, 'Internal Server Error');
    res.status(500).json(errorResponse);
  }
});

module.exports = router;
