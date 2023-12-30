import React, { useState, useEffect, useRef, useContext } from "react";
import styled from "styled-components";
import InicioSesionIcono2 from "../assets/InicioSesionIcono2.png";
import { Link, useNavigate } from "react-router-dom";
import Card from "../components/Card";
import NotAuthIcono from "../assets/NotAuthIcono.png";
import NotSubbedIcono from "../assets/NotSubbedIcono.png";
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

const NotAuthWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center; // Alineación del texto
`;
const NotAuth = styled.h1`
  margin-top: 5px;
  font-size: 32px;
  color: white;
  font-weight: bold;
  font-family: "Roboto Condensed", Helvetica;
`;

const NotAuthImg = styled.img`
  height: 96px;
  width: 96px;
  padding: 20 px;
`;

const ItemLogin = styled.div`
  margin-top: 20px;
  display: flex;
  padding: 0px 12px;
  align-items: center;
  gap: 8px;
  width: auto;
  height: 40px;
  transition: background-color 0.5s;
  cursor: pointer;
  border-radius: 12px;
  background-color: ${({ theme }) => theme.loginbg};
  &:hover {
    background-color: ${({ theme }) => theme.softloginbg};
  }
`;

const ImgLogin = styled.img`
  height: 30px;
  width: 30px;
`;

const ButtonLoginText = styled.h3`
  font-family: "Roboto Condensed", Helvetica;
  font-size: 24px;
  font-weight: normal;
  color: ${({ theme }) => theme.text};
  margin-bottom: 3px;
  
  @media only screen and (max-width: 980px),
  only screen and (max-height: 910px) {
  display: none;
  }
`;

const NotSubbedWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center; // Alineación del texto
`;
const NotSubbed1 = styled.h1`
  margin-top: 15px;
  font-size: 32px;
  color: rgba(224, 175, 208, 0.8);
  font-weight: bold;
  font-family: "Roboto Condensed", Helvetica;
`;
const NotSubbed2 = styled.h1`
  margin-top: 15px;
  font-size: 32px;
  color: white;
  font-weight: bold;
  font-family: "Roboto Condensed", Helvetica;
`;

const NotSubbedImg = styled.img`
  height: 96px;
  width: 96px;
  padding: 20 px;
`;


const Home = ({ type = "sub" }) => {
  const { language, setLanguage } = useLanguage();
  const { currentUser } = useSelector(state => state.user);
  const [NoVideosFound, setNoVideosFound] = useState(false);


  const translations = {
    en: {
      explore: "Subscriptions",
      notauth: "Sign in now, don't miss our special Flashy content!",
      signin: "Sign in",
      notsubbed1: "Seems like you are not subbed to any channel",
      notsubbed2: "Sub now to stay updated with your favorites channels!",
      novideo1: "Seems like your subscribed channels haven't upload any video yet",
      novideo2: "Stay tuned and don't missed any flashy content!",
    },
    es: {
      explore: "Suscripciones",
      notauth: "¡Inicia sesión ahora, no te pierdas nuestro contenido Flashy!",
      signin: "Iniciar Sesión",
      notsubbed1: "Parece que no estás suscrito a ningún canal",
      notsubbed2: "¡Suscribete ahora para estar al día con tus canales favoritos!",
      novideo1: "Parece que los canales a los que estás suscrito aún no han subido contenido",
      novideo2: "Mantente al tanto y no te pierdas de un contenido increíble!",
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
    if (currentUser) {
      fetchVideos();
    } else {
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

      {!currentUser &&
        <NotAuthWrapper>
          <NotAuthImg src={NotAuthIcono} />
          <NotAuth>{translations[language].notauth}</NotAuth>
          <Link
            to="../signin"
            style={{
              textDecoration: "none",
              color: "inherit",
            }}
          >
            <ItemLogin>
              <ImgLogin src={InicioSesionIcono2} />
              <ButtonLoginText> {translations[language].signin} </ButtonLoginText>
            </ItemLogin>
          </Link>
        </NotAuthWrapper>
      }

      {(currentUser?.subscribedUsers.length === 0) &&
        <NotSubbedWrapper>
          <NotSubbedImg src={NotSubbedIcono} />
          <NotSubbed1>{translations[language].notsubbed1}</NotSubbed1>
          <NotSubbed2>{translations[language].notsubbed2}</NotSubbed2>
        </NotSubbedWrapper>
      }

      {NoVideosFound && (currentUser?.subscribedUsers.length > 0) &&
        <NotSubbedWrapper>
          <NotSubbedImg src={NotSubbedIcono} />
          <NotSubbed1>{translations[language].novideo1}</NotSubbed1>
          <NotSubbed2>{translations[language].novideo2}</NotSubbed2>
        </NotSubbedWrapper>
      }

    </MainContainer>

  );
};

export default Home;
