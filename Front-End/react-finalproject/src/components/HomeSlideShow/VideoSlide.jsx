import React, { useState, useEffect } from "react";
import styled from "styled-components";
import CanalIcono from "../../assets/CanalIcono.png";
import DuracionIcono from "../../assets/DuracionIcono.png";
import FechaIcono from "../../assets/FechaIcono.png";
import VerAhoraIcono from "../../assets/VerAhoraIcono.png";
import InfoSlideShow from "../../assets/InfoSlideShow.png";
import LanguageIcono from '../../assets/IdiomaIcono.png';
import SubtitleIcono from '../../assets/SubtitleIcono.png';
import axios from "axios";
import { Link } from "react-router-dom";

const Contenedor = styled.div`
  position: relative;
  z-index: 2;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const Destacados = styled.h1`
  margin-left: 45px;
  margin-top: 130px;
  margin-bottom: 5px;
  font-size: 20px;
  color: #fff500;
  font-family: 'Montserrat', sans-serif;
  @media (max-width: 768px) {
    font-size: 15px;
    max-width: 380px;
  }
`;

const Titulo = styled.h1`
  font-size: 38px;
  font-family: 'Montserrat', sans-serif;
  color: #FFFFFF;
  position: relative;
  left: 45px;
  top: 10px;
  max-width: 845px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

const ContenedorIconosTextos = styled.div`
  position: relative;
  display: flex;
  background: transparent;
  top: 30px;
  left: 45px;
  @media (max-width: 768px) {
    max-width: 380px;
  }
`;

const EstiloIconos = styled.img`
  width: 24px;
  height: 24px;
  margin-right: 4px;
  object-fit: cover;
  margin-left: 25px;
  @media (max-width: 768px) {
    width: 20px;
    height: 20px;
  }
`;

const ChannelIcon = styled(EstiloIconos)`
margin-left: 0px;
`;

const EstiloTextos = styled.h1`
  color: #FFFFFF;
  font-family: 'Montserrat', sans-serif;
  font-size: 20px;
  margin-left: 5px;
  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

const DescripcionDiv = styled.div`
  position: relative;  
  display: flex;
  flex-direction: row;
  top: 55px;
  left: 45px;
  width: 100%;
  }
`;

const Descripcion = styled.h1`
  position: absolute;
  font-size: 19px;
  font-weight: 400;
  font-family: "Roboto Condensed", Helvetica;
  color: #ccc8c8;
  max-width: 800px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
`;


const ContainerBotones = styled.div`
  position: absolute;
  display: flex;
  bottom: 40px;
  left: 45px;
  gap: 25px;

  @media (max-width: 768px) {
    gap: 20px;
}
`;


const EstiloBotones = styled.div`
  align-items: center;
  display: flex;
  gap: 7px;

  cursor: pointer;
  border-radius: 8px;
  height: 45px;
  padding: 0px 12px;
  `;

const BotonVerAhora = styled(EstiloBotones)`
  background-color: rgba(105, 62, 94, 0.8);
  transition: background-color 0.5s;

  &:hover {
    background-color: rgba(77, 44, 69, 0.6);
  }
`;

const BotonVerDespues = styled(EstiloBotones)`
  background-color: rgba(73, 47, 107, 0.4);
  transition: background-color 0.5s;

  &:hover {
    background-color: rgba(73, 47, 107, 0.2);
  }
`;

const EstiloImagenes = styled.img`
  margin-top: 0px;
  margin-left: 0px;
`;

const ImagenVerAhora = styled(EstiloImagenes)`
width: 28px;
height: 28px
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
  @media (max-width: 768px) {
    display: none;
  }
`;

const BotonVerAhoraTexto = styled(EstiloTextoBotones)`

`;

const BotonVerDespuesTexto = styled(EstiloTextoBotones)`

`;


const VideoSlide = ({ type, video, translations, language, index, setIsMoreInfo, setMoreInfoInputs }) => {

  const formatDuration = (durationInSeconds) => {
    const hours = Math.floor(durationInSeconds / 3600);
    const minutes = Math.floor((durationInSeconds % 3600) / 60);
    const seconds = durationInSeconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    } else {
      return `${seconds}s`;
    }
  };


  const formatDate = (createdAt) => {
    const date = new Date(createdAt);
    const options = { month: 'short', day: '2-digit', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  const [channel, setChannel] = useState({});

  useEffect(() => {
    const fetchChannel = async () => {
      try {
        const res = await axios.get(`/users/find/${video?.userId}`);
        setChannel(res.data);
      } catch (error) {
        console.error("Error fetching channel information:", error);
      }
    };

    fetchChannel();
  }, [video.userId]);

  const SendPopupAndInputs = () => {
    setMoreInfoInputs((prev) => {
      return {
        ...prev,
        imgUrlLandscape: video.imgUrlLandscape,
        title: video.title,
        videoId: video._id,
        userId: video.userId,
        tags: video.tags,
        subtitles: video.subtitles,
        language: video.language,
        likes: video.likes,
        dislikes: video.dislikes,
        desc: video.desc,
        views: video.views,
        videoUrl: video.videoUrl,
        createdAt: video.createdAt,
        duration: video.duration,
      };
    });
    setIsMoreInfo(true);
  };

  return (
    <>
      <Contenedor>
        <Destacados> #{index + 1} {translations[language].spotlight} </Destacados>
        <Titulo> {video.title} </Titulo>
        <ContenedorIconosTextos>
          <ChannelIcon src={CanalIcono} />
          <EstiloTextos> {channel.displayname} </EstiloTextos>
          <EstiloIconos src={DuracionIcono} />
          <EstiloTextos> {formatDuration(video.duration)} </EstiloTextos>
          <EstiloIconos src={FechaIcono} />
          <EstiloTextos> {formatDate(video.createdAt)} </EstiloTextos>
          <EstiloIconos src={LanguageIcono} />
          <EstiloTextos> {video.language} </EstiloTextos>
          <EstiloIconos src={SubtitleIcono} />
          <EstiloTextos>
            {video.subtitles && video.subtitles.length > 0
              ? video.subtitles[0].name + (video.subtitles[1] ? ', ' + video.subtitles[1].name : '') + (video.subtitles[2] ? ', ' + video.subtitles[2].name : '') + (video.subtitles[3] ? ', ' + video.subtitles[3].name : '')
              : translations[language].nosubtitles}

          </EstiloTextos>
        </ContenedorIconosTextos>
        <DescripcionDiv>
          <Descripcion> {video.desc} </Descripcion>
        </DescripcionDiv>
        <ContainerBotones>
          <Link to={`/video/${video._id}`} style={{ textDecoration: "none" }}>
            <BotonVerAhora >
              <ImagenVerAhora src={VerAhoraIcono} />
              <BotonVerAhoraTexto>{translations[language].watchnow}</BotonVerAhoraTexto>
            </BotonVerAhora>
          </Link>
          <BotonVerDespues onClick={SendPopupAndInputs}>
            <ImagenVerDespues src={InfoSlideShow} />
            <BotonVerDespuesTexto>{translations[language].moreinfo}</BotonVerDespuesTexto>
          </BotonVerDespues>
        </ContainerBotones>
      </Contenedor>
    </>
  );
};

export default VideoSlide;
