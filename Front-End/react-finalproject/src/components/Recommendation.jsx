import axios from "axios";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import CardRecommendation from "./CardRecommendation";

const Container = styled.div`
  flex: 2;
`;

const Recommendation = ({ tags, currentVideoId }) => {
    const [videos, setVideos] = useState([]);

    useEffect(() => {
        const fetchVideos = async () => {
            const res = await axios.get(`/videos/tags?tags=${tags}`);
            setVideos(res.data);
        };
        fetchVideos();
    }, [tags]);

    return (
        <Container>
            {videos
                .filter((video) => video._id !== currentVideoId) // Filtra el video actual
                .map((video) => (
                    <CardRecommendation type="sm" key={video._id} video={video} />
                ))}
        </Container>
    );
};

export default Recommendation;