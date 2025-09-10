
// LOGIN SECTION START

function formvalidation () {
    let password = document.getElementById("password");
    let name = document.getElementById("name");

    if (name.value.trim() == "" || name.value.length < 3) {
        name.style.border = "1px solid red";
        return false;
    } else if (password.value.trim() == "" || password.value.length < 6) {
        password.style.border = "1px solid red";
        return false;
    }  else {
      alert ("✔ log in successfully")
    }
    return false; // Prevent form submission
}

// LOGIN SECTION END


let login = document.getElementById ("login");
if (login) {
    login.addEventListener ("click", function () {
        location.href = "login.html"
    }
)}

let online_btn = document.getElementById ("online_btn");
if (online_btn) {
    online_btn.addEventListener ("click", function () {
        location.href = "login.html"
    }
)}