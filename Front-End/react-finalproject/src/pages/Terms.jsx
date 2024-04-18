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
  const { language, setLanguage } = useLanguage();

  // TRANSLATIONS
  const translations = {
    en: {
      home: "Home",
      terms: "Terms",
      termsflashy: "Flashy Terms and Conditions of Use",
      t1: "1. Terms",
      p1: "By accessing this Website, accessible from https://flashy.com, currently http://localhost:3000, you are agreeing to be bound by these Website Terms and Conditions of Use and agree that you are responsible for the agreement with any applicable local laws. If you disagree with any of these terms, you are prohibited from accessing this site. The materials contained in this Website are protected by copyright and trade mark law.",
      t2: "2. Use License",
      p2: "Permission is granted to temporarily download one copy of the materials on Flashy for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:",
      p21: "Modify or copy the materials;",
      p22: "Use the materials for any commercial purpose or for any public display;",
      p23: "Attempt to reverse engineer any software contained on Flashy;",
      p24: "Remove any copyright or other proprietary notations from the materials; or",
      p25: "Transferring the materials to another person or mirror the materials on any other server.",
      p26: "This will let Flashy to terminate upon violations of any of these restrictions. Upon termination, your viewing right will also be terminated and you should destroy any downloaded materials in your possession whether it is printed or electronic format. These Terms of Service has been created with the help of the Terms Of Service Generator and the Privacy Policy Generator.",
      t3: "3. Disclaimer",
      p3: "All the materials on Flashy are provided as is. Flashy Anime makes no warranties, may it be expressed or implied, therefore negates all other warranties. Furthermore, Flashy Anime does not make any representations concerning the accuracy or reliability of the use of the materials on its Website or otherwise relating to such materials or any sites linked to this Website.",
      t4: "4. Limitations ",
      p4: "Flashy or its suppliers will not be hold accountable for any damages that will arise with the use or inability to use the materials on Flashy, even if Flashy or an authorize representative of this Website has been notified, orally or written, of the possibility of such damage. Some jurisdiction does not allow limitations on implied warranties or limitations of liability for incidental damages, these limitations may not apply to you.",
      t5: "5. Revisions and Errata",
      p5: "The materials appearing on Flashy may include technical, typographical, or photographic errors. Flashy will not promise that any of the materials in this Website are accurate, complete, or current. Flashy may change the materials contained on its Website at any time without notice. Flashy does not make any commitment to update the materials. ",
      t6: "6. Links",
      p6: "Flashy has not reviewed all of the sites linked to its Website and is not responsible for the contents of any such linked site. The presence of any link does not imply endorsement by Flashy of the site. The use of any linked website is at the user’s own risk.",
      t7: "7. Site Terms of Use Modifications",
      p7: "Flashy may revise these Terms of Use for its Website at any time without prior notice. By using this Website, you are agreeing to be bound by the current version of these Terms and Conditions of Use.",
      t8: "8. Your Privacy",
      p8: "Flashy ensures the privacy of your information.",
      t9: "9. Governing Law ",
      p9: " Any claim related to FLashy Anime's Website shall be governed by the laws of bq without regards to its conflict of law provisions.",
    },
    es: {
      home: "Inicio",
      terms: "Términos",
      termsflashy: "Términos y Condiciones de Uso de Flashy",
      t1: "1. Términos",
      p1: "Al acceder a este sitio web, accesible desde https://flashy.com, actualmente http://localhost:3000, acepta estar sujeto a estos Términos y Condiciones de Uso del Sitio web y acepta ser responsable del cumplimiento de las leyes locales aplicables. Si no está de acuerdo con alguno de estos términos, se le prohíbe el acceso a este sitio. Los materiales contenidos en este sitio web están protegidos por las leyes de derechos de autor y marcas comerciales.",
      t2: "2. Licencia de uso",
      p2: "Se concede permiso para descargar temporalmente una copia de los materiales en Flashy para su visualización personal, no comercial y transitoria únicamente. Esto constituye una licencia, no una transferencia de título, y bajo esta licencia no puede:",
      p21: "Modificar o copiar los materiales;",
      p22: "Usar los materiales con fines comerciales o para cualquier exhibición pública;",
      p23: "Intentar ingeniería inversa de cualquier software contenido en Flashy;",
      p24: "Eliminar cualquier anotación de derechos de autor u otras anotaciones propietarias de los materiales; o",
      p25: "Transferir los materiales a otra persona o reflejar los materiales en cualquier otro servidor.",
      p26: "Esto permitirá a Flashy terminar en caso de violaciones de cualquiera de estas restricciones. Al finalizar, también se terminará su derecho de visualización y deberá destruir cualquier material descargado en su posesión, ya sea en formato impreso o electrónico. Estos Términos de Servicio han sido creados con la ayuda del Generador de Términos de Servicio y el Generador de Política de Privacidad.",
      t3: "3. Descargo de responsabilidad",
      p3: "Todos los materiales en Flashy se proporcionan tal cual. Flashy Anime no ofrece garantías, ya sean expresas o implícitas, por lo tanto, niega todas las demás garantías. Además, Flashy Anime no hace representaciones sobre la exactitud o confiabilidad del uso de los materiales en su sitio web o en relación con dichos materiales o cualquier sitio vinculado a este sitio web.",
      t4: "4. Limitaciones",
      p4: "Flashy o sus proveedores no serán responsables de los daños que surjan del uso o la incapacidad para utilizar los materiales en Flashy, incluso si Flashy o un representante autorizado de este sitio web ha sido notificado, oralmente o por escrito, de la posibilidad de dicho daño. Algunas jurisdicciones no permiten limitaciones en garantías implícitas o limitaciones de responsabilidad por daños incidentales, estas limitaciones pueden no aplicarse a usted.",
      t5: "5. Revisiones y Erratas",
      p5: "Los materiales que aparecen en Flashy pueden incluir errores técnicos, tipográficos o fotográficos. Flashy no promete que alguno de los materiales en este sitio web sea preciso, completo o actual. Flashy puede cambiar los materiales contenidos en su sitio web en cualquier momento sin previo aviso. Flashy no se compromete a actualizar los materiales.",
      t6: "6. Enlaces",
      p6: "Flashy no ha revisado todos los sitios vinculados a su sitio web y no es responsable del contenido de ningún sitio vinculado. La presencia de cualquier enlace no implica un respaldo por parte de Flashy del sitio. El uso de cualquier sitio web vinculado es bajo el riesgo del usuario.",
      t7: "7. Modificaciones de los Términos de Uso del Sitio",
      p7: "Flashy puede revisar estos Términos de Uso para su sitio web en cualquier momento sin previo aviso. Al utilizar este sitio web, acepta quedar obligado por la versión actual de estos Términos y Condiciones de Uso.",
      t8: "8. Su Privacidad",
      p8: "Flashy garantiza la privacidad de su información.",
      t9: "9. Leyes Aplicables",
      p9: "Cualquier reclamo relacionado con el sitio web de Flashy Anime estará sujeto a las leyes de bq sin tener en cuenta sus disposiciones de conflicto de leyes.",
    },
  };

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
          <Label onClick={handleGoHome}> {translations[language].home} </Label> &nbsp;&nbsp;•&nbsp;&nbsp; <SpanSoft> {translations[language].terms} </SpanSoft>
        </HeaderDiv>

        <TitleLabel> {translations[language].termsflashy} </TitleLabel>

        <ParragraphDiv>
          <SubLabel> {translations[language].t1} </SubLabel>
          <Parragraph style={{ marginTop: '-20px' }}>
            {translations[language].p1}
          </Parragraph>


          <SubLabel> {translations[language].t2} </SubLabel>
          <Parragraph style={{ marginTop: '-20px' }}>

            {translations[language].p2}

          </Parragraph>
          <Parragraph style={{ marginTop: '-15px' }}>

            • &nbsp; {translations[language].p21}

          </Parragraph>
          <Parragraph style={{ marginTop: '-20px' }}>

            • &nbsp; {translations[language].p22}

          </Parragraph>
          <Parragraph style={{ marginTop: '-20px' }}>

            • &nbsp; {translations[language].p23}

          </Parragraph>
          <Parragraph style={{ marginTop: '-20px' }}>

            • &nbsp; {translations[language].p24}

          </Parragraph>
          <Parragraph style={{ marginTop: '-20px' }}>

            • &nbsp; {translations[language].p25}

          </Parragraph>
          <Parragraph style={{ marginTop: '-15px' }}>

            {translations[language].p26}

          </Parragraph>


          <SubLabel> {translations[language].t3} </SubLabel>
          <Parragraph style={{ marginTop: '-20px' }}>
            {translations[language].p3}
          </Parragraph>

          <SubLabel> {translations[language].t4} </SubLabel>
          <Parragraph style={{ marginTop: '-20px' }}>
            {translations[language].p4}
          </Parragraph>

          <SubLabel> {translations[language].t5} </SubLabel>
          <Parragraph style={{ marginTop: '-20px' }}>
            {translations[language].p5}
          </Parragraph>

          <SubLabel> {translations[language].t6} </SubLabel>
          <Parragraph style={{ marginTop: '-20px' }}>
            {translations[language].p6}
          </Parragraph>

          <SubLabel> {translations[language].t7} </SubLabel>
          <Parragraph style={{ marginTop: '-20px' }}>
            {translations[language].p7}
          </Parragraph>

          <SubLabel> {translations[language].t8}</SubLabel>
          <Parragraph style={{ marginTop: '-20px' }}>
            {translations[language].p8}
          </Parragraph>

          <SubLabel> {translations[language].t9}</SubLabel>
          <Parragraph style={{ marginTop: '-20px' }}>
            {translations[language].p9}
          </Parragraph>

        </ParragraphDiv>

      </Wrapper>

    </MainContainer >

  );
};

export default Terms;
