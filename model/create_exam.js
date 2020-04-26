// Scripts for creating exams.

function addQuestion()
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
                // debug(this.response);
                question_list = JSON.parse(this.response); // array of all questions
                var topics = [];
                var questions = document.getElementsByClassName("question_list")[0]; // Gets the first question list div.

                // Get topics:
                function findTopic(find) {return topics == find};
                for(var i = 0; i < question_list.length; i++) 
                    if(!topics.find(findTopic))
                        topics.push(question_list[i].topic);
                
               
                // Create a question div:
                var question = document.createElement("div");
                question.className = "question-div";
                question.draggable = true;
        
                // Create the label:
                var label = document.createElement("label");
                label.innerHTML = "Select Topic";
                question.appendChild(label);
                question.appendChild(document.createElement("br"));

                // Create the question selecter:
                var select = document.createElement("select");
                select.id = "topic";
                for(var i = 0; i < topics.length; i++) 
                {   // Add the current topic as an option:
                    var option = document.createElement("option");
                    option.innerHTML = topics[i]
                    select.appendChild(option);
                    select.appendChild(document.createElement("br"));
                }
                question.appendChild(select); // Adds the select to the question.
                question.appendChild(document.createElement("br"));

                // Create the 'Select Question' label:
                var label = document.createElement("label");
                label.innerHTML = "Select Question";
                question.appendChild(label);

                // Add questions to drop-down:
                var question_select = document.createElement("select");
                question_select.id = "question_num";
                question_select.onchange = function() {changeQuestion()};
                question.appendChild(document.createElement("br"));

                // Add the questions as options:
                for(var i = 0; i < question_list.length; i++) 
                {
                    var question_option = document.createElement("option");
                    question_option.innerText = question_list[i].questionID;
                    question_select.appendChild(question_option);
                }
                question.appendChild(question_select);
                question.appendChild(document.createElement("br"));

                // Create the label for the question description:
                var label = document.createElement("label");
                label.innerHTML = "Description:";
                question.appendChild(label);
                question.appendChild(document.createElement("br"));

                // Create the description textarea:
                var description = document.createElement("textarea");
                description.id = "description";
                description.readOnly = true;
                description.innerText = question_list[0].description
                question.appendChild(description);
                question.appendChild(document.createElement("br"));

                questions.appendChild(question); // Adds the question to the form.
            }
        } else 
        alert("Server error!");
    }
    xml_request.send(data); // Sends the request for the questions.
}

// Removes the current question:
function removeQuestion(src)
{}

function createExam() 
{
    var exam_id = document.getElementById("exam_id").value;
    var exam_name = document.getElementById("exam_name").value;
    var topic = document.getElementById("exam_name").value;

    var response = process("create_exam", Array("message_type", "exam_id", "exam_name"));
    alert(response.exam_id);
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
                topic = document.getElementById("topic");
                difficulty = document.getElementById("difficulty");
                keyword = document.getElementById("keyword");
                constraint = document.getElementById("constraint");

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
                    topic = document.getElementById("topic").value;
                    difficulty = document.getElementById("difficulty").value;
                    keyword = document.getElementById("keyword").value;
                    constraint = document.getElementById("constraint").value;

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


function calculatePoints()
{
    point_count = document.getElementById("point_count"); 
    var num = 0; 
    exam = document.getElementById("questions"); // Gets the exam.
    // points = 0;
    points_list = exam.getElementsByClassName("points");
    // alert(points_list[0].value);

    for (var i = 0; i < points_list.length; i++)
    {
        num += parseInt(points_list[i].value);
    }
    point_count.value = num;
    // points_list.forEach(addPoints);
    
    // function addPoints(item)
    // {
    //     alert(item);
    //     point_count += item.value;
    // }
}