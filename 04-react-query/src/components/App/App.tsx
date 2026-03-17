import { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import css from './App.module.css';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import SearchBar from '../SearchBar/SearchBar';
import { MovieGrid } from '../MovieGrid/MovieGrid';
import MovieModal from '../MovieModal/MovieModal';
import ReactPaginate from 'react-paginate';
import { useQuery } from '@tanstack/react-query';
import { fetchMovies } from '../../services/movieService';
import type { Movie } from '../../types/movie';
import type { FetchMoviesResponse } from '../../services/movieService';


export default function App() {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const {
    data,
    isLoading,
    isError,
    isSuccess,
  } = useQuery<FetchMoviesResponse, Error>({
    queryKey: ['movies', query, page],
    queryFn: () => fetchMovies({ query, page }),
    enabled: !!query,
    placeholderData: (previousData) => previousData
  });

  const handleSearchSubmit = (newQuery: string) => {
    if (newQuery.trim() === '') return;
    setQuery(newQuery);
    setPage(1);
  };

  const handleMovieClick = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  const closeModal = () => {
    setSelectedMovie(null);
  };

  useEffect(() => {
    if (isSuccess && data?.results?.length === 0) {
      toast.error('No movies found for your request.');
    }
  }, [isSuccess, data]);

  useEffect(() => {
    const modalRoot = document.createElement('div');
    modalRoot.id = 'modal-root';
    document.body.appendChild(modalRoot);
    return () => {
      document.body.removeChild(modalRoot);
    };
  }, []);

    useEffect(() => {
    console.log('Fetched data:', data);
  }, [data]);

  const totalPages = data?.total_pages || 0;

  return (
    <div className={css.app}>
      <Toaster position="top-center" />
      <SearchBar onSubmit={handleSearchSubmit} />

      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
      {isSuccess && data?.results?.length > 0 && (
        <>
          {totalPages > 1 && (
            <ReactPaginate
              pageCount={totalPages}
              pageRangeDisplayed={5}
              marginPagesDisplayed={1}
              onPageChange={({ selected }) => setPage(selected + 1)}
              forcePage={page - 1}
              containerClassName={css.pagination}
              activeClassName={css.active}
              nextLabel="→"
              previousLabel="←"
            />
          )}
          
          <MovieGrid movies={data.results} onSelect={handleMovieClick} />
        </>
      )}

      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={closeModal} />
      )}
    </div>
  );
}