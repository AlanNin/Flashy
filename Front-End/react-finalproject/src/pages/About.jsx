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
          <Label onClick={handleGoHome}> Home </Label> &nbsp;&nbsp;•&nbsp;&nbsp; <SpanSoft> About </SpanSoft>
        </HeaderDiv>

        <TitleLabel> About Flashy </TitleLabel>

        <ParragraphDiv>
          <Parragraph>
            Flashy is a highly interactive and engaging web application for multimedia that allows visitors to view content posted by other users.
            Everyone has the option to register as a user and create personalized profiles. Once registered, users can share their own videos on the platform.
          </Parragraph>

          <Parragraph>
            The main page is the main attraction, acting as a meeting point for users, where they can discover the most popular and featured content. This website is geared towards user satisfaction and experience.
          </Parragraph>

          <Parragraph>
            - Alan Nin
          </Parragraph>
          <ContactTxt>
            alanbusinessnin@gmail.com
          </ContactTxt>

        </ParragraphDiv>

      </Wrapper>

    </MainContainer >

  );
};

export default About;
