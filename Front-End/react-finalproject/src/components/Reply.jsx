import React, { useState, useEffect, useRef, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import InicioSesionIcono2 from "../assets/InicioSesionIcono2.png";
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
  right: 3px;
  top: 0px;
`;

const Container = styled.div`
  display: flex;
  gap: 17px;
  width: 100%;
  margin: 0px 0px 15px 0px;
  border-radius: 10px;
  padding: 15px 10px;
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
  width: 100%;
  flex-direction: column;
  gap: 10px;
  color: ${({ theme }) => theme.text}
`;

const NameDate = styled.div`
  display: flex;
  position: relative;
  align-items: center;
  width: 100%;
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

const EditedLabel = styled.span`
  font-size: 11px;
  font-weight: 400;
  font-family: "Roboto", Helvetica;
  color: ${({ theme }) => theme.textSoft};
  margin-left: 8px;
  background: rgba(168, 62, 103, 0.3);
  border-radius: 10px;
  padding: 1px 6px;
`;

const Text = styled.span`
  font-size: 14px;
  font-weight: normal;
  font-family: "Roboto", Helvetica;
  color: #c4c4c4;
  margin-bottom: 0px;
`;

const CommentOptions = styled.div`
  display: ${({ isEditing }) => (isEditing ? 'none' : 'flex')};
  border: none;
  margin-bottom: 5px;
  margin-top: 5px;
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
  width: 100%;
`;
const PostReply = styled.div`
  display: flex;
  width: 100%;
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
  width: 100%;
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

const ItemLogin = styled.div`
  display: flex;
  width: max-content;
  padding: 5px 12px;
  align-items: center;
  gap: 8px;
  height: max-content;
  transition: background-color 0.5s;
  border-radius: 10px;
  background-color: ${({ theme }) => theme.loginbg};
  &:hover {
    background-color: ${({ theme }) => theme.softloginbg};
  }
`;

const ImgLogin = styled.img`
  height: 20px;
  width: 20px;
`;

const ButtonLoginText = styled.h3`
  font-family: "Roboto Condensed", Helvetica;
  font-size: 18px;
  margin-right: 2px;
  font-weight: normal;
  margin-bottom: 3px;
  color: ${({ theme }) => theme.text};
`;

const LikeNotLogged = styled.div`
  display: flex;
  position: absolute;
  color: white;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  height: max-content;
  background-color: rgba(89, 86, 92, 0.9);
  width: auto;
  border-radius: 0px 10px 10px 10px;
  padding: 10px;
  margin-top: 25px;
  margin-left: 70px;
  z-index: 2;
`;

const LikeNotLoggedTxt = styled.h1`
  color: white;
  padding: 10px 5px;
  font-family: "Roboto Condensed", Helvetica;
  font-size: 18px;
  font-weight: normal;
`;


const DislikeNotLogged = styled.div`
  display: flex;
  position: absolute;
  color: white;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  height: max-content;
  background-color: rgba(89, 86, 92, 0.9);
  width: auto;
  border-radius: 0px 10px 10px 10px;
  padding: 10px;
  margin-top: 25px;
  margin-left: 118px;
  z-index: 2;
`;

const DislikeLoggedTxt = styled.h1`
  color: white;
  padding: 10px 5px;
  font-family: "Roboto Condensed", Helvetica;
  font-size: 18px;
  font-weight: normal;
`;

const ReplyNotLogged = styled.div`
  display: flex;
  position: absolute;
  color: white;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  height: max-content;
  background-color: rgba(89, 86, 92, 0.9);
  width: auto;
  border-radius: 0px 10px 10px 10px;
  padding: 10px;
  margin-top: 25px;
  margin-left: 0px;
  z-index: 2;
`;

const ReplyLoggedTxt = styled.h1`
  color: white;
  padding: 10px 5px;
  font-family: "Roboto Condensed", Helvetica;
  font-size: 18px;
  font-weight: normal;
`;

const ReportNotLogged = styled.div`
  display: flex;
  position: absolute;
  color: white;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  height: max-content;
  background-color: rgba(89, 86, 92, 0.9);
  width: auto;
  border-radius: 10px 10px 10px 10px;
  padding: 10px;
  margin-top: 10px;
  margin-left: 0px;
  z-index: 2;
`;

const ReportLoggedTxt = styled.h1`
  color: white;
  padding: 10px 5px;
  font-family: "Roboto Condensed", Helvetica;
  font-size: 18px;
  font-weight: normal;
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

  const translations = {
    en: {
      signin: "Sign in",
      edited: "Edited",
      edit: "Edit",
      remove: "Remove",
      close: "Close",
      report: "Report",
      reload: "Reload",
      cancel: "Cancel",
      goback: "Go back",
      reply: "Reply",
      view: "View",
      replies: "Replies",
      replyvalidation: "You need to be logged in to reply to this reply.",
      likevalidation: "You need to be logged in to like this reply.",
      dislikevalidation: "You need to be logged in to dislike this reply.",
      reportvalidation: "You need to be logged in to report to this reply.",
      removecomment: "Remove Reply",
      removecommenttxt: "This reply will be removed permanently",
      reportcomment: "Report Reply",
      reportcommenttxt: "Please select the reason for this report",
      alreadyreportcomment: "You have already reported this reply.",
      reportsubmitted: "Report Submitted",
      reportsubmittedtxt: "Thanks. We've received your report, if this reply goes against our guidelines we'll take actions.",

      spam: "Spam",
      spamtxt: "Unwanted, unsolicited messages sent in bulk.",
      pornographycontent: "Pornography content",
      pornographycontenttxt: "Explicit sexual material created for adult entertainment.",
      child: "Child Abuse",
      childtxt: "Harm to children through abuse or neglect.",
      hate: "Hate Speech",
      hatetxt: "Discriminatory speech promoting hostility and harm.",
      terrorism: "Promotes Terrorism",
      terrorismtxt: "Encouraging or supporting acts of terrorism.",
      harrassment: "Harrassment or Bullying",
      harrassmenttxt: "Aggressive behavior that harms or intimidates others.",
      suicide: "Suicide or Self Injury",
      suicidetxt: "False or inaccurate information that spreads and can cause confusion.",
      missinformation: "Missinformation",
      missinformationtxt: "Incorrect or misleading information.",
    },
    es: {
      signin: "Iniciar Sesión",
      edited: "Editado",
      edit: "Editar",
      remove: "Eliminar",
      close: "Cerrar",
      report: "Reportar",
      reload: "Recargar",
      cancel: "Cancelar",
      goback: "Regresar",
      reply: "Responder",
      view: "Ver",
      replies: "Respuestas",
      replyvalidation: "Necesitas iniciar sesión para responder a este respuesta.",
      likevalidation: "Necesitas iniciar sesión para dar me gusta a este respuesta.",
      dislikevalidation: "Necesitas iniciar sesión para dar no me gusta a este respuesta.",
      reportvalidation: "Necesitas haber iniciado sesión para reportar este respuesta.",
      removecomment: "Eliminar Respuesta",
      removecommenttxt: "Este respuesta será eliminado permanentamente",
      reportcomment: "Reportar respuesta",
      reportcommenttxt: "Por favor seleccionar una razón para este reporte",
      alreadyreportcomment: "Ya has reportado este respuesta.",
      reportsubmitted: "Reporte enviado",
      reportsubmittedtxt: "Gracias. Recibimos su informe. Si este respuesta va en contra de nuestras pautas, tomaremos medidas.",

      spam: "Spam",
      spamtxt: "Mensajes no solicitados enviados continuamente.",
      pornographycontent: "Contenido pornográfico",
      pornographycontenttxt: "Material sexual explícito creado para entretenimiento para adultos.",
      child: "Abuso Infantil",
      childtxt: "Daño a los niños por abuso o negligencia.",
      hate: "Discurso de Odio",
      hatetxt: "Discurso discriminatorio que promueve la hostilidad y el daño.",
      terrorism: "Promueve el Terrorismo",
      terrorismtxt: "Fomenta o apoya actos de terrorismo.",
      harrassment: "Acoso o Intimidación",
      harrassmenttxt: "Comportamiento agresivo que daña o intimida a otras.",
      suicide: "Suicidio o Autolesión",
      suicidetxt: "Información falsa o inexacta que se difunda y pueda causar confusión.",
      missinformation: "Desinformación",
      missinformationtxt: "Información incorrecta o engañosa.",
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
    if (!currentUser) {
      setLikePopupVisible(true);
      return;
    }
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
    if (!currentUser) {
      setDislikePopupVisible(true);
      return;
    }
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
    if (!currentUser) {
      setReplyPopupVisible(true);
      return;
    }
    setShowReplySection(!showReplySection);
    setIsReplying(!isReplying);
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
      setIsMenuDotsVisible(false);

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

  useEffect(() => {
    if (isDeletePopupOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isDeletePopupOpen]);


  // REPORT REPLY
  const [showReportReasonPopup, setShowReportReasonPopup] = useState(false);
  const [showReportSubmittedPopup, setShowReportSubmittedPopup] = useState(false);
  const [selectedReportReason, setSelectedReportReason] = useState(null);
  const existingReport = currentReply?.reports.find(report => report.userId === currentUser?._id);

  const handleReportReply = () => {
    if (!currentUser) {
      setReportPopupVisible(true);
      return;
    }
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

  useEffect(() => {
    if (showReportReasonPopup) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [showReportReasonPopup]);


  // REPLY TO A REPLY
  const [replyText, setReplyText] = useState('');
  const replyPlaceholder = `@${channel.displayname} `;
  const [user, setUser] = useState(null);
  const [isReplying, setIsReplying] = useState(false);

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
      setIsReplying(!isReplying);

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

  // POP UP LIKE NOT LOGGED
  const [isLikePopupVisible, setLikePopupVisible] = useState(false);
  const likeRef = useRef(null);

  useEffect(() => {
    const handleClickOutsideLikeNotLogged = (event) => {
      if (likeRef.current && !likeRef.current.contains(event.target)) {
        setLikePopupVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutsideLikeNotLogged);

    return () => {
      document.removeEventListener("mousedown", handleClickOutsideLikeNotLogged);
    };
  }, []);

  // POP UP DISLIKE NOT LOGGED
  const [isDislikePopupVisible, setDislikePopupVisible] = useState(false);
  const dislikeRef = useRef(null);

  useEffect(() => {
    const handleClickOutsideDislikeNotLogged = (event) => {
      if (dislikeRef.current && !dislikeRef.current.contains(event.target)) {
        // Clic fuera del componente, ocultar el popup
        setDislikePopupVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutsideDislikeNotLogged);

    return () => {
      document.removeEventListener("mousedown", handleClickOutsideDislikeNotLogged);
    };
  }, []);

  // POP UP REPLY NOT LOGGED
  const [isReplyPopupVisible, setReplyPopupVisible] = useState(false);
  const replyRef = useRef(null);

  useEffect(() => {
    const handleClickOutsideReplyNotLogged = (event) => {
      if (replyRef.current && !replyRef.current.contains(event.target)) {
        // Clic fuera del componente, ocultar el popup
        setReplyPopupVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutsideReplyNotLogged);

    return () => {
      document.removeEventListener("mousedown", handleClickOutsideReplyNotLogged);
    };
  }, []);

  // POP UP REPORT NOT LOGGED
  const [isReportPopupVisible, setReportPopupVisible] = useState(false);
  const reportRef = useRef(null);

  useEffect(() => {
    const handleClickOutsideReportNotLogged = (event) => {
      if (reportRef.current && !reportRef.current.contains(event.target)) {
        // Clic fuera del componente, ocultar el popup
        setReportPopupVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutsideReportNotLogged);

    return () => {
      document.removeEventListener("mousedown", handleClickOutsideReportNotLogged);
    };
  }, []);

  return (
    <Container isMenuDotsVisible={isMenuDotsVisible}>
      <Avatar src={channel.img} />
      <Details>
        <NameDate>
          <Name isUploader={isUploader}>
            {channel.displayname}
          </Name>
          <Date> • {timeago(currentReply.createdAt)} </Date>
          {reply.edited && (
            <EditedLabel> {translations[language].edited}  </EditedLabel>
          )}
          {!isEditing && !isReplying && (
            <ReplyMenu
              ref={menuRef}
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
                    {translations[language].edit}
                  </EditReply>

                  <RemoveReply onClick={handleDeleteReply}>
                    <RemoveEditReportReplyImg src={BorrarComentarioIcono} />
                    {translations[language].remove}
                  </RemoveReply>

                </>
              ) : (
                <ReportReply onClick={handleReportReply}>
                  <RemoveEditReportReplyImg src={ReportarComentarioIcono} />
                  {translations[language].report}
                </ReportReply>
              )}


              {!currentUser && isReportPopupVisible && (
                <ReportNotLogged ref={reportRef}>

                  <ReportLoggedTxt> {translations[language].reportvalidation} </ReportLoggedTxt>

                  <Link
                    to="../../signin"
                    style={{
                      textDecoration: "none",
                      color: "inherit",
                    }}
                  >
                    <ItemLogin>
                      <ImgLogin src={InicioSesionIcono2} />
                      <ButtonLoginText> {translations[language].signin} </ButtonLoginText>
                    </ItemLogin>
                  </Link>

                </ReportNotLogged>
              )}
            </ReplyMenuOptions>
          )}

          {isDeletePopupOpen && (
            <RemoveReplyContainer
              onDeleteConfirmed={() => handleDeleteConfirmation(true)}
              onCancel={() => handleDeleteConfirmation(false)}
            >
              <RemoveReplyWrapper>
                <RemoveReplyTitle> {translations[language].removecomment} </RemoveReplyTitle>
                <RemoveReplyTxt> {translations[language].removecommenttxt} </RemoveReplyTxt>

                <RemoveDeleteCancel>
                  <RemoveReplyCancel onClick={() => handleDeleteConfirmation(false)}>
                    {translations[language].cancel}
                  </RemoveReplyCancel>
                  <RemoveReplyDelete onClick={() => handleDeleteConfirmation(true)}>
                    {translations[language].remove}
                  </RemoveReplyDelete>
                </RemoveDeleteCancel>

              </RemoveReplyWrapper>

            </RemoveReplyContainer>
          )}

          {showReportReasonPopup && !existingReport && (


            <ReportReplyContainer
            >
              <ReportReplyWrapper>
                <ReportReplyTitle> {translations[language].reportcomment} </ReportReplyTitle>
                <ReportReplyTxt> {translations[language].reportcommenttxt} </ReportReplyTxt>

                <ReportReasonOption>
                  <input
                    type="radio"
                    id="Spam"
                    name="SpamReport"
                    value="SpamReport"
                    onChange={() => setSelectedReportReason("Spam")}
                    checked={selectedReportReason === "Spam"}
                  />
                  <label htmlFor="Spam"> {translations[language].spam} </label>

                  <ReportReplyInfo>
                    <InfoIcon src={ReportarComentarioInfoIcono} />
                    <HoverInfoText> {translations[language].spamtxt} </HoverInfoText>
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
                  <label htmlFor="PornographyContent"> {translations[language].pornographycontent} </label>

                  <ReportReplyInfo>
                    <InfoIcon src={ReportarComentarioInfoIcono} />
                    <HoverInfoText> {translations[language].pornographycontenttxt} </HoverInfoText>
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
                  <label htmlFor="ChildAbuse"> {translations[language].child} </label>

                  <ReportReplyInfo>
                    <InfoIcon src={ReportarComentarioInfoIcono} />
                    <HoverInfoText> {translations[language].childtxt} </HoverInfoText>
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
                  <label htmlFor="HateSpeech"> {translations[language].hate}  </label>

                  <ReportReplyInfo>
                    <InfoIcon src={ReportarComentarioInfoIcono} />
                    <HoverInfoText> {translations[language].hatetxt} </HoverInfoText>
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
                  <label htmlFor="PromotesTerrorism"> {translations[language].terrorism} </label>

                  <ReportReplyInfo>
                    <InfoIcon src={ReportarComentarioInfoIcono} />
                    <HoverInfoText> {translations[language].terrorismtxt} </HoverInfoText>
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
                  <label htmlFor="HarrassmentorBullying"> {translations[language].harrassment} </label>

                  <ReportReplyInfo>
                    <InfoIcon src={ReportarComentarioInfoIcono} />
                    <HoverInfoText> {translations[language].harrassmenttxt} </HoverInfoText>
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
                  <label htmlFor="SuicideorSelfInjury">  {translations[language].suicide}  </label>

                  <ReportReplyInfo>
                    <InfoIcon src={ReportarComentarioInfoIcono} />
                    <HoverInfoText> {translations[language].suicidetxt}</HoverInfoText>
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
                  <label htmlFor="Missinformation"> {translations[language].missinformation} </label>

                  <ReportReplyInfo>
                    <InfoIcon src={ReportarComentarioInfoIcono} />
                    <HoverInfoText> {translations[language].missinformationtxt} </HoverInfoText>
                  </ReportReplyInfo>

                </ReportReasonOption>

                <ReportReportCancel>
                  <ReportReplyCancel onClick={handleReportReply}>
                    {translations[language].cancel}
                  </ReportReplyCancel>
                  <ReportReplyReport onClick={() => handleReportReplyWithReason(selectedReportReason)}>
                    {translations[language].report}
                  </ReportReplyReport>
                </ReportReportCancel>

              </ReportReplyWrapper>

            </ReportReplyContainer>
          )}

          {showReportReasonPopup && existingReport && (
            <ReportReplyContainer>
              <ReportReplyWrapper>
                <ReportReplyTitle> {translations[language].reportcomment} </ReportReplyTitle>
                <ReportReplyTxt> {translations[language].alreadyreportcomment}  </ReportReplyTxt>
                <ReportReportCancel>
                  <ReportReplyReport onClick={handleReportReply}>
                    {translations[language].goback}
                  </ReportReplyReport>
                </ReportReportCancel>
              </ReportReplyWrapper>
            </ReportReplyContainer>
          )}

          {showReportSubmittedPopup && (
            <ReportReplyContainer>
              <ReportReplyWrapper>
                <ReportReplyTitle> {translations[language].reportsubmitted} </ReportReplyTitle>
                <ReportReplyTxt> {translations[language].reportsubmittedtxt} </ReportReplyTxt>
                <ReportSubmitedButton>
                  <ReportReplyReport onClick={handleReportReplySubmitedClose}>
                    {translations[language].reload}
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
              <ButtonsDiv style={{ marginRight: '8px' }}>
                <CloseButton onClick={handleCancelEdit}> Close </CloseButton>
                <EditButton disabled={!editedReplyText.trim()} onClick={handleSaveEdit}>
                  {translations[language].edit}
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

        <CommentOptions isEditing={isEditing}>
          <Replyy onClick={handleReplyClick}>
            <ReplyImg src={RespuestaIcono} />
            <ReplyText> {translations[language].reply}  </ReplyText>
          </Replyy>

          {!currentUser && isReplyPopupVisible && (
            <ReplyNotLogged ref={replyRef}>

              <ReplyLoggedTxt> {translations[language].replyvalidation} </ReplyLoggedTxt>

              <Link
                to="../../signin"
                style={{
                  textDecoration: "none",
                  color: "inherit",
                }}
              >
                <ItemLogin>
                  <ImgLogin src={InicioSesionIcono2} />
                  <ButtonLoginText> {translations[language].signin} </ButtonLoginText>
                </ItemLogin>
              </Link>

            </ReplyNotLogged>
          )}

          <EstiloLike onClick={handleLikeReply} >
            {currentReply?.likes?.includes(currentUser?._id) ?
              (<LikeImg src={LikedIcono} />) :
              (<LikeImg src={LikeIcono} />)} {" "}
            <LikeDislikeCounter> {currentReply?.likes?.length}</LikeDislikeCounter>
          </EstiloLike>

          {!currentUser && isLikePopupVisible && (
            <LikeNotLogged ref={likeRef}>

              <LikeNotLoggedTxt> {translations[language].likevalidation} </LikeNotLoggedTxt>

              <Link
                to="../../signin"
                style={{
                  textDecoration: "none",
                  color: "inherit",
                }}
              >
                <ItemLogin>
                  <ImgLogin src={InicioSesionIcono2} />
                  <ButtonLoginText> {translations[language].signin} </ButtonLoginText>
                </ItemLogin>
              </Link>

            </LikeNotLogged>
          )}

          <EstiloDislike onClick={handleDislikeReply}>
            {currentReply?.dislikes?.includes(currentUser?._id) ?
              (<DislikeImg src={DislikedIcono} />) :
              (<DislikeImg src={DislikeIcono} />)} {" "}
            <LikeDislikeCounter> {currentReply?.dislikes?.length} </LikeDislikeCounter>
          </EstiloDislike>

          {!currentUser && isDislikePopupVisible && (
            <DislikeNotLogged ref={dislikeRef}>

              <DislikeLoggedTxt> {translations[language].dislikevalidation}  </DislikeLoggedTxt>

              <Link
                to="../../signin"
                style={{
                  textDecoration: "none",
                  color: "inherit",
                }}
              >
                <ItemLogin>
                  <ImgLogin src={InicioSesionIcono2} />
                  <ButtonLoginText> {translations[language].signin} </ButtonLoginText>
                </ItemLogin>
              </Link>

            </DislikeNotLogged>
          )}
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
              <ButtonsDiv style={{ marginRight: '2px' }}>
                <CloseButton
                  onClick={() => {
                    setShowReplySection(false);
                    setIsReplying(false);
                  }}
                >
                  {translations[language].close}
                </CloseButton>
                <ReplyButton onClick={handleReplySubmit}> {translations[language].reply} </ReplyButton>
              </ButtonsDiv>
            </PostReply>
          </ReplyToReply>
        )}
      </Details>
    </Container>
  );
};

export default ReplyComponent;

