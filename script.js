const sidebar = document.getElementById('sidebar');
const openSidebar = document.getElementById('openSidebar');
const closeSidebar = document.getElementById('closeSidebar');

openSidebar.addEventListener('click', () => {
    sidebar.classList.add('open');
});

closeSidebar.addEventListener('click', () => {
    sidebar.classList.remove('open');
});

window.addEventListener('click', (event) => {
    if (
        sidebar.classList.contains('open') &&
        !sidebar.contains(event.target) &&
        !openSidebar.contains(event.target)
    ) {
        sidebar.classList.remove('open');
    }
});
// adding the search history functionality

let info = document.getElementById("text");
let searchInput = document.getElementById("search");
let op = document.querySelector("nav");
let chatContainer = document.querySelector(".chat");
op.style.display = "none";

// Search functionality with highlighting
function highlightSearch() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    const taskSpans = document.querySelectorAll("nav ul span");

    taskSpans.forEach(span => {
        // Remove existing highlights
        span.innerHTML = span.textContent;

        if (searchTerm && span.textContent.toLowerCase().includes(searchTerm)) {
            // Highlight matching text
            const regex = new RegExp(`(${searchTerm})`, 'gi');
            span.innerHTML = span.textContent.replace(regex, '<mark>$1</mark>');
        }
    });
}

// Add search event listener
searchInput.addEventListener('input', highlightSearch);

function addBotMessage(message) {
    const messageRow = document.createElement("div");
    messageRow.className = "chat-message chat-message-bot";

    const messageBubble = document.createElement("div");
    messageBubble.className = "message-bubble";
    messageBubble.style.backgroundColor = "#333"; // Different color for bot
    messageBubble.textContent = message;

    messageRow.appendChild(messageBubble);
    chatContainer.appendChild(messageRow);
    chatContainer.scrollTop = chatContainer.scrollHeight; // Auto-scroll to bottom
}


function addNavMessage(message) {
    op.style.display = "block";
    let new_Element = document.createElement("ul");
    let textSpan = document.createElement("span");
    textSpan.textContent = message;

    new_Element.appendChild(textSpan);
    new_Element.style.display = "flex";
    new_Element.style.alignItems = "center";

    op.appendChild(new_Element);
    new_Element.style.backgroundColor = "transparent";
    new_Element.style.color = "white";
    new_Element.style.padding = "10px";
    new_Element.style.fontFamily = "David libre ,cursive";
    new_Element.style.borderRadius = "10px";

    let option = new_Element;
    option.addEventListener("click", (e) => {
        option.style.color = "white";
        if (!option.querySelector(".delete-btn") && !option.querySelector(".rename-btn")) {
            textSpan.style.flex = "1";

            let renameBtn = document.createElement("button");
            renameBtn.className = "rename-btn";
            renameBtn.type = "button";
            renameBtn.title = "Edit item";
            renameBtn.style.marginLeft = "auto";
            renameBtn.style.backgroundColor = "black";
            renameBtn.style.fontFamily = "Tagesschrift,serif";
            renameBtn.style.color = "white";
            renameBtn.style.border = "none";
            renameBtn.style.padding = "6px 10px";
            renameBtn.style.borderRadius = "5px";
            renameBtn.style.cursor = "pointer";
            renameBtn.style.display = "inline-flex";
            renameBtn.style.alignItems = "center";
            renameBtn.style.justifyContent = "center";

            let renameIcon = document.createElement("i");
            renameIcon.className = "fa fa-pencil";
            renameIcon.style.fontSize = "16px";
            renameBtn.appendChild(renameIcon);

            let deleteBtn = document.createElement("button");
            deleteBtn.className = "delete-btn";
            deleteBtn.type = "button";
            deleteBtn.title = "Remove item";
            deleteBtn.style.marginLeft = "8px";
            deleteBtn.style.backgroundColor = "black";
            deleteBtn.style.fontFamily = "Tagesschrift,serif";
            deleteBtn.style.color = "white";
            deleteBtn.style.border = "none";
            deleteBtn.style.padding = "6px 10px";
            deleteBtn.style.borderRadius = "5px";
            deleteBtn.style.cursor = "pointer";
            deleteBtn.style.display = "inline-flex";
            deleteBtn.style.alignItems = "center";
            deleteBtn.style.justifyContent = "center";

            let deleteIcon = document.createElement("i");
            deleteIcon.className = "fa fa-trash";
            deleteIcon.style.fontSize = "16px";
            deleteBtn.appendChild(deleteIcon);

            option.appendChild(renameBtn);
            option.appendChild(deleteBtn);

            deleteBtn.addEventListener("click", (ev) => {
                ev.stopPropagation();
                option.remove();
            });

            renameBtn.addEventListener("click", (ev) => {
                ev.stopPropagation();
                let input = document.createElement("input");
                input.type = "text";
                input.value = textSpan.textContent;
                input.style.flex = "1";
                input.style.marginRight = "8px";
                input.style.padding = "6px 8px";
                input.style.borderRadius = "5px";
                input.style.border = "1px solid #ccc";
                input.style.fontFamily = "inherit";
                input.style.fontSize = "16px";

                const saveText = () => {
                    const value = input.value.trim();
                    if (value) textSpan.textContent = value;
                    option.replaceChild(textSpan, input);
                };

                input.addEventListener("keydown", (keyEvent) => {
                    if (keyEvent.key === "Enter") saveText();
                    if (keyEvent.key === "Escape") option.replaceChild(textSpan, input);
                });

                input.addEventListener("blur", saveText);
                option.replaceChild(input, textSpan);
                input.focus();
            });
        }
        else {
            const deleteBtn = option.querySelector(".delete-btn");
            const renameBtn = option.querySelector(".rename-btn");
            [deleteBtn, renameBtn].forEach((btn) => {
                if (btn) btn.style.display = btn.style.display === "none" ? "inline-flex" : "none";
            });
        }
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

const searchBox = document.getElementById("search");
const items = document.querySelectorAll("ul");

searchBox.addEventListener("keyup", function () {
    const query = this.value.toLowerCase();
    items.forEach(item => {
        item.classList.toggle("hidden", !item.textContent.toLowerCase().includes(query));
    });
});



info.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        add();
    }
});




async function add() 
{
    const message = info.value.trim();
    if (!message) return;

    // 1. Update UI immediately
    addNavMessage(message);
    addChatMessage(message); 
    info.value = "";

    try 
    {
        // 2. Fetch the data from the backend
        const response = await fetch('brain.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: message })
        });

        // 3. Verify the response is okay
        if (!response.ok) throw new Error('Network response was not ok');

        // 4. NOW parse the JSON (after response is defined)
        const data = await response.json();

        // 5. Handle the AI reply or errors from the API
        if (data.candidates && data.candidates[0].content.parts[0].text) {
            const aiReply = data.candidates[0].content.parts[0].text;
            addBotMessage(aiReply);
        } else if (data.error) {
            console.error("API Error:", data.error);
            addBotMessage("System Error: " + data.error.message);
        } else {
            console.error("Unexpected API response structure:", data);
        }

    } catch (error) {
        console.error("AI Error:", error);
        addBotMessage("Sorry, I'm having trouble connecting right now.");
    }
}

