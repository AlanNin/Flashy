import React, { useState, useEffect, useRef, useContext } from "react";
import styled, { ThemeProvider, createGlobalStyle } from "styled-components";
import Menu from "./components/Menu";
import Navbar from "./components/Navbar";
import { darkTheme, lightTheme } from "./utils/Theme";
import { LanguageProvider } from './utils/LanguageContext';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Explore from "./pages/Explore";
import Search from "./pages/Search";
import History from "./pages/History";
import Subscriptions from "./pages/Subscriptions";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import VideoPage from "./pages/Video";

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
  z-index: 3;
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
                    <Route index element={<Home type="trendsub" />} />
                    <Route path="randoms" element={<Home type="random" />} />
                    <Route path="mostliked" element={<Home type="mostliked" />} />
                    <Route path="signin" element={<Signin />} />
                    <Route path="explore" element={<Explore />} />
                    <Route path="search" element={<Search />} />
                    <Route path="history" element={<History />} />
                    <Route path="subscriptions" element={<Subscriptions />} />
                    <Route path="signup" element={<Signup />} />
                    <Route
                      path="video"
                      element={<VideoPage />}
                    >
                      <Route path=":id" element={<VideoPage />} />
                    </Route>
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