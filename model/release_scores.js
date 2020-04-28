// Scripts for releasing scores.
function listExamsToRelease()
{
    var data = new FormData();
    data.append('message_type', 'list_exams');
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
                    document.getElementById("release_list").innerHTML += ("<li>" + obj.examName + "</li>");
                    document.getElementById("release_list").innerHTML += ("<button type='button' value='" + obj.examName + "' onclick='releaseScores(" + obj.examID + ")'>Release Scores</button>");
                }
            }
        } else 
            alert("Server error!");
    }
    xml_request.send(data);
}

function releaseScores(exam_id)
{
    var data = new FormData();
    data.append('message_type', 'release_scores');
    data.append('examID', exam_id)
    var xml_request = createXMLRequest(data);

    xml_request.onload = function() 
    {
        if (xml_request.status == 200) // If the response is good (HTML code 200)
        {
            if (JSON.parse(this.response).message_type = "success")
                alert("Scores released!");
            else
                alert("Release failed!");
        } else 
            alert("Server error!"); 
    }
    xml_request.send(data);
}