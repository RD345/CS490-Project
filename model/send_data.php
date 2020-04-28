<?php
/*This is for sending and recieveing requests through the network.*/
require_once 'header.php';

$middle_url = "https://web.njit.edu/~mjs239/CS490/rc/newMiddle.php";
$data = array();

// Add data to the request:
if (isset($_POST["message_type"]))
switch ($_POST["message_type"]) 
{
    case "get_username": // Send back username -- no need to pass along the request:
        echo json_encode(array('username' => $_SESSION['username'])); 
        return;
    break;
    case "logout":
        logout();
        return;
    break;
    case "goto_exam":
        $_SESSION['current_exam'] = $_POST["examID"];
        return;
    break;
    case "take_exam":
        foreach($_POST as $key => $value)
            $data[$key] = $value;
        $data = array_merge($data, array('examID' => $_SESSION['current_exam']));
    break;
    case "add_student_answer":
        foreach($_POST as $key => $value)
            $data[$key] = $value;
        $data = array_merge($data, array('examID' => $_SESSION['current_exam']));
    break;
    default: // Default handler, add the post variables to the request:
        foreach($_POST as $key => $value)
            $data[$key] = $value;
    break;
}

// Sends the login request:
function sendRequest($data, $url)
{
    $curl = curl_init(); // Create the curl object
    curl_setopt($curl, CURLOPT_POSTFIELDS, $data);
    curl_setopt($curl, CURLOPT_URL, $url);
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
    $res = curl_exec($curl); // Recieve the JSON response
    curl_close ($curl); // Close the connection
    
    
    // Write to the log:
    $log = fopen("log.txt", "a") or die("Unable to open Log File");
    fwrite($log, "\n\n".PHP_EOL);
    fwrite($log,$res.PHP_EOL);
    fclose($log);

    // Echos the response back if present, and no_repsone if not:
    if ($res != null)
        echo $res; 
    else
        echo json_encode(array('message_type' => 'no_response'));
}
// If there is data to send, add the username and send it:
if ($data != null)
{
    if (!isset($data['username']))
        $data = array_merge($data, array('username' => $_SESSION['username'])); // Adds username
    sendRequest($data, $middle_url);
}
?>