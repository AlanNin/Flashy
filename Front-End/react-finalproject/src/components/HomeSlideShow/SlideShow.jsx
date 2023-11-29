import React, { useState, useEffect, useRef, useContext } from "react";
import axios from 'axios';
import styled from "styled-components";
import ImageSlider from "./ImageSlider"
import VideoSlide from "./VideoSlide";
import CanalIcono from "../../assets/CanalIcono.png"
import DuracionIcono from "../../assets/DuracionIcono.png"
import FechaIcono from "../../assets/FechaIcono.png"
import VerAhoraIcono from "../../assets/VerAhoraIcono.png"
import VerDespuesIcono from "../../assets/VerDespuesIcono.png"
import { useLanguage } from '../../utils/LanguageContext';

const Contenedor = styled.div`
  position: absolute;
  z-index:2;
  width: 100%;
  height: 100%;
`;

const Destacados = styled.h1`
  position: absolute;
  left: 45px;
  top: 132px;
  font-size: 20px;
  color: #fff500;
  font-family: 'Montserrat', sans-serif;
`;

const Titulo = styled.h1`
  font-size: 40px;
  font-family: 'Montserrat', sans-serif;
  color: #FFFFFF;
  position: absolute;
  left: 45px;
  top: 171px;
`;

const ContenedorIconosTextos = styled.div`
  position: absolute;
  display: flex;
  background: transparent;
  top: 233px;
  left: 45px;
`;

const EstiloIconos = styled.img`
  width: 24px;
  height: 24px;
  object-fit: cover;
  margin-left: 25px;
`;

const ChannelIcon = styled(EstiloIconos)`
margin-left: 0px;
`;

const EstiloTextos = styled.h1`
  color: #FFFFFF;
  font-family: 'Montserrat', sans-serif;
  font-size: 20px;
  margin-left: 5px;
`;

const DescripcionDiv = styled.div`
  position: absolute;  
  flexDirection: 'row';
  top: 283px;
  left: 45px;
  width: 800px;
}
`;

const Descripcion = styled.h1`
  position: absolute;
  border-radius: 30px;
  font-size: 20px;
  font-weight: 400;
  font-family: "Roboto Condensed", Helvetica;
  color: #FFFFFF;
`;

const EstiloBotones = styled.div`
  position: absolute;
  align-items: center;
  display: flex;
  gap: 5.5px;
  top: 450px;
  cursor: pointer;
  border-radius: 30px;
  height: 45px;
  padding: 0px 14px;
  `;

const BotonVerAhora = styled(EstiloBotones)`
  left: 45px;
  background-color: #8a517d;
  transition: background-color 0.5s;

  &:hover {
    background-color: ${({ theme }) => theme.soft};
  }
`;

const BotonVerDespues = styled(EstiloBotones)`
  left: 231px;
  background-color: #5d4182;
  transition: background-color 0.5s;

  &:hover {
    background-color: ${({ theme }) => theme.soft};
  }
`;

const EstiloImagenes = styled.img`
  margin-top: 0px;
  margin-left: 0px;
`;

const ImagenVerAhora = styled(EstiloImagenes)`
width: 30px;
height: 25px
`;

const ImagenVerDespues = styled(EstiloImagenes)`
  width: 30px;
  height: 30px;
`;

const EstiloTextoBotones = styled.h3`
  font-family: "Roboto Condensed", Helvetica;
  font-size: 25px;
  font-weight: 400;
  color: #FFFFFF;
  letter-spacing: 0;
  line-height: normal;
  margin-bottom: 1px;
`;

const BotonVerAhoraTexto = styled(EstiloTextoBotones)`

`;

const BotonVerDespuesTexto = styled(EstiloTextoBotones)`

`;

const SlideShowContainer = styled.div`
  background-size: cover;
  background-position: center center;
  position: flex;
  top: -56px;
  height: 540px;
  width: 100%;
  z-index: 1;
`;

const HomeSlideShow = ({ type = "mostliked" }) => {

  const { language, setLanguage } = useLanguage();

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
    fetchVideos()
  }, [type]);

  const translations = {
    en: {
      spotlight: "Spotlight",
      watchnow: "Watch Now",
      watchlater: "Watch Later",
    },
    es: {
      spotlight: "Destacados",
      watchnow: "Ver Ahora",
      watchlater: "Ver Más Tarde",
    },
  };

  const slides = videos.slice(0, 10).map((video, index) => ({
    url: video.imgUrlLandscape,
    title: video.title,
    content: <VideoSlide video={video} translations={translations} language={language} index={index} />,
  }));


  const [parentWidth, setParentWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setParentWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <SlideShowContainer>
      <ImageSlider slides={slides} parentWidth={parentWidth} />
    </SlideShowContainer>
  );
};

export default HomeSlideShow;
