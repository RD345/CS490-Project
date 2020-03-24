<?php
    // Setup Error Reporting:
    ini_set('display_errors', 1);
    ini_set('display_startup_errors', 1);
    error_reporting(E_ALL);

    session_start(); // Starts or maintains the session
    /*
    // Redirect if on invalid page for role:
    if ($_SESSION[$role] != "student")
        header("Location: ../logout.php");
    elseif ($_SESSION[$role] != "instructor")
        header("Location: ../logout.php");
        */
?>