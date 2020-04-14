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