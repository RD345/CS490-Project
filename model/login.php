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
    //$data = array('username' => $username, 'password' => $password); //good
	$data = array('message_type' => 'login_request','username' => $_POST['username'], 'password' => $_POST['password']);
	
	//$url = "https://web.njit.edu/~fw73/backend.php"; // url for backend server.
	// $url = "https://web.njit.edu/~mjs239/CS490/beta/middle.php"; // url for middle server.
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


// if ($response->back == 0) // GP10 login will go to instructor_home
// {
// 	$auth_val = true;
// 	$role = "instructor";
// 	// session_start();
// 	$_SESSION["password"] = $vars[1];
// 	$_SESSION["username"] = $vars[0];

// 	$return_data = ['message_type' => 'login', 'auth_val' => $auth_val, 'role' => $role];
// 	echo json_encode($return_data); 
// 	// echo json_encode($response);
// } 
// else
// 	echo json_encode
// 	([
// 		"auth_val" => "false"
// 	]);

?>