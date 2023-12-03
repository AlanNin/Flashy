import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import Card from "../components/Card";
import { useLanguage } from '../utils/LanguageContext';

const MainContainer = styled.div`
  display: relative;
  width: 100%;
  min-height: 100vh;
  background-color: rgba(15, 12, 18);
  z-index: 1;
`;

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 118px;
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
  padding: 32px 55px;
`;


const Search = () => {
    const [videos, setVideos] = useState([]);
    const query = useLocation().search;
    const qValue = new URLSearchParams(query).get("q");
    const { language, setLanguage } = useLanguage();

    const translations = {
        en: {
            searchfor: "Search for:",
        },
        es: {
            searchfor: "Busqueda:",
        },
    };


    useEffect(() => {
        const fetchVideos = async () => {
            const res = await axios.get(`/videos/search${query}`);
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
        </MainContainer>
    );
};

export default Search;