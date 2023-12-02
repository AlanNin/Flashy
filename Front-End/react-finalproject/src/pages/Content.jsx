import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Card from "../components/Card";
import { useLanguage } from '../utils/LanguageContext';
import axios from "axios";
import { useParams } from 'react-router-dom';

const MainContainer = styled.div`
  display: relative;
  width: 100%;
  min-height: 100vh;
  background-color: rgba(15, 12, 18);
  z-index: 1;
`;

const Header = styled.h1`
  font-size: 32px;
  color: rgba(224, 175, 208);
  padding: 100px 55px 20px 55px;
  font-weight: bold;
  font-family: "Roboto Condensed", Helvetica;
`;

const Container = styled.div`
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  z-index: 1;
  gap: 118px;
`;

const Wrapper = styled.div`
  padding: 32px 55px;
`;

const Content = () => {
  const { language } = useLanguage();
  const { "*": tags } = useParams(); 

  const translations = {
    en: {
      content: tags,
    },
    es: {
      content: tags === 'Music' ? 'Musica' : tags === 'Movies' ? 'Peliculas' : tags === 'News' ? 'Noticias' : tags === 'Sports' ? 'Deportes' : tags === 'Videogames' ? 'Videojuegos' : tags,
    },
  };

  const [videos, setVideos] = useState([]);
  
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const tagsArray = tags.split(',');

        const res = await axios.get(`/videos/byTag?tags=${tagsArray.join(',')}`);
        setVideos(res.data);
      } catch (error) {
        console.error("Error fetching videos:", error);
      }
    };
    fetchVideos();
  }, [tags]);

  return (
    <MainContainer>
      <Header>{translations[language].content}</Header>
      <Wrapper>
        <Container>
          {videos.map((video) => (
            <Card key={video._id} video={video} />
          ))}
        </Container>
      </Wrapper>
    </MainContainer>
  );
};

export default Content;
