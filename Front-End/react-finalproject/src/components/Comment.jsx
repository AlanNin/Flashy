import React, { useState, useEffect, useRef, useContext } from "react";
import styled from "styled-components";
import RespuestaIcono from "../assets/RespuestaIcono.png";
import RespuestaIconoHover from "../assets/RespuestaIconoHover.png";
import PuntosSuspensivosIcono from "../assets/PuntosSuspensivosIcono.png";
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
import Reply from './Reply';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 17px;
  margin: 0px 0px 15px 0px;
`;

const CommentMenu = styled.img`
  position: absolute;
  cursor: pointer;
  color: white;
  font-weight: bold;
  transform: rotate(90deg);
  border-radius: 7px;
  padding: 5px;
  width: 17px;
  height: 17px;
  margin-bottom: ${({ isUploader }) => (isUploader ? '5px' : '0px')};;
  display: none;
  right: 10px;
  top: 0px;
`;

const ContainerForComment = styled.div`
  display: flex;
  gap: 17px;
  width: 935px;
  margin: 0px 0px 0px 0px;
  padding: 10px 10px;
  border-radius: 10px;

  &:hover {
    background: rgba(24, 19, 28);
    & ${CommentMenu} {
      display: block;
    }
  }
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
  position: relative;
  align-items: center;
  width: 900px;
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
  margin-bottom: 5px;
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
  margin: ${(props) => (props.isOpen ? "-33px 0px 5px 0px" : "0px 0px 0px 0px")};
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
  width: 826px;
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

const ReplyContainer = styled.div`
  flex-direction: column;
  margin-left: 50px;
  display: flex;
  width: 905px;
  color: ${({ theme }) => theme.text}
`;

const CommentMenuOptions = styled.div`
  position: absolute;
  top: 30px;
  right: -150px;
  width: 200px;
  height: 100px;
  background: black;
  cursor: pointer;
  border-radius: 10px;
  z-index: 2;
`;

const Comment = ({ comment, UserUploader, onCommentsReload }) => {
  const { language, setLanguage } = useLanguage();
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user.currentUser);
  const [currentComment, setCurrentComment] = useState(comment);
  const [isLikeDisabled, setIsLikeDisabled] = useState(false);
  const [isDislikeDisabled, setIsDislikeDisabled] = useState(false);
  const timeago = timestamp => moment(timestamp).fromNow();
  const [channel, setChannel] = useState({});
  const isUploader = comment.userId === UserUploader;
  const [showReplies, setShowReplies] = useState(false);
  const [showReplySection, setShowReplySection] = useState(false);
  const [newReplyText, setNewReplyText] = useState('');

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


  // FECTH COMMENTS

  useEffect(() => {
    const fetchComment = async () => {
      const res = await axios.get(`/users/find/${comment.userId}`);
      setChannel(res.data)
    };
    fetchComment();
  }, [comment.userId]);

  // LIKE COMMENT

  const handleLike = async () => {
    if (isLikeDisabled) return;
    if (!currentUser || !currentComment || !currentComment.likes) {
      return;
    }

    const userLiked = currentComment.likes.includes(currentUser._id);
    const userDisliked = currentComment.dislikes.includes(currentUser._id);

    try {
      setIsLikeDisabled(true);

      await axios.put(`/users/likecomment/${comment._id}`);

      setCurrentComment((prevComment) => ({
        ...prevComment,
        likes: userLiked
          ? prevComment.likes.filter((id) => id !== currentUser._id)
          : [...prevComment.likes, currentUser._id],
        dislikes: userDisliked
          ? prevComment.dislikes.filter((id) => id !== currentUser._id)
          : [...prevComment.dislikes],
      }));

      setIsLikeDisabled(false);

      dispatch(toggleLike({ userId: currentUser._id, commentId: currentComment._id }));
    } catch (error) {
      console.error('Error al manejar el like al comentario:', error);
    }
  };


  // DISLIKE COMMENT

  const handleDislike = async () => {
    if (isDislikeDisabled) return;
    if (!currentUser || !currentComment || !currentComment.dislikes) {
      return;
    }

    const userLiked = currentComment.likes.includes(currentUser._id);
    const userDisliked = currentComment.dislikes.includes(currentUser._id);

    try {
      setIsDislikeDisabled(true);

      await axios.put(`/users/dislikecomment/${comment._id}`);

      setCurrentComment((prevComment) => ({
        ...prevComment,
        dislikes: userDisliked
          ? prevComment.dislikes.filter((id) => id !== currentUser._id)
          : [...prevComment.dislikes, currentUser._id],
        likes: userLiked
          ? prevComment.likes.filter((id) => id !== currentUser._id)
          : [...prevComment.likes],
      }));

      setIsDislikeDisabled(false);

      dispatch(toggleLike({ userId: currentUser._id, commentId: currentComment._id }));
    } catch (error) {
      console.error('Error al manejar el dislike al comentario:', error);
    }
  };

  // REPLIES
  const handleReplyClick = () => {
    // Toggle the visibility of the reply section
    setShowReplySection(!showReplySection);
  };

  const handleAddReply = async () => {
    try {
      const response = await axios.post(`/comments/${comment._id}/replies`, {
        userId: currentUser._id,
        desc: newReplyText,
        likes: [],
        dislikes: [],
      });

      // Limpia el campo del nuevo comentario
      setNewReplyText('');

      // Actualiza la lista de respuestas después de agregar una nueva respuesta
      setCurrentComment((prevComment) => ({
        ...prevComment,
        replies: [...prevComment.replies, response.data], // Agrega la nueva respuesta a la lista existente
      }));

      // Invoca la función de recarga de comentarios en el componente padre
      if (onCommentsReload) {
        onCommentsReload();
      }

    } catch (error) {
      console.error('Error al agregar la respuesta:', error);
    }
  };


  const handleDeleteReply = async (replyId) => {
    try {
      await axios.delete(`/api/comments/${comment._id}/replies/${replyId}`);

    } catch (error) {
      console.error('Error al eliminar la respuesta:', error);
    }
  };

  // COMMENT REPLY OPTIONS MENU

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleCommentMenuClick = (event) => {
    // Evita que el clic se propague a los elementos superiores
    event.stopPropagation();

    // Cambia el estado de visibilidad del menú desplegable
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <Container>
      <ContainerForComment>

        <Avatar src={channel.img} />
        <Details>
          <NameDate>
            <Name isUploader={isUploader}>
              {channel.displayname}
            </Name>
            <Date> • {timeago(currentComment.createdAt)} </Date>
            <CommentMenu src={PuntosSuspensivosIcono} onClick={handleCommentMenuClick} />
            {isMenuOpen && (
              <CommentMenuOptions>
                {/* Contenido del menú desplegable */}
                {/* ... */}
              </CommentMenuOptions>
            )}
          </NameDate>
          <Text>
            {currentComment.desc}
          </Text>
          <CommentOptions>

            <Replyy onClick={handleReplyClick}>
              <ReplyImg src={RespuestaIcono} />
              <ReplyText> Reply </ReplyText>
            </Replyy>

            <EstiloLike onClick={handleLike} >
              {currentComment?.likes?.includes(currentUser?._id) ?
                (<LikeImg src={LikedIcono} />) :
                (<LikeImg src={LikeIcono} />)} {" "}
              <LikeDislikeCounter> {currentComment?.likes?.length}</LikeDislikeCounter>
            </EstiloLike>

            <EstiloDislike onClick={handleDislike}>
              {currentComment?.dislikes?.includes(currentUser?._id) ?
                (<DislikeImg src={DislikedIcono} />) :
                (<DislikeImg src={DislikeIcono} />)} {" "}
              <LikeDislikeCounter> {currentComment?.dislikes?.length} </LikeDislikeCounter>
            </EstiloDislike>
          </CommentOptions>

          {currentUser && showReplySection && (
            <ReplyDiv isOpen={showReplySection}>
              <AvatarForReply
                src={currentUser?.img}
                alt="avatar"
              />
              <PostReply>
                <ReplyTextArea
                  placeholder="Add a reply..."
                  value={newReplyText}
                  onChange={(e) => setNewReplyText(e.target.value)}
                />
                <ButtonsDiv>
                  <CloseButton onClick={handleReplyClick}> Close </CloseButton>
                  <ReplyButton onClick={handleAddReply}> Reply </ReplyButton>
                </ButtonsDiv>
              </PostReply>
            </ReplyDiv>
          )}

          {comment.replies.length > 0 && (
            <Replies isOpen={showReplySection} onClick={() => setShowReplies(!showReplies)}>
              <ArrowViewReplies> {showReplies ? '▲' : '▼'} </ArrowViewReplies>
              <ViewReplies>View {comment.replies.length} replies</ViewReplies>
            </Replies>
          )}



        </Details>
      </ContainerForComment>

      {showReplies && comment.replies.length > 0 && (
        <ReplyContainer>
          {comment.replies.map((reply) => (
            <Reply
              key={reply._id}
              reply={reply}
              UserUploader={UserUploader}
              commentId={comment._id}
              onCommentsReload={onCommentsReload}
            />
          ))}
        </ReplyContainer>
      )}

    </Container>

  );
};

export default Comment;