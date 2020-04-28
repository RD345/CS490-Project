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
                try 
                {
                    username = JSON.parse(this.response).username;
                    document.getElementById("username_display").innerText = username;
                }
                catch (e) {location.href = "../model/logout.php";}
            }
        } else 
        alert("Server error!");
    }
    xml_request.send(data);
    return username;
}

function createXMLRequest(data, url) // Takes an array of strings in, and returns a parsed JSON
{
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
            var exam_list = document.getElementById("exam_list");

            if (this.response)
            {
                response = JSON.parse(this.response);

                for(var i = 0; i < response.length; i++) 
                {
                    var obj = response[i];
                    var exam_box = document.createElement("span");

                    if(role == 'student')
                    {
                        var link = document.createElement("a");
                        link.href = "exam.html";
                        link.onclick = "takeExam(obj.examID)";
                        link.innerHTML = obj.examName;
                        exam_box.appendChild(link); 
                    }
                    else
                        exam_box.innerText = obj.examName;

                    exam_list.appendChild(exam_box);
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


function allowDrop(ev) {ev.preventDefault();}
  
function drag(ev) {ev.dataTransfer.setData("text", ev.target.id);}

function drop(ev) 
{
    ev.preventDefault();
    
    var data = ev.dataTransfer.getData("text");
    dragged = document.getElementById(data);
    if (ev.target.className == "question_list")
        ev.target.appendChild(dragged);
}


function getQuestions(src)
{
    var data = new FormData();
    data.append('message_type', 'get_questions');

    var xml_request = createXMLRequest(data);
    xml_request.onload = function() 
    {
        if (xml_request.status == 200) // If the response is good (HTML code 200)
        {
            if (this.response)
            {                
                question_list = JSON.parse(this.response); // array of all questions
                var question_bank = document.getElementById("bank"); // Gets the form.
                question_bank.innerText = null; // Empties the current bank.
                var topics = [];
                var levels = [];
                var cons = [];

                // Get filters:
                topic = document.getElementById("filter_topic");
                difficulty = document.getElementById("filter_difficulty");
                keyword = document.getElementById("filter_keyword");
                constraint = document.getElementById("filter_constraint");


                // for(var i = 0; i < question_list.length; i++) 
                for(var i = 0; i < question_list.length; i++) 
                    topics.push(question_list[i].topic);

                topics = [...new Set(topics)]; // Removes duplicates.

                if (topic.childElementCount < topics.length + 1)
                    topics.forEach
                    (function addTopic(item)
                    {
                        option = document.createElement("option");
                        option.innerText = item;
                        topic.appendChild(option);
                    });

                // Get difficulties and update filter:
                for(var i = 0; i < question_list.length; i++) 
                    levels.push(question_list[i].level);

                levels = [...new Set(levels)]; // Removes duplicates.

                if (difficulty.childElementCount < levels.length + 1)
                    levels.forEach
                    (function (item)
                    {
                        option = document.createElement("option");
                        option.innerHTML = item;
                        difficulty.appendChild(option);
                    });

                // Get Constraints and update filter:
                for(var i = 0; i < question_list.length; i++) 
                    cons.push(question_list[i].questionConstraint);

                cons = [...new Set(cons)]; // Removes duplicates.

                if (constraint.childElementCount < cons.length + 1)
                    cons.forEach
                    (function (item)
                    {
                        option = document.createElement("option");
                        option.innerHTML = item;
                        constraint.appendChild(option);
                    });

                question_list.forEach(blockifyQuestion);
                function blockifyQuestion(item)
                {   // Check if the question matches the filters:
                    topic = document.getElementById("filter_topic").value;
                    difficulty = document.getElementById("filter_difficulty").value;
                    keyword = document.getElementById("filter_keyword").value;
                    constraint = document.getElementById("filter_constraint").value;

                    if (topic != "Any" && item.topic != topic) 
                        return;
                    if (difficulty != "Any" && item.level != difficulty) 
                        return;
                    if (constraint != "Any" && item.questionConstraint != constraint)
                        return;
                    if (keyword && item.description.search(keyword) == -1 && item.questionID.search(keyword) == -1) 
                        return;

                    // Create a question div:
                    var question = document.createElement("div");
                    question.className = "question-div";
                    question.draggable = true;
                    question.id = item.questionID;
                    question.ondragstart = drag;

                    // QuestionID:
                    var spn = document.createElement("span");
                    spn.className = "questionID";
                    spn.value = item.questionID;
                    spn.innerHTML = "ID: <strong>" + item.questionID + "</strong> ";
                    question.appendChild(spn);

                    // Topic:
                    var spn = document.createElement("span");
                    spn.className = "questionTopic";
                    spn.value = item.topic;
                    spn.innerHTML = "Topic: <strong>" + item.topic + "</strong> ";
                    question.appendChild(spn);

                    // Difficulty:
                    var spn = document.createElement("span");
                    spn.className = "questionLevel";
                    spn.value = item.level;
                    spn.innerHTML = "Difficulty: <strong>" + item.level + "</strong> ";
                    question.appendChild(spn);

                    // Contraint:
                    var spn = document.createElement("span");
                    spn.className = "questionConstraint";
                    spn.value = item.questionConstraint;
                    var cons = "None";
                    if (item.questionConstraint != 0)
                        cons = item.questionConstraint;

                    spn.innerHTML = "Constraint: <strong>" + cons + "</strong> ";
                    question.appendChild(spn);

                    // Points:
                    try
                    {
                        var spn = document.createElement("span");
                        spn.innerHTML = "Points:";
                        spn.className = "questionPoints";
                        var points = document.createElement("input");
                        points.setAttribute("type", "number");
                        points.className = "points"
                        points.onchange = calculatePoints;
                        points.required = true;
                        spn.appendChild(points);
                        question.appendChild(document.createElement("br"));
                        question.appendChild(spn);
                        question.appendChild(document.createElement("br"));
                    } catch(err){}

                    // Create the description textarea:
                    var description = document.createElement("textarea");
                    description.id = "description";
                    description.readOnly = true;
                    description.innerText = item.description
                    question.appendChild(description);
                    question.appendChild(document.createElement("br"));

                    // Add the question to the bank:
                    question_bank.appendChild(question);
                }
            }
        } else 
            alert("Server error!");
    }
    xml_request.send(data); // Sends the request for the questions.
}


var autoExpand = function (field, type) 
{   // Resize textareas:
    if (type == 'textarea')
    {   
        field.style.height = 'inherit'; // Resets field height.
        var computed = window.getComputedStyle(field); // Gets the computed styles for the element.

        // Calculate the height:
        var height = parseInt(computed.getPropertyValue('border-top-width'), 10)
            + parseInt(computed.getPropertyValue('padding-top'), 10)
            + field.scrollHeight
            + parseInt(computed.getPropertyValue('padding-bottom'), 10)
            + parseInt(computed.getPropertyValue('border-bottom-width'), 10);

        field.style.height = height + 'px';
    }
    // Resize inputs:
    else
    {   
        field.style.width = 'inherit'; // Resets field height.
        var computed = window.getComputedStyle(field); // Gets the computed styles for the element.

        // Calculate the width:
        var width = parseInt(computed.getPropertyValue('border-left-width'), 10)
            + parseInt(computed.getPropertyValue('padding-left'), 10)
            + field.value.length * 10
            + parseInt(computed.getPropertyValue('padding-right'), 10)
            + parseInt(computed.getPropertyValue('border-right-width'), 10);

        if (width > 219)
            field.style.width = width + 'px';
    }
};

document.addEventListener
(   
    'input', 
    function (event) {autoExpand(event.target, event.target.tagName.toLowerCase());}, 
    false
);

function veiwResults(examID, role)
{
    var data = new FormData();
    data.append('examID', examID);

    if(role = "student")
        data.append('message_type', 'view_results_student'); 
    else if (role = "teacher")
        data.append('message_type', 'view_results'); 

    // Create and handle the xml request:
    var xml_request = createXMLRequest(data);
    xml_request.onload = function() 
    {
        if (xml_request.status == 200) // If the response is good (HTML code 200)
        {
            if (this.response)
            {
                var total = 0.0;
                var response = JSON.parse(this.response);
                var results = document.getElementById("results");
                results.innerText = "";
                var title = document.createElement("h3");
                title.innerText = "Results for Exam " + examID;
                results.appendChild(title);

                // Score:
                var score_label = document.createElement("span");
                score_label.innerText = "Your score: ";
                score_label.id = "scorelabel"

                var score = document.createElement("input");
                score.id = "score";
                score.readOnly = true;
                score.type = "number";
                score_label.appendChild(score);

                results.appendChild(score_label);

                console.log(this.response);
               
                for (index1 = 0; index1 < response.length; index1++)
                {
                    var question_result = document.createElement("div");
                    var question_points = 0;
                    question_result.className = "question-result";
                    question_result.innerHTML += "Question <strong>" + (index1 + 1) + '</strong>:<br>';

                    if (response[index1].comments != null)
                        question_result.innerHTML += '<br><strong>Comments:</strong> ' + response[index1].comments;
                    else
                        question_result.innerHTML += '<br><strong>Comments:</strong> None';
                    question_result.innerHTML += '<br><strong>Description:</strong> ' + response[index1].description;

                    // Constraint:
                    if (response[index1].questionConstraint != null)
                        question_result.innerHTML += '<br><strong>Constraint:</strong> ' + response[index1].questionConstraint;
                    else
                        question_result.innerHTML += '<br><strong>Constraint:</strong> None';

                    // Student answer:
                    question_result.innerHTML += '<br><strong>Your Answer:</strong><br><textarea class=student_answer>' + response[index1].studentAnswer + '</textarea>';  

                    // Test Cases:                    
                    var result = JSON.parse(response[index1].grade);
                    
                    if(result.TC1Grade)
                        addCaseResults(result.TC1Grade, 1);
                    if(result.TC2Grade)
                        addCaseResults(result.TC1Grade, 2);
                    if(result.TC3Grade)
                        addCaseResults(result.TC1Grade, 3);
                    if(result.TC4Grade)
                        addCaseResults(result.TC1Grade, 4);
                    if(result.TC5Grade)
                        addCaseResults(result.TC1Grade, 5);
                    if(result.TC6Grade)
                        addCaseResults(result.TC1Grade, 6);

                    function addCaseResults(testcase, index)
                    {
                        var testcase_result = document.createElement("div");
                        testcase_result.className = "testcase_result";
                        testcase_result.innerHTML += "Test Case " + index;
                        testcase_result.innerHTML += '<br><strong>Colon Present:</strong> ' + testcase.hadColon;
                        testcase_result.innerHTML += '<br><strong>Correct Output:</strong> ' + testcase.correctOutput;
                        testcase_result.innerHTML += '<br><strong>Matched Constraint:</strong> ' + testcase.hadConstraint;
                        testcase_result.innerHTML += '<br><strong>Correct Name:</strong> ' + testcase.correctName;
                        testcase_result.innerHTML += '<br><strong>Total Points:</strong> ' + testcase.points;
                        question_points += testcase.points;
                        question_result.appendChild(testcase_result);
                        results.appendChild(question_result);
                    }
                    total += parseFloat(question_points);
                    document.getElementById("score").value = Math.round((total + Number.EPSILON) * 100) / 100;
                }   
            }
        } else 
            alert("Server error!");
    }
    xml_request.send(data);
}
