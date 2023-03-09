import axios from "axios"
import jwt_decode from "jwt-decode";import Cookies from 'js-cookie'
import { useSelector } from "react-redux";
const axiosJWT = axios.create()
  


const refreshToken = async (user) => {
    try {
      const res = await axios.post("/refresh", { token: user.refreshToken });
    //   setUser({
    //     ...user,
    //     accessToken: res.data.accessToken,
    //     refreshToken: res.data.refreshToken,
    //   });
      return res.data;
    } catch (err) {
      console.log(err);
    }
};



const interceptor = (user) =>{
  
    axiosJWT.interceptors.request.use(
        async (config) => {
          let currentDate = new Date();
          const decodedToken = jwt_decode(user.accessToken);
          if (decodedToken.exp * 1000 < currentDate.getTime()) {
            const data = await refreshToken();
            config.headers["authorization"] = "Bearer " + data.accessToken;
          }
          return config;
        },
        (error) => {
          return Promise.reject(error);
        }
      );
}

export default  interceptor