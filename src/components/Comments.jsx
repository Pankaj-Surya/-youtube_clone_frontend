import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { json } from "react-router-dom";
import styled from "styled-components";
import Comment from "./Comment";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const Container = styled.div``;

const NewComment = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Avatar = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
`;

const Input = styled.input`
  border: none;
  border-bottom: 1px solid ${({ theme }) => theme.soft};
  color: ${({ theme }) => theme.text};
  background-color: transparent;
  outline: none;
  padding: 5px;
  width: 100%;
`;

const Button = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
  background-color: white;
  padding: 5px;
`;

const Comments = ({ videoId }) => {
  const [desc, setDesc] = useState("")
  const currentUser = useSelector((state) => state.user?.currentUser?.others)
  //console.log(currentUser)
  const dispatch = useDispatch()

  const { isLoading, error, data } = useQuery(["comments"], () =>
    axios.get(`${process.env.REACT_APP_API_URL}/comments/${videoId}`).then((res) => {
      return res.data;
    })
  );


  const queryClient = useQueryClient();

  const mutation = useMutation(
    (newComment) => {
      return axios.post(`${process.env.REACT_APP_API_URL}/comments/`, newComment);
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(["comments"]);
      },
    }
  );

  const handleComment = async (e) => {
    e.preventDefault();
    if (desc !== "") {
      mutation.mutate({ desc, videoId, token: localStorage.getItem("access_token") });
      setDesc("");
    }
  }


  // const [comments, setComments] = useState([])
  // const myArray = useRef([]);

  // //console.log("cmts: ", myArray)
  // useEffect(() => {
  //   const fetchComments = async () => {
  //     try {
  //       const res = await axios.get(`${process.env.REACT_APP_API_URL}/comments/${videoId}`)
  //       //console.log(res.data)
  //       setComments(res.data.map(comment => comment))
  //       //console.log(comments)
  //       myArray.current = res.data
  //     } catch (error) {
  //       console.log(error)
  //     }
  //   }
  //   fetchComments()
  // }, [videoId])

  // //console.log(comments)
  // const handleComment = async () => {
  //   try {
  //     if (currentUser) {
  //       const res = await axios.post(`${process.env.REACT_APP_API_URL}/comments/`, { desc, videoId, token: localStorage.getItem("access_token") })
  //       //    dispatch(commentsSuccess(res.data))
  //       ///myArray.current.push(res.data)
  //       setDesc(" ")
  //     } else {
  //       alert("Please Login First!")
  //       return
  //     }
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }




  return (
    <Container>
      <NewComment>
        <Avatar src={currentUser?.img} />
        <Input placeholder="Add a comment..." value={desc} onChange={(e) => setDesc(e.target.value)} />
        <Button onClick={handleComment}>Post</Button>
      </NewComment>
      {
        data?.map(comment => (
          <Comment key={comment._id} comment={comment} />
        ))
      }

    </Container>
  );
};

export default Comments;
