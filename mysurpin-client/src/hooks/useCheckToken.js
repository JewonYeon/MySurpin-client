import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { signOut } from "../actions/index";
import { useHistory } from "react-router-dom";

const useCheckToken = (param = [], func) => {
  const userState = useSelector((state) => state.userReducer);
  const { user } = userState;
  const history = useHistory();
  const dispatch = useDispatch();

  useEffect(() => {
    console.log("정보 잘 담고있는지 확인 11111111", user);
    if (user.token && user.email) {
      const payload = JSON.stringify({
        email: user.email,
      });
      return fetch(`http://localhost:4000/user/userinfo`, {
        method: "POST",
        headers: {
          authorization: `Bearer ${user.token}`,
          "Content-Type": "application/json",
          credentials: "include",
        },
        body: payload,
      })
        .then((res) => {
          // console.log("30초 안에 하면 200, 아니면 빠꾸", res.status);
          return res.status;
        })
        .then((status) => {
          if (Number(status) !== 200) {
            // alert("로그인 창으로 이도오오오오옹~!");
            dispatch(signOut());
            history.push("/signpage");
          } else {
            // alert("오우오우 토큰 유지~~~!");
            func();
          }
        })
        .catch((err) => console.error(err));
    }
  }, [...param]);
};

export default useCheckToken;

// function example() {
//   if (null || null) {
//     return "null && null은 참이다";
//   }
//   return "null && null은 거짓이다";
// }
