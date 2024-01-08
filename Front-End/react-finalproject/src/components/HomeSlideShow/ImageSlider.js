import React, { useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

const slideStyles = {
    width: '100%',
    height: '100%',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    position: 'relative',
};

const ArrowButtonRight = styled.div`
    position: absolute;
    top: ${(props) => props.top || '20px'};
    right: ${(props) => props.right || '0'};
    bottom: 20px;
    z-index: 1;
    cursor: pointer;
    width: 29.9px;
    height: 45.8px;
    border-radius: 30px;
    transition: background-color 0.5s;

    &:hover {
        background: rgba(124, 83, 115, 0.5);
    }

    @media (max-width: 768px) {
        top: 455px;
        right: 55px;
    }
`;

const ArrowButtonLeft = styled.div`
    position: absolute;
    top: ${(props) => props.top || '20px'};
    right: ${(props) => props.right || '0'};
    bottom: 20px;
    z-index: 1;
    cursor: pointer;
    width: 29.9px;
    height: 45.8px;
    border-radius: 30px;
    transition: background-color 0.5s;

    &:hover {
        background: rgba(124, 83, 115, 0.5);
    }

    @media (max-width: 768px) {
        top: 455px;
        right: 125px;
    }
`;

const ArrowBackground = styled.div`
    position: absolute;
    top: 0;
    right: 0;
    border-radius: 20px;
    background-color: rgba(42, 41, 47, 0);
    width: 29.9px;
    height: 45.8px;
`;

const ArrowStyles = styled.div`
    position: absolute;
    bottom: 2px;
    right: ${(props) => props.right || '0'};
    font-size: 35px;
    color: #fff;
    user-select: none;
`;

const sliderStyles = {
    position: 'relative',
    height: '100%',
};

const slidesContainerStyles = {
    display: 'flex',
    height: '100%',
    transition: 'transform ease-out 0.3s',
};

const slidesContainerOverflowStyles = {
    overflow: 'hidden',
    height: '100%',
};

const ImageSlider = ({ slides, parentWidth }) => {
    const timerRef = useRef(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    const goToPrevious = () => {
        const isFirstSlide = currentIndex === 0;
        const newIndex = isFirstSlide ? slides.length - 1 : currentIndex - 1;
        setCurrentIndex(newIndex);
    };

    const goToNext = useCallback(() => {
        const isLastSlide = currentIndex === slides.length - 1;
        const newIndex = isLastSlide ? 0 : currentIndex + 1;
        setCurrentIndex(newIndex);
    }, [currentIndex, slides]);

    const handleVisibilityChange = () => {
        if (document.visibilityState === 'visible') {
            // La página está visible, reinicia el temporizador
            resetTimer();
        } else {
            // La página no está visible, detén el temporizador
            clearTimeout(timerRef.current);
        }
    };

    const resetTimer = () => {
        clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
            goToNext();
        }, 8000);
    };

    useEffect(() => {
        document.addEventListener('visibilitychange', handleVisibilityChange);

        // Iniciar el temporizador al montar el componente
        resetTimer();

        // Limpiar el evento al desmontar el componente
        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            clearTimeout(timerRef.current);
        };
    }, [goToNext]);

    useEffect(() => {
        // Si el temporizador se limpió debido a la inactividad, reiniciar cuando la página se vuelve visible
        if (document.visibilityState === 'visible') {
            resetTimer();
        }
    }, [document.visibilityState]);

    const getSlideStylesWithBackground = (slideIndex) => ({
        ...slideStyles,
        backgroundImage: `url(${slides[slideIndex].url})`,
        width: `${parentWidth}px`,
        transition: 'opacity 0.5s ease-in-out',
        opacity: slideIndex === currentIndex ? 1 : 0,
        position: 'relative', // Agregar posición relativa
    });

    const getSlidesContainerStylesWithWidth = () => ({
        ...slidesContainerStyles,
        width: parentWidth * slides.length,
        transform: `translateX(${-(currentIndex * parentWidth)}px)`,
    });

    const Overlay = styled.div`
    position: absolute;
    top: 0;rgba(0, 0, 0, 1)
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0.8;
    background: linear-gradient(281deg, rgba(0, 0, 0, 0.00) 52.31%, rgba(0, 0, 0, 0.20) 54.19%, rgba(0, 0, 0, 0.35) 56.12%, rgba(0, 0, 0, 0.51) 57.81%, rgba(0, 0, 0, 0.76) 59.49%, #000 61.71%), linear-gradient(255deg, rgba(0, 0, 0, 0.00) 52.2%, rgba(0, 0, 0, 0.31) 54.21%, rgba(0, 0, 0, 0.41) 56.11%, rgba(0, 0, 0, 0.46) 57.69%, rgba(0, 0, 0, 0.63) 59.16%, rgba(0, 0, 0, 0.84) 60.95%, #000 62.64%), linear-gradient(270deg, rgba(0, 0, 0, 0.00) 42.21%, rgba(0, 0, 0, 0.08) 42.93%, rgba(0, 0, 0, 0.13) 43.32%, rgba(0, 0, 0, 0.19) 43.86%, rgba(0, 0, 0, 0.26) 44.44%, rgba(0, 0, 0, 0.33) 45.12%, rgba(0, 0, 0, 0.39) 45.65%, rgba(0, 0, 0, 0.45) 46.14%, rgba(0, 0, 0, 0.50) 46.58%, rgba(0, 0, 0, 0.52) 46.94%, rgba(0, 0, 0, 0.53) 47.28%, rgba(0, 0, 0, 0.56) 47.89%, rgba(0, 0, 0, 0.58) 48.52%, rgba(0, 0, 0, 0.60) 49.03%, rgba(0, 0, 0, 0.61) 49.52%, rgba(0, 0, 0, 0.64) 50.17%, rgba(0, 0, 0, 0.67) 50.87%, rgba(0, 0, 0, 0.70) 51.38%, rgba(0, 0, 0, 0.72) 51.95%, rgba(0, 0, 0, 0.75) 52.46%, rgba(0, 0, 0, 0.77) 52.98%, rgba(0, 0, 0, 0.79) 53.64%, rgba(0, 0, 0, 0.81) 54.12%, rgba(0, 0, 0, 0.83) 54.56%, rgba(0, 0, 0, 0.84) 55.01%, rgba(0, 0, 0, 0.87) 55.65%, rgba(0, 0, 0, 0.88) 56.11%, rgba(0, 0, 0, 0.90) 56.51%, rgba(0, 0, 0, 0.92) 57.13%, rgba(0, 0, 0, 0.94) 57.53%, rgba(0, 0, 0, 0.96) 57.99%, rgba(0, 0, 0, 0.98) 58.44%, #000 59.07%);
    z-index: 1;

    @media (max-width: 768px) {
        background: linear-gradient(281deg, rgba(0, 0, 0, 0.00) 52.31%, rgba(0, 0, 0, 0.20) 54.19%, rgba(0, 0, 0, 0.35) 56.12%, rgba(0, 0, 0, 0.51) 57.81%, rgba(0, 0, 0, 0.76) 59.49%, #000 61.71%), linear-gradient(255deg, rgba(0, 0, 0, 0.00) 52.2%, rgba(0, 0, 0, 0.31) 54.21%, rgba(0, 0, 0, 0.41) 56.11%, rgba(0, 0, 0, 0.46) 57.69%, rgba(0, 0, 0, 0.63) 59.16%, rgba(0, 0, 0, 0.84) 60.95%, #000 62.64%), linear-gradient(270deg, rgba(0, 0, 0, 0.00) 42.21%, rgba(0, 0, 0, 0.08) 42.93%, rgba(0, 0, 0, 0.13) 43.32%, rgba(0, 0, 0, 0.19) 43.86%, rgba(0, 0, 0, 0.26) 44.44%, rgba(0, 0, 0, 0.33) 45.12%, rgba(0, 0, 0, 0.39) 45.65%, rgba(0, 0, 0, 0.45) 46.14%, rgba(0, 0, 0, 0.50) 46.58%, rgba(0, 0, 0, 0.52) 46.94%, rgba(0, 0, 0, 0.53) 47.28%, rgba(0, 0, 0, 0.56) 47.89%, rgba(0, 0, 0, 0.58) 48.52%, rgba(0, 0, 0, 0.60) 49.03%, rgba(0, 0, 0, 0.61) 49.52%, rgba(0, 0, 0, 0.64) 50.17%, rgba(0, 0, 0, 0.67) 50.87%, rgba(0, 0, 0, 0.70) 51.38%, rgba(0, 0, 0, 0.72) 51.95%, rgba(0, 0, 0, 0.75) 52.46%, rgba(0, 0, 0, 0.77) 52.98%, rgba(0, 0, 0, 0.79) 53.64%, rgba(0, 0, 0, 0.81) 54.12%, rgba(0, 0, 0, 0.83) 54.56%, rgba(0, 0, 0, 0.84) 55.01%, rgba(0, 0, 0, 0.87) 55.65%, rgba(0, 0, 0, 0.88) 56.11%, rgba(0, 0, 0, 0.90) 56.51%, rgba(0, 0, 0, 0.92) 57.13%, rgba(0, 0, 0, 0.94) 57.53%, rgba(0, 0, 0, 0.96) 57.99%, rgba(0, 0, 0, 0.98) 58.44%, #000 59.07%);

    }
    `;

    return (
        <div style={sliderStyles}>
            {/* FLECHAS SLIDESHOW */}
            <ArrowButtonRight onClick={goToNext} top="375px" right="55px">
                <ArrowBackground>
                    <ArrowStyles right="6px">❱</ArrowStyles>
                </ArrowBackground>
            </ArrowButtonRight>

            <ArrowButtonLeft onClick={goToPrevious} top="450px" right="55px">
                <ArrowBackground>
                    <ArrowStyles right="8px">❰</ArrowStyles>
                </ArrowBackground>
            </ArrowButtonLeft>

            {/* SLIDESHOW IMG */}
            <div style={slidesContainerOverflowStyles}>
                <div style={getSlidesContainerStylesWithWidth()}>
                    {slides.map((slide, slideIndex) => (
                        <div
                            key={slideIndex}
                            style={getSlideStylesWithBackground(slideIndex)}
                            onMouseDown={resetTimer}
                            onTouchStart={resetTimer}
                        >

                            {/* Nuevo div en cada diapositiva */}
                            {slide.content && slide.content}

                            <Overlay isVisible={slideIndex === currentIndex} />

                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ImageSlider;
