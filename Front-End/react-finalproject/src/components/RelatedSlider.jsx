import React, { useState, useEffect, useRef, useContext } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import styled, { css } from 'styled-components';
import { useLanguage } from '../utils/LanguageContext';
import CardRelated from './CardRelated';
import axios from "axios";


const RelatedSlider = ({ videoId, UserUploader }) => {

  const { language, setLanguage } = useLanguage();

  const translations = {
    en: {
      related: "RELATED",
      norelated: "No related videos found.",
    },
    es: {
      related: "RELACIONADOS",
      norelated: "Sin videos relacionados.",
    },
  };

  const [videos, setVideos] = useState([])
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await axios.get(`http://localhost:8800/api/videos/related/${videoId}`);
        setVideos(res.data);
      } catch (error) {
        console.error("Error fetching videos:", error);
      }
    };
    fetchVideos();
  }, [videoId]);


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
  width: max-content;
  right: 0px;
  border: none;
  background: transparent;
  cursor: pointer;
  color: white;
  border-radius: 10px;
  line-height: 40%;
  transition: background-color 0.3s;
  right: 0px;

  &:hover {
    background: rgba(158, 16, 90, 0.5);
  }
`;

  const StyledRightArrow = styled(StyledArrow)`
  top: 0%;
  padding: 0px 5px 0px 7px;
`;

  const StyledLeftArrow = styled(StyledArrow)`
  top: 53%;
  padding: 0px 7px 0px 5px;
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
    margin-left: -10px;
  `;


  return (

    <div className="App" style={{ width: '1000px' }}>
      <Header>{translations[language].related}</Header>

      {videos.length > 0 ? (
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
          {videos.map((video) => (
            <CardRelated key={video._id} video={video} />
          ))}
        </StyledCarousel>
      ) : (
        <p style={{ color: 'rgb(158, 93, 176)', fontWeight: 'bold', fontFamily: '"Roboto Condensed", Helvetica', fontSize: '18px' }}>{translations[language].norelated}</p>
      )}

    </div >

  );
}

export default RelatedSlider;
