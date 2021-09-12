const feed_form = document.getElementById("feed_form");

const socket = io.connect("", {
  query: {
    token: localStorage.getItem("token"),
  },
});

socket.on("add", (newPost) => {
  addPostToDOM(newPost);
});

socket.on("update", (updated) => {
  updateFeed(updated);
});

feed_form.addEventListener("submit", (e) => {
  e.preventDefault();

  // Get body from input
  const body = e.target.elements.body.value;

  // Emit to server
  socket.emit("addPost", body);

  // Clear input
  e.target.elements.body.value = "";
});

// Add a Post to DOM
const addPostToDOM = (post) => {
  const div = document.createElement("div");
  div.classList.add("post");
  div.innerHTML = `
        <p>
	  <span hidden>${post._id}</span>
          <bold>${post.username}</bold>
          <bold>Timestamp:</bold> ${post.createdAt}
	  ${post.createdAt !== post.updatedAt ? "<span>(edited)</span>" : ""}
	  ${post.username === localStorage.getItem("username") ? '<a class="edit_link" href="">Edit</a>' : ""}
	  ${post.username === localStorage.getItem("username") ? '<a class="delete_link" href="">Delete</a>' : ""}
        </p>
	<p class="body">${post.body}</p>
	<br><br>`;

  const edit_link = div.getElementsByClassName("edit_link")[0];
  const delete_link = div.getElementsByClassName("delete_link")[0];

  // Event Listener for the Edit Link
  if (edit_link) {
    edit_link.addEventListener("click", (e) => {
      e.preventDefault();

      let newBody = prompt("Please enter the new Body");

      if (newBody !== null && newBody !== "") {
        post.body = newBody;
        socket.emit("updatePost", post);
      }
    });
  }

  // Event Listener for the Delete Link
  if (delete_link) {
    delete_link.addEventListener("click", (e) => {
      e.preventDefault();
      socket.emit("deletePost", post);
    });
  }

  document.getElementById("feed").appendChild(div);
};

// Refresh the feed in the DOM
const updateFeed = (posts) => {
  document.getElementById("feed").innerHTML = "";
  for (let post of posts) {
    addPostToDOM(post);
  }
};
