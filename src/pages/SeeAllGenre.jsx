import { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import Layout from "../layouts/LayoutSeeAll";
import axios from "axios";
import { Icon } from "@iconify/react";
import LoadingAnimation from "../assets/images/loading.gif";
import { motion } from "framer-motion";

export default function SeeAllPopular() {
  const { genreid } = useParams();
  const { genrename } = useParams();
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(2);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const loaderRef = useRef(null);
  let navigate = useNavigate();

  function convertRatingToStars(rating) {
    return ((rating - 1) / (10 - 1)) * (5 - 1) + 1;
  }

  const fetchData = useCallback(async () => {
    if (isLoading) return;

    setIsLoading(true);

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}discover`, {
        page: page,
        genre: genreid,
      });
      setMovies((prevMovies) => {
        // Erstellen eines Sets mit den IDs der aktuellen Filme
        const movieIds = new Set(prevMovies.map((movie) => movie.id));

        // Filtern der neuen Filme, um nur diejenigen aufzunehmen, die noch nicht vorhanden sind
        const newMovies = res.data.filter((movie) => !movieIds.has(movie.id));

        return [...prevMovies, ...newMovies];
      });
      setPage((prevPage) => prevPage + 1);
    } catch (err) {
      console.log(err);
    }

    setIsLoading(false);
  }, [page, isLoading]);

  useEffect(() => {
    const getData = async () => {
      setIsInitialLoading(true);
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}discover`,
          {
            genre: genreid,
          }
        );
        setMovies(response.data);
      } catch (error) {
        console.log(error);
      }
      setIsInitialLoading(false);
    };

    getData();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoading && !isInitialLoading) {
          fetchData();
        }
      },
      {
        threshold: 0,
      }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => observer.disconnect(); // Cleanup
  }, [fetchData, isLoading, isInitialLoading]);

  return (
    <Layout>
      <div
        id="Topbar"
        className={`fixed top-0 left-0 h-20 bg-[#383838] border-b-1 border-[#464646] w-full z-50 transition-opacity duration-500`}
        style={{ boxShadow: "0px 5px 40px 5px rgb(0 0 0 / 50%)" }}
      >
        <div className="w-full h-full flex items-end justify-between px-6 py-4">
          <button onClick={() => navigate(-1)}>
            <Icon icon="solar:arrow-left-outline" className="text-3xl" />
          </button>
          <div className="absolute top-0 left-0 w-full h-full px-6 py-4 flex items-end justify-center pointer-events-none">
            <h2 className="text-2xl font-light">{genrename}</h2>
          </div>
        </div>
      </div>
      {isInitialLoading ? (
        <div className="grid grid-cols-2 gap-4 px-6 mt-36">
          {[...Array(10)].map((_, index) => (
            <div key={index}>
              <div className="w-full h-[275px] bg-zinc-500 rounded-xl animate-pulse"></div>
              <div className="w-32 h-4 bg-zinc-500 mt-2 rounded-lg animate-pulse"></div>
              <div className="w-12 h-4 bg-zinc-500 mt-2 rounded-lg animate-pulse"></div>
            </div>
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-2 gap-4 px-6 mt-36"
        >
          {movies.map((movie) => (
            <Link to={`/movie/${movie.id}`} key={movie.id}>
              <img
                className="w-full rounded-xl aspect-[2/3] object-cover"
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt="Poster"
                style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px" }}
              />
              <p className="w-32 mt-2 line-clamp-1">{movie.title}</p>
              <p className="text-gray-400 flex items-center gap-1 mt-1">
                <Icon icon="solar:star-bold" />
                {convertRatingToStars(movie.vote_average).toFixed(1)}
              </p>
            </Link>
          ))}
        </motion.div>
      )}

      {!isInitialLoading && isLoading && (
        <div className="pb-8 flex items-center justify-center w-full">
          <img src={LoadingAnimation} alt="Loading" className="w-12 h-12" />
        </div>
      )}
      <div ref={loaderRef} style={{ height: "1px" }}></div>
    </Layout>
  );
}
