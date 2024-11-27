const ws = new WebSocket('wss://justtalk-7nvr.onrender.com');
let messagesData = [];

const createMessage = (messageId, authorId, authorPseudo, message, createdAt) => {
  if (localStorage.getItem("needConnection") === "false") {
    const date = new Date(createdAt);
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric', 
      hour: 'numeric', 
      minute: 'numeric',
    };
    const formattedDate = date.toLocaleDateString('fr-FR', options);
    const div = document.createElement(`div`);
    div.id = messageId;
    if (authorId === localStorage.getItem("_id")) {
      div.classList.add("mineMessage");
    };
    div.classList.add("messageContainer");
    div.innerHTML = `
      <div class="infoMessageContainer">      
        <div class="authorPseudo"><p>${authorPseudo}</p></div>
        <div class="date"><p>${formattedDate}</p></div>
      </div>
      <div class="messageContent"><p>${message.replace(/\n/g, '<br>')}</p></div>
    `;
    document.getElementById('messagesContainer').appendChild(div);
    chat.scrollTop = chat.scrollHeight;
  }
};

const fetchMessages = () => {
  fetch("https://justtalk-7nvr.onrender.com/message")
    .then(res => res.json())
    .then(data => {
      messagesData = data;      
      data.forEach(message => {
        createMessage(message._id, message.author, message.authorPseudo, message.message, message.createdAt);        
      });
    }).then(chat.scrollTop = chat.scrollHeight);
};

ws.onmessage = function(event) {
  const messageData = JSON.parse(event.data);
  messagesData.push(messageData);
  createMessage(messageData._id, messageData.author, messageData.authorPseudo, messageData.message, messageData.createdAt);
};

messageForm.addEventListener('submit', (e) => {
  e.preventDefault();
  if (messageInput.value && localStorage.getItem("needConnection") === "false") {    
    const author = localStorage.getItem("_id");
    const message = messageInput.value;
    const authorPseudo = localStorage.getItem("pseudo");
    
    ws.send(JSON.stringify({ author, message, authorPseudo }));
    messageInput.value = "";
    messageInput.style.height = '25px';
  };
});

const checkAccount = () => {
  const pseudo = localStorage.getItem("pseudo");
  const password = localStorage.getItem("password");
  fetch(`https://justtalk-7nvr.onrender.com/account/check/account?pseudoOrEmail=${pseudo}&password=${password}`)
  .then((res) => {
    if (res.status !== 200) {
      localStorage.clear()
      localStorage.setItem("needConnection", "true");
      alert("Vous devez vous reconnecter, il est possible que votre compte a été supprimé.");
      window.location.href = "./home/home.html";
    };
  });
}



window.addEventListener("load", () => {
  if (localStorage.getItem("needConnection") === "true" || !localStorage.getItem("needConnection")) {
    window.location.href = "./home/home.html";
  } else {
    fetchMessages();
    checkAccount();
  }
});


messageInput.addEventListener('input', function() {
  this.style.height = '25px';
  this.style.height = this.scrollHeight + 'px';
});