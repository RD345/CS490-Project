<?php
// Setup Error Reporting:
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
session_start(); // Starts or maintains the session

// Check if a user is logged in:
if(isset($_SESSION['username']) == false)
{
    header("Location:../login.html");
    die();
}

function logout() 
{
    session_start();
    session_destroy();

    header("Location: .../logout.html");
    die();
}
?>