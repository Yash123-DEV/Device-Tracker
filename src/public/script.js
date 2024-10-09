

const socket = io();
console.log("hey");

async function SocketConnectionOfMap() {
    if (navigator.geolocation) {
        navigator.geolocation.watchPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                socket.emit("send-location", { latitude, longitude });
            },
            (error) => {
                console.log(error);
            },
            {
                enableHighAccuracy: true,
                timeout: 3000,
                maximumAge: 0
            }
        );
    } else {
        console.log("Geolocation is not supported by this browser.");
    };
};
SocketConnectionOfMap();



const map = L.map('map').setView([0, 0], 13); // Set initial coordinates and zoom level

// Add a tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: 'OpenStreetMap'
}).addTo(map);

const marker = {};

socket.on("received-location", (data)=> {
    const {id, latitude, longitude} = data;

    map.setView([latitude, longitude]);
    if(marker[id]){
        marker[id].setLatLng([latitude, longitude])
    }else{
        marker[id] = L.marker([latitude, longitude]).addTo(map);
    }
});

socket.on("disconnect", () => {
    if (marker[socket.id]) {
        map.removeLayer(marker[socket.id]);
        delete marker[socket.id];
        console.log("Marker removed for client:", socket.id);
    }
});