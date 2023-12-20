// const username = prompt("What is your username?")
// const password = prompt("What is your password?")

//Temp
const username = "huy"
const password = "x"

const socket = io('http://localhost:9000')

socket.on('connect', ()=> {
    console.log("connected!")
    socket.emit('clientConnect')
})

socket.on('nsList', (nsData) => {
    const lastNs = localStorage.getItem('lastNs')
    const namespacesDiv = document.querySelector('.namespaces')
    namespacesDiv.innerHTML = ""
    nsData.forEach(ns => {
        namespacesDiv.innerHTML += `<div class="namespace" ns="${ns.endpoint}"><img src="${ns.image}"></div>`
    });

    Array.from(document.getElementsByClassName('namespace')).forEach(element => {
        console.log("element:", element)
        element.addEventListener('click', e => {
            joinNs(element,nsData)
        })
    })

    joinNs(document.getElementsByClassName('namespace')[0],nsData)

})

