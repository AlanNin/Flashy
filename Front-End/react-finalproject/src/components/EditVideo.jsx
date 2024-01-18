import React, { useState, useEffect, useRef } from "react";
import styled, { keyframes } from "styled-components";
import CloseXGr from "../assets/CloseXGr.png";
import ResetIcon from "../assets/ResetIcon.png";
import PublicIcon from "../assets/PublicIcon.png";
import PrivateIcon from "../assets/PrivateIcon.png";
import UnlistedIcon from "../assets/UnlistedIcon.png";
import { useLanguage } from '../utils/LanguageContext';
import SharePrivateIcon from "../assets/AllowUserIcon.png";
import {
    getStorage,
    ref,
    uploadBytesResumable,
    getDownloadURL,
} from "firebase/storage";
import app from "../firebase";
import axios from "axios";
import { toast } from 'react-toastify';
import { Link, useNavigate } from "react-router-dom";
import DropdownLanguage from './DropdownLanguage';
import DropdownSubtitle from './DropdownSubtitle';
import SharePrivateComponent from "./SharePrivateComponent";

// EN flags
import USAflag from "../assets/USAflag.png";
import UKflag from "../assets/UKflag.png";
import CANADAflag from "../assets/CANADAflag.png";
import AUSTRALIAflag from "../assets/AUSTRALIAflag.png";

// ES flags
import RDflag from "../assets/RDflag.png";
import SPAINflag from "../assets/SPAINflag.png";
import MEXICOflag from "../assets/MEXICOflag.png";
import ARGENTINAflag from "../assets/ARGENTINAflag.png";

// FR flags
import FRANCEflag from "../assets/FRANCEflag.png";
// ---> CANADAflag already defined
import BELGIUMflag from "../assets/BELGIUMflag.png";
import SWITZERLANDflag from "../assets/SWITZERLANDflag.png";

// PT flags
import BRAZILflag from "../assets/BRAZILflag.png";
import PORTUGALflag from "../assets/PORTUGALflag.png";
import ANGOLAflag from "../assets/ANGOLAflag.png";
import MOZAMBIQUEflag from "../assets/MOZAMBIQUEflag.png";

// RU flags
import RUSSIAflag from "../assets/RUSSIAflag.png";
import UKRAINEflag from "../assets/UKRAINEflag.png";
import BELARUSflag from "../assets/BELARUSflag.png";
import KAZAKHSTANflag from "../assets/KAZAKHSTANflag.png";

// ZH flags
import CHINAflag from "../assets/CHINAflag.png";
import SINGAPOREflag from "../assets/SINGAPOREflag.png";
import MALAYSIAflag from "../assets/MALAYSIAflag.png";
import TAIWANflag from "../assets/TAIWANflag.png";

// JP flags
import JAPANflag from "../assets/JAPANflag.png";
import PHILIPPINESflag from "../assets/PHILIPPINESflag.png";
// ---> MALAYSIAflag already defined
// ---> CHINAflag already defined

// KR flags
import SOUTHKOREAflag from "../assets/SOUTHKOREAflag.png";
import NORTHKOREAflag from "../assets/NORTHKOREAflag.png";
// ---> CHINAflag already defined
// ---> PHILIPPINESflag already defined

const ContainerBg = styled.div`
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

const Container = styled.div`
    position: relative;
    width: 507px;
    height: auto;
    background-color: rgba(36, 36, 36);
    color: ${({ theme }) => theme.text};
    border-radius: 10px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    overflow-y: auto;

    &::-webkit-scrollbar {
        width: 0px;
      }
`;

const ContentContainer = styled.div`
    display: flex;
    flex-direction: column;
    margin-top: 111px;
    padding: 30px 20px;
`;

// HEADER
const Header = styled.div`
  width: 477px;
  height: 81px;
  border-radius: 8px 8px 0px 0px;
  position: fixed;
  display: flex;
  padding: 20px 15px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.15);
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 4;
  background-color: rgba(36, 36, 36);
`;

const HeaderFlex = styled.div`
  display: flex;
  width: 477px;
`;


const HeaderTitle = styled.h1`
    font-size: 24px;
    font-weight: bold;
    color: ${({ theme }) => theme.text};
    font-family: "Roboto Condensed", Helvetica;
    margin-left: 5px;
`;

const HeaderCloseX = styled.img`
    width: 20px;
    height: 20px;
    padding: 6px;
    border-radius: 50%;
    transition: background 0.3s ease;
    cursor: pointer;
    position: absolute;
    right: ${({ language }) => (language === 'en' ? '90px' : '110px')};
    top: 20px;

    &:hover {
        background: rgba(255, 255, 255, 0.1);
    }
`;

const SectionContainer = styled.div`
    position: relative;
    display: flex;
    height: auto;
    width: auto;
    gap: 15px;
    margin-top: 20px;
`;

const SectionItem = styled.div`
    font-size: 16px;
    font-weight: bold;
    font-family: "Roboto Condensed", Helvetica;
    padding: 5px 10px;
    border-radius: 10px;
    width: max-content;
    cursor: pointer;
    transition: background 0.5s ease;
    background: ${({ editSection }) => (editSection ? '#F1F1F1' : '#272727')};
    color: ${({ editSection, theme }) => (editSection ? 'black' : theme.text)};

    &:hover {
      background: ${({ editSection }) => (editSection ? '#F1F1F1' : 'rgba(171, 171, 171, 0.4)')};
    }
`;

// FOOTER
const Footer = styled.div`
  width: 477px;
  height: 30px;
  position: relative;
  display: flex;
  padding: 0px 15px 15px 15px;
  display: flex;
  align-items: center;
  background-color: rgba(36, 36, 36);
`;

// INPUTS INFO
const InputContainer = styled.div`
  position: relative;
  margin-bottom: 20px;
`;

const Input = styled.input`
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

    &:focus {
        border-color: rgba(91, 32, 107);
        outline: none;
    }
`;

const TitleCharCountInput = styled.label`
  position: absolute;
  bottom: 20px;
  right: 15px;
  font-size: 12px;
  color: ${({ theme }) => theme.textSoft};
  transform: translate(0, 50%);
  pointer-events: none;
  transition: transform 0.2s ease-out;
`;

const Desc = styled.textarea`
    position: relative;
    border: 1px solid rgba(110, 110, 110, 0.5);
    border-color: rgba(110, 110, 110, 0.5); 
    color: ${({ theme }) => theme.text};
    border-radius: 3px;
    padding: 40px 14px 10px 14px;
    background-color: transparent;
    z-index: 3;
    width: calc(100% - 30px);
    height: 120px;
    font-size: 16px;
    resize: none;

    &:focus {
        border-color: rgba(91, 32, 107);
        outline: none;
    }

    &::-webkit-scrollbar {
        width: 5px; /* Ancho del scrollbar (ajusta según tu preferencia) */
    }

    &::-webkit-scrollbar-thumb {
        background-color: rgba(91, 32, 107); /* Color del thumb (barra móvil) */
        border-radius: 5px; /* Borde redondeado del thumb */
    }

    &::-webkit-scrollbar-track {
        background-color: rgba(110, 110, 110, 0.5); /* Color de la pista (barra fija) */
    }
`;

const DescCharCountInput = styled.label`
  position: absolute;
  bottom: 20px;
  right: 15px;
  font-size: 12px;
  color: ${({ theme }) => theme.textSoft};
  transform: translate(0, 50%);
  pointer-events: none;
  transition: transform 0.2s ease-out;
`;

const TitleInput = styled.label`
    position: absolute;
    top: 20px;
    left: 10px;
    font-size: 12px;
    color: ${({ theme }) => theme.textSoft};
    transform: translate(5px, -50%);
    pointer-events: none;
    transition: transform 0.2s ease-out, background 0.3s ease;

    ${Input}:focus ~ & {
        color: rgba(153, 63, 176);
    }

    ${Desc}:focus ~ & {
        color: rgba(153, 63, 176);
    }
`;


const Label = styled.label`
    font-size: 18px;
    font-weight: bold;
    font-family: "Roboto Condensed", Helvetica;
    margin-bottom: 20px;
`;

// THUMBNAILS

const InputImage = styled.input`
  font-size: 16px;
  font-weight: bold;
  font-family: "Roboto Condensed", Helvetica; 
  overflow: hidden;
  width: 140px;
  margin-top: 5px;

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

const UploadImage = styled.label`
    font-size: 18px;
    font-weight: bold;
    font-family: "Roboto Condensed", Helvetica;
    color: #8e58d6;
    margin-top: 5px;
    margin-bottom: 13px; 
`;

const TitleAndPreview = styled.div`
    position: relative;
    display:flex;
`;

const TitleAndPreviewLandscape = styled.div`
    display: flex;
`;

const SideDropdownImg = styled.img`
  height: 18px;
  width: 18px;
  cursor: pointer;
  margin-top: 7px;
  margin-left: 8px;
`;

// LANGUAGE
const ContainerLanguageSub = styled.div`
    display: flex;
    flex-direction: column;
`;

const SelecterAndFlags = styled.div`
    display: flex;
    align-items: center;
    gap: 20px;
`;

const FlagsImg = styled.img`
    width: 35px;
    height: 35px;
`;

const DropDownSubtitlesContainer = styled.div`
    display: flex;
`;

// VISIBILITY

const LabelStep3 = styled.label`
    font-size: 22px;
    font-weight: normal;
    font-family: "Roboto Condensed", Helvetica;
    margin-top: 10px;
    color: ${({ emptyLanguageError, theme }) => (emptyLanguageError ? 'red' : theme.text)};
`;

const SubLabelStep3 = styled.label`
    margin-top: -12px;
    font-size: 16px;
    color: ${({ theme }) => theme.textSoft};
    font-weight: normal;
    font-family: "Roboto Condensed", Helvetica;
`;

const ContainerSelectPrivacy = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 30px 100px;
`;

const DivSelectPrivacy = styled.div`
  display: flex;
  border: 1px solid #5b3391;
  font-size: 18px;
  font-family: "Roboto Condensed", Helvetica;
  padding: 15px 10px;
  width: 100%;
  height: ${({ privateSelected }) => (privateSelected ? '120px' : '80px')}; 
  cursor: pointer;
  transition: font-size 0.3s ease; 
  align-items: center;
  justify-content: center;
  text-align: center;
  border-radius: 8px;
  font-weight: bold;

   
  &:hover {
    background: #5b3391;
  }
  ${({ selected }) => selected && `
    background: #5b3391;
  `}
`;

const PrivacyImg = styled.img`
  width: 18px;
  height: 18px;
  margin-right: 5px;

`;

const PrivacyDesc = styled.h1`
    font-size: 14px;
    color: ${({ theme }) => theme.textSoft};
    font-weight: normal;
    font-family: "Roboto Condensed", Helvetica;
    padding: 5px 48px;
    transition: font-size 0.3s ease;
    margin-bottom: ${({ privateSelected }) => (privateSelected ? '-5px' : '0px')};  

`;


const DivSelectPrivacyFlex = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
`;

const DivSelectPrivacyColumn = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 8px;
    justify-content: center;
    align-items: center;
    transition: transform 0.3s; 
    
    &:hover {
        transform: scale(0.93);
    }

    ${({ selected }) => selected && `
     transform: scale(0.93);
  `}
`;

const SharePrivateButton = styled.div`
    display: flex;
    font-size: 16px;
    font-weight: bold;
    font-family: "Roboto Condensed", Helvetica; 
    color: white;
    width: max-content;
    text-align: center;
    justify-content: center;
    padding: 8px 12px;
    cursor: pointer;
    gap: 10px;
    margin-bottom: -5px;
    margin-top: 5px;
    border-radius: 5px;
    background: #371763;
`;

const SharePrivateImg = styled.img`
    width: 20px;
    height: 20px;
`;

// SAVE
const ButtonSave = styled.button`
    border-radius: 3px;
    border: none;
    padding: 7px 16px;
    cursor: pointer;
    background-color: rgba(82, 41, 73, 0.7);
    margin-left: auto;
    margin-right: 5px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;

    font-size: 15px;
    font-family: "Roboto Condensed", Helvetica;
    font-weight: bold;
    color: ${({ theme }) => theme.text};

    transition: background-color 0.3s ease;
    &:hover {
        background-color: rgba(82, 41, 73, 0.5);
    }

`;


const EditVideo = ({ closePopup, video, setFetchUpdated }) => {
    const { language, setLanguage } = useLanguage();

    // TRANSLATIONS
    const translations = {
        en: {
            updatevideo: "Update Video",
            save: "Save",
            general: "General Information",
            thumbnails: "Thumbnails",
            language: "Language",
            privacy: "Privacy",
            videotitle: "Video Title (Required)",
            videodesc: "Video Description (Required)",
            videotags: "Video Tags",
            thumbnail: "Thumbnail",
            thumbnailss: "Thumbnail uploaded successfully!",
            vthumbnail: "Vertical Thumbnail",
            vthumbnailss: "Vertical thumbnail uploaded successfully!",
            lthumbnail: "Landscape Thumbnail",
            lthumbnailss: "Landscape thumbnail uploaded successfully!",
            subtitles: "Subtitles",
            visibility: "Visibility",
            public: "Public",
            publictxt: "By setting your video you will allow anyone to view, like, and share your content.",
            private: "Private",
            privatetxt: "Keep your video private by adjusting the privacy settings to ensure it's only visible to selected individuals.",
            invite: "INVITE USERS",
            unlisted: "Unlisted",
            unlistedtxt: "Choose unlisted for an exclusive touch. Keep your video private, sharing only with those you select.",
            uploading: "Uploading:",
            toasterror: "This format is not valid",
            toastpending: "Updating video",
            toastsuccess: "Video updated successfully",
            toasterrorpromise: "There was an error updating the video",
        },
        es: {
            updatevideo: "Actualizar Video",
            save: "Guardar",
            general: "Información General",
            thumbnails: "Miniaturas",
            language: "Idioma",
            privacy: "Privacidad",
            videotitle: "Título del video (Requerido)",
            videodesc: "Descripción del video (Requerido)",
            videotags: "Etiquetas del video",
            thumbnail: "Miniatura",
            thumbnailss: "Miniatura subida con éxito",
            vthumbnail: "Miniatura Vertical",
            vthumbnailss: "Miniatura vertical subida con éxito",
            lthumbnail: "Miniatura Horizontal",
            lthumbnailss: "Miniatura horizontal subida con éxito",
            subtitles: "Subtítulos",
            visibility: "Visibilidad",
            public: "Público",
            publictxt: "Al configurar su video, permitirá que cualquiera vea, dé me gusta y comparta su contenido.",
            private: "Privado",
            privatetxt: "Mantenga su video privado ajustando la configuración de privacidad para garantizar que solo sea visible para personas seleccionadas.",
            invite: "INIVITAR USUARIOS",
            unlisted: "Sin listar",
            unlistedtxt: "Elija no listado para darle un toque exclusivo. Mantén tu video privado y compártelo solo con aquellos que selecciones.",
            uploading: "Subiendo:",
            toasterror: "Este formato no es válido",
            toastpending: "Actualizando video",
            toastsuccess: "Video actualizado con éxito",
            toasterrorpromise: "Hubo un error al actualizar el video",
        },
    };


    // EDIT SECTIONS DEFINITION
    const editSections = [
        "General Information",
        "Thumbnails",
        "Language and Subitles",
        "Privacy",
    ];

    const [editSection, setEditSection] = useState(editSections[0]);


    // INPUTS
    const [inputs, setInputs] = useState({ privacy: video?.privacy });

    // CHANGE TITLE
    const handleChangeTitle = (e) => {
        const { name, value } = e.target;

        if (value.length <= 150) {
            setInputs((prev) => {
                return { ...prev, [name]: value };
            });
        }
    };

    // CHANGE DESC
    const handleChangeDesc = (e) => {
        const { name, value } = e.target;

        if (value.length <= 500) {
            setInputs((prev) => {
                return { ...prev, [name]: value };
            });
        }
    };

    // CHANGE TAGS
    const handleChangeTags = (e) => {
        const { name, value } = e.target;

        if (value.length <= 120) {
            setInputs((prev) => {
                return { ...prev, [name]: value };
            });
        }
    };

    // THUMBNAILS
    const [img, setImg] = useState(undefined);
    const [imgVertical, setImgVertical] = useState(undefined);
    const [imgLandscape, setImgLandscape] = useState(undefined);
    const [imgPerc, setImgPerc] = useState(0);
    const [imgVerticalPerc, setImgVerticalPerc] = useState(0);
    const [imgLandscapePerc, setImgLandscapePerc] = useState(0);

    const handleThumbnailFileChange = (e) => {
        const selectedFile = e.target.files[0];

        if (selectedFile) {
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

            if (allowedTypes.includes(selectedFile.type)) {
                setImg(selectedFile);

            } else {
                toast.error(translations[language].toasterror);
            }
        }
    };

    const handleVerticalFileChange = (e) => {
        const selectedFile = e.target.files[0];

        if (selectedFile) {
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

            if (allowedTypes.includes(selectedFile.type)) {
                setImgVertical(e.target.files[0]);

            } else {
                toast.error(translations[language].toasterror);
            }
        }
    };

    const handleLandscapeFileChange = (e) => {
        const selectedFile = e.target.files[0];

        if (selectedFile) {
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

            if (allowedTypes.includes(selectedFile.type)) {
                setImgLandscape(e.target.files[0]);
            } else {
                toast.error(translations[language].toasterror);
            }
        }
    };

    const resetThumbnail = () => {
        inputs.imgUrl = undefined;
        setImg(undefined);
        setImgPerc(0);
    };

    const resetVerticalThumbnail = () => {
        inputs.imgUrlVertical = undefined;
        setImgVertical(undefined);
        setImgVerticalPerc(0);
    };

    const resetLandscapeThumbnail = () => {
        inputs.imgUrlLandscape = undefined;
        setImgLandscape(undefined);
        setImgLandscapePerc(0);
    };


    const uploadFile = (file, urlType) => {
        const storage = getStorage(app);
        const fileName = new Date().getTime() + file.name;
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const progress =
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                if (urlType === "imgUrl") {
                    setImgPerc(Math.round(progress));
                } else if (urlType === "imgUrlLandscape") {
                    setImgLandscapePerc(Math.round(progress));
                } else if (urlType === "imgUrlVertical") {
                    setImgVerticalPerc(Math.round(progress));
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
            (error) => { console.error('Error al subir el archivo:', error); },
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
        img && uploadFile(img, "imgUrl");
    }, [img]);

    useEffect(() => {
        imgLandscape && uploadFile(imgLandscape, "imgUrlLandscape");
    }, [imgLandscape]);

    useEffect(() => {
        imgVertical && uploadFile(imgVertical, "imgUrlVertical");
    }, [imgVertical]);

    // LANGUAGE
    const [selectedLanguage, setSelectedLanguage] = useState(video?.language);
    const [selectedSubtitle, setSelectedSubtitle] = useState([]);
    const [subtitleValidationError, setSubtitleValidationError] = useState(false);
    const [subtitleNextValidationError, setSubtitleNextValidationError] = useState(false);

    const handleLanguageChange = (language) => {
        setSelectedLanguage(language);

        setInputs((prev) => {
            return { ...prev, language: language };
        });
    };

    const handleSubtitleChange = (subtitle) => {
        setSelectedSubtitle(subtitle);

        setInputs((prev) => {
            return { ...prev, subtitles: subtitle };
        });
    };

    // VISIBILITY
    const [privateSelected, setPrivateSelected] = useState(false);
    const [savedEmails, setSavedEmails] = useState([]);
    const [SharePrivate, setSharePrivate] = useState([]);
    const [showSharePrivate, setshowSharePrivate] = useState(false);

    const handlePrivacyClick = (privacyType) => {
        setInputs((prev) => {
            return { ...prev, privacy: privacyType };
        });
    };
    useEffect(() => {
        setPrivateSelected(false);
        if (inputs.privacy === 'private') {
            setPrivateSelected(true);
        }
        else {
            setPrivateSelected(false);
        }
    }, [inputs.privacy]);

    const handleSharePrivate = () => {
        setshowSharePrivate(!showSharePrivate);
    };

    const handleSharePrivateChange = (emails) => {
        setSavedEmails(emails);
        setInputs((prev) => {
            return { ...prev, allowedUsers: emails };
        });
    };

    // SAVE
    const handleSave = async () => {
        const normalizedTags = inputs?.tags === undefined ? '' : inputs.tags.split(',').map(tag => tag.trim().toLowerCase());

        try {
            const response = await toast.promise(
                axios.put(`/videos/${video?._id}/update`, {
                    privacy: inputs?.privacy === video?.privacy ? undefined : inputs?.privacy,
                    title: inputs?.title === video?.title ? undefined : inputs?.title,
                    desc: inputs?.desc === video?.desc ? undefined : inputs?.desc,
                    tags: inputs?.tags === undefined ? undefined : normalizedTags,
                    imgUrl: inputs?.imgUrl !== undefined ? inputs?.imgUrl : undefined,
                    imgUrlVertical: inputs?.imgUrlVertical !== undefined ? inputs?.imgUrlVertical : undefined,
                    imgUrlLandscape: inputs?.imgUrlLandscape !== undefined ? inputs?.imgUrlLandscape : undefined,
                    language: inputs?.language === video?.language ? null : inputs?.language,
                    subtitles: inputs?.subtitles !== undefined ? inputs?.subtitles : undefined,
                }), {
                pending: translations[language].toastpending,
                success: translations[language].toastsuccess,
                error: translations[language].toasterrorpromise
            }
            );
            closePopup();
            setFetchUpdated(true);

        } catch (err) {
            console.error(err);
        }
    };



    return (
        <ContainerBg>
            <Container>

                <Header>
                    <HeaderFlex>
                        <HeaderTitle> {translations[language].updatevideo} </HeaderTitle>
                        <ButtonSave onClick={handleSave}>
                            {translations[language].save}
                        </ButtonSave>
                        <HeaderCloseX src={CloseXGr} onClick={closePopup} language={language} />
                    </HeaderFlex>

                    <SectionContainer>
                        <SectionItem
                            onClick={() => {
                                setEditSection(editSections[0]);
                            }}
                            editSection={editSection === editSections[0] ? true : false}
                        >
                            {translations[language].general}
                        </SectionItem>

                        <SectionItem
                            onClick={() => {
                                setEditSection(editSections[1]);
                            }}
                            editSection={editSection === editSections[1] ? true : false}
                        >
                            {translations[language].thumbnails}
                        </SectionItem>

                        <SectionItem
                            onClick={() => {
                                setEditSection(editSections[2]);
                            }}
                            editSection={editSection === editSections[2] ? true : false}
                        >
                            {translations[language].language}
                        </SectionItem>
                        <SectionItem
                            onClick={() => {
                                setEditSection(editSections[3]);
                            }}
                            editSection={editSection === editSections[3] ? true : false}
                        >
                            {translations[language].privacy}
                        </SectionItem>

                    </SectionContainer>

                </Header>

                <ContentContainer>

                    {editSection === editSections[0] && (
                        <>
                            <Label> {translations[language].general} </Label>
                            <InputContainer>
                                <Input
                                    type="text"
                                    placeholder={video?.title}
                                    name="title"
                                    onChange={handleChangeTitle}
                                    value={inputs.title !== undefined ? inputs.title : video?.title}
                                />
                                <TitleInput> {translations[language].videotitle} </TitleInput>
                                <TitleCharCountInput> {inputs.title === undefined ? video?.title?.length : inputs.title?.length}/150 </TitleCharCountInput>
                            </InputContainer>

                            <InputContainer>
                                <Desc
                                    placeholder={video?.desc}
                                    name="desc"
                                    onChange={handleChangeDesc}
                                    value={inputs.desc !== undefined ? inputs.desc : video?.desc}
                                />
                                <TitleInput style={{ background: inputs.desc?.length > 0 ? 'rgba(31, 30, 30)' : '', borderRadius: '8px', marginLeft: '-5px', padding: '5px', zIndex: '4' }}>{translations[language].videodesc}</TitleInput>
                                <DescCharCountInput style={{ background: inputs.desc?.length > 0 ? 'rgba(31, 30, 30)' : '', bottom: '25px', borderRadius: '8px', marginRight: '-5px', padding: '5px', zIndex: '4' }}> {inputs.desc === undefined ? video?.desc?.length : inputs.desc?.length}/500 </DescCharCountInput>
                            </InputContainer>

                            <InputContainer style={{ marginBottom: '0px' }}>
                                <Input
                                    type="text"
                                    placeholder={video?.tags?.length > 0 ? video?.tags : 'Add tags to your video...'}
                                    name="tags"
                                    onChange={handleChangeTags}
                                    value={inputs.tags !== undefined ? inputs.tags : video?.tags}
                                />
                                <TitleInput> {translations[language].videotags} </TitleInput>
                                <TitleCharCountInput> {inputs.tags === undefined ? video?.tags?.length : inputs.tags?.length}/120 </TitleCharCountInput>
                            </InputContainer>
                        </>
                    )}

                    {editSection === editSections[1] && (
                        <>
                            <TitleAndPreview>
                                <Label style={{ marginBottom: '5px' }}> {translations[language].thumbnail} </Label>
                            </TitleAndPreview>


                            {imgPerc > 0 ? (
                                imgPerc < 100 ? (
                                    <div style={{ display: 'flex', marginBottom: '2px' }}>
                                        <UploadImage imgPerc={imgPerc}>{translations[language].uploading} {imgPerc}%</UploadImage>
                                    </div>
                                ) : (
                                    <div style={{ display: 'flex', marginBottom: '2px' }}>
                                        <UploadImage imgPerc={imgPerc}>{translations[language].thumbnailss}</UploadImage>
                                        <SideDropdownImg src={ResetIcon} onClick={resetThumbnail} />
                                    </div>
                                )
                            ) : (
                                <div style={{ display: 'flex', marginTop: '2px', }}>
                                    <InputImage
                                        type="file"
                                        accept="image/jpeg, image/png, image/webp"
                                        onChange={(e) => handleThumbnailFileChange(e)}
                                    />
                                </div>
                            )}


                            <TitleAndPreview>
                                <Label style={{ marginBottom: '5px', marginTop: '30px' }}> {translations[language].vthumbnail} </Label>
                            </TitleAndPreview>

                            {imgVerticalPerc > 0 ? (
                                imgVerticalPerc < 100 ? (
                                    <div style={{ display: 'flex', marginBottom: '9px' }}>
                                        <UploadImage imgPerc={imgPerc}>{translations[language].uploading} {imgVerticalPerc}%</UploadImage>
                                    </div>
                                ) : (
                                    <div style={{ display: 'flex', marginBottom: '9px' }}>
                                        <UploadImage imgPerc={imgPerc}>{translations[language].vthumbnailss}</UploadImage>
                                        <SideDropdownImg src={ResetIcon} onClick={resetVerticalThumbnail} />
                                    </div>
                                )
                            ) : (
                                <div style={{ display: 'flex', marginBottom: '7px', marginTop: '2px' }}>
                                    <InputImage
                                        type="file"
                                        accept="image/jpeg, image/png, image/webp"
                                        onChange={(e) => handleVerticalFileChange(e)}
                                    />


                                </div>
                            )}
                            <TitleAndPreviewLandscape imgPerc={imgPerc} imgVerticalPerc={imgVerticalPerc}>

                                <TitleAndPreview>
                                    <Label style={{ marginBottom: '5px', marginTop: '30px' }}> {translations[language].lthumbnail} </Label>
                                </TitleAndPreview>

                            </TitleAndPreviewLandscape>

                            {imgLandscapePerc > 0 ? (
                                imgLandscapePerc < 100 ? (
                                    <div>
                                        <UploadImage imgPerc={imgPerc}>{translations[language].uploading} {imgLandscapePerc}%</UploadImage>
                                    </div>
                                ) : (
                                    <div style={{ display: 'flex' }}>
                                        <UploadImage imgPerc={imgPerc}>{translations[language].lthumbnailss}</UploadImage>
                                        <SideDropdownImg src={ResetIcon} onClick={resetLandscapeThumbnail} />
                                    </div>
                                )
                            ) : (
                                <div style={{ display: 'flex', marginTop: '6px' }}>
                                    <InputImage
                                        type="file"
                                        accept="image/jpeg, image/png, image/webp"
                                        onChange={(e) => handleLandscapeFileChange(e)}
                                    />


                                </div>
                            )}
                        </>
                    )}

                    {editSection === editSections[2] && (
                        <ContainerLanguageSub>
                            <Label> {translations[language].language} </Label>

                            <SelecterAndFlags>
                                <div style={{ marginLeft: '20px' }}>
                                    <DropdownLanguage selectedLanguage={selectedLanguage} onLanguageChange={handleLanguageChange} />
                                </div>

                                {selectedLanguage === 'EN' && (
                                    <>
                                        <FlagsImg src={USAflag} alt="United States" title="United States" />
                                        <FlagsImg src={UKflag} alt="United Kingdom" title="United Kingdom" />
                                        <FlagsImg src={CANADAflag} alt="Canada" title="Canada" />
                                        <FlagsImg src={AUSTRALIAflag} alt="Australia" title="Australia" />
                                    </>
                                )}
                                {selectedLanguage === 'ES' && (
                                    <>
                                        <FlagsImg src={RDflag} alt="Dominican Republic" title="Dominican Republic" />
                                        <FlagsImg src={SPAINflag} alt="Spain" title="Spain" />
                                        <FlagsImg src={MEXICOflag} alt="Mexico" title="Mexico" />
                                        <FlagsImg src={ARGENTINAflag} alt="Argentina" title="Argentina" />
                                    </>
                                )}
                                {selectedLanguage === 'FR' && (
                                    <>
                                        <FlagsImg src={FRANCEflag} alt="France" title="France" />
                                        <FlagsImg src={CANADAflag} alt="Canada" title="Canada" />
                                        <FlagsImg src={BELGIUMflag} alt="Belgium" title="Belgium" />
                                        <FlagsImg src={SWITZERLANDflag} alt="Switzerland" title="Switzerland" />
                                    </>
                                )}
                                {selectedLanguage === 'PT' && (
                                    <>
                                        <FlagsImg src={BRAZILflag} alt="Brazil" title="Brazil" />
                                        <FlagsImg src={PORTUGALflag} alt="Portugal" title="Portugal" />
                                        <FlagsImg src={ANGOLAflag} alt="Angola" title="Angola" />
                                        <FlagsImg src={MOZAMBIQUEflag} alt="Mozambique" title="Mozambique" />
                                    </>
                                )}
                                {selectedLanguage === 'RU' && (
                                    <>
                                        <FlagsImg src={RUSSIAflag} alt="Russia" title="Russia" />
                                        <FlagsImg src={UKRAINEflag} alt="Ukraine" title="Ukraine" />
                                        <FlagsImg src={BELARUSflag} alt="Belarus" title="Belarus" />
                                        <FlagsImg src={KAZAKHSTANflag} alt="Kazakhstan" title="Kazakhstan" />
                                    </>
                                )}
                                {selectedLanguage === 'ZH' && (
                                    <>
                                        <FlagsImg src={CHINAflag} alt="China" title="China" />
                                        <FlagsImg src={SINGAPOREflag} alt="Singapore" title="Singapore" />
                                        <FlagsImg src={MALAYSIAflag} alt="Malaysia" title="Malaysia" />
                                        <FlagsImg src={TAIWANflag} alt="Taiwan" title="Taiwan" />
                                    </>
                                )}
                                {selectedLanguage === 'JP' && (
                                    <>
                                        <FlagsImg src={JAPANflag} alt="Japan" title="Japan" />
                                        <FlagsImg src={PHILIPPINESflag} alt="Philippines" title="Philippines" />
                                        <FlagsImg src={CHINAflag} alt="China" title="China" />
                                        <FlagsImg src={MALAYSIAflag} alt="Malaysia" title="Malaysia" />
                                    </>
                                )}
                                {selectedLanguage === 'KR' && (
                                    <>
                                        <FlagsImg src={SOUTHKOREAflag} alt="South Korea" title="South Korea" />
                                        <FlagsImg src={NORTHKOREAflag} alt="North Korea" title="North Korea" />
                                        <FlagsImg src={CHINAflag} alt="China" title="China" />
                                        <FlagsImg src={PHILIPPINESflag} alt="Philippines" title="Philippines" />
                                    </>
                                )}
                            </SelecterAndFlags>

                            <Label style={{ marginTop: '40px' }}> {translations[language].subtitle} </Label>


                            <DropDownSubtitlesContainer style={{ marginLeft: '20px', }}>

                                <DropdownSubtitle
                                    selectedSubtitle={selectedSubtitle}
                                    onSubtitleChange={handleSubtitleChange}
                                    setSubtitleValidationError={setSubtitleValidationError}
                                    subtitleNextValidationError={subtitleNextValidationError}
                                    setSubtitleNextValidationError={setSubtitleNextValidationError}
                                />

                            </DropDownSubtitlesContainer>
                        </ContainerLanguageSub>
                    )}

                    {editSection === editSections[3] && (
                        <>
                            <Label style={{ marginBottom: '20px' }}> {translations[language].visibility} </Label>
                            <ContainerSelectPrivacy>

                                <DivSelectPrivacy
                                    onClick={() => handlePrivacyClick("public")}
                                    selected={inputs.privacy === "public"}
                                >
                                    <DivSelectPrivacyColumn selected={inputs.privacy === "public"}>
                                        <DivSelectPrivacyFlex>
                                            <PrivacyImg src={PublicIcon} />{translations[language].public}
                                        </DivSelectPrivacyFlex>

                                        <PrivacyDesc>
                                            {translations[language].publictxt}
                                        </PrivacyDesc>
                                    </DivSelectPrivacyColumn>

                                </DivSelectPrivacy>

                                <DivSelectPrivacy
                                    onClick={() => handlePrivacyClick("private")}
                                    selected={inputs.privacy === "private"}
                                    privateSelected={privateSelected}
                                >
                                    <DivSelectPrivacyColumn selected={inputs.privacy === "private"}>
                                        <DivSelectPrivacyFlex>
                                            <PrivacyImg src={PrivateIcon} />{translations[language].private}
                                        </DivSelectPrivacyFlex>

                                        <PrivacyDesc privateSelected={privateSelected}>
                                            {translations[language].privatetxt}
                                        </PrivacyDesc>

                                        {privateSelected && (
                                            <>
                                                <SharePrivateButton onClick={handleSharePrivate}>
                                                    <SharePrivateImg src={SharePrivateIcon} /> {translations[language].invite}
                                                </SharePrivateButton>
                                            </>
                                        )}


                                    </DivSelectPrivacyColumn>

                                </DivSelectPrivacy>

                                <DivSelectPrivacy
                                    onClick={() => handlePrivacyClick("unlisted")}
                                    selected={inputs.privacy === "unlisted"}
                                >
                                    <DivSelectPrivacyColumn selected={inputs.privacy === "unlisted"}>
                                        <DivSelectPrivacyFlex>
                                            <PrivacyImg src={UnlistedIcon} />{translations[language].unlisted}
                                        </DivSelectPrivacyFlex>

                                        <PrivacyDesc>
                                            {translations[language].unlistedtxt}
                                        </PrivacyDesc>
                                    </DivSelectPrivacyColumn>

                                </DivSelectPrivacy>

                            </ContainerSelectPrivacy>

                        </>
                    )}

                </ContentContainer>
            </Container>

            {showSharePrivate && (
                <SharePrivateComponent SharePrivate={SharePrivate} onInviteChange={handleSharePrivateChange} togglePopup={handleSharePrivate} savedEmails={savedEmails} />
            )}

        </ContainerBg>


    );
};

export default EditVideo;