import { useEffect, useState, useRef } from "react";
import { SwipeCarousel } from "../components/SwipeCarousel";
import { Icon } from "@iconify/react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Search } from "../components/Search";
import { useSearchStore } from "../stores/searchStore";
import Chat from "../components/Chat";

export default function HomeComponent() {
  const [nowPlaying, setNowPlaying] = useState([]);
  const [popular, setPopular] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [genres, setGenres] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const isSearchOpen = useSearchStore((state) => state.isOpen);
  const setIsSearchOpen = useSearchStore((state) => state.setIsOpen);
  const showGenres = useSearchStore((state) => state.showGenre);
  const setShowGenres = useSearchStore((state) => state.setShowGenre);
  const chatOpen = useSearchStore((state) => state.chatOpen);
  const setChatOpen = useSearchStore((state) => state.setChatOpen);

  function convertRatingToStars(rating) {
    return ((rating - 1) / (10 - 1)) * (5 - 1) + 1;
  }

  useEffect(() => {
    async function fetchGenre() {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}getGenre`
        );
        setGenres(response.data.genres);
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    }
    fetchGenre();
  }, []);

  useEffect(() => {
    setIsLoading(true);
    Promise.all([
      axios.get(`${import.meta.env.VITE_API_URL}getNowPlaying`),
      axios.post(`${import.meta.env.VITE_API_URL}getPopular`, {
        page: 1,
      }),
      axios.post(`${import.meta.env.VITE_API_URL}getToprated`, {
        page: 1,
      }),
    ])
      .then(([response1, response2, response3]) => {
        setNowPlaying(response1.data);
        setPopular(response2.data);
        setTopRated(response3.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <>
      <AnimatePresence>{chatOpen && <Chat />}</AnimatePresence>
      <AnimatePresence>{isSearchOpen && <Search />}</AnimatePresence>
      <AnimatePresence>
        {showGenres && (
          <motion.div
            key="genre"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className={`fixed inset-0 z-[99] bg-gray-700/35 p-6 backdrop-blur-xl flex flex-col ${
              Capacitor.getPlatform() !== "web" && "-mt-12"
            }`}
          >
            <div className="flex-1 overflow-y-scroll py-20 no-scrollbar">
              {genres.map((genre) => (
                <div key={genre.id} className="px-4 py-2 my-2">
                  <Link to={`/genre/${genre.id}/${genre.name}`}>
                    {genre.name}
                  </Link>
                </div>
              ))}
            </div>
            <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-b from-transparent to-black/75 flex items-center justify-center">
              <button onClick={() => setShowGenres(false)}>
                <Icon
                  icon="solar:close-circle-bold"
                  className="text-6xl mb-20"
                />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <p>Willkommen bei,</p>
            <h1 className="text-3xl font-bold">CineMatch.</h1>
          </div>
          <div className="flex flex-row gap-4 items-center">
            <div>
              <button
                onClick={() => setShowGenres(true)}
                className="px-4 py-1 bg-white/25 border rounded-full flex flex-row gap-1 items-center pr-2"
              >
                Genre
                <Icon
                  icon="solar:alt-arrow-down-outline"
                  className="text-2xl"
                />
              </button>
            </div>
            <div className="relative">
              <div
                onClick={() => setIsSearchOpen(true)}
                className="absolute left-0 top-0 w-16 h-16 -translate-x-1/4 -translate-y-1/4"
              ></div>
              <button>
                <Icon icon="solar:magnifer-outline" className="text-3xl mt-2" />
              </button>
            </div>
          </div>
        </div>
      </div>
      {isLoading ? (
        <div className="w-full h-56 px-6">
          <div className="rounded-2xl bg-zinc-500 w-full h-full animate-pulse"></div>
        </div>
      ) : (
        <SwipeCarousel data={nowPlaying} />
      )}
      <div className="mt-4 px-6 flex items-center justify-between">
        <h2 className="text-xl font-bold">Beliebte Filme</h2>
        <Link to={"/popularMovies"} className="font-light -mr-2 text-gray-400">
          Alle ansehen
        </Link>
      </div>
      <div className="relative mt-2">
        {isLoading ? (
          <motion.div
            className="flex flex-row overflow-x-scroll gap-3 slider-container pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {[...Array(3)].map((_, index) => (
              <motion.div
                key={index}
                className="flex-shrink-0 slider-item animate-pulse"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="bg-zinc-500 w-32 h-auto aspect-[2/3] rounded-xl"></div>
                <div className="bg-zinc-500 w-2/3 h-2 bg-white mt-2 rounded-xl"></div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          popular.length > 0 && (
            <motion.div
              className="flex flex-row overflow-x-scroll gap-3 slider-container"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {popular.map((movie) => (
                <motion.div
                  key={movie.id}
                  className="flex-shrink-0 slider-item"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link to={`movie/${movie.id}`}>
                    <img
                      src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                      alt="Filmposter"
                      className="w-32 h-auto object-cover aspect-[2/3] rounded-xl"
                      style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px" }}
                    />
                    <div className="flex flex-col">
                      <p className="w-32 mt-2 line-clamp-1">{movie.title}</p>
                      <p className="text-gray-400 flex items-center gap-1 mt-1">
                        <Icon icon="solar:star-bold" />
                        {convertRatingToStars(movie.vote_average).toFixed(1)}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )
        )}
      </div>
      <div className="mt-4 px-6 flex items-center justify-between">
        <h2 className="text-xl font-bold">Bestbewertete Filme</h2>
        <Link to={"/topRatedMovies"} className="font-light -mr-2 text-gray-400">
          Alle ansehen
        </Link>
      </div>
      <div className="relative mt-2 pb-28">
        {isLoading ? (
          <motion.div
            className="flex flex-row overflow-x-scroll gap-3 slider-container pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {[...Array(3)].map((_, index) => (
              <motion.div
                key={index}
                className="flex-shrink-0 slider-item animate-pulse"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="bg-zinc-500 w-32 h-auto aspect-[2/3] rounded-xl"></div>
                <div className="bg-zinc-500 w-2/3 h-2 bg-white mt-2 rounded-xl"></div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          topRated.length > 0 && (
            <motion.div
              className="flex flex-row overflow-x-scroll gap-3 slider-container"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {topRated.map((movie) => (
                <motion.div
                  key={movie.id}
                  className="flex-shrink-0 slider-item"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link to={`movie/${movie.id}`}>
                    <img
                      src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                      alt="Filmposter"
                      className="w-32 h-auto object-cover aspect-[2/3] rounded-xl"
                      style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px" }}
                    />
                    <div className="flex flex-col">
                      <p className="w-32 mt-2 line-clamp-1">{movie.title}</p>
                      <p className="text-gray-400 flex items-center gap-1 mt-1">
                        <Icon icon="solar:star-bold" />
                        {convertRatingToStars(movie.vote_average).toFixed(1)}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )
        )}
      </div>
      <div className="fixed bottom-6 left-0 w-full">
        <div className="px-6">
          <div
            className="w-full bg-[#3e3e3e]/45 rounded-full h-16 backdrop-blur-md border-1 border-white/25 flex items-center justify-between px-4"
            onClick={() => setChatOpen(true)}
          >
            <p>Chatte mit Matchy..</p>
            <Icon icon="solar:chat-unread-bold" className="text-3xl" />
          </div>
        </div>
      </div>
    </>
  );
}
