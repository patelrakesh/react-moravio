import { useState, useEffect } from "react";
import { Gif } from "../types";

const API_KEY = "piS6rY1ftTn9Z53QW9Sn9FxJgVsy8UgM";
const API_BASE_URL = "https://api.giphy.com/v1/gifs/search";

const useGiphySearch = (resultsPerPage: number) => {
  const [gifs, setGifs] = useState<Gif[]>([]);
  const [totalResults, setTotalResults] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [noRecordsDisplay, setNoRecordsDisplay] = useState<boolean>(false);

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setCurrentPage(value);
  };

  const handleReset = () => {
    setGifs([]);
    setTotalResults(0);
    setCurrentPage(1);
    offset = 0;
  };

  // Calculate offset based on current page and results per page
  let offset = (currentPage - 1) * resultsPerPage;

  useEffect(() => {
    // If search query is empty, reset state variables and return
    if (searchQuery === "") {
      handleReset();
      return;
    }
    // If search query has atleast on character, reset state variables
    if (searchQuery.length === 1) {
      handleReset();
    }

    // Fetch data from Giphy API
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `${API_BASE_URL}?q=${searchQuery}&api_key=${API_KEY}&offset=${offset}&limit=${resultsPerPage}`
        );
        const data = await response.json();
        setGifs(data.data);
        setTotalResults(data?.pagination?.total_count);
        setError(null);
        setNoRecordsDisplay(true);
      } catch (error) {
        setError(
          "Failed to fetch data from Giphy API. Please try again later."
        );
      } finally {
        setIsLoading(false);
      }
    };

    // Add a timeout of 300ms to avoid triggering API calls too frequently
    const timeout = setTimeout(() => {
      fetchData();
    }, 300);

    return () => {
      clearTimeout(timeout);
    };
  }, [offset, resultsPerPage, searchQuery]);

  return {
    gifs,
    totalResults,
    currentPage,
    handlePageChange,
    setSearchQuery,
    error,
    isLoading,
    noRecordsDisplay,
    searchQuery,
  };
};

export default useGiphySearch;
