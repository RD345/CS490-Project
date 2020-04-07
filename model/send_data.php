<?php
/*This is for sending and recieveing requests through the network.*/

require('header.php');

$back_url = "https://web.njit.edu/~fw73/backend.php"; // url for backend server.
$middle_url = "https://web.njit.edu/~mjs239/CS490/beta/middle.php"; // url for middle server.
 
// Get basic session variables:
if (isset($_SESSION["username"]))
    $username = $_SESSION["username"];
if (isset($_SESSION["password"]))
    $password = $_SESSION["password"];

// Determine message type and construct response: 
switch ($_POST["message_type"]) 
{
    case "get_username":
        echo json_encode(array('username' => $username));
        return;
    break;
    case "login":
        $data = array('username' => $username, 'password' => $password, 'message_type' => $_POST['message_type']);
    break;
    case "logout":
        logout();
    break;
    case "create_exam":
        $data = array('username' => $username, 'message_type' => $_POST['message_type']);
    break;
    case "list_exams":
        $data = array('username' => $username, 'message_type' => 'list_exams');
    break;
    case "get_questions":
        $data = array('message_type' => 'get_questions');
    break;
    case "release_scores":
        $data = array('message_type' => 'release_scores', 'exam_name' => $_POST['exam_name']);
    break;
}

// Sends the login request:
function sendRequest($data, $url)
{
    $curl = curl_init(); // Create the curl object
	//echo "encoded data:".jsonEncode($data)."\r\n";
    curl_setopt($curl, CURLOPT_POSTFIELDS, $data);
    curl_setopt($curl, CURLOPT_URL, $url);
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
    $res = curl_exec($curl); // Recieve the JSON response
    curl_close ($curl); // Close the connection
    return $res;
}


// Process response:
$response = sendRequest($data, $middle_url);
echo $response; // Echo the response back
?>