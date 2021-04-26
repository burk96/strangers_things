const BASE_URL =
  "https://strangers-things.herokuapp.com/api/2102-CPU-RM-WEB-PT";

const createPostHTML = (post, _id) => {
  const element = $(`
    <div class="${_id === post.author._id ? `card myPost` : "card"}">
        <div class="card-body">
            <h5 class="card-title">${post.title}</h5>
            <p class="card-text">Posted by: ${post.author.username}</p>
            <p class="card-text">${post.description}</p>
            <p class="card-text">${post.price}</p>
            ${
              _id === post.author._id
                ? `<button class="btn deletePost">Delete</button>`
                : ""
            }
            <button class="btn showMessages">Messages</button>
        </div>
    </div>`);

  element.data("post", post);

  return element;
};

const renderPosts = (posts) => {
  $(".content").empty();
  const me = localStorage.getItem("me");
  const { _id } = me !== null ? JSON.parse(me) : "";
  posts.forEach((post) => {
    const element = createPostHTML(post, _id);
    $(".content").append(element);
  });
};

const renderMyPosts = (posts) => {
  $(".content").empty();
  const me = localStorage.getItem("me");
  const { _id } = me !== null ? JSON.parse(me) : "";
  posts.forEach((post) => {
    if (_id === post.author._id) {
      const element = createPostHTML(post, _id);
      $(".content").append(element);
    }
  });
};

const showMessages = (messages) => {
  messages.forEach((message) => {
    console.log(message)
    $(".modal-body .messages").append(
      `${message.fromUser.username} - ${message.content}`
    );
  });
};

const createPost = async (requestBody) => {
  const token = JSON.parse(localStorage.getItem("token"));
  if (token) {
    try {
      const response = await fetch(`${BASE_URL}/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });
    } catch (error) {
      console.error(error);
    }
  }
};

// TODO: check
const editPost = async (requestBody, postId) => {
  const token = JSON.parse(localStorage.getItem("token"));
  try {
    const request = await fetch(`${BASE_URL}/posts/${postId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(requestBody),
    });
  } catch (error) {
    console.error(error);
  }
};

// TODO: check
const deletePost = async (postId) => {
  const token = JSON.parse(localStorage.getItem("token"));
  try {
    const request = await fetch(`${BASE_URL}/posts/${postId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error(error);
  }
};

const postMessage = async (requestBody, postId) => {
  const token = JSON.parse(localStorage.getItem("token"));
  try {
    const request = await fetch(`${BASE_URL}/posts/${postId}/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(requestBody),
    });
  } catch (error) {
    console.error(error);
  }
};

const registerUser = async (usernameValue, passwordValue) => {
  try {
    const response = await fetch(`${BASE_URL}/users/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user: {
          username: usernameValue,
          password: passwordValue,
        },
      }),
    });
    const {
      data: { token },
    } = await response.json();
    localStorage.setItem("token", JSON.stringify(token));
    hideLogin();
  } catch (error) {
    console.error(error);
  }
};

const loginUser = async (usernameValue, passwordValue) => {
  try {
    const response = await fetch(`${BASE_URL}/users/login`, {
      method: "POST",
      body: JSON.stringify({
        user: {
          username: usernameValue,
          password: passwordValue,
        },
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    // if (!response.success) {
    //   return response;
    // }
    const {
      data: { token },
    } = await response.json();
    localStorage.setItem("token", JSON.stringify(token));
    return response;
  } catch (error) {
    console.error(error);
    return response;
  }
};

const hideLogin = () => {
  $(".loginRegister").hide();
  const { username } = JSON.parse(localStorage.getItem("me"));
  $(".logout").text(`${username} (logout)`);
  $(".logout").show();
};

const showNewPost = () => {
  $(".newPost").show();
};

const showControls = () => {
  $(".footerControls").show();
};

const fetchMe = async () => {
  const token = JSON.parse(localStorage.getItem("token"));
  if (token) {
    try {
      const response = await fetch(`${BASE_URL}/users/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(error);
    }
  }
};

const fetchPosts = async () => {
  try {
    const response = await fetch(`${BASE_URL}/posts`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
};

$(".loginRegister").on("click", (event) => {
  event.preventDefault();
  $("#modal .modal-title").empty();
  $("#modal .modal-title").html("Login/Register");
  $("#modal .modal-body").empty();
  $("#modal .modal-body").html(`
  <div class="loginForm" style="width: 18rem">
    <form>
      <div class="form-group">
        <h3>Login</h3>
        <label for="exampleInputUsername">Username</label>
        <input
          type="text"
          class="form-control"
          id="loginInputUsername"
          aria-describedby="usernameHelp"
          placeholder="Enter username"
        />
      </div>
      <div class="form-group">
        <label for="exampleInputPassword">Password</label>
        <input
          type="password"
          class="form-control"
          id="loginInputPassword"
          placeholder="Password"
        />
      </div>
      <button type="submit" class="btn btn-primary">Submit</button>
    </form>
  </div>  
  
  <div class="registerForm" style="width: 18rem">
    <form>
      <div class="form-group">
        <h3>Register</h3>
        <label for="exampleInputUsername">Username</label>
        <input
          type="text"
          class="form-control"
          id="registerInputUsername"
          aria-describedby="usernameHelp"
          placeholder="Enter username"
        />
      </div>
      <div class="form-group">
        <label for="exampleInputPassword">Password</label>
        <input
          type="password"
          class="form-control"
          id="registerInputPassword"
          placeholder="Password"
        />
      </div>
      <button type="submit" class="btn btn-primary">Submit</button>
    </form>
  </div>`);
  $("#modal .modal-footer").empty();
  $("#modal").modal("show");
});

$(".modal-body").on("submit", ".registerForm form", async (event) => {
  event.preventDefault();
  const username = $("#registerInputUsername").val();
  const password = $("#registerInputPassword").val();

  const response = await registerUser(username, password);
  console.log(response);

  const myPromise = await fetchMe();
  const me = myPromise ? await myPromise.data : [];
  localStorage.setItem("me", JSON.stringify(me));
  $("#modal").modal("hide");
  bootstrap();
});

$(".modal-body").on("submit", ".loginForm form", async (event) => {
  event.preventDefault();
  const username = $("#loginInputUsername").val();
  const password = $("#loginInputPassword").val();

  const response = await loginUser(username, password);

  if (response.ok) {
    const myPromise = await fetchMe();
    const me = myPromise ? await myPromise.data : [];
    console.log(me);
    localStorage.setItem("me", JSON.stringify(me));

    $("#modal").modal("hide");
    bootstrap();
  } else {
    alert("Username or password is incorrect, please try again");
    $("#loginInputPassword").val("");
  }
});

$(".logout").on("click", (event) => {
  event.preventDefault();
  localStorage.removeItem("token");
  localStorage.removeItem("me");
  location.reload();
});

$(".newPost").on("submit", async (event) => {
  event.preventDefault();
  const postTitle = $("#title").val();
  const postDescription = $("#description").val();
  const postPrice = $("#price").val();

  const requestBody = {
    post: {
      title: postTitle,
      description: postDescription,
      price: postPrice,
    },
  };

  createPost(requestBody);
  $("#title").val("");
  $("#description").val("");
  $("#price").val("");
  bootstrap();
});

$(".content").on("click", ".deletePost", function (event) {
  event.preventDefault();
  const card = $(this).closest(".card");
  const post = card.data("post");
  deletePost(post._id);
  bootstrap();
});

$(".content").on("click", ".showMessages", function (event) {
  event.preventDefault();
  const card = $(this).closest(".card");
  const post = card.data("post");
  console.log(post);

  localStorage.setItem("shownMessage", JSON.stringify(post._id));

  $("#modal .modal-title").empty();
  $("#modal .modal-title").html(`${post.title}`);
  $("#modal .modal-body").empty();
  $("#modal .modal-body").html(
    `<div class="messages">${
      post.messages.length > 0 ? showMessages(post.messages) : "No messages yet"
    }</div>
    <br>
    <div class="messageForm">
    <form id="messageForm">
      <div class="mb-3">
        <label for="newMessage" class="form-label">New Message</label>
        <textarea
          class="form-control"
          id="newMessage"
          rows="3"
          cols="50"
          required
        ></textarea>
      </div>
      <button type="submit" class="btn btn-primary">Submit</button>
    </form>
    </div>`
  );
  $("#modal .modal-footer").empty();
  $("#modal").modal("show");
});

$(".modal-body").on("submit", "#messageForm", async (event) => {
  event.preventDefault();
  const newMessage = $("#newMessage").val();
  const requestBody = {
    message: {
      content: newMessage,
    },
  };
  const postId = JSON.parse(localStorage.getItem("shownMessage"));
  postMessage(requestBody, postId);
});

$(".showAllPosts").on("click", async (event) => {
  event.preventDefault();
  const postPromise = await fetchPosts();
  const posts = await postPromise.data.posts;
  renderPosts(posts);
});

$(".showMyPosts").on("click", async (event) => {
  event.preventDefault();
  const postPromise = await fetchPosts();
  const posts = await postPromise.data.posts;
  renderMyPosts(posts);
});

$(".showMyMessages").on("click", async (event) => {
  event.preventDefault();
  const me = JSON.parse(localStorage.getItem("me"))
  $("#modal .modal-title").empty();
  $("#modal .modal-title").html(`Inbox`);
  $("#modal .modal-body").empty();
  $("#modal .modal-body").html(
    `<div class="messages">${
      me.messages.length > 0 ? showMessages(me.messages) : "No messages yet"
    }</div>`
  );
  $("#modal .modal-footer").empty();
  $("#modal").modal("show");
});

const bootstrap = async () => {
  if (JSON.parse(localStorage.getItem("token"))) {
    hideLogin();
    showNewPost();
    showControls();
  }
  const postPromise = await fetchPosts();
  const posts = await postPromise.data.posts;
  renderPosts(posts);
};

bootstrap();
