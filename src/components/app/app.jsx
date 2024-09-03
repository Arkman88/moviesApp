import React from 'react'
import MoviesApp from '../../services'
import Footer from '../footer/footer'
import SearchBar from '../search-bar/search-bar'
import Header from '../header/header'
import ItemList from '../item-list/item-list'
import Spinner from '../spinner/spinner'
import { Alert } from 'antd'

import './app.css'

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      movies: [],
      ratedMovies: [],
      currentPage: 1,
      totalPages: 0,
      searchQuery: 'return',
      errorMsg: '',
      loading: false,
      isHomePage: true,
      isRatedPage: false,
    }
    this.moviesApp = new MoviesApp()
  }

  componentDidMount() {
    this.fetchMovies()
  }

  async fetchMovies(page = 1) {
    if (!navigator.onLine) {
      this.setState({ errorMsg: 'No internet connection. Please check your network and try again.' })
      return
    }

    this.setState({ loading: true })
    const { searchQuery } = this.state
    try {
      const movieData = await this.moviesApp.getMovies(searchQuery, page)
      this.setState({
        movies: movieData.movies,
        currentPage: page,
        totalPages: movieData.totalPages,
        errorMsg: movieData.errorMsg,
      })
    } catch (error) {
      this.setState({ errorMsg: 'Ooops! Something went wrong!' })
    } finally {
      this.setState({ loading: false })
    }
  }

  async fetchRatedMovies() {
    if (!navigator.onLine) {
      this.setState({ errorMsg: 'No internet connection. Please check your network and try again.' })
      return
    }

    // Для демонстрации, замените этот метод на реальный вызов для получения оцененных фильмов
    this.setState({ loading: true })
    // Замените этот блок на ваш метод для получения оцененных фильмов
    const ratedMovies = [] // Полученные данные
    this.setState({
      ratedMovies,
      loading: false,
      errorMsg: '',
    })
  }

  onPageChange = (page) => {
    this.fetchMovies(page)
  }

  onSearch = (query) => {
    this.setState({ searchQuery: query, isHomePage: true, isRatedPage: false }, () => {
      this.fetchMovies(1)
    })
  }

  goToHomePage = () => {
    this.setState({ isHomePage: true, isRatedPage: false, searchQuery: 'return' }, () => {
      this.fetchMovies(1)
    })
  }

  goToRatedPage = () => {
    this.setState({ isHomePage: false, isRatedPage: true }, () => {
      this.fetchRatedMovies()
    })
  }

  errorAlert = () => {
    const { errorMsg } = this.state

    if (errorMsg) {
      return <Alert message="Error" description={errorMsg} type="error" showIcon style={{ marginBottom: '20px' }} />
    }
    return null
  }

  render() {
    const { movies, ratedMovies, totalPages, loading, isHomePage, isRatedPage } = this.state
    const itemsToDisplay = isRatedPage ? ratedMovies : movies

    return (
      <div className="app">
        <Header
          isHomePage={isHomePage}
          isRatedPage={isRatedPage}
          onHomeClick={this.goToHomePage}
          onRatedClick={this.goToRatedPage}
        />
        <SearchBar onSearch={this.onSearch} loading={loading} />
        {this.errorAlert()}
        {loading ? <Spinner /> : <ItemList items={itemsToDisplay} />}
        <Footer onChange={this.onPageChange} total={totalPages} />
      </div>
    )
  }
}
