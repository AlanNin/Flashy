import React, { useState, useEffect, useRef, useContext } from "react";
import styled from "styled-components";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import ThumbDownOffAltOutlinedIcon from "@mui/icons-material/ThumbDownOffAltOutlined";
import ReplyOutlinedIcon from "@mui/icons-material/ReplyOutlined";
import AddTaskOutlinedIcon from "@mui/icons-material/AddTaskOutlined";
import Comments from "../components/Comments";
import Card from "../components/Card";
import CardRecommendation from "../components/CardRecommendation";
import CardRelatedVideos from "../components/CardRelated";
import VideoLikeIcono from "../assets/VideoLikeIcono.png";
import VideoLikedIcono from "../assets/VideoLikedIcono.png";
import VideoDislikeIcono from "../assets/VideoDislikeIcono.png";
import VideoDislikedIcono from "../assets/VideoDislikeIcono.png";
import VideoShareIcono from "../assets/VideoShareIcono.png";
import VideoSaveIcono from "../assets/VideoSaveIcono.png";
import VideoSavedIcono from "../assets/VideoSavedIcono.png";
import RelatedSlider from "../components/RelatedSlider";
import MiniaturaTheBoys from "../assets/MiniaturaTheBoys.jpg"
import Miniaturahxh1 from "../assets/Miniaturahxh1.jpg"
import CanalIcono from "../assets/CanalIconoG.png"
import DuracionIcono from "../assets/DuracionIconoG.png"
import FechaIcono from "../assets/FechaIconoG.png"
import MadHouseLogo from "../assets/MadHouseLogo.jpg"

const Container = styled.div`
  display: flex;
  gap: 24px;
  padding: 101px 273px 0px 273px;
  background-color: rgba(15, 12, 18);
`;

const Content = styled.div`
  flex: 5;
`;
const VideoWrapper = styled.div``;

const Buttons = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  padding: 20px;
  color: ${({ theme }) => theme.text};
`;


const Button = styled.div`
  display: flex;
  font-size: 18px;
  font-family: "Roboto Condensed", Helvetica;
  font-weight: normal;
  align-items: center;
  gap: 3px;
  cursor: pointer;
`;

const ButtonsImg = styled.img`
    width: 25px;
    height: 25px;
`;

const RelatedVideos = styled.div`
  position: relative;
  display: flex;
  height: auto;
  padding: 0px 0px 80px 0px;
`;

const VideoInfo = styled.div`
  position: relative;
  display: flex;
  height: auto;
  width: auto;
  padding: 15px 0px 10px 0px;
`;

const VideoImg = styled.img`
  height: 306px;
  width: 211px;
`;

const VideoOtherInfo = styled.div`
  display: flex;
  flex-direction: column;
  height: auto;
  width: auto;
  margin-left: 22px;
`;

const Title = styled.h1`
  font-size: 20px;
  font-family: "Roboto Condensed", Helvetica;
  font-weight: 400;
  top: 10px;
  color: ${({ theme }) => theme.text};
  padding: 0px 0px 10px 0px;
`;

const ContenedorIconosTextos = styled.div`
  display: flex;
  top: 233px;
  left: 45px;
  padding: 0px 0px 20px 0px;
`;

const EstiloIconos = styled.img`
  width: 18px;
  height: 18px;
  object-fit: cover;
  margin-left: 25px;
`;

const ChannelIcon = styled(EstiloIconos)`
margin-left: 0px;
`;


const EstiloTextos = styled.h1`
  color: #c4c4c4;
  font-size: 16px;
  margin-left: 3px;
  font-weight: normal;
  font-family: "Roboto Condensed", Helvetica;
`;

const Description = styled.p`
  width: 710px;
  color: #c4c4c4;
  font-size: 16px;
  font-family: "Roboto Condensed", Helvetica;
  font-weight: normal;
  padding: 0px 0px 50px 0px;
  max-height: 110px;
`;

const Subscribe = styled.button`
  background-color: rgb(196, 90, 172, 0.5);
  font-weight: 700;
  font-size: 14px;
  font-family: "Roboto", Helvetica;
  color: white;
  border: none;
  border-radius: 3px;
  height: max-content;
  padding: 13px 20px;
  cursor: pointer;
  margin-left: 20px;
  margin-top: 10px;
`;

const ChannelInfo = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  text-align: left;
`;

const ChannelImage = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 50%;
`;

const ChannelInfoTx = styled.div`
  display: flex;
  flex-direction: column;
  height: auto;
  width: auto;
`;

const ChannelName = styled.span`
  font-size: 24px;
  font-family: "Roboto Condensed", Helvetica;
  font-weight: 400;
  color: ${({ theme }) => theme.text};
  margin-left: 10px;
  margin-top: 5px;
`;

const ChannelCounter = styled.span`
  margin-top: 2px;
  margin-left: 10px;
  color: ${({ theme }) => theme.textSoft};
  font-size: 14px;
`;


const TitleHeader = styled.h1`
  font-size: 24px;
  color: #c4c4c4;
  font-weight: bold;
  font-family: "Roboto", Helvetica;
  margin-bottom: 20px;
`;

const Recommendation = styled.div`
  flex: 2;
`;

const Video = () => {

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Container>
      <Content>
        <VideoWrapper>
          <iframe
            width="1000px"
            height="560px"
            src="https://www.youtube.com/embed/d6kBeJjTGnY?si=vAnHaps-QdAlMb-O"
            title="YouTube video player"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          ></iframe>
        </VideoWrapper>


        <Buttons>
          <Button>
            <ButtonsImg src={VideoLikeIcono} /> 123
          </Button>
          <Button>
            <ButtonsImg src={VideoDislikeIcono} /> 25
          </Button>
          <Button>
            <ButtonsImg src={VideoSaveIcono} /> Watch Later
          </Button>
          <Button>
            <ButtonsImg src={VideoShareIcono} /> Share
          </Button>
        </Buttons>

        <VideoInfo>

          <VideoImg src={Miniaturahxh1} />

          <VideoOtherInfo>

            <Title> HunterxHunter EP01:S01</Title>

            <ContenedorIconosTextos>

              <ChannelIcon src={CanalIcono} />
              <EstiloTextos> Madhouse Studios </EstiloTextos>
              <EstiloIconos src={DuracionIcono} />
              <EstiloTextos> 20m </EstiloTextos>
              <EstiloIconos src={FechaIcono} />
              <EstiloTextos> Sept 18, 2011 </EstiloTextos>

            </ContenedorIconosTextos>

            <Description>

              In the first episode of Hunter x Hunter (2011), we are introduced to our main protagonist, Gon Freecss.
              Gon is a young boy who lives on Whale Island and has always been curious about his absent father, who is a renowned Hunter.
              Hunters are individuals with exceptional skills who undertake dangerous and adventurous tasks.

            </Description>

            <ChannelInfo>
              <ChannelImage src={MadHouseLogo} />
              <ChannelInfoTx>
                <ChannelName> MadHouse </ChannelName>
                <ChannelCounter> 103 K Subscribers </ChannelCounter>
              </ChannelInfoTx>
              <Subscribe>SUBSCRIBE</Subscribe>
            </ChannelInfo>

          </VideoOtherInfo>

        </VideoInfo>

        <RelatedVideos>

          <RelatedSlider />

        </RelatedVideos>

        <Comments />
      </Content>
      <Recommendation>
        <TitleHeader> RECOMMENDED </TitleHeader>
        <CardRecommendation type="sm" />
        <CardRecommendation type="sm" />
        <CardRecommendation type="sm" />
        <CardRecommendation type="sm" />
        <CardRecommendation type="sm" />
        <CardRecommendation type="sm" />
        <CardRecommendation type="sm" />
        <CardRecommendation type="sm" />
        <CardRecommendation type="sm" />
        <CardRecommendation type="sm" />
        <CardRecommendation type="sm" />
        <CardRecommendation type="sm" />
        <CardRecommendation type="sm" />
      </Recommendation>
    </Container>
  );
};

export default Video;
