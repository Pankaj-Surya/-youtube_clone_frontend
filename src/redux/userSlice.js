import {createSlice} from '@reduxjs/toolkit';

const initialState = {
 currentUser : null,
 loading : false,
 error : false,
}

//1.name
//2.initialState
//3.reducer
export const userSlice = createSlice({  
    name : "user",
    initialState,
    reducers: {
        loginStart : (state) =>{
         state.loading = true;
        },
        loginSuccess : (state,action) =>{
         state.currentUser = action.payload
         state.loading = false
        },
        loginFailure : (state) =>{
         state.loading = false;
         state.error = true;
        },
        logout : (state) =>{
          state.currentUser = null;
          state.loading = false;
          state.error = false;  
        },
        subscription : (state,action) =>{
          // if present, then unsubscribe 
          if(state.currentUser.others.subscribedUsers.includes(action.payload)){
            state.currentUser.others.subscribedUsers.splice(
              state.currentUser.others.subscribedUsers.findIndex(
                (channelId) => channelId === action.payload
              ),1
            )
          }else{
            state.currentUser.others.subscribedUsers.push(action.payload)
          }
        }
    }
}
)
export const {loginStart,loginSuccess,loginFailure,logout,subscription} = userSlice.actions

export default userSlice.reducer