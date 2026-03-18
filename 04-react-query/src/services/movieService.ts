import axios from 'axios';
import type { Movie } from '../types/movie';

const API_KEY = '4af407c60d96adf1763b16ccc6373277';

export interface FetchMoviesParams {
  query: string;
  page?: number;
}

export interface FetchMoviesResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export const fetchMovies = async ({ query, page = 1 }: FetchMoviesParams) => {
  if (!query.trim()) throw new Error('Query must not be empty');

  const response = await axios.get<FetchMoviesResponse>(
    'https://api.themoviedb.org/3/search/movie',
    {
      params: {
        api_key: API_KEY,
        query,
        page,
      },
    }
  );

  return response.data;
};