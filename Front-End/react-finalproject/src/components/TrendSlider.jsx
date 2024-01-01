import React, { useState, useEffect, useRef, useContext } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import styled, { css, keyframes } from "styled-components";
import { useLanguage } from '../utils/LanguageContext';
import { Link, useNavigate, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import CardTrending from './CardTrending';
import axios from "axios";
import moment from "moment";
import "moment/locale/es";
import ViewsIcon from '../assets/ViewsTedenciaIcono.png';
import PlayButton from "../assets/VerAhoraIcono.png";
import Save4Card from "../assets/Save4Card.png";
import ArrowDown from "../assets/ArrowDown.png";
import FechaIcono from "../assets/FechaIconoG.png"
import DuracionIcono from "../assets/DuracionIconoG.png"
import LanguageIcono from '../assets/IdiomaIconoG.png';
import CloseX from "../assets/CloseX.png";
import MuteIcono from "../assets/MuteIcono.png";
import NoMuteIcono from "../assets/NoMuteIcono.png";
import WatchNowIcono from "../assets/VerAhoraIcono.png";
import Save4Popup from "../assets/Save4Popup.png";
import VideoLikeIcono from "../assets/VideoLikeIcono.png";
import VideoDislikeIcono from "../assets/VideoDislikeIcono.png";
import ViewsIconG from '../assets/ViewsIcono2.png';
import LanguageIconoG from '../assets/LanguageIconoG.png';
import SubtitleIconoG from '../assets/SubtitleIconoG.png';
import VideoShareIcono from "../assets/VideoShareIconoPopup.png";
import WhatsappIcon from "../assets/WhatsappIcon.png";
import CopyIcono from "../assets/CopyIcono.png";
import CloseXGr from "../assets/CloseXGr.png"
import ReactPlayer from 'react-player';
import Card4CardPopup from "./Card4CardPopup";
import PlaylistSelectBoxVideo from "./PlaylistSelectBoxVideo";

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

const Container = styled.h1`
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;
`;

const Header = styled.h1`
font-size: 32px;
color: rgba(224, 175, 208);
padding: 32px 55px;
font-weight: 700px;
font-family: "Roboto Condensed", Helvetica;
width: max-content;
`;

const StyledArrow = styled.button`
position: absolute;
height: 47%;
font-size: 30px;
width: 33px;
right:0px;
border: none;
background: transparent;
cursor: pointer;
color: white;
border-radius: 10px;
line-height: 40%;
padding: 0 7px;
transition: background-color 0.3s;

&:hover {
  background: rgba(124, 83, 115, 0.5);
}
`;

const StyledRightArrow = styled(StyledArrow)`
top: 0%;
`;

const StyledLeftArrow = styled(StyledArrow)`
top: 53%;
`;

// POP UP MORE INFO

// POP UP MORE INFO

const PopupContainerBg = styled.div`
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background-color: ${({ closing }) => (closing ? 'transparent' : '#000000b9')}; 
    display: flex;
    padding-top: 30px;
    align-items: center;
    justify-content: center;
    z-index: 4;
    overflow-y: auto;

    &::-webkit-scrollbar {
      width: 7px;
    }
        
    &::-webkit-scrollbar-thumb {
        border-radius: 15px;
    }
`;

const popUpAnimation = keyframes`
  from {
    transform: scale(0.8);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
`;

const popDownAnimation = keyframes`
  from {
    transform: scale(1);
    opacity: 1;
  }
  to {
    transform: scale(0.8);
    opacity: 0;
  }
`;

const PopupContainer = styled.div`
  position: relative;
  width: 48%;
  height: auto;
  margin-top: auto;
  margin-bottom: ${({ filteredVideosLenght }) => (filteredVideosLenght === 0 ? '10%' : '0px')};
  background: rgba(24, 24, 24);
  color: ${({ theme }) => theme.text};
  border-radius: 10px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  animation: ${popUpAnimation} 0.3s ease-in-out forwards;


    ${props => props.closing && css`
      animation: ${popDownAnimation} 0.5s ease-in-out forwards;
    `}
  `;

const PopupWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  `;

const PopupImageVideoContainer = styled.div`
    position: relative;
    width: 100%;
    height: 511px;
    border-radius: 11px 11px 0px 0px;
    overflow: hidden;
    display: flex;
    justify-content: center;
`;

const popUpAnimationAppear = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const PopupImage = styled.img`
    position: absolute;
    width: 100%;
    height: 100%;
    overflow: hidden;
    animation: ${popUpAnimationAppear} 1s ease-in-out forwards;
    opacity: ${({ videoPopupEnded }) => (videoPopupEnded ? 1 : 0)};
`;

const PopupImageGradientOverlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 20%;
  background: linear-gradient(to bottom,
    transparent,
    rgba(25, 25, 25, 0.001),
    rgba(25, 25, 25, 0.002),
    rgba(25, 25, 25, 0.003),
    rgba(25, 25, 25, 0.004),
    rgba(25, 25, 25, 0.005),
    rgba(25, 25, 25, 0.006),
    rgba(25, 25, 25, 0.007),
    rgba(25, 25, 25, 0.008),
    rgba(25, 25, 25, 0.009),
    rgba(24, 24, 24, 0.01),
    rgba(24, 24, 24, 0.015),
    rgba(24, 24, 24, 0.02),
    rgba(24, 24, 24, 0.025),
    rgba(24, 24, 24, 0.03),
    rgba(24, 24, 24, 0.035),
    rgba(24, 24, 24, 0.04),
    rgba(24, 24, 24, 0.045),
    rgba(24, 24, 24, 0.05),
    rgba(24, 24, 24, 0.055),
    rgba(24, 24, 24, 0.06),
    rgba(24, 24, 24, 0.065),
    rgba(24, 24, 24, 0.07),
    rgba(24, 24, 24, 0.075),
    rgba(24, 24, 24, 0.08),
    rgba(24, 24, 24, 0.085),
    rgba(24, 24, 24, 0.09),
    rgba(24, 24, 24, 0.095),
    rgba(24, 24, 24, 0.1),
    rgba(24, 24, 24, 0.15),
    rgba(24, 24, 24, 0.2),
    rgba(24, 24, 24, 0.25),
    rgba(24, 24, 24, 0.3),
    rgba(24, 24, 24, 0.35),
    rgba(24, 24, 24, 0.4),
    rgba(24, 24, 24, 0.45),
    rgba(24, 24, 24, 0.5),
    rgba(24, 24, 24, 0.55),
    rgba(24, 24, 24, 0.6),
    rgba(24, 24, 24, 0.65),
    rgba(24, 24, 24, 0.7),
    rgba(24, 24, 24, 0.75),
    rgba(24, 24, 24, 0.8),
    rgba(24, 24, 24, 0.85),
    rgba(24, 24, 24, 0.9),
    rgba(24, 24, 24, 0.95),
    rgba(24, 24, 24, 1));
  z-index: 2;
`;

const CloseButtonDiv = styled.div`
    position: absolute;
    display: flex;
    width: 35px;
    height: 35px;
    border-radius: 50%;
    align-items: center;
    justify-content: center;
    padding: 0px;
    background: rgba(23, 23, 22);
    top: 20px;
    right: 20px;
    cursor: pointer;
    z-index: 2;
`;

const CloseImg = styled.img`
    height: 55%;
    width: 55%;
`;

// VIDEO & IMAGE FOR POP UP

const VideoWrapper = styled.div`
  position: absolute;
  height: 1100px;
  width: 100%;
  overflow: hidden;
  z-index: 1;
  animation: ${popUpAnimationAppear} 1s ease-in-out forwards;
  opacity: ${({ videoPopupEnded }) => (videoPopupEnded ? 0 : 1)};
  visibility: ${({ videoPopupEnded }) => (videoPopupEnded ? 'hidden' : '')};
  pointer-events: ${({ videoPopupEnded }) => (videoPopupEnded ? 'none' : 'auto')};
  cursor: pointer;
`;

const MuteButtonDiv = styled.div`
    position: absolute;
    display: flex;
    width: 38px;
    height: 38px;
    border-radius: 50%;
    align-items: center;
    justify-content: center;
    background: rgba(54, 54, 51);
    bottom: 60px;
    right: 50px;
    z-index: 2;
    border: 2px solid #454543;
    opacity: 0.4;
    cursor: pointer;
    transition: opacity 0.4s ease;
    visibility: ${({ videoPopupEnded }) => (videoPopupEnded ? 'hidden' : 'visible')};  
    &:hover {
      opacity: 1;
      background: rgba(23, 23, 22);
    }
`;

const MuteImg = styled.img`
    height: 60%;
    width: 60%;
`;

const VideoTitle = styled.h1`
    position: absolute;
    display: flex;
    width: max-content;
    max-width: 450px;
    height: max-content;
    bottom: ${({ progress, currentUser }) => (progress > 0 && currentUser ? '170px' : '140px')}; 
    left: 50px;
    z-index: 2;
    color: white;
    font-family: "Roboto Condensed", Helvetica;
    font-size: 34px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    text-shadow: 2px 2px 1px rgba(0, 0, 0);
`;

const WatchNowSaveDiv = styled.div`
    position: absolute;
    display: flex;
    width: max-content;
    height: max-content;
    align-items: center;
    bottom: 75px;
    left: 50px;
    z-index: 2;
    gap: 15px;
`;

const WatchNowPopupDiv = styled.div`
    display: flex;
    width: max-content;
    height: max-content;
    border-radius: 8px;
    align-items: center;
    justify-content: center;
    background: rgba(15, 15, 15);
    padding: 7px 30px;
    z-index: 2;
    cursor: pointer;
    gap: 15px;
    font-size: 24px;
    color: white;
    font-family: "Roboto Condensed", Helvetica;
    font-weight: bold;
    transition: background 0.3s ease;

    &:hover {
      background: rgba(54, 54, 51);
    }
`;

const WatchNowPopupImg = styled.img`
    height: 30px;
    width: 30px;
`;

const SaveButtonDiv = styled.div`
    display: flex;
    width: 38px;
    height: 38px;
    margin-left: 225px;
    margin-top: 1px;
    border-radius: 50%;
    align-items: center;
    justify-content: center;
    background: rgba(54, 54, 51, 0.7);
    z-index: 2;
    border: 2px solid rgba(69, 69, 67, 0.7);
    cursor: pointer;
    transition: background 0.3s ease;

    &:hover {
      background: rgba(23, 23, 22, 0.9);
      border-color: rgba(82, 82, 79, 0.9);
    }
`;

const SaveImg = styled.img`
    height: 60%;
    width: 60%;
`;

// BELOW CONTENT

const PopupBelowContent = styled.div`
  position: relative;
  width: 100%;
  height: max-content;
  display: flex;
  padding: 20px 50px;
  gap: 50px;
`;

const PopupBelowDivColumn = styled.div`
  position: relative;
  width: max-content;
  height: max-content;
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-right: auto;
`;

const InfoDiv = styled.div`
  position: relative;
  display: flex;
  gap: 25px;
`;

const VideoDate = styled.h1`
  font-size: 18px;
  color: ${({ theme }) => theme.textSoft};
  font-family: "Roboto Condensed", Helvetica;
  font-weight: normal;
  display: flex;
  height: max-content;
  width: max-content;
`;

const InfoItem = styled.div`
  font-size: 18px;
  color: ${({ theme }) => theme.textSoft};
  font-family: "Roboto Condensed", Helvetica;
  font-weight: normal;
  display: flex;
  height: max-content;
  width: max-content;
  gap: 4px;
`;

const InfoElementImg = styled.img`
  height: 20px;
  width: 20px;
`;

const ChannelContainer = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  text-align: center;
  height: max-content;
  width: max-content;
`;

const ChannelImagePopup = styled.img`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: #999;
  cursor: pointer;
  margin-left: 4px;
`;

const ChannelNamePopup = styled.h2`
  font-size: 18px;
  color: ${({ theme }) => theme.text};
  cursor: pointer;
  margin-right: 5px;
  font-family: "Roboto Condensed", Helvetica;
  font-weight: normal;
`;

const VideoDescPopup = styled.h1`
  font-size: 16px;
  color: ${({ theme }) => theme.text};
  font-family: "Roboto Condensed", Helvetica;
  font-weight: normal;
  display: flex;
  height: max-content;
  width: max-content;
  max-width: 500px;
  margin-top: 12px;
`;

const RightItemsDiv = styled.div`
  width: 200px;
  height: max-content;
  position: relative;
  display: flex;
`;

const TagsDiv = styled.div`
  width: max-content;
  height: max-content;
  position: relative;
  display: flex;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  line-height: 1.5; 
  margin-left: auto;
`;

const TagsLabel = styled.span`
  font-size: 16px;
  color: ${({ theme }) => theme.textSoft};
  font-family: "Roboto Condensed", Helvetica;
  font-weight: normal;
`;

const TagsTxt = styled.span`
  font-size: 16px;
  color: ${({ theme }) => theme.text};
  font-family: "Roboto Condensed", Helvetica;
  font-weight: normal;
`;

const ShareButton = styled.div`
  display: flex;
  font-size: 18px;
  width: max-content;
  font-family: "Roboto Condensed", Helvetica;
  font-weight: normal;
  align-items: center;
  gap: 5px;
  cursor: pointer;
  user-select: none; 
  background: rgba(15, 15, 15);
  padding: 8px 12px;
  border-radius: 10px;
  &:hover {
    background: rgba(54, 54, 51);
  }
  margin-left: auto;
`;

const ShareButtonImg = styled.img`
    width: 25px;
    height: 25px;
    margin-right: 3px;
`;

const ShareButtonNoTag = styled.div`
  display: flex;
  font-size: 16px;
  width: max-content;
  font-family: "Roboto Condensed", Helvetica;
  font-weight: normal;
  align-items: center;
  gap: 5px;
  cursor: pointer;
  user-select: none; 
  background: rgba(15, 15, 15);
  padding: 6px 10px;
  border-radius: 10px;
  &:hover {
    background: rgba(54, 54, 51);
  }
`;

const ShareButtonImgNoTag = styled.img`
    width: 20px;
    height: 20px;
    margin-right: 3px;
`;

const ShareContainer = styled.div`
  display: flex;
  position: absolute;
  color: white;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  height: max-content;
  background: rgba(24, 24, 24);
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
    z-index: 4;
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

const RecommendationsContainer = styled.div`
  position: relative;
  width: calc(100% - 100px);
  height: max-content;
  display: flex;
  left: 50px;
  flex-direction: column;
  gap: 15px;
  margin-right: auto;
  margin-top: 55px;
`;

// RECOMMENDED CONTENT
const LabelRecommendation = styled.label`
    font-size: 24px;
    font-weight: bold;
    font-family: "Roboto Condensed", Helvetica;
`;

const ContainerRecommendation = styled.div`
  flex: 2;
  margin-top: 10px;
  margin-bottom: 70px;
  width: 100%;
`;

const CardContainerRecommendation = styled.h1`
    position: relative; 
    border-radius: 5px;
    border-top: 1px solid rgba(118, 118, 118, 0.5);
    width: 100%;
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
  width: 100%;
  padding-top: 50px;
  padding-left: 10px;
`;

const LoadingCircle = styled.div`
  border: 4px solid #f3f3f3;
  border-top: 4px solid #7932a8;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: ${rotate} 1s linear infinite;
`;

// PROGRESS POP UP

const ProgressContainerPopup = styled.div`
  postition: relative;  
  display: flex;
  align-items: center;
  width: 450px;
  bottom: 0px;
  margin-top: 355px;
  margin-left: -345px;
  z-index: 2;
  height: max-content;
`;

const ProgressBarPopup = styled.div`
  width: 72%;
  height: 2px;
  background-color: rgba(36, 35, 35, 0.8);
  border-radius: 1px;
  bottom: 0px;
  z-index: 2;
  display: flex;
`;

const ProgressIndicatorPopup = styled.div`
  height: 100%;
  width: ${(props) => `${props.progress}%`};
  background-color: rgba(145, 1, 111);
  border-radius: 1px;
`;

const ProgressTxtPopup = styled.div`
  font-size: 17px;
  color: rgba(219, 219, 217);
  margin-left: 20px;
  font-family: "Roboto Condensed", Helvetica;
  font-weight: bold;
  opacity: 0.8;
`;


// FOOTER

const LabelFooter = styled.h1`
    position: relative;
    display: flex;
    font-size: 16px;
    font-weight: normal;
    font-family: "Roboto Condensed", Helvetica;
    color: ${({ theme }) => theme.textSoft};
    margin-top: 40px;
    align-items: center;
    justify-content: center;
`;


const responsive = {
  superLargeDesktop: {
    breakpoint: { max: 4000, min: 3000 },
    items: 4,
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 6,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
  },
};

const CustomRightArrow = ({ onClick, ...rest }) => (
  <StyledRightArrow
    onClick={() => onClick()}
    {...rest}
  >
    {'❱'}
  </StyledRightArrow>
);

const CustomLeftArrow = ({ onClick, ...rest }) => (
  <StyledLeftArrow
    onClick={() => onClick()}
    {...rest}
  >
    {'❰'}
  </StyledLeftArrow>
);

const StyledCarousel = styled(Carousel)`
  margin: 0px 50px;
  margin-right: ${({ isMoreInfo }) => (isMoreInfo ? '57px' : '50px')};
`;

const TrendSlider = ({ type = "trend" }) => {
  const { language, setLanguage } = useLanguage();

  const translations = {
    en: {
      nowtrending: "Now Trending",
    },
    es: {
      nowtrending: "Ahora En Tendecia",
    },
  };

  const [videos, setVideos] = useState([])
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await axios.get(`/videos/${type}`);
        setVideos(res.data);
      } catch (error) {
        console.error("Error fetching videos:", error);
      }
    };
    fetchVideos()
  }, [type]);

  // POPUP CARD RELATED
  const { currentUser } = useSelector((state) => state.user);
  const [channel, setChannel] = useState({});
  const [progress, setProgress] = useState(0);
  const [isMoreInfo, setIsMoreInfo] = useState(false);
  const [isMoreInfoClosing, setIsMoreInfoClosing] = useState(false);
  const [videoPopupEnded, setVideoPopupEnded] = useState(false);
  const [MoreInfoInputs, setMoreInfoInputs] = useState({});
  const [isVideoMuted, setIsVideoMuted] = useState(true);
  const moreInfoRef = useRef(null);
  const videoPlayer = useRef(null);
  const [playerWidth, setPlayerWidth] = useState(0);
  const [playerHeight, setPlayerHeight] = useState(0);
  const windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
  const windowHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
  const [shareLink, setShareLink] = useState('');
  const [isSharePopupVisible, setSharePopupVisible] = useState(false);
  const shareRef = useRef(null);
  const shareRefBg = useRef(null);
  const buttonShareRef = useRef(null);
  const currentURL = window.location.href + 'video/' + MoreInfoInputs.videoId;
  const [isPopUpShareVisible, setIsPopUpShareVisible] = useState(false);
  const [videoTimerTick, setVideoTimerTick] = useState(0);

  // VIDEO TICK TIMER TO TRACK VIDEO SIZE
  const handleVideoTimerTick = (state) => {
    const playedPercentage = state.played * 100;
    setVideoTimerTick(playedPercentage);
  };

  // SET VIDEO POPUP SIZE
  useEffect(() => {
    if (windowWidth <= 2000 && windowHeight <= 1200) {
      setPlayerWidth(910)
      setPlayerHeight(530)
    } else {
      setPlayerWidth(1240)
      setPlayerHeight(700)
    }
  }, [videoTimerTick, isMoreInfo]);

  // SHOW POPUP MORE INFO
  const handleShowMoreInfo = () => {
    setIsMoreInfo(true);
  };

  // CLOSE POPUP MORE INFO
  const handleCloseMoreInfo = () => {
    setIsMoreInfoClosing(true);
    setTimeout(() => {
      setIsMoreInfo(false);
      setIsMoreInfoClosing(false);
      setVideoPopupEnded(false);
      setIsVideoMuted(true);
    }, 500);
  };

  // MUTE AND UNMUTE POPUP PLAYER
  const handleMuteUnmuteMoreInfoPlayer = () => {
    setIsVideoMuted(!isVideoMuted);
  };

  // SHOW POPUP MORE INFO FROM IMAGE CONTAINER
  const handleShowMoreInfoFromImage = () => {
    setIsMoreInfo(true);
  };

  // CLOSE POPUP MORE INFO ON CLICK OUTSIDE
  useEffect(() => {
    const handleClickOutsidePopupMoreInfo = (event) => {
      const isScrollbarClick = event.clientX >= document.documentElement.clientWidth - 7;

      if (
        moreInfoRef.current &&
        !moreInfoRef.current.contains(event.target) &&
        !(shareRef.current && shareRef.current.contains(event.target)) &&
        !(shareRefBg.current && shareRefBg.current.contains(event.target)) &&
        !(saveRef.current && saveRef.current.contains(event.target)) &&
        !isScrollbarClick
      ) {
        handleCloseMoreInfo();
      }
    };

    document.addEventListener("mousedown", handleClickOutsidePopupMoreInfo);

    return () => {
      document.removeEventListener("mousedown", handleClickOutsidePopupMoreInfo);
    };
  }, [shareRef, moreInfoRef]);

  // HIDE VIDEO WRAPPER ON VIDEO END
  const handleVideoPopupEnded = () => {
    setVideoPopupEnded(true);
  };

  if (language === "es") {
    moment.locale("es");
  } else {
    moment.locale("en");
  }

  // FORMATS
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

  const formatDurationProgress = (durationInSeconds) => {
    const hours = Math.floor(durationInSeconds / 3600);
    const minutes = Math.floor((durationInSeconds % 3600) / 60);
    const seconds = durationInSeconds % 60;

    if (hours > 0) {
      return `${parseInt(hours, 10)}h`;
    } else if (minutes > 0) {
      return `${parseInt(minutes, 10)}m`;
    } else {
      return `${parseInt(seconds, 10)}s`;
    }
  };

  const formatDate = (createdAt) => {
    const date = new Date(createdAt);
    const options = { month: 'short', day: '2-digit', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  // FETCH DATA
  useEffect(() => {

    if (MoreInfoInputs.userId !== undefined) {

      const fetchChannel = async () => {
        const res = await axios.get(`/users/find/${MoreInfoInputs.userId}`);
        setChannel(res.data);
      };

      const fetchProgress = async () => {
        if (currentUser) {
          const userProgressRes = await axios.get(`/videos/userProgress/${MoreInfoInputs.videoId}`);
          setProgress(userProgressRes.data.progress);
        }
      };

      fetchChannel();

      if (currentUser) {
        fetchProgress();
      }

    }

  }, [MoreInfoInputs.userId, MoreInfoInputs.videoId]);

  // REDIRECTS

  const handleGoToChannel = (channelId) => {
    navigate(`/channel/${channelId}`);
    // Reiniciar la página después de la redirección
    navigate('/channel', { replace: true });
  };

  // SHARE
  const handleShare = () => {
    setShareLink(currentURL);
    setSharePopupVisible(!isSharePopupVisible);
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

  // FETCH RECOMMENDATIONS
  const [videosR, setVideosR] = useState([]);
  const [cardLoaded, setCardLoaded] = useState(false);
  const videoId = MoreInfoInputs.videoId;
  const filteredVideos = videosR.filter((video) => video._id !== videoId);

  useEffect(() => {
    setCardLoaded(false);
    const fetchVideos = async () => {
      const res = await axios.get(`/videos/tags?tags=${MoreInfoInputs.tags}`);
      setVideosR(res.data);
      setCardLoaded(true);
    };
    fetchVideos();

  }, [MoreInfoInputs.tags]);

  // SAVE VIDEO
  const [popupSaveVideo, setPopupSaveVideo] = useState(false);
  const saveRef = useRef(null);

  const handleSaveVideo = () => {
    setPopupSaveVideo(!popupSaveVideo);
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

  // STOP SCROLL ON POPUP MORE INFO
  useEffect(() => {
    if (isMoreInfo) {
      document.body.style.overflow = 'hidden';
    }
    else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isMoreInfo, popupSaveVideo]);

  return (
    <div>

      {isMoreInfo && (
        <PopupContainerBg closing={isMoreInfoClosing}>
          <PopupContainer closing={isMoreInfoClosing} ref={moreInfoRef} filteredVideosLenght={filteredVideos.length}>
            <PopupImageVideoContainer>

              <VideoWrapper videoPopupEnded={videoPopupEnded}>
                <Link to={`/video/${MoreInfoInputs.videoId}`} style={{ textDecoration: 'none', position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
                  <ReactPlayer
                    ref={videoPlayer}
                    url={MoreInfoInputs.videoUrl}
                    controls={false}
                    autoplay={true}
                    playing={true}
                    muted={isVideoMuted}
                    width={`${playerWidth}px`}
                    height={`${playerHeight}px`}
                    onProgress={handleVideoTimerTick}
                    onEnded={handleVideoPopupEnded}
                    style={{ cursor: 'pointer', marginTop: '-10px', background: 'black' }}
                  />
                </Link>
              </VideoWrapper>

              <Link to={`/video/${MoreInfoInputs.videoId}`} style={{ textDecoration: 'none', position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
                <PopupImage src={MoreInfoInputs.imgUrlLandscape} videoPopupEnded={videoPopupEnded} />
              </Link>

              <Link to={`/video/${MoreInfoInputs.videoId}`} style={{ textDecoration: 'none', position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
                <PopupImageGradientOverlay />
              </Link>

              <CloseButtonDiv onClick={handleCloseMoreInfo}>
                <CloseImg src={CloseX} />
              </CloseButtonDiv>

              <MuteButtonDiv onClick={handleMuteUnmuteMoreInfoPlayer} videoPopupEnded={videoPopupEnded}>
                <MuteImg src={isVideoMuted ? MuteIcono : NoMuteIcono} />
              </MuteButtonDiv>

              <Link to={`/video/${MoreInfoInputs.videoId}`} style={{ textDecoration: 'none', position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
                <VideoTitle progress={progress} currentUser={currentUser}>{MoreInfoInputs.title}</VideoTitle>
              </Link>

              {currentUser && progress > 0 && (

                <ProgressContainerPopup>
                  <Link to={`/video/${MoreInfoInputs.videoId}`} style={{ textDecoration: 'none', display: 'inherit', position: 'inherit', width: 'inherit', height: 'inherit', alignItems: 'inherit' }}>

                    <ProgressBarPopup>
                      <ProgressIndicatorPopup progress={progress} />
                    </ProgressBarPopup>

                    <ProgressTxtPopup> {formatDurationProgress(progress)} of {formatDurationProgress(MoreInfoInputs.duration)} </ProgressTxtPopup>
                  </Link>

                </ProgressContainerPopup>
              )}

              <WatchNowSaveDiv>
                <Link to={`/video/${MoreInfoInputs.videoId}`} style={{ textDecoration: 'none', position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', padding: '0px', margin: '0px' }}>
                  <WatchNowPopupDiv>
                    <WatchNowPopupImg src={WatchNowIcono} /> Watch Now
                  </WatchNowPopupDiv>
                </Link>

                <SaveButtonDiv onClick={handleSaveVideo}>
                  <SaveImg src={Save4Popup} />
                </SaveButtonDiv>

              </WatchNowSaveDiv>

            </PopupImageVideoContainer>

            <PopupWrapper>
              <PopupBelowContent>
                <PopupBelowDivColumn>

                  <ChannelContainer>
                    <ChannelImagePopup
                      src={channel.img}
                      onClick={() => handleGoToChannel(channelId)}
                    />
                    <ChannelNamePopup onClick={() => handleGoToChannel(channelId)} > {channel.displayname} </ChannelNamePopup>

                    {MoreInfoInputs.tags.length === 0 && (
                      <ShareButtonNoTag onClick={handleShare} ref={buttonShareRef}>
                        <ShareButtonImgNoTag src={VideoShareIcono} /> Share
                      </ShareButtonNoTag>
                    )}
                  </ChannelContainer>

                  <InfoDiv>
                    <VideoDate>
                      {formatDate(MoreInfoInputs.createdAt)}
                    </VideoDate>

                    <InfoItem>
                      <InfoElementImg src={ViewsIconG} /> {formatViews(MoreInfoInputs?.views)}
                    </InfoItem>


                    <InfoItem>
                      <InfoElementImg src={VideoLikeIcono} /> {MoreInfoInputs.likes.length}
                    </InfoItem>

                    <InfoItem>
                      <InfoElementImg src={VideoDislikeIcono} /> {MoreInfoInputs.dislikes.length}
                    </InfoItem>

                    <InfoItem>
                      <InfoElementImg src={LanguageIconoG} /> {MoreInfoInputs.language}
                    </InfoItem>

                    <InfoItem>
                      <InfoElementImg src={SubtitleIconoG} />
                      {MoreInfoInputs.subtitles && MoreInfoInputs.subtitles.length > 0
                        ? MoreInfoInputs.subtitles[0].name + (MoreInfoInputs.subtitles[1] ? ', ' + MoreInfoInputs.subtitles[1].name : '') + (MoreInfoInputs.subtitles[2] ? ', ' + MoreInfoInputs.subtitles[2].name : '') + (MoreInfoInputs.subtitles[3] ? ', ' + MoreInfoInputs.subtitles[3].name : '')
                        : 'No Subtitles'}
                    </InfoItem>

                  </InfoDiv>

                  <VideoDescPopup>
                    {MoreInfoInputs.desc}
                  </VideoDescPopup>
                </PopupBelowDivColumn>

                <PopupBelowDivColumn style={{ marginRight: '100px' }}>
                  <RightItemsDiv>

                    {MoreInfoInputs.tags.length > 0 && (
                      <TagsDiv>
                        <TagsLabel style={{ color: 'tu-color-aquí' }}>Tags:&nbsp;</TagsLabel>
                        {MoreInfoInputs.tags.map((tag, index) => (
                          <TagsTxt key={index}>{index > 0 ? ', ' : ''}{tag.charAt(0).toUpperCase() + tag.slice(1)}</TagsTxt>
                        ))}
                      </TagsDiv>
                    )}
                  </RightItemsDiv>
                  {MoreInfoInputs.tags.length > 0 && (
                    <ShareButton onClick={handleShare} ref={buttonShareRef}>
                      <ShareButtonImg src={VideoShareIcono} /> Share
                    </ShareButton>
                  )}
                </PopupBelowDivColumn>
              </PopupBelowContent>

              <RecommendationsContainer>
                <LabelRecommendation> You might also like </LabelRecommendation>

                <ContainerRecommendation>
                  {cardLoaded ? (
                    filteredVideos.length === 0 ? (
                      <p style={{ color: 'rgb(158, 93, 176)', fontWeight: 'bold', fontFamily: '"Roboto Condensed", Helvetica', fontSize: '18px', position: 'absolute', width: 'max-content' }}>
                        No recommended videos found.
                      </p>
                    ) : (
                      <CardContainerRecommendation>
                        {filteredVideos.map((video) => (
                          <Card4CardPopup type="sm" key={MoreInfoInputs.videoId} video={video} />
                        ))}
                        <LabelFooter> @Flashy_Content </LabelFooter>
                      </CardContainerRecommendation>
                    )
                  ) : (
                    <LoadingContainer>
                      <LoadingCircle />
                    </LoadingContainer>
                  )}

                </ContainerRecommendation>

              </RecommendationsContainer>

            </PopupWrapper>
          </PopupContainer>
        </PopupContainerBg>
      )}


      <Container>
        <Header>{translations[language].nowtrending}</Header>

        <StyledCarousel
          responsive={responsive}
          autoPlay={false}
          swipeable={false}
          draggable={false}
          itemClass={TrendSlider.carouselItem}
          partialVisible={false}
          customLeftArrow={<CustomLeftArrow />}
          customRightArrow={<CustomRightArrow />}
          isMoreInfo={isMoreInfo}
        >
          {videos.slice(0, 10).map((video, index) => (
            <CardTrending key={video._id} video={video} index={index} setIsMoreInfo={setIsMoreInfo} setMoreInfoInputs={setMoreInfoInputs} />
          ))}

        </StyledCarousel>

      </Container>

      {
        popupSaveVideo && (
          <div ref={saveRef}>
            <PlaylistSelectBoxVideo
              closePopup={handleSaveVideo}
              userId={currentUser?._id}
              videoId={MoreInfoInputs?.videoId}
            />
          </div>
        )
      }

      {
        isSharePopupVisible && (
          <SharePopupContainerBg ref={shareRefBg}>
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
        isPopUpShareVisible && (
          <SharePopupContainer>
            <SharePopupContent> Share Link copied in clipboard </SharePopupContent>
          </SharePopupContainer>
        )
      }
    </div>
  );
}

export default TrendSlider;
