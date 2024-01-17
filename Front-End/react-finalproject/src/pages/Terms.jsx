import React, { useState, useEffect, useRef, useContext } from "react";
import styled, { css, keyframes } from "styled-components";
import { useLanguage } from '../utils/LanguageContext';
import { Link, useNavigate } from "react-router-dom";

// CONTAINER
const MainContainer = styled.div`
  position: relative;
  width: 100%;
  top: 0;
  min-height: 100vh;
  background-color: rgba(15, 12, 18);
  margin: auto;
  max-width: 1820px;
  overflow: hidden;
`;

// WRAPPER
const Wrapper = styled.div`
  position: relative;
  width: calc(100% - 1000px);
  height: auto;
  margin: 56px 450px;
  padding: 40px 50px;
  display: flex;
  flex-direction: column;
`;

// LABELS
const Label = styled.label`
    font-size: 20px;
    font-weight: bold;
    font-family: "Roboto Condensed", Helvetica;
    color: ${({ theme }) => theme.text};
    cursor: pointer;
    transition: color 0.2s ease;

    &:hover {
      color: #FF00C0;
    }
`;

const SpanSoft = styled.span`
    font-size: 20px;
    font-weight: bold;
    font-family: "Roboto Condensed", Helvetica;
    color: ${({ theme }) => theme.textSoft};
`;

const TitleLabel = styled.label`
    font-size: 32px;
    font-weight: bold;
    font-family: "Roboto Condensed", Helvetica;
    color: ${({ theme }) => theme.text};
    padding: 40px 0px 20px 0px;
`;

const SubLabel = styled.label`
    font-size: 20px;
    color: ${({ theme }) => theme.text};
    font-weight: bold;
    font-family: "Roboto Condensed", Helvetica;
`;

// 

const HeaderDiv = styled.label`
  position: relative;
  display: flex;
  font-size: 20px;
  color: #bfbfbf;
  font-weight: normal;
  font-family: "Roboto Condensed", Helvetica;
`;

// Parragraph
const ParragraphDiv = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 30px;
`;


const Parragraph = styled.p`
  font-size: 17px;
  color: ${({ theme }) => theme.textSoft};
  font-weight: normal;
  font-family: "Roboto Condensed", Helvetica;
  white-space: pre-line; 
  line-height: 1.25;
  max-width: 100%;
`;

const ContactTxt = styled.p`
  font-size: 16px;
  color: ${({ theme }) => theme.textSoft};
  font-weight: normal;
  font-family: "Roboto Condensed", Helvetica;
  white-space: pre-line; 
  line-height: 1.25;
  max-width: 100%;
  margin-top: -28px;
`;

const Terms = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/");
  };

  // RESET SCROLL
  const scrollToTop = () => {
    window.scrollTo(0, 0);
  };


  useEffect(() => {
    scrollToTop();
  }, []);



  return (
    <MainContainer>

      <Wrapper>

        <HeaderDiv>
          <Label onClick={handleGoHome}> Home </Label> &nbsp;&nbsp;•&nbsp;&nbsp; <SpanSoft> Terms </SpanSoft>
        </HeaderDiv>

        <TitleLabel> Flashy Terms and Conditions of Use </TitleLabel>

        <ParragraphDiv>
          <SubLabel> 1. Terms </SubLabel>
          <Parragraph style={{ marginTop: '-20px' }}>

            By accessing this Website, accessible from https://flashy.com, currently http://localhost:3000, you are agreeing to be bound by these Website
            Terms and Conditions of Use and agree that you are responsible for the agreement with any applicable local laws. If you disagree with any of these terms,
            you are prohibited from accessing this site. The materials contained in this Website are protected by copyright and trade mark law.
          </Parragraph>


          <SubLabel> 2. Use License </SubLabel>
          <Parragraph style={{ marginTop: '-20px' }}>

            Permission is granted to temporarily download one copy of the materials on Flashy for personal, non-commercial transitory viewing only.
            This is the grant of a license, not a transfer of title, and under this license you may not:

          </Parragraph>
          <Parragraph style={{ marginTop: '-15px' }}>

            • &nbsp; Modify or copy the materials;

          </Parragraph>
          <Parragraph style={{ marginTop: '-20px' }}>

            • &nbsp; Use the materials for any commercial purpose or for any public display;

          </Parragraph>
          <Parragraph style={{ marginTop: '-20px' }}>

            • &nbsp; Attempt to reverse engineer any software contained on Flashy;

          </Parragraph>
          <Parragraph style={{ marginTop: '-20px' }}>

            • &nbsp; Remove any copyright or other proprietary notations from the materials; or

          </Parragraph>
          <Parragraph style={{ marginTop: '-20px' }}>

            • &nbsp; Transferring the materials to another person or "mirror" the materials on any other server.

          </Parragraph>
          <Parragraph style={{ marginTop: '-15px' }}>

            This will let Flashy to terminate upon violations of any of these restrictions. Upon termination,
            your viewing right will also be terminated and you should destroy any downloaded materials in your possession whether it is printed or electronic format.
            These Terms of Service has been created with the help of the Terms Of Service Generator and the Privacy Policy Generator.

          </Parragraph>


          <SubLabel> 3. Disclaimer </SubLabel>
          <Parragraph style={{ marginTop: '-20px' }}>
            All the materials on Flashy are provided "as is". Flashy Anime makes no warranties, may it be expressed or implied, therefore negates all other warranties.
            Furthermore, Flashy Anime does not make any representations concerning the accuracy or reliability of the use of the
            materials on its Website or otherwise relating to such materials or any sites linked to this Website.
          </Parragraph>

          <SubLabel> 4. Limitations </SubLabel>
          <Parragraph style={{ marginTop: '-20px' }}>
            Flashy or its suppliers will not be hold accountable for any damages that will arise with the use or inability to use the materials on
            Flashy, even if Flashy or an authorize representative of this Website has been notified, orally or written, of the possibility of such damage.
            Some jurisdiction does not allow limitations on implied warranties or limitations of liability for incidental damages, these limitations may not apply to you.
          </Parragraph>

          <SubLabel> 5. Revisions and Errata </SubLabel>
          <Parragraph style={{ marginTop: '-20px' }}>
            The materials appearing on Flashy may include technical, typographical, or photographic errors.
            Flashy will not promise that any of the materials in this Website are accurate, complete, or current. Flashy may change the materials contained on
            its Website at any time without notice. Flashy does not make any commitment to update the materials.
          </Parragraph>

          <SubLabel> 6. Links </SubLabel>
          <Parragraph style={{ marginTop: '-20px' }}>
            Flashy has not reviewed all of the sites linked to its Website and is not responsible for
            the contents of any such linked site. The presence of any link does not imply endorsement by Flashy of the site.
            The use of any linked website is at the user’s own risk.
          </Parragraph>

          <SubLabel> 7. Site Terms of Use Modifications </SubLabel>
          <Parragraph style={{ marginTop: '-20px' }}>
            Flashy may revise these Terms of Use for its Website at any time without prior notice.
            By using this Website, you are agreeing to be bound by the current version of these Terms and Conditions of Use.
          </Parragraph>

          <SubLabel> 8. Your Privacy </SubLabel>
          <Parragraph style={{ marginTop: '-20px' }}>
            Flashy ensures the privacy of your information.
          </Parragraph>

          <SubLabel> 9. Governing Law </SubLabel>
          <Parragraph style={{ marginTop: '-20px' }}>
            Any claim related to FLashy Anime's Website shall be governed by the laws of bq without regards to its conflict of law provisions.
          </Parragraph>

        </ParragraphDiv>

      </Wrapper>

    </MainContainer >

  );
};

export default Terms;
