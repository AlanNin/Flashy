import React, { useEffect, useState } from "react";
import styled from "styled-components";
import NotFound404Component from "../components/NotFound404Component";

const MainContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  z-index: 4;
`;


const NotFound404 = () => {

  const content = (
    <MainContainer>
      <NotFound404Component />
    </MainContainer>
  );

  return <>{content}</>;
};

export default NotFound404;