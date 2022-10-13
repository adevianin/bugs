console.log('start');

let socket = new WebSocket(`ws://${location.host}/mainsocket`);

socket.onopen = function(e) {
    console.log('connected');
};

socket.onmessage = function(event) {
    console.log('new msg ', event.data);
}