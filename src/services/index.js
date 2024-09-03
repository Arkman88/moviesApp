import { API_KEY } from './config'
import placeholderImg from '../img/image.png'

export default class MoviesApp {
  _apiBase = 'https://api.themoviedb.org/3'

  async getResource(url) {
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${API_KEY}`,
      },
    }

    const res = await fetch(url, options)
    if (!res.ok) {
      throw new Error(`Could not fetch ${url}, received ${res.status}`)
    }
    return await res.json()
  }

  async getGenres() {
    const url = `${this._apiBase}/genre/movie/list?language=en-US`
    const data = await this.getResource(url)
    return data.genres.reduce((acc, genre) => {
      acc[genre.id] = genre.name
      return acc
    }, {})
  }

  async getMovies(query = 'return', page = 1) {
    const url = `${this._apiBase}/search/movie?query=${encodeURIComponent(query)}&page=${page}&include_adult=false&language=en-US`

    try {
      const [data, genres] = await Promise.all([this.getResource(url), this.getGenres()])

      if (data.results.length === 0) {
        return { movies: [], totalPages: 0, errorMsg: 'No movies found. Please try a different query.' }
      }

      const movies = data.results.map((movie) => ({
        title: movie.title,
        release_date: movie.release_date,
        description: movie.overview,
        rating: movie.vote_average,
        image: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : placeholderImg,
        genres: movie.genre_ids.map((id) => genres[id] || 'Unknown Genre'),
      }))

      return { movies, totalPages: data.total_pages, errorMsg: '' }
    } catch (error) {
      return { movies: [], totalPages: 0, errorMsg: 'Ooops! Something went wrong!' }
    }
  }
}
