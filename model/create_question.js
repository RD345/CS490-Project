function addTestCase()
{
    if (document.getElementById('input_num') != null)
    {
        alert("Please fill out the current test case before adding another!");
        return;
    }
    document.getElementById('case_num').innerHTML += 1; // Increments the test case number.
    var case_num = parseInt(document.getElementById('case_num').value) + 1; // Sets the variable for test case number.
    document.getElementById('case_num').value = case_num; // Updates the display.

    var question = document.getElementById("question");
    var input_name = document.createElement("h4")
    input_name.innerHTML = "Test Case " + parseInt(case_num++) + ':';

    var label = document.createElement("label")
    label.textContent = "Number of Inputs:"
    label.id = 'input_label';

    var input = document.createElement("input");
    input.type = 'number';
    input.id = 'input_num';
    input.value = 2;
    input.required = true;
    
    var button = document.createElement("button");

    button.onclick = function() {addTestCase2()};
    button.type = 'button';
    button.id = 'arg_btn'
    button.innerHTML = 'Go';

    question.appendChild(input_name);
    question.appendChild(label); 
    question.appendChild(document.createElement("br"));
    question.appendChild(input); 
    question.appendChild(button);
    question.appendChild(document.createElement("br"));
}

// Add the test case input based off of the requested number of args:
function addTestCase2()
{
    var question = document.getElementById("question");
    var inputs = document.getElementById("input_num").value;
    var case_num = document.getElementById('case_num').value; // Sets the variable for test case number.

    // Remove the buttons from the previous test case, if applicable:
    document.getElementById("arg_btn").remove();
    document.getElementById("input_num").remove();
    document.getElementById("input_label").remove();
    
    for(i = 1; i <= inputs; i++)
    {
        // Create a new input:
        var input = document.createElement("input");
        input.id = 'arg' + case_num + '-' + i;
        input.name = 'args'
        input.required = true;

        // Label the input:
        var label = document.createElement("label")
        label.textContent = String("Input " + i);

        // Apend the label and input to the form:
        question.appendChild(label);
        question.appendChild(document.createElement("br"));
        question.appendChild(input); 
        question.appendChild(document.createElement("br"));
    }
    // Create the label for the expected output:
    var label = document.createElement("label")
    label.textContent = 'Expected output';

    // 
    var output = document.createElement("input");
    output.required = true;
    output.name = 'output'
    output.id = 'output' + case_num; // TODO add counter
    output.name = 'output'
    question.appendChild(label);
    question.appendChild(document.createElement("br"));
    question.appendChild(output);
}

// Submit a new question to the database:
// "add_question" - takes ($questionID, $questionName, $questionLevel, $questionDescription,$testcase1,$testcase2,$testcase1Answer,$testcase2Answer,$keyword)
// {This will add a question to the question bank}
function createQuestion() {
    // TODO Build the data set:
    var data = new FormData();
    data.append('message_type', 'add_question');
    // data.append('username', document.getElementById("username_display").value);
    data.append('topic', document.getElementById("topic").value);
    data.append('questionDescription', document.getElementById("description").value);
    data.append('questionLevel', document.getElementById("difficulty").value);
    data.append('testcaseNum', document.getElementById("case_num").value);

    // var testcases_amount = document.getElementById('case_num').value;
    // var testcases = new Array(testcases_amount); // Holds each test case.
    // for (i = 0; i < testcases_amount; i++)
    // {
    //     testcases[i] = new Array();
    // }
    
    form = Array.from(document.forms["question"].getElementsByTagName("input"));
    form.forEach(addArgs);
    
    var html_args = Array();
    
    
    function addArgs(item)
    {
        // data.append(item.name + ',' + item.id, testcases);
        if (item.name == 'args' || item.name == 'output')
        {
            data.append(item.id, item.value);
            // str = String(item.id).slice(3); // Removes the 'arg' from the beginning of the id.
            // var parsed_name = str.split('-'); // Splits parsed_name into 2 integers, one for the test case num and the other for the input num
        //     // alert(parsed_name);
        //     var testcase_num = parsed_name[0];
        //     var input_num = parsed_name[1];
        //     // if (testcases[testcase_num] == null)
        //     // {
        //         // testcases[testcase_num] = new Array();
        //     testcases[testcase_num - 1] += item.value + ', ';
        //     // }
        //     // testcases[testcase_num][input_num] = item.value;
        }
        
        // if (item.name == 'output')
        //     html_args.push(item);
    }
    var xml_request = createXMLRequest(data);

    // alert(data); // Debug

    xml_request.onload = function() 
    {
        if (xml_request.status == 200) // If the response is good (HTML code 200)
        {
            alert(JSON.parse(this.response)); // Debug
            alert("Question Created.");
        } else 
        alert("Server error!");
    }
    xml_request.send(data);
}
    