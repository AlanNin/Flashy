import React, { useState, useEffect, useRef, useContext } from "react";
import styled from "styled-components";
import Card from "../components/Card";
import { useLanguage } from '../utils/LanguageContext';
import axios from "axios";
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { subscription } from "../redux/userSlice";
import { Link } from "react-router-dom";
import BuscarIcono from "../assets/BuscarIcono.png";

const MainContainer = styled.div`
  display: relative;
  width: 100%;
  min-height: 100vh;
  background-color: rgba(15, 12, 18);
  z-index: 1;
`;

const Header = styled.h1`
  font-size: 32px;
  color: rgba(224, 175, 208);
  padding: 70px 10px 10px 0px;
  font-weight: bold;
  font-family: "Roboto Condensed", Helvetica;
`;
const HeaderChannel = styled.h1`
  font-size: 32px;
  color: rgba(224, 175, 208);
  padding: 70px 10px 10px 0px;
  font-weight: bold;
  font-family: "Roboto Condensed", Helvetica;
  margin-left: 50px;
`;


const UserInfoSection = styled.section`
  display: flex;
  align-items: center;
  padding: 20px;
  background-color: #333; 
  border-radius: 10px; 
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  color: #fff;
  margin-left: 20px; 
`;

const UserImage = styled.img`
  border-radius: 50%;
  width: 150px; 
  height: auto;
  margin-right: 20px; 
  margin-bottom: -50px; 
  margin-left: 20px;
`;
const ChannelName = styled.span`
  color: rgba(224, 175, 208, 0.8);
  margin-right: 10px;
`;

const SubscribersCount = styled.span`
  color: rgba(224, 175, 208, 0.8);
  margin-bottom: 5px;
`;

const CreatedAt = styled.span`
  color: rgba(224, 175, 208, 0.8);
  margin-bottom: 5px;
`;

const UpdatedAt = styled.span`
  color: rgba(224, 175, 208, 0.8);
  margin-bottom: 5px;
`;



const Container = styled.div`
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  z-index: 1;
  gap: 118px;
`;

const Wrapper = styled.div`
  padding: 32px 55px;
`;

const Subscribe = styled.button`
  background-color: ${({ isSubscribed }) => (isSubscribed ? 'rgb(196, 90, 148, 0.8)' : 'rgb(196, 90, 172, 0.5)')};
  font-weight: 700;
  font-size: 14px;
  font-family: "Roboto", Helvetica;
  color: white;
  border: none;
  border-radius: 3px;
  height: max-content;
  padding: 10px 20px;
  cursor: pointer;
  margin-top: 20px;
`;

const SuscbribeContainer = styled.div`
  align-items: center;
  height: max-content;
  width: max-content;
`;

const SuscbribeNotLogged = styled.div`

`;

const SuscbribeNotLoggedTxt = styled.h1`
  color: white;
  padding: 10px 5px;
  font-family: "Roboto Condensed", Helvetica;
  font-size: 18px;
  font-weight: normal;
`;

const StyledLink = styled.a`
  text-decoration: none;
  color: inherit;
  font-size: inherit;
  font-family: inherit;
`;

const MenuContainer = styled.div`
  display: flex;
  justify-content: left;
  margin-left: 40px ;
  margin-top: 40px ;
`;

const MenuButton = styled.button`
  background-color: ${({ active }) => (active ? 'rgb(196, 90, 148, 0.8)' : 'rgb(196, 90, 172, 0.5)')};
  font-weight: 700;
  font-size: 14px;
  font-family: "Roboto", Helvetica;
  color: white;
  border: none;
  border-radius: 5px;
  width: 120px;
  height: 40px;
  margin: 0 10px;
  cursor: pointer;

  &:hover {
    background-color: ${({ active }) => (active ? 'rgb(196, 90, 148, 0.8)' : 'rgb(196, 90, 172, 0.7)')};
  }
`;

const MenuSection = styled.section`
  display: flex;
  justify-content: left;
  margin-left: 20px;
  gap: 5px;
`;

const SectionButton = styled.div`
  background-color: ${({ active }) => (active ? 'rgb(196, 90, 148, 0.8)' : 'rgb(51, 51, 51, 1)')};
  font-weight: 700;
  font-size: 14px;
  font-family: "Roboto", Helvetica;
  color: white;
  width: 150px;
  height: 35px;
  margin: 0 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom-left-radius: 10px; 
  border-bottom-right-radius: 10px;

  &:hover {
    background-color: ${({ active }) => (active ? 'rgb(196, 90, 148, 0.8)' : 'rgb(196, 90, 172, 0.7)')};
  }
`;

const Search = styled.div`
  input {
    border: none;
    background-color: rgb(51, 51, 51, 1);
    color: white;
    width: 100%;
    height: 100%;
    padding: 0 10px;
    display: flex;
  align-items: center;
  padding: 5px;
  width: 350px;
  margin-left: 22px;
  border-radius: 3px;
  height: 25px;
  background-color: rgb(51, 51, 51, 1);

  @media only screen and (max-width: 980px),
  only screen and (max-height: 910px) {
    width: 190px;
  }
`;

const ChannelCardContainer = styled.div`
  background-color: #333;
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 20px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: scale(1.05);
  }
`;

const ChannelImage = styled.img`
  width: 100%;
  height: auto;
  border-radius: 10px 10px 0 0;
`;

const ChannelDetails = styled.div`
  padding: 15px;
`;


const ChannelPage = () => {
  const { language } = useLanguage();
  const { id: channelId } = useParams();

  const translations = {
    en: {
      subscribers: "subscribers",
      created: "Created at",
      channel: "Channels",
      channelShare: "Channels recommended by",
      videos: "Videos",
      SuscbribeNotLogged: "You need to be logged in to subscribe.",
      Recent: "Recent Videos",
      Old: "Old videos",
      Popular:"Popular",
      Liked: "Most liked",
      Loading: "Loading",
      suscribe:"SUSCRIBE",
      suscribed:"SUSCRIBED",
      search: "Search",
    },
    es: {
      subscribers: "subscriptores",
      created: "Creado el",
      channel: "Canales",
      channelShare: "Channels recommended by",
      videos: "Videos",
      SuscbribeNotLogged: "Debes iniciar sesión para suscribirte.",
      Recent: "Videos Recientes",
      Old: "Videos antiguos",
      Popular:"Populares",
      Liked: "Mas gustados",
      Loading: "Cargando",
      suscribe:"SUSCRIBETE",
      suscribed:"SUSCRITO",
      search: "Buscar"
    },
  };

  

  const [videos, setVideos] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [subscribedChannels, setSubscribedChannels] = useState(null);
  const { currentUser } = useSelector((state) => state.user);
  const [activeButton, setActiveButton] = useState("recent");
  const dispatch = useDispatch();

  const [searchVisible, setSearchVisible] = useState(false);
  const [searchText, setSearchText] = useState('');

  const [showChannelContent, setShowChannelContent] = useState(false);
  const [showVideoContent, setShowVideoContent] = useState(true);
  const [searchResults, setSearchResults] = useState(null);
  const [showSearchContent, setShowSearchContent] = useState(false);

  const handleSearch = async () => {
    try {
      const response = await axios.get(`/videos/searchChannel?q=${searchText}&channelId=${channelId}`);
      setShowSearchContent(true);
      setSearchResults(response.data);
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };


  useEffect(() => {
    if (searchText.trim() === "") {
      setSearchResults(null);
      return;
    }

    handleSearch();
  }, [searchText]);
  

  useEffect(() => {

    const fetchData = async () => {
      try {
        if (channelId) {
          // Obtener videos del canal
          const videosResponse = await axios.get(`/videos/channel/${channelId}`);
          setVideos(videosResponse.data);

          // Obtener detalles del usuario usando el ID del usuario del canal
          const userDetailsResponse = await axios.get(`/users/find/${channelId}`);
          setUserDetails(userDetailsResponse.data);

          // Obtener canales a lo que esta suscripto el canal
          const subscribedChannelsResponse = await axios.get(`/videos/sub/channel/${channelId}`);
          setSubscribedChannels(subscribedChannelsResponse.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [channelId]);
  
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, options);
  };

    // SUBSCRIBE CHANNEL
    const handleSub = async () => {
      if (!currentUser) {
        setSubscribePopupVisible(true);
        return;
      }
  
      currentUser.subscribedUsers.includes(userDetails?._id)
        ? await axios.put(`/users/unsub/${userDetails?._id}`)
        : await axios.put(`/users/sub/${userDetails?._id}`);
      dispatch(subscription(userDetails?._id));
      
    };
    const isCurrentUserUploader = currentUser?._id === channelId;

    // POP UP SUSCRIBE NOT LOGGED
  const [isSubscribePopupVisible, setSubscribePopupVisible] = useState(false);
  const subscribeRef = useRef(null);

  useEffect(() => {
    const handleClickOutsideSuscribeNotLogged = (event) => {
      if (subscribeRef.current && !subscribeRef.current.contains(event.target)) {
        setSubscribePopupVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutsideSuscribeNotLogged);

    return () => {
      document.removeEventListener("mousedown", handleClickOutsideSuscribeNotLogged);
    };
  }, []);

  const handleButtonClick = async (buttonType) => {
    try {
      setShowSearchContent(false);
      setSearchVisible(false);
      setSearchText('');
      let response;
      if (buttonType === "recent") {
        response = await axios.get(`/videos/channel/${channelId}`);
      } else if (buttonType === "popular") {
        response = await axios.get(`/videos/mostpopular/${channelId}`);
      } else if (buttonType === "liked") {
        response = await axios.get(`/videos/mostliked/${channelId}`);
      } else if (buttonType === "old") {
        response = await axios.get(`/videos/old/${channelId}`);
      }
      setVideos(response.data);
      setActiveButton(buttonType); // Actualiza el botón activo
    } catch (error) {
      console.error(`Error fetching ${buttonType} videos:`, error);
    }
  };


  const SectionButtonClick = async (buttonType) => {
    if (buttonType === "channels") {
      setShowChannelContent(true);
      setShowVideoContent(false);
    } else if (buttonType === "videos"){
      setShowChannelContent(false);
      setShowVideoContent(true);
    }
  };


  return (
    <MainContainer>
      {userDetails ? (
        <>
          <UserInfoSection>
            <UserImage src={userDetails.img} alt="User" />
            <UserInfo> 
              <Header>{userDetails.displayname}</Header>
              <SubscribersCount>{`@${userDetails.name} - ${userDetails.subscribers} ${translations[language].subscribers} - ${videos ? videos.length : 0} ${translations[language].videos} `}</SubscribersCount>
              <CreatedAt>{`${translations[language].created} ${formatDate(userDetails.createdAt)}`}</CreatedAt>
              <StyledLink>{`${userDetails.email}`} </StyledLink>
            
            <SuscbribeContainer>
                  {!isCurrentUserUploader && (
                    <Subscribe
                      onClick={handleSub}
                      isSubscribed={currentUser?.subscribedUsers?.includes(userDetails?._id)}
                    >
                      {currentUser?.subscribedUsers?.includes(userDetails?._id) ? `${translations[language].suscribed} ✔` : `${translations[language].suscribe}`}
                    </Subscribe>

                  )}
                  {!currentUser && isSubscribePopupVisible && (
                    <SuscbribeNotLogged ref={subscribeRef}>

                      <SuscbribeNotLoggedTxt>{`${translations[language].SuscbribeNotLogged}`}</SuscbribeNotLoggedTxt>

                      <Link
                        to="../../signin"
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

                    </SuscbribeNotLogged>
                  )}
                </SuscbribeContainer>
                </UserInfo>
          </UserInfoSection>

          <MenuSection>
            <SectionButton
              onClick={() => SectionButtonClick('videos')}
              active={activeButton === 'videos'}
            >
              {`${translations[language].videos}`}
            </SectionButton>
            <SectionButton
              onClick={() => SectionButtonClick('channels')}
              active={activeButton === 'channels'}
            >
              {`${translations[language].channel}`}
            </SectionButton>
          </MenuSection>
          
          

          {showVideoContent &&(    <MenuContainer>
            <MenuButton
              onClick={() => handleButtonClick('recent')}
              active={activeButton === 'recent'}
            >
              {`${translations[language].Recent}`}
            </MenuButton>
            <MenuButton
              onClick={() => handleButtonClick('popular')}
              active={activeButton === 'popular'}
            >
              {`${translations[language].Popular}`}
            </MenuButton>
            <MenuButton
              onClick={() => handleButtonClick('liked')}
              active={activeButton === 'liked'}
            >
              {`${translations[language].Liked}`}
            </MenuButton>
            <MenuButton
              onClick={() => handleButtonClick('old')}
              active={activeButton === 'old'}
            >
              {`${translations[language].Old}`}
            </MenuButton>
            <MenuButton onClick={() => { setSearchVisible(!searchVisible); setShowSearchContent(!showSearchContent); }}> 
            <img src={BuscarIcono} alt="Search" style={{ width: '20px', height: '20px' }} />
            </MenuButton>

              <Search>
            {searchVisible && (
              <input
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder={translations[language].search}
              />
            )}
          </Search>

          </MenuContainer>
          )}
          {!showSearchContent && showVideoContent && videos && (
          <Wrapper>
            <Container>
              {videos.map((video) => (
                <Card key={video._id} video={video} />
              ))}
            </Container>
          </Wrapper>
          )}

          {showChannelContent && subscribedChannels && ( <HeaderChannel>{`${translations[language].channelShare} ${userDetails.displayname}`}</HeaderChannel> )}
          {showChannelContent && subscribedChannels && (
             
            <Wrapper>
            <Container>
              {subscribedChannels.map((channel) => (
                <Link to={`/channel/${channel._id}`} style={{ textDecoration: "none" }}>
                      <ChannelCardContainer>
                      <ChannelImage src={channel.img} alt={channel.displayname} />
                      <ChannelDetails>
                        <ChannelName>{channel.displayname} - </ChannelName>
                        <SubscribersCount>{`${channel.subscribers} Subscribers`}</SubscribersCount>
                      </ChannelDetails>
                    </ChannelCardContainer>
                    </Link>
              ))}
            </Container>
            </Wrapper>
           
          )}
          {searchResults && showVideoContent && showSearchContent && (
            <Wrapper>
              <Container>
                {searchResults.map((video) => (
                  <Card key={video._id} video={video} />
                ))}
              </Container>
            </Wrapper>
          )}
        </>
      ) : (
        <div>{`${translations[language].Loading}...`}</div>
      )}
    </MainContainer>
  );
};

export default ChannelPage;
