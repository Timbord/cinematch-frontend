import React, { useState, useEffect } from "react";
import axios from "axios";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  TypingIndicator,
} from "@chatscope/chat-ui-kit-react";
import { useSearchStore } from "../stores/searchStore";
import { motion, AnimatePresence } from "framer-motion";
import { Capacitor } from "@capacitor/core";
import { Keyboard } from "@capacitor/keyboard";
import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";

export default function Chat() {
  const setChatOpen = useSearchStore((state) => state.setChatOpen);
  const [messages, setMessages] = useState([
    {
      message: "Hallo, ich bin Matchy. Wie kann ich dir helfen?",
      sentTime: "just now",
      sender: "ChatGPT",
      direction: "incoming",
    },
  ]);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const [foundMovies, setFoundMovies] = useState([]);
  const [showFoundMovies, setShowFoundMovies] = useState(false);

  function convertRatingToStars(rating) {
    return ((rating - 1) / (10 - 1)) * (5 - 1) + 1;
  }

  const handleSend = async (message) => {
    const newMessage = {
      message,
      direction: "outgoing",
      sender: "user",
    };

    const newMessages = [...messages, newMessage];

    setMessages(newMessages);

    // Initial system message to determine ChatGPT functionality
    setIsTyping(true);
    await processMessageToChatGPT(newMessages);
  };

  async function processMessageToChatGPT(chatMessages) {
    let apiMessages = chatMessages.map((messageObject) => {
      let role = "";
      if (messageObject.sender === "ChatGPT") {
        role = "assistant";
      } else {
        role = "user";
      }
      return { role: role, content: messageObject.message };
    });

    await axios
      .post(`${import.meta.env.VITE_API_URL}chat`, {
        message: apiMessages,
      })
      .then((data) => {
        if (data.data.movieData) {
          addMovie(data.data.movieData);
        }
        setMessages([
          ...chatMessages,
          {
            message: data.data.messages,
            sender: "ChatGPT",
            direction: "incoming",
          },
        ]);
        setIsTyping(false);
      });
  }

  const addMovie = (newMovie) => {
    if (newMovie.id) {
      setFoundMovies((prevMovies) => {
        if (!prevMovies.some((movie) => movie.id === newMovie.id)) {
          return [...prevMovies, newMovie];
        }
        return prevMovies;
      });
    }
  };

  useEffect(() => {
    if (Capacitor.getPlatform() !== "web") {
      Keyboard.setAccessoryBarVisible({ isVisible: false });
      Keyboard.setResizeMode({ mode: "none" }); // Verhindert das Hochschieben der Ansicht

      const showListener = Keyboard.addListener("keyboardWillShow", (info) => {
        setKeyboardHeight(info.keyboardHeight);
        setKeyboardOpen(true);
      });

      const hideListener = Keyboard.addListener("keyboardWillHide", () => {
        setKeyboardHeight(0);
        setKeyboardOpen(false);
      });

      return () => {
        showListener.remove();
        hideListener.remove();
      };
    }
  }, []);

  return (
    <motion.div
      key="chat"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      className={`fixed w-full h-full z-[99] bg-gray-700/35 backdrop-blur-xl ${
        Capacitor.getPlatform() !== "web" && "-mt-12"
      }`}
    >
      <div
        id="Topbar"
        className="fixed top-0 left-0 h-20 bg-[#383838] border-b-1 border-[#464646] w-full z-50 transition-opacity duration-500"
        style={{ boxShadow: "0px 5px 40px 5px rgb(0 0 0 / 50%)" }}
      >
        <div className="w-full h-full flex items-end justify-between px-6 py-4">
          <button onClick={() => setChatOpen(false)}>
            <Icon icon="solar:arrow-left-outline" className="text-3xl" />
          </button>
          <div className="absolute top-0 left-0 w-full h-full px-6 py-4 flex items-end justify-center pointer-events-none">
            <h2 className="text-2xl font-light">Chat</h2>
          </div>
          <button className="relative" onClick={() => setShowFoundMovies(true)}>
            <Icon icon="solar:clapperboard-open-bold" className="text-3xl" />
            <p className="absolute bottom-[-2px] right-[-2px] flex justify-center items-center bg-red-800 text-[0.75rem] h-[17px] w-[17px] rounded-full">
              {foundMovies.length}
            </p>
          </button>
        </div>
      </div>
      <AnimatePresence>
        {showFoundMovies && (
          <motion.div
            key="foundMovies"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute top-0 left-0 w-full h-full bg-black/75 z-[99]"
          >
            {foundMovies.length > 0 ? (
              <div className="grid grid-cols-2 gap-4 px-6 py-6 overflow-y-scroll h-full">
                {foundMovies.map((movie, index) => (
                  <Link to={`/movie/${movie.id}`} key={index}>
                    <img
                      className="w-full rounded-xl aspect-[2/3] object-cover"
                      src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                      alt="Poster"
                      style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px" }}
                    />
                    <p className="w-32 mt-2 line-clamp-1">{movie.title}</p>
                    <p className="text-gray-400 flex items-center gap-1 mt-1">
                      <Icon icon="solar:star-bold" />
                      {convertRatingToStars(movie.vote_average).toFixed(1)}
                    </p>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="w-full h-full flex justify-center items-center">
                <h3>Noch keine Filme gefunden.</h3>
              </div>
            )}
            <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-b from-transparent to-black/75 flex items-center justify-center">
              <button onClick={() => setShowFoundMovies(false)}>
                <Icon
                  icon="solar:close-circle-bold"
                  className="text-6xl mb-20"
                />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <MainContainer>
        <ChatContainer
          className={`${keyboardOpen ? "open" : ""}`}
          style={{ paddingBottom: `${keyboardHeight}px` }}
        >
          <MessageList
            scrollBehavior="smooth"
            typingIndicator={
              isTyping ? (
                <TypingIndicator content="Matchy ist am überlegen.." />
              ) : null
            }
          >
            {messages.map((message, i) => {
              return <Message key={i} model={message} />;
            })}
          </MessageList>
          <MessageInput placeholder="Nachricht eingeben.." onSend={handleSend} />
        </ChatContainer>
      </MainContainer>
    </motion.div>
  );
}
