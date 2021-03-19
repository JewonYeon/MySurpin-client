import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { signIn } from "../actions/index";

const SignIn = ({ isSignInOn, handlePageState }) => {
  const dispatch = useDispatch();
  const history = useHistory();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onChangeEmail = (e) => {
    setEmail(e.target.value);
  };
  const onChangePassword = (e) => {
    setPassword(e.target.value);
  };

  const handleSignIn = () => {
    const payload = JSON.stringify({
      email,
      password,
    });
    return fetch(`http://localhost:4000/user/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        credentials: "include",
      },
      body: payload,
    })
      .then((res) => res.json())
      .then((body) => {
        if (body.accessToken) {
          console.log(body);
          dispatch(signIn(body.accessToken, email, body.nickname));
          history.push("/edituserinfo");
        } else {
          alert("Bad Request");
        }
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className="signIn">
      {isSignInOn ? (
        <div className="signin-formOn">
          <div className="signin__title">Sign In Surpin</div>
          <button className="google-login__logo">
            G<img src="../../public/images/logo-google.png" alt=""></img>
          </button>
          <div className="signin__ment">or use email account</div>
          <div className="signin-form">
            <input
              className="signin-form__email__input"
              placeholder="Email"
              value={email}
              required
              onChange={onChangeEmail}
            ></input>
            <input
              type="password"
              className="signin-form__password__input"
              placeholder="Password"
              value={password}
              required
              type="password"
              onChange={onChangePassword}
            ></input>
          </div>
          <button className="signin__btn" onClick={handleSignIn}>
            sign in
          </button>
        </div>
      ) : (
        <div className="signin-formOff">
          <div className="signin__title">Sign In Surpin!</div>
          <div className="signin__ment">
            To keep connected with us, please login with your personal
            information
          </div>
          <button className="signin__btn" onClick={() => handlePageState()}>
            sign in
          </button>
        </div>
      )}
    </div>
  );
};
export default SignIn;
