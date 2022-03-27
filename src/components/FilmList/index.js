import React, { useState } from "react";
import { PAGE_LIMIT } from "../../common/constants";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import "./style.scss";

const UPDATING = "updating...";

const FilmList = (props) => {
  const { films, totalFilms, fetchFilmsByFilters, filters } = props;
  const [offset, setOffset] = useState(0);

  const checkHasArrowRight = () => offset + PAGE_LIMIT < totalFilms;
  const checkHasArrowLeft = () => offset >= PAGE_LIMIT;

  const getNameByList = (list) => list.map((item) => item.name);

  const renderFilmItem = (filmsPerPage = []) =>
    filmsPerPage.map((f, i) => (
      <div key={i} className="film-item">
        <img alt="" src={f.thumnail} />
        <div className="film-item-body">
          <span className="film-item-body__title" title={f.title}>
            {f.title}
          </span>
          <span className="film-item-body__info">
            Director: <b>{getNameByList(f.directors).join(", ") || UPDATING}</b>
          </span>
          <span className="film-item-body__info">
            Country: <b>{getNameByList(f.countries).join(", ") || UPDATING}</b>
          </span>
          <span className="film-item-body__info">
            Category: <b>{getNameByList(f.categories).join(", ")}</b>
          </span>
          <span className="film-item-body__info">
            Year public: <b>{f.year || "??"}</b>
          </span>
          {f.number_of_episode ? (
            <span className="film-item-body__info">
              Number of episode: <b>{f.number_of_episode}</b>
            </span>
          ) : null}
          <span className="film-item-body__link">
            Link:{" "}
            <a href={f.link} target="_blank" rel="noreferrer" title={f.link}>
              {f.link}
            </a>
          </span>
        </div>
      </div>
    ));

  const handleClickPage = (offset) => {
    setOffset(offset);
    fetchFilmsByFilters(filters, offset);
  };

  const renderPagination = (totalFilms = 0) => {
    const pages = Math.ceil(totalFilms / PAGE_LIMIT);
    return Array(pages)
      .fill(null)
      .map((_, i) => (
        <button
          className={`film-pagination__btn btn-tab ${
            offset / PAGE_LIMIT === i ? "tab-active" : ""
          }`}
          onClick={() => handleClickPage(i * PAGE_LIMIT)}
          key={`page-${i}`}
        >
          {i + 1}
        </button>
      ));
  };

  return (
    <div className="film-list-wrap">
      <div className="film-list">{films ? renderFilmItem(films) : ""}</div>
      <div className="film-pagination">
        {films.length ? (
          <span
            onClick={() => handleClickPage(offset - PAGE_LIMIT)}
            className={`film-pagination__arrow arrow-left btn-tab ${
              !checkHasArrowLeft() ? "arrow-disable" : ""
            }`}
          >
            <IoIosArrowBack fontSize={17} />
          </span>
        ) : null}
        {renderPagination(totalFilms, 1)}
        {films.length ? (
          <span
            onClick={() => handleClickPage(offset + PAGE_LIMIT)}
            className={`film-pagination__arrow arrow-right btn-tab ${
              !checkHasArrowRight() ? "arrow-disable" : ""
            }`}
          >
            <IoIosArrowForward fontSize={17} />
          </span>
        ) : null}
      </div>
    </div>
  );
};

export default FilmList;
