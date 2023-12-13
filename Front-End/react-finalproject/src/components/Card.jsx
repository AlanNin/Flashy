import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from 'react-router-dom';
import styled from "styled-components";
import { useDispatch, useSelector } from 'react-redux';
import { useLanguage } from '../utils/LanguageContext';
import moment from "moment";
import "moment/locale/es";

const Container = styled.div`
  width: 360px;
  margin-bottom: 10px;
`;

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 202px;
  border-radius: 15px;
  overflow: hidden;
`;

const Image = styled.img`
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: #999;
  flex: 1;
`;

const ProgressBar = styled.div`
  position: absolute;
  width: 100%;
  height: 6px;
  background-color: rgba(117, 116, 116, 0.8);
  border-radius: 3px;
  bottom: 0px;
`;

const ProgressIndicator = styled.div`
  height: 100%;
  width: ${(props) => `${props.progress}%`};
  background-color: rgba(145, 1, 111);
  border-radius: 3px;
`;

const Details = styled.div`
  display: flex;
  margin-top: ${(props) => props.type !== "sm" && "16px"};
  gap: 12px;
  flex: 1;
`;

const ChannelImage = styled.img`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: #999;
  display: ${(props) => props.type === "sm" && "none"};
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
  display: flex;
  gap: 10px;
`;

const InfoViews = styled.div`
  font-size: 15px;
  color: white;
  background: rgb(196, 90, 172, 0.4);
  font-family: "Roboto Condensed", Helvetica;
  font-weight: 400;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center; 
  padding: 5px 7px;
`;

const InfoTime = styled.div`
  font-size: 14px;
  padding: 5px;
  color: ${({ theme }) => theme.textSoft};
`;

const Card = ({ video }) => {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const [channel, setChannel] = useState({});
  const [progress, setProgress] = useState(0);
  const { language, setLanguage } = useLanguage();

  const translations = {
    en: {
      views: "views",
    },
    es: {
      views: "visitas",
    },
  };

  if (language === "es") {
    moment.locale("es");
  } else {
    moment.locale("en");
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

  useEffect(() => {

    const fetchChannel = async () => {
      const res = await axios.get(`/users/find/${video.userId}`);
      setChannel(res.data);
    };

    const fetchProgress = async () => {
      if (currentUser) {
        const userProgressRes = await axios.get(`/videos/userProgress/${video._id}`);
        setProgress(userProgressRes.data.progress);
      }
    };

    fetchChannel();

    if (currentUser) {
      fetchProgress();
    }

  }, [video.userId, video._id]);

  const handleRedirect = (videoId) => {
    navigate(`/video/${videoId}`);
    // Reiniciar la página después de la redirección
    navigate('/video', { replace: true });
  };

  // GET USER WATCH %

  return (
    <Container>
      <Link to={`/video/${video._id}`} onClick={() => handleRedirect(video._id)} style={{ textDecoration: "none" }}>
        <ImageContainer>
          <Image
            src={video.imgUrl}
          />

          {currentUser && progress > 0 && (
            <ProgressBar>
              <ProgressIndicator progress={progress} />
            </ProgressBar>
          )}

        </ImageContainer>

      </Link>
      <Details>
        <Link to="/channel" style={{ textDecoration: "none" }}>
          <ChannelImage
            src={channel.img}
          />
        </Link>

        <Texts>
          <Link to={`/video/${video._id}`} style={{ textDecoration: "none" }}>
            <Title> {video.title} </Title>
          </Link>
          <Link to="/channel" style={{ textDecoration: "none" }}>
            <ChannelName> {channel.displayname} </ChannelName>
          </Link>
          <InfoWrapper>
            <InfoViews> {formatViews(video.views)} {translations[language].views}</InfoViews>
            <InfoTime>• {timeago(video.createdAt)}</InfoTime>
          </InfoWrapper>
        </Texts>
      </Details>
    </Container >
  );
};

export default Card;
