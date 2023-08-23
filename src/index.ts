import axios from 'axios';
import * as cors from 'cors';
import * as dotenv from 'dotenv';
import * as express from 'express';

dotenv.config();

const app = express();

const apiUrl = 'https://api.content.tripadvisor.com/api/v1/location';
const apiToken = process.env.TRIPADVISOR_TOKEN;

app.use(cors({ origin: '*' }));

app.get('/search', async (req, res) => {
  try {
    const response = await axios.get(`${apiUrl}/search`, {
      headers: { accept: 'application/json' },
      params: {
        key: apiToken,
        ...req.query,
      },
    });

    res.send(response.data);
  } catch (error) {
    res.send(error);
  }
});

app.get('/photos', async (req, res) => {
  try {
    const response = await axios.get(
      `${apiUrl}/${req.query.locationId}/photos`,
      {
        headers: { accept: 'application/json' },
        params: {
          key: apiToken,
        },
      },
    );

    res.send(response.data);
  } catch (error) {
    res.send(error);
  }
});

app.get('/details', async (req, res) => {
  try {
    const response = await axios.get(
      `${apiUrl}/${req.query.locationId}/details`,
      {
        headers: { accept: 'application/json' },
        params: {
          key: apiToken,
          language: req.query.language,
        },
      },
    );

    res.send(response.data);
  } catch (error) {
    res.send(error);
  }
});

app.get('/reviews', async (req, res) => {
  try {
    const response = await axios.get(
      `${apiUrl}/${req.query.locationId}/reviews`,
      {
        headers: { accept: 'application/json' },
        params: {
          key: apiToken,
          language: 'pl',
        },
      },
    );

    res.send(response.data);
  } catch (error) {
    res.send(error);
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`TripAdvisor Proxy is Online on port ${process.env.PORT}`);
});
