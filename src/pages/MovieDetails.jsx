import { useEffect, useState, useRef } from "react";
import Layout from "../layouts/LayoutDetail";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Icon } from "@iconify/react";
import moment from "moment";
import "moment/locale/de";
import { motion } from "framer-motion";
import YouTube from "react-youtube";

moment().locale("de");

export default function MovieDetails() {
  const { tmdbid } = useParams();
  const [details, setDetails] = useState([]);
  const [streamingServices, setStreamingServices] = useState([]);
  const [trailer, setTrailer] = useState([]); // Zustand für den Trailer
  const [isLoading, setIsLoading] = useState(false);
  let navigate = useNavigate();
  const detailsListRef = useRef(null);
  const [imageHeight, setImageHeight] = useState("350px"); // Zustand für die Bildhöhe
  const [playButtonClicked, setPlayButtonClicked] = useState(false);

  function convertRatingToStars(rating) {
    return ((rating - 1) / (10 - 1)) * (5 - 1) + 1;
  }

  useEffect(() => {
    setIsLoading(true);
    Promise.all([
      axios.post(`${import.meta.env.VITE_API_URL}getMovieDetails`, {
        tmdbid: tmdbid,
      }),
      axios.post(`${import.meta.env.VITE_API_URL}getTrailer`, {
        tmdbid: tmdbid,
      }),
      axios.post(`${import.meta.env.VITE_API_URL}getStreamingServices`, {
        tmdbid: tmdbid,
      }),
    ])
      .then(([response1, response2, response3]) => {
        setDetails(response1.data);
        const trailer = response2.data.find((item) => item.type === "Trailer");
        if (trailer) {
          setTrailer(trailer);
        }

        const newData = response3.data; // Annahme, dass die Daten als Array zurückkommen
        if (newData) {
          const updatedData = newData.reduce(
            (acc, item) => {
              // Überprüfen, ob der Service des aktuellen Items bereits in acc existiert
              if (!acc.some((entry) => entry.service === item.service)) {
                acc.push(item); // Fügt das Item hinzu, wenn kein Duplikat gefunden wurde
              }
              return acc;
            },
            [...streamingServices]
          ); // Startet mit einer Kopie des aktuellen States

          setStreamingServices(updatedData);
        }

        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = detailsListRef.current.scrollTop;
      const newImageHeight = scrollY > 0 ? "275px" : "350px";
      setImageHeight(newImageHeight);
    };

    const list = detailsListRef.current;
    if (list) {
      list.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (list) {
        list.removeEventListener("scroll", handleScroll);
      }
    };
  }, [details]);

  return (
    <>
      <Layout>
        {isLoading ? (
          <div className="w-full h-full overflow-x-hidden flex flex-col">
            <div className="relative z-90 mt-12 shrink-0">
              <div className="flex justify-center items-center w-full h-[350px]">
                <div className="h-[90%] w-[95%] bg-zinc-500 rounded-3xl animate-pulse"></div>
                <button
                  className="absolute left-6 top-8 z-30"
                  onClick={() => navigate(-1)}
                >
                  <Icon
                    icon="solar:arrow-left-outline"
                    className="text-5xl bg-neutral-800/75 rounded-full p-1"
                  />
                </button>
              </div>
              <div className="flex flex-col px-6">
                <div className="bg-zinc-500 animate-pulse w-52 h-8 rounded-2xl"></div>
                <div className="bg-zinc-500 animate-pulse w-1/3 h-4 rounded-2xl mt-2"></div>
                <div className="bg-zinc-500 animate-pulse w-[70%] h-4 rounded-2xl mt-4"></div>
                <div className="mt-4 flex gap-2 flex-wrap">
                  <div className="bg-zinc-500 animate-pulse rounded-full px-2 w-24 h-7"></div>
                  <div className="bg-zinc-500 animate-pulse rounded-full px-2 w-20 h-7"></div>
                  <div className="bg-zinc-500 animate-pulse rounded-full px-2 w-28 h-7"></div>
                </div>
                <div className="bg-zinc-500 animate-pulse w-1/3 h-6 rounded-2xl mt-8"></div>
                <div className="bg-zinc-500 animate-pulse w-full h-4 rounded-2xl mt-2"></div>
                <div className="bg-zinc-500 animate-pulse w-[calc(100%-1rem)] h-4 rounded-2xl mt-2"></div>
                <div className="bg-zinc-500 animate-pulse w-[calc(100%-2rem)] h-4 rounded-2xl mt-2"></div>
                <div className="bg-zinc-500 animate-pulse w-[calc(100%-3rem)] h-4 rounded-2xl mt-2"></div>
                <div className="bg-zinc-500 animate-pulse w-[calc(100%-4rem)] h-4 rounded-2xl mt-2"></div>
                <div className="bg-zinc-500 animate-pulse w-[calc(100%-1rem)] h-4 rounded-2xl mt-2"></div>
                <div className="bg-zinc-500 animate-pulse w-[calc(100%-2rem)] h-4 rounded-2xl mt-2"></div>
                <div className="bg-zinc-500 animate-pulse w-[calc(100%-1rem)] h-4 rounded-2xl mt-2"></div>
                <div className="bg-zinc-500 animate-pulse w-full h-4 rounded-2xl mt-2"></div>
              </div>
            </div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full h-full overflow-x-hidden flex flex-col"
          >
            <div className="relative z-90 mt-12 shrink-0">
              <motion.img
                initial={{ height: "350px" }}
                animate={{ height: imageHeight }}
                transition={{ type: "spring", stiffness: 200, damping: 30 }}
                src={`https://image.tmdb.org/t/p/w500/${details.backdrop_path}`}
                alt="Poster"
                className="object-cover w-full relative z-10"
                style={{
                  filter: "blur(24px)",
                  WebkitFilter: "blur(24px)",
                  transform: "translate3d(0, 0, 0)",
                  WebkitTransform: "translateZ(0)",
                  WebkitBackfaceVisibility: "hidden",
                  WebkitPerspective: 1000,
                  willChange: "filter",
                }}
              />
              <div className="absolute top-0 left-0 z-20 h-full w-full flex items-center justify-center">
                {!playButtonClicked && (
                  <img
                    src={`https://image.tmdb.org/t/p/w1280/${details.backdrop_path}`}
                    alt="Poster"
                    className="object-cover h-[90%] w-[95%] rounded-3xl"
                  />
                )}
                {playButtonClicked && trailer && (
                  <YouTube
                    videoId={trailer.key}
                    opts={{
                      playerVars: {
                        autoplay: 1,
                        rel: 0,
                      },
                    }}
                    onEnd={() => setPlayButtonClicked(false)}
                    className="youtube-trailer-wrapper"
                  />
                )}
                <button
                  className="absolute left-6 top-8 z-30"
                  onClick={() => navigate(-1)}
                >
                  <Icon
                    icon="solar:arrow-left-outline"
                    className="text-5xl bg-neutral-800/75 rounded-full p-1"
                  />
                </button>
                {!playButtonClicked && trailer && (
                  <div
                    className="absolute top-0 left-0 w-full h-full flex items-center justify-center z-20"
                    onClick={() => setPlayButtonClicked(true)}
                  >
                    <div className="flex flex-col items-center gap-3 mt-8">
                      <button
                        className="rounded-full border-4 p-4"
                        style={{
                          boxShadow:
                            "rgb(31 31 31 / 74%) 0px 0px 20px 13px inset, rgba(60, 60, 60, 0.64) 0px 0px 20px 13px",
                        }}
                      >
                        <Icon icon="solar:play-bold" className="text-3xl" />
                      </button>
                      <p>Trailer abspielen</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div
              className="px-6 overflow-y-auto overscroll-y-none rounded-t-3xl z-50 relative"
              id="DetailsList"
              ref={detailsListRef}
            >
              <h1 className="text-2xl font-bold text-left text-neutral-100">
                {details.title}
              </h1>
              <p className="text-neutral-300">{details.tagline}</p>
              <div className="pt-2 flex gap-2">
                <p className="text-gray-400">
                  {moment(details.release_date).format("DD.MM.YYYY")}
                </p>
                <p className="text-neutral-300">·</p>
                <p className="text-gray-400">
                  {`${Math.floor(details.runtime / 60)} Std. ${
                    details.runtime % 60
                  } Min.`}
                </p>
                <p className="text-gray-400 flex items-center gap-1">
                  <Icon icon="solar:star-bold" />
                  {convertRatingToStars(details.vote_average).toFixed(1)}
                </p>
              </div>
              <div className="pt-4 flex gap-2 flex-wrap">
                {details.genres?.map((genre, index) => (
                  <p
                    key={index}
                    className="text-neutral-100 bg-white/25 rounded-full px-2"
                    style={{ border: "1px solid rgba(255, 255, 255, 0.3)" }}
                  >
                    {genre.name}
                  </p>
                ))}
              </div>
              {streamingServices.length > 0 && (
                <div className="pt-8">
                  <h2 className="text-xl">Jetzt streamen bei</h2>
                  <div className="flex gap-2 pt-2 flex-wrap">
                    {streamingServices.map((service, index) => (
                      <a key={index} href={service.link} target="_blank">
                        <div
                          key={index}
                          className="bg-neutral-100 text-black rounded-[5px] px-2 flex flex-row gap-1 p-2"
                        >
                          <p className="capitalize font-bold">
                            {service.service}
                          </p>
                          {service.quality && (
                            <p className="uppercase">({service.quality})</p>
                          )}
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}
              {details.overview ? (
                <div className="pt-8">
                  <h2 className="text-xl">Beschreibung</h2>
                  <p className="text-gray-400 text-lg">{details.overview}</p>
                </div>
              ) : (
                <div className="pt-8">
                  <h2 className="text-xl">Beschreibung</h2>
                  <p className="text-gray-400 text-lg">
                    Keine Beschreibung verfügbar.
                  </p>
                </div>
              )}
              {details.belongs_to_collection && (
                <div className="pt-8">
                  <h2 className="text-xl">Kollektion</h2>
                  {details.belongs_to_collection.poster_path && (
                    <img
                      src={`https://image.tmdb.org/t/p/w500/${details.belongs_to_collection.poster_path}`}
                      alt={details.belongs_to_collection.name}
                      className="aspect-[2/3] object-cover rounded-[10px] w-36 h-auto mt-2"
                    />
                  )}
                  <p className="text-gray-400 text-lg pt-2">
                    {details.belongs_to_collection.name}
                  </p>
                </div>
              )}
              {details.homepage && (
                <div className="pt-4">
                  <a
                    className="break-all text-neutral-600"
                    href={details.homepage}
                    target="_blank"
                  >
                    {details.homepage}
                  </a>
                </div>
              )}
              <div className="mb-24"></div>
            </div>
          </motion.div>
        )}
      </Layout>
    </>
  );
}
