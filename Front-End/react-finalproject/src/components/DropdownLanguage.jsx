import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';

const DropdownContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const DropdownButton = styled.button`
  padding: 8px 20px;
  font-size: 18px;
  font-family: "Roboto Condensed", Helvetica;
  font-weight: bold;
  cursor: pointer;
  width: 220px;
  background: #8e58d6;
  border: 1px solid #8e58d6;
  border-radius: ${({ isOpen }) => (isOpen ? '5px 5px 0px 0px' : '5px')};
`;

const DropdownContent = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  background-color: #f9f9f9;
  width: 220px;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  z-index: 1;
  display: ${({ isOpen }) => (isOpen ? 'flex' : 'none')};
  flex-direction: column;
  border-radius:  0px 0px 5px 5px;

  button {
    display: flex;
    text-align: center;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    font-family: "Roboto Condensed", Helvetica;
    width: 100%;
    padding: 8px 20px;
    text-align: left;
    cursor: pointer;
    background: #d5c2f0;
    
    font-weight: bold;
    border: none;
    &:hover {
      background-color: #b49fd1;
    }

    &:last-child {
      border-radius: 0px 0px 5px 5px;
    }
  }
`;

const languageOptions = [
  { code: 'EN', name: 'English (EN)' },
  { code: 'ES', name: 'Spanish (ES)' },
  { code: 'FR', name: 'French (FR)' },
  { code: 'PT', name: 'Portuguese (PT)' },
  { code: 'RU', name: 'Russian (RU)' },
  { code: 'ZH', name: 'Mandarin Chinese (ZH)' },
  { code: 'JP', name: 'Japanese (JP)' },
  { code: 'KR', name: 'Korean (KR)' },
];

const DropdownLanguage = ({ selectedLanguage, onLanguageChange }) => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLanguageSelect = (language) => {
    onLanguageChange(language);
    setDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const handleDocumentClick = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleDocumentClick);

    return () => {
      document.removeEventListener('click', handleDocumentClick);
    };
  }, []);

  const filteredLanguageOptions = languageOptions.filter(option => option.code !== selectedLanguage);

  return (
    <DropdownContainer ref={dropdownRef}>
      <DropdownButton onClick={toggleDropdown} isOpen={isDropdownOpen}>
        {selectedLanguage ? languageOptions.find(option => option.code === selectedLanguage)?.name : 'Select Language'}
      </DropdownButton>
      <DropdownContent isOpen={isDropdownOpen}>
        {filteredLanguageOptions.map((option) => (
          <button key={option.code} onClick={() => handleLanguageSelect(option.code)}>
            {option.name}
          </button>
        ))}
      </DropdownContent>
    </DropdownContainer>
  );
};

export default DropdownLanguage;