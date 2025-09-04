import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { useSearchStore } from "../stores/searchStore";
import { MobileView } from "react-device-detect";

export default function LayoutPrimary({ children, className }) {
  const [showTopbar, setShowTopbar] = useState(false);
  const setIsSearchOpen = useSearchStore((state) => state.setIsOpen);
  const setShowGenres = useSearchStore((state) => state.setShowGenre);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (contentWrapper.scrollTop > 50) {
        setShowTopbar(true);
      } else {
        setShowTopbar(false);
      }
    };

    const contentWrapper = document.getElementById("contentWrapper");

    if (contentWrapper) {
      contentWrapper.addEventListener("scroll", handleScroll);

      return () => {
        contentWrapper.removeEventListener("scroll", handleScroll);
      };
    }
  }, [showTopbar]);

  //isInstalled
  useEffect(() => {
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
    }
  }, []);

  return (
    <div
      id="Primary"
      className={`overscroll-y-none ${className ? className : ""}`}
    >
      <MobileView>
        {isInstalled && (
          <div
            id="Topbar"
            className={`fixed top-0 left-0 h-20 bg-[#383838] border-b-1 border-[#464646] w-full z-50 transition-opacity duration-500 ${
              showTopbar
                ? "opacity-100 pointer-events-auto"
                : "opacity-0 pointer-events-none"
            }`}
            style={{ boxShadow: "0px 5px 40px 5px rgb(0 0 0 / 50%)" }}
          >
            <div className="w-full h-full flex items-end justify-between px-6 py-4">
              <h2 className="text-2xl font-bold">CineMatch</h2>
              <div className="flex flex-row gap-4">
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
                <button onClick={() => setIsSearchOpen(true)}>
                  <Icon icon="solar:magnifer-outline" className="text-3xl" />
                </button>
              </div>
            </div>
          </div>
        )}
      </MobileView>
      <div
        id="contentWrapper"
        className="w-full h-full overflow-x-hidden overscroll-y-none no-scrollbar"
      >
        {children}
      </div>
    </div>
  );
}
