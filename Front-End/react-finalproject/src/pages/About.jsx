import React, { useState, useEffect, useRef, useContext } from "react";
import styled, { css, keyframes } from "styled-components";
import { useLanguage } from '../utils/LanguageContext';
import { Link, useNavigate } from "react-router-dom";

// CONTAINER
const MainContainer = styled.div`
  position: relative;
  width: 100%;
  top: 0;
  min-height: 100vh;
  background-color: rgba(15, 12, 18);
  margin: auto;
  max-width: 1820px;
  overflow: hidden;
`;

// WRAPPER
const Wrapper = styled.div`
  position: relative;
  width: calc(100% - 1000px);
  height: auto;
  margin: 56px 450px;
  padding: 40px 50px;
  display: flex;
  flex-direction: column;
`;

// LABELS
const Label = styled.label`
    font-size: 20px;
    font-weight: bold;
    font-family: "Roboto Condensed", Helvetica;
    color: ${({ theme }) => theme.text};
    cursor: pointer;
    transition: color 0.2s ease;

    &:hover {
      color: #FF00C0;
    }
`;

const SpanSoft = styled.span`
    font-size: 20px;
    font-weight: bold;
    font-family: "Roboto Condensed", Helvetica;
    color: ${({ theme }) => theme.textSoft};
`;

const SubLabel = styled.label`
    margin-top: -15px;
    font-size: 16px;
    color: ${({ theme }) => theme.textSoft};
    font-weight: normal;
    font-family: "Roboto Condensed", Helvetica;
`;

const TitleLabel = styled.label`
    font-size: 32px;
    font-weight: bold;
    font-family: "Roboto Condensed", Helvetica;
    color: ${({ theme }) => theme.text};
    padding: 40px 0px 20px 0px;
`;

// 

const HeaderDiv = styled.label`
  position: relative;
  display: flex;
  font-size: 20px;
  color: #bfbfbf;
  font-weight: normal;
  font-family: "Roboto Condensed", Helvetica;
`;

// Parragraph
const ParragraphDiv = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 30px;
`;


const Parragraph = styled.p`
  font-size: 18px;
  color: ${({ theme }) => theme.text};
  font-weight: normal;
  font-family: "Roboto Condensed", Helvetica;
  white-space: pre-line; 
  line-height: 1.25;
  max-width: 100%;
`;

const ContactTxt = styled.p`
  font-size: 16px;
  color: ${({ theme }) => theme.textSoft};
  font-weight: normal;
  font-family: "Roboto Condensed", Helvetica;
  white-space: pre-line; 
  line-height: 1.25;
  max-width: 100%;
  margin-top: -28px;
`;

const About = () => {
  const navigate = useNavigate();
  const { language, setLanguage } = useLanguage();

  const handleGoHome = () => {
    navigate("/");
  };

  // RESET SCROLL
  const scrollToTop = () => {
    window.scrollTo(0, 0);
  };


  useEffect(() => {
    scrollToTop();
  }, []);

  // TRANSLATIONS
  const translations = {
    en: {
      home: "Home",
      about: "About",
      aboutflashy: "About Flashy",
      p1: "Flashy is a highly interactive and engaging web application for multimedia that allows visitors to view content posted by other users. Everyone has the option to register as a user and create personalized profiles. Once registered, users can share their own videos on the platform.",
      p2: "The main page is the main attraction, acting as a meeting point for users, where they can discover the most popular and featured content. This website is geared towards user satisfaction and experience.",
      p3: "- Alan Nin",
      p4: "alanbusinessnin@gmail.com",
    },
    es: {
      home: "Inicio",
      about: "Acerca de",
      aboutflashy: "Acerca de Flashy",
      p1: "Flashy es una aplicación web altamente interactiva y atractiva para multimedia que permite a los visitantes ver contenido publicado por otros usuarios. Todos tienen la opción de registrarse como usuario y crear perfiles personalizados. Una vez registrados, los usuarios pueden compartir sus propios videos en la plataforma.",
      p2: "La página principal es la atracción principal, actuando como un punto de encuentro para los usuarios, donde pueden descubrir el contenido más popular y destacado. Este sitio web está orientado hacia la satisfacción y experiencia del usuario.",
      p3: "- Alan Nin",
      p4: "alanbusinessnin@gmail.com",
    },
  };

  return (
    <MainContainer>

      <Wrapper>

        <HeaderDiv>
          <Label onClick={handleGoHome}> {translations[language].home} </Label> &nbsp;&nbsp;•&nbsp;&nbsp; <SpanSoft> {translations[language].about} </SpanSoft>
        </HeaderDiv>

        <TitleLabel> {translations[language].aboutflashy} </TitleLabel>

        <ParragraphDiv>
          <Parragraph>
            {translations[language].p1}
          </Parragraph>

          <Parragraph>
            {translations[language].p2}
          </Parragraph>

          <Parragraph>
            {translations[language].p3}
          </Parragraph>
          <ContactTxt>
            {translations[language].p4}
          </ContactTxt>

        </ParragraphDiv>

      </Wrapper>

    </MainContainer >

  );
};

export default About;
