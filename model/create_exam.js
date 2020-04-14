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
            // alert("list_exams response:" + this.response);
            if (this.response)
            {
                question_list = JSON.parse(this.response); // array of all questions
                var topics = [];
                
                function findTopic(find) {return topics == find;}
                // Get topics:
                for(var i = 0; i < question_list.length; i++) 
                    if(!topics.find(findTopic))
                        topics.push(question_list[i].Topic);
                
                var questions = document.getElementById("questions"); // Gets the form.

                // Create a question div:
                var question = document.createElement("div");
                question.className = "question-div";
        
                // Create the button
                var button = document.createElement("button");
                var add_question = ""; // TODO Delete

                // Create the label:
                var label = document.createElement("label");
                label.innerHTML = "Select Topic";
                question.appendChild(label);
                question.appendChild(document.createElement("br"));

                // Create the question selecter:
                var select = document.createElement("select");
                select.id = "topic";
                for(var i = 0; i < topics.length; i++) 
                {
                    // Add the current topic as an option:
                    var option = document.createElement("option");
                    option.innerHTML = topics[i]
                    select.appendChild(option);
                    select.appendChild(document.createElement("br"));
                }
                question.appendChild(select); // Adds the select to the question.
                question.appendChild(document.createElement("br"));

                // Create the label:
                var label = document.createElement("label");
                label.innerHTML = "Select Question";
                question.appendChild(label);

                // Add questions to drop-down:
                var question_select = document.createElement("select");
                question_select.id = "question_num";
                question_select.onchange = 'changeQuestion()';
                question.appendChild(document.createElement("br"));

                // Add the questions as options:
                for(var i = 0; i < question_list.length; i++) 
                {
                    var question_option = document.createElement("option");
                    question_option.innerText = question_list[i].QuestionID;
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
                description.innerText = question_list[0].Description
                question.appendChild(description);
                question.appendChild(document.createElement("br"));

                questions.appendChild(question);
                // for(var i = 0; i < question_list.length; i++) 
                //     var question = question_list[i];

            }
        } else 
        alert("Server error!");
    }
    xml_request.send(data); // Sends the request for the questions.
}

function changeQuestion()
{

}

function createExam() 
{

    var username = document.getElementById("username_display").value;
    var exam_id = document.getElementById("exam_id").value;
    var exam_name = document.getElementById("exam_name").value;
    var topic = document.getElementById("exam_name").value;
    var question_num = document.getElementById("question_num").value;
    var question_id = document.getElementById("question_id").value;
    var difficulty = document.getElementById("difficulty").value;

    var response = process("create_exam", Array("message_type", "exam_id", "exam_name"));
    alert(response.exam_id);
}