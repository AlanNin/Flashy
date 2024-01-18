import React, { useState, useEffect, useRef, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import DuracionIcono from "../assets/DuracionIconoG.png"
import ViewsIcon from '../assets/ViewsIcono2.png';
import axios from "axios";
import { useLanguage } from '../utils/LanguageContext';
import moment from "moment";
import "moment/locale/es";

const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  width: calc(100% - 30px);
  height: max-content;
  cursor: pointer;
  display: flex;
  gap: 10px;
  padding: 15px 15px 15px 15px;
  align-items: center;

  &:hover {
    background: rgba(107, 106, 106, 0.2);
  }
`;

const ImageContainer = styled.div`
  position: relative;
  width: 120px;
  height: 55px;
  border-radius: 8px;
  overflow: hidden;
  margin-right: 30px;
`;

const Image = styled.img`
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: rgba(1, 1, 1, 0.5);
  object-fit: cover;
`;

const Details = styled.div`
  display: flex;
  gap: 15px;
  flex: 1;
  width: max-content;
`;

const TextsHeader = styled.div`
  position: relative;
  display: flex;
`;

const Texts = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: ${({ titleLength }) => (titleLength > 9 ? '0px 0px' : '5px 0px')}; 
`;

const Title = styled.h1`
  font-size: ${({ titleLength }) => (titleLength > 9 ? '15px' : '16px')}; 
  font-family: "Roboto Condensed", Helvetica;
  font-weight: normal;
  color: ${({ theme }) => theme.text};
  width: 234px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  white-space: normal;
  word-wrap: break-word;
  overflow-wrap: break-word;
`;

const UnreadDot = styled.h1`
  font-size: 20px;
  font-family: "Roboto Condensed", Helvetica;
  font-weight: normal;
  color: #FF00C0;
  margin-left: -5px;
  position: absolute;
`;

const TimeAgo = styled.h1`
  font-size: 14px;
  font-family: "Roboto Condensed", Helvetica;
  font-weight: normal;
  color: ${({ theme }) => theme.textSoft};
`;


const ChannelContainer = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  height: max-content;
  width: max-content;
  margin-right: 15px;
  margin-left: 6px;
`;

const ChannelImage = styled.img`
  width: 55px;
  height: 55px;
  border-radius: 50%;
  background-color: rgba(1, 1, 1, 0.5);
  cursor: pointer;
  margin-left: 5px;
`;


const CardNotification = ({ notification, setNotificationsLoaded, handleNotificationCenter }) => {
  const { language, setLanguage } = useLanguage();
  const [video, setVideo] = useState({})
  const [channel, setChannel] = useState({})

  // FETCH DATA
  useEffect(() => {
    const fetchData = async () => {
      try {
        const videoRes = await axios.get(`/videos/find/${notification.videoId}`);
        const channelRes = await axios.get(`/users/find/${videoRes.data.userId}`);

        setVideo(videoRes.data);
        setChannel(channelRes.data);
        setNotificationsLoaded(true);

      } catch (err) {
        console.log(err);
      }
    };

    fetchData();

  }, [notification]);

  // MARK AS READ
  const markNotificationAsRead = async () => {
    try {
      handleNotificationCenter();
      await axios.put(`/users/notifications/${notification._id}/mark-as-read`);
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  // FORMATS
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

  const timeago = timestamp => {
    const relativeTime = moment(timestamp).fromNow();
    return relativeTime.charAt(0).toUpperCase() + relativeTime.slice(1).toLowerCase();
  };

  // TRANSLATIONS
  const translations = {
    en: {
      hasuploaded: "has uploaded:",
    },
    es: {
      hasuploaded: "ha publicado:",
    },
  };

  return (
    <Link to={`/video/${video._id}`} style={{ textDecoration: "none" }} onClick={markNotificationAsRead}>
      <Container>

        {!notification.read && (
          <UnreadDot> • </UnreadDot>
        )}

        <Details>
          <TextsHeader>
            <ChannelContainer>
              <ChannelImage
                src={channel.img}
              />
            </ChannelContainer>

            <Texts titleLength={video?.title?.length}>
              <Title titleLength={video?.title?.length}> {channel.displayname} {translations[language].hasuploaded} {video?.title} </Title>
              <TimeAgo> {timeago(video.createdAt)} </TimeAgo>
            </Texts>

          </TextsHeader>
        </Details>

        <ImageContainer>
          <Image
            src={video?.imgUrl}
          />
        </ImageContainer>

      </Container>
    </Link>
  );
};

export default CardNotification;
