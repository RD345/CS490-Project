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


function createExam() 
{   // TODO Build the data set:
    var data = new FormData();
    data.append('message_type', 'create_exam');
    data.append('examName', document.getElementById("exam_name").value);

    var questionAndPoints = [];
    form = Array.from(document.forms["questions"].getElementsByClassName("question-div")); // Gets the questions
    form.forEach(addQuestion);
    
    
    function addQuestion(questionDiv)
    {
        var points = questionDiv.childNodes[5].childNodes[1].value;
     
        questionAndPoints.push(("questionID", questionDiv.id), ("points", points));
        // questionAndPoints.push({});
    }
    data.append("examQuestionsAndPoints", questionAndPoints);

    // Create and handle xml request:
    var xml_request = createXMLRequest(data);
    xml_request.onload = function() 
    {
        if (xml_request.status == 200) // If the response is good (HTML code 200)
        {
            res = JSON.parse(this.response)
            if (res.message_type == "success")
                alert("Question Created.");
            else
                alert("Question Creation failed, please check your input and try again.");
        } else 
        alert("Server error!");
    }
    xml_request.send(data);
}


function calculatePoints()
{
    point_count = document.getElementById("point_count"); 
    var num = 0; 
    exam = document.getElementById("questions"); // Gets the exam.
    points_list = exam.getElementsByClassName("points");

    for (var i = 0; i < points_list.length; i++)
        num += parseInt(points_list[i].value);
    
    point_count.value = num;

}