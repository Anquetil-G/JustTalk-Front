connectionForm.addEventListener("submit", (e) => {
  e.preventDefault();
  fetch(`https://justtalk-7nvr.onrender.com/account/check/account?pseudoOrEmail=${pseudoOrEmailInput.value}&password=${passwordInput.value}`)
    .then((res) => {
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
        errorForm.textContent = "Connexion impossible"
      }
    });
});