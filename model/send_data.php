<?php
/*This is for sending and recieveing requests through the network.*/
require_once 'header.php';

$back_url = "https://web.njit.edu/~fw73/backend.php"; // url for backend server.
// $middle_url = "https://web.njit.edu/~mjs239/CS490/beta/middle.php"; // url for middle server.
$middle_url = "https://web.njit.edu/~mjs239/CS490/rc/middle.php"; // url for middle server.

 
$data = array();
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
    default:
        foreach($_SESSION as $key => $value)
            $data[$key] = $value;
        foreach($_POST as $key => $value)
            $data[$key] = $value;
    break;
}


// Sends the login request:
function sendRequest($data, $url)
{
    $curl = curl_init(); // Create the curl object
	// echo "encoded data:".json_encode($data)."\r\n"; // Debug
    curl_setopt($curl, CURLOPT_POSTFIELDS, $data);
    curl_setopt($curl, CURLOPT_URL, $url);
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
    $res = curl_exec($curl); // Recieve the JSON response
    curl_close ($curl); // Close the connection
    return $res;
}
// echo json_encode($data); 

// $data = array_merge($data, $data2);
// Process response:
$response = sendRequest($data, $middle_url);
// $response = array_merge($data, array('username' => $_SESSION['username']));
if ($response != null)
    echo $response; // Echo the response back
else
    echo json_encode(array('username' => $_SESSION['username']));

// echo json_encode(array('fail' => 'fail'));
?>