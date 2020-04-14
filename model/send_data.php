<?php
/*This is for sending and recieveing requests through the network.*/
require_once 'header.php';

$middle_url = "https://web.njit.edu/~mjs239/CS490/rc/newMiddle.php";
$data = array();

// Add data to the request:
switch ($_POST["message_type"]) 
{
    case "get_username": // Send back username -- no need to pass along the request:
        echo json_encode(array('username' => $_SESSION['username'])); 
        return;
    break;
    case "logout": // 
        logout();
        return;
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
    return $res;
}

// Process response:
array_merge($data, array('username' => $_SESSION['username'])); // Adds username
$response = sendRequest($data, $middle_url);
if ($response != null)
    echo $response; // Echo the response back
else
    echo json_encode(array('message_type' => 'no_response'));

?>