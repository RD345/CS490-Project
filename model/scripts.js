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
            if (response.role == "student")
                location.href = 'student/student_home.html';
            else if (response.role == "teacher")
                location.href = 'instructor/instructor_home.html';                
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
    // alert(username);
    var data = new FormData();
    data.append('message_type', 'get_username');

    var xml_request = new XMLHttpRequest();
    xml_request.open('POST', "../model/send_data.php", true);

    // alert(data[message_type]);
    xml_request.onload = function() 
    {
        if (xml_request.status == 200) // If the response is good (HTML code 200)
        {
            // alert("username:" + this.response);
            if (this.response)
            {
                username = JSON.parse(this.response).username;
                document.getElementById("username_display").innerHTML = username;
                // console.log(obj.id);
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
    var xml_request = new XMLHttpRequest();
    xml_request.open('POST', "../model/send_data.php", true);
    return xml_request;
}

function createExam() {

    var username = document.getElementById('username_display').value;
    var exam_id = document.getElementById("exam_id").value;
    var exam_name = document.getElementById("exam_name").value;
    var topic = document.getElementById("exam_name").value;
    var question_num = document.getElementById("question_num").value;
    var question_id = document.getElementById("question_id").value;
    var difficulty = document.getElementById("difficulty").value;

    var response = process("create_exam", Array("message_type", "exam_id", "exam_name"));
    alert(response.exam_id);
}

function addQuestion()
{
    var data = new FormData();
    data.append('message_type', 'get_questions');
    var xml_request = createXMLRequest(data);
   
    xml_request.onload = function() 
    {
        if (xml_request.status == 200) // If the response is good (HTML code 200)
        {
            // alert("list_exams response:" + this.response);
            if (this.response)
            {
                question_list = JSON.parse(this.response); // array of all questions
                var topics = [];
                
                function findTopic(find) {return topics == find;}
                // Get topics:
                for(var i = 0; i < question_list.length; i++) 
                {
                    if(!topics.find(findTopic))
                        topics.push(question_list[i].Topic);
                }

                // Add topics to selection:
                var add_question = "<label>Select Topic</label><br><select id=topic>"
                for(var i = 0; i < topics.length; i++) 
                    add_question += ("<option>" + topics[i] + "</option>");
                add_question += "</select><br>";

                // Add questions to drop-down:
                add_question += "<label>Select Question</label><br><select id=question_num onchange='changeQuestion()')>";
                for(var i = 0; i < question_list.length; i++) 
                {
                    var question = question_list[i];
                    add_question += ("<option>" + question.QuestionID + "</option>");

                }
                
                add_question += "</select><br><label>Difficulty:</label><br><input type=text id=difficulty readonly value='" +  question_list[0].Level + "'><br><label>Enter Point Value:</label><br><input type=text id=point_val value=5><br>";

                add_question += "<label>Description:</label><br><textarea type=text id=description readonly>" +  question_list[0].Description + "</textarea><br><br>"
                document.getElementById("questions").innerHTML += add_question;

                for(var i = 0; i < question_list.length; i++) 
                {
                    var question = question_list[i];

                }
            }
        } else 
        alert("Server error!");
    }
    xml_request.send(data);
}

function changeQuestion()
{

}


function listExams(role)
{
    var data = new FormData();
    data.append('message_type', 'list_exams');
    var xml_request = createXMLRequest(data);

    // alert(data[message_type]);
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
                    if(role == 'student')
                        document.getElementById("exam_list").innerHTML += ("<li>" + "<a onclick=takeExam(" + obj.ExamID + ")>" + obj.Name + "</a>" + "</li>");
                    else
                        document.getElementById("exam_list").innerHTML += ("<li>" + obj.Name + "</li>");
                }
            }
        } else 
        alert("Server error!");
    }
    xml_request.send(data);
}

function takeExam(exam_id) 
{
    alert("You are now taking the exam");
}


function listExamsToRelease()
{
    var data = new FormData();
    data.append('message_type', 'list_exams');
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
                    document.getElementById("exam_list").innerHTML += ("<li>" + obj.Name + "</li>");
                    document.getElementById("exam_list").innerHTML += ("<button value='" + obj.Name + "'>Release Scores</button>");
                }
            }
        } else 
            alert("Server error!");
    }
    xml_request.send(data);
}

function debug(text) {document.getElementById("debug").value = text;}

// TODO
function addTestCase()
{
    // Add cases:
    var add_case = "<label>Number of Inputs:</label><br><input type='number' id='input_num'><button onclick='addTestCase2()'>Go</button><br>"
    // add_case += "<label>Input 1</label><br><input class='input'><br>";
    
    document.getElementById("question").innerHTML += add_case; 
}

function addTestCase2()
{
    inputs = document.getElementById('input_num').value
    var add_case;
    for(i = 0; i < inputs; i++)
        add_case += "<label>Input " + (i + 1) + "</label><br><input class='input'><br>";

    add_case += "<label>Output:</label><br><input id='output'><br>"
    document.getElementById("question").innerHTML += add_case; 
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