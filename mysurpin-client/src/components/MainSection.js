import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { getTagLists } from "../actions/index";
import { useHistory } from "react-router-dom";

const MainSection = () => {
  const [tag, setTag] = useState("");
  const dispatch = useDispatch();
  const history = useHistory();

  const onChangeSearchTag = (e) => {
    setTag(e.target.value);
  };
  // 미 구현 (시작)
  const handleSearchTag = () => {
    const payload = JSON.stringify({
      pagenumber: 1,
      tag: tag,
    });
    fetch(`http://localhost:4000/surpin/searchlists`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        credentials: "include",
      },
      body: payload,
    })
      .then((res) => {
        console.log(res);
        return res;
      })
      .then((res) => res.json())
      .then((body) => {
        console.log(body.message);
        if (body.message === "Unsufficient info") {
          alert("검색어 입력 하세요. (궁서체)");
        } else if (body.message === "No surpin with request tag") {
          dispatch(getTagLists({}));
          history.push("/searchpage");
        } else {
          dispatch(getTagLists(body));
          history.push("/searchpage");
        }
      })
      .catch((err) => console.error(err));
  };
  // 미구현 (끝)

  return (
    <div className="mainSection">
      <div className="main__title">
        {/* <img className="main__title__logo" src="" alt=""></img> */}
        <div className="main__title__text">My Surpin</div>
      </div>
      <div className="main__ment"></div>
      <div className="main__search-bar">
        <input
          className="main__search-bar__input"
          placeholder="Which Surpin do you want to search?"
          onChange={onChangeSearchTag}
          value={tag}
        ></input>
        <button className="main__search-bar__btn" onClick={handleSearchTag}>
          검색
        </button>
      </div>
    </div>
  );
};

export default MainSection;
