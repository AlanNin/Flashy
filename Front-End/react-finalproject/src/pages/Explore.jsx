import React, { useState, useEffect, useRef, useContext } from "react";
import SadFace from "../assets/NotSubbedIcono.png";
import styled from "styled-components";
import Card from "../components/Card";
import { useLanguage } from '../utils/LanguageContext';
import axios from "axios";

const MainContainer = styled.div`
  display: relative;
  width: 100%;
  min-height: 100vh;
  background-color: rgba(15, 12, 18);
  z-index: 1;
`;

const Header = styled.h1`
font-size: 32px;
color: rgba(224, 175, 208);
padding :100px 55px 20px 55px;
font-weight: bold;
font-family: "Roboto Condensed", Helvetica;
`;

const Container = styled.div`
  display: flex;
  justify-content: flex-start;  // Ajusta la propiedad justify-content
  flex-wrap: wrap;
  z-index: 1;
  gap: 118px;
`;

const Wrapper = styled.div`
  padding: 32px 55px;
`;

const NoVideosWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center; // Alineación del texto
`;
const NoVideos1 = styled.h1`
  margin-top: 15px;
  font-size: 32px;
  color: rgba(224, 175, 208, 0.8);
  font-weight: bold;
  font-family: "Roboto Condensed", Helvetica;
`;
const NoVideos2 = styled.h1`
  margin-top: 15px;
  font-size: 32px;
  color: white;
  font-weight: bold;
  font-family: "Roboto Condensed", Helvetica;
`;

const NovideosImg = styled.img`
  height: 96px;
  width: 96px;
  padding: 20 px;
`;

const Home = ({ type = "random" }) => {
  const { language, setLanguage } = useLanguage();
  const [NoVideosFound, setNoVideosFound] = useState(false);

  const translations = {
    en: {
      explore: "Explore",
      novideo1: "No videos found",
    },
    es: {
      explore: "Explorar",
      novideo1: "No se han encontrado videos",
    },
  };

  const [videos, setVideos] = useState([])
  useEffect(() => {
    setNoVideosFound(false);
    const fetchVideos = async () => {
      try {
        const res = await axios.get(`/videos/${type}`);
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
  }, [type]);


  return (
    <MainContainer>

      <Header>{translations[language].explore}</Header>

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

    </MainContainer>

  );
};

export default Home;
