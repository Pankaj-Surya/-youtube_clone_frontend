import {createSlice} from '@reduxjs/toolkit';

const initialState = {
 currentVideo : null,
 loading : false,
 error : false,
}

//1.name
//2.initialState
//3.reducer
export const videoSlice = createSlice({  
    name : "video",
    initialState,
    reducers: {
        fetchStart : (state) =>{
         state.loading = true;
        },
        fetchSuccess : (state,action) =>{
         state.currentVideo = action.payload
         state.loading = false
        },
        fetchFailure : (state) =>{
         state.loading = false;
         state.error = true;
        },
        like : (state,action) =>{
          //1.check if vid is like by logged in user or not 
          //2.if not then add it userId likes array of video 
          // remove userId from dislikes array
          if(!state.currentVideo.likes.includes(action.payload)){
            state.currentVideo.likes.push(action.payload);
            state.currentVideo.dislikes.splice(
                state.currentVideo.dislikes.findIndex(
                    (userId) =>  userId === action.payload
                ),1
            )
        } 
        },
        dislike : (state,action) =>{
            //1.check if vid is like by logged in user or not 
            //2.if not then add it userId likes array of video 
            // remove userId from dislikes array
            if(!state.currentVideo.dislikes.includes(action.payload)){
              state.currentVideo.dislikes.push(action.payload);
              state.currentVideo.likes.splice(
                  state.currentVideo.likes.findIndex(
                      (userId) =>  userId === action.payload
                  ),1
              )
          } 
        }
    }
}
)
export const {loginStart,loginSuccess,loginFailure,logout,like,dislike} = videoSlice.actions

export default videoSlice.reducer