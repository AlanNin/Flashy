import React, { useState, useEffect, useRef, useContext } from "react";
import styled, { css, keyframes } from "styled-components";
import { useDispatch, useSelector } from 'react-redux';
import { useLanguage } from '../utils/LanguageContext';
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import PublicIcon from "../assets/PublicIcon.png";
import PrivateIcon from "../assets/PrivateIcon.png";
import UnlistedIcon from "../assets/UnlistedIcon.png";
import PlaylistShareIcono from "../assets/SharePlaylist.png";
import FollowIcon from "../assets/FollowIcon.png";
import FollowingIcon from "../assets/FollowingIcon.png";
import CopyIcono from "../assets/CopyIcono.png";
import WhatsappIcon from "../assets/WhatsappIcon.png";
import CloseXGr from "../assets/CloseXGr.png";
import CardLibraryShared from "../components/CardLibraryShared";
import NotFound404Component from "../components/NotFound404Component";
import moment from "moment";
import "moment/locale/es";
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


// MAIN
const MainContainer = styled.div`
  position: relative;
  width: 100%;
  top: 0;
  margin: auto;
  min-height: 100vh;
  background-color: rgba(15, 12, 18);
  max-width: 1920px;
  z-index: ${({ playlistExists }) => (playlistExists ? '' : '5')}; 
`;

// PLAYLIST INFO
const PlaylistInfoContainer = styled.div`
  position: fixed;
  display: flex;
  margin-top: 86px;
  flex-direction: column;
  height: calc(100% - 86px);
  width: 375px;
  margin-left: 175px;
  border-radius: 15px 15px 0px 0px;
  background: rgba(0, 0, 0, 0.6);
`;

const PlaylistInfoBackground = styled.img`
  width: 100%;
  height: 100%;
  filter: blur(10px) brightness(0.3);
  object-fit: cover;
  position: absolute;
  border: none;
`;

const PlaylistInfoWrapper = styled.div`
  padding: 30px 30px 30px 30px;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const PlaylistInfoImgContainer = styled.div`
  width: 100%;
  height: 210px;
  border-radius: 10px;
`;

const PlaylistInfoImg = styled.img`
  width: 100%;
  height: 210px;
  object-fit: cover;
  border-radius: 10px;
`;

const PlaylistInfoShadowDiv = styled.div`
  width: 100%;
  height: max-content;
  padding: 0px 0px 20px 0px;
  position: relative;
  border-radius: 10px; 
  background: transparent;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const PlaylistInfoNameDiv = styled.div`
  margin-top: 10px;
  margin-bottom: 9px;
  position: relative;
  display: flex;
  align-items: center;
`;

const PlaylistInfoName = styled.h1`
  font-size: ${({ name }) => (name?.length > 20 ? '22px' : '30px')}; 
  font-weight: bold;
  font-family: "Roboto Condensed", Helvetica;
  color: ${({ theme }) => theme.text};
  padding: 0px 10px 0px 10px;
  max-width: ${({ editable }) => (editable ? '78%' : '')}; 
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  white-space: normal;
  word-wrap: break-word;
  overflow-wrap: break-word;
  line-height: 1.25;
`;

const PlaylistInfoCreator = styled.h1`
  font-size: 16px; 
  font-weight: normal;
  font-family: "Roboto Condensed", Helvetica;
  color: ${({ theme }) => theme.text};
  padding: 0px 10px;
  margin-bottom: 10px;
`;

const PlaylistInfoPrivacyDiv = styled.div`
  font-size: 18px; 
  font-weight: normal;
  font-family: "Roboto Condensed", Helvetica;
  color: ${({ theme }) => theme.text};
  padding: 0px 10px;
  width: max-content;
  height: max-content;
  display: flex;
  gap: 5px;
  align-items: center;
  text-align: center;
  margin-bottom: 10px;
`;

const PlaylistInfoPrivacyImg = styled.img`
  width: 18px;
  height: 18px;
  margin-top: -1px;
`;


const PlaylistInfoLengthAndFollowers = styled.h1`
  font-size: 15px; 
  font-weight: normal;
  font-family: "Roboto Condensed", Helvetica;
  color: ${({ theme }) => theme.text};
  padding: 0px 10px;
  margin-bottom: 10px;
`;

const PlaylistInfoLastUpdated = styled.h1`
  font-size: 16px; 
  font-weight: normal;
  font-family: "Roboto Condensed", Helvetica;
  color: ${({ theme }) => theme.text};
  padding: 0px 10px;
  margin-bottom: 10px;
`;

const PlaylistInfoActionButtonsDiv = styled.div`
  position: relative;
  display: flex;
  width: calc(100% - 20px);
  height: max-content;
  padding: 0px 10px;
  margin-bottom: 20px;
  gap: 12px;
`;

const PlaylistInfoActionButtonsImg = styled.img`
  position: relative;
  display: flex;
  height: 25px;
  width: 25px;
  background: rgba(225, 227, 225, 0.1);
  border-radius: 50%;
  padding: 7px;
  cursor: pointer;
  transition: background 0.3s ease; 
  &:hover {
    background: rgba(225, 227, 225, 0.2);
  }
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


const UnfollowPlaylistPopupContainer = styled.div`
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

const UnfollowPlaylistPopupWrapper = styled.div`
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
    overflow: hidden;
`;

const UnfollowPlaylistPopupTitle = styled.h1`
    font-weight: bold;
    font-size: 24px;
    font-family: "Roboto Condensed", Helvetica;
`;

const UnfollowPlaylistPopupTxt = styled.h1`
    font-family: "Roboto Condensed", Helvetica;
    font-weight: normal;
    font-size: 17px;
    margin-bottom: 15px;
    color: ${({ theme }) => theme.textSoft};
    max-width: 400px;
`;

const UnfollowPlaylistPopupPlaylistName = styled.span`
    font-family: "Roboto Condensed", Helvetica;
    font-weight: bold;
    font-size: 17px;
    color: ${({ theme }) => theme.textSoft};
`;

const OptionsUnfollowCancel = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  width: 100%;
`;

const UnfollowPlaylistCancel = styled.div`
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

const UnfollowPlaylistUnfollow = styled.div`
    cursor: pointer;
    &:hover {
    background: rgba(45, 45, 45);
    }
    padding: 8px 10px;
    border-radius: 15px;
    font-family: "Roboto Condensed", Helvetica;
    font-size: 17px;
`;

const PlaylistInfoDescriptionDiv = styled.div`
  position: relative;
  display: flex;
  width: 100%;
  height: max-content;
`;

const PlaylistInfoDescription = styled.div`
  font-size: 16px; 
  font-weight: normal;
  font-family: "Roboto Condensed", Helvetica;
  color: #bababa;
  padding: 0px 10px;
  max-width: ${({ editable }) => (editable ? '78%' : '')}; 
  white-space: pre-line; 
  z-index: 1;
  line-height: 1.25;
  overflow: hidden;
`;

// PLAYLIST VIDEOS
const VideosContainer = styled.div`
  position: fixed;
  display: flex;
  flex-direction: column;
  width: calc(100% - 620px);
  margin-left: 560px;
  height: 100%;
  background: transparent;
  padding: 0px 30px;
  overflow: hidden;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 7px;
  }
      
  &::-webkit-scrollbar-thumb {
      border-radius: 15px;
  }
`;

const VideosContainerHideTop = styled.div`
  position: absolute;
  display: flex;
  width: calc(100% - 691px);
  min-height: 56px;
  background: rgba(15, 12, 18);
  z-index: 2;
  right: 7px;
`;

const VideosContainerCards = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-top: 110px;
  height: calc(100% - 110px);
  background: transparent;
`;

const VideosContainerNoVideoText = styled.h1`
  font-size: 24px; 
  font-weight: normal;
  font-family: "Roboto Condensed", Helvetica;
  color: ${({ theme }) => theme.text};
  padding: 126px 360px;
`;

// PRIVATE POP UP
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

const SharedPlaylist = () => {
  // CURRENT USER INFO
  const { currentUser } = useSelector((state) => state.user);

  // TRANSLATION
  const { language, setLanguage } = useLanguage();

  const translations = {
    en: {
      notlogged: "Seems like you currently are not logged in as a user :(",
      notlogged2: "Log in to enjoy your personalized playlists and save the videos that you love!",
      signin: "Sign in",

      yourplaylists: "Your Playlists",
      newpl: "New Playlist",

      public: "Public",
      publictxt: "Every user is allowed to search and view your playlist",

      private: "Private",
      privatetxt: "Only you are allowed to view your playlist",

      unlisted: "Unlisted",
      unlistedtxt: "Every user is allowed to view your playlist with the share link",

      videos: "videos",
      followers: "followers",
      updated: "Updated",

      adddesc: "Add a description to your playlist",
      nodesc: "No description",

      novideos: "Seems like there is no videos in this playlist yet",

      deletepl: "Delete Playlist",
      deleteplsure: "Are you sure you want to delete ",
      deleteplnote: "Note: This action is permanent and cannot be undone.",

      unfollowpl: "Unfollow Playlist",
      unfollowplsure: "Are you sure you want to unfollow",

      privatepl: "Private Playlist",
      privatepltxt: "Oops! It looks like this playlist is set to private. You don't have permission to view it. Please contact the owner for any aditional info.",

      sharepl: "Share Playlist",
      gohome: "Go Home",
      cancel: "Cancel",
      save: "Save",
      delete: "Delete",
      unfollow: "Unfollow",

      toastshare: "Share Link copied in clipboard",
    },
    es: {
      notlogged: "Parece que aún no has iniciado sesión como usuario :(",
      notlogged2: "Inicia sesión para disfrutar de tus listas de reproducción personalizadas!",
      signin: "Iniciar Sesión",

      yourplaylists: "Listas de Reproducción",
      newpl: "Nueva Playlist",

      public: "Público",
      publictxt: "Cada usuario puede buscar y ver su lista de reproducción",

      private: "Privado",
      privatetxt: "Sólo tú puedes ver tu lista de reproducción",

      unlisted: "Sin listar",
      unlistedtxt: "Todos los usuarios con el enlace pueden ver tu lista",

      videos: "videos",
      followers: "seguidores",
      updated: "Actualizada",

      adddesc: "Añade una descripción a tu lista",
      nodesc: "Sin descripción",

      novideos: "Parece que no tienes ningún video en esta lista de reproducción",

      deletepl: "Eliminar Lista de Reproduccion",
      deleteplsure: "¿Estás seguro de eliminar ",
      deleteplnote: "Nota: esta acción es permanente y no se puede deshacer.",

      unfollowpl: "Dejar de Seguir Lista de Reproducción",
      unfollowplsure: "¿Estás seguro de dejar de seguir",

      privatepl: "Playlist Privada",
      privatepltxt: "¡Ups! Parece que esta lista de reproducción está configurada como privada. No tienes permiso para verlo. Comuníquese con el propietario para obtener información adicional.",

      sharepl: "Compatir Lista de Reproducción",
      gohome: "Ir al Inicio",
      cancel: "Cancelar",
      save: "Guardar",
      delete: "Eliminar",
      unfollow: "Dejar de Seguir",

      toastshare: "Enlace copiado en el portapapeles",
    },
  };

  // UPDATE FETCHED DATA
  const [wasFetchedDataUpdated, setWasFetchedDataUpdated] = useState(false);
  const handleUpdateFetchedData = () => {
    setWasFetchedDataUpdated(true);
  };

  // FETCH PLAYLISTS
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const path = useLocation().pathname.split("/")[2];
  const [playlistExists, setPlaylistExists] = useState(true);

  useEffect(() => {
    setWasFetchedDataUpdated(false);
    const Request = async () => {
      try {
        const response = await axios.get(`/users/playlists/${path}`);
        const fetchedPlaylists = response.data;
        setPlaylistExists(true);
        setSelectedPlaylist(fetchedPlaylists);
      } catch (error) {
        setPlaylistExists(false);
      }
    };

    Request();
  }, [wasFetchedDataUpdated]);

  // SHARE PLAYLIST
  const [shareLink, setShareLink] = useState('');
  const [isSharePopupVisible, setSharePopupVisible] = useState(false);
  const shareRef = useRef(null);
  const buttonShareRef = useRef(null);
  const currentURL = 'http://localhost:3000' + '/playlist/' + selectedPlaylist?._id;
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

  // FOLLOW PLAYLIST
  const handleFollow = async () => {
    try {
      await axios.post(`/users/playlists/follow/${selectedPlaylist?._id}/`);
      handleUpdateFetchedData();
    } catch (error) {
      console.error("Error updating playlist:", error);
    }
  };

  // UNFOLLOW PLAYLIST
  const [isUnfollowPlaylistPopupOpen, setIsUnfollowPlaylisPopupOpen] = useState(false);

  const handleUnfollowPlaylist = async () => {
    setIsUnfollowPlaylisPopupOpen(true);
  };

  const handleUnfollowConfirmation = async (confirmed) => {
    setIsUnfollowPlaylisPopupOpen(false);

    if (confirmed) {
      try {
        await axios.delete(`/users/playlists/unfollow/${selectedPlaylist?._id}/`);
        handleUpdateFetchedData();
      } catch (error) {
        console.error('Error deleting history:', error);
      }
    }
  };

  useEffect(() => {
    if (isUnfollowPlaylistPopupOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isUnfollowPlaylistPopupOpen]);

  // FETCH PLAYLIST VIDEOS
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    if (selectedPlaylist) {
      const fetchVideos = async () => {
        try {
          const res = await axios.get(`/users/${selectedPlaylist?.creatorId}/playlists/${selectedPlaylist?._id}/videos`);
          setVideos(res.data);
        } catch (error) {
          // ignore error
        }
      };
      fetchVideos();
    }
  }, [selectedPlaylist]);

  // FORMATS PLAYLIST
  const timeago = timestamp => {
    const relativeTime = moment(timestamp).fromNow();
    return relativeTime.charAt(0).toLowerCase() + relativeTime.slice(1).toLowerCase();
  };

  return (
    <MainContainer playlistExists={playlistExists}>

      {playlistExists ? (
        <>
          {selectedPlaylist?.privacy === 'private' && selectedPlaylist?.creatorId !== currentUser._id ? (
            <>
              <NotAllowedContainerBg>
                <NotAllowedContainer>
                  <WrapperNotAllowed>
                    <TitleNotAllowed> {translations[language].privatepl} </TitleNotAllowed>
                    <SubLabelNotAllowed>
                      {translations[language].privatepltxt}
                    </SubLabelNotAllowed>
                  </WrapperNotAllowed>
                  <Link to={"../../"} style={{ textDecoration: "none", marginLeft: "auto" }}>
                    <GoHomeNotAllowed >{translations[language].gohome}</GoHomeNotAllowed>
                  </Link>

                </NotAllowedContainer>
              </NotAllowedContainerBg>
            </>
          ) : (
            <>
              <PlaylistInfoContainer>
                {selectedPlaylist?.image && (
                  <PlaylistInfoBackground src={selectedPlaylist?.image} />
                )}
                <PlaylistInfoWrapper>
                  <PlaylistInfoImgContainer>
                    <PlaylistInfoImg src={selectedPlaylist?.image} />
                  </PlaylistInfoImgContainer>

                  <PlaylistInfoShadowDiv>

                    <PlaylistInfoNameDiv>
                      <PlaylistInfoName name={selectedPlaylist?.name} editable={selectedPlaylist?.creatorId === currentUser?._id}> {selectedPlaylist?.name} </PlaylistInfoName>
                    </PlaylistInfoNameDiv>

                    <PlaylistInfoCreator> {selectedPlaylist?.creator} </PlaylistInfoCreator>

                    <PlaylistInfoPrivacyDiv>
                      <PlaylistInfoPrivacyImg
                        src={
                          selectedPlaylist?.privacy === 'public'
                            ? PublicIcon
                            : selectedPlaylist?.privacy === 'private'
                              ? PrivateIcon
                              : UnlistedIcon
                        }
                      />
                      {selectedPlaylist?.privacy === 'public' ? translations[language].public : selectedPlaylist?.privacy === 'private' ? translations[language].private : translations[language].unlisted}
                    </PlaylistInfoPrivacyDiv>

                    <PlaylistInfoLengthAndFollowers> {selectedPlaylist?.videosLength} {translations[language].videos} {`\u00A0`}·{`\u00A0`} {selectedPlaylist?.followers?.length ? selectedPlaylist?.followers?.length : 0} {translations[language].followers} </PlaylistInfoLengthAndFollowers>

                    <PlaylistInfoLastUpdated> {translations[language].updated} {timeago(selectedPlaylist?.lastUpdated)}</PlaylistInfoLastUpdated>

                    {selectedPlaylist?.privacy !== 'private' && (
                      <PlaylistInfoActionButtonsDiv>
                        <PlaylistInfoActionButtonsImg src={PlaylistShareIcono} onClick={handleShare} />

                        {currentUser && selectedPlaylist?.creatorId !== currentUser?._id && (
                          <>
                            {selectedPlaylist?.followers?.includes(currentUser?._id) ? (
                              <PlaylistInfoActionButtonsImg src={FollowingIcon} onClick={handleUnfollowPlaylist} />
                            ) : (
                              <PlaylistInfoActionButtonsImg src={FollowIcon} onClick={handleFollow} />
                            )}
                          </>
                        )}

                      </PlaylistInfoActionButtonsDiv>
                    )}


                    <PlaylistInfoDescriptionDiv>
                      <PlaylistInfoDescription editable={selectedPlaylist?.creatorId === currentUser?._id}>
                        {selectedPlaylist?.description ? (
                          selectedPlaylist?.description
                        ) : (
                          <>
                            {translations[language].nodesc}
                          </>
                        )}
                      </PlaylistInfoDescription>
                    </PlaylistInfoDescriptionDiv>

                  </PlaylistInfoShadowDiv>

                </PlaylistInfoWrapper>
              </PlaylistInfoContainer>

              <VideosContainerHideTop />

              <VideosContainer>

                {videos.videos?.length === 0 ? (
                  <VideosContainerNoVideoText>{translations[language].novideos}</VideosContainerNoVideoText>
                ) : (
                  <>
                    <VideosContainerCards>
                      {videos.videos?.map((video, index) => (
                        <div key={video?._id}>
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                            <CardLibraryShared video={video} index={index + 1} />
                          </div>
                        </div>
                      ))}
                    </VideosContainerCards>

                  </>
                )}
              </VideosContainer>
            </>
          )}
        </>
      ) : (
        <>
          <NotFound404Component />
        </>
      )}

      {
        isUnfollowPlaylistPopupOpen && (
          <UnfollowPlaylistPopupContainer
            onDeleteConfirmed={() => handleUnfollowConfirmation(true)}
            onCancel={() => handleUnfollowConfirmation(false)}
          >
            <UnfollowPlaylistPopupWrapper>
              <UnfollowPlaylistPopupTitle> {translations[language].unfollowpl} </UnfollowPlaylistPopupTitle>
              <UnfollowPlaylistPopupTxt> {translations[language].unfollowplsure} <UnfollowPlaylistPopupPlaylistName>{selectedPlaylist?.name}</UnfollowPlaylistPopupPlaylistName>? </UnfollowPlaylistPopupTxt>
              <OptionsUnfollowCancel>
                <UnfollowPlaylistCancel onClick={() => handleUnfollowConfirmation(false)}>
                  {translations[language].cancel}
                </UnfollowPlaylistCancel>
                <UnfollowPlaylistUnfollow onClick={() => handleUnfollowConfirmation(true)}>
                  {translations[language].unfollow}
                </UnfollowPlaylistUnfollow>
              </OptionsUnfollowCancel>
            </UnfollowPlaylistPopupWrapper>
          </UnfollowPlaylistPopupContainer>
        )
      }

      {
        isSharePopupVisible && (
          <SharePopupContainerBg>
            <ShareContainer ref={shareRef}>
              <ShareLabel> {translations[language].sharepl} </ShareLabel>
              <CloseShare onClick={handleShare} src={CloseXGr} />

              <ShareExternalButtons>
                <FacebookShareButton
                  url={shareLink}
                  quote={'Hey There, Watch This Awesome Playlist Now!'}
                  hashtag="#Flashy"
                  style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                  <FacebookIcon size={48} round />
                  <ShareExternalButtonsTxt>
                    Facebook
                  </ShareExternalButtonsTxt>
                </FacebookShareButton>

                <WhatsappShareButton url={shareLink} title={'Watch This Awesome Playlist at Flashy'}
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
                  title={'Watch This Awesome Playlist at Flashy'}
                  hashtags={['Flashy', 'Video', 'Playlist']}
                  style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}
                >
                  <XIcon size={48} round />
                  <ShareExternalButtonsTxt style={{ marginTop: '2px' }}>
                    X
                  </ShareExternalButtonsTxt>
                </TwitterShareButton>

                <TelegramShareButton
                  url={shareLink}
                  title={'Watch This Awesome Playlist at Flashy'}
                >
                  <TelegramIcon size={48} round />
                  <ShareExternalButtonsTxt style={{ marginTop: '-4px' }}>
                    Telegram
                  </ShareExternalButtonsTxt>
                </TelegramShareButton>

                <RedditShareButton
                  url={shareLink}
                  title={'Watch This Awesome Playlist at Flashy'}
                >
                  <RedditIcon size={48} round />
                  <ShareExternalButtonsTxt style={{ marginTop: '-4px' }}>
                    Reddit
                  </ShareExternalButtonsTxt>
                </RedditShareButton>

                <EmailShareButton
                  url={shareLink}
                  subject={'Flashy Playlist'}
                  body={'Watch This Awesome Playlist at Flashy'}
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

    </MainContainer>

  );
};

export default SharedPlaylist;
