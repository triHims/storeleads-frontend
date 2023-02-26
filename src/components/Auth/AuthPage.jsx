import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./AuthPage.module.css";
import { useInput } from "../../hooks/useInput.js";
import { ReactiveLabel } from "../MainScreen/StartPanel/ReactiveLabel";
import { ValidateEmail } from "../utils/HelperFunctions";
import { authApi, processError } from "../servicecalls/serviceApi";
import Spinner from "react-bootstrap/esm/Spinner";
import { useAuth } from "./AuthProvider";

function dataFromError(e) {
  let data = e?.data;
  if (data) {
    let out = JSON.parse(data);
    return out;
  }
  return null;
}

async function loginUser(username, password, successCallBack) {
  try {
    let userToken = await authApi.loginUserAuthLoginPost(
      username,
      password,
      "password",
      "user"
    );

    let access_token = userToken?.data.access_token;

    let userData = await authApi.readUsersMeAuthUsersMeGet({
      headers: { Authorization: "Bearer " + access_token },
    });

    return {
      token: userToken.data?.access_token,
      user: userData.data,
    };
  } catch (e) {
    console.log(e);
    let errorRes = processError(e);
    console.error(errorRes);
    return Promise.reject(errorRes);
  }
}

async function signupUserAdapter(email, password, firstname, lastname) {
  try {
    let userSignUp = {
      email,
      firstname,
      lastname,
      password,
    };
    let createRes = await authApi.signupUserAuthSignupPost(userSignUp);

    return createRes;
  } catch (e) {
    console.log(e);
    let errorRes = processError(e);
    console.error(errorRes);
    return Promise.reject(errorRes);
  }
}

const Login = () => {
  const [emailInput, bindEmailInput, resetEmailInput, setEmailInput] =
    useInput();
  const [
    passwordInput,
    bindPasswordInput,
    resetPasswordInput,
    setPasswordInput,
  ] = useInput();

  const { login } = useAuth();
  const navigate = useNavigate();

  const [isWaiting, setIsWaiting] = useState(false);

  const loginHelper = () => {
    /* setIs */
    setIsWaiting(true);
    loginUser(emailInput, passwordInput)
      .then((data) => {
        login(data);

        navigate("/");
      })
      .catch((r) => {
        let data = dataFromError(r);

        alert("Login failed, " + data?.detail);
      })
      .finally((r) => {
        setIsWaiting(false);
      });
  };

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
      {!isWaiting ? (
        <button
          type="button"
          className={`${styles.w__custom} btn btn-success mb-3`}
          disabled={!emailInput || !passwordInput}
          onClick={() => {
            loginHelper();
          }}
        >
          Login
        </button>
      ) : (
        <div>
          <Spinner animation="border" variant="primary">
            <span className="visually-hidden">Loading</span>
          </Spinner>
        </div>
      )}
      <span>
        Don't have an account?
        <Link to={`/auth/signup`}> SignUp</Link>
      </span>
    </>
  );
};

const SignUp = () => {
  const navigate = useNavigate();
  const [emailInput, bindEmailInput, resetEmailInput, setEmailInput] =
    useInput();
  const [firstname, bindfirstname] = useInput();
  const [lastname, bindlastname] = useInput();
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

  const [waiting, setwaiting] = useState(false);

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

  const signupUser = () => {
    setwaiting(true);
    signupUserAdapter(emailInput, passwordInput, firstname, lastname)
      .then((r) => {
        alert("Created User , Press Ok to login");
        navigate("/auth/login");
      })
      .catch((e) => {
        alert("Login Failed");
      })
      .finally((r) => {
        setwaiting(false);
      });
  };
  return (
    <>
      <h3 className="fw-bold mb-3">Welcome</h3>
      <span>Please create your account</span>
      <div className="mb-3">
        <div className={`${styles.w__custom} input-group has-validation`}>
          <div className="form-floating is-invalid">
            <input
              type="firstname"
              className="form-control"
              id="firstname-input"
              placeholder="John"
              name="firstname"
              {...bindfirstname}
            />
            <label>FirstName</label>
          </div>
        </div>
      </div>
      <div className="mb-3">
        <div className={`${styles.w__custom} input-group has-validation`}>
          <div className="form-floating is-invalid">
            <input
              type="lastname"
              className="form-control"
              id="lastname-input"
              placeholder="Doe"
              name="lastname"
              {...bindlastname}
            />
            <label>Email address</label>
          </div>
        </div>
        <ReactiveLabel {...labelEmailVerify} />
      </div>
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
      {waiting ? (
        <div>
          <Spinner animation="border" variant="primary">
            <span className="visually-hidden">Loading</span>
          </Spinner>
        </div>
      ) : (
        <button
          type="button"
          className={`${styles.w__custom} btn btn-success mb-3`}
          disabled={
            labelEmailVerify.hint !== "SUCCESS" ||
            labelconfirmPassword.hint !== "SUCCESS"
          }
          onClick={signupUser}
        >
          SignUp
        </button>
      )}
      <span>
        Have an account Already?
        <Link to={`/auth/login`}> Login </Link>
      </span>
    </>
  );
};

const AuthPage = ({ authState }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, []);
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
