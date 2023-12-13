import React, { useState, useEffect, useRef, useContext } from "react";
import axios from 'axios';
import styled from "styled-components";
import ImageSlider from "./ImageSlider"
import VideoSlide from "./VideoSlide";
import { useLanguage } from '../../utils/LanguageContext';

const SlideShowContainer = styled.div`
  background-size: cover;
  background-position: center center;
  position: flex;
  top: -56px;
  height: 540px;
  width: 100%;
  z-index: 1;


`;

const HomeSlideShow = ({ type = "mostliked" }) => {

  const { language, setLanguage } = useLanguage();

  const [videos, setVideos] = useState([])
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await axios.get(`/videos/${type}`);
        setVideos(res.data);
      } catch (error) {
        console.error("Error fetching videos:", error);
      }
    };
    fetchVideos()
  }, [type]);

  const translations = {
    en: {
      spotlight: "Spotlight",
      watchnow: "Watch Now",
      watchlater: "Watch Later",
    },
    es: {
      spotlight: "Destacados",
      watchnow: "Ver Ahora",
      watchlater: "Ver Más Tarde",
    },
  };

  const slides = videos.slice(0, 10).map((video, index) => ({
    url: video.imgUrlLandscape,
    title: video.title,
    content: <VideoSlide video={video} translations={translations} language={language} index={index} />,
  }));


  const [parentWidth, setParentWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setParentWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <SlideShowContainer>
      <ImageSlider slides={slides} parentWidth={parentWidth} />
    </SlideShowContainer>
  );
};

export default HomeSlideShow;
