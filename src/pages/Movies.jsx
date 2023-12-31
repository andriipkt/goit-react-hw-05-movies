import { useEffect, useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { fetchMovieByQuery } from 'tools/API-service';
import { RotatingLines } from 'react-loader-spinner';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import MoviesList from 'components/MoviesList/MoviesList';
import SearchForm from 'components/SearchForm/SearchForm';

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const movieSearchQuery = searchParams.get('query') ?? '';

  ////
  const [previousQuery, setPreviousQuery] = useState(movieSearchQuery);

  useEffect(() => {
    if (!movieSearchQuery) return;

    const fetchMoviesAPI = async () => {
      try {
        setLoading(true);
        const response = await fetchMovieByQuery(movieSearchQuery);
        const { results } = response;

        if (results.length === 0) {
          setLoading(false);
          return Notify.warning(`We don't have any movies for this query`);
        }

        setMovies(results);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchMoviesAPI();

    setPreviousQuery(movieSearchQuery);
  }, [movieSearchQuery]);

  const handleSubmit = value => {
    if (value === movieSearchQuery) {
      return Notify.warning('Please enter another query');
    }

    const nextParams = value !== '' ? { query: value } : {};
    setSearchParams(nextParams);
  };

  return (
    <>
      <h2>Movies</h2>
      <SearchForm onSubmit={handleSubmit} previousQuery={previousQuery} />

      {loading ? (
        <RotatingLines strokeColor="orange" width="36" />
      ) : (
        <MoviesList movies={movies} location={location} />
      )}
    </>
  );
};

export default Movies;
