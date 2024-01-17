import React, { useState, useEffect, useRef, useContext } from "react";
import styled, { ThemeProvider, createGlobalStyle } from "styled-components";
import Menu from "./components/Menu";
import Navbar from "./components/Navbar";
import { darkTheme, lightTheme } from "./utils/Theme";
import { LanguageProvider } from './utils/LanguageContext';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Explore from "./pages/Explore";
import Search from "./pages/Search";
import History from "./pages/History";
import Subscriptions from "./pages/Subscriptions";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import Recovery from "./pages/Recovery";
import VideoPage from "./pages/Video";
import Library from "./pages/Library";
import SharedPlaylist from "./pages/SharedPlaylist";
import FlashyContent from "./pages/FlashyContent";
import Settings from "./pages/Settings";
import Channel from "./pages/Channel";
import About from "./pages/About";
import Terms from "./pages/Terms";
import Contact from "./pages/Contact";
import NotFound404 from "./pages/NotFound404";
import ConfirmUser from "./pages/ConfirmUser";
import ConfirmEmailChange from "./pages/ConfirmEmailChange";
import { useSelector } from "react-redux";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Container = styled.div`
  position: relative;
  display: block;
  width:100%;
`;

const FlexContainer = styled.div`
  position: relative;
  display: flex;
  margin: 0 auto;
  background: red;
  width:100%;
`;

const Main = styled.div`
  position: relative;
  flex: 7;
  height: 100%; 
  width: 100vh; 
  background-color: rgba(15, 12, 18);
`;


const DesenfoqueWithMenu = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  background: ${({ menuVisible, theme }) =>
    menuVisible ? theme.bgLighter : "none"};
  backdrop-filter: ${({ menuVisible }) => (menuVisible ? "blur(10px)" : "none")};
  z-index: 4;
  pointer-events: ${({ menuVisible }) => (menuVisible ? "auto" : "none")};
`;

const GlobalStyle = createGlobalStyle`
  body {
    overflow: ${({ menuVisible }) => (menuVisible ? "hidden" : "auto")};
    scrollbar-width: thin;
    scrollbar-color: #4a4a4a #2a292f;
  }

  ::-webkit-scrollbar {
    width: 7px;
  }

  ::-webkit-scrollbar-thumb {
    background-color: #424242;
    border-radius: 6px;
  }

  ::-webkit-scrollbar-track {
    background-color: #1B1A1D;
    border-radius: 0px;
  }
`;


function App() {
  const { currentUser } = useSelector(state => state.user);
  const [darkMode, setDarkMode] = useState(true);
  const [menuVisible, setMenuVisible] = useState(false);

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <LanguageProvider>
        <Container>
          <BrowserRouter>
            <FlexContainer>
              <DesenfoqueWithMenu menuVisible={menuVisible} />
              <GlobalStyle menuVisible={menuVisible} />

              {/* NAVBAR */}
              <Navbar menuVisible={menuVisible} toggleMenu={toggleMenu} />

              <Menu
                darkMode={darkMode}
                setDarkMode={setDarkMode}
                menuVisible={menuVisible}
                toggleMenu={toggleMenu}
              />
              <Main>
                <Routes>
                  <Route path="/">

                    {/* PAGES */}
                    <Route index element={<Home type="trendsub" />} />
                    <Route path="randoms" element={<Home type="random" />} />
                    <Route path="mostliked" element={<Home type="mostliked" />} />
                    <Route path="explore" element={<Explore />} />
                    <Route path="subscriptions" element={<Subscriptions />} />
                    <Route path="history" element={<History />} />
                    <Route path="library" element={<Library />} />
                    <Route path="settings" element={<Settings />} />
                    <Route path="search" element={<Search />} />
                    <Route path="signin" element={<Signin />} />
                    <Route path="signup" element={<Signup />} />
                    <Route path="recovery" element={<Recovery />} />
                    <Route path="about" element={<About />} />
                    <Route path="terms" element={<Terms />} />
                    <Route path="contact" element={<Contact />} />

                    {/* Flashy Content */}
                    <Route path="music" element={<FlashyContent />} />
                    <Route path="sports" element={<FlashyContent />} />
                    <Route path="movies" element={<FlashyContent />} />
                    <Route path="series" element={<FlashyContent />} />
                    <Route path="videogames" element={<FlashyContent />} />

                    {/* VIDEO ROUTES */}
                    <Route
                      path="video"
                      element={<VideoPage />}
                    >
                      <Route path=":id" element={<VideoPage />} />
                    </Route>

                    {/* SHARED PLAYLIST */}
                    <Route
                      path="playlist"
                      element={<SharedPlaylist />}
                    >
                      <Route path=":id" element={<SharedPlaylist />} />
                    </Route>

                    {/* CONFIRM USER */}
                    <Route
                      path="confirm"
                      element={<ConfirmUser />}
                    >
                      <Route path=":token" element={<ConfirmUser />} />
                    </Route>

                    {/* EMAIL CHANGE */}
                    <Route
                      path="confirmEmail"
                      element={<ConfirmEmailChange />}
                    >
                      <Route path=":token" element={<ConfirmEmailChange />} />
                    </Route>

                    <Route
                      path="channel"
                      element={<Channel />}
                    >
                      <Route path=":userid" element={<Channel />} />
                    </Route>

                    {/* HANDLE UNDEFINED ROUTE */}
                    <Route path="*" element={<NotFound404 />} />

                  </Route>
                </Routes>
              </Main>
            </FlexContainer>
          </BrowserRouter>
        </Container>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;