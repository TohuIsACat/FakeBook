import React, { useContext, useRef, useState } from "react";
import "./loginStyles/login.css";
import { loginCall } from "../../apiCalls";
import { AuthContext } from "../../context/AuthContext";
import { Alert, CircularProgress, Collapse } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Visibility, VisibilityOff } from "@mui/icons-material";

function Login() {
  const email = useRef();
  const password = useRef();
  const { isFetching, dispatch, error, registerSucess, setRegisterSucess } =
    useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [errorOpen, setErrorOpen] = useState(true);

  // apiCalls
  const handleClick = (e) => {
    e.preventDefault();
    loginCall(
      { email: email.current.value, password: password.current.value },
      dispatch
    );
    setErrorOpen(true);
  };

  return (
    <div className="login">
      <div className="loginWrapper">
        <div className="loginLeft">
          <h3 className="loginLogo">FakeBook</h3>
          <span className="loginDesc">
            Connect with friends and the world around you on FakeBook.
          </span>
        </div>
        <div className="loginRight">
          <form className="loginBox" onSubmit={handleClick}>
            <Collapse in={registerSucess}>
              <Alert
                className="registerSucessMessage"
                onClose={() => {
                  setRegisterSucess(false);
                }}
                severity="success"
              >
                Register sucess, you can log in your account now!
              </Alert>
            </Collapse>
            <input
              placeholder="Email"
              type="email"
              required
              className="loginInput"
              ref={email}
              onChange={() => setErrorOpen(false)}
            />
            <input
              placeholder="Password"
              type={showPassword ? "text" : "password"}
              required
              minLength="6"
              className="loginInput"
              ref={password}
              onChange={() => setErrorOpen(false)}
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
            <Collapse in={error}>
              {error && errorOpen && (
                <Alert severity="error" className="errorMessage">
                  Wrong email or password
                </Alert>
              )}
            </Collapse>
            <button className="loginButton" disabled={isFetching}>
              {isFetching ? (
                <CircularProgress color="inherit" size="25px" />
              ) : (
                "Log In"
              )}
            </button>
            <span className="loginForgot">Forgot Password?</span>
            <button
              className="loginRegisterButton"
              onClick={() => navigate("/register")}
            >
              {isFetching ? (
                <CircularProgress color="inherit" size="25px" />
              ) : (
                "Create a New Account"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
