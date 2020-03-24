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
            if (response.auth_val)
                document.getElementById("gp10-val").outerHTML = "<p id=gp10-val style='color:green'><\p>"
            else
                document.getElementById("gp10-val").outerHTML = "<p id=gp10-val style='color:red'><\p>"

            document.getElementById("gp10-val").innerHTML = response.auth_val;

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

function process(funct, args=null) // Takes an array of strings in, and returns a parsed JSON
{
    var data = new FormData();
    var response;

    if(args != null)
        for (var i = 0; i < args.length; i++) {
            data.append(args[i], document.getElementById(args[i]).value);
        // alert($args[i]);
        // alert(document.getElementById($args[i]).value);
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
                    listExamsProcess();
                break;
            }
        } else 
        alert("Server error!");
    }
    
    
    
    // xml_request.onload = function() 
    // {   
    //     if (xml_request.status == 200) // If the response is good (HTML code 200)
    //         response = JSON.parse(this.response);             
    //     else 
    //         alert("Server error!");

    //     // alert(this.response); 
    // };
    xml_request.send(data);
    return response;
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
    var question = "<label>Select Topic</label><br><select id=topic><option>Topic 1</option><option>Topic 2</option><option>Topic 3</option></select><br><label>Select Question</label><br><select id=question_num><option>Question 1</option><option>Question 2</option><option>Question 3</option></select><br><label>Select Difficulty:</label><br><select id=difficulty><option>Easy</option><option>Medium</option><option>Hard</option></select><br><label>Enter Point Value:</label><br><input type=text id=point_val value=5><br><br>";
    document.getElementById("questions").innerHTML += question;
}

function listExamsProcess()
{

}
function listExams()
{
    response = process("list_exams");
    for(var prop in response) {
        if (response.hasOwnProperty(prop)) {
            // handle prop as required
            document.getElementById("exam_list").innerHTML += "<li>" + prop + "</li>";
        }
    }
        
}