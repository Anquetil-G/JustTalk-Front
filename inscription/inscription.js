inscriptionForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const body = {
    pseudo: pseudoInput.value,
    email: emailInput.value,
    password: passwordInput.value
  };
  fetch("https://justtalk-7nvr.onrender.com/account/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  }).then((res) => {
    if (res.status === 200) {
      return res.json().then(data => {
        localStorage.setItem("needConnection", "false");
        localStorage.setItem("pseudo", data.pseudo);
        localStorage.setItem("email", data.email);
        localStorage.setItem("password", data.password);
        localStorage.setItem("_id", data._id);
        window.location.href = "../index.html";
      });
    } else {
      return res.json().then(errorData => {
        console.log(errorData);
        errorForm.textContent = errorData.message;
      });
    };
  });
});