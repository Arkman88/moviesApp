import React from 'react'
import MoviesApp from '../../services'
import Footer from '../footer/footer'
import SearchBar from '../search-bar/search-bar'
import Header from '../header/header'
import ItemList from '../item-list/item-list'

import './app.css'

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      movies: [],
      currentPage: 1,
      totalPages: 0,
      searchQuery: 'return',
      errorMsg: '',
    }
    this.moviesApp = new MoviesApp()
  }

  componentDidMount() {
    this.fetchMovies()
  }

  async fetchMovies(page = 1) {
    const { searchQuery } = this.state
    const movieData = await this.moviesApp.getMovies(searchQuery, page)

    this.setState({
      movies: movieData.movies,
      currentPage: page,
      totalPages: movieData.totalPages,
      errorMsg: movieData.errorMsg,
    })
  }

  onPageChange = (page) => {
    this.fetchMovies(page)
  }

  onSearch = (query) => {
    this.setState({ searchQuery: query }, () => {
      this.fetchMovies(1)
    })
  }

  render() {
    const { movies, totalPages, errorMsg } = this.state
    return (
      <div className="app">
        <Header />
        <SearchBar onSearch={this.onSearch} />
        {errorMsg ? <div className="error-message">{errorMsg}</div> : <ItemList items={movies} />}
        <Footer onChange={this.onPageChange} total={totalPages} />
      </div>
    )
  }
}
