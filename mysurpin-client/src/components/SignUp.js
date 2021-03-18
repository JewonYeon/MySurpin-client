import React, { useState, useCallback } from "react";

const SignUp = ({ isSignInOn, handleSignIn }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");
  const [passwordcheck, setPasswordCheck] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const onChangePasswordCheck = useCallback(
    (e) => {
      setPasswordCheck(e.target.value);
      setPasswordError(e.target.value !== password);
    },
    [password]
  );

  const onChangeName = (e) => {
    setName(e.target.value);
  };
  const onChangeEmail = (e) => {
    setEmail(e.target.value);
  };

  const onChangePassword = (e) => {
    setPassword(e.target.value);
  };

  const errorMsg = (e) => {
    if (passwordError === true) {
      alert("패스워드가 일치하지 않습니다.");
    }
    const emailValue = e.target.value.split("@");
    if (emailValue.length !== 2) {
      alert("이메일 형식을 맞춰주세요");
    }
  };

  return (
    <div className="signUp">
      {isSignInOn ? (
        <div className="signup__formOff">
          <div className="signup__title">Sign Up Surpin</div>
          <div className="signup__ment">sign up and make your own surpin!</div>
          <button className="signup__btn" onClick={() => handleSignIn()}>
            signup
          </button>
        </div>
      ) : (
        <div className="signup__formOn">
          <div className="signup__title">Sign Up Surpin</div>
          <div className="signup__ment">sign up and make your own surpin!</div>
          <div className="signup-form">
            <input
              className="signup-form__name__input"
              value={name}
              required
              placeholder="Name"
              onChange={onChangeName}
            ></input>
            <input
              className="signup-form__email__input"
              value={email}
              required
              placeholder="Email"
              onChange={onChangeEmail}
            ></input>
            <input
              className="signup-form__password__input"
              value={password}
              required
              placeholder="Password"
              onChange={onChangePassword}
            ></input>
            <input
              className="signup-form__password__check__input"
              value={passwordcheck}
              required
              placeholder="PasswordCheck"
              onChange={onChangePasswordCheck}
            ></input>
          </div>
          <button className="signup__btn" onClick={errorMsg}>
            sign up
          </button>
        </div>
      )}
    </div>
  );
};
export default SignUp;
