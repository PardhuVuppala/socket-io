import React, {useEffect,useState,useMemo} from "react"
import {io} from "socket.io-client";
import {Button, Container, TextField, Typography, Box, Stack} from '@mui/material'
function App() {
const socket =  useMemo(()=>io("http://localhost:3000", {
  withCredentials:true,
}),[]);
const[message,setMessage]=useState("");
const [room, setRoom] = useState("")
const [socketId, setSocketId] = useState("")
const [messages,setMessages] = useState([])
const [roomName, setRoomName] = useState("")


useEffect(()=>
{
  socket.on("connect",()=>{
    setSocketId(socket.id)
    console.log("connected",socket.id)
  })

socket.on("receive-message",(data)=>{
  console.log(data)
  setMessages((messages)=>[...messages,data])
})

  socket.on("welcome",(s)=>
  {
    console.log(s)
  })



  return()=>
  {
    socket.disconnect();
  }
},[])
 
const handleSubmit=(e)=>
{
  e.preventDefault();
  socket.emit("message",{message, room});
  setMessage("")
}

const joinRoomHandler=(e)=>
{
  e.preventDefault();
  socket.emit('join-room',roomName)
  setRoomName("")

}
  return (
      <Container maxWidth="sm">
        <Box sx={{height : 500}}/>
       {socketId}

       <form onSubmit={joinRoomHandler}>
       <TextField value={roomName} onChange={(e)=>setRoomName(e.target.value)} id = "outlined-basic" label="Room Name" varient="outlined"/>
       <Button type="submit" variant="contained" color="primary">Send</Button>
       </form>


        <form onSubmit={handleSubmit}>
          <TextField value={message} onChange={(e)=>setMessage(e.target.value)} id = "outlined-basic" label="Messaged" varient="outlined"/>
          <TextField value={room} onChange={(e)=>setRoom(e.target.value)} id = "outlined-basic" label="Room" varient="outlined"/>

          <Button type="submit" variant="contained" color="primary">Send</Button>
        </form>
       <Stack>
       {messages.map((m, i) => (
          <Typography key={i} variant="h6" component="div" gutterBottom>
            {m}  
          </Typography>
        ))}
       </Stack>
       
      </Container>
 
  )
}

export default App
