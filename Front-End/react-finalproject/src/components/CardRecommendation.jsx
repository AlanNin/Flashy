import React, { useState, useEffect, useRef, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import ViewsIcon from '../assets/ViewsIconoFilled.png';
import DuracionIcono from "../assets/DuracionIcono.png";
import FechaIcono from "../assets/FechaIcono.png";
import axios from "axios";
import { useLanguage } from '../utils/LanguageContext';
import moment from "moment";
import "moment/locale/es";

const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 275px;
  margin-bottom: 45px;
  cursor: pointer;
  display: flex;
  gap: 10px;
  margin-bottom: 40px;
`;

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 170px;
  border-radius: 8px;
  overflow: hidden;
`;

const Image = styled.img`
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: #999;

`;


const Details = styled.div`
  display: flex;
  margin-top: 0px;
  gap: 15px;
  flex: 1;
  margin-left: 5px;
`;

const Texts = styled.div``;

const ChannelImage = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #999;
`;

const Title = styled.h1`
  font-size: 16px;
  font-family: "Roboto Condensed", Helvetica;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
  max-width: 210px; /* Puedes ajustar el valor según tu preferencia */
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2; /* Establece el número máximo de líneas */
  -webkit-box-orient: vertical;
  white-space: normal;
  word-wrap: break-word;
  overflow-wrap: break-word;
`;


const ChannelName = styled.h2`
  font-size: 14px;
  color: ${({ theme }) => theme.textSoft};
  margin-top: 7px;
`;

const InfoViews = styled.div`
  position: absolute;
  margin: 10px;
  height: 20px;
  width: max-content;
  background: rgb(36, 22, 33, 0.9);
  border-radius: 10px;
  display: flex;
  align-items: center;
  padding: 3px 10px;
  z-index: 2;
`;

const ImgViews = styled.img`
  height: 15px;
  width: 15px;
  margin-right: 5px;
`;


const TxtViews = styled.h1`
  font-size: 15px;
  color: white;
  font-family: "Roboto Condensed", Helvetica;
  font-weight: 400;
  text-align: center;
  margin-top: 1px;  
`;


const InfoDuration = styled.div`
  position: absolute;
  margin: 10px;
  height: 20px;
  width: max-content;
  background: rgb(36, 22, 33, 0.9);
  border-radius: 10px;
  display: flex;
  align-items: center;
  padding: 3px 10px;
  bottom: 0px;
`;

const ImgDuration = styled.img`
  height: 15px;
  width: 15px;
  margin-right: 5px;
`;


const TxtDuration = styled.h1`
  font-size: 15px;
  color: white;
  font-family: "Roboto Condensed", Helvetica;
  font-weight: 400;
  margin-top: 1px;  
`;

const InfoTime = styled.div`
  position: absolute;
  margin: 10px;
  height: 20px;
  width: max-content;
  background: rgb(36, 22, 33, 0.9);
  border-radius: 10px;
  display: flex;
  align-items: center;
  padding: 3px 10px;
  bottom: 0px;
  right: 0px;
`;

const ImgTime = styled.img`
  height: 15px;
  width: 15px;
  margin-right: 5px;
`;


const TxtTime = styled.h1`
  font-size: 15px;
  color: white;
  font-family: "Roboto Condensed", Helvetica;
  font-weight: 400;
  margin-top: 1px;  
`;


const CardRecommendation = ({ type, video }) => {
  const navigate = useNavigate();
  const { language, setLanguage } = useLanguage();

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


  const timeago = timestamp => {
    const relativeTime = moment(timestamp).fromNow();
    return relativeTime.charAt(0).toUpperCase() + relativeTime.slice(1).toLowerCase();
  };


  const [channel, setChannel] = useState({})
  useEffect(() => {
    const fetchChannel = async () => {
      try {
        const res = await axios.get(`/users/find/${video.userId}`);
        setChannel(res.data);
      } catch (error) {
        console.error("Error fetching videos:", error);
      }
    };
    fetchChannel()
  }, [video.userId]);

  return (
    <Link to={`/video/${video._id}`} style={{ textDecoration: "none" }}>
      <Container>
        <ImageContainer>
          <Image
            src={video?.imgUrl}
          />
          <InfoViews>
            <ImgViews src={ViewsIcon} />
            <TxtViews> {formatViews(video?.views)} </TxtViews>
          </InfoViews>
          <InfoDuration>
            <ImgDuration src={DuracionIcono} />
            <TxtDuration> {formatDuration(video?.duration)} </TxtDuration>
          </InfoDuration>
          <InfoTime>
            <ImgTime src={FechaIcono} />
            <TxtTime> {timeago(video?.createdAt)} </TxtTime>
          </InfoTime>
        </ImageContainer>
        <Details>
          <ChannelImage src={channel?.img} />
          <Texts>
            <Title> {video?.title} </Title>
            <ChannelName> {channel?.displayname} </ChannelName>
          </Texts>
        </Details>
      </Container>
    </Link>
  );
};

export default CardRecommendation;
