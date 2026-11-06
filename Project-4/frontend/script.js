const API_URL = "http://localhost:3000/users";

const userForm = document.getElementById("userForm");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const message = document.getElementById("message");
const loadBtn = document.getElementById("loadBtn");
const loading = document.getElementById("loading");
const userList = document.getElementById("userList");

function showMessage(text, type) {
  message.textContent = text;
  message.className = type;
}

function getErrorText(error) {
  if (error.message === "Failed to fetch") {
    return "Cannot connect to server. Is it running?";
  }
  return error.message;
}

function renderUsers(users) {
  userList.textContent = "";

  if (users.length === 0) {
    const empty = document.createElement("li");
    empty.textContent = "No users found";
    userList.appendChild(empty);
    return;
  }

  users.forEach(function (user) {
    const li = document.createElement("li");

    const info = document.createElement("span");
    info.textContent = user.name + " (" + user.email + ")";

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.className = "delete-btn";
    deleteBtn.addEventListener("click", function () {
      deleteUser(user.id);
    });

    li.appendChild(info);
    li.appendChild(deleteBtn);
    userList.appendChild(li);
  });
}

async function loadUsers() {
  loading.classList.remove("hidden");
  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error("HTTP Error! Status: " + response.status);
    }

    const users = await response.json();
    renderUsers(users);
  } catch (error) {
    showMessage(getErrorText(error), "error");
  } finally {
    loading.classList.add("hidden");
  }
}

async function addUser(event) {
  event.preventDefault();

  const userData = {
    name: nameInput.value,
    email: emailInput.value,
  };

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error);
    }

    showMessage("User added: " + data.name, "success");
    userForm.reset();
    loadUsers();
  } catch (error) {
    showMessage(getErrorText(error), "error");
  }
}

async function deleteUser(id) {
  try {
    const response = await fetch(API_URL + "/" + id, {
      method: "DELETE",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error);
    }

    showMessage("User deleted", "success");
    loadUsers();
  } catch (error) {
    showMessage(getErrorText(error), "error");
  }
}

userForm.addEventListener("submit", addUser);
loadBtn.addEventListener("click", loadUsers);
