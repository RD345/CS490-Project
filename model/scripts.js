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
            // debug(this.response);
            var exam_list = document.getElementById("exam_list");

            if (this.response)
            {
                response = JSON.parse(this.response);

                for(var i = 0; i < response.length; i++) 
                {
                    var obj = response[i];
                    var list = document.createElement("li")
                    
                    if(role == 'student')
                    {
                        link = document.createElement("a");
                        link.href = "exam.html";
                        link.onclick = takeExam(obj.examID);
                        link.innerHTML = obj.examName;
                        list.appendChild(link);

                        // list.innerHTML += ("<li>" + "<a onclick=takeExam(" + obj.examID + ") href='exam.html'>" +  + "</a>" + "</li>");

                        exam_list.appendChild(list);
                    }
                    else
                    {
                        list.innerHTML = obj.examName;
                        exam_list.appendChild(list);
                    }
                        
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
            // debug(this.response);
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

                // Get topics and update filter:
                function findTopic(find) {return topics == find};
                for(var i = 0; i < question_list.length; i++) 
                    if(!topics.find(findTopic))
                        topics.push(question_list[i].topic);

                if (topic.childElementCount < topics.length + 1)
                    topics.forEach(addTopic);
                function addTopic(item)
                {
                    option = document.createElement("option");
                    option.innerHTML = item;
                    topic.appendChild(option);
                }

                // Get difficulties and update filter:
                function findDiff(find) {return levels == find};
                for(var i = 0; i < question_list.length; i++) 
                    if(!levels.find(findDiff))
                        levels.push(question_list[i].level);

                if (difficulty.childElementCount < levels.length + 1)
                    levels.forEach(addLevels);
                function addLevels(item)
                {
                    option = document.createElement("option");
                    option.innerHTML = item;
                    difficulty.appendChild(option);
                }

                // Get Constraints and update filter:
                function findCons(find) {return cons == find};
                for(var i = 0; i < question_list.length; i++) 
                    if(!cons.find(findCons))
                        cons.push(question_list[i].questionConstraint);

                if (constraint.childElementCount < cons.length + 1)
                    cons.forEach(addCons);
                function addCons(item)
                {
                    option = document.createElement("option");
                    option.innerHTML = item;
                    constraint.appendChild(option);
                }

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
                    if (keyword && item.description.search(keyword) == -1) 
                        return;


                    // Create a question div:
                    var question = document.createElement("div");
                    question.className = "question-div";
                    question.draggable = true;
                    question.id = item.questionID;
                    question.ondragstart = drag;

                    // QuestionID:
                    var spn = document.createElement("span");
                    spn.innerHTML = "ID: <strong>" + item.questionID + "</strong> ";
                    question.appendChild(spn);

                    // Topic:
                    var spn = document.createElement("span");
                    spn.innerHTML = "Topic: <strong>" + item.topic + "</strong> ";
                    question.appendChild(spn);

                    // Difficulty:
                    var spn = document.createElement("span");
                    spn.innerHTML = "Difficulty: <strong>" + item.level + "</strong> ";
                    question.appendChild(spn);

                    // Contraint:
                    var spn = document.createElement("span");
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
                        var points = document.createElement("input");
                        points.setAttribute("type", "number");
                        points.className = "points"
                        points.onchange = calculatePoints;
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
