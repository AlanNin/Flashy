import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import Miniatura from "../assets/Miniatura2.jpg";
import Miniaturahxh from "../assets/Miniaturahxh.jpg";

// Define TitleOverlay before using it in Container
const TitleOverlay = styled.h1`
  position: absolute;
  top: 50%;
  left: 100px;
  transform: translate(-50%, -50%);
  font-size: 14px;
  font-family: "Roboto Condensed", Helvetica;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
  text-align: center;
  margin: 0;
  background-color: transparent;
  transition: background-color 0.4s;
  padding: 2px 5px;
  border-radius: 8px;
`;

const Image = styled.img`
  width: 200px;
  height: 105px;
  background-color: #999;
  flex: 1;
  border-radius: 13px;
  filter: grayscale(100%) blur(4px) brightness(0.5);
  transition: filter 0.4s;

`;

const Container = styled.div`
  display: flex;
  width: 150px;
  height: 105px;
  margin-left: 7px;

  &:hover {
    ${TitleOverlay} {
      background-color: rgb(158, 16, 90);
    }
  }

  &:hover {
    ${Image} {
      filter: grayscale(0%) blur(2px) brightness(1); /* Aplica los valores opuestos en hover */
    }
  }
`;


const CardRelated = ({ type }) => {
  return (
    <Link to="/video/test" style={{
      textDecoration: "none",
      color: "inherit"
    }}>
      <Container type={type}>
        <Image type={type} src={Miniaturahxh} />
        <TitleOverlay>HunterxHunter EP2 : S1</TitleOverlay>
      </Container>
    </Link>
  );
};

export default CardRelated;
