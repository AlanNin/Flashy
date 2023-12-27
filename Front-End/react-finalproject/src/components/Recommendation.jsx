import axios from "axios";
import React, { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import CardRecommendation from "./CardRecommendation";

const Container = styled.div`
  flex: 2;
`;

const CardContainer = styled.h1`
    position: absolute; 
`;

const rotate = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding-top: 50px;
  padding-left: 10px;
`;

const LoadingCircle = styled.div`
  border: 4px solid #f3f3f3;
  border-top: 4px solid #7932a8;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: ${rotate} 1s linear infinite;
`;


const Recommendation = ({ tags, currentVideoId, NoRecommendations, setNoRecommendations }) => {
    const [videos, setVideos] = useState([]);
    const filteredVideos = videos.filter((video) => video._id !== currentVideoId);
    const [cardLoaded, setCardLoaded] = useState(false);
    const [isRecommendationEmpty, setIsRecommendationEmpty] = useState(false);


    useEffect(() => {
        setCardLoaded(false);
        const fetchVideos = async () => {
            const res = await axios.get(`/videos/tags?tags=${tags}`);
            setVideos(res.data);
            setCardLoaded(true);
            if (res.data.length < 2) {
                setNoRecommendations(true);
            }
        };
        fetchVideos();

    }, [tags, setNoRecommendations]);

    return (

        <Container>
            {cardLoaded ? (
                filteredVideos.length === 0 ? (
                    <p style={{ color: 'rgb(158, 93, 176)', fontWeight: 'bold', fontFamily: '"Roboto Condensed", Helvetica', fontSize: '18px', position: 'absolute', width: 'max-content' }}>
                        No recommended videos found.
                    </p>
                ) : (
                    <CardContainer>
                        {filteredVideos.map((video) => (
                            <CardRecommendation type="sm" key={video._id} video={video} />
                        ))}
                    </CardContainer>
                )
            ) : (
                <LoadingContainer>
                    <LoadingCircle />
                </LoadingContainer>
            )}
        </Container>
    );
};

export default Recommendation;