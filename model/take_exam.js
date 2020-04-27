// Scripts for taking exams.

// Function to begin an exam.
function takeExam() 
{   
    var data = new FormData();
    data.append('message_type', 'take_exam');
    // data.append("examID", exam_id);
    var xml_request = createXMLRequest(data);
    alert("You are now taking the exam");

    xml_request.onload = function() 
    {
        if (xml_request.status == 200) // If the response is good (HTML code 200)
        {
            // debug(this.response);
            // document.getElementById("exam_list").innerHTML = "";
            if (this.response)
            {
                response = JSON.parse(this.response);
                document.getElementsByTagName("h2")[0].innerHTML = "Exam " + response[0].examID;
                for(var i = 0; i < response.length; i++) 
                {
                    loadQuestion(response[i]);
                }
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
    // alert("You are now taking the exam");

    xml_request.onload = function() 
    {
        if (xml_request.status == 200) // If the response is good (HTML code 200)
        {
            // debug(this.response);
            // document.getElementById("exam_list").innerHTML = "";
            if (this.response)
            {
                response = JSON.parse(this.response);
                for(var i = 0; i < response.length; i++) 
                {
                    loadQuestion(response[i]);
                }
            }
        } else 
            alert("Server error!");
    }
    xml_request.send(data);
}

// Load a question:
function loadQuestion(question)
{
    var page = document.getElementById("question_list");
    // examID, points, description, student_answer
    exam_question = document.createElement("div");
    exam_question.className = "exam_question";

    // Create a label for 'Question':
    var p = document.createElement("p");
    p.textContent = "Question: " + question.questionID + "  (" + question.points + " points)";
    p.id = 'input_label';
    exam_question.appendChild(p);
    // exam_question.appendChild(document.createElement("br"));

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
    student_answer.onkeydown = function(e) {
        if (e.keyCode === 9) { // tab was pressed

            // get caret position/selection
            var val = this.value;
 
            // set textarea value to: text before caret + tab + text after caret
            this.value = val.substring(0, this.selectionStart) + '\t' + val.substring(this.selectionEnd);

            // put caret at right position again
            this.selectionStart = this.selectionEnd = this.selectionStart + 1;

            // prevent the focus lose
            return false;

        }
    };
    exam_question.appendChild(student_answer);

    page.appendChild(exam_question);
}

function getExams(role)
{
    var data = new FormData();
    data.append('message_type', 'list_exams');
    var xml_request = createXMLRequest(data);

    xml_request.onload = function() 
    {
        if (xml_request.status == 200) // If the response is good (HTML code 200)
        {
            // debug(this.response);
            document.getElementById("exam_list").innerHTML = "";
            if (this.response)
            {
                response = JSON.parse(this.response);

                for(var i = 0; i < response.length; i++) 
                {
                    document.getElementById("exam_list").innerHTML += ("<li>" + "<a onclick=gotoExam(" + response[i].examID + ") href='exam.html'>" + response[i].examName + "</a>" + "</li>");
                }
            }
        } else 
        alert("Server error!");
    }
    xml_request.send(data);
}

function submitExam()
{
    var question_num = 1;
    exam = Array.from(document.forms["exam"].getElementsByClassName("exam_question")); // Gets the questions
    exam.forEach(submitQuestion);
    
    
    function submitQuestion(item)
    {
        var data = new FormData();
        data.append('message_type', 'add_student_answer');
        data.append('questionID', item.getElementsByClassName("question_id")[0].value); 
        data.append('studentAnswer', item.getElementsByClassName("answer")[0].value);    
        data.append('question_num', question_num);          


        xml_request = createXMLRequest(data);
        xml_request.onload = function() 
        {
            if (xml_request.status == 200) // If the response is good (HTML code 200)
            {
                res = JSON.parse(this.response)
                if (res.message_type == "New question created successfully")
                    alert("Exam Submitted.");
                else
                    alert("Submission Failed!");
            } else 
                alert("Server error!");
        }
        xml_request.send(data);
    }
    // location.href = 'student_home.html';
}

function enableTab() {
    var el = document.getElementsByClassName('answer');
    el.onkeydown = function(e) {
        if (e.keyCode === 9) { // tab was pressed

            // get caret position/selection
            var val = this.value,
                start = this.selectionStart,
                end = this.selectionEnd;

            // set textarea value to: text before caret + tab + text after caret
            this.value = val.substring(0, start) + '\t' + val.substring(end);

            // put caret at right position again
            this.selectionStart = this.selectionEnd = start + 1;

            // prevent the focus lose
            return false;

        }
    };
}

// Enable the tab character onkeypress (onkeydown) inside textarea...
// ... for a textarea that has an `id="my-textarea"`
enableTab('answer'); 
