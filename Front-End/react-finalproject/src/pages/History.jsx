import React, { useState, useEffect, useRef, useContext } from "react";
import styled, { keyframes } from "styled-components";
import CardHistory from "../components/CardHistory";
import BuscarIcono from "../assets/BuscarIcono.png";
import ClearHistory from "../assets/BorrarComentarioIcono.png";
import EmptyWatchHistoryIcon from "../assets/NotSubbedIcono.png";
import InicioSesionIcono2 from "../assets/InicioSesionIcono2.png";
import PauseIcon from "../assets/PauseIcon.png";
import ResumeIcon from "../assets/ResumeIcon.png";
import Footer from "../components/Footer";
import { useLanguage } from '../utils/LanguageContext';
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { userToggleWatchHistoryPaused } from "../redux/userSlice";
import axios from "axios";

const MainContainer = styled.div`
    position: relative;    
    display: flex;
    flex-direction: column;
    width: 100%;
    min-height: 100vh;
    background-color: rgba(15, 12, 18);
    max-width: 1920px;
    margin: auto;
`;

const Wrapper = styled.div`
    position: relative;  
    margin: 32px 250px;
    display: flex;
    max-width: 1372px;
`;

const EmptyHistoryMessageContainer = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    width: 930px;
    margin: auto;
    margin-top: 150px;
`;

const EmptyHistoryImg = styled.img`
    height: 96px;
    width: 96px;
    padding: 20 px;
`;

const EmptyHistoryMessage1 = styled.span`
    margin-top: 10px;  
    color: rgba(224, 175, 208, 0.8);
    font-weight: bold;
    font-family: "Roboto Condensed", Helvetica;
    font-size: 30px;
`;

const EmptyHistoryMessage2 = styled.span`
    margin-top: 10px;    
    color: ${({ theme }) => theme.text};
    font-weight: bold;
    font-family: "Roboto Condensed", Helvetica;
    font-size: 30px;
`;

const Header = styled.h1`
    display:flex;
    font-size: 40px;
    color: rgba(224, 175, 208);
    padding :100px 55px 20px 250px;
    font-weight: bold;
    font-family: "Roboto Condensed", Helvetica;
`;


const CardsContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 20px;
    width: 64%;
`;

const SearchContainer = styled.div`
    display: flex;
    flex-direction: column;
    margin-left: auto;
    right: 0px;
    gap: 20px;
`;


const Search = styled.div`
    display: flex;
    align-items: center;
    padding: 5px;
    width: 350px;
    margin-left: 22px;
    height:25px;
    border-bottom: 1px solid rgba(255, 255, 255);
`;

const Input = styled.input`
    font-family: "Roboto Condensed", Helvetica;
    margin-left: 15px;
    width: 92%;
    border: none;
    background-color: transparent;
    font-size: 18px;
    outline: none;
    margin-bottom: 10px;
    color: ${({ theme }) => theme.text};
`;

const ImgBuscar = styled.img`
    height: 30px;
    width: 30px;
    margin-left: 5px;
    margin-bottom: 10px;
    cursor: pointer;
`;

// CLEAR WATCH HISTORY

const ItemClearHistory = styled.div`
    display: flex;
    align-items: center;
    width: max-content;
    margin-left: 22px;
    gap: 22.5px;
    cursor: pointer;
    border-radius: 30px;
    padding: 10px 15px;
    transition: background-color 0.5s;

    &:hover {
        background-color: ${({ theme }) => theme.soft};
    }
`;

const ImgClearHistory = styled.img`
    height: 26px;
    width: 26px;
    margin-bottom: 1px;
`;

const ButtonTextClearHistory = styled.h3`
    font-family: "Roboto Condensed", Helvetica;
    font-size: 18px;
    font-weight: 400;
    color: ${({ theme }) => theme.text};
    letter-spacing: 0;
    line-height: normal;
`;

const ClearHistoryPopupContainer = styled.div`
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    background-color: #000000b9;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 3;
`;

const ClearHistoryPopupWrapper = styled.div`
    width: max-content;
    height: max-content;
    background: #1D1D1D;
    color: ${({ theme }) => theme.text};
    padding: 30px 30px 20px 30px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    position: relative;
    border-radius: 12px;
`;

const ClearHistoryPopupTitle = styled.h1`
    font-weight: bold;
    font-size: 24px;
    font-family: "Roboto Condensed", Helvetica;
`;

const ClearHistoryPopupTxt = styled.h1`
    font-family: "Roboto Condensed", Helvetica;
    font-weight: normal;
    font-size: 17px;
    margin-bottom: 15px;
    color: ${({ theme }) => theme.textSoft};
    max-width: 350px;
`;

const OptionsClearCancel = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  width: 100%;
`;

const ClearHistoryCancel = styled.div`
    margin-right: 10px;
    cursor: pointer;
    &:hover {
    background: rgba(45, 45, 45);
    }
    padding: 8px 10px;
    border-radius: 15px;
    font-family: "Roboto Condensed", Helvetica;
    font-size: 17px;
`;

const ClearHistoryClear = styled.div`
    cursor: pointer;
    &:hover {
    background: rgba(45, 45, 45);
    }
    padding: 8px 10px;
    border-radius: 15px;
    font-family: "Roboto Condensed", Helvetica;
    font-size: 17px;
`;

const ItemLogin = styled.div`
  margin-top: 20px;
  display: flex;
  padding: 0px 12px;
  align-items: center;
  gap: 8px;
  width: auto;
  height: 40px;
  transition: background-color 0.5s;
  cursor: pointer;
  border-radius: 12px;
  background-color: ${({ theme }) => theme.loginbg};
  &:hover {
    background-color: ${({ theme }) => theme.softloginbg};
  }
`;

const ImgLogin = styled.img`
  height: 30px;
  width: 30px;
`;

const ButtonLoginText = styled.h3`
  font-family: "Roboto Condensed", Helvetica;
  font-size: 24px;
  font-weight: normal;
  color: ${({ theme }) => theme.text};
  margin-bottom: 3px;
`;

const rotate = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100%;
  margin-top: -250px;
`;

const LoadingCircle = styled.div`
  margin-top: 150px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #7932a8;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: ${rotate} 1s linear infinite;
`;

const History = () => {
    // CONST DEFINITION
    const { currentUser } = useSelector(state => state.user);
    const dispatch = useDispatch();
    const [videos, setVideos] = useState([]);
    const { language, setLanguage } = useLanguage();
    const [historyLoaded, setHistoryLoaded] = useState(false);
    const [searchInput, setSearchInput] = useState('');
    const [isHistoryUpdated, setIsHistoryUpdated] = useState(false);

    // TRANSLATIONS
    const translations = {
        en: {
            history: "Watch History",
            search: "Search in Watch History",
            clearhistory: "Clear Watch History",
            pausehistory: "Pause Watch History",
            unpausehistory: "Resume Watch History",
            emptyHistoryMessage1: "Seems like you haven't watch any video recently :(",
            emptyHistoryMessage2: "Don't miss any Flashy Videos, Watch Now!",
            emptyHistoryMessage1userless: "Seems like you currently are not logged in as a user :(",
            emptyHistoryMessage2userless: "Keep track of your recently watched videos, sign in now!",
            signin: "Sign in",

            clearhistory: "Clear Watch History ",
            clearhistorytxtempty: "Your watch history is currently empty.",
            clearhistorytxt: "Your watch history will be completely cleared as well as the watch progress of these videos.",
            cancel: "Cancel",
            clear: "Clear",
            goback: "Go Back",


            pausehistory: "Pause Watch History ",
            pausehistorytxt: "Your watch history and progress tracking will be paused, therefore we won't be able to give you these information in the future, do you want to pause?",
            pause: "Pause",

            resumehistory: "Resume Watch History",
            resumehistorytxt: "Your watch history and progress tracking will be resume, this will help us providing you a better experience.",
            resume: "Resume",
        },
        es: {
            history: "Historial de Reproducción",
            search: "Buscar en el Historial de Reproducción",
            clearhistory: "Limpiar Historial de Reproducción",
            pausehistory: "Pausar Historial de Reproducción",
            unpausehistory: "Resumir Historial de Reproducción",
            emptyHistoryMessage1: "Parece que no has visto ningún video recientemente :(",
            emptyHistoryMessage2: "No te pierdas ningún video, empieza ahora!",
            emptyHistoryMessage1userless: "Parece que aún no has iniciado sesión como usuario :(",
            emptyHistoryMessage2userless: "Manten registrados tus videos recientes, inicia sesión ahora!",
            signin: "Iniciar Sesión",

            clearhistory: "Limpiar Historial de Reproducción",
            clearhistorytxtempty: "Su historial de reproducción está vacio",
            clearhistorytxt: "Su historial de visualización se borrará por completo, así como el progreso de visualización de estos videos.",
            cancel: "Cancelar",
            clear: "Limpiar",
            goback: "Regresar",

            pausehistory: "Pausar Historial de Reproducción",
            pausehistorytxt: "Tu historial de reproducción y el seguimiento de tu progreso se pausarán, por lo que no podremos brindarte esta información en el futuro. ¿Quieres pausar?",
            pause: "Pausar",

            resumehistory: "Reanudar Historial de Reproducción",
            resumehistorytxt: "Se reanudará tu historial de reproducciones y el seguimiento de tu progreso, lo que nos ayudará a brindarte una mejor experiencia.",
            resume: "Reanudar",
        },
    };

    // FETCH VIDEOS HISTORY
    useEffect(() => {
        setHistoryLoaded(false);
        setIsHistoryUpdated(false);

        const fetchHistory = async () => {
            try {
                const res = await axios.get(`http://localhost:8800/api/users/${currentUser?._id}/history`);
                const videoHistory = res.data;

                videoHistory.sort((a, b) => new Date(b.lastWatchedAt) - new Date(a.lastWatchedAt));

                const detailedVideos = await Promise.all(
                    videoHistory.map(async (videoItem) => {
                        try {
                            const videoDetails = await axios.get(`http://localhost:8800/api/videos/find/${videoItem.videoId._id}`);
                            return videoDetails.data;
                        } catch (error) {
                            return null;
                        }
                    })
                );

                // Filtra los videos nulos
                const filteredVideos = detailedVideos.filter((video) => video !== null);
                setVideos(filteredVideos);
                setHistoryLoaded(true);

            } catch (error) {
                console.error("Error fetching videos:", error);
            }
        };

        if (currentUser) {
            fetchHistory();
        }
    }, [currentUser, isHistoryUpdated]);

    // SEARCH WHEN ENTER IS PRESSED
    const handleKeyPress = async (e) => {
        if (e.key === "Enter") {
            setHistoryLoaded(false);

            try {
                const res = await axios.get(`http://localhost:8800/api/users/${currentUser?._id}/history`);
                const videoHistory = res.data;

                videoHistory.sort((a, b) => new Date(b.lastWatchedAt) - new Date(a.lastWatchedAt));

                const detailedVideos = await Promise.all(
                    videoHistory.map(async (videoItem) => {
                        try {
                            const videoDetails = await axios.get(`http://localhost:8800/api/videos/find/${videoItem.videoId._id}`);
                            return videoDetails.data;
                        } catch (error) {
                            return null;
                        }
                    })
                );

                // Filtra los videos nulos y por búsqueda
                const filteredVideos = detailedVideos.filter(
                    (video) =>
                        video !== null &&
                        video.title.toLowerCase().includes(searchInput.toLowerCase())
                );

                setVideos(filteredVideos);
                setHistoryLoaded(true);

            } catch (error) {
                console.error("Error fetching videos:", error);
            }
        }
    };

    // SEARCH WITH ICON
    const handleSearch = async (e) => {
        setHistoryLoaded(false);

        try {
            const res = await axios.get(`http://localhost:8800/api/users/${currentUser?._id}/history`);
            const videoHistory = res.data;

            videoHistory.sort((a, b) => new Date(b.lastWatchedAt) - new Date(a.lastWatchedAt));

            const detailedVideos = await Promise.all(
                videoHistory.map(async (videoItem) => {
                    try {
                        const videoDetails = await axios.get(`http://localhost:8800/api/videos/find/${videoItem.videoId._id}`);
                        return videoDetails.data;
                    } catch (error) {
                        return null;
                    }
                })
            );

            // Filtra los videos nulos y por búsqueda
            const filteredVideos = detailedVideos.filter(
                (video) =>
                    video !== null &&
                    video.title.toLowerCase().includes(searchInput.toLowerCase())
            );

            setVideos(filteredVideos);
            setHistoryLoaded(true);

        } catch (error) {
            console.error("Error fetching videos:", error);
        }
    };

    // CLEAR WATCH HISTORY
    const [isClearHistoryPopupOpen, setIsClearHistoryPopupOpen] = useState(false);

    const handleClearHistory = () => {
        setIsClearHistoryPopupOpen(true);
    };

    const handleDeleteConfirmation = async (confirmed) => {
        setIsClearHistoryPopupOpen(false);

        if (confirmed) {
            try {
                await axios.delete(`http://localhost:8800/api/users/${currentUser?._id}/history/clear`);
                setIsHistoryUpdated(true);
            } catch (error) {
                console.error('Error deleting history:', error);
            }
        }
    };

    useEffect(() => {
        if (isClearHistoryPopupOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }

        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isClearHistoryPopupOpen]);

    // PAUSE WATCH HISTORY
    const [isPauseHistoryPopupOpen, setIsPauseHistoryPopupOpen] = useState(false);

    const handlePauseHistory = () => {
        setIsPauseHistoryPopupOpen(true);
    };

    const handlePauseConfirmation = async (confirmed) => {
        setIsPauseHistoryPopupOpen(false);

        if (confirmed) {
            try {
                const response = await axios.post(`http://localhost:8800/api/users/toggle-watchHistoryPaused`);
                console.log(response.data.isWatchHistoryPaused);
                dispatch(userToggleWatchHistoryPaused({ isWatchHistoryPaused: response.data.isWatchHistoryPaused }));
            } catch (error) {
                console.error('Error pausing watch history:', error);
            }
        }
    };

    useEffect(() => {
        if (isPauseHistoryPopupOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }

        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isPauseHistoryPopupOpen]);

    // RESUME WATCH HISTORY
    const [isResumeHistoryPopupOpen, setIsResumeHistoryPopupOpen] = useState(false);

    const handleResumeHistory = () => {
        setIsResumeHistoryPopupOpen(true);
    };

    const handleResumeConfirmation = async (confirmed) => {
        setIsResumeHistoryPopupOpen(false);

        if (confirmed) {
            try {
                const response = await axios.post(`http://localhost:8800/api/users/toggle-watchHistoryPaused`);
                dispatch(userToggleWatchHistoryPaused({ isWatchHistoryPaused: response.data.isWatchHistoryPaused }));
            } catch (error) {
                console.error('Error pausing watch history:', error);
            }
        }
    };

    useEffect(() => {
        if (isResumeHistoryPopupOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }

        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isResumeHistoryPopupOpen]);


    return (
        <MainContainer>
            <Header> {translations[language].history} </Header>


            {currentUser ? (
                <Wrapper>

                    {historyLoaded ? (
                        <>
                            {
                                videos.length === 0 ? (
                                    <EmptyHistoryMessageContainer>
                                        <EmptyHistoryImg src={EmptyWatchHistoryIcon} />

                                        <EmptyHistoryMessage1>{translations[language].emptyHistoryMessage1}</EmptyHistoryMessage1>
                                        <EmptyHistoryMessage2>{translations[language].emptyHistoryMessage2}</EmptyHistoryMessage2>

                                    </EmptyHistoryMessageContainer>
                                ) : (
                                    <CardsContainer>
                                        {videos.map(video => (
                                            <CardHistory key={video._id} video={video} setIsHistoryUpdated={setIsHistoryUpdated} />
                                        ))}
                                    </CardsContainer>
                                )
                            }
                        </>
                    ) : (
                        <LoadingContainer>
                            <LoadingCircle />
                        </LoadingContainer>
                    )}

                    <SearchContainer historyLoaded={historyLoaded}>
                        <Search>
                            <ImgBuscar onClick={handleSearch} src={BuscarIcono} />
                            <Input
                                placeholder={translations[language].search}
                                onChange={(e) => [setSearchInput(e.target.value)]}
                                onKeyPress={handleKeyPress} />
                        </Search>

                        <ItemClearHistory onClick={handleClearHistory}>
                            <ImgClearHistory src={ClearHistory} />
                            <ButtonTextClearHistory> {translations[language].clearhistory} </ButtonTextClearHistory>
                        </ItemClearHistory>

                        <ItemClearHistory onClick={currentUser?.isWatchHistoryPaused ? handleResumeHistory : handlePauseHistory} style={{ marginTop: '-10px' }}>
                            <ImgClearHistory src={currentUser?.isWatchHistoryPaused ? ResumeIcon : PauseIcon} />
                            <ButtonTextClearHistory>
                                {currentUser?.isWatchHistoryPaused ? translations[language].unpausehistory : translations[language].pausehistory}
                            </ButtonTextClearHistory>
                        </ItemClearHistory>

                    </SearchContainer>
                </Wrapper>
            ) : (
                <EmptyHistoryMessageContainer>
                    <EmptyHistoryImg src={EmptyWatchHistoryIcon} />
                    <EmptyHistoryMessage1>{translations[language].emptyHistoryMessage1userless}</EmptyHistoryMessage1>
                    <EmptyHistoryMessage2>{translations[language].emptyHistoryMessage2userless}</EmptyHistoryMessage2>
                    <Link
                        to="../signin"
                        style={{
                            textDecoration: "none",
                            color: "inherit",
                        }}
                    >
                        <ItemLogin>
                            <ImgLogin src={InicioSesionIcono2} />
                            <ButtonLoginText> {translations[language].signin} </ButtonLoginText>
                        </ItemLogin>
                    </Link>
                </EmptyHistoryMessageContainer>
            )}


            {
                isClearHistoryPopupOpen && (
                    <ClearHistoryPopupContainer
                        onDeleteConfirmed={() => handleDeleteConfirmation(true)}
                        onCancel={() => handleDeleteConfirmation(false)}
                    >
                        {videos.length === 0 ? (
                            <ClearHistoryPopupWrapper>
                                <ClearHistoryPopupTitle> {translations[language].clearhistory} </ClearHistoryPopupTitle>
                                <ClearHistoryPopupTxt> {translations[language].clearhistorytxtempty} </ClearHistoryPopupTxt>
                                <OptionsClearCancel>
                                    <ClearHistoryClear onClick={() => handleDeleteConfirmation(false)}>
                                        {translations[language].goback}
                                    </ClearHistoryClear>
                                </OptionsClearCancel>
                            </ClearHistoryPopupWrapper>
                        ) : (
                            <ClearHistoryPopupWrapper>
                                <ClearHistoryPopupTitle> {translations[language].clearhistory} </ClearHistoryPopupTitle>
                                <ClearHistoryPopupTxt>  {translations[language].clearhistorytxt} </ClearHistoryPopupTxt>
                                <OptionsClearCancel>
                                    <ClearHistoryCancel onClick={() => handleDeleteConfirmation(false)}>
                                        {translations[language].cancel}
                                    </ClearHistoryCancel>
                                    <ClearHistoryClear onClick={() => handleDeleteConfirmation(true)}>
                                        {translations[language].clear}
                                    </ClearHistoryClear>
                                </OptionsClearCancel>
                            </ClearHistoryPopupWrapper>
                        )}


                    </ClearHistoryPopupContainer>
                )
            }

            {
                isPauseHistoryPopupOpen && (
                    <ClearHistoryPopupContainer
                        onDeleteConfirmed={() => handlePauseConfirmation(true)}
                        onCancel={() => handlePauseConfirmation(false)}
                    >

                        <ClearHistoryPopupWrapper>
                            <ClearHistoryPopupTitle> {translations[language].pausehistory} </ClearHistoryPopupTitle>
                            <ClearHistoryPopupTxt> {translations[language].pausehistorytxt} </ClearHistoryPopupTxt>
                            <OptionsClearCancel>
                                <ClearHistoryCancel onClick={() => handlePauseConfirmation(false)}>
                                    {translations[language].cancel}
                                </ClearHistoryCancel>
                                <ClearHistoryClear onClick={() => handlePauseConfirmation(true)}>
                                    {translations[language].pause}
                                </ClearHistoryClear>
                            </OptionsClearCancel>
                        </ClearHistoryPopupWrapper>

                    </ClearHistoryPopupContainer>
                )
            }

            {
                isResumeHistoryPopupOpen && (
                    <ClearHistoryPopupContainer
                        onDeleteConfirmed={() => handleResumeConfirmation(true)}
                        onCancel={() => handleResumeConfirmation(false)}
                    >

                        <ClearHistoryPopupWrapper>
                            <ClearHistoryPopupTitle> {translations[language].resumehistory} </ClearHistoryPopupTitle>
                            <ClearHistoryPopupTxt> {translations[language].resumehistorytxt}  </ClearHistoryPopupTxt>
                            <OptionsClearCancel>
                                <ClearHistoryCancel onClick={() => handleResumeConfirmation(false)}>
                                    {translations[language].cancel}
                                </ClearHistoryCancel>
                                <ClearHistoryClear onClick={() => handleResumeConfirmation(true)}>
                                    {translations[language].resume}
                                </ClearHistoryClear>
                            </OptionsClearCancel>
                        </ClearHistoryPopupWrapper>

                    </ClearHistoryPopupContainer>
                )
            }

            {historyLoaded && videos.length > 0 &&
                <Footer />
            }

        </MainContainer >
    );
};

export default History;