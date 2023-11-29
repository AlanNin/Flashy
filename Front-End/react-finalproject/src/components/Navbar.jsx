import React, { useState, useEffect, useRef, useContext } from "react";
import styled from "styled-components";
import "../utils/global.css";
import { Link, useNavigate } from "react-router-dom";
import GifLogo from "../assets/GifLogo.gif";
import MenuIcono from "../assets/MenuIcono.png";
import Separador from "../assets/Separador.png";
import InicioSesionIcono2 from "../assets/InicioSesionIcono2.png";
import BuscarIcono from "../assets/BuscarIcono.png";
import FacebookIcono2 from "../assets/FacebookIcono2.png";
import InstagramIcono2 from "../assets/InstagramIcono2.png";
import TwitterIcono2 from "../assets/TwitterIcono2.png";
import TelegramIcono2 from "../assets/TelegramIcono2.png";
import ProfileIcono from "../assets/ProfileIcono.png";
import LogoutIcono from "../assets/LogoutIcono.png";
import LogoutIconoP from "../assets/LogoutIconoP.png";
import TermsIcono from "../assets/TermsIcono.png";
import PrivacyIcono from "../assets/PrivacyIcono.png";
import AboutIcono from "../assets/AboutIcono.png";
import AyudaIcono from "../assets/AyudaIcono.png";
import TikTokIcono2 from "../assets/TikTokIcono2.png";
import DiscordIcono2 from "../assets/DiscordIcono2.png";
import { useLanguage } from '../utils/LanguageContext';
import { useDispatch, useSelector } from 'react-redux';
import { logout, resetUserState } from "../redux/userSlice";
import UploadVideoIcono from "../assets/UploadVideoIcono.png";

const Container = styled.div`
  position: fixed;
  top: 0;
  right:0px;
  backdrop-filter: blur(${({ scrolled }) => (scrolled ? "5px" : "0px")});
  background: ${({ scrolled, theme }) =>
    scrolled
      ? "rgba(30, 30, 30, 0.6)"
      : `linear-gradient(to right, rgba(30, 30, 30, 0.8) 40%,  rgba(30, 30, 30, 0.6), rgba(30, 30, 30, 0.4) 45%, rgba(30, 30, 30, 0.3) 50%, rgba(30, 30, 30, 0.1) 60%)`};
  height: 56px;
  width: 100%;
  z-index: 2;
  transition: background 0.3s ease-in;
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
  padding: 0px 35px;
`;

const ItemMenu = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 19px 4.08px;
  border-radius: 8px;
  height: 1px;
  z-index: 3;

  &:hover {
    background-color: ${({ theme }) => theme.soft};
  }
`;

const Img = styled.img`
  height: 32px;
  width: 32px;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 7.25px;
  font-weight: bold;
  margin-left: 14.5px;
`;

const ImgLogo = styled.img`
  height: 44px;
  width: 48px;
`;

const AppName = styled.h1`
  font-size: 30px;
  margin-top: 1.5px;
  font-weight: 700;

  color: #ffffff;
  white-space: nowrap;
`;

const ItemLogin = styled.div`
  display: flex;
  right: 35px;
  top: 50%;
  padding: 0px 12px;
  transform: translateY(-50%);
  position: absolute;
  align-items: center;
  gap: 8px;
  width: auto;
  height: 40px;
  transition: background-color 0.5s;
  cursor: pointer;
  border-radius: 30px;
  background-color: ${({ theme }) => theme.loginbg};
  &:hover {
    background-color: ${({ theme }) => theme.softloginbg};
  }

  @media only screen and (max-width: 980px),
  only screen and (max-height: 910px) {
    gap: 0px;
    width: 50px;
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
  
  @media only screen and (max-width: 980px),
  only screen and (max-height: 910px) {
  display: none;
}

`;

const Search = styled.div`
  display: flex;
  align-items: center;
  padding: 5px;
  width: 350px;
  margin-left: 22px;
  border-radius: 3px;
  height:25px;
  background: ${({ scrolled }) =>
    scrolled
      ? "rgba(18, 17, 17, 0.5)"
      : "rgba(18, 17, 17)"};

  @media only screen and (max-width: 980px),
  only screen and (max-height: 910px) {
    width: 190px;
  }
`;

const Input = styled.input`
  font-family: "Roboto Condensed", Helvetica;
  margin-left: 15px;
  width: 92%;
  border: none;
  background-color: transparent;
  font-size: 20px;
  outline: none;
  color: ${({ theme }) => theme.text};
`;

const ImgBuscar = styled.img`
  height: 30px;
  width: 30px;
  margin-right: 5px;
  cursor: pointer;
`;

const FollowDiv = styled.div`
  flexDirection: 'row';
  margin-left: 35.5px;
  margin-right: 15.5px;
  @media only screen and (max-width: 980px),
  only screen and (max-height: 910px) {
  display: none;
}
`;

const Follow = styled.h1`
  font-family: "Roboto Condensed", Helvetica;
  font-size: 16px;
  font-weight: 400;
  color: #C6C6C6;
  white-space: nowrap;
  @media only screen and (max-width: 980px),
  only screen and (max-height: 910px) {
  display: none;
}
`;

const ImgRedes = styled.img`
  height: 40px;
  width: 40px;
  cursor: pointer;
  @media only screen and (max-width: 980px),
  only screen and (max-height: 910px) {
  display: none;
}
`;

const UserContainer = styled.div`
  display: flex;
  right: 0px;
  top: 50%;
  padding: 0px 12px;
  transform: translateY(-50%);
  position: absolute;
  align-items: center;
  gap: 10px;
  width: auto;
  height: 40px;
  cursor: pointer;
`;

const UploadVideoImg = styled.img`
  height: 30px;
  width: 30px;
`;

const ItemUser = styled.div`
  display: flex;
  margin-right: 15px;
  top: 50%;
  padding: 0px 12px;
  align-items: center;
  gap: 8px;
  width: auto;
  height: 40px;
  transition: background-color 0.5s;
  cursor: pointer;
  border-radius: 30px;

`;

const UserImg = styled.img`
  height: 35px;
  width: 35px;
  border-radius: 30px;
  background-color: #999; 
`;

const UserName = styled.h3`
  font-family: "Roboto Condensed", Helvetica;
  font-size: 18px;
  font-weight: bold;
  color: rgba(224, 175, 208);
  margin-right: auto;
`;

const Email = styled.h3`
  font-family: "Roboto Condensed", Helvetica;
  font-size: 16px;
  font-weight: normal;
  color: white;
  margin-right: auto;
  margin-bottom: 20px;
`;

const UserOptions = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  right: 40px;
  top: 50px;
  border-radius: 12px;
  background: rgba(36, 36, 36);
  padding: 20px 20px 20px 20px; 
  gap: 10px;
`;

const WrapperMenuUser = styled.div`
  padding: 0px 0px;
  background-color: transparent;

`;

const MenuUserDiv = styled.div`
  display: flex;
  align-items: center;
  gap: 10.5px;
  cursor: pointer;
  padding: 22px 140px 22px 0px;
  border-radius: 30px;
  height: 0px;
  transition: background-color 0.5s;
  font-family: "Roboto Condensed", Helvetica;
  font-size: 18px;
  color: ${({ theme }) => theme.text};

  &:hover {
    background-color: ${({ theme }) => theme.soft};
  }

`;

const MenuUserImg = styled.img`
  height: 22px;
  margin-left:15px;
  width: 22px;
`;

const MenuUserText = styled.h3`
  font-family: "Roboto Condensed", Helvetica;
  font-size: 15px;
  font-weight: 400;
  color: ${({ theme }) => theme.text};
  letter-spacing: 0;
  line-height: normal;
  @media only screen and (max-width: 980px),
    only screen and (max-height: 910px) {
    display: none;
  }
`;

const MenuUserLogoutDiv = styled.div`
  display: flex;
  align-items: center;
  gap: 10.5px;
  cursor: pointer;
  padding: 22px 10px 22px 120px;  /* Adjusted padding order for better alignment */
  border-radius: 30px;
  height: 0px;
  font-family: "Roboto Condensed", Helvetica;
  font-size: 18px;
  color: ${({ theme }) => theme.text};
`;

const LogoutUserText = styled.h3`
  font-family: "Roboto Condensed", Helvetica;
  font-size: 15px;
  font-weight: 400;
  color: ${({ theme }) => theme.text};
  letter-spacing: 0;
  line-height: normal;
  margin-left: auto;  /* Move the text to the right */
  transition: color 0.2s;

  ${MenuUserLogoutDiv}:hover & {
    color: rgba(224, 175, 208);
  }
  
`;

const LogoutUserImg = styled.img`
  height: 22px;
  width: 22px;
  transition: transform 0.2s;
  ${MenuUserLogoutDiv}:hover & {
    content: url(${LogoutIconoP});
  }
`;




const Navbar = ({ menuVisible, toggleMenu }) => {
  const { currentUser } = useSelector(state => state.user);
  const [scrolled, setScrolled] = useState(false);
  const { language, setLanguage } = useLanguage();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const translations = {
    en: {
      join: "Join",
      now: "Now",
      search: "Search",
      signin: "Sign in",
      profile: "Profile",
      help: "Help",
      terms: "Terms",
      privacy: "Privacy",
      about: "About",
      logout: "Log out",

    },
    es: {
      join: "Unete",
      now: "Ahora",
      search: "Buscar",
      signin: "Iniciar Sesión",
      profile: "Perfil",
      help: "Ayuda",
      terms: "Términos",
      privacy: "Privacidad",
      about: "Acerca  de",
      logout: "Cerrar Sesión",
    },
  };

  const logoutFunction = () => {
    dispatch(logout());
    navigate('/');
    setDropdownVisible(false);
  };

  const redFacebook = () => {
    window.open('https://www.facebook.com/', '_blank')
  }
  const redInstagram = () => {
    window.open('https://www.instagram.com/', '_blank')
  }
  const redTwitter = () => {
    window.open('https://www.twitter.com/', '_blank')
  }
  const redTelegram = () => {
    window.open('https://desktop.telegram.org/?setln=en', '_blank')
  }
  const redTikTok = () => {
    window.open('https://www.tiktok.com/', '_blank')
  }
  const redDiscord = () => {
    window.open('https://www.discord.com/', '_blank')
  }

  const handleScroll = () => {
    const isScrolled = window.scrollY > 0;
    setScrolled(isScrolled);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const [dropdownVisible, setDropdownVisible] = useState(false);

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  return (
    <Container scrolled={scrolled}>
      <Wrapper>
        <ItemMenu onClick={() => toggleMenu(menuVisible)}>
          <Img src={MenuIcono} />
        </ItemMenu>
        <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
          <Logo>
            <ImgLogo src={GifLogo} />
            <AppName> Flashy </AppName>
          </Logo>
        </Link>
        <Search scrolled={scrolled}>
          <Input placeholder={translations[language].search} />
          <ImgBuscar src={BuscarIcono} />
        </Search>
        <FollowDiv>
          <Follow>{translations[language].join}</Follow>
          <Follow>{translations[language].now}</Follow>
        </FollowDiv>
        <ImgRedes onClick={redFacebook} src={FacebookIcono2} />
        <ImgRedes onClick={redInstagram} src={InstagramIcono2} />
        <ImgRedes onClick={redTwitter} src={TwitterIcono2} />
        <ImgRedes onClick={redTelegram} src={TelegramIcono2} />
        <ImgRedes onClick={redTikTok} src={TikTokIcono2} />
        <ImgRedes onClick={redDiscord} src={DiscordIcono2} />
        {currentUser ? (
          <UserContainer>
            <UploadVideoImg src={UploadVideoIcono} />
            <ItemUser onClick={toggleDropdown}>
              <UserImg src={currentUser.img} />
            </ItemUser>
          </UserContainer>
        ) : <Link
          to="signin"
          style={{
            textDecoration: "none",
            color: "inherit",
          }}
        >
          <ItemLogin>
            <ImgLogin src={InicioSesionIcono2} />
            <ButtonLoginText> {translations[language].signin} </ButtonLoginText>
          </ItemLogin>
        </Link>}
      </Wrapper>
      {dropdownVisible && (
        <UserOptions>
          <UserName>{currentUser.name}</UserName>
          <Email>{currentUser.email}</Email>
          <WrapperMenuUser>
            {/* Dropdown content goes here */}
            {/* For example, you can add links to user profile, settings, etc. */}
            <Link to="/profile" style={{
              width: "100%",
              textDecoration: "none",
              color: "inherit"
            }}>
              <MenuUserDiv onClick={toggleDropdown}>

                <MenuUserImg src={ProfileIcono} />
                <MenuUserText>{translations[language].profile}</MenuUserText>

              </MenuUserDiv>
            </Link>

            <Link to="/help" style={{
              width: "100%",
              textDecoration: "none",
              color: "inherit"
            }}>
              <MenuUserDiv onClick={toggleDropdown}>
                <MenuUserImg src={AyudaIcono} />
                <MenuUserText>{translations[language].help}</MenuUserText>
              </MenuUserDiv>
            </Link>
            <Link to="/terms" style={{
              width: "100%",
              textDecoration: "none",
              color: "inherit"
            }}>
              <MenuUserDiv onClick={toggleDropdown}>
                <MenuUserImg src={TermsIcono} />
                <MenuUserText>{translations[language].terms}</MenuUserText>
              </MenuUserDiv>
            </Link>
            <Link to="/privacy" style={{
              width: "100%",
              textDecoration: "none",
              color: "inherit"
            }}>
              <MenuUserDiv onClick={toggleDropdown}>
                <MenuUserImg src={PrivacyIcono} />
                <MenuUserText>{translations[language].privacy}</MenuUserText>
              </MenuUserDiv>
            </Link>
            <Link to="/about" style={{
              width: "100%",
              textDecoration: "none",
              color: "inherit"
            }}>
              <MenuUserDiv onClick={toggleDropdown}>
                <MenuUserImg src={AboutIcono} />
                <MenuUserText>{translations[language].about}</MenuUserText>
              </MenuUserDiv>
            </Link>
          </WrapperMenuUser>
          <Link to="/" style={{
            width: "100%",
            textDecoration: "none",
            color: "inherit"
          }}>
            <MenuUserLogoutDiv onClick={logoutFunction}>
              <LogoutUserText>{translations[language].logout}</LogoutUserText>
              <LogoutUserImg src={LogoutIcono} />
            </MenuUserLogoutDiv>
          </Link>
        </UserOptions>
      )}
    </Container >
  );
};

export default Navbar;
