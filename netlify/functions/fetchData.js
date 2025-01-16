const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  const apiKey = process.env.API_KEY; // Use environment variable for the API key
  const apiUrl = 'https://que6tion.github.io/Dangiskadiena/public/index.html'; // Replace with your actual API URL

  try {
    const response = await fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${apiKey}` // Securely pass the API key
      }
    });

    if (!response.ok) {
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: 'Failed to fetch data' })
      };
    }

    const data = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify(data)
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};
