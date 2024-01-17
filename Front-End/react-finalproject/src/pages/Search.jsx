import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import SadFace from "../assets/NotSubbedIcono.png";
import Card from "../components/Card";
import { useLanguage } from '../utils/LanguageContext';
import Footer from "../components/Footer";

const MainContainer = styled.div`
  position: relative;    
  display: flex;
  flex-direction: column;
  top: 0;
  margin: auto;
  min-height: 100vh;
  width: 100%;
  background-color: rgba(15, 12, 18);
  max-width: 1920px;
  overflow: hidden;
`;

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
`;

const Header = styled.h1`
    display:flex;
    font-size: 32px;
    color: rgba(224, 175, 208);
    padding :100px 55px 20px 55px;
    font-weight: bold;
    font-family: "Roboto Condensed", Helvetica;
`;

const SearchName = styled.h1`
font-size: 32px;
color: rgba(214, 135, 135);
font-weight: bold;
font-family: "Roboto Condensed", Helvetica;
`;

const Wrapper = styled.div`
    padding: 32px 55px 32px 58px;
`;

const NoVideosWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center; // Alineación del texto
`;
const NoVideos1 = styled.h1`
  margin-top: 15px;
  font-size: 32px;
  color: rgba(224, 175, 208, 0.8);
  font-weight: bold;
  font-family: "Roboto Condensed", Helvetica;
`;
const NoVideos2 = styled.h1`
  margin-top: 15px;
  font-size: 32px;
  color: white;
  font-weight: bold;
  font-family: "Roboto Condensed", Helvetica;
`;

const NovideosImg = styled.img`
  height: 96px;
  width: 96px;
  padding: 20 px;
`;



const Search = () => {
    const [videos, setVideos] = useState([]);
    const query = useLocation().search;
    const qValue = new URLSearchParams(query).get("q");
    const { language, setLanguage } = useLanguage();
    const [NoVideosFound, setNoVideosFound] = useState(false);

    const translations = {
        en: {
            searchfor: "Search for:",
            novideo1: "No videos found for this query",
            novideo2: "Try our Explore section to find new content!",
        },
        es: {
            searchfor: "Busqueda:",
            novideo1: "No se han encontrado videos para esta consulta",
            novideo2: "Prueba nuestra sección Explorar para encuentrar nuevo contenido!",
        },
    };

    // RESET SCROLL
    const scrollToTop = () => {
        window.scrollTo(0, 0);
    };


    useEffect(() => {
        scrollToTop();
    }, []);


    useEffect(() => {
        setNoVideosFound(false);
        const fetchVideos = async () => {
            const res = await axios.get(`/videos/search${query}`);
            if (res && res.data && res.data.length > 0) {

            } else {
                setNoVideosFound(true);
            }
            setVideos(res.data);
        };
        fetchVideos();
    }, [query]);

    return (
        <MainContainer>
            <Header> {translations[language].searchfor}&nbsp;<SearchName>{qValue}</SearchName> </Header>
            <Wrapper>
                <Container>
                    {videos.map(video => (
                        <Card key={video._id} video={video} />
                    ))}
                </Container>
            </Wrapper>

            {NoVideosFound &&
                <NoVideosWrapper>
                    <NovideosImg src={SadFace} />
                    <NoVideos1>{translations[language].novideo1}</NoVideos1>
                    <NoVideos2>{translations[language].novideo2}</NoVideos2>
                </NoVideosWrapper>
            }

            {!NoVideosFound &&
                <Footer />
            }
        </MainContainer>
    );
};

export default Search;