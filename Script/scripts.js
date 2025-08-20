


// let start_growing = document.querySelector (".start-growing");
// let aeroplane_visa = document.querySelector (".aeroplane-visa");

// if (start_growing === null || aeroplane_visa === null) {
//     start_growing.addEventListener ('click', function () {
//         let start_growing = document.querySelector ('.start-growing');
//         if (start_growing.style.display === "none" || start_growing.style.display === "") {
//             start_growing.style.display = "block";
//         } else {
//             start_growing.style.display = "none";
//         }
//     });

// }








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


