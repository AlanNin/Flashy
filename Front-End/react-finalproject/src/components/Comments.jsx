import React, { useState, useEffect, useRef, useContext } from "react";
import styled from "styled-components";
import Comment from "./Comment";
import { useLanguage } from '../utils/LanguageContext';
import { useDispatch, useSelector } from 'react-redux';
import axios from "axios";

const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-bottom: 100px;
`;

const TitleHeader = styled.h1`
  font-size: 24px;
  color: #c4c4c4;
  font-weight: bold;
  font-family: "Roboto", Helvetica;
  padding: 0px 0px 30px 0px;
`;

const NotLoggedText = styled.h1`
  font-size: 18px;
  color: rgb(158, 93, 176);
  font-weight: bold;
  font-family: "Roboto Condensed", Helvetica;
  margin-top: -15px;
  padding: 0px 0px 30px 0px;
`;

const NewComment = styled.div`
  display: flex;
  gap: 10px;
  padding: 0px 0px 15px 0px;
`;

const PostComment = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 10px;
  margin-top: 0px;
  margin-left: 5px;
`;

const UserComment = styled.h1`
  display: flex;
  font-size: 14px;
  color: white;
  font-weight: normal;
  font-family: "Roboto Condensed", Helvetica;
`;

const UserCommentName = styled.h1`
  font-size: 14px;
  color: rgb(205, 125, 227);
  font-weight: bold;
  font-family: "Roboto Condensed", Helvetica;
  margin-left: 5px;
`;

const Avatar = styled.img`
  width: 35px;
  height: 35px;
  border-radius: 50%;
`;

const Textarea = styled.textarea`
  border: none;
  border-radius: 5px;
  color: ${({ theme }) => theme.text};
  font-size: 14px;
  font-family: "Roboto Condensed", Helvetica;
  background-color: #3d4245;
  outline: none;
  padding: 10px;
  width: calc(98% + 5px);
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
  height: ${(props) => (props.showButtons ? "max-content" : "0px")};
  overflow: hidden;
  opacity: ${(props) => (props.showButtons ? 1 : 0)};
  transition: all 0.3s ease-in-out;
`;

const CommentButton = styled.button`
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

const CommentContainer = styled.div`
  width: 100%;
`;

const Comments = ({ videoId, UserUploader }) => {
  const [isTextareaFocused, setTextareaFocused] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const [comments, setComments] = useState([]);
  const [newCommentText, setNewCommentText] = useState('');
  const { language, setLanguage } = useLanguage();

  const fetchComments = async () => {
    try {
      const res = await axios.get(`/comments/${videoId}`);
      setComments(res.data);
    } catch (err) {
      console.error('Error fetching comments:', err);
    }
  };

  const handleComment = async () => {
    try {
      const response = await axios.post('/comments', {
        videoId,
        desc: newCommentText,
      });

      fetchComments();

      setNewCommentText('');

      setTextareaFocused(false);
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleCommentsReload = () => {
    // Recargar comentarios después de agregar una nueva respuesta
    fetchComments();
  };

  useEffect(() => {
    fetchComments();
  }, [videoId]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await axios.get(`/comments/${videoId}`);
        setComments(res.data);
      } catch (err) { }
    };
    fetchComments();
  }, [videoId]);


  // TRANSLATIONS
  const translations = {
    en: {
      comments: "COMMENTS",
      commentsvalidation: "Please sign in to comment in this video.",
      commentsas: "Comment as",
      close: "Close",
      comment: "Comment",
    },
    es: {
      comments: "COMENTARIOS",
      commentsvalidation: "Por favor inicia sesión para comentar en este video.",
      commentsas: "Comentar como",
      close: "Cerrar",
      comment: "Comentar",
    },
  };


  return (
    <Container>
      <TitleHeader> {translations[language].comments} </TitleHeader>
      {!currentUser && (
        <NotLoggedText> {translations[language].commentsvalidation} </NotLoggedText>
      )}

      {currentUser && (
        <NewComment>
          <Avatar
            src={currentUser?.img}
            alt="avatar"
          />
          <PostComment>
            <UserComment>
              {translations[language].commentsas}  <UserCommentName> {currentUser?.displayname} </UserCommentName>{" "}
            </UserComment>
            <Textarea
              placeholder="Leave a comment..."
              onFocus={() => setTextareaFocused(true)}
              value={newCommentText}
              onChange={(e) => setNewCommentText(e.target.value)}
            />
            <ButtonsDiv showButtons={isTextareaFocused}>
              <CloseButton onClick={() => setTextareaFocused(false)}> {translations[language].close}  </CloseButton>
              <CommentButton onClick={handleComment}> {translations[language].comment}  </CommentButton>
            </ButtonsDiv>
          </PostComment>
        </NewComment>
      )}

      <CommentContainer>
        {comments.map(comment => {
          return (
            <Comment key={comment._id} comment={comment} UserUploader={UserUploader} onCommentsReload={handleCommentsReload} />
          );
        })}
      </CommentContainer>
    </Container>
  );
};

export default Comments;
