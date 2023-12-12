import React, { useState, useEffect, useRef, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import ViewsIcon from '../assets/ViewsTedenciaIcono.png';
import axios from "axios";
import { useLanguage } from '../utils/LanguageContext';
import moment from "moment";
import "moment/locale/es";

const Container = styled.div`
  width: 360px;
  margin-bottom: 45px;
  cursor: pointer;
  display: flex;
  gap: 10px;
  margin-bottom: 40px;
`;

const Image = styled.img`
  position: relative;
  width: 215px;
  height: 120px;
  background-color: #999;

`;

const Details = styled.div`
  display: flex;
  margin-top: 0px;
  gap: 12px;
  flex: 1;
`;

const Texts = styled.div``;

const Title = styled.h1`
  font-size: 16px;
  font-family: "Roboto Condensed", Helvetica;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
`;

const ChannelName = styled.h2`
  font-size: 14px;
  color: ${({ theme }) => theme.textSoft};
  margin: 9px 0px;
`;

const InfoWrapper = styled.div`
  align-items: center;
  width: 215px;
  height: 40px;
  position: absolute;
  display: flex;
  gap: 10px;
  margin-top: 85px;
  z-index: 1;
`;

const Background = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background: rgba(92, 91, 91, 0.1);
  backdrop-filter: blur(4px); 
  -webkit-backdrop-filter: blur(7px );
  filter: brightness(0.6); 
`;


const InfoViews = styled.div`
  margin-left: 5px;
  height: 20px;
  background: rgb(196, 90, 172, 0.3);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center; 
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
`;



const InfoTime = styled.div`
  font-family: "Roboto Condensed", Helvetica;
  font-weight: 400;
  font-size: 14px;
  color: #ededed;
  margin-left: auto;
  padding: 0px 10px;
  z-index: 2;
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
        <Image
          src={video.imgUrl}
        />
        <InfoWrapper>
          <Background />
          <InfoViews>
            <ImgViews src={ViewsIcon} />
            <TxtViews> {formatViews(video.views)} </TxtViews>
          </InfoViews>
          <InfoTime>• {timeago(video.createdAt)} </InfoTime>
        </InfoWrapper>
        <Details>
          <Texts>
            <Title> {video.title} </Title>
            <ChannelName> {channel.displayname} </ChannelName>
          </Texts>
        </Details>
      </Container>
    </Link>
  );
};

export default CardRecommendation;
