import React, { useState, useEffect, useRef, useContext } from "react";
import styled, { css, keyframes } from "styled-components";
import { useDispatch, useSelector } from 'react-redux';
import { subscription } from "../redux/userSlice";
import { useLanguage } from '../utils/LanguageContext';
import { Link, useNavigate, useLocation } from "react-router-dom";
import BannerPlaceholder from '../assets/BannerPlaceholder.jpg';
import SubscribedIcon from '../assets/SubscribedIcon.png';
import ArrowDown from '../assets/ArrowDownG.png';
import EditIcono from "../assets/EditIconoG.png";
import { toast } from 'react-toastify';
import axios from "axios";

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
  margin: 56px 350px;
  padding: 0px 50px 40px 50px;
  display: flex;
  flex-direction: column;
`;

// SEPARATOR LINE
const Line = styled.div`
    height: 1px;
    width: 100%;
    background-color: rgba(168, 167, 168, 0.4);
    margin: 40px 0px 15px 0px;
`;

// ACCOUNT PRESENTATION SECTION
const AccountPresentationSection = styled.div`
    position: relative;    
    display: flex;
    flex-direction: column;
    gap: 3px;
    height: max-content;
    margin-bottom: 35px;
`;

const AccountProfileBanner = styled.img`
    position: relative;    
    width: 100%;
    height: 300px;
    object-fit: cover;
    z-index: 1;
    border-radius: 8px 8px 0px 0px;
`;

const ProfilePictureAndInfoDiv = styled.div`
    position: relative;
    display: flex;
    width: max-content;
    height: max-content;
    margin-bottom: 8px;
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
  cursor: pointer;
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

const Channel = () => {
  // CURRENT USER INFO
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();

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
  const Username = rawUsername.startsWith('@') ? rawUsername.slice(1) : rawUsername;
  const [channel, setChannel] = useState({});
  const [channelExists, setChannelExists] = useState(true);
  const [currentSuscriptionCounter, setCurrentSuscriptionCounter] = useState(0);

  useEffect(() => {

    const fetchData = async () => {
      try {
        const channelRes = await axios.get(`/users/findbyusername/${Username}`);
        setChannel(channelRes.data);
        setCurrentSuscriptionCounter(channelRes.data.subscribers.length);
      } catch (err) {
        setChannelExists(false);
      }
    };

    fetchData();

  }, [Username]);

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

  const isCurrentUserUploader = currentUser?._id === channel?._id;

  // POPUP EDIT OR SHOW CHANNEL DESCRIPTION
  const [isChannelDescriptionPopup, setIsChannelDescriptionPopup] = useState(false);

  const handleToggleChannelDescriptionPopup = () => {
    try {
      setIsChannelDescriptionPopup(!isChannelDescriptionPopup);
    } catch (err) {
      //
    }
  };

  return (
    <MainContainer>
      <Container>
        <Wrapper>

          <AccountPresentationSection>

            <AccountProfileBanner src={channel?.banner ? channel?.banner : BannerPlaceholder} />

            <ProfilePictureAndInfoDiv>
              <AccountProfilePicture src={channel?.img} />
              <ProfileNameAndInfo>
                <AccountProfileLabelName isCurrentUserUploader={isCurrentUserUploader}> {channel?.displayname} </AccountProfileLabelName>
                <AccountProfileLabelInfo style={{ marginTop: '5px' }}>
                  @{channel?.name} · {currentSuscriptionCounter} subscribers · {channel?.videosPosted} videos
                </AccountProfileLabelInfo>
                <AccountProfileDescriptionDiv style={{ marginTop: '18px' }}>
                  <AccountProfileDescription>
                    {channel?.description ? channel?.description : 'No description'}
                  </AccountProfileDescription>

                  {!isCurrentUserUploader && channel?.description && channel?.description?.length > 0 && (
                    <AccountProfileDescriptionShowMore src={ArrowDown} onClick={handleToggleChannelDescriptionPopup} />
                  )}

                  {isCurrentUserUploader && (
                    <AccountProfileDescriptionShowMore src={EditIcono} style={{ marginTop: '-2px' }} onClick={handleToggleChannelDescriptionPopup} />
                  )}

                </AccountProfileDescriptionDiv>

                {!isCurrentUserUploader && (
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

          <Line />

        </Wrapper>

      </Container>
    </MainContainer>
  );
};


export default Channel;