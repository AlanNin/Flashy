import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Link, useNavigate } from 'react-router-dom';
import styled, { css, keyframes } from "styled-components";
import VideosLengthIcono from "../assets/VideosLengthIcono.png";
import PublicIcon from "../assets/PublicIcon.png";
import PrivateIcon from "../assets/PrivateIcon.png";
import UnlistedIcon from "../assets/UnlistedIcon.png";
import { useLanguage } from '../utils/LanguageContext';
import moment from "moment";
import "moment/locale/es";
import { toast } from 'react-toastify';


const Container = styled.div`
  position: relative;
  display: flex;
  margin-bottom: 10px;
  border-radius: 5px;
  background: transparent;
  padding: 0px;
  width: max-content;
  justify-content: center;
  margin-top: 30px;
`;

const PlaylistEffectContainer1 = styled.img`
  position: absolute;
  width: 230px;
  height: 130px;
  border-radius: 3px;
  overflow: hidden;
  z-index: 1;
  top: -20px;
  left: 19px;
  filter: blur(1px) brightness(0.3);
`;

const PlaylistEffectContainer2 = styled.img`
  position: absolute;
  width: 255px;
  height: 155px;
  border-radius: 3px;
  overflow: hidden;
  z-index: 2;
  top: -10px;
  left: 7px;
  filter: blur(1px) brightness(0.7);
`;


const ImageContainer = styled.div`
  position: relative;
  width: 270px;
  height: 170px;
  border-radius: 3px;
  overflow: hidden;
  z-index: 3;
`;

const Image = styled.img`
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: #999;
  flex: 1;
  object-fit: cover; 
`;


const InfoVideosLength = styled.div`
  position: absolute;
  margin: 10px;
  height: 20px;
  width: max-content;
  background: rgb(36, 22, 33, 0.9);
  border-radius: 10px;
  display: flex;
  align-items: center;
  padding: 3px 10px;
  top: 0px;
  left: 0px;
`;

const ImgVideosLength = styled.img`
  height: 20px;
  width: 18px;
  margin-right: 8px;
`;


const TxtVideosLength = styled.h1`
  font-size: 16px;
  color: white;
  font-family: "Roboto Condensed", Helvetica;
  font-weight: 400;
  margin-top: 1px;  
`;

const InfoPrivacy = styled.div`
  position: absolute;
  margin: 10px;
  height: 20px;
  width: max-content;
  background-color: rgba(14, 8, 20, 0.8);
  border-radius: 10px;
  display: flex;
  align-items: center;
  padding: 5px 8px;
  z-index: 2;
  right: 0px;
`;

const ImgPrivacy = styled.img`
  height: 15px;
  width: 15px;
  z-index: 2;
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
  flex-direction: column;
  justify-content: flex-end;
  gap: 10px;
  width: 100%;
  padding: 5px 15px 15px 15px;
  bottom: 0px;
  z-index: 2;
`;

const Title = styled.h1`
  font-size: 16px;
  font-family: "Roboto Condensed", Helvetica;
  font-weight: normal;
  max-width: 95%;
  color: ${({ theme }) => theme.text};
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
`;


const CardChannelPlaylist = ({ playlist, isCurrentUserUploader }) => {

  return (
    <div>
      <Container>

        <Link to={`/playlist/${playlist?._id}`} style={{ textDecoration: "none" }}>

          <PlaylistEffectContainer1 src={playlist?.image} />
          <PlaylistEffectContainer2 src={playlist?.image} />

          <ImageContainer>

            <Image
              src={playlist?.image}
            />
            <InfoVideosLength>
              <ImgVideosLength src={VideosLengthIcono} />
              <TxtVideosLength> {playlist?.videosLength} videos </TxtVideosLength>
            </InfoVideosLength>

            {isCurrentUserUploader && (
              <InfoPrivacy>
                <ImgPrivacy src={playlist?.privacy === 'public' ? PublicIcon : playlist?.privacy === 'private' ? PrivateIcon : UnlistedIcon} />
              </InfoPrivacy>
            )}

            <InsideContainer>
              <Title> {playlist?.name} </Title>
            </InsideContainer>

            <ImageContainerDif />
          </ImageContainer>

        </Link>

      </Container >

    </div>
  );
};

export default CardChannelPlaylist;
