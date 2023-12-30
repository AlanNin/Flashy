import React, { useEffect, useState, useRef } from "react";
import styled, { keyframes } from "styled-components";
import {
    getStorage,
    ref,
    uploadBytesResumable,
    getDownloadURL,
} from "firebase/storage";
import app from "../firebase";
import axios from "axios";
import { useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import ReactTooltip from 'react-tooltip';
import ProgressMap from "./ProgressMap";
import PlaylistSelectBox from './PlaylistSelectBox';
import DropdownLanguage from './DropdownLanguage';
import DropdownSubtitle from './DropdownSubtitle';
import SharePrivateComponent from "./SharePrivateComponent";

// ASSETS
import UploadVid from "../assets/UploadVid.png"
import CloseXGr from "../assets/CloseXGr.png"
import ExpandArrow from "../assets/ExpandArrow.png";
import PublicIcon from "../assets/PublicIcon.png";
import PrivateIcon from "../assets/PrivateIcon.png";
import UnlistedIcon from "../assets/UnlistedIcon.png";
import SharePrivateIcon from "../assets/AllowUserIcon.png";
import PreviewIcono from "../assets/ReportarComentarioInfoIcono.png";
import ThumbnailPreview from "../assets/ThumbnailPreview.jpg";
import VerticalThumbnailPreview from "../assets/VerticalThumbnailPreview.jpg";
import LandscapeThumbnailPreview from "../assets/LandscapeThumbnailPreview.jpg";
import ResetIcon from "../assets/ResetIcon.png";

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
    z-index: 3;
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const Container = styled.div`
    position: relative;
    width: 35%;
    height: 90%;
    background: linear-gradient(#1D1D1D, #1A191B,#191819, #141214, #201D21   99% );
    color: ${({ theme }) => theme.text};
    padding: 20px 50px 0px 50px;;
    border-radius: 10px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
`;

const ContentContainer = styled.div`
    color: ${({ theme }) => theme.text};
    width: 100%;
    height: 100%;
    padding: 5px 50px 10px 50px;
    background: transparent;
    margin-left: -50px;
    overflow-y: auto;

    &::-webkit-scrollbar {
        width: 6px;
    }
        
    &::-webkit-scrollbar-thumb {
        border-radius: 15px;
    }
`;

const Wrapper = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding-bottom: ${({ step }) => (step === 1 ? "150px" : "0px")};
    position: relative;
  `;

const steps = [
    "Upload Video",
    "Details",
    "Thumbnails",
    "Elements",
    "Visibility",
];

const FixedTopMenu = styled.div`
    position: sticky;
    width: 100%;
    background: linear-gradient(#1D1D1D, #1A191B);
    z-index: 3;
    padding: 20px 50px;
    margin-top: -20px;
    margin-left: -50px;
    border-radius: 10px 10px 0px 0px;
    border-bottom: ${({ hasBorder }) => (hasBorder ? '1px solid rgba(0, 0, 0, 0.5)' : 'none')}; 
    box-shadow: ${({ hasBorder }) => (hasBorder ? '0px 4px 4px -2px rgba(0, 0, 0, 0.4)' : 'none')}; /* Agregamos la sombra abajo cuando tiene el borde */
`;

const FixedBottomMenu = styled.div`
    position: sticky;
    display: flex;
    width: 100%;
    background-color: rgba(8, 5, 8, 0.5);
    z-index: 3;
    padding: 15px 50px;
    bottom: 0px;
    margin-left: -50px;
    border-radius: 0px 0px 10px 10px;
`;

const Title = styled.h1`
  text-align: center;
  font-size: 28px;
  font-family: "Roboto Condensed", Helvetica;
  padding: ${({ step }) => (step > 0 ? "0px 0px 20px 0px" : "0px 0px 0px 0px")};
  border-bottom: ${({ step }) => (step > 0 ? "1px solid rgba(78, 79, 78)" : "none")};
`;

const Close = styled.img`
  position: absolute;
  top: 20px;
  right: 20px;
  cursor: pointer;
  width: 20px;
  height: 20px;
`;

// CONST PARA VARIOS STEPS

const Label = styled.label`
    font-size: 24px;
    font-weight: bold;
    font-family: "Roboto Condensed", Helvetica;
`;

const SubLabel = styled.label`
    margin-top: -15px;
    font-size: 16px;
    color: ${({ theme }) => theme.textSoft};
    font-weight: normal;
    font-family: "Roboto Condensed", Helvetica;
`;

const InputContainer = styled.div`
  position: relative;
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

const TitleInput = styled.label`
    position: absolute;
    top: 20px;
    left: 10px;
    font-size: 12px;
    color: ${({ emptyDescError, theme }) => (emptyDescError ? 'red' : theme.textSoft)};
    transform: translate(5px, -50%);
    pointer-events: none;
    transition: transform 0.2s ease-out;

    ${Input}:focus ~ & {
        color: rgba(153, 63, 176); /* Cambia a tu color deseado */
    }
`;

const TitleCharCountInput = styled.label`
  position: absolute;
  bottom: 20px;
  right: 15px;
  font-size: 12px;
  color: ${({ TitleCharCounter, theme }) => (TitleCharCounter > 150 ? 'red' : theme.textSoft)};
  transform: translate(0, 50%);
  pointer-events: none;
  transition: transform 0.2s ease-out;
`;

const DescCharCountInput = styled.label`
  position: absolute;
  bottom: 20px;
  right: 15px;
  font-size: 12px;
  color: ${({ DescCharCounter, theme }) => (DescCharCounter > 500 ? 'red' : theme.textSoft)};
  transform: translate(0, 50%);
  pointer-events: none;
  transition: transform 0.2s ease-out;
`;
const TagCharCountInput = styled.label`
  position: absolute;
  bottom: 20px;
  right: 15px;
  font-size: 12px;
  color: ${({ TagCharCounter, theme }) => (TagCharCounter > 120 ? 'red' : theme.textSoft)};
  transform: translate(0, 50%);
  pointer-events: none;
  transition: transform 0.2s ease-out;
`;

const Desc = styled.textarea`
    position: relative;
    border: 1px solid rgba(110, 110, 110, 0.5);
    border-color: ${({ emptyDescError }) => (emptyDescError ? 'red' : 'rgba(110, 110, 110, 0.5)')}; 
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
        border-color: ${({ emptyDescError }) => (emptyDescError ? 'red' : ' rgba(91, 32, 107)')};
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

// STEP 1: Upload Video

const DragAndDropDiv = styled.div`
    position: relative;
    border: 1px solid rgba(78, 79, 78);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    height: 100%;
    margin-bottom: 30px;
`;

const UploadIconDiv = styled.div`
    height: 80px;
    width: 80px;
    background: rgba(15, 15, 15, 0.8);
    border-radius: 50%;
    padding: 15px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    cursor: pointer;
`;

const UploadIcon = styled.img`
    height: 50px;
    width: 50px;
`;

const UploadIconText = styled.span`
    font-size: 18px;
    font-weight: normal;
    font-family: "Roboto Condensed", Helvetica;
    padding: 20px 0px 10px 00px;
    color: ${({ theme }) => theme.text};
`;

const UploadIconSubText = styled.span`
    font-size: 16px;
    font-weight: normal;
    font-family: "Roboto Condensed", Helvetica;
    margin-bottom: 20px;
    color: ${({ theme }) => theme.textSoft};
`;

const SelectFilesButton = styled.input`
    font-size: 16px;
    font-weight: bold;
    font-family: "Roboto Condensed", Helvetica; 
    overflow: hidden;
    width: 140px;
    margin-bottom: 70px;

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
        background: #7958a6; /* Cambia el color de fondo al pasar el ratón por encima */
    }
`;

const TermsAndConditionsDiv = styled.div`
    position: absolute;
    bottom: 20px;
    width: calc(100% - 40px);
    height: max-content;
`;

const Terms1 = styled.h1`
    font-size: 12px;
    font-weight: normal;
    font-family: "Roboto Condensed", Helvetica;
    color: ${({ theme }) => theme.textSoft};
    margin-bottom: 5px;
`;

const Terms2 = styled.h1`
    font-size: 12px;
    font-weight: normal;    
    font-family: "Roboto Condensed", Helvetica;
    color: ${({ theme }) => theme.textSoft};
`;

const TermsLinks = styled.span`
    color: rgb(158, 93, 176);
    cursor: pointer;
`;


const UploadIconLoadingDiv = styled.div`
    height: 100px;
    width: 100px;
    background: rgba(15, 15, 15, 0.8);
    border-radius: 50%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    margin-bottom: 100px;
    animation: ${fadeIn} 0.8s ease-in-out; /* Aplica la animación de desvanecimiento */
`;

const rotate = keyframes`
  to {
    transform: rotate(360deg);
  }
`;
const LoadingCircle = styled.div`
    border: 4px solid #f3f3f3;
    border-top: 4px solid #7932a8;
    border-radius: 50%;
    height: 100px;
    width: 100px;
    margin-bottom: 100px;
    animation: ${rotate} 1s linear infinite;
    > * {
        transform: none !important;
    } 
`;

const RotateWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const UploadTextDiv = styled.div`
  position: absolute;
  margin: 0;
  gap: 5px;
  display: flex;
  flex-direction: column;
  margin-bottom: 100px;
`;

const UploadText = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.text};
  font-weight: bold;    
  font-family: "Roboto Condensed", Helvetica;
`;

// STEP 1: Video Details


const ButtonNextUpload = styled.button`
  border-radius: 3px;
  border: none;
  padding: 10px 20px;
  font-weight: 500;
  cursor: ${({ buttonNextDisable }) => (buttonNextDisable ? 'not-allowed' : 'pointer')};
  color:  ${({ buttonNextDisable, theme }) => (buttonNextDisable ? theme.textSoft : theme.text)};
  background-color: ${({ buttonNextDisable, theme }) => (buttonNextDisable ? theme.soft : 'rgba(82, 41, 73, 0.7)')};
  margin-right: -20px;
  margin-left: ${({ step }) => (step > 1 ? "none" : "auto")};
`;

const ButtonBack = styled.button`
    border-radius: 3px;
    border: none;
    padding: 10px 10px;
    font-weight: bold;
    cursor: pointer;
    background-color: transparent;
    color: ${({ theme }) => theme.text};
    margin-left: auto;
    margin-right: 10px;
`;

const LabelPlaylist = styled.label`
    margin-top: 10px;
    font-size: 24px;
    font-weight: bold;
    font-family: "Roboto Condensed", Helvetica;
`;

const SubLabelPlaylist = styled.label`
    margin-top: -15px;
    font-size: 16px;
    color: ${({ theme }) => theme.textSoft};
    font-weight: normal;
    font-family: "Roboto Condensed", Helvetica;
`;

const PlaylistSelectBoxContainer = styled.div`
    padding-bottom: 70px;
`;

// STEP 2: Video Details

const InputImage = styled.input`
  font-size: 16px;
  font-weight: bold;
  font-family: "Roboto Condensed", Helvetica; 
  overflow: hidden;
  width: 140px;
  margin-top: -15px;
  margin-bottom: 30px;

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
    margin-top: -15px;
    margin-bottom: ${({ imgPerc }) => (imgPerc > 0 ? '43px' : '13px')}; 
    
`;

const LabelStep2Thumbnail = styled.label`
    font-size: 22px;
    font-weight: normal;
    font-family: "Roboto Condensed", Helvetica;
    margin-top: 25px;
    color: ${({ emptyThumbnailError }) => (emptyThumbnailError ? 'red' : 'white')}; 
`;

const LabelStep2VerticalThumbnail = styled.label`
    font-size: 22px;
    font-weight: normal;
    font-family: "Roboto Condensed", Helvetica;
    margin-top: 25px;
    color: ${({ emptyThumbnailVerticalError }) => (emptyThumbnailVerticalError ? 'red' : 'white')};  
`;

const LabelStep2LandscapeThumbnail = styled.label`
    font-size: 22px;
    font-weight: normal;
    font-family: "Roboto Condensed", Helvetica;
    margin-top: 25px;
    color: ${({ emptyThumbnailLandscapeError }) => (emptyThumbnailLandscapeError ? 'red' : 'white')}; 
`;

const SubLabelStep2 = styled.label`
    margin-top: -12px;
    font-size: 16px;
    color: ${({ theme }) => theme.textSoft};
    font-weight: normal;
    font-family: "Roboto Condensed", Helvetica;
    margin-bottom: 15px;
`;

const TitleAndPreview = styled.div`
    display:flex;
`;

const TitleAndPreviewLandscape = styled.div`
    display: flex;
    margin-top: ${({ imgPerc, imgVerticalPerc }) => (imgPerc === 0 && imgVerticalPerc > 0 ? '30px' : '-7px')}; 
`;

const PreviewDiv = styled.div`
  position: relative;
  display: inline-block;
  margin-top: 28px;
`;

const ShowPreviewStyles = styled.div`
    background: rgba(15, 12, 18);
    height: max-content;
    width: max-content;
    position: absolute;
    margin-left: 38px;
    top: -8px;
    transition: opacity 0.2s ease, visibility 0.2s ease;
    padding 5px 8px;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    z-index: 4;
`;

const ShowPreviewDiv = styled(ShowPreviewStyles)`
    opacity: ${({ showPreview }) => (showPreview ? '1' : '0')};
    visibility: ${({ showPreview }) => (showPreview ? 'visible' : 'hidden')};
`;

const ShowPreviewVerticalDiv = styled(ShowPreviewStyles)`
    opacity: ${({ showVerticalPreview }) => (showVerticalPreview ? '1' : '0')};
    visibility: ${({ showVerticalPreview }) => (showVerticalPreview ? 'visible' : 'hidden')};
`;

const ShowPreviewLandscapeDiv = styled(ShowPreviewStyles)`
    opacity: ${({ showLandscapePreview }) => (showLandscapePreview ? '1' : '0')};
    visibility: ${({ showLandscapePreview }) => (showLandscapePreview ? 'visible' : 'hidden')};
    margin-top: 45px;
    padding:  5px 0px 0px 0px;
`;

const PreviewIcon = styled.img`
  width: 21px;
  height: 21px;
  margin-left: 10px;
  position: absolute;
`;

const PreviewText = styled.span`
  color: ${({ theme }) => theme.text};
  font-size: 28px;
  font-family: "Roboto Condensed", Helvetica;
  font-weight: bold;
  width: max-content;
  text-align: center;
  margin: auto;
  padding: 10px 0px;
`;

const PreviewImg = styled.img`
  height: max-content;
  width: max-content;
  padding-bottom:
`;


const ResetDiv = styled.img`
  display: flex;
`;


const SideDropdownImg = styled.img`
  height: 18px;
  width: 18px;
  cursor: pointer;
  margin-top: -13px;
  margin-left: 8px;
`;


// STEP 3: Elements

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
    padding-bottom: 100px;
`;

// STEP 4


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
    font-size: 16px;
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

// UPLOADING VIDEO

const rotateUploading = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

const LoadingContainerUploading = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: max-content;
  height: max-content;
  margin-top: 20px;
`;

const LoadingCircleUploading = styled.div`
  border: 6px solid #f3f3f3;
  border-top: 6px solid #f50076;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  animation: ${rotateUploading} 1s linear infinite;
`;

const ContainerUploading = styled.div`
    position: relative;
    width: 15%;
    height: 30%;
    background: linear-gradient(#1D1D1D, #1A191B,#191819, #141214, #201D21   99% );
    color: ${({ theme }) => theme.text};
    padding: 20px 50px 0px 50px;
    border-radius: 10px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
`;

const WrapperUploading = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 20px;
    position: relative;
    align-items: center;
    text-align: center;
  `;

const ContainerProcessConfirmBg = styled.div`
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
const ContainerProcessConfirm = styled.div`
    position: absolute;
    width: max-content;
    height: max-content;
    background: #1D1D1D;
    color: ${({ theme }) => theme.text};
    padding: 20px 20px 20px 30px;
    border-radius: 10px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
`;

const WrapperProcessConfirm = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 20px;
    position: relative;
    align-items: left;
    text-align: center;
  `;

const SubLabelProcessConfirm = styled.label`
  margin-top: -15px;
  font-size: 16px;
  color: ${({ theme }) => theme.textSoft};
  font-weight: normal;
  font-family: "Roboto Condensed", Helvetica;
  width: 450px;
  word-wrap: break-word;
  text-align: left;
`;

const ButtonsContainer = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  width: 100%;
  margin-top: 20px;
`;

const NoProcessButton = styled.div`
  margin-right: 10px;
  cursor: pointer;
  &:hover {
    background: rgba(45, 45, 45);
  }
  padding: 8px 10px;
  border-radius: 10px;
`;

const YesProcessButton = styled.div`
  cursor: pointer;
  background: rgba(82, 41, 73, 0.7);
  &:hover {
    background: rgba(124, 83, 115, 0.15);
  }
  padding: 8px 10px;
  border-radius: 10px;
`;

const LabelFormat = styled.h1`
    font-size: 18px;
    font-weight: normal;
    font-family: "Roboto Condensed", Helvetica;
    margin-left: 15px;
    margin-top: -9px;
    color:  red;
`;

const ThumbnailLabelFormat = styled(LabelFormat)`
    display: ${({ formatThumbnailError }) => (formatThumbnailError ? 'block' : 'none')}; 
`;

const VerticalThumbnailLabelFormat = styled(LabelFormat)`
    display: ${({ formatThumbnailVerticalError }) => (formatThumbnailVerticalError ? 'block' : 'none')}; 
`;

const LandscapeThumbnailLabelFormat = styled(LabelFormat)`
    display: ${({ formatThumbnailLandscapeError }) => (formatThumbnailLandscapeError ? 'block' : 'none')}; 
`;

const Upload = ({ setOpen }) => {
    const [img, setImg] = useState(undefined);
    const [imgVertical, setImgVertical] = useState(undefined);
    const [imgLandscape, setImgLandscape] = useState(undefined);
    const [video, setVideo] = useState(undefined);
    const [imgPerc, setImgPerc] = useState(0);
    const [imgVerticalPerc, setImgVerticalPerc] = useState(0);
    const [imgLandscapePerc, setImgLandscapePerc] = useState(0);
    const [videoPerc, setVideoPerc] = useState(0);
    const [inputs, setInputs] = useState({ privacy: 'public' });
    const [tags, setTags] = useState([]);
    const [step, setStep] = useState(0);
    const navigate = useNavigate()
    const [titleText, setTitleText] = useState("");
    const [defaultTitle, setDefaultTitle] = useState("");
    const [hasBorder, setHasBorder] = useState(false);
    const contentRef = useRef(null);
    const { currentUser } = useSelector((state) => state.user);
    const [selectedPlaylists, setSelectedPlaylists] = useState([]);
    const [selectedLanguage, setSelectedLanguage] = useState('');
    const [selectedSubtitle, setSelectedSubtitle] = useState([]);
    const [privateSelected, setPrivateSelected] = useState(false);
    const [SharePrivate, setSharePrivate] = useState([]);
    const [showSharePrivate, setshowSharePrivate] = useState(false);
    const [buttonNextDisable, setButtonNextDisable] = useState(false);
    const [emptyDescError, setEmptyDescError] = useState(false);
    const [emptyThumbnailError, setEmptyThumbnailError] = useState(false);
    const [emptyThumbnailVerticalError, setEmptyThumbnailVerticalError] = useState(false);
    const [emptyThumbnailLandscapeError, setEmptyThumbnailLandscapeError] = useState(false);
    const [emptyLanguageError, setEmptyLanguageError] = useState(false);
    const [savedEmails, setSavedEmails] = useState([]);
    const [showPreview, setShowPreview] = useState(false);
    const [showVerticalPreview, setShowVerticalPreview] = useState(false);
    const [showLandscapePreview, setShowLandscapePreview] = useState(false);
    const [TitleCharCounter, setTitleCharCounter] = useState(0);
    const [DescCharCounter, setDescCharCounter] = useState(0);
    const [TagCharCounter, setTagCharCounter] = useState(0);
    const [UploadingVideo, setUploadingVideo] = useState(false);
    const [ProcessConfirmPopup, setProcessConfirmPopup] = useState(false);
    const [renderingVideo, setRenderingVideo] = useState(false);
    const [formatThumbnailError, setFormatThumbnailError] = useState(false);
    const [formatThumbnailVerticalError, setFormatThumbnailVerticalError] = useState(false);
    const [formatThumbnailLandscapeError, setFormatThumbnailLandscapeError] = useState(false);

    const handleLanguageChange = (language) => {
        setEmptyLanguageError(false);
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

    const handlePlaylistChange = (playlistId, checked) => {
        setSelectedPlaylists((prevSelected) => {
            if (checked) {
                return [...prevSelected, playlistId];
            } else {
                return prevSelected.filter((id) => id !== playlistId);
            }
        });
    };

    const handleSharePrivate = () => {
        setshowSharePrivate(!showSharePrivate);
    };

    const handleSharePrivateChange = (emails) => {
        setSavedEmails(emails);
        setInputs((prev) => {
            return { ...prev, allowedUsers: emails };
        });
    };

    useEffect(() => {
        const handleScroll = () => {
            if (contentRef.current.scrollTop > 0 && !hasBorder) {
                setHasBorder(true);
            } else if (contentRef.current.scrollTop === 0 && hasBorder) {
                setHasBorder(false);
            }
        };

        contentRef.current.addEventListener('scroll', handleScroll);

        return () => {
            if (contentRef.current) {
                contentRef.current.removeEventListener('scroll', handleScroll);
            }
        };
    }, [hasBorder]);

    const handleChange = (e) => {
        setInputs((prev) => {
            return { ...prev, [e.target.name]: e.target.value };
        });
        if (e.target.name === "title") {
            setTitleText(e.target.value);
        }

    };

    // CHAR COUNTER VALIDATIONS
    useEffect(() => {
        if (inputs.title === undefined || inputs.title === '') {
            setTitleCharCounter(defaultTitle.length);
            return;
        }
        if (inputs.title !== undefined) {
            setTitleCharCounter(inputs.title.length);
        }
    }, [inputs.title, defaultTitle]);

    useEffect(() => {
        if (inputs.desc !== undefined) {
            setDescCharCounter(inputs.desc.length);
        }
    }, [inputs.desc]);

    useEffect(() => {
        if (inputs.tag !== undefined) {
            setTagCharCounter(inputs.tag.length);
        }
    }, [inputs.tag]);

    useEffect(() => {
        let disableButton = false;

        if (TitleCharCounter > 150 || DescCharCounter > 500 || TagCharCounter > 120 || inputs.desc === undefined || inputs.desc === '') {
            disableButton = true;
        }

        setButtonNextDisable(disableButton);
    }, [TitleCharCounter, DescCharCounter, TagCharCounter]);

    // STEPS AND BUTTON NEXT VALIDATIONS
    useEffect(() => {
        if (step === 1) {
            setButtonNextDisable(true);
            if (inputs.desc === undefined ||
                inputs.desc === "") {
                setButtonNextDisable(true);
            }
            else {
                setButtonNextDisable(false);
            }
        }
        if (step === 2) {
            setButtonNextDisable(true);
            if (inputs.imgUrl === undefined || inputs.imgUrlVertical === undefined || inputs.imgUrlLandscape === undefined) {
                setButtonNextDisable(true);
            }
            else {
                setButtonNextDisable(false);
            }
        }
        if (step === 3) {
            setButtonNextDisable(true);
            if (inputs.language === undefined) {
                setButtonNextDisable(true);
            }
            else {
                setButtonNextDisable(false);
            }
        }
        if (step === 4) {
            setButtonNextDisable(false);
        }
    }, [inputs, inputs.imgUrl, inputs.imgUrlVertical, inputs.imgUrlLandscape, step]);


    const handleTags = (e) => {
        const rawInput = e.target.value;
        const cleanedInput = rawInput.replace(/\s/g, '');
        setInputs({ ...inputs, tag: rawInput });
        setTags(cleanedInput.split(','));
    };

    const handleNext = () => {

        if (buttonNextDisable) {
            if (step === 0) {
                setStep((prevStep) => prevStep + 1);
            }
            if (step === 1) {
                setEmptyDescError(true);
            }
            if (step === 2 && imgPerc === 0) {
                setEmptyThumbnailError(true);
            }
            if (step === 2 && imgVerticalPerc === 0) {
                setEmptyThumbnailVerticalError(true);
            }
            if (step === 2 && imgLandscapePerc === 0) {
                setEmptyThumbnailLandscapeError(true);
            }
            if (step === 3) {
                setEmptyLanguageError(true);
            }
            return;
        }

        setStep((prevStep) => prevStep + 1);

        // Restablecer el scroll
        if (contentRef.current) {
            contentRef.current.scrollTop = 0;
        }
    };

    const handleBack = () => {
        setStep((prevStep) => prevStep - 1);
        // Restablecer el scroll
        if (contentRef.current) {
            contentRef.current.scrollTop = 0;
        }
    };

    const isLastStep = step === steps.length - 1;

    const uploadFile = (file, urlType) => {
        const storage = getStorage(app);
        const fileName = new Date().getTime() + file.name;
        const defaultTitleWithoutExtension = file.name.split('.').slice(0, -1).join('.');
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
                } else {
                    setVideoPerc(Math.round(progress));
                    setDefaultTitle(defaultTitleWithoutExtension);
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
        video && uploadFile(video, "videoUrl");
    }, [video]);

    useEffect(() => {
        img && uploadFile(img, "imgUrl");
    }, [img]);

    useEffect(() => {
        imgLandscape && uploadFile(imgLandscape, "imgUrlLandscape");
    }, [imgLandscape]);

    useEffect(() => {
        imgVertical && uploadFile(imgVertical, "imgUrlVertical");
    }, [imgVertical]);


    const handleUpload = async (e) => {
        setUploadingVideo(true);
        try {
            // Subir el video y obtener la respuesta
            if (inputs.title === undefined) {
                inputs.title = defaultTitle;
            }

            const uploadResponse = await axios.post("/videos", { ...inputs, tags, renderingVideo });

            // Verificar si la carga fue exitosa
            if (uploadResponse.status === 200) {
                // Obtener el ID del video recién subido
                const userId = currentUser?._id;
                const userEmail = currentUser?.email;
                const videoId = uploadResponse.data._id;

                // Iterar sobre las listas de reproducción seleccionadas y agregar el video a cada una
                for (const playlist of selectedPlaylists) {
                    try {
                        if (playlist) {
                            await axios.put(`/users/${userId}/playlists/videos/${videoId}`, {
                                playlistId: playlist,
                            });
                        } else {
                            console.error("Playlist ID is undefined:", playlist);
                        }
                    } catch (error) {
                        console.error(`Error adding video to playlist ${playlist}:`, error);
                    }
                }

                // ALLOW UPLOADER TO PRIVATE VIDEO IF ITS IS PRIVATE
                if (inputs.privacy === 'private') {
                    await axios.post(`/videos/${videoId}/allowedUsers`, {
                        email: userEmail,
                    });
                }

                // Cerrar el modal u realizar otras acciones necesarias
                setOpen(false);
                setUploadingVideo(false);

                // Navegar a la página del video recién subido
                navigate(`/video/${videoId}`);
            }
        } catch (error) {
            console.error("Error uploading video:", error);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();

        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile) {
            setVideo(droppedFile);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const fileInputRef = useRef(null);

    const handleIconUploadClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setVideo(e.target.files[0]);
        }
    };

    const TermsFlashy = () => {
        setOpen(false);
        navigate(`/Terms/`);
        window.location.reload();
    };

    const CommunityFlashy = () => {
        setOpen(false);
        navigate(`/Community/`);
        window.location.reload();
    };

    useEffect(() => {
        if (videoPerc === 100) {
            handleNext();
        }
    }, [videoPerc]);

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

    const handleShowPreview = () => {
        setShowPreview(true);
    };

    const handleHidePreview = () => {
        setShowPreview(false);
    };

    const handleVerticalShowPreview = () => {
        setShowVerticalPreview(true);
    };

    const handleVerticalHidePreview = () => {
        setShowVerticalPreview(false);
    };


    const handleLandscapeShowPreview = () => {
        setShowLandscapePreview(true);
    };

    const handleLandscapeHidePreview = () => {
        setShowLandscapePreview(false);
    };

    const handlePublishPressed = () => {
        setProcessConfirmPopup(true);
    };

    const handleRender = () => {
        setRenderingVideo(true);
    };

    useEffect(() => {
        if (renderingVideo) {
            setProcessConfirmPopup(false);
            handleUpload();
        }
    }, [renderingVideo]);

    const handleNotThisTime = () => {
        setRenderingVideo(false);
        setProcessConfirmPopup(false);
        handleUpload();
    };

    const resetThumbnail = () => {
        inputs.imgUrl = undefined;
        setImg(undefined);
        setImgPerc(0);
        setFormatThumbnailError(false);
    };

    const resetVerticalThumbnail = () => {
        inputs.imgUrlVertical = undefined;
        setImgVertical(undefined);
        setImgVerticalPerc(0);
        setFormatThumbnailVerticalError(false);
    };

    const resetLandscapeThumbnail = () => {
        inputs.imgUrlLandscape = undefined;
        setImgLandscape(undefined);
        setImgLandscapePerc(0);
        setFormatThumbnailLandscapeError(false);
    };

    const handleThumbnailFileChange = (e) => {
        const selectedFile = e.target.files[0];

        if (selectedFile) {
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

            if (allowedTypes.includes(selectedFile.type)) {
                setImg(selectedFile);
                setFormatThumbnailError(false);
                setEmptyThumbnailError(false);

            } else {
                setFormatThumbnailError(true);
            }
        }
    };

    const handleVerticalFileChange = (e) => {
        const selectedFile = e.target.files[0];

        if (selectedFile) {
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

            if (allowedTypes.includes(selectedFile.type)) {
                setImgVertical(e.target.files[0]);
                setFormatThumbnailVerticalError(false);
                setEmptyThumbnailVerticalError(false);

            } else {
                setFormatThumbnailVerticalError(true);
            }
        }
    };

    const handleLandscapeFileChange = (e) => {
        const selectedFile = e.target.files[0];

        if (selectedFile) {
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

            if (allowedTypes.includes(selectedFile.type)) {
                setImgLandscape(e.target.files[0]);
                setFormatThumbnailLandscapeError(false);
                setEmptyThumbnailLandscapeError(false);

            } else {
                setFormatThumbnailLandscapeError(true);
            }
        }
    };

    return (
        <ContainerBg>

            {ProcessConfirmPopup && (
                <ContainerProcessConfirmBg>
                    <ContainerProcessConfirm>
                        <WrapperProcessConfirm>
                            <Label style={{ marginTop: '5px', fontSize: '28px', textAlign: 'left' }}> Video Rendering </Label>
                            <SubLabelProcessConfirm style={{ marginTop: '0px', fontSize: '16px' }}>
                                Rendering your video will create different resolutions for the video player,
                                but will take significantly longer to be uploaded.
                            </SubLabelProcessConfirm>
                            <ButtonsContainer>
                                <NoProcessButton onClick={handleNotThisTime}> Not this time </NoProcessButton>
                                <YesProcessButton onClick={handleRender}> Render </YesProcessButton>
                            </ButtonsContainer>
                        </WrapperProcessConfirm>
                    </ContainerProcessConfirm>
                </ContainerProcessConfirmBg>
            )}

            {UploadingVideo ? (
                <ContainerUploading>
                    <ContentContainer ref={contentRef}>
                        <WrapperUploading>
                            <Label style={{ marginTop: '5px', fontSize: '28px' }}> Uploading Video </Label>
                            <SubLabel style={{ marginTop: '0px', fontSize: '17px' }}> Thank you for your patience! Your video is currently being uploaded and will be available shortly </SubLabel>
                            <LoadingContainerUploading>
                                <LoadingCircleUploading />
                            </LoadingContainerUploading>
                        </WrapperUploading>
                    </ContentContainer>
                </ContainerUploading>
            ) : (


                <Container>
                    <FixedTopMenu hasBorder={hasBorder}>
                        <Close onClick={() => setOpen(false)} src={CloseXGr} />
                        <Title step={step}>{step === 0 ? steps[step] : inputs.title || defaultTitle}</Title>
                        <ProgressMap steps={steps} currentStep={step} />
                    </FixedTopMenu>

                    <ContentContainer ref={contentRef}>
                        <Wrapper step={step}>

                            {step === 0 && (
                                <>
                                    <DragAndDropDiv
                                        onDrop={handleDrop}
                                        onDragOver={handleDragOver}
                                        videoPerc={videoPerc}
                                    >

                                        {videoPerc > 0 ? (
                                            <>
                                                <UploadIconLoadingDiv>
                                                    <RotateWrapper>
                                                        <LoadingCircle />
                                                        <UploadTextDiv>
                                                            <UploadText>Uploading</UploadText>
                                                            <UploadText>{videoPerc}%</UploadText>
                                                        </UploadTextDiv>
                                                    </RotateWrapper>
                                                </UploadIconLoadingDiv>
                                            </>
                                        ) : (
                                            <>
                                                <UploadIconDiv onClick={handleIconUploadClick}>
                                                    <UploadIcon src={UploadVid} />
                                                </UploadIconDiv>
                                                <UploadIconText>Drag & Drop your video file to upload it</UploadIconText>
                                                <UploadIconSubText>You can also open the file explorer in the button below</UploadIconSubText>
                                                <SelectFilesButton
                                                    type="file"
                                                    accept="video/*"
                                                    ref={fileInputRef}
                                                    onChange={handleFileChange}
                                                />
                                            </>
                                        )}
                                        <TermsAndConditionsDiv>
                                            <Terms1>
                                                Upon submitting videos to Flashy, you agree to adhere to Flashy's
                                                <TermsLinks onClick={TermsFlashy}> Terms of Service </TermsLinks>
                                                and <TermsLinks onClick={CommunityFlashy}> Community Guidelines</TermsLinks>.
                                            </Terms1>
                                            <Terms2>
                                                Please ensure that you do not infringe on the copyright or privacy rights of others.
                                            </Terms2>
                                        </TermsAndConditionsDiv>

                                    </DragAndDropDiv>
                                </>
                            )}
                            {step === 1 && (
                                <>
                                    <Label style={{ marginTop: '0px' }}> Details </Label>
                                    <SubLabel> Provide the details of your video </SubLabel>

                                    <InputContainer>
                                        <Input
                                            type="text"
                                            placeholder={`${defaultTitle ? `Your current video title by default is ${defaultTitle}` : 'Add a Flashy title to your video...'}`}
                                            name="title"
                                            onChange={handleChange}
                                            value={inputs.title !== undefined ? inputs.title : defaultTitle}
                                        />
                                        <TitleInput> Video Title (Required) </TitleInput>
                                        <TitleCharCountInput TitleCharCounter={TitleCharCounter}>{TitleCharCounter}/150</TitleCharCountInput>
                                    </InputContainer>
                                    <InputContainer>
                                        <Desc
                                            placeholder="Write about your video, let the viewers know what's great about it..."
                                            name="desc"
                                            rows={8}
                                            onChange={(e) => {
                                                handleChange(e);
                                                setEmptyDescError(false);
                                            }}
                                            value={inputs.desc}
                                            emptyDescError={emptyDescError}
                                        />
                                        <TitleInput emptyDescError={emptyDescError}> Video Description (Required) </TitleInput>
                                        <DescCharCountInput DescCharCounter={DescCharCounter}>{DescCharCounter}/500</DescCharCountInput>
                                    </InputContainer>
                                    <InputContainer>
                                        <Input
                                            type="text"
                                            name="tag"
                                            placeholder="Separate the tags with commas (example: movie, anime)..."
                                            onChange={handleTags}
                                            value={inputs.tag}
                                        />
                                        <TitleInput> Video Tags (Optional) </TitleInput>
                                        <TagCharCountInput TagCharCounter={TagCharCounter}>{TagCharCounter}/120</TagCharCountInput>
                                    </InputContainer>

                                    <LabelPlaylist> Playlist </LabelPlaylist>
                                    <SubLabelPlaylist> Add your video to a playlist to organize your content for viewers or yourself.</SubLabelPlaylist>


                                    <PlaylistSelectBoxContainer>
                                        <PlaylistSelectBox
                                            userId={currentUser?._id}
                                            onPlaylistChange={handlePlaylistChange}
                                            selectedPlaylists={selectedPlaylists}
                                        />
                                    </PlaylistSelectBoxContainer>


                                </>
                            )}

                            {step === 2 && (
                                <>
                                    <TitleAndPreview>
                                        <LabelStep2Thumbnail emptyThumbnailError={emptyThumbnailError}> Set a thumbnail</LabelStep2Thumbnail>

                                        <PreviewDiv>
                                            <PreviewIcon src={PreviewIcono} onMouseEnter={handleShowPreview} onMouseLeave={handleHidePreview} />
                                            <ShowPreviewDiv showPreview={showPreview}>
                                                <PreviewText> Preview Example </PreviewText>
                                                <PreviewImg src={ThumbnailPreview} />
                                            </ShowPreviewDiv>
                                        </PreviewDiv>

                                    </TitleAndPreview>

                                    <SubLabelStep2> This thumbnail will be displayed on regular video cards. (Requiered) • Recommended Size: 1280x720 </SubLabelStep2>

                                    {imgPerc > 0 ? (
                                        imgPerc < 100 ? (
                                            <div style={{ display: 'flex', marginBottom: '2px' }}>
                                                <UploadImage imgPerc={imgPerc}>Uploading: {imgPerc}%</UploadImage>
                                            </div>
                                        ) : (
                                            <div style={{ display: 'flex', marginBottom: '2px' }}>
                                                <UploadImage imgPerc={imgPerc}>Thumbnail uploaded successfully!</UploadImage>
                                                <SideDropdownImg src={ResetIcon} onClick={resetThumbnail} />
                                            </div>

                                        )
                                    ) : (
                                        <div style={{ display: 'flex', marginTop: '2px' }}>
                                            <InputImage
                                                type="file"
                                                accept="image/jpeg, image/png, image/webp"
                                                onChange={(e) => handleThumbnailFileChange(e)}
                                            />

                                            <ThumbnailLabelFormat formatThumbnailError={formatThumbnailError}> This file format is not allowed, please upload an image </ThumbnailLabelFormat>

                                        </div>
                                    )}


                                    <TitleAndPreview>
                                        <LabelStep2VerticalThumbnail emptyThumbnailVerticalError={emptyThumbnailVerticalError}>Set a vertical thumbnail</LabelStep2VerticalThumbnail>

                                        <PreviewDiv >
                                            <PreviewIcon src={PreviewIcono} onMouseEnter={handleVerticalShowPreview} onMouseLeave={handleVerticalHidePreview} />
                                            <ShowPreviewVerticalDiv showVerticalPreview={showVerticalPreview}>
                                                <PreviewText> Preview Example </PreviewText>
                                                <PreviewImg src={VerticalThumbnailPreview} />
                                            </ShowPreviewVerticalDiv>
                                        </PreviewDiv>
                                    </TitleAndPreview>
                                    <SubLabelStep2> This thumbnail will be displayed on the Trending Slider. (Requiered) • Recommended Size: 1080 x 1350 </SubLabelStep2>

                                    {imgVerticalPerc > 0 ? (
                                        imgVerticalPerc < 100 ? (
                                            <div style={{ display: 'flex', marginBottom: '9px' }}>
                                                <UploadImage imgPerc={imgPerc}>Uploading: {imgVerticalPerc}%</UploadImage>
                                            </div>
                                        ) : (
                                            <div style={{ display: 'flex', marginBottom: '9px' }}>
                                                <UploadImage imgPerc={imgPerc}>Vertical thumbnail uploaded successfully!</UploadImage>
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

                                            <VerticalThumbnailLabelFormat formatThumbnailVerticalError={formatThumbnailVerticalError}> This file format is not allowed, please upload an image </VerticalThumbnailLabelFormat>

                                        </div>
                                    )}
                                    <TitleAndPreviewLandscape imgPerc={imgPerc} imgVerticalPerc={imgVerticalPerc}>

                                        <LabelStep2LandscapeThumbnail emptyThumbnailLandscapeError={emptyThumbnailLandscapeError}>Set a landscape thumbnail</LabelStep2LandscapeThumbnail>

                                        <PreviewDiv>
                                            <PreviewIcon src={PreviewIcono} onMouseEnter={handleLandscapeShowPreview} onMouseLeave={handleLandscapeHidePreview} />
                                        </PreviewDiv>

                                    </TitleAndPreviewLandscape>
                                    <SubLabelStep2> This thumbnail will be displayed on the home slideshow. (Requiered) • Recommended Size: 2560x1440 </SubLabelStep2>

                                    {imgLandscapePerc > 0 ? (
                                        imgLandscapePerc < 100 ? (
                                            <div>
                                                <UploadImage imgPerc={imgPerc}>Uploading: {imgLandscapePerc}%</UploadImage>
                                            </div>
                                        ) : (
                                            <div style={{ display: 'flex' }}>
                                                <UploadImage imgPerc={imgPerc}>Landscape thumbnail uploaded successfully!</UploadImage>
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

                                            <LandscapeThumbnailLabelFormat formatThumbnailLandscapeError={formatThumbnailLandscapeError}> This file format is not allowed, please upload an image </LandscapeThumbnailLabelFormat>

                                        </div>
                                    )}
                                </>
                            )}
                            {step === 3 && (
                                <>
                                    <LabelStep3 emptyLanguageError={emptyLanguageError}>Language</LabelStep3>
                                    <SubLabelStep3> Maximize your video's impact by selecting the appropriate language. (Requiered) </SubLabelStep3>
                                    <SelecterAndFlags>
                                        <DropdownLanguage selectedLanguage={selectedLanguage} onLanguageChange={handleLanguageChange} />
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

                                    <LabelStep3 style={{ marginTop: '50px' }}>Subtitles</LabelStep3>
                                    <SubLabelStep3> Boost your audience reach with language subtitles for your video. (Optional, file format must be .vtt) </SubLabelStep3>

                                    <DropDownSubtitlesContainer>

                                        <DropdownSubtitle selectedSubtitle={selectedSubtitle} onSubtitleChange={handleSubtitleChange} />

                                    </DropDownSubtitlesContainer>

                                </>
                            )}
                            {step === 4 && (
                                <>
                                    <LabelStep3>Visibility</LabelStep3>
                                    <SubLabelStep3 style={{ marginBottom: '10px' }}> Adjust privacy settings to control who can view your video. (Default: Public) </SubLabelStep3>

                                    <ContainerSelectPrivacy>

                                        <DivSelectPrivacy
                                            onClick={() => handlePrivacyClick("public")}
                                            selected={inputs.privacy === "public"}
                                        >
                                            <DivSelectPrivacyColumn selected={inputs.privacy === "public"}>
                                                <DivSelectPrivacyFlex>
                                                    <PrivacyImg src={PublicIcon} />Public
                                                </DivSelectPrivacyFlex>

                                                <PrivacyDesc>
                                                    By setting your video to public, you can make it accessible to a wide audience... This feature will allow anyone to view, like, and share your content.
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
                                                    <PrivacyImg src={PrivateIcon} />Private
                                                </DivSelectPrivacyFlex>

                                                <PrivacyDesc privateSelected={privateSelected}>
                                                    Keep your video private by adjusting the privacy settings to ensure it's only visible to selected individuals.
                                                </PrivacyDesc>

                                                {privateSelected && (
                                                    <>
                                                        <SharePrivateButton onClick={handleSharePrivate}>
                                                            <SharePrivateImg src={SharePrivateIcon} /> INVITE USERS
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
                                                    <PrivacyImg src={UnlistedIcon} />Unlisted
                                                </DivSelectPrivacyFlex>

                                                <PrivacyDesc>
                                                    Choose unlisted for an exclusive touch. Keep your video private, sharing only with those you select. Make each view more personal and special.
                                                </PrivacyDesc>
                                            </DivSelectPrivacyColumn>

                                        </DivSelectPrivacy>

                                    </ContainerSelectPrivacy>

                                </>
                            )}
                        </Wrapper>
                    </ContentContainer>

                    {showSharePrivate && (
                        <SharePrivateComponent SharePrivate={SharePrivate} onInviteChange={handleSharePrivateChange} togglePopup={handleSharePrivate} savedEmails={savedEmails} />
                    )}

                    {
                        step != 0 && (
                            <FixedBottomMenu>
                                {step > 1 && (
                                    <ButtonBack onClick={handleBack}>
                                        Back
                                    </ButtonBack>
                                )}
                                {step > 0 && (
                                    <ButtonNextUpload onClick={isLastStep ? handlePublishPressed : handleNext} step={step} buttonNextDisable={buttonNextDisable}>
                                        {isLastStep ? "Publish" : "Next"}
                                    </ButtonNextUpload>
                                )}
                            </FixedBottomMenu>
                        )
                    }
                </Container >
            )}

            <>
                <ShowPreviewLandscapeDiv showLandscapePreview={showLandscapePreview}>
                    <PreviewText> Preview Example </PreviewText>
                    <PreviewImg src={LandscapeThumbnailPreview} />
                </ShowPreviewLandscapeDiv>
            </>
        </ContainerBg >

    );
};

export default Upload;