import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Icon } from "@iconify/react";
import moment from "moment";
import "moment/locale/de";
import LoadingAnimation from "../assets/images/loading.gif";
import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";
import YouTube from "react-youtube";

export default function FloatingWindow({ setIsVisible, tmdbid }) {
  const [details, setDetails] = useState([]);
  const [videos, setVideos] = useState([]);
  const [streamingServices, setStreamingServices] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [ref, inView] = useInView({
    triggerOnce: false,
  });

  const opacity = inView ? 0 : 1;

  useEffect(() => {
    setIsLoading(true);
    const fetchDetails = async () => {
      try {
        const movieDetailsResponse = await axios.post(
          `${import.meta.env.VITE_API_URL}getMovieDetails`,
          { tmdbid: tmdbid }
        );
        setDetails(movieDetailsResponse.data);
        const streamingResponse = await axios.post(
          `${import.meta.env.VITE_API_URL}getStreamingServices`,
          { tmdbid: tmdbid }
        );
        setStreamingServices(streamingResponse.data);
        const videoResponse = await axios.post(
          `${import.meta.env.VITE_API_URL}getTrailer`,
          { tmdbid: tmdbid }
        );
        console.log(videoResponse.data);
        setVideos(videoResponse.data);
      } catch (error) {
        console.error("Error loading the data: ", error);
      }
      setIsLoading(false);
    };
    fetchDetails();
  }, []);

  useEffect(() => {
    console.log(videos);
  }, [videos]);

  function convertRatingToStars(rating) {
    return ((rating - 1) / (10 - 1)) * (5 - 1) + 1;
  }

  return (
    <div className="backdropBlur flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        id="FloatingWindow"
      >
        {isLoading ? (
          <div className="h-full w-full flex justify-center items-center">
            <img src={LoadingAnimation} alt="Loading" className="w-32 h-32" />
          </div>
        ) : (
          <>
            <div className="relative">
              <button
                className="absolute right-4 top-4 bg-zinc-400/75 rounded-full p-2 z-10"
                onClick={() => setIsVisible(false)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="#fff"
                  className="w-7 h-7"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18 18 6M6 6l12 12"
                  />
                </svg>
              </button>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{
                  opacity: !inView ? 1 : 0,
                  transition: { duration: 0.4 },
                }}
                className="absolute top-0 left-0 w-full h-full flex items-end px-4 bg-gradient-to-t from-black to-transparent"
              >
                <motion.h1
                  initial={{ opacity: 0 }}
                  animate={{ opacity: opacity, transition: { duration: 0.5 } }}
                  className="text-xl font-bold text-left pb-4 text-white"
                >
                  {details.title}
                </motion.h1>
              </motion.div>
              <img
                src={`https://image.tmdb.org/t/p/w500/${details.backdrop_path}`}
                alt="Poster"
                className="aspect-[16/9] object-cover w-full h-[245px]"
                style={{
                  borderTopLeftRadius: "15px",
                  borderTopRightRadius: "15px",
                }}
              />
            </div>
            {/* <YouTube id="YoutubeWrapper" videoId={"SJJ_vgYOeLo"} /> */}
            <div
              className="px-4"
              style={{
                height: "calc(100% - 245px)",
                overflowY: "scroll",
              }}
              id="DetailsList"
            >
              <h1
                ref={ref}
                className="text-3xl font-bold text-left pt-4 text-neutral-100"
              >
                {details.title}
              </h1>
              <p className="text-neutral-300">{details.tagline}</p>
              <div className="pt-2 flex gap-2">
                <p className="text-gray-400">
                  {moment(details.release_date).format("DD.MM.YYYY")}
                </p>
                <p className="text-gray-400">
                  {`${Math.floor(details.runtime / 60)}h ${
                    details.runtime % 60
                  }min`}
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
                  <h2 className="text-2xl">Streaming</h2>
                  <div className="flex gap-2 pt-2 flex-wrap">
                    {streamingServices.map((service, index) => (
                      <a key={index} href={service.link} target="_blank">
                        <div
                          key={index}
                          className="text-neutral-100 bg-white/25 rounded-[10px] px-2"
                          style={{
                            border: "1px solid rgba(255, 255, 255, 0.3)",
                          }}
                        >
                          <p className="capitalize">{service.service}</p>
                          <p className="uppercase">{service.quality}</p>
                          <p>
                            {service.streamingType === "buy"
                              ? "Kaufen"
                              : "Leihen"}
                          </p>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}
              {details.overview ? (
                <div className="pt-8">
                  <h2 className="text-2xl">Beschreibung</h2>
                  <p className="text-gray-400 text-lg">{details.overview}</p>
                </div>
              ) : (
                <div className="pt-8">
                  <h2 className="text-2xl">Beschreibung</h2>
                  <p className="text-gray-400 text-lg">
                    Keine Beschreibung verfügbar.
                  </p>
                </div>
              )}
              {details.belongs_to_collection && (
                <div className="pt-8">
                  <h2 className="text-2xl">Kollektion</h2>
                  <img
                    src={`https://image.tmdb.org/t/p/w500/${details.belongs_to_collection.poster_path}`}
                    alt={details.belongs_to_collection.name}
                    className="aspect-[2/3] object-cover rounded-[10px] w-36 h-auto mt-2"
                  />
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
              <div className="mb-12"></div>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}
