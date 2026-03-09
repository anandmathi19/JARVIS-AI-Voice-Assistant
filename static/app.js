const startBtn=document.getElementById("start");
const stopBtn=document.getElementById("stop");

const state=document.getElementById("state");
const status=document.getElementById("status");

const cpu=document.getElementById("cpu");
const ram=document.getElementById("ram");
const net=document.getElementById("net");

const clock=document.getElementById("clock");

const chat=document.getElementById("chat");
const historyList=document.getElementById("historyList");

const visualizer=document.getElementById("visualizer");

let room=null;
let connected=false;

let conversations=JSON.parse(localStorage.getItem("jarvis_memory")||"[]");
let currentConversation=[];

/* CLOCK */

setInterval(()=>{
clock.innerText=new Date().toLocaleTimeString();
},1000);

/* SYSTEM STATS */

setInterval(()=>{
cpu.innerText=Math.floor(Math.random()*40+10)+"%";
ram.innerText=Math.floor(Math.random()*50+20)+"%";
},2000);

/* VISUALIZER */

for(let i=0;i<25;i++){
let bar=document.createElement("div");
bar.className="bar";
visualizer.appendChild(bar);
}

/* CHAT */

function addMessage(text,type){

let msg=document.createElement("div");
msg.classList.add("msg",type);

msg.innerText=text;

chat.appendChild(msg);

chat.scrollTop=chat.scrollHeight;

currentConversation.push({text,type});

}

/* START */

startBtn.onclick=async()=>{

if(connected) return;

state.innerText="CONNECTING";

let res=await fetch("/getToken");
let data=await res.json();

room=new LivekitClient.Room();

room.on(LivekitClient.RoomEvent.TrackSubscribed,(track)=>{

if(track.kind==="audio" && connected){

state.innerText="JARVIS SPEAKING";

let audio=track.attach();
audio.autoplay=true;

document.body.appendChild(audio);

addMessage("Jarvis responded","jarvis");

}

});

await room.connect(data.url,data.token);

await room.localParticipant.setMicrophoneEnabled(true);

connected=true;

net.innerText="online";

status.innerText="Listening";

state.innerText="LISTENING";

addMessage("User speaking","user");

};

/* STOP */

stopBtn.onclick=async()=>{

if(!connected) return;

await room.localParticipant.setMicrophoneEnabled(false);

await room.disconnect();

connected=false;

state.innerText="IDLE";

status.innerText="Stopped";

net.innerText="offline";

saveConversation();

};

/* MEMORY */

function saveConversation(){

if(currentConversation.length===0) return;

conversations.push(currentConversation);

localStorage.setItem("jarvis_memory",JSON.stringify(conversations));

renderHistory();

currentConversation=[];

}

function renderHistory(){

historyList.innerHTML="";

conversations.forEach((conv,i)=>{

let item=document.createElement("div");

item.className="history";

item.innerText="Conversation "+(i+1);

item.onclick=()=>{

chat.innerHTML="";

conv.forEach(m=>addMessage(m.text,m.type));

};

historyList.appendChild(item);

});

}

renderHistory();