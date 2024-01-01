import React, { useState, useEffect, useRef, useContext } from "react";
import styled from "styled-components";
import { useLanguage } from '../utils/LanguageContext';
import axios from "axios";

// MAIN
const MainContainer = styled.div`
  position: relative;
  width: 100%;
  top: 0;
  margin: auto;
  min-height: 100vh;
  background-color: rgba(15, 12, 18);
  max-width: 1920px;
`;

// PLAYLISTS
const PlaylistsContainer = styled.div`
  position: fixed;
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 260px;
  background: #1D1D1D;
`;

const PlaylistsWrapper = styled.div`
  padding: 15px 20px;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;
const PlaylistsHeader = styled.div`
  font-size: 24px;
  font-weight: bold;
  font-family: "Roboto Condensed", Helvetica;
  color: ${({ theme }) => theme.text};
  text-align: center;
  margin-bottom: 20px;
`;

const PlaylistsItem = styled.div`
  font-size: 18px;
  font-weight: normal;
  font-family: "Roboto Condensed", Helvetica;
  color: ${({ theme }) => theme.text};
  padding: 5px 10px;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  white-space: normal;
  word-wrap: break-word;
  overflow-wrap: break-word;
  line-height: 1.5;
  cursor: pointer;
  &:hover {
    background: #7958a6;
  }
  border-radius: 10px;
`;

// PLAYLIST INFO
const PlaylistInfoContainer = styled.div`
  position: fixed;
  display: flex;
  flex-direction: column;
  margin-left: 260px;
  height: 100%;
  width: 375px;
  background: linear-gradient(to bottom, rgba(118, 75, 163, 0.6) 1%, rgba(219, 57, 127, 0));
`;

// PLAYLIST VIDEOS
const VideosContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: calc (100% - 635px);
  height: 100%;
  margin-top: 56px;
  margin-left: 635px;
  background: transparent;
`;

const Library = () => {
  const { language, setLanguage } = useLanguage();

  const translations = {
    en: {
      explore: "Library",
    },
    es: {
      explore: "Librería",
    },
  };


  return (
    <MainContainer>

      <PlaylistsContainer>

        <PlaylistsWrapper>

          <PlaylistsHeader> Your Playlists </PlaylistsHeader>

          <PlaylistsItem>
            Test Playlist
          </PlaylistsItem>
          <PlaylistsItem>
            Test Playlist Macaco
          </PlaylistsItem>

        </PlaylistsWrapper>

      </PlaylistsContainer>

      <PlaylistInfoContainer>

      </PlaylistInfoContainer>

      <VideosContainer>

      </VideosContainer>

    </MainContainer>

  );
};

export default Library;
