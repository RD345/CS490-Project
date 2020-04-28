// Review_Exam Feiyang Wang

function listExamsToReview() {
  var data = new FormData();
  data.append("message_type", "list_exams");
  var xml_request = createXMLRequest(data);

  xml_request.onload = function() {
    if (xml_request.status == 200) {
      // If the response is good (HTML code 200)

      if (this.response) {
        response = JSON.parse(this.response);

        for (var i = 0; i < response.length; i++) {
          var obj = response[i];
          document.getElementById("exam_list").innerHTML +=
            "<li>" + obj.examName + "</li>";
          document.getElementById("exam_list").innerHTML +=
            "<button type='button' value='" +
            obj.examName +
            "' onclick='listStudentWhoTookExam(" +
            obj.examID +
            ")'>Review Exam</button>";
        }
      }
    } else alert("Server error!");
  };
  xml_request.send(data);
}

function listStudentWhoTookExam(exam_id) {
  var data = new FormData();
  data.append("message_type", "list_students_that_took_exam");
  data.append("examID", exam_id);
  var xml_request = createXMLRequest(data);

  xml_request.onload = function() {
    if (xml_request.status == 200) {
      // If the response is good (HTML code 200)
      if (this.response) {
        response = JSON.parse(this.response);
        if (response.message_type === "error") {
          alert("No student who took that exam!");
        } else {
          document.getElementById("exam_list").innerHTML = "";
          document.getElementById("h2Title").innerHTML =
            "Select the student who take this exam for review: ";
          document.getElementById("h4Title").innerHTML =
            "Student(s) Available: ";
          for (var i = 0; i < response.length; i++) {
            var obj = response[i];
            document.getElementById("exam_list").innerHTML +=
              "<li>" + obj.username + "</li>";
            document.getElementById("exam_list").innerHTML +=
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

function reviewExam(studentUsername, exam_id) {
  var data = new FormData();
  data.append("message_type", "view_results_teacher");
  data.append("username", studentUsername);
  data.append("examID", exam_id);
  //   console.log("fix!");
  //   for (var pair of data.entries()) {
  //     console.log(pair[0] + ", " + pair[1]);
  //   }
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
        } else {
          totalScore = 0;
          //   document.getElementById("h2Title").innerHTML.innerHTML =
          //     "Student's exam: ";
          document.getElementById("exam_list").innerHTML = "";

          for (var i = 0; i < response.length; i++) {
            loadQuestionAnswer(response[i], studentUsername, exam_id, i + 1);
          }
          document.getElementById("h2Title").innerHTML =
            "Exam Total Score: " + totalScore;
        }
      }
    } else alert("Server error!");
  };

  xml_request.send(data);
}

// Load a question:
function loadQuestionAnswer(question, studentUsername, exam_id, question_id) {
  var page = document.getElementById("question_list");
  // examID, points, description, student_answer
  exam_question = document.createElement("div");
  exam_question.className = "exam_question";

  // Decription:
  p = document.createElement("p");
  p.innerHTML = "Quetsion: " + question.description;
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
  console.log(question.grade);
  tcGrade = JSON.parse(question.grade);
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
  // Add some text to the new cells:
  cell1.innerHTML = "TestCase";
  cell2.innerHTML = "CorrectOutput";
  cell3.innerHTML = "CorrectName";
  cell4.innerHTML = "HadColon";
  cell5.innerHTML = "HadConstraint";
  cell6.innerHTML = "Score";

  var i = 0;
  for (var test_case in tcGrade) {
    p = document.createElement("p");
    var result = tcGrade[test_case];
    row = tcTable.insertRow(++i);
    cell1 = row.insertCell(0);
    cell2 = row.insertCell(1);
    cell3 = row.insertCell(2);
    cell4 = row.insertCell(3);
    cell5 = row.insertCell(4);
    cell6 = row.insertCell(5);

    cell1.innerHTML = test_case;
    cell2.innerHTML = result.correctOutput === "true" ? "Pass " : "Fail ";
    cell3.innerHTML = result.correctName === "true" ? "Pass " : "Fail ";
    cell4.innerHTML = result.hadColon === "true" ? "Pass " : "Fail ";
    cell5.innerHTML = result.hadConstraint === "true" ? "Pass " : "Fail ";

    score = document.createElement("textarea");
    score.maxLength = 5;
    score.className = "question_score";
    score.innerHTML = result.points;
    cell6.appendChild(score);

    totalScore += result.points;

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
  teacher_comment.onkeydown = function(e) {
    if (e.keyCode === 9) {
      // tab was pressed

      // get caret position/selection
      var val = this.value;

      // set textarea value to: text before caret + tab + text after caret
      this.value =
        val.substring(0, this.selectionStart) +
        "\t" +
        val.substring(this.selectionEnd);

      // put caret at right position again
      this.selectionStart = this.selectionEnd = this.selectionStart + 1;

      // prevent the focus lose
      return false;
    }
  };

  exam_question.appendChild(teacher_comment);

  p = document.createElement("p");
  p.innerHTML = "Submit:";
  exam_question.appendChild(p);
  var submit_button = document.createElement("BUTTON");
  submit_button.innerHTML = "Update Current Quetison: ";

  submit_button.onclick = function() {
    submitReviewQuestion(studentUsername, exam_id, question_id, tcGrade);
  };

  exam_question.appendChild(submit_button);
  page.appendChild(exam_question);
}

function submitReviewQuestion(studentUsername, exam_id, question_id, tcGrade) {
  var data = new FormData();
  data.append("message_type", "teacher_override");
  data.append("examID", exam_id);
  data.append("questionID", question_id);
  data.append("studentUsername", studentUsername);

  var curr_question = document.getElementsByClassName("exam_question")[question_id - 1];
  var j = 0;
  for (var test_case in tcGrade) {
    var curr_points = curr_question.getElementsByClassName("question_score")[j++];
    // if (typeof curr_points.value !== "number") {
    //   alert("Score should be number!");
    //   return;
    // }
    tcGrade[test_case].points = curr_points.value;
  }
  data.append("grade", JSON.stringify(tcGrade));

  data.append(
    "teacherComment",
    document.getElementsByClassName("comment")[question_id - 1].value
  );

  for (var pair of data.entries()) {
    console.log(pair[0] + ", " + pair[1]);
  }

  var xml_request = createXMLRequest(data);

  xml_request.onload = function() {
    if (xml_request.status == 200) {
      res = JSON.parse(this.response);
      if (res.message_type === "success") alert(res.message_type);
      else alert("Override Failed!");
    } else alert("Server error!");
  };
  xml_request.send(data);
}
