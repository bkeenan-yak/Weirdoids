<?php

//Start session
session_start();

header('Content-Type: application/json');

//Include database connection details
echo ' step 1' . '<br>';
require_once('../../yak/controllers/db_functions.php');
echo ' step 2' . '<br>';
require_once('weirdoid.php');
echo ' step 3' . '<br>';
require_once('weirdoid_sprite.php');
echo ' step 4' . '<br>';
//require_once('weirdoid_easteregg.php');
echo ' step 5' . '<br>';
require_once('../../yak/controllers/notifications.php');

?>