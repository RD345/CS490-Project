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

$data = array();
// Add data to the request:
foreach($_POST as $key => $value)
    $data[$key] = $value;

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


// Process response:
$response = sendRequest($data, $middle_url);
echo $response; // Echo the response back
?>