import React, { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; 
import { getAuthToken, setAuthToken } from "../services/auth"; 
import axios from "axios"; 
import styled from "styled-components";


const Container = styled.div`
  margin: 0;
  font-family: 'Arial', sans-serif;
  background: url('./../assets/image.png') no-repeat center center/cover;
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const SigninContainer = styled.div`
  background: rgba(20, 20, 20, 0.9);
  padding: 2.5rem;
  border-radius: 12px;
  box-shadow: 0 6px 25px rgba(0, 0, 0, 0.5);
  width: 320px;
  text-align: center;
`;

const SigninHeader = styled.div`
  margin-bottom: 1rem;
`;

const HeaderTitle = styled.h1`
  font-size: 1.6rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: #ffd700;
`;

const HeaderText = styled.p`
  font-size: 0.9rem;
  margin-bottom: 1.5rem;
  color: #f5f5f5;
`;

const SigninForm = styled.form``;

const FormLabel = styled.label`
  display: block;
  text-align: left;
  margin-top: 1rem;
  font-weight: bold;
  color: #f5f5f5;
`;

const FormInput = styled.input`
  width: 100%;
  padding: 10px;
  margin-top: 0.5rem;
  border: none;
  border-radius: 5px;
  outline: none;
  font-size: 1rem;
  background-color: #f8f8f8;
  color: #333;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;

  &:focus {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }
`;

const SigninButton = styled.button`
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

const SigninFooter = styled.p`
  margin-top: 1rem;
  font-size: 0.9rem;
  color: #ddd;
`;

const FooterLink = styled.a`
  color: #e94560;
  text-decoration: none;
  font-weight: bold;
  transition: color 0.3s ease;

  &:hover {
    color: #d73853;
  }
`;

// React Component

const Login = () => {
  const [err, setError] = useState(null);
  const navigate = useNavigate();
  const emailRef = useRef(null);

  useEffect(() => {
    if (emailRef.current) {
      emailRef.current.focus();
    }
  }, []);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      axios.post("http://localhost:4040/user/login", {
        email: formData.email,
        password: formData.password,
      }).then((res) => {
        setAuthToken(res.data.token);
        const { user } = getAuthToken();
        console.log(user);
        if (user.role === "Vendor") {
          navigate("/vendor-home");
        }
        else if(user.role === "Customer") {
          navigate("/customer-home");
        }
      }).catch((errors) => {
        console.log(errors.response.data.err_data);
        setError([{ msg: errors.response.data.err_data }]);
      });
    } catch (error) {
      setError([{ msg: "Something went wrong. Please try again later." }]);
    }
  }

  const error = () => {
    return (
      <div className="container">
        <div className="row">
          {Array.isArray(err) &&
            err.map((err, index) => (
              <div key={index} className="col-sm-12 alert alert-danger" role="alert">
                {err.msg}
              </div>
            ))}
        </div>
      </div>
    );
  };

  return (
    <Container>
      {err !== null && error()}
      <SigninContainer>
        <SigninHeader>
          <HeaderTitle>Welcome Back!</HeaderTitle>
          <HeaderText>Sign in to enjoy the latest movies and reserve your seats</HeaderText>
        </SigninHeader>
        <SigninForm onSubmit={handleSubmit}>
          <FormLabel htmlFor="signin-email">Email</FormLabel>
          <FormInput
            type="email"
            id="signin-email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            ref={emailRef}
          />

          <FormLabel htmlFor="signin-password">Password</FormLabel>
          <FormInput
            type="password"
            id="signin-password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
          />

          <SigninButton type="submit">Sign In</SigninButton>
        </SigninForm>
        <SigninFooter>
          Don't have an account?{" "}
          <FooterLink onClick={() => navigate("/register")}>Sign Up</FooterLink>
        </SigninFooter>
      </SigninContainer>
    </Container>
  );
};

export default Login;
