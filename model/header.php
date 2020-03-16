<?php
    if (session_status() == PHP_SESSION_ACTIVE)
        if ($_SESSION[$user_type] != "student")
            header("Location: ../logout.html");
?>