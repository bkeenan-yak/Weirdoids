<?php

include_once('weirdoid_functions.php');


//Start session
session_start();

header('Content-Type: application/json');

//Include database connection details
require_once('../../yak/controllers/db_functions.php');

//Array to store validation errors
$errmsg_arr = array();
$istatus = array();

//Validation error flag
$errflag = false;

//Connect to mysql server, sets $link and $db, dies on error
// uses $errflag, $istatus, $errmsg_arr
$link = connectToDB();
$db = selectDB();

$userid = clean($_POST['userid']);

if($userid == '') {
	$errmsg_arr[] = 'User ID missing';
	$errflag = true;
}

$target_id = clean($_POST['target_id']);

if($target_id == '') {
	$errmsg_arr[] = 'Target User ID missing';
	$errflag = true;
}


//If there are input validations, redirect back to the registration form
if($errflag) {
	$_SESSION['ERRMSG_ARR'] = $errmsg_arr;
	session_write_close();
	$istatus["errorcode"] = -1;
	$istatus["errormsg"] = "validation error";
	$istatus["errmsg_arr"] = $errmsg_arr;
	echo json_encode($istatus);
	foreach ($errmsg_arr as $i => $value) {
		unset($errmsg_arr[$i]);
	}
	die();
}

// Get all the weirdoids

$imgs = getWeirdoids($userid, $target_id);
$istatus["errorcode"] = 0;
$istatus["errormsg"] = "Retrieved Weirdoids!";
$istatus["gallery"] = $imgs;

// Get all the status update messages
$status_updates = array();
$status_update = array();
$status_update["created"] = "1/1/12";
$status_update["msg"] = "I am wiped out!";
array_push($status_updates,$status_update);

$istatus["status_updates"] = $status_updates;

echo json_encode($istatus);


mysql_free_result($result);

mysql_close($link);



?>