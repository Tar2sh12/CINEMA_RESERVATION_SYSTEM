import styled from 'styled-components';
import { Link } from 'react-router-dom'; 

export const CinemaHeader = styled.header`
  background-color: rgba(0, 0, 0, 0.8);
  padding: 1rem 2rem;
  width: 100%;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const CinemaNav = styled.nav`
  display: flex;
  justify-content: space-between;
  width: 100%;
  align-items: center;
`;

export const CinemaLogo = styled.div`
  display: flex;
  align-items: center;
`;

export const CinemaLogoText = styled.span`
  font-size: 1.8rem;
  font-weight: bold;
  color: #e94560;
  letter-spacing: 2px;
  text-transform: uppercase;
  cursor: pointer;
`;

export const CinemaNavLinks = styled.div`
  display: flex;
  gap: 1.5rem;
`;

export const StyledLink = styled(Link)`
  color: #f4f4f4;
  text-decoration: none;
  font-size: 1.1rem;
  font-weight: bold;
  transition: color 0.3s ease;

  &:hover {
    color: #e94560;
  }
`;

export const CinemaNavLogout = styled.div`
  display: flex;
  align-items: center;
`;

export const CinemaLogoutButton = styled.button`
  padding: 10px 20px;
  background-color: #e94560;
  color: white;
  font-size: 1rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;

  &:hover {
    background-color: #d73853;
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.98);
  }
`;
