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

const Contact = () => {
  const { language, setLanguage } = useLanguage();

  // TRANSLATIONS
  const translations = {
    en: {
      home: "Home",
      contact: "Contact",
      p2: "Flashy Representative Contact",
      p3: "- Alan Nin",
      p4: "alanbusinessnin@gmail.com",
    },
    es: {
      home: "Inicio",
      contact: "Contacto",
      p2: "Contacto de Representante de Flashy",
      p3: "- Alan Nin",
      p4: "alanbusinessnin@gmail.com",
    },
  };
  const navigate = useNavigate();

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

  return (
    <MainContainer>

      <Wrapper>

        <HeaderDiv>
          <Label onClick={handleGoHome}> {translations[language].home} </Label> &nbsp;&nbsp;•&nbsp;&nbsp; <SpanSoft> {translations[language].contact} </SpanSoft>
        </HeaderDiv>

        <TitleLabel> {translations[language].p2} </TitleLabel>

        <ParragraphDiv>
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

export default Contact;
