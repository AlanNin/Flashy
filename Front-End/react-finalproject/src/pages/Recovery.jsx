import React, { useState, useEffect, useRef, useContext } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from '../utils/LanguageContext';
import styled, { keyframes, css } from "styled-components";
import SigninBackground from "../assets/SigninBackground.jpg";
import E1ColorNoBG from "../assets/E1WhiteNoBG.png";
import FlechaDerechaIcono from "../assets/FlechaDerechaIcono.png";
import ForgotUsernameIlustration from "../assets/ForgotUsernameIlustration.webp";
import ForgotPasswordIlustration from "../assets/ForgotPasswordIlustration.webp";
import PasswordRecoveredIlustration from "../assets/PasswordRecoveredIlustration.png";
import IdiomaIcono from "../assets/IdiomaIcono.png";
import { useDispatch, useSelector } from 'react-redux';
import NotFound404Component from "../components/NotFound404Component";

// CONTAINER
const MainContainer = styled.div`
  position: relative;
  height: 100%;
  width: 100%;
`;

// LOGO
const Logo = styled.div`
  position: absolute;
  margin: 60px;
  display: flex;
  align-items: center;
  z-index: 2;
`;

const ImgLogo = styled.img`
  height: 65px;
  width: 190px;
`;

// CONTENT CONTAINER
const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  color: ${({ theme }) => theme.text};
  background: url(${SigninBackground}) no-repeat center center fixed;
  background-size: cover;
`;

// WRAPPER
const Wrapper = styled.div`
  border-radius: 12px; 
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  background: #1D1D1D;
  background: linear-gradient(#1D1D1D, #1A191B,#191819, #141214, #201D21   99% );
  padding: 80px 48px 25px 48px;
  gap: 10px;
`;

// SOME ELEMENTS
const Title = styled.h1`
  font-size: 28px;
  font-family: "Roboto Condensed", Helvetica;
  font-weight: 700;
`;

const SubTitle = styled.h2`
  font-size: 20px;
  font-weight: 400;
  font-family: "Roboto Condensed", Helvetica;
  padding: 0px 0px 30px 0px;
`;

const InputContainer = styled.div`
  position: relative;
  width: 100%;
  padding: px 0px 20px 0px;
`;

const Placeholder = styled.label`
  position: absolute;
  font-family: "Roboto Condensed", Helvetica;
  font-size: 18px;
  top: ${({ hasFocus, hasValue }) => (hasFocus || hasValue ? "-18px" : "22px")};
  left: ${({ hasFocus, hasValue }) => (hasFocus || hasValue ? "0" : "18px")};
  transform: translateY(-50%);
  font-size: ${({ hasFocus, hasValue }) =>
    hasFocus || hasValue ? "12px" : "14px"};
  color: ${({ theme }) => theme.text};
  opacity: ${({ hasFocus, hasValue }) =>
    hasFocus ? "0.7" : hasValue ? "0" : "1"};
  transition: opacity 0.3s ease-in-out, left 0.3s ease-in-out;
  pointer-events: none;

  ${({ hasFocus }) =>
    hasFocus &&
    css`
      animation: none;
      opacity: 0.7;
      transform: translateZ(0); /* Para activar el contexto 3D */

      &.fadeIn {
        animation: fadeIn 0.3s forwards;
        animation-delay: 0.15s;
      }
      &.fadeOut {
        animation: fadeOut 0.3s forwards;
      }
    `}

  @keyframes fadeOut {
    from {
      opacity: 0.5;
      transform: translateZ(0);
    }
    to {
      opacity: 0;
      transform: translateZ(-5px); /* Alejar hacia el fondo */
    }
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateZ(-5px); /* Iniciar alejado */
    }
    to {
      opacity: 0.5;
      transform: translateZ(0); /* Aparecer hacia el frente */
    }
  }
`;



const SigninFlechaDerecha = styled.img`
  width: 30px;
  height: 30px;
  padding: ${({ hasValue }) => hasValue ? "20px" : "18px"};
  border: ${({ hasValue }) => hasValue ? "none" : "2px solid gray"};
  border-radius: 25px;
  cursor: ${({ hasValue }) => hasValue ? "pointer" : "not-allowed"};
  background: ${({ hasValue }) => hasValue ? "rgb(158, 16, 90)" : "transparent"};
`;


const CantCreate = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 8px;
  
`;

const CantSignin = styled.label`
  font-family: "Roboto Condensed", Helvetica;
  font-size: 12px;
  font-weight: 700px;
  color: white;
  transition: color 0.2s;
  cursor: pointer;
  &:hover {
    color: #9A9A9A;
  }
`;

const CreateAcc = styled.label`
  font-family: "Roboto Condensed", Helvetica;
  font-size: 12px;
  font-weight: 700px;
  color: white;
  transition: color 0.2s;
  &:hover {
    color: #9A9A9A;
  }
`;


const MoreInfo = styled.div`
  position: absolute; 
  bottom: 50px; 
  left: 73px;
`;

const More = styled.div`
  display: flex;
  font-size: 11px;
  color: ${({ theme }) => theme.textSoft};
  z-index: 2;
  gap: 15px;
`;

const Links = styled.span`
  color: white;
  cursor: pointer;
`;

const MoreSub = styled.div`
  display: flex;
  font-size: 10px;
  color: ${({ theme }) => theme.textSoft};
  z-index: 2;
`;

const SubtextLink = styled.span`
  margin-top: 26px;
  color: white;
`;

const SubtextLinkClick = styled.span`
  color: white;
  cursor: pointer;
  text-decoration: underline;
  font-weight: bold;
`;

const Img2 = styled.img`
  margin-left: 2px;
  height: 15px;
  width: 15px;
`;

const LanguageSwitch = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 0px;
  cursor: pointer;
  margin-left: -2px;
  margin-bottom:-8px;
`;

const LanguageSquare = styled.div`
  padding: 4px 6px;
  color: white;
  background-color: ${({ active, theme }) => (active ? "rgba(166, 65, 117 , 0.3)" : 'rgba(42, 41, 47)')};
  border-radius: 4px;
  transition: background-color 0.8s;
`;


// SETCION START RECOVERY
const StartWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  background: transparent;
`;

const StartRecoveryTitle = styled.label`
  font-size: 85px;
  font-family: "Roboto Condensed", Helvetica;
  font-weight: bold;
  color: ${({ theme }) => theme.text};
  margin-top: -50px;
`;

const StartRecoverySubTitle = styled.label`
  font-size: 28px;
  font-family: "Roboto Condensed", Helvetica;
  font-weight: bold;
  color: ${({ theme }) => theme.textSoft};
  max-width: 900px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  margin-bottom: 80px;
`;

const StartOptionsDiv = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: max-content;
  width: max-content;
  background: transparent;
  gap: 100px;
`;

const StartOptionsItem = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 350px;
  width: 275px;
  background: #121212;
  padding: 30px;
  border-radius: 10px;

  font-size: 28px;
  font-family: "Roboto Condensed", Helvetica;
  font-weight: bold;
  color: ${({ theme }) => theme.text};
  cursor: pointer;
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: translateY(-25px);
  }
`;

const StartOptionsItemImg = styled.img`
  max-height: 150px;
  max-width: 200px;
  padding: 0px;
  margin-bottom: 40px;
  object-fit: cover;

`;

const StartOptionsItemTitle = styled.div`
  font-size: 24px;
  font-family: "Roboto Condensed", Helvetica;
  font-weight: bold;
  color: ${({ theme }) => theme.text};
  margin-bottom: 10px;
`;

const StartOptionsItemText = styled.div`
  font-size: 18px;
  font-family: "Roboto Condensed", Helvetica;
  font-weight: normal;
  color: ${({ theme }) => theme.textSoft};
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
`;

const RecoverPasswordWrapper = styled.div`
  border-radius: 12px; 
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  background: #1D1D1D;
  background: linear-gradient(#1D1D1D, #1A191B,#191819, #141214, #201D21   99% );
  padding: 40px 48px;
  gap: 10px;
`;

const RecoverPasswordTitle = styled.h1`
  font-size: 30px;
  font-family: "Roboto Condensed", Helvetica;
  font-weight: 700;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
`;

const RecoverPasswordSubTitle = styled.h2`
  font-size: 16px;
  font-weight: 300;
  font-family: "Roboto Condensed", Helvetica;
  padding: 0px 0px 35px 0px;
  max-width: 320px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  color: ${({ theme }) => theme.textSoft};
`;

const DivSigninForgotPassword = styled.div`
  margin-top: 20px;
  margin-bottom: 10px;
`;

const RegularInput = styled.input`
  font-family: "Roboto Condensed", Helvetica;
  font-size: 18px;
  border: 1px solid #1D1D1D;
  border-radius: 3px;
  padding: 10px 10px;
  background-color: #303030;
  width: 300px;
  color: ${({ theme }) => theme.text};
  transition: border-color 0.3s ease-in-out;
  outline: 1px solid #303030;
  &:focus {
    outline: 1px solid #BE49C9;
  }

  &:focus + ${Placeholder} {
    color: #BE49C9;
  }
`;

const InputConfirmPassword = styled.input`
    font-family: "Roboto Condensed", Helvetica;
    font-size: 18px;
    border: 1px solid #1D1D1D;
    border-radius: 3px;
    padding: 10px 10px;
    background-color: #303030;
    width: 300px;
    color: ${({ theme }) => theme.text};
    transition: border-color 0.3s ease-in-out;
    outline: ${({ isValid }) => (isValid ? '1px solid #303030' : '1px solid #BE49C9')};
    transition: outline 0.2s ease-in;
`;

const PlaceholderPassword = styled.label`
    position: absolute;
    font-family: "Roboto Condensed", Helvetica;
    font-size: 18px;
    top: ${({ hasFocus, hasValue }) => (hasFocus || hasValue ? "-18px" : "22px")};
    left: ${({ hasFocus, hasValue }) => (hasFocus || hasValue ? "0" : "18px")};
    transform: translateY(-50%);
    font-size: ${({ hasFocus, hasValue }) =>
    hasFocus || hasValue ? "12px" : "14px"};
      color: ${({ strength, passwordValidLength }) => {
    if (passwordValidLength) {
      if (strength === 0) return '#BE49C9';
      if (strength === 1) return 'yellow';
      if (strength === 2) return 'orange';
      if (strength === 3) return 'green';
    }
    return '';
  }};
    opacity: ${({ hasFocus, hasValue }) =>
    hasFocus ? "0.7" : hasValue ? "0" : "1"};
    transition: opacity 0.3s ease-in-out, left 0.3s ease-in-out, color 0.2s ease-in-out;
    pointer-events: none;

    ${({ hasFocus }) =>
    hasFocus &&
    css`
        animation: none;
        opacity: 0.8;
        transform: translateZ(0); /* Para activar el contexto 3D */

        &.fadeIn {
          animation: fadeIn 0.3s forwards;
          animation-delay: 0.15s;
        }
        &.fadeOut {
          animation: fadeOut 0.3s forwards;
        }
      `}

    @keyframes fadeOut {
      from {
        opacity: 0.5;
        transform: translateZ(0);
      }
      to {
        opacity: 0;
        transform: translateZ(-5px); /* Alejar hacia el fondo */
      }
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateZ(-5px); /* Iniciar alejado */
      }
      to {
        opacity: 0.5;
        transform: translateZ(0); /* Aparecer hacia el frente */
      }
    }
`;

const NewPasswordInput = styled.input`
  font-family: "Roboto Condensed", Helvetica;
  font-size: 18px;
  border: 1px solid #1D1D1D;
  border-radius: 3px;
  padding: 10px 10px;
  background-color: #303030;
  width: 300px;
  color: ${({ theme }) => theme.text};
  transition: outline 0.2s ease-in;
  
  outline: ${({ strength, passwordValidLength }) => {
    if (passwordValidLength) {
      if (strength === 0) return '1px solid #BE49C9';
      if (strength === 1) return '1px solid yellow';
      if (strength === 2) return '1px solid orange';
      if (strength === 3) return '1px solid green';
    }
    return '1px solid #303030';
  }};
`;

const ConfirmPlaceholder = styled.label`
  position: absolute;
  font-family: "Roboto Condensed", Helvetica;
  font-size: 18px;
  top: ${({ hasFocus, hasValue }) => (hasFocus || hasValue ? "-18px" : "22px")};
  left: ${({ hasFocus, hasValue }) => (hasFocus || hasValue ? "0" : "18px")};
  transform: translateY(-50%);
  font-size: ${({ hasFocus, hasValue }) =>
    hasFocus || hasValue ? "12px" : "14px"};
  color: ${({ isValid, theme }) => (isValid ? theme.text : '#BE49C9')};
  opacity: ${({ hasFocus, hasValue }) =>
    hasFocus ? "0.7" : hasValue ? "0" : "1"};
  transition: opacity 0.3s ease-in-out, left 0.3s ease-in-out, color 0.2s ease-in-out;
  pointer-events: none;

  ${({ hasFocus }) =>
    hasFocus &&
    css`
      animation: none;
      opacity: 0.8;
      transform: translateZ(0); /* Para activar el contexto 3D */

      &.fadeIn {
        animation: fadeIn 0.3s forwards;
        animation-delay: 0.15s;
      }
      &.fadeOut {
        animation: fadeOut 0.3s forwards;
      }
    `}

  @keyframes fadeOut {
    from {
      opacity: 0.5;
      transform: translateZ(0);
    }
    to {
      opacity: 0;
      transform: translateZ(-5px); /* Alejar hacia el fondo */
    }
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateZ(-5px); /* Iniciar alejado */
    }
    to {
      opacity: 0.5;
      transform: translateZ(0); /* Aparecer hacia el frente */
    }
  }
`;

// PASSWORD RECOVERED SUCCSESS
const RecoveredPasswordWrapper = styled.div`
  border-radius: 12px; 
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  background: #1D1D1D;
  background: linear-gradient(#1D1D1D, #1A191B,#191819, #141214, #201D21   99% );
  padding: 30px 38px 35px 38px;
  gap: 10px;
  width: 321px;
`;

const RecoveredPasswordIlustration = styled.img`
  height: auto;
  width: 300px;
`;

const RecoveredPasswordTitle = styled.h1`
  font-size: 24px;
  font-family: "Roboto Condensed", Helvetica;
  font-weight: 700;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  margin-top: -15px;
`;

const RecoveredPasswordSubTitle = styled.h2`
  font-size: 17px;
  font-weight: 300;
  font-family: "Roboto Condensed", Helvetica;
  padding: 0px 0px 20px 0px;
  max-width: 320px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  color: ${({ theme }) => theme.textSoft};
  margin-top: 15px;
`;

const GoToSigninButton = styled.a`
  background: linear-gradient(
    45deg,
    #ff6b6b,
    #ff6b6b,
    #e74c3c,
    #ec7063
  ); 
  border-radius: 50px;
  height: 50px;
  width: max-content;
  text-align: center;
  text-decoration: none;
  color: white;
  line-height: 50px;
  font-size: 22px;
  padding: 1px 61px;
  white-space: nowrap;
  overflow: hidden;
  text-shadow: 0.1em 0.1em 0 #111;
  font-family: "Roboto Condensed", Helvetica;
  cursor: pointer;
  transition: background 0.5s ease;

  &:hover {
    background: linear-gradient(
      45deg,
      #ff93a0,
      #ff93a0,
      #e74c3c,
      #ec7063
    );
  }
`;

const PasswordRequeriments = styled.div`
  position: absolute;
  display: flex;
  visibility: ${({ passwordFocused }) => (passwordFocused ? 'visible' : 'hidden')};
  opacity: ${({ passwordFocused }) => (passwordFocused ? '1' : '0')};
  transition: visibility 0.3s ease-in, opacity 0.3s ease-in;
  flex-direction: column;
  gap: 15px;
  width max-content;
  height: max-content;
  padding: 10px 15px;
  left: 335px;
  top: -1px;
  background-color: rgba(18, 18, 18, 0.8);
  border-radius: 8px;
`;

const PasswordRequerimentsSymbol = styled.h1`
  font-size: 13px;
  font-weight: normal;
  font-family: "Roboto Condensed", Helvetica;
  color: ${({ theme }) => theme.text};
  padding: 0px 3px 1px 4px;
  transition: background 0.2s ease-in;
  background: ${({ isValid }) => (isValid ? 'rgba(30, 217, 117, 0.6)' : 'rgba(189, 189, 189, 0.6)')};
  border-radius: 3px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const PasswordRequerimentsItem = styled.div`
  position: relative;
  display: flex;
  gap: 10px;
  width max-content;
  height: max-content;
  align-items: center;

  font-size: 16px;
  font-weight: normal;
  font-family: "Roboto Condensed", Helvetica;
  color: ${({ theme }) => theme.text};
`;


const ErrorMessage = ({ children }) => (
  <div style={{ fontSize: '15px', color: '#BE49C9', marginTop: '7px', marginRight: 'auto', fontFamily: '"Roboto Condensed", Helvetica' }}>{children}</div>
);

const ErrorMessagePassword = styled.div`
  color: ${({ strength }) => {
    if (strength === 0) return '#BE49C9';
    if (strength === 1) return 'yellow';
    if (strength === 2) return 'orange';
    if (strength === 3) return 'green';
    return 'inherit';
  }};
  margin-top: 5px;
  margin-right: auto;
  font-family: "Roboto Condensed", Helvetica;
  font-size: 15px;
  transition: color 0.2s ease-in-out;
`;

// RECOVER USERNAME

const RecoverUsernameWrapper = styled.div`
  border-radius: 12px; 
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  background: #1D1D1D;
  background: linear-gradient(#1D1D1D, #1A191B,#191819, #141214, #201D21   99% );
  padding: 40px 48px;
  gap: 10px;
`;

const RecoverUsernameTitle = styled.h1`
  font-size: ${({ language }) => (language === 'es' ? '27px' : '30px')};
  font-family: "Roboto Condensed", Helvetica;
  font-weight: 700;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
`;

const RecoverUsernameSubTitle = styled.h2`
  font-size: ${({ language }) => (language === 'es' ? '14px' : '16px')};
  font-weight: 300;
  font-family: "Roboto Condensed", Helvetica;
  padding: 0px 0px 30px 0px;
  max-width: 320px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  color: ${({ theme }) => theme.textSoft};
`;

const Recovery = () => {
  const [inputFocused, setInputFocused] = useState(false);
  const { language, setLanguage } = useLanguage();
  const { currentUser } = useSelector(state => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // RECOVERY SECTIONS DEFINITION

  const recoverySections = [
    "Start",
    "Recover Username",
    "Recover Username Email Sent",
    "Recover Password Email",
    "Recover Password Code",
    "Recover Password Reset",
  ];

  const [recoverySection, setRecoverySection] = useState(recoverySections[0]);

  const handleGoToRecoverUsername = () => {
    setRecoverySection(recoverySections[1]);
  };

  const handleGoToRecoverPassword = async () => {
    setRecoverySection(recoverySections[3]);
  };

  // INPUTS
  const [inputs, setInputs] = useState({});

  // RECOVER PASSWORD

  // EMAIL
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [emailError, setEmailError] = useState(false);
  const [emailEmptyError, setEmailEmptyError] = useState(false);

  const handleKeyPressVEmail = (e) => {
    if (e && e.key === "Enter") {
      e.preventDefault();
      handleGoToRecoverPasswordCode(e);
    }
  };

  useEffect(() => {
    if (inputs?.email !== undefined) {
      const validEmailRegex = /^[^\s]+@(gmail\.com|hotmail\.com|outlook\.es|yahoo\.com)$/i;
      setIsEmailValid(validEmailRegex.test(inputs?.email));
    }

    setEmailEmptyError(false);
    setEmailError(false);

  }, [inputs?.email]);

  const handleChangeEmail = (e) => {
    const { name, value } = e.target;
    if (value.length <= 60) {
      setInputs((prev) => {
        return { ...prev, [name]: value };
      });
    }
  };

  const handleGoToRecoverPasswordCode = async () => {

    if (inputs?.email !== undefined && inputs?.email !== '') {

      if (isEmailValid) {
        const emailCheckResponse = await axios.post("/auth/checkemail", { email: inputs?.email });
        if (emailCheckResponse.data.exists) {
          setRecoverySection(recoverySections[4]);
          await axios.post(`/users/recoverpassword`, { email: inputs.email });
        } else {
          setEmailError(true);
        }
      }

    } else {
      setEmailEmptyError(true);
    }

  };

  // PASSWORD CODE
  const [isResetCodeValid, setIsResetCodeValid] = useState(true);
  const [resetCodeError, setResetCodeError] = useState(false);
  const [resetCodeEmptyError, setResetCodeEmptyError] = useState(false);

  const handleKeyPressVPasswordCode = (e) => {
    if (e && e.key === "Enter") {
      e.preventDefault();
      handleConfirmPasswordCode(e);
    }
  };

  const handleChangePasswordCode = (e) => {
    const { name, value } = e.target;

    if (value.length <= 6) {
      setInputs((prev) => {
        return { ...prev, [name]: value };
      });
    }
  };

  useEffect(() => {

    if (inputs?.passwordcode !== undefined && inputs?.passwordcode?.length > 0) {
      setResetCodeError(inputs?.passwordcode?.length === 6 ? false : true);
    } else {
      setResetCodeError(false);
    }

    if (inputs?.passwordcode !== undefined || inputs?.passwordcode === null) {
      setResetCodeEmptyError(false);
      setIsResetCodeValid(true);
    }

  }, [inputs?.passwordcode]);

  const handleConfirmPasswordCode = async () => {

    if (inputs?.passwordcode === undefined || inputs?.passwordcode === '') {
      setResetCodeEmptyError(true);
      return;
    }

    const response = await axios.get(`/users/confirmRecoverCode?code=${inputs.passwordcode}&email=${inputs.email}`);
    const wasConfirmed = response.data;

    if (wasConfirmed && wasConfirmed.success) {
      setRecoverySection(recoverySections[5]);
    } else {
      setIsResetCodeValid(false);
    }

  };

  // NEW PASSWORD
  const [newPasswordFocused, setNewPasswordFocused] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(true);
  const [passwordStrength, setPasswordStrength] = useState(4); // INICIAR SIN NADA
  const [passwordContains, setPasswordContains] = useState(false);
  const [emptyfieldsError, setEmptyFieldsError] = useState(false);

  const handleKeyPressVNewPassword = (e) => {
    if (e && e.key === "Enter") {
      e.preventDefault();
      handleSaveNewPassword(e);
    }
  };

  const handleChangeNewPassword = (e) => {
    const { name, value } = e.target;

    if (value.length <= 20) {
      setInputs((prev) => {
        return { ...prev, [name]: value };
      });
    }
  };

  useEffect(() => {
    if (inputs?.newpassword?.length > 0) {
      const hasLetter = /[a-zA-Z]/.test(inputs.newpassword);
      const hasNumber = /\d/.test(inputs.newpassword);
      const hasUppercase = /[A-Z]/.test(inputs.newpassword);
      const hasSymbols = /[!@#$%^&*(),.?":{}|<>]/.test(inputs.newpassword);
      const longEnough = inputs.newpassword.length >= 8;

      // Contar cuántos requisitos cumple la contraseña
      const requirementsMet = [hasLetter, hasNumber, hasUppercase, hasSymbols].filter(Boolean).length;

      setPasswordContains(requirementsMet >= 2);

      if (longEnough) {
        if (hasLetter && hasNumber && hasUppercase && hasSymbols) {
          setPasswordStrength(3);
        } else if ((hasLetter && hasNumber && hasUppercase) || (hasLetter && hasUppercase && hasSymbols) || (hasNumber && hasUppercase && hasSymbols) || (hasLetter && hasNumber && hasSymbols)) {
          setPasswordStrength(2);
        } else if ((hasLetter && hasNumber) || (hasLetter && hasUppercase) || (hasLetter && hasSymbols) || (hasNumber && hasUppercase) || (hasNumber && hasSymbols) || (hasUppercase && hasSymbols)) {
          setPasswordStrength(1);
        } else {
          setPasswordStrength(0);
        }
      } else {
        setPasswordStrength(0);
      }

      setIsPasswordValid(passwordStrength === 4 ? false : passwordStrength > 0 ? true : false);
    } else {
      setIsPasswordValid(true);
    }

    setEmptyFieldsError(false);

  }, [inputs.newpassword, inputs.confirmnewpassword]);

  // CONFIRM NEW PASSWORD
  const [confirmNewPasswordFocused, setConfirmNewPasswordFocused] = useState(false);
  const [isConfirmPasswordValid, setIsConfirmPasswordValid] = useState(true);

  const handleChangeConfirmNewPassword = (e) => {
    const { name, value } = e.target;

    if (value.length <= 20) {
      setInputs((prev) => {
        return { ...prev, [name]: value };
      });
    }
  };

  useEffect(() => {

    if (inputs?.confirmnewpassword?.length > 0) {
      setIsConfirmPasswordValid(inputs?.newpassword === inputs?.confirmnewpassword ? true : false);
    } else {
      if (inputs?.newpassword?.length > 0) {
        setIsConfirmPasswordValid(inputs?.newpassword === inputs?.confirmnewpassword ? true : false);
      } else {
        setIsConfirmPasswordValid(true);
      }
    }

  }, [inputs?.confirmnewpassword, inputs?.newpassword]);

  // VERIFY IF PASSWORD IS GOOD
  const [passwordIsGood, setPasswordIsGood] = useState(false);

  useEffect(() => {
    const FirstCondition = inputs?.newpassword?.length >= 8;
    const SecondCondition = passwordContains;
    const ThirdCondition = passwordStrength > 0;
    const FourthCondition = inputs?.newpassword === inputs?.confirmnewpassword ? true : false;

    const requirementsMet = [FirstCondition, SecondCondition, ThirdCondition, FourthCondition].filter(Boolean);

    setPasswordIsGood(requirementsMet.length === 4);

  }, [inputs?.confirmnewpassword, inputs?.newpassword, passwordContains, passwordStrength]);

  // SAVE NEW PASSWORD
  const handleSaveNewPassword = async () => {

    if (inputs?.newpassword === undefined || inputs?.newpassword === ''
      || inputs?.confirmnewpassword === undefined || inputs?.confirmnewpassword === '') {
      setEmptyFieldsError(true);
    } else {
      if (passwordIsGood) {
        const response = await axios.post(`/users/recoverPasswordUpdatePassword`, {
          email: inputs.email,
          newPassword: inputs.newpassword
        });
        const wasConfirmed = response.data;

        if (wasConfirmed && wasConfirmed.success) {
          setRecoverySection(recoverySections[6]);
        }
      }
    }

  };

  // RECOVER USERNAME 
  const [isUEmailValid, setIsUEmailValid] = useState(true);
  const [uEmailError, setUEmailError] = useState(false);
  const [uEmailEmptyError, setUEmailEmptyError] = useState(false);

  const handleKeyPressUEmail = (e) => {
    if (e && e.key === "Enter") {
      e.preventDefault();
      handleSendUEmail(e);
    }
  };

  useEffect(() => {
    if (inputs?.uemail !== undefined) {
      const validEmailRegex = /^[^\s]+@(gmail\.com|hotmail\.com|outlook\.es|yahoo\.com)$/i;
      setIsUEmailValid(validEmailRegex.test(inputs?.uemail));
    }

    setUEmailEmptyError(false);
    setUEmailError(false);

  }, [inputs?.uemail]);

  const handleChangeUEmail = (e) => {
    const { name, value } = e.target;
    if (value.length <= 60) {
      setInputs((prev) => {
        return { ...prev, [name]: value };
      });
    }
  };

  const handleSendUEmail = async () => {

    if (inputs?.uemail !== undefined && inputs?.uemail !== '') {

      if (isUEmailValid) {
        const emailCheckResponse = await axios.post("/auth/checkemail", { email: inputs?.uemail });
        if (emailCheckResponse.data.exists) {
          setRecoverySection(recoverySections[2]);
          await axios.post(`/users/recoverusername`, { email: inputs.uemail });
        } else {
          setUEmailError(true);
        }
      }
    } else {
      setUEmailEmptyError(true);
    }

  };

  // GO TO SIGN IN
  const handleGotoSignin = async () => {
    navigate("/signin");
  };

  const privacyCaptcha = () => {
    window.open('https://www.hcaptcha.com/privacy', '_blank');
  };

  const termsCaptcha = () => {
    window.open('https://www.hcaptcha.com/terms', '_blank');
  };

  // USER ALREADY LOGGED
  const [userLogged, setUserLogged] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setUserLogged(true);
    } else {
      setUserLogged(false);
    }

  }, [currentUser]);

  const translations = {
    en: {
      title: "Sign in",
      subtitle: "Welcome back to Flashy!",
      placeholdername: "Username",
      placeholderpassword: "Password",
      cantsignin: "CAN'T SIGN IN?",
      createaccount: "CREATE ACCOUNT",
      support: "SUPPORT",
      privacenotice: "PRIVACY NOTICE",
      termsofservice: "TERMS OF SERVICE",
      cookiepreferences: "COOKIE PREFERENCES",
      subtextlink1: "THIS SITE IS PROTECTED BY HCAPTCHA AND ITS ",
      subtextlink2: " AND ",
      subtextlink3: " APPLY.",
      privacypolicyclick: "PRIVACY POLICY",
      termsofserviceclick: "TERMS OF SERVICE",
      orauth: "OR",
      signinErrormsg: "Username or password incorrect.",
      externalautherrormsg: "This email address is not registered.",
      emptyfields: "Please complete all the fields requeried.",
      cantsignin: "CAN'T SIGN IN?",
      cantsigninsub: "There are a few reasons you might be having this issue, please check the options below for possible solutions.",
      emptyfields: "Please complete all the fields requeried.",

      forgotusername: "Forgot username?",
      forgotusernamesub: "Need help remembering? You can request a reminder, it will be send to your email.",
      placeholderemail: "Email address",
      forgotusernametitle: "Recover Username",
      forgotusernamesubtitleemail: "Please let us know your email, if it exists we will send you the information.",

      forgotusernameemailsent: "We have sent you an email",
      forgotusernameemailsentsub: "Please check your email, we helped you remembering your username.",

      forgotpassword: "Forgot password?",
      forgotpasswordsub: "If you have forgotten your password you can reset it here.",

      forgotpasswordtitle: "Recover Password",
      forgotpasswordsubtitleemail: "Please let us know your email address so we can help you reseting your password.",
      emailinvalid: "You must enter a valid email address.",
      emaildoesntexist: "There is no user with this email address.",

      forgotpasswordtitlecode: "Reset Code",
      forgotpasswordsubtitle: "We have send you a code to reset your password to your email.",
      forgotpasswordplaceholder: "Reset code",
      codeinvalid: "You must enter a code with 6 digits.",
      codedoesntexist: "This code is incorrect.",

      forgotpasswordtitlechangepassword: "Set a new password",
      forgotpasswordsubtitlechangepassword: "Reset your account's password.",
      forgotpasswordplaceholdernew: "New password",
      forgotpasswordplaceholderconfirm: "Confirm new password",
      passwordtooweak: "Too weak",
      passwordokay: "Okay",
      passwordgreat: "Great",
      passwordexcellent: "Excellent",
      passwordpopup1: "Password is at least 8 characters long.",
      passwordpopup2: "Password is at least Okay strength or better.",
      passwordpopup3: "Password includes two of the following: letter, capital letter, number, or symbol.",
      passworddonotmatch: "Passwords do not match.",

      forgotpasswordpasswordrecovered: "Password recovered successfully!",
      forgotpasswordpasswordrecoveredsubtext: "Your password has been updated, for any other inconvenience contact our support team.",

      forgotpasswordforgotusername: "FORGOT USERNAME?",
      forgotpasswordforgotpassword: "FORGOT PASSWORD?",
      forgotpasswordgoback: "GO TO SIGN IN",
    },
    es: {
      title: "Inicio de Sesión",
      subtitle: "Bienvenido a Flashy!",
      placeholdername: "Usuario",
      placeholderpassword: "Contraseña",
      cantsignin: "¿NO PUEDES INICIAR SESIÓN?",
      createaccount: "CREAR CUENTA",
      support: "SOPORTE",
      privacenotice: "AVISO DE PRIVACIDAD",
      termsofservice: "TÉRMINOS DE USO",
      cookiepreferences: "PREFERENCIAS DE COOKIES",
      subtextlink1: "ESTA PÁGINA ESTÁ PROTEGIDA POR HCAPTCHA Y SU ",
      subtextlink2: " Y LOS ",
      subtextlink3: " APLICAN.",
      privacypolicyclick: "AVISO DE PRIVACIDAD",
      termsofserviceclick: "TÉRMINOS DE SERVICIO",
      orauth: "O",
      signinErrormsg: "Usuario o contraseña incorrecta.",
      externalautherrormsg: "Este correo electrónico no está registrado.",
      emptyfields: "Por favor acepta los requerimientos para continuar.",
      cantsignin: "¿NO PUEDES INICIAR SESIÓN?",
      cantsigninsub: "Existen varias razones por las que podrías tener este problema, consulte las opciones a continuación para encontrar posibles soluciones.",
      emptyfields: "Por favor rellena todos los campos para continuar.",

      forgotusername: "¿Olvidaste tu usuario?",
      forgotusernamesub: "¿Necesitas ayuda para recordarlo? Puedes solicitar un recordario, este será enviado a tu correo electrónico.",
      placeholderemail: "Correo electrónico",

      forgotusernametitle: "Recuperar Nombre de Usuario",
      forgotusernamesubtitleemail: "Por favor ingresa tu correo electrónico, si existe te enviaremos la información correspondiente.",


      forgotusernameemailsent: "Te hemos enviado un correo",
      forgotusernameemailsentsub: "Por favor revisa tu correo, te hemos ayudado ha recordar tu nombre de usuario.",

      forgotpassword: "¿Olvidaste tu contraseña?",
      forgotpasswordsub: "Si olvidaste tu contraseña puedes restablecerla aqui.",

      forgotpasswordtitle: "Recuperar Contraseña",
      forgotpasswordsubtitleemail: "Por favor ingresa tu correo electrónico para poder recuperar tu contraseña.",
      emailinvalid: "Debes ingresar un email valido.",
      emaildoesntexist: "No existe ningún usuario con este correo electrónico.",

      forgotpasswordtitlecode: "Codigo de restablecimiento",
      forgotpasswordsubtitle: "Hemos enviado un codigo para restablecer tu contraseña a tu correo.",
      forgotpasswordplaceholder: "Codigo de restablecimiento",
      codeinvalid: "Debes ingresar un código con 6 dígitos.",
      codedoesntexist: "Este código es incorrecto.",

      forgotpasswordtitlechangepassword: "Establece una nueva contraseña",
      forgotpasswordsubtitlechangepassword: "Ingresa una nueva contraseña para tu cuenta.",
      forgotpasswordplaceholdernew: "Nueva contraseña",
      forgotpasswordplaceholderconfirm: "Confirmar nueva contraseña",
      passwordtooweak: "Muy débil",
      passwordokay: "Aceptable",
      passwordgreat: "Genial",
      passwordexcellent: "Excelente",
      passwordpopup1: "La contraseña tiene al menos 8 caracteres.",
      passwordpopup2: "La contraseña es por lo menos aceptable o mejor.",
      passwordpopup3: "La contraseña incluye dos de lo siguiente: letra, mayúscula, numero, o símbolo.",
      passworddonotmatch: "Las contraseñas no coinciden.",

      forgotpasswordpasswordrecovered: "Contraseña restablecida existosamente!",
      forgotpasswordpasswordrecoveredsubtext: "Tu contraseña ha sido actualizada, cualquier duda contacta a nuestro equipo de soporte.",

      forgotpasswordforgotusername: "¿OLVIDASTE TU USUARIO?",
      forgotpasswordforgotpassword: "OLVIDASTE TU CONTRASEÑA?",
      forgotpasswordgoback: "IR AL INICIO DE SESIÓN",
    },
  };

  return (
    <>
      {userLogged ? (
        <NotFound404Component />
      ) : (

        <MainContainer>

          <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
            <Logo>
              <ImgLogo src={E1ColorNoBG} />
            </Logo>
          </Link>

          <Container>
            {recoverySection === recoverySections[0] && (
              <StartWrapper>
                <StartRecoveryTitle>
                  {translations[language].cantsignin}
                </StartRecoveryTitle>
                <StartRecoverySubTitle>
                  {translations[language].cantsigninsub}
                </StartRecoverySubTitle>

                <StartOptionsDiv>
                  <StartOptionsItem onClick={handleGoToRecoverUsername}>
                    <StartOptionsItemImg src={ForgotUsernameIlustration} />
                    <StartOptionsItemTitle> {translations[language].forgotusername} </StartOptionsItemTitle>
                    <StartOptionsItemText> {translations[language].forgotusernamesub} </StartOptionsItemText>
                  </StartOptionsItem>

                  <StartOptionsItem onClick={handleGoToRecoverPassword}>
                    <StartOptionsItemImg src={ForgotPasswordIlustration} style={{ marginTop: '-22px' }} />
                    <StartOptionsItemTitle> {translations[language].forgotpassword} </StartOptionsItemTitle>
                    <StartOptionsItemText> {translations[language].forgotpasswordsub} </StartOptionsItemText>
                  </StartOptionsItem>
                </StartOptionsDiv>

              </StartWrapper>
            )}

            {recoverySection === recoverySections[1] && (

              <RecoverUsernameWrapper>
                <RecoverUsernameTitle language={language}>{translations[language].forgotusernametitle}</RecoverUsernameTitle>
                <RecoverUsernameSubTitle language={language}>{translations[language].forgotusernamesubtitleemail}</RecoverUsernameSubTitle>

                <InputContainer>
                  <RegularInput
                    type="text"
                    name="uemail"
                    value={inputs.uemail !== undefined ? inputs.uemail : ''}
                    onChange={(e) => {
                      handleChangeUEmail(e);
                    }}
                    onKeyPress={handleKeyPressUEmail}
                    onFocus={() => setInputFocused(true)}
                    onBlur={() => setInputFocused(false)}
                    required
                    autoComplete="off"

                  />
                  <Placeholder
                    hasFocus={inputFocused || (inputs?.uemail !== undefined && inputs?.uemail !== '')}
                    hasValue={inputs?.uemail !== undefined && inputs?.uemail !== ''}
                  >
                    {translations[language].placeholderemail}
                  </Placeholder>

                  {uEmailEmptyError && <ErrorMessage>{translations[language].emptyfields}</ErrorMessage>}
                  {!isUEmailValid && !uEmailEmptyError && inputs?.uemail !== '' && <ErrorMessage>{translations[language].emailinvalid}</ErrorMessage>}
                  {uEmailError && <ErrorMessage>{translations[language].emaildoesntexist}</ErrorMessage>}

                </InputContainer>

                <DivSigninForgotPassword onClick={handleSendUEmail} id="DivSignin">
                  <SigninFlechaDerecha
                    src={FlechaDerechaIcono}
                    hasValue={inputs.uemail !== '' && inputs.uemail !== undefined && isUEmailValid}
                  />
                </DivSigninForgotPassword>

                <CantCreate>
                  <CantSignin onClick={handleGoToRecoverPassword}>
                    {translations[language].forgotpasswordforgotpassword}
                  </CantSignin>

                  <CreateAcc>
                    <Link to="../signin" style={{ textDecoration: "none", color: "inherit", fontSize: "inherit", fontFamily: "inherit" }}>
                      {translations[language].forgotpasswordgoback}
                    </Link>
                  </CreateAcc>


                </CantCreate>

              </RecoverUsernameWrapper>
            )}

            {recoverySection === recoverySections[2] && (

              <RecoveredPasswordWrapper>
                <RecoveredPasswordIlustration src={PasswordRecoveredIlustration} />
                <RecoveredPasswordTitle>{translations[language].forgotusernameemailsent}</RecoveredPasswordTitle>
                <RecoveredPasswordSubTitle>{translations[language].forgotusernameemailsentsub}</RecoveredPasswordSubTitle>

                <GoToSigninButton onClick={handleGotoSignin}> Go to Sign in</GoToSigninButton>

              </RecoveredPasswordWrapper>
            )}

            {recoverySection === recoverySections[3] && (

              <RecoverPasswordWrapper>
                <RecoverPasswordTitle>{translations[language].forgotpasswordtitle}</RecoverPasswordTitle>
                <RecoverPasswordSubTitle>{translations[language].forgotpasswordsubtitleemail}</RecoverPasswordSubTitle>

                <InputContainer>
                  <RegularInput
                    type="text"
                    name="email"
                    value={inputs.email !== undefined ? inputs.email : ''}
                    onChange={(e) => {
                      handleChangeEmail(e);
                    }}
                    onKeyPress={handleKeyPressVEmail}
                    onFocus={() => setInputFocused(true)}
                    onBlur={() => setInputFocused(false)}
                    required
                    autoComplete="off"

                  />
                  <Placeholder
                    hasFocus={inputFocused || (inputs?.email !== undefined && inputs?.email !== '')}
                    hasValue={inputs?.email !== undefined && inputs?.email !== ''}
                  >
                    {translations[language].placeholderemail}
                  </Placeholder>

                  {emailEmptyError && <ErrorMessage>{translations[language].emptyfields}</ErrorMessage>}
                  {!isEmailValid && !emailEmptyError && inputs?.email !== '' && <ErrorMessage>{translations[language].emailinvalid}</ErrorMessage>}
                  {emailError && <ErrorMessage>{translations[language].emaildoesntexist}</ErrorMessage>}

                </InputContainer>

                <DivSigninForgotPassword onClick={handleGoToRecoverPasswordCode} id="DivSignin">
                  <SigninFlechaDerecha
                    src={FlechaDerechaIcono}
                    hasValue={inputs.email !== '' && inputs.email !== undefined && isEmailValid}
                  />
                </DivSigninForgotPassword>

                <CantCreate>
                  <CantSignin onClick={handleGoToRecoverUsername}>
                    {translations[language].forgotpasswordforgotusername}
                  </CantSignin>

                  <CreateAcc>
                    <Link to="../signin" style={{ textDecoration: "none", color: "inherit", fontSize: "inherit", fontFamily: "inherit" }}>
                      {translations[language].forgotpasswordgoback}
                    </Link>
                  </CreateAcc>


                </CantCreate>

              </RecoverPasswordWrapper>
            )}

            {recoverySection === recoverySections[4] && (

              <RecoverPasswordWrapper>
                <RecoverPasswordTitle>{translations[language].forgotpasswordtitlecode}</RecoverPasswordTitle>
                <RecoverPasswordSubTitle>{translations[language].forgotpasswordsubtitle}</RecoverPasswordSubTitle>

                <InputContainer>
                  <RegularInput
                    type="password"
                    name="passwordcode"
                    value={inputs.passwordcode !== undefined ? inputs.passwordcode : ''}
                    onChange={(e) => {
                      handleChangePasswordCode(e);
                    }}
                    onKeyPress={handleKeyPressVPasswordCode}
                    onFocus={() => setInputFocused(true)}
                    onBlur={() => setInputFocused(false)}
                    required
                  />
                  <Placeholder
                    hasFocus={inputFocused || (inputs?.passwordcode !== undefined && inputs?.passwordcode !== '')}
                    hasValue={inputs?.passwordcode !== undefined && inputs?.passwordcode !== ''}
                  >
                    {translations[language].forgotpasswordplaceholder}
                  </Placeholder>

                  {resetCodeError && !emailEmptyError && inputs?.passwordcode !== null && <ErrorMessage>{translations[language].codeinvalid}</ErrorMessage>}
                  {resetCodeEmptyError && <ErrorMessage>{translations[language].emptyfields}</ErrorMessage>}
                  {!isResetCodeValid && !resetCodeError && <ErrorMessage>{translations[language].codedoesntexist}</ErrorMessage>}

                </InputContainer>

                <DivSigninForgotPassword onClick={handleConfirmPasswordCode} id="DivSignin">
                  <SigninFlechaDerecha src={FlechaDerechaIcono} hasValue={inputs.passwordcode !== "" && inputs.passwordcode !== undefined} />
                </DivSigninForgotPassword>

                <CantCreate>
                  <CantSignin onClick={handleGoToRecoverUsername}>
                    {translations[language].forgotpasswordforgotusername}
                  </CantSignin>

                  <CreateAcc>
                    <Link to="../signin" style={{ textDecoration: "none", color: "inherit", fontSize: "inherit", fontFamily: "inherit" }}>
                      {translations[language].forgotpasswordgoback}
                    </Link>
                  </CreateAcc>


                </CantCreate>

              </RecoverPasswordWrapper>
            )}


            {recoverySection === recoverySections[5] && (

              <RecoverPasswordWrapper>
                <RecoverPasswordTitle>{translations[language].forgotpasswordtitlechangepassword}</RecoverPasswordTitle>
                <RecoverPasswordSubTitle>{translations[language].forgotpasswordsubtitlechangepassword}</RecoverPasswordSubTitle>

                <InputContainer>
                  <NewPasswordInput
                    type="password"
                    name="newpassword"
                    value={inputs.newpassword !== undefined ? inputs.newpassword : ''}
                    onChange={(e) => {
                      handleChangeNewPassword(e);
                    }}
                    onKeyPress={handleKeyPressVNewPassword}
                    onFocus={() => setNewPasswordFocused(true)}
                    onBlur={() => setNewPasswordFocused(false)}
                    required
                    autoComplete='off new-password'
                    strength={passwordStrength}
                    passwordValidLength={inputs?.newpassword?.length > 0}
                    passwordLength={inputs?.newpassword?.length}
                  />
                  <PlaceholderPassword
                    hasFocus={newPasswordFocused || inputs.newpassword !== ""
                      && inputs.newpassword !== undefined} hasValue={inputs.newpassword !== ""
                        && inputs.newpassword !== undefined}
                    strength={passwordStrength}
                    passwordValidLength={inputs?.newpassword?.length > 0}
                    isValid={isPasswordValid}
                  >
                    {translations[language].forgotpasswordplaceholdernew}
                  </PlaceholderPassword>

                  {inputs?.newpassword !== undefined && inputs?.newpassword !== '' && passwordStrength >= 0 && passwordStrength < 4 && <ErrorMessagePassword strength={passwordStrength}>
                    {passwordStrength === 3 && translations[language].passwordexcellent}
                    {passwordStrength === 2 && translations[language].passwordgreat}
                    {passwordStrength === 1 && translations[language].passwordokay}
                    {passwordStrength === 0 && translations[language].passwordtooweak}
                  </ErrorMessagePassword>}

                  <PasswordRequeriments passwordFocused={newPasswordFocused}>

                    <PasswordRequerimentsItem>
                      <PasswordRequerimentsSymbol isValid={inputs?.newpassword?.length >= 8}>
                        {inputs?.newpassword?.length >= 8 ? '✔' : '✖'}
                      </PasswordRequerimentsSymbol>
                      {translations[language].passwordpopup1}
                    </PasswordRequerimentsItem>
                    <PasswordRequerimentsItem>
                      <PasswordRequerimentsSymbol isValid={inputs?.newpassword?.length > 0 && passwordStrength >= 1 && passwordStrength < 4}>
                        {inputs?.newpassword?.length > 0 && passwordStrength >= 1 && passwordStrength < 4 ? '✔' : '✖'}
                      </PasswordRequerimentsSymbol>
                      {translations[language].passwordpopup2}
                    </PasswordRequerimentsItem>

                    <PasswordRequerimentsItem>
                      <PasswordRequerimentsSymbol isValid={inputs?.newpassword?.length > 0 && passwordContains}>
                        {inputs?.newpassword?.length > 0 && passwordContains ? '✔' : '✖'}
                      </PasswordRequerimentsSymbol>
                      {translations[language].passwordpopup3}
                    </PasswordRequerimentsItem>

                  </PasswordRequeriments>

                </InputContainer>

                <InputContainer style={{ marginTop: '20px' }}>
                  <InputConfirmPassword
                    type="password"
                    name="confirmnewpassword"
                    value={inputs.confirmnewpassword !== undefined ? inputs.confirmnewpassword : ''}
                    onChange={(e) => {
                      handleChangeConfirmNewPassword(e);
                    }}
                    onKeyPress={handleKeyPressVNewPassword}
                    onFocus={() => setConfirmNewPasswordFocused(true)}
                    onBlur={() => setConfirmNewPasswordFocused(false)}
                    required
                    autoComplete='off new-password'
                    isValid={isConfirmPasswordValid}
                  />
                  <ConfirmPlaceholder hasFocus={confirmNewPasswordFocused || inputs.confirmnewpassword !== "" && inputs.confirmnewpassword !== undefined} hasValue={inputs.confirmnewpassword !== ""
                    && inputs.confirmnewpassword !== undefined} isValid={isConfirmPasswordValid}>
                    {translations[language].forgotpasswordplaceholderconfirm}
                  </ConfirmPlaceholder>

                  {!isConfirmPasswordValid && <ErrorMessage>{translations[language].passworddonotmatch}</ErrorMessage>}
                  {emptyfieldsError && <ErrorMessage>{translations[language].emptyfields}</ErrorMessage>}

                </InputContainer>

                <DivSigninForgotPassword onClick={handleSaveNewPassword} id="DivSignin">
                  <SigninFlechaDerecha src={FlechaDerechaIcono}
                    hasValue={inputs.newpassword !== "" && inputs.newpassword !== undefined
                      && inputs.confirmnewpassword !== undefined && inputs.confirmnewpassword !== undefined && passwordIsGood}
                  />
                </DivSigninForgotPassword>

                <CantCreate>
                  <CantSignin onClick={handleGoToRecoverUsername}>
                    {translations[language].forgotpasswordforgotusername}
                  </CantSignin>

                  <CreateAcc>
                    <Link to="../signin" style={{ textDecoration: "none", color: "inherit", fontSize: "inherit", fontFamily: "inherit" }}>
                      {translations[language].forgotpasswordgoback}
                    </Link>
                  </CreateAcc>


                </CantCreate>

              </RecoverPasswordWrapper>
            )}

            {recoverySection === recoverySections[6] && (

              <RecoveredPasswordWrapper>
                <RecoveredPasswordIlustration src={PasswordRecoveredIlustration} />
                <RecoveredPasswordTitle>{translations[language].forgotpasswordpasswordrecovered}</RecoveredPasswordTitle>
                <RecoveredPasswordSubTitle>{translations[language].forgotpasswordpasswordrecoveredsubtext}</RecoveredPasswordSubTitle>

                <GoToSigninButton onClick={handleGotoSignin}> Go to Sign in</GoToSigninButton>

              </RecoveredPasswordWrapper>
            )}


          </Container>

          <MoreInfo>

            <More>
              <Links>{translations[language].support}</Links>
              <Links>{translations[language].privacenotice}</Links>
              <Links>{translations[language].termsofservice}</Links>
              <Links>{translations[language].cookiepreferences}</Links>


              <LanguageSwitch onClick={() => setLanguage(language === 'en' ? 'es' : 'en')}>
                <LanguageSquare active={language === 'en'}>
                  EN
                </LanguageSquare>
                <LanguageSquare active={language === 'es'}>
                  ES
                </LanguageSquare>
                <Img2 src={IdiomaIcono} />
              </LanguageSwitch>

            </More>

            <MoreSub>
              <SubtextLink> {translations[language].subtextlink1} <SubtextLinkClick onClick={privacyCaptcha}>{translations[language].privacypolicyclick}</SubtextLinkClick>{translations[language].subtextlink2} <SubtextLinkClick onClick={termsCaptcha}>{translations[language].termsofserviceclick}</SubtextLinkClick> {translations[language].subtextlink3}</SubtextLink>
            </MoreSub>

          </MoreInfo>

        </MainContainer >

      )}

    </>

  );
};

export default Recovery;
