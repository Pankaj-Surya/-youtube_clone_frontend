import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { loginFailure, loginStart, loginSuccess, logout } from "../redux/userSlice";
import { useSelector, useDispatch } from 'react-redux'
import { auth, provider } from "../firebase";
import { signInWithPopup } from "firebase/auth";
import jwtInterceptor from "../jwtInterceptor"
import jwt_decode from "jwt-decode";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: calc(100vh - 56px);
  color: ${({ theme }) => theme.text};
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  background-color: ${({ theme }) => theme.bgLighter};
  border: 1px solid ${({ theme }) => theme.soft};
  padding: 20px 50px;
  gap: 10px;
`;

const Title = styled.h1`
  font-size: 24px;
`;

const SubTitle = styled.h2`
  font-size: 20px;
  font-weight: 300;
`;

const Input = styled.input`
  border: 1px solid ${({ theme }) => theme.soft};
  border-radius: 3px;
  padding: 10px;
  background-color: transparent;
  width: 100%;
  color: ${({ theme }) => theme.text};
`;

const Button = styled.button`
  border-radius: 3px;
  border: none;
  padding: 10px 20px;
  font-weight: 500;
  cursor: pointer;
  background-color: ${({ theme }) => theme.soft};
  color: ${({ theme }) => theme.textSoft};
`;

const More = styled.div`
  display: flex;
  margin-top: 10px;
  font-size: 12px;
  color: ${({ theme }) => theme.textSoft};
`;

const Links = styled.div`
  margin-left: 50px;
`;

const Link = styled.span`
  margin-left: 30px;
`;

const SignIn = () => {
  const [name,setName] = useState("");
  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")
  
  const [lname,setLName] = useState("");
  const [lpassword,setLPassword] = useState("")
 
  const [user, setUser] = useState(null);
 
  const dispatch = useDispatch();

  const navigate = useNavigate();
  
  //   const refreshToken = async () => {
  //   try {
  //     console.log("refresh ",user.refreshToken)
  //     const res = await axios.post(`${process.env.REACT_APP_API_URL}/auth/refresh`, { token: user.refreshToken });
  //     setUser({
  //       ...user,
  //       accessToken: res.data.accessToken,
  //       refreshToken: res.data.refreshToken,
  //     });
  //     return res.data;
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  // const axiosJWT = axios.create()

  // axiosJWT.interceptors.request.use(
  //   async (config) => {
  //     console.log("config = " + config);
  //     let currentDate = new Date();
  //     const decodedToken = jwt_decode(user.accessToken);
  //     if (decodedToken.exp * 1000 < currentDate.getTime()) {
  //       const data = await refreshToken();
  //       console.log("data = ", data);
  //       config.headers["authorization"] = "Bearer " + data.accessToken;
  //     }
  //     return config;
  //   },
  //   (error) => {
  //     return Promise.reject(error);
  //   }
  // );

  

 


  const handleSignup = async (e) =>{
   try {
    e.preventDefault();
    console.log(name,email,password)
    await axios.post(`${process.env.REACT_APP_API_URL}/auth/signup`,{name,email,password})
    alert(`${name} successfully signed up`)
    setEmail("");
    setName("");
    setPassword("");
   } catch (error) {
    console.log(error)
   }
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log(lname,lpassword)
    axios.defaults.withCredentials = true;
    dispatch(loginStart());
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/auth/signin`, { name:lname, password:lpassword }, { withCredentials: true });
      setUser(res.data);
      dispatch(loginSuccess(res.data));
      console.log(res.data);
      localStorage.setItem('access_token', res.data.accessToken);
      navigate("/")
    } catch (err) {
      dispatch(loginFailure());
    }
  };

  const signInWithGoogle = async (e) => {
    dispatch(loginStart());
    signInWithPopup(auth, provider)
      .then((result) => {
        jwtInterceptor
          .post(`${process.env.REACT_APP_API_URL}/auth/google`, {
            name: result.user.displayName,
            email: result.user.email,
            img: result.user.photoURL,
          })
          .then((res) => {
            console.log(res)
            dispatch(loginSuccess(res.data));
            navigate("/")
          });
      })
      .catch((error) => {
        dispatch(loginFailure());
      });
    
    // try {
    //  dispatch(loginStart());
    //   const result = await signInWithPopup(auth,provider)

    //   const resp = await axios.post(`${process.env.REACT_APP_API_URL}/auth/google`,{
    //     name: result.user.displayName,
    //     email: result.user.email,
    //     img: result.user.photoURL,
    //   })
    //   dispatch(loginSuccess(resp.data))
    //   navigate("/")
    // } catch (error) {
    //  dispatch(loginFailure()) 
    // }
  }


  return (
    <Container>
      <Wrapper>
        <Title>Sign in</Title>
        <SubTitle>to continue to LamaTube</SubTitle>
        <Input placeholder="username" value={lname}
          onChange={(e) => setLName(e.target.value)}/>
        <Input type="password" placeholder="password"
           value={lpassword}
          onChange={(e) => setLPassword(e.target.value)} />
        <Button onClick={handleLogin}>Sign in</Button>

        <Title>or</Title>
        <Button onClick={signInWithGoogle}>Signin with Google</Button>

        <Title>or</Title>

        <Input placeholder="username" value={name} onChange={(e) => setName(e.target.value)}  />
        <Input placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)}  />
        <Input type="password" placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)}  />
        <Button onClick={handleSignup}>Sign up</Button>
      </Wrapper>
      <More>
        English(USA)
        <Links>
          <Link>Help</Link>
          <Link>Privacy</Link>
          <Link>Terms</Link>
        </Links>
      </More>
    </Container>
  );
};

export default SignIn;
