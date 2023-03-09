## Home Page Design Flow
1. /random, /tag, /sub  => Array of videos => Call in Homepage
2. Home page same for Home,Explore,Subscription
3. so we passed argument "type" to identify type => <Route path="/trends" element={<Home type="trend" />} /> 
4. we make request as => axios.get(`/videos/${type}`)
5. Display video => looping over videos array
 =>  <Card key={video._id} video={video}/>



## Video Page Design Flow
1. we wrap Card => <Link to={`/video/${video?_id`}></Link>
2. when click on particular video => /video/2he3u3ndmdkdk
3. we get url using useLoaction hook so we get videoID 
5. we request on videoId => axios.get(`/videos/${path}`)
6. we get video but make change  and reflect instanly ex. click on like it should reflect instantly without page refresh
7. we use videoSlice 
8. we want user info for showing channel info -> fetch by req
axios.get(`/users/find/${videoRes.data.userId}`)
