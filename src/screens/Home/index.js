import React, { useEffect, useState } from "react";
import FilmList from "../../components/FilmList";
import { CRAW_API, CRAW_MANY_API, PAGE_LIMIT } from "../../common/constants";
import "./style.scss";
import { useDropdown, useInput } from "../../components/hooks";
import { category, country, craw, director, movie } from "../../repositories";

const Home = () => {
  const [filmInfo, setFilmInfo] = useState({});
  const [categories, setCategories] = useState([]);
  const [countries, setCountries] = useState([]);
  const [directors, setDirectors] = useState([]);
  const [urls, setUrls] = useState([]);
  const [filters, setFilters] = useState("");
  const [crawError, setCrawError] = useState(false);
  const [loading, setLoading] = useState(false);

  const [urlValue, urlInput] = useInput({
    placeholder: "Enter link...",
    className: "input-url",
  });
  const [fileValue, fileInput] = useInput({ type: "file" });
  const [categoryDropdownValue, categoryDropdownInput] = useDropdown({
    opts: categories,
    defautValue: -1,
    label: "Category:",
    idDropdownElement: "cat-dropdown",
  });
  const [countryDropdownValue, countryDropdownInput] = useDropdown({
    opts: countries,
    defautValue: -1,
    label: "Country:",
    idDropdownElement: "country-dropdown",
  });
  const [directorDropdownValue, directorDropdownInput] = useDropdown({
    opts: directors,
    defautValue: -1,
    label: "Director:",
    idDropdownElement: "director-dropdown",
  });

  useEffect(() => {
    category.getCategories((data, error) => {
      if (data) {
        setCategories(data);
      }
    });
    country.getCountries((data, error) => {
      if (data) {
        setCountries(data);
      }
    });
    director.getDirectors((data, error) => {
      if (data) {
        setDirectors(data);
      }
    });
  }, []);

  useEffect(() => {
    if (fileValue) {
      const reader = new FileReader();
      let _urls = [];

      reader.onload = (e) => {
        _urls = e.target.result.split(/\r\n|\n/);
        _urls = _urls.map((u) => u.trim());
        setUrls(_urls);
      };
      reader.readAsText(fileValue);
    }
  }, [fileValue]);

  useEffect(() => {
    if (
      (categoryDropdownValue && categoryDropdownValue.id) ||
      (countryDropdownValue && countryDropdownValue.id) ||
      (directorDropdownValue && directorDropdownValue.id)
    ) {
      let _filters = `${
        categoryDropdownValue &&
        categoryDropdownValue.id &&
        categoryDropdownValue.id !== -1
          ? `category[id]=${categoryDropdownValue.id}&`
          : ""
      }${
        countryDropdownValue &&
        countryDropdownValue.id &&
        countryDropdownValue.id !== -1
          ? `country[id]=${countryDropdownValue.id}&`
          : ""
      }${
        directorDropdownValue &&
        directorDropdownValue.id &&
        directorDropdownValue.id !== -1
          ? `director[id]=${directorDropdownValue.id}&`
          : ""
      }`;
      setFilters(_filters);
    }
  }, [categoryDropdownValue, countryDropdownValue, directorDropdownValue]);

  useEffect(() => {
    setLoading(true);
    fetchFilmsByFilters(filters);
  }, [filters]);

  const fetchFilmsByFilters = (
    _filters = "",
    offset = 0,
    limit = PAGE_LIMIT
  ) => {
    movie.getMovies(_filters, offset, limit, (data, error) => {
      if (data) {
        setFilmInfo(data);
        setCrawError(false);
      } else {
        setFilmInfo({});
      }
      setLoading(false);
    });
  };

  const crawWebsite = (urls, url) => {
    const _url = fileValue ? CRAW_MANY_API : CRAW_API;
    const params = fileValue && urls && urls.length ? { urls } : { url };
    setLoading(true);

    craw.crawToDB(_url, params, (data, error) => {
      if (data) {
        alert("Successed!");
      } else {
        alert("Failed!");
      }
      setLoading(false);
    });
  };

  const downloadFile = ({ data, fileName, fileType }) => {
    const blob = new Blob([data], { type: fileType });
    const a = document.createElement("a");
    a.download = fileName;
    a.href = window.URL.createObjectURL(blob);
    const clickEvt = new MouseEvent("click", {
      view: window,
      bubbles: true,
      cancelable: true,
    });
    a.dispatchEvent(clickEvt);
    a.remove();
  };

  const exportToJson = (e) => {
    e.preventDefault();
    downloadFile({
      data: JSON.stringify(filmInfo),
      fileName: "films.json",
      fileType: "text/json",
    });
  };

  return (
    <div className="home-wrap">
      <div className="home-tools">
        <div className="home-tools__title">Tools</div>
        <div className="home-tools__input-group">
          {urlInput} Or {fileInput}
        </div>
        <div className="home-tools__action-group">
          <button
            className="btn-primary"
            onClick={() => crawWebsite(urls, urlValue)}
          >
            Import
          </button>
          {filmInfo && Object.keys(filmInfo).length ? (
            <button className="btn-primary" onClick={(e) => exportToJson(e)}>
              Export
            </button>
          ) : null}
        </div>
      </div>
      <div className="home-result__tabs">
        {categories.length ? categoryDropdownInput : ""}
        {categories.length ? countryDropdownInput : ""}
        {categories.length ? directorDropdownInput : ""}
      </div>
      <div className="home-result">
        {!loading ? (
          !crawError && filmInfo && Object.keys(filmInfo).length ? (
            <FilmList
              films={filmInfo?.docs}
              totalFilms={filmInfo?.total}
              fetchFilmsByFilters={fetchFilmsByFilters}
              filters={filters}
            />
          ) : (
            <div>Empty!</div>
          )
        ) : (
          <div className="loader" />
        )}
      </div>
    </div>
  );
};

export default Home;
