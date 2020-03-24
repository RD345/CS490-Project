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
            alert(this.response);
            var response = JSON.parse(this.response);

            // Redirect:
            if (response.role == "student")
                location.href = 'student_home.html';
            else if (response.role == "teacher")
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

function process(funct, args=null) // Takes an array of strings in, and returns a parsed JSON
{
    var data = new FormData();
    var response;
    // data.append('username', document.getElementById("username").value);
    data.append('message_type', funct);

    if(args != null)
        for (var i = 0; i < args.length; i++) {
            data.append(args[i], document.getElementById(args[i]).value);
        // alert(args[i]);
        // alert(document.getElementById(args[i]).value);
    }
    var xml_request = new XMLHttpRequest();
    xml_request.open('POST', "model/send_data.php", true);

    xml_request.onload = function() 
    {
        if (xml_request.status == 200) // If the response is good (HTML code 200)
        {
            alert(this.response);
            response = JSON.parse(this.response);
            switch (funct)
            {
                case "login":
                    login(response);
                break;
                case "create_exam":
                    createExam();
                break;
                case "list_exams":
                    document.getElementById("exam_list").innerHTML += ("<li>" + "test" + "</li>");
                    listExams();
                break;
            }
        } else 
        alert("Server error!");
    }
    
    
    xml_request.send(data);
    return xml_request;
}

function createExam() {

    // var username = '<%= Session["username"] %>';
        // alert(username);
    // alert(document.getElementById("exam_id").value);
    /*
    var exam_id = document.getElementById("exam_id").value;
    var exam_name = document.getElementById("exam_name").value;

    var topic = document.getElementById("exam_name").value;
    var question_num = document.getElementById("question_num").value;
    var question_id = document.getElementById("question_id").value;
    var difficulty = document.getElementById("difficulty").value;
    */

    var response = process("create_exam", Array("message_type", "exam_id", "exam_name"));
    alert(response.exam_id);

    
}

function addQuestion()
{
    var question = "<label>Select Topic</label><br><select id=topic><option>Topic 1</option><option>Topic 2</option><option>Topic 3</option></select><br><label>Select Question</label><br><select id=question_num><option>Question 1</option><option>Question 2</option><option>Question 3</option></select><br><label>Select Difficulty:</label><br><input type=text id=difficulty readonly value='N/A'><br><label>Enter Point Value:</label><br><input type=text id=point_val value=5><br><br>";
    document.getElementById("questions").innerHTML += question;
}


function listExams()
{
    var data = new FormData();
    data.append('message_type', 'list_exams');

    var xml_request = new XMLHttpRequest();
    xml_request.open('POST', "model/send_data.php", true);

    // alert(data[message_type]);
    xml_request.onload = function() 
    {
        if (xml_request.status == 200) // If the response is good (HTML code 200)
        {
            alert("list_exams response:" + this.response);
            if (this.response)
            {
                response = JSON.parse(this.response);
                    // document.getElementById("exam_list").innerHTML += ("<li>" + "test" + "</li>");

                    for(var i = 0; i < response.length; i++) {
                        var obj = response[i];
                    
                        document.getElementById("exam_list").innerHTML += ("<li>" + obj.Name + "</li>");
                        // console.log(obj.id);
                    }
            
                    /*
                for(var prop in response) 
                {
                    if (response.hasOwnProperty(prop)) 
                        // handle prop:
                        for(var prop2 in prop) 
                        {
                            if (prop.hasOwnProperty(prop2)) 
                                for(var prop3 in prop2) 
                                {
                                    // if (prop2.hasOwnProperty(prop3)) 
                                    document.getElementById("exam_list").innerHTML += ("<li>" + prop + prop2 + prop3 + "</li>");
                                }
                        }
                }
                */
            }
        } else 
        alert("Server error!");
    }
    xml_request.send(data);
}