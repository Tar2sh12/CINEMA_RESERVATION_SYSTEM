import React, { useEffect, useState } from 'react';
import { getAuthToken } from '../../services/auth';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import HeaderVendor from '../../components/vendor-components/vendor.header';
import styled from 'styled-components';
import { io } from 'socket.io-client';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Loader } from '../../components/loader';
// Styled Components
const AddMovieContainer = styled.div`
  width: 100%;
  max-width: 600px;
  margin: 20px auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
`;

const AddMovieHeader = styled.h1`
  text-align: center;
  font-size: 24px;
  color: #e94560;
  margin-bottom: 20px;
`;

const AddMovieForm = styled.form`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  display: block;
  font-weight: bold;
  margin-top: 10px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin-top: 5px;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: 1rem;
  outline: none;
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 10px;
  margin-top: 5px;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: 1rem;
  outline: none;
  resize: vertical;
`;

const MovieTimesContainer = styled.div`
  margin-top: 10px;
`;

const MovieTime = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
`;

const MovieTimeInput = styled.input`
  width: 100%;
  padding: 10px;
  margin-top: 5px;
  border-radius: 5px;
  border: 1px solid #ccc;
`;

const Button = styled.button`
  margin-top: 20px;
  padding: 12px 20px;
  border: none;
  background-color: #e94560;
  color: white;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  border-radius: 5px;
  width: 100%;
  &:hover {
    background-color: #d73853;
  }
`;

const MovieForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: null,
    releaseDates: [] // Array to store release dates as strings
  });

  // Handle input change for text fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle file change for movie image
  const handleImageChange = (e) => {
    setFormData({
      ...formData,
      image: e.target.files[0]
    });
  };

  // Handle dynamic date field change
  const handleDateChange = (index, e) => {
    const { value } = e.target;
    const updatedReleaseDates = [...formData.releaseDates];
    updatedReleaseDates[index] = value; // Directly store the datetime string
    setFormData({
      ...formData,
      releaseDates: updatedReleaseDates
    });
  };

  // Handle adding a new date
  const handleAddDate = () => {
    setFormData({
      ...formData,
      releaseDates: [...formData.releaseDates, ''] // Start with an empty string for the new date
    });
  };

  // Handle removing a date
  const handleRemoveDate = (index) => {
    const updatedReleaseDates = formData.releaseDates.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      releaseDates: updatedReleaseDates
    });
  };

  const navigate = useNavigate();
  const { token } = getAuthToken();

  const [fetching, setFetching] = useState(false);
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    setFetching(true); // Start fetching
    const dates = formData.releaseDates.map(dateTime => {
      const [date, time] = dateTime.split('T');
      const [y, m, d] = date.split('-');
      const [h, min] = time.split(':');
      return {
        y,
        m: parseInt(m, 10) - 1, // month is 0-based
        d,
        h,
        min
      };
    });

    console.log('Form Data:', dates);

    // Uncomment to send the request
    axios
      .post("http://localhost:4040/movie/create", {
        title: formData.title,
        dates,
        image: formData.image,
        description: formData.description
      }, {
        headers: {
          'Content-Type': 'multipart/form-data',
          token: `movies ${token}`,
        }
      })
      .then((response) => {
        setFetching(false);
        navigate('/vendor-home');
      })
      .catch((errors) => {
        console.log(errors.response.data);
      });
  };
  useEffect(() => {
    const socket = io('http://localhost:4040');
    socket.on('newMovie', (message) => {
      toast.info(message.message);
    });
    return () => {
      socket.disconnect();
    };
  }, []);
  return (
    <>
      <HeaderVendor />
      {(fetching ) && <Loader />}
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
      <AddMovieContainer>
        <AddMovieHeader>Add a New Movie</AddMovieHeader>
        <AddMovieForm>
          {/* Movie Title */}
          <Label htmlFor="movie-title">Movie Title</Label>
          <Input
            type="text"
            id="movie-title"
            name="title"
            placeholder="Enter movie title"
            value={formData.title}
            onChange={handleChange}
            required
          />

          {/* Movie Image */}
          <Label htmlFor="movie-image">Movie Image</Label>
          <Input
            type="file"
            id="movie-image"
            name="image"
            accept="image/*"
            onChange={handleImageChange}
            required
          />

          {/* Movie Description */}
          <Label htmlFor="movie-description">Movie Description</Label>
          <Textarea
            id="movie-description"
            name="description"
            placeholder="Enter movie description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            required
          />

          {/* Movie Available Times */}
          <Label>Movie Available Times</Label>
          <MovieTimesContainer>
            {formData.releaseDates.map((dateTime, index) => (
              <MovieTime key={index}>
                <Label htmlFor={`movie-time-${index}`}>Select Date & Time</Label>
                <MovieTimeInput
                  type="datetime-local"
                  id={`movie-time-${index}`}
                  name={`dateTime-${index}`}
                  value={dateTime} // Store and display the entire datetime string
                  onChange={(e) => handleDateChange(index, e)}
                  required
                />
                {formData.releaseDates.length > 1 && (
                  <Button type="button" onClick={() => handleRemoveDate(index)}>
                    Remove Date
                  </Button>
                )}
              </MovieTime>
            ))}
          </MovieTimesContainer>

          {/* Add Date Button */}
          <Button type="button" onClick={handleAddDate}>
            Add Date
          </Button>

          {/* Submit Button */}
          <Button type="submit" onClick={handleSubmit}>
            Add Movie
          </Button>
        </AddMovieForm>
      </AddMovieContainer>
    </>
  );
};

export default MovieForm;
