import React, { useState, useEffect, useRef, useContext } from "react";
import styled, { css, keyframes } from "styled-components";
import { useDispatch, useSelector } from 'react-redux';
import { subscription, userUpdated } from "../redux/userSlice";
import { useLanguage } from '../utils/LanguageContext';
import { Link, useNavigate, useLocation } from "react-router-dom";
import BannerPlaceholder from '../assets/BannerPlaceholder.jpg';
import SubscribedIcon from '../assets/SubscribedIcon.png';
import ArrowDown from '../assets/ArrowDownG.png';
import EditIcono from "../assets/EditIconoG.png";
import EmailIcon from "../assets/EmailIcon.png";
import URLIcon from '../assets/URLIcon.png';
import SubscribersIcon from '../assets/SubscribersIcon.png';
import VideosPostedIcon from '../assets/VideosPostedIcon.png';
import InfoChannelIcon from '../assets/InfoChannelIcon.png';
import CloseXGr from "../assets/CloseXGr.png"
import { toast } from 'react-toastify';
import axios from "axios";
import CardChannel from "../components/CardChannel";
import CardChannelPlaylist from "../components/CardChannelPlaylist";
import Footer from "../components/Footer";

// NORMAL SECUENCE
const MainContainer = styled.div`
  position: relative;
  margin: auto;
  min-height: 100vh;
  background-color: rgba(15, 12, 18);
  max-width: 1920px;
  top: 0;
  display: flex;
  flex-direction: column;
  height: max-content;
`;

const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  background-color: transparent;
  display: flex;
`;

const Wrapper = styled.div`
  position: relative;
  width: 100%;
  height: auto;
  margin: 56px 183px;
  margin-right: ${({ anyPopupOpen }) => (anyPopupOpen ? '190px' : '183px')};
  padding: 0px 50px 40px 50px;
  display: flex;
  flex-direction: column;
`;

// SECTION LINE
const SectionLine = styled.div`
    position: relative;
    display: flex;
    height: auto;
    width: 100%;
    border-bottom: 1px solid rgba(168, 167, 168, 0.4);
    gap: 30px;
`;

const SectionTitle = styled.h1`
    font-size: 18px;
    font-weight: bold;
    color: ${({ theme }) => theme.text};
    font-family: "Roboto Condensed", Helvetica;
    padding-bottom: 8px;
    width: max-content;
    cursor: pointer;
    transition: border-color 0.5s ease;
    border-bottom: 2px solid transparent;

    &:hover {
      border-color: rgba(171, 171, 171, 0.5);
    }
`;

// SORT TYPE
const SortContainer = styled.div`
    position: relative;
    display: flex;
    height: auto;
    width: auto;
    gap: 15px;
    margin-top: 20px;
`;

const SortItem = styled.div`
    font-size: 16px;
    font-weight: bold;
    font-family: "Roboto Condensed", Helvetica;
    padding: 5px 10px;
    border-radius: 10px;
    width: max-content;
    cursor: pointer;
    transition: background 0.5s ease;
    background: ${({ sortType }) => (sortType ? '#F1F1F1' : '#272727')};
    color: ${({ sortType, theme }) => (sortType ? 'black' : theme.text)};

    &:hover {
      background: ${({ sortType }) => (sortType ? '#F1F1F1' : 'rgba(171, 171, 171, 0.4)')};
    }
`;

// ACCOUNT PRESENTATION SECTION
const AccountPresentationSection = styled.div`
    position: relative;    
    display: flex;
    flex-direction: column;
    gap: 3px;
    height: max-content;
`;

const AccountProfileBanner = styled.img`
    position: relative;    
    width: 100%;
    height: 275px;
    object-fit: cover;
    z-index: 1;
    border-radius: 8px 8px 0px 0px;
`;

const ProfilePictureAndInfoDiv = styled.div`
    position: relative;
    display: flex;
    width: max-content;
    height: max-content;
    z-index: 2;
    border-radius: 50%;
    padding: 40px 0px;
    gap: 20px;
`;

const AccountProfilePicture = styled.img`
    width: 125px;
    height: 125px;
    border-radius: 50%;
    object-fit: cover;
`;

const ProfileNameAndInfo = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
    width: max-content;
    height: max-content;
    gap: 0px;
`;


const AccountProfileLabelName = styled.label`
    display: flex;
    font-size: 32px;
    font-weight: bold;
    font-family: "Roboto Condensed", Helvetica;
    color: ${({ theme }) => theme.text};
    margin-top: ${({ isCurrentUserUploader }) => (isCurrentUserUploader ? '0px' : '-15px')};
`;

const AccountProfileLabelInfo = styled.label`
    display: flex;
    font-size: 15px;
    color: ${({ theme }) => theme.textSoft};
    font-weight: normal;
    font-family: "Roboto Condensed", Helvetica;
`;

const AccountProfileDescriptionDiv = styled.div`
  position: relative;
  display: flex;
  width: max-content;
  height: max-content;
  align-items: center;
  gap: 5px;
`;

const AccountProfileDescription = styled.label`
    display: flex;
    font-size: 15px;
    color: ${({ theme }) => theme.textSoft};
    font-weight: normal;
    font-family: "Roboto Condensed", Helvetica;
    max-width: 500px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    white-space: normal;
    word-wrap: break-word;
    overflow-wrap: break-word;
`;

const AccountProfileDescriptionShowMore = styled.img`
  height: 15px;
  width: 15px;
  cursor: pointer;
`;

// SUBSCRIBE
const Subscribe = styled.button`
  background-color: ${({ isSubscribed }) => (isSubscribed ? 'rgb(255, 0, 192, 0.15)' : 'rgb(227, 0, 252, 0.15)')};
  border: none;
  transition: background-color 0.3s ease;
  border-radius: 5px;
  height: max-content;
  padding: ${({ isSubscribed }) => (isSubscribed ? '9px 11px' : '10px 30.5px')};
  cursor: pointer;
  margin-top: 20px;
  width: max-content;
  display: flex;
`;

const SubscribeTxt = styled.div`
  font-weight: 700;
  font-size: 15px;
  font-family: "Roboto", Helvetica;
  color: white;
  height: max-content;
  width: max-content;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const SubscribeImg = styled.img`
  height: 20px;
  width: 20px;
`;

// SHOW CHANNEL DESCRIPTION AND INFO
const AboutContainerBG = styled.div`
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background-color: #000000b9;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 3;
`;

const AboutContainer = styled.div`
    position: fixed;
    width: 600px;
    height: auto;
    background-color: rgba(36, 36, 36);
    border-radius: 8px;
    display: flex;
    flex-direction: column;
`;

const Header = styled.div`
  width: 552px;
  height: 30px;
  border-radius: 8px 8px 0px 0px;
  position: fixed;
  display: flex;
  padding: 20px 24px;
  display: flex;
  align-items: center;
  z-index: 2;
  background-color: rgba(36, 36, 36);
`;

const HeaderTitle = styled.h1`
    font-size: 20px;
    font-weight: bold;
    color: ${({ theme }) => theme.text};
    font-family: "Roboto Condensed", Helvetica;
`;

const HeaderCloseX = styled.img`
    width: 20px;
    height: 20px;
    padding: 5px;
    border-radius: 50%;
    transition: background 0.3s ease;
    cursor: pointer;
    margin-left: auto;

    &:hover {
        background: rgba(255, 255, 255, 0.1);
    }
`;

const ContentWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: calc(100% - 48px);
  height: 100%;
  margin: 70px 24px;
`;

const ChannelInfoDescriptionDiv = styled.div`
  position: relative;
  display: flex;
  width: 100%;
  height: max-content;
`;

const ChannelInfoDescription = styled.div`
  font-size: 16px; 
  font-weight: normal;
  font-family: "Roboto Condensed", Helvetica;
  color: ${({ theme }) => theme.text};
  white-space: pre-line; 
  z-index: 1;
  line-height: 1.25;
  overflow: hidden;
`;

const EditChannelInfoDescription = styled.textarea`
  font-size: 16px; 
  font-weight: normal;
  font-family: "Roboto Condensed", Helvetica;
  color: ${({ theme }) => theme.text};
  background: rgba(64, 62, 62, 0.4);
  padding: 10px 10px 7px 10px;
  width: calc(100% - 20px);
  height: 161px;
  border: none;
  outline: none;
  resize: none;
  line-height: 1.25;
  border-radius: 5px;
`;


const EditChannelInfoDescriptionCharCounter = styled.h1`
  font-size: 14px; 
  font-weight: normal;
  font-family: "Roboto Condensed", Helvetica;
  color: ${({ theme }) => theme.textSoft};
  background: transparent;
  width: max-content;
  height: max-content;
  margin-left: auto;
  margin-left: auto;
`;

const EditChannelInfoDescriptionButtons = styled.div`
  position: relative;
  display: flex;
  width: 100%;
  height: max-content;
  background-color: transparent;
  padding: 0px;
  bottom: 0px;
  align-items: center;
  margin-top: 10px;
  margin-bottom: -8px;
`;

const EditChannelInfoDescriptionSave = styled.button`
  border: none;
  width: max-content;;
  height: max-content;
  padding: 6px 14px;
  border-radius: 3px;
  position: relative;
  font-size: 15px;
  font-weight: normal;
  font-family: "Roboto Condensed", Helvetica;
  cursor: pointer;
  background: rgba(115, 20, 74, 0.5);
  color: ${({ theme }) => theme.text};
  margin-left: 12px;
  margin-right: 0px;

`;

const OtherTitle = styled.h1`
    font-size: 20px;
    font-weight: bold;
    color: ${({ theme }) => theme.text};
    font-family: "Roboto Condensed", Helvetica;
    margin-top: 40px;
    margin-bottom: 10px;
`;

const ChannelDetailsItem = styled.div`
  position: relative;
  display: flex;
  width: max-content;
  height: max-content;
  background-color: transparent;
  padding: 12px 0px;
  align-items: center;
  text-align: center;
  gap: 15px;
`;

const ChannelDetailsItemImg = styled.img`
    width: 22px;
    height: 22x;
`;

const ChannelDetailsItemTxt = styled.span`
  font-size: 15px;
  font-weight: regular;
  color: ${({ theme }) => theme.text};
  font-family: "Roboto Condensed", Helvetica;
`;

// CARDS CONTAINER

const CardsContainer = styled.div`
  display: flex; 
  justify-content: flex-start; 
  flex-wrap: wrap;
  gap: 16.67px;
  margin-top: 20px;
`;

// NO VIDEOS

const NoVideosContainer = styled.h1`
  position: relative;
  display: flex;
  padding-top: 140px;
  margin: auto;
  font-size: 18px;
  font-weight: bold;
  color: ${({ theme }) => theme.text};
  font-family: "Roboto Condensed", Helvetica;
`;

// PLAYLISTS CONTAINER

const PlaylistsContainer = styled.div`
  display: flex;
  justify-content: flex-start; 
  flex-wrap: wrap;
  gap: 14px;
  margin-top: 10px;
`;

const Channel = () => {
  const [anyPopupOpen, setAnyPopupOpen] = useState(false);

  // GET SPECIFIC ROUTE
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const accountParam = parseInt(searchParams.get('account'));
  const navigate = useNavigate();

  // CURRENT USER INFO
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  // INPUTS
  const [inputs, setInputs] = useState({});

  // TRANSLATION
  const { language, setLanguage } = useLanguage();

  const translations = {
    en: {
      explore: "Library",
    },
    es: {
      explore: "Librería",
    },
  };

  // FETCH USER INFO
  const rawUsername = useLocation().pathname.split("/")[2];
  const Username = rawUsername.startsWith('@') ? rawUsername?.slice(1) : rawUsername;
  const [channel, setChannel] = useState({});
  const [videos, setVideos] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [channelExists, setChannelExists] = useState(true);
  const [currentSuscriptionCounter, setCurrentSuscriptionCounter] = useState(0);
  const currentURL = window.location.href;

  // SETTINGS SECTIONS DEFINITION
  const accountSections = [
    "Videos",
    "Playlists",
  ];

  const [accountSection, setAccountSection] = useState(accountParam && accountParam >= 0 && accountParam < 2 ? accountSections[accountParam] : accountSections[0]);

  // RESET SCROLL
  const scrollToTop = () => {
    window.scrollTo(0, 0);
  };


  useEffect(() => {
    scrollToTop();
  }, []);


  // FETCH USER CHANNEL INFO AND VIDEOS
  const isCurrentUserUploader = currentUser?._id === channel?._id;
  const [sortType, setSortType] = useState('lastest');
  const [sortTypePlaylist, setSortTypePlaylist] = useState('lastest');
  const [fetchUpdated, setFetchUpdated] = useState(false);
  const [pageLoaded, setpageLoaded] = useState(false);
  const [noVideosFound, setNoVideosFound] = useState(false);
  const [noPlaylistFound, setNoPlaylistFound] = useState(false);

  useEffect(() => {

    const fetchData = async () => {
      setFetchUpdated(false);

      try {
        const channelRes = await axios.get(`/users/findbyusername/${Username}`);
        setChannel(channelRes.data);
        setCurrentSuscriptionCounter(channelRes.data.subscribers?.length);
        const isCurrentUserUploaderInternal = currentUser?._id === channelRes.data._id;

        try {
          let res;
          if (isCurrentUserUploaderInternal) {
            res = await axios.get(`/videos/user/allvideos`, {
              params: { sort: sortType }
            });
          } else {
            res = await axios.get(`/videos/user/${channelRes.data._id}/publicVideos`, {
              params: { sort: sortType }
            });
          }

          if (!res.data.length > 0) {
            setNoVideosFound(true);
          }


          if (sortType === 'lastest') {
            const sortedVideos = res.data.sort((a, b) => {
              const dateA = new Date(a.createdAt);
              const dateB = new Date(b.createdAt);
              return dateB - dateA;
            });
            setVideos(sortedVideos);
          } else {
            setVideos(res.data);
          }

        } catch (error) {
          console.error("Error fetching videos:", error);
        }

        try {
          let response;

          if (isCurrentUserUploaderInternal) {
            response = await axios.get(`/users/playlists`, {
              params: { sort: sortTypePlaylist }
            });
          } else {
            response = await axios.get(`/users/${channelRes.data._id}/playlists/public`, {
              params: { sort: sortTypePlaylist }
            });
          }
          if (!response.data.length > 0) {
            setNoPlaylistFound(true);
          }


          if (sortTypePlaylist === 'lastest') {
            const sortTypePlaylist = response.data.sort((a, b) => {
              const dateA = new Date(a.lastUpdated);
              const dateB = new Date(b.lastUpdated);
              return dateB - dateA;
            });
            setPlaylists(sortTypePlaylist);
          } else {
            setPlaylists(response.data);
          }
        } catch (error) {
          console.error("Error fetching playlists:", error);
        }
        setpageLoaded(true);

      } catch (err) {
        setChannelExists(false);
      }
    };

    fetchData();

  }, [Username, isCurrentUserUploader, sortType, fetchUpdated, sortTypePlaylist]);

  // SUBSCRIBE CHANNEL
  const handleSub = async () => {
    if (!currentUser) {
      setSubscribePopupVisible(true);
      return;
    }

    // Verificar si el usuario está suscrito o no y realizar la acción correspondiente
    if (currentUser.subscribedUsers.includes(channel?._id)) {
      // Usuario ya está suscrito, realizar acción de desuscripción
      await axios.put(`/users/unsub/${channel?._id}`);
      setCurrentSuscriptionCounter(currentSuscriptionCounter - 1);
      toast.success('Unsubscription successfull');
    } else {
      // Usuario no está suscrito, realizar acción de suscripción
      await axios.put(`/users/sub/${channel?._id}`);
      setCurrentSuscriptionCounter(currentSuscriptionCounter + 1);
      toast.success('Suscription successfull');
    }

    // Despachar la acción para actualizar el estado global (si es necesario)
    dispatch(subscription(channel?._id));
  };


  // POPUP EDIT OR SHOW CHANNEL DESCRIPTION
  const [isChannelDescriptionPopup, setIsChannelDescriptionPopup] = useState(false);

  const handleToggleChannelDescriptionPopup = () => {
    setIsChannelDescriptionPopup(!isChannelDescriptionPopup);
  };

  // EDIT CHANNEL DESCRIPTION
  const handleChangeDescription = (e) => {
    const { value } = e.target;

    if (value.length <= 300) {
      setInputs((prev) => {
        return { ...prev, description: value };
      });
    }
  };

  const handleSaveChannelDescription = async () => {
    try {

      if (inputs.description === undefined) { return; }

      const response = await axios.post(`/users/updateDescription`, { description: inputs.description });

      const toastPromise = toast.promise(
        Promise.resolve(response),
        {
          pending: 'Updating channel description',
          success: 'Channel description updated successfully',
          error: 'There was an error updating your description'
        }
      );

      const res = await toastPromise;

      dispatch(userUpdated(res.data));
      setFetchUpdated(true);

    } catch (error) {
      console.error("Error updating channel description:", error);
    }
  };

  // PLAYLISTS



  // FORMATS
  const formatDate = (createdAt) => {
    const date = new Date(createdAt);
    const options = { month: 'short', day: '2-digit', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  const formatNumbers = (number) => {
    if (number >= 1000000000) {
      return `${(number / 1000000000).toFixed(1)}B`;
    } else if (number >= 1000000) {
      return `${(number / 1000000).toFixed(1)}M`;
    } else if (number >= 1000) {
      return `${(number / 1000).toFixed(1)}K`;
    } else {
      return number?.toString();
    }
  };

  return (
    <MainContainer>
      {pageLoaded && (
        <>
          <Container>
            <Wrapper anyPopupOpen={anyPopupOpen}>

              <AccountPresentationSection>

                <AccountProfileBanner src={channel?.banner ? channel?.banner : BannerPlaceholder} />

                <ProfilePictureAndInfoDiv>
                  <AccountProfilePicture src={channel?.img} />
                  <ProfileNameAndInfo>
                    <AccountProfileLabelName isCurrentUserUploader={isCurrentUserUploader}> {channel?.displayname} </AccountProfileLabelName>
                    <AccountProfileLabelInfo style={{ marginTop: '5px' }}>
                      @{channel?.name} · {formatNumbers(currentSuscriptionCounter)} subscribers · {formatNumbers(channel?.videosPosted)} videos
                    </AccountProfileLabelInfo>
                    <AccountProfileDescriptionDiv style={{ marginTop: '18px' }}>
                      <AccountProfileDescription>
                        {channel?.description ? channel?.description : 'No description'}

                      </AccountProfileDescription>

                      {!isCurrentUserUploader && (
                        <AccountProfileDescriptionShowMore src={ArrowDown} onClick={handleToggleChannelDescriptionPopup} />
                      )}

                      {isCurrentUserUploader && (
                        <AccountProfileDescriptionShowMore src={EditIcono} style={{ marginTop: '-2px' }} onClick={handleToggleChannelDescriptionPopup} />
                      )}

                    </AccountProfileDescriptionDiv>

                    {currentUser && !isCurrentUserUploader && (
                      <Subscribe
                        onClick={handleSub}
                        isSubscribed={currentUser?.subscribedUsers?.includes(channel?._id)}
                      >
                        {currentUser?.subscribedUsers?.includes(channel?._id) ?
                          <SubscribeTxt>
                            <SubscribeImg src={SubscribedIcon} />
                            SUBSCRIBED
                          </SubscribeTxt>
                          :
                          <SubscribeTxt>
                            SUBSCRIBE
                          </SubscribeTxt>
                        }
                      </Subscribe>

                    )}

                  </ProfileNameAndInfo>
                </ProfilePictureAndInfoDiv>

              </AccountPresentationSection>

              <SectionLine>

                {accountSections.map((section, index) => (
                  <SectionTitle
                    key={index}
                    style={{ borderColor: accountSection === section ? 'rgba(255, 255, 255, 0.8)' : '' }}
                    onClick={() => {
                      setAccountSection(section);
                      navigate(`/channel/@${channel?.name}?account=${index}`);
                    }}
                  >
                    {section}
                  </SectionTitle>
                ))}
              </SectionLine>

              {accountSection === accountSections[0] && (
                <>
                  {noVideosFound ? (
                    <>
                      <NoVideosContainer>
                        This channel has not uploaded any videos
                      </NoVideosContainer>
                    </>
                  ) : (
                    <>
                      <SortContainer>
                        <SortItem
                          onClick={() => {
                            setSortType('lastest');
                          }}
                          sortType={sortType === 'lastest' ? true : false}
                        >
                          Lastest
                        </SortItem>

                        <SortItem
                          onClick={() => {
                            setSortType('popular');
                          }}
                          sortType={sortType === 'popular' ? true : false}
                        >
                          Popular
                        </SortItem>

                        <SortItem
                          onClick={() => {
                            setSortType('oldest');
                          }}
                          sortType={sortType === 'oldest' ? true : false}
                        >
                          Oldest
                        </SortItem>
                      </SortContainer>

                      <CardsContainer>
                        {videos.map((video) => (
                          <CardChannel
                            key={video?._id}
                            video={video}
                            isCurrentUserUploader={isCurrentUserUploader}
                            setAnyPopupOpen={setAnyPopupOpen}
                            anyPopupOpen={anyPopupOpen}
                            setFetchUpdated={setFetchUpdated}
                          />
                        ))}
                      </CardsContainer>
                    </>
                  )}

                </>
              )}

              {accountSection === accountSections[1] && (
                <>
                  {noPlaylistFound ? (
                    <>
                      <NoVideosContainer>
                        This channel doesn't have any public playlist
                      </NoVideosContainer>
                    </>
                  ) : (
                    <>
                      <SortContainer>
                        <SortItem
                          onClick={() => {
                            setSortTypePlaylist('lastest');
                          }}
                          sortType={sortTypePlaylist === 'lastest' ? true : false}
                        >
                          Lastest Updated
                        </SortItem>

                        <SortItem
                          onClick={() => {
                            setSortTypePlaylist('oldest');
                          }}
                          sortType={sortTypePlaylist === 'oldest' ? true : false}
                        >
                          Oldest Updated
                        </SortItem>
                      </SortContainer>

                      <PlaylistsContainer>
                        {playlists.map((playlist) => (
                          <CardChannelPlaylist
                            key={playlist?._id}
                            playlist={playlist}
                            isCurrentUserUploader={isCurrentUserUploader}
                          />
                        ))}
                      </PlaylistsContainer>

                    </>
                  )}

                </>
              )}

            </Wrapper>

          </Container>
        </>
      )}


      {
        isChannelDescriptionPopup && (

          <AboutContainerBG>
            <AboutContainer>

              <Header>
                <HeaderTitle> About </HeaderTitle>
                <HeaderCloseX src={CloseXGr} onClick={handleToggleChannelDescriptionPopup} />
              </Header>
              <ContentWrapper style={{ marginBottom: '30px' }}>

                {isCurrentUserUploader ? (
                  <>
                    <ChannelInfoDescriptionDiv>
                      <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: 'max-content' }}>
                        <EditChannelInfoDescription
                          type="text"
                          name="description"
                          placeholder={currentUser?.description || currentUser?.description?.length > 0
                            ? currentUser?.description
                            : 'Add a description to your channel'}
                          value={inputs?.description !== undefined ? inputs.description : currentUser?.description}
                          onChange={handleChangeDescription}
                          descriptionTxt={currentUser?.description}
                        />

                        <EditChannelInfoDescriptionButtons>

                          <EditChannelInfoDescriptionCharCounter>
                            {inputs?.description !== undefined ? inputs?.description?.length : (currentUser?.description ? currentUser?.description.length : 0)}/300
                          </EditChannelInfoDescriptionCharCounter>

                          <EditChannelInfoDescriptionSave onClick={handleSaveChannelDescription} > Save </EditChannelInfoDescriptionSave>
                        </EditChannelInfoDescriptionButtons>
                      </div>
                    </ChannelInfoDescriptionDiv>
                  </>
                ) : (
                  <>
                    <ChannelInfoDescription>
                      {channel?.description && channel?.description?.length > 0 ? (
                        channel?.description
                      ) : (
                        <>
                          No description
                        </>
                      )}
                    </ChannelInfoDescription>
                  </>
                )}

                <OtherTitle> Channel details </OtherTitle>

                <ChannelDetailsItem>
                  <ChannelDetailsItemImg src={EmailIcon} />
                  <ChannelDetailsItemTxt style={{ marginTop: '-2px' }}> {channel?.email} </ChannelDetailsItemTxt>
                </ChannelDetailsItem>

                <ChannelDetailsItem>
                  <ChannelDetailsItemImg src={URLIcon} />
                  <ChannelDetailsItemTxt> {currentURL} </ChannelDetailsItemTxt>
                </ChannelDetailsItem>

                <ChannelDetailsItem>
                  <ChannelDetailsItemImg src={SubscribersIcon} />
                  <ChannelDetailsItemTxt> {formatNumbers(channel?.subscribers?.length)} subscribers </ChannelDetailsItemTxt>
                </ChannelDetailsItem>

                <ChannelDetailsItem>
                  <ChannelDetailsItemImg src={VideosPostedIcon} />
                  <ChannelDetailsItemTxt> {formatNumbers(channel?.videosPosted)} videos </ChannelDetailsItemTxt>
                </ChannelDetailsItem>

                <ChannelDetailsItem style={{ paddingBottom: '0px' }}>
                  <ChannelDetailsItemImg src={InfoChannelIcon} />
                  <ChannelDetailsItemTxt> Joined {formatDate(channel?.createdAt)} </ChannelDetailsItemTxt>
                </ChannelDetailsItem>

              </ContentWrapper>
            </AboutContainer>
          </AboutContainerBG>

        )
      }
      {pageLoaded && (
        <Footer />
      )}
    </MainContainer>
  );
};


export default Channel;