import React, { useState, useEffect, useRef, useContext } from "react";
import styled from "styled-components";
import Card from "../components/Card";
import HomeSlideShow from "../components/HomeSlideShow/SlideShow";
import TrendSlider from "../components/TrendSlider";
import Footer from "../components/Footer";
import { useLanguage } from '../utils/LanguageContext';
import axios from "axios";
import { useDispatch, useSelector } from 'react-redux';
import RegularGif from "../assets/StudioG1.gif"
import ChipiChipiChapaChapa from '../assets/ChipiChipiChapaChapa.gif';

const MainContainer = styled.div`
  position: relative;
  top: 0;
  margin: auto;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.background};
  max-width: 1920px;
  overflow-x: clip;
`;

const ShareContainer = styled.div`
  position: absolute;
  display: flex;
  margin-top: 8px;
  margin-left: 55px;
  right: 0px;
  margin-right: 12px;
  align-items: center;
`;

const GifH = styled.img`
  width: 70px;
  height: 58px;
  transform: scaleX(-1); 
`;

const ShareDiv = styled.h1`
  flex-direction: column;
  display: flex;
  align-items: center;
  margin-right: 5px;
`;

const Share1 = styled.h1`
  font-size: 15px;
  color: ${({ theme }) => theme.sharetxt};
  margin-right: 20px;
  font-family: "Roboto Condensed", Helvetica;
  font-weight: 600;
`;

const Share2 = styled.h1`
  font-size: 15px;
  color: ${({ theme }) => theme.text};
  font-family: "Roboto Condensed", Helvetica;
  font-weight: 500;
`;


const Header = styled.h1`
font-size: 32px;
color: ${({ theme }) => theme.trendsliderheader};
margin-top: 32px;
margin-left: 55px;
font-weight: bold;
font-family: "Roboto Condensed", Helvetica;
`;

const Container = styled.div`
  display: flex;
  justify-content: flex-start; 
  flex-wrap: wrap;
  gap: 14px;
`;

const Wrapper = styled.div`
  padding: 32px 55px 32px 58px;
  background-color: ${({ theme }) => theme.background};
`;


const Home = ({ type }) => {
  const { language, setLanguage } = useLanguage();
  const [videos, setVideos] = useState([])
  const { currentUser } = useSelector(state => state.user);

  const translations = {
    en: {
      share1: "Share Flashy",
      share2: "To your friends",
      foryou: "For You",
    },
    es: {
      share1: "Comparte Flashy",
      share2: "Con Tus Amigos",
      foryou: "Para ti",
    },
  };

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        let res;
        if (currentUser && (currentUser.subscribers > 0 || currentUser.subscribedUsers.length > 0)) {
          res = await axios.get(`/videos/${type}`);
          if (res && res.data && res.data.length > 0) {

          } else {
            res = await axios.get("/videos/random");
          }
        } else {
          res = await axios.get("/videos/random");
        }
        setVideos(res.data);
      } catch (error) {
        console.error("Error fetching videos:", error);
      }
    };

    fetchVideos();
  }, [type, currentUser]);

  // CHIPI CHIPI CHAPA CHAPA DUBI DUBI DABA DABA 
  const selectRandomImage = () => {
    const random = Math.random();
    const probability = 0.01; // Probabilidad 1%

    if (random < probability) {
      return ChipiChipiChapaChapa;
    } else {
      return RegularGif;
    }
  };

  return (
    <MainContainer>

      <HomeSlideShow />

      <ShareContainer>
        <ShareDiv>
          <Share1>
            {translations[language].share1}
          </Share1>
          <Share2>
            {translations[language].share2}
          </Share2>
        </ShareDiv>
        <GifH src={selectRandomImage()} />
      </ShareContainer>

      <TrendSlider />

      <Header>{translations[language].foryou}</Header>

      <Wrapper>

        <Container>
          {videos.map((video) => (
            <Card key={video._id} video={video} />
          ))}
        </Container>

      </Wrapper>

      <Footer />

    </MainContainer>

  );
};

export default Home;
