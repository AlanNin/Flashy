import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from 'react-router-dom';
import styled from "styled-components";
import CanalIcono from "../assets/CanalIcono.png";
import ViewsIcon from '../assets/ViewsTedenciaIcono.png';
import DuracionIcono from "../assets/DuracionIcono.png";
import { useDispatch, useSelector } from 'react-redux';
import { useLanguage } from '../utils/LanguageContext';
import moment from "moment";
import "moment/locale/es";

const Container = styled.div`
  display: flex;
  margin-bottom: 10px;
`;

const ImageContainer = styled.div`
  position: relative;
  width: 310px;
  height: 180px;
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
  margin-left: 16px;
  gap: 12px;
  flex: 1;
`;

const Texts = styled.div``;

const Title = styled.h1`
  font-size: 20px;
  font-family: "Roboto Condensed", Helvetica;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  white-space: normal;
  word-wrap: break-word;
  overflow-wrap: break-word;
  width: max-content;

`;

const InfoChannel = styled.div`
  width: max-content;
  height: max-content;
  margin: auto 0px;
  display: flex;
  align-items: center;
  justify-content: center; 
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

const ImgViews = styled.img`
  height: 15px;
  width: 15px;
  margin-right: 5px;
`;

const InfoViews = styled.div`
  font-size: 15px;
  width: max-content;
  height: max-content;
  margin: auto 4px;
  color: white;
  background: rgb(196, 90, 172, 0.3);
  font-family: "Roboto Condensed", Helvetica;
  font-weight: 400;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center; 
  padding: 2px 7px;
`;

const VideoDesc = styled.h2`
  max-width: 620px; 
  margin-top: 5px;
  font-size: 14px;
  color: ${({ theme }) => theme.textSoft};
  font-family: "Roboto Condensed", Helvetica;
  font-weight: 400;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 5;
  -webkit-box-orient: vertical;
  white-space: normal;
  word-wrap: break-word;
  overflow-wrap: break-word;
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
  bottom: 5px;
  right: 0px;
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



const CardHistory = ({ video }) => {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const [channel, setChannel] = useState({});
  const [progress, setProgress] = useState(0);
  const { language, setLanguage } = useLanguage();

  const translations = {
    en: {
    },
    es: {
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

  return (
    <Container>

      <Link to={`/video/${video._id}`} onClick={() => handleRedirect(video._id)} style={{ textDecoration: "none" }}>
        <ImageContainer>
          <Image
            src={video.imgUrl}
          />
          <InfoDuration>
            <ImgDuration src={DuracionIcono} />
            <TxtDuration> {formatDuration(video?.duration)} </TxtDuration>
          </InfoDuration>

          {currentUser && progress > 0 && (
            <ProgressBar>
              <ProgressIndicator progress={progress} />
            </ProgressBar>
          )}

        </ImageContainer>

      </Link>
      <Details>

        <Texts>
          <Title>
            <Link to={`/video/${video._id}`} style={{ textDecoration: "none", color: "inherit", fontFamily: "inherit", fontSiz: "inherit" }}>
              {video?.title}
            </Link>
          </Title>

          <InfoWrapper>

            <Link to="/channel" style={{ textDecoration: "none" }}>
              <InfoChannel>
                <ImgViews src={CanalIcono} />
                <ChannelName> {channel?.displayname} </ChannelName>
              </InfoChannel>
            </Link>

            <InfoViews> <ImgViews src={ViewsIcon} /> {formatViews(video?.views)} </InfoViews>
          </InfoWrapper>

          <VideoDesc> {video?.desc} </VideoDesc>
        </Texts>
      </Details>
    </Container >
  );
};

export default CardHistory;
