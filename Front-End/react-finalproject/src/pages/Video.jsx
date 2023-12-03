import React, { useState, useEffect, useRef, useContext } from "react";
import styled from "styled-components";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Comments from "../components/Comments";
import Card from "../components/Card";
import CardRecommendation from "../components/CardRecommendation";
import Recommendation from "../components/Recommendation";
import CardRelatedVideos from "../components/CardRelated";
import VideoLikeIcono from "../assets/VideoLikeIcono.png";
import VideoLikedIcono from "../assets/VideoLikedIcono.png";
import VideoDislikeIcono from "../assets/VideoDislikeIcono.png";
import VideoDislikedIcono from "../assets/VideoDislikedIcono.png";
import VideoShareIcono from "../assets/VideoShareIcono.png";
import VideoSaveIcono from "../assets/VideoSaveIcono.png";
import VideoSavedIcono from "../assets/VideoSavedIcono.png";
import RelatedSlider from "../components/RelatedSlider";
import MiniaturaTheBoys from "../assets/MiniaturaTheBoys.jpg"
import Miniaturahxh1 from "../assets/Miniaturahxh1.jpg"
import CanalIcono from "../assets/CanalIconoG.png"
import DuracionIcono from "../assets/DuracionIconoG.png"
import FechaIcono from "../assets/FechaIconoG.png"
import ViewsIcon from '../assets/ViewsIcono2.png';
import MadHouseLogo from "../assets/MadHouseLogo.jpg"
import { useLanguage } from '../utils/LanguageContext';
import { useDispatch, useSelector } from 'react-redux';
import axios from "axios";
import { dislike, fetchSuccess, like } from "../redux/videoSlice";
import { subscription } from "../redux/userSlice";
import moment from "moment";
import "moment/locale/es";

const Container = styled.div`
  display: flex;
  gap: 24px;
  padding: 101px 273px 0px 273px;
  background-color: rgba(15, 12, 18);
`;

const Content = styled.div`
  flex: 5;
`;
const VideoWrapper = styled.div``;

const Buttons = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  padding: 20px;
  color: ${({ theme }) => theme.text};
`;


const Button = styled.div`
  display: flex;
  font-size: 18px;
  font-family: "Roboto Condensed", Helvetica;
  font-weight: normal;
  align-items: center;
  gap: 3px;
  cursor: pointer;
`;

const ButtonsImg = styled.img`
    width: 25px;
    height: 25px;
`;

const RelatedVideos = styled.div`
  position: relative;
  display: flex;
  height: auto;
  padding: 0px 0px 80px 0px;
`;

const VideoInfo = styled.div`
  position: relative;
  display: flex;
  height: auto;
  width: auto;
  padding: 15px 0px 10px 0px;
`;

const VideoImg = styled.img`
  height: 306px;
  width: 211px;
`;

const VideoOtherInfo = styled.div`
  display: flex;
  flex-direction: column;
  height: auto;
  width: auto;
  margin-left: 22px;
`;

const Title = styled.h1`
  font-size: 20px;
  font-family: "Roboto Condensed", Helvetica;
  font-weight: 400;
  top: 10px;
  color: ${({ theme }) => theme.text};
  padding: 0px 0px 10px 0px;
`;

const ContenedorIconosTextos = styled.div`
  display: flex;
  top: 233px;
  left: 45px;
  padding: 0px 0px 20px 0px;
`;

const EstiloIconos = styled.img`
  width: 18px;
  height: 18px;
  object-fit: cover;
  margin-left: 25px;
`;

const ChannelIcon = styled(EstiloIconos)`
margin-left: 0px;
`;


const EstiloTextos = styled.h1`
  color: #c4c4c4;
  font-size: 16px;
  margin-left: 3px;
  font-weight: normal;
  font-family: "Roboto Condensed", Helvetica;
`;

const Description = styled.p`
  width: 710px;
  color: #c4c4c4;
  font-size: 16px;
  font-family: "Roboto Condensed", Helvetica;
  font-weight: normal;
  padding: 0px 0px 50px 0px;
  max-height: 110px;
`;

const Subscribe = styled.button`
background-color: ${({ isSubscribed }) => (isSubscribed ? 'rgb(196, 90, 148, 0.8)' : 'rgb(196, 90, 172, 0.5)')};
font-weight: 700;
  font-size: 14px;
  font-family: "Roboto", Helvetica;
  color: white;
  border: none;
  border-radius: 3px;
  height: max-content;
  padding: 13px 20px;
  cursor: pointer;
  margin-left: 20px;
  margin-top: 10px;
`;

const ChannelInfo = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  text-align: left;
`;

const ChannelImage = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 50%;
`;

const ChannelInfoTx = styled.div`
  display: flex;
  flex-direction: column;
  height: auto;
  width: auto;
`;

const ChannelName = styled.span`
  font-size: 24px;
  font-family: "Roboto Condensed", Helvetica;
  font-weight: 400;
  color: ${({ theme }) => theme.text};
  margin-left: 10px;
  margin-top: 5px;
`;

const ChannelCounter = styled.span`
  margin-top: 2px;
  margin-left: 10px;
  color: ${({ theme }) => theme.textSoft};
  font-size: 14px;
`;


const TitleHeader = styled.h1`
  font-size: 24px;
  color: #c4c4c4;
  font-weight: bold;
  font-family: "Roboto", Helvetica;
  margin-bottom: 20px;
`;

const VideoFrame = styled.video`
  max-height: 560px;
  width: 1000px;
  object-fit: cover;
`;

const RecommendationContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: auto;
  width: auto;
`;


const Video = () => {

  const { language, setLanguage } = useLanguage();

  const translations = {
    en: {
    },
    es: {
    },
  };

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
    if (durationInSeconds < 60) {
      return `${durationInSeconds}s`;
    } else if (durationInSeconds < 3600) {
      const minutes = Math.floor(durationInSeconds / 60);
      return `${minutes}m`;
    } else {
      const hours = Math.floor(durationInSeconds / 3600);
      return `${hours}h`;
    }
  };

  const formatDate = (createdAt) => {
    const date = new Date(createdAt);
    const options = { month: 'short', day: '2-digit', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { currentUser } = useSelector((state) => state.user);
  const [channel, setChannel] = useState({});
  const { currentVideo } = useSelector((state) => state.video);
  const dispatch = useDispatch();

  const path = useLocation().pathname.split("/")[2];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const videoRes = await axios.get(`/videos/find/${path}`);
        const channelRes = await axios.get(
          `/users/find/${videoRes.data.userId}`
        );
        setChannel(channelRes.data);
        dispatch(fetchSuccess(videoRes.data));
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    fetchData();
  }, [path, dispatch]);

  const handleLike = async () => {
    await axios.put(`/users/like/${currentVideo._id}`);
    dispatch(like(currentUser._id));
  };

  const handleDislike = async () => {
    await axios.put(`/users/dislike/${currentVideo._id}`);
    dispatch(dislike(currentUser._id));
  };

  const handleSub = async () => {
    currentUser.subscribedUsers.includes(channel._id)
      ? await axios.put(`/users/unsub/${channel._id}`)
      : await axios.put(`/users/sub/${channel._id}`);
    dispatch(subscription(channel._id));
  };

  const isCurrentUserUploader = currentUser?._id === channel?._id;

  const [isViewIncreased, setIsViewIncreased] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    const handleTimeUpdate = () => {
      const video = videoRef.current;
      const percentageWatched = (video.currentTime / video.duration) * 100;

      // Check if the user has watched at least 10% and the view count hasn't been increased yet
      if (percentageWatched >= 50 && !isViewIncreased) {
        // Make a request to increase the view count
        axios.put(`/videos/view/${currentVideo._id}`)
          .then(() => {
            setIsViewIncreased(true);
          })
          .catch((error) => {
            console.error("Error updating view count:", error);
          });
      }
    };

    const video = videoRef.current;

    if (video) {
      video.addEventListener("timeupdate", handleTimeUpdate);

      return () => {
        video.removeEventListener("timeupdate", handleTimeUpdate);
      };
    }
  }, [currentVideo._id, isViewIncreased]);

  return (
    <Container>
      <Content>
        <VideoWrapper>
          <VideoFrame ref={videoRef} src={currentVideo?.videoUrl} controls autoPlay />
        </VideoWrapper>


        <Buttons>
          <Button onClick={handleLike}>

            {currentVideo?.likes?.includes(currentUser?._id) ?
              (<ButtonsImg src={VideoLikedIcono} />) :
              (<ButtonsImg src={VideoLikeIcono} />)} {" "}
            {currentVideo?.likes?.length}

          </Button>

          <Button onClick={handleDislike}>

            {currentVideo?.dislikes?.includes(currentUser?._id) ?
              (<ButtonsImg src={VideoDislikedIcono} />) :
              (<ButtonsImg src={VideoDislikeIcono} />)} {" "}
            {currentVideo?.dislikes?.length}

          </Button>
          <Button>
            <ButtonsImg src={VideoSaveIcono} /> Watch Later
          </Button>
          <Button>
            <ButtonsImg src={VideoShareIcono} /> Share
          </Button>
        </Buttons>

        <VideoInfo>

          <VideoImg src={currentVideo?.imgUrlVertical} />

          <VideoOtherInfo>

            <Title> {currentVideo?.title}</Title>

            <ContenedorIconosTextos>

              <ChannelIcon src={CanalIcono} />
              <EstiloTextos> {channel?.displayname} </EstiloTextos>
              <EstiloIconos src={DuracionIcono} />
              <EstiloTextos> {formatDuration(currentVideo?.duration)} </EstiloTextos>
              <EstiloIconos src={FechaIcono} />
              <EstiloTextos> {formatDate(currentVideo?.createdAt)} </EstiloTextos>
              <EstiloIconos src={ViewsIcon} />
              <EstiloTextos> {formatViews(currentVideo?.views)} </EstiloTextos>

            </ContenedorIconosTextos>

            <Description>

              {currentVideo?.desc}

            </Description>

            <ChannelInfo>
              <ChannelImage src={channel?.img} />
              <ChannelInfoTx>
                <ChannelName> {channel?.displayname} </ChannelName>
                <ChannelCounter> {channel?.subscribers} </ChannelCounter>
              </ChannelInfoTx>

              {currentUser && !isCurrentUserUploader && (
                <Subscribe
                  onClick={handleSub}
                  isSubscribed={currentUser?.subscribedUsers?.includes(channel?._id)}
                >
                  {currentUser?.subscribedUsers?.includes(channel?._id) ? "SUBSCRIBED ✔" : "SUBSCRIBE"}
                </Subscribe>
              )}

            </ChannelInfo>

          </VideoOtherInfo>

        </VideoInfo>

        <RelatedVideos>

          <RelatedSlider />

        </RelatedVideos>

        <Comments videoId={currentVideo._id} />

      </Content>
      <RecommendationContainer>
        <TitleHeader> RECOMMENDED </TitleHeader>
        <Recommendation tags={currentVideo?.tags} currentVideoId={currentVideo?._id} />

      </RecommendationContainer>

    </Container>
  );
};

export default Video;
