function greetUser() {
    let name = document.getElementById("username").value.trim();

    if (name === "") {
        alert("Please enter your name!");
    } else {
        alert("Hello " + name + "!");
    }
}

function validateForm(event) {
    event.preventDefault();

    let name = document.getElementById("contactName").value.trim();
    let email = document.getElementById("contactEmail").value.trim();

    if (name === "" || email === "") {
        alert("Please enter your name and email!");
    } else {
        alert("Your form looks good!");
    }

    return false;
}