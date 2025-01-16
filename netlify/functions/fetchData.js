const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  // Get the API key from environment variables
  const apiKey = process.env.API_KEY;

  // Your API endpoint
  const apiUrl = 'https://api.example.com/data'; // Replace with your API URL

  try {
    const response = await fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${apiKey}`, // Include the API key in the header
      },
    });

    if (!response.ok) {
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: 'Failed to fetch data' }),
      };
    }

    const data = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};
