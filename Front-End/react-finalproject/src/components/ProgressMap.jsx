import React from "react";
import styled from "styled-components";

const ProgressMapContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px 0px 20px 0px;
`;
const StepIndicatorContainer = styled.div`
  position: relative;
`;

const StepIndicator = styled.div`
  height: ${({ current, completed }) =>
            completed ? "15px" : current ? "15px" : "10px"};
  width: ${({ current, completed }) =>
            completed ? "15px" : current ? "15px" : "10px"};
  border-radius: 50%;
  margin: 0px 60px;
  background-color: ${({ current, completed, theme }) =>
            completed ? "rgb(91, 32, 107)" : current ? "rgba(37, 1, 59, 0.5)" : "transparent"};
  border: 
  ${({ current, completed }) =>
            completed ? "5px" : current ? "5px" : "3px"}
  solid 
  ${({ current, completed, theme }) =>
            completed ? "transparent" : current ? "rgb(91, 32, 107)" : "rgba(110, 110, 110, 0.8)"};
  z-index: 2;

  &::after {
    content: '${({ completed }) => (completed ? '✔' : '')}';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 18px;
    font-weight: bold;
    color: rgb(37, 1, 59);
  }
`;

const ConnectorLine = styled.div`
  position: absolute;
  height: 2px;
  background-color: ${({ completed, theme }) =>
            completed ? "rgba(91, 32, 107)" : "rgba(110, 110, 110, 0.8)"};
  top: 50%;
  left: 0px;
  right: ${({ current, completed }) =>
            completed ? "80px" : current ? "80px" : "76px"};
  margin-left: ${({ current, completed }) =>
            completed ? "-60px" : current ? "-60px" : "-60px"};
  z-index: 1;
`;

const StepLabel = styled.div`
  position: absolute;
  display: flex;
  flex-direction: row;
  top: -27px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 14px;
  width: max-content;
  font-weight: bold;
  color: ${({ current, theme }) =>
            current ? "rgb(158, 93, 176)" : "white"};
  font-family: "Roboto Condensed", Helvetica;
`;

const ProgressMap = ({ steps, currentStep }) => {
      return (
            <ProgressMapContainer>
                  {steps.map((step, index) => (
                        <StepIndicatorContainer key={index}>
                              {index !== 0 && (
                                    <ConnectorLine
                                          completed={index - 1 < currentStep}
                                          current={index === currentStep}
                                    />
                              )}
                              <StepIndicator
                                    completed={index < currentStep}
                                    current={index === currentStep}
                              />
                              <StepLabel current={index === currentStep}>
                                    {step}</StepLabel>
                        </StepIndicatorContainer>
                  ))}
            </ProgressMapContainer>
      );
};

export default ProgressMap;
