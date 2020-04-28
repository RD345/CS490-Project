// Review_Exam Feiyang Wang & Ryan Doherty

function listExamsToReview() 
{
  var data = new FormData();
  data.append("message_type", "list_exams");
  var xml_request = createXMLRequest(data);

  xml_request.onload = function() {
    if (xml_request.status == 200) // If the response is good (HTML code 200)
    {
      if (this.response) 
      {
        response = JSON.parse(this.response);

        for (var i = 0; i < response.length; i++) 
        {
          var obj = response[i];

          // if(listStudentWhoTookExam(obj.examID))
          // { 
            document.getElementById("results").innerHTML += "<li>" + obj.examName + "</li>";
            document.getElementById("results").innerHTML += "<button type='button' value='" +
              obj.examName +"' onclick='listStudentWhoTookExam(" +
              obj.examID + ")'>View Submissions</button>";
          // }
        }
      }
    } else alert("Server error!");
  };
  xml_request.send(data);
}

function listStudentWhoTookExam(exam_id) 
{
  var data = new FormData();
  data.append("message_type", "list_students_that_took_exam");
  data.append("examID", exam_id);
  var xml_request = createXMLRequest(data);

  xml_request.onload = function() 
  {
    if (xml_request.status == 200) // If the response is good (HTML code 200):
    {
      if (this.response) 
      {
        response1 = JSON.parse(this.response);
        if (response1.message_type === "error") 
        {
          alert("No submissions");
          return false;
        } 
        else 
        {
          document.getElementById("results").innerHTML = "";
          document.getElementById("h2Title").innerHTML =
            "Select the student who take this exam for review: ";
          document.getElementById("h4Title").innerHTML =
            "Submissions: ";
          for (var i = 0; i < response1.length; i++) {
            var obj = response1[i];
            document.getElementById("results").innerHTML +=
              "<li>" + obj.username + "</li>";
            document.getElementById("results").innerHTML +=
              '<button type="button" value="' +
              obj.username +
              '" onclick="reviewExam(\'' +
              obj.username +
              "', " +
              exam_id +
              ')">Review Exam</button>';
          }
        }
      }
    } else alert("Server error!");
  };
  xml_request.send(data);
}

var totalScore = 0;
var grade = [];

function reviewExam(studentUsername, exam_id) 
{ // Build the dataset:
  var data = new FormData();
  data.append("message_type", "view_results_teacher");
  data.append("username", studentUsername);
  data.append("examID", exam_id);

  var xml_request = createXMLRequest(data);
  xml_request.onload = function() {
    if (xml_request.status == 200) {
      // If the response is good (HTML code 200)
      if (this.response) {
        response = JSON.parse(this.response);

        //document.getElementById("h2Title").innerHTML = "Review Exam:";
        document.getElementById("h4Title").innerHTML = "";

        if (response.message_type === "error") {
          alert("No result!");
        } 
        else 
        {
          totalScore = 0;
          document.getElementById("results").innerHTML = "";

          for (var i = 0; i < response.length; i++) 
            loadQuestionAnswer(response[i], studentUsername, exam_id, i + 1);
          
          document.getElementById("h2Title").innerHTML =
            "Exam Total Score: " + totalScore + "%";
        }
      }
    } else alert("Server error!");
  };

  xml_request.send(data);
}

// Load a question:
function loadQuestionAnswer(question, studentUsername, exam_id, question_id) 
{
  var page = document.getElementById("question_list");
  exam_question = document.createElement("div");
  exam_question.className = "exam_question";
  exam_question.id = question.questionID;
  question_id = question.questionID;

  // Decription:
  p = document.createElement("p");
  p.innerHTML = "Question: " + question.description;
  exam_question.appendChild(p);

  // Student answer:
  p = document.createElement("p");
  p.innerHTML = "Student Answer: ";
  exam_question.appendChild(p);

  var p = document.createElement("textarea");
  p.readOnly = true;
  p.innerHTML = question.studentAnswer;
  exam_question.appendChild(p);

  grade.push(question.grade);
  // Result for test case and constraints
  // console.log(question.grade);
  tcGrade = JSON.parse(question.grade);
  console.log(tcGrade);
  tcTable = document.createElement("TABLE");
  tcTable.setAttribute("id", "test_case_table");

  // Create an empty <tr> element and add it to the 1st position of the table:
  var row = tcTable.insertRow(0);

  // Insert new cells (<td> elements) at the 1st and 2nd position of the "new" <tr> element:
  var cell1 = row.insertCell(0);
  var cell2 = row.insertCell(1);
  var cell3 = row.insertCell(2);
  var cell4 = row.insertCell(3);
  var cell5 = row.insertCell(4);
  var cell6 = row.insertCell(5);
  var cell7 = row.insertCell(6);
  // Add some text to the new cells:
  cell1.innerHTML = "TestCase";
  cell2.innerHTML = "CorrectOutput";
  cell3.innerHTML = "CorrectName";
  cell4.innerHTML = "HadColon";
  cell5.innerHTML = "HadConstraint";
  cell6.innerHTML = "Points Received";
  cell7.innerHTML = "Out of";

  var i = 0;
  for (var test_case in tcGrade) 
  {
    p = document.createElement("p");
    var result = tcGrade[test_case];
    if (test_case === "totalPoints")
    {
      // TODO add the total
      break;
    }
      
    row = tcTable.insertRow(++i);
    cell1 = row.insertCell(0);
    cell2 = row.insertCell(1);
    cell3 = row.insertCell(2);
    cell4 = row.insertCell(3);
    cell5 = row.insertCell(4);
    cell6 = row.insertCell(5);
    cell7 = row.insertCell(6);

    cell1.innerHTML = test_case;
    cell2.innerHTML = result.correctOutput === "true" ? "Pass " : "Fail ";
    cell3.innerHTML = result.correctName === "true" ? "Pass " : "Fail ";
    cell4.innerHTML = result.hadColon === "true" ? "Pass " : "Fail ";
    cell5.innerHTML = result.hadConstraint === "true" ? "Pass " : "Fail ";

    score = document.createElement("input");
    // score.maxLength = 5;
    score.className = "question_score";
    score.value = result.points;
    cell6.appendChild(score);

    p_total = document.createElement("input");
    p_total.readOnly = true;
    p_total.className = "total_points";
    p_total.value = result.totalPoints;
    cell7.appendChild(p_total);

    totalScore += result.points;
    totalScore = Math.round((totalScore + Number.EPSILON) * 1);
    if (totalScore > 100)
      totalScore = 100;

    console.log(result.points + " : " + totalScore);
  }
  exam_question.appendChild(tcTable);

  // Teacher Comment:
  console.log(question.comments);
  p = document.createElement("p");
  p.innerHTML = "Please leave your comment here: ";
  exam_question.appendChild(p);
  var teacher_comment = document.createElement("textarea");
  teacher_comment.placeholder = question.comments;
  teacher_comment.className = "comment";
  teacher_comment.onkeydown = function(e) 
  {
      if (e.keyCode === 9) // tab was pressed
      {
          var val = this.value; // get caret position/selection
          this.value = val.substring(0, this.selectionStart) + '\t' + val.substring(this.selectionEnd); // Sets textarea value to: text before caret + tab + text after caret
          this.selectionStart = this.selectionEnd = this.selectionStart + 1;  // Puts caret back to the right.
          return false; // Prevents focus loss.
      }
  };

  exam_question.appendChild(teacher_comment);

  p = document.createElement("p");
  p.innerHTML = "Submit:";
  exam_question.appendChild(p);
  var submit_button = document.createElement("BUTTON");
  submit_button.innerHTML = "Update Current Quetison: ";

  submit_button.onclick = function() 
  {
    submitReviewQuestion(studentUsername, exam_id, question_id, tcGrade);
  };
  console.log(tcGrade);
  exam_question.appendChild(submit_button);
  page.appendChild(exam_question);
}

function submitReviewQuestion(studentUsername, exam_id, question_id, tcGrade) 
{ //Build the dataset:
  var data = new FormData();
  data.append("message_type", "teacher_override");
  data.append("examID", exam_id);
  data.append("questionID", question_id);
  data.append("username", studentUsername);

  var curr_question = document.getElementById(question_id);
  var j = 0;
  // alert("RIght here" + tcGrade);
  console.log(tcGrade);
  for (var test_case in tcGrade) 
  {
    // var pointz = curr_question.getElementsByClassName("question_score");
    console.log("curr j:", j);

    tcGrade[test_case].points = curr_question.getElementsByClassName("question_score")[j];
    tcGrade[test_case].totalPoints = curr_question.getElementsByClassName("total_points")[j];
    j++;
  }
  data.append("grade", JSON.stringify(tcGrade));
  data.append("comments", curr_question.getElementsByClassName("comment")[0].value);

  for (var pair of data.entries()) 
    console.log(pair[0] + ", " + pair[1]);
  

  var xml_request = createXMLRequest(data);
  xml_request.onload = function() 
  {
    if (xml_request.status == 200) 
    {
      res = JSON.parse(this.response);
      res.message_type === "success" ? alert("Submitted") : alert("Submission failed");
    } 
      else alert("Server error!");
  };
  xml_request.send(data);
}
