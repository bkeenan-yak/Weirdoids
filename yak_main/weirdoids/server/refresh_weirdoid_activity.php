<?php

function getPostComments($userpostid) {
	$comments = array();
	
	$qry=sprintf("SELECT DISTINCT u.fname, p.user_post_id, sc.comment_text, p.created, sc.has_placeholder
		FROM user_post p, user_comment uc, scripted_comment sc, users u
		WHERE p.user_post_id = uc.user_post_id
		and u.user_id = uc.user_id
		AND sc.scripted_comment_id = uc.scripted_comment_id
		and p.user_post_id = %d", $userpostid);
	
	//echo $qry;
	
	$result=mysql_query($qry);
	
	if (!$result) {
		if (mysql_error($link)) {
			// failed
			//header("location: login-failed.php");
			$istatus["errorcode"] = 1;
			$istatus["errormsg"] = "Error: Reading user comments failed ".mysql_errno($link). " ".mysql_error($link);
			echo json_encode($istatus);
			die();
		} else {
			$istatus["errorcode"] = 1;
			$istatus["errormsg"] = "Unknown error reading user comments";
			echo json_encode($istatus);
			die();
		}
	}
	else 
	{
		if (mysql_num_rows($result) > 0) {
			
			while ($row = mysql_fetch_assoc($result)) {
				$comment = array();
				$comment['fname'] = $row["fname"];
				$comment['user_post_id'] = $row["user_post_id"];
				$comment['comment_text'] = $row["comment_text"];
				$comment['has_placeholder'] = $row["has_placeholder"];
				array_push($comments,$comment);
			}
			
		}
	}
	
	return $comments;
}

function getLikeCount($userpostid)
{
	$like_count = 0;
	
	$qry=sprintf("SELECT count(*) as likes 
			from user_like ul, user_post up, user_weirdoid uw
			WHERE ul.user_post_id = up.user_post_id 
			and up.referenced_content_id = uw.user_weirdoid_id 
			and  up.user_post_id  = %d", $userpostid);
	
	//echo $qry;
	
	$result=mysql_query($qry);
	
	if (!$result) {
		if (mysql_error($link)) {
			// failed
			//header("location: login-failed.php");
			$istatus["errorcode"] = 1;
			$istatus["errormsg"] = "Error: Reading user req_msg_note counts failed ".mysql_errno($link). " ".mysql_error($link);
			echo json_encode($istatus);
			die();
		} else {
			$istatus["errorcode"] = 1;
			$istatus["errormsg"] = "Unknown error reading user req_msg_note counts";
			echo json_encode($istatus);
			die();
		}
	}
	else 
	{
		if (mysql_num_rows($result) > 0) {
			$row = mysql_fetch_assoc($result);
			$like_count = $row["likes"];
		}
		
	}
	
	
	return $like_count;
}


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