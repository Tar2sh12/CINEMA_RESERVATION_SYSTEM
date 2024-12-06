import React from 'react';
import {  useNavigate } from 'react-router-dom'; 
import { removeAuthToken } from '../../services/auth'; 
import {
  CinemaHeader,
  CinemaNav,
  CinemaLogo,
  CinemaLogoText,
  CinemaNavLinks,
  StyledLink,
  CinemaNavLogout,
  CinemaLogoutButton
} from '../vendor-components/header.js'; // Import your styled components

const HeaderCustomer = () => {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    removeAuthToken();
    navigate("/login");
  };
  
  return (
    <CinemaHeader>
      <CinemaNav>
        {/* Left side: Logo (text) */}
        <CinemaLogo>
          <CinemaLogoText>Cinema Site</CinemaLogoText>
        </CinemaLogo>

        {/* Center: navigation links */}
        <CinemaNavLinks>
          <StyledLink onClick={()=>{navigate("/customer-home")}}>Home</StyledLink>
          <StyledLink onClick={()=>{navigate("/customer-home")}}>Movies</StyledLink>
          <StyledLink onClick={()=>{navigate("/customer-home")}}>My Reservations</StyledLink>
        </CinemaNavLinks>
        {/* Right side: Logout button */}
        <CinemaNavLogout>
          <CinemaLogoutButton onClick={handleLogout}>
            Logout
          </CinemaLogoutButton>
        </CinemaNavLogout>
      </CinemaNav>
    </CinemaHeader>
  );
};

export default HeaderCustomer;
