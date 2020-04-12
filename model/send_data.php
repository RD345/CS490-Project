<?php
/*This is for sending and recieveing requests through the network.*/
require_once 'header.php';

$back_url = "https://web.njit.edu/~fw73/backend.php"; // url for backend server.
$middle_url = "https://web.njit.edu/~mjs239/CS490/beta/middle.php"; // url for middle server.
$middle_url = "https://web.njit.edu/~mjs239/CS490/rc/middle.php"; // url for middle server.

 
$data = array();
$data2 = array();
// Add data to the request:
switch ($_POST["message_type"]) 
{
    case "get_username":
        echo json_encode(array('username' => $_SESSION['username']));
        return;
    break;
    case "logout":
        logout();
    break;
    case "get_questions":
        $data = array('message_type' => 'get_questions');
    break;
    case "release_scores":
        $data = array('message_type' => 'release_scores', 'exam_name' => $_POST['exam_name']);
    break;
    default:
        foreach($_SESSION as $key => $value)
            $data2[$key] = $value;
        foreach($_POST as $key => $value)
            $data[$key] = $value;
    break;
}


// Sends the login request:
function sendRequest($data, $url)
{
    $curl = curl_init(); // Create the curl object
	//echo "encoded data:".jsonEncode($data)."\r\n"; // Debug
    curl_setopt($curl, CURLOPT_POSTFIELDS, $data);
    curl_setopt($curl, CURLOPT_URL, $url);
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
    $res = curl_exec($curl); // Recieve the JSON response
    curl_close ($curl); // Close the connection
    return $res;
}

$data = array_merge($data, $data2);
// Process response:
$response = sendRequest($data, $middle_url);
if ($response != null)
    echo $response; // Echo the response back
// else
//     $msg = "[{\"message_type\": \"fail\"}]";
//     echo json_encode($msg);
?>