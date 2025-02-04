import React, { useState, useEffect } from "react";
import HeaderCustomer from "../../components/customer-components/customer.header";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { getAuthToken } from "../../services/auth";
import styled from "styled-components";
// Styled components
const Center = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(
    to right,
    rgb(162, 216, 162),
    linear-gradient(45deg, rgba(255, 255, 255, 0.05), rgba(205, 140, 56, 0.15))
  );
`;

const Tickets = styled.div`
  width: 550px;
  height: fit-content;
  border: 0.4mm solid rgba(0, 0, 0, 0.08);
  border-radius: 3mm;
  box-sizing: border-box;
  padding: 10px;
  font-family: "Poppins", sans-serif;
  max-height: 96vh;
  overflow: auto;
  background: white;
  box-shadow: 0px 25px 50px -12px rgba(0, 0, 0, 0.25);
`;

const TicketSelector = styled.div`
  background: rgb(243, 243, 243);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
`;

const Title = styled.div`
  font-size: 16px;
  font-weight: 600;
  text-align: center;
  margin-bottom: 30px;
`;

const Seats = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 150px;
  position: relative;
  
`;

const Status = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-evenly;
`;

const StatusItem = styled.div`
  font-size: 12px;
  position: relative;

  &::before {
    content: "";
    position: absolute;
    top: 50%;
    left: -12px;
    transform: translateY(-50%);
    width: 10px;
    height: 10px;
    border-radius: 0.3mm;
    background: ${(props) =>
      props.type === "available"
        ? "white"
        : props.type === "booked"
        ? "rgb(180, 180, 180)"
        : props.type === "selected"
        ? "#d73853"
        : "#39da56"};
    outline: ${(props) =>
      props.type === "available" ? "0.2mm solid rgb(120, 120, 120)" : "none"};
  }
`;
const ColoredLine = ({ color }) => (
    <hr
        style={{
            color: color,
            backgroundColor: color,
            height: 5
        }}
    />
);
const AllSeats = styled.div`
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  grid-gap: 15px;
  margin: 60px 0 20px;
`;

const Seat = styled.label`
  width: 20px;
  height: 20px;
  border-radius: 0.5mm;
  outline: 0.3mm solid rgb(180, 180, 180);
  cursor: pointer;
  background: ${(props) =>
    props.mine
      ? "rgb(56, 210, 9)"
      : props.booked
      ? "rgb(180, 180, 180)"
      : "white"};

  ${(props) =>
    props.checked &&
    `
    background: #d73853;
    outline: none;
  `}
`;

const Timings = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Dates = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
`;

const DateItem = styled.label`
  width: 50px;
  height: 40px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgb(233, 233, 233);
  border-radius: 2mm;
  padding: 10px 0;
  cursor: pointer;

  ${(props) =>
    props.selected &&
    `
    background: #d73853;
    color: white;
  `}
`;

const Price = styled.div`
  width: 100%;
  padding: 10px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Button = styled.button`
  background: rgb(60, 60, 60);
  color: white;
  font-family: "Poppins", sans-serif;
  font-size: 14px;
  padding: 7px 14px;
  border-radius: 2mm;
  border: none;
  cursor: pointer;
`;

const TicketBooking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, user } = getAuthToken();

  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [timeAndSeats, setTimeAndSeats] = useState([]);
  const [times, setTimes] = useState([]);
  const [oldSeats, setOldSeats] = useState([]);
  const [movie, setMovie] = useState({});
  useEffect(() => {
    axios
      .get(`http://localhost:4040/movie/specificMovie/${id}`, {
        headers: { token: `movies ${token}` },
      })
      .then((response) => {
        const fetchedMovies = response?.data?.data;
        const ts = [];
        const tss = [];
        setMovie(fetchedMovies);
        fetchedMovies.time_reservation.forEach((time) => {
          tss.push(time.time_available);
          if (time.usersId.length > 0) {
            time.usersId.forEach((u) => {
              const mine = user.userId === u.userId._id;
              u.seats_reserved.forEach((s) => {
                ts.push({
                  time: time.time_available,
                  id: s,
                  booked: true,
                  mine,
                });
              });
            });
          }
        });

        setTimes(tss);
        setTimeAndSeats(ts);
      })
      .catch((error) => console.error(error.response?.data || error));
  }, [id, token, user.userId]);

  // Generate random seats (for initial placeholder seats)
  useEffect(() => {
    const seatData = Array.from({ length: 47 }, (_, i) => ({
      id: i + 1,
      booked: false,
      mine: false,
    }));
    setSeats(seatData);
  }, []);

  const handleSeatChange = (seatId) => {
    const isSelected = selectedSeats.includes(seatId);
    const updatedSeats = isSelected
      ? selectedSeats.filter((id) => id !== seatId)
      : [...selectedSeats, seatId];

    setSelectedSeats(updatedSeats);
  };

  const handleDateChange = (selectedTime) => {
    setSelectedDate(selectedTime);
    const reservedSeats = [];
    const reserveDetails = [];
    const newOldSeats = [];

    const updatedSeats = Array.from({ length: 47 }, (_, i) => {
      const seatId = i + 1;
      timeAndSeats.forEach((ts) => {
        if (ts.time === selectedTime && ts.id === seatId) {
          reservedSeats.push(ts.id);
          reserveDetails.push({
            id: ts.id,
            booked: ts.booked,
            mine: ts.mine,
          });
          if (ts.mine) newOldSeats.push(ts.id);
        }
      });
      if (!reservedSeats.includes(seatId)) {
        return { id: seatId, booked: false, mine: false };
      }
      return reserveDetails.find((rd) => rd.id === seatId) || {};
    });

    setSeats(updatedSeats);
    setOldSeats(newOldSeats);
  };
  const formatDate = (date) => {
    const months = [
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
      "11",
      "12",
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
    return `${year}-${month}-${day}-${hours}:${formattedMinutes}-${ampm}`;
  };
  const handleReservationChange = (e) => {
    e.preventDefault();
    const seatsToDB = [...selectedSeats, ...oldSeats];

    axios
      .put(
        `http://localhost:4040/movie/reserveMovie/${id}`,
        { date: selectedDate, seats: seatsToDB },
        { headers: { token: `movies ${token}` } }
      )
      .then((res) => {
        navigate("/customer-home");
      })
      .catch((error) => console.error(error.response?.data || error));

    axios
      .put(
        `http://localhost:4040/movie/reserveMovie/${id}`,
        {
          date: selectedDate,
          seats: seatsToDB,
        },
        {
          headers: {
            token: `movies ${token}`,
          },
        }
      )
      .then((response) => {
        navigate("/customer-home");
      })
      .catch((error) => {
        console.log(error.response?.data || error);
      });
  };
const space=" "; 
  return (
    <>
      <HeaderCustomer />
      <Center >
        <Tickets>
          <TicketSelector>
            <Title>{movie.title}</Title>
            <style>
        {`
          .seats::before {
            content: "";
            position: absolute;
            bottom: 0;
            left: 50%;
            transform: translate(-50%, 0);
            width: 220px;
            height: 7px;
            background: rgb(141, 198, 255);
            border-radius: 0 0 3mm 3mm;
            border-top: 0.3mm solid rgb(180, 180, 180);
          }
        `}
      </style>
            <Seats className="seats">
              <Status>
                <StatusItem type="available">Available</StatusItem>
                <StatusItem type="booked">Booked</StatusItem>
                <StatusItem type="selected">Selected</StatusItem>
                <StatusItem type="mine">Mine</StatusItem>
              </Status>
              <AllSeats>
                {seats.map((seat) => (
                  <div key={seat.id} >
                    <input
                      type="checkbox"
                      id={`s${seat.id}`}
                      style={{ display: "none",alignContent: "center" }}
                      disabled={seat.booked || seat.mine}
                      checked={selectedSeats.includes(seat.id)}
                      onChange={() => handleSeatChange(seat.id)}
                    />
                    <Seat
                      htmlFor={`s${seat.id}`}
                      mine={seat.mine}
                      booked={seat.booked}
                      checked={selectedSeats.includes(seat.id)}
                    >
                     {`${seat.id < 10 ? "0" : ""}${seat.id}`}
                    </Seat>
                  </div>
                ))}
              </AllSeats>
            </Seats>
            <ColoredLine color="red" />
            <Timings>
              <Dates>
                {times.map((time, index) => (
                  <React.Fragment key={time}>
                    <input
                      type="radio"
                      id={time}
                      style={{ display: "none" }}
                      checked={time === selectedDate}
                      onChange={() => handleDateChange(time)}
                    />
                    <DateItem htmlFor={time} selected={time === selectedDate}>
                      <div className="day">{formatDate(new Date(time))}</div>
                    </DateItem>
                    
                  </React.Fragment>
                ))}
              </Dates>
            </Timings>
          </TicketSelector>
          <Price>
            <Button onClick={handleReservationChange}>Book</Button>
          </Price>
        </Tickets>
      </Center>
    </>
  );
};

export default TicketBooking;
