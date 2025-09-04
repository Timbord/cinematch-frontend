import React, { useState, useEffect } from "react";
import { useSearchStore } from "../stores/searchStore";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";
import axios from "axios";
import debounce from "lodash.debounce";
import LoadingAnimation from "../assets/images/loading.gif";
import { Link } from "react-router-dom";
import { Capacitor } from "@capacitor/core";
import { Keyboard } from "@capacitor/keyboard";

export const Search = () => {
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const setIsSearchOpen = useSearchStore((state) => state.setIsOpen);
  const query = useSearchStore((state) => state.query);
  const setQuery = useSearchStore((state) => state.setQuery);
  const [hasFetched, setHasFetched] = useState(false);

  const fetchMovies = async () => {
    if (!query) {
      setResults([]); // Leere das Ergebnisarray, wenn keine Suchanfrage vorhanden ist
      setIsLoading(false);
      setHasFetched(false);
      return;
    } // Wenn der Query leer ist, nicht suchen.
    setIsLoading(true);
    setHasFetched(false);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}search`,
        {
          query: query,
        }
      );
      const filteredResults = response.data.filter(
        (movie) => movie.poster_path
      );
      setResults(filteredResults);
      setHasFetched(true);
    } catch (error) {
      console.error("Error fetching movies:", error);
      setHasFetched(true);
    } finally {
      setIsLoading(false);
    }
  };

  const debouncedFetchMovies = debounce(fetchMovies, 300);

  useEffect(() => {
    debouncedFetchMovies();
    // Cleanup-Funktion, um Debounced Calls zu verwerfen, wenn die Komponente unmountet
    return () => debouncedFetchMovies.cancel();
  }, [query]);

  const itemVariants = {
    hidden: { opacity: 0 },
    visible: (index) => ({
      opacity: 1,
      transition: {
        delay: index * 0.05, // jeder folgende Eintrag verzögert sich um 0.1 Sekunden
      },
    }),
  };

  useEffect(() => {
    if (Capacitor.getPlatform() !== "web") {
      Keyboard.setAccessoryBarVisible({ isVisible: false });
      Keyboard.setResizeMode({ mode: "none" }); // Verhindert das Hochschieben der Ansicht
    }
  }, []);

  return (
    <>
      <motion.div
        key="search"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
        className={`fixed w-full h-full z-[99] bg-gray-700/35 backdrop-blur-xl pt-6 px-6 overflow-y-hidden ${
          Capacitor.getPlatform() !== "web" && "-mt-12"
        }`}
      >
        <div className="w-full h-full overflow-x-hidden overflow-y-hidden flex flex-col">
          <div
            className={`flex flex-col gap-2 shrink-0 ${
              Capacitor.getPlatform() !== "web" && "mt-12"
            }`}
          >
            <div className="flex flex-row gap-2">
              <button onClick={() => setIsSearchOpen(false)}>
                <Icon icon="solar:arrow-left-outline" className="text-3xl" />
              </button>
              <div className="w-full relative flex items-center">
                <Icon
                  icon="solar:magnifer-outline"
                  style={{ color: "gray", fontSize: "1.5rem" }}
                  className="absolute left-2"
                />
                <input
                  type="text"
                  placeholder="Filme suchen..."
                  className="w-full h-12 px-4 bg-[#333] text-white rounded-lg pl-9 focus:border-[#fff] focus:outline-none focus:ring-0"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
          {!isLoading && (
            <div
              className="grid grid-cols-3 gap-2 mt-4 overflow-y-auto overscroll-y-none pb-8"
              id="searchResults"
            >
              <AnimatePresence>
                {results.map((movie, index) => (
                  <motion.div
                    key={movie.id}
                    custom={index}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                  >
                    <Link to={`/movie/${movie.id}`}>
                      <img
                        className="w-full rounded-xl aspect-[2/3] object-cover"
                        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                        alt="Poster"
                        style={{
                          boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
                        }}
                      />
                    </Link>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
          {!isLoading &&
            results.length === 0 &&
            query.length > 0 &&
            hasFetched && (
              <div className="text-white text-center mt-4 text-2xl">
                Leider haben wir diesen
                <br />
                Film nicht gefunden.
              </div>
            )}
          {isLoading && (
            <div className="py-8 flex items-center justify-center w-full">
              <img src={LoadingAnimation} alt="Loading" className="w-12 h-12" />
            </div>
          )}
        </div>
      </motion.div>
    </>
  );
};
