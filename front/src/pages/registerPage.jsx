import React, { useState } from "react";
import { ToastContainer } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

// Styled Components
const Body = styled.body`
  margin: 0;
  font-family: 'Arial', sans-serif;
  background: url('./../assets/image.png') no-repeat center center/cover;
  background-size: cover;
  background-position: center;
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100%; /
`;

const SignupContainer = styled.div`
  background: rgba(0, 0, 0, 0.8);
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
  width: 350px;
  text-align: center;
`;

const Header = styled.div`
  .header img {
    width: 100px;
    margin-bottom: 1rem;
  }

  .header h1 {
    font-size: 1.8rem;
    margin-bottom: 1.5rem;
  }
`;

const SignupForm = styled.form`
  label {
    display: block;
    text-align: left;
    margin-top: 1rem;
    font-weight: bold;
    color: #f4f4f4;
  }

  input, select {
    width: 100%;
    padding: 10px;
    margin-top: 0.5rem;
    border: none;
    border-radius: 5px;
    outline: none;
    font-size: 1rem;
    color: #1a1a2e;
    background-color: #f4f4f4;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    transition: all 0.3s ease;
  }

  input:focus, select:focus {
    box-shadow: 0 4px 12px rgba(50, 50, 93, 0.3);
  }
`;

const SignupButton = styled.button`
  margin-top: 1.5rem;
  width: 100%;
  padding: 10px;
  border: none;
  border-radius: 5px;
  background-color: #e94560;
  color: #fff;
  font-size: 1.1rem;
  font-weight: bold;
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

const SignupFooter = styled.p`
  margin-top: 1.5rem;
  font-size: 0.9rem;
  color: #ddd;
  text-align: center;

  a {
    color: #e94560;
    text-decoration: none;
    font-weight: bold;
    transition: color 0.3s ease;

    &:hover {
      color: #d73853;
    }
  }
`;

const ErrorMessage = styled.div`
  color: #e7503d;
  font-size: 1rem;
  margin-top: 10px;
  background-color: #f8d7da;
  padding: 10px;
  border-radius: 5px;
`;

const RegisterPage = () => {
  const navigate = useNavigate();
  const [err, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    userRole: "Vendor",
    age: null,
    gender: "male",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:4040/user/signup", {
        userName: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        userType: formData.userRole,
        age: parseInt(formData.age),
        gender: formData.gender,
      })
      .then(() => {
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />;
      })
      .catch((errors) => {
        setError([{ msg: errors.response.data.err_data }]);
      });
  };

  const error = () => {
    return (
      <ErrorMessage>
        {err?.map((err, index) => {
          return <div key={index}>{err.msg}</div>;
        })}
      </ErrorMessage>
    );
  };

  return (
    <Body>
      {err !== null && error()}
      <SignupContainer>
        <Header>
          <h1>Join Our Cinema World</h1>
        </Header>
        <SignupForm onSubmit={handleSubmit}>
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Enter your name"
            value={formData.name}
            onChange={handleChange}
          />

          <label htmlFor="age">Age</label>
          <input
            type="number"
            id="age"
            name="age"
            placeholder="Enter your age"
            value={formData.age}
            onChange={handleChange}
          />

          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
          />

          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Create a password"
            value={formData.password}
            onChange={handleChange}
          />

          <label htmlFor="phone">Phone Number</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            placeholder="Enter your phone number"
            value={formData.phone}
            onChange={handleChange}
          />

          <label htmlFor="userRole">Type</label>
          <select
            id="userRole"
            name="userRole"
            value={formData.userRole}
            onChange={handleChange}
          >
            <option value="vendor">Vendor</option>
            <option value="customer">Customer</option>
          </select>

          <label htmlFor="gender">Gender</label>
          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>

          <SignupButton type="submit">Sign Up</SignupButton>
        </SignupForm>
        <SignupFooter>
          Already have an account?{" "}
          <a onClick={() => navigate("/login")}>Sign In</a>
        </SignupFooter>
      </SignupContainer>
    </Body>
  );
};

export default RegisterPage;
