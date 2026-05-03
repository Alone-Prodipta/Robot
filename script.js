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

let info= document.getElementById("text");
let op= document.querySelector("nav");
op.style.display="none";
function add()
{
    if(info.value=="")
    {
        alert("Enter a task");
        op.style.display="none";
    }
    else
    {
        let new_Element= document.createElement("ul");
        op.style.display="block";
        // create a span for the text
        let textSpan = document.createElement("span");
        textSpan.textContent = info.value;

        // append text to the new element
        new_Element.appendChild(textSpan);
        new_Element.style.display = "flex";
        new_Element.style.alignItems = "center";

        op.appendChild(new_Element);
        info.value="";
        new_Element.style.backgroundColor="transparent";
        new_Element.style.color="white";
        new_Element.style.padding="10px";
        new_Element.style.fontFamily="David libre ,cursive";
        new_Element.style.borderRadius="10px";

        let option= document.querySelector("ul:last-child");
        option.addEventListener("click",(e)=>
        {
            option.style.color="white";
            if(!option.querySelector(".delete-btn") && !option.querySelector(".rename-btn")) 
            {
                textSpan.style.flex = "1";

                let renameBtn = document.createElement("button");
                renameBtn.className = "rename-btn";
                renameBtn.type = "button";
                renameBtn.title = "Edit item";
                renameBtn.style.marginLeft = "auto";
                renameBtn.style.backgroundColor = "black";
                renameBtn.style.fontFamily="Tagesschrift,serif";
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
                deleteBtn.style.fontFamily="Tagesschrift,serif";
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

                deleteBtn.addEventListener("click", (ev) => 
                {
                    ev.stopPropagation();
                    option.remove();
                });

                renameBtn.addEventListener("click", (ev) => 
                {
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
                        if(value) textSpan.textContent = value;
                        option.replaceChild(textSpan, input);
                    };

                    input.addEventListener("keydown", (keyEvent) => {
                        if(keyEvent.key === "Enter") saveText();
                        if(keyEvent.key === "Escape") option.replaceChild(textSpan, input);
                    });

                    input.addEventListener("blur", saveText);
                    option.replaceChild(input, textSpan);
                    input.focus();
                });
            }
            else
            {
                const deleteBtn = option.querySelector(".delete-btn");
                const renameBtn = option.querySelector(".rename-btn");
                [deleteBtn, renameBtn].forEach((btn) => {
                    if(btn) btn.style.display = btn.style.display === "none" ? "inline-flex" : "none";
                });
            }
        });
    }
}
