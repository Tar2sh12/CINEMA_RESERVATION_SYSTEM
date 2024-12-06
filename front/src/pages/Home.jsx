
import React, { useEffect } from "react";
import { getAuthToken } from "../services/auth";
import { useNavigate } from "react-router-dom";

import HeaderVendor from "../components/vendor-components/vendor.header";
import styled from "styled-components";
import { io } from 'socket.io-client';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// Styled Components
const WelcomeMessage = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const WelcomeTitle = styled.h1`
  font-size: 2.5rem;
  color: #e94560;
  font-weight: bold;
  letter-spacing: 1px;
  text-transform: capitalize;
`;

const OptionsContainer = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 2rem;
  gap: 1.5rem;
`;

const OptionCard = styled.div`
  background-color: #e94560;
  color: #fff;
  width: 300px;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.5);
  }
`;

const OptionCardTitle = styled.h2`
  font-size: 1.8rem;
  margin-bottom: 1rem;
`;

const OptionCardText = styled.p`
  font-size: 1rem;
  line-height: 1.5;
`;
function Home() {
  // const e = useContext(Mo);
  const navigate = useNavigate();

  useEffect(() => {
    const socket = io('http://localhost:4040'); // Backend URL

    // Listen for notifications
    socket.on('newMovie', (message) => {

      console.log(message);
      toast.info(message.message);
    });
    
    return () => {
      socket.disconnect();
    };
  }, []);
  return (
    <>
      <HeaderVendor />
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
      <WelcomeMessage>
        <WelcomeTitle>
          Welcome {getAuthToken().user.role} {getAuthToken().user.unique_name}
        </WelcomeTitle>
      </WelcomeMessage>

      {/* Options Container */}
      <OptionsContainer>
        {/* Option Cards */}
        <OptionCard
          onClick={() => {
            navigate("/my-movies");
          }}
        >
          <OptionCardTitle>Your Movies</OptionCardTitle>
          <OptionCardText>View your movies list.</OptionCardText>
        </OptionCard>

        <OptionCard
          onClick={() => {
            navigate("/vendor-movies");
          }}
        >
          <OptionCardTitle>Add Movies</OptionCardTitle>
          <OptionCardText>Add new movies to your Customers.</OptionCardText>
        </OptionCard>

        <OptionCard
          onClick={() => {
            navigate("/reservations");
          }}
        >
          <OptionCardTitle>Reservation</OptionCardTitle>
          <OptionCardText>Customer reservations</OptionCardText>
        </OptionCard>
      </OptionsContainer>

      
    </>
  );
}

export default Home;
