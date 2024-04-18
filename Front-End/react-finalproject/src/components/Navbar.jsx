import React, { useState, useEffect, useRef, useContext } from "react";
import styled from "styled-components";
import "../utils/global.css";
import { Link, useNavigate, useLocation } from "react-router-dom";
import MenuIcono from "../assets/MenuIcono.png";
import FlashLogo from "../assets/GifLogo.gif";
import InicioSesionIcono2 from "../assets/InicioSesionIcono2.png";
import BuscarIcono from "../assets/BuscarIcono.png";
import FacebookIcono2 from "../assets/FacebookIcono2.png";
import InstagramIcono2 from "../assets/InstagramIcono2.png";
import TwitterIcono2 from "../assets/TwitterIcono2.png";
import ProfileIcono from "../assets/ProfileIcono.png";
import LogoutIcono from "../assets/LogoutIcono.png";
import LogoutIconoP from "../assets/LogoutIconoP.png";
import TermsIcono from "../assets/TermsIcono.png";
import PrivacyIcono from "../assets/PrivacyIcono.png";
import AboutIcono from "../assets/AboutIcono.png";
import AyudaIcono from "../assets/AyudaIcono.png";
import TikTokIcono2 from "../assets/TikTokIcono2.png";
import DiscordIcono2 from "../assets/DiscordIcono2.png";
import SettingsIcon from "../assets/SettingsIcon2.png";
import { useLanguage } from '../utils/LanguageContext';
import { useDispatch, useSelector } from 'react-redux';
import { logout, resetUserState } from "../redux/userSlice";
import UploadVideoIcono from "../assets/UploadVideoIcono.png";
import NotificationIcon from "../assets/NotificationIcon.png";
import NotificationFilledIcon from "../assets/NotificationFilledIcon.png";
import NotificationDisabledIcon from "../assets/NotificationDisabledIcon.png";
import Upload from "./Upload";
import NotificationCenter from "./NotificationCenter";
import axios from "axios";
import io from 'socket.io-client';
import { userUpdateNotifications, userClearNotifications } from "../redux/userSlice";
import Help from "./Help";

const Container = styled.div`
  position: fixed;
  top: 0;
  right:0px;
  backdrop-filter: blur(${({ scrolled }) => (scrolled ? "5px" : "0px")});
  background: ${({ scrolled, theme }) =>
    scrolled
      ? "rgba(8, 8, 8, 0.6)"
      : `linear-gradient(to right, rgba(8, 8, 8) 40%,  rgba(8, 8, 8, 0.6), rgba(8, 8, 8, 0.4) 45%, rgba(8, 8, 8, 0.3) 50%, rgba(8, 8, 8, 0.1) 60%)`};
  height: 56px;
  width: 100%;
  z-index: 3;
  transition: background 0.3s ease-in;
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
  padding: 0px 55px;
`;

const ItemMenu = styled.div`
  display: flex;
  margin-top: 2px;
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

const ImgMenu = styled.img`
  height: 32px;
  width: 32px;
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
  padding: 0px 14.5px;
`;

const ImgLogo = styled.img`
  height: 36px;
  width: 40px;
  margin-top: 2px;
`;

const AppName = styled.h1`
  font-size: 24px;
  font-family: "Roboto Condensed", Helvetica;
  font-weight: 700;
  margin-left: -2px;
  margin-top: 2px;
  color: white;
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
  border-radius: 10px;
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
  margin-right: 2px;
  font-weight: normal;
  margin-bottom: 3px;
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
      ? "rgba(28, 28, 28, 0.9)"
      : "rgba(28, 28, 28, 0.9)"};


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
  margin-right: 10px;

`;

const Follow = styled.h1`
  font-family: "Roboto Condensed", Helvetica;
  font-size: 16px;
  font-weight: 400;
  color: #C6C6C6;
  white-space: nowrap;

`;

const ImgRedes = styled.img`
  height: 40px;
  width: 40px;
  margin-bottom: 5px;
  cursor: pointer;

`;

const UserContainer = styled.div`
  display: flex;
  right: 0px;
  top: 50%;
  padding: 0px 12px;
  transform: translateY(-50%);
  position: absolute;
  align-items: center;
  gap: 8px;
  width: auto;
  height: 40px;
`;

const UploadVideoImg = styled.img`
  height: 25px;
  width: 25px;
  cursor: pointer;
  padding: 5px;
  border-radius: 50%;
  transition: background 0.3s ease;
  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
  margin-right: -4px;
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
  object-fit: cover;
`;

const DisplayName = styled.h3`
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
  margin-bottom: 10px;
`;

const UserOptions = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  right: 40px;
  top: 50px;
  border-radius: 12px 0px 12px 12px;
  background: rgba(36, 36, 36);
  padding: 20px 20px 10px 20px; 
  gap: 10px;
`;

const WrapperMenuUser = styled.div`
  position: relative;
  display: flex;
  align-items: flex-start;
`;

const MenuUserDiv = styled.div`
  display: flex;
  align-items: center;
  gap: 10.5px;
  cursor: pointer;
  padding: 22px 20px 22px 0px;
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

const MenuUserText = styled.span`
  display: flex;
  font-family: "Roboto Condensed", Helvetica;
  font-size: 15px;
  font-weight: 400;
  color: ${({ theme }) => theme.text};
  white-space: nowrap;
`;

const MenuUserLogoutDiv = styled.div`
  position: absolute;  
  display: flex;
  align-items: center;
  gap: 10.5px;
  cursor: pointer;
  border-radius: 30px;
  padding: 5px 10px;
  font-family: "Roboto Condensed", Helvetica;
  font-size: 18px;
  color: ${({ theme }) => theme.text};
  top: 15px;
  right: 10px;
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

// NOTIFICATION CENTER


const NotificationCenterImg = styled.img`
  height: 100%;
  width: 100%;
  margin-right: 0px;
`;

const NotificationCenterCounter = styled.h1`
  position: absolute;
  font-family: "Roboto Condensed", Helvetica;
  font-size: 11px;
  background: rgba(255, 0, 192, 0.8);
  color: ${({ theme }) => theme.text};
  border-radius: 50%;
  padding: 3px 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  top: 15px;
  left: 30px;
`;

const NotificationCenterImgContainer = styled.div`
  height: 25px;
  width: 25px;
  margin-right: 0px;
  padding: 5px;
  border-radius: 50%;
  transition: background 0.3s ease;
  cursor: ${({ notificationsEnabled }) => (!notificationsEnabled ? 'not-allowed' : 'pointer')};
  &:hover {
    background: ${({ notificationsEnabled }) => (!notificationsEnabled ? '' : 'rgba(255, 255, 255, 0.3)')};
  }
`;

const Navbar = ({ menuVisible, toggleMenu }) => {
  const { currentUser } = useSelector(state => state.user);
  const [scrolled, setScrolled] = useState(false);
  const { language, setLanguage } = useLanguage();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const translations = {
    en: {
      join: "Join",
      now: "Now",
      search: "Search",
      signin: "Sign in",
      channel: "Channel",
      settings: "Settings",
      help: "Help",
      about: "About",
      logout: "Log out",

    },
    es: {
      join: "Unete",
      now: "Ahora",
      search: "Buscar",
      signin: "Iniciar Sesión",
      channel: "Canal",
      settings: "Ajustes",
      help: "Ayuda",
      about: "Acerca de",
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


  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");

  useEffect(() => {
    // Add or remove the "overflow: hidden" style on the body based on the "open" state
    document.body.style.overflow = open ? 'hidden' : 'auto';

    return () => {
      // Clean up the style when the component is unmounted
      document.body.style.overflow = 'auto';
    };
  }, [open]);

  const handleKeyPress = (e) => {

    if (e.key === "Enter") {
      // Navegar al resultado de búsqueda al presionar Enter
      handleSearch();
    }
  };

  const handleSearch = () => {
    if (q !== '') {
      navigate(`/search?q=${q}`);
    }
  };

  // DROPDOWN USER
  const dropdownRef = useRef(null);
  const dropdownButtonRef = useRef(null);

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  useEffect(() => {
    const handleClickOutsideDropdown = (event) => {

      const isClickInsideButton = dropdownButtonRef.current && dropdownButtonRef.current.contains(event.target);

      if (dropdownRef.current && !dropdownRef.current.contains(event.target) && !isClickInsideButton) {
        setDropdownVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutsideDropdown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutsideDropdown);
    };
  }, []);

  // NOTIFICATION CENTER
  const [isNotificationCenterOpen, setIsNotificationCenterOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const notificationButtonRef = useRef(null);

  // FETCH INITIAL NOTIFICATIONS
  useEffect(() => {
    if (!currentUser?.notificationsEnabled) {
      return;
    }

    fetchNotifications();
  }, [isNotificationCenterOpen]);

  // UPDATE ON NOTIFICATION
  useEffect(() => {

    if (!currentUser?.notificationsEnabled) {
      return;
    }

    const socket = io('http://localhost:8800');

    // Escucha el evento 'newVideo' del servidor
    socket.on('newVideo', ({ videoId, userId }) => {
      validateNotification(userId);
    })

    return () => {
      // Desconecta el socket cuando el componente se desmonta
      socket.disconnect();
    };
  }, []);

  const handleNotificationCenter = () => {

    if (!currentUser?.notificationsEnabled) {
      return;
    }

    if (!isNotificationCenterOpen) {
      clearNotifications();
    }

    setIsNotificationCenterOpen(!isNotificationCenterOpen);

  };

  const validateNotification = async (userId) => {

    if (!currentUser?.notificationsEnabled) {
      return;
    }

    try {
      const response = await axios.get(`http://localhost:8800/api/users/${userId}/subscribers`);

      if (response.data.subscribers.includes(currentUser?._id)) {
        dispatch(userUpdateNotifications());
        fetchNotifications();
      } else {
        //
      }

    } catch (error) {
      console.error("Error:", error);
    }
  };

  const fetchNotifications = async () => {
    if (!currentUser?.notificationsEnabled) {
      return;
    }

    try {
      const response = await axios.get("http://localhost:8800/api/users/notifications", {
      });
      setNotifications(response.data.notifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const clearNotifications = async () => {
    if (!currentUser?.notificationsEnabled) {
      return;
    }

    try {
      await axios.put(`http://localhost:8800/api/users/notifications/reset-new-notifications`);
      dispatch(userClearNotifications());
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  // HELP
  const [helpPopup, setHelpPopup] = useState(false);

  const handleHelp = () => {
    toggleDropdown();
    setHelpPopup(true);
  };

  const handleCloseHelp = () => {
    setHelpPopup(false);
  };

  // STOP SCROLL HELP
  useEffect(() => {
    if (helpPopup) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [helpPopup]);


  // HIDE NAVBAR SIGN IN SIGN UP, MANTENER ABAJO AL FINAL DE CODIGO, ANTES DE RETURN
  const isSigninOrSignup = location.pathname === '/signin' || location.pathname === '/signup' || location.pathname === '/recovery';

  if (isSigninOrSignup) {
    return null;
  }

  return (
    <>
      <Container scrolled={scrolled}>
        <Wrapper>
          <ItemMenu onClick={() => toggleMenu(menuVisible)}>
            <ImgMenu src={MenuIcono} />
          </ItemMenu>
          <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
            <Logo>
              <ImgLogo src={FlashLogo} />
              <AppName> Flashy </AppName>
            </Logo>
          </Link>
          <Search scrolled={scrolled}>
            <Input
              placeholder={translations[language].search}
              onChange={(e) => setQ(e.target.value)}
              onKeyPress={handleKeyPress} />
            <ImgBuscar src={BuscarIcono} onClick={() => handleSearch()} />
          </Search>
          <FollowDiv>
            <Follow>{translations[language].join}</Follow>
            <Follow>{translations[language].now}</Follow>
          </FollowDiv>
          <ImgRedes onClick={redFacebook} src={FacebookIcono2} />
          <ImgRedes onClick={redInstagram} src={InstagramIcono2} />
          <ImgRedes onClick={redTwitter} src={TwitterIcono2} />
          <ImgRedes onClick={redTikTok} src={TikTokIcono2} />
          <ImgRedes onClick={redDiscord} src={DiscordIcono2} />
          {currentUser ? (
            <UserContainer>
              <NotificationCenterImgContainer onClick={() => handleNotificationCenter()} ref={notificationButtonRef} notificationsEnabled={currentUser?.notificationsEnabled}>
                <NotificationCenterImg
                  src={!currentUser?.notificationsEnabled ? NotificationDisabledIcon : currentUser?.newNotifications > 0 ? NotificationFilledIcon : isNotificationCenterOpen ? NotificationFilledIcon : NotificationIcon}

                />
                {currentUser?.notificationsEnabled && currentUser?.newNotifications > 0 && (
                  <NotificationCenterCounter>
                    {currentUser?.newNotifications}
                  </NotificationCenterCounter>
                )}
              </NotificationCenterImgContainer>
              <UploadVideoImg src={UploadVideoIcono} onClick={() => setOpen(true)} />
              <ItemUser onClick={toggleDropdown} ref={dropdownButtonRef}>
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
          <UserOptions ref={dropdownRef}>
            <DisplayName>{currentUser.displayname}</DisplayName>
            <Email>{currentUser.email}</Email>
            <WrapperMenuUser>

              <Link to={`/channel/@${currentUser?.name}`} style={{
                width: "100%",
                textDecoration: "none",
                color: "inherit"
              }}>
                <MenuUserDiv onClick={toggleDropdown}>

                  <MenuUserImg src={ProfileIcono} />
                  <MenuUserText>{translations[language].channel}</MenuUserText>

                </MenuUserDiv>
              </Link>

              <Link to="/settings" style={{
                width: "100%",
                textDecoration: "none",
                color: "inherit"
              }}>
                <MenuUserDiv onClick={toggleDropdown}>

                  <MenuUserImg src={SettingsIcon} />
                  <MenuUserText>{translations[language].settings}</MenuUserText>

                </MenuUserDiv>
              </Link>


              <MenuUserDiv onClick={handleHelp}>
                <MenuUserImg src={AyudaIcono} />
                <MenuUserText>{translations[language].help}</MenuUserText>
              </MenuUserDiv>

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

      {helpPopup && (
        <Help handleCloseHelp={handleCloseHelp} />
      )}
      {open && <Upload setOpen={setOpen} />}
      {isNotificationCenterOpen && <NotificationCenter notifications={notifications} handleNotificationCenter={handleNotificationCenter} notificationButtonRef={notificationButtonRef} />}
    </>
  );
};

export default Navbar;
