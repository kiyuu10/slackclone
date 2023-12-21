// const username = prompt("What is your username?")
// const password = prompt("What is your password?")

//Temp
const username = "huy"
const password = "x"

const socket = io('http://localhost:9000')
// const socket2 = io('http://localhost:9000/wiki')
// const socket3 = io('http://localhost:9000/mozilla')
// const socket4 = io('http://localhost:9000/linux')

//sockets will be put into this array, in the index of their ns.id\
const nameSpaceSockets = []
const listeners = {
    nsChange: []
}

const addListeners = (nsId) => {
    // nameSpaceSockets[ns.id] = thisNs
    if(!listeners.nsChange[nsId]) {
        nameSpaceSockets[nsId].on('nsChange',(data)=> {
            console.log("Namespace changed!");
            console.log(data)
        })
        listeners.nsChange[nsId] = true
    }
}

socket.on('connect', ()=> {
    console.log("connected!")
    socket.emit('clientConnect')
})

socket.on('nsList', (nsData) => {
    const lastNs = localStorage.getItem('lastNs')
    const namespacesDiv = document.querySelector('.namespaces')
    namespacesDiv.innerHTML = ""
    nsData.forEach(ns => {
        //update the HTML with each ns
        namespacesDiv.innerHTML += `<div class="namespace" ns="${ns.endpoint}"><img src="${ns.image}"></div>`

        //initialize thisNs as its index in nameSpaceSockets.
        //If the connection is new, this will be null
        //If the connection has already been established, it will reconnect and remain in its spot
        if (!nameSpaceSockets[ns.id]){
            //There is no socket at this nsId. Soo make a new connection!
            //join this namespaces with io()
            nameSpaceSockets[ns.id] = io(`http://localhost:9000${ns.endpoint}`)
        }

        addListeners(ns.id)
    });

    Array.from(document.getElementsByClassName('namespace')).forEach(element => {
        console.log("element:", element)
        element.addEventListener('click', e => {
            joinNs(element,nsData)
        })
    })

    joinNs(document.getElementsByClassName('namespace')[0],nsData)

})

