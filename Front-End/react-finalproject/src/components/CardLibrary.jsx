import React, { useState, useEffect, useRef, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled, { css, keyframes } from "styled-components";
import PuntosSuspensivosIcono from "../assets/PuntosSuspensivosIcono.png";
import VideoPlaylistIcono from "../assets/VideoPlaylistIcono.png";
import VideoShareIconoOutline from "../assets/VideoShareIconoOutline.png";
import CloseXGr from "../assets/CloseXGr.png";
import WhatsappIcon from "../assets/WhatsappIcon.png";
import CopyIcono from "../assets/CopyIcono.png";
import RemoveTrashcan from "../assets/RemoveTrashcan.png";
import axios from "axios";
import { useLanguage } from '../utils/LanguageContext';
import { useDispatch, useSelector } from 'react-redux';
import moment from "moment";
import "moment/locale/es";
import PlaylistSelectBoxVideo from "../components/PlaylistSelectBoxVideo";
import { toast } from 'react-toastify';

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


const VideoPlaylistMenuDots = styled.img`
  position: absolute;
  cursor: pointer;
  color: white;
  font-weight: bold;
  transform: rotate(90deg);
  border-radius: 7px;
  padding: 10px;
  border-radius: 50%;
  width: 17px;
  height: 17px;
  display: ${({ isMenuDotsVisible }) => (isMenuDotsVisible ? 'block' : 'none')};
  right: 10px;
  top: 38px;
  z-index: 1;
`;

const MainContainer = styled.div`
  position: relative;
  display: flex;
  width: max-content;
  height: max-content;
  cursor: pointer;
  margin-bottom: 10px;
  border-radius: 8px;
  padding: 10px;
  background: ${({ isMenuDotsVisible }) => (isMenuDotsVisible ? 'rgba(66, 66, 66, 0.3)' : 'transparent')};
  transition: background 0.3s ease;
  &:hover {
    background: rgba(66, 66, 66, 0.3);
    & ${VideoPlaylistMenuDots} {
      display: block;
    }
  }
`;

const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  width: 1100px;
  height: max-content;
  cursor: pointer;
  gap: 10px;
  border-radius: 8px;
  transition: background 0.3s ease;
`;

const VideoIndex = styled.h1`
  display: flex;
  font-size: 18px; 
  font-weight: normal;
  font-family: "Roboto Condensed", Helvetica;
  color: ${({ theme }) => theme.textSoft};
  margin-right: 15px;
  align-items: center;
  text-align: center;
  margin-top: -5px;
`;


const ImageContainer = styled.div`
  position: relative;
  width: 170px;
  height: 100px;
  border-radius: 4px;
  overflow: hidden;
`;

const Image = styled.img`
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: #999;
  object-fit: cover; 
`;


const Details = styled.div`
  display: flex;
  margin-top: 0px;
  gap: 15px;
  flex: 1;
  margin-left: 5px;
  width: max-content;
`;

const Texts = styled.div``;

const Title = styled.h1`
  font-size: 16px;
  font-family: "Roboto Condensed", Helvetica;
  font-weight: normal;
  color: ${({ theme }) => theme.text};
  width: 650px;
  max-width: 650px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2; /* Establece el número máximo de líneas */
  -webkit-box-orient: vertical;
  white-space: normal;
  word-wrap: break-word;
  overflow-wrap: break-word;
`;

const VideoInfDiv = styled.div`
  width: max-content;
  display: flex;
  margin-top: 10px;
  gap: 11px;
`;

const VideoInfTxt = styled.h2`
  font-size: 14px;
  font-family: "Roboto Condensed", Helvetica;
  color: ${({ theme }) => theme.textSoft};
  font-weight: normal;
  font-weight: 400;
`;

const MenuOptions = styled.div`
  position: absolute;
    display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  top: 73px;
  right: 10px;
  width: max-content;
  height: max-content;
  background: rgba(36, 36, 36);
  cursor: pointer;
  border-radius: 10px;
  z-index: 2;
  padding: 5px 0px;
`;

const MenuOptionImg = styled.img`
  width: 22px;
  height: 23px;
  margin-right: 15px;
`;

const MenuOption = styled.button`
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
  font-size: 17px;
  font-family: "Roboto Condensed", Helvetica;
  line-height: 1.25;
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


const CardLibrary = ({ video, index, setWasPlaylistVideosUpdated, selectedPlaylist, handleUpdate }) => {
  const { language, setLanguage } = useLanguage();
  const { currentUser } = useSelector((state) => state.user);

  // FETCH CHANNEL INFO
  const [channel, setChannel] = useState({})
  const [noVideosMessage, setNoVideosMessage] = useState('');

  useEffect(() => {
    const fetchChannel = async () => {
      try {
        if (!video || !video.userId) {
          setNoVideosMessage('No hay videos recomendados');
          return;
        }
        const res = await axios.get(`http://localhost:8800/api/users/find/${video.userId}`);
        setChannel(res.data);
      } catch (error) {
        console.error("Error fetching videos:", error);
      }
    };
    fetchChannel()
  }, [video.userId]);

  if (noVideosMessage) {
    return <div>{noVideosMessage}</div>;
  };

  // HANDLE MENU OPTIONS
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMenuDotsVisible, setIsMenuDotsVisible] = useState(false);
  const menuRef = useRef(null);

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

  // SHARE
  const [shareLink, setShareLink] = useState('');
  const [isSharePopupVisible, setSharePopupVisible] = useState(false);
  const shareRef = useRef(null);
  const shareRefBg = useRef(null);
  const buttonShareRef = useRef(null);
  const currentURL = 'http://localhost:3000' + '/video/' + video._id;
  const [isPopUpShareVisible, setIsPopUpShareVisible] = useState(false);

  const handleShare = () => {
    setShareLink(currentURL);
    setSharePopupVisible(!isSharePopupVisible);
  };

  const handleCopyClick = () => {
    navigator.clipboard.writeText(shareLink);
    toast.success(translations[language].toastshare);
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

  const handleSaveVideo = () => {
    setPopupSaveVideo(!popupSaveVideo);
  };

  const handleSaveVideoAndUpdate = () => {
    setPopupSaveVideo(!popupSaveVideo);
    setWasPlaylistVideosUpdated(true);
    handleUpdate();
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

  // REMOVE VIDEO

  const handleRemoveVideo = async () => {

    try {
      await axios.delete(`http://localhost:8800/api/users/playlists/${selectedPlaylist?._id}/videos/${video?._id}/delete`);
      setWasPlaylistVideosUpdated(true);
      handleUpdate();
    } catch (error) {
      console.error("Error fetching playlists:", error);
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
  };

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

  // TRANSLATIONS
  const translations = {
    en: {
      views: "Views",
      share: "Share",
      save: "Save to playlist",
      remove: "Remove from",
      toastshare: "Share Link copied in clipboard",
    },
    es: {
      views: "Visitas",
      share: "Compartir",
      save: "Guardar en playlist",
      remove: "Eliminar de",
      toastshare: "Enlace copiado en el portapapeles",
    },
  };

  return (
    <MainContainer isMenuDotsVisible={isMenuDotsVisible}>
      <Link to={`/video/${video._id}`} style={{ textDecoration: "none" }}>
        <Container>
          <VideoIndex> {index} </VideoIndex>
          <ImageContainer>
            <Image
              src={video?.imgUrl}
            />
          </ImageContainer>
          <Details>
            <Texts>
              <Title> {video?.title} </Title>
              <VideoInfDiv>
                <VideoInfTxt> {channel?.displayname} </VideoInfTxt>
                <VideoInfTxt> •  {`\u00A0`} {formatViews(video?.views)} {translations[language].views} </VideoInfTxt>
                <VideoInfTxt> • {`\u00A0`} {timeago(video?.createdAt)} </VideoInfTxt>
              </VideoInfDiv>
            </Texts>
          </Details>


        </Container>
      </Link >

      <VideoPlaylistMenuDots
        src={PuntosSuspensivosIcono}
        onClick={handleHistoryMenuClick}
        isMenuDotsVisible={isMenuDotsVisible}
        ref={menuRef}
      />

      {isMenuOpen && (
        <MenuOptions className="HistoryMenuOptions">
          <MenuOption onClick={handleShare}>
            <MenuOptionImg src={VideoShareIconoOutline} />
            {translations[language].share}
          </MenuOption>
          <MenuOption onClick={handleSaveVideo}>
            <MenuOptionImg src={VideoPlaylistIcono} />
            {translations[language].save}
          </MenuOption>
          <MenuOption onClick={handleRemoveVideo}>
            <MenuOptionImg src={RemoveTrashcan} />
            {translations[language].remove} {selectedPlaylist?.name}
          </MenuOption>
        </MenuOptions>
      )}

      {
        isSharePopupVisible && (
          <SharePopupContainerBg ref={shareRefBg}>
            <ShareContainer ref={shareRef}>
              <ShareLabel> {translations[language].share} </ShareLabel>
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
            closePopup={handleSaveVideoAndUpdate}
            userId={currentUser?._id}
            videoId={video?._id}
          />
        )
      }


    </MainContainer>
  );
};

export default CardLibrary;
