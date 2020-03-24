<?php
require('header.php');

// if(session_status() != PHP_SESSION_NONE)
	session_unset();
	session_destroy();

header("Location: ../logout.html");
die();
?>