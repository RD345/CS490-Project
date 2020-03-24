<?php
/*This is for sending and recieveing requests through the network.*/

// Settup error reporting:
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

if (session_status() == PHP_SESSION_ACTIVE)
        if ($_SESSION[$user_type] != "student")
            header("Location: ../logout.html");
        elseif ($_SESSION[$user_type] != "instructor")
            header("Location: ../logout.html");

 
// Get basic session variables:
if (isset($_SESSION["username"]))
    $username = $_SESSION["username"];
if (isset($_SESSION["password"]))
    $password = $_SESSION["password"];

// Determine message type and construct response: 

switch ($_POST["message_type"]) 
{
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
}

$back_url = "https://web.njit.edu/~fw73/backend.php"; // url for backend server.
$middle_url = "https://web.njit.edu/~mjs239/CS490/beta/middle.php"; // url for middle server.

// $data = array('username' => $_POST['username'], 'password' => $_POST['password']);

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
echo $response;
$response = json_decode($response);


// echo json_encode
// ([
// 	"njit_val" => $njit_val,
// 	"gp10_val" => $gp10_val,
// 	"user_type" => $user_type
// ]);

function logout() 
{
    // if(session_status() != PHP_SESSION_NONE)
	session_unset();

    header("Location: ../logout.html");
    die();
}
?>