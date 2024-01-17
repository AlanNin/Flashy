import React, { useState, useEffect, useRef, useContext } from "react";
import styled, { css, keyframes } from "styled-components";
import FlashLogo from "../assets/GifLogo.gif";
import FacebookIcono2 from "../assets/FacebookIcono2.png";
import InstagramIcono2 from "../assets/InstagramIcono2.png";
import TwitterIcono2 from "../assets/TwitterIcono2.png";
import TikTokIcono2 from "../assets/TikTokIcono2.png";
import DiscordIcono2 from "../assets/DiscordIcono2.png";
import { useLanguage } from '../utils/LanguageContext';
import { Link, useNavigate } from "react-router-dom";

// CONTAINER
const MainContainer = styled.div`
  padding: 55px 0px;
  position: relative;
  width: 100%;
  height: max-content;
  background-color: rgba(15, 12, 18);
  margin-top: auto;
`;

// WRAPPER
const Wrapper = styled.div`
  position: relative;
  width: calc(100% - 100px);
  height: auto;
  padding: 40px 50px;
  display: flex;
  flex-direction: column;
`;

// 1ST LINE DIV
const Div1 = styled.div`
  position: relative;
  display: flex;
`;

// 2ND LINE DIV
const Div2 = styled.div`
  position: relative;
  display: flex;
  margin-top: 10px;
  padding-top: 10px;
  gap: 30px;
  border-top: 1px solid rgba(122, 121, 121, 0.1);
`;

// 3RD LINE DIV
const Div3 = styled.div`
  position: relative;
  display: flex;
  margin-top: 10px;
  gap: 30px;
`;

// SPANS
const Span = styled.span`
    font-size: 17px;
    font-weight: normal;
    font-family: "Roboto Condensed", Helvetica;
    color: ${({ theme }) => theme.text};
    cursor: pointer;
    transition: color 0.2s ease;

    &:hover {
      color: #FF00C0;
    }
`;

const SpanSoft = styled.span`
    font-size: 17px;
    font-weight: normal;
    font-family: "Roboto Condensed", Helvetica;
    color: ${({ theme }) => theme.textSoft};
`;

//LOGO
const Logo = styled.div` 
  position: relative;
  display: flex;
  width: max-content;
  align-items: center;
  gap: 7.25px;
  font-weight: bold;
  padding: 0px; 14.5px;
  padding-right: 20px;
  border-right: 1px solid rgba(122, 121, 121, 0.1);
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

const DivRedes = styled.div`
  display: flex;
  align-items: center;
  padding-left: 20px;
`;

const FollowDiv = styled.div`
  flexDirection: 'row';
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

const Footer = () => {
  const navigate = useNavigate();
  const { language, setLanguage } = useLanguage();

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

  const handleGoHome = () => {
    navigate("/");
  };

  const handleGoToTermsOfService = () => {
    navigate("/terms");
  };

  const handleGoToContact = () => {
    navigate("/contact");
  };

  const translations = {
    en: {
      join: "Join",
      now: "Now",
    },
    es: {
      join: "Unete",
      now: "Ahora",
    },
  };


  return (
    <MainContainer>

      <Wrapper>

        <Div1>
          <Logo>
            <ImgLogo src={FlashLogo} />
            <AppName> Flashy </AppName>
          </Logo>

          <DivRedes>
            <FollowDiv>
              <Follow>{translations[language].join}</Follow>
              <Follow>{translations[language].now}</Follow>
            </FollowDiv>
            <ImgRedes onClick={redFacebook} src={FacebookIcono2} />
            <ImgRedes onClick={redInstagram} src={InstagramIcono2} />
            <ImgRedes onClick={redTwitter} src={TwitterIcono2} />
            <ImgRedes onClick={redTikTok} src={TikTokIcono2} />
            <ImgRedes onClick={redDiscord} src={DiscordIcono2} />
          </DivRedes>

        </Div1>

        <Div2>
          <Span onClick={handleGoToTermsOfService}>
            Terms of service
          </Span>
          <Span onClick={handleGoToContact}>
            Contact
          </Span>
        </Div2>

        <Div3>
          <SpanSoft>
            Flashy does not store any files on our server, we only linked to the media which is hosted on 3rd party services.
          </SpanSoft>
        </Div3>

        <Div3>
          <SpanSoft>
            © Flashy. All rights reserved.
          </SpanSoft>
        </Div3>

      </Wrapper>

    </MainContainer >

  );
};

export default Footer;
