import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Link, useNavigate } from 'react-router-dom';
import styled, { css, keyframes } from "styled-components";
import CanalIcono from "../assets/CanalIcono.png";
import ViewsIcon from '../assets/ViewsTedenciaIcono.png';
import DuracionIcono from "../assets/DuracionIcono.png";
import PuntosSuspensivosIcono from "../assets/PuntosSuspensivosIcono.png";
import VideoPlaylistIcono from "../assets/VideoPlaylistIcono.png";
import CloseXGr from "../assets/CloseXGr.png";
import VideoShareIconoOutline from "../assets/VideoShareIconoOutline.png";
import WhatsappIcon from "../assets/WhatsappIcon.png";
import CopyIcono from "../assets/CopyIcono.png";
import DeleteX from "../assets/CloseX.png";
import { useDispatch, useSelector } from 'react-redux';
import { useLanguage } from '../utils/LanguageContext';
import moment from "moment";
import "moment/locale/es";
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

const HistoryMenu = styled.img`
  position: absolute;
  cursor: pointer;
  color: white;
  font-weight: bold;
  transform: rotate(90deg);
  border-radius: 7px;
  padding: 5px;
  width: 17px;
  height: 17px;
  display: ${({ isMenuDotsVisible }) => (isMenuDotsVisible ? 'block' : 'none')};
  right: 0px;
  top: -3px;
`;

const XDelete = styled.img`
  position: absolute;
  cursor: pointer;
  color: white;
  font-weight: bold;
  transform: rotate(90deg);
  border-radius: 7px;
  padding: 7px;
  width: 17px;
  height: 17px;
  display: ${({ isMenuDotsVisible }) => (isMenuDotsVisible ? 'block' : 'none')};
  right: 30px;
  top: -5px;
  border-radius: 50%;

  &:hover {
    background-color: rgba(209, 48, 102, 0.4);
  }
`;


const Container = styled.div`
  position: relative;
  display: flex;
  margin-bottom: 10px;
  border-radius: 5px;
  background: transparent;
  padding: 0px;
  width: 100%;

  &:hover {
    & ${HistoryMenu} {
      display: block;
    }
    & ${XDelete} {
      display: block;
    }
  }
`;

const ImageContainer = styled.div`
  position: relative;
  width: 280px;
  height: 170px;
  border-radius: 3px;
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

const Texts = styled.div`
  margin-top: 0px;
`;

const Title = styled.h1`
  font-size: 18px;
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
  width: 450px;

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
  margin-left: -2px;
`;

const InfoWrapper = styled.div`
  display: flex;  
  gap: 10px;
`;

const ImgViews = styled.img`
  height: 15px;
  width: 15px;
  margin-right: 8px;
`;

const InfoViews = styled.div`
  font-size: 15px;
  width: max-content;
  height: max-content;
  margin: auto 4px;
  color: white;
  background-color: rgba(196, 90, 172, 0.2);
  font-family: "Roboto Condensed", Helvetica;
  font-weight: 400;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center; 
  padding: 2px 10px;
`;

const VideoDesc = styled.h2`
  max-width: 525px; 
  margin-top: 5px;
  font-size: 14px;
  color: ${({ theme }) => theme.textSoft};
  font-family: "Roboto Condensed", Helvetica;
  font-weight: 400;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 4;
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
  bottom: ${({ progress, currentUser }) => (currentUser && progress > 0 ? '7px' : '0px')};
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

const HistoryMenuOptions = styled.div`
  position: absolute;
  top: 27px;
  right: -80px;
  width: max-content;
  height: max-content;
  background: rgba(36, 36, 36);
  cursor: pointer;
  border-radius: 10px;
  z-index: 2;
  padding: 5px 0px;
`;

const CommentOptionImg = styled.img`
  width: 22px;
  height: 22px;
  margin-right: 15px;
`;


const CommentOption = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  text-align: center;
  padding: 10px 15px;
  background: rgba(36, 36, 36);
  cursor: pointer;
  border:none;
  border-radius: 8px;
  color: ${({ theme }) => theme.text};
  &:hover {
    background: rgba(45, 45, 45);
  }
  font-size: 16px;
  font-family: "Roboto", Helvetica;
`;


const DeleteFromHistoryPopupContainer = styled.div`
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

const DeleteFromHistoryPopupWrapper = styled.div`
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

const DeleteFromHistoryPopupTitle = styled.h1`
  font-weight: bold;
  font-size: 24px;
  font-family: "Roboto Condensed", Helvetica;
`;

const DeleteFromHistoryPopupTxt = styled.h1`
  font-family: "Roboto Condensed", Helvetica;
  font-weight: normal;
  font-size: 17px;
  margin-bottom: 15px;
  color: ${({ theme }) => theme.textSoft};
  max-width: 350px;
`;

const OptionsDeleteCancel = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  width: 100%;
`;

const DeleteFromHistoryCancel = styled.div`
  margin-right: 10px;
  cursor: pointer;
  &:hover {
    background: rgba(45, 45, 45);
  }
  padding: 8px 10px;
  border-radius: 15px;
  font-family: "Roboto Condensed", Helvetica;
  font-size: 17px;
`;

const DeleteFromHistoryDelete = styled.div`
  cursor: pointer;
  &:hover {
    background: rgba(45, 45, 45);
  }
  padding: 8px 10px;
  border-radius: 15px;
  font-family: "Roboto Condensed", Helvetica;
  font-size: 17px;
`;

// SHARE
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

const CardHistory = ({ video, setIsHistoryUpdated }) => {
  // CONST DEFINITION
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const [channel, setChannel] = useState({});
  const [progress, setProgress] = useState(0);
  const { language, setLanguage } = useLanguage();
  const [isMenuDotsVisible, setIsMenuDotsVisible] = useState(false);
  const [XDeleteVisible, setXDeleteVisible] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const [isDeleteFromHistoryPopupOpen, setIsDeleteFromHistoryPopupOpen] = useState(false);
  const [shareLink, setShareLink] = useState('');
  const [isSharePopupVisible, setSharePopupVisible] = useState(false);
  const shareRef = useRef(null);
  const shareRefBg = useRef(null);
  const buttonShareRef = useRef(null);
  const currentURL = 'http://localhost:3000' + '/video/' + video._id;
  const [isPopUpShareVisible, setIsPopUpShareVisible] = useState(false);

  // Reset Scroll
  const scrollToTop = () => {
    window.scrollTo(0, 0);
  };

  // TRANSLATIONS
  const translations = {
    en: {
    },
    es: {
    },
  };

  // FORMATS
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

  // FETCH INFO FOR CARDS
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
    scrollToTop();

    if (currentUser) {
      fetchProgress();
    }

  }, [video.userId, video._id]);

  const handleRedirect = (videoId) => {
    navigate(`/video/${videoId}`);
    navigate('/video', { replace: true });
  };

  // HANDLE MENU
  const handleHistoryMenuClick = () => {
    setIsMenuDotsVisible(!isMenuDotsVisible);
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = (event) => {
    if (
      menuRef.current &&
      !menuRef.current.contains(event.target) &&
      !event.target.classList.contains("HistoryMenu")
    ) {
      setIsMenuOpen(false);
      setIsMenuDotsVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", closeMenu);

    return () => {
      document.removeEventListener("click", closeMenu);
    };
  }, []);

  // DELETE SPECIFIC VIDEO
  const handleDeleteFromHistory = async () => {
    setIsDeleteFromHistoryPopupOpen(true);
  };

  const handleDeleteConfirmation = async (confirmed) => {
    setIsDeleteFromHistoryPopupOpen(false);

    if (confirmed) {
      try {
        await axios.delete(`/users/${currentUser?._id}/videos/${video?._id}/history`);
        setIsHistoryUpdated(true);
      } catch (error) {
        console.error('Error deleting video:', error);
      }
    }
  };

  useEffect(() => {
    if (isDeleteFromHistoryPopupOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isDeleteFromHistoryPopupOpen]);

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
    if (popupSaveVideo) {
      document.body.style.overflow = 'hidden';
    }
    else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [popupSaveVideo]);

  return (
    <div>
      <Container isMenuDotsVisible={isMenuDotsVisible} XDeleteVisible={XDeleteVisible}>
        <XDelete
          src={DeleteX}
          onClick={handleDeleteFromHistory}
          isMenuDotsVisible={isMenuDotsVisible}
        />
        <HistoryMenu
          src={PuntosSuspensivosIcono}
          onClick={handleHistoryMenuClick}
          isMenuDotsVisible={isMenuDotsVisible}
          ref={menuRef}
        />
        {isMenuOpen && (
          <HistoryMenuOptions className="HistoryMenuOptions">
            <CommentOption onClick={handleSaveVideo}>
              <CommentOptionImg src={VideoPlaylistIcono} />
              Save
            </CommentOption>
            <CommentOption onClick={handleShare} >
              <CommentOptionImg src={VideoShareIconoOutline} />
              Share
            </CommentOption>
          </HistoryMenuOptions>
        )}

        <Link to={`/video/${video._id}`} onClick={() => handleRedirect(video._id)} style={{ textDecoration: "none" }}>
          <ImageContainer>
            <Image
              src={video.imgUrl}
            />
            <InfoDuration progress={progress} currentUser={currentUser}>
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

      {
        isDeleteFromHistoryPopupOpen && (
          <DeleteFromHistoryPopupContainer
            onDeleteConfirmed={() => handleDeleteConfirmation(true)}
            onCancel={() => handleDeleteConfirmation(false)}
          >
            <DeleteFromHistoryPopupWrapper>
              <DeleteFromHistoryPopupTitle> Delete Video From History </DeleteFromHistoryPopupTitle>
              <DeleteFromHistoryPopupTxt> This video will be permanently removed from your watch history as well as your current watch progress. </DeleteFromHistoryPopupTxt>
              <OptionsDeleteCancel>
                <DeleteFromHistoryCancel onClick={() => handleDeleteConfirmation(false)}>
                  Cancel
                </DeleteFromHistoryCancel>
                <DeleteFromHistoryDelete onClick={() => handleDeleteConfirmation(true)}>
                  Delete
                </DeleteFromHistoryDelete>
              </OptionsDeleteCancel>
            </DeleteFromHistoryPopupWrapper>

          </DeleteFromHistoryPopupContainer>
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
        popupSaveVideo && (
          <PlaylistSelectBoxVideo
            closePopup={handleSaveVideo}
            userId={currentUser?._id}
            videoId={video?._id}
          />
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
};

export default CardHistory;
