<?php
require('header.php');

session_unset();
session_destroy();

header("Location: ../logout.html");
die();
?>