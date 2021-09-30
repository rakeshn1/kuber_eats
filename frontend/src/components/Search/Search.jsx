import React from "react";
import "./Search.css";
import search from "./image/search.svg";

export function Search(props) {
  function onInputHandler(event) {
    props.updateSearch(event.target.value);
  }

  return (
    <div className="Search">
      <label htmlFor="search">
        <img src={search} alt="" className="Search__button" />
      </label>
      <input
        type="text"
        className="Search__text"
        placeholder="Search for restaurant or cuisine"
        onInput={onInputHandler}
        id={"search"}
      />
    </div>
  );
}
