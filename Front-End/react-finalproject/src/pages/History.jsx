import React, { useState, useEffect, useRef, useContext } from "react";
import styled from "styled-components";
import CardHistory from "../components/CardHistory";
import { useLanguage } from '../utils/LanguageContext';
import { useDispatch, useSelector } from 'react-redux';
import axios from "axios";

const MainContainer = styled.div`
  display: relative;
  width: 100%;
  min-height: 100vh;
  background-color: rgba(15, 12, 18);
  z-index: 1;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 50px;
`;

const Header = styled.h1`
    display:flex;
    font-size: 40px;
    color: rgba(224, 175, 208);
    padding :100px 55px 20px 250px;
    font-weight: bold;
    font-family: "Roboto Condensed", Helvetica;
`;


const Wrapper = styled.div`
  padding: 32px 250px;
`;


const History = () => {
    const { currentUser } = useSelector(state => state.user);
    const [videos, setVideos] = useState([]);
    const { language, setLanguage } = useLanguage();

    const translations = {
        en: {
            history: "Watch History",
        },
        es: {
            history: "Historial de Reproducción",
        },
    };

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


    return (
        <MainContainer>
            <Header> {translations[language].history} </Header>

            <Wrapper>
                <Container>
                    {videos.map(video => (
                        <CardHistory key={video._id} video={video} />
                    ))}
                </Container>
            </Wrapper>
        </MainContainer>
    );
};

export default History;