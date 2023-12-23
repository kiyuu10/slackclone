const joinRoom = async (roomTitle, namespaceId) => {
    console.log(roomTitle, namespaceId)

    const ackResp = await nameSpaceSockets[namespaceId].emitWithAck('joinRoom', roomTitle)

    
    document.querySelector('.curr-room-num-users').innerHTML = `${ackResp.numUsers}<span class="fa-solid fa-user"></span>`
    document.querySelector('.curr-room-text').textContent = roomTitle
    

    // nameSpaceSockets[namespaceId].emit('joinRoom', roomTitle, (ackResp)=> {
    //     console.log(ackResp)

    //     document.querySelector('curr-room-num-users').innerHTML = `${ackResp.numUsers}<span class="fa-solid fa-user"></span>`
    //     document.querySelector('curr-room-text').textContent = roomTitle
    // })
}

const joinNs = (element, nsData) => {
    const nsEndpoint = element.getAttribute('ns')
    console.log("nsEndpoint",nsEndpoint)

    const clickedNs = nsData.find(row => row.endpoint === nsEndpoint)

    //global so we can submit the new message to the right place
    selectedNsId = clickedNs.id

    const rooms = clickedNs.rooms

    //get the room-list div
    let roomList = document.querySelector('.room-list')

    //clear it out
    roomList.innerHTML = ""


    // init firstRoom var
    let firstRoom

    //loop through each room, and add it to the DOM
    rooms.forEach((room,i) => {
        if(i === 0) {
            firstRoom = rooms[0].roomTitle
        }
        roomList.innerHTML += `<li class="room" namespaceId=${room.namespaceId}>
        <span class="fa-solid fa-${room.privateRoom ? 'lock' : 'globe'}"></span>${room.roomTitle}
        </li>`
    })


    // init join first room
    joinRoom(firstRoom, clickedNs.id)

    //add click listener to each room so the client can tell server it wants to join!
    const roomNodes = document.querySelectorAll('.room')
    Array.from(roomNodes).forEach(elem => {
        elem.addEventListener('click', e => {
            const namespaceId = elem.getAttribute('namespaceId')
            joinRoom(e.target.textContent, namespaceId)
        })
    })

    localStorage.setItem('lastNs', nsEndpoint)
}