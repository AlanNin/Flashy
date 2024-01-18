import React, { useState, useEffect } from "react";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import app from "../firebase";
import axios from "axios";
import styled, { keyframes } from "styled-components";
import PublicIcon from "../assets/PublicIcon.png";
import PrivateIcon from "../assets/PrivateIcon.png";
import UnlistedIcon from "../assets/UnlistedIcon.png";
import { useLanguage } from '../utils/LanguageContext';
import { useSelector } from 'react-redux';

// CREATE NEW PLAYLIST 
const NewPlayListContainerBg = styled.div`
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

const NewPlayListContainer = styled.div`
    position: relative;
    width: 35%;
    height: 70%;
    background: #1D1D1D;
    color: ${({ theme }) => theme.text};
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    padding: 25px 0px;
`;

const WrapperNewPlaylist = styled.div`
    display: flex;
    flex-direction: column;
    width: calc(100% - 60px);
    height: 100%;
    gap: 30px;
    padding: 15px 30px;
  `;

const FooterNewPlaylist = styled.div`
  position: absolute;
  display: flex;
  width: 100%;
  height: 40px;
  background-color: rgba(8, 5, 8, 0.5);
  padding: 10px 0px;
  bottom: 0px;
  border-radius: 0px 0px 5px 5px;
  align-items: center;
  bottom: 0px;
`;

const DonePlaylistButton = styled.button`
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
  margin-left: 15px;
  margin-right: 30px;
`;

const CancelPlaylistButton = styled.button`
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
  background: transparent;
  color: ${({ theme }) => theme.text};
  margin-left: auto;
`;

const TitleNewPlaylist = styled.h1`
  text-align: center;
  font-size: 28px;
  font-family: "Roboto Condensed", Helvetica;
  padding-bottom: 15px;
  padding-top: 10px;
`;

const LabelNewPlaylist = styled.label`
    font-size: 22px;
    font-weight: normal;
    font-family: "Roboto Condensed", Helvetica;
    margin-top: 5px;
`;

const SubLabelNewPlaylist = styled.label`
    margin-top: -20px;
    font-size: 16px;
    color: ${({ theme }) => theme.textSoft};
    font-weight: normal;
    font-family: "Roboto Condensed", Helvetica;
`;

const InputContainerNewPlaylist = styled.div`
  position: relative;
  margin-top: -10px;
`;

const InputNewPlaylist = styled.input`
    position: relative;
    border: 1px solid rgba(110, 110, 110, 0.5);
    color: ${({ theme }) => theme.text};
    border-radius: 3px;
    padding: 40px 14px 30px 14px;
    background-color: transparent;
    z-index: 2;
    line-height: 1.5;
    width: calc(100% - 30px);
    font-size: 16px;
    border-color: ${({ playlistnameError }) => (playlistnameError ? 'red' : '')}; 
    
    &:focus {
        border-color: ${({ playlistnameError }) => (playlistnameError ? 'red' : 'rgba(91, 32, 107)')};
        outline: none;
    }
`;

const TitleInputNewPlaylist = styled.label`
    position: absolute;
    top: 20px;
    left: 10px;
    font-size: 12px;
    color: ${({ playlistnameError }) => (playlistnameError ? 'red' : '${({ theme }) => theme.textSoft}')}; 
    transform: translate(5px, -50%);
    pointer-events: none;
    transition: transform 0.2s ease-out;

    ${InputNewPlaylist}:focus ~ & {
        color: {({ playlistnameError }) => (playlistnameError ? 'red' : 'rgba(153, 63, 176)')}; 
    }
`;

const CharCountLInputNewPlaylist = styled.label`
  position: absolute;
  bottom: 20px;
  right: 15px;
  font-size: 12px;
  color: ${({ theme }) => theme.textSoft};
  transform: translate(0, 50%);
  pointer-events: none;
  transition: transform 0.2s ease-out;
`;

const InputImageNewPlaylist = styled.input`
  font-size: 16px;
  font-weight: bold;
  font-family: "Roboto Condensed", Helvetica; 
  overflow: hidden;
  width: 140px;
  margin-top: -15px;

  &::-webkit-file-upload-button {
      visibility: hidden;
  }

  &:before {
      width: calc(100% - 24px);
      text-align: center;
      content: 'SELECT FILE';
      display: inline-block;
      background-color: #8e58d6;
      color: black;
      padding: 8px 12px;
      cursor: pointer;
      transition: background-color 0.3s ease;
  }
  &:hover:before {
      background: #7958a6;
  }
`;

const UploadImageNewPlaylist = styled.label`
    font-size: 18px;
    font-weight: bold;
    font-family: "Roboto Condensed", Helvetica;
    color: #8e58d6;
    margin-top: -15px;
    margin-bottom: 13px;
`;

const ContainerSelectPrivacy = styled.div`
  display: flex;
  gap: 35px;
`;

const DivSelectPrivacy = styled.div`
  display: flex;
  border: 1px solid #5b3391;
  font-size: 18px;
  font-family: "Roboto Condensed", Helvetica;
  padding: 12px 22px;
  width: 60px;
  cursor: pointer;
  transition: font-size 0.3s ease;
  align-items: center;
  justify-content: center;
  text-align: center;

  &:hover {
    background: #5b3391;
    font-size: 17px;
    font-weight: bold;
  }

  ${({ selected }) => selected && `
    background: #5b3391 !important;
    font-size: 17px !important;
    font-weight: bold !important;
  `}
`;

const PlaylistImgNewPlaylist = styled.img`
  width: 18px;
  height: 18px;
  margin-right: 5px;

  ${DivSelectPrivacy}:hover & {
    width: 17px;
    height: 17px;
  }

    ${({ selected }) => selected && `
    width: 17px;
    height: 17px;
  `}
`;

const CreateNewPlaylist = ({ userId, handleCreateNewPlaylist, handleCreated }) => {
  const { language, setLanguage } = useLanguage();
  const [inputs, setInputs] = useState({ privacy: 'public' });
  const [img, setImg] = useState(undefined);
  const [imgPerc, setImgPerc] = useState(0);
  const [playlistnameError, setPlaylistNameError] = useState(false);
  const { currentUser } = useSelector((state) => state.user);

  const resetNewPlaylistState = () => {
    setInputs({ privacy: 'public' });
    setImg(undefined);
    setImgPerc(0);
    setPlaylistNameError(false);
  };

  const translations = {
    en: {
      create: "Create a New Playlist",
      setname: "Set a name",
      setnametxt: "New playlist, new vibes. What's your playlist name?",
      search: "Search for a playlist",
      pname: "Playlist Name (Required)",
      setimage: "Set an image",
      setimagetxt: "Add a thumbnail image to your playlist for a personal touch. (Optional)",
      uploading: "Uploading:",
      imagesuccess: "Image uploaded successfully!",
      setprivacy: "Set privacy",
      setprivacytxt: "Control your playlist's privacy. Your videos, your rules. (Default: Public)",
      public: "Public",
      private: "Private",
      unlisted: "Unlisted",
      cancel: "Cancel",
      done: "Done",
    },
    es: {
      create: "Crear Nueva Lista de Reproducción",
      setname: "Elige un nombre",
      setnametxt: "Nueva lista de reproducción, nuevas vibras. ¿Cuál es el nombre de tu lista de reproducción?",
      search: "Busqueda de playlists",
      pname: "Nombre de la lista de reproducción (Requerido)",
      setimage: "Elige una imagen",
      setimagetxt: "Agrega una imagen a tu lista de reproducción para darle un toque personal. (Opcional)",
      uploading: "Subido:",
      imagesuccess: "La imagen se ha subido con éxito",
      setprivacy: "Elige una privacidad",
      setprivacytxt: "Controla la privacidad de tu lista de reproducción. Tus vídeos, tus reglas. (Predeterminado: Público)",
      public: "Pública",
      private: "Privada",
      unlisted: "Sin listar",
      cancel: "Cancelar",
      done: "Listo",
    },
  };

  const handleNewPlaylistButtonClick = () => {
    handleCreateNewPlaylist();
    resetNewPlaylistState();
  };

  const handleInputChange = (e) => {

    const { value } = e.target;

    if (value.length <= 100) {
      setInputs((prev) => {
        return { ...prev, [e.target.name]: e.target.value };
      });
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

  const handlePrivacyClick = (privacyType) => {
    setInputs((prev) => {
      return { ...prev, privacy: privacyType };
    });
  };

  const handleDoneNewPlaylist = async (e) => {
    e.preventDefault();
    const creatorName = currentUser?.displayname;
    try {
      if (inputs.name === undefined || inputs.name === "") {
        setPlaylistNameError(true);
      } else {
        // Usa directamente el estado actualizado
        await axios.post(`/users/${userId}/playlists`, { ...inputs, creator: creatorName });

        handleCreateNewPlaylist();
        handleCreated();
        resetNewPlaylistState();
        setPlaylistsLoaded(false);
      }
    } catch (error) {
      console.error("Error creating new playlist:", error);
    }
  };

  return (

    <NewPlayListContainerBg>
      <NewPlayListContainer>
        <TitleNewPlaylist> {translations[language].create}  </TitleNewPlaylist>

        <WrapperNewPlaylist>
          <LabelNewPlaylist>{translations[language].setname} </LabelNewPlaylist>
          <SubLabelNewPlaylist> {translations[language].setnametxt}  </SubLabelNewPlaylist>

          <InputContainerNewPlaylist>
            <InputNewPlaylist
              type="text"
              placeholder="Write your playlist name here..."
              name="name"
              onChange={(e) => {
                handleInputChange(e);
                setPlaylistNameError(false);
              }}
              value={inputs.name}
              playlistnameError={playlistnameError}
            />
            <TitleInputNewPlaylist InputNewPlaylist={InputNewPlaylist} playlistnameError={playlistnameError}> {translations[language].pname} </TitleInputNewPlaylist>
            <CharCountLInputNewPlaylist>{inputs.name ? inputs.name.length : 0}/100</CharCountLInputNewPlaylist>
          </InputContainerNewPlaylist>

          <LabelNewPlaylist> {translations[language].setimage}  </LabelNewPlaylist>
          <SubLabelNewPlaylist> {translations[language].setimagetxt}  </SubLabelNewPlaylist>

          {imgPerc > 0 ? (
            imgPerc < 100 ? (
              <UploadImageNewPlaylist>{translations[language].uploading} {imgPerc}%</UploadImageNewPlaylist>
            ) : (
              <UploadImageNewPlaylist>{translations[language].imagesuccess}</UploadImageNewPlaylist>
            )
          ) : (
            <InputImageNewPlaylist
              type="file"
              accept="image/*"
              onChange={(e) => setImg(e.target.files[0])}
            />
          )}

          <LabelNewPlaylist> {translations[language].setprivacy} </LabelNewPlaylist>
          <SubLabelNewPlaylist> {translations[language].setprivacytxt}</SubLabelNewPlaylist>
          <ContainerSelectPrivacy>

            <DivSelectPrivacy
              onClick={() => handlePrivacyClick("public")}
              selected={inputs.privacy === 'public'}
            >
              <PlaylistImgNewPlaylist src={PublicIcon} selected={inputs.privacy === "public"} />{translations[language].public}
            </DivSelectPrivacy>

            <DivSelectPrivacy
              onClick={() => handlePrivacyClick("private")}
              selected={inputs.privacy === 'private'}
            >
              <PlaylistImgNewPlaylist src={PrivateIcon} selected={inputs.privacy === "private"} />{translations[language].private}
            </DivSelectPrivacy>

            <DivSelectPrivacy
              onClick={() => handlePrivacyClick("unlisted")}
              selected={inputs.privacy === "unlisted"}
            >
              <PlaylistImgNewPlaylist src={UnlistedIcon} selected={inputs.privacy === "unlisted"} />{translations[language].unlisted}
            </DivSelectPrivacy>

          </ContainerSelectPrivacy>
        </WrapperNewPlaylist>
        <FooterNewPlaylist>
          <CancelPlaylistButton onClick={handleNewPlaylistButtonClick}> {translations[language].cancel} </CancelPlaylistButton>
          <DonePlaylistButton onClick={handleDoneNewPlaylist}> {translations[language].done} </DonePlaylistButton>
        </FooterNewPlaylist>
      </NewPlayListContainer>
    </NewPlayListContainerBg>

  );
};

export default CreateNewPlaylist;
