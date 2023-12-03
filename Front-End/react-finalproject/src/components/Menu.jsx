import React, { useState, useEffect, useRef, useContext } from "react";
import { useLanguage } from '../utils/LanguageContext';
import styled from 'styled-components';
import InicioIcono from "../assets/InicioIcono.png";
import ExplorarIcono from "../assets/ExplorarIcono.png";
import SuscripcionesIcono from "../assets/SuscripcionesIcono.png";
import Separador from "../assets/Separador.png";
import HistorialIcono from "../assets/HistorialIcono.png";
import LibreriaIcono from "../assets/LibreriaIcono.png";
import MusicaIcono from "../assets/MusicaIcono.png";
import NoticiasIcono from "../assets/NoticiasIcono.png";
import DeportesIcono from "../assets/DeportesIcono.png";
import PeliculasIcono from "../assets/PeliculasIcono.png";
import VideojuegosIcono from "../assets/VideojuegosIcono.png";
import AjustesIcono from "../assets/AjustesIcono.png";
import InicioSesionIcono from "../assets/InicioSesionIcono.png";
import LightModeIcon from "../assets/LightModeIcon.png";
import InicioSesionIcono2 from "../assets/InicioSesionIcono2.png";
import RegresarIcono from "../assets/RegresarIcono.png";
import AyudaIcono from "../assets/AyudaIcono.png";
import IdiomaIcono from "../assets/IdiomaIcono.png";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import "../utils/global.css";

const Container = styled.div`
  position: fixed;
  width: 259px;
  left:0px;
  display: fixed;
  backdrop-filter: blur(13px);
  background-color: ${({ theme }) => theme.bgLighter};
  font-family: var(--font-roboto-condensed);
  height: 100%;
  color: ${({ theme }) => theme.text};
  font-size: 14px;
  z-index: 3;
  transition: transform 0.2s ease;
  border-right: 1px solid ${({ theme }) => theme.borderColor};

  @media only screen and (max-width: 980px),
    only screen and (max-height: 910px) {
    width: 115.05px;
  }
`;

const Wrapper = styled.div`
  padding: 24px 18.5px;
  background-color: transparent;

  @media only screen and (max-width: 980px),
    only screen and (max-height: 910px) {
  }
`;

const Item = styled.div`
  display: flex;
  align-items: center;
  gap: 22.5px;
  cursor: pointer;
  padding: 22px 8px;
  border-radius: 30px;
  height: 0px;
  transition: background-color 0.5s;

  &:hover {
    background-color: ${({ theme }) => theme.soft};
  }

  @media only screen and (max-width: 980px),
    only screen and (max-height: 910px) {
    display: none;
  }
`;

const ItemLightMode = styled.div`
  display: flex;
  align-items: center;
  gap: 22.5px;
  padding: 22px 8px;
  border-radius: 30px;
  height: 0px;

  @media only screen and (max-width: 980px),
    only screen and (max-height: 910px) {
    display: none;
  }
`;

const Img = styled.img`
  height: 23px;
  width: 26px;
  margin-left: 7px;
  margin-bottom: 1px;

  @media only screen and (max-width: 980px),
    only screen and (max-height: 910px) {
    margin-left: 12.5px;
  }
`;

const ImgLightMode = styled.img`
  height: 26px;
  width: 26px;
  margin-left: 7px;
  margin-bottom: 1px;

  @media only screen and (max-width: 980px),
    only screen and (max-height: 910px) {
    margin-left: 12.5px;
  }
`;

const SwitchLightMode = styled.div`
  position: relative;
  display: inline-block;
  width: 40px;
  height: 21px;
  background-color: ${({ theme }) => (theme === 'light' ? '#ccc' : '#333')};
  border-radius: 12px;
  cursor: pointer;

  &::before {
    content: '';
    position: absolute;
    width: 20px;
    height: 20px;
    background-color: ${({ theme }) => (theme === 'light' ? '#fff' : '#000')};
    border-radius: 50%;
    transition: transform 0.3s ease;
    transform: ${({ theme }) => (theme === 'light' ? 'translateX(0)' : 'translateX(18px)')}; /* Adjusted */
  }
`;

const ItemLanguage = styled.div`
  display: flex;
  align-items: center;
  gap: 22.5px;
  padding: 22px 8px;
  border-radius: 30px;
  height: 0px;
  transition: background-color 0.5s;

  @media only screen and (max-width: 980px),
    only screen and (max-height: 910px) {
    display: none;
  }
`;

const Img2 = styled.img`
  height: 26px;
  width: 26px;
  margin-left: 7px;
`;

const LanguageSwitch = styled.div`
  position: fixed;
  display: flex;
  align-items: center;
  gap: 0px;
  cursor: pointer;
  margin-left: 152px;
  cursor: pointer;
`;

const LanguageSquare = styled.div`
  padding: 4px 6px;
  background-color: ${({ active, theme }) => (active ? "rgba(166, 65, 117 , 0.3)" : 'rgba(42, 41, 47)')};
  border-radius: 4px;
  transition: background-color 0.8s;
`;


const ButtonText = styled.h3`
  font-family: "Roboto Condensed", Helvetica;
  font-size: 18px;
  font-weight: 400;
  color: ${({ theme }) => theme.text};
  letter-spacing: 0;
  line-height: normal;
  @media only screen and (max-width: 980px),
    only screen and (max-height: 910px) {
    display: none;
  }
`;

const ItemForMini = styled.div`
  display: flex;
  align-items: center;
  gap: 22.5px;
  cursor: pointer;
  padding: 22px 8px;
  border-radius: 30px;
  height: 0px;
  transition: background-color 0.5s;

  &:hover {
    background-color: ${({ theme }) => theme.soft};
  }

  @media only screen and (max-width: 980px),
    only screen and (max-height: 910px) {
    gap: 0px;
    padding: 28px 0px;
    width: 70px;
  }
`;

const ItemCloseMenu = styled.div`
  display: flex;
  margin-left:24px;
  align-items: center;
  margin-bottom: 15px;
  gap: 10.5px;
  cursor: pointer;
  padding: 20px 11px;
  border-radius: 30px;
  height: 0px;
  width:135px;
  transition: background-color 0.5s;

  background-color: ${({ theme }) => theme.closeMenu};

  &:hover {
    background-color: ${({ theme }) => theme.soft};
  }

  @media only screen and (max-width: 980px),
    only screen and (max-height: 910px) {
    gap: 0px;
    padding: 28px 0px;
    width: 70px;
    margin-left:0px;
  }
`;

const ImgCloseMenu = styled.img`
  height: 30px;
  width: 33px;
  

  @media only screen and (max-width: 980px),
    only screen and (max-height: 910px) {
    margin-left: 12.5px;
  }
`;

const ButtonTextCloseMenu = styled.h3`
  font-family: "Roboto Condensed", Helvetica;
  font-size: 18px;
  font-weight: 400;
  ${({ theme }) => theme.text};
  letter-spacing: 0;
  line-height: normal;
  @media only screen and (max-width: 980px),
    only screen and (max-height: 910px) {
    display: none;
  }
`;


const ImgSeparador = styled.img`
  margin: 15px 0px;
  width: 205px;
  height: 1px;

  @media only screen and (max-width: 980px),
    only screen and (max-height: 910px) {
    display: none;
  }
`;

const ImgSeparadorForLogin = styled.img`
  margin: 15px 0px;
  width: 205px;
  height: 1px;

  @media only screen and (max-width: 980px),
    only screen and (max-height: 910px) {
    width: 72px;
  }
`;

const ItemAyuda = styled.div`
  display: flex;
  align-items: center;
  gap: 22.5px;
  cursor: pointer;
  padding: 22px 8px;
  border-radius: 30px;
  height: 0px;
  transition: background-color 0.5s;

  &:hover {
    background-color: ${({ theme }) => theme.soft};
  }

  @media only screen and (max-width: 980px),
    only screen and (max-height: 910px) {
    display: none;
  }
`;

const ItemLogin = styled.div`
  display: flex;
  margin: auto;
  align-items: center;
  justify-content: center;
  gap: 8.5px;
  cursor: pointer;
  width: max-content;
  margin-top: 15px;
  padding: 8px 15px;
  border-radius: 10px;
  transition: background-color 0.5s;
  background-color: ${({ theme }) => theme.loginbg};
  &:hover {
    background-color: ${({ theme }) => theme.softloginbg};
  }

  @media only screen and (max-width: 980px),
    only screen and (max-height: 910px) {
      gap: 0px;
      padding: 28px 35px;
      margin-left: 0px;
    background-color: ${({ theme }) => theme.bgLighter};
  }
`;

const ImgLogin = styled.img`
  height: 44px;
  width: 44px;

  @media only screen and (max-width: 980px),
  only screen and (max-height: 910px) {
    margin-left: 11.5px;
  }
`;

const ImgUser = styled.img`
  height: 44px;
  width: 44px;
  border-radius: 30px;
  background-color: #999; 

  @media only screen and (max-width: 980px),
  only screen and (max-height: 910px) {
    margin-left: 11.5px;
  }
`;

const ButtonLoginText = styled.h3`
  font-family: "Roboto Condensed", Helvetica;
  font-size: 26px;
  font-weight: 700px;
  letter-spacing: 0;
  margin-right: 6px;
  line-height: normal;
  color: ${({ theme }) => theme.text};
  @media only screen and (max-width: 980px),
    only screen and (max-height: 910px) {
    display: none;
  }
`;

const Title = styled.h3`
  font-size: 12px;
  font-weight: 500;
  color: #aaaaaa;
  margin-bottom: 20px;
  margin-left: 20px;

  @media only screen and (max-width: 980px),
    only screen and (max-height: 910px) {
    display: none;
  }
`;

const Menu = ({ darkMode, setDarkMode, menuVisible, toggleMenu }) => {

  const { language, setLanguage } = useLanguage();

  const translations = {
    en: {
      closemenu: "Close Menu",
      home: "Home",
      explore: "Explore",
      subscriptions: "Subscriptions",
      history: "History",
      library: "Library",
      flashycontent: "Flashy Content",
      music: "Music",
      news: "News",
      sports: "Sports",
      movies: "Movies",
      videogames: "Videogames",
      help: "Help",
      settings: "Settings",
      switchLanguage: "Language",
      lightmode: "Light Mode",
      signin: "Sign in",
    },
    es: {
      closemenu: "Cerrar Menú",
      home: "Inicio",
      explore: "Explorar",
      subscriptions: "Suscripciones",
      history: "Historial",
      library: "Librería",
      flashycontent: "Contenido Flashy",
      music: "Música",
      news: "Noticias",
      sports: "Deportes",
      movies: "Películas",
      videogames: "Videojuegos",
      help: "Ayuda",
      settings: "Ajustes",
      switchLanguage: "Lenguaje",
      lightmode: "Modo Claro",
      signin: "Iniciar Sesión",
    },
  };

  const [theme, setTheme] = useState('light'); // Agregar este estado
  const { currentUser } = useSelector(state => state.user);
  const menuRef = useRef(null);

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      // Clic fuera del menú, cierra el menú
      toggleMenu();
    }
  };

  useEffect(() => {
    if (menuVisible) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuVisible, toggleMenu]);

  return (
    <Container ref={menuRef} style={{ transform: menuVisible ? "translateX(0)" : "translateX(-100%)" }}>
      <Wrapper>
        <ItemCloseMenu onClick={toggleMenu}>
          <ImgCloseMenu src={RegresarIcono} />
          <ButtonTextCloseMenu > {translations[language].closemenu} </ButtonTextCloseMenu >
        </ItemCloseMenu>

        <Link
          to="/"
          style={{
            width: "100%",
            textDecoration: "none",
            color: "inherit"
          }}
        >
          <ItemForMini onClick={toggleMenu}>
            <Img src={InicioIcono} />
            <ButtonText> {translations[language].home} </ButtonText>
          </ItemForMini>
        </Link>

        <Link
          to="Explore"
          style={{
            width: "100%",
            textDecoration: "none",
            color: "inherit"
          }}
        >
          <Item onClick={toggleMenu}>
            <Img src={ExplorarIcono} />
            <ButtonText> {translations[language].explore} </ButtonText>
          </Item>
        </Link>

        <Link
          to="Subscriptions"
          style={{
            width: "100%",
            textDecoration: "none",
            color: "inherit"
          }}
        >
          <ItemForMini onClick={toggleMenu}>
            <Img src={SuscripcionesIcono} />
            <ButtonText> {translations[language].subscriptions} </ButtonText>
          </ItemForMini>
        </Link>

        <ImgSeparador src={Separador} />

        <Link
          to="History"
          style={{
            width: "100%",
            textDecoration: "none",
            color: "inherit"
          }}
        >
          <ItemForMini onClick={toggleMenu}>
            <Img src={HistorialIcono} />
            <ButtonText> {translations[language].history} </ButtonText>
          </ItemForMini>
        </Link>

        <Link
          to="Library"
          style={{
            width: "100%",
            textDecoration: "none",
            color: "inherit"
          }}
        >
          <Item onClick={toggleMenu}>
            <Img src={LibreriaIcono} />
            <ButtonText> {translations[language].library} </ButtonText>
          </Item>
        </Link>

        <ImgSeparador src={Separador} />
        <Title> {translations[language].flashycontent} </Title>

        <Link
          to="Music"
          style={{
            width: "100%",
            textDecoration: "none",
            color: "inherit"
          }}
        >
          <Item onClick={toggleMenu}>
            <Img src={MusicaIcono} />
            <ButtonText> {translations[language].music} </ButtonText>
          </Item>
        </Link>

        <Link
          to="News"
          style={{
            width: "100%",
            textDecoration: "none",
            color: "inherit"
          }}
        >
          <Item onClick={toggleMenu}>
            <Img src={NoticiasIcono} />
            <ButtonText> {translations[language].news} </ButtonText>
          </Item>
        </Link>

        <Link
          to="Sports"
          style={{
            width: "100%",
            textDecoration: "none",
            color: "inherit"
          }}
        >
          <Item onClick={toggleMenu}>
            <Img2 src={DeportesIcono} />
            <ButtonText> {translations[language].sports} </ButtonText>
          </Item>
        </Link>

        <Link
          to="Movies"
          style={{
            width: "100%",
            textDecoration: "none",
            color: "inherit"
          }}
        >
          <Item onClick={toggleMenu}>
            <Img src={PeliculasIcono} />
            <ButtonText> {translations[language].movies} </ButtonText>
          </Item>
        </Link>

        <Link
          to="Videogames"
          style={{
            width: "100%",
            textDecoration: "none",
            color: "inherit"
          }}
        >
          <Item onClick={toggleMenu}>
            <Img src={VideojuegosIcono} />
            <ButtonText> {translations[language].videogames} </ButtonText>
          </Item>
        </Link>

        <ImgSeparadorForLogin src={Separador} />

        <Link
          to="Help"
          style={{
            width: "100%",
            textDecoration: "none",
            color: "inherit"
          }}
        >
          <ItemAyuda onClick={toggleMenu}>
            <Img2 src={AyudaIcono} />
            <ButtonText> {translations[language].help} </ButtonText>
          </ItemAyuda>
        </Link>

        <Link
          to="Settings"
          style={{
            width: "100%",
            textDecoration: "none",
            color: "inherit"
          }}
        >
          <Item onClick={toggleMenu}>
            <Img src={AjustesIcono} />
            <ButtonText> {translations[language].settings} </ButtonText>
          </Item>
        </Link>

        <ItemLanguage>
          <Img2 src={IdiomaIcono} />
          <ButtonText>{translations[language].switchLanguage}</ButtonText>
          <LanguageSwitch onClick={() => setLanguage(language === 'en' ? 'es' : 'en')}>
            <LanguageSquare active={language === 'en'}>
              EN
            </LanguageSquare>
            <LanguageSquare active={language === 'es'}>
              ES
            </LanguageSquare>
          </LanguageSwitch>
        </ItemLanguage>

        <ItemLightMode>
          <ImgLightMode src={LightModeIcon} />
          <ButtonText> {translations[language].lightmode} </ButtonText>
          <SwitchLightMode onClick={() => { setTheme(theme === 'light' ? 'dark' : 'light'); setDarkMode(!darkMode); }} theme={theme} />
        </ItemLightMode>

        <Link
          to={currentUser ? "" : "SignIn"}
          style={{
            width: "100%",
            textDecoration: "none",
            color: "inherit"
          }}
        >
          <ItemLogin onClick={toggleMenu}>
            {
              currentUser ? (
                (<ImgUser src={currentUser.img} />)
              ) :
                (<ImgLogin src={InicioSesionIcono2} />)

            }
            <ButtonLoginText>
              {currentUser ? currentUser.displayname.split(' ')[0] : 'Sign in'}
            </ButtonLoginText>

          </ItemLogin>
        </Link>

      </Wrapper>
    </Container>
  );
};

export default Menu;
