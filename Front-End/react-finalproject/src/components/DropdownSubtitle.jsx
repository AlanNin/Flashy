import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import app from "../firebase";
import BigAddIcon from "../assets/BigAddIcon.png";
import ResetIcon from "../assets/ResetIcon.png";
import RemoveMinusIcon from "../assets/RemoveMinusIcon.png";
import { useLanguage } from '../utils/LanguageContext';

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
  left: 0px;
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

const ButtonAndUpload = styled.div`
  display: flex;
`;

const InputSubtitleFile = styled.input`
  font-size: 16px;
  font-weight: bold;
  font-family: "Roboto Condensed", Helvetica; 
  overflow: hidden;
  width: 140px;
  position: absolute;
  margin-left: 2px;
  margin-top: 8px;

  &::-webkit-file-upload-button {
      visibility: hidden;
  }

  &:before {
      width: calc(100% - 24px);
      text-align: center;
      content: 'SELECT FILE';
      display: inline-block;
      color: ${({ subtitleNextValidationError }) => (subtitleNextValidationError ? 'red' : 'white')};
      cursor: pointer;
      transition: background-color 0.3s ease;
  }
`;

const UploadSubtitleFile = styled.label`
    font-size: 18px;
    font-weight: bold;
    font-family: "Roboto Condensed", Helvetica;
    color: #8e58d6;
    margin-top: 8px;
    margin-left: 18px;
`;

const AddNewDropdown = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 0px 20px;
    cursor: pointer;
`;

const AddNewDropdownImg = styled.img`
    height: 35px;
    width: 35px;
`;

const AddNewDropdownTxt = styled.h1`
  font-size: 18px;
  font-family: "Roboto Condensed", Helvetica;
  font-weight: normal;
`;

const SideDropdownImg = styled.img`
  height: 22px;
  width: 22px;
  position: absolute;
  margin-left: -30px;
  margin-top: 9px;
  cursor: pointer;
`;

const SubtitlelLabelFormat = styled.h1`
    font-size: 18px;
    font-weight: normal;
    font-family: "Roboto Condensed", Helvetica;
    margin-left: 120px;
    margin-top: 8px;
    color:  red;
  `;


const DropdownSubtitle = ({ selectedSubtitle, onSubtitleChange, setSubtitleValidationError, subtitleNextValidationError, setSubtitleNextValidationError }) => {
  const { language, setLanguage } = useLanguage();

  // TRANSLATIONS
  const translations = {
    en: {
      en: "English (EN)",
      es: "Spanish (ES)",
      fr: "French (FR)",
      pt: "Portuguese (PT)",
      ru: "Russian (RU)",
      zh: "Mandarin Chinese (ZH)",
      jp: "Japanese (JP)",
      kr: "Korean (KR)",

      selectsub: "Select Subtitle",
      uploading: "Uploading:",
      subsuccess: "Subtitle uploaded successfully!",
      formaterror: "This file format is not allowed",
      addnew: "Add a new subtitle",
    },
    es: {
      en: "Inglés (EN)",
      es: "Español (ES)",
      fr: "Francés (FR)",
      pt: "Portugués (PT)",
      ru: "Ruso (RU)",
      zh: "Mandarin Chino (ZH)",
      jp: "Japonés (JP)",
      kr: "Coreano (KR)",

      selectsub: "Seleccionar Subtítulo",
      uploading: "Subido:",
      subsuccess: "Subtítulo subido con éxito",
      formaterror: "Este formato no está permitido",
      addnew: "Añadir nuevo subtítulo",
    },
  };

  const subtitleOptions = [
    { code: 'EN', name: translations[language].en },
    { code: 'ES', name: translations[language].es },
    { code: 'FR', name: translations[language].fr },
    { code: 'PT', name: translations[language].pt },
    { code: 'RU', name: translations[language].ru },
    { code: 'ZH', name: translations[language].zh },
    { code: 'JP', name: translations[language].jp },
    { code: 'KR', name: translations[language].kr },
  ];

  const [emptyUrl, setemptyUrl] = useState(true);

  const [dropdowns, setDropdowns] = useState(
    selectedSubtitle.length > 0
      ? selectedSubtitle.map((subtitle, index) => ({
        selectedSubtitle: [subtitle],
        subtitleFile: subtitle.url,
        subtitleFilePerc: subtitle.url ? 100 : 0,
        formatError: false,
      }))
      : [{ selectedSubtitle: [], subtitleFile: null, subtitleFilePerc: 0 }]
  );

  const [dropdownCount, setDropdownCount] = useState(selectedSubtitle.length > 0 ? selectedSubtitle.length : 1);
  const dropdownRefs = useRef([]);

  useEffect(() => {
    document.addEventListener('click', handleDocumentClick);
    return () => {
      document.removeEventListener('click', handleDocumentClick);
    };
  }, []);

  const handleDocumentClick = (e) => {
    dropdownRefs.current.forEach((dropdownRef, index) => {
      if (dropdownRef && !dropdownRef.contains(e.target)) {
        setDropdowns((prevDropdowns) =>
          prevDropdowns.map((dropdown, i) =>
            i === index ? { ...dropdown, isOpen: false } : dropdown
          )
        );
      }
    });
  };

  const toggleDropdown = (dropdownIndex) => {
    setDropdowns((prevDropdowns) =>
      prevDropdowns.map((dropdown, index) =>
        index === dropdownIndex ? { ...dropdown, isOpen: !dropdown.isOpen } : dropdown
      )
    );
  };


  const handleSubtitleSelect = (subtitle, dropdownIndex) => {
    setDropdowns((prevDropdowns) => {
      const updatedDropdowns = [...prevDropdowns];
      const selectedSubtitle = updatedDropdowns[dropdownIndex].selectedSubtitle;
      const subtitleFile = updatedDropdowns[dropdownIndex].subtitleFile;
      const subtitleFilePerc = updatedDropdowns[dropdownIndex].subtitleFilePerc;

      let updatedSubtitles = [...selectedSubtitle];

      if (selectedSubtitle.length === 0) {
        // Si el dropdown no tiene subtítulos, crea uno nuevo
        updatedSubtitles.push({ name: subtitle, url: '' });
      } else {
        // Si el dropdown ya tiene subtítulos, actualiza el existente
        updatedSubtitles[0] = { name: subtitle, url: selectedSubtitle[0]?.url || '' };
      }

      setemptyUrl(true);

      updatedDropdowns[dropdownIndex] = { selectedSubtitle: updatedSubtitles, subtitleFile, subtitleFilePerc };
      onSubtitleChange(updatedDropdowns.map(dropdown => dropdown.selectedSubtitle).flat());
      return updatedDropdowns;
    });
  };


  const getAvailableOptions = (dropdownIndex) => {
    const selectedOptions = dropdowns.flatMap((dropdown, index) =>
      index !== dropdownIndex ? dropdown.selectedSubtitle.map(sub => sub.name) : []
    );
    return subtitleOptions.filter(option => !selectedOptions.includes(option.code));
  };

  const uploadSubtitleFile = (file, dropdownIndex) => {
    const storage = getStorage(app);
    const subtitleFileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, subtitleFileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setDropdowns((prevDropdowns) => {
          const updatedDropdowns = [...prevDropdowns];
          updatedDropdowns[dropdownIndex].subtitleFilePerc = Math.round(progress);
          return updatedDropdowns;
        });
      },
      (error) => { },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setDropdowns((prevDropdowns) => {
            const updatedDropdowns = [...prevDropdowns];
            const selectedSubtitle = updatedDropdowns[dropdownIndex].selectedSubtitle;
            selectedSubtitle[selectedSubtitle.length - 1].url = downloadURL;
            return updatedDropdowns;
          });
        });
      }
    );
  };

  const handleFileChange = (file, dropdownIndex) => {
    if (file && file.name.endsWith('.vtt')) {
      setDropdowns((prevDropdowns) => {
        const updatedDropdowns = [...prevDropdowns];
        updatedDropdowns[dropdownIndex].subtitleFile = file;
        updatedDropdowns[dropdownIndex].formatError = false;
        setSubtitleNextValidationError(false);
        return updatedDropdowns;
      });

      uploadSubtitleFile(file, dropdownIndex);
    } else {
      setDropdowns((prevDropdowns) => {
        const updatedDropdowns = [...prevDropdowns];
        updatedDropdowns[dropdownIndex].formatError = true;  // Establecer el error de formato
        return updatedDropdowns;
      });
    }
  };

  const handleResetFirstDropdown = () => {
    setDropdowns((prevDropdowns) => {
      const updatedDropdowns = [...prevDropdowns];
      updatedDropdowns[0] = { selectedSubtitle: [], subtitleFile: undefined, subtitleFilePerc: 0 };
      onSubtitleChange(updatedDropdowns.map((dropdown) => dropdown.selectedSubtitle).flat());

      const hasAllDropdownsWithUrl = updatedDropdowns.every((dropdown) => {
        // Check if the dropdown has selectedSubtitle
        if (dropdown.selectedSubtitle.length > 0) {
          // Check if at least one subtitle in the dropdown has a URL
          return dropdown.selectedSubtitle.some((subtitle) => subtitle.url);
        }
        // If selectedSubtitle is empty, consider it as valid
        return true;
      });

      setemptyUrl(!hasAllDropdownsWithUrl);

      return updatedDropdowns;
    });
  };

  // Empty Subtitle Validation
  useEffect(() => {
    if (emptyUrl) {
      setSubtitleValidationError(true);
    } else {
      setSubtitleValidationError(false);
    }

    if (dropdowns.length === 1 && dropdowns[0].selectedSubtitle.length === 0) {
      setSubtitleValidationError(false);
    }
  }, [emptyUrl, selectedSubtitle]);

  const renderDropdowns = () => {
    return dropdowns.map((dropdown, index) => (
      <div key={index} style={{ display: 'flex', position: 'relative' }}>
        <DropdownContainer ref={(el) => (dropdownRefs.current[index] = el)}>
          {index === 0 && (
            <SideDropdownImg src={ResetIcon} onClick={handleResetFirstDropdown} />
          )}
          {index > 0 && (
            <SideDropdownImg src={RemoveMinusIcon} onClick={() => handleRemoveDropdown(index)} />
          )}
          <DropdownButton onClick={() => toggleDropdown(index)} isOpen={dropdown.isOpen}>
            {dropdown.selectedSubtitle.length > 0
              ? subtitleOptions.find((option) => option.code === dropdown.selectedSubtitle[dropdown.selectedSubtitle.length - 1]?.name)?.name
              : translations[language].selectsub}
          </DropdownButton>
          <DropdownContent isOpen={dropdown.isOpen}>
            {getAvailableOptions(index).map((option) => (
              <button key={option.code} onClick={() => handleSubtitleSelect(option.code, index)}>
                {option.name}
              </button>
            ))}
          </DropdownContent>
        </DropdownContainer>
        <div style={{ display: 'flex' }}>
          {dropdown.selectedSubtitle.length > 0 && (
            <>
              {dropdown.subtitleFilePerc > 0 ? (
                dropdown.subtitleFilePerc < 100 ? (
                  <UploadSubtitleFile>{translations[language].uploading} {dropdown.subtitleFilePerc}% </UploadSubtitleFile>
                ) : (
                  <UploadSubtitleFile>{translations[language].subsuccess}</UploadSubtitleFile>
                )
              ) : (
                <div style={{ display: 'flex' }}>
                  <InputSubtitleFile
                    type="file"
                    accept=".vtt"
                    onChange={(e) => handleFileChange(e.target.files[0], index)}
                    subtitleNextValidationError={subtitleNextValidationError}
                  />

                  {dropdown.formatError && dropdown.subtitleFilePerc === 0 && (
                    <SubtitlelLabelFormat>{translations[language].formaterror}</SubtitlelLabelFormat>
                  )}

                </div>
              )}
            </>
          )}
        </div>
      </div>
    ));
  };

  const handleAddDropdown = () => {
    setDropdownCount((prevCount) => prevCount + 1);
    setDropdowns((prevDropdowns) => [...prevDropdowns, { selectedSubtitle: [], subtitleFile: undefined, subtitleFilePerc: 0 }]);
  };

  const handleRemoveDropdown = (dropdownIndex) => {
    setDropdownCount((prevCount) => prevCount - 1);

    setDropdowns((prevDropdowns) => {
      const updatedDropdowns = prevDropdowns.filter((_, index) => index !== dropdownIndex);
      onSubtitleChange(updatedDropdowns.map((dropdown) => dropdown.selectedSubtitle).flat());

      const hasAllDropdownsWithUrl = updatedDropdowns.every((dropdown) => {
        // Check if the dropdown has selectedSubtitle
        if (dropdown.selectedSubtitle.length > 0) {
          // Check if at least one subtitle in the dropdown has a URL
          return dropdown.selectedSubtitle.some((subtitle) => subtitle.url);
        }
        // If selectedSubtitle is empty, consider it as valid
        return true;
      });

      setemptyUrl(!hasAllDropdownsWithUrl);

      return updatedDropdowns;
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: 'max-content', gap: '20px' }}>
      {renderDropdowns()}

      {dropdownCount < 8 && (
        <AddNewDropdown onClick={handleAddDropdown}>
          <AddNewDropdownImg src={BigAddIcon} />
          <AddNewDropdownTxt> {translations[language].addnew} </AddNewDropdownTxt>
        </AddNewDropdown>
      )}

    </div>
  );
};

export default DropdownSubtitle;
