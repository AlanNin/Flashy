import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import SadFace from "../assets/NotSubbedIcono.png";
import Card from "../components/Card";
import CardPlaylist from "../components/CardPlaylist";
import CardUser from "../components/CardUser";
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

// SORT TYPE
const FilterContainer = styled.div`
    position: relative;
    display: flex;
    height: auto;
    width: auto;
    gap: 15px;
    margin-left: 55px;
`;

const FilterItem = styled.div`
    font-size: 16px;
    font-weight: bold;
    font-family: "Roboto Condensed", Helvetica;
    padding: 5px 10px;
    border-radius: 10px;
    width: max-content;
    cursor: pointer;
    transition: background 0.5s ease;
    background: ${({ filterType }) => (filterType ? '#F1F1F1' : '#272727')};
    color: ${({ filterType, theme }) => (filterType ? 'black' : theme.text)};

    &:hover {
      background: ${({ filterType }) => (filterType ? '#F1F1F1' : 'rgba(171, 171, 171, 0.4)')};
    }
`;

const Search = () => {
    const [videos, setVideos] = useState([]);
    const [playlists, setPlaylists] = useState([]);
    const [users, setUsers] = useState([]);
    const query = useLocation().search;
    const qValue = new URLSearchParams(query).get("q");
    const { language, setLanguage } = useLanguage();
    const [NoInfoFound, setNoInfoFound] = useState(false);
    const [filterType, setFilterType] = useState('all');

    const translations = {
        en: {
            searchfor: "Search for:",
            novideo1: "No information found for this query",
            novideo2: "Try our Explore section to find new content!",

            videos: "Videos",
            playlist: "Playlist",
            users: "Users",
        },
        es: {
            searchfor: "Busqueda:",
            novideo1: "No se ha encontrado información para esta consulta",
            novideo2: "Prueba nuestra sección Explorar para encuentrar nuevo contenido!",

            videos: "Videos",
            playlist: "Listas de Reproducción",
            users: "Usuarios",
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
        setNoInfoFound(false);

        const fetchSearch = async () => {
            try {
                const res = await axios.get(`/videos/search${query}`);

                if (filterType === 'videos') {
                    if (res.data.videos.length === 0) {
                        setNoInfoFound(true);
                        return;
                    }
                    setVideos(res.data.videos);
                    return;
                }

                if (filterType === 'playlists') {
                    if (res.data.playlists.length === 0) {
                        setNoInfoFound(true);
                        return;
                    }
                    setPlaylists(res.data.playlists);
                    return;
                }

                if (filterType === 'users') {
                    if (res.data.users.length === 0) {
                        setNoInfoFound(true);
                        return;
                    }
                    setUsers(res.data.users);
                    return;
                }

                setVideos(res.data.videos);
                setPlaylists(res.data.playlists);
                setUsers(res.data.users);

                if (res.data.videos.length === 0 && res.data.playlists.length === 0 && res.data.users.length === 0) {
                    setNoInfoFound(true);
                }

            } catch (error) {
                console.error("Error fetching playlist:", error);
                setNoInfoFound(true);
            }
        };

        fetchSearch();

    }, [query, filterType]);

    return (
        <MainContainer>
            <Header> {translations[language].searchfor}&nbsp;<SearchName>{qValue}</SearchName> </Header>

            <FilterContainer>
                <FilterItem
                    onClick={() => {
                        setFilterType(filterType === 'videos' ? 'all' : 'videos');
                    }}
                    filterType={filterType === 'videos' ? true : false}
                >
                    {translations[language].videos}
                </FilterItem>

                <FilterItem
                    onClick={() => {
                        setFilterType(filterType === 'playlists' ? 'all' : 'playlists');
                    }}
                    filterType={filterType === 'playlists' ? true : false}
                >
                    {translations[language].playlist}
                </FilterItem>

                <FilterItem
                    onClick={() => {
                        setFilterType(filterType === 'users' ? 'all' : 'users');
                    }}
                    filterType={filterType === 'users' ? true : false}
                >
                    {translations[language].users}
                </FilterItem>
            </FilterContainer>

            <Wrapper>

                <Container>
                    {filterType === 'all' &&
                        <>
                            {videos.map(video => (
                                <Card key={video._id} video={video} />
                            ))}
                            {playlists.map((playlist) => (
                                <CardPlaylist
                                    key={playlist?._id}
                                    playlist={playlist}
                                />
                            ))}
                            {users.map((user) => (
                                <CardUser
                                    key={user?._id}
                                    user={user}
                                />
                            ))}
                        </>
                    }
                    {filterType === 'videos' &&
                        <>
                            {videos.map(video => (
                                <Card key={video._id} video={video} />
                            ))}
                        </>
                    }
                    {filterType === 'playlists' &&
                        <>
                            {playlists.map((playlist) => (
                                <CardPlaylist
                                    key={playlist?._id}
                                    playlist={playlist}
                                />
                            ))}
                        </>
                    }
                    {filterType === 'users' &&
                        <>
                            {users.map((user) => (
                                <CardUser
                                    key={user?._id}
                                    user={user}
                                />
                            ))}
                        </>
                    }
                </Container>

            </Wrapper>

            {NoInfoFound &&
                <NoVideosWrapper>
                    <NovideosImg src={SadFace} />
                    <NoVideos1>{translations[language].novideo1}</NoVideos1>
                    <NoVideos2>{translations[language].novideo2}</NoVideos2>
                </NoVideosWrapper>
            }

            {!NoInfoFound &&
                <Footer />
            }
        </MainContainer>
    );
};

export default Search;