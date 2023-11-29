import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import Miniatura from "../assets/Miniatura2.jpg";
import MiniaturaTheBoys2 from "../assets/MiniaturaTheBoys2.jpg";
import { useLanguage } from '../utils/LanguageContext';

const Container = styled.div`
  width: ${(props) => props.type !== "sm" && "360px"};
  margin-bottom: ${(props) => (props.type === "sm" ? "10px" : "45px")};
  cursor: pointer;
  display: ${(props) => props.type === "sm" && "flex"};
  gap: 10px;
  margin-bottom: 40px;
`;

const Image = styled.img`
  position: relative;
  width: 100%;
  height: ${(props) => (props.type === "sm" ? "120px" : "202px")};
  background-color: #999;
  flex: 1;
`;

const Details = styled.div`
  display: flex;
  margin-top: ${(props) => props.type !== "sm" && "16px"};
  gap: 12px;
  flex: 1;
`;

const ChannelImage = styled.img`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: #999;
  display: ${(props) => props.type === "sm" && "none"};
`;

const Texts = styled.div``;

const Title = styled.h1`
  font-size: 16px;
  font-family: "Roboto Condensed", Helvetica;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
`;

const ChannelName = styled.h2`
  font-size: 14px;
  color: ${({ theme }) => theme.textSoft};
  margin: 9px 0px;
`;

const InfoWrapper = styled.div`
  align-items: center;
  width: 213px;
  height: 40px;
  position: absolute;
  display: flex;
  gap: 10px;
  margin-top: 85px;
  z-index: 1;
`;

const Background = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background: rgba(92, 91, 91, 0.1);
  backdrop-filter: blur(4px); 
  -webkit-backdrop-filter: blur(7px );
  filter: brightness(0.6); 
`;


const InfoViews = styled.div`
  margin-left: 18px;
  height: 20px;
  font-size: 15px;
  color: white;
  background: rgb(196, 90, 172, 0.3);
  font-family: "Roboto Condensed", Helvetica;
  font-weight: 400;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center; 
  padding: 5px 7px;
  z-index: 2;
`;


const InfoTime = styled.div`
  font-family: "Roboto Condensed", Helvetica;
  font-weight: 400;
  font-size: 14px;
  padding: 5px;
  color: #ededed;
  z-index: 2;
`;

const CardRecommendation = ({ type }) => {

  const { language, setLanguage } = useLanguage();

  const translations = {
    en: {
      views: "views",
      date: "1 day ago",
    },
    es: {
      views: "visitas",
      date: "Hace 1 día",
    },
  };

  return (
    <Link to="/video/test" style={{ textDecoration: "none" }}>
      <Container type={type}>
        <Image
          type={type}
          src={MiniaturaTheBoys2}
        />
        <InfoWrapper>
          <Background />
          <InfoViews>660,908 {translations[language].views}</InfoViews>
          <InfoTime>• {translations[language].date}</InfoTime>
        </InfoWrapper>
        <Details type={type}>
          <Texts>
            <Title>The best VS Code Extensions 2023</Title>
            <ChannelName>Coding with Adam</ChannelName>
          </Texts>
        </Details>
      </Container>
    </Link>
  );
};

export default CardRecommendation;
