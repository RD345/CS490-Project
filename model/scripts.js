function login()
{
    //alert(document.getElementById("username").value);
    //document.getElementById("username").value = "submitted";
    var data = new FormData();
    data.append('username', document.getElementById("username").value);
    data.append('password', document.getElementById("password").value);
    var xml_request = new XMLHttpRequest();
    // @TODO - CHANGE "server-dummy.txt" TO YOUR SERVER SCRIPT
    xml_request.open('POST', "model/login.php", true);
    xml_request.onload = function() 
    {
        //alert("loaded");
        if (xml_request.status == 200) // If the response is good (HTML code 200)
        {
            //alert("good response");
            var response = JSON.parse(this.response);
            // VALID
           
                //alert("NJIT login invalid");

                // NJIT response:
                document.getElementById("njit-mess").innerHTML = "NJIT Auth: ";
                if (response.njit_val)
                    document.getElementById("njit-val").outerHTML = "<p id=njit-val style='color:green'><\p>"
                else
                    document.getElementById("njit-val").outerHTML = "<p id=njit-val style='color:red'><\p>"

                // GP10 Response:
                document.getElementById("gp10-mess").innerHTML = "Group 10 Auth: ";
                document.getElementById("gp10-val").innerHTML = response.gp10_val;

                // Redirect:
                if (response == "student")
                    location.href = "student_home.html";
                else if (response == "teacher")
                    location.href = 'instructor_home.html';                
            
        } else 
            alert("SERVER ERROR!");
    };
    xml_request.send(data);
    return false;
}