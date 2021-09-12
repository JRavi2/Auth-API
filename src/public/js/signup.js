const signup_form = document.getElementById("signup_form");

signup_form.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = e.target.elements.name.value;
  const username = e.target.elements.username.value;
  const password = e.target.elements.password.value;

  let myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  let raw = JSON.stringify({
    name,
    username,
    password,
  });

  let requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  fetch("/register", requestOptions)
    .then((response) => response.json())
    .then((result) => {
      console.log(result);
      if (result.token) {
        localStorage.setItem("token", result.token);
        localStorage.setItem("username", result.user.username);
        document.location.href = "/feed.html";
      }
    })
    .catch((error) => console.log("error", error));
});
