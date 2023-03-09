import React, { Children, useEffect, useState } from "react";
import styled from "styled-components";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownOffAltOutlinedIcon from "@mui/icons-material/ThumbDownOffAltOutlined";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import ReplyOutlinedIcon from "@mui/icons-material/ReplyOutlined";
import AddTaskOutlinedIcon from "@mui/icons-material/AddTaskOutlined";
import Comments from "../components/Comments";
import Card from "../components/Card";
import {useDispatch, useSelector} from "react-redux"
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import {dislike, fetchSuccess, like} from "../redux/videoSlice"
import { format } from "timeago.js";
import { subscription } from "../redux/userSlice";

const Container = styled.div`
  display: flex;
  gap: 24px;
`;

const Content = styled.div`
  flex: 5;
`;
const VideoWrapper = styled.div``;

const Title = styled.h1`
  font-size: 18px;
  font-weight: 400;
  margin-top: 20px;
  margin-bottom: 10px;
  color: ${({ theme }) => theme.text};
`;

const Details = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Info = styled.span`
  color: ${({ theme }) => theme.textSoft};
`;

const Buttons = styled.div`
  display: flex;
  gap: 20px;
  color: ${({ theme }) => theme.text};
`;

const Button = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
`;

const Hr = styled.hr`
  margin: 15px 0px;
  border: 0.5px solid ${({ theme }) => theme.soft};
`;

const Recommendation = styled.div`
  flex: 2;
`;
const Channel = styled.div`
  display: flex;
  justify-content: space-between;
`;

const ChannelInfo = styled.div`
  display: flex;
  gap: 20px;
`;

const Image = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
`;

const ChannelDetail = styled.div`
  display: flex;
  flex-direction: column;
  color: ${({ theme }) => theme.text};
`;

const ChannelName = styled.span`
  font-weight: 500;
`;

const ChannelCounter = styled.span`
  margin-top: 5px;
  margin-bottom: 20px;
  color: ${({ theme }) => theme.textSoft};
  font-size: 12px;
`;

const Description = styled.p`
  font-size: 14px;
`;

const Subscribe = styled.button`
  background-color: #cc1a00;
  font-weight: 500;
  color: white;
  border: none;
  border-radius: 3px;
  height: max-content;
  padding: 10px 20px;
  cursor: pointer;
`;

const VideoFrame = styled.video`
  max-height: 720px;
  width: 100%;
  object-fit: cover;
`;


const Video = () => {
  const {currentUser} = useSelector((state) => state.user);
  const {currentVideo} = useSelector((state)=>state.video)

  const [channel,setChannel] = useState({})
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const path = useLocation().pathname.split('/')[2]
  
  useEffect(()=>{
  const fetchData =async () =>{
    const vidRes = await axios.get(`${process.env.REACT_APP_API_URL}/videos/find/${path}`)
    //console.log("vid res",vidRes.data)
    const channelRes = await axios.get(`${process.env.REACT_APP_API_URL}/users/find/${vidRes.data.userId}`)
    //console.log("channel res ",channelRes.data)
    setChannel(channelRes.data)
    dispatch(fetchSuccess(vidRes.data))
  }
  fetchData()
  },[path,dispatch])

  const handleLike =async () =>{
    console.log("clk like")
   
    //console.log( localStorage.getItem("access_token")) 
    const token = localStorage.getItem("access_token")
    if(currentUser){
      await axios.put(`${process.env.REACT_APP_API_URL}/users/like/${currentVideo._id}`,{token : token })
      dispatch(like(currentUser._id))
      console.log("clk like end") 
    }else{
     alert("Please Login first")    
     return navigate("/signin") 
    }
  }

  const handleDislike = async () => {
    const token = localStorage.getItem("access_token")
    if(currentUser){
      await axios.put(`${process.env.REACT_APP_API_URL}/users/dislike/${currentVideo._id}`,{token : token });
      dispatch(dislike(currentUser._id));
    }else{
      navigate("/signin")
    }
    
  };

  const handleSub = async () => {
   try {
    console.log("sub started");   
    const token = localStorage.getItem("access_token")
    console.log(channel._id)
    let subsUser = await currentUser?.others?.subscribedUsers?.includes(channel._id)
    console.log(subsUser)
    let subsUserArr = await currentUser?.others.subscribedUsers
    console.log(subsUserArr)
    subsUser ? await axios.put(`${process.env.REACT_APP_API_URL}/users/unsub/${channel._id}`,{token : token })  : await axios.put(`${process.env.REACT_APP_API_URL}/users/sub/${channel._id}`,{token : token })
    dispatch(subscription(currentUser.others._id));
    //console.log(subsUser) 
    console.log("sub end")
  } catch (error) {
    console.log(error)
   }
  }
  //console.log(currentUser)
  //console.log(path)
  return (
    <Container>
      <Content>
        <VideoWrapper>
        <VideoFrame src={currentVideo.videoUrl} controls  playing={true} />
        </VideoWrapper>
        <Title>{currentVideo.title}</Title>
        <Details>
          <Info>  {currentVideo.views} views • {format(currentVideo.createdAt)}</Info>
          <Buttons>
            <Button onClick={handleLike}>
              {
                currentVideo.likes?.includes(currentUser?._id) ? 
                (<ThumbUpIcon /> ) :
               (<ThumbUpOutlinedIcon /> )
              }
              {currentVideo.likes?.length}
            </Button>
            <Button onClick={handleDislike}>
              {currentVideo.dislikes?.includes(currentUser?._id) ? (
                <ThumbDownIcon />
              ) : (
                <ThumbDownOffAltOutlinedIcon />
              )}{" "}
              Dislike
            </Button>
            <Button>
              <ReplyOutlinedIcon /> Share
            </Button>
            <Button>
              <AddTaskOutlinedIcon /> Save
            </Button>
          </Buttons>
        </Details>
        <Hr />
        <Channel>
          <ChannelInfo>
            <Image src={channel.img} />
            <ChannelDetail>
              <ChannelName>{channel.name}</ChannelName>
              <ChannelCounter>{channel.subscribers} subscribers</ChannelCounter>
              <Description>
                 {currentVideo.desc}.
              </Description>
            </ChannelDetail>
          </ChannelInfo>
          {/* logged in user == currvid user =>then  dont show sub button */}
          {
            currentUser?.others?._id === currentVideo?.userId
              ? <Subscribe>My Channel</Subscribe>
              : <Subscribe onClick={handleSub}>
                {currentUser?.others?.subscribedUsers?.includes(channel._id)
                  ? "SUBSCRIBED"
                  : "SUBSCRIBE"}
              </Subscribe>
          }
        </Channel>
        <Hr />
        <Comments videoId={currentVideo._id}/>
      </Content>
      <Recommendation>    
      </Recommendation>
    </Container>
  );
};

export default Video;
