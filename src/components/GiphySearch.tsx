import React from "react";
import {
  Container,
  Typography,
  TextField,
  Grid,
  Pagination,
  CircularProgress,
} from "@mui/material";
import { Gif } from "../types";
import useGiphySearch from "../hooks/useGiphySearch";

// Define how many results to display per page
const resultsPerPage = 25;

const GiphySearch = () => {
  const {
    gifs,
    totalResults,
    currentPage,
    handlePageChange,
    setSearchQuery,
    error,
    isLoading,
    noRecordsDisplay,
    searchQuery,
  } = useGiphySearch(resultsPerPage);

  // Handle the form submission to update the search query
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSearchQuery(event.currentTarget.search.value);
  };

  return (
    <Container maxWidth="lg" sx={{ paddingTop: 8, paddingBottom: 8 }}>
      <Typography variant="h1" sx={{ marginBottom: 4, textAlign: "center" }}>
        Giphy Search
      </Typography>

      <form onSubmit={handleSubmit}>
        <TextField
          name="search"
          label="Search for GIFs"
          variant="outlined"
          fullWidth
          margin="normal"
          autoFocus
          onChange={(event) => setSearchQuery(event.target.value)}
        />
        {/* Display an error message if there was an issue with the API */}

        {error && <p>{error}</p>}
        {isLoading ? (
          <Grid container justifyContent="center">
            <CircularProgress />
          </Grid>
        ) : gifs.length > 0 ? (
          <Grid container spacing={1}>
            {gifs.map((gif: Gif) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={gif.id}>
                <img
                  src={gif.images.fixed_height.url}
                  alt={gif.title}
                  width="100%"
                />
              </Grid>
            ))}
          </Grid>
        ) : (
          searchQuery.length !== 0 &&
          totalResults === 0 &&
          noRecordsDisplay && (
            <Typography variant="body1" align="center" color="text.secondary">
              No results found.
            </Typography>
          )
        )}
      </form>

      {!isLoading && totalResults > 0 && resultsPerPage && (
        <Pagination
          count={Math.ceil(totalResults / resultsPerPage)}
          page={currentPage}
          onChange={handlePageChange}
          shape="rounded"
          size="large"
          showFirstButton
          showLastButton
          sx={{ marginTop: 4, display: "flex", justifyContent: "center" }}
        />
      )}
    </Container>
  );
};

export default GiphySearch;
