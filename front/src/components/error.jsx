import React from 'react'
import { useNavigate } from "react-router-dom";
import { getAuthToken, removeAuthToken } from "../services/auth";
const Error = () => {
  const navigate = useNavigate();
  return (
    <div>
      <h1>this path does not exis </h1>
      <button onClick={()=>{navigate("/login");  removeAuthToken(); }}>login again</button>
    </div>
  )
}

export default Error;
