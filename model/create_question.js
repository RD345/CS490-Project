// Scripts for creating questions.
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
    var input_name = document.createElement("h4");
    input_name.innerHTML = "Test Case " + parseInt(case_num++) + ':';

    // Create a label for 'Number of Inputs':
    var label = document.createElement("label");
    label.textContent = "Number of Inputs:";
    label.id = 'input_label';

    // Create an input for the number of inputs for the test case:
    var input = document.createElement("input");
    input.type = 'number';
    input.id = 'input_num';
    input.value = 2;
    input.required = true;
    
    var button = document.createElement("button");

    button.onclick = function() {addTestCase2()};
    button.type = 'button';
    button.id = 'arg_btn';
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
    var test_case = document.createElement("div");
    test_case.className = "test_case";

    // Remove the buttons from the previous test case, if applicable:
    document.getElementById("arg_btn").remove();
    document.getElementById("input_num").remove();
    document.getElementById("input_label").remove();
    
    for(i = 1; i <= inputs; i++)
    {
        // Create a new input:
        var input = document.createElement("input");
        input.id = 'arg' + case_num + '-' + i;
        input.name = 'args';
        input.className = 'args';
        input.required = true;

        // Label the input:
        var label = document.createElement("label");
        label.textContent = String("Input " + i);

        // Apend the label and input to the form:
        test_case.appendChild(label);
        test_case.appendChild(document.createElement("br"));
        test_case.appendChild(input); 
        test_case.appendChild(document.createElement("br"));
    }
    // Create the label for the expected output:
    var label = document.createElement("label");
    label.textContent = 'Expected output';

    // 
    var output = document.createElement("input");
    output.required = true;
    output.name = 'output';
    output.id = 'output' + case_num; // TODO add counter
    output.className = 'output';
    output.name = 'output';
    test_case.appendChild(label);
    test_case.appendChild(document.createElement("br"));
    test_case.appendChild(output);
    question.appendChild(test_case);
}

// Submit a new question to the database:
// "add_question" - takes ($questionID, $questionName, $questionLevel, $questionDescription,$testcase1,$testcase2,$testcase1Answer,$testcase2Answer,$keyword)
// {This will add a question to the question bank}
function createQuestion() {
    // TODO Build the data set:
    var data = new FormData();
    data.append('message_type', 'create_question');
    data.append('questionTopic', document.getElementById("topic").value);
    data.append('questionDescription', document.getElementById("description").value);
    data.append('questionLevel', document.getElementById("difficulty").value);
    data.append('testcaseNum', document.getElementById("case_num").value);

    var testCasesInputs = "";
    var testCasesOutputs = "";
    form = Array.from(document.forms["question"].getElementsByTagName("input")); // Gets the questions
    form.forEach(addArgs);
    
    
    function addArgs(item)
    {
        if (item.name == "args")
            testCasesInputs += item.value + ',';
        else if (item.name == "output")
            testCasesOutputs += item.value + ',';
    }
    testCasesInputs = testCasesInputs.slice(0, testCasesInputs.length-1); // Removes last comma
    testCasesOutputs = testCasesOutputs.slice(0, testCasesOutputs.length-1); // Removes last comma
    data.append("testCasesInputs", testCasesInputs);
    data.append("testCasesOutputs", testCasesOutputs);

    var xml_request = createXMLRequest(data);

    xml_request.onload = function() 
    {
        if (xml_request.status == 200) // If the response is good (HTML code 200)
        {
            res = JSON.parse(this.response)
            if (res.message_type == "New question created successfully")
                alert("Question Created.");
            else
                alert("Question Creation failed, please check your input and try again.");
        } else 
        alert("Server error!");
    }
    xml_request.send(data);
}
    