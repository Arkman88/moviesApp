import { useState, useEffect, useCallback } from 'react';
import MoviesApp from '../../services';
import Footer from '../footer/footer';
import SearchBar from '../search-bar/search-bar';
import Header from '../header/header';
import ItemList from '../item-list/item-list';
import Spinner from '../spinner/spinner';
import { Alert } from 'antd';

import './app.css';

const moviesApp = new MoviesApp();

const App = () => {
  const [movies, setMovies] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('return');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('search');
  const [ratedMovies, setRatedMovies] = useState([]);

  const fetchData = useCallback(
    async (page = 1, type = 'search') => {
      if (!navigator.onLine) {
        setErrorMsg('No internet connection. Please check your network and try again.');
        setLoading(false);
        return;
      }

      setLoading(true);
      setErrorMsg('');

      let data;

      try {
        if (type === 'search') {
          data = await moviesApp.getMovies(searchQuery, page);
        } else if (type === 'rated') {
          data = await moviesApp.getRatedMovies(page);
        }

        if (data.errorMsg) {
          setErrorMsg(data.errorMsg);
        } else {
          if (type === 'search') {
            setMovies(data.movies);
          } else if (type === 'rated') {
            setRatedMovies(data.movies);
          }
          setTotalPages(data.totalPages);
        }
      } catch (error) {
        setErrorMsg('Ooops! Something went wrong while TABing!');
      } finally {
        setLoading(false);
      }
    },
    [searchQuery]
  );

  useEffect(() => {
    if (activeTab === 'search') {
      fetchData(currentPage, 'search');
    } else if (activeTab === 'rated') {
      fetchData(currentPage, 'rated');
    }
  }, [fetchData, currentPage, activeTab]);

  const onPageChange = (page) => {
    setCurrentPage(page);
  };

  const onSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
    fetchData(1, 'search');
  };

  const onTabChange = (activeTab) => {
    setActiveTab(activeTab);
    setCurrentPage(1);
  };

  const errorAlert = () => {
    if (errorMsg) {
      return <Alert message="Error" description={errorMsg} type="error" showIcon style={{ marginBottom: '20px' }} />;
    }
    return null;
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'search':
        return (
          <>
            <SearchBar onSearch={onSearch} />
            {errorAlert()}
            {loading ? <Spinner /> : <ItemList items={movies} moviesApp={moviesApp} />}
            <Footer current={currentPage} onChange={onPageChange} total={totalPages} />
          </>
        );
      case 'rated':
        return (
          <>
            {errorAlert()}
            {loading ? <Spinner /> : <ItemList items={ratedMovies} moviesApp={moviesApp} />}
            <Footer current={currentPage} onChange={onPageChange} total={totalPages} />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="app">
      <Header activeTab={activeTab} onTabChange={onTabChange} />
      {renderContent()}
    </div>
  );
};

export default App;
