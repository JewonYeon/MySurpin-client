/* eslint-disable */
import React, { useState, useEffect, useRef } from "react";
import UrlList from "../components/UrlList";
import Tag from "../components/Tag";
import { Link, useHistory, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getShowSurpin, getTagLists } from "../actions/index";
import useCheckToken from "../hooks/useCheckToken";
import AlertModal from "../components/AlertModal";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
require("dotenv").config();
const awsController = require("../aws_controller/aws_controller");

const SurpinModal = ({ location, match }) => {
  const history = useHistory();
  const { listId } = useParams();
  const dispatch = useDispatch();
  const userState = useSelector((state) => state.userReducer);
  const surpinState = useSelector((state) => state.surpinReducer);
  const {
    user: { nickname, token, email },
  } = userState;
  const { showSurpin, searchTagLists } = surpinState;

  const moveToUrl = useRef();

  const {
    surpinId,
    title,
    writer,
    desc,
    tags,
    thumbnail,
    created_At,
    modified_At,
  } = location.surpin || {
    surpinId: 0,
    title: "New Surpin",
    writer: nickname,
    desc: "no description",
    tags: [],
    thumbnail: "",
    createdAt: "",
    modifiedAt: "",
  };

  const [editmode, setEditMode] = useState(false);
  const [newListname, setNewListname] = useState(title || "");
  const [newWriter, setNewWriter] = useState(writer || "");
  const [newDesc, setNewDesc] = useState(desc || "");
  const [newTags, setNewTags] = useState(tags || []);
  const [newUrls, setNewUrls] = useState([]);
  const [newExistTags, setNewExistTags] = useState(["tag"]);
  const [newThumbnail, setNewThumbnail] = useState(
    thumbnail ||
      `https://source.unsplash.com/random?${Math.floor(
        Math.random() * 100
      )}/1600x900?blue,water`
  );

  const [droptags, setDropTags] = useState([]);

  const [inputListname, setInputListname] = useState(title || "New Surpin");
  const [inputDesc, setInputDesc] = useState(desc || "no description");
  const [inputTag, setInputTag] = useState("");
  const [inputUrlname, setInputUrlname] = useState("");
  const [inputUrl, setInputUrl] = useState("");

  const [alertModalOpen, setAlertModalOpen] = useState(false);
  const [alertModalComment, setAlertModalComment] = useState("");
  const closeModal = () => {
    setAlertModalOpen(false);
  };

  useCheckToken([editmode]);

  useEffect(() => {
    document.title = "Surpin Modal";
  }, []);

  useEffect(() => {
    if (location.pathname.split("/")[2] === nickname) {
      setEditMode(true);
    } else {
      setEditMode(false);
    }
    if (!location || !location.surpin) {
      fetch(
        `${process.env.REACT_APP_SERVER_URL}/surpin/showsurpin?listId=${listId}`,
        {
          method: "POST",
          mode: "cors",
          headers: {
            authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            credentials: "include",
          },
          body: JSON.stringify({ email, needFullData: true }),
        }
      )
        .then((res) => res.json())
        .then((data) => {
          setNewListname(data.surpin[0].title);
          setNewDesc(data.surpin[0].desc);
          setNewWriter(data.surpin[0].writer);
          setNewThumbnail(data.surpin[0].thumbnail);
          setNewTags(data.surpin[0].tags);
          setNewUrls(data.urls);
          dispatch(getShowSurpin(data.urls));
        })
        .catch((err) => console.log(err));
    } else {
      fetch(
        `${process.env.REACT_APP_SERVER_URL}/surpin/showsurpin?listId=${surpinId}`,
        {
          method: "POST",
          mode: "cors",
          headers: {
            authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            credentials: "include",
          },
          body: JSON.stringify({ email }),
        }
      )
        .then((res) => res.json())
        .then((data) => {
          setNewUrls([...data.urls]);
          dispatch(getShowSurpin(data.urls));
        })
        .catch((err) => console.log(err));
    }
  }, []);

  useEffect(() => {
    if (inputTag && inputTag.length > 0) {
      fetch(
        `${process.env.REACT_APP_SERVER_URL}/tag/showexiststags?inputText=${inputTag}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            credentials: "include",
          },
        }
      )
        .then((res) => res.json())
        .then((data) => {
          setNewExistTags(data.tags);
        })
        .catch((err) => console.log(err));
    }
  }, [inputTag]);

  const setInputThumbnail = async () => {
    if (
      document.querySelector("#sidebar__thumbnail__input").files[0].size >
      20 * 1024 * 1024
    ) {
      setAlertModalOpen(true);
      setAlertModalComment("2MB ????????? ????????? ?????????????????????.");
    }
    if (document.querySelector("#sidebar__thumbnail__input").files.length > 0) {
      const tempThumbnail = await awsController.uploadSurpinThumbnail(
        email,
        document.querySelector("#sidebar__thumbnail__input").files
      );
      setNewThumbnail(tempThumbnail);
    }
  };

  const handleInputTagBtn = () => {
    setNewTags([...newTags, inputTag]);
  };

  const handleInputUrlBtn = () => {
    if (inputUrl.length === 0) {
      setAlertModalOpen(true);
      setAlertModalComment("URL??? ??????????????????");
      return;
    }
    if (!inputUrlname || inputUrlname.length === 0) {
      fetch(`${process.env.REACT_APP_SERVER_URL}/surpin/showurltitle`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          credentials: "include",
        },
        body: JSON.stringify({ url: inputUrl }),
      })
        .then((res) => res.json())
        .then((body) => {
          if (body.message === "Unsufficient info") {
            setAlertModalOpen(true);
            setAlertModalComment(
              "????????? URL??? ????????????. ????????? ?????? ??????????????????."
            );
          } else {
            setNewUrls([...newUrls, { name: body.title, url: inputUrl }]);
          }
        })
        .catch((err) => console.log(err));
    } else {
      setNewUrls([...newUrls, { name: inputUrlname, url: inputUrl }]);
    }
  };

  const createSurpin = async (listname, desc) => {
    setEditMode(!editmode);

    let thumbnail = newThumbnail;
    if (document.querySelector("#sidebar__thumbnail__input").files.length > 0) {
      thumbnail = await awsController.uploadSurpinThumbnail(
        email,
        document.querySelector("#sidebar__thumbnail__input").files
      );
    }
    const newSurpinState = {
      thumbnail,
      listname,
      desc,
      tags: newTags,
      urls: newUrls,
      listId: surpinId,
    };

    fetch(`${process.env.REACT_APP_SERVER_URL}/surpin/createmysurpin`, {
      method: "POST",
      headers: {
        authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        credentials: "include",
      },
      body: JSON.stringify({ ...newSurpinState, email }),
    })
      .then((res) => res.json())
      .then((body) => {
        if (body.message === "done") {
          setAlertModalOpen(true);
          setAlertModalComment("?????? ?????? ??????");
          setTimeout(() => {
            history.push(`/surpinlists/${nickname}`);
          }, 800);
        } else {
          setAlertModalOpen(true);
          setAlertModalComment(body.message);
        }
      })
      .catch((err) => console.log(err));
  };

  const editSurpin = async (listname, desc) => {
    setEditMode(!editmode);

    let changeThumbnail = newThumbnail;

    if (document.querySelector("#sidebar__thumbnail__input").files.length > 0) {
      if (thumbnail.split("/")[2] === "photo.mysurpin.com") {
        changeThumbnail = await awsController.changeSurpinThumbnail(
          thumbnail,
          document.querySelector("#sidebar__thumbnail__input").files
        );
      } else {
        changeThumbnail = await awsController.uploadSurpinThumbnail(
          email,
          document.querySelector("#sidebar__thumbnail__input").files
        );
      }
    }

    const newSurpinState = {
      thumbnail: changeThumbnail,
      listname,
      desc,
      tags: newTags,
      urls: newUrls,
    };
    fetch(`${process.env.REACT_APP_SERVER_URL}/surpin/editmysurpin`, {
      method: "PATCH",
      headers: {
        authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        credentials: "include",
      },
      body: JSON.stringify({ ...newSurpinState, listId: surpinId, email }),
    })
      .then((res) => res.json())
      .then((body) => {
        if (body.message === "edit done!") {
          setAlertModalOpen(true);
          setAlertModalComment("?????? ?????? ??????");
          setTimeout(() => {
            history.push(`/surpinlists/${nickname}`);
          }, 800);
        } else {
          setAlertModalOpen(true);
          setAlertModalComment(body.message);
        }
      })
      .catch((err) => console.log(err));
  };

  const handleRemoveSurpin = () => {
    fetch(`${process.env.REACT_APP_SERVER_URL}/surpin/removemysurpin`, {
      method: "DELETE",
      headers: {
        authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        credentials: "include",
      },
      body: JSON.stringify({ listId: surpinId, email }),
    })
      .then((res) => res.json())
      .then((body) => {
        if (body.message === "Successfully processed") {
          const payload = JSON.stringify({
            pagenumber: 1,
            tag: searchTagLists.tag,
          });
          fetch(`${process.env.REACT_APP_SERVER_URL}/surpin/searchlists`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              credentials: "include",
            },
            body: payload,
          })
            .then((res) => {
              return res;
            })
            .then((res) => res.json())
            .then((body) => {
              if (body.message === "Unsufficient info") {
                setAlertModalOpen(true);
              } else if (body.message === "No surpin with request tag") {
                dispatch(getTagLists({}));
                history.go(-1);
              } else {
                dispatch(getTagLists({ ...body, tag: searchTagLists.tag }));
                history.go(-1);
              }
            })
            .catch((err) => console.error(err));
        } else {
          setAlertModalOpen(true);
          setAlertModalComment("?????? ??????");
        }
      })
      .catch((err) => console.log(err));
  };

  const handleSaveSurpin = async () => {
    if (newTags && newTags.length === 0) {
      setAlertModalOpen(true);
      setAlertModalComment("????????? ??? ??? ?????? ??????????????????");
      return;
    }
    setEditMode(false);
    setNewListname(inputListname);
    setNewDesc(inputDesc);
    if (!location.surpin || writer !== nickname) {
      createSurpin(inputListname, inputDesc);
      // if (writer !== nickname && thumbnail.split("/")[2] === "photo.mysurpin.com") {
      //     changeThumbnail = await awsController.changeSurpinThumbnail(
      //       thumbnail,
      //       document.querySelector("#sidebar__thumbnail__input").files
      //     );
      // }
    } else editSurpin(inputListname, inputDesc);
  };

  const handleDeleteTag = (e) => {
    setNewTags(
      newTags.filter(
        (tag) => tag != e.target.parentNode.textContent.slice(2, -1)
      )
    );
  };

  const handleDeleteUrl = (e) => {
    setNewUrls(
      newUrls.filter(
        (url) =>
          url.name + url.url !== e.target.parentNode.textContent.slice(0, -2)
      )
    );
  };

  const handleGoBack = () => {
    if (!location.surpin) {
      history.go(-2);
    } else {
      history.go(-1);
    }
  };

  const handleOnDragEnd = (result) => {
    if (!result.destination) return;

    const currentTags = [...newUrls];
    const draggingItemIndex = result.source.index;
    const afterDragItemIndex = result.destination.index;
    const removeTag = currentTags.splice(draggingItemIndex, 1);

    currentTags.splice(afterDragItemIndex, 0, removeTag[0]);

    setNewUrls(currentTags);
  };

  const handleCopy = () => {
    let dummy = document.createElement("input");
    let text = process.env.REACT_APP_CLIENT_URL + location.pathname;

    document.body.appendChild(dummy);
    dummy.value = text;
    dummy.select();
    document.execCommand("copy");
    document.body.removeChild(dummy);
  };

  return (
    <div className="surpinModal">
      <Link className="modal__logo" to="/">
        HOME
      </Link>
      {editmode ? (
        <></>
      ) : (
        <button className="modal__clipboard" onClick={handleCopy}>
          ???????????? ????????????
        </button>
      )}

      <AlertModal
        open={alertModalOpen}
        close={closeModal}
        comment={alertModalComment}
      />
      <button className="surpinModal__back-btn" onClick={handleGoBack}>
        <img src="/images/go_back_Button.png" alt=""></img>
      </button>
      <section className="surpinModal__sidebar">
        <div
          className="sidebar__listinfo__thumbnail"
          style={{
            backgroundImage: `url(${newThumbnail})`,
            backgroundSize: `cover`,
          }}
        >
          {token && editmode ? (
            <input
              className="sidebar__listinfo__title"
              type="text"
              placeholder={title}
              onChange={(e) => setInputListname(e.target.value)}
              value={inputListname}
            ></input>
          ) : (
            <div className="sidebar__listinfo__title">{newListname}</div>
          )}

          <div
            className="sidebar__listinfo__writer"
            onClick={() => history.push(`/surpinlists/${newWriter}`)}
          >
            {token && editmode ? nickname : writer}
          </div>
        </div>
        <div className="sidebar__description">
          <div className="description__title">Description</div>
          {editmode ? (
            <textarea
              className="description__text"
              placeholder={desc}
              onChange={(e) => setInputDesc(e.target.value)}
              value={inputDesc}
            ></textarea>
          ) : (
            <div className="description__text">{newDesc}</div>
          )}
        </div>
        <div className="sidebar__taglists">
          <div className="taglists__form__text">Tags</div>
          {token && editmode ? (
            <div className="taglists__form">
              <input
                type="text"
                className={`${
                  inputTag === "" ? "highlight" : ""
                } taglists__form__input`}
                placeholder="????????? ??????????????? *"
                onChange={(e) => setInputTag(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleInputTagBtn();
                    setInputTag("");
                  }
                }}
                value={inputTag}
                list="existTagsList"
              />
              <datalist id="existTagsList">
                {newExistTags.map((existTag, idx) => {
                  return (
                    <option key={idx} value={existTag.name}>
                      {" "}
                    </option>
                  );
                })}
              </datalist>
              <button
                className="taglists__form__btn"
                onClick={handleInputTagBtn}
              >
                +
              </button>
            </div>
          ) : (
            <></>
          )}

          <ul className="taglists__show">
            {newTags && newTags.length > 0 ? (
              newTags.map((tag, idx) => {
                return (
                  <li key={idx} className="taglists__show__tag">
                    <Tag tag={tag} key={idx}></Tag>
                    {editmode ? (
                      <button
                        className="tagList__delete-btn"
                        onClick={handleDeleteTag}
                      >
                        x
                      </button>
                    ) : (
                      <></>
                    )}
                  </li>
                );
              })
            ) : (
              <></>
            )}
          </ul>
        </div>
        {token && editmode ? (
          <>
            <label htmlFor="sidebar__thumbnail__input">????????? ??????</label>
            <input
              type="file"
              id="sidebar__thumbnail__input"
              onChange={setInputThumbnail}
            ></input>
          </>
        ) : (
          <></>
        )}
      </section>

      <section className="surpinModal__main">
        <div className="surpinModal__header">
          {writer === nickname ? (
            <button
              className="surpinModal__edit-btn"
              onClick={() => setEditMode(!editmode)}
            >
              {token && editmode ? "" : "EDIT MODE"}
            </button>
          ) : token ? (
            <>
              <button
                className="surpinModal__edit-btn"
                onClick={() => setEditMode(!editmode)}
              >
                {token && editmode ? "" : "??? ????????? ????????????"}
              </button>
            </>
          ) : (
            <></>
          )}
        </div>
        <span className="surpinModal__url__title">
          {token && editmode ? "URL ?????? ????????????" : "URL ??????"}
        </span>
        <div className="surpinModal__show-contents__topbar">
          <div className="show-contents__urlname">URL NAME</div>
          <div className="show-contents__url">URL</div>
        </div>
        <div className="surpinModal__show-contents">
          <DragDropContext onDragEnd={handleOnDragEnd}>
            <Droppable droppableId="tags" direction="vertical">
              {(provided) => (
                <ul
                  className="tags surpinModal__url-lists"
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {newUrls.length > 0 ? (
                    newUrls.map((urlinfo, idx) => {
                      return (
                        <Draggable key={idx} draggableId={`${idx}`} index={idx}>
                          {(provided) => (
                            <li
                              key={idx}
                              className="surpinModal__url-list"
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <UrlList
                                key={idx}
                                name={urlinfo.name}
                                url={urlinfo.url}
                              ></UrlList>
                              {token && editmode ? (
                                <button
                                  className="urlList__delete-btn"
                                  onClick={handleDeleteUrl}
                                >
                                  ??????
                                </button>
                              ) : (
                                <></>
                              )}
                            </li>
                          )}
                        </Draggable>
                      );
                    })
                  ) : (
                    <></>
                  )}
                </ul>
              )}
            </Droppable>
          </DragDropContext>
        </div>
        {token && editmode ? (
          <div className="surpinModal__input-contents">
            <input
              type="text"
              className="input-content__urlname"
              placeholder="????????? ???????????????"
              onChange={(e) => setInputUrlname(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  moveToUrl.current.focus();
                }
              }}
              value={inputUrlname}
            />
            <input
              type="text"
              className={`${
                inputUrl === "" ? "highlight" : ""
              } input-content__url `}
              placeholder="url??? ???????????????. ????????? ???????????? ???????????????."
              onChange={(e) => setInputUrl(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleInputUrlBtn();
                  setInputUrlname("");
                  setInputUrl("");
                }
              }}
              value={inputUrl}
              ref={moveToUrl}
            />
            <button className="input-content__btn" onClick={handleInputUrlBtn}>
              +
            </button>
          </div>
        ) : (
          <></>
        )}
        {token && editmode ? (
          <>
            <div className="surpinModal__revise-btn__wrapper">
              {writer === nickname && location.surpin ? (
                <button
                  className="surpinModal__revise-btn"
                  onClick={handleSaveSurpin}
                >
                  ????????????
                </button>
              ) : (
                <button
                  className="surpinModal__revise-btn"
                  onClick={handleSaveSurpin}
                >
                  ??? ???????????? ??????
                </button>
              )}
              {writer === nickname && location.surpin ? (
                <button
                  className="surpinModal__revise-btn"
                  onClick={handleRemoveSurpin}
                >
                  ??????
                </button>
              ) : (
                <></>
              )}
            </div>
          </>
        ) : (
          <></>
        )}
      </section>
    </div>
  );
};

export default SurpinModal;
