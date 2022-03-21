import React, { useEffect, useState } from "react";
import FilmList from "../../components/FilmList";
import axios from "axios";
import useInput from "../../components/InputField";
import { CRAW_API, CRAW_MANY_API } from "../../common/constants";
import "./style.scss";

const Home = () => {
  const [filmInfo, setFilmInfo] = useState({});
  const [pagesInfo, setPagesInfo] = useState([]);
  const [tabIndex, setTabIndex] = useState(0);
  const [crawError, setCrawError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [urls, setUrls] = useState([]);
  const [urlValue, urlInput ] = useInput({placeholder: "Enter link...", className: "input-url"});
  const [fileValue, fileInput ] = useInput({type: "file"});

  useEffect(() => {
    if(fileValue) {
      const reader = new FileReader();
      let _urls = [];

      reader.onload= (e) => {
        _urls = e.target.result.split(/\r\n|\n/);
        _urls = _urls.map(u => u.trim());
        setUrls(_urls);
      }
      reader.readAsText(fileValue);
    }
  }, [fileValue])

  const crawWebsite = (urls, url) => {
    const _url = fileValue ? CRAW_MANY_API : CRAW_API;
    const params = fileValue && urls && urls.length ? {urls} : {url};
    setLoading(true);

    axios
    .post(_url, params)
    .then((value) => {
      if(value?.data?.docs && value?.data?.docs?.length) {
        setPagesInfo(value.data.docs);
        setFilmInfo(value.data.docs[0]);
      } else if (value?.data?.doc) {
        setFilmInfo(value.data.doc || {})
        setPagesInfo([]);
      }
      setCrawError(false);
      setLoading(false);
    })
    .catch((error) => {
      console.log("error: ", error);
      setCrawError(true);
      setLoading(false);
    });
  }

  const showTabs = (tabs) => tabs.map((tab, i) => {
    const linkSplit = tab.link.split("/");
    const title = linkSplit[linkSplit.length - 1] || linkSplit[linkSplit.length - 2]
    return <button 
      className={`home-result__tabs-item btn-tab ${tabIndex === i ? "tab-active" : ""}`} 
      onClick={() => {
        setTabIndex(i);
        setFilmInfo(pagesInfo[i]);
      }} 
      key={`tab-${i}`}>
        {title}
    </button>
  })

  const downloadFile = ({ data, fileName, fileType }) => {
    const blob = new Blob([data], { type: fileType });
    const a = document.createElement('a');
    a.download = fileName;
    a.href = window.URL.createObjectURL(blob)
    const clickEvt = new MouseEvent('click', {
      view: window,
      bubbles: true,
      cancelable: true,
    })
    a.dispatchEvent(clickEvt)
    a.remove()
  }
  
  const exportToJson = (e) => {
    e.preventDefault()
    const _data = pagesInfo.length ? {
      pages: pagesInfo,
      total_link: pagesInfo.length
    } : filmInfo;

    downloadFile({
      data: JSON.stringify(_data),
      fileName: 'films.json',
      fileType: 'text/json',
    })
  }

  return <div className="home-wrap">
    <div className="home-tools">
      <div className="home-tools__title">Tools</div>
      <div className="home-tools__input-group">
        {urlInput} Or {fileInput}
      </div>
      <div className="home-tools__action-group">
        <button className="btn-primary" onClick={() => crawWebsite(urls, urlValue)}>Send</button>
        {filmInfo && Object.keys(filmInfo).length ? <button className="btn-primary" onClick={(e) => exportToJson(e)}>Export</button> : null}
      </div>
    </div>
    <div className="home-result">
      <div className="home-result__tabs">{showTabs(pagesInfo)}</div>
      {!loading 
        ? !crawError ? <FilmList films={filmInfo.items} totalFilms={filmInfo.total} /> : <div>Đã xảy ra lỗi trong quá trình craw!</div> 
        : <div className="loader" />}
    </div>
  </div>
}

export default Home;