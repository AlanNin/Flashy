import React, { useState, useEffect, useRef, useContext } from "react";
import styled from "styled-components";
import CardHistory from "../components/CardHistory";
import BuscarIcono from "../assets/BuscarIcono.png";
import ClearHistory from "../assets/BorrarComentarioIcono.png";
import EmptyWatchHistoryIcon from "../assets/NotSubbedIcono.png";
import { useLanguage } from '../utils/LanguageContext';
import { useDispatch, useSelector } from 'react-redux';
import axios from "axios";

const MainContainer = styled.div`
    position: relative;    
    display: relative;
    width: 100%;
    min-height: 100vh;
    background-color: rgba(15, 12, 18);
    z-index: 1;
    max-width: 1920px;
    margin: auto;
`;

const Wrapper = styled.div`
    position: relative;  
    padding: 32px 250px;
    display: flex;
`;

const EmptyHistoryMessageContainer = styled.div`
    margin-top: 100px;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    width: 930px;
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
    gap: 50px;
`;

const MenuContainer = styled.div`
    display: flex;
    flex-direction: column;
    margin-left 100px;
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
    padding: 22px 8px;
    border-radius: 30px;
    padding: 8px 15px;
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
`;

const ClearHistoryPopupTxt = styled.h1`
  font-weight: normal;
  font-size: 16px;
  margin-bottom: 15px;
  color: ${({ theme }) => theme.textSoft};
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
`;

const ClearHistoryClear = styled.div`
  cursor: pointer;
  &:hover {
    background: rgba(45, 45, 45);
  }
  padding: 8px 10px;
  border-radius: 15px;
`;

const History = () => {
    // CONST DEFINITION
    const { currentUser } = useSelector(state => state.user);
    const [videos, setVideos] = useState([]);
    const { language, setLanguage } = useLanguage();

    // TRANSLATIONS
    const translations = {
        en: {
            history: "Watch History",
            search: "Search in Watch History",
            clearhistory: "Clear Watch History",
            emptyHistoryMessage1: "Seems like you haven't watch any video recently :(",
            emptyHistoryMessage2: "Don't miss any Flashy Videos, Watch Now!",
        },
        es: {
            history: "Historial de Reproducción",
            search: "Buscar en el Historial de Reproducción",
            clearhistory: "Limpiar Historial de Reproducción",
            emptyHistoryMessage1: "Parece que no has visto ningún video recientemente :(",
            emptyHistoryMessage2: "No te pierdas ningún video, empieza ahora!",
        },
    };

    // FETCH VIDEOS HISTORY
    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await axios.get(`/users/${currentUser?._id}/history`);
                const videoHistory = res.data;

                // Sort the videos based on a property (e.g., lastWatchedAt)
                videoHistory.sort((a, b) => new Date(b.lastWatchedAt) - new Date(a.lastWatchedAt));

                // Fetch details for each video using the 'find/:id' route
                const detailedVideos = await Promise.all(
                    videoHistory.map(async (videoItem) => {
                        const videoDetails = await axios.get(`/videos/find/${videoItem.videoId._id}`);
                        return videoDetails.data;
                    })
                );

                setVideos(detailedVideos);
            } catch (error) {
                console.error("Error fetching videos:", error);
            }
        };

        if (currentUser) {
            fetchHistory();
        }
    }, [currentUser]);

    // SEARCH WHEN ENTER IS PRESSED
    const handleKeyPress = (e) => {
        if (e.key === "Enter") {

        }
    };

    // CLEAR WATCH HISTORY
    const [isClearHistoryPopupOpen, setIsClearHistoryPopupOpen] = useState(false);

    const handleClearHistory = async () => {
        setIsClearHistoryPopupOpen(true);
    };

    const handleDeleteConfirmation = async (confirmed) => {
        setIsClearHistoryPopupOpen(false);

        if (confirmed) {
            try {
                await axios.delete(`/users/${currentUser?._id}/history/clear`);
                window.location.reload();
            } catch (error) {
                console.error('Error deleting comment:', error);
            }
        }
    };


    return (
        <MainContainer>
            <Header> {translations[language].history} </Header>

            <Wrapper>
                {videos.length === 0 ? (
                    <EmptyHistoryMessageContainer>
                        <EmptyHistoryImg src={EmptyWatchHistoryIcon} />
                        <EmptyHistoryMessage1>{translations[language].emptyHistoryMessage1}</EmptyHistoryMessage1>
                        <EmptyHistoryMessage2>{translations[language].emptyHistoryMessage2}</EmptyHistoryMessage2>
                    </EmptyHistoryMessageContainer>
                ) : (
                    <CardsContainer>
                        {videos.map(video => (
                            <CardHistory key={video._id} video={video} />
                        ))}
                    </CardsContainer>
                )}
                <MenuContainer>
                    <Search>
                        <ImgBuscar src={BuscarIcono} />
                        <Input
                            placeholder={translations[language].search}
                            onChange={(e) => []}
                            onKeyPress={handleKeyPress} />
                    </Search>

                    <ItemClearHistory onClick={handleClearHistory}>
                        <ImgClearHistory src={ClearHistory} />
                        <ButtonTextClearHistory> {translations[language].clearhistory} </ButtonTextClearHistory>
                    </ItemClearHistory>
                </MenuContainer>
            </Wrapper>

            {isClearHistoryPopupOpen && (
                <ClearHistoryPopupContainer
                    onDeleteConfirmed={() => handleDeleteConfirmation(true)}
                    onCancel={() => handleDeleteConfirmation(false)}
                >
                    {videos.length === 0 ? (
                        <ClearHistoryPopupWrapper>
                            <ClearHistoryPopupTitle> Clear Watch History </ClearHistoryPopupTitle>
                            <ClearHistoryPopupTxt> Your watch history is currently empty. </ClearHistoryPopupTxt>
                            <OptionsClearCancel>
                                <ClearHistoryClear onClick={() => handleDeleteConfirmation(false)}>
                                    Go Back
                                </ClearHistoryClear>
                            </OptionsClearCancel>
                        </ClearHistoryPopupWrapper>
                    ) : (
                        <ClearHistoryPopupWrapper>
                            <ClearHistoryPopupTitle> Clear Watch History </ClearHistoryPopupTitle>
                            <ClearHistoryPopupTxt> Your watch history will be completely cleared. </ClearHistoryPopupTxt>
                            <OptionsClearCancel>
                                <ClearHistoryCancel onClick={() => handleDeleteConfirmation(false)}>
                                    Cancel
                                </ClearHistoryCancel>
                                <ClearHistoryClear onClick={() => handleDeleteConfirmation(true)}>
                                    Clear
                                </ClearHistoryClear>
                            </OptionsClearCancel>
                        </ClearHistoryPopupWrapper>
                    )}


                </ClearHistoryPopupContainer>
            )}

        </MainContainer>
    );
};

export default History;