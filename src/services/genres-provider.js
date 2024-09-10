import { createContext, useState, useEffect } from 'react';
import { Alert } from 'antd';
import Spinner from '../components/spinner/spinner';
import MoviesApp from '.';

export const GenresContext = createContext();

const GenresProvider = ({ children }) => {
  const [genres, setGenres] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const moviesApp = new MoviesApp();

    const fetchGenres = async () => {
      try {
        const fetchedGenres = await moviesApp.getGenres();
        setGenres(fetchedGenres);
        setLoading(false);
      } catch (err) {
        setError('Failed to load genres');
        setLoading(false);
      }
    };

    fetchGenres();
  }, []);

  if (loading) {
    return <Spinner tip="Loading genres..." />;
  }

  if (error) {
    return <Alert message="Error" description={error} type="error" showIcon />;
  }

  return <GenresContext.Provider value={genres}>{children}</GenresContext.Provider>;
};

export default GenresProvider;
