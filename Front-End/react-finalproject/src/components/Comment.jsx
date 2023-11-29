import React from "react";
import styled from "styled-components";
import RespuestaIcono from "../assets/RespuestaIcono.png";
import LikeIcono from "../assets/VideoLikeIcono.png";
import LikedIcono from "../assets/VideoLikedIcono.png";
import DislikeIcono from "../assets/VideoDislikeIcono.png";
import DislikedIcono from "../assets/VideoDislikeIcono.png";

const Container = styled.div`
  display: flex;
  gap: 17px;
  margin: 40px 0px 50px 0px;
`;

const Avatar = styled.img`
  width: 35px;
  height: 35px;
  border-radius: 50%;
`;

const Details = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  color: ${({ theme }) => theme.text}
`;
const Name = styled.span`
  font-size: 13px;
  font-weight: 500;
`;

const Date = styled.span`
  font-size: 12px;
  font-weight: 400;
  font-family: "Roboto", Helvetica;
  color: ${({ theme }) => theme.textSoft};
  margin-left: 8px;
`;

const Text = styled.span`
  font-size: 14px;
  font-weight: normal;
  font-family: "Roboto", Helvetica;
  color: #c4c4c4;
  margin-bottom: 5px;
`;

const CommentOptions = styled.div`
  display: flex;
  border: none;
  margin-bottom: 5px;
`;

const Reply = styled.div`
  display: flex;
  border: none;
  cursor: pointer;
`;

const ReplyImg = styled.img`
  height: 18px;
  width: 18px;
`;

const ReplyText = styled.h1`
  font-size: 14px;
  font-family: "Roboto Condensed", Helvetica;
  font-weight: normal;
  margin-top: 2px;  
  margin-left: 2px;
`;

const EstiloLikeDislike = styled.div`
  display: flex;
  border: none;
  cursor: pointer;
  margin-left: 20px;
`;

const LikeDislikeImg = styled.img`
  height: 18px;
  width: 18px;
`;

const LikeDislikeCounter = styled.h1`
  font-size: 14px;
  font-family: "Roboto Condensed", Helvetica;
  font-weight: normal;
  margin-top: 2px;  
  margin-left: 3px;
`;

const Replies = styled.div`
  display: flex;
  border: none;
  cursor: pointer;
  width: max-content;
`;

const ArrowViewReplies = styled.h1`
  font-size: 10px;
  font-family: "Roboto Condensed", Helvetica;
  font-weight: normal;
  margin-top: 7px;
`;

const ViewReplies = styled.h1`
  font-size: 14px;
  font-family: "Roboto Condensed", Helvetica;
  font-weight: normal;
  margin-top: 5px;
  margin-left: 6px;
`;



const Comment = () => {
  return (
    <Container>
      <Avatar src="https://yt3.ggpht.com/yti/APfAmoE-Q0ZLJ4vk3vqmV4Kwp0sbrjxLyB8Q4ZgNsiRH=s88-c-k-c0x00ffffff-no-rj-mo" />
      <Details>
        <Name>
          John Doe <Date>1 day ago</Date>
        </Name>
        <Text>
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Vel, ex
          laboriosam ipsam aliquam voluptatem perferendis provident modi, sequi
          tempore reiciendis quod, optio ullam cumque? Quidem numquam sint
          mollitia totam reiciendis?
        </Text>
        <CommentOptions>

          <Reply>
            <ReplyImg src={RespuestaIcono} />
            <ReplyText> Reply </ReplyText>
          </Reply>

          <EstiloLikeDislike>
            <LikeDislikeImg src={LikeIcono} />
            <LikeDislikeCounter> 105 </LikeDislikeCounter>
          </EstiloLikeDislike>

          <EstiloLikeDislike>
            <LikeDislikeImg src={DislikeIcono} />
            <LikeDislikeCounter> 26 </LikeDislikeCounter>
          </EstiloLikeDislike>
        </CommentOptions>

        <Replies>
          <ArrowViewReplies> ▼ </ArrowViewReplies>
          <ViewReplies>View 5 replies</ViewReplies>
        </Replies>

      </Details>
    </Container>
  );
};

export default Comment;