const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

const fetchMovies = async (endpoint, params = {}) => {
  if (!API_KEY) {
    console.warn('TMDB API Key is missing. Using mock data.');
    return getMockMovies();
  }

  const queryParams = new URLSearchParams({
    api_key: API_KEY,
    language: 'en-US',
    ...params,
  });

  try {
    const response = await fetch(`${BASE_URL}${endpoint}?${queryParams}`);
    if (!response.ok) {
      throw new Error(`TMDB API Error: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching movies:', error);
    return { results: [], total_pages: 0 };
  }
};

export const getGenres = async () => {
  if (!API_KEY) {
    return [
      { id: 28, name: "Action" },
      { id: 12, name: "Adventure" },
      { id: 16, name: "Animation" },
      { id: 35, name: "Comedy" },
      { id: 80, name: "Crime" },
      { id: 99, name: "Documentary" },
      { id: 18, name: "Drama" },
      { id: 10751, name: "Family" },
      { id: 14, name: "Fantasy" },
      { id: 36, name: "History" },
      { id: 27, name: "Horror" },
      { id: 10402, name: "Music" },
      { id: 9648, name: "Mystery" },
      { id: 10749, name: "Romance" },
      { id: 878, name: "Science Fiction" },
      { id: 10770, name: "TV Movie" },
      { id: 53, name: "Thriller" },
      { id: 10752, name: "War" },
      { id: 37, name: "Western" }
    ];
  }

  const queryParams = new URLSearchParams({
    api_key: API_KEY,
    language: 'en-US',
  });

  try {
    const response = await fetch(`${BASE_URL}/genre/movie/list?${queryParams}`);
    if (!response.ok) throw new Error('Failed to fetch genres');
    const data = await response.json();
    return data.genres;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const discoverMovies = (page = 1, genreId = '', language = '') => {
  const params = { page };
  if (genreId) params.with_genres = genreId;
  if (language) params.with_original_language = language;
  // Sort by popularity descending by default
  params.sort_by = 'popularity.desc';
  
  return fetchMovies('/discover/movie', params);
};

export const getTrendingMovies = () => fetchMovies('/trending/movie/week');
export const searchMovies = (query, page = 1) => fetchMovies('/search/movie', { query, page });

export const getMovieDetails = async (movieId) => {
  if (!API_KEY) {
    const mockData = getMockMovies();
    return mockData.results.find(m => m.id === movieId) || null;
  }
  
  const queryParams = new URLSearchParams({
    api_key: API_KEY,
    language: 'en-US',
    append_to_response: 'watch/providers'
  });

  try {
    const response = await fetch(`${BASE_URL}/movie/${movieId}?${queryParams}`);
    if (!response.ok) {
      throw new Error(`TMDB API Error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching movie details:', error);
    return null;
  }
};

function getMockMovies() {
  const results = [
    {
      id: 1,
      title: 'Inception',
      poster_path: '/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg',
      vote_average: 8.8,
      release_date: '2010-07-15',
      overview: 'Cobb, a skilled thief who commits corporate espionage by infiltrating the subconscious of his targets is offered a chance to regain his old life as payment for a task considered to be impossible: "inception", the implantation of another person\'s idea into a target\'s subconscious.',
      runtime: 148,
      genres: [{ id: 28, name: 'Action' }, { id: 878, name: 'Science Fiction' }, { id: 12, name: 'Adventure' }],
      'watch/providers': {
        results: {
          IN: {
            link: "https://www.justwatch.com",
            flatrate: [
              { logo_path: "/t2yyOv40HZeVlLjVrCsPhIdZLWw.jpg", provider_name: "Netflix" },
              { logo_path: "/emthp39XA2YScoYL1p0sdbAH2WA.jpg", provider_name: "Amazon Prime Video" }
            ],
            rent: [
              { logo_path: "/peURlNpzO1TMBmQwI8gvnkBgBcO.jpg", provider_name: "Apple TV" }
            ]
          }
        }
      }
    },
    {
      id: 2,
      title: 'Interstellar',
      poster_path: '/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
      vote_average: 8.6,
      release_date: '2014-11-05',
      overview: 'The adventures of a group of explorers who make use of a newly discovered wormhole to surpass the limitations on human space travel and conquer the vast distances involved in an interstellar voyage.',
      runtime: 169,
      genres: [{ id: 12, name: 'Adventure' }, { id: 18, name: 'Drama' }, { id: 878, name: 'Science Fiction' }]
    },
    {
      id: 3,
      title: 'The Dark Knight',
      poster_path: '/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
      vote_average: 8.5,
      release_date: '2008-07-16',
      overview: 'Batman raises the stakes in his war on crime. With the help of Lt. Jim Gordon and District Attorney Harvey Dent, Batman sets out to dismantle the remaining criminal organizations that plague the streets. The partnership proves to be effective, but they soon find themselves prey to a reign of chaos unleashed by a rising criminal mastermind known to the terrified citizens of Gotham as the Joker.',
      runtime: 152,
      genres: [{ id: 18, name: 'Drama' }, { id: 28, name: 'Action' }, { id: 80, name: 'Crime' }, { id: 53, name: 'Thriller' }]
    },
    {
      id: 4,
      title: 'Avatar',
      poster_path: '/kyeqWdyQ1eFdbK63P403LIfx19Y.jpg',
      vote_average: 7.5,
      release_date: '2009-12-15',
      overview: 'In the 22nd century, a paraplegic Marine is dispatched to the moon Pandora on a unique mission, but becomes torn between following orders and protecting an alien civilization.',
      runtime: 162,
      genres: [{ id: 28, name: 'Action' }, { id: 12, name: 'Adventure' }, { id: 14, name: 'Fantasy' }, { id: 878, name: 'Science Fiction' }]
    },
    {
      id: 5,
      title: 'The Matrix',
      poster_path: '/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg',
      vote_average: 8.2,
      release_date: '1999-03-30',
      overview: 'Set in the 22nd century, The Matrix tells the story of a computer hacker who joins a group of underground insurgents fighting the vast and powerful computers who now rule the earth.',
      runtime: 136,
      genres: [{ id: 28, name: 'Action' }, { id: 878, name: 'Science Fiction' }]
    }
  ];
  return { results, total_pages: 1 };
}
