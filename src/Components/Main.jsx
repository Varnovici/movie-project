import { useState, useEffect, useRef } from "react";
import { ReactSVG } from "react-svg";
import Card from "./Card";
import Modal from "react-modal";
import Login from "./Login";

const API_KEY = "&api_key=7a10079190d8c5eeec347c39d17bf78a";
const base_url = "https://api.themoviedb.org/3";

function getMoviesByPage(pageNumber) {
  let url =
    base_url +
    "/discover/movie?sort_by=popularity.desc" +
    API_KEY +
    "&language=en-US&page=" +
    pageNumber.current;
  return url;
}
let arr = ["Popular", "Theatre", "Kids", "Drama", "Comedy"];

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    width: "300px",
    height: "400px",
    overflow: "hidden",
    borderColor: "#D8D8D8",
    borderRadius: "87px",
    border: "none",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    background: "#eb5e28",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    // backgroundColor: "#00000E",
    opacity: "100%",
    position: "fixed",
    zIndex: 10,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
};
const Main = () => {
  const [movieData, setData] = useState([]);
  const [movieFilteredData, setFilteredData] = useState([]);
  // const [pageNumber, setPageNumber] = useState(1);
  const pageNumber = useRef(1);
  const [search, setSearch] = useState("");
  const [chooseCateg, setChooseCateg] = useState("Popular");
  const [newUrl, setNewUrl] = useState("");
  const [activeSearch, setActiveSearch] = useState(false);
  let subtitle;
  const [modalIsOpen, setIsOpen] = useState(false);

  function openModal() {
    setIsOpen(true);
  }



  function closeModal() {
    setIsOpen(false);
  }

  useEffect(() => {
    fetch(getMoviesByPage(1))
      .then((res) => res.json())
      .then((data) => {
        setData(data.results);
      });
  }, []);
  useEffect(() => {
    pageNumber.current = 1;
    fetch(newUrl)
      .then((res) => res.json())
      .then((data) => {
        setData(data.results);
      });
  }, [chooseCateg]);
  useEffect(() => {
    fetch(newUrl)
      .then((res) => res.json())
      .then((data) => {
        setData(data.results);
      });
  }, [pageNumber.current]);
  const getData = (movieType, pageNumber) => {
    switch (movieType) {
      case "Theatre":
        setNewUrl(
          base_url +
            "/discover/movie?primary_release_date.gte=2014-09-15&primary_release_date.lte=2014-10-22" +
            API_KEY +
            "&language=en-US&page=" +
            pageNumber
        );
        break;
      case "Kids":
        setNewUrl(
          base_url +
            "/discover/movie?certification_country=US&certification.lte=G&sort_by=popularity.desc" +
            API_KEY +
            "&language=en-US&page=" +
            pageNumber
        );
        break;
      case "Drama":
        setNewUrl(
          base_url +
            "/discover/movie?with_genres=18&primary_release_year=2014" +
            API_KEY +
            "&language=en-US&page=" +
            pageNumber
        );
        break;
      case "Comedy":
        setNewUrl(
          base_url +
            "/discover/movie?with_genres=35&with_cast=23659&sort_by=revenue.desc" +
            API_KEY +
            "&language=en-US&page=" +
            pageNumber
        );
        break;
      default:
        setNewUrl(
          base_url +
            "/discover/movie?sort_by=popularity.desc" +
            API_KEY +
            "&language=en-US&page=" +
            pageNumber
        );
        break;
    }
    return newUrl;
  };
  useEffect(() => {
    const url =
      base_url +
      "/search/movie?api_key=7a10079190d8c5eeec347c39d17bf78a&query=" +
      search;
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setFilteredData(data.results);
      });
    if (search.length > 0) {
      setActiveSearch(true);
    } else {
      setActiveSearch(false);
    }
  }, [search]);
  const handlePreviousClick = () => {
    if (pageNumber.current > 1) {
      pageNumber.current--;
    }
    getData(chooseCateg, pageNumber.current);
  };
  const handleNextClick = () => {
    pageNumber.current++;
    getData(chooseCateg, pageNumber.current);
  };
  return (
    <>
      <div className="header">
        <nav>
          <ul>
            {arr.map((value, k) => {
              return (
                <li key={k}>
                  <a
                    href="#"
                    name={value}
                    onClick={(e) => {
                      setChooseCateg(e.target.name);
                      getData(e.target.name);
                      setFilteredData([]);
                      setSearch("");
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
              // onKeyDown={searchMovie}
            ></input>
            <button>
              <ReactSVG src="search.svg" />{" "}
            </button>
          </div>
        </form>
        <div>
        <button className="Login" onClick={openModal}>Log In</button>
        </div>
      </div>
      <div className="container">
        {movieFilteredData.length > 0 ? (
          movieFilteredData.map((res, pos) => {
            return <Card info={res} key={pos} />;
          })
        ) : movieFilteredData.length === 0 && search.length > 0 ? (
          <p className="notfound">Movie Not Found!</p>
        ) : (
          movieData.map((res, pos) => {
            return <Card info={res} key={pos} />;
          })
        )}
      </div>
      <div
        className={`page-changer ${
          activeSearch ? "page-changer activeSearch" : ""
        }`}
      >
        <button className="previous-button" onClick={handlePreviousClick}>
          Previous
        </button>
        <p className="page-number">Page {pageNumber.current}</p>
        <button className="next-button" onClick={handleNextClick}>
          Next
        </button>
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          style={customStyles}
          contentLabel="Example Modal"
        >
         
          <button className="modal-close" onClick={closeModal}>close</button>
          
        <Login />
        </Modal>
      </div>
    </>
  );
};
export default Main;
