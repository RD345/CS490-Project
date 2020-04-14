// Scripts for taking exams.

// Function to begin an exam.
function takeExam(exam_id) 
{   
    var data = new FormData();
    data.append('message_type', 'list_exams');
    var xml_request = createXMLRequest(data);
    alert("You are now taking the exam");

    xml_request.onload = function() 
    {
        if (xml_request.status == 200) // If the response is good (HTML code 200)
        {
            debug(this.response);
            document.getElementById("exam_list").innerHTML = "";
            if (this.response)
            {
                response = JSON.parse(this.response);

                for(var i = 0; i < response.length; i++) 
                {
                    var obj = response[i];
                    if(role == 'student')
                        document.getElementById("exam_list").innerHTML += ("<li>" + "<a onclick=takeExam(" + obj.ExamID + ") href='exam.html'>" + obj.Name + "</a>" + "</li>");
                    else
                        document.getElementById("exam_list").innerHTML += ("<li>" + obj.Name + "</li>");
                }
            }
        } else 
        alert("Server error!");
    }
    xml_request.send(data);
}

function buildExam()
{
    
}