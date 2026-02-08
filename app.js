let messages = [];
let me = "";
let theme = "dark";

const fileInput = document.getElementById("fileInput");
const meSelect = document.getElementById("meSelect");
const chatBox = document.getElementById("chatBox");
const mePanel = document.getElementById("mePanel");
const themeBtn = document.getElementById("themeBtn");

/* FILE LOAD */

fileInput.onchange = e => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    const data = JSON.parse(reader.result);
    messages = (data.messages || []).reverse();
    setupParticipants();
    mePanel.classList.remove("hidden");
    chatBox.classList.remove("hidden");
  };
  reader.readAsText(file);
};

/* PARTICIPANTS */

function setupParticipants() {
  const set = new Set();
  messages.forEach(m => m.sender_name && set.add(m.sender_name));

  meSelect.innerHTML = `<option value="">Select name</option>`;
  set.forEach(n => {
    const o = document.createElement("option");
    o.value = n;
    o.textContent = n;
    meSelect.appendChild(o);
  });
}

meSelect.onchange = e => {
  me = e.target.value;
  render();
};

/* THEME */

themeBtn.onclick = () => {
  theme = theme === "dark" ? "ig" : "dark";
  document.body.className = "theme-" + theme;
  themeBtn.textContent = "Theme: " + (theme === "ig" ? "Instagram" : "Dark");
};

/* HELPERS */

function getUrl(msg) {
  if (msg?.share?.link) return msg.share.link;
  if (msg?.content) {
    const m = msg.content.match(/https?:\/\/[^\s]+/);
    if (m) return m[0];
  }
  return null;
}

function getVoice(msg) {
  if (msg?.audio_files?.length) return msg.audio_files[0].uri;
  if (msg?.files) {
    const f = msg.files.find(x => x.mime_type?.includes("audio"));
    if (f) return f.uri;
  }
  return null;
}

function getCall(msg) {
  if (!msg.content) return null;
  const t = msg.content.toLowerCase();
  if (t.includes("call") || t.includes("video chat")) return msg.content;
  return null;
}

/* RENDER */

function render() {
  chatBox.innerHTML = "";

  messages.forEach(msg => {
    const url = getUrl(msg);
    const voice = getVoice(msg);
    const call = getCall(msg);
    if (!msg.content && !url && !voice) return;

    if (call) {
      const row = div("row center");
      const b = div("bubble system");
      b.innerHTML = "📞 " + call + time(msg);
      row.appendChild(b);
      chatBox.appendChild(row);
      return;
    }

    const isMe = msg.sender_name === me;
    const row = div("row " + (isMe ? "right" : "left"));
    const b = div("bubble " + (isMe ? "me" : "other"));

    b.innerHTML =
      `<div class="sender">${msg.sender_name}</div>`;

    if (url && url.includes("instagram.com")) {
      b.innerHTML += `<a href="${url}" target="_blank">${url}</a>`;
    } else if (msg.content) {
      b.innerHTML += `<div>${escapeHtml(msg.content)}</div>`;
    }

    if (voice) {
      b.innerHTML += `<audio controls src="${voice}"></audio>`;
    }

    b.innerHTML += time(msg);

    row.appendChild(b);
    chatBox.appendChild(row);
  });
}

function time(msg){
  return `<div class="time">${new Date(msg.timestamp_ms).toLocaleString()}</div>`;
}

function div(c){
  const d = document.createElement("div");
  d.className = c;
  return d;
}

function escapeHtml(t){
  return t.replace(/[&<>"]/g, c =>
    ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
}
