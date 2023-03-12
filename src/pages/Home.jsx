import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import Card from "../components/Card";
//import {API_URL} from "../config/clientConfig"

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
`;

const Home = ({type}) => {
  const {currentUser} = useSelector((state) => state.user);
  const [videos,setVideos] = useState([])
  
  useEffect(()=>{
    const fetchVideos = async ()=>{
        console.log(type)   
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/videos/${type}/${localStorage.getItem('access_token')}`)
        //console.log(res.data)
        setVideos(res.data)
  
    }
    fetchVideos()
  },[type])
  return (
    <Container>
     {
       videos.map((video)=>(
          <Card key={video._id} video={video}/>
       ))
     }
    </Container>
  );
};

export default Home;
