import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";

export default function LayoutSeeAll({ children, className }) {
  const [showTopbar, setShowTopbar] = useState(false);

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

  return (
    <div id="Primary" className={` ${className ? className : ""}`}>
      {/* <div
        id="Topbar"
        className={`fixed top-0 left-0 h-28 bg-[#232323]/50 backdrop-blur-lg border-b-1 border-[#464646] w-full z-50 transition-opacity duration-500 ${
          showTopbar ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="w-full h-full flex items-end justify-between px-6 py-4">
          <h2 className="text-2xl font-bold">CineMatch</h2>
          <button>
            <Icon icon="solar:magnifer-outline" className="text-3xl" />
          </button>
        </div>
      </div> */}
      <div
        id="contentWrapper"
        className="w-full h-full overflow-x-hidden no-scrollbar"
      >
        {children}
      </div>
    </div>
  );
}
