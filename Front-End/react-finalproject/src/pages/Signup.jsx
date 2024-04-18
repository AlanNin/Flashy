import React, { useState, useEffect, useRef, useContext } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from '../utils/LanguageContext';
import styled, { keyframes, css } from "styled-components";
import SigninBackground from "../assets/SigninBackground.jpg";
import E1ColorNoBG from "../assets/E1WhiteNoBG.png";
import FacebookSignin from "../assets/FacebookSignin.png";
import GoogleSignin from "../assets/GoogleSignin.png";
import FlechaDerechaIcono from "../assets/FlechaDerechaIcono.png";
import IdiomaIcono from "../assets/IdiomaIcono.png";
import HCaptcha from '@hcaptcha/react-hcaptcha';
import { auth, GoogleProvider, FacebookProvider } from "../firebase"
import { signInWithPopup } from "firebase/auth";
import { useDispatch, useSelector } from 'react-redux';
import { loginFailure, loginStart, loginSuccess } from "../redux/userSlice";
import { toast } from 'react-toastify';
import NotFound404Component from "../components/NotFound404Component";

const MainContainer = styled.div`
  position: relative;
  height: 100%;
  width: 100%;
`;

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

const Wrapper = styled.div`
  border-radius: 15px; 
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  background: #1D1D1D;
  background: linear-gradient(#1D1D1D, #1A191B,#191819, #141214, #201D21   99% );
  padding: 40px 48px 25px 48px;
  gap: 10px;
`;


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
  padding: 0px 0px 20px 0px;
`;


const InputStyles = styled.input`
  font-family: "Roboto Condensed", Helvetica;
  font-size: 18px;
  border: 1px solid #1D1D1D;
  border-radius: 3px;
  padding: 9px;
  background-color: #303030;
  width: 350px;
  color: ${({ theme }) => theme.text};
  outline: none;
  transition: outline 0.2s ease-in;

  &:focus {
    border-color: ${({ theme }) => theme.accent};
  }
`;

const InputEmail = styled(InputStyles)`
  outline: ${({ isValid }) => (isValid ? '1px solid #303030' : '1px solid #BE49C9')};
`;

const InputUsername = styled(InputStyles)`
  outline: ${({ isValid }) => (isValid ? '1px solid #303030' : '1px solid #BE49C9')};
`;

const InputDisplayName = styled(InputStyles)`
  outline: ${({ isValid }) => (isValid ? '1px solid #303030' : '1px solid #BE49C9')};
`;

const InputPassword = styled(InputStyles)`
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
  left: 380px;
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


const InputConfirmPassword = styled(InputStyles)`
  outline: ${({ isValid }) => (isValid ? '1px solid #303030' : '1px solid #BE49C9')};
`;

const Placeholder = styled.label`
  position: absolute;
  font-family: "Roboto Condensed", Helvetica;
  font-size: 18px;
  top: ${({ hasFocus, hasValue }) => (hasFocus || hasValue ? "-18px" : "21px")};
  left: ${({ hasFocus, hasValue }) => (hasFocus || hasValue ? "0" : "18px")};
  transform: translateY(-50%);
  font-size: ${({ hasFocus, hasValue }) =>
    hasFocus || hasValue ? "12px" : "14px"};
  color: ${({ theme }) => theme.text};
  opacity: ${({ hasFocus, hasValue }) =>
    hasFocus ? "0.7" : hasValue ? "0" : "1"};
  transition: opacity 0.3s ease-in-out, left 0.3s ease-in-out, color 0.2s ease-in-out;
  pointer-events: none;

  ${({ hasFocus, isValid }) =>
    hasFocus &&
    css`
      animation: none;
      opacity: ${({ isValid }) => (isValid ? "0.5" : "1")};
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

const PlaceholderEmail = styled(Placeholder)`
  color: ${({ isValid }) => (isValid ? '' : '#BE49C9')};
`;

const PlaceholderUsername = styled(Placeholder)`
  color: ${({ isValid }) => (isValid ? '' : '#BE49C9')};
`;

const PlaceholderDisplayName = styled(Placeholder)`
  color: ${({ isValid }) => (isValid ? '' : '#BE49C9')};
`;

const PlaceholderPassword = styled(Placeholder)`
  color: ${({ strength, passwordValidLength }) => {
    if (passwordValidLength) {
      if (strength === 0) return '#BE49C9';
      if (strength === 1) return '#FBD541';
      if (strength === 2) return '#FC9D3E';
      if (strength === 3) return '#60AF00';
    }
    return '';
  }};

  opacity: ${({ passwordlength, hasFocus }) => (hasFocus && passwordlength === 0 ? '0.5' : '1')};
`;


const PlaceholderConfirmPassword = styled(Placeholder)`
  color: ${({ isValid }) => (isValid ? '' : '#BE49C9')};
`;

const SignButtons = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%; /* Asegura que ocupe todo el ancho disponible */
  gap: 8px;
`;

const SignButtonsTxt = styled.h1`
font-size: 14px;
padding: 0px 15px;
font-family: "Roboto Condensed", Helvetica;
font-weight: 400;
`;

const ButtonFacebook = styled.button`
  border-radius: 9px;
  width: 100px;
  height: 32px;
  border: none;
  cursor: pointer;
  background: rgb(11,87,187);
  &:hover {
    background-color: rgb(39, 73, 171);
  }
`;

const FacebookImg = styled.img`
  width: 24px;
  height: 24px;
`;

const ButtonGoogle = styled.button`
  border-radius: 9px;
  width: 100px;
  height: 32px;
  border: none;
  cursor: pointer;
  background: rgb(254,255,254);
  &:hover {
    background-color: rgb(198, 198, 198);
  }
`;

const GoogleImg = styled.img`
  width: 24px;
  height: 24px;
`;

const DivSignup = styled.div`
  margin-top: 15px;
  margin-bottom: 10px;
`;

const SigninFlechaDerecha = styled.img`
  width: ${({ hasValue }) => hasValue ? "33.5px" : "30px"};
  height: ${({ hasValue }) => hasValue ? "33.5px" : "30px"};
  padding: 18px 18px;
  border: ${({ hasValue }) => hasValue ? "none" : "2.5px solid gray"};
  border-radius: 25px;
  cursor: ${({ hasValue }) => hasValue ? "pointer" : "not-allowed"};
  background: ${({ hasValue }) => hasValue ? "rgb(158, 16, 90)" : "transparent"};
`;


const LabelAcc = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 8px;
  
`;

const AlreadyAccount = styled.label`
  font-family: "Roboto Condensed", Helvetica;
  font-size: 12px;
  font-weight: 700px;
  color: white;
  cursor: pointer;
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


const Checkbox1 = styled.div`
  width: 100%;
  margin-right: auto;
  display: flex;
  margin-top: 10px;
`;

const Checkbox2 = styled.div`
  width: 100%;
  margin-right: auto;
  display: flex;
`;

const CheckboxTxt = styled.h1`
  font-size: 14px;
  margin-left: 5px;
  font-family: "Roboto Condensed", Helvetica;
  font-weight: 400;
`;

const ErrorMessage = ({ children }) => (
  <div style={{ color: '#BE49C9', fontSize: '15px', marginTop: '5px', marginRight: 'auto', fontFamily: '"Roboto Condensed", Helvetica' }}>{children}</div>
);

const ErrorMessagePassword = styled.div`
  color: ${({ strength }) => {
    if (strength === 0) return '#BE49C9';
    if (strength === 1) return '#FBD541';
    if (strength === 2) return '#FC9D3E';
    if (strength === 3) return '#60AF00';
    return 'inherit';
  }};
  margin-top: 5px;
  margin-right: auto;
  font-family: "Roboto Condensed", Helvetica;
  font-size: 15px;
`;

const Signup = () => {
  const [name, setName] = useState("");
  const [displayname, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [nameFocused, setNameFocused] = useState(false);
  const [displaynameFocused, setDisplayNameFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [confirmpasswordFocused, setConfirmPasswordFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const { language, setLanguage } = useLanguage();
  const captchaRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [nameError, setNameError] = useState(false);
  const [nameInvalidError, setNameInvalidError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [authError, setAuthError] = useState(false);
  const [checkboxError, setCheckboxError] = useState(false);
  const [emptyfieldsError, setEmptyFieldsError] = useState(false);
  const [confirmpasswordError, setConfirmPasswordError] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [receiveEmails, setReceiveEmails] = useState(false);
  const { currentUser } = useSelector(state => state.user);

  const handleAcceptTermsChange = () => {
    setAcceptTerms(!acceptTerms);
    setCheckboxError(false);
  };

  const handleReceiveEmailsChange = () => {
    setReceiveEmails(!receiveEmails);
    setCheckboxError(false);
  };

  const handleHCaptchaVerify = () => {
    captchaRef.current.execute();
  };

  const onLoad = () => {
    // Puedes realizar alguna lógica cuando el hCaptcha se carga (opcional)
  };

  const privacyCaptcha = () => {
    window.open('https://www.hcaptcha.com/privacy', '_blank');
  };

  const termsCaptcha = () => {
    window.open('https://www.hcaptcha.com/terms', '_blank');
  };

  const signUpWithGoogle = async () => {
    dispatch(loginStart());

    try {
      const result = await signInWithPopup(auth, GoogleProvider);

      const userData = {
        name: result.user.uid,
        displayname: result.user.displayName,
        email: result.user.email,
        img: result.user.photoURL,
        fromGoogle: true,
      };

      // Check if the name and email are already registered
      const nameCheckResponse = await axios.post("http://localhost:8800/api/auth/checkname", { name: userData.name });
      const emailCheckResponse = await axios.post("http://localhost:8800/api/auth/checkemail", { email: userData.email });

      if (nameCheckResponse.data.exists) {
        // Display an error message for username
        console.error("Username is already taken");
        setAuthError(true);
        dispatch(loginFailure()); // You might want to handle this according to your UI
        return;
      }

      else if (emailCheckResponse.data.exists) {
        // Display an error message for email
        console.error("Email is already taken");
        setAuthError(true);
        dispatch(loginFailure()); // You might want to handle this according to your UI
        return;
      }

      // If both username and email are available, proceed with external signup
      const res = await axios.post("http://localhost:8800/api/auth/externalsignup", userData);

      console.log('Response from the server:', res);

      dispatch(loginSuccess(res.data));
      toast.success(translations[language].toastw);
      navigate("/");

    } catch (error) {
      console.error("Error in signUpWithGoogle:", error);
      dispatch(loginFailure());
    }
  };


  const signUpWithFacebook = async () => {
    dispatch(loginStart());

    try {
      const result = await signInWithPopup(auth, FacebookProvider);
      const facebookId = result.user.providerData[0].uid;
      const photoURL = `http://graph.facebook.com/${facebookId}/picture?type=square`;

      const userData = {
        name: facebookId,
        displayname: result.user.displayName,
        email: result.user.email,
        img: photoURL,
        fromFacebook: true,
      };

      // Check if the name and email are already registered
      const nameCheckResponse = await axios.post("http://localhost:8800/api/auth/checkname", { name: userData.name });
      const emailCheckResponse = await axios.post("http://localhost:8800/api/auth/checkemail", { email: userData.email });

      if (nameCheckResponse.data.exists) {
        // Display an error message for username
        console.error("Username is already taken");
        setAuthError(true);
        dispatch(loginFailure()); // You might want to handle this according to your UI
        return;
      }

      else if (emailCheckResponse.data.exists) {
        // Display an error message for email
        console.error("Email is already taken");
        setAuthError(true);
        dispatch(loginFailure()); // You might want to handle this according to your UI
        return;
      }

      console.log('Data being sent in the POST request:', userData);

      const res = await axios.post("http://localhost:8800/api/auth/externalsignup", userData);

      console.log('Response from the server:', res);

      dispatch(loginSuccess(res.data));
      toast.success(translations[language].toastw);
      navigate("/");


    } catch (error) {
      console.error("Error in signUpWithFacebook:", error);

      if (error.response) {
        // Error de respuesta del servidor
        console.error("Error del servidor:", error.response.data.error);
        // Puedes mostrar el mensaje de error al usuario
        // Por ejemplo, con un estado de error en tu componente
        // setErrorMessage(error.response.data.error);
      }

      dispatch(loginFailure());
    }
  };

  const handleDivSignupClick = async (e) => {
    e.preventDefault();
    dispatch(loginStart());

    if (email !== "" && name !== "" && displayname !== "" && password !== "" && confirmpassword !== "") {
      try {
        // Check if the name is already registered
        const nameCheckResponse = await axios.post("http://localhost:8800/api/auth/checkname", { name });
        const emailCheckResponse = await axios.post("http://localhost:8800/api/auth/checkemail", { email });

        //Check Username 
        const isNameValid = /^[^\s]{3,20}$/.test(name);

        // Initialize error flag
        let isError = false;

        if (nameCheckResponse.data.exists) {
          // Display an error message for username
          console.error("Username is already taken");
          setNameError(true);
          isError = true;
        }

        if (emailCheckResponse.data.exists) {
          // Display an error message for email
          console.error("Email is already taken");
          setEmailError(true);
          isError = true;
        }

        if (password !== confirmpassword) {
          // Display an error password not matching
          console.error("Password do not match");
          setConfirmPasswordError(true);
          isError = true;
        }

        if (!acceptTerms || !receiveEmails) {
          // Display an error checkbox missing
          console.error("Checkbox missing");
          setCheckboxError(true);
          isError = true;
        }

        if (!isNameValid) {
          console.error("Invalid username");
          setNameInvalidError(true);
          isError = true;
        }

        // Check if there are no errors before executing handleHCaptchaVerify
        if (!isError) {
          handleHCaptchaVerify();
        }


      } catch (error) {
        // Handle the error appropriately
        console.error("Error checking username:", error);
        dispatch(loginFailure());
      }
    } else {
      console.error("Username, email, and password are required");
      setEmptyFieldsError(true);
    }
  };

  const onHCaptchaVerify = async (token) => {
    // Verifica si el token hCaptcha se recibió con éxito
    if (token) {
      try {
        // Realiza la solicitud de inicio de sesión solo si el captcha es exitoso
        const res = await axios.post("http://localhost:8800/api/auth/signup", { name, displayname, email, password, captchaToken: token });
        dispatch(loginSuccess(res.data));
        toast.success(translations[language].toastw);
        navigate('/');
      } catch (error) {
        dispatch(loginFailure());
        console.error("Failed to sign up", error);
      }
    } else {
      console.error("hCaptcha verification failed");
    }
  };

  const handleKeyPress = (e) => {
    if (e && e.key === "Enter") {
      e.preventDefault();
      handleDivSignupClick(e);
    }
  };

  // VALIDATIONS WHILE TYPING

  const [isEmailValid, setIsEmailValid] = useState(true);

  useEffect(() => {
    if (email) {
      const validEmailRegex = /^[^\s]+@(gmail\.com|hotmail\.com|outlook\.es|yahoo\.com)$/i;
      setIsEmailValid(validEmailRegex.test(email));
    }
  }, [email]);

  const [isUsernameValid, setIsUsernameValid] = useState(true);

  useEffect(() => {
    if (name.length > 0) {
      if (name.length > 2 && name.length <= 20) {
        setIsUsernameValid(true);
      } else {
        setIsUsernameValid(false);
      }
    }
  }, [name]);

  const [isDisplayNameValid, setIsDisplayNameValid] = useState(true);

  useEffect(() => {
    if (displayname.length > 0) {
      if (displayname.length > 2 && displayname.length <= 20) {
        setIsDisplayNameValid(true);
      } else {
        setIsDisplayNameValid(false);
      }
    }
  }, [displayname]);

  const [isPasswordValid, setIsPasswordValid] = useState(true);
  const [passwordStrength, setPasswordStrength] = useState(4); // INICIAR SIN NADA
  const [passwordContains, setPasswordContains] = useState(false);

  useEffect(() => {
    if (password.length > 0) {
      const hasLetter = /[a-zA-Z]/.test(password);
      const hasNumber = /\d/.test(password);
      const hasUppercase = /[A-Z]/.test(password);
      const hasSymbols = /[!@#$%^&*(),.?":{}|<>]/.test(password);
      const longEnough = password.length >= 8;

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

  }, [password, confirmpassword]);

  const [isConfirmPasswordValid, setIsConfirmPasswordValid] = useState(true);

  useEffect(() => {

    if (confirmpassword.length > 0) {
      setIsConfirmPasswordValid(password === confirmpassword ? true : false);
    } else {
      if (password.length > 0) {
        setIsConfirmPasswordValid(password === confirmpassword ? true : false);
      } else {
        setIsConfirmPasswordValid(true);
      }
    }

  }, [confirmpassword, password]);

  // VERIFY IF PASSWORD IS GOOD
  const [passwordIsGood, setPasswordIsGood] = useState(false);

  useEffect(() => {
    const FirstCondition = password.length >= 8;
    const SecondCondition = passwordContains;
    const ThirdCondition = passwordStrength > 0;
    const FourthCondition = password === confirmpassword ? true : false;

    const requirementsMet = [FirstCondition, SecondCondition, ThirdCondition, FourthCondition].filter(Boolean);

    setPasswordIsGood(requirementsMet.length === 4);

  }, [confirmpassword, password, passwordContains, passwordStrength]);

  // USER ALREADY LOGGED
  const [userLogged, setUserLogged] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setUserLogged(true);
    } else {
      setUserLogged(false);
    }

  }, [currentUser]);

  // LINKS
  const handleGoTerms = () => {
    navigate("/terms");
  };

  const handleGoContact = () => {
    navigate("/contact");
  };


  const translations = {
    en: {
      title: "Sign up",
      subtitle: "Welcome to Flashy!",
      placeholderemail: "Email Address",
      emailtaken: "Email is already taken.",
      placeholderusername: "Username",
      usernametaken: "Username is already taken.",
      usernameinvalid: "20 characters maximum, should not contain spaces.",
      placeholderdisplayname: "Display name",
      placeholderpassword: "Password",
      placeholderconfirmpassword: "Confirm Password",
      doyoualreadyhaveanaccount: "DO YOU ALREADY HAVE AN ACCOUNT?",
      contact: "CONTACT",
      privacynotice: "PRIVACY NOTICE",
      termsofservice: "TERMS OF SERVICE AND CONDITIONS OF USE",
      cookiepreferences: "COOKIE PREFERENCES",
      subtextlink1: "THIS SITE IS PROTECTED BY HCAPTCHA AND ITS ",
      subtextlink2: " AND ",
      subtextlink3: " APPLY.",
      privacypolicyclick: "PRIVACY POLICY",
      termsofserviceclick: "TERMS OF SERVICE",
      authtaken: "An account already exists linked to this service.",
      confirmpassworderror: "Passwords do not match.",
      checkboxtermsofservice: "I agree to the Terms of Service",
      checkboxtemails: "I agree to recive emails",
      checkboxmissing: "Please check the requeriments in order to continue.",
      emptyfields: "Please complete all the fields requeried.",
      orauth: "OR",
      emailinvalid: "You must enter a valid email address.",
      usernameinvalidtyping: "You must enter a valid username.",
      displaynameinvalidtyping: "You must enter a valid display name.",
      passwordtooweak: "Too weak",
      passwordokay: "Okay",
      passwordgreat: "Great",
      passwordexcellent: "Excellent",
      passworddonotmatch: "Passwords do not match.",
      passwordpopup1: "Password is at least 8 characters long.",
      passwordpopup2: "Password is at least okay strength or better.",
      passwordpopup3: "Password includes two of the following: letter, capital letter, number, or symbol.",

      toastw: "Welcome to Flashy",
    },
    es: {
      title: "Inicio de Sesión",
      subtitle: "Bienvenido a Flashy!",
      placeholderemail: "Correo electrónico",
      emailtaken: "Este correo ya ha sido registrado anteriormente.",
      placeholderusername: "Usuario",
      usernametaken: "Este usuario ya ha sido registrado anteriormente.",
      usernameinvalid: "Máximo de 20 caracteres y no debe contener espacios.",
      placeholderdisplayname: "Nombre a mostrar",
      placeholderpassword: "Contraseña",
      placeholderconfirmpassword: "Confirmar contraseña",
      doyoualreadyhaveanaccount: "¿YA TIENES UNA CUENTA?",
      contact: "CONTACTO",
      privacynotice: "AVISO DE PRIVACIDAD",
      termsofservice: "TÉRMINOS DE USO Y CONDICIONES DE USO",
      cookiepreferences: "PREFERENCIAS DE COOKIES",
      subtextlink1: "ESTA PÁGINA ESTÁ PROTEGIDA POR HCAPTCHA Y SU ",
      subtextlink2: " Y LOS ",
      subtextlink3: " APLICAN.",
      privacypolicyclick: "AVISO DE PRIVACIDAD",
      termsofserviceclick: "TÉRMINOS DE SERVICIO",
      authtaken: "Ya existe una cuenta vinculada a este servicio.",
      confirmpassworderror: "Las contraseñas no coinciden.",
      checkboxtermsofservice: "Acepto los Términos de Servicio",
      checkboxtemails: "Acepto recibir correos electrónicos",
      emptyfields: "Por favor acepta los requerimientos para continuar.",
      orauth: "O",
      emailinvalid: "Debes ingresar un correo electrónico valido.",
      usernameinvalidtyping: "Debes ingresar un nombre de usuario valido.",
      displaynameinvalidtyping: "Debes ingresar un nombre a mostrar valido",
      passwordtooweak: "Muy débil",
      passwordokay: "Aceptable",
      passwordgreat: "Genial",
      passwordexcellent: "Excelente",
      passworddonotmatch: "Las contraseñas no coinciden.",
      passwordpopup1: "La contraseña tiene al menos 8 caracteres.",
      passwordpopup2: "La contraseña es por lo menos aceptable o mejor.",
      passwordpopup3: "La contraseña incluye dos de lo siguiente: letra, mayúscula, numero, o símbolo.",

      toastw: "Bienvenido a Flashy",
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
            <Wrapper>
              <Title>{translations[language].title}</Title>
              <SubTitle>{translations[language].subtitle}</SubTitle>

              <InputContainer>
                <InputEmail
                  onChange={(e) => {
                    setEmail(e.target.value)
                    setEmailError(false);
                    setEmptyFieldsError(false);
                  }}
                  onFocus={() => {
                    setEmailFocused(true);
                  }}
                  onBlur={() => setEmailFocused(false)}
                  onKeyPress={handleKeyPress}
                  required
                  isValid={isEmailValid}
                />
                <PlaceholderEmail hasFocus={emailFocused || email !== ""} hasValue={email !== ""} isValid={isEmailValid}>
                  {translations[language].placeholderemail}
                </PlaceholderEmail>

                {!isEmailValid && <ErrorMessage>{translations[language].emailinvalid}</ErrorMessage>}
                {emailError && <ErrorMessage>{translations[language].emailtaken}</ErrorMessage>}

              </InputContainer>

              <InputContainer>
                <InputUsername
                  onChange={(e) => {
                    setName(e.target.value)
                    setNameError(false);
                    setNameInvalidError(false);
                    setEmptyFieldsError(false);
                  }}
                  onFocus={() => {
                    setNameFocused(true);
                  }}
                  onBlur={() => setNameFocused(false)}
                  onKeyPress={handleKeyPress}
                  required
                  isValid={isUsernameValid}
                />
                <PlaceholderUsername hasFocus={nameFocused || name !== ""} hasValue={name !== ""} isValid={isUsernameValid}>
                  {translations[language].placeholderusername}
                </PlaceholderUsername>

                {!isUsernameValid && <ErrorMessage>{translations[language].usernameinvalidtyping}</ErrorMessage>}

                {nameError && <ErrorMessage>{translations[language].usernametaken}</ErrorMessage>}
                {nameInvalidError && <ErrorMessage>{translations[language].usernameinvalid}</ErrorMessage>}
              </InputContainer>

              <InputContainer>
                <InputDisplayName
                  onChange={(e) => {
                    setDisplayName(e.target.value)
                    setEmptyFieldsError(false);
                  }}
                  onFocus={() => setDisplayNameFocused(true)}
                  onBlur={() => setDisplayNameFocused(false)}
                  onKeyPress={handleKeyPress}
                  required
                  isValid={isDisplayNameValid}
                />
                <PlaceholderDisplayName hasFocus={displaynameFocused || displayname !== ""} hasValue={displayname !== ""} isValid={isDisplayNameValid}>
                  {translations[language].placeholderdisplayname}
                </PlaceholderDisplayName>

                {!isDisplayNameValid && <ErrorMessage>{translations[language].displaynameinvalidtyping}</ErrorMessage>}
              </InputContainer>

              <InputContainer>
                <InputPassword
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    setEmptyFieldsError(false);
                  }}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                  onKeyPress={handleKeyPress}
                  required
                  strength={passwordStrength}
                  passwordValidLength={password.length > 0}
                />
                <PlaceholderPassword
                  hasFocus={passwordFocused || password !== ""}
                  hasValue={password !== ""}
                  strength={passwordStrength}
                  passwordValidLength={password.length > 0}
                  passwordlength={password.length}
                >
                  {translations[language].placeholderpassword}
                </PlaceholderPassword>

                {password.length > 0 && passwordStrength >= 0 && passwordStrength < 4 && <ErrorMessagePassword strength={passwordStrength}>
                  {passwordStrength === 3 && translations[language].passwordexcellent}
                  {passwordStrength === 2 && translations[language].passwordgreat}
                  {passwordStrength === 1 && translations[language].passwordokay}
                  {passwordStrength === 0 && translations[language].passwordtooweak}
                </ErrorMessagePassword>}

                <PasswordRequeriments passwordFocused={passwordFocused}>

                  <PasswordRequerimentsItem>
                    <PasswordRequerimentsSymbol isValid={password.length >= 8}>
                      {password.length >= 8 ? '✔' : '✖'}
                    </PasswordRequerimentsSymbol>
                    {translations[language].passwordpopup1}
                  </PasswordRequerimentsItem>
                  <PasswordRequerimentsItem>
                    <PasswordRequerimentsSymbol isValid={password.length > 0 && passwordStrength >= 1 && passwordStrength < 4}>
                      {password.length > 0 && passwordStrength >= 1 && passwordStrength < 4 ? '✔' : '✖'}
                    </PasswordRequerimentsSymbol>
                    {translations[language].passwordpopup2}
                  </PasswordRequerimentsItem>

                  <PasswordRequerimentsItem>
                    <PasswordRequerimentsSymbol isValid={password.length > 0 && passwordContains}>
                      {password.length > 0 && passwordContains ? '✔' : '✖'}
                    </PasswordRequerimentsSymbol>
                    {translations[language].passwordpopup3}
                  </PasswordRequerimentsItem>

                </PasswordRequeriments>
              </InputContainer>

              <InputContainer>
                <InputConfirmPassword
                  type="password"
                  onChange={(e) => {
                    setConfirmPassword(e.target.value)
                    setEmptyFieldsError(false);
                  }}
                  onFocus={() => setConfirmPasswordFocused(true)}
                  onBlur={() => setConfirmPasswordFocused(false)}
                  onKeyPress={handleKeyPress}
                  required
                  isValid={isConfirmPasswordValid}
                />
                <PlaceholderConfirmPassword hasFocus={confirmpasswordFocused || confirmpassword !== ""} hasValue={confirmpassword !== ""} isValid={isConfirmPasswordValid}>
                  {translations[language].placeholderconfirmpassword}
                </PlaceholderConfirmPassword>
                {!isConfirmPasswordValid && <ErrorMessage>{translations[language].passworddonotmatch}</ErrorMessage>}

                {emptyfieldsError && <ErrorMessage>{translations[language].emptyfields}</ErrorMessage>}
                {confirmpasswordError && <ErrorMessage>{translations[language].confirmpassworderror}</ErrorMessage>}
              </InputContainer>

              <SignButtons>
                <ButtonFacebook onClick={signUpWithFacebook}>
                  <FacebookImg src={FacebookSignin} />
                </ButtonFacebook>
                <SignButtonsTxt> {translations[language].orauth} </SignButtonsTxt>
                <ButtonGoogle onClick={signUpWithGoogle}>
                  <GoogleImg src={GoogleSignin} />
                </ButtonGoogle>

              </SignButtons>
              {authError && <ErrorMessage>{translations[language].authtaken}</ErrorMessage>}

              <HCaptcha
                sitekey="c3b2f85b-a04c-4065-8bf8-b687709d759e"
                size="invisible"
                onLoad={onLoad}
                onVerify={onHCaptchaVerify}
                ref={captchaRef}
              />
              <Checkbox1>
                <input type="checkbox" checked={acceptTerms} onChange={handleAcceptTermsChange} />
                <CheckboxTxt>{translations[language].checkboxtermsofservice}</CheckboxTxt>
              </Checkbox1>
              <Checkbox2>
                <input type="checkbox" checked={receiveEmails} onChange={handleReceiveEmailsChange} />
                <CheckboxTxt>{translations[language].checkboxtemails}</CheckboxTxt>


              </Checkbox2>

              {checkboxError && <ErrorMessage>{translations[language].checkboxmissing}</ErrorMessage>}


              <DivSignup onClick={handleDivSignupClick} id="DivSignup">
                <SigninFlechaDerecha src={FlechaDerechaIcono} hasValue={isEmailValid && isUsernameValid && isDisplayNameValid && passwordIsGood} />
              </DivSignup>

              <LabelAcc>
                <AlreadyAccount>
                  <Link to="../signin" style={{ textDecoration: "none", color: "inherit", fontSize: "inherit", fontFamily: "inherit" }}>
                    {translations[language].doyoualreadyhaveanaccount}
                  </Link>
                </AlreadyAccount>
              </LabelAcc>

            </Wrapper>

          </Container>

          <MoreInfo>

            <More>
              <Links onClick={handleGoContact}>{translations[language].contact}</Links>
              <Links onClick={handleGoTerms}>{translations[language].termsofservice}</Links>


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

export default Signup;
