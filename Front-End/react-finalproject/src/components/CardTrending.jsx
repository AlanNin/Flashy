import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import styled from 'styled-components';
import CanalTendenciaIcono from '../assets/CanalTendenciaIcono.png';
import ViewsIcon from '../assets/ViewsTedenciaIcono.png';
import MiniaturaLokiS2 from '../assets/MiniaturaLokiS2.jpg';
import moment from "moment";
import "moment/locale/es";

const Container = styled.div`
  position: relative;
  display: flex;  
  width: 210px;
  height: 100%;
  margin-left: 2px;
`;
const SlideContainer = styled.div`
  margin-left: 33px;
  width: 195px;
  height: 271px;
  position: relative;
  display: flex;
  cursor: pointer;
`;

const InfoContainer = styled.div`
  position: absolute;
`;

const SlideContainerDif = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background: linear-gradient(195deg, rgba(0, 0, 0, 0.00) 40%, #000 100%);
`;

const RankNumber = styled.h1`
  margin-top: 235px;
  font-size: 28px;
  color: rgba(224, 175, 208, 0.8);
  font-family: "Roboto Condensed", Helvetica;
`;

const ChannelIcon = styled.img`
  position: absolute;
  bottom: 60px;
  transform: rotate(-90deg);
  height: 24px;
  width: 24px;
  right: 2px;
  cursor: pointer;
`;

const ChannelName = styled.h1`
  position: absolute;
  bottom: 180px;
  right: 25.5px;
  color: white;
  font-family: "Roboto Condensed", Helvetica;
  font-weight: 400;
  font-size: 18px;
  margin-left: 20px;
  transform: rotate(-90deg);
  cursor: pointer;
`;

const StyledLink = styled.a`
  text-decoration: none;
  color: inherit;
  font-size: inherit;
  font-family: inherit;
`;

const LinkToChannel = styled(StyledLink)`
  position: absolute;
  top: 0; /* Ajusta este valor según sea necesario */
  left: -85px; /* Ajusta este valor según sea necesario */
  transform: rotate(0deg); /* Volvemos a la orientación original */
`;
const InsideContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  gap: 10px;
  width: 90%;
`;

const Title = styled.h1`
  font-size: 15px;
  color: white;
  font-family: "Roboto Condensed", Helvetica;
  font-weight: 700;
  z-index: 2;
  margin-left: 10px;
`;

const ViewContainer = styled.div`
  display: flex;
  align-items: center;
  z-index: 2;
  background-color: rgba(196, 90, 172, 0.6);
  padding: 2px 12px;
  border-radius: 20px;
  width: max-content;
  margin-left: 10px;
  margin-bottom: 15px;
`;

const ViewIcon = styled.img`
  height: 15px;
  width: 15px;
  margin-right: 5px;
`;

const ViewText = styled.h1`
  font-size: 14px;
  color: white;
  font-family: "Roboto Condensed", Helvetica;
  font-weight: 400;
`;

const TrendThumbnail = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
`;

const CardTrending = ({ type, video, index }) => {
  const [channel, setChannel] = useState({});

  const formatViews = (views) => {
    if (views >= 1000000000) {
      return `${(views / 1000000000).toFixed(1)}B`;
    } else if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`;
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`;
    } else {
      return views.toString();
    }
  };


  useEffect(() => {
    const fetchChannel = async () => {
      try {
        // Realizar la llamada a la API para obtener la información del canal
        const res = await axios.get(`/users/find/${video.userId}`);
        setChannel(res.data);
      } catch (error) {
        console.error("Error fetching channel information:", error);
      }
    };

    // Llamar a la función para obtener la información del canal
    fetchChannel();
  }, [video.userId]);

  return (

    <Container>
      <InfoContainer>
        <ChannelName>
          <LinkToChannel href="/channel"> {channel.displayname} </LinkToChannel>
        </ChannelName>
        <Link to="/channel" style={{ textDecoration: "none", color: "inherit", fontSize: "inherit", fontFamily: "inherit" }}>
          <ChannelIcon src={CanalTendenciaIcono} />
        </Link>
        <RankNumber>{(index + 1).toString().padStart(2, '0')}</RankNumber>
      </InfoContainer>
      <Link to="/video/test" style={{ textDecoration: "none", color: "inherit", fontSize: "inherit", fontFamily: "inherit" }}>
        <SlideContainer>
          <InsideContainer>
            <Title> {video.title} </Title>
            <ViewContainer>
              <ViewIcon src={ViewsIcon} />
              <ViewText> {formatViews(video.views)} </ViewText>
            </ViewContainer>
          </InsideContainer>
          <TrendThumbnail src={video.imgUrlVertical} />
          <SlideContainerDif />
        </SlideContainer>
      </Link>


    </Container>
  );
};

export default CardTrending;
