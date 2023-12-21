
const socket = io('http://localhost:8001');
const adminSocket = io('http://localhost:8001/admin');
socket.on('connect',()=>{
    //do connect type stuff
    console.log("Successfully joined the main ns");
})

socket.on('welcomeToChatRoom',(data)=>{
    console.log("Welcome to the main chat room")
})

socket.on('messageFromServer',(dataFromServer)=>{
    console.log(dataFromServer)
})

socket.on('socketCheck',(dataFromServer)=>{
    console.log(dataFromServer)
})


socket.on('newMessageToClients',(newMessage)=>{
    document.querySelector('#messages').innerHTML += `<li>${newMessage.text}</li>`
})

adminSocket.on('connect',()=>{
    console.log("Successfully joined the admin ns");
})

adminSocket.on('welcomeToChatRoom',()=>{
    console.log("Admin chat room fired!")
})

document.querySelector('#message-form').addEventListener('submit',(event)=>{
    event.preventDefault();
    const newMessage = document.querySelector('#user-message').value
    // console.log(newMessage);
    socket.emit('newMessageToServer',{text:newMessage})
})

