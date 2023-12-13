import React, { useState, useEffect } from "react";
import styled from "styled-components";
import CanalIcono from "../../assets/CanalIcono.png";
import DuracionIcono from "../../assets/DuracionIcono.png";
import FechaIcono from "../../assets/FechaIcono.png";
import VerAhoraIcono from "../../assets/VerAhoraIcono.png";
import VerDespuesIcono from "../../assets/VerDespuesIcono.png";
import axios from "axios";
import { Link } from "react-router-dom";

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


const VideoSlide = ({ type, video, translations, language, index }) => {

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
        const res = await axios.get(`/users/find/${video.userId}`);
        setChannel(res.data);
      } catch (error) {
        console.error("Error fetching channel information:", error);
      }
    };

    fetchChannel();
  }, [video.userId]);

  return (
    <>
      <Contenedor>
        <Destacados> #{index + 1} {translations[language].spotlight} </Destacados>
        <Titulo> {video.title}</Titulo>
        <ContenedorIconosTextos>
          <ChannelIcon src={CanalIcono} />
          <EstiloTextos> {channel.displayname} </EstiloTextos>
          <EstiloIconos src={DuracionIcono} />
          <EstiloTextos> {formatDuration(video.duration)} </EstiloTextos>
          <EstiloIconos src={FechaIcono} />
          <EstiloTextos> {formatDate(video.createdAt)} </EstiloTextos>
        </ContenedorIconosTextos>
        <DescripcionDiv>
          <Descripcion> {video.desc} </Descripcion>
        </DescripcionDiv>
        <Link to={`/video/${video._id}`} style={{ textDecoration: "none" }}>
          <BotonVerAhora >
            <ImagenVerAhora src={VerAhoraIcono} />
            <BotonVerAhoraTexto>{translations[language].watchnow}</BotonVerAhoraTexto>
          </BotonVerAhora>
        </Link>
        <BotonVerDespues>
          <ImagenVerDespues src={VerDespuesIcono} />
          <BotonVerDespuesTexto>{translations[language].watchlater}</BotonVerDespuesTexto>
        </BotonVerDespues>
      </Contenedor>
    </>
  );
};

export default VideoSlide;
