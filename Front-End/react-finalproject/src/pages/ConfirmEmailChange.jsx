import React, { useState, useEffect, useRef, useContext } from "react";
import styled, { css, keyframes } from "styled-components";
import { useDispatch, useSelector } from 'react-redux';
import { useLanguage } from '../utils/LanguageContext';
import { Link, useNavigate, useLocation } from "react-router-dom";
import NotFound404Component from "../components/NotFound404Component";
import axios from "axios";
import AccountVerifiedIlustration from '../assets/AccountVerifiedIlustration.webp';
import { userUpdated } from "../redux/userSlice";

// NORMAL SECUENCE
const Container = styled.div`
  position: relative;
  margin: auto;
  min-height: 100vh;
  background-color: rgba(15, 12, 18);
  max-width: 1920px;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Content = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: -50px;
`;

const AccountVerifiedIlustrationImg = styled.img`
  width: 300px;
  heigth: auto;
  border-radius: 50%;
`;

const Label = styled.label`
    display: flex;
    font-size: 24px;
    font-weight: bold;
    font-family: "Roboto Condensed", Helvetica;
    color: ${({ theme }) => theme.text};
    margin-bottom: 40px;
`;

const GoHomeButton = styled.a`
  display: block;
  background: linear-gradient(
    45deg,
    #8e44ad,    /* Morado */
    #8e44ad,    /* Morado */
    #ff6b6b,    /* Rojo coral */
    #ff93a0    /* Rosa menos claro */
  );
  border-radius: 10px;
  height: 50px;
  width: max-content;
  text-align: center;
  text-decoration: none;
  color: white;
  line-height: 50px;
  font-size: 22px;
  padding: 1px 41px;
  top: 31em;
  white-space: nowrap;
  transition: background 0.5s ease;
  overflow: hidden;
  text-shadow: 0.1em 0.1em 0 #111;
  font-family: "Roboto Condensed", Helvetica;
  -webkit-mask-image: -webkit-radial-gradient(white, black);

  &:before {
    content: '';
    position: absolute;
    width: 20px;
    height: 100px;
    background: white;
    bottom: -25px;
    left: 0;
    border: 2px solid transparent;
    transform: translateX(-50px) rotate(45deg);
    transition: transform 0.5s ease;
  }

  &:hover {
    padding: 0 40px;
    border: 1px solid white;
    background: transparent;

    &:before {
      transform: translateX(250px) rotate(45deg);
    }
  }
`;

// IF TOKEN NOT FOUND
const Container404 = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  z-index: 4;
`;


const ConfirmEmailChange = () => {
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

  // GET TOKEN
  const token = useLocation().pathname.split("/")[2];

  // VALIDATION IF VERIFICATION
  const [verificationAvailable, setVerificationAvailable] = useState(true);

  useEffect(() => {
    const ConfirmEmailChangeRequest = async () => {
      try {
        const response = await axios.get(`/users/confirmEmailChange/${token}`);
        const wasConfirmed = response.data;

        if (wasConfirmed && wasConfirmed.success) {
          setVerificationAvailable(true);

          const res = await axios.get(`/users/find/${currentUser?._id}`);
          dispatch(userUpdated(res.data));
        }

      } catch (error) {
        console.log(error);
      }
    }

    ConfirmEmailChangeRequest();

  }, []);

  return (
    <>
      {verificationAvailable ? (
        <Container>
          <Content>
            <AccountVerifiedIlustrationImg src={AccountVerifiedIlustration} />
            <Label> Email Updated Successfully! </Label>

            <Link to={"/settings"} style={{ width: 'max-content', height: 'max-content', top: '0em', left: 'calc(50% - 102px)', textDecoration: 'none' }}>
              <GoHomeButton> Go to Settings </GoHomeButton>
            </Link>

          </Content>
        </Container>
      ) : (
        <Container404>
          <NotFound404Component />
        </Container404>
      )}

    </>

  );
};


export default ConfirmEmailChange;