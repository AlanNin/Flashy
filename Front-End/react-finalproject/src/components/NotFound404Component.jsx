import React from "react";
import styled, { keyframes } from "styled-components";
import Space404 from "../assets/Space404.jpg";
import AstroGif from "../assets/AstroGif.gif";
import Logo404 from "../assets/Logo404.png";
import { Link, useNavigate, useHistory } from 'react-router-dom';
import { useLanguage } from '../utils/LanguageContext';

const transformMixin = (foo) => `
  @each $prefix in '-webkit-', '-moz-', '-ms-', '' {
    #{$prefix}transform: ${foo};
  }
`;

const Background = styled.img`
  position: absolute;
  display: flex;
  width: 100%;
  height: 100vh;
  filter: brightness(0.4);
  z-index: 1;
  object-fit: cover; 
`;


const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  background: transparent;
  width: 100%;
  align-items: center;
  justify-content: center;
  height: 100vh;
  z-index: 2;
`;

const Planet = styled.div`
    position: absolute;
    left: 50%;
    top: 7em;
    margin-left: -15em;
    width: 30em;
    height: 30em;
    background: #ddd;
    border-radius: 50%;
    box-shadow: inset -1.6em 0 0 0 #ccc, 0 0 1em 0 #ccc;
    overflow: hidden;

    .crater {
      position: absolute;
      background: #999;
      border-radius: 50%;
      box-shadow: inset 0.1em 0.1em 0.1em 0 #777, -0.1em -0.1em 0.1em 0 #eee, 0.1em 0.1em 0.1em 0 #ccc;
    }

    .crater:nth-child(1) {
      left: 5.5em;
      top: 11em;
      width: 7.5em;
      height: 8em;
    }

    .crater:nth-child(2) {
      left: 16.2em;
      top: 25em;
      width: 4em;
      height: 2.8em;
      ${transformMixin("rotate(-22deg)")};
    }

    .crater:nth-child(3) {
      left: 25.4em;
      top: 17em;
      width: 2em;
      height: 3em;
      ${transformMixin("rotate(12deg)")};
    }

    .crater:nth-child(4) {
      left: 24.4em;
      top: 24.7em;
      width: 0.8em;
      height: 3em;
      ${transformMixin("rotate(48deg)")};
    }

    .crater:nth-child(5) {
      left: 27.4em;
      top: 5.6em;
      width: 0.8em;
      height: 3.6em;
      ${transformMixin("rotate(-31deg)")};
    }
  `;

const Message = styled.div`
    position: absolute;
    color: #ddd;
    top: 38.5em;
    width: 100%;
    text-align: center;
    cursor: default;
    text-shadow: 0.1em 0.1em 0 #111;

    p {
      display: inline-block;
      font-size: 1.6em;

      a {
        color: inherit;
        text-decoration: none;
        border-bottom: 0.1rem dotted #999;
      }
    }
  `;

const MessageTxt = styled.h1`
  font-size: 28px;
  font-weight: bold;
  font-family: "Roboto Condensed", Helvetica;
  color: ${({ theme }) => theme.text};
  text-shadow: 0.1em 0.1em 0 #111;
`;

const Logo404Img = styled.img`
  position: absolute;
  height: 60%;
  width: 75%;
  top: 30px;
  left: 64px;
`;

const AstroGifImg = styled.img`
  position: absolute;
  bottom: 110px;
  right: 160px;
  transform: rotate(25deg);
  width: 200px;
  height: auto;
  filter: brightness(0.7);
`;

const Button = styled.a`
  position: absolute;
  display: block;
  background: linear-gradient(
    45deg,
    #d9046b,
    #d9046b,
    #fc3ab5,
    #ed4eff
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
  top: 31em;
  white-space: nowrap;
  transition: background 0.5s ease;
  overflow: hidden;
  text-shadow: 0.1em 0.1em 0 #111;
  font-family: "Roboto Condensed", Helvetica;
  -webkit-mask-image: -webkit-radial-gradient(white, black);

  &:before {
    content: '';
    position: absolute;
    width: 20px;
    height: 100px;
    background: white;
    bottom: -25px;
    left: 0;
    border: 2px solid transparent;
    transform: translateX(-50px) rotate(45deg);
    transition: transform 0.5s ease;
  }

  &:hover {
    padding: 0 60px;
    border: 1px solid white;
    background: transparent;

    &:before {
      transform: translateX(250px) rotate(45deg);
    }
  }
`;

const NotFound404 = () => {
  const { language, setLanguage } = useLanguage();

  const translations = {
    en: {
      message: "There is no life here, try to find something else",
      gohome: "Go Home",
    },
    es: {
      message: "No hay vida aquí, intenta encontrar algo más",
      gohome: "Ir al incio",
    },
  };


  return (
    <>
      <Background src={Space404} />
      <Container>
        <Planet>
          <div className="crater" style={{ left: "4.5em", top: "18em", width: "5.5em", height: "6em" }} />
          <div className="crater" style={{ left: "16.2em", top: "25em", width: "4em", height: "2.8em", transform: "rotate(-22deg)" }} />
          <div className="crater" style={{ left: "25.4em", top: "17em", width: "2em", height: "3em", transform: "rotate(12deg)" }} />
          <div className="crater" style={{ left: "24.4em", top: "24.7em", width: "0.8em", height: "3em", transform: "rotate(48deg)" }} />
          <div className="crater" style={{ left: "27.4em", top: "5.6em", width: "0.8em", height: "3.6em", transform: "rotate(-31deg)" }} />
          <Logo404Img src={Logo404} />
        </Planet>
        <Message>
          <MessageTxt>
            {translations[language].message}
          </MessageTxt>
        </Message>
        <Link to={"/"} style={{ position: 'absolute', width: 'max-content', height: 'max-content', top: '0em', left: 'calc(50% - 102px)' }}>
          <Button> {translations[language].gohome} </Button>
        </Link>

        <AstroGifImg src={AstroGif} />
      </Container>
    </>
  );
};

export default NotFound404;
