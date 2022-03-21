import React, { useEffect, useState } from "react";
import { PAGE_LIMIT } from "../../common/constants";
import "./style.scss";

const FilmList = (props) => {
  const {films, totalFilms} = props;
  const [offset, setOffset] = useState(0);
  const [filmsPerPage, setFilmsPerPage] = useState([]);

  useEffect(() => {
    if(films && films.length) {
      setFilmsPerPage(films.slice(offset, offset + PAGE_LIMIT));
    }
  }, [offset, films])

  const checkHasArrowRight = () => offset + PAGE_LIMIT < totalFilms
  const checkHasArrowLeft = () => offset >= PAGE_LIMIT

  const renderFilmItem = (filmsPerPage = []) => 
    filmsPerPage.map((f, i) => <div key={i} className="film-item">
      <img alt="" src={f.thumnail} />
      <div className="film-item-body">
        <span className="film-item-body__title" title={f.title}>{f.title}</span>
        <span className="film-item-body__year">Year public: {f.year || "??"}</span>
        {f.number_of_episode ? <span className="film-item-body__episode">Number of episode: {f.number_of_episode}</span> : null}
        <span className="film-item-body__link">Link: <a href={f.link} target="_blank" rel="noreferrer" title={f.link}>{f.link}</a></span>
      </div>
    </div>)

  const renderPagination = (totalFilms = 0) => {
    const pages = Math.ceil(totalFilms / 20);
    return Array(pages).fill(null).map((_, i) => <button 
      className={`film-pagination__btn btn-tab ${offset / PAGE_LIMIT === i ? "tab-active" : ""}`}
      onClick={() => setOffset(i * PAGE_LIMIT)} 
      key={`page-${i}`}>{i + 1}
    </button>)
  }

  return <div className="film-list-wrap">
    <div className="film-list">
      {filmsPerPage ? renderFilmItem(filmsPerPage) : ""}
    </div>
    <div className="film-pagination">
      {filmsPerPage.length ? <span onClick={() => setOffset(offset - PAGE_LIMIT)} className={`film-pagination__arrow arrow-right btn-tab ${!checkHasArrowLeft() ? "arrow-disable" : ""}`}>{"<<"}</span> :  null}
      {renderPagination(totalFilms, 1)} 
      {filmsPerPage.length ? <span onClick={() => setOffset(offset + PAGE_LIMIT)} className={`film-pagination__arrow arrow-right btn-tab ${!checkHasArrowRight() ? "arrow-disable" : ""}`}>{">>"}</span> : null}
    </div>
  </div>
}

export default FilmList;