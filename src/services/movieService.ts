import axios from 'axios';
import type { Movie } from '../types/movie';

const BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_API_KEY;

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
        query,
        page,
      },
      headers: {
      Authorization: `Bearer ${API_KEY}`,
      }
    }
  );

  return response.data;
};