const sidebar = document.getElementById('sidebar');
const openSidebar = document.getElementById('openSidebar');
const closeSidebar = document.getElementById('closeSidebar');
const welcome = document.getElementById('welcome_text');

openSidebar.addEventListener('click', () => {
    sidebar.classList.add('open');
    openSidebar.style.display = "none";
});

closeSidebar.addEventListener('click', () => {
    sidebar.classList.remove('open');
    openSidebar.style.display = "block";
});

window.addEventListener('click', (event) => {
    if (sidebar.classList.contains('open') && !sidebar.contains(event.target) && !openSidebar.contains(event.target)) {
        sidebar.classList.remove('open');
    }
});

let info = document.getElementById("text");
let searchInput = document.getElementById("search");
let op = document.querySelector("nav");
let chatContainer = document.querySelector(".chat");
let conversationStarted = false;
op.style.display = "none";

/* =========================================
   SEARCH & HISTORY LOGIC
   ========================================= */
function highlightSearch() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    const items = document.querySelectorAll("nav .sidebar-item");

    items.forEach(item => {
        const textSpan = item.querySelector(".sidebar-text");
        const text = textSpan ? textSpan.textContent.toLowerCase() : "";
        const matches = text.includes(searchTerm);

        item.style.display = searchTerm && !matches ? "none" : "flex";

        if (textSpan) {
            textSpan.innerHTML = textSpan.textContent;
            if (searchTerm && matches) {
                const escaped = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
                const regex = new RegExp(`(${escaped})`, 'gi');
                textSpan.innerHTML = textSpan.textContent.replace(regex, '<mark>$1</mark>');
            }
        }
    });
}

searchInput.addEventListener('input', highlightSearch);

/* =========================================
   MESSAGE DISPLAY FUNCTIONS
   ========================================= */
function addBotMessage(message) {
    const messageRow = document.createElement("div");
    messageRow.className = "chat-message chat-message-bot";
    const messageBubble = document.createElement("div");
    messageBubble.className = "message-bubble";
    messageBubble.style.backgroundColor = "#333";
    messageBubble.textContent = message;
    messageRow.appendChild(messageBubble);
    chatContainer.appendChild(messageRow);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

function addNavMessage(message) {
    op.style.display = "block";

    const item = document.createElement("div");
    item.className = "sidebar-item";

    const textSpan = document.createElement("span");
    textSpan.className = "sidebar-text";
    textSpan.textContent = message;
    item.appendChild(textSpan);

    const actions = document.createElement("div");
    actions.className = "sidebar-actions";

    const editBtn = document.createElement("button");
    editBtn.type = "button";
    editBtn.className = "sidebar-btn edit-btn";
    editBtn.title = "Edit item";
    editBtn.innerHTML = '<i class="fa fa-pencil"></i>';

    const deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.className = "sidebar-btn delete-btn";
    deleteBtn.title = "Delete item";
    deleteBtn.innerHTML = '<i class="fa fa-trash"></i>';

    actions.appendChild(editBtn);
    actions.appendChild(deleteBtn);
    item.appendChild(actions);
    op.appendChild(item);

    deleteBtn.addEventListener("click", (ev) => {
        ev.stopPropagation();
        item.remove();
    });

    editBtn.addEventListener("click", (ev) => {
        ev.stopPropagation();
        const currentText = textSpan.textContent;
        const input = document.createElement("input");
        input.type = "text";
        input.value = currentText;
        input.className = "sidebar-edit";

        const finishEdit = () => {
            const newValue = input.value.trim();
            if (newValue) {
                textSpan.textContent = newValue;
            }
            item.replaceChild(textSpan, input);
        };

        input.addEventListener("keydown", (keyEvent) => {
            if (keyEvent.key === "Enter") {
                finishEdit();
            }
            if (keyEvent.key === "Escape") {
                item.replaceChild(textSpan, input);
            }
        });

        input.addEventListener("blur", finishEdit);
        item.replaceChild(input, textSpan);
        input.focus();
    });
}

function addChatMessage(message) {
    const messageRow = document.createElement("div");
    messageRow.className = "chat-message chat-message-user";
    const messageBubble = document.createElement("div");
    messageBubble.className = "message-bubble";
    messageBubble.textContent = message;
    messageRow.appendChild(messageBubble);
    chatContainer.appendChild(messageRow);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

/* =========================================
   CORE CHAT & INTERCEPTION LOGIC
   ========================================= */
info.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') add();
});

info.addEventListener('focus', () => { welcome.style.display = "none"; });
info.addEventListener('input', () => { welcome.style.display = "none"; });
info.addEventListener('focusout', () => {
    if (!conversationStarted && info.value.trim() === "") welcome.style.display = "block";
});

async function add() {
    const message = info.value.trim();
    if (!message) return;

    conversationStarted = true;
    welcome.style.display = "none";
    const lowerMessage = message.toLowerCase();

    // INTERCEPT IMAGE REQUESTS
    if (lowerMessage.includes("draw") || lowerMessage.includes("image") || lowerMessage.includes("generate")) {
        addNavMessage(message);
        addChatMessage(message);
        generateImage(message); // Fixed Function
        info.value = "";
        return;
    }

    // REGULAR TEXT REQUESTS
    addNavMessage(message);
    addChatMessage(message);
    info.value = "";

    try {
        const response = await fetch('brain.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: message })
        });
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        if (data.candidates) {
            addBotMessage(data.candidates[0].content.parts[0].text);
        }
    } catch (error) {
        console.error("AI Error:", error);
        addBotMessage("Sorry, I'm having trouble connecting right now.");
    }
}

/* =========================================
   FIXED IMAGE GENERATION SECTOR
   ========================================= */
function generateImage(prompt) {
    const seed = Math.floor(Math.random() * 100000); // Forces fresh generation
    const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=512&height=512&nologo=true&seed=${seed}`;

    const messageRow = document.createElement("div");
    messageRow.className = "chat-message chat-message-bot";

    const messageBubble = document.createElement("div");
    messageBubble.className = "message-bubble";
    messageBubble.style.backgroundColor = "#333";
    messageBubble.style.minHeight = "120px";

    const statusText = document.createElement("p");
    statusText.innerHTML = `<b>Rab-bits:</b> Creating "${prompt}"...`;
    statusText.style.margin = "0";
    messageBubble.appendChild(statusText);

    const img = new Image();
    img.src = url;
    img.style.width = "100%";
    img.style.borderRadius = "10px";
    img.style.marginTop = "10px";
    img.style.display = "none"; // Hide until ready

    img.onload = () => {
        img.style.display = "block";
        statusText.innerHTML = `<b>Rab-bits:</b> Done!`;
        chatContainer.scrollTop = chatContainer.scrollHeight;
    };

    img.onerror = () => {
        statusText.innerHTML = `<b>Rab-bits:</b> Sorry, the image server is currently busy.`;
    };

    messageBubble.appendChild(img);
    messageRow.appendChild(messageBubble);
    chatContainer.appendChild(messageRow);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

const toastTrigger = document.getElementById('liveToastBtn')
const toastLiveExample = document.getElementById('liveToast')

if (toastTrigger) {
  const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample)
  toastTrigger.addEventListener('click', () => {
    toastBootstrap.show()
  })
}
