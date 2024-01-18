import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import RemoveEmailIcon from "../assets/RemoveEmailIcon.png";
import { useLanguage } from '../utils/LanguageContext';

const SharePrivateContainerBg = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background-color: #000000b9;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 4;
`;

const SharePrivateContainer = styled.div`
  position: relative;
  width: 35%;
  height: auto;
  background: #1D1D1D;
  color: ${({ theme }) => theme.text};
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  padding: 25px 0px 100px 0px;
`;

const SharePrivateWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: calc(100% - 80px);
  height: 100%;
  gap: 30px;
  padding: 15px 40px;
`;

const SharePrivateFooter = styled.div`
  position: absolute;
  display: flex;
  width: 100%;
  height: 40px;
  background-color: rgba(8, 5, 8, 0.5);
  padding: 10px 0px;
  border-radius: 0px 0px 5px 5px;
  align-items: center;
  bottom: 0px;
`;

const SharePrivateSaveButton = styled.button`
  border: none;
  width: max-content;
  height: max-content;
  padding: 8px 18px;
  border-radius: 3px;
  position: relative;
  font-size: 16px;
  font-weight: bold;
  font-family: "Roboto Condensed", Helvetica;
  cursor: pointer;
  background: rgba(82, 41, 73, 0.7);
  color: ${({ theme }) => theme.text};
  margin-left: 10px;
  margin-right: 30px;
`;

const SharePrivateCancelButton = styled.button`
  border: none;
  width: max-content;
  height: max-content;
  padding: 8px 18px;
  border-radius: 3px;
  position: relative;
  font-size: 16px;
  font-weight: bold;
  font-family: "Roboto Condensed", Helvetica;
  cursor: pointer;
  background: transparent;
  color: ${({ theme }) => theme.text};
  margin-left: auto;
`;

const SharePrivateTitle = styled.h1`
  text-align: center;
  font-size: 28px;
  font-family: "Roboto Condensed", Helvetica;
  padding-bottom: 15px;
  padding-top: 10px;
`;

const SharePrivateLabel = styled.label`
  font-size: 22px;
  font-weight: normal;
  font-family: "Roboto Condensed", Helvetica;
  margin-top: -10px;
`;

const SharePrivateSubLabel = styled.label`
  font-size: 16px;
  color: ${({ theme }) => theme.textSoft};
  font-weight: normal;
  font-family: "Roboto Condensed", Helvetica;
`;

const SharePrivateTextareaContainer = styled.div`
  position: relative;
  width: calc(100% - 10px);
  max-height: 100px;
  margin-top: 2px;
  margin-bottom: -5px;
  cursor: text;
`;

const EmailContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 10px 0px 40px 10px;
  background: transparent;
  height: 50px;
  &:focus-within {
    border-color: #8e58d6;
  }
  overflow-y: auto;

`;

const EmailBlock = styled.div`
  background-color: #7958a6;
  padding: 4px 5px;
  margin-top: 3px;
  margin-left: 5px;
  border-radius: 5px;
  height: max-content;
  text-align: center;
  align-items: center;
  font-size: 18px;
  font-weight: normal;
  font-family: "Roboto Condensed", Helvetica;
  display: flex;
  cursor: default;
`;

const EmailBlockRemoveImg = styled.img`
  height: 20px;
  width: 20px;
  margin-right: 6px;
  margin-left: 4px;
  cursor: pointer;
`;

const SharePrivateComponent = ({ SharePrivate, onInviteChange, togglePopup, savedEmails }) => {
  const { language, setLanguage } = useLanguage();
  const [emailList, setEmailList] = useState('');
  const [emails, setEmails] = useState(savedEmails || []);
  const inputRef = useRef(null);

  const handleRemoveEmailClick = (index, e) => {
    e.stopPropagation();
    removeEmail(index);
  };

  const handleEmailListChange = (e) => {
    setEmailList(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const email = emailList.trim();
      if (email !== '') {
        setEmails([...emails, email]);
        setEmailList('');
      }
    }
  };

  const removeEmail = (index) => {
    const updatedEmails = [...emails];
    updatedEmails.splice(index, 1);
    setEmails(updatedEmails);
  };

  const handleEmailContainerClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleSaveClick = () => {
    onInviteChange(emails);
    togglePopup();
  };

  const translations = {
    en: {
      sharet: "Share Private Video",
      invite: "Invite via Email",
      inviteph: "Enter a new email",
      invitesub: "You can invite others to be able to watch your private video by adding their email addresses here.",
      note: "Note: to add an email just press 'space' or 'enter', to remove click in the minus icon.",
      cancel: "Cancel",
      save: "Save",
    },
    es: {
      sharet: "Compartir Video Privado",
      invite: "Invitar por Correo Electrónico",
      inviteph: "Ingresa un nuevo correo",
      invitesub: "Puedes invitar a otros a ver tu video privado agregando sus direcciones de correo electrónico aquí.",
      note: "Nota: para agregar un correo electrónico, simplemente presiona 'espacio' o 'enter', para eliminar, haz clic en el icono de menos.",
      cancel: "Cancelar",
      save: "Guardar",
    },
  };


  return (
    <SharePrivateContainerBg>
      <SharePrivateContainer>
        <SharePrivateWrapper>
          <>
            <SharePrivateTitle> {translations[language].sharet} </SharePrivateTitle>
            <SharePrivateLabel>{translations[language].invite}</SharePrivateLabel>
            <SharePrivateSubLabel style={{ marginTop: '-20px' }}>
              {translations[language].invitesub}
            </SharePrivateSubLabel>

            <SharePrivateTextareaContainer
              onClick={handleEmailContainerClick}
            >
              <EmailContainer>
                {emails.map((email, index) => (
                  <EmailBlock key={index}>
                    <EmailBlockRemoveImg
                      src={RemoveEmailIcon}
                      onClick={(e) => handleRemoveEmailClick(index, e)} />
                    {email}
                  </EmailBlock>
                ))}
                <input
                  type="text"
                  value={emailList}
                  onChange={handleEmailListChange}
                  onKeyPress={handleKeyPress}
                  placeholder={translations[language].inviteph}
                  style={{
                    backgroundColor: 'transparent',
                    border: 'none',
                    color: 'white',
                    width: 'auto',
                    padding: '5px 5px',
                    marginBottom: '15px',
                    outline: 'none',
                    fontFamily: '"Roboto Condensed", Helvetica',
                    fontSize: '18px',
                  }}
                  ref={inputRef}
                />
              </EmailContainer>
            </SharePrivateTextareaContainer>

            <SharePrivateSubLabel style={{ marginBottom: '-20px' }}>
              {translations[language].note}
            </SharePrivateSubLabel>
          </>
        </SharePrivateWrapper>

        <SharePrivateFooter>
          <SharePrivateCancelButton onClick={togglePopup}>{translations[language].cancel}</SharePrivateCancelButton>
          <SharePrivateSaveButton onClick={handleSaveClick}>{translations[language].save}</SharePrivateSaveButton>
        </SharePrivateFooter>
      </SharePrivateContainer>
    </SharePrivateContainerBg>
  );
};

export default SharePrivateComponent;
