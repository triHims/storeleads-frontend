import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./AuthPage.module.css";
import { useInput } from "../../hooks/useInput.js";
import { ReactiveLabel } from "../MainScreen/StartPanel/ReactiveLabel";
import { ValidateEmail } from "../utils/HelperFunctions";

const Login = () => {
  const [emailInput, bindEmailInput, resetEmailInput, setEmailInput] =
    useInput();
  const [
    passwordInput,
    bindPasswordInput,
    resetPasswordInput,
    setPasswordInput,
  ] = useInput();
  return (
    <>
      <h3 className="fw-bold mb-3">Welcome Back</h3>
      <div className={`${styles.w__custom} form-floating mb-3 `}>
        <input
          type="email"
          className="form-control"
          id="emailInput"
          placeholder="name@example.com"
                    {...bindEmailInput}
        />
        <label>Email address</label>
      </div>
      <div className={`${styles.w__custom} form-floating mb-3 `}>
        <input
          type="password"
          className="form-control"
          id="password"
          placeholder="Password"
                    {...bindPasswordInput}
        />
        <label>Password</label>
      </div>
      <button
        type="button"
        className={`${styles.w__custom} btn btn-success mb-3`}
                disabled = {!emailInput || !passwordInput}
      >
        Login
      </button>
      <span>
        Don't have an account?
        <Link to={`/auth/signup`}> SignUp</Link>
      </span>
    </>
  );
};

const SignUp = () => {
  const [emailInput, bindEmailInput, resetEmailInput, setEmailInput] =
    useInput();
  const [
    passwordInput,
    bindPasswordInput,
    resetPasswordInput,
    setPasswordInput,
  ] = useInput();
  const [
    confirmPasswordInput,
    bindConfirmPasswordInput,
    resetConfirmPasswordInput,
    setConfirmPasswordInput,
  ] = useInput();

  const [labelEmailVerify, setLabelEmailVerify] = useState({
    hint: "",
    message: "",
  });
  const [labelconfirmPassword, setLabelConfirmPassword] = useState({
    hint: "",
    message: "",
  });

  useEffect(() => {
    let timeOutHandle = setTimeout(() => {
      setLabelEmailVerify({ hint: "", message: "" });
      if (emailInput) {
        if (!ValidateEmail(emailInput)) {
          setLabelEmailVerify({ hint: "ERROR", message: "Email is invalid" });
        } else {
          setLabelEmailVerify({ hint: "SUCCESS", message: "" });
        }
      }
    }, 500);
    return () => {
      clearTimeout(timeOutHandle);
    };
  }, [emailInput]);
  useEffect(() => {
    let timeOutHandle = setTimeout(() => {
      setLabelConfirmPassword({ hint: "", message: "" });
      if (passwordInput) {
        if (passwordInput !== confirmPasswordInput) {
          setLabelConfirmPassword({
            hint: "ERROR",
            message: "Passwords Do not match",
          });
        } else {
          setLabelConfirmPassword({
            hint: "SUCCESS",
            message: "Passwords match",
          });
        }
      }
    }, 500);
    return () => {
      clearTimeout(timeOutHandle);
    };
  }, [passwordInput, confirmPasswordInput]);
  return (
    <>
      <h3 className="fw-bold mb-3">Welcome</h3>
      <span>Please create your account</span>
      <div className="mb-3">
        <div className={`${styles.w__custom} input-group has-validation`}>
          <div className="form-floating is-invalid">
            <input
              type="email"
              className="form-control"
              id="emailInput"
              placeholder="name@example.com"
              name="email"
              {...bindEmailInput}
            />
            <label>Email address</label>
          </div>
        </div>
        <ReactiveLabel {...labelEmailVerify} />
      </div>
      <div className="mb-3">
        <div className={`${styles.w__custom} input-group has-validation`}>
          <div className="form-floating">
            <input
              type="password"
              className="form-control"
              id="password"
              placeholder="Password"
              name="password"
              {...bindPasswordInput}
            />
            <label>Password</label>
          </div>
        </div>
      </div>
      <div className="mb-3">
        <div className={`${styles.w__custom} input-group has-validation `}>
          <div className="form-floating">
            <input
              type="password"
              className="form-control"
              id="confirm-password"
              placeholder="Password"
              name="confirmpassword"
              {...bindConfirmPasswordInput}
            />
            <label>Confirm Password</label>
          </div>
        </div>
        <ReactiveLabel {...labelconfirmPassword} />
      </div>
      <button
        type="button"
        className={`${styles.w__custom} btn btn-success mb-3`}
        disabled={
          labelEmailVerify.hint !== "SUCCESS" ||
          labelconfirmPassword.hint !== "SUCCESS"
        }
      >
        SignUp
      </button>
      <span>
        Have an account Already?
        <Link to={`/auth/login`}> Login </Link>
      </span>
    </>
  );
};

const AuthPage = ({ authState }) => {
  const style = {
    background: "white",
    color: "black",
  };
  return (
    <div style={style} className="container-fluid">
      <div className="d-flex flex-column  align-items-center justify-content-center h-100">
        {authState === "LOGIN" ? <Login /> : <SignUp />}
      </div>
    </div>
  );
};

export default AuthPage;
