import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import DocumentIcon from '../assets/DocumentIcon.png';

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

  const helpRef = useRef(null);

  // HELP SECTIONS DEFINITION

  const helpSections = [
    "Home",
    "Sign up in Flashy",
    "Create a playlist",
    "How can I follow a playlist?",
    "Report a comment",
    "Why should I render my video?",
    "How can I modify my profile?",
    "Who can view my videos?",
    "Why shouldn't I share my account?",
    "How can I recover my account?",
    "How does Spotligth work?",
    "How does Trending work?",
    "How does For You work?",
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

  // SECTION 1
  const handleSignup = () => {
    window.open('/signup', '_blank');
  };

  // SECTION 2
  const handleLibrary = () => {
    window.open('/library', '_blank');
  };

  return (
    <HelpContainerBg>
      <HelpContainer ref={helpRef}>

        <HelpHeader hasBorder={hasBorder}>
          <HelpTitle> Help </HelpTitle>
          <HelpSubTitle> {helpSection === helpSections[0] ? 'How can we help you?' : helpSection}  </HelpSubTitle>
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
                Go to the
                <SubtextLinkClick onClick={handleSignup}>
                  Sign up
                </SubtextLinkClick>
                page.
              </HelpOthersItem>

              <HelpOthersItem>
                <HelpOthersItemNumber>
                  2
                </HelpOthersItemNumber>
                You can either create an Flashy account or you can log in using
                Google or Facebook.
              </HelpOthersItem>

              <HelpOthersItem>
                <HelpOthersItemNumber>
                  3
                </HelpOthersItemNumber>
                To sign up creating a Flashy account fill the requeried fields.
              </HelpOthersItem>

              <HelpOthersItem>
                <HelpOthersItemNumber>
                  4
                </HelpOthersItemNumber>
                Then make sure you check the terms and conditions checkbox.
              </HelpOthersItem>

              <HelpOthersItem>
                <HelpOthersItemNumber>
                  5
                </HelpOthersItemNumber>
                Press the arrow button and complete the hcaptcha, then you are ready!
              </HelpOthersItem>

            </>
          )}

          {helpSection === helpSections[2] && (
            <>

              <HelpOthersItem>
                <HelpOthersItemNumber>
                  1
                </HelpOthersItemNumber>
                Log in.
              </HelpOthersItem>

              <HelpOthersItem>
                <HelpOthersItemNumber>
                  2
                </HelpOthersItemNumber>
                Go to the
                <SubtextLinkClick onClick={handleLibrary}>
                  Library.
                </SubtextLinkClick>
              </HelpOthersItem>

              <HelpOthersItem>
                <HelpOthersItemNumber>
                  3
                </HelpOthersItemNumber>
                Click 'New Playlist', which is the last option in your playlists list.
              </HelpOthersItem>

              <HelpOthersItem>
                <HelpOthersItemNumber>
                  4
                </HelpOthersItemNumber>
                Fill the requeried fields and set your preferences.
              </HelpOthersItem>

              <HelpOthersItem>
                <HelpOthersItemNumber>
                  4
                </HelpOthersItemNumber>
                You are all set!
              </HelpOthersItem>


            </>
          )}

          {helpSection === helpSections[3] && (
            <>

              <HelpOthersItem>
                <HelpOthersItemNumber>
                  1
                </HelpOthersItemNumber>
                Get the link of the playlist you want to follow.
              </HelpOthersItem>

              <HelpOthersItem>
                <HelpOthersItemNumber>
                  2
                </HelpOthersItemNumber>
                Click on the heart icon.
              </HelpOthersItem>

              <HelpOthersItem>
                <HelpOthersItemNumber>
                  3
                </HelpOthersItemNumber>
                Done, now you know how to follow a playlist!
              </HelpOthersItem>

              <HelpOthersItem>
                <HelpOthersItemNumber>
                  4
                </HelpOthersItemNumber>
                Note: you can also find a playlist with the search bar.
              </HelpOthersItem>


            </>
          )}

          {helpSection === helpSections[4] && (
            <>

              <HelpOthersItem>
                <HelpOthersItemNumber>
                  1
                </HelpOthersItemNumber>
                Click the menu dots on the comment you want to report.
              </HelpOthersItem>

              <HelpOthersItem>
                <HelpOthersItemNumber>
                  2
                </HelpOthersItemNumber>
                Click the report option.
              </HelpOthersItem>

              <HelpOthersItem>
                <HelpOthersItemNumber>
                  3
                </HelpOthersItemNumber>
                Select the reasons for your report.
              </HelpOthersItem>

              <HelpOthersItem>
                <HelpOthersItemNumber>
                  4
                </HelpOthersItemNumber>
                Done, comment reported!
              </HelpOthersItem>

            </>
          )}

          {helpSection === helpSections[5] && (
            <>

              <HelpOthersItem>
                <HelpOthersItemNumber>
                  1
                </HelpOthersItemNumber>
                By rendering your video your viewers will be able to select different resolutions.
              </HelpOthersItem>

              <HelpOthersItem>
                <HelpOthersItemNumber>
                  2
                </HelpOthersItemNumber>
                Aditionally, your viewers will be able to see preview thumbnails.
              </HelpOthersItem>

            </>
          )}

          {helpSection === helpSections[6] && (
            <>

              <HelpOthersItem>
                <HelpOthersItemNumber>
                  1
                </HelpOthersItemNumber>
                We are working on it!
              </HelpOthersItem>

            </>
          )}


          {helpSection === helpSections[7] && (
            <>

              <HelpOthersItem>
                <HelpOthersItemNumber>
                  1
                </HelpOthersItemNumber>
                Public video: everyone can search and watch your video.
              </HelpOthersItem>

              <HelpOthersItem>
                <HelpOthersItemNumber>
                  2
                </HelpOthersItemNumber>
                Private video: only you and allowed users can watch your video.
              </HelpOthersItem>

              <HelpOthersItem>
                <HelpOthersItemNumber>
                  3
                </HelpOthersItemNumber>
                Unlisted video: those users with the link can watch your video.
              </HelpOthersItem>

            </>
          )}

          {helpSection === helpSections[8] && (
            <>

              <HelpOthersItem>
                <HelpOthersItemNumber>
                  1
                </HelpOthersItemNumber>
                By sharing your account, you will be exposed to losing it.
              </HelpOthersItem>

              <HelpOthersItem>
                <HelpOthersItemNumber>
                  2
                </HelpOthersItemNumber>
                We are not responsible for your account in case this happen.
              </HelpOthersItem>

            </>
          )}

          {helpSection === helpSections[9] && (
            <>

              <HelpOthersItem>
                <HelpOthersItemNumber>
                  1
                </HelpOthersItemNumber>
                We are working on it!
              </HelpOthersItem>


            </>
          )}

          {helpSection === helpSections[10] && (
            <>

              <HelpOthersItem>
                <HelpOthersItemNumber>
                  1
                </HelpOthersItemNumber>
                Spotligth will show the videos with more likes in the last month.
              </HelpOthersItem>

            </>
          )}

          {helpSection === helpSections[11] && (
            <>

              <HelpOthersItem>
                <HelpOthersItemNumber>
                  1
                </HelpOthersItemNumber>
                Trending will show the videos with more views in the last month.
              </HelpOthersItem>

            </>
          )}

          {helpSection === helpSections[12] && (
            <>

              <HelpOthersItem>
                <HelpOthersItemNumber>
                  1
                </HelpOthersItemNumber>
                The "For You" section features trending videos from the users you are suscribed to.
              </HelpOthersItem>

            </>
          )}

        </HelpContainerWrapper>

        <HelpFooter>
          <HelpFooterWrapper>
            {helpSection !== helpSections[0] && (
              <HelpButtonBack onClick={() => setHelpSection(helpSections[0])}>
                Back
              </HelpButtonBack>
            )}
            <HelpButtonClose onClick={handleCloseHelp} helpSection={helpSection}>
              Close
            </HelpButtonClose>
          </HelpFooterWrapper>
        </HelpFooter>
      </HelpContainer>

    </HelpContainerBg>
  );
};

export default Help;
