import React, { useState, useEffect, useRef, useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import styled from "styled-components";
import MiniaturaJJK from "../assets/MiniaturaJJK.jpg";
import { useLanguage } from '../utils/LanguageContext';
import moment from "moment";
import "moment/locale/es";

const Container = styled.div`
  width: ${(props) => props.type !== "sm" && "360px"};
  margin-bottom: ${(props) => (props.type === "sm" ? "10px" : "0px")};
  display: ${(props) => props.type === "sm" && "flex"};
`;

const Image = styled.img`
  width: 100%;
  height: ${(props) => (props.type === "sm" ? "120px" : "202px")};
  background-color: #999;
  flex: 1;
  border-radius: 15px;
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
  display: flex;
  gap: 10px;
`;

const InfoViews = styled.div`
  font-size: 15px;
  color: white;
  background: rgb(196, 90, 172, 0.4);
  font-family: "Roboto Condensed", Helvetica;
  font-weight: 400;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center; 
  padding: 5px 7px;
`;


const InfoTime = styled.div`
  font-size: 14px;
  padding: 5px;
  color: ${({ theme }) => theme.textSoft};
`;

const Card = ({ type, video }) => {

  const { language, setLanguage } = useLanguage();

  const translations = {
    en: {
      views: "views",
    },
    es: {
      views: "visitas",
    },
  };

  if (language === "es") {
    moment.locale("es");
  } else {
    moment.locale("en");
  }

  const formatViews = (views) => {
    if (views >= 1000000000) {
      return `${(views / 1000000000).toFixed(1)}B`;
    } else if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`;
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`;
    } else {
      return views.toString();
    }
  };


  const timeago = timestamp => moment(timestamp).fromNow();

  const [channel, setChannel] = useState({})
  useEffect(() => {
    const fetchChannel = async () => {
      try {
        const res = await axios.get(`/users/find/${video.userId}`);
        setChannel(res.data);
      } catch (error) {
        console.error("Error fetching videos:", error);
      }
    };
    fetchChannel()
  }, [video.userId]);

  return (
    <Container type={type}>
      <Link to="/video/test" style={{ textDecoration: "none" }}>
        <Image
          type={type}
          src={video.imgUrl}
        />
      </Link>
      <Details type={type}>
        <Link to="/channel" style={{ textDecoration: "none" }}>
          <ChannelImage
            type={type}
            src={channel.img}
          />
        </Link>
        <Texts>
          <Link to="/video/test" style={{ textDecoration: "none" }}>
            <Title>{video.title}</Title>
          </Link>
          <Link to="/channel" style={{ textDecoration: "none" }}>
            <ChannelName>{channel.name}</ChannelName>
          </Link>
          <InfoWrapper>
            <InfoViews> {formatViews(video.views)} {translations[language].views}</InfoViews>
            <InfoTime>• {timeago(video.createdAt)}</InfoTime>
          </InfoWrapper>
        </Texts>
      </Details>
    </Container >
  );
};

export default Card;
