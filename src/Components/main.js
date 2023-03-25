import { useState, useEffect } from "react";
import { ReactSVG } from "react-svg";
import Card from "./card";

const API_KEY = "&api_key=7a10079190d8c5eeec347c39d17bf78a";
const base_url = "https://api.themoviedb.org/3";
function getMoviesByPage(pageNumber) {
  let url =
    base_url +
    "/discover/movie?sort_by=popularity.desc" +
    API_KEY +
    "&language=en-US&page=" +
    pageNumber;
  return url;
}
let arr = ["Popular", "Theatre", "Kids", "Drama", "Comedy"];

const Main = () => {
  const [movieData, setData] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [search, setSearch] = useState("");
  const [chooseCateg, setChooseCateg] = useState("");

  useEffect(() => {
    const url = getMoviesByPage(1);
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setData(data.results);
      });
  }, [chooseCateg]);
  useEffect(() => {
    const url = getMoviesByPage(pageNumber);
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setData(data.results);
      });
  }, [pageNumber]);

  const getData = (movieType, pageNumber) => {
    let newUrl;
    if (movieType === "Popular") {
      newUrl =
        base_url +
        "/discover/movie?sort_by=popularity.desc" +
        API_KEY +
        "&language=en-US&page=" +
        pageNumber;
    } else if (movieType === "Theatre") {
      newUrl =
        base_url +
        "/discover/movie?primary_release_date.gte=2014-09-15&primary_release_date.lte=2014-10-22" +
        API_KEY +
        "&language=en-US&page=" +
        pageNumber;
    } else if (movieType === "Kids") {
      newUrl =
        base_url +
        "/discover/movie?certification_country=US&certification.lte=G&sort_by=popularity.desc" +
        API_KEY +
        "&language=en-US&page=" +
        pageNumber;
    } else if (movieType === "Drama") {
      newUrl =
        base_url +
        "/discover/movie?with_genres=18&primary_release_year=2014" +
        API_KEY +
        "&language=en-US&page=" +
        pageNumber;
    } else if (movieType === "Comedy") {
      newUrl =
        base_url +
        "/discover/movie?with_genres=35&with_cast=23659&sort_by=revenue.desc" +
        API_KEY +
        "&language=en-US&page=" +
        pageNumber;
    }

    fetch(newUrl)
      .then((res) => res.json())
      .then((data) => {
        setData(data.results);
      });
  };

  const searchMovie = (evt) => {
    if (evt.key === "Enter") {
      const url =
        base_url +
        "/search/movie?api_key=7a10079190d8c5eeec347c39d17bf78a&query=" +
        search;
      fetch(url)
        .then((res) => res.json())
        .then((data) => {
          setData(data.results);
        });
      setSearch("");
    }
  };

  const handlePreviousClick = () => {
    if (pageNumber > 1) {
      setPageNumber(pageNumber - 1);
    }
  };

  const handleNextClick = () => {
    setPageNumber(pageNumber + 1);
  };

  return (
    <>
      <div className="header">
        <nav>
          <ul>
            {arr.map((value) => {
              return (
                <li>
                  <a
                    href="#"
                    name={value}
                    onClick={(e) => {
                      setChooseCateg(e.target.name);
                      getData(e.target.name);
                    }}
                  >
                    {value}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
        <form>
          <div className="search-btn">
            <input
              type="text"
              placeholder="Enter Movie Name"
              className="inputText"
              onChange={(e) => {
                setSearch(e.target.value);
              }}
              value={search}
              onKeyPress={searchMovie}
            ></input>
            <button>
              <ReactSVG src="search.svg" />{" "}
            </button>
          </div>
        </form>
      </div>
      <div className="container">
        {Array.isArray(movieData) && movieData.length === 0 ? (
          <p className="notfound">Not Found</p>
        ) : (
          movieData.map((res, pos) => {
            return <Card info={res} key={pos} />;
          })
        )}
      </div>
      <div className="page-changer">
        <button className="previous-button" onClick={handlePreviousClick}>
          Previous
        </button>
        <p className="page-number">Page {pageNumber}</p>
        <button className="next-button" onClick={handleNextClick}>
          Next
        </button>
      </div>
    </>
  );
};

export default Main;
