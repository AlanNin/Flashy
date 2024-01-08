import React, { useState, useEffect, useRef, useContext } from "react";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import app from "../firebase";
import styled, { css, keyframes } from "styled-components";
import { useDispatch, useSelector } from 'react-redux';
import { useLanguage } from '../utils/LanguageContext';
import axios from "axios";
import PublicIcon from "../assets/PublicIcon.png";
import PrivateIcon from "../assets/PrivateIcon.png";
import UnlistedIcon from "../assets/UnlistedIcon.png";
import AddNewPlaylist from "../assets/NewPLibrary.png";
import EditPlaylist from "../assets/EditPlaylist.png";
import ArrowDown from "../assets/ArrowDown.png";
import PlaylistShareIcono from "../assets/SharePlaylist.png";
import RemoveTrashcan from "../assets/RemoveTrashcan.png";
import CopyIcono from "../assets/CopyIcono.png";
import WhatsappIcon from "../assets/WhatsappIcon.png";
import CloseXGr from "../assets/CloseXGr.png";
import CardLibrary from "../components/CardLibrary";
import CreateNewPlaylist from "../components/CreateNewPlaylist";
import moment from "moment";
import "moment/locale/es";

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
`;

// PLAYLISTS
const PlaylistsContainer = styled.div`
  position: fixed;
  display: flex;
  flex-direction: column;
  height: calc(100% - 56px);
  width: 260px;
  margin-top: 56px;
  background: linear-gradient(#0b090d, #0f0d12, #121014, #121112, #17141a 99% );
  overflow: hidden;
  overflow-y: auto;
  border-right: 1px solid rgba(2, 1, 3, 0.3);
  box-shadow: 0px 4px 4px 4px rgba(0, 0, 0, 0.4);
  
  &::-webkit-scrollbar {
    width: 0px;
  }
`;

const PlaylistsWrapper = styled.div`
  padding: 20px 35px;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const PlaylistsHeader = styled.div`
  font-size: 28px;
  font-weight: bold;
  font-family: "Roboto Condensed", Helvetica;
  color: ${({ theme }) => theme.text};
  text-align: center;
  margin-bottom: 10px;
  text-shadow: 3px 3px 2px rgba(0, 0, 0);
`;

const PlaylistsItem = styled.div`
  font-size: 18px;
  font-weight: normal;
  font-family: "Roboto Condensed", Helvetica;
  color: ${({ theme }) => theme.text};
  padding: 4px 10px;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  white-space: normal;
  word-wrap: break-word;
  overflow-wrap: break-word;
  line-height: 2;
  cursor: pointer;
  border-radius: 4px;
  text-align: center;
  transition: background 0.4s ease;
  &:hover {
    background: rgba(115, 20, 74, 0.4);
  }
`;

const NewPlaylsitItem = styled.div`
  font-size: 18px;
  font-weight: normal;
  font-family: "Roboto Condensed", Helvetica;
  color: ${({ theme }) => theme.text};
  padding: 12px 10px;
  max-width: 100%;
  display: flex;
  cursor: pointer;
  border-radius: 4px;
  text-align: center;
  align-items: center;
  justify-content: center;
  transition: background 0.4s ease;
  &:hover {
    background: rgba(66, 66, 66, 0.3);
  }
`;

const AddNewPlaylistImg = styled.img`
  width: 15px;
  height: 15px;
  border: 1px solid rgba(255, 255, 255);
  border-radius: 50%;
  padding: 2px;
  margin-top: -2px;
  margin-right: 10px;
`;


// PLAYLIST INFO
const PlaylistInfoContainer = styled.div`
  position: fixed;
  display: flex;
  margin-top: 86px;
  flex-direction: column;
  margin-left: 310px;
  height: calc(100% - 86px);
  width: 375px;
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

const EditPlaylistInfoImg = styled.img`
  position: absolute;
  top: 34px;
  right: 34px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: rgba(56, 56, 56, 0.3);
  padding: 6px;
  transition: background 0.3s ease;
`;

const InputImageNewPlaylist = styled.input`
  overflow: hidden;
  position: absolute;
  top: 34px;
  right: 34px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  cursor: pointer;
  z-index: 2;

  &::-webkit-file-upload-button {
      visibility: hidden;
  }

  &:hover + ${EditPlaylistInfoImg} {
    background: rgba(56, 56, 56, 0.7);
  }
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

const EditPlaylistInfoNameImg = styled.img`
  position: absolute;
  right: 0px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  padding: 7px;
  cursor: pointer;
  transition: background 0.3s ease;
  margin-left: 4px;
  &:hover {
    background: rgba(56, 56, 56, 0.5) !important;
  }
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

const EditPlaylistInfoName = styled.input`
  font-size: ${({ name }) => (name?.length > 20 ? '22px' : '30px')}; 
  font-weight: bold;
  font-family: "Roboto Condensed", Helvetica;
  color: ${({ theme }) => theme.text};
  background: transparent;
  padding: 0px 10px 5px 10px;
  width: calc(100% - 20px);
  border: none;
  border-bottom: 1px solid rgba(207, 202, 202, 0.8);
  outline: none;
`;

const EditPlaylistInfoNameCharCounter = styled.h1`
  font-size: 14px; 
  font-weight: normal;
  font-family: "Roboto Condensed", Helvetica;
  color: ${({ theme }) => theme.textSoft};
  background: transparent;
  width: max-content;
  height: max-content;
  margin-left: auto;
  margin-top: 7px;
`;

const EditPlaylistInfoNameButtons = styled.div`
  position: relative;
  display: flex;
  width: 100%;
  height: max-content;
  background-color: transparent;
  padding: 0px;
  bottom: 0px;
  align-items: center;
  margin-top: 10px;
  margin-bottom: -8px;
`;

const EditPlaylistInfoNameSave = styled.button`
  border: none;
  width: max-content;;
  height: max-content;
  padding: 6px 14px;
  border-radius: 3px;
  position: relative;
  font-size: 15px;
  font-weight: normal;
  font-family: "Roboto Condensed", Helvetica;
  cursor: pointer;
  background: rgba(115, 20, 74, 0.5);
  color: ${({ theme }) => theme.text};
  margin-left: 12px;
  margin-right: 0px;
`;

const EditPlaylistInfoNameCancel = styled.button`
  border: none;
  width: max-content;;
  height: max-content;
  padding: 2px 2px;
  border-radius: 3px;
  position: relative;
  font-size: 15px;
  font-weight: normal;
  font-family: "Roboto Condensed", Helvetica;
  cursor: pointer;
  background: transparent;
  color: ${({ theme }) => theme.text};
  margin-left: auto;
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

const EditPlaylistInfoPrivacyImg = styled.img`
  width: 19px;
  height: 19px;
  margin-top: -1px;
`;

const fadeInDown = keyframes`
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const EditPlaylistInfoPrivacyPopup = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  width: max-content;
  height: max-content;
  background: #1D1D1D;
  padding: 0px 0px;
  margin-top: 150px;
  margin-left: -39px;
  border-radius: 8px;
  overflow: hidden;
  animation: ${fadeInDown} 0.4s ease;
  z-index: 2;
`;

const EditPlaylistInfoPrivacyButton = styled.div`
  position: relative;
  display: flex;
  width: 100%;
  height: max-content;
  padding: 10px 17px 10px 15px;
  align-items: center;
  gap: 5px;
  transition: background 0.3s ease; 
  &:hover {
    background: rgba(115, 20, 74, 0.2);
  }
`;

const EditPlaylistInfoPrivacyButtonText = styled.h1`
  width: max-content;
  height: max-content;
  font-size: 16px; 
  font-weight: normal;
  font-family: "Roboto Condensed", Helvetica;
  color: ${({ theme }) => theme.text};
`;


const EditPlaylistInfoPrivacyButtonSubText = styled.h1`
  width: max-content;
  height: max-content;
  font-size: 13px; 
  font-weight: normal;
  font-family: "Roboto Condensed", Helvetica;
  color: ${({ theme }) => theme.textSoft};
`;

const EditPlaylistInfoPrivacyButtonImg = styled.img`
  width: 22px;
  height: 22px;
  margin-top: 0px;
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
  font-size: 14px; 
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

const DeletePlaylistPopupContainer = styled.div`
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

const DeletePlaylistPopupWrapper = styled.div`
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

const DeletePlaylistPopupTitle = styled.h1`
    font-weight: bold;
    font-size: 24px;
    font-family: "Roboto Condensed", Helvetica;
`;

const DeletePlaylistPopupTxt = styled.h1`
    font-family: "Roboto Condensed", Helvetica;
    font-weight: normal;
    font-size: 17px;
    margin-bottom: 15px;
    color: ${({ theme }) => theme.textSoft};
    max-width: 400px;
`;

const DeletePlaylistPopupPlaylistName = styled.span`
    font-family: "Roboto Condensed", Helvetica;
    font-weight: bold;
    font-size: 17px;
    color: ${({ theme }) => theme.textSoft};
`;

const OptionsDeleteCancel = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  width: 100%;
`;

const DeletePlaylistCancel = styled.div`
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

const DeletePlaylistDelete = styled.div`
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

const EditPlaylistInfoDescriptionImg = styled.img`
  position: absolute;
  margin-top: -7px;
  right: 0px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  padding: 7px;
  cursor: pointer;
  transition: background 0.3s ease;
  margin-left: 4px;
  &:hover {
    background: rgba(56, 56, 56, 0.5) !important;
  }
`;

const EditPlaylistInfoDescription = styled.textarea`
  font-size: 16px; 
  font-weight: normal;
  font-family: "Roboto Condensed", Helvetica;
  color: #bababa;
  background: rgba(64, 62, 62, 0.4);
  padding: 10px 10px 7px 10px;
  margin-top: -10px;
  width: calc(100% - 20px);
  height: 165px;
  border: none;
  outline: none;
  resize: none;
  line-height: 1.25;
  border-radius: 5px;
`;


const EditPlaylistInfoDescriptionCharCounter = styled.h1`
  font-size: 14px; 
  font-weight: normal;
  font-family: "Roboto Condensed", Helvetica;
  color: ${({ theme }) => theme.textSoft};
  background: transparent;
  width: max-content;
  height: max-content;
  margin-left: auto;
  margin-top: 7px;
`;

const EditPlaylistInfoDescriptionButtons = styled.div`
  position: relative;
  display: flex;
  width: 100%;
  height: max-content;
  background-color: transparent;
  padding: 0px;
  bottom: 0px;
  align-items: center;
  margin-top: 10px;
  margin-bottom: -8px;
`;

const EditPlaylistInfoDescriptionSave = styled.button`
  border: none;
  width: max-content;;
  height: max-content;
  padding: 6px 14px;
  border-radius: 3px;
  position: relative;
  font-size: 15px;
  font-weight: normal;
  font-family: "Roboto Condensed", Helvetica;
  cursor: pointer;
  background: rgba(115, 20, 74, 0.5);
  color: ${({ theme }) => theme.text};
  margin-left: 12px;
  margin-right: 0px;
`;

const EditPlaylistInfoDescriptionCancel = styled.button`
  border: none;
  width: max-content;;
  height: max-content;
  padding: 2px 2px;
  border-radius: 3px;
  position: relative;
  font-size: 15px;
  font-weight: normal;
  font-family: "Roboto Condensed", Helvetica;
  cursor: pointer;
  background: transparent;
  color: ${({ theme }) => theme.text};
  margin-left: auto;
`;

// PLAYLIST VIDEOS
const VideosContainer = styled.div`
  position: fixed;
  display: flex;
  flex-direction: column;
  width: calc(100% - 745px);
  height: 100%;
  margin-left: 675px;
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
  padding: 126px 330px;
`;

const Library = () => {
  // CURRENT USER INFO
  const { currentUser } = useSelector((state) => state.user);

  // TRANSLATION
  const { language, setLanguage } = useLanguage();

  const translations = {
    en: {
      explore: "Library",
    },
    es: {
      explore: "Librería",
    },
  };

  // SELECT PLAYLIST
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [selectedPlaylistIndex, setSelectedPlaylistIndex] = useState(0);

  const handlePlaylistClick = (playlist, index) => {
    setSelectedPlaylist(playlist);
    setSelectedPlaylistIndex(index);
    setIsEditingPlaylistName(false);
    setIsEditingPlaylistPrivacy(false);
    setIsEditingPlaylistDescription(false);
  };

  // UPDATE PLAYLIST
  const [playlistUpdated, setPlaylistUpdated] = useState(false);
  const handleUpdate = () => {
    setPlaylistUpdated(true);
    setPlaylistWasUpdated(true);
  };

  // CREATE PLAYLIST
  const [popupNewPlaylist, setPopupNewPlaylist] = useState(false);
  const [playlistCreated, setPlaylistCreated] = useState(false);
  const userIDP = currentUser?._id;

  const handleCreated = () => {
    setPlaylistCreated(true);
    setPlaylistUpdated(true);
  };

  const handleCreateNewPlaylist = () => {
    setPopupNewPlaylist(!popupNewPlaylist);
  };

  // FETCH PLAYLISTS
  const [playlists, setPlaylists] = useState([]);
  const [playlistWasUpdated, setPlaylistWasUpdated] = useState(false);

  useEffect(() => {
    setPlaylistUpdated(false);

    const timer = setTimeout(async () => {
      try {
        const response = await axios.get(`/users/${currentUser?._id}/playlists-followed`);
        const fetchedPlaylists = response.data;

        if (fetchedPlaylists.length > 0 && playlistWasUpdated === true) {
          setSelectedPlaylist(fetchedPlaylists[selectedPlaylistIndex]);
        }
        if (fetchedPlaylists.length > 0 && playlistCreated === true) {
          setSelectedPlaylist(fetchedPlaylists[fetchedPlaylists.length - 1]);
        }
        if (fetchedPlaylists.length > 0 && playlistWasUpdated === false && playlistCreated === false) {
          setSelectedPlaylist(fetchedPlaylists[0]);
        }
        setPlaylistCreated(false);
        setPlaylistWasUpdated(false);
        setPlaylists(fetchedPlaylists);
      } catch (error) {
        console.error("Error fetching playlists:", error);
      }
    }, 50);

    return () => clearTimeout(timer);

  }, [playlistUpdated]);


  // INPUTS
  const [inputs, setInputs] = useState({ playlistname: selectedPlaylist?.name, privacy: selectedPlaylist?.privacy });

  // EDIT PLAYLIST IMG
  const [img, setImg] = useState(undefined);
  const [imgPerc, setImgPerc] = useState(0);

  const handleUpdateImgDB = async () => {
    try {
      await axios.put(`/users/playlists/${selectedPlaylist?._id}/update`, { image: inputs.image });
      handleUpdate();
      setImg(null);
      setImgPerc(0);
      setInputs({ image: null });
    } catch (error) {
      console.error("Error updating playlist:", error);
    }
  };

  const uploadImage = (file, urlType) => {
    const storage = getStorage(app);
    const imageFileName = new Date().getTime() + img.name;
    const storageRef = ref(storage, imageFileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        if (urlType === "image") {
          setImgPerc(Math.round(progress));
        }
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
          default:
            break;
        }
      },
      (error) => { },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setInputs((prev) => {
            return { ...prev, [urlType]: downloadURL };
          });
        });
      }
    );
  };

  useEffect(() => {
    img && uploadImage(img, "image");
  }, [img]);

  useEffect(() => {
    handleUpdateImgDB();
  }, [inputs.image]);

  // EDIT PLAYLIST NAME
  const [isEditingPlaylistName, setIsEditingPlaylistName] = useState(false);

  const handleEditPlaylistName = () => {
    setIsEditingPlaylistName(!isEditingPlaylistName);
    setInputs({ playlistname: undefined });
  };

  const handleSavePlaylistName = async () => {
    try {
      await axios.put(`/users/playlists/${selectedPlaylist?._id}/update`, { name: inputs.playlistname });

    } catch (error) {
      console.error("Error updating playlist:", error);
    }
    handleUpdate();
    setIsEditingPlaylistName(!isEditingPlaylistName);
  };

  // HANDLE INPUT CHANGE NAME
  const handleChangeName = (e) => {
    const { name, value } = e.target;

    if (value.length <= 100) {
      setInputs((prev) => {
        return { ...prev, [name]: value };
      });
    }
  };

  // EDIT PLAYLIST PRIVACY
  const [isEditingPlaylistPrivacy, setIsEditingPlaylistPrivacy] = useState(false);

  const handleEditPlaylistPrivacy = () => {
    setIsEditingPlaylistPrivacy(!isEditingPlaylistPrivacy);
  };

  const handleEditPlaylistPrivacyClick = (privacyType) => {
    if (privacyType !== selectedPlaylist?.privacy) {
      setInputs((prev) => {
        return { ...prev, privacy: privacyType };
      });
    }
    handleEditPlaylistPrivacy();
  };

  const handleEditPlaylistPrivacySave = async () => {
    try {
      await axios.put(`/users/playlists/${selectedPlaylist?._id}/update`, { privacy: inputs.privacy });

    } catch (error) {
      console.error("Error updating playlist:", error);
    }
    handleUpdate();
    setInputs({ privacy: undefined });
  };

  useEffect(() => {
    if (inputs?.privacy !== selectedPlaylist?.privacy) {
      handleEditPlaylistPrivacySave();
    }
  }, [inputs?.privacy]);

  // EDIT PLAYLIST DESCRIPTION
  const [isEditingPlaylistDescription, setIsEditingPlaylistDescription] = useState(false);

  const handleEditPlaylistDescription = () => {
    setIsEditingPlaylistDescription(!isEditingPlaylistDescription);
    setInputs({ description: undefined });
  };

  const handleSavePlaylisDescription = async () => {
    try {
      if (inputs.description === "") {
        await axios.delete(`/users/playlists/${selectedPlaylist?._id}/delete-description`);
      } else {
        await axios.put(`/users/playlists/${selectedPlaylist?._id}/update`, { description: inputs.description });
      }

    } catch (error) {
      console.error("Error updating playlist:", error);
    }
    handleUpdate();
    setIsEditingPlaylistDescription(!isEditingPlaylistDescription);
  };

  // HANDLE INPUT CHANGE DESCRIPTION
  const handleChangeDescription = (e) => {
    const { value } = e.target;

    if (value.length <= 300) {
      setInputs((prev) => {
        return { ...prev, description: value };
      });
    }
  };

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

  // DELETE PLAYLIST
  const [isDeletePlaylistPopupOpen, setIsDeletePlaylisPopupOpen] = useState(false);

  const handleDeletePlaylist = async () => {
    setIsDeletePlaylisPopupOpen(true);
  };

  const handleDeleteConfirmation = async (confirmed) => {
    setIsDeletePlaylisPopupOpen(false);

    if (confirmed) {
      try {
        await axios.delete(`/users/playlists/${selectedPlaylist?._id}/delete/`);
        setPlaylistUpdated(true);
      } catch (error) {
        console.error('Error deleting history:', error);
      }
    }
  };

  useEffect(() => {
    if (isDeletePlaylistPopupOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isDeletePlaylistPopupOpen]);

  // UPDATE PLAYLIST VIDEOS
  const [wasPlaylistVideosUpdated, setWasPlaylistVideosUpdated] = useState(false);

  // FETCH PLAYLIST VIDEOS
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    setWasPlaylistVideosUpdated(false);
    const fetchVideos = async () => {
      try {
        const res = await axios.get(`/users/${selectedPlaylist.creatorId}/playlists/${selectedPlaylist?._id}/videos`);
        setVideos(res.data);
      } catch (error) {
        console.error("Error fetching videos:", error);
      }
    };
    fetchVideos();
  }, [selectedPlaylist, wasPlaylistVideosUpdated]);

  // FORMATS PLAYLIST
  const timeago = timestamp => {
    const relativeTime = moment(timestamp).fromNow();
    return relativeTime.charAt(0).toLowerCase() + relativeTime.slice(1).toLowerCase();
  };

  return (
    <MainContainer>

      <PlaylistsContainer>

        <PlaylistsWrapper>

          <PlaylistsHeader> Your Playlists </PlaylistsHeader>

          {playlists && playlists.map((playlist, index) => (
            <PlaylistsItem
              key={index}
              onClick={() => handlePlaylistClick(playlist, index)}
              style={{ background: selectedPlaylist === playlist ? 'rgba(115, 20, 74, 0.7)' : '' }}
            >
              {playlist.name}
            </PlaylistsItem>
          ))}

          <NewPlaylsitItem onClick={handleCreateNewPlaylist}>
            <AddNewPlaylistImg src={AddNewPlaylist} />
            New Playlist
          </NewPlaylsitItem>

        </PlaylistsWrapper>

      </PlaylistsContainer>

      <PlaylistInfoContainer>
        {selectedPlaylist?.image && (
          <PlaylistInfoBackground src={selectedPlaylist?.image} />
        )}
        <PlaylistInfoWrapper>

          <PlaylistInfoImgContainer>
            <PlaylistInfoImg src={selectedPlaylist?.image} />

            {selectedPlaylist?.creatorId === currentUser?._id && (
              <>
                <InputImageNewPlaylist
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImg(e.target.files[0])}
                  title=""
                />
                <EditPlaylistInfoImg src={EditPlaylist} />
              </>
            )}
          </PlaylistInfoImgContainer>

          <PlaylistInfoShadowDiv>

            <PlaylistInfoNameDiv>
              {isEditingPlaylistName ? (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <EditPlaylistInfoName
                    type="text"
                    name="playlistname"
                    placeholder={selectedPlaylist?.name}
                    value={inputs.playlistname !== undefined ? inputs.playlistname : selectedPlaylist?.name}
                    onChange={handleChangeName}
                  />
                  <EditPlaylistInfoNameCharCounter>{inputs.playlistname !== undefined ? inputs.playlistname.length : selectedPlaylist?.name.length}/100</EditPlaylistInfoNameCharCounter>
                  <EditPlaylistInfoNameButtons>
                    <EditPlaylistInfoNameCancel onClick={handleEditPlaylistName}> Cancel </EditPlaylistInfoNameCancel>
                    <EditPlaylistInfoNameSave onClick={handleSavePlaylistName}> Save </EditPlaylistInfoNameSave>
                  </EditPlaylistInfoNameButtons>
                </div>
              ) : (
                <>
                  <PlaylistInfoName name={selectedPlaylist?.name} editable={selectedPlaylist?.creatorId === currentUser?._id}> {selectedPlaylist?.name} </PlaylistInfoName>
                  {selectedPlaylist?.creatorId === currentUser?._id && selectedPlaylist?.name !== 'Watch Later' && (
                    <EditPlaylistInfoNameImg src={EditPlaylist} onClick={handleEditPlaylistName} />
                  )}
                </>
              )}
            </PlaylistInfoNameDiv>

            <PlaylistInfoCreator> {selectedPlaylist?.creator} </PlaylistInfoCreator>

            {selectedPlaylist?.creatorId === currentUser?._id && selectedPlaylist?.name !== 'Watch Later' ? (
              <PlaylistInfoPrivacyDiv style={{ cursor: 'pointer' }} onClick={handleEditPlaylistPrivacy}>
                <PlaylistInfoPrivacyImg
                  src={
                    selectedPlaylist?.privacy === 'public'
                      ? PublicIcon
                      : selectedPlaylist?.privacy === 'private'
                        ? PrivateIcon
                        : UnlistedIcon
                  }
                />
                {selectedPlaylist?.privacy.charAt(0).toUpperCase() + selectedPlaylist?.privacy.slice(1)}
                <EditPlaylistInfoPrivacyImg src={ArrowDown} />

                {isEditingPlaylistPrivacy && (
                  <EditPlaylistInfoPrivacyPopup>

                    <EditPlaylistInfoPrivacyButton
                      onClick={() => handleEditPlaylistPrivacyClick("public")}
                      style={{ background: selectedPlaylist.privacy === 'public' ? 'rgba(115, 20, 74, 0.4)' : '' }}
                    >
                      <EditPlaylistInfoPrivacyButtonImg src={PublicIcon} />
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', marginLeft: '5px' }}>
                        <EditPlaylistInfoPrivacyButtonText>
                          Public
                        </EditPlaylistInfoPrivacyButtonText>
                        <EditPlaylistInfoPrivacyButtonSubText>
                          Every user is allowed to search and view your playlist
                        </EditPlaylistInfoPrivacyButtonSubText>
                      </div>
                    </EditPlaylistInfoPrivacyButton>

                    <EditPlaylistInfoPrivacyButton
                      onClick={() => handleEditPlaylistPrivacyClick("private")}
                      style={{ background: selectedPlaylist.privacy === 'private' ? 'rgba(115, 20, 74, 0.4)' : '' }}
                    >
                      <EditPlaylistInfoPrivacyButtonImg src={PrivateIcon} />
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', marginLeft: '5px' }}>
                        <EditPlaylistInfoPrivacyButtonText>
                          Private
                        </EditPlaylistInfoPrivacyButtonText>
                        <EditPlaylistInfoPrivacyButtonSubText>
                          Only you are allowed to view your playlist
                        </EditPlaylistInfoPrivacyButtonSubText>
                      </div>
                    </EditPlaylistInfoPrivacyButton>

                    <EditPlaylistInfoPrivacyButton
                      onClick={() => handleEditPlaylistPrivacyClick("unlisted")}
                      style={{ background: selectedPlaylist.privacy === 'unlisted' ? 'rgba(115, 20, 74, 0.4)' : '' }}
                    >
                      <EditPlaylistInfoPrivacyButtonImg src={UnlistedIcon} />
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', marginLeft: '5px' }}>
                        <EditPlaylistInfoPrivacyButtonText>
                          Unlisted
                        </EditPlaylistInfoPrivacyButtonText>
                        <EditPlaylistInfoPrivacyButtonSubText>
                          Every user is allowed to view your playlist with the share link
                        </EditPlaylistInfoPrivacyButtonSubText>
                      </div>
                    </EditPlaylistInfoPrivacyButton>
                  </EditPlaylistInfoPrivacyPopup>
                )}
              </PlaylistInfoPrivacyDiv>
            ) : (
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
                {selectedPlaylist?.privacy.charAt(0).toUpperCase() + selectedPlaylist?.privacy.slice(1)}
              </PlaylistInfoPrivacyDiv>
            )}

            <PlaylistInfoLengthAndFollowers> {selectedPlaylist?.videosLength} videos {`\u00A0`}·{`\u00A0`} {selectedPlaylist?.followers?.length ? selectedPlaylist?.followers?.length : 0}  followers </PlaylistInfoLengthAndFollowers>

            <PlaylistInfoLastUpdated> Updated {timeago(selectedPlaylist?.lastUpdated)}</PlaylistInfoLastUpdated>

            {selectedPlaylist?.creatorId === currentUser?._id && selectedPlaylist?.name !== 'Watch Later' && (
              <PlaylistInfoActionButtonsDiv>
                {selectedPlaylist?.privacy !== 'private' && (
                  <PlaylistInfoActionButtonsImg src={PlaylistShareIcono} onClick={handleShare} />
                )}
                <PlaylistInfoActionButtonsImg src={RemoveTrashcan} onClick={handleDeletePlaylist} />
              </PlaylistInfoActionButtonsDiv>
            )}

            {selectedPlaylist?.name !== 'Watch Later' && (
              <PlaylistInfoDescriptionDiv>
                {isEditingPlaylistDescription ? (
                  <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: 'max-content' }}>
                    <EditPlaylistInfoDescription
                      type="text"
                      name="description"
                      placeholder={selectedPlaylist?.description === undefined || selectedPlaylist?.description === ''
                        ? 'Add a description to your playlist'
                        : selectedPlaylist?.description}
                      value={inputs?.description !== undefined ? inputs.description : selectedPlaylist?.description}
                      onChange={handleChangeDescription}
                      descriptionTxt={selectedPlaylist?.description}
                    />
                    <EditPlaylistInfoDescriptionCharCounter>
                      {inputs?.description !== undefined ? inputs?.description?.length : (selectedPlaylist?.description ? selectedPlaylist?.description.length : 0)}/300
                    </EditPlaylistInfoDescriptionCharCounter>
                    <EditPlaylistInfoDescriptionButtons>
                      <EditPlaylistInfoDescriptionCancel onClick={handleEditPlaylistDescription}> Cancel </EditPlaylistInfoDescriptionCancel>
                      <EditPlaylistInfoDescriptionSave onClick={handleSavePlaylisDescription}> Save </EditPlaylistInfoDescriptionSave>
                    </EditPlaylistInfoDescriptionButtons>
                  </div>
                ) : (
                  <>
                    <PlaylistInfoDescription editable={selectedPlaylist?.creatorId === currentUser?._id}>
                      {selectedPlaylist?.description ? (
                        selectedPlaylist?.description
                      ) : (
                        selectedPlaylist?.creatorId === currentUser?._id ? (
                          <>
                            Add a description to your playlist
                          </>
                        ) : (
                          <>
                            No description
                          </>
                        )
                      )}
                    </PlaylistInfoDescription>
                    {selectedPlaylist?.creatorId === currentUser?._id && selectedPlaylist?.name !== 'Watch Later' && (
                      <EditPlaylistInfoDescriptionImg src={EditPlaylist} onClick={handleEditPlaylistDescription} />
                    )}
                  </>
                )}
              </PlaylistInfoDescriptionDiv>
            )}

          </PlaylistInfoShadowDiv>

        </PlaylistInfoWrapper>

      </PlaylistInfoContainer>

      <VideosContainerHideTop />

      <VideosContainer>

        {videos.videos?.length === 0 ? (
          <VideosContainerNoVideoText>Seems like you have no videos in this playlist yet</VideosContainerNoVideoText>
        ) : (
          <>
            <VideosContainerCards>
              {videos.videos?.map((video, index) => (
                <div key={video?._id}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <CardLibrary video={video} index={index + 1} setWasPlaylistVideosUpdated={setWasPlaylistVideosUpdated} selectedPlaylist={selectedPlaylist} handleUpdate={handleUpdate} />
                  </div>
                </div>
              ))}
            </VideosContainerCards>

          </>
        )}
      </VideosContainer>

      {popupNewPlaylist && (
        <CreateNewPlaylist userId={userIDP} handleCreateNewPlaylist={handleCreateNewPlaylist} handleCreated={handleCreated} />
      )}

      {
        isDeletePlaylistPopupOpen && (
          <DeletePlaylistPopupContainer
            onDeleteConfirmed={() => handleDeleteConfirmation(true)}
            onCancel={() => handleDeleteConfirmation(false)}
          >
            <DeletePlaylistPopupWrapper>
              <DeletePlaylistPopupTitle> Delete Playlist </DeletePlaylistPopupTitle>
              <DeletePlaylistPopupTxt> Are you sure you want to delete <DeletePlaylistPopupPlaylistName>{selectedPlaylist?.name}</DeletePlaylistPopupPlaylistName>? </DeletePlaylistPopupTxt>
              <DeletePlaylistPopupTxt style={{ marginTop: '-25px' }}> Note: This action is permanent and cannot be undone. </DeletePlaylistPopupTxt>
              <OptionsDeleteCancel>
                <DeletePlaylistCancel onClick={() => handleDeleteConfirmation(false)}>
                  Cancel
                </DeletePlaylistCancel>
                <DeletePlaylistDelete onClick={() => handleDeleteConfirmation(true)}>
                  Delete
                </DeletePlaylistDelete>
              </OptionsDeleteCancel>
            </DeletePlaylistPopupWrapper>
          </DeletePlaylistPopupContainer>
        )
      }

      {
        isSharePopupVisible && (
          <SharePopupContainerBg>
            <ShareContainer ref={shareRef}>
              <ShareLabel> Share Playlist </ShareLabel>
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

export default Library;
