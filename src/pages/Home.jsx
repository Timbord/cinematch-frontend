import React, { useState, useEffect } from "react";
import Layout from "../layouts/LayoutPrimary";
import { Icon } from "@iconify/react";
import Marquee from "react-fast-marquee";
import axios from "axios";
import { BrowserView, MobileView } from "react-device-detect";
import Tilt from "react-parallax-tilt";
import Loading from "../components/Loading";
import { Capacitor } from "@capacitor/core";
import HomeComponent from "../components/HomeComponent";

export default function Home() {
  const [isInstalled, setIsInstalled] = useState(false);
  const [banners, setBanners] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [isLandscape, setIsLandscape] = useState(
    window.innerWidth > window.innerHeight
  );

  useEffect(() => {
    const handleOrientationChange = () => {
      setIsLandscape(window.innerWidth > window.innerHeight);
    };

    window.addEventListener("orientationchange", handleOrientationChange);
    return () => {
      window.removeEventListener("orientationchange", handleOrientationChange);
    };
  }, []);

  //Banner
  useEffect(() => {
    setIsLoading(true);
    axios.get(`${import.meta.env.VITE_API_URL}getBanner`).then(
      (response) => {
        setBanners(response.data);
        setIsLoading(false);
      },
      (error) => {
        console.log(error);
      }
    );
  }, []);

  //isInstalled
  useEffect(() => {
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
    }
  }, []);

  return (
    <>
      <BrowserView>
        {!isLoading ? (
          <Layout className="Desktop">
            <div className="p-16 w-full flex flex-col lg:flex-row gap-16 lg:gap-0">
              <div className="w-full flex flex-col">
                <h1 className="text-7xl">CineMatch.</h1>
                <p className="text-2xl mt-4 ml-1 font-light">
                  Finde deinen nächsten Lieblingsfilm.
                </p>
              </div>
              <div className="w-full flex items-center lg:justify-end">
                <div className="flex items-center gap-1">
                  <Icon
                    icon="solar:smartphone-2-outline"
                    className="text-6xl"
                  />
                  <p className="font-bold text-lg">
                    Es wird ein Smartphone benötigt, <br />
                    um CineMatch nutzen zu können.
                  </p>
                </div>
              </div>
            </div>
            <Marquee>
              {banners.map((banner, index) => (
                <Tilt
                  key={index}
                  perspective={1750}
                  tiltMaxAngleX={15}
                  tiltMaxAngleY={15}
                >
                  <img
                    src={`https://image.tmdb.org/t/p/w780${banner.banner}/`}
                    alt="Movie Banner"
                    id="MarqueeBanner"
                    className="aspect-[2/3] object-cover rounded-[10px] mx-3 w-[auto]"
                  />
                </Tilt>
              ))}
            </Marquee>
          </Layout>
        ) : (
          <Loading />
        )}
      </BrowserView>
      <MobileView>
        {Capacitor.getPlatform() === "web" ? (
          !isInstalled /* Web */ ? (
            <Layout className="Mobile notInstalled">
              <div className="p-4 pt-16">
                <p className="italic">Willkommen bei</p>
                <h1 className="text-3xl font-bold">CineMatch.</h1>
                <p className="pt-4">
                  Um CineMatch nutzen zu können, ist es erforderlich, diese
                  Webseite auf dem Startbildschirm hinzuzufügen oder zu
                  installieren.
                </p>
              </div>

              <Marquee>
                {banners.map((banner, index) => (
                  <img
                    key={index}
                    src={`https://image.tmdb.org/t/p/w500${banner.banner}/`}
                    alt="Movie Banner"
                    id="MarqueeBannerMobile"
                    className="aspect-[2/3] object-cover rounded-[10px] mx-3 w-[auto]"
                  />
                ))}
              </Marquee>
            </Layout>
          ) : (
            /* PWA */
            <>
              {isLandscape ? (
                <Layout>
                  <div className="w-full h-full flex justify-center items-center">
                    <p className="font-bold text-3xl">
                      Bitte benutze CineMatch im Hochformat.
                    </p>
                  </div>
                </Layout>
              ) : (
                <>
                  <Layout>
                    <HomeComponent />
                  </Layout>
                </>
              )}
            </>
          )
        ) : (
          /* Native */
          <>
            {isLandscape ? (
              <Layout>
                <div className="w-full h-full flex justify-center items-center">
                  <p className="font-bold text-3xl">
                    Bitte benutze CineMatch im Hochformat.
                  </p>
                </div>
              </Layout>
            ) : (
              <>
                <Layout>
                  <div className="mt-12">
                    <HomeComponent />
                  </div>
                </Layout>
              </>
            )}
          </>
        )}
      </MobileView>
    </>
  );
}
