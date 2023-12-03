import React, { useState, useEffect, useRef, useContext } from "react";
import styled from "styled-components";
import RespuestaIcono from "../assets/RespuestaIcono.png";
import LikeIcono from "../assets/VideoLikeIcono.png";
import LikedIcono from "../assets/VideoLikedIcono.png";
import DislikeIcono from "../assets/VideoDislikeIcono.png";
import DislikedIcono from "../assets/VideoDislikeIcono.png";
import { useLanguage } from '../utils/LanguageContext';
import { useDispatch, useSelector } from 'react-redux';
import axios from "axios";
import moment from "moment";
import "moment/locale/es";

const Container = styled.div`
  display: flex;
  gap: 17px;
  margin: 40px 0px 50px 0px;
`;

const Avatar = styled.img`
  width: 35px;
  height: 35px;
  border-radius: 50%;
`;

const Details = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  color: ${({ theme }) => theme.text}
`;
const Name = styled.span`
  font-size: 13px;
  font-weight: 500;
`;

const Date = styled.span`
  font-size: 12px;
  font-weight: 400;
  font-family: "Roboto", Helvetica;
  color: ${({ theme }) => theme.textSoft};
  margin-left: 8px;
`;

const Text = styled.span`
  font-size: 14px;
  font-weight: normal;
  font-family: "Roboto", Helvetica;
  color: #c4c4c4;
  margin-bottom: 5px;
`;

const CommentOptions = styled.div`
  display: flex;
  border: none;
  margin-bottom: 5px;
`;

const Reply = styled.div`
  display: flex;
  border: none;
  cursor: pointer;
`;

const ReplyImg = styled.img`
  height: 18px;
  width: 18px;
`;

const ReplyText = styled.h1`
  font-size: 14px;
  font-family: "Roboto Condensed", Helvetica;
  font-weight: normal;
  margin-top: 2px;  
  margin-left: 2px;
`;

const EstiloLikeDislike = styled.div`
  display: flex;
  border: none;
  cursor: pointer;
  margin-left: 20px;
`;

const LikeDislikeImg = styled.img`
  height: 18px;
  width: 18px;
`;

const LikeDislikeCounter = styled.h1`
  font-size: 14px;
  font-family: "Roboto Condensed", Helvetica;
  font-weight: normal;
  margin-top: 2px;  
  margin-left: 3px;
`;

const Replies = styled.div`
  display: flex;
  border: none;
  cursor: pointer;
  width: max-content;
`;

const ArrowViewReplies = styled.h1`
  font-size: 10px;
  font-family: "Roboto Condensed", Helvetica;
  font-weight: normal;
  margin-top: 7px;
`;

const ViewReplies = styled.h1`
  font-size: 14px;
  font-family: "Roboto Condensed", Helvetica;
  font-weight: normal;
  margin-top: 5px;
  margin-left: 6px;
`;



const Comment = ({ comment }) => {

  const { language, setLanguage } = useLanguage();

  const translations = {
    en: {
      views: "views",
    },
    es: {
      views: "visitas",
    },
  };

  if (language === "es") {
    moment.locale("es");
  } else {
    moment.locale("en");
  }

  const formatViews = (views) => {
    if (views >= 1000000000) {
      return `${(views / 1000000000).toFixed(1)}B`;
    } else if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`;
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`;
    } else {
      return views.toString();
    }
  };

  const timeago = timestamp => moment(timestamp).fromNow();

  const [channel, setChannel] = useState({});

  useEffect(() => {
    const fetchComment = async () => {
      const res = await axios.get(`/users/find/${comment.userId}`);
      setChannel(res.data)
    };
    fetchComment();
  }, [comment.userId]);


  return (
    <Container>
      <Avatar src={channel.img} />
      <Details>
        <Name>
          {channel.name} <Date> • {timeago(comment.createdAt)} </Date>
        </Name>
        <Text>
          {comment.desc}
        </Text>
        <CommentOptions>

          <Reply>
            <ReplyImg src={RespuestaIcono} />
            <ReplyText> Reply </ReplyText>
          </Reply>

          <EstiloLikeDislike>
            <LikeDislikeImg src={LikeIcono} />
            <LikeDislikeCounter> 105 </LikeDislikeCounter>
          </EstiloLikeDislike>

          <EstiloLikeDislike>
            <LikeDislikeImg src={DislikeIcono} />
            <LikeDislikeCounter> 26 </LikeDislikeCounter>
          </EstiloLikeDislike>
        </CommentOptions>

        <Replies>
          <ArrowViewReplies> ▼ </ArrowViewReplies>
          <ViewReplies>View 5 replies</ViewReplies>
        </Replies>

      </Details>
    </Container>
  );
};

export default Comment;