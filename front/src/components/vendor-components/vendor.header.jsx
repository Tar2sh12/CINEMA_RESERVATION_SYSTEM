import React from 'react';
import { useNavigate } from 'react-router-dom'; 
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
} from './header.js'; // Import your styled components

const HeaderVendor = () => {
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
          <StyledLink onClick={()=>{navigate("/vendor-home")}}>Home</StyledLink>
          <StyledLink onClick={()=>{navigate("/my-movies")}}>Movies</StyledLink>
          <StyledLink onClick={()=>{navigate("/reservations")}}>Reservation</StyledLink>
          <StyledLink onClick={()=>{navigate("/vendor-movies")}}>Add Movie</StyledLink>
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

export default HeaderVendor;
