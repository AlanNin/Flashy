import React, { useState, useEffect, useRef } from "react";
import styled, { keyframes } from "styled-components";
import CardNotification from "./CardNotification";
import SettingsIcon from "../assets/SettingsIcon.png";
import NoNotificationsImg from "../assets/NoNotificationsImg.webp";
import { Link, useNavigate } from "react-router-dom";

const Container = styled.div`
    position: fixed;
    width: 525px;
    height: 600px;
    top: 45px;
    right: 135px;
    background-color: rgba(36, 36, 36);
    border-radius: 8px;
    z-index: 3;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    overflow-y: ${({ notificationsLoaded }) => (notificationsLoaded ? 'auto' : 'hidden')}; 

    &::-webkit-scrollbar {
        width: 0px;
      }
`;

const IsShowingContainer = styled.div`
    display: flex;
    flex-direction: column;
    visibility: ${({ notificationsLoaded }) => (notificationsLoaded ? 'visible' : 'hidden')}; 
    margin-top: 60px;
`;

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  margin: 10px 0px;
`;

const Header = styled.div`
  width: 495px;
  height: 30px;
  border-radius: 8px 8px 0px 0px;
  position: fixed;
  display: flex;
  padding: 15px 15px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.15);
  display: flex;
  align-items: center;
  z-index: 2;
  background-color: rgba(36, 36, 36);
`;

const HeaderTitle = styled.h1`
    font-size: 24px;
    font-weight: bold;
    color: ${({ theme }) => theme.textSoft};
    font-family: "Roboto Condensed", Helvetica;
    margin-left: 6px;
`;

const HeaderSettingsImg = styled.img`
    width: 29px;
    height: 29px;
    padding: 6px;
    border-radius: 50%;
    transition: background 0.3s ease;
    cursor: pointer;
    margin-left: auto;

    &:hover {
        background: rgba(255, 255, 255, 0.1);
    }
`;

const CardContainer = styled.div`
  width: 100%;
  gap: 10px;
  margin-top: 5px;
  height: max-content;
  position: relative;
  display: flex;
  flex-direction: column;
  padding-bottom: 10px;
`;

// LOADING

const rotate = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

const LoadingContainer = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  top: 0px;
`;

const LoadingCircle = styled.div`
  border: 4px solid #f3f3f3;
  border-top: 4px solid #7932a8;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: ${rotate} 1s linear infinite;
`;

// NOTIFICATIONS EMPTY
const NotificationsEmptyDiv = styled.div`
    position: absolute;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: 100%;
    margin-top: -10px;
`;

const NotificationsEmptyImg = styled.img`
    width: 150px;
    height: 150px;
`;

const NotificationsEmptyTxt = styled.h1`
    font-size: 24px;
    font-weight: normal;
    color: ${({ theme }) => theme.text};
    font-family: "Roboto Condensed", Helvetica;
    margin-left: 6px;
`;

const NotificationCenter = ({ notifications, handleNotificationCenter, notificationButtonRef }) => {

    const [notificationsLoaded, setNotificationsLoaded] = useState(false);
    const [notificationsEmpty, setNotificationsEmpty] = useState(false);
    const notificationRef = useRef(null);
    const navigate = useNavigate();

    // CLOSE POPUP ON CLICK OUTSIDE 
    useEffect(() => {
        if (notifications?.length === 0) {
            setNotificationsEmpty(true);
        } else {
            setNotificationsEmpty(false);
        }
    }, [notifications]);

    // CLOSE POPUP ON CLICK OUTSIDE 
    useEffect(() => {
        const handleClickOutside = (event) => {

            if (
                notificationRef.current &&
                !notificationRef.current.contains(event.target) &&
                notificationButtonRef.current &&
                !notificationButtonRef.current.contains(event.target)
            ) {
                handleNotificationCenter();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [notificationRef, notificationButtonRef]);


    // GO TO NOTIFICATION SETTINGS
    const handleGoToNotificationSettings = () => {
        handleNotificationCenter();
        navigate("/settings?settings=1");
    };

    return (
        <Container notificationsLoaded={notificationsLoaded} ref={notificationRef}>
            <Header>
                <HeaderTitle> Notifications </HeaderTitle>
                <HeaderSettingsImg src={SettingsIcon} onClick={handleGoToNotificationSettings} />
            </Header>
            <IsShowingContainer notificationsLoaded={notificationsLoaded}>

                <Wrapper>
                    <CardContainer>
                        {notifications.map((notification) => (
                            <CardNotification key={notification._id} notification={notification} setNotificationsLoaded={setNotificationsLoaded} handleNotificationCenter={handleNotificationCenter} />
                        ))}
                    </CardContainer>
                </Wrapper>

            </IsShowingContainer>

            {!notificationsEmpty && !notificationsLoaded && (
                <LoadingContainer>
                    <LoadingCircle />
                </LoadingContainer>
            )}

            {notificationsEmpty && (
                <NotificationsEmptyDiv>
                    <NotificationsEmptyImg src={NoNotificationsImg} />
                    <NotificationsEmptyTxt> You don't have any notification </NotificationsEmptyTxt>
                </NotificationsEmptyDiv>
            )}

        </Container>

    );
};

export default NotificationCenter;