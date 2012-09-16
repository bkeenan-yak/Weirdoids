<?php

require_once('post_functions.php');

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

// validate the parameters
$user_post_id = clean($_POST['user_post_id']);
$userid = clean($_POST['userid']);

if($userid == '') {
	$errmsg_arr[] = 'User ID missing';
	$errflag = true;
}

if($user_post_id == '') {
	$errmsg_arr[] = 'User Post ID missing';
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
	exit();
}

// makes sure user_post exists
$qry=sprintf("SELECT *,
		(select count(*) from user_like ul where ul.user_id = %d and ul.user_post_id = up.user_post_id) as user_liked_already
	from user_post up where user_post_id = %d",$userid,$user_post_id);

$user_post_data = array();

$result=mysql_query($qry);

if (!$result) {
	if (mysql_error($link)) {
		// failed
		//header("location: login-failed.php");
		$istatus["errorcode"] = 1;
		$istatus["errormsg"] = "Error: Reading weirdoids failed ".mysql_errno($link). " ".mysql_error($link);
		echo json_encode($istatus);
		die();
	} else {
		$istatus["errorcode"] = 1;
		$istatus["errormsg"] = "Unknown error reading weirdoids";
		echo json_encode($istatus);
		die();
	}
}

if (mysql_num_rows($result) == 0) {
	$istatus["errorcode"] = 0;
	$istatus["errormsg"] = "No data found for user_post";
	$istatus["user_post_data"] = $user_post_data;
	echo json_encode($istatus);
	die();
}

$row = mysql_fetch_assoc($result);
$user_liked_already = $row['user_liked_already'];

$user_post_data['user_post_id'] = $user_post_id;
$user_post_data['user_liked_already'] = $user_liked_already;
$user_post_data["likes"] = getLikeCount($user_post_id);
$user_post_data["comments"] = getPostComments($user_post_id);

$istatus["errorcode"] = 0;
$istatus["errormsg"] = "Found user_post activity data";
$istatus["user_post_data"] = $user_post_data;
echo json_encode($istatus);

mysql_free_result($result);

mysql_close($link);



?>