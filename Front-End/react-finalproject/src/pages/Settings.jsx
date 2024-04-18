import React, { useState, useEffect, useRef, useContext } from "react";
import styled, { css, keyframes } from "styled-components";
import { useLanguage } from '../utils/LanguageContext';
import { useDispatch, useSelector } from 'react-redux';
import BannerPlaceholder from '../assets/BannerPlaceholder.jpg';
import KeyIcon from '../assets/KeyIcon.png';
import KeyIconG from '../assets/KeyIconG.png';
import EditIcono from "../assets/EditPlaylist.png";
import NoConfirmed from '../assets/NoConfirmed.png';
import AlertIcon from '../assets/AlertIcon.png';
import CheckmarkIcon from '../assets/CheckmarckIcon.png';
import EmailSentIcon from '../assets/EmailSentIcon.png';
import StrengthTooWeak from '../assets/StrengthTooWeak.png';
import StrengthOkay from '../assets/StrengthOkay.png';
import StrengthGreat from '../assets/StrengthGreat.png';
import StrengthExcellent from '../assets/StrengthExcellent.png';
import SadFaceIcon from "../assets/NotSubbedIcono.png";
import InicioSesionIcono2 from "../assets/InicioSesionIcono2.png";
import CopyIcono from "../assets/CopyIcono.png";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";
import { userUpdated, userToggleNotifications, logout } from "../redux/userSlice";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import app from "../firebase";

// CONTAINER
const MainContainer = styled.div`
  position: relative;
  width: 100%;
  top: 0;
  min-height: 100vh;
  background-color: rgba(15, 12, 18);
  margin: auto;
  max-width: 1820px;
  overflow: hidden;
  padding-right: ${({ settingSection, settingSections }) => (settingSection === settingSections[1] || settingSection === settingSections[2] ? '7px' : '0px')};
`;

const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  background-color: transparent;
  display: flex;
`;

// SETTINGS LIST
const SettingsListContainer = styled.div`
  position: fixed;
  display: flex;
  flex-direction: column;
  height: calc(100% - 56px);
  width: 210px;
  margin-top: 56px;
  overflow: hidden;
`;

const SettingsListWrapper = styled.div`
  padding: 20px 15px;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const SettingsListHeader = styled.div`
  font-size: 24px;
  font-weight: bold;
  font-family: "Roboto Condensed", Helvetica;
  color: ${({ theme }) => theme.textSoft};
  padding: 0px 10px 10px 15px;
  text-shadow: 3px 3px 2px rgba(0, 0, 0);
`;

const SettingsListItem = styled.div`
  font-size: 16px;
  font-weight: normal;
  font-family: "Roboto Condensed", Helvetica;
  color: ${({ theme }) => theme.text};
  padding: 4px 15px;
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
  transition: background 0.4s ease;
  &:hover {
    background: rgba(66, 66, 66, 0.3);
  }
`;


// WRAPPER
const Wrapper = styled.div`
  position: relative;
  width: 100%;
  height: auto;
  margin: 56px 450px;
  padding: 40px 50px;
  display: flex;
  flex-direction: column;
`;

// LABELS

const TitleLabel = styled.label`
    display: flex;
    font-size: 16px;
    font-weight: bold;
    font-family: "Roboto Condensed", Helvetica;
    color: ${({ theme }) => theme.text};
    margin-bottom: 40px;
`;


const Label = styled.label`
    display: flex;
    font-size: 22px;
    font-weight: normal;
    font-family: "Roboto Condensed", Helvetica;
    color: ${({ theme }) => theme.text};
`;

const SmallerLabel = styled.label`
    display: flex;
    font-size: 12px;
    font-weight: bold;
    font-family: "Roboto Condensed", Helvetica;
    color: ${({ theme, didChange, isOkay, hasFocus }) => (didChange ? (isOkay ? '#66FF00' : '#FF00C0') : hasFocus ? '#FF00C0' : theme.textSoft)};
`;

const SmallerLabelNewPassoword = styled(SmallerLabel)`
    color: ${({ Strength, Length, hasFocus, theme }) => {
    if (Length > 0) {
      if (Strength === 0) return '#FF00C0';
      if (Strength === 1) return '#FFF200';
      if (Strength === 2) return '#FF8000';
      if (Strength === 3) return '#66FF00';
      return 'inherit';
    } else {
      if (hasFocus) return '#FF00C0';
      return theme.textSoft;
    }
  }};
`;

const LabelBold = styled.label`
    display: flex;
    font-size: 20px;
    font-weight: bold;
    font-family: "Roboto Condensed", Helvetica;
    color: ${({ theme }) => theme.text};
`;

const LabelRegular = styled.label`
    display: flex;
    font-size: 17px;
    font-weight: normal;
    font-family: "Roboto Condensed", Helvetica;
    color: ${({ theme }) => theme.text};
`;

const SubLabel = styled.label`
    display: flex;
    margin-top: 5px;
    font-size: 16px;
    color: ${({ theme }) => theme.textSoft};
    font-weight: normal;
    font-family: "Roboto Condensed", Helvetica;
`;


// SEPARATOR LINE
const Line = styled.div`
    height: 1px;
    width: 100%;
    background-color: rgba(168, 167, 168, 0.4);
    margin: 40px 0px 15px 0px;
`;

// ACCOUNT SECTION
const AccountSection = styled.div`
    position: relative;    
    display: flex;
    flex-direction: column;
    gap: 15px;
    margin: auto;
    background: linear-gradient(#0b090d, #0f0d12, #121014, #121112, #17141a 99% );
    border: 1px solid rgba(2, 1, 3, 0.3);
    box-shadow: 0px 0px 30px 20px rgba(0, 0, 0, 0.5);
    padding: 20px 30px;
    border-radius: 8px;

    height: ${({ isChangingPassword, IsVerified, externalLogging }) => {

    if (externalLogging) {
      return '400px';
    }

    if (isChangingPassword) {
      if (!IsVerified) {
        return '802px';
      } else {
        return '697px';
      }
    } else if (!IsVerified) {
      return '539px';
    }
    else {
      return '434px';
    }
  }};

    transition: height 0.5s ease;
    overflow: hidden;
`;

const NoEditInput = styled.input`
  background: #404040;
  border-radius: 5px;
  padding: 10px 15px;
  width: 250px;
  margin-top: -5px;
  margin-bottom: 10px;
  border: none;
  cursor: not-allowed;
  color: white;
  font-family: "Roboto Condensed", Helvetica;
  font-size: 15px;
  font-weight: normal;
  line-height: 1.25;

  outline: 1px solid #303030;

`;

const AdvancedSettingsInput = styled(NoEditInput)`
  margin-top: 0px;
  margin-bottom: 0px;
  cursor: text;
`;

const EditInput = styled.input`
  background: #242428;
  border-radius: 5px;
  padding: 10px 15px;
  width: 250px;
  margin-top: -5px;
  margin-bottom: 10px;
  outline: none;
  border: none;

  color: white;
  font-family: "Roboto Condensed", Helvetica;
  font-size: 15px;
  font-weight: normal;
  line-height: 1.25;

  outline: 1px solid ${({ didChange, isOkay }) => {
    if (didChange) {
      if (isOkay) {
        return '#66FF00';
      } else {
        return '#FF00C0';
      }
    } else {
      return '#303030';
    }
  }};

  &:focus {
    outline: 1px solid ${({ didChange, isOkay }) => {
    if (didChange) {
      if (isOkay) {
        return '#66FF00';
      } else {
        return '#FF00C0';
      }
    } else {
      return '#FF00C0';
    }
  }};
  }
`;

const EditInputNewPassword = styled(EditInput)`
  outline: 1px solid ${({ Strength, Length }) => {
    if (Length > 0) {
      if (Strength === 0) return '#FF00C0';
      if (Strength === 1) return '#FFF200';
      if (Strength === 2) return '#FF8000';
      if (Strength === 3) return '#66FF00';
      return 'inherit';
    }
    return 'inherit';
  }};

  &:focus {
    outline: 1px solid ${({ Strength }) => {
    if (Strength === 0) return '#FF00C0';
    if (Strength === 1) return '#FFF200';
    if (Strength === 2) return '#FF8000';
    if (Strength === 3) return '#66FF00';
    return '#FF00C0';
  }};
`;

const ChangePasswordImg = styled.img`
    height: 18px;
    width: 18px;
    object-fit: cover;
    transform: scaleX(-1);
    content: url(${KeyIconG});
    cursor: pointer;
`;

const ChangePasswordLabel = styled.label`
    display: flex;
    font-size: 14px;
    font-weight: bold;
    font-family: "Roboto Condensed", Helvetica;
    color: ${({ theme }) => theme.textSoft};
    cursor: pointer;
`;

const ChangePasswordDiv = styled.div`
    position: relative;
    display: flex;
    width: max-content;
    height: max-content;
    gap: 10px;
    align-items: center;
    cursor: pointer;
    margin-bottom: 10px;

    &:hover {
      ${ChangePasswordLabel} {
        color: ${({ theme }) => theme.text};
      }
      ${ChangePasswordImg} {
        content: url(${KeyIcon});
      }
    }
`;

const SaveButtonDiv = styled.div`
    position: absolute;
    display: flex;
    width: 100%;
    margin-left: -30px;
    height: max-content;
    bottom: 0px;
    padding: 20px 0px;
    align-items: center;
    justify-content: center;
    background: linear-gradient(#141215, #141214, #131214 20%, #141316 30%, #151417 40%, #161518 50%, #17141a 60%);
`;


const SaveButton = styled.button`
    position: relative;
    display: flex;
    font-size: 18px;
    font-weight: bold;
    font-family: "Roboto Condensed", Helvetica;
    color: ${({ theme }) => theme.text};
    width: 280px;
    heigth: auto;
    align-items: center;
    justify-content: center;
    padding: 8px;
    border-radius: 5px;
    background: ${({ isSaveButtonEnable }) => (isSaveButtonEnable ? 'rgba(115, 20, 74, 0.7)' : 'rgba(115, 20, 74, 0.3)')};
    cursor: ${({ isSaveButtonEnable }) => (isSaveButtonEnable ? 'pointer' : 'not-allowed')};
    transition: background 0.2s ease-in;
    border: 1px solid rgba(115, 20, 74, 0.4);
    margin-top: auto;
`;


const ChangePasswordSection = styled.div`
    position: relative;    
    display: flex;
    flex-direction: column;
    gap: 15px;
`;

// ACCOUNT PRESENTATION SECTION
const AccountPresentationSection = styled.div`
    position: relative;    
    display: flex;
    flex-direction: column;
    gap: 3px;
    align-items: center;
    height: max-content;
    margin-bottom: 35px;
`;

const AccountProfileBannereDiv = styled.div`
    position: relative;
    display: flex;
    width: 100%;
    height: 250px;
    z-index: 1;
    border-radius: 8px 8px 0px 0px;
    border: ${({ formatBannerError }) => (formatBannerError ? '1px solid red' : '0px solid transparent')}; 

`;

const AccountProfileBanner = styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: 1;
    border-radius: 8px 8px 0px 0px;
`;

const EditAccountProfileBannerImg = styled.img`
  position: absolute;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #121212;
  padding: 6px;
  transition: background 0.3s ease;
  right: 5px;
  top: 5px;
  z-index: 2;
`;

const InputEditAccountProfileBanner = styled.input`
  position: absolute;
  overflow: hidden;
  right: 5px;
  top: 5px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  cursor: pointer;
  z-index: 3;

  &::-webkit-file-upload-button {
      visibility: hidden;
  }

  &:hover + ${EditAccountProfileBannerImg} {
    background: rgba(18, 18, 18, 0.7);
  }
`;

const AccountProfilePictureDiv = styled.div`
    position: relative;
    display: flex;
    width: 125px;
    height: 125px;
    margin-bottom: 8px;
    z-index: 2;
    margin-top: -70px;
    border-radius: 50%;
    border: ${({ formatPfPError }) => (formatPfPError ? '1px solid red' : '0px solid transparent')}; 
`;

const AccountProfilePicture = styled.img`
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
`;

const EditAccountProfilePictureImg = styled.img`
  position: absolute;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #121212;
  padding: 6px;
  transition: background 0.3s ease;
  right: 1px;
  bottom: 4px;
`;

const InputEditAccountProfilePicture = styled.input`
  overflow: hidden;
  position: absolute;
  right: 1px;
  bottom: 4px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  cursor: pointer;
  z-index: 2;

  &::-webkit-file-upload-button {
      visibility: hidden;
  }

  &:hover + ${EditAccountProfilePictureImg} {
    background: rgba(18, 18, 18, 0.8);
  }
`;

const AccountProfileLabel = styled.label`
    display: flex;
    font-size: 17px;
    font-weight: normal;
    font-family: "Roboto Condensed", Helvetica;
    color: ${({ theme }) => theme.text};
    z-index: 2;
`;

const AccountProfileEmailLabel = styled.label`
    display: flex;
    font-size: 13px;
    color: ${({ theme }) => theme.textSoft};
    font-weight: normal;
    font-family: "Roboto Condensed", Helvetica;
    z-index: 2;
`;

// EMAIL NOT CONFIRMED
const EmailNotConfirmed = styled.div`
    width: 100%;
    height: max-content;
    border-radius: 5px;
    position: relative;
    display: flex;
    flex-direction: column;
    background-color: rgba(75, 2, 158, 0.1);
    padding: 10px 0px;
    gap: 10px;
    margin-top: -10px;
    margin-bottom: 10px;
`;

const EmailNotConfirmedImgHeader = styled.div`
    width: 100%;
    height: max-content;
    position: relative;
    display: flex;
    padding: 0px 15px;
    gap: 8px;
    align-items: center;
`;

const EmailNotConfirmedImg = styled.img`
    width: 15px;
    height: auto;
    position: relative;
    display: flex;
`;

const EmailNotConfirmedHeader = styled.h1`
    display: flex;
    font-size: 15px;
    font-weight: normal;
    font-family: "Roboto Condensed", Helvetica;
    color: ${({ theme }) => theme.textSoft};
`;

const EmailNotConfirmedTxt = styled.h1`
    font-size: 15px;
    font-weight: normal;
    font-family: "Roboto Condensed", Helvetica;
    color: ${({ theme }) => theme.text};
    max-width: 250px;
    padding: 0px 15px;
    line-height: 1.4;
`;

const EmailNotConfirmedVerify = styled.span`
    font-size: 15px;
    font-weight: normal;
    font-family: "Roboto Condensed", Helvetica;
    color: rgba(209, 4, 121);
    max-width: 250px;
    line-height: 1.4;
    cursor: pointer;
    text-decoration: underline;
    font-weight: bold;
    margin: 0 4px;
`;

// VALIDATIONS
const ValidationsPopup = styled.div`
 position: absolute;
 opacity: ${({ isShowing }) => (isShowing ? '1' : '0')};
 transition: opacity 0.3s ease-in;
 display: flex;
 flex-direction: column;
 width: max-content;
 height: max-content;
 padding: 10px 15px;
 left: 640px;
 top: 690px;
 background-color: rgba(18, 18, 18, 0.8);
 border-radius: 8px;
 gap: 12px;
`;

const ValidationsPasswordPopup = styled(ValidationsPopup)`
 display: ${({ isChangingPassword }) => (isChangingPassword ? 'flex' : 'none')};
`;

const ValidationsPopupSymbol = styled.img`
 height: 17px;
 width: 17px;
 padding: 1px 0px;
`;

const ValidationsPasswordPopupSymbol = styled(ValidationsPopupSymbol)`
 height: 17px;
 width: 17px;
 padding: 2px 0px;
`;

const ValidationsPopupItem = styled.div`
 position: relative;
 display: flex;
 gap: 10px;
 width max-content;
 height: max-content;
 align-items: center;
 font-size: 15px;
 font-weight: normal;
 font-family: "Roboto Condensed", Helvetica;
 color: ${({ isOkay }) => (isOkay ? '#66FF00' : '#FF00C0')};
`;

const ValidationsPasswordPopupItem = styled(ValidationsPopupItem)`
 color: ${({ Strength }) => {
    if (Strength === 0) return '#FF00C0';
    if (Strength === 1) return '#FFF200';
    if (Strength === 2) return '#FF8000';
    if (Strength === 3) return '#66FF00';
    return 'inherit';
  }};
  gap: 8px;
  margin-bottom: 10px;
`;

// USER VALIDATION
const NoUserContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    margin: auto;
    margin-top: 318px;
`;

const NoUserImg = styled.img`
    height: 96px;
    width: 96px;
    padding: 20 px;
`;

const NoUserMessage1 = styled.span`
    margin-top: 10px;  
    color: rgba(224, 175, 208, 0.8);
    font-weight: bold;
    font-family: "Roboto Condensed", Helvetica;
    font-size: 30px;
`;

const NoUserMessage2 = styled.span`
    margin-top: 10px;    
    color: ${({ theme }) => theme.text};
    font-weight: bold;
    font-family: "Roboto Condensed", Helvetica;
    font-size: 30px;
`;

const ItemLogin = styled.div`
  margin-top: 20px;
  display: flex;
  padding: 0px 12px;
  align-items: center;
  gap: 8px;
  width: auto;
  height: 40px;
  transition: background-color 0.5s;
  cursor: pointer;
  border-radius: 12px;
  background-color: ${({ theme }) => theme.loginbg};
  &:hover {
    background-color: ${({ theme }) => theme.softloginbg};
  }
`;

const ImgLogin = styled.img`
  height: 30px;
  width: 30px;
`;

const ButtonLoginText = styled.h3`
  font-family: "Roboto Condensed", Helvetica;
  font-size: 24px;
  font-weight: normal;
  color: ${({ theme }) => theme.text};
  margin-bottom: 3px;
`;

// NOTIFICATIONS

const SwitchDiv = styled.div`
  display: flex;
  flex-direction: column;
  height: max-content;
  width: max-content;
  gap: 75px;
  padding: 30px 0px;
`;

const SwitchItem = styled.div`
  display: flex;
  align-items: center;
  gap: 22.5px;
  border-radius: 30px;
  height: 0px;
`;

const Switch = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  width: 37px;
  height: 15px;
  transition: background-color 0.4s ease;
  background-color: ${({ notificationsEnabled }) => (notificationsEnabled ? 'white' : '#2e2c2d')};
  border-radius: 12px;
  cursor: pointer;

  &::before {
    content: '';
    position: absolute;
    width: 22px;
    margin-top: 1px;
    height: 22px;
    background-color: #ff006a;
    border-radius: 50%;
    transition: transform 0.4s ease;
    transform: ${({ notificationsEnabled }) => (notificationsEnabled ? 'translateX(18px)' : 'translateX(0)')};
  }
`;

const SwitchTxt = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
`;

// ADVANCED SETTINGS
const AdvancedSettingsDiv = styled.div`
  display: flex;
  flex-direction: column;
  height: max-content;
  width: 100%;
  gap: 90px;
  padding: 40px 0px;
`;

const AdvancedSettingItem = styled.div`
  position: relative;  
  display: flex;
  align-items: center;
  gap: 45px;
  border-radius: 30px;
  height: 0px;
`;

const AdvancedSettingItemColumn = styled.div`
  position: relative;  
  display: flex;
  flex-direction: column;
  justifiy-content: center;
  border-radius: 30px;
  margin-top: 20px;
`;

const AdvancedSettingItemImg = styled.img`
  position: absolute;
  top: -16px;
  left: 335px;
  height: 25px;
  width: 25px;
  background: rgba(255, 0, 192, 0.4);
  border-radius: 10px;
  padding: 4px;
  cursor: pointer;
`;

const LabelDeleteAccount = styled.label`
    font-size: 16px;
    font-weight: bold;
    font-family: "Roboto Condensed", Helvetica;
    color: #FF00C0;
    cursor: pointer;
`;

const DeleteAccountPopupContainer = styled.div`
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

const DeleteAccountPopupWrapper = styled.div`
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

const DeleteAccountPopupTitle = styled.h1`
    font-weight: bold;
    font-size: 24px;
    font-family: "Roboto Condensed", Helvetica;
`;

const DeleteAccountPopupTxt = styled.h1`
    font-family: "Roboto Condensed", Helvetica;
    font-weight: normal;
    font-size: 18px;
    margin-bottom: 15px;
    color: ${({ theme }) => theme.textSoft};
    max-width: 400px;
`;

const OptionsDeleteCancel = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  width: 100%;
`;

const DeleteAccountCancel = styled.div`
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

const DeleteAccountDelete = styled.div`
    cursor: pointer;
    &:hover {
    background: rgba(45, 45, 45);
    }
    padding: 8px 10px;
    border-radius: 15px;
    font-family: "Roboto Condensed", Helvetica;
    font-size: 17px;
`;

const Settings = () => {
  const { language, setLanguage } = useLanguage();

  // GET SPECIFIC ROUTE
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const notificationsParam = parseInt(searchParams.get('settings'));
  const navigate = useNavigate();

  // CURRENT USER
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();


  // RESET SCROLL
  const scrollToTop = () => {
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    scrollToTop();
  }, []);

  // TRANSLATIONS
  const translations = {
    en: {
      settings: "Settings",
      account: "Account",
      accounttxt: "Choose how other users can see you on Flashy",
      hello: "Hello, ",

      email: "EMAIL ADDRESS",
      emailnotv1: "Not Verified",
      emailnotv2: "Your account has not been verified,",
      emailnotv3: "click here",
      emailnotv4: "to resend verification email.",

      username: "USERNAME",
      displayname: "DISPLAY NAME",
      joined: "JOINED",

      chpass1: "Change Password",
      chpass2: "CURRENT PASSWORD",
      chpass3: "NEW PASSWORD",
      chpass4: "CONFIRM NEW PASSWORD",

      notifications: "Notifications",
      notificationstxt: "Personalize your notifications to keep track of your favorite content",
      general: "General",
      generaltxt: "Manage your notifications on Flashy",
      suscriptions: "Suscriptions",
      suscriptionstxt: "Notify me about activity from the channels I'm subscribed to",
      recc: "Recommended videos (Disabled)",
      recctxt: "Notify me about videos that fit my taste",
      replies: "Replies to my comment (Disabled)",
      replistxt: "Notify me when someone replies my comment",
      men: "Mentions (Disabled)",
      mentxt: "Notify me when someone mentions me",
      emailnot: "Email notifications",
      emailnottxt: "Not available yet",

      advsettside: "Advanced Settings",
      advsett: "Advanced Settings",
      advsetttxt: "We are here to make your experience unique",
      useridsett: "User ID",
      deleteacc: "Delete Account",
      deleteacpopttxt: "This is a permanent action and cannot be undone",

      deleteaccpopuptxt: "Are you sure you want to delete your account?",
      deleteaccpopupnote: "Note: this action is permanent and cannot be undone, please be sure before you press the button delete.",

      signingoogle: "You are currently signed in with a Google Account",
      siginfacebook: "You are currently signed in with a Facebook Account",
      signinflashy: "You are currently signed in with a Flashy Account",

      toastpen: "Updating profile",
      toastsuc: "Profile updated successfully",
      toasterror: "There was an error updating your profile",
      toastemailsent: "Verification email sent",
      toastemailnoten: "Notifications enabled",
      toastemailnotdis: "Notifications disabled",
      toastuserid: "User ID copied in clipboard",
      toastuserdelete: "User deleted successfully",

      save: "Save",
      cancel: "Cancel",
      delete: "Delete",

      // VALIDATIONS --> EMAIL
      emailinvalid: "You must enter a valid email address",
      emailnotavailable: "Ths email address is not available",
      emailverificationsent: "Please check your new email to confirm your new email address",
      emailavailable: "Email address available",

      // VALIDATIONS --> USERNAME
      usernameinvalid: "You must enter a username between 3 and 20 characters without any spaces",
      usernamenotavailable: "Ths username is not available",
      usernameavailable: "Username available",

      // VALIDATIONS --> DISPLAY NAME
      displaynameinvalid: "You must enter a display name between 3 and 20 characters without any spaces",
      displaynameavailable: "Display name available",

      // VALIDATIONS --> NEW PASSWORD
      strengthtooweak: "You password strength is too weak",
      strengthokay: "You password strength is okay",
      strengthgreat: "You password strength is great",
      strengthexcellent: "You password strength is excellent",
      passwordpopup1: "Password is at least 8 characters long",
      passwordpopup2: "Password is at least okay strength or better",
      passwordpopup3: "Password includes two of the following: letter, capital letter, number, or symbol",

      // VALIDATIONS --> CONFIRM NEW PASSWORD
      passworddonotmatch: "Passwords do not match",

      // USER VALIDATION
      notlogged: "Seems like you currently are not logged in as a user :(",
      notlogged2: "Log in to personalize your Flashy experience as much as you want!",
      signin: "Sign in",
    },
    es: {
      settings: "Ajustes",
      account: "Cuenta",
      accounttxt: "Elige cómo otros usuarios pueden verte en Flashy",
      hello: "Hola, ",

      email: "DIRECCIÓN DE CORREO ELECTRÓNICO",
      emailnotv1: "No Verificado",
      emailnotv2: "Tu cuenta no ha sido verificada,",
      emailnotv3: "haz clic aquí",
      emailnotv4: "para reenviar el correo de verificación.",

      username: "NOMBRE DE USUARIO",
      displayname: "NOMBRE A MOSTRAR",
      joined: "SE UNIÓ EN",

      chpass1: "Cambiar Contraseña",
      chpass2: "CONTRASEÑA ACTUAL",
      chpass3: "NUEVA CONTRASEÑA",
      chpass4: "CONFIRMAR NUEVA CONTRASEÑA",

      notifications: "Notificaciones",
      notificationstxt: "Personaliza tus notificaciones para estar al tanto de tu contenido favorito",
      general: "General",
      generaltxt: "Administra tus notificaciones en Flashy",
      suscriptions: "Suscripciones",
      suscriptionstxt: "Notifícame sobre la actividad de los canales a los que estoy suscrito",
      recc: "Videos recomendados (Desactivado)",
      recctxt: "Notifícame sobre videos que se ajusten a mis gustos",
      replies: "Respuestas a mi comentario (Desactivado)",
      replistxt: "Notifícame cuando alguien responda a mi comentario",
      men: "Menciones (Desactivado)",
      mentxt: "Notifícame cuando alguien me mencione",
      emailnot: "Notificaciones por correo electrónico",
      emailnottxt: "Aún no disponible",

      advsettside: "Avanzado",
      advsett: "Configuraciones Avanzadas",
      advsetttxt: "Estamos aquí para hacer única tu experiencia",
      useridsett: "ID de Usuario",
      deleteacc: "Eliminar Cuenta",
      deleteacpopttxt: "Esta es una acción permanente y no se puede deshacer",

      deleteaccpopuptxt: "¿Estás seguro de que quieres eliminar tu cuenta?",
      deleteaccpopupnote: "Nota: esta acción es permanente y no se puede deshacer, asegúrate antes de presionar el botón de eliminar.",

      signingoogle: "Has iniciado sesión con una cuenta de Google",
      siginfacebook: "Has iniciado sesión con una cuenta de Facebook",
      signinflashy: "Has iniciado sesión con una cuenta en Flashy",

      save: "Guardar",
      cancel: "Cancelar",
      delete: "Eliminar",

      toastpen: "Actualizando perfil",
      toastsuc: "Perfil actualizado exitosamente",
      toasterror: "Hubo un error al actualizar tu perfil",
      toastemailsent: "Correo de verificación enviado",
      toastemailnoten: "Notificaciones habilitadas",
      toastemailnotdis: "Notificaciones deshabilitadas",
      toastuserid: "ID de usuario copiado en el portapapeles",
      toastuserdelete: "Usuario eliminado exitosamente",

      // VALIDATIONS --> EMAIL
      emailinvalid: "Debes ingresar un correo electrónico valido",
      emailnotavailable: "Este correo electrónico no está disponible",
      emailverificationsent: "Por favor revisa tu nuevo correo para confirmar tu nuevo correo electrónico",
      emailavailable: "Correo electrónico dispnible",

      // VALIDATIONS --> USERNAME
      usernameinvalid: "Debes ingresar un nombre de usuario que contenga entre 3 a 20 caracteres y sin ningún espacio",
      usernamenotavailable: "Este nombre de usuario no está disponible",
      usernameavailable: "Nombre de usuario disponible",

      // VALIDATIONS --> DISPLAY NAME
      displaynameinvalid: "You must enter a display name between 3 and 20 characters without any spaces",
      displaynameavailable: "Nombre a mostrar disponible",

      // VALIDATIONS --> NEW PASSWORD
      strengthtooweak: "La fuerza de tu contraseña es muy débil",
      strengthokay: "La fuerza de tu contraseña es aceptable",
      strengthgreat: "La fuerza de tu contraseña es genial",
      strengthexcellent: "La fuerza de tu contraseña es excelente",
      passwordpopup1: "La contraseña tiene al menos 8 caracteres",
      passwordpopup2: "La contraseña es por lo menos aceptable o mejor",
      passwordpopup3: "La contraseña incluye dos de lo siguiente: letra, mayúscula, numero, o símbolo",

      // VALIDATIONS --> CONFIRM NEW PASSWORD
      passworddonotmatch: "Las contraseñas no coinciden",

      // USER VALIDATION
      notlogged: "Parece que aún no has iniciado sesión como usuario :(",
      notlogged2: "Inicia sesión para personalizar tu experiencia en Flashy tanto como quieras!",
      signin: "Iniciar Sesión",
    },
  };

  // SETTINGS SECTIONS DEFINITION
  const settingSections = [
    translations[language].account,
    translations[language].notifications,
    translations[language].advsettside,
  ];

  const [settingSection, setSettingSection] = useState(notificationsParam && notificationsParam >= 0 && notificationsParam <= 2 ? settingSections[notificationsParam] : settingSections[0]);

  // SIGN IN METHOD
  const [signinMethod, setSigninMethod] = useState('');

  useEffect(() => {
    if (currentUser?.fromGoogle) {
      setSigninMethod(translations[language].signingoogle);
    } else if (currentUser?.fromFacebook) {
      setSigninMethod(translations[language].siginfacebook);
    } else {
      setSigninMethod(translations[language].signinflashy);
    }
  }, [currentUser]);

  // FORMATS
  const formatDate = (createdAt) => {
    const date = new Date(createdAt);
    const options = { month: 'short', day: '2-digit', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  // INPUTS
  const [inputs, setInputs] = useState({});

  // CHANGE PROFILE BANNER
  const [imgBanner, setImgBanner] = useState(undefined);
  const [imgBannerPerc, setImgBannerPerc] = useState(0);
  const [formatBannerError, setFormatBannerError] = useState(false);

  const handleProfileBannerChange = (e) => {
    const selectedFile = e.target.files[0];

    if (selectedFile) {
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

      if (allowedTypes.includes(selectedFile.type)) {
        setImgBanner(e.target.files[0]);
        setFormatBannerError(false);
      } else {
        setFormatBannerError(true);
      }
    }
  };

  const handleUpdateBannerDB = async () => {
    if (inputs.banner !== undefined && inputs.banner !== "" && inputs.banner !== null) {
      try {
        const res = await axios.put(`http://localhost:8800/api/users/${currentUser?._id}/update`, {
          banner: inputs.banner
        });
        dispatch(userUpdated(res.data));
        setImgBanner(null);
        setImgBannerPerc(0);
        setInputs({ banner: null });

      } catch (error) {
        console.error("Error updating profile banner:", error);
      }
    }
  };

  const uploadBanner = (file, urlType) => {
    const storage = getStorage(app);
    const imageFileName = new Date().getTime() + imgBanner.name;
    const storageRef = ref(storage, imageFileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        if (urlType === "banner") {
          setImgBannerPerc(Math.round(progress));
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
    imgBanner && uploadBanner(imgBanner, "banner");
  }, [imgBanner]);

  useEffect(() => {
    handleUpdateBannerDB();
  }, [inputs.banner]);

  // CHANGE EMAIL
  const handleChangeEmail = (e) => {
    const { name, value } = e.target;

    if (value.length <= 256) {
      setInputs((prev) => {
        return { ...prev, [name]: value };
      });
    }
  };

  // CHANGE PROFILE PICTURE
  const [img, setImg] = useState(undefined);
  const [imgPerc, setImgPerc] = useState(0);
  const [formatPfPError, setFormatPfPError] = useState(false);

  const handleProfilePictureChange = (e) => {
    const selectedFile = e.target.files[0];

    if (selectedFile) {
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

      if (allowedTypes.includes(selectedFile.type)) {
        setImg(e.target.files[0]);
        setFormatPfPError(false);
      } else {
        setFormatPfPError(true);
      }
    }
  };

  const handleUpdatePfPDB = async () => {
    if (inputs.img !== undefined && inputs.img !== "" && inputs.img !== null) {
      try {
        const res = await axios.put(`http://localhost:8800/api/users/${currentUser?._id}/update`, {
          img: inputs.img
        });
        dispatch(userUpdated(res.data));
        setImg(null);
        setImgPerc(0);
        setInputs({ img: null });

      } catch (error) {
        console.error("Error updating profile picture:", error);
      }
    }
  };

  const uploadPfP = (file, urlType) => {
    const storage = getStorage(app);
    const imageFileName = new Date().getTime() + img.name;
    const storageRef = ref(storage, imageFileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        if (urlType === "img") {
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
    img && uploadPfP(img, "img");
  }, [img]);

  useEffect(() => {
    handleUpdatePfPDB();
  }, [inputs.img]);

  // CHANGE USERNAME
  const handleChangeUsername = (e) => {
    const { name, value } = e.target;

    if (value.length <= 30) {
      setInputs((prev) => {
        return { ...prev, [name]: value };
      });
    }
  };

  // CHANGE DISPLAY NAME
  const handleChangeDisplayName = (e) => {
    const { name, value } = e.target;

    if (value.length <= 30) {
      setInputs((prev) => {
        return { ...prev, [name]: value };
      });
    }
  };

  // CHANGE PASSWORD
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const handleChangePassword = () => {
    setIsChangingPassword(!isChangingPassword);

    setInputs((prevInputs) => ({
      ...prevInputs,
      currentpassword: '',
      newpassword: '',
      confirmnewpassword: '',
    }));

  };

  const handleCurrentPassword = (e) => {
    const { name, value } = e.target;

    if (value.length <= 20) {
      setInputs((prev) => {
        return { ...prev, [name]: value };
      });
    }
  };

  const handleNewPassword = (e) => {
    const { name, value } = e.target;

    if (value.length <= 20) {
      setInputs((prev) => {
        return { ...prev, [name]: value };
      });
    }
  };

  const handleConfirmNewPassword = (e) => {
    const { name, value } = e.target;

    if (value.length <= 20) {
      setInputs((prev) => {
        return { ...prev, [name]: value };
      });
    }
  };

  // VALIDATIONS --> EMAIL ADDRESS
  const [hasFocusEmail, setHasFocusEmail] = useState(false);
  const [didEmailChange, setDidEmailChange] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isEmailNotAvailable, setIsEmailNotAvailable] = useState(false);
  const [isEmailOkay, setIsEmailOkay] = useState(false);

  useEffect(() => {

    const validEmailRegex = /^[^\s]+@(gmail\.com|hotmail\.com|outlook\.es|yahoo\.com)$/i;
    setIsEmailValid(validEmailRegex.test(inputs.email));

    const handleCheckEmailDisponibility = async () => {
      try {
        if (inputs.email !== undefined) {
          const emailCheckResponse = await axios.post("http://localhost:8800/api/auth/checkemail", { email: inputs?.email });

          if (emailCheckResponse.data.exists && inputs?.email?.length > 0 && inputs?.email !== currentUser.email) {
            setIsEmailNotAvailable(true);
          } else {
            setIsEmailNotAvailable(false);
          }
        }

      } catch (error) {
        if (inputs.email !== undefined) {
          console.error("Error cheking email:", error);
        }
      }
    };

    setDidEmailChange(inputs?.email !== undefined && inputs?.email !== currentUser.email ? true : false);
    setIsVerificationSent(false);

    handleCheckEmailDisponibility();

  }, [inputs.email]);

  useEffect(() => {
    setIsEmailOkay(isEmailValid && !isEmailNotAvailable ? true : false);
  }, [isEmailValid, isEmailNotAvailable]);

  // VALIDATIONS --> USERNAME
  const [hasFocusUsername, setHasFocusUsername] = useState(false);
  const [didUsernameChange, setDidUsernameChange] = useState(false);
  const [isUsernameValid, setIsUsernameValid] = useState(false);
  const [isUsernameNotAvailable, setIsUsernameNotAvailable] = useState(false);
  const [isUsernameOkay, setIsUsernameOkay] = useState(false);

  useEffect(() => {

    setIsUsernameValid(/^[^\s]{3,19}$/.test(inputs.username));


    const handleCheckEmailDisponibility = async () => {
      try {
        if (inputs.username !== undefined) {
          const usernameCheckResponse = await axios.post("http://localhost:8800/api/auth/checkname", { name: inputs?.username });

          if (usernameCheckResponse.data.exists && inputs?.username?.length > 0 && inputs?.username !== currentUser.name) {
            setIsUsernameNotAvailable(true);
          } else {
            setIsUsernameNotAvailable(false);
          }
        }

      } catch (error) {
        if (inputs.username !== undefined) {
          console.error("Error cheking username:", error);
        }
      }
    };

    setDidUsernameChange(inputs?.username !== undefined && inputs?.username !== currentUser.name ? true : false);

    handleCheckEmailDisponibility();

  }, [inputs.username]);

  useEffect(() => {
    setIsUsernameOkay(isUsernameValid && !isUsernameNotAvailable ? true : false);
  }, [isUsernameValid, isUsernameNotAvailable]);

  // VALIDATIONS --> DISPLAYNAME
  const [hasFocusDisplayName, setHasFocusDisplayName] = useState(false);
  const [didDisplayNameChange, setDidDisplayNameChange] = useState(false);
  const [isDisplayNameValid, setIsDisplayNameValid] = useState(false);
  const [isDisplayNameOkay, setIsDisplayNameOkay] = useState(false);

  useEffect(() => {

    setIsDisplayNameValid(inputs.displayname?.length > 2 && inputs.displayname?.length < 20);

    setDidDisplayNameChange(inputs?.displayname !== undefined && inputs?.displayname !== currentUser.displayname ? true : false);

  }, [inputs.displayname]);

  useEffect(() => {
    setIsDisplayNameOkay(isDisplayNameValid ? true : false);
  }, [isDisplayNameValid]);

  // VALIDATIONS --> CURRENT PASSWORD
  const [hasFocusCurrentPassword, setHasCurrentPassword] = useState(false);

  // VALIDATIONS --> NEW PASSWORD
  const [hasFocusNewPassword, setHasFocusNewPassword] = useState(false);
  const [isNewPasswordOkay, setIsNewPasswordOkay] = useState(false);
  const [newPasswordStrength, setNewPasswordStrength] = useState(0);
  const [newPasswordContains, setNewPasswordContains] = useState(false);

  useEffect(() => {
    const hasLetter = /[a-zA-Z]/.test(inputs?.newpassword);
    const hasNumber = /\d/.test(inputs?.newpassword);
    const hasUppercase = /[A-Z]/.test(inputs?.newpassword);
    const hasSymbols = /[!@#$%^&*(),.?":{}|<>]/.test(inputs?.newpassword);
    const longEnough = inputs?.newpassword?.length >= 8;

    // Contar cuántos requisitos cumple la contraseña
    const requirementsMet = [hasLetter, hasNumber, hasUppercase, hasSymbols].filter(Boolean).length;

    setNewPasswordContains(requirementsMet >= 2);

    if (longEnough) {
      if (hasLetter && hasNumber && hasUppercase && hasSymbols) {
        setNewPasswordStrength(3);
      } else if ((hasLetter && hasNumber && hasUppercase) || (hasLetter && hasUppercase && hasSymbols) || (hasNumber && hasUppercase && hasSymbols) || (hasLetter && hasNumber && hasSymbols)) {
        setNewPasswordStrength(2);
      } else if ((hasLetter && hasNumber) || (hasLetter && hasUppercase) || (hasLetter && hasSymbols) || (hasNumber && hasUppercase) || (hasNumber && hasSymbols) || (hasUppercase && hasSymbols)) {
        setNewPasswordStrength(1);
      } else {
        setNewPasswordStrength(0);
      }
    } else {
      setNewPasswordStrength(0);
    }

    setIsNewPasswordOkay(newPasswordStrength > 0 ? true : false);

  }, [inputs?.newpassword, inputs?.confirmnewpassword]);

  const getPasswordStrengthImage = (strength) => {
    switch (strength) {
      case 3:
        return StrengthExcellent;
      case 2:
        return StrengthGreat;
      case 1:
        return StrengthOkay;
      case 0:
      default:
        return StrengthTooWeak;
    }
  };

  // VALIDATIONS --> CONFIRM PASSWORD
  const [hasFocusConfirmNewPassword, setHasFocusConfirmNewPassword] = useState(false);
  const [isConfirmPasswordOkay, setIsConfirmPasswordOkay] = useState(false);

  useEffect(() => {

    if (inputs.newpassword?.length > 0 || inputs.confirmnewpassword?.length > 0) {
      setIsConfirmPasswordOkay(inputs.confirmnewpassword === inputs.newpassword ? true : false)
    } else {
      setIsConfirmPasswordOkay(true);
    }

  }, [inputs.confirmnewpassword, inputs.newpassword]);

  // VALIDATIONS --> PASSWORD GOOD AND MATCH
  const [passwordIsGood, setPasswordIsGood] = useState(false);

  useEffect(() => {
    const FirstCondition = inputs.newpassword?.length >= 8;
    const SecondCondition = newPasswordContains;
    const ThirdCondition = newPasswordStrength > 0;
    const FourthCondition = inputs.newpassword === inputs.confirmnewpassword ? true : false;

    const requirementsMet = [FirstCondition, SecondCondition, ThirdCondition, FourthCondition].filter(Boolean);

    setPasswordIsGood(requirementsMet.length === 4);

  }, [inputs.confirmnewpassword, inputs.newpassword, newPasswordContains, newPasswordStrength]);

  // SAVE CHANGES
  const [isSaveButtonEnable, setIsSaveButtonEnable] = useState(false);
  const [isVerificationSent, setIsVerificationSent] = useState(false);

  useEffect(() => {
    const FirstCondition = inputs?.email === undefined ? true : inputs?.email === currentUser.email ? true : isEmailOkay;
    const SecondCondition = inputs?.username === undefined ? true : inputs?.username === currentUser.name ? true : isUsernameOkay;
    const ThirdCondition = inputs?.displayname === undefined ? true : inputs?.displayname === currentUser.displayname ? true : isDisplayNameOkay;
    const FourthCondition = isChangingPassword
      ? ((inputs?.currentpassword === undefined || inputs?.currentpassword === '') &&
        (inputs?.newpassword === undefined || inputs?.newpassword === '') &&
        (inputs?.confirmnewpassword === undefined || inputs?.confirmnewpassword === '')) ? true : passwordIsGood
      : true;

    const requirementsMet = [FirstCondition, SecondCondition, ThirdCondition, FourthCondition].filter(Boolean);

    setIsSaveButtonEnable(requirementsMet.length === 4);

  }, [isEmailOkay, isUsernameOkay, isDisplayNameOkay, isChangingPassword, passwordIsGood, inputs?.currentpassword, inputs?.newpassword, inputs?.confirmnewpassword]);


  const handleSaveChanges = async () => {

    // NOTIFICATE UPDATE

    if (!isSaveButtonEnable) {
      return;
    }

    try {
      const res = await toast.promise(
        axios.put(`http://localhost:8800/api/users/${currentUser?._id}/update`, {
          email: inputs?.email === '' || null || undefined ? null : inputs.email,
          name: inputs?.username === '' || null || undefined ? null : inputs.username,
          displayname: inputs?.displayname === '' || null || undefined ? null : inputs.displayname,
          currentPassword: inputs?.currentpassword === '' || null || undefined ? null : inputs.currentpassword,
          newPassword: inputs?.newpassword === '' || null || undefined ? null : inputs.newpassword,
        }), {
        pending: translations[language].toastpen,
        success: translations[language].toastsuc,
        error: translations[language].toasterror
      }
      );

      dispatch(userUpdated(res.data));


      // HIDE POPUPS
      setDidEmailChange(false);
      setDidUsernameChange(false);
      setDidDisplayNameChange(false);
      setIsChangingPassword(false);

      if (inputs?.email !== undefined && isEmailOkay) {
        setIsVerificationSent(true);
      }

      if (inputs?.currentpassword?.length > 0 && inputs?.newpassword?.length > 0 && inputs?.confirmnewpassword?.length > 0) {
        setIsChangingPassword(false);

        setInputs((prevInputs) => ({
          ...prevInputs,
          currentpassword: '',
          newpassword: '',
          confirmnewpassword: '',
        }));
      }


    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  // RESEND EMAIL VERIFICATION
  const handleSendAccountVerification = async () => {
    try {
      toast.success(translations[language].toastemailsent);
      await axios.post(`http://localhost:8800/api/users/emailVerification`);
    } catch (error) {
      console.error("Error sending verification:", error);
    }
  };

  // NOTIFICATIONS
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  useEffect(() => {
    setNotificationsEnabled(currentUser?.notificationsEnabled);
  }, [currentUser]);

  // NOTIFICATIONS --> TOGGLE
  const handleToggleNotifications = async () => {
    try {
      if (currentUser.notificationsEnabled === false) {
        toast.success(translations[language].toastemailnoten);
      } else {
        toast.success(translations[language].toastemailnotdis);
      }
      dispatch(userToggleNotifications());
      await axios.post(`http://localhost:8800/api/users/toggle-notifications`);
    } catch (error) {
      console.error("Error sending verification:", error);
    }
  };

  // ADVANCED SETTINGS

  // ADVANCED SETTINGS --> COPY USER ID
  const handleCopyClick = () => {
    navigator.clipboard.writeText(currentUser?._id);
    toast.success(translations[language].toastuserid);
  };

  // ADVANCED SETTINGS --> DELETE ACCOUNT
  const [isDeleteAccountPopupOpen, setIsDeleteAccountPopupOpen] = useState(false);

  const handleDeleteAccount = () => {
    setIsDeleteAccountPopupOpen(!isDeleteAccountPopupOpen);
  };

  const handleDeleteAccountConfirmation = async (confirmed) => {
    handleDeleteAccount();

    if (confirmed) {
      try {
        dispatch(logout());
        toast.success(translations[language].toastuserdelete);
        navigate('/');
        await axios.delete(`http://localhost:8800/api/users/${currentUser?._id}/remove/`);
      } catch (error) {
        console.error('Error deleting history:', error);
      }
    }
  };

  useEffect(() => {
    if (isDeleteAccountPopupOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isDeleteAccountPopupOpen]);

  return (
    <MainContainer settingSection={settingSection} settingSections={settingSections} >

      {currentUser ? (

        <Container>

          <SettingsListContainer>

            <SettingsListWrapper>

              <SettingsListHeader> {translations[language].settings} </SettingsListHeader>

              {settingSections.map((section, index) => (
                <SettingsListItem
                  key={index}
                  style={{ background: settingSection === section ? 'rgba(66, 66, 66, 0.7)' : '' }}
                  onClick={() => {
                    setSettingSection(section);
                    navigate(`/settings?settings=${index}`);
                  }}
                >
                  {section}
                </SettingsListItem>
              ))}

            </SettingsListWrapper>

          </SettingsListContainer>


          {settingSection === settingSections[0] && (
            <>
              <Wrapper >

                <TitleLabel>  {translations[language].account} </TitleLabel>

                <Label>  {translations[language].accounttxt}</Label>
                <SubLabel> {signinMethod} </SubLabel>

                <Line />

                <LabelBold style={{ marginBottom: '25px' }}>  {translations[language].hello} {currentUser?.displayname} </LabelBold>

                <AccountPresentationSection>

                  <AccountProfileBannereDiv formatBannerError={formatBannerError}>
                    <AccountProfileBanner src={currentUser?.banner ? currentUser?.banner : BannerPlaceholder} />

                    <InputEditAccountProfileBanner
                      type="file"
                      accept="image/jpeg, image/png, image/webp"
                      onChange={(e) => handleProfileBannerChange(e)}
                      title=""
                    />

                    <EditAccountProfileBannerImg src={EditIcono} />

                  </AccountProfileBannereDiv>

                  <AccountProfilePictureDiv formatPfPError={formatPfPError}>
                    <AccountProfilePicture src={currentUser?.img} />

                    <InputEditAccountProfilePicture
                      type="file"
                      accept="image/jpeg, image/png, image/webp"
                      onChange={(e) => handleProfilePictureChange(e)}
                      title=""
                    />

                    <EditAccountProfilePictureImg src={EditIcono} />

                  </AccountProfilePictureDiv>

                  <AccountProfileLabel> {currentUser?.displayname} </AccountProfileLabel>
                  <AccountProfileEmailLabel> {currentUser?.email}</AccountProfileEmailLabel>
                </AccountPresentationSection>

                <AccountSection
                  isChangingPassword={isChangingPassword}
                  IsVerified={currentUser?.isVerified}
                  externalLogging={currentUser?.fromFacebook || currentUser?.fromGoogle}>

                  <SmallerLabel didChange={didEmailChange} isOkay={isEmailOkay} hasFocus={hasFocusEmail}>
                    {translations[language].email}
                  </SmallerLabel>


                  {currentUser?.isVerified ? (
                    <>
                      <EditInput didChange={didEmailChange} isOkay={isEmailOkay}
                        type="text"
                        name="email"
                        placeholder={currentUser?.email}
                        value={inputs.email !== undefined ? inputs.email : currentUser?.email}
                        onChange={handleChangeEmail}
                        autoComplete="off"
                        onFocus={() => setHasFocusEmail(true)}
                        onBlur={() => setHasFocusEmail(false)}
                      />
                    </>
                  ) : (
                    <>
                      <NoEditInput
                        type="text"
                        name="email"
                        value={currentUser?.email}
                        readOnly
                        style={{ background: 'rgba(61, 54, 64, 0.3)' }}
                        onFocus={() => setHasFocusEmail(true)}
                        onBlur={() => setHasFocusEmail(false)}
                      />

                      <EmailNotConfirmed>
                        <EmailNotConfirmedImgHeader>

                          <EmailNotConfirmedImg src={NoConfirmed} />
                          <EmailNotConfirmedHeader>  {translations[language].emailnotv1} </EmailNotConfirmedHeader>

                        </EmailNotConfirmedImgHeader>

                        <EmailNotConfirmedTxt>
                          {translations[language].emailnotv2}
                          <EmailNotConfirmedVerify onClick={handleSendAccountVerification}>
                            {translations[language].emailnotv3}
                          </EmailNotConfirmedVerify>
                          {translations[language].emailnotv4}
                        </EmailNotConfirmedTxt>

                      </EmailNotConfirmed>
                    </>
                  )}


                  <SmallerLabel didChange={didUsernameChange} isOkay={isUsernameOkay} hasFocus={hasFocusUsername}>
                    {translations[language].username}
                  </SmallerLabel>
                  <EditInput didChange={didUsernameChange} isOkay={isUsernameOkay}
                    type="text"
                    name="username"
                    placeholder={currentUser?.name}
                    value={inputs.username !== undefined ? inputs.username : currentUser?.name}
                    onChange={handleChangeUsername}
                    onFocus={() => setHasFocusUsername(true)}
                    onBlur={() => setHasFocusUsername(false)}
                  />

                  <SmallerLabel didChange={didDisplayNameChange} isOkay={isDisplayNameOkay} hasFocus={hasFocusDisplayName}>
                    {translations[language].displayname}
                  </SmallerLabel>
                  <EditInput didChange={didDisplayNameChange} isOkay={isDisplayNameOkay}
                    type="text"
                    name="displayname"
                    placeholder={currentUser?.displayname}
                    value={inputs.displayname !== undefined ? inputs.displayname : currentUser?.displayname}
                    onChange={handleChangeDisplayName}
                    onFocus={() => setHasFocusDisplayName(true)}
                    onBlur={() => setHasFocusDisplayName(false)}
                  />

                  <SmallerLabel>  {translations[language].joined} </SmallerLabel>
                  <NoEditInput
                    type="text"
                    name="Joined"
                    value={formatDate(currentUser?.createdAt)}
                    readOnly
                  />

                  {!currentUser.fromFacebook && !currentUser.fromGoogle && (
                    <>
                      <ChangePasswordDiv onClick={handleChangePassword}>
                        <ChangePasswordImg />
                        <ChangePasswordLabel>  {translations[language].chpass1} </ChangePasswordLabel>
                      </ChangePasswordDiv>


                      <ChangePasswordSection>
                        <SmallerLabel hasFocus={hasFocusCurrentPassword}>  {translations[language].chpass2} </SmallerLabel>
                        <EditInput
                          type="password"
                          name="currentpassword"
                          placeholder=''
                          autoComplete="off new-password"
                          value={inputs.currentpassword !== undefined ? inputs.currentpassword : ''}
                          onChange={handleCurrentPassword}
                          onFocus={() => setHasCurrentPassword(true)}
                          onBlur={() => setHasCurrentPassword(false)}
                        />

                        <SmallerLabelNewPassoword hasFocus={hasFocusNewPassword} Strength={newPasswordStrength} Length={inputs?.newpassword?.length}>
                          {translations[language].chpass3}
                        </SmallerLabelNewPassoword>
                        <EditInputNewPassword
                          type="password"
                          name="newpassword"
                          placeholder=''
                          autoComplete="off new-password"
                          value={inputs.newpassword !== undefined ? inputs.newpassword : ''}
                          onChange={handleNewPassword}
                          onFocus={() => setHasFocusNewPassword(true)}
                          onBlur={() => setHasFocusNewPassword(false)}
                          Strength={newPasswordStrength}
                          Length={inputs?.newpassword?.length}
                        />

                        <SmallerLabel hasFocus={hasFocusConfirmNewPassword}>
                          {translations[language].chpass4}
                        </SmallerLabel>
                        <EditInput
                          type="password"
                          name="confirmnewpassword"
                          placeholder=''
                          autoComplete="off new-password"
                          value={inputs.confirmnewpassword !== undefined ? inputs.confirmnewpassword : ''}
                          onChange={handleConfirmNewPassword}
                          onFocus={() => setHasFocusConfirmNewPassword(true)}
                          onBlur={() => setHasFocusConfirmNewPassword(false)}
                        />
                      </ChangePasswordSection>

                    </>
                  )}

                  <SaveButtonDiv>
                    <SaveButton onClick={handleSaveChanges} isSaveButtonEnable={isSaveButtonEnable}>
                      {translations[language].save}
                    </SaveButton>
                  </SaveButtonDiv>

                </AccountSection>

                {/* VALIDATIONS POPUP */}

                {/* VALIDATIONS POPUP --> EMAIL*/}
                <ValidationsPopup isShowing={didEmailChange || isVerificationSent}>

                  <ValidationsPopupItem isOkay={isEmailOkay}>
                    <ValidationsPopupSymbol src={isVerificationSent ? EmailSentIcon : isEmailOkay ? CheckmarkIcon : AlertIcon} />
                    {isEmailValid ? (
                      isVerificationSent
                        ? translations[language].emailverificationsent
                        : isEmailNotAvailable
                          ? translations[language].emailnotavailable
                          : inputs?.email !== currentUser.email
                            ? translations[language].emailavailable
                            : translations[language].emailavailable
                    ) : (
                      translations[language].emailinvalid
                    )}
                  </ValidationsPopupItem>

                </ValidationsPopup>

                {/* VALIDATIONS POPUP --> USERNAME*/}
                <ValidationsPopup isShowing={didUsernameChange} style={{ top: currentUser?.isVerified ? '780px' : '884px' }}>

                  <ValidationsPopupItem isOkay={isUsernameOkay}>
                    <ValidationsPopupSymbol src={isUsernameOkay ? CheckmarkIcon : AlertIcon} />
                    {isUsernameValid ? (
                      isUsernameNotAvailable
                        ? translations[language].usernamenotavailable
                        : inputs?.username !== currentUser.name
                          ? translations[language].usernameavailable
                          : translations[language].usernameavailable
                    ) : (
                      translations[language].usernameinvalid
                    )}
                  </ValidationsPopupItem>

                </ValidationsPopup>

                {/* VALIDATIONS POPUP --> DISPLAYNAME */}
                <ValidationsPopup isShowing={didDisplayNameChange} style={{ top: currentUser?.isVerified ? '868px' : '972px' }}>

                  <ValidationsPopupItem isOkay={isDisplayNameOkay}>
                    <ValidationsPopupSymbol src={isDisplayNameOkay ? CheckmarkIcon : AlertIcon} />
                    {isDisplayNameValid ? (
                      inputs?.displayname !== currentUser.displayname
                        ? translations[language].displaynameavailable
                        : translations[language].displaynameavailable
                    ) : (
                      translations[language].displaynameinvalid
                    )}
                  </ValidationsPopupItem>

                </ValidationsPopup>


                {/* VALIDATIONS POPUP --> NEW PASSWORD */}
                <ValidationsPasswordPopup isChangingPassword={isChangingPassword} isShowing={hasFocusNewPassword} style={{ top: currentUser?.isVerified ? '1105px' : '1205px' }}>

                  <ValidationsPasswordPopupItem style={{ fontSize: '15px' }} Strength={newPasswordStrength}>
                    {newPasswordStrength === 3 && translations[language].strengthexcellent}
                    {newPasswordStrength === 2 && translations[language].strengthgreat}
                    {newPasswordStrength === 1 && translations[language].strengthokay}
                    {newPasswordStrength === 0 && translations[language].strengthtooweak}
                    <ValidationsPasswordPopupSymbol src={getPasswordStrengthImage(newPasswordStrength)} />
                  </ValidationsPasswordPopupItem>

                  <ValidationsPopupItem isOkay={inputs.newpassword?.length >= 8}>
                    <ValidationsPopupSymbol src={inputs.newpassword?.length >= 8 ? CheckmarkIcon : AlertIcon} />
                    {translations[language].passwordpopup1}
                  </ValidationsPopupItem>

                  <ValidationsPopupItem isOkay={newPasswordStrength > 0}>
                    <ValidationsPopupSymbol src={newPasswordStrength > 0 ? CheckmarkIcon : AlertIcon} />
                    {translations[language].passwordpopup2}
                  </ValidationsPopupItem>

                  <ValidationsPopupItem isOkay={newPasswordContains}>
                    <ValidationsPopupSymbol src={newPasswordContains ? CheckmarkIcon : AlertIcon} />
                    {translations[language].passwordpopup3}
                  </ValidationsPopupItem>

                </ValidationsPasswordPopup>

                <ValidationsPasswordPopup isChangingPassword={isChangingPassword} isShowing={!hasFocusNewPassword && inputs?.newpassword?.length > 0} style={{ top: currentUser?.isVerified ? '1172px' : '1277px' }}>

                  <ValidationsPasswordPopupItem style={{ fontSize: '15px', marginBottom: '0px' }} Strength={newPasswordStrength}>
                    {newPasswordStrength === 3 && translations[language].strengthexcellent}
                    {newPasswordStrength === 2 && translations[language].strengthgreat}
                    {newPasswordStrength === 1 && translations[language].strengthokay}
                    {newPasswordStrength === 0 && translations[language].strengthtooweak}
                    <ValidationsPasswordPopupSymbol src={getPasswordStrengthImage(newPasswordStrength)} />
                  </ValidationsPasswordPopupItem>

                </ValidationsPasswordPopup>

                {/* VALIDATIONS POPUP --> CONFIRM NEW PASSWORD */}
                <ValidationsPasswordPopup isChangingPassword={isChangingPassword} isShowing={!isConfirmPasswordOkay} style={{ top: currentUser?.isVerified ? '1262px' : '1367px' }}>

                  <ValidationsPopupItem>
                    <ValidationsPopupSymbol src={AlertIcon} />

                    {translations[language].passworddonotmatch}

                  </ValidationsPopupItem>
                </ValidationsPasswordPopup>

              </Wrapper>
            </>
          )}

          {settingSection === settingSections[1] && (
            <>
              <Wrapper>

                <TitleLabel>  {translations[language].notifications} </TitleLabel>

                <Label>  {translations[language].notificationstxt}</Label>
                <SubLabel> {signinMethod} </SubLabel>

                <Line />

                <Label style={{ marginTop: '20px' }}>  {translations[language].general} </Label>
                <SubLabel style={{ marginBottom: '20px' }}>  {translations[language].generaltxt} </SubLabel>

                <SwitchDiv>
                  <SwitchItem>
                    <Switch notificationsEnabled={notificationsEnabled} onClick={handleToggleNotifications} />

                    <SwitchTxt>
                      <LabelRegular>  {translations[language].suscriptions} </LabelRegular>
                      <SubLabel style={{ fontSize: '15px' }}>  {translations[language].suscriptionstxt} </SubLabel>
                    </SwitchTxt>

                  </SwitchItem>

                  <SwitchItem>
                    <Switch style={{ cursor: 'not-allowed' }} />

                    <SwitchTxt>
                      <LabelRegular>  {translations[language].recc} </LabelRegular>
                      <SubLabel style={{ fontSize: '15px' }}>  {translations[language].recctxt} </SubLabel>
                    </SwitchTxt>

                  </SwitchItem>

                  <SwitchItem>
                    <Switch style={{ cursor: 'not-allowed' }} />

                    <SwitchTxt>
                      <LabelRegular>  {translations[language].replies} </LabelRegular>
                      <SubLabel style={{ fontSize: '15px' }}>  {translations[language].replistxt} </SubLabel>
                    </SwitchTxt>

                  </SwitchItem>

                  <SwitchItem>
                    <Switch style={{ cursor: 'not-allowed' }} />

                    <SwitchTxt>
                      <LabelRegular>  {translations[language].men} </LabelRegular>
                      <SubLabel style={{ fontSize: '15px' }}>  {translations[language].mentxt} </SubLabel>
                    </SwitchTxt>

                  </SwitchItem>

                </SwitchDiv>

                <Line />

                <Label style={{ marginTop: '20px' }}>  {translations[language].emailnot}</Label>
                <SubLabel>  {translations[language].emailnottxt} </SubLabel>

              </Wrapper>
            </>
          )}

          {settingSection === settingSections[2] && (
            <>
              <Wrapper>

                <TitleLabel>  {translations[language].advsett} </TitleLabel>

                <Label>  {translations[language].advsetttxt} </Label>
                <SubLabel> {signinMethod} </SubLabel>

                <Line />

                <AdvancedSettingsDiv>

                  <AdvancedSettingItem>

                    <LabelRegular>  {translations[language].useridsett} </LabelRegular>

                    <AdvancedSettingsInput
                      type="text"
                      name="email"
                      value={currentUser?._id}
                      readOnly
                      onFocus={() => setHasFocusEmail(true)}
                      onBlur={() => setHasFocusEmail(false)}
                    />

                    <AdvancedSettingItemImg src={CopyIcono} onClick={handleCopyClick} />
                  </AdvancedSettingItem>

                  <AdvancedSettingItem>

                    <LabelRegular>  {translations[language].deleteacc} </LabelRegular>

                    <AdvancedSettingItemColumn>
                      <LabelDeleteAccount onClick={handleDeleteAccount}>  {translations[language].deleteacc} </LabelDeleteAccount>
                      <SubLabel>  {translations[language].deleteacpopttxt} </SubLabel>

                    </AdvancedSettingItemColumn>

                  </AdvancedSettingItem>

                </AdvancedSettingsDiv>


              </Wrapper>
            </>
          )}

        </Container>
      ) : (
        <NoUserContainer>
          <NoUserImg src={SadFaceIcon} />
          <NoUserMessage1>{translations[language].notlogged}</NoUserMessage1>
          <NoUserMessage2>{translations[language].notlogged2}</NoUserMessage2>
          <Link
            to="../signin"
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
        </NoUserContainer>
      )}


      {
        isDeleteAccountPopupOpen && (
          <DeleteAccountPopupContainer
            onDeleteConfirmed={() => handleDeleteAccountConfirmation(true)}
            onCancel={() => handleDeleteAccountConfirmation(false)}
          >
            <DeleteAccountPopupWrapper>
              <DeleteAccountPopupTitle> {translations[language].deleteacc} </DeleteAccountPopupTitle>
              <DeleteAccountPopupTxt> {translations[language].deleteaccpopuptxt} </DeleteAccountPopupTxt>
              <DeleteAccountPopupTxt style={{ marginTop: '-25px', fontSize: '15px' }}>
                {translations[language].deleteaccpopupnote}
              </DeleteAccountPopupTxt>
              <OptionsDeleteCancel>
                <DeleteAccountCancel onClick={() => handleDeleteAccountConfirmation(false)}>
                  {translations[language].cancel}
                </DeleteAccountCancel>
                <DeleteAccountDelete onClick={() => handleDeleteAccountConfirmation(true)}>
                  {translations[language].delete}
                </DeleteAccountDelete>
              </OptionsDeleteCancel>
            </DeleteAccountPopupWrapper>
          </DeleteAccountPopupContainer>
        )
      }

    </MainContainer >

  );
};

export default Settings;
