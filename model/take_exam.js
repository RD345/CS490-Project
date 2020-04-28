// Scripts for taking exams.

// Function to begin an exam.
function takeExam() 
{   
    var data = new FormData();
    data.append('message_type', 'take_exam');
    var xml_request = createXMLRequest(data);
    alert("You are now taking the exam");

    xml_request.onload = function() 
    {
        if (xml_request.status == 200) // If the response is good (HTML code 200)
        {
            if (this.response)
            {
                response = JSON.parse(this.response);
                document.getElementsByTagName("h2")[0].innerHTML = "Exam " + response[0].examID;
                for(var i = 0; i < response.length; i++) 
                    loadQuestion(response[i], i + 1);
            }
        } else 
            alert("Server error!");
    }
    xml_request.send(data);
}

// Build the exam:
function gotoExam(examID)
{
    var data = new FormData();
    data.append('message_type', 'goto_exam');
    data.append("examID", examID);
    var xml_request = createXMLRequest(data);

    xml_request.onload = function() 
    {
        if (xml_request.status == 200) // If the response is good (HTML code 200)
        {
            if (this.response)
            {
                response = JSON.parse(this.response);
                for(var i = 0; i < response.length; i++) 
                    loadQuestion(response[i], i + 1);
            }
        } else 
            alert("Server error!");
    }
    xml_request.send(data);
}

// Load a question into the exam:
function loadQuestion(question, number)
{
    var page = document.getElementById("question_list");
    var exam_question = document.createElement("div");
    exam_question.className = "exam_question";

    // Create a label for 'Question':
    var p = document.createElement("p");
    p.innerHTML = "<h4><strong>" + number + ") </strong>  (" + question.points + " points)</h4>";
    p.id = 'input_label';
    exam_question.appendChild(p);

    var hidden = document.createElement("input");
    hidden.type = "hidden";
    hidden.value = question.questionID;
    hidden.className = "question_id";
    exam_question.appendChild(hidden);

    // Decription:
    p = document.createElement("p");
    p.innerHTML = question.description;
    exam_question.appendChild(p);

    // Student answer:
    var student_answer = document.createElement("textarea");
    student_answer.placeholder = "Answer here";
    student_answer.className = "answer";
    student_answer.onkeydown = function(e) 
    {
        if (e.keyCode === 9) // tab was pressed
        {
            var val = this.value; // get caret position/selection
            this.value = val.substring(0, this.selectionStart) + '\t' + val.substring(this.selectionEnd); // Sets textarea value to: text before caret + tab + text after caret
            this.selectionStart = this.selectionEnd = this.selectionStart + 1;  // Puts caret back to the right.
            return false; // Prevents focus loss.
        }
    };
    exam_question.appendChild(student_answer);
    page.appendChild(exam_question);
}

// Gets the exams and returns them with a link to start them:
function getExams(role)
{
    var data = new FormData();
    data.append('message_type', 'list_exams');
    var xml_request = createXMLRequest(data);

    xml_request.onload = function() 
    {
        if (xml_request.status == 200) // If the response is good (HTML code 200)
        {
            document.getElementById("exam_list").innerHTML = "";
            if (this.response)
            {
                var response = JSON.parse(this.response);
                
                for(var i = 0; i < response.length; i++) 
                {
                    var exam_box = document.createElement("span");

                    if(role == 'student')
                        exam_box.innerHTML = "<a onclick=gotoExam(" + response[i].examID + ") href='exam.html'>" + response[i].examName + "</a>"; 
                    else
                        exam_box.innerText = response[i].examName;

                    exam_list.appendChild(exam_box);
                }
            }
        } else 
            alert("Server error!");
    }
    xml_request.send(data);
}

// Submits the student answers:
function submitExam()
{
    var question_num = 1;
    exam = Array.from(document.forms["exam"].getElementsByClassName("exam_question")); // Gets the questions
    exam.forEach(submitQuestion);
    window.onbeforeunload = null; // Allows user to leave page.
    status = true;
    
    function submitQuestion(item)
    {   // Build the dataset:
        var data = new FormData();
        data.append('message_type', 'add_student_answer');
        data.append('questionID', item.getElementsByClassName("question_id")[0].value); 
        data.append('studentAnswer', item.getElementsByClassName("answer")[0].value);    

        // Create and handle the request:
        xml_request = createXMLRequest(data);
        xml_request.onload = function() 
        {
            if (xml_request.status == 200) // If the response is good (HTML code 200)
            {
                if (JSON.parse(this.response).message_type != "New question created successfully")
                    status = false;
            } else 
                alert("Server error!");
        }
        xml_request.send(data);
    }
    if(status)
        alert("Successfully submitted");
    else
        alert("Submission Failed");

    location.href = 'student_home.html';
}
