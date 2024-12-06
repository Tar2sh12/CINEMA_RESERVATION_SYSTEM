import React, { useEffect, useState } from "react";
import { getAuthToken } from "../../services/auth";
import axios from "axios";
import HeaderVendor from "../../components/vendor-components/vendor.header";
import styled from 'styled-components';
import { io } from 'socket.io-client';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// Styled Components
const ReservationContainer = styled.div`
  width: 80%;
  max-width: 1000px;
  margin: 30px auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
`;

const ReservationHeader = styled.h1`
  text-align: center;
  font-size: 24px;
  color: #e94560;
  margin-bottom: 20px;
`;

const ReservationTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
`;

const TableHeader = styled.th`
  padding: 10px;
  text-align: left;
  border: 1px solid #ddd;
  background-color: #e94560;
  color: white;
`;

const TableData = styled.td`
  padding: 10px;
  text-align: left;
  border: 1px solid #ddd;
  font-size: 1rem;
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #f2f2f2;
  }

  &:hover {
    background-color: #f1f1f1;
  }
`;
const MovieReservations = () => {
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
  const { token } = getAuthToken();
//   console.log({ token, user });
  const [reservations, setReservations] = useState([]);


  useEffect(() => {
    axios
      .get("http://localhost:4040/movie/moviesOfSpecificVendor", {
        headers: {
          token: `movies ${token}`,
        },
      })
      .then((resposne) => {
        console.log(resposne?.data?.data);
        
        reservations.length = 0;
        resposne?.data?.data?.map((movie) => {
          movie?.time_reservation?.map((time_users) => {
            //formatDate(new Date(time_users?.time_available))
            time_users?.usersId?.map((user) => {
              reservations.push({
                movieName: movie?.title,
                email: user?.userId?.email,
                reservationDate: formatDate(new Date(time_users?.time_available)),
                seatsReserved: user?.seats_reserved.toString(),
              });
            });
          });
        });
        setReservations([...reservations]);
      })
      .catch((errors) => {
        console.log(errors.response.data);
      });
  }, []);
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
    <HeaderVendor/>
    <ToastContainer position="top-right" autoClose={5000} hideProgressBar newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
    <ReservationContainer>
      <ReservationHeader>Reservation Details</ReservationHeader>
      <ReservationTable>
        <thead>
          <tr>
            <TableHeader>Movie Name</TableHeader>
            <TableHeader>Customer Email</TableHeader>
            <TableHeader>Date of Reservation</TableHeader>
            <TableHeader>Seats Reserved</TableHeader>
          </tr>
        </thead>
        <tbody>
          {reservations.map((reservation, index) => (
            <TableRow key={index}>
              <TableData>{reservation.movieName}</TableData>
              <TableData>{reservation.email}</TableData>
              <TableData>{reservation.reservationDate}</TableData>
              <TableData>{reservation.seatsReserved}</TableData>
            </TableRow>
          ))}
        </tbody>
      </ReservationTable>
    </ReservationContainer>
    {/* <div className="container my-5">
      <h1 className="text-center mb-4">Movie Reservations</h1>
      <table className="table custom-table table-hover table-bordered">
        <thead>
          <tr>
            <th>Movie Name</th>
            <th>Customer Name</th>
            <th>Date of Reservation</th>
            <th>Seats Reserved</th>
          </tr>
        </thead>
        <tbody>
          {reservations.map((res, index) => (
            <tr key={index}>
              <td>{res.movieName}</td>
              <td>{res.customerName}</td>
              <td>{res.reservationDate}</td>
              <td>{res.seatsReserved}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div> */}
    </>
  );
};

export default MovieReservations;
