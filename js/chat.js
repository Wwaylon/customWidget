// DOM Elements
const chat = document.querySelector("#chat > ul");

// Config
const CONFIG = {
  maxMessages: 50,
  pixelsPerSecond: 250,
  fadeDuration: 0.5,         // seconds
  newMessageOffset: 20       // px: matches li margin-bottom
};

// Core function
function addChatMessage(user, message) {
  const oldRects = Array.from(chat.children).map(el => el.getBoundingClientRect());

  // Create new chat message element
  const li = document.createElement("li");
  li.style.opacity = "0";

  const nameTag = document.createElement("span");
  nameTag.className = "username";
  nameTag.innerText = user;

  const text = document.createElement("blockquote");
  text.innerText = message;

  li.append(nameTag, text);
  chat.appendChild(li);

  requestAnimationFrame(() => {
    const newRects = Array.from(chat.children).map(el => el.getBoundingClientRect());

    // Add synthetic old position for new message
    if (chat.children.length > oldRects.length) {
      const newEl = chat.children[chat.children.length - 1];
      const newRect = newEl.getBoundingClientRect();
      const syntheticOldTop = newRect.top + newRect.height + CONFIG.newMessageOffset;
      oldRects.push({ top: syntheticOldTop });
    }

    // Animate FLIP + fade
    chat.childNodes.forEach((el, i) => {
      const oldTop = oldRects[i]?.top ?? newRects[i].top;
      const newTop = newRects[i].top;
      const deltaY = oldTop - newTop;

      const isNew = i === chat.children.length - 1;
      const distance = Math.abs(deltaY);
      const moveDuration = distance / CONFIG.pixelsPerSecond;

      el.style.transition = "none";
      el.style.transform = `translateY(${deltaY}px)`;
      if (isNew) el.style.opacity = "0";

      requestAnimationFrame(() => {
        el.style.transition = `transform ${moveDuration}s linear${isNew ? `, opacity ${CONFIG.fadeDuration}s linear` : ""}`;
        el.style.transform = "";
        if (isNew) el.style.opacity = "1";
      });
    });

    // Scroll to bottom
    chat.parentElement.scrollTop = chat.parentElement.scrollHeight;

    // Trim old messages
    while (chat.children.length > CONFIG.maxMessages) {
      chat.removeChild(chat.firstChild);
    }
  });
}

// ComfyJS hook
ComfyJS.onChat = (user, message, flags, self, extra) => {
  addChatMessage(user, message);
};

// Init ComfyJS
ComfyJS.Init("waylonpog");