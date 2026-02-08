let messages = [];
let me = "";

const fileInput = document.getElementById("fileInput");
const meSelect = document.getElementById("meSelect");
const chat = document.getElementById("chat");
const themeBtn = document.getElementById("themeBtn");

themeBtn.onclick = () => {
  document.body.classList.toggle("ig");
  document.body.classList.toggle("dark");
};

fileInput.onchange = e => {
  const file = e.target.files[0];
  const reader = new FileReader();

  reader.onload = () => {
    const data = JSON.parse(reader.result);
    messages = (data.messages || []).reverse();
    loadParticipants();
    render();
  };

  reader.readAsText(file);
};

function loadParticipants(){
  const set = new Set();
  messages.forEach(m => m.sender_name && set.add(m.sender_name));

  meSelect.innerHTML = '<option value="">Select YOUR name</option>';
  set.forEach(name=>{
    const opt = document.createElement("option");
    opt.value = name;
    opt.textContent = name;
    meSelect.appendChild(opt);
  });
}

meSelect.onchange = e=>{
  me = e.target.value;
  render();
};

function getUrl(msg){
  if(msg.share?.link) return msg.share.link;
  if(typeof msg.content === "string"){
    const m = msg.content.match(/https?:\/\/[^\s]+/);
    return m ? m[0] : null;
  }
  return null;
}

function getCall(msg){
  if(!msg.content) return null;
  const t = msg.content.toLowerCase();
  if(t.includes("call") || t.includes("video chat")){
    return msg.content;
  }
  return null;
}

function getVoice(msg){
  if(msg.audio_files?.length) return msg.audio_files[0].uri;
  if(msg.files){
    const f = msg.files.find(x=>x.mime_type?.includes("audio"));
    if(f) return f.uri;
  }
  return null;
}

function render(){
  chat.innerHTML = "";

  messages.forEach(msg=>{
    const url = getUrl(msg);
    const call = getCall(msg);
    const voice = getVoice(msg);

    // 📞 CALL BUBBLE
    if(call){
      const row = div("row center");
      const b = div("bubble system");
      b.innerHTML = "📞 " + call + meta(msg);
      row.appendChild(b);
      chat.appendChild(row);
      return;
    }

    if(!msg.content && !url && !voice) return;

    const isMe = msg.sender_name === me;
    const row = div("row " + (isMe ? "right":"left"));
    const b = div("bubble " + (isMe ? "me":"other"));

    // 🔗 reel/link → only URL
    if(url && url.includes("instagram.com")){
      b.innerHTML += `<a href="${url}" target="_blank">${url}</a>`;
    }

    // 🎵 voice note
    if(voice){
      b.innerHTML += `<audio controls src="${voice}"></audio>`;
    }

    // 💬 text
    if(msg.content && !url){
      b.innerHTML += `<div>${escapeHtml(msg.content)}</div>`;
    }

    b.innerHTML += meta(msg);
    row.appendChild(b);
    chat.appendChild(row);
  });
}

function meta(msg){
  return `<div class="meta">${msg.sender_name || ""} — ${new Date(msg.timestamp_ms).toLocaleString()}</div>`;
}

function div(cls){
  const d = document.createElement("div");
  d.className = cls;
  return d;
}

function escapeHtml(s){
  return s.replace(/[&<>"]/g,c=>({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'
  }[c]));
}
