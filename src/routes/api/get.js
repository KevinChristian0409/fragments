// src/routes/api/get.js

const { createSuccessResponse } = require('../../../src/response');
/**
 * Get a list of fragments for the current user
 */
module.exports = (req, res) => {
  // TODO: this is just a placeholder. To get something working, return an empty array...
  const responseData = {
    fragments: [],
  };

  // Use createSuccessResponse for the response
  const successResponse = createSuccessResponse(responseData);

  res.status(200).json(successResponse);
};
