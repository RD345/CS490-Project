<?php
// Setup Error Reporting:
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
session_start(); // Starts or maintains the session

// Direct to correct page:
// if(isset($_SESSION['username']) == false)
// {
//     header("Location:../login.html");
//     die();
// }
// elseif (isset($_SESSION['role']))
// {
//     if ($_SESSION['role'] != "student" && $_SESSION['role'] != "teacher")
//     header("Location:../login.html");
//         // header("Location: logout.php");
//     // elseif ($_SESSION[$role] != "teacher")
//     //     header("Location: logout.php");
// }


function logout() 
{
    session_unset();
    session_destroy();

    header("Location: .../logout.html");
    die();
}
?>