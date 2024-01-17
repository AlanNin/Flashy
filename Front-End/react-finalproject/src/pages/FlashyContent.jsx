import React, { useState, useEffect, useRef, useContext } from "react";
import SadFace from "../assets/NotSubbedIcono.png";
import ListeningMusic from "../assets/ListeningMusic.gif";
import SportsGif from "../assets/SportsGif.gif";
import MoviesIcono from "../assets/MoviesIcono.gif";
import WatchingSeriesIcono from "../assets/WatchingSeriesIcono.gif";
import VideogamesIcono from "../assets/VideogamesIcono.gif";
import styled from "styled-components";
import Card from "../components/Card";
import { useLanguage } from '../utils/LanguageContext';
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Footer from "../components/Footer";

const MainContainer = styled.div`
position: relative;    
display: flex;
flex-direction: column;
  width: 100%;
  top: 0;
  min-height: 100vh;
  background-color: rgba(15, 12, 18);
  margin: auto;
  max-width: 1920px;
  overflow: hidden;
`;

const HeaderDiv = styled.div`
  position: relative;
  display: flex;
  top: 100px;
  top: ${({ tag }) =>
  (tag === 'music' ? '100px' :
    tag === 'sports' ? '84px' :
      tag === 'movies' ? '92px' :
        tag === 'series' ? '99px' :
          '100px')};
  margin-left: 55px;
  margin-bottom: 110px;
  gap: 20px;
  align-items: center;
`;

const HeaderSubHeaderDiv = styled.div`
  display: flex;
  flex-direction: column;
`;

const SubHeader = styled.h1`
font-size: 14px;
color: ${({ theme }) => theme.textSoft};
font-weight: normal;
font-family: "Roboto Condensed", Helvetica;
opacity: 0.8;
`;

const Header = styled.h1`
font-size: 40px;
color: rgba(224, 175, 208);
font-weight: bold;
font-family: "Roboto Condensed", Helvetica;
`;

const HeaderIlustration = styled.img`
  width: 80px;
  height: auto;
`;

const Container = styled.div`
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  z-index: 1;
  gap: 16px;
`;

const Wrapper = styled.div`
  padding: 32px 55px 32px 58px;
`;

const NoVideosWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  margin-top: 100px;
`;
const NoVideos1 = styled.h1`
  margin-top: 15px;
  font-size: 32px;
  color: rgba(224, 175, 208, 0.8);
  font-weight: bold;
  font-family: "Roboto Condensed", Helvetica;
`;

const NovideosImg = styled.img`
  height: 96px;
  width: 96px;
  padding: 20 px;
`;

const Home = () => {
  const { language, setLanguage } = useLanguage();
  const [NoVideosFound, setNoVideosFound] = useState(false);
  const tag = useLocation().pathname.split("/")[1]?.toLowerCase();

  const translations = {
    en: {
      subheader: "Flashy Content",
      header: tag === 'music' ? 'Music' :
        tag === 'sports' ? 'Sports' :
          tag === 'movies' ? 'Movies' :
            tag === 'series' ? 'TV Shows' :
              'Video Games',
      novideo1: "No videos found",
    },
    es: {
      subheader: "Contenido Flashy",
      header: tag === 'music' ? 'Música' :
        tag === 'sports' ? 'Deportes' :
          tag === 'movies' ? 'Películas' :
            tag === 'series' ? 'Series' :
              'Videojuegos',
      novideo1: "No se han encontrado videos",
    },
  };

  const [videos, setVideos] = useState([])
  useEffect(() => {
    setNoVideosFound(false);
    const fetchVideos = async () => {
      try {
        const res = await axios.get(`/videos/tag/${tag}`);
        if (res && res.data && res.data.length > 0) {

        } else {
          setNoVideosFound(true);
        }
        setVideos(res.data);
      } catch (error) {
        console.error("Error fetching videos:", error);
      }
    };
    fetchVideos()
  }, [tag]);


  return (
    <MainContainer>

      <HeaderDiv tag={tag}>
        <HeaderSubHeaderDiv>
          <SubHeader> {translations[language].subheader} </SubHeader>
          <Header> {translations[language].header} </Header>
        </HeaderSubHeaderDiv>
        <HeaderIlustration src={
          tag === 'music' ? ListeningMusic :
            tag === 'sports' ? SportsGif :
              tag === 'movies' ? MoviesIcono :
                tag === 'series' ? WatchingSeriesIcono :
                  VideogamesIcono}
        />
      </HeaderDiv>

      <Wrapper>

        <Container>
          {videos.map((video) => (
            <Card key={video._id} video={video} />
          ))}

        </Container>

      </Wrapper>

      {NoVideosFound &&
        <NoVideosWrapper>
          <NovideosImg src={SadFace} />
          <NoVideos1>{translations[language].novideo1}</NoVideos1>
        </NoVideosWrapper>
      }

      {!NoVideosFound &&
        <Footer />
      }

    </MainContainer>

  );
};

export default Home;
