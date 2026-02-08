let messages = [];
let me = "";
let theme = "dark";

const fileInput = document.getElementById("fileInput");
const meSelect = document.getElementById("meSelect");
const chatBox = document.getElementById("chatBox");
const mePanel = document.getElementById("mePanel");
const themeBtn = document.getElementById("themeBtn");

/* FILE LOAD */

fileInput.addEventListener("change", e => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    try {
      const data = JSON.parse(reader.result);
      messages = (data.messages || []).reverse();
      setupParticipants();
      mePanel.classList.remove("hidden");
      chatBox.classList.remove("hidden");
    } catch {
      alert("Invalid JSON");
    }
  };
  reader.readAsText(file);
});

/* PARTICIPANTS */

function setupParticipants() {
  const set = new Set();
  messages.forEach(m => m.sender_name && set.add(m.sender_name));

  meSelect.innerHTML = `<option value="">Select name</option>`;
  set.forEach(name => {
    const opt = document.createElement("option");
    opt.value = name;
    opt.textContent = name;
    meSelect.appendChild(opt);
  });
}

meSelect.addEventListener("change", e => {
  me = e.target.value;
  renderChat();
});

/* THEME SWITCH */

themeBtn.onclick = () => {
  theme = theme === "dark" ? "ig" : "dark";
  document.body.className = "theme-" + theme;
  themeBtn.textContent = "Theme: " + (theme === "ig" ? "Instagram" : "Dark");
};

/* URL / REEL DETECTION */

function getUrl(msg) {
  if (msg?.share?.link) return msg.share.link;
  if (typeof msg.content === "string") {
    const m = msg.content.match(/https?:\/\/[^\s]+/);
    if (m) return m[0];
  }
  return null;
}

/* RENDER */

function renderChat() {
  chatBox.innerHTML = "";

  messages.forEach(msg => {
    const url = getUrl(msg);
    if (!msg.content && !url) return;

    const isMe = msg.sender_name === me;

    const row = document.createElement("div");
    row.className = "row " + (isMe ? "right" : "left");

    const bubble = document.createElement("div");
    bubble.className = "bubble " + (isMe ? "me" : "other");

    const sender = document.createElement("div");
    sender.className = "sender";
    sender.textContent = msg.sender_name;

    const body = document.createElement("div");

    if (url && url.includes("instagram.com")) {
      const a = document.createElement("a");
      a.href = url;
      a.target = "_blank";
      a.textContent = url;
      body.appendChild(a);
    } else {
      body.textContent = msg.content || "";
    }

    const time = document.createElement("div");
    time.className = "time";
    time.textContent = new Date(msg.timestamp_ms).toLocaleString();

    bubble.appendChild(sender);
    bubble.appendChild(body);
    bubble.appendChild(time);
    row.appendChild(bubble);
    chatBox.appendChild(row);
  });
}
