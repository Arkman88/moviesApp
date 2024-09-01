import { API_KEY } from './config'

export default class MoviesApp {
  _apiBase = 'https://api.themoviedb.org/3/search/movie'

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
      throw new Error(`Could not fetch ${url} received ${res.status}`)
    }
    return await res.json()
  }

  async getMovies(query = 'return', page = 1) {
    const url = `${this._apiBase}?query=${encodeURIComponent(query)}&page=${page}&include_adult=false&language=en-US`

    try {
      const data = await this.getResource(url)

      if (data.results.length === 0) {
        return { movies: [], totalPages: 0, errorMsg: 'No movies found. Please try a different query.' }
      }

      const movies = data.results.map((movie) => ({
        title: movie.title,
        release_date: movie.release_date,
        description: movie.overview,
        rating: movie.vote_average,
        image: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
      }))

      return { movies, totalPages: data.total_pages, errorMsg: '' }
    } catch (error) {
      return { movies: [], totalPages: 0, errorMsg: 'Ooops! Something went wrong!' }
    }
  }
}
