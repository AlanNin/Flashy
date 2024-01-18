import React, { useState, useEffect, useRef, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import DuracionIcono from "../assets/DuracionIconoG.png"
import LanguageIcono from '../assets/IdiomaIconoG.png';
import ViewsIcon from '../assets/ViewsIcono2.png';
import axios from "axios";
import { useLanguage } from '../utils/LanguageContext';
import moment from "moment";
import "moment/locale/es";

const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  width: 100%;
  height: max-content;
  cursor: pointer;
  display: flex;
  gap: 10px;
  border-bottom: 1px solid rgba(118, 118, 118, 0.5);
  padding: 35px 0px;
  border-radius: 5px;
`;

const ImageContainer = styled.div`
  position: relative;
  width: 170px;
  height: 100px;
  border-radius: 8px;
  overflow: hidden;
`;

const Image = styled.img`
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: #999;
  object-fit: cover;
`;

const Details = styled.div`
  display: flex;
  margin-top: 0px;
  gap: 15px;
  flex: 1;
  margin-left: 5px;
  width: max-content;
`;

const TextsHeader = styled.div`
  position: relative;
  display: flex;
`;

const Texts = styled.div``;

const Title = styled.h1`
  font-size: 16px;
  font-family: "Roboto Condensed", Helvetica;
  font-weight: normal;
  color: ${({ theme }) => theme.text};
  max-width: 300px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  white-space: normal;
  word-wrap: break-word;
  overflow-wrap: break-word;
`;

const Desc = styled.h2`
  font-size: 14px;
  color: ${({ theme }) => theme.textSoft};
  font-weight: normal;
  margin-top: 10px;
  max-width: 613px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  white-space: normal;
  word-wrap: break-word;
  overflow-wrap: break-word;
`;

const EstiloIconos = styled.img`
  width: 18px;
  height: 18px;
  object-fit: cover;
  margin-left: 25px;
`;

const EstiloTextos = styled.h1`
  color: #c4c4c4;
  font-size: 16px;
  margin-left: 4px;
  font-weight: normal;
  font-family: "Roboto Condensed", Helvetica;
`;

const ChannelContainer = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  height: max-content;
  width: max-content;
  margin-left: 15px;
`;

const ChannelImage = styled.img`
  width: 19px;
  height: 19px;
  border-radius: 50%;
  background-color: #999;
  cursor: pointer;
  margin-left: 5px;
`;

const ChannelName = styled.h2`
  font-size: 16px;
  color: ${({ theme }) => theme.textSoft};
  cursor: pointer;
  font-family: "Roboto Condensed", Helvetica;
  font-weight: bold;
  max-width: 80px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  white-space: normal;
  word-wrap: break-word;
  overflow-wrap: break-word;
`;

const Card4CardPopup = ({ type, video }) => {
  const { language, setLanguage } = useLanguage();
  const navigate = useNavigate();

  if (language === "es") {
    moment.updateLocale("es", {
      relativeTime: {
        s: "Hace unos segundos",
        m: "Hace un minuto",
        mm: "%d minutos",
        h: "una hora",
        hh: "%d horas",
        d: "Hace un día",
        dd: "%d días",
        w: "Hace una semana",
        ww: "%d semanas",
        M: "Hace un mes",
        MM: "%d meses",
        y: "Hace un año",
        yy: "%d años",
      },
    });
  } else {
    moment.updateLocale("en", {
      relativeTime: {
        s: "A few seconds",
        m: "A minute",
        mm: "%d minutes",
        h: "An hour",
        hh: "%d hours",
        d: "A day",
        dd: "%d days",
        w: "A week",
        ww: "%d weeks",
        M: "A month",
        MM: "%d months",
        y: "A year",
        yy: "%d years",
      },
    });
  }

  const formatViews = (views) => {
    if (typeof views !== 'number') {
      return 'N/A'; // or any default value if views is not a number
    }

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

  const [channel, setChannel] = useState({})
  const [noVideosMessage, setNoVideosMessage] = useState('');


  useEffect(() => {
    const fetchChannel = async () => {
      try {
        if (!video || !video.userId) {
          setNoVideosMessage('No hay videos recomendados');
          return;
        }
        const res = await axios.get(`/users/find/${video.userId}`);
        setChannel(res.data);
      } catch (error) {
        console.error("Error fetching videos:", error);
      }
    };
    fetchChannel()
  }, [video.userId]);

  if (noVideosMessage) {
    return <div>{noVideosMessage}</div>;
  }

  const handleGoToChannel = () => {
    navigate(`/channel/@${channel?.name}`);
  };

  const handleGoToVideo = () => {
    navigate(`/video/${video._id}`);
  };


  return (
    <Container>

      <Link to={`/video/${video._id}`} style={{ textDecoration: "none" }}>
        <ImageContainer>
          <Image
            src={video?.imgUrl}
          />
        </ImageContainer>
      </Link >

      <Details>
        <Texts>
          <TextsHeader>
            <Title> {video?.title} </Title>

            <Link to={`/channel/@${channel?.name}`} style={{ textDecoration: "none" }}>
              <ChannelContainer style={{ zIndex: '3' }}>
                <ChannelImage
                  src={channel.img}
                />
                <ChannelName> {channel.displayname} </ChannelName>
              </ChannelContainer>
            </Link >

            <EstiloIconos src={DuracionIcono} />
            <EstiloTextos> {formatDuration(video?.duration)} </EstiloTextos>

            <EstiloIconos src={ViewsIcon} />
            <EstiloTextos> {formatViews(video?.views)} </EstiloTextos>

            <EstiloIconos src={LanguageIcono} />
            <EstiloTextos> {video.language} </EstiloTextos>

          </TextsHeader>

          <Desc> {video?.desc} </Desc>

        </Texts>
      </Details>

    </Container>
  );
};

export default Card4CardPopup;
