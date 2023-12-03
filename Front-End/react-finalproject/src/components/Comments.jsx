import React, { useState, useEffect, useRef, useContext } from "react";
import styled from "styled-components";
import Comment from "./Comment";
import { useLanguage } from '../utils/LanguageContext';
import { useDispatch, useSelector } from 'react-redux';
import axios from "axios";

const Container = styled.div``;

const TitleHeader = styled.h1`
  font-size: 24px;
  color: #c4c4c4;
  font-weight: bold;
  font-family: "Roboto", Helvetica;
  padding: 0px 0px 30px 0px;
`;

const NewComment = styled.div`
  display: flex;
  gap: 10px;
`;

const PostComment = styled.div`
  display: flex;
  width: 90%;
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
  width: 98%;
  height: 50px;
  resize: none;
`;

const ButtonsDiv = styled.div`
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

const Comments = ({ videoId }) => {
  const [isTextareaFocused, setTextareaFocused] = useState(false);

  const { currentUser } = useSelector((state) => state.user);

  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await axios.get(`/comments/${videoId}`);
        setComments(res.data);
      } catch (err) { }
    };
    fetchComments();
  }, [videoId]);

  return (
    <Container>
      <TitleHeader> COMMENTS </TitleHeader>
      <NewComment>
        <Avatar
          src={currentUser?.img}
          alt="avatar"
        />
        <PostComment>
          <UserComment>
            Comment as <UserCommentName> {currentUser?.displayname} </UserCommentName>{" "}
          </UserComment>
          <Textarea
            placeholder="Leave a comment..."
            onFocus={() => setTextareaFocused(true)}
            onBlur={() => setTextareaFocused(false)}
          />
          <ButtonsDiv showButtons={isTextareaFocused}>
            <CloseButton> Close </CloseButton>
            <CommentButton> Comment </CommentButton>
          </ButtonsDiv>
        </PostComment>
      </NewComment>
      {comments.map(comment => (
        <Comment key={comment._id} comment={comment} />
      ))}
    </Container>
  );
};

export default Comments;
