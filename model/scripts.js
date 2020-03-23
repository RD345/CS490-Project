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

function verifyUser()
{
    var username = '<%= Session["user_name"] %>';
    alert(username);
}

function process($args) // Takes an array of values in, and returns a parsed JSON
{
    var data = new FormData();
    for ($i = 0; i < $args.length; i++) {
        data.append(element, document.getElementById("username").value);
    }
    var xml_request = new XMLHttpRequest();
    xml_request.open('POST', "model/send_data.php", true);
    
    xml_request.onload = function() 
    {
        if (xml_request.status == 200) // If the response is good (HTML code 200)
            var response = JSON.parse(this.response);              
        else 
            alert("Server error!");
    };
    xml_request.send(data);
    return response;
}

function createExam() {

    var username = '<%= Session["username"] %>';
        alert(username );
    alert(response);
    var response = process(Array("username", "user_type", "message_type"));
    alert(response);
}