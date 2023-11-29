import React, { useState, useEffect, useRef, useContext } from "react";
import styled from "styled-components";
import Card from "../components/Card";
import { useLanguage } from '../utils/LanguageContext';
import { useDispatch, useSelector } from 'react-redux';
import axios from "axios";

const MainContainer = styled.div`
  display: relative;
  width: 100%;
  min-height: 100vh;  // Asegura que el contenedor tenga al menos el 100% de la altura de la pantalla
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

const Home = ({ type = "sub" }) => {
  const { language, setLanguage } = useLanguage();
  const { currentUser } = useSelector(state => state.user);



  const translations = {
    en: {
      explore: "Subscriptions",
    },
    es: {
      explore: "Suscripciones",
    },
  };

  const [videos, setVideos] = useState([])
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await axios.get(`/videos/${type}`);
        setVideos(res.data);
      } catch (error) {
        console.error("Error fetching videos:", error);
      }
    };
    if (currentUser) {
      fetchVideos();
    } else {
      // Handle the case where no user is logged in, maybe clear videos state
      setVideos([]);
    }
  }, [type, currentUser]);


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

    </MainContainer>

  );
};

export default Home;
