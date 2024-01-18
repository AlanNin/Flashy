import React, { useState, useEffect, useRef, useContext } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from '../utils/LanguageContext';
import styled, { keyframes, css } from "styled-components";
import SigninBackground from "../assets/SigninBackground.jpg";
import FacebookSignin from "../assets/FacebookSignin.png";
import GoogleSignin from "../assets/GoogleSignin.png";
import E1ColorNoBG from "../assets/E1WhiteNoBG.png";
import FlechaDerechaIcono from "../assets/FlechaDerechaIcono.png";
import IdiomaIcono from "../assets/IdiomaIcono.png";
import { useDispatch, useSelector } from 'react-redux';
import { loginFailure, loginStart, loginSuccess } from "../redux/userSlice";
import HCaptcha from '@hcaptcha/react-hcaptcha';
import { auth, GoogleProvider, FacebookProvider } from "../firebase";
import { signInWithPopup } from "firebase/auth";
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
  outline: 1px solid #303030;
  &:focus {
    outline: 1px solid #BE49C9;
  }

  &:focus + ${Placeholder} {
    color: #BE49C9;
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

const DivSignin = styled.div`
  margin-top: 45px;
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

const SignButtonsTxt = styled.h1`
font-size: 14px;
padding: 0px 15px;
font-family: "Roboto Condensed", Helvetica;
font-weight: 400;
`;

const ErrorMessage = ({ children }) => (
  <div style={{ fontSize: '15px', color: '#BE49C9', marginTop: '7px', marginRight: 'auto', fontFamily: '"Roboto Condensed", Helvetica' }}>{children}</div>
);

const Signin = () => {

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [nameFocused, setNameFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const { language, setLanguage } = useLanguage();
  const captchaRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [signinError, setSigninError] = useState(false);
  const [externalautherror, setExternalAuthError] = useState(false);
  const [emptyfieldsError, setEmptyFieldsError] = useState(false);
  const { currentUser } = useSelector(state => state.user);

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

  const signInWithGoogle = async () => {
    dispatch(loginStart());

    signInWithPopup(auth, GoogleProvider)
      .then(async (result) => {
        try {
          // Verificar si el correo electrónico ya está registrado
          const emailCheckResponse = await axios.post("/auth/checkemail", {
            email: result.user.email,
          });

          if (!emailCheckResponse.data.exists) {
            // El usuario no está registrado, puedes manejar esto según tus necesidades
            console.error("Este correo electrónico no está registrado");
            setExternalAuthError(true);
            dispatch(loginFailure());
            return;
          }

          // El usuario está registrado, continuar con el inicio de sesión
          const signInResponse = await axios.post("/auth/externalsignin", {
            name: result.user.displayName,
            email: result.user.email,
            img: result.user.photoURL,
          });

          dispatch(loginSuccess(signInResponse.data));
          toast.success(translations[language].toastshare);
          navigate("/");

        } catch (error) {
          console.error("Error en axios.post:", error);
          dispatch(loginFailure());
        }
      })
      .catch((error) => {
        console.error("Error en signInWithPopup:", error);
        dispatch(loginFailure());
      });
  };

  const signInWithFacebook = async () => {
    dispatch(loginStart());

    try {
      const result = await signInWithPopup(auth, FacebookProvider);

      const facebookId = result.user.providerData[0].uid;
      const photoURL = `http://graph.facebook.com/${facebookId}/picture?type=square`;

      const userData = {
        name: result.user.displayName,
        email: result.user.email,
        img: photoURL,
      };


      const res = await axios.post("/auth/externalsignin", userData);

      dispatch(loginSuccess(res.data));
      toast.success(translations[language].toastshare);
      navigate("/");

    } catch (error) {
      console.error("Error in signInWithFacebook:", error);

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

  const handleDivSigninClick = async (e) => {
    e.preventDefault();
    dispatch(loginStart());

    if (name !== "" && password !== "") {
      try {
        const nameCheckResponse = await axios.post("/auth/checkname", { name });

        if (!nameCheckResponse.data.exists) {
          // Mostrar un mensaje de error para el nombre de usuario
          setSigninError(true);
        } else {
          const passwordCheckResponse = await axios.post("/auth/checkpassword", { name, password });

          if (passwordCheckResponse.data.isCorrect) {
            // La contraseña es correcta, proceder con el inicio de sesión
            handleHCaptchaVerify();
          } else {
            // Mostrar un mensaje de error para la contraseña incorrecta
            setSigninError(true);
          }
        }
      } catch (error) {
        console.error("Error al iniciar sesión:", error);
        dispatch(loginFailure());
      }
    } else {
      console.error("Se requieren nombre de usuario y contraseña");
      setEmptyFieldsError(true);
    }
  };


  const onHCaptchaVerify = async (token) => {
    // Verifica si el token hCaptcha se recibió con éxito
    if (token) {
      try {
        const res = await axios.post("/auth/signin", { name, password, captchaToken: token });

        dispatch(loginSuccess(res.data));
        toast.success(translations[language].toastshare);
        navigate('/');

      } catch (error) {
        dispatch(loginFailure());
        console.error("Failed to sign in", error);
      }
    } else {
      console.error("hCaptcha verification failed");
    }
  };

  const handleKeyPress = (e) => {
    if (e && e.key === "Enter") {
      e.preventDefault();
      handleDivSigninClick(e);
    }
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

  // LINKS
  const handleGoTerms = () => {
    navigate("/terms");
  };

  const handleGoContact = () => {
    navigate("/contact");
  };

  const translations = {
    en: {
      title: "Sign in",
      subtitle: "Welcome back to Flashy!",
      placeholdername: "Username",
      placeholderpassword: "Password",
      cantsignin: "CAN'T SIGN IN?",
      createaccount: "CREATE ACCOUNT",
      contact: "CONTACT",
      privacenotice: "PRIVACY NOTICE",
      termsofservice: "TERMS OF SERVICE AND CONDITIONS OF USE",
      cookiepreferences: "COOKIE PREFERENCES",
      subtextlink1: "THIS SITE IS PROTECTED BY HCAPTCHA AND ITS ",
      subtextlink2: " AND ",
      subtextlink3: " APPLY.",
      privacypolicyclick: "PRIVACY POLICY",
      termsofserviceclick: "TERMS OF SERVICE",
      orauth: "OR",
      signinErrormsg: "Username or password incorrect.",
      externalautherrormsg: "This email is not registered.",
      emptyfields: "Please complete all the fields requeried.",

      toastwb: "Welcome back to Flashy",
    },
    es: {
      title: "Inicio de Sesión",
      subtitle: "Bienvenido a Flashy!",
      placeholdername: "Usuario",
      placeholderpassword: "Contraseña",
      cantsignin: "¿NO PUEDES INICIAR SESIÓN?",
      createaccount: "CREAR CUENTA",
      contact: "CONTACTO",
      privacenotice: "AVISO DE PRIVACIDAD",
      termsofservice: "TÉRMINOS DE USO Y CONDICIONES DE USO",
      cookiepreferences: "PREFERENCIAS DE COOKIES",
      subtextlink1: "ESTA PÁGINA ESTÁ PROTEGIDA POR HCAPTCHA Y SU ",
      subtextlink2: " Y LOS ",
      subtextlink3: " APLICAN.",
      privacypolicyclick: "AVISO DE PRIVACIDAD",
      termsofserviceclick: "TÉRMINOS DE SERVICIO",
      orauth: "O",
      signinErrormsg: "Usuario o contraseña incorrecta.",
      externalautherrormsg: "Este correo no está registrado.",
      emptyfields: "Por favor rellena todos los campos para continuar.",

      toastwb: "Bienvenido a Flashy",
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
                <Input
                  onChange={(e) => {
                    setName(e.target.value)
                    setSigninError(false);
                    setEmptyFieldsError(false);
                  }}
                  onKeyPress={handleKeyPress}
                  onFocus={() => setNameFocused(true)}
                  onBlur={() => setNameFocused(false)}
                  required
                  autoComplete='off new-password'
                />
                <Placeholder hasFocus={nameFocused || name !== ""} hasValue={name !== ""}>
                  {translations[language].placeholdername}
                </Placeholder>
              </InputContainer>

              <InputContainer>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    setSigninError(false);
                    setEmptyFieldsError(false);
                  }}
                  onKeyPress={handleKeyPress}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                  required
                  autoComplete='off new-password'
                />
                <Placeholder hasFocus={passwordFocused || password !== ""} hasValue={password !== ""}>
                  {translations[language].placeholderpassword}
                </Placeholder>

                {emptyfieldsError && <ErrorMessage>{translations[language].emptyfields}</ErrorMessage>}
                {signinError && <ErrorMessage>{translations[language].signinErrormsg}</ErrorMessage>}

              </InputContainer>

              <SignButtons>
                <ButtonFacebook onClick={signInWithFacebook}>
                  <FacebookImg src={FacebookSignin} />
                </ButtonFacebook>
                <SignButtonsTxt> {translations[language].orauth} </SignButtonsTxt>
                <ButtonGoogle onClick={signInWithGoogle}>
                  <GoogleImg src={GoogleSignin} />
                </ButtonGoogle>
              </SignButtons>

              {externalautherror && <ErrorMessage>{translations[language].externalautherrormsg}</ErrorMessage>}


              <HCaptcha
                sitekey="c3b2f85b-a04c-4065-8bf8-b687709d759e"
                size="invisible"
                onLoad={onLoad}
                onVerify={onHCaptchaVerify}
                ref={captchaRef}
              />

              <DivSignin onClick={handleDivSigninClick} id="DivSignin">
                <SigninFlechaDerecha src={FlechaDerechaIcono} hasValue={name !== "" && password !== ""} />
              </DivSignin>

              <CantCreate>
                <CantSignin>
                  <Link to="../recovery" style={{ textDecoration: "none", color: "inherit", fontSize: "inherit", fontFamily: "inherit" }}>
                    {translations[language].cantsignin}
                  </Link>
                </CantSignin>


                <CreateAcc>
                  <Link to="../signup" style={{ textDecoration: "none", color: "inherit", fontSize: "inherit", fontFamily: "inherit" }}>
                    {translations[language].createaccount}
                  </Link>
                </CreateAcc>


              </CantCreate>

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

export default Signin;
