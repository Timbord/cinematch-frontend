import { useEffect, useState, useRef } from "react";
import Layout from "../layouts/LayoutDetail";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Icon } from "@iconify/react";
import moment from "moment";
import "moment/locale/de";
import Loading from "../components/Loading";
import { motion, useMotionValue, useAnimation } from "framer-motion";

moment().locale("de");

export default function MovieDetails() {
  const { tmdbid } = useParams();
  const [details, setDetails] = useState([]);
  const [streamingServices, setStreamingServices] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  let navigate = useNavigate();
  const containerRef = useRef(null);
  const y = useMotionValue(0);
  const handleRef = useRef(null);
  const controls = useAnimation();
  const [isFullyOpened, setIsFullyOpened] = useState(false);

  function convertRatingToStars(rating) {
    return ((rating - 1) / (10 - 1)) * (5 - 1) + 1;
  }

  useEffect(() => {
    setIsLoading(true);
    axios
      .post(`${import.meta.env.VITE_API_URL}getMovieDetails`, {
        tmdbid: tmdbid,
      })
      .then(
        (response) => {
          setDetails(response.data);
          setIsLoading(false);
        },
        (error) => {
          console.log(error);
        }
      );
    // axios
    //   .post(`${import.meta.env.VITE_API_URL}getStreamingServices`, {
    //     tmdbid: tmdbid,
    //   })
    //   .then(
    //     (response) => {
    //       setStreamingServices(response.data);
    //     },
    //     (error) => {
    //       console.log(error);
    //     }
    //   );
  }, []);

  const handleDragEnd = async () => {
    const threshold = -150; // Die Schwelle, um zu entscheiden, wo das Fenster einrastet
    const currentY = y.get();

    if (currentY < threshold) {
      // Bewegen des Fensters ganz nach oben
      controls.start({ y: -300 });
      setIsFullyOpened(true);
    } else {
      // Bewegen des Fensters in die untere Position
      controls.start({ y: 0 });
      setIsFullyOpened(false);
    }
  };

  useEffect(() => {
    const updateVisibleHeight = () => {
      const viewportHeight = window.innerHeight;
      const fullHeight = containerRef.current.clientHeight;
      const differenz = fullHeight - viewportHeight;
      const calculatedHeight = viewportHeight - differenz;
      if (containerRef.current) {
        containerRef.current.style.height = `${calculatedHeight}px`;
      }
    };

    if (isFullyOpened) {
      window.addEventListener("resize", updateVisibleHeight);
      updateVisibleHeight();
      return () => window.removeEventListener("resize", updateVisibleHeight);
    }
  }, [isFullyOpened]);

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <Layout>
          <div className="relative z-90 mt-12">
            <img
              src={`https://image.tmdb.org/t/p/w500/${details.backdrop_path}`}
              alt="Poster"
              className="object-cover w-full h-[350px] relative z-10"
              style={{
                filter: "blur(24px)",
                WebkitFilter: "blur(24px)",
                transform: "translate3d(0, 0, 0)",
                WebkitTransform: "translateZ(0)",
                WebkitBackfaceVisibility: "hidden",
                WebkitPerspective: 1000,
              }}
            />
            <div className="absolute top-0 left-0 z-20 h-full w-full flex items-center justify-center">
              <img
                src={`https://image.tmdb.org/t/p/w1280/${details.backdrop_path}`}
                alt="Poster"
                className="object-cover h-[90%] w-[95%] rounded-3xl"
              />
              <button
                className="absolute left-8 top-8 z-30"
                onClick={() => navigate(-1)}
              >
                <Icon icon="solar:arrow-left-outline" className="text-3xl" />
              </button>
              <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center z-20">
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
            </div>
          </div>
          <motion.div
            className="px-6 overflow-hidden bg-[#1A1A1A] rounded-t-3xl z-50 relative"
            style={{ y }}
            drag="y"
            dragConstraints={{ top: -300, bottom: 0 }}
            dragElastic={0.2}
            dragHandle={handleRef}
            onDragEnd={handleDragEnd}
            animate={controls}
          >
            <div
              className="w-full h-[50px] flex justify-center items-center"
              ref={handleRef}
            >
              <div className="w-[75px] h-[5px] bg-white rounded-[5px]" />
            </div>
            <div
              ref={containerRef}
              style={{ overflowY: isFullyOpened ? "scroll" : "hidden" }}
              id="DetailsList"
              onPointerDownCapture={(event) => event.stopPropagation()}
            >
              <h1 className="text-3xl font-bold text-left text-neutral-100">
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
          </motion.div>
        </Layout>
      )}
    </>
  );
}
