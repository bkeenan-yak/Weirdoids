<?php

function getWeirdoids($userid,$target_id)
{

	//$past = mktime() -  (86400 * 10);

	// if $target_id == $userid, get mine and all my friends posts
	// else get $target_id content only if he/she is a friend
	// TODO check if friend
	

	if ($target_id != $userid)
	{
		// just content for friend, not mine
		$qry=sprintf("SELECT w.user_id, yaklogin, w.user_weirdoid_id, w.fname, u.avatar,
				w.lname, s.weirdoid_sprite_id, xloc, yloc, width, height, zindex, topoffset, src, cyclename,
				w.created, unix_timestamp(w.created) as unix_created, unix_timestamp(now()) as unix_now,
				up.user_post_id,
				(select count(*) from user_like ul where ul.user_id = u.user_id and ul.user_post_id = up.user_post_id) as user_liked_already
				FROM user_weirdoid w, weirdoid_sprite s, users u, user_post up
				WHERE  w.user_weirdoid_id = s.user_weirdoid_id and unix_timestamp(w.created) > (unix_timestamp(now())-(86400*300))
				and u.user_id = w.user_id and isPosted = 1
				and up.referenced_content_id = w.user_weirdoid_id
				and up.post_type_id = 1
				and u.user_id = %d
				and exists (select 1 from user_friend uf where (uf.friend1_id = u.user_id && uf.friend2_id = %d) or (uf.friend2_id = u.user_id && uf.friend1_id = %d))
				ORDER BY w.created desc, w.user_weirdoid_id, s.cyclename", $target_id, $userid, $userid);
	}
	else {


		$qry=sprintf("SELECT w.user_id, yaklogin, w.user_weirdoid_id, w.fname, u.avatar,
				w.lname, s.weirdoid_sprite_id, xloc, yloc, width, height, zindex, topoffset, src, cyclename,
				w.created, unix_timestamp(w.created) as unix_created, unix_timestamp(now()) as unix_now,
				up.user_post_id,
				(select count(*) from user_like ul where ul.user_id = u.user_id and ul.user_post_id = up.user_post_id) as user_liked_already
				FROM user_weirdoid w, weirdoid_sprite s, users u, user_post up
				WHERE  w.user_weirdoid_id = s.user_weirdoid_id and unix_timestamp(w.created) > (unix_timestamp(now())-(86400*300))
				and u.user_id = w.user_id and isPosted = 1
				and up.referenced_content_id = w.user_weirdoid_id
				and up.post_type_id = 1
				and (u.user_id = %d or u.user_id in (select case when uf.friend1_id = %d then friend2_id else friend1_id end
				from user_friend uf
				where ( uf.friend1_id = %d or uf.friend2_id = %d)))
				ORDER BY w.created desc, w.user_weirdoid_id, s.cyclename", $target_id,$target_id,$target_id,$target_id);
	}
	//echo $sql;
	$imgs = array();

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

	if (mysql_num_rows($result) > 0)
	{


		$curr_weirdoid = '';
		$weirdoid = $weirdoids = array();
		$sprite = $sprites = array();
		$curr_weirdoid_sprite_id = -1;
		$first_sprite = true;

		// create images if necessary
		//$serverUrl = "http://yrcreative.com/clients/yakbooks/weirdoids/user_images/".$user_weirdoid_id.".jpg";

		$first_row = true;
		$lastid = 0;



		while ($row = mysql_fetch_assoc($result)) {
			//echo 'toploop<br>';
			$user_weirdoid_id = $row["user_weirdoid_id"];



			$active_imgname = "../user_images/".$lastid.".jpg";
			$imgname = "../user_images/".$user_weirdoid_id.".jpg";
			//$serverUrl = "http://yrcreative.com/clients/yakbooks/weirdoids/user_images/".$user_weirdoid_id.".jpg";
			//$serverUrl = "http://yak.com/yakbooks/weirdoids/user_images/".$user_weirdoid_id.".jpg";

			if ($first_row)
			{
				$fname = $row["fname"];
				$lname = $row["lname"];
				$user_post_id = $row["user_post_id"];

			}

			//echo 'lastid '.$lastid.' user_weirdoid_id '. $user_weirdoid_id. '<br>';

			if ($lastid > 0 && $lastid != $user_weirdoid_id)
			{
				// add this

				$img = array();
				$img["url"] = substr($active_imgname,3);
				$img["fname"] = $lastfname;
				$img["lname"] = $lastlname;
				$img["yaklogin"] = $lastlogin;
				$img["daysago"] = floor($ddiff);
				$img["hrsago"] = floor(($ddiff - floor($ddiff))*86400/3600);
				$img["minsago"] = floor(($ddiff - floor($ddiff))*86400/60);
				$img['user_post_id'] = $last_user_post_id;
				$img["likes"] = getLikeCount($last_user_post_id);
				$img["comments"] = getPostComments($last_user_post_id);
				$img["user_liked_already"] = $last_user_liked_already;
				array_push($imgs, $img);

				// draw image
				if (!file_exists ( $active_imgname))
				{
					// already exists
					//echo 'did not find ' . $active_imgname . '<br>';
					drawImage($active_imgname, $jpeg,$head_png,$body_png, $leg_png,$xtra_png,$jpeg,
					$bkgd_width, $bkgd_height, $head_width, $head_height,$body_width, $body_height,$leg_height, $leg_width,$xtra_width, $xtra_height);

				}
			}
			//reset variables
			$lastfname = $row["fname"];
			$lastlname = $row["lname"];
			$lastlogin = $row["yaklogin"];
			$last_user_liked_already = $row["user_liked_already"];
			$last_user_post_id = $row["user_post_id"];
			$lastcreated = $row["unix_created"];
			$lastnow = $row["unix_now"];
			$ddiff =  (($lastnow - $lastcreated)/86400);


			if (file_exists ( $imgname))
			{
				// already exists
				//echo 'found ' . $imgname . '<br>';
				$lastid = $user_weirdoid_id;
				continue;
			}

			$lastid = $user_weirdoid_id;

			$cyclename =  $row["cyclename"];
			$xloc =  $row["xloc"];
			$yloc =  $row["yloc"];
			$width =  $row["width"];
			$height =  $row["height"];
			$zindex =  $row["zindex"];
			$topoffset =  $row["topoffset"];
			$src =  "../".$row["src"];

			try {


				switch ($cyclename)
				{
					case 'head':
						$head_png = imagecreatefrompng($src);
						list($head_width, $head_height) = getimagesize($src);
						break;
					case 'body':
						$body_png = imagecreatefrompng($src);
						list($body_width, $body_height) = getimagesize($src);
						break;
					case 'leg':
						$leg_png = imagecreatefrompng($src);
						list($leg_width, $leg_height) = getimagesize($src);
						break;
					case 'xtra':
						$xtra_png = imagecreatefrompng($src);
						list($xtra_width, $xtra_height) = getimagesize($src);
						break;
					case 'bkgd':
						$jpeg = imagecreatefromjpeg($src);
						list($bkgd_width, $bkgd_height) = getimagesize($src);
						break;
				}
			}
			catch (Exception $e)
			{
				$istatus["errorcode"] = 1;
				$istatus["errormsg"] = "Exception caught writing images (phase 1): ". $e->getMessage();
				echo json_encode($istatus);
				die();
			}

		}

		if ($lastid > 0)
		{
			$img = array();
			$img["url"] = substr($active_imgname,3);
			$img["fname"] = $lastfname;
			$img["lname"] = $lastlname;
			$img["user_liked_already"] = $last_user_liked_already;
			$img["yaklogin"] = $lastlogin;
			$img["daysago"] = floor($ddiff);
			$img["hrsago"] = floor(($ddiff - floor($ddiff))*3600/24);
			$img["minsago"] = floor(($ddiff - floor($ddiff))*86400/3600);
			$img['user_post_id'] = $last_user_post_id;
			$img["likes"] = getLikeCount($last_user_post_id);
			$img["comments"] = getPostComments($last_user_post_id);
			array_push($imgs, $img);

			// draw image
			if (!file_exists ( $active_imgname))
			{
				// already exists
				//echo 'did not find ' . $active_imgname . '<br>';
				drawImage($imgname, $jpeg,$head_png,$body_png, $leg_png,$xtra_png,$jpeg,
				$bkgd_width, $bkgd_height, $head_width, $head_height,$body_width, $body_height,$leg_height, $leg_width,$xtra_width, $xtra_height);
			};
		}
	}

	return $imgs;
}

function getPostComments($userpostid) {
	$comments = array();

	$qry=sprintf("SELECT DISTINCT u.yaklogin, p.user_post_id, sc.comment_text, p.created, sc.has_placeholder, u.user_id
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
				$comment['yaklogin'] = $row["yaklogin"];
				$comment['user_post_id'] = $row["user_post_id"];
				$comment['user_id'] = $row["user_id"];
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

function get_user_data($userid)
{
	$user_data = array();
	$qry=sprintf("SELECT yaklogin, avatar from users u where u.user_id = %d", $userid);

	//echo $qry;

	$result=mysql_query($qry);

	if (!$result) {
		if (mysql_error($link)) {
			// failed
			//header("location: login-failed.php");
			$istatus["errorcode"] = 1;
			$istatus["errormsg"] = "Error: Reading user data: ".mysql_errno($link). " ".mysql_error($link);
			echo json_encode($istatus);
			die();
		} else {
			$istatus["errorcode"] = 1;
			$istatus["errormsg"] = "Unknown error reading user data";
			echo json_encode($istatus);
			die();
		}
	}
	else
	{
		if (mysql_num_rows($result) > 0) {
			$row = mysql_fetch_assoc($result);
			$user_data["yaklogin"] = $row["yaklogin"];
			
			$avatar = $row["avatar"];
			if ($avatar == null)
			{
				$avatar = "img/avatar_0.jpg";
			}
			$user_data["avatar"] = $avatar;
			
			// TODO get user counts
			$user_data["profile_friend_count"] = 6;
			$user_data["profile_photos_count"] = 15;
			$user_data["profile_likes_count"] = 22;
		}

	}

	return $user_data;
}

function drawImage($imgname, $jpeg,$head_png,$body_png, $leg_png,$xtra_png,$jpeg,$bkgd_width, $bkgd_height, $head_width, $head_height,$body_width, $body_height,$leg_height, $leg_width,$xtra_width, $xtra_height)
{
	//echo 'drawing ' . $imgname . '<br>';
	if (file_exists ( $imgname))
	{
		// already exists
		//echo 'found ' . $imgname . '<br>';
		return;
	}

	try {
		$out = imagecreatetruecolor($bkgd_width, $bkgd_height);

		imagecopyresampled($out, $jpeg, 0, 0, 0, 0, $bkgd_width, $bkgd_height, $bkgd_width, $bkgd_height);
		imagecopyresampled($out, $head_png, 159,00, 0, 0, $head_width, $head_height, $head_width, $head_height);
		imagecopyresampled($out, $body_png, 34,150, 0, 0, $body_width, $body_height, $body_width, $body_height);
		imagecopyresampled($out, $leg_png, 34,510, 0, 0, $leg_width, $leg_height, $leg_width, $leg_height);
		imagecopyresampled($out, $xtra_png, 134,20, 0, 0, $xtra_width, $xtra_height, $xtra_width, $xtra_height);
		imagejpeg($out, $imgname,100);
		//header('Content-Type: image/jpg');

		//imagejpeg($out);
		imagedestroy($out);
		//echo 'created ' . $imgname . '<br>';
		// success
		//$istatus["errorcode"] = 0;
		//$istatus["errormsg"] = "Created User Weirdoid Image!";
		//$istatus["serverUrl"] = $serverUrl;
		//echo json_encode($istatus);
		//exit;
	}
	catch (Exception $e)
	{
		$istatus["errorcode"] = 1;
		$istatus["errormsg"] = "Exception caught writing images (phase 2): ". $e->getMessage();
		echo json_encode($istatus);
		die();
	}
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

$user_data = get_user_data($target_id);
$istatus["user_data"] = $user_data;

echo json_encode($istatus);


mysql_free_result($result);

mysql_close($link);



?>