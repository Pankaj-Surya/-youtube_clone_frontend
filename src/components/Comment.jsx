import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styled, { createGlobalStyle } from "styled-components";
import { format } from "timeago.js";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const Container = styled.div`
  display: flex;
  gap: 10px;
  margin: 30px 0px;
`;

const Avatar = styled.img`
  width: 50px;
  height: 50px;
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
  color: ${({ theme }) => theme.textSoft};
  margin-left: 5px;
`;

const Text = styled.span`
  font-size: 14px;
`;

const Button = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
  background-color: white;
  padding: 3px;
  height: 20px;
  color : black;
  margin-left:600px;
`;

const Comment = ({ comment }) => {
  const {currentUser} = useSelector((state) => state.user);
  const {currentVideo} = useSelector((state)=>state.video)
  const [channel, setChannel] = useState({});

  useEffect(() => {
    const fetchComment = async () => {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/users/find/${comment.userId}`);
      setChannel(res.data)
      //console.log(res.data)
    };
    fetchComment();
  }, [comment.userId]);


  const queryClient = useQueryClient();

  const mutation = useMutation(
    () => {
      return axios.delete(`${process.env.REACT_APP_API_URL}/comments/${comment.videoId}/${comment._id}/${localStorage.getItem("access_token")}`);
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(["comments"]);
      },
    }
  );

  const handleDelete = async (e) => {
    e.preventDefault();
    mutation.mutate();
  }

  /* const handleDelete = async () => {
    console.log("Delete comment")
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/comments/${comment.videoId}/${comment._id}/${localStorage.getItem("access_token")}`);
    } catch (error) {
      console.log(error)
    }
  } */
  return (
    <Container>
      <Avatar src={channel.img} />
      <Details>
        <Name>
          {channel.name} <Date>• {format(comment?.createdAt)}</Date>
        </Name>
        <Text>{comment.desc}</Text>
      </Details>
      {
        (currentUser?.others?._id === comment.userId || currentUser?.otherDetails?._id === currentVideo?.userId) && <Button onClick={handleDelete}> Delete </Button>
      }

    </Container>
  );
};

export default Comment;
