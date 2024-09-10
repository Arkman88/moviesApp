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
      console.log(this.guestSessionId);
    }
  }

  async getResource(url) {
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
      },
    };

    const res = await fetch(url, options);
    if (!res.ok) {
      throw new Error(`Could not fetch ${url}, received ${res.status}`);
    }
    return await res.json();
  }

  async getGenres() {
    const url = `${this._apiBase}/genre/movie/list?api_key=${API_KEY}&language=en-US`;
    const data = await this.getResource(url);
    return data.genres.reduce((acc, genre) => {
      acc[genre.id] = genre.name;
      return acc;
    }, {});
  }

  async rateMovie(movieId, rating) {
    try {
      await this.initializeSession();
      console.log(this.guestSessionId, 'у рейтинга');
      const url = `${this._apiBase}/movie/${movieId}/rating?api_key=${API_KEY}&guest_session_id=${this.guestSessionId}`;

      const options = {
        method: 'POST',
        headers: {
          accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          value: rating,
        }),
      };

      const res = await fetch(url, options);
      if (!res.ok) {
        throw new Error(`Could not rate movie, received ${res.status}`);
      }
      return { success: true, movieId };
    } catch (error) {
      return { success: false, movieId, errorMsg: 'Failed to rate the movie.' };
    }
  }

  async getRatedMovies(page = 1) {
    try {
      await this.initializeSession();
      console.log(this.guestSessionId, 'у списка оцененных');
      const url = `${this._apiBase}/guest_session/${this.guestSessionId}/rated/movies?api_key=${API_KEY}&language=en-US&page=${page}&sort_by=created_at.asc`;
      const data = await this.getResource(url);

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
    } catch (error) {
      return { movies: [], totalPages: 0, errorMsg: 'Ooops! Something went wrong with getting rated movies!' };
    }
  }

  async getMovies(query = 'return', page = 1) {
    const url = `${this._apiBase}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${page}&include_adult=false&language=en-US`;

    try {
      const data = await this.getResource(url);

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
    } catch (error) {
      return { movies: [], totalPages: 0, errorMsg: 'Ooops! Something went wrong with getting movies list!' };
    }
  }
}
