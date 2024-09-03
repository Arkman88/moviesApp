import React from 'react';
import MoviesApp from '../../services';
import Footer from '../footer/footer';
import SearchBar from '../search-bar/search-bar';
import Header from '../header/header';
import ItemList from '../item-list/item-list';
import Spinner from '../spinner/spinner';
import { Alert } from 'antd';

import './app.css';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      movies: [],
      currentPage: 1,
      totalPages: 0,
      searchQuery: 'return',
      errorMsg: '',
      loading: false,
    };
    this.moviesApp = new MoviesApp();
  }

  componentDidMount() {
    this.fetchMovies();
  }

  async fetchMovies(page = 1) {
    if (!navigator.onLine) {
      this.setState({ errorMsg: 'No internet connection. Please check your network and try again.' });
      return;
    }

    this.setState({ loading: true });
    const { searchQuery } = this.state;
    const movieData = await this.moviesApp.getMovies(searchQuery, page);

    this.setState({
      movies: movieData.movies,
      currentPage: page,
      totalPages: movieData.totalPages,
      errorMsg: movieData.errorMsg,
      loading: false,
    });
  }

  onPageChange = (page) => {
    this.fetchMovies(page);
  };

  onSearch = (query) => {
    this.setState({ searchQuery: query }, () => {
      this.fetchMovies(1);
    });
  };

  errorAlert = () => {
    const { errorMsg } = this.state;

    if (errorMsg) {
      return <Alert message="Error" description={errorMsg} type="error" showIcon style={{ marginBottom: '20px' }} />;
    }
    return null;
  };

  render() {
    const { movies, totalPages } = this.state;
    return (
      <div className="app">
        <Header />
        <SearchBar onSearch={this.onSearch} />
        {this.errorAlert()}
        {this.state.loading ? <Spinner /> : <ItemList items={movies} />}
        <Footer onChange={this.onPageChange} total={totalPages} />
      </div>
    );
  }
}
