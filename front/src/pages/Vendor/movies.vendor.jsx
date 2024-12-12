import React, { useEffect, useState } from "react";
import axios from "axios";
import { getAuthToken } from "../../services/auth";
import HeaderVendor from "../../components/vendor-components/vendor.header";

import styled from 'styled-components';
import { io } from 'socket.io-client';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {  gql, useMutation } from '@apollo/client';
import { Loader } from "../../components/loader";

//=============================graphql=========================//
const DELETE_MOVIES = gql`
mutation DeleteMovie($id: ID!,$token: String!) {
  deleteMovie(token: $token, id: $id)
}
`;



//=====================styled components======================//

const MoviesContainer = styled.div`
  padding: 2rem;
  background-color: #f4f4f4;
  color: #e94560;
  text-align: center;
`;

const MoviesHeader = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 2rem;
  color: #e94560;
`;
const DeleteMovieButton = styled.button`
  background-color: #e94560;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s ease, transform 0.2s ease;

  &:hover {
    background-color: #d73853;
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.98);
  }
`;
const MoviesGrid = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap; /* Wrap elements into rows */
  gap: 1.5rem; /* Add space between rows and columns */
`;

const MovieCard = styled.div`
  flex: 1 1 calc(33.33% - 1rem); /* Adjust width for three cards per row */
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  padding: 1rem;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
  }
`;

const MoviePoster = styled.img`
  width: 100%;
  border-radius: 5px;
  margin-bottom: 1rem;
`;

const MovieDetails = styled.div`
  text-align: center;
`;

const MovieTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: #e94560;
`;

const MovieDescription = styled.p`
  font-size: 1rem;
  margin-bottom: 1rem;
`;

const MovieTimes = styled.p`
  font-size: 1rem;
  font-weight: bold;
`;


// MovieCards Component
const MovieCards = () => {
    const formatDate = (date) => {
        const months = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ];
    
        const year = date.getFullYear();
        const month = months[date.getMonth()];
        const day = date.getDate();
    
        // Get hours and minutes, adjusting for 12-hour format
        let hours = date.getHours();
        const minutes = date.getMinutes();
        const ampm = hours >= 12 ? "PM" : "AM";
    
        // Convert hours to 12-hour format
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
    
        // Format minutes (add leading zero if needed)
        const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;
    
        // Return the formatted string
        return `${year} ${month} ${day} ${hours}:${formattedMinutes} ${ampm}`;
      };
  const { token} = getAuthToken();
  const [movies, setMovies] = useState([]);
  const [fetching, setFetching] = useState(true);
  const  [deleteMovie, {  loading, error }] = useMutation(DELETE_MOVIES, {
    onCompleted: (data) => {


      toast.success(data.deleteMovie);
    },
    onError: (err) => {
      toast.error("Error deleting movie: " + err.message);
    },
  });
  useEffect(() => {
    setFetching(true); // Start fetching
    axios
      .get("http://localhost:4040/movie/moviesOfSpecificVendor", {
        headers: {
          token: `movies ${token}`,
        },
      })
      .then((response) => {
        const fetchedMovies = response?.data?.data || [];
        const movieData = fetchedMovies.map((mv) => ({
          _id: mv._id,
          title: mv.title,
          description: mv.description,
          imageUrl: mv.Images?.secure_url,
          times: mv.time_reservation.map((t) => formatDate(new Date(t.time_available)) + "--") || [],
        }));
        setMovies(movieData);
      })
      .catch((error) => {
        console.error(error.response?.data || error);
      })
      .finally(() => {
        setFetching(false); // End fetching
      });
  }, [token,loading]);
  useEffect(() => {
    const socket = io('http://localhost:4040');
    socket.on('newMovie', (message) => {
      toast.info(message.message);
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  
  if (loading) return <Loader />;
  if (error) return <p>Error: {error.message}</p>;
  return (
    <>
    
    <HeaderVendor/>
    {(fetching || loading) && <Loader />}
    <ToastContainer position="top-right" autoClose={2000} hideProgressBar newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
    <MoviesContainer>
      <MoviesHeader>Available Movies</MoviesHeader>
      <MoviesGrid>
      {movies.length === 0 ? (
        <MoviesHeader>No movies available</MoviesHeader>
      ) : (
        movies.map((movie, index) => (
          <MovieCard>
          <MoviePoster src={movie.imageUrl}  alt="Movie Poster" key={index} />
          <MovieDetails>
            <MovieTitle>{movie.title}</MovieTitle>
            <MovieDescription>{movie.description}</MovieDescription>
            <MovieTimes>{movie.times}</MovieTimes>
            <DeleteMovieButton
                  onClick={() => {
                    const id = movie._id;
                    const {token }= getAuthToken();
                    deleteMovie({ variables: { id, token:`movies ${token}` } });
                  }}
                >
                  delete movie
                </DeleteMovieButton>
          </MovieDetails>
        </MovieCard>
        ))
      )}
      </MoviesGrid>
    </MoviesContainer>
    </>
  );
};

export default MovieCards;
