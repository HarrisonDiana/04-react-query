import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import css from "./App.module.css";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import SearchBar from "../SearchBar/SearchBar";
import { MovieGrid } from "../MovieGrid/MovieGrid";
import MovieModal from "../MovieModal/MovieModal";
import { useQuery } from "@tanstack/react-query";
import { fetchMovies } from "../../services/movieService";
import type { Movie } from "../../types/movie";
import type { FetchMoviesResponse } from "../../services/movieService";

import type { ComponentType } from "react";
import ReactPaginateModule from "react-paginate";
import type { ReactPaginateProps } from "react-paginate";

// Допоміжний тип: описує модуль, у якого реальний експорт лежить у полі .default.
type ModuleWithDefault<T> = { default: T };

// Дістаємо справжній React-компонент із .default, щоб React отримав саме компонент.
// Ми явно повідомляємо TS форму значення, щоб зберегти правильні типи пропсів
// (ReactPaginateProps) і мати коректну перевірку/підказки в IDE.
const ReactPaginate = (
  ReactPaginateModule as unknown as ModuleWithDefault<
    ComponentType<ReactPaginateProps>
  >
).default;

export default function App() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const { data, isLoading, isError, isSuccess } = useQuery<
    FetchMoviesResponse,
    Error
  >({
    queryKey: ["movies", query, page],
    queryFn: () => fetchMovies({ query, page }),
    enabled: !!query,
    placeholderData: (previousData) => previousData,
  });

  const handleSearchSubmit = (newQuery: string) => {
    if (newQuery.trim() === "") return;
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
      toast.error("No movies found for your request.");
    }
  }, [isSuccess, data]);

  const totalPages = data?.total_pages || 0;
  console.log(data);

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