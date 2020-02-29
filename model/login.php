<?php
// Settup error reporting:
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

 
// Define variables and initialize with empty values
$username = $_POST["username"];
$password = $_POST["password"];

// Custom JSON encoding funciton:
function jsonEncode($data)
{
	return "{\r\t".'"username": '."\"".$data['username']."\",".'"password": '."\"".$data['password']."\""."\r}";
}

// Custom JSON decoding funciton:
function jsonDecode($data)
{
	// TODO Decode goes here:
	preg_match('".*"', $data, $vals);
	print_r($vals[0]);
}
 
// Sends the login request:
function sendRequest($username, $password)
{
    //$data = array('username' => $username, 'password' => $password); //good
	$data = array('username' => $_POST['username'], 'password' => $_POST['password']);
	
	//$url = "https://web.njit.edu/~fw73/backend.php"; // url for backend server.
    $url = "https://web.njit.edu/~mjs239/CS490/middle.php"; // url for middle server.
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
$response = sendRequest($username, $password);
//echo "\n\rresponse:".$response; // Debug echo
/*
jsonDecode('{
	"njit": "0",
	"back": "0"
}');
*/

$response = json_decode($response);

// END
$njit_val = false;
$gp10_val = false;

if ($response->njit == 1)
	$njit_val = true;

if ($response->back == 1)
	$gp10_val = true;

echo json_encode
([
	"njit_val" => $njit_val,
	"gp10_val" => $gp10_val,
]);

//header("location: login.html"); // Return to login
?>