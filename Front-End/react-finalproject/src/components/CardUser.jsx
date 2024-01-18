import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from 'react-router-dom';
import styled, { css, keyframes } from "styled-components";
import VideosLengthIcono from "../assets/VideosLengthIcono.png";
import BannerPlaceholder from '../assets/BannerPlaceholder.jpg';

const Container = styled.div`
  position: relative;
  display: flex;
  border-radius: 5px;
  background: transparent;
  padding: 0px;
  width: max-content;
  justify-content: center;
`;

const ImageContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 339px;
  height: 200px;
  border-radius: 3px;
  overflow: hidden;
  z-index: 1;
`;

const Image = styled.img`
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: #999;
  flex: 1;
  object-fit: cover; 
  filter: blur(1px) brightness(0.7);
`;

const ImagePfP = styled.img`
  position: absolute;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  bottom: 60px;
  z-index: 1;
`;

const ImageContainerDif = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background: linear-gradient(195deg, rgba(0, 0, 0, 0.00) 22%, #000 98%), linear-gradient(160deg, rgba(0, 0, 0, 0.00) 60%, #000 98%);
  z-index: 1;
`;

const InsideContainer = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  bottom: 30px;
  z-index: 1;
`;

const Title = styled.h1`
  font-size: 17px;
  font-family: "Roboto Condensed", Helvetica;
  font-weight: normal;
  max-width: 200px;
  color: ${({ theme }) => theme.text};
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 1);
`;


const CardUser = ({ user }) => {

  // FORMATS
  const formatNumbers = (Numbers) => {
    if (Numbers >= 1000000000) {
      return `${(Numbers / 1000000000).toFixed(1)}B`;
    } else if (Numbers >= 1000000) {
      return `${(Numbers / 1000000).toFixed(1)}M`;
    } else if (Numbers >= 1000) {
      return `${(Numbers / 1000).toFixed(1)}K`;
    } else {
      return Numbers?.toString();
    }
  };

  return (
    <div>
      <Container>

        <Link to={`/channel/@${user?.name}`} style={{ textDecoration: "none" }}>

          <ImageContainer>

            <Image
              src={user?.banner ? user?.banner : BannerPlaceholder}
            />

            <ImageContainerDif />

            <ImagePfP src={user?.img} />

            <InsideContainer>
              <Title> {user?.displayname} </Title>
            </InsideContainer>

          </ImageContainer>

        </Link>

      </Container >

    </div>
  );
};

export default CardUser;
