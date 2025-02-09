import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import styled from 'styled-components';
import CanalTendenciaIcono from '../assets/CanalTendenciaIcono.png';
import ViewsIcon from '../assets/ViewsTedenciaIcono.png';
import CircledPlay from '../assets/CircledPlay.png';
import { useDispatch, useSelector } from 'react-redux';

const MoreInfoImg = styled.img`
  width: 35px;
  height: 35px;
  position: absolute;
  top: 7px;
  right: 7px;
  z-index: 3;
  border-radius: 50%;
  background: rgba(22, 21, 24, 0.5);
  overflow: hidden;
  visibility: hidden;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes fadeOut {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  }
`;


const Container = styled.div`
  position: relative;
  display: flex;  
  width: 231px;
  height: 100%;
  margin-left: 2px;
`;

const SlideContainer = styled.div`
  margin-left: 36px;
  width: 195px;
  height: 271px;
  position: relative;
  display: flex;
  cursor: pointer;

  &:hover {
    & ${MoreInfoImg} {
      transition-delay: 0.15s;
      visibility: visible;
      animation: fadeIn 0.15s ease-in-out 0.15s forwards;
    }
  }

  &:not(:hover) {
    & ${MoreInfoImg} {
      transition-delay: 0.2s;
      visibility: hidden;
      opacity: 0;
      animation: fadeOut 0.2s ease-in-out forwards;
      z-index: 1;
    }
  }
`;

const InfoContainer = styled.div`
  position: absolute;
`;

const SlideContainerDif = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background: linear-gradient(195deg, rgba(0, 0, 0, 0.00) 30%, #000 100%);
`;

const RankNumber = styled.h1`
  margin-top: 235px;
  font-size: 28px;
  color: ${({ theme }) => theme.ranknumber};
  font-family: "Roboto Condensed", Helvetica;
`;

const ChannelIcon = styled.img`
  position: absolute;
  bottom: 55px;
  transform: rotate(-90deg);
  height: 24px;
  width: 24px;
  right: 2px;
  cursor: pointer;
  filter: ${({ theme }) => theme.filterimage};
`;

const ChannelName = styled.h1`
  position: absolute;
  bottom: 175px;
  right: 24.5px;
  color: ${({ theme }) => theme.text};
  font-family: "Roboto Condensed", Helvetica;
  font-weight: 400;
  font-size: 18px;
  margin-left: 20px;
  transform: rotate(-90deg);
  cursor: pointer;
  
  white-space: nowrap;
  display: inline-block; 
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
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
  margin-bottom: 5px;
`;

const Title = styled.h1`
  font-size: 15px;
  color: white;
  font-family: "Roboto Condensed", Helvetica;
  font-weight: 700;
  z-index: 2;
  margin-left: 10px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

const ViewContainer = styled.div`
  display: flex;
  align-items: center;
  z-index: 2;
  background-color: rgba(196, 90, 172, 0.2);
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

const ProgressBar = styled.div`
  position: absolute;
  width: 100%;
  height: 6px;
  background-color: rgba(117, 116, 116, 0.8);
  bottom: 0px;
  z-index: 2;
`;

const ProgressIndicator = styled.div`
  height: 100%;
  width: ${(props) => `${props.progress}%`};
  background-color: rgba(145, 1, 111);
  border-radius: 0px;
`;

const CardTrending = ({ type, video, index, setIsMoreInfo, setMoreInfoInputs }) => {
  const [channel, setChannel] = useState({});
  const { currentUser } = useSelector((state) => state.user);
  const [progress, setProgress] = useState(0);

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
        const res = await axios.get(`http://localhost:8800/api/users/find/${video.userId}`);
        setChannel(res.data);
      } catch (error) {
        console.error("Error fetching channel information:", error);
      }
    };

    const fetchProgress = async () => {
      if (currentUser) {
        const userProgressRes = await axios.get(`http://localhost:8800/api/videos/userProgress/${video._id}`, {
          withCredentials: true
        });
        setProgress(userProgressRes?.data?.progress);
      }
    };

    fetchChannel();

    if (currentUser) {
      fetchProgress();
    }
  }, [video.userId, video._id]);

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

      <SlideContainer onClick={SendPopupAndInputs}>
        <Link to={`/video/${video._id}`} style={{ textDecoration: "none" }}>
          <MoreInfoImg src={CircledPlay} />
        </Link>

        <InsideContainer>
          <Title> {video.title} </Title>
          <ViewContainer>
            <ViewIcon src={ViewsIcon} />
            <ViewText> {formatViews(video.views)} </ViewText>
          </ViewContainer>
        </InsideContainer>
        <TrendThumbnail src={video.imgUrlVertical} />
        {currentUser && progress > 0 && (
          <ProgressBar>
            <ProgressIndicator progress={progress} />
          </ProgressBar>
        )}
        <SlideContainerDif />
      </SlideContainer>

    </Container >
  );
};

export default CardTrending;
