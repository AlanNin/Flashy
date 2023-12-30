import React, { useState, useEffect, useRef, useContext } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import styled, { css, keyframes } from "styled-components";
import { useLanguage } from '../utils/LanguageContext';
import CardTrending from './CardTrending';
import axios from "axios";

const Container = styled.h1`
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;
`;

const Header = styled.h1`
font-size: 32px;
color: rgba(224, 175, 208);
padding: 32px 55px;
font-weight: 700px;
font-family: "Roboto Condensed", Helvetica;
width: max-content;
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

// POP UP MORE INFO

const PopupContainerBg = styled.div`
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background-color: ${({ closing }) => (closing ? 'transparent' : '#000000b9')}; 
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 4;
`;

const popUpAnimation = keyframes`
  from {
    transform: scale(0.8);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
`;

const popDownAnimation = keyframes`
  from {
    transform: scale(1);
    opacity: 1;
  }
  to {
    transform: scale(0.8);
    opacity: 0;
  }
`;

const PopupContainer = styled.div`
  position: relative;
  width: 48%;
  height: 95%;
  background: #1D1D1D;
  color: ${({ theme }) => theme.text};
  border-radius: 10px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  animation: ${popUpAnimation} 0.3s ease-in-out forwards;

    ${props => props.closing && css`
      animation: ${popDownAnimation} 0.5s ease-in-out forwards;
    `}

  `;
const PopupWrapper = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding-bottom: ${({ step }) => (step === 1 ? "150px" : "0px")};
    position: relative;
  `;

const PopupImageContainer = styled.div`
    position: relative;
    width: 100%;
    height: 1200px;
    border-radius: 10px 10px 0px 0px;
    overflow: hidden;
    display: flex;
`;

const PopupImage = styled.img`
    position: absolute;
    width: 100%;
    height: 100%;
    object-fit: cover; 
`;

const PopupImageGradientOverlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 25%;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
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
  margin-right: ${({ isMoreInfo }) => (isMoreInfo ? '57px' : '50px')};
`;

const TrendSlider = ({ type = "trend" }) => {

  const [isMoreInfo, setIsMoreInfo] = useState(false);
  const [MoreInfoInputs, setMoreInfoInputs] = useState({});
  const [isMoreInfoClosing, setIsMoreInfoClosing] = useState(false);
  const moreInfoRef = useRef(null);

  // STOP SCROLL ON POPUP MORE INFO
  useEffect(() => {
    if (isMoreInfo) {
      document.body.style.overflow = 'hidden';
    }
    else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isMoreInfo]);

  // CLOSE POPUP MORE INFO ON CLICK OUTSIDE
  useEffect(() => {
    const handleClickOutsidePopupMoreInfo = (event) => {
      if (moreInfoRef.current && !moreInfoRef.current.contains(event.target)) {
        setIsMoreInfoClosing(true);
        setTimeout(() => {
          setIsMoreInfo(false);
          setIsMoreInfoClosing(false);
        }, 500);
      }
    };
    document.addEventListener("mousedown", handleClickOutsidePopupMoreInfo);

    return () => {
      document.removeEventListener("mousedown", handleClickOutsidePopupMoreInfo);
    };
  }, []);

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
    <div>

      {isMoreInfo && (
        <PopupContainerBg closing={isMoreInfoClosing}>
          <PopupContainer closing={isMoreInfoClosing} ref={moreInfoRef}>
            <PopupImageContainer>
              <PopupImage src={MoreInfoInputs.imgUrlLandscape} />
              <PopupImageGradientOverlay />
            </PopupImageContainer>
            <PopupWrapper>
            </PopupWrapper>
          </PopupContainer>
        </PopupContainerBg>
      )}

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
          isMoreInfo={isMoreInfo}
        >
          {videos.slice(0, 10).map((video, index) => (
            <CardTrending key={video._id} video={video} index={index} setIsMoreInfo={setIsMoreInfo} setMoreInfoInputs={setMoreInfoInputs} />
          ))}

        </StyledCarousel>

      </Container>
    </div>
  );
}

export default TrendSlider;
