import React, { useEffect, useState } from "react";
import { useNavigate, Routes, Route } from "react-router-dom";
import { NextUIProvider } from "@nextui-org/react";
import Home from "./pages/Home";
import MovieDetails from "./pages/MovieDetails";
import SeeAllPopular from "./pages/SeeAllPopular";
import SeeAllTopRated from "./pages/SeeAllTopRated";
import SeeAllGenre from "./pages/SeeAllGenre";

export default function App() {
  const navigate = useNavigate();
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
    }
  }, []);

  useEffect(() => {
    // Wenn die App nicht im Standalone-Modus ist und nicht auf der Startseite, navigiere zur Startseite
    if (!isInstalled && window.location.pathname !== "/") {
      //navigate("/");
    }
  }, [navigate, isInstalled]);

  return (
    <NextUIProvider navigate={navigate}>
      <Routes>
        <Route path="/*" element={<Home />} />
        <Route path="/movie/:tmdbid" element={<MovieDetails />} />
        <Route path="/popularMovies" element={<SeeAllPopular />} />
        <Route path="/topRatedMovies" element={<SeeAllTopRated />} />
        <Route path="/genre/:genreid/:genrename" element={<SeeAllGenre />} />
      </Routes>
    </NextUIProvider>
  );
}
