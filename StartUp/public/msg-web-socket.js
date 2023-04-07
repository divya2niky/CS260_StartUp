var sock = new WebSocket("ws://localhost:3000");

// sock.onmessage = function(event){
//     console.log(event);
//     var logelement = document.getElementById('log');
//     var str = arrayBufferToString(event.data);
//     logelement.innerHTML += event.data+"<br>";
// }

sock.onmessage = async (event) => {
    const text = await event.data.text();
    const chat = JSON.parse(text);
    var logelement = document.getElementById('log');
    logelement.innerHTML += "Here's a copy of your message"+"<br>"+ chat.msg+"<br>";
    
  };

function msgsend(){
    var text = document.getElementById('txtareamsgbox').value;
    sock.send(`{"msg":"${text}"}`);
    //sock.send(text);
}


'use strict';/*from  w  w w. j  a  v  a  2s.  c o  m*/

/**
 * @credit https://developers.google.com/web/updates/2012/06/How-to-convert-ArrayBuffer-to-and-from-String?hl=en
 */
function arrayBufferToString(buffer) {
  return String.fromCharCode.apply(null, new Uint16Array(buffer));
}