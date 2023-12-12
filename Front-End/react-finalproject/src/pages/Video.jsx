import React, { useState, useEffect, useRef, useContext } from "react";
import styled, { keyframes } from "styled-components";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Comments from "../components/Comments";
import Recommendation from "../components/Recommendation";
import InicioSesionIcono2 from "../assets/InicioSesionIcono2.png";
import VideoLikeIcono from "../assets/VideoLikeIcono.png";
import VideoLikedIcono from "../assets/VideoLikedIcono.png";
import VideoDislikeIcono from "../assets/VideoDislikeIcono.png";
import VideoDislikedIcono from "../assets/VideoDislikedIcono.png";
import VideoShareIcono from "../assets/VideoShareIcono.png";
import VideoSaveIcono from "../assets/VideoSaveIcono.png";
import VideoSavedIcono from "../assets/VideoSavedIcono.png";
import RelatedSlider from "../components/RelatedSlider";
import CanalIcono from "../assets/CanalIconoG.png"
import DuracionIcono from "../assets/DuracionIconoG.png"
import FechaIcono from "../assets/FechaIconoG.png"
import ViewsIcon from '../assets/ViewsIcono2.png';
import CopyIcono from "../assets/CopyIcono.png"
import { useLanguage } from '../utils/LanguageContext';
import { useDispatch, useSelector } from 'react-redux';
import axios from "axios";
import { dislike, fetchSuccess, like } from "../redux/videoSlice";
import { subscription } from "../redux/userSlice";

const Container = styled.div`
  margin: auto;
  display: flex;
  gap: 24px;
  max-width: 1200px;
  min-height: 100vh;
  padding: 101px 273px 0px 273px;
  background-color: rgba(15, 12, 18);
`;

const Content = styled.div`wwwwwwwwwwwwwwwww
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
  user-select: none; 
`;

const ButtonsImg = styled.img`
    width: 25px;
    height: 25px;
`;

const RelatedVideos = styled.div`
  position: relative;
  display: flex;
  height: auto;
  padding: 0px 0px 40px 0px;
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
  padding: 10px 20px;
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
  background-color: rgba(70, 67, 74, 0.7);
  width: auto;
  border-radius: 0px 10px 10px 10px;
  padding: 10px;
  margin-top: 135px;
  margin-left: 675px;
  z-index: 2;
  cursor: normal;
`;

const ShareTxt = styled.h1`
  color: white;
  padding: 10px 5px;
  font-family: "Roboto Condensed", Helvetica;
  font-size: 18px;
  font-weight: normal;
`;

const ShareLinkCopyDiv = styled.div`
  postition: relative;
  display: flex;
  flex-direction: row;
  align-items: center; 
`;


const ShareLink = styled.h1`
  background: rgba(36, 35, 35, 0.8);
  border-radius: 8px;
  color: white;
  padding: 10px 15px;
  font-family: "Roboto Condensed", Helvetica;
  font-size: 18px;
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
  border-radius: 15px;
`;

const rotate = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  margin-top: -101px;
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

const Video = () => {
  const { language, setLanguage } = useLanguage();

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

  // RESUME VIDEO FROM PROGRESS
  const [showResumePopup, setShowResumePopup] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [resumeProgress, setResumeProgress] = useState(0);

  const handleResumeClick = () => {
    setShowResumePopup(false);
    videoRef.current.currentTime = (resumeProgress / 100) * videoRef.current.duration;
    videoRef.current.play();
  };

  const handleStartOverClick = () => {
    setShowResumePopup(false);
    setVideoProgress(0);
    saveVideoProgress();
    videoRef.current.currentTime = 0;
    videoRef.current.play();
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { currentUser } = useSelector((state) => state.user);
  const [channel, setChannel] = useState({});
  const { currentVideo } = useSelector((state) => state.video);
  const dispatch = useDispatch();
  const path = useLocation().pathname.split("/")[2];

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

        const userProgressRes = await axios.get(`/videos/userProgress/${videoRes.data._id}`);
        const userProgress = userProgressRes.data.progress || 0;

        setVideoLoaded(true);
        setResumeProgress(userProgress);

        if (userProgress > 3) {
          setShowResumePopup(true);
        }

      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };

  }, [path, dispatch, currentVideo?._id]);

  // LIKE VIDEO
  const handleLike = async () => {

    if (!currentUser) {
      setLikePopupVisible(true);
      return;
    }

    await axios.put(`/users/like/${currentVideo?._id}`);
    dispatch(like(currentUser._id));
  };

  // DISLIKE VIDEO
  const handleDislike = async () => {

    if (!currentUser) {
      setDislikePopupVisible(true);
      return;
    }

    await axios.put(`/users/dislike/${currentVideo?._id}`);
    dispatch(dislike(currentUser._id));
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

  // SET VIDEO PROGRESS PER USER
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


  // ADD VIEWS TO VIDEO AND TRACK WATCH PROGRESS
  const [isViewIncreased, setIsViewIncreased] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    const handleTimeUpdate = () => {
      const video = videoRef.current;
      const percentageWatched = (video.currentTime / video.duration) * 100;

      setVideoProgress(percentageWatched);

      if (percentageWatched >= 5) {
        saveVideoProgress();
      }
      else if (percentageWatched > 99) {
        setVideoProgress(0);
        saveVideoProgress();
      }


      if (percentageWatched >= 55 && !isViewIncreased) {
        setIsViewIncreased(true);
        axios.put(`/videos/view/${currentVideo?._id}`)
          .then(() => {
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

  }, [currentVideo?._id, isViewIncreased, videoProgress, videoLoaded]);


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

  return (


    <Container>

      {videoLoaded && (
        <Content>

          {showResumePopup && (
            <ResumePopupContainer>
              <ResumePopupWrapper>
                <ResumePopupText>
                  ¿Deseas continuar desde donde lo dejaste?
                </ResumePopupText>
                <ResumePopupButtons>
                  <ResumePopupButton onClick={handleResumeClick}>Continuar</ResumePopupButton>
                  <ResumePopupButton onClick={handleStartOverClick}>Desde el principio</ResumePopupButton>
                </ResumePopupButtons>
              </ResumePopupWrapper>
            </ResumePopupContainer>
          )}


          <VideoWrapper>
            <VideoFrame
              ref={videoRef}
              src={currentVideo?.videoUrl}
              autoPlay={showResumePopup ? false : true}
              controls={showResumePopup ? false : true}
            />
          </VideoWrapper>

          <Buttons>
            <Button onClick={handleLike}>

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

            </Button>

            <Button onClick={handleDislike}>

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

            </Button>

            <Button>
              <ButtonsImg src={VideoSaveIcono} /> Watch Later
            </Button>

            <Button onClick={handleShare} ref={buttonShareRef}>
              <ButtonsImg src={VideoShareIcono} /> Share
            </Button>

            {isSharePopupVisible && (
              <ShareContainer ref={shareRef}>
                <ShareTxt> Share this video with your friends! </ShareTxt>
                <ShareLinkCopyDiv>
                  <ShareLink> {shareLink} </ShareLink>
                  <ShareCopyLink src={CopyIcono} onClick={handleCopyClick} />
                </ShareLinkCopyDiv>
              </ShareContainer>
            )}

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

          </VideoInfo>

          <RelatedVideos>

            <RelatedSlider videoId={currentVideo?._id} UserUploader={channel?._id} />

          </RelatedVideos>

          <Comments videoId={currentVideo?._id} UserUploader={channel?._id} />

        </Content>
      )}

      {videoLoaded && (
        <RecommendationContainer>

          <TitleHeader> RECOMMENDED </TitleHeader>
          <Recommendation tags={currentVideo?.tags} currentVideoId={currentVideo?._id} />

        </RecommendationContainer>
      )}

      {!videoLoaded && (
        <LoadingContainer>
          <LoadingCircle />
        </LoadingContainer>
      )}


      {isPopUpShareVisible && (
        <SharePopupContainer>
          <SharePopupContent> Share Link copied in clipboard </SharePopupContent>
        </SharePopupContainer>
      )}

    </Container>
  );
};

export default Video;
