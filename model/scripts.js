function login()
{
    var data = new FormData();
    data.append('username', document.getElementById("username").value);
    data.append('password', document.getElementById("password").value);
    var xml_request = new XMLHttpRequest();
    xml_request.open('POST', "model/login.php", true);
    
    xml_request.onload = function() 
    {
        if (xml_request.status == 200) // If the response is good (HTML code 200)
        {
            var response = JSON.parse(this.response);
            // NJIT response:
            document.getElementById("njit-mess").innerHTML = "NJIT Auth: ";
            if (response.njit_val)
                document.getElementById("njit-val").outerHTML = "<p id=njit-val style='color:green'><\p>"
            else
                document.getElementById("njit-val").outerHTML = "<p id=njit-val style='color:red'><\p>"
            
            document.getElementById("njit-val").innerHTML = response.njit_val;

            // GP10 Response:
            document.getElementById("gp10-mess").innerHTML = "Group 10 Auth: ";
            if (response.gp10_val)
                document.getElementById("gp10-val").outerHTML = "<p id=gp10-val style='color:green'><\p>"
            else
                document.getElementById("gp10-val").outerHTML = "<p id=gp10-val style='color:red'><\p>"

            document.getElementById("gp10-val").innerHTML = response.gp10_val;

            // Redirect:
            if (response.user_type == "student")
                location.href = 'student_home.html';
            else if (response.user_type == "instructor")
                location.href = 'instructor_home.html';                
        } else 
            alert("Server error!");
    };
    xml_request.send(data);
    return false;
}

function logout()
{
    location.href =  "model/logout.php";
}