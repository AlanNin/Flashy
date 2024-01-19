import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import DocumentIcon from '../assets/DocumentIcon.png';
import { useLanguage } from '../utils/LanguageContext';

// BACKGROUND
const HelpContainerBg = styled.div`
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

// CONTAINER
const HelpContainer = styled.div`
  position: relative;
  width: 400px;
  height: max-content;
  padding-bottom: 60px;
  background: #1D1D1D;
  color: ${({ theme }) => theme.text};
  border-radius: 10px;
  display: flex;
  flex-direction: column;
`;

// HEADER
const HelpHeader = styled.div`
    position: absolute;
    width: 100%;
    padding: 20px 0px;
    background: transparent;
    border-radius: 10px 10px 0px 0px;
    transition: box-shadow 0.3s ease;
    border-bottom: ${({ hasBorder }) => (hasBorder ? '1px solid rgba(0, 0, 0, 0.5)' : 'none')}; 
    box-shadow: ${({ hasBorder }) => (hasBorder ? '0px 4px 4px -2px rgba(0, 0, 0, 0.4)' : 'none')}; /* Agregamos la sombra abajo cuando tiene el borde */
`;

// HELP TITLE
const HelpTitle = styled.label`
    display: flex;
    font-size: 28px;
    font-weight: bold;
    font-family: "Roboto Condensed", Helvetica;
    justify-content: center;
`;

const HelpSubTitle = styled.label`
    display: flex;
    justify-content: center;
    margin-top: 5px;
    font-size: 16px;
    color: ${({ theme }) => theme.textSoft};
    font-weight: normal;
    font-family: "Roboto Condensed", Helvetica;
`;

// CONTAINER WRAPPER
const HelpContainerWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: auto;
  margin-top: 99px;
  padding-bottom: 20px;
  height: max-content;
  max-height: calc(648px - 178px);
  overflow: hidden;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 0px;
  }
`;

// FOOTER
const HelpFooter = styled.div`
    position: absolute;
    background-color: rgba(8, 5, 8, 0.5);
    display: flex;
    width: 100%;
    height: 60px;
    border-radius: 0px 0px 10px 10px;
    margin-top: auto;
    bottom: 0px;
    overflow: hidden;
`;

const HelpFooterWrapper = styled.div`
    position: relative;
    display: flex;
    width: 100%;
    height: 100%;
    padding: 15px 15px;
`;

// CLOSE BUTTON
const HelpButtonClose = styled.button`
    margin-left: ${({ helpSection }) => (helpSection === 'Home' ? 'auto' : '10px')}; 
    border-radius: 3px;
    height: max-content;
    border: none;
    padding: 7px 15px;
    cursor: pointer;
    background-color: rgba(82, 41, 73, 0.7);
    color: ${({ theme }) => theme.text};
    font-weight: normal;
    font-size: 16px;
    font-family: "Roboto Condensed", Helvetica;
`;

// BACK BUTTON
const HelpButtonBack = styled.button`
    margin-left: auto;
    border-radius: 3px;
    height: max-content;
    border: none;
    padding: 7px 15px;
    cursor: pointer;
    background-color: transparent;
    color: ${({ theme }) => theme.text};
    font-weight: normal;
    font-size: 16px;
    font-family: "Roboto Condensed", Helvetica;
`;

// HOME

// HELP ITEM
const HelpItem = styled.div`
  position: relative;
  display: flex;
  width: auto;
  height: max-content;
  padding: 20px 30px;
  cursor: pointer;
  align-items: center;
  gap: 10px;

  color: ${({ theme }) => theme.text};
  font-weight: normal;
  font-size: 17px;
  font-family: "Roboto Condensed", Helvetica;
  line-height: 1.5;

  &:hover {
    background: rgba(130, 130, 129, 0.1);
  }
`;

const HelpItemImg = styled.img`
  width: 20px;
  height: 20px;
  padding: 6px 5px 6px 7px;
  background: rgba(176, 51, 120, 0.2);
  border-radius: 50%;
`;

// OTHER SECTIONS

const SubtextLinkClick = styled.span`
  cursor: pointer;
  text-decoration: underline;
  color: ${({ theme }) => theme.text};
  font-weight: normal;
  font-size: 17px;
  font-family: "Roboto Condensed", Helvetica;
  line-height: 1.5;
  margin: 0 4px;
`;

// HELP ITEM
const HelpOthersItem = styled.div`
  position: relative;
  display: flex;
  width: auto;
  height: max-content;
  padding: 20px 30px;
  align-items: center;

  color: ${({ theme }) => theme.text};
  font-weight: normal;
  font-size: 16px;
  font-family: "Roboto Condensed", Helvetica;
  line-height: 1.5;
`;

const HelpOthersItemNumber = styled.div`
  width: max-content;
  height: max-content;
  padding: 5px 9px;
  background: rgba(176, 51, 120, 0.2);
  border-radius: 50%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 10px;

  color: ${({ theme }) => theme.textSoft};
  font-size: 16px;
  font-weight: normal;
  line-height: 1;
`;

const Help = ({ handleCloseHelp }) => {
  const { language, setLanguage } = useLanguage();

  // TRANSLATIONS
  const translations = {
    en: {
      home: "Home",
      signup: "Sign up in Flashy",
      createpl: "Create a playlist",
      followpl: "How can I follow a playlist?",
      reportcm: "Report a comment",
      rendervid: "Why should I render my video?",
      modifypf: "How can I modify my profile?",
      viewvid: "Who can view my videos?",
      dontshareacc: "Why shouldn't I share my account?",
      recoveracc: "How can I recover my account?",
      spotligth: "How does Spotligth work?",
      trending: "How does Trending work?",
      fyp: "How does For You work?",

      help: "Help",
      howhelp: "How can we help you?",
      back: "Back",
      close: "Close",

      sc1: "Go to the",
      sc11: "Sign up",
      sc12: "page.",
      sc13: "You can either create an Flashy account or you can log in using Google or Facebook.",
      sc14: "To sign up creating a Flashy account fill the requeried fields.",
      sc15: "Then make sure you check the terms and conditions checkbox.",
      sc16: "Press the arrow button and complete the Hcaptcha, then you are ready!",

      sc2: "Log in.",
      sc21: "Go to the",
      sc22: "Library.",
      sc23: "Click 'New Playlist', which is the last option in your playlists list.",
      sc24: "Fill the requeried fields and set your preferences.",
      sc25: "You are all set!",

      sc3: "Get the link of the playlist you want to follow.",
      sc31: "Click on the heart icon.",
      sc32: "Done, now you know how to follow a playlist!",
      sc33: "Note: you can also find a playlist with the search bar.",

      sc4: "Click the menu dots on the comment you want to report.",
      sc41: "Click the report option.",
      sc42: "Select the reasons for your report.",
      sc43: "Done, comment reported!",

      sc5: "By rendering your video your viewers will be able to select different resolutions.",
      sc51: "Aditionally, your viewers will be able to see preview thumbnails.",

      sc6: "Log in.",
      sc61: "Go to",
      sc62: "Settings.",
      sc63: "Personalize your profile as you want.",
      sc64: "You are all set!",

      sc7: "Public video: everyone can search and watch your video.",
      sc71: "Private video: only you and allowed users can watch your video.",
      sc72: "Unlisted video: those users with the link can watch your video.",

      sc8: "By sharing your account, you will be exposed to losing it.",
      sc81: "We are not responsible for your account in case this happen.",

      sc9: "Go to the",
      sc91: "Sign in",
      sc92: "page.",
      sc93: "Click 'Can't sign in'.",
      sc94: "Follow the recovery steps.",

      sc10: "Spotligth will show the videos with more likes in the last month.",

      sc111: "Trending will show the videos with more views in the last month.",

      sc122: "The For You section features trending videos from the users you are suscribed to.",
    },
    es: {
      home: "Inicio",
      signup: "Registrarme en Flashy",
      createpl: "Crear una lista de reproducción",
      followpl: "¿Cómo puedo seguir una lista de reproducción?",
      reportcm: "Reportar un comentario",
      rendervid: "¿Por qué debería renderizar mi video?",
      modifypf: "¿Cómo puedo modificar mi perfil?",
      viewvid: "¿Quién puede ver mis videos?",
      dontshareacc: "¿Por qué no debería compartir mi cuenta?",
      recoveracc: "¿Cómo puedo recuperar mi cuenta?",
      spotligth: "¿Cómo funciona Spotligth?",
      trending: "¿Cómo funciona Tendencias?",
      fyp: "¿Cómo funciona Para Ti?",

      help: "Ayuda",
      howhelp: "Como podemos ayudarte?",
      back: "Regresar",
      close: "Cerrar",

      sc1: "Ve a la",
      sc11: "Registro",
      sc12: "página.",
      sc13: "Puedes crear una cuenta en Flashy o iniciar sesión con Google o Facebook.",
      sc14: "Para registrarte creando una cuenta en Flashy, completa los campos requeridos.",
      sc15: "Asegúrate de marcar la casilla de términos y condiciones.",
      sc16: "Presiona el botón de flecha y completa el Hcaptcha, ¡y listo!",

      sc2: "Inicia sesión.",
      sc21: "Ve a la",
      sc22: "Biblioteca.",
      sc23: "Haz clic en 'Nueva lista de reproducción', que es la última opción en tu lista de reproducciones.",
      sc24: "Completa los campos requeridos y configura tus preferencias.",
      sc25: "¡Ya estás listo!",

      sc3: "Obtén el enlace de la lista de reproducción que deseas seguir.",
      sc31: "Haz clic en el ícono de corazón.",
      sc32: "¡Listo, ahora sabes cómo seguir una lista de reproducción!",
      sc33: "Nota: también puedes encontrar una lista de reproducción con la barra de búsqueda.",

      sc4: "Haz clic en los tres puntos del menú en el comentario que deseas informar.",
      sc41: "Haz clic en la opción de informe.",
      sc42: "Selecciona los motivos de tu informe.",
      sc43: "¡Listo, comentario informado!",

      sc5: "Al renderizar tu video, tus espectadores podrán seleccionar diferentes resoluciones.",
      sc51: "Además, tus espectadores podrán ver miniaturas de vista previa.",

      sc6: "Inicia sesión.",
      sc61: "Ve a",
      sc62: "Configuración.",
      sc63: "Personaliza tu perfil como desees.",
      sc64: "¡Ya estás listo!",

      sc7: "Video público: cualquiera puede buscar y ver tu video.",
      sc71: "Video privado: solo tú y los usuarios permitidos pueden ver tu video.",
      sc72: "Video no listado: aquellos usuarios con el enlace pueden ver tu video.",

      sc8: "Al compartir tu cuenta, te expones a perderla.",
      sc81: "No nos hacemos responsables de tu cuenta en caso de pérdida.",

      sc9: "Ve a la",
      sc91: "Iniciar sesión",
      sc92: "página.",
      sc93: "Haz clic en 'No puedo iniciar sesión'.",
      sc94: "Sigue los pasos de recuperación.",

      sc10: "Spotligth mostrará los videos con más likes en el último mes.",

      sc111: "Trending mostrará los videos con más vistas en el último mes.",

      sc122: "La sección 'Para Ti' presenta videos populares de los usuarios a los que estás suscrito.",
    },
  };


  const helpRef = useRef(null);

  // HELP SECTIONS DEFINITION

  const helpSections = [
    translations[language].home,
    translations[language].signup,
    translations[language].createpl,
    translations[language].followpl,
    translations[language].reportcm,
    translations[language].rendervid,
    translations[language].modifypf,
    translations[language].viewvid,
    translations[language].dontshareacc,
    translations[language].recoveracc,
    translations[language].spotligth,
    translations[language].trending,
    translations[language].fyp,
  ];

  const [helpSection, setHelpSection] = useState(helpSections[0]);

  // CLOSE IF CLICK OUTSIDE HELP CONTAINER
  useEffect(() => {
    const handleClickOutsideHelp = (event) => {
      if (
        helpRef.current &&
        !helpRef.current.contains(event.target)
      ) {
        handleCloseHelp();
      }
    };
    document.addEventListener("mousedown", handleClickOutsideHelp);
    return () => {
      document.removeEventListener("mousedown", handleClickOutsideHelp);
    };
  }, [helpRef]);

  // BORDER TO HEADER
  const [hasBorder, setHasBorder] = useState(false);
  const contentRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (contentRef.current.scrollTop > 0 && !hasBorder) {
        setHasBorder(true);
      } else if (contentRef.current.scrollTop === 0 && hasBorder) {
        setHasBorder(false);
      }
    };

    contentRef.current.addEventListener('scroll', handleScroll);

    return () => {
      if (contentRef.current) {
        contentRef.current.removeEventListener('scroll', handleScroll);
      }
    };
  }, [hasBorder]);

  const handleSignup = () => {
    window.open('/signup', '_blank');
  };

  const handleSignin = () => {
    window.open('/signin', '_blank');
  };

  const handleLibrary = () => {
    window.open('/library', '_blank');
  };

  const handleSettings = () => {
    window.open('/settings', '_blank');
  };

  return (
    <HelpContainerBg>
      <HelpContainer ref={helpRef}>

        <HelpHeader hasBorder={hasBorder}>
          <HelpTitle> {translations[language].help} </HelpTitle>
          <HelpSubTitle> {helpSection === helpSections[0] ? translations[language].howhelp : helpSection}  </HelpSubTitle>
        </HelpHeader>


        <HelpContainerWrapper ref={contentRef}>
          {helpSection === helpSections[0] && (
            <>

              <HelpItem onClick={() => setHelpSection(helpSections[1])}>
                <HelpItemImg src={DocumentIcon} /> {helpSections[1]}
              </HelpItem>

              <HelpItem onClick={() => setHelpSection(helpSections[2])}>
                <HelpItemImg src={DocumentIcon} /> {helpSections[2]}
              </HelpItem>

              <HelpItem onClick={() => setHelpSection(helpSections[3])}>
                <HelpItemImg src={DocumentIcon} /> {helpSections[3]}
              </HelpItem>

              <HelpItem onClick={() => setHelpSection(helpSections[4])}>
                <HelpItemImg src={DocumentIcon} /> {helpSections[4]}
              </HelpItem>

              <HelpItem onClick={() => setHelpSection(helpSections[5])}>
                <HelpItemImg src={DocumentIcon} /> {helpSections[5]}
              </HelpItem>

              <HelpItem onClick={() => setHelpSection(helpSections[6])}>
                <HelpItemImg src={DocumentIcon} /> {helpSections[6]}
              </HelpItem>

              <HelpItem onClick={() => setHelpSection(helpSections[7])}>
                <HelpItemImg src={DocumentIcon} /> {helpSections[7]}
              </HelpItem>

              <HelpItem onClick={() => setHelpSection(helpSections[8])}>
                <HelpItemImg src={DocumentIcon} /> {helpSections[8]}
              </HelpItem>

              <HelpItem onClick={() => setHelpSection(helpSections[9])}>
                <HelpItemImg src={DocumentIcon} /> {helpSections[9]}
              </HelpItem>

              <HelpItem onClick={() => setHelpSection(helpSections[10])}>
                <HelpItemImg src={DocumentIcon} /> {helpSections[10]}
              </HelpItem>

              <HelpItem onClick={() => setHelpSection(helpSections[11])}>
                <HelpItemImg src={DocumentIcon} /> {helpSections[11]}
              </HelpItem>

              <HelpItem onClick={() => setHelpSection(helpSections[12])}>
                <HelpItemImg src={DocumentIcon} /> {helpSections[12]}
              </HelpItem>

            </>

          )}
          {helpSection === helpSections[1] && (
            <>

              <HelpOthersItem>
                <HelpOthersItemNumber>
                  1
                </HelpOthersItemNumber>
                {translations[language].sc1}
                <SubtextLinkClick onClick={handleSignup}>
                  {translations[language].sc11}
                </SubtextLinkClick>
                {translations[language].sc12}
              </HelpOthersItem>

              <HelpOthersItem>
                <HelpOthersItemNumber>
                  2
                </HelpOthersItemNumber>
                {translations[language].sc13}
              </HelpOthersItem>

              <HelpOthersItem>
                <HelpOthersItemNumber>
                  3
                </HelpOthersItemNumber>
                {translations[language].sc14}
              </HelpOthersItem>

              <HelpOthersItem>
                <HelpOthersItemNumber>
                  4
                </HelpOthersItemNumber>
                {translations[language].sc15}
              </HelpOthersItem>

              <HelpOthersItem>
                <HelpOthersItemNumber>
                  5
                </HelpOthersItemNumber>
                {translations[language].sc16}
              </HelpOthersItem>

            </>
          )}

          {helpSection === helpSections[2] && (
            <>

              <HelpOthersItem>
                <HelpOthersItemNumber>
                  1
                </HelpOthersItemNumber>
                {translations[language].sc2}
              </HelpOthersItem>

              <HelpOthersItem>
                <HelpOthersItemNumber>
                  2
                </HelpOthersItemNumber>
                {translations[language].sc21}
                <SubtextLinkClick onClick={handleLibrary}>
                  {translations[language].sc22}
                </SubtextLinkClick>
              </HelpOthersItem>

              <HelpOthersItem>
                <HelpOthersItemNumber>
                  3
                </HelpOthersItemNumber>
                {translations[language].sc23}
              </HelpOthersItem>

              <HelpOthersItem>
                <HelpOthersItemNumber>
                  4
                </HelpOthersItemNumber>
                {translations[language].sc24}
              </HelpOthersItem>

              <HelpOthersItem>
                <HelpOthersItemNumber>
                  5
                </HelpOthersItemNumber>
                {translations[language].sc25}
              </HelpOthersItem>

            </>
          )}

          {helpSection === helpSections[3] && (
            <>

              <HelpOthersItem>
                <HelpOthersItemNumber>
                  1
                </HelpOthersItemNumber>
                {translations[language].sc3}
              </HelpOthersItem>

              <HelpOthersItem>
                <HelpOthersItemNumber>
                  2
                </HelpOthersItemNumber>
                {translations[language].sc31}
              </HelpOthersItem>

              <HelpOthersItem>
                <HelpOthersItemNumber>
                  3
                </HelpOthersItemNumber>
                {translations[language].sc32}
              </HelpOthersItem>

              <HelpOthersItem>
                <HelpOthersItemNumber>
                  4
                </HelpOthersItemNumber>
                {translations[language].sc33}
              </HelpOthersItem>


            </>
          )}

          {helpSection === helpSections[4] && (
            <>

              <HelpOthersItem>
                <HelpOthersItemNumber>
                  1
                </HelpOthersItemNumber>
                {translations[language].sc4}
              </HelpOthersItem>

              <HelpOthersItem>
                <HelpOthersItemNumber>
                  2
                </HelpOthersItemNumber>
                {translations[language].sc41}
              </HelpOthersItem>

              <HelpOthersItem>
                <HelpOthersItemNumber>
                  3
                </HelpOthersItemNumber>
                {translations[language].sc42}
              </HelpOthersItem>

              <HelpOthersItem>
                <HelpOthersItemNumber>
                  4
                </HelpOthersItemNumber>
                {translations[language].sc42}
              </HelpOthersItem>

            </>
          )}

          {helpSection === helpSections[5] && (
            <>

              <HelpOthersItem>
                <HelpOthersItemNumber>
                  1
                </HelpOthersItemNumber>
                {translations[language].sc5}
              </HelpOthersItem>

              <HelpOthersItem>
                <HelpOthersItemNumber>
                  2
                </HelpOthersItemNumber>
                {translations[language].sc51}
              </HelpOthersItem>

            </>
          )}

          {helpSection === helpSections[6] && (
            <>

              <HelpOthersItem>
                <HelpOthersItemNumber>
                  1
                </HelpOthersItemNumber>
                {translations[language].sc6}
              </HelpOthersItem>

              <HelpOthersItem>
                <HelpOthersItemNumber>
                  2
                </HelpOthersItemNumber>
                {translations[language].sc61}
                <SubtextLinkClick onClick={handleSettings}>
                  {translations[language].sc62}
                </SubtextLinkClick>
              </HelpOthersItem>

              <HelpOthersItem>
                <HelpOthersItemNumber>
                  3
                </HelpOthersItemNumber>
                {translations[language].sc63}
              </HelpOthersItem>

              <HelpOthersItem>
                <HelpOthersItemNumber>
                  4
                </HelpOthersItemNumber>
                {translations[language].sc64}
              </HelpOthersItem>

            </>
          )}


          {helpSection === helpSections[7] && (
            <>

              <HelpOthersItem>
                <HelpOthersItemNumber>
                  1
                </HelpOthersItemNumber>
                {translations[language].sc7}
              </HelpOthersItem>

              <HelpOthersItem>
                <HelpOthersItemNumber>
                  2
                </HelpOthersItemNumber>
                {translations[language].sc71}
              </HelpOthersItem>

              <HelpOthersItem>
                <HelpOthersItemNumber>
                  3
                </HelpOthersItemNumber>
                {translations[language].sc72}
              </HelpOthersItem>

            </>
          )}

          {helpSection === helpSections[8] && (
            <>

              <HelpOthersItem>
                <HelpOthersItemNumber>
                  1
                </HelpOthersItemNumber>
                {translations[language].sc8}
              </HelpOthersItem>

              <HelpOthersItem>
                <HelpOthersItemNumber>
                  2
                </HelpOthersItemNumber>
                {translations[language].sc81}
              </HelpOthersItem>

            </>
          )}

          {helpSection === helpSections[9] && (
            <>

              <HelpOthersItem>
                <HelpOthersItemNumber>
                  1
                </HelpOthersItemNumber>
                {translations[language].sc9}
                <SubtextLinkClick onClick={handleSignin}>
                  {translations[language].sc91}
                </SubtextLinkClick>
                {translations[language].sc92}
              </HelpOthersItem>

              <HelpOthersItem>
                <HelpOthersItemNumber>
                  2
                </HelpOthersItemNumber>
                {translations[language].sc93}
              </HelpOthersItem>

              <HelpOthersItem>
                <HelpOthersItemNumber>
                  3
                </HelpOthersItemNumber>
                {translations[language].sc94}
              </HelpOthersItem>

            </>
          )}

          {helpSection === helpSections[10] && (
            <>

              <HelpOthersItem>
                <HelpOthersItemNumber>
                  1
                </HelpOthersItemNumber>
                {translations[language].sc10}
              </HelpOthersItem>

            </>
          )}

          {helpSection === helpSections[11] && (
            <>

              <HelpOthersItem>
                <HelpOthersItemNumber>
                  1
                </HelpOthersItemNumber>
                {translations[language].sc111}
              </HelpOthersItem>

            </>
          )}

          {helpSection === helpSections[12] && (
            <>

              <HelpOthersItem>
                <HelpOthersItemNumber>
                  1
                </HelpOthersItemNumber>
                {translations[language].sc122}
              </HelpOthersItem>

            </>
          )}

        </HelpContainerWrapper>

        <HelpFooter>
          <HelpFooterWrapper>
            {helpSection !== helpSections[0] && (
              <HelpButtonBack onClick={() => setHelpSection(helpSections[0])}>
                {translations[language].back}
              </HelpButtonBack>
            )}
            <HelpButtonClose onClick={handleCloseHelp} helpSection={helpSection}>
              {translations[language].close}
            </HelpButtonClose>
          </HelpFooterWrapper>
        </HelpFooter>
      </HelpContainer>

    </HelpContainerBg>
  );
};

export default Help;
