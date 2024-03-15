import axios from 'axios';
import * as cors from 'cors';
import * as dotenv from 'dotenv';
import * as express from 'express';

const SUPPORTED_LANGUAGES = new Set(['en', 'pl', 'ru']);

const DEFAULT_LANGUAGE = 'en';

interface TripadvisorSearchRequest {
  searchQuery?: string;
  language?: string;
}

interface TripadvisorRequest {
  locationId?: string;
  language?: string;
}

dotenv.config();

const app = express();

const apiUrl = 'https://api.content.tripadvisor.com/api/v1/location';
const apiToken = process.env.TRIPADVISOR_TOKEN;

app.use(cors({ origin: '*' }));

app.get('/search', async (req, res) => {
  try {
    const { searchQuery, language } = req.query as TripadvisorSearchRequest;

    if (!searchQuery) {
      throw new Error('searchQuery is required');
    }

    const response = await axios.get(`${apiUrl}/search`, {
      headers: { accept: 'application/json' },
      params: {
        key: apiToken,
        language:
          language && SUPPORTED_LANGUAGES.has(language)
            ? language
            : DEFAULT_LANGUAGE,
        searchQuery,
        category: 'hotels',
      },
    });

    res.send(response.data);
  } catch (error) {
    res.send(error);
  }
});

app.get('/photos', async (req, res) => {
  try {
    const { locationId } = req.query as TripadvisorRequest;

    if (!locationId) {
      throw new Error('locationId is required');
    }

    const response = await axios.get(`${apiUrl}/${locationId}/photos`, {
      headers: { accept: 'application/json' },
      params: {
        key: apiToken,
      },
    });

    res.send(response.data);
  } catch (error) {
    res.send(error);
  }
});

app.get('/details', async (req, res) => {
  try {
    const { locationId, language } = req.query as TripadvisorRequest;

    if (!locationId) {
      throw new Error('locationId is required');
    }

    const response = await axios.get(`${apiUrl}/${locationId}/details`, {
      headers: { accept: 'application/json' },
      params: {
        key: apiToken,
        language:
          language && SUPPORTED_LANGUAGES.has(language)
            ? language
            : DEFAULT_LANGUAGE,
      },
    });

    res.send(response.data);
  } catch (error) {
    res.send(error);
  }
});

app.get('/reviews', async (req, res) => {
  try {
    const { locationId, language } = req.query as TripadvisorRequest;

    if (!locationId) {
      throw new Error('locationId is required');
    }

    const response = await axios.get(`${apiUrl}/${locationId}/reviews`, {
      headers: { accept: 'application/json' },
      params: {
        key: apiToken,
        language:
          language && SUPPORTED_LANGUAGES.has(language)
            ? language
            : DEFAULT_LANGUAGE,
      },
    });

    res.send(response.data);
  } catch (error) {
    res.send(error);
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`TripAdvisor Proxy is Online on port ${process.env.PORT}`);
});
