// DOM Elements
const chat = document.querySelector("#chat > ul");

// Config
const CONFIG = {
  maxMessages: 50,
  pixelsPerSecond: 250,
  fadeDuration: 0.5,         // seconds
  newMessageOffset: 35       // px: matches li margin-bottom
};

// Core function
function addChatMessage(user, message, flags = {}) {
  const oldRects = Array.from(chat.children).map(el => el.getBoundingClientRect());

  // Create new chat message element
  const li = document.createElement("li");
  li.style.opacity = "0";

  // Assign role class
  if (flags.mod) li.classList.add("mod");
  else if (flags.vip) li.classList.add("vip");
  else if (flags.subscriber) li.classList.add("sub");

  // Add sparkles
  const sparkLImg = document.createElement("img");
  sparkLImg.src = "spark_L.png";
  sparkLImg.alt = "sparkle left";
  sparkLImg.className = "spark-l-img";

  const sparkRImg = document.createElement("img");
  sparkRImg.src = "spark_R.png";
  sparkRImg.alt = "sparkle right";
  sparkRImg.className = "spark-r-img";

  const nameTag = document.createElement("span");
  nameTag.className = "username";
  nameTag.innerText = user;

  const text = document.createElement("blockquote");
  text.innerText = message;

  li.append(sparkLImg, nameTag, text, sparkRImg);
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
  addChatMessage(user, message, flags);
};

// Show bits
ComfyJS.onCheer = (user, message, bits, flags, extra) => {
  addChatMessage(
    user,
    `🎉 Cheered ${bits} bits: ${message}`
  );
};

// Show subs
ComfyJS.onSub = (user, message, subTierInfo, extra) => {
  addChatMessage(
    user,
    `🌟 Subscribed (${subTierInfo.displayName})! ${message || ""}`
  );
};

// Show resubs
ComfyJS.onResub = (user, message, subTierInfo, extra) => {
  addChatMessage(
    user,
    `🔄 Resubscribed (${subTierInfo.displayName})! ${message || ""}`
  );
};

// Show gifted subs
ComfyJS.onGiftSub = (gifterUser, streakMonths, recipientUser, senderCount, subTierInfo, extra) => {
  addChatMessage(
    gifterUser,
    `🎁 Gifted a sub to ${recipientUser} (${subTierInfo.displayName})!`
  );
};

// Show follows
ComfyJS.onFollow = (user, extra) => {
  addChatMessage(
    user,
    `💜 Followed the channel!`
  );
};

// Show raids
ComfyJS.onRaid = (user, viewers, extra) => {
  addChatMessage(
    user,
    `🚀 Raided with ${viewers} viewers!`
  );
};

// Init ComfyJS
ComfyJS.Init("waylonpog");

// Test functions
function testBits() {
  addChatMessage("TestUser", "🎉 Cheered 123 bits: This is a test cheer!");
}

function testDonation() {
  addChatMessage("TestDonor", "💸 Donated $10: This is a test donation!");
}

function testSub() {
  addChatMessage("TestSubber", "🌟 Subscribed (Tier 1)! This is a test sub!");
}

function testResub() {
  addChatMessage("TestResubber", "🔄 Resubscribed (Tier 1)! This is a test resub!");
}

function testGiftSub() {
  addChatMessage("TestGifter", "🎁 Gifted a sub to TestRecipient (Tier 1)!");
}

function testFollow() {
  addChatMessage("TestFollower", "💜 Followed the channel!");
}

function testRaid() {
  addChatMessage("TestRaider", "🚀 Raided with 42 viewers!");
}

function testModChat() {
  addChatMessage("TestMod", "This is a test mod message!", { mod: true });
}

function testSubChat() {
  addChatMessage("TestSub", "This is a test subscriber message!", { subscriber: true });
}

function testVIPChat() {
  addChatMessage("TestVIP", "This is a test VIP message!", { vip: true });
}