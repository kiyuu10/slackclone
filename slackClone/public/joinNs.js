const joinNs = (element, nsData) => {
    const nsEndpoint = element.getAttribute('ns')
    console.log("nsEndpoint",nsEndpoint)

    const clickedNs = nsData.find(row => row.endpoint === nsEndpoint)
    const rooms = clickedNs.rooms

    //get the room-list div
    let roomList = document.querySelector('.room-list')

    //clear it out
    roomList.innerHTML = ""
    //loop through each room, and add it to the DOM
    rooms.forEach(room => {
        console.log(room)
        roomList.innerHTML += `<li class="room"><span class="fa-solid fa-${room.privateRoom ? 'lock' : 'globe'}"></span>${room.roomTitle}</li>`
    })

    //add click listener to each room so the client can tell server it wants to join!
    const roomNodes = document.querySelectorAll('.room')
    Array.from(roomNodes).forEach(elem => {
        elem.addEventListener('click', e => {
            console.log("someone clicked on",e.target.innerHTML)
        })
    })

    localStorage.setItem('lastNs', nsEndpoint)
} 