import axios from "axios";
import React, { useContext, useRef, useState } from "react";
import "./registerStyles/register.css";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { Alert, Collapse } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

function Register() {
  const { setRegisterSucess } = useContext(AuthContext);
  const username = useRef();
  const email = useRef();
  const password = useRef();
  const passwordAgain = useRef();
  const navigate = useNavigate();
  const [passwordError, setPasswordError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleClick = async (e) => {
    e.preventDefault();
    // check  password again
    if (passwordAgain.current.value !== password.current.value) {
      setPasswordError(true);
    } else {
      const user = {
        username: username.current.value,
        email: email.current.value,
        password: password.current.value,
      };
      try {
        await axios.post("/auth/register", user);
        setRegisterSucess(true);
        navigate("/login");
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <div className="register">
      <div className="registerWrapper">
        <div className="registerLeft">
          <h3 className="registerLogo">FakeBook</h3>
          <span className="registerDesc">
            Connect with friends and the world around you on FakeBook.
          </span>
        </div>
        <div className="registerRight">
          <form className="registerBox" onSubmit={handleClick}>
            <input
              placeholder="Username"
              ref={username}
              required
              className="registerInput"
            />
            <input
              placeholder="Email"
              ref={email}
              required
              className="registerInput"
              type="email"
            />
            <input
              placeholder="Password"
              ref={password}
              required
              className="registerInput"
              type={showPassword ? "text" : "password"}
              minLength="6"
              onChange={() => setPasswordError(false)}
            />
            <input
              placeholder="Password Again"
              ref={passwordAgain}
              required
              className="registerInput"
              type={showPassword ? "text" : "password"}
              minLength="6"
              onChange={() => setPasswordError(false)}
            />
            {showPassword ? (
              <VisibilityOff
                onClick={() => setShowPassword(false)}
                className="showPasswordIcon"
              />
            ) : (
              <Visibility
                onClick={() => setShowPassword(true)}
                className="showPasswordIcon"
              />
            )}

            <Collapse in={passwordError}>
              <Alert severity="error" className="passwordErrorMessage">
                Password must be consistent, please try again
              </Alert>
            </Collapse>
            <button className="registerButton">Sign Up</button>
            <button
              className="registerLoginButton"
              onClick={() => navigate("/login")}
            >
              Log into Account
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
export default Register;
