import React, { useState, useEffect } from 'react';
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import styled, { css } from 'styled-components';
import { useLanguage } from '../utils/LanguageContext';
import CardRelated from './CardRelated';



const RelatedSlider = () => {

  const { language, setLanguage } = useLanguage();

  const translations = {
    en: {
      related: "RELATED",
    },
    es: {
      related: "RELACIONADOS",
    },
  };



  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 4,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 4,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 1,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };

  const Header = styled.h1`
  font-size: 24px;
  color: #c4c4c4;
  padding: 32px 0px;
  font-weight: bold;
  font-family: "Roboto", Helvetica;
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
    background: rgba(158, 16, 90, 0.5);
  }
`;

  const StyledRightArrow = styled(StyledArrow)`
  top: 0%;
`;

  const StyledLeftArrow = styled(StyledArrow)`
  top: 53%;
`;


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
    margin-left: -7px;
  `;


  return (

    <div className="App" style={{ width: '1000px' }}>
      <Header>{translations[language].related}</Header>

      <StyledCarousel
        responsive={responsive}
        autoPlay={false}
        swipeable={false}
        draggable={false}
        itemClass={RelatedSlider.carouselItem}
        partialVisible={false}
        customLeftArrow={<CustomLeftArrow />}
        customRightArrow={<CustomRightArrow />}
      >

        <CardRelated />
        <CardRelated />
        <CardRelated />
        <CardRelated />
        <CardRelated />
        <CardRelated />
        <CardRelated />
        <CardRelated />
        <CardRelated />
        <CardRelated />

      </StyledCarousel>

    </div >

  );
}

export default RelatedSlider;
