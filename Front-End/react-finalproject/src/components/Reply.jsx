import React, { useState, useEffect, useRef, useContext } from "react";
import styled, { css } from 'styled-components';
import RespuestaIcono from "../assets/RespuestaIcono.png";
import RespuestaIconoHover from "../assets/RespuestaIconoHover.png";
import LikeIcono from "../assets/VideoLikeIcono.png";
import LikedIcono from "../assets/VideoLikedIcono.png";
import DislikeIcono from "../assets/VideoDislikeIcono.png";
import DislikedIcono from "../assets/VideoDislikedIcono.png";
import PuntosSuspensivosIcono from "../assets/PuntosSuspensivosIcono.png";
import BorrarComentarioIcono from "../assets/BorrarComentarioIcono.png";
import EditarComentarioIcono from "../assets/EditarComentarioIcono.png";
import ReportarComentarioIcono from "../assets/ReportarComentarioIcono.png";
import ReportarComentarioInfoIcono from "../assets/ReportarComentarioInfoIcono.png";
import { useLanguage } from '../utils/LanguageContext';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { toggleLike } from '../redux/commentSlice';
import axios from "axios";
import moment from "moment";
import "moment/locale/es";

const ReplyMenu = styled.img`
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
  display: ${({ isMenuDotsVisible }) => (isMenuDotsVisible ? 'block' : 'none')};
  right: 15px;
  top: 0px;
`;

const Container = styled.div`
  display: flex;
  gap: 17px;
  margin: 0px 0px 15px 0px;
  border-radius: 10px;
  padding: 10px 10px;
  background: ${({ isMenuDotsVisible }) => (isMenuDotsVisible ? 'rgba(24, 19, 28)' : 'transparent')};
  &:hover {
    background: rgba(24, 19, 28);
    & ${ReplyMenu} {
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
  width: 850px;
`;

const Name = styled.h1`
  cursor: pointer;
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

const UserMention = styled.span`
  color: rgb(205, 125, 227);
`;

const ReplyToReply = styled.div`
  display: flex;
  gap: 10px;
  border: none;
  margin-bottom: 5px;
  width: 819px;
`;
const PostReply = styled.div`
  display: flex;
  width: 826px;
  flex-direction: column;
  gap: 10px;
  margin-top: 0px;
  margin-left: 5px;
`;

const AvatarForReply = styled.img`
  width: 30px;
  height: 30px;
  border-radius: 50%;
`;

const ReplyMenuOptions = styled.div`
  position: absolute;
  top: 30px;
  right: -85px;
  width: 135px;
  height: max-content;
  background: rgba(36, 36, 36);
  cursor: pointer;
  border-radius: 10px;
  z-index: 2;
`;


const RemoveReply = styled.button`
  width: 100%;
  display: flex;
  text-align: center;
  padding: 10px;
  margin: 5px 0px 5px 0px;
  background: rgba(36, 36, 36);
  cursor: pointer;
  border:none;
  border-radius: 8px;
  color: ${({ theme }) => theme.text};
  &:hover {
    background: rgba(45, 45, 45);
  }
  font-size: 15px;
  font-weight: 400;
  font-family: "Roboto", Helvetica;
`;

const EditReply = styled.button`
  width: 100%;
  display: flex;
  text-align: center;
  padding: 10px;
  margin: 5px 0px 0px 0px;
  background: rgba(36, 36, 36);
  cursor: pointer;
  border:none;
  border-radius: 8px;
  color: ${({ theme }) => theme.text};
  &:hover {
    background: rgba(45, 45, 45);
  }
  font-size: 15px;
  font-weight: 400;
  font-family: "Roboto", Helvetica;
`;

const ReportReply = styled.button`
  position: relative;
  width: 100%;
  display: flex;
  text-align: center;
  padding: 10px;
  margin: 5px 0px 5px 0px;
  background: rgba(36, 36, 36);
  cursor: pointer;
  border:none;
  border-radius: 8px;
  color: ${({ theme }) => theme.text};
  &:hover {
    background: rgba(45, 45, 45);
  }
  font-size: 15px;
  font-weight: 400;
  font-family: "Roboto", Helvetica;
`;

const RemoveEditReportReplyImg = styled.img`
  width: 18px;
  height: 18px;
  margin-right: 20px;
  margin-left: 10px;
`;

const PostEdit = styled.div`
  display: flex;
  width: 820px;
  flex-direction: column;
  gap: 10px;
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
  height: 20px;
  resize: none;
`;

const EditButton = styled.button`
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
  margin-right: -3px;

  ${({ disabled }) =>
    disabled &&
    css`
    background-color: rgb(124, 74, 138, 0.3);
    cursor: not-allowed;
  `}
`;


const RemoveReplyContainer = styled.div`
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background-color: #000000b9;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3;
`;

const RemoveReplyWrapper = styled.div`
  width: max-content;
  height: max-content;
  background: #1D1D1D;
  color: ${({ theme }) => theme.text};
  padding: 30px 30px 20px 30px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  position: relative;
  border-radius: 12px;
`;

const RemoveDeleteCancel = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  width: 100%;
`;

const RemoveReplyCancel = styled.div`
  margin-right: 10px;
  cursor: pointer;
  &:hover {
    background: rgba(45, 45, 45);
  }
  padding: 8px 10px;
  border-radius: 15px;
`;

const RemoveReplyDelete = styled.div`
  cursor: pointer;
  &:hover {
    background: rgba(45, 45, 45);
  }
  padding: 8px 10px;
  border-radius: 15px;
`;
const RemoveReplyTitle = styled.h1`
  font-weight: bold;
  font-size: 24px;
`;

const RemoveReplyTxt = styled.h1`
  font-weight: normal;
  font-size: 16px;
  margin-bottom: 15px;
  color: ${({ theme }) => theme.textSoft};
`;

const ReportReasonOption = styled.div`
  padding: 8px;
  border-radius: 5px;
  display: flex;

  input {
    margin-right: 10px; // Espaciado entre el radio button y la etiqueta
  }

  label {
    font-size: 16px;
    font-weight: normal;
    font-family: "Roboto", Helvetica;
    cursor: pointer;
    color: ${({ theme }) => theme.text};
  }
`;

const ReportReplyInfo = styled.div`
  position: relative;
  display: inline-block;
`;

const InfoIcon = styled.img`
  width: 20px;
  height: 20px;
  margin-left: 10px;
  position: absolute;
`;

const HoverInfoText = styled.span`
  position: absolute;
  margin-left: 38px;
  top: -8px;
  opacity: 0;
  color: ${({ theme }) => theme.textSoft};
  visibility: hidden;
  transition: opacity 0.3s ease, visibility 0.3s ease;
  font-size: 14px;
  background: rgba(43, 43, 43);
  padding: 10px;
  border-radius: 8px;
  width: max-content;

  ${ReportReplyInfo}:hover & {
    opacity: 1;
    visibility: visible;
  }
`;

const ReportReplyContainer = styled.div`
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background-color: #000000b9;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3;
`;

const ReportReplyWrapper = styled.div`
  width: max-content;
  height: max-content;
  background: #1D1D1D;
  color: ${({ theme }) => theme.text};
  padding: 30px 30px 20px 30px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  position: relative;
  border-radius: 12px;
`;

const ReportReportCancel = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  width: 100%;
  margin-top: 10px;
`;

const ReportReplyCancel = styled.div`
  margin-right: 10px;
  cursor: pointer;
  &:hover {
    background: rgba(45, 45, 45);
  }
  padding: 8px 10px;
  border-radius: 15px;
`;

const ReportReplyReport = styled.div`
  cursor: pointer;
  &:hover {
    background: rgba(45, 45, 45);
  }
  padding: 8px 10px;
  border-radius: 15px;
`;
const ReportReplyTitle = styled.h1`
  font-weight: bold;
  font-size: 24px;
`;

const ReportReplyTxt = styled.h1`
  font-weight: normal;
  font-size: 16px;
  margin-bottom: 15px;
  color: ${({ theme }) => theme.textSoft};
`;

const ReportSubmitedButton = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  width: 100%;
  margin-top: 0px;
`;

const ReplyComponent = ({ reply, UserUploader, commentId, onCommentsReload }) => {
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
        likes: prevReply.likes.includes(currentUser?._id)
          ? prevReply.likes.filter((id) => id !== currentUser?._id)
          : [...prevReply.likes, currentUser?._id],
        dislikes: prevReply.dislikes.filter((id) => id !== currentUser?._id),
      }));

      setIsLikeDisabled(false);

      dispatch(toggleLike({ userId: currentUser?._id, replyId: currentReply._id }));
    } catch (error) {
      console.error('Error al manejar el like a la respuesta:', error);
    }
  };

  // DISLIKE REPLY
  const handleDislikeReply = async (replyId) => {
    if (isDislikeDisabled) return;

    try {
      setIsDislikeDisabled(true);

      await axios.put(`/users/dislikereply/${commentId}/${reply._id}`);

      setCurrentReply((prevReply) => ({
        ...prevReply,
        dislikes: prevReply.dislikes.includes(currentUser?._id)
          ? prevReply.dislikes.filter((id) => id !== currentUser?._id)
          : [...prevReply.dislikes, currentUser?._id],
        likes: prevReply.likes.filter((id) => id !== currentUser?._id),
      }));

      setIsDislikeDisabled(false);

    } catch (error) {
      console.error('Error al manejar el dislike a la respuesta:', error);
    }
  };

  const handleReplyClick = () => {
    setShowReplySection(!showReplySection);
  };

  // EDIT REPLY
  const [isEditing, setIsEditing] = useState(false);
  const [editedReplyText, setEditedReplyText] = useState(currentReply.desc);

  const handleEditReply = async () => {
    setIsMenuOpen(false);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedReplyText(currentReply.desc);
  };

  const handleSaveEdit = async () => {
    try {
      const response = await axios.put(`/comments/${commentId}/replies/${currentReply._id}`, {
        desc: editedReplyText,
      });

      if (Array.isArray(currentReply)) {
        // Eliminar el comentario editado de la lista existente
        setCurrentReply((prevReplies) => {
          const updatedReplies = prevReplies.filter((reply) => reply._id !== currentReply._id);
          return [...updatedReplies, { ...currentReply, desc: editedReplyText }];
        });
      } else {
        // Si currentReply no es un array, actualizar el estado directamente
        setCurrentReply({ ...currentReply, desc: editedReplyText });
      }

      setIsEditing(false);

      if (onCommentsReload) {
        onCommentsReload();
      }

    } catch (error) {
      console.error('Error editing reply:', error.response.data);
    }
  };

  // DELETE REPLY
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);

  const handleDeleteReply = async () => {
    setIsMenuOpen(false);
    setIsDeletePopupOpen(true);
  };

  const handleDeleteConfirmation = async (confirmed) => {
    setIsDeletePopupOpen(false);

    if (confirmed) {
      try {
        await axios.delete(`/comments/${commentId}/replies/${currentReply._id}`);

        if (onCommentsReload) {
          onCommentsReload();
        }
      } catch (error) {
        console.error('Error deleting reply:', error);
      }
    }
  };

  // REPORT REPLY
  const [showReportReasonPopup, setShowReportReasonPopup] = useState(false);
  const [showReportSubmittedPopup, setShowReportSubmittedPopup] = useState(false);
  const [selectedReportReason, setSelectedReportReason] = useState(null);
  const existingReport = currentReply?.reports.find(report => report.userId === currentUser?._id);

  const handleReportReply = () => {
    setShowReportReasonPopup(!showReportReasonPopup);
    setIsMenuOpen(!isMenuOpen);
  };

  const handleReportReplySubmited = () => {
    setShowReportSubmittedPopup(!showReportSubmittedPopup);
  };

  const handleReportReplySubmitedClose = () => {
    setShowReportSubmittedPopup(!showReportSubmittedPopup);
    window.location.reload();
  };

  const handleReportReplyWithReason = async () => {

    if (!selectedReportReason) {
      return;
    }
    try {
      const response = await axios.post(`/comments/${commentId}/replies/${currentReply._id}/report`, {
        userId: currentUser._id,
        reason: selectedReportReason,
      });

      setShowReportReasonPopup(false);

      handleReportReplySubmited();

    } catch (error) {
      console.error('Error al reportar la respuesta:', error);
      // Manejar el error si es necesario
    }
  };

  // REPLY TO A REPLY
  const [replyText, setReplyText] = useState('');
  const replyPlaceholder = `@${channel.displayname} `;
  const [user, setUser] = useState(null);

  const handleReplySubmit = async () => {
    try {
      const channelMention = channel._id;
      const replyContent = replyText.trim();

      const response = await axios.post(`/comments/${commentId}/replies`, {
        userId: currentUser._id,
        replyTo: channelMention,
        desc: replyContent,
        likes: [],
        dislikes: [],
      });

      setReplyText('');
      setShowReplySection(false);

      setCurrentReply((prevReply) => ({
        ...prevReply,
        replies: Array.isArray(prevReply.replies) ? [...prevReply.replies, response.data] : [response.data],
      }));

      if (onCommentsReload) {
        onCommentsReload();
      }

    } catch (error) {
      console.error('Error al agregar la respuesta:', error);
    }
  };

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(`/users/find/${currentReply.replyTo}`);
        const fetchedUser = response.data;
        setUser(fetchedUser);

      } catch (error) {
      }
    };

    fetchUserDetails();
  }, [currentReply.replyTo]);

  // COMMENT REPLY OPTIONS MENU
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isCommentOwner = currentUser && currentUser?._id === reply.userId;
  const [isMenuDotsVisible, setIsMenuDotsVisible] = useState(false);
  const menuRef = useRef(null);


  const handleReplyMenuClick = () => {
    setIsMenuDotsVisible(!isMenuDotsVisible);
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = (event) => {
    if (
      menuRef.current &&
      !menuRef.current.contains(event.target) &&
      !event.target.classList.contains("ReplyMenu")
    ) {
      setIsMenuOpen(false);
      setIsMenuDotsVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", closeMenu);

    return () => {
      document.removeEventListener("click", closeMenu);
    };
  }, []);


  return (
    <Container isMenuDotsVisible={isMenuDotsVisible} ref={menuRef}>
      <Avatar src={channel.img} />
      <Details>
        <NameDate>
          <Name isUploader={isUploader}>
            {channel.displayname}
          </Name>
          <Date> • {timeago(currentReply.createdAt)} </Date>
          {!isEditing && (
            <ReplyMenu
              src={PuntosSuspensivosIcono}
              onClick={handleReplyMenuClick}
              isMenuDotsVisible={isMenuDotsVisible} />
          )}
          {isMenuOpen && (
            <ReplyMenuOptions className="ReplyMenuOptions">
              {isCommentOwner ? (
                <>

                  <EditReply onClick={handleEditReply}>
                    <RemoveEditReportReplyImg src={EditarComentarioIcono} />
                    Edit
                  </EditReply>

                  <RemoveReply onClick={handleDeleteReply}>
                    <RemoveEditReportReplyImg src={BorrarComentarioIcono} />
                    Remove
                  </RemoveReply>

                </>
              ) : (
                <ReportReply onClick={handleReportReply}>
                  <RemoveEditReportReplyImg src={ReportarComentarioIcono} />
                  Report
                </ReportReply>
              )}
            </ReplyMenuOptions>
          )}

          {isDeletePopupOpen && (
            <RemoveReplyContainer
              onDeleteConfirmed={() => handleDeleteConfirmation(true)}
              onCancel={() => handleDeleteConfirmation(false)}
            >
              <RemoveReplyWrapper>
                <RemoveReplyTitle> Remove Reply </RemoveReplyTitle>
                <RemoveReplyTxt> This Reply will be removed permanently. </RemoveReplyTxt>

                <RemoveDeleteCancel>
                  <RemoveReplyCancel onClick={() => handleDeleteConfirmation(false)}>
                    Cancel
                  </RemoveReplyCancel>
                  <RemoveReplyDelete onClick={() => handleDeleteConfirmation(true)}>
                    Delete
                  </RemoveReplyDelete>
                </RemoveDeleteCancel>

              </RemoveReplyWrapper>

            </RemoveReplyContainer>
          )}

          {showReportReasonPopup && !existingReport && (


            <ReportReplyContainer
            >
              <ReportReplyWrapper>
                <ReportReplyTitle> Report Reply </ReportReplyTitle>
                <ReportReplyTxt> Please select the reason for this report </ReportReplyTxt>

                <ReportReasonOption>
                  <input
                    type="radio"
                    id="Spam"
                    name="SpamReport"
                    value="SpamReport"
                    onChange={() => setSelectedReportReason("Spam")}
                    checked={selectedReportReason === "Spam"}
                  />
                  <label htmlFor="Spam"> Spam </label>

                  <ReportReplyInfo>
                    <InfoIcon src={ReportarComentarioInfoIcono} />
                    <HoverInfoText> Unwanted, unsolicited messages sent in bulk. </HoverInfoText>
                  </ReportReplyInfo>

                </ReportReasonOption>

                <ReportReasonOption>
                  <input
                    type="radio"
                    id="PornographyContent"
                    name="PornographyContentReport"
                    value="PornographyContentReport"
                    onChange={() => setSelectedReportReason("Pornography Content")}
                    checked={selectedReportReason === "Pornography Content"}
                  />
                  <label htmlFor="PornographyContent"> Pornography content </label>

                  <ReportReplyInfo>
                    <InfoIcon src={ReportarComentarioInfoIcono} />
                    <HoverInfoText> Explicit sexual material created for adult entertainment. </HoverInfoText>
                  </ReportReplyInfo>

                </ReportReasonOption>

                <ReportReasonOption>
                  <input
                    type="radio"
                    id="ChildAbuse"
                    name="ChildAbuseReport"
                    value="ChildAbuseReport"
                    onChange={() => setSelectedReportReason("Child Abuse")}
                    checked={selectedReportReason === "Child Abuse"}
                  />
                  <label htmlFor="ChildAbuse"> Child Abuse </label>

                  <ReportReplyInfo>
                    <InfoIcon src={ReportarComentarioInfoIcono} />
                    <HoverInfoText> Harm to children through abuse or neglect. </HoverInfoText>
                  </ReportReplyInfo>

                </ReportReasonOption>

                <ReportReasonOption>
                  <input
                    type="radio"
                    id="HateSpeech"
                    name="HateSpeechReport"
                    value="HateSpeechReport"
                    onChange={() => setSelectedReportReason("Hate Speech")}
                    checked={selectedReportReason === "Hate Speech"}
                  />
                  <label htmlFor="HateSpeech"> Hate Speech </label>

                  <ReportReplyInfo>
                    <InfoIcon src={ReportarComentarioInfoIcono} />
                    <HoverInfoText> Discriminatory speech promoting hostility and harm. </HoverInfoText>
                  </ReportReplyInfo>

                </ReportReasonOption>

                <ReportReasonOption>
                  <input
                    type="radio"
                    id="PromotesTerrorism"
                    name="PromotesTerrorismReport"
                    value="PromotesTerrorismReport"
                    onChange={() => setSelectedReportReason("Promotes Terrorism")}
                    checked={selectedReportReason === "Promotes Terrorism"}
                  />
                  <label htmlFor="PromotesTerrorism"> Promotes Terrorism </label>

                  <ReportReplyInfo>
                    <InfoIcon src={ReportarComentarioInfoIcono} />
                    <HoverInfoText> Encouraging or supporting acts of terrorism. </HoverInfoText>
                  </ReportReplyInfo>

                </ReportReasonOption>


                <ReportReasonOption>
                  <input
                    type="radio"
                    id="HarrassmentorBullying"
                    name="HarrassmentorBullyingReport"
                    value="HarrassmentorBullyingReport"
                    onChange={() => setSelectedReportReason("Harrassment or Bullying")}
                    checked={selectedReportReason === "Harrassment or Bullying"}
                  />
                  <label htmlFor="HarrassmentorBullying"> Harrassment or Bullying </label>

                  <ReportReplyInfo>
                    <InfoIcon src={ReportarComentarioInfoIcono} />
                    <HoverInfoText> Aggressive behavior that harms or intimidates others. </HoverInfoText>
                  </ReportReplyInfo>

                </ReportReasonOption>

                <ReportReasonOption>
                  <input
                    type="radio"
                    id="SuicideorSelfInjury"
                    name="SuicideorSelfInjuryReport"
                    value="SuicideorSelfInjuryReport"
                    onChange={() => setSelectedReportReason("Suicide or Self Injury")}
                    checked={selectedReportReason === "Suicide or Self Injury"}
                  />
                  <label htmlFor="SuicideorSelfInjury"> Suicide or Self Injury </label>

                  <ReportReplyInfo>
                    <InfoIcon src={ReportarComentarioInfoIcono} />
                    <HoverInfoText> False or inaccurate information that spreads and can cause confusion. </HoverInfoText>
                  </ReportReplyInfo>

                </ReportReasonOption>

                <ReportReasonOption>
                  <input
                    type="radio"
                    id="Missinformation"
                    name="Missinformation"
                    value="Missinformation"
                    onChange={() => setSelectedReportReason("Missinformation")}
                    checked={selectedReportReason === "Missinformation"}
                  />
                  <label htmlFor="Missinformation"> Missinformation </label>

                  <ReportReplyInfo>
                    <InfoIcon src={ReportarComentarioInfoIcono} />
                    <HoverInfoText> Explicit sexual material created for adult entertainment. </HoverInfoText>
                  </ReportReplyInfo>

                </ReportReasonOption>

                <ReportReportCancel>
                  <ReportReplyCancel onClick={handleReportReply}>
                    Cancel
                  </ReportReplyCancel>
                  <ReportReplyReport onClick={() => handleReportReplyWithReason(selectedReportReason)}>
                    Report
                  </ReportReplyReport>
                </ReportReportCancel>

              </ReportReplyWrapper>

            </ReportReplyContainer>
          )}

          {showReportReasonPopup && existingReport && (
            <ReportReplyContainer>
              <ReportReplyWrapper>
                <ReportReplyTitle> Report Reply </ReportReplyTitle>
                <ReportReplyTxt> You have already reported this reply </ReportReplyTxt>
                <ReportReportCancel>
                  <ReportReplyReport onClick={handleReportReply}>
                    Go back
                  </ReportReplyReport>
                </ReportReportCancel>
              </ReportReplyWrapper>
            </ReportReplyContainer>
          )}

          {showReportSubmittedPopup && (
            <ReportReplyContainer>
              <ReportReplyWrapper>
                <ReportReplyTitle> Report Submitted </ReportReplyTitle>
                <ReportReplyTxt> Thanks. We've received your report, if this reply goes against our guidelines we'll take actions.   </ReportReplyTxt>
                <ReportSubmitedButton>
                  <ReportReplyReport onClick={handleReportReplySubmitedClose}>
                    Reload
                  </ReportReplyReport>
                </ReportSubmitedButton>
              </ReportReplyWrapper>
            </ReportReplyContainer>
          )}

        </NameDate>
        <Text>
          {isEditing ? (
            <PostEdit>
              {user ? (
                <a
                  href={`/profile/${user._id}`}
                  style={{
                    width: "100%",
                    textDecoration: "none",
                    color: "inherit"
                  }}
                >
                  <UserMention>@{user.displayname} </UserMention>
                </a>
              ) : null}
              <Textarea
                value={editedReplyText}
                onChange={(e) => setEditedReplyText(e.target.value)}
                placeholder="Edit your reply..."
              />
              <ButtonsDiv>
                <CloseButton onClick={handleCancelEdit}> Close </CloseButton>
                <EditButton disabled={!editedReplyText.trim()} onClick={handleSaveEdit}>
                  Edit
                </EditButton>
              </ButtonsDiv>
            </PostEdit>
          ) : (
            <>
              {user ? (
                <a
                  href={`/profile/${user._id}`}
                  style={{
                    width: "100%",
                    textDecoration: "none",
                    color: "inherit"
                  }}
                >
                  <UserMention>@{user.displayname} </UserMention>
                </a>
              ) : null}
              {currentReply.desc}
            </>
          )}
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
        {showReplySection && (
          <ReplyToReply>
            <AvatarForReply
              src={currentUser?.img}
              alt="avatar"
            />
            <PostReply>
              <ReplyTextArea
                value={replyPlaceholder + replyText}
                onChange={(e) => setReplyText(e.target.value.replace(replyPlaceholder, ''))}
              />
              <ButtonsDiv>
                <CloseButton onClick={() => setShowReplySection(false)}>Close</CloseButton>
                <ReplyButton onClick={handleReplySubmit}>Reply</ReplyButton>
              </ButtonsDiv>
            </PostReply>
          </ReplyToReply>
        )}
      </Details>
    </Container>
  );
};

export default ReplyComponent;

