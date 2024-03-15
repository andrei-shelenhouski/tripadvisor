import axios from 'axios';
import * as cors from 'cors';
import * as dotenv from 'dotenv';
import * as express from 'express';

const SUPPORTED_LANGUAGES = new Set(['en', 'pl', 'ru']);

const DEFAULT_LANGUAGE = 'en';

interface TripadvisorSearchRequest {
  searchQuery?: string;
  language?: string;
  key?: string;
}

interface TripadvisorRequest {
  locationId?: string;
  language?: string;
  key?: string;
}

dotenv.config();

const app = express();

const apiUrl = 'https://api.content.tripadvisor.com/api/v1/location';

app.use(cors({ origin: '*' }));

app.get('/search', async (req, res) => {
  try {
    const { searchQuery, language, key } =
      req.query as TripadvisorSearchRequest;

    if (!key) {
      throw new Error('key is required');
    }

    if (!searchQuery) {
      throw new Error('searchQuery is required');
    }

    const response = await axios.get(`${apiUrl}/search`, {
      headers: { accept: 'application/json' },
      params: {
        key,
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
    const { locationId, key } = req.query as TripadvisorRequest;

    if (!key) {
      throw new Error('key is required');
    }

    if (!locationId) {
      throw new Error('locationId is required');
    }

    const response = await axios.get(`${apiUrl}/${locationId}/photos`, {
      headers: { accept: 'application/json' },
      params: {
        key,
      },
    });

    res.send(response.data);
  } catch (error) {
    res.send(error);
  }
});

app.get('/details', async (req, res) => {
  try {
    const { locationId, language, key } = req.query as TripadvisorRequest;

    if (!locationId) {
      throw new Error('locationId is required');
    }

    if (!key) {
      throw new Error('key is required');
    }

    const response = await axios.get(`${apiUrl}/${locationId}/details`, {
      headers: { accept: 'application/json' },
      params: {
        key,
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
    const { locationId, language, key } = req.query as TripadvisorRequest;

    if (!key) {
      throw new Error('key is required');
    }

    if (!locationId) {
      throw new Error('locationId is required');
    }

    const response = await axios.get(`${apiUrl}/${locationId}/reviews`, {
      headers: { accept: 'application/json' },
      params: {
        key,
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
  console.log(
    `TripAdvisor Proxy is Online on port ${process.env.PORT || 3000}`,
  );
});
