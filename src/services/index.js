import { API_KEY } from './config';
import placeholderImg from '../img/image.png';
import sessionService from './session-service';

export default class MoviesApp {
  _apiBase = 'https://api.themoviedb.org/3';

  constructor() {
    this.sessionService = new sessionService();
    this.guestSessionId = null;
  }

  async initializeSession() {
    if (!this.guestSessionId) {
      this.guestSessionId = await this.sessionService.initializeGuestSession();
    }
  }

  async getResource(url, method = 'GET', body = null) {
    const options = {
      method,
      headers: {
        accept: 'application/json',
        'Content-Type': body ? 'application/json' : undefined,
      },
      body: body ? JSON.stringify(body) : null,
    };

    try {
      const res = await fetch(url, options);
      if (!res.ok) {
        if (res.status === 404) {
          throw new Error('There is no rated movies here... (404)');
        }
        throw new Error(`Request failed with status ${res.status}`);
      }
      return await res.json();
    } catch (error) {
      return { success: false, errorMsg: error.message };
    }
  }

  async getGenres() {
    const url = `${this._apiBase}/genre/movie/list?api_key=${API_KEY}&language=en-US`;
    const data = await this.getResource(url);

    if (data.success === false) {
      console.error(data.errorMsg);
      return {};
    }

    return data.genres.reduce((acc, genre) => {
      acc[genre.id] = genre.name;
      return acc;
    }, {});
  }

  async rateMovie(movieId, rating) {
    await this.initializeSession();
    const url = `${this._apiBase}/movie/${movieId}/rating?api_key=${API_KEY}&guest_session_id=${this.guestSessionId}`;

    const data = await this.getResource(url, 'POST', { value: rating });

    if (data.success === false) {
      return { success: false, movieId, errorMsg: data.errorMsg };
    }

    return { success: true, movieId };
  }

  async getRatedMovies(page = 1) {
    await this.initializeSession();
    const url = `${this._apiBase}/guest_session/${this.guestSessionId}/rated/movies?api_key=${API_KEY}&language=en-US&page=${page}`;

    const data = await this.getResource(url);

    if (data.success === false) {
      return { movies: [], totalPages: 0, errorMsg: data.errorMsg };
    }

    if (data.results.length === 0) {
      return { movies: [], totalPages: 0, errorMsg: 'No rated movies found.' };
    }

    const movies = data.results.map((movie) => ({
      id: movie.id,
      title: movie.title,
      release_date: movie.release_date,
      description: movie.overview,
      rating: movie.rating,
      image: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : placeholderImg,
      genre_ids: movie.genre_ids,
    }));

    return { movies, totalPages: data.total_pages, errorMsg: '' };
  }

  async getMovies(query = 'return', page = 1) {
    const url = `${this._apiBase}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${page}&include_adult=false&language=en-US`;

    const data = await this.getResource(url);

    if (data.success === false) {
      return { movies: [], totalPages: 0, errorMsg: data.errorMsg };
    }

    if (data.results.length === 0) {
      return { movies: [], totalPages: 0, errorMsg: 'No movies found. Please try a different query.' };
    }

    const movies = data.results.map((movie) => ({
      id: movie.id,
      title: movie.title,
      release_date: movie.release_date,
      description: movie.overview,
      rating: movie.vote_average,
      image: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : placeholderImg,
      genre_ids: movie.genre_ids,
    }));

    return { movies, totalPages: data.total_pages, errorMsg: '' };
  }
}
