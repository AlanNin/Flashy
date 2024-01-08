import React, { useState, useEffect, useRef, useMemo, useContext } from "react";
import styled, { keyframes } from "styled-components";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Comments from "../components/Comments";
import Recommendation from "../components/Recommendation";
import InicioSesionIcono2 from "../assets/InicioSesionIcono2.png";
import VideoLikeIcono from "../assets/VideoLikeIcono.png";
import VideoLikedIcono from "../assets/VideoLikedIcono.png";
import VideoDislikeIcono from "../assets/VideoDislikeIcono.png";
import VideoDislikedIcono from "../assets/VideoDislikedIcono.png";
import VideoPlaylistIcono from "../assets/VideoPlaylistIcono.png";
import VideoShareIcono from "../assets/VideoShareIcono.png";
import RelatedSlider from "../components/RelatedSlider";
import CanalIcono from "../assets/CanalIconoG.png"
import DuracionIcono from "../assets/DuracionIconoG.png"
import FechaIcono from "../assets/FechaIconoG.png"
import ViewsIcon from '../assets/ViewsIcono2.png';
import LanguageIcono from '../assets/IdiomaIcono.png';
import CopyIcono from "../assets/CopyIcono.png";
import WhatsappIcon from "../assets/WhatsappIcon.png";
import CloseXGr from "../assets/CloseXGr.png"
import VerticalLineIcono from "../assets/VerticalLineIcono.png"
import { useLanguage } from '../utils/LanguageContext';
import { useDispatch, useSelector } from 'react-redux';
import axios from "axios";
import { dislike, fetchSuccess, like } from "../redux/videoSlice";
import { subscription } from "../redux/userSlice";
import PlaylistSelectBoxVideo from "../components/PlaylistSelectBoxVideo";

import {
  EmailShareButton,
  FacebookShareButton,
  RedditShareButton,
  TelegramShareButton,
  TwitterShareButton,
  WhatsappShareButton,
} from "react-share";
import {
  EmailIcon,
  FacebookIcon,
  RedditIcon,
  TelegramIcon,
  XIcon,
} from "react-share";

// VIDSTACK DEPENDENCIES
import '@vidstack/react/player/styles/default/theme.css';
import '@vidstack/react/player/styles/default/layouts/video.css';
import {
  MediaPlayer,
  MediaProvider,
  Track,
  Captions,
  Poster,
  MediaPlayerInstance,
  useStore,
} from '@vidstack/react';
import {
  defaultLayoutIcons,
  DefaultVideoLayout,
} from '@vidstack/react/player/layouts/default';

const Container = styled.div`
  background-color: rgba(15, 12, 18);
  position: relative;
  width: 100%;
  max-width: 1200px;
  min-height: 100vh;
  margin: auto;
`;

const Wrapper = styled.div`
  margin-top: 95px;
  margin-left: ${({ anyPopup }) => (anyPopup ? '-257px' : '-253px')};
  gap: 24px;
  background-color: rgba(15, 12, 18);
  display: ${({ videoLoaded }) => (videoLoaded ? 'flex' : 'none')};
`;

const Content = styled.div`
  flex: 5;
`;

const VideoWrapper = styled.div`
  height: 720px;
  width: 1280px;
  overflow: hidden;
  z-index: 1;
`;

const Buttons = styled.div`
  justify-content: center;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 15px;
  padding: 0px 0px;
  color: ${({ theme }) => theme.text};
  margin-left: auto;
  margin-top: 0px;
  margin-right: 5px;
  overflow: hidden;
  height: max-content;
  width: max-content;
`;


const Button = styled.div`
  display: flex;
  font-size: 18px;
  font-family: "Roboto Condensed", Helvetica;
  font-weight: normal;
  align-items: center;
  gap: 5px;
  cursor: pointer;
  user-select: none; 
  background: rgba(30, 27, 33);
  padding: 8px 12px;
  border-radius: 15px;
  &:hover {
    background: rgba(36, 34, 38);
  }
`;

const LikeButton = styled(Button)`
  border-radius: 15px 0px 0px 15px;
  padding: 8px 12px 8px 12px;
  margin-right: -7px;
  gap: 5px;
`;

const DislikeButton = styled(Button)`
  border-radius: 0px 15px 15px 0px;
  padding: 8px 12px 8px 12px;
  margin-left: -7px;
  gap: 5px;
`;

const LikeAndDislikeButtons = styled.div`
  display: flex;
  gap: 0px;
  border-radius: 15px;
  align-items: center;
  background: rgba(30, 27, 33);
`;

const DislikeLikeSeparator = styled.img`
    width: 13px;
    height: 30px;
    z-index: 2;
`;

const ButtonsImg = styled.img`
    width: 25px;
    height: 25px;
    margin-right: 3px;
`;

const RelatedVideos = styled.div`
  position: relative;
  display: flex;
  height: auto;
  padding: 0px 0px 40px 0px;
  width: 100%;
`;

const VideoInfo = styled.div`
  position: relative;
  display: flex;
  height: auto;
  width: auto;
  padding: 30px 0px 10px 0px;
`;

const VideoImg = styled.img`
  height: 306px;
  width: 211px;
  border-radius: 10px;
  object-fit: cover; 
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
  padding-bottom: 15px;
  margin-bottom: 10px;
  max-width: 523px;
  word-wrap: break-word;
  overflow-wrap: break-word;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  white-space: normal;
  overflow: hidden;
`;

const ContenedorIconosTextos = styled.div`
  display: flex;
  top: 230px;
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
  margin-left: 5px;
  font-weight: normal;
  font-family: "Roboto Condensed", Helvetica;
`;

const Description = styled.p`
  width: 800px;
  color: #c4c4c4;
  font-size: 16px;
  font-family: "Roboto Condensed", Helvetica;
  font-weight: normal;
  padding: 0px 0px 70px 0px;
  height: max-content;
  max-height: 110px;
  word-wrap: break-word;
  overflow-wrap: break-word;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 6;
  -webkit-box-orient: vertical;
  white-space: normal;
  overflow: hidden;
`;

const Subscribe = styled.button`
  background-color: ${({ isSubscribed }) => (isSubscribed ? 'rgb(196, 90, 148, 0.8)' : 'rgb(196, 90, 172, 0.5)')};
  font-weight: 700;
  font-size: 14px;
  font-family: "Roboto", Helvetica;
  color: white;
  border: none;
  border-radius: 5px;
  height: max-content;
  padding: ${({ isSubscribed }) => (isSubscribed ? '8px 18px 10px 20px' : '10px 20px')};
  cursor: pointer;
  margin-left: 20px;
  margin-top: 5px;
`;

const ChannelInfo = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  text-align: left;
  margin-top: 20px;
  margin-bottom: -20px;
`;

const ChannelImage = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 50%;
`;

const ChannelInfoTx = styled.div`
  display: flex;
  margin-left: 2px;
  flex-direction: column;
  height: auto;
  width: auto;
`;

const ChannelName = styled.span`
  font-size: 20px;
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

const RecommendationContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: auto;
  width: auto;
`;

const SuscbribeContainer = styled.div`
  align-items: center;
  height: max-content;
  width: max-content;
`;

const SuscbribeNotLogged = styled.div`
  display: flex;
  position: absolute;
  color: white;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  height: max-content;
  background-color: rgba(89, 86, 92, 0.5);
  width: auto;
  border-radius: 0px 10px 10px 10px;
  padding: 10px;
  margin-left: 20px;
`;

const SuscbribeNotLoggedTxt = styled.h1`
  color: white;
  padding: 10px 5px;
  font-family: "Roboto Condensed", Helvetica;
  font-size: 18px;
  font-weight: normal;
`;

const LikeNotLogged = styled.div`
  display: flex;
  position: absolute;
  color: white;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  height: max-content;
  background-color: rgba(89, 86, 92, 0.9);
  width: auto;
  border-radius: 0px 10px 10px 10px;
  padding: 10px;
  margin-top: 125px;
  z-index: 2;
`;

const LikeNotLoggedTxt = styled.h1`
  color: white;
  padding: 10px 5px;
  font-family: "Roboto Condensed", Helvetica;
  font-size: 18px;
  font-weight: normal;
`;

const DislikeNotLogged = styled.div`
  display: flex;
  position: absolute;
  color: white;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  height: max-content;
  background-color: rgba(89, 86, 92, 0.9);
  width: auto;
  border-radius: 0px 10px 10px 10px;
  padding: 10px;
  margin-top: 125px;
  z-index: 2;
`;

const DislikeLoggedTxt = styled.h1`
  color: white;
  padding: 10px 5px;
  font-family: "Roboto Condensed", Helvetica;
  font-size: 18px;
  font-weight: normal;
`;


const ItemLogin = styled.div`
  display: flex;
  width: max-content;
  padding: 5px 12px;
  align-items: center;
  gap: 8px;
  height: max-content;
  transition: background-color 0.5s;
  border-radius: 10px;
  background-color: ${({ theme }) => theme.loginbg};
  &:hover {
    background-color: ${({ theme }) => theme.softloginbg};
  }
`;

const ImgLogin = styled.img`
  height: 20px;
  width: 20px;
`;

const ButtonLoginText = styled.h3`
  font-family: "Roboto Condensed", Helvetica;
  font-size: 18px;
  margin-right: 2px;
  font-weight: normal;
  margin-bottom: 3px;
  color: ${({ theme }) => theme.text};

`;

const ShareContainer = styled.div`
  display: flex;
  position: absolute;
  color: white;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  height: max-content;
  background-color: rgba(20, 13, 20);
  width: auto;
  border-radius: 10px;
  padding: 20px 20px 30px 20px;
  z-index: 2;
  cursor: normal;
`;

const CloseShare = styled.img`
  position: absolute;
  top: 20px;
  right: 25px;
  cursor: pointer;
  width: 20px;
  height: 20px;
`;

const ShareLabel = styled.label`
    font-size: 24px;
    font-weight: bold;
    font-family: "Roboto Condensed", Helvetica;
    margin-right: auto;
    margin-left: 5px;
    margin-bottom: 15px;
`;

const ShareLinkCopyDiv = styled.div`
  postition: relative;
  display: flex;
  flex-direction: row;
  align-items: center; 
`;

const ShareExternalButtons = styled.div`
  display: flex;
  gap: 28px;
  margin-right: auto;
  padding-top: 10px;
`;

const ShareExternalButtonsTxt = styled.h1`
  color: white;
  padding: 8px 5px 0px 5px;
  font-family: "Roboto Condensed", Helvetica;
  font-size: 14px;
  font-weight: normal;
  margin-bottom: 30px;
`;


const ShareLink = styled.h1`
  background: rgba(36, 35, 35, 0.8);
  border-radius: 8px;
  color: white;
  padding: 10px 15px;
  font-family: "Roboto Condensed", Helvetica;
  font-size: 16px;
  font-weight: normal;
`;

const ShareCopyLink = styled.img`
  height: 35px;
  width: 35px;
  cursor: pointer;
  margin-left 8px;
`;

const fadeOut = keyframes`
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
`;

const SharePopupContainerBg = styled.div`
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background-color: #000000b9;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 3;
`;

const SharePopupContainer = styled.div`
  position: fixed;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(86, 48, 120);
  color: white;
  text-align: center;
  padding: 16px;
  border-radius: 8px;
  opacity: ${({ isPopUpShareVisible }) => (isPopUpShareVisible ? 1 : 0)};
  animation: ${fadeOut} 4s ease-in-out;
  z-index: 9;
`;

const SharePopupContent = styled.p`
  margin: 0;
`;


const ResumePopupContainer = styled.div`
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background-color: #000000b9;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3;
`;

const ResumePopupWrapper = styled.div`
  width: max-content;
  height: max-content;
  background: #1D1D1D;
  color: ${({ theme }) => theme.text};
  padding: 30px 30px 20px 30px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  position: relative;
  border-radius: 12px;
`;

const ResumePopupText = styled.h1`
  font-weight: bold;
  font-size: 24px;
  font-family: "Roboto Condensed", Helvetica;
`;

const ResumePopupSubText = styled.h1`
  font-family: "Roboto Condensed", Helvetica;
  font-weight: normal;
  color: ${({ theme }) => theme.textSoft};
  font-size: 18px;
`;

const ResumePopupButtons = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  width: 100%;
  margin-top: 10px;
`;

const ResumePopupButton = styled.div`
  cursor: pointer;
  &:hover {
    background: rgba(45, 45, 45);
  }
  padding: 8px 10px;
  border-radius: 12px;
  margin-left: 5px;
`;

const rotate = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100%;
`;

const LoadingCircle = styled.div`
  border: 4px solid #f3f3f3;
  border-top: 4px solid #7932a8;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: ${rotate} 1s linear infinite;
`;


const NotAllowedContainerBg = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background-color: #000000b9;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 4;
`;

const NotAllowedContainer = styled.div`
    position: relative;
    width: 35%;
    height: max-content;
    background: #1D1D1D;
    color: ${({ theme }) => theme.text};
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    padding: 25px 0px;
`;

const WrapperNotAllowed = styled.div`
    display: flex;
    flex-direction: column;
    width: calc(100% - 60px);
    height: 100%;
    gap: 30px;
    padding: 0px 30px 5px 30px;
  `;

const TitleNotAllowed = styled.h1`
  text-align: center;
  font-size: 28px;
  font-family: "Roboto Condensed", Helvetica;
  padding-bottom: 15px;
  padding-top: 10px;
`;

const SubLabelNotAllowed = styled.label`
    margin-top: -20px;
    font-size: 16px;
    padding: 0px 10px;
    color: ${({ theme }) => theme.textSoft};
    font-weight: normal;
    font-family: "Roboto Condensed", Helvetica;
`;

const GoHomeNotAllowed = styled.button`
  border: none;
  width: max-content;;
  height: max-content;
  padding: 8px 18px;
  border-radius: 3px;
  position: relative;
  font-size: 16px;
  font-weight: bold;
  font-family: "Roboto Condensed", Helvetica;
  cursor: pointer;
  background: rgba(82, 41, 73, 0.7);
  color: ${({ theme }) => theme.text};
  margin-left: auto;
  margin-right: 40px;
  margin-top: 15px;
`;

const VideoPage = () => {
  const { language, setLanguage } = useLanguage();
  const [NoRecommendations, setNoRecommendations] = useState(false);
  const [anyPopup, setAnyPopup] = useState(false);
  const [showResumePopup, setShowResumePopup] = useState(false);

  const translations = {
    en: {
      signin: "Sign in",
    },
    es: {
      signin: "Iniciar Sesión",
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


  // Reset Scroll
  const scrollToTop = () => {

    window.scrollTo(0, 0);
  };

  const { currentUser } = useSelector((state) => state.user);
  const [channel, setChannel] = useState({});
  const { currentVideo } = useSelector((state) => state.video);
  const dispatch = useDispatch();
  const path = useLocation().pathname.split("/")[2];
  const [videoLoaded, setVideoLoaded] = useState(false);

  // ADD TO HISTORY
  const UpdateHistory = async () => {
    if (currentUser) {
      await axios.put(`/users/${currentUser?._id}/videos/${currentVideo?._id}/history`);
    }
  };

  // FETCH VIDEO AND CHANNEL DATA + RESUME VIDEO
  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const videoRes = await axios.get(`/videos/find/${path}`);
        const channelRes = await axios.get(`/users/find/${videoRes.data.userId}`);
        if (!isMounted) {
          return; // Abort the operation if the component is unmounted
        }
        setChannel(channelRes.data);
        dispatch(fetchSuccess(videoRes.data));

        if (currentUser) {

          const userProgressRes = await axios.get(`/videos/userProgress/${videoRes.data?._id}`);
          const userProgress = userProgressRes.data.progress || 0;

          if (userProgress > 3) {
            setShowResumePopup(true);
          }

          setResumeProgress(userProgress);

        }

        scrollToTop();
        setVideoLoaded(true);


      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };

  }, [path, dispatch]);

  useEffect(() => {
    if (showResumePopup) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [showResumePopup]);

  // VALIDATE PRIVACY PRIVATE
  const isVideoPrivate = currentVideo?.privacy === "private" || false;
  const [allowedUsers, setAllowedUsers] = useState([]);
  const [UserAllowed, setUserAllowed] = useState(true);

  useEffect(() => {
    if (videoLoaded) {

      axios.get(`/videos/${currentVideo?._id}/allowedUsers`)
        .then(response => {
          const allowedUsersData = response.data.allowedUsers;

          if (Array.isArray(allowedUsersData)) {
            setAllowedUsers(allowedUsersData);

            const isUserAllowed = allowedUsers.includes(currentUser?.email);

            if (isVideoPrivate) {
              if (currentUser) {
                if (isUserAllowed) {
                  setUserAllowed(true);
                }
                else {
                  setUserAllowed(false);
                }
              } else {
                setUserAllowed(false);
              }
            } else {
              setUserAllowed(true);
            }
          } else {
          }
        })
        .catch(error => {
        });

    }

  }, [UserAllowed, currentVideo?._id, videoLoaded]);

  // LIKE VIDEO
  const handleLike = async () => {

    if (!currentUser) {
      setLikePopupVisible(true);
      return;
    }

    await axios.put(`/users/like/${currentVideo?._id}`);
    dispatch(like(currentUser?._id));
  };

  // DISLIKE VIDEO
  const handleDislike = async () => {

    if (!currentUser) {
      setDislikePopupVisible(true);
      return;
    }

    await axios.put(`/users/dislike/${currentVideo?._id}`);
    dispatch(dislike(currentUser?._id));
  };

  // SUBSCRIBE CHANNEL
  const handleSub = async () => {
    if (!currentUser) {
      setSubscribePopupVisible(true);
      return;
    }

    currentUser.subscribedUsers.includes(channel?._id)
      ? await axios.put(`/users/unsub/${channel?._id}`)
      : await axios.put(`/users/sub/${channel?._id}`);
    dispatch(subscription(channel?._id));
  };

  const isCurrentUserUploader = currentUser?._id === channel?._id;

  // CONST DECLARATIONS

  const player = useRef(null);

  const [resumeProgress, setResumeProgress] = useState(0);

  const [isViewIncreased, setIsViewIncreased] = useState(false);

  // GET VIDEO CURRENT TIME
  const [currentTime, setCurrentTime] = useState(0);
  const handleCurrentTimeUpdate = () => {
    setCurrentTime(player.current.currentTime);
  };

  // DELAY CURRENT TIME TO AVOID CRASH REQUEST
  const [delayedCurrentTime, setDelayedCurrentTime] = useState(0);
  const currentTimeRef = useRef(0);

  // GET VIDEO DURATION
  const videoDuration = currentVideo?.duration;

  // VIDEO PROGRESS TO SAVE
  const [videoProgress, setVideoProgress] = useState(0);

  const saveVideoProgress = async () => {
    try {
      await axios.post(`/videos/saveUserProgress/${currentVideo?._id}`, {
        progress: videoProgress,
      });
    } catch (error) {
      console.error("Error al guardar el progreso del video:", error);
    }
  };

  // SLOW TIME FOR REQUEST
  useEffect(() => {
    if (videoLoaded) {
      currentTimeRef.current = currentTime;
    }
  }, [currentTime]);

  useEffect(() => {
    let intervalId;
    const updateDelayedCurrentTime = () => {
      setDelayedCurrentTime(currentTimeRef.current);
    };
    if (videoLoaded) {
      intervalId = setInterval(updateDelayedCurrentTime, 500);
    }
    return () => clearInterval(intervalId);
  }, [videoLoaded]);

  // SET AND SAVE VIDEO PROGRESS PER SECOND
  useEffect(() => {

    if (videoLoaded) {

      // GET VIDEO CURRENT PROGRESS
      const newProgress = (currentTime / videoDuration) * 100;

      if (newProgress >= 3 && newProgress < 95) {
        setVideoProgress(newProgress);
        saveVideoProgress();
      }
      if (newProgress >= 95) {
        setVideoProgress(0);
        saveVideoProgress();
      }

      if (newProgress >= 55 && !isViewIncreased) {
        setIsViewIncreased(true);
        axios.put(`/videos/view/${currentVideo?._id}`)
          .then(() => {
            // ...
          })
          .catch((error) => {
            console.error("Error updating view count:", error);
          });
      }
      UpdateHistory();
    }
  }, [delayedCurrentTime]);

  // RESUME VIDEO FROM PROGRESS  
  const handleResumeClick = () => {
    setShowResumePopup(false);
    const videoPlayer = player.current;
    if (videoLoaded) {
      if (currentUser && resumeProgress > 0) {
        if (!isNaN(resumeProgress) && !isNaN(videoDuration)) {
          videoPlayer.currentTime = (resumeProgress / 100) * videoDuration;
          videoPlayer.play();
        }
      }
    }
  };

  // START OVER AND RESTART PROGRESS  
  const handleStartOverClick = () => {
    setShowResumePopup(false);
    setVideoProgress(0);
    saveVideoProgress();

    const videoPlayer = player.current;
    videoPlayer.currentTime = 0;
    if (currentUser && resumeProgress > 0) {
      videoPlayer.play();
    }
  };

  // POP UP SUSCRIBE NOT LOGGED
  const [isSubscribePopupVisible, setSubscribePopupVisible] = useState(false);
  const subscribeRef = useRef(null);

  useEffect(() => {
    const handleClickOutsideSuscribeNotLogged = (event) => {
      if (subscribeRef.current && !subscribeRef.current.contains(event.target)) {
        setSubscribePopupVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutsideSuscribeNotLogged);

    return () => {
      document.removeEventListener("mousedown", handleClickOutsideSuscribeNotLogged);
    };
  }, []);

  // POP UP LIKE NOT LOGGED
  const [isLikePopupVisible, setLikePopupVisible] = useState(false);
  const likeRef = useRef(null);

  useEffect(() => {
    const handleClickOutsideLikeNotLogged = (event) => {
      if (likeRef.current && !likeRef.current.contains(event.target)) {
        setLikePopupVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutsideLikeNotLogged);

    return () => {
      document.removeEventListener("mousedown", handleClickOutsideLikeNotLogged);
    };
  }, []);

  // POP UP DISLIKE NOT LOGGED
  const [isDislikePopupVisible, setDislikePopupVisible] = useState(false);
  const dislikeRef = useRef(null);

  useEffect(() => {
    const handleClickOutsideDislikeNotLogged = (event) => {
      if (dislikeRef.current && !dislikeRef.current.contains(event.target)) {
        // Clic fuera del componente, ocultar el popup
        setDislikePopupVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutsideDislikeNotLogged);

    return () => {
      document.removeEventListener("mousedown", handleClickOutsideDislikeNotLogged);
    };
  }, []);


  // SHARE
  const [shareLink, setShareLink] = useState('');
  const [isSharePopupVisible, setSharePopupVisible] = useState(false);
  const shareRef = useRef(null);
  const buttonShareRef = useRef(null);
  const currentURL = window.location.href;
  const [isPopUpShareVisible, setIsPopUpShareVisible] = useState(false);

  const handleShare = () => {
    setShareLink(currentURL);
    setSharePopupVisible(!isSharePopupVisible);
    setAnyPopup(!anyPopup);
  };

  const handleCopyClick = () => {
    navigator.clipboard.writeText(shareLink)
      .then(() => {
        setIsPopUpShareVisible(true);

        const timeout = setTimeout(() => {
          setIsPopUpShareVisible(false);
        }, 4000);

        return () => clearTimeout(timeout);
      })
      .catch((err) => {
        console.error('Error al copiar el URL', err);
      });
  };

  useEffect(() => {
    const handleClickOutsideShare = (event) => {
      // Verificar si el clic ocurrió dentro del botón
      const isClickInsideButton = buttonShareRef.current && buttonShareRef.current.contains(event.target);

      // Si el clic fue fuera del componente pero dentro del botón, no ocultar el popup
      if (shareRef.current && !shareRef.current.contains(event.target) && !isClickInsideButton) {
        setSharePopupVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutsideShare);

    return () => {
      document.removeEventListener("mousedown", handleClickOutsideShare);
    };
  }, []);

  useEffect(() => {
    // Cuando el popup se abre, deshabilitar el scroll
    if (isSharePopupVisible) {
      document.body.style.overflow = 'hidden';
    } else {
      // Cuando el popup se cierra, habilitar el scroll
      document.body.style.overflow = 'auto';
    }

    // Limpiar el efecto al desmontar el componente
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isSharePopupVisible]);

  // VIDEO PLAYER

  // CONST DEFINITIONS
  const [wasVideoRendered, setWasVideoRendered] = useState(false);
  const [canPlay, setCanPlay] = useState(false);
  const streamUrl = `https://stream.mux.com/${currentVideo?.videoUrlStream}.m3u8`;
  const videoUrl = currentVideo?.videoUrl;
  const sources = [
    streamUrl, videoUrl
  ];
  const [src, setSrc] = useState(0);

  // VALIDATE IF VIDEO WAS RENDERED
  useEffect(() => {
    if (currentVideo?.videoUrlStream) {
      setWasVideoRendered(true);
    } else {
      setWasVideoRendered(false);
    }
  }, [currentVideo?._id]);

  // IF VIDEO WAS RENDERED SET SRC TO STREAM
  useEffect(() => {
    if (wasVideoRendered) {
      setSrc(0)
    } else {
      setSrc(1)
    }
  }, [wasVideoRendered]);

  const handleCanPlay = () => {
    setCanPlay(true);
  };

  // FIX AUTO PLAY BECAUSE OF DELAYED LOADING
  useEffect(() => {

    if (canPlay && showResumePopup === false) {
      const videoPlayer = player.current;
      videoPlayer.play();
    }

    setCanPlay(false);

  }, [canPlay]);

  // MAP SUBTITLES TO VIDEO PLAYER
  const subtitleTracks = currentVideo?.subtitles?.map((subtitle, index) => (
    <Track
      key={index}
      src={subtitle.url}
      kind="subtitles"
      label={subtitle.name}
      lang={subtitle.name}
    />
  ));


  // AVOID PIP ERROR - PENDIENTE
  const canUsePictureInPicture = player?.disablePictureInPicture;

  // SAVE VIDEO
  const [popupSaveVideo, setPopupSaveVideo] = useState(false);

  const handleSaveVideo = () => {
    setPopupSaveVideo(!popupSaveVideo);
    setAnyPopup(!anyPopup)
  };

  useEffect(() => {
    // Cuando el popup se abre, deshabilitar el scroll
    if (popupSaveVideo) {
      document.body.style.overflow = 'hidden';
    } else {
      // Cuando el popup se cierra, habilitar el scroll
      document.body.style.overflow = 'auto';
    }

    // Limpiar el efecto al desmontar el componente
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [popupSaveVideo]);

  return (

    <Container>

      {UserAllowed && (

        <Wrapper videoLoaded={videoLoaded} NoRecommendations={NoRecommendations} anyPopup={anyPopup}>

          <Content>

            {showResumePopup && (
              <ResumePopupContainer>
                <ResumePopupWrapper>
                  <ResumePopupText>
                    Resume Video
                  </ResumePopupText>
                  <ResumePopupSubText>
                    Would you like to resume this video or start over?
                  </ResumePopupSubText>
                  <ResumePopupButtons>
                    <ResumePopupButton onClick={handleStartOverClick}>Start Over</ResumePopupButton>
                    <ResumePopupButton onClick={handleResumeClick}>Resume</ResumePopupButton>
                  </ResumePopupButtons>
                </ResumePopupWrapper>
              </ResumePopupContainer>
            )}

            <VideoWrapper>

              <MediaPlayer
                style={{ zIndex: '1' }}
                playsinline
                viewType="video"
                title={currentVideo?.title}
                src={sources[src]}
                ref={player}
                onTimeUpdate={handleCurrentTimeUpdate}
                autoPlay={showResumePopup ? true : false}
                controls={showResumePopup ? true : false}
                onCanPlay={handleCanPlay}
              >
                <MediaProvider>
                  {subtitleTracks}

                  <Poster
                    className="vds-poster"
                    src={currentVideo?.imgUrlLandscape}
                    alt={currentVideo?.title}
                  />
                </MediaProvider>

                <DefaultVideoLayout
                  thumbnails={`https://image.mux.com/${currentVideo?.videoUrlStream}/storyboard.vtt`}
                  icons={defaultLayoutIcons}
                />
              </MediaPlayer>

            </VideoWrapper>


            <VideoInfo>

              <VideoImg src={currentVideo?.imgUrlVertical} />

              <VideoOtherInfo>

                <Title> {currentVideo?.title} </Title>

                <ContenedorIconosTextos>

                  <ChannelIcon src={CanalIcono} />
                  <EstiloTextos> {channel?.displayname} </EstiloTextos>
                  <EstiloIconos src={DuracionIcono} />
                  <EstiloTextos> {formatDuration(currentVideo?.duration)} </EstiloTextos>
                  <EstiloIconos src={FechaIcono} />
                  <EstiloTextos> {formatDate(currentVideo?.createdAt)} </EstiloTextos>
                  <EstiloIconos src={ViewsIcon} />
                  <EstiloTextos> {formatViews(currentVideo?.views)} </EstiloTextos>
                  <EstiloIconos src={LanguageIcono} />
                  <EstiloTextos> {currentVideo?.language} </EstiloTextos>
                  <EstiloTextos
                    style={{
                      marginLeft: '25px',
                      backgroundColor: 'rgba(30, 27, 33)',
                      padding: '4px 10px',
                      borderRadius: '10px',
                      marginTop: '-4px'
                    }}>
                    {currentVideo?.privacy && currentVideo?.privacy.charAt(0).toUpperCase() + currentVideo?.privacy.slice(1)}
                  </EstiloTextos>

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
                  <SuscbribeContainer>
                    {!isCurrentUserUploader && (
                      <Subscribe
                        onClick={handleSub}
                        isSubscribed={currentUser?.subscribedUsers?.includes(channel?._id)}
                      >
                        {currentUser?.subscribedUsers?.includes(channel?._id) ? "SUBSCRIBED ✔" : "SUBSCRIBE"}
                      </Subscribe>

                    )}
                    {!currentUser && isSubscribePopupVisible && (
                      <SuscbribeNotLogged ref={subscribeRef}>

                        <SuscbribeNotLoggedTxt> You need to be logged in to subscribe. </SuscbribeNotLoggedTxt>

                        <Link
                          to="../../signin"
                          style={{
                            textDecoration: "none",
                            color: "inherit",
                          }}
                        >
                          <ItemLogin>
                            <ImgLogin src={InicioSesionIcono2} />
                            <ButtonLoginText> {translations[language].signin} </ButtonLoginText>
                          </ItemLogin>
                        </Link>

                      </SuscbribeNotLogged>
                    )}
                  </SuscbribeContainer>
                </ChannelInfo>

              </VideoOtherInfo>

              <Buttons>
                <LikeAndDislikeButtons>
                  <LikeButton onClick={handleLike}>

                    {currentVideo?.likes?.includes(currentUser?._id) ?
                      (<ButtonsImg src={VideoLikedIcono} />) :
                      (<ButtonsImg src={VideoLikeIcono} />)} {" "}
                    {currentVideo?.likes?.length}

                    {!currentUser && isLikePopupVisible && (
                      <LikeNotLogged ref={likeRef}>

                        <LikeNotLoggedTxt> You need to be logged in to like this video. </LikeNotLoggedTxt>

                        <Link
                          to="../../signin"
                          style={{
                            textDecoration: "none",
                            color: "inherit",
                          }}
                        >
                          <ItemLogin>
                            <ImgLogin src={InicioSesionIcono2} />
                            <ButtonLoginText> {translations[language].signin} </ButtonLoginText>
                          </ItemLogin>
                        </Link>

                      </LikeNotLogged>
                    )}

                  </LikeButton>

                  <DislikeLikeSeparator src={VerticalLineIcono} />

                  <DislikeButton onClick={handleDislike}>

                    {currentVideo?.dislikes?.includes(currentUser?._id) ?
                      (<ButtonsImg src={VideoDislikedIcono} />) :
                      (<ButtonsImg src={VideoDislikeIcono} />)} {" "}
                    {currentVideo?.dislikes?.length}

                    {!currentUser && isDislikePopupVisible && (
                      <DislikeNotLogged ref={dislikeRef}>

                        <DislikeLoggedTxt> You need to be logged in to dislike this video. </DislikeLoggedTxt>

                        <Link
                          to="../../signin"
                          style={{
                            textDecoration: "none",
                            color: "inherit",
                          }}
                        >
                          <ItemLogin>
                            <ImgLogin src={InicioSesionIcono2} />
                            <ButtonLoginText> {translations[language].signin} </ButtonLoginText>
                          </ItemLogin>
                        </Link>

                      </DislikeNotLogged>
                    )}

                  </DislikeButton>
                </LikeAndDislikeButtons>
                <Button onClick={handleSaveVideo}>
                  <ButtonsImg src={VideoPlaylistIcono} /> Save
                </Button>

                <Button onClick={handleShare} ref={buttonShareRef}>
                  <ButtonsImg src={VideoShareIcono} /> Share
                </Button>

              </Buttons>

            </VideoInfo>

            <RelatedVideos>

              <RelatedSlider videoId={currentVideo?._id} UserUploader={channel?._id} />

            </RelatedVideos>

            <Comments videoId={currentVideo?._id} UserUploader={channel?._id} />

          </Content>

          <RecommendationContainer>

            <TitleHeader> RECOMMENDED </TitleHeader>
            <Recommendation tags={currentVideo?.tags} currentVideoId={currentVideo?._id} NoRecommendations={NoRecommendations} setNoRecommendations={setNoRecommendations} />

          </RecommendationContainer>


          {
            isPopUpShareVisible && (
              <SharePopupContainer>
                <SharePopupContent> Share Link copied in clipboard </SharePopupContent>
              </SharePopupContainer>
            )
          }

        </Wrapper >
      )
      }


      {
        isSharePopupVisible && (
          <SharePopupContainerBg>
            <ShareContainer ref={shareRef}>
              <ShareLabel> Share </ShareLabel>
              <CloseShare onClick={handleShare} src={CloseXGr} />

              <ShareExternalButtons>
                <FacebookShareButton
                  url={shareLink}
                  quote={'Hey There, Watch This Awesome Video Now!'}
                  hashtag="#Flashy"
                  style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                  <FacebookIcon size={48} round />
                  <ShareExternalButtonsTxt>
                    Facebook
                  </ShareExternalButtonsTxt>
                </FacebookShareButton>

                <WhatsappShareButton url={shareLink} title={'Watch This Awesome Video at Flashy'}
                  style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}
                >
                  <div style={{ cursor: 'pointer' }}>
                    <img src={WhatsappIcon} alt="Compartir en WhatsApp" width="48" height="48" />
                  </div>
                  <ShareExternalButtonsTxt style={{ marginTop: '-4px' }}>
                    Whatsapp
                  </ShareExternalButtonsTxt>
                </WhatsappShareButton>

                <TwitterShareButton
                  url={shareLink}
                  title={'Watch This Awesome Video at Flashy'}
                  hashtags={['Flashy', 'Video']}
                  style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}
                >
                  <XIcon size={48} round />
                  <ShareExternalButtonsTxt style={{ marginTop: '2px' }}>
                    X
                  </ShareExternalButtonsTxt>
                </TwitterShareButton>

                <TelegramShareButton
                  url={shareLink}
                  title={'Watch This Awesome Video at Flashy'}
                >
                  <TelegramIcon size={48} round />
                  <ShareExternalButtonsTxt style={{ marginTop: '-4px' }}>
                    Telegram
                  </ShareExternalButtonsTxt>
                </TelegramShareButton>

                <RedditShareButton
                  url={shareLink}
                  title={'Watch This Awesome Video at Flashy'}
                >
                  <RedditIcon size={48} round />
                  <ShareExternalButtonsTxt style={{ marginTop: '-4px' }}>
                    Reddit
                  </ShareExternalButtonsTxt>
                </RedditShareButton>

                <EmailShareButton
                  url={shareLink}
                  subject={'Flashy Video'}
                  body={'Watch This Awesome Video at Flashy'}
                  separator={'\n\n'}
                  style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}
                >
                  <EmailIcon size={48} round />
                  <ShareExternalButtonsTxt>
                    Email
                  </ShareExternalButtonsTxt>
                </EmailShareButton>
              </ShareExternalButtons>

              <ShareLinkCopyDiv>
                <ShareLink> {shareLink} </ShareLink>
                <ShareCopyLink src={CopyIcono} onClick={handleCopyClick} />
              </ShareLinkCopyDiv>
            </ShareContainer>
          </SharePopupContainerBg>
        )
      }

      {
        popupSaveVideo && (
          <PlaylistSelectBoxVideo
            closePopup={handleSaveVideo}
            userId={currentUser?._id}
            videoId={currentVideo?._id}
          />
        )
      }

      {
        !UserAllowed && videoLoaded && (
          <NotAllowedContainerBg>
            <NotAllowedContainer>
              <WrapperNotAllowed>
                <TitleNotAllowed> Private Video </TitleNotAllowed>
                <SubLabelNotAllowed>
                  "Oops! It looks like this video is set to private. You don't have permission to view it. Please contact the owner for access."
                </SubLabelNotAllowed>
              </WrapperNotAllowed>
              <Link to={"../"} style={{ textDecoration: "none", marginLeft: "auto" }}>
                <GoHomeNotAllowed > Go Home </GoHomeNotAllowed>
              </Link>

            </NotAllowedContainer>
          </NotAllowedContainerBg>
        )
      }

      {
        !videoLoaded && (
          <LoadingContainer>
            <LoadingCircle />
          </LoadingContainer>
        )
      }

    </Container >
  );
};

export default VideoPage;
