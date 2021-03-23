import React, { useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { signIn } from "../actions/index";

const SignIn = ({ isSignInOn, handlePageState }) => {
  const dispatch = useDispatch();
  const history = useHistory();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const moveToPassword = useRef();

  const onChangeEmail = (e) => {
    setEmail(e.target.value);
  };
  const onChangePassword = (e) => {
    setPassword(e.target.value);
  };

  const onKeyPress = (e) => {
    if (e.key === "Enter") {
      moveToPassword.current.focus();
      handleSignIn();
    }
  };

  // 구글 로그인

  const handleGoogleLogin = () => {
    // Google's OAuth 2.0 endpoint for requesting an access token
    var oauth2Endpoint = "https://accounts.google.com/o/oauth2/v2/auth";
    // Create <form> element to submit parameters to OAuth 2.0 endpoint.
    var form = document.createElement("form");
    form.setAttribute("method", "GET"); // Send as a GET request.
    form.setAttribute("action", oauth2Endpoint);
    // Parameters to pass to OAuth 2.0 endpoint.
    var params = {
      client_id: process.env.REACT_APP_client_id,
      redirect_uri: "http://localhost:3000/signpage",
      response_type: "token",
      scope:
        "https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email",
      include_granted_scopes: "true",
      state: "",
    };
    // Add form parameters as hidden input values.
    for (var p in params) {
      var input = document.createElement("input");
      input.setAttribute("type", "hidden");
      input.setAttribute("name", p);
      input.setAttribute("value", params[p]);
      form.appendChild(input);
    }
    // Add form to page and submit it to open the OAuth 2.0 endpoint.
    document.body.appendChild(form);
    form.submit();
  };

  const handleSignIn = () => {
    if (email === "") {
      return;
    }
    if (password === "") {
      return;
    }
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
          history.push("/");
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
          <button className="google-login__logo" onClick={handleGoogleLogin}>
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
              onKeyPress={onKeyPress}
            ></input>
            <input
              type="password"
              className="signin-form__password__input"
              placeholder="Password"
              value={password}
              required
              onChange={onChangePassword}
              onKeyPress={onKeyPress}
              ref={moveToPassword}
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
