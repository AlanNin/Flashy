import React, { useState, useEffect, useRef, useContext } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from '../utils/LanguageContext';
import styled, { keyframes, css } from "styled-components";
import SigninBackground from "../assets/SigninBackground.jpg";
import FacebookSignin from "../assets/FacebookSignin.png";
import GoogleSignin from "../assets/GoogleSignin.png";
import FlechaDerechaIcono from "../assets/FlechaDerechaIcono.png";
import IdiomaIcono from "../assets/IdiomaIcono.png";
import HCaptcha from '@hcaptcha/react-hcaptcha';
import { auth, provider } from "../firebase";
import { signInWithPopup } from "firebase/auth";
import { useDispatch } from 'react-redux';
import { loginFailure, loginStart, loginSuccess } from "../redux/userSlice";

const MainContainer = styled.div`
  position: relative;
  height: 100%;
  width: 100%;
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
  width: 324px;
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


const ButtonFacebook = styled.button`
  border-radius: 9px;
  width: 124px;
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
  width: 124px;
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
  margin-top: 60px;
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
  gap: 5px;
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
  margin-left: 5px;
  margin-bottom:-8px;
`;

const LanguageSquare = styled.div`
  padding: 4px 6px;
  color: white;
  background-color: ${({ active, theme }) => (active ? "rgba(166, 65, 117 , 0.3)" : 'rgba(42, 41, 47)')};
  border-radius: 4px;
  transition: background-color 0.8s;
`;


const Signup = () => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [nameFocused, setNameFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const { language, setLanguage } = useLanguage();
  const captchaRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

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

    signInWithPopup(auth, provider)
      .then((result) => {
        axios
          .post("/auth/googlesignup", {
            name: result.user.displayName,
            email: result.user.email,
            img: result.user.photoURL,
          })
          .then((res) => {
            console.log(res);
            dispatch(loginSuccess(res.data));
            navigate("/");
          })
          .catch((error) => {
            console.error("Error in axios.post:", error);
            dispatch(loginFailure());
          });
      })
      .catch((error) => {
        console.error("Error in signInWithPopup:", error);
        dispatch(loginFailure());
      });
  };

  const handleDivSignupClick = async (e) => {
    e.preventDefault();
    dispatch(loginStart());
    if (email !== "" && name !== "" && password !== "") {
      // Inicia el proceso de verificación del hCaptcha
      handleHCaptchaVerify();
    } else {
      console.error("Username and password are required");
    }
  };


  const onHCaptchaVerify = async (token) => {
    // Verifica si el token hCaptcha se recibió con éxito
    if (token) {
      try {
        // Realiza la solicitud de inicio de sesión solo si el captcha es exitoso
        const res = await axios.post("/auth/signup", { name, email, password, captchaToken: token });
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


  const translations = {
    en: {
      title: "Sign up",
      subtitle: "Welcome to Flashy!",
      placeholderemail: "Email",
      placeholderusername: "Username",
      placeholderpassword: "Password",
      doyoualreadyhaveanaccount: "DO YOU ALREADY HAVE AN ACCOUNT?",
      support: "SUPPORT",
      privacenotice: "PRIVACE NOTICE",
      termsofservice: "TERMS OF SERVICE",
      cookiepreferences: "COOKIE PREFERENCES",
      subtextlink1: "THIS SITE IS PROTECTED BY RECAPTCHA AND ITS ",
      subtextlink2: " AND ",
      subtextlink3: " APPLY.",
      privacypolicyclick: "PRIVACY POLICY",
      termsofserviceclick: "TERMS OF SERVICE",
    },
    es: {
      title: "Inicio de Sesión",
      subtitle: "Bienvenido a Flashy!",
      placeholderusername: "Correo",
      placeholderusername: "Usuario",
      placeholderpassword: "Contraseña",
      doyoualreadyhaveanaccount: "YA TIENES UNA CUENTA?",
      support: "SOPORTE",
      privacenotice: "AVISO DE PRIVACIDAD",
      termsofservice: "TÉRMINOS DE USO",
      cookiepreferences: "PREFERENCIAS DE COOKIES",
      subtextlink1: "ESTA PÁGINA ESTÁ PROTEGIDA POR RECAPTCHA Y SU ",
      subtextlink2: " Y LOS ",
      subtextlink3: " APLICAN.",
      privacypolicyclick: "AVISO DE PRIVACIDAD",
      termsofserviceclick: "TÉRMINOS DE SERVICIO",
    },
  };

  return (
    <MainContainer>
      <Container>
        <Wrapper>
          <Title>{translations[language].title}</Title>
          <SubTitle>{translations[language].subtitle}</SubTitle>

          <InputContainer>
            <Input
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setEmailFocused(true)}
              onBlur={() => setEmailFocused(false)}
              required
            />
            <Placeholder hasFocus={emailFocused || email !== ""} hasValue={email !== ""}>
              {translations[language].placeholderemail}
            </Placeholder>
          </InputContainer>

          <InputContainer>
            <Input
              onChange={(e) => setName(e.target.value)}
              onFocus={() => setNameFocused(true)}
              onBlur={() => setNameFocused(false)}
              required
            />
            <Placeholder hasFocus={nameFocused || name !== ""} hasValue={name !== ""}>
              {translations[language].placeholderusername}
            </Placeholder>
          </InputContainer>

          <InputContainer>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setPasswordFocused(true)}
              onBlur={() => setPasswordFocused(false)}
              required
            />
            <Placeholder hasFocus={passwordFocused || password !== ""} hasValue={password !== ""}>
              {translations[language].placeholderpassword}
            </Placeholder>
          </InputContainer>

          <SignButtons>
            <ButtonFacebook>
              <FacebookImg src={FacebookSignin} />
            </ButtonFacebook>

            <ButtonGoogle onClick={signUpWithGoogle}>
              <GoogleImg src={GoogleSignin} />
            </ButtonGoogle>
          </SignButtons>

          <HCaptcha
            sitekey="c3b2f85b-a04c-4065-8bf8-b687709d759e"
            size="invisible"
            onLoad={onLoad}
            onVerify={onHCaptchaVerify}
            ref={captchaRef}
          />

          <DivSignup onClick={handleDivSignupClick} id="DivSignup">
            <SigninFlechaDerecha src={FlechaDerechaIcono} hasValue={email !== "" && name !== "" && password !== ""} />
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
  );
};

export default Signup;
