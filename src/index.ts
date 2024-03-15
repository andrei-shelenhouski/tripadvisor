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
      res.status(400).send('key is required');
      return;
    }

    if (!searchQuery) {
      res.status(400).send('searchQuery is required');
      return;
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
    res.status(500).send(error);
  }
});

app.get('/:locationId/photos', async (req, res) => {
  try {
    const { key } = req.query as TripadvisorRequest;
    const { locationId } = req.params;

    if (!key) {
      res.status(400).send('key is required');
      return;
    }

    if (!locationId) {
      res.status(400).send('locationId is required');
      return;
    }

    const response = await axios.get(`${apiUrl}/${locationId}/photos`, {
      headers: { accept: 'application/json' },
      params: {
        key,
      },
    });

    res.send(response.data);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.get('/:locationId/details', async (req, res) => {
  try {
    const { language, key } = req.query as TripadvisorRequest;
    const { locationId } = req.params;

    if (!key) {
      res.status(400).send('key is required');
      return;
    }

    if (!locationId) {
      res.status(400).send('locationId is required');
      return;
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
    res.status(500).send(error);
  }
});

app.get('/:locationId/reviews', async (req, res) => {
  try {
    const { language, key } = req.query as TripadvisorRequest;
    const { locationId } = req.params;

    if (!key) {
      res.status(400).send('key is required');
      return;
    }

    if (!locationId) {
      res.status(400).send('locationId is required');
      return;
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
    res.status(500).send(error);
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log(
    `TripAdvisor Proxy is Online on port ${process.env.PORT || 3000}`,
  );
});
