import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import styled from "styled-components";

const TitleOverlay = styled.h1`
  position: absolute;
  top: 50%;
  left: 50%;
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
  max-width: 140px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  white-space: normal;
  word-wrap: break-word;
  overflow-wrap: break-word;
`;

const Image = styled.img`
  background-color: #999;
  flex: 1;
  border-radius: 13px;
  filter: grayscale(100%) blur(3px) brightness(0.5);
  transition: filter 0.4s;
  object-fit: cover; 
  width: 100%;

`;

const Container = styled.div`
  position: relative;
  display: flex;
  width: 200px;
  height: 115px;
  margin-left: 5px;

  &:hover {
    ${TitleOverlay} {
      background-color: rgb(158, 16, 90);
    }
  }

  &:hover {
    ${Image} {
      filter: grayscale(0%) blur(1.5px) brightness(1);
    }
  }
`;


const CardRelated = ({ video }) => {
  return (
    <Link to={`/video/${video._id}`} style={{ textDecoration: "none" }}>
      <Container>
        <Image src={video.imgUrl} />
        <TitleOverlay> {video.title} </TitleOverlay>
      </Container>
    </Link>
  );
};

export default CardRelated;
