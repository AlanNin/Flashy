import React, { useState, useEffect, useRef, useContext } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import styled, { css } from 'styled-components';
import { useLanguage } from '../utils/LanguageContext';
import CardTrending from './CardTrending';
import axios from "axios";

const Container = styled.h1`
  position: relative;
  z-index:2;
  width: 100%;
  height: 100%;
`;


const Header = styled.h1`
font-size: 32px;
color: rgba(224, 175, 208);
padding: 32px 55px;
font-weight: 700px;
font-family: "Roboto Condensed", Helvetica;
`;

const StyledArrow = styled.button`
position: absolute;
height: 47%;
font-size: 30px;
width: 33px;
right:0px;
border: none;
background: transparent;
cursor: pointer;
color: white;
border-radius: 10px;
line-height: 40%;
padding: 0 7px;
transition: background-color 0.3s;

&:hover {
  background: rgba(124, 83, 115, 0.5);
}
`;

const StyledRightArrow = styled(StyledArrow)`
top: 0%;
`;

const StyledLeftArrow = styled(StyledArrow)`
top: 53%;
`;

const responsive = {
  superLargeDesktop: {
    breakpoint: { max: 4000, min: 3000 },
    items: 4,
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 6,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
  },
};


const CustomRightArrow = ({ onClick, ...rest }) => (
  <StyledRightArrow
    onClick={() => onClick()}
    {...rest}
  >
    {'❱'}
  </StyledRightArrow>
);

const CustomLeftArrow = ({ onClick, ...rest }) => (
  <StyledLeftArrow
    onClick={() => onClick()}
    {...rest}
  >
    {'❰'}
  </StyledLeftArrow>
);


const StyledCarousel = styled(Carousel)`
margin: 0px 50px;
`;


const TrendSlider = ({ type = "trend" }) => {

  const { language, setLanguage } = useLanguage();

  const translations = {
    en: {
      nowtrending: "Now Trending",
    },
    es: {
      nowtrending: "Ahora En Tendecia",
    },
  };

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

  return (

    <Container>
      <Header>{translations[language].nowtrending}</Header>

      <StyledCarousel
        responsive={responsive}
        autoPlay={false}
        swipeable={false}
        draggable={false}
        itemClass={TrendSlider.carouselItem}
        partialVisible={false}
        customLeftArrow={<CustomLeftArrow />}
        customRightArrow={<CustomRightArrow />}
      >
        {videos.slice(0, 10).map((video, index) => (
          <CardTrending key={video._id} video={video} index={index} />
        ))}

      </StyledCarousel>

    </Container>

  );
}

export default TrendSlider;
