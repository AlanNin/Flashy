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
import { useDispatch } from 'react-redux';
import { loginFailure, loginStart, loginSuccess } from "../redux/userSlice";

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


const Input = styled.input`
  font-family: "Roboto Condensed", Helvetica;
  font-size: 18px;
  border: 1px solid #1D1D1D;
  border-radius: 3px;
  padding: 10px 10px;
  background-color: #303030;
  width: 350px;
  color: ${({ theme }) => theme.text};
  transition: border-color 0.3s ease-in-out;
  &:focus {
    border-color: ${({ theme }) => theme.accent};
  }
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
      opacity: 0.5;
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
  <div style={{ color: 'red', marginTop: '5px', marginRight: 'auto', fontFamily: '"Roboto Condensed", Helvetica' }}>{children}</div>
);


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
      };

      // Check if the name and email are already registered
      const nameCheckResponse = await axios.post("/auth/checkname", { name: userData.name });
      const emailCheckResponse = await axios.post("/auth/checkemail", { email: userData.email });

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
      const res = await axios.post("/auth/externalsignup", userData);

      console.log('Response from the server:', res);

      dispatch(loginSuccess(res.data));
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
      };

      // Check if the name and email are already registered
      const nameCheckResponse = await axios.post("/auth/checkname", { name: userData.name });
      const emailCheckResponse = await axios.post("/auth/checkemail", { email: userData.email });

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

      const res = await axios.post("/auth/externalsignup", userData);

      console.log('Response from the server:', res);

      dispatch(loginSuccess(res.data));
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
        const nameCheckResponse = await axios.post("/auth/checkname", { name });
        const emailCheckResponse = await axios.post("/auth/checkemail", { email });

        //Check Username 
        const isNameValid = /^[^\s]{1,12}$/.test(name);

        if (nameCheckResponse.data.exists) {
          // Display an error message for username
          console.error("Username is already taken");
          setNameError(true);
        }
        if (emailCheckResponse.data.exists) {
          // Display an error message for email
          console.error("Email is already taken");
          setEmailError(true);
        }
        if (password !== confirmpassword) {
          // Display an error password not matching
          console.error("Password do not match");
          setConfirmPasswordError(true);
        }
        if (!acceptTerms || !receiveEmails) {
          // Display an error checkbox missing
          console.error("Checkbox missing");
          setCheckboxError(true);
        }
        if (!isNameValid) {
          console.error("Invalid username");
          setNameInvalidError(true);
        } else {
          // Continue with the hCaptcha verification if the name is not taken
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
        const res = await axios.post("/auth/signup", { name, displayname, email, password, captchaToken: token });
        dispatch(loginSuccess(res.data));
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

  const translations = {
    en: {
      title: "Sign up",
      subtitle: "Welcome to Flashy!",
      placeholderemail: "Email",
      emailtaken: "Email is already taken.",
      placeholderusername: "Username",
      usernametaken: "Username is already taken.",
      usernameinvalid: "8 characters maximum, should not contain spaces.",
      placeholderdisplayname: "Display name",
      placeholderpassword: "Password",
      placeholderconfirmpassword: "Confirm Password",
      doyoualreadyhaveanaccount: "DO YOU ALREADY HAVE AN ACCOUNT?",
      support: "SUPPORT",
      privacynotice: "PRIVACY NOTICE",
      termsofservice: "TERMS OF SERVICE",
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
    },
    es: {
      title: "Inicio de Sesión",
      subtitle: "Bienvenido a Flashy!",
      placeholderemail: "Correo",
      emailtaken: "Este correo ya ha sido registrado anteriormente.",
      placeholderusername: "Usuario",
      usernametaken: "Este usuario ya ha sido registrado anteriormente.",
      usernameinvalid: "Máximo de 8 caracteres y no debe contener espacios.",
      placeholderdisplayname: "Nombre a mostrar",
      placeholderpassword: "Contraseña",
      placeholderconfirmpassword: "Confirmar contraseña",
      doyoualreadyhaveanaccount: "¿YA TIENES UNA CUENTA?",
      support: "SOPORTE",
      privacynotice: "AVISO DE PRIVACIDAD",
      termsofservice: "TÉRMINOS DE USO",
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
    },
  };

  return (
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
            <Input
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
            />
            <Placeholder hasFocus={emailFocused || email !== ""} hasValue={email !== ""}>
              {translations[language].placeholderemail}
            </Placeholder>
            {emailError && <ErrorMessage>{translations[language].emailtaken}</ErrorMessage>}
          </InputContainer>

          <InputContainer>
            <Input
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
            />
            <Placeholder hasFocus={nameFocused || name !== ""} hasValue={name !== ""}>
              {translations[language].placeholderusername}
            </Placeholder>
            {nameError && <ErrorMessage>{translations[language].usernametaken}</ErrorMessage>}
            {nameInvalidError && <ErrorMessage>{translations[language].usernameinvalid}</ErrorMessage>}
          </InputContainer>

          <InputContainer>
            <Input
              onChange={(e) => {
                setDisplayName(e.target.value)
                setEmptyFieldsError(false);
              }}
              onFocus={() => setDisplayNameFocused(true)}
              onBlur={() => setDisplayNameFocused(false)}
              onKeyPress={handleKeyPress}
              required
            />
            <Placeholder hasFocus={displaynameFocused || displayname !== ""} hasValue={displayname !== ""}>
              {translations[language].placeholderdisplayname}
            </Placeholder>
          </InputContainer>

          <InputContainer>
            <Input
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
            />
            <Placeholder hasFocus={passwordFocused || password !== ""} hasValue={password !== ""}>
              {translations[language].placeholderpassword}
            </Placeholder>
          </InputContainer>

          <InputContainer>
            <Input
              type="password"
              onChange={(e) => {
                setConfirmPassword(e.target.value)
                setEmptyFieldsError(false);
              }}
              onFocus={() => setConfirmPasswordFocused(true)}
              onBlur={() => setConfirmPasswordFocused(false)}
              onKeyPress={handleKeyPress}
              required
            />
            <Placeholder hasFocus={confirmpasswordFocused || confirmpassword !== ""} hasValue={confirmpassword !== ""}>
              {translations[language].placeholderconfirmpassword}
            </Placeholder>
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
            <SigninFlechaDerecha src={FlechaDerechaIcono} hasValue={email !== "" && name !== "" && displayname !== "" && password !== "" && confirmpassword !== ""} />
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
          <Links>{translations[language].support}</Links>
          <Links>{translations[language].privacynotice}</Links>
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
  );
};

export default Signup;
