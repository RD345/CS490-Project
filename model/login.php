<?php
// require_once ('header.php');
session_start(); // Starts or maintains the session

// Define variables and initialize with empty values
$vars = [];
array_push($vars, $_POST["username"]); // username
array_push($vars, $_POST["password"]); // password


// Sends the login request:
function sendRequest($username, $password)
{
	$data = array('message_type' => 'login_request','username' => $_POST['username'], 'password' => $_POST['password']);

	$url = "https://web.njit.edu/~mjs239/CS490/rc/middle.php"; // url for middle server.
    $curl = curl_init(); // Create the curl object
    curl_setopt($curl, CURLOPT_POSTFIELDS, $data);
    curl_setopt($curl, CURLOPT_URL, $url);
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
    $res = curl_exec($curl); // Recieve the JSON response from the middle
    curl_close ($curl); // Close the connection
    return $res;
}


// Process response:
$response = sendRequest($vars[0], $vars[1]); // username, password
$response = json_decode($response);

if (!isset($_SESSION))
	session_start();

$_SESSION["username"] = $_POST["username"];
$_SESSION["role"] = $response->role;
$_SESSION["logged_in"] = true;

echo json_encode($response);
?>