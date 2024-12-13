import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { getAuthToken } from "../../services/auth";
import HeaderCustomer from "../../components/customer-components/customer.header";
import axios from "axios";


//graphql 
import { useQuery, gql } from '@apollo/client';
import { Loader } from "../../components/loader";
// Define the GraphQL query
const GET_MOVIES = gql`
query ListMovies {
  listMovies {
      _id
      title
      description
      slug
      createdBy
      customId
      createdAt
      updatedAt
      time_reservation {
          time_available
          _id
          usersId {
              userId
              seats_reserved
          }
      }
      Images {
          secure_url
          public_id
      }
  }
}
`;

// Styled components
const MoviesContainer = styled.div`
  width: 80%;
  max-width: 1200px;
  margin: 30px auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
`;

const MoviesHeader = styled.h1`
  text-align: center;
  font-size: 2rem;
  color: #e94560;
  margin-bottom: 30px;
`;

const MoviesCards = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
`;

const MovieCard = styled.div`
  width: 30%;
  margin-bottom: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  text-align: center;
  padding: 15px;

  @media (max-width: 768px) {
    width: 45%;
  }

  @media (max-width: 480px) {
    width: 100%;
  }
`;

const MovieImage = styled.img`
  width: 100%;
  height: auto;
  border-radius: 8px;
`;

const MovieTitle = styled.h3`
  font-size: 1.5rem;
  color: #333;
  margin: 15px 0;
`;

const MovieDescription = styled.p`
  font-size: 1rem;
  color: #666;
  margin-bottom: 20px;
`;

const ReservationButton = styled.button`
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

// Main Component
const CustomerHome = () => {
  const navigate = useNavigate();
  const { token } = getAuthToken();
  const [movies, setMovies] = useState([]);
  const { loading, error, data } = useQuery(GET_MOVIES);
  useEffect(() => {
    if(data){
      setMovies(data.listMovies);
    }
    
    //setMovies(data.listMovies);
    // axios
    //   .get("http://localhost:4040/movie", {
    //     headers: {
    //       token: `movies ${token}`,
    //     },
    //   })
    //   .then((response) => {
    //     const fetchedMovies = response?.data?.data || []; // Ensure safe data access
    //     // const movieData = fetchedMovies.map((mv) => ({
    //     //   title: mv.title,
    //     //   description: mv.description,
    //     //   imageUrl: mv.Images?.secure_url, // Ensure safe access to image URL
    //     //   times:mv.time_reservation.map((t) => formatDate(new Date(t.time_available))+"--") || [], // Ensure there is a 'times' array
    //     // }));

    //     setMovies(fetchedMovies); // Update state with new movie data
    //     console.log(movies);
    //   })
    //   .catch((error) => {
    //     console.log(error.response?.data || error);
    //   });
  }, [loading]);



  

  if (loading) return <Loader />;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <>
      <HeaderCustomer />
      <style>
        {`
          .curtain {
    top: 0px;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    z-index: 9999;
}


.curtain .left, .curtain .right {
    position: absolute;
    top: 72px;
    width: 50%;
    height: 100%;
    background: linear-gradient(90deg, rgba(179, 0, 0, 1), rgba(102, 0, 0, 0.8));
    background-size: 100px 100%; 
    background-repeat: repeat-x; 
    border-bottom: solid 10px rgba(102, 0, 0, 0.6);
    box-shadow: 0 0 30px rgba(0, 0, 0, 0.5);
    border-radius: 0;
}


.curtain .left {
    left: 0;
    transform-origin: left;
    animation: openLeft 2s ease-out forwards;
}


.curtain .right {
    right: 0;
    transform-origin: right;
    animation: openRight 2s ease-out forwards;
}

@keyframes openLeft {
    0% {
        transform: scaleX(1);
    }
    100% {
        transform: scaleX(0);
    }
}

@keyframes openRight {
    0% {
        transform: scaleX(1);
    }
    100% {
        transform: scaleX(0);
    }
}

.content {
    position: absolute;
    z-index: 1;
    color: white;
    font-size: 2rem;
    text-align: center;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    visibility: hidden; /* Content hidden until curtain opens */
}


.curtain.open .content {
    visibility: visible;
}

.curtain:hover .left, .curtain:hover .right {
    animation-play-state: running;
}
        `}
      </style>
      <div className="curtain">
        <div className="left"></div>
        <div className="right"></div>
      </div>

      <MoviesContainer>
        <MoviesHeader>Movies Available</MoviesHeader>
        <MoviesCards>
          {movies.length === 0 ? (
            <MoviesHeader>No movies available</MoviesHeader>
          ) : (
            movies.map((movie, index) => (
              <MovieCard key={index}>
                <MovieImage src={movie.Images?.secure_url} alt="Movie 1" />
                <MovieTitle>{movie.title}</MovieTitle>
                <MovieDescription>{movie.description}</MovieDescription>
                <ReservationButton
                  onClick={() => {
                    navigate(`/reserve/${movie._id}`);
                  }}
                >
                  Reservation
                </ReservationButton>
              </MovieCard>
            ))
          )}
        </MoviesCards>
      </MoviesContainer>
    </>
  );
};

export default CustomerHome;
