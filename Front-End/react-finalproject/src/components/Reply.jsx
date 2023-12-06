import React, { useState, useEffect } from "react";
import styled from "styled-components";
import RespuestaIcono from "../assets/RespuestaIcono.png";
import RespuestaIconoHover from "../assets/RespuestaIconoHover.png";
import LikeIcono from "../assets/VideoLikeIcono.png";
import LikedIcono from "../assets/VideoLikedIcono.png";
import DislikeIcono from "../assets/VideoDislikeIcono.png";
import DislikedIcono from "../assets/VideoDislikedIcono.png";
import { useLanguage } from '../utils/LanguageContext';
import { useDispatch, useSelector } from 'react-redux';
import { toggleLike } from '../redux/commentSlice';
import axios from "axios";
import moment from "moment";
import "moment/locale/es";

const Container = styled.div`
  display: flex;
  gap: 17px;
  margin: 10px 0px 22px 0px;
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

const NameDate = styled.div`
  display: flex;
  align-items: center;
`;

const Name = styled.span`
  font-size: 13px;
  background-color: ${({ isUploader }) => (isUploader ? 'rgba(105, 86, 105)' : 'transparent')};
  padding: ${({ isUploader }) => (isUploader ? '5px 10px' : '0px')};;
  border-radius: ${({ isUploader }) => (isUploader ? '10px' : '0px')};;
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
  margin-bottom: 0px;
`;

const CommentOptions = styled.div`
  display: flex;
  border: none;
  margin-bottom: 5px;
`;

const Replyy = styled.div`
  display: flex;
  border: none;
  cursor: pointer;

  &:hover {
    color: rgb(205, 125, 227);
  }

`;

const ReplyImg = styled.img`
  height: 18px;
  width: 18px;
  
  ${Replyy}:hover & {
    content: url(${RespuestaIconoHover});
  }

`;

const ReplyText = styled.h1`
  font-size: 14px;
  font-family: "Roboto Condensed", Helvetica;
  font-weight: normal;
  margin-top: 2px;  
  margin-left: 2px;
`;

const EstiloLike = styled.div`
  display: flex;
  border: none;
  cursor: pointer;
  margin-left: 20px;
`;

const EstiloDislike = styled.div`
  display: flex;
  border: none;
  cursor: pointer;
  margin-left: 20px;
`;

const LikeImg = styled.img`
  height: 18px;
  width: 18px;
`;
const DislikeImg = styled.img`
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
  margin: ${(props) => (props.isOpen ? "-35px 0px 5px 0px" : "0px 0px 0px 0px")};
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

const ReplyDiv = styled.div`
  display: flex;
  gap: 10px;
  height: ${(props) => (props.isOpen ? "max-content" : "0px")};
  opacity: ${(props) => (props.isOpen ? 1 : 0)};
  transition: all 0.3s ease-in-out;
  transition: max-height 0.3s ease-in-out;
`;


const AvatarForReply = styled.img`
  width: 30px;
  height: 30px;
  border-radius: 50%;
`;

const PostReply = styled.div`
  display: flex;
  width: 851px ;
  flex-direction: column;
  gap: 10px;
  margin-top: 0px;
  margin-left: 5px;
`;

const ReplyTextArea = styled.textarea`
  border: none;
  border-radius: 5px;
  color: ${({ theme }) => theme.text};
  font-size: 14px;
  font-family: "Roboto Condensed", Helvetica;
  background-color: #3d4245;
  outline: none;
  padding: 10px;
  width: 98%;
  height: 50px;
  resize: none;
`;

const ButtonsDiv = styled.div`
  position: relative;
  margin-left: auto;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  width: auto;
  height:"max-content;
  overflow: hidden;
  transition: all 0.3s ease-in-out;
`;

const ReplyButton = styled.button`
  background-color: rgb(205, 125, 227, 0.3);
  font-weight: normal;
  font-size: 14px;
  font-family: "Roboto", Helvetica;
  color: white;
  border: none;
  border-radius: 3px;
  height: max-content;
  width: 90px;
  padding: 5px 5px;
  cursor: pointer;
  margin-top: 5px;
  margin-left: 5px;
`;

const CloseButton = styled.button`
  background-color: transparent;
  font-weight: normal;
  font-size: 14px;
  font-family: "Roboto", Helvetica;
  color: white;
  border: none;
  border-radius: 3px;
  height: max-content;
  width: 50px;
  padding: 5px 5px;
  cursor: pointer;
  margin-top: 5px;
`;

const ReplyComponent = ({ reply, UserUploader, commentId }) => {
  const { language, setLanguage } = useLanguage();
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user.currentUser);
  const [currentReply, setCurrentReply] = useState(reply);
  const [isLikeDisabled, setIsLikeDisabled] = useState(false);
  const [isDislikeDisabled, setIsDislikeDisabled] = useState(false);
  const timeago = timestamp => moment(timestamp).fromNow();
  const [showReplySection, setShowReplySection] = useState(false);
  const [channel, setChannel] = useState({});
  const isUploader = reply.userId === UserUploader;

  // TRANSLATIONS
  const translations = {
    en: {
      views: "views",
    },
    es: {
      views: "visitas",
    },
  };

  // TIMEAGO TRANSLATIONS
  if (language === "es") {
    moment.locale("es");
  } else {
    moment.locale("en");
  }


  // FECTH REPLY USER
  useEffect(() => {
    const fetchReplyUser = async () => {
      const res = await axios.get(`/users/find/${reply.userId}`);
      setChannel(res.data)
    };
    fetchReplyUser();
  }, [reply.userId]);

  // LIKE REPLY
  const handleLikeReply = async () => {
    if (isLikeDisabled) return;

    try {
      setIsLikeDisabled(true);

      // Update the API route to likereply
      await axios.put(`/users/likereply/${commentId}/${reply._id}`);

      setCurrentReply((prevReply) => ({
        ...prevReply,
        likes: prevReply.likes.includes(currentUser._id)
          ? prevReply.likes.filter((id) => id !== currentUser._id)
          : [...prevReply.likes, currentUser._id],
        dislikes: prevReply.dislikes.filter((id) => id !== currentUser._id),
      }));

      setIsLikeDisabled(false);

      dispatch(toggleLike({ userId: currentUser._id, replyId: currentReply._id }));
    } catch (error) {
      console.error('Error al manejar el like a la respuesta:', error);
    }
  };

  // DISLIKE REPLY
  const handleDislikeReply = async (replyId) => {
    if (isDislikeDisabled) return;

    try {
      setIsDislikeDisabled(true);

      // Update the API route to dislikereply
      await axios.put(`/users/dislikereply/${commentId}/${reply._id}`);// Pass the correct replyId here

      setCurrentReply((prevReply) => ({
        ...prevReply,
        dislikes: prevReply.dislikes.includes(currentUser._id)
          ? prevReply.dislikes.filter((id) => id !== currentUser._id)
          : [...prevReply.dislikes, currentUser._id],
        likes: prevReply.likes.filter((id) => id !== currentUser._id),
      }));

      setIsDislikeDisabled(false);

    } catch (error) {
      console.error('Error al manejar el dislike a la respuesta:', error);
    }
  };

  const handleReplyClick = () => {
    // Toggle the visibility of the reply section
    setShowReplySection(!showReplySection);
  };

  return (
    <Container>
      <Avatar src={channel.img} />
      <Details>
        <NameDate>
          <Name isUploader={isUploader}>
            {channel.displayname}
          </Name>
          <Date> • {timeago(currentReply.createdAt)} </Date>
        </NameDate>
        <Text>
          {currentReply.desc}
        </Text>
        <CommentOptions>
          <Replyy onClick={handleReplyClick}>
            <ReplyImg src={RespuestaIcono} />
            <ReplyText> Reply </ReplyText>
          </Replyy>

          <EstiloLike onClick={handleLikeReply} >
            {currentReply?.likes?.includes(currentUser?._id) ?
              (<LikeImg src={LikedIcono} />) :
              (<LikeImg src={LikeIcono} />)} {" "}
            <LikeDislikeCounter> {currentReply?.likes?.length}</LikeDislikeCounter>
          </EstiloLike>

          <EstiloDislike onClick={handleDislikeReply}>
            {currentReply?.dislikes?.includes(currentUser?._id) ?
              (<DislikeImg src={DislikedIcono} />) :
              (<DislikeImg src={DislikeIcono} />)} {" "}
            <LikeDislikeCounter> {currentReply?.dislikes?.length} </LikeDislikeCounter>
          </EstiloDislike>
        </CommentOptions>
      </Details>
    </Container>
  );
};

export default ReplyComponent;

