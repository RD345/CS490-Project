<?php
require('header.php');

// Define variables and initialize with empty values
$vars = [];
array_push($vars, $_POST["username"]); // username
array_push($vars, $_POST["password"]); // password
array_push($vars, false); // auth_val

// echo($vars[0]);
// Sends the login request:
function sendRequest($username, $password)
{
    //$data = array('username' => $username, 'password' => $password); //good
	$data = array('message_type' => 'login_request','username' => $_POST['username'], 'password' => $_POST['password']);
	
	//$url = "https://web.njit.edu/~fw73/backend.php"; // url for backend server.
    $url = "https://web.njit.edu/~mjs239/CS490/beta/middle.php"; // url for middle server.
    $curl = curl_init(); // Create the curl object
	//echo "encoded data:".jsonEncode($data)."\r\n";
    curl_setopt($curl, CURLOPT_POSTFIELDS, $data);
    curl_setopt($curl, CURLOPT_URL, $url);
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
    $res = curl_exec($curl); // Recieve the JSON response from the middle
    curl_close ($curl); // Close the connection
    return $res;
}


// Process response:
// $response = sendRequest($username, $password);
$response = sendRequest($vars[0], $vars[1]); // username, password
$response = json_decode($response);

// END
// $njit_val = false;


// if ($response->njit == 1) // NJIT login will go to student_home
// {
// 	$njit_val = true;
// 	$role = "student";
// 	session_start();
// }
if (!isset($_SESSION))
	session_start();

$_SESSION["test"] = true;
$_SESSION["username"] = $_POST["username"];

// $return_data = ['message_type' => 'login_request', 'auth_val' => $response->back, 'role' => $role];
echo json_encode($response);

/*
if ($response->back == 0) // GP10 login will go to instructor_home
{
	$auth_val = true;
	$role = "instructor";
	// session_start();
	$_SESSION["password"] = $vars[1];
	$_SESSION["username"] = $vars[0];

	$return_data = ['message_type' => 'login', 'auth_val' => $auth_val, 'role' => $role];
	echo json_encode($return_data); 
	// echo json_encode($response);
} 
else
	echo json_encode
	([
		"auth_val" => "false"
	]);
*/
?>