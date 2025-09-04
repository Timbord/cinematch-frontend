import React, { useEffect, useCallback, useRef } from "react";
import {
  motion,
  useMotionValue,
  animate,
  AnimatePresence,
} from "framer-motion";
import { Link } from "react-router-dom";
import { useSwipeStore } from "../stores/swiperStore";
import { useSearchStore } from "../stores/searchStore";

const ONE_SECOND = 1000;
const AUTO_DELAY = ONE_SECOND * 5;
const DRAG_BUFFER = 50;

const SPRING_OPTIONS = {
  type: "spring",
  mass: 3,
  stiffness: 200,
  damping: 50,
};

export const SwipeCarousel = ({ data }) => {
  const dataIndex = useSwipeStore((state) => state.dataIndex);
  const setDataIndex = useSwipeStore((state) => state.setDataIndex);
  const filteredData = data.filter(
    (entry) => entry.backdrop_path && entry.overview
  );
  const dragX = useMotionValue(-dataIndex * window.innerWidth);
  const isDragging = useRef(false);
  const intervalRef = useRef(null);
  const timeoutRef = useRef(null);
  const isMounted = useRef(false);
  const isSearchOpen = useSearchStore((state) => state.isOpen);
  const showGenres = useSearchStore((state) => state.showGenre);
  const chatOpen = useSearchStore((state) => state.chatOpen);

  const resetAutoSwipe = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = setInterval(() => {
      if (!isDragging.current) {
        setDataIndex((dataIndex + 1) % filteredData.length);
      }
    }, AUTO_DELAY);
  }, [dataIndex, filteredData.length, setDataIndex]);

  const stopAutoSwipe = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, []);

  const onDragStart = () => {
    isDragging.current = true;
    stopAutoSwipe();
  };

  useEffect(() => {
    if (isSearchOpen) {
      stopAutoSwipe();
    } else {
      resetAutoSwipe();
    }
  }, [isSearchOpen]);

  useEffect(() => {
    if (showGenres) {
      stopAutoSwipe();
    } else {
      resetAutoSwipe();
    }
  }, [showGenres]);

  useEffect(() => {
    if (chatOpen) {
      stopAutoSwipe();
    } else {
      resetAutoSwipe();
    }
  }, [chatOpen]);

  const onDragEnd = (event, info) => {
    const x = info.offset.x;
    isDragging.current = false;

    if (x < -DRAG_BUFFER && dataIndex < filteredData.length - 1) {
      setDataIndex(dataIndex + 1);
    } else if (x > DRAG_BUFFER && dataIndex > 0) {
      setDataIndex(dataIndex - 1);
    } else {
      animate(dragX, -dataIndex * window.innerWidth, SPRING_OPTIONS);
    }

    timeoutRef.current = setTimeout(() => {
      resetAutoSwipe();
    }, AUTO_DELAY);
  };

  useEffect(() => {
    if (isMounted.current) {
      animate(dragX, -dataIndex * window.innerWidth, SPRING_OPTIONS);
    } else {
      dragX.set(-dataIndex * window.innerWidth);
      isMounted.current = true;
    }
  }, [dataIndex, dragX]);

  useEffect(() => {
    resetAutoSwipe();
    return () => {
      stopAutoSwipe();
    };
  }, [resetAutoSwipe, stopAutoSwipe]);

  return (
    <div className="relative">
      <div className="relative -mt-2 z-40">
        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          style={{ x: dragX }}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          onDrag={(event, info) => {
            dragX.set(info.offset.x - dataIndex * window.innerWidth);
          }}
          transition={SPRING_OPTIONS}
          className="flex cursor-grab items-center active:cursor-grabbing"
        >
          <Cards dataIndex={dataIndex} data={filteredData} />
        </motion.div>
      </div>
      {filteredData[0] && (
        <AnimatePresence>
          <motion.img
            key={filteredData[dataIndex].id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            src={`https://image.tmdb.org/t/p/w500${filteredData[dataIndex].backdrop_path}`}
            alt="Background"
            className="absolute top-0 left-0 w-full h-full object-cover z-10"
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
        </AnimatePresence>
      )}
    </div>
  );
};

const Cards = ({ dataIndex, data }) => {
  return (
    <>
      {data.map((entry, idx) => {
        let translateX = 0;
        if (idx === dataIndex - 1) {
          translateX = 55;
        } else if (idx === dataIndex + 1) {
          translateX = -55;
        }
        return (
          <Link key={idx} to={`movie/${entry.id}`}>
            <motion.div
              style={{
                backgroundImage: `url(https://image.tmdb.org/t/p/w780${entry.backdrop_path})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
              animate={{
                scale: dataIndex === idx ? 0.9 : 0.8,
                x: translateX,
              }}
              transition={SPRING_OPTIONS}
              className="aspect-video w-screen shrink-0 rounded-2xl bg-neutral-800 object-cover"
            >
              <div
                className="absolute top-4 left-4 bg-white rounded-[10px]"
                style={{ boxShadow: "rgba(0, 0, 0, 0.75) -3px 7px 12px 1px" }}
              >
                <p className="text-black px-3 text-xs font-bold">NEU</p>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-2/6 bg-gradient-to-t from-black to-transparent rounded-b-2xl" />
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white rounded-2-3xl font-bold">
                {entry.title}
              </div>
            </motion.div>
          </Link>
        );
      })}
    </>
  );
};
