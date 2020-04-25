// Generic and all-inclusive scripts.
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
            // alert(this.response);
            var response = JSON.parse(this.response);

            // Redirect:
            if (response.role == 'student')
                location.href = "student/student_home.html";
            else if (response.role == 'teacher')
                location.href = "instructor/instructor_home.html";                
        } else 
            alert("Server error!");
    };
    xml_request.send(data);
    return false;
}


function logout() {location.href = "../model/logout.php";}


function getUsername()
{
    var username;
    var data = new FormData();
    data.append('message_type', 'get_username');

    var xml_request = new XMLHttpRequest();
    xml_request.open('POST', "../model/send_data.php", true);

    xml_request.onload = function() 
    {
        if (xml_request.status == 200) // If the response is good (HTML code 200)
        {
            if (this.response)
            {
                try {
                    username = JSON.parse(this.response).username;
                    document.getElementById("username_display").innerHTML = username;
                }
                catch (e) {location.href = "../model/logout.php"}
            }
        } else 
        alert("Server error!");
    }
    xml_request.send(data);
    return username;
}

function createXMLRequest(data, url) // Takes an array of strings in, and returns a parsed JSON
{
    var response;
    data.append('username', document.getElementById("username_display").innerHTML);
    var xml_request = new XMLHttpRequest();
    xml_request.open('POST', "../model/send_data.php", true);
    return xml_request;
}


function listExams(role)
{
    var data = new FormData();
    data.append('message_type', 'list_exams');
    var xml_request = createXMLRequest(data);

    xml_request.onload = function() 
    {
        if (xml_request.status == 200) // If the response is good (HTML code 200)
        {
            debug(this.response);
            document.getElementById("exam_list").innerHTML = "";
            if (this.response)
            {
                response = JSON.parse(this.response);

                for(var i = 0; i < response.length; i++) 
                {
                    var obj = response[i];
                    if(role == 'student')
                        document.getElementById("exam_list").innerHTML += ("<li>" + "<a onclick=takeExam(" + obj.examID + ") href='exam.html'>" + obj.examName + "</a>" + "</li>");
                    else
                        document.getElementById("exam_list").innerHTML += ("<li>" + obj.examName + "</li>");
                }
            }
        } else 
        alert("Server error!");
    }
    xml_request.send(data);
}


function debug(text) {document.getElementById("debug").value = text;}


function getStudents()
{
    var data = new FormData();
    data.append('message_type', 'list_students'); //list_students_that_took_exam

    // Create and handle the xml request:
    var xml_request = createXMLRequest(data);
    xml_request.onload = function() 
    {
        if (xml_request.status == 200) // If the response is good (HTML code 200)
        {
            debug(this.response);
            if (this.response)
            {
                response = JSON.parse(this.response);

                for(var i = 0; i < response.length; i++) 
                {
                    var obj = response[i];
                    const itemizeUser = user => "<li>" + user.username + "</li>";
                    var listLocation = document.querySelector('#user-list');
                    listLocation.innerHTML = response.map(itemizeUser).join('');
                }        
            }
        } else 
        alert("Server error!");
    }
    xml_request.send(data);
}


function playSound(src)
{
    // this.sound = document.createElement("audio");
    mySound = new sound("../sounds/bleat.wav");
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function(){
        this.sound.play();
    }


    this.stop = function()
    {
        this.sound.pause();
    } 
}

