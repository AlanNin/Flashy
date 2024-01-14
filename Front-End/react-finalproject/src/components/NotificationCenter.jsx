import axios from "axios";
import React, { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import CardNotification from "./CardNotification";

const Container = styled.div`
    position: fixed;
    width: 525px;
    height: 600px;
    top: 45px;
    right: 135px;
    display: flex;
    background-color: rgba(36, 36, 36);
    border-radius: 8px;
    z-index: 3;
    display: flex;
    flex-direction: column;
`;

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  margin: 10px 0px;
`;

const Header = styled.div`
  width: calc(100% - 30px);
  height: 30px;
  position: relative;
  display: flex;
  padding: 15px 15px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.15);
`;

const HeaderTitle = styled.h1`
    font-size: 24px;
    font-weight: bold;
    color: ${({ theme }) => theme.textSoft};
    font-family: "Roboto Condensed", Helvetica;
`;


const CardContainer = styled.div`
  width: 100%;
  gap: 10px;
  margin-top: 5px;
  height: max-content;
  position: relative;
  display: flex;
  flex-direction: column;
`;

const NotificationCenter = ({ }) => {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await axios.get("/users/notifications", {
                });
                setNotifications(response.data.notifications);
            } catch (error) {
                console.error("Error fetching notifications:", error);
            }
        };

        fetchNotifications();
    }, []);

    return (

        <Container>

            <Header>
                <HeaderTitle> Notifications </HeaderTitle>
            </Header>

            <Wrapper>
                <CardContainer>
                    {notifications.map((notification) => (
                        <CardNotification key={notification._id} notification={notification} />
                    ))}
                    {notifications.map((notification) => (
                        <CardNotification key={notification._id} notification={notification} />
                    ))}
                </CardContainer>
            </Wrapper>

        </Container>
    );
};

export default NotificationCenter;