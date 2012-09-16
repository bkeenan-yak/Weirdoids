<?php

require_once 'config.php';

function getWeirdoid($user_weirdoid_id)
{

	//$server = $_SERVER['SERVER_NAME'];
	//$imgroot = $server."/weirdoids/user_images/";
	$imgroot = "/user_images/";
	$src_imgroot = "/../";

	//echo 'imgname = ' . $imgname;
	// 	$src_imgroot =  dirname(__FILE__) ."/../";
	// 	$imgroot =  dirname(__FILE__) . "/../user_images/";
	$imgname = $imgroot.$user_weirdoid_id.".jpg";

	$find_img_name = SERVER_URL.'weirdoids/user_images/' . $user_weirdoid_id.".jpg";
	//$find_img_name = $imgroot.$user_weirdoid_id.".jpg";

	$w = null;


	// just content for friend, not mine
	$qry=sprintf("SELECT w.user_id, yaklogin, w.user_weirdoid_id, w.fname, u.avatar,
			w.lname, s.weirdoid_sprite_id, xloc, yloc, width, height, zindex, topoffset, src, cyclename,
			w.created, unix_timestamp(w.created) as unix_created, unix_timestamp(now()) as unix_now,
			up.user_post_id,
			(select count(*) from user_like ul where ul.user_id = u.user_id and ul.user_post_id = up.user_post_id) as user_liked_already
			FROM user_weirdoid w, weirdoid_sprite s, users u, user_post up
			WHERE  w.user_weirdoid_id = %d
			and w.user_weirdoid_id = s.user_weirdoid_id
			and u.user_id = w.user_id
			and up.referenced_content_id = w.user_weirdoid_id
			and up.post_type_id = 1
			ORDER BY w.user_weirdoid_id, s.cyclename", $user_weirdoid_id);


	//echo $qry;
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

	if (mysql_num_rows($result) == 0) {
		$istatus["errorcode"] = 1;
		$istatus["errormsg"] = "No data found for user weirdoid: " . $user_weirdoid_id;
		$istatus["gallery"] = $imgs;
		echo json_encode($istatus);
		die();
	}


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



		// 		$active_imgname = "../weirdoids/user_images/".$lastid.".jpg";
		// 		$imgname = "../weirdoids/user_images/".$user_weirdoid_id.".jpg";
		//$serverUrl = "http://yrcreative.com/clients/yakbooks/weirdoids/user_images/".$user_weirdoid_id.".jpg";
		//$serverUrl = "http://yak.com/yakbooks/weirdoids/user_images/".$user_weirdoid_id.".jpg";

		if ($first_row)
		{
			$fname = $row["fname"];
			$lname = $row["lname"];
			$user_post_id = $row["user_post_id"];

			$w = array();
			$w["fname"] = $fname;
			$w["lname"] = $lname;

			$first_row = false;
		}

		//echo 'lastid '.$lastid.' user_weirdoid_id '. $user_weirdoid_id. '<br>';


		// 		$lastfname = $row["fname"];
		// 		$lastlname = $row["lname"];
		$lastlogin = $row["yaklogin"];
		$last_user_liked_already = $row["user_liked_already"];
		$last_user_post_id = $row["user_post_id"];
		$lastcreated = $row["unix_created"];
		$lastnow = $row["unix_now"];
		$ddiff =  (($lastnow - $lastcreated)/86400);



		if (file_exists ( $imgname))
		{
			// already exists
			break;
		}

		$cyclename =  $row["cyclename"];
		$xloc =  $row["xloc"];
		$yloc =  $row["yloc"];
		$width =  $row["width"];
		$height =  $row["height"];
		$zindex =  $row["zindex"];
		$topoffset =  $row["topoffset"];
		//$src =  "../".$row["src"];
		$src =  $src_imgroot . $row["src"];
		try {

			//echo 'cylce: ' . $cyclename . " " . $src . '<br>';
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

	// draw image
	//echo 'imgname '. $imgname ."<br>";

	if (!file_exists ( $imgname))
	{
		// already exists
		//echo 'did not find ' . $imgname . '<br>';
		drawImage($imgname, $jpeg,$head_png,$body_png, $leg_png,$xtra_png,$jpeg,
		$bkgd_width, $bkgd_height, $head_width, $head_height,$body_width, $body_height,$leg_height, $leg_width,$xtra_width, $xtra_height);

	};
	$w["imgname"] = $find_img_name;

	return $w;
}


function getWeirdoids($userid,$target_id,$getfriends)
{

	//$past = mktime() -  (86400 * 10);

	// if $target_id == $userid, get mine and all my friends posts
	// else get $target_id content only if he/she is a friend
	// TODO check if friend

	// 	$src_imgroot =  dirname(__FILE__) ."/../";
	// 	$imgroot =  dirname(__FILE__) . "/../user_images/";
	// 	$imgname = $imgroot.$user_weirdoid_id.".jpg";
	// 	$find_img_name = "../weirdoids/user_images/" . $user_weirdoid_id.".jpg";

	set_time_limit (120 );

	//echo " http_host " . $_SERVER[HTTP_HOST];
	$server = $_SERVER['SERVER_NAME'];
	$imgroot = $server."/weirdoids/user_images/";
	$imgroot = "../../weirdoids/user_images/";

	//echo "imgroot " . $imgroot;

	if (!$getfriends)
	{
		// just content for friend, not mine
		$qry=sprintf("SELECT w.user_id, yaklogin, w.user_weirdoid_id, w.fname, u.avatar,
				w.lname, s.weirdoid_sprite_id, xloc, yloc, width, height, zindex, topoffset, src, cyclename,
				w.created, unix_timestamp(w.created) as unix_created, unix_timestamp(now()) as unix_now,
				up.user_post_id, up.post_type_id,up.is_approved, up.is_approved_date,
				(select count(*) from user_like ul where ul.user_id = u.user_id and ul.user_post_id = up.user_post_id) as user_liked_already
				FROM user_weirdoid w, weirdoid_sprite s, users u, user_post up
				WHERE  w.user_weirdoid_id = s.user_weirdoid_id and unix_timestamp(w.created) > (unix_timestamp(now())-(86400*60))
				and u.user_id = w.user_id
				and up.referenced_content_id = w.user_weirdoid_id
				and up.post_type_id = 1
				and u.user_id = %d
				and (is_approved is null or is_approved = 1)
				and exists (select 1 from user_friend uf where (uf.friend1_id = u.user_id && uf.friend2_id = %d) or (uf.friend2_id = u.user_id && uf.friend1_id = %d))
				ORDER BY w.created desc, w.user_weirdoid_id, s.cyclename", $target_id, $userid, $userid);
	}
	else {


		$qry=sprintf("SELECT w.user_id, yaklogin, w.user_weirdoid_id, w.fname, u.avatar,
				w.lname, s.weirdoid_sprite_id, xloc, yloc, width, height, zindex, topoffset, src, cyclename,
				w.created, unix_timestamp(w.created) as unix_created, unix_timestamp(now()) as unix_now,
				up.user_post_id,up.post_type_id,up.is_approved, up.is_approved_date,
				(select count(*) from user_like ul where ul.user_id = u.user_id and ul.user_post_id = up.user_post_id) as user_liked_already
				FROM user_weirdoid w, weirdoid_sprite s, users u, user_post up
				WHERE  w.user_weirdoid_id = s.user_weirdoid_id and unix_timestamp(w.created) > (unix_timestamp(now())-(86400*60))
				and u.user_id = w.user_id
				and up.referenced_content_id = w.user_weirdoid_id
				and up.post_type_id = 1
				and (is_approved is null or is_approved = 1)
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



			$active_imgname = $imgroot.$lastid.".jpg";
			$find_img_name = SERVER_URL.'weirdoids/user_images/' . $lastid.".jpg";
				
			// the name of the image we are working on now
			$imgname = $imgroot.$user_weirdoid_id.".jpg";
				

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
				$img["url"] = $find_img_name;
				$img["fname"] = $lastfname;
				$img["lname"] = $lastlname;
				$img["avatar"] = $lastavatar;
				$img["yaklogin"] = $lastlogin;
				$img["user_id"] = $lastuserid;
				$img["daysago"] = floor($ddiff);
				$img["hrsago"] = floor(($ddiff - floor($ddiff))*86400/3600);
				$img["minsago"] = floor(($ddiff - floor($ddiff))*86400/60);
				$img["secsago"] = $sdiff;
				$img["unix_created"] = $lastcreated;
				$img['user_post_id'] = $last_user_post_id;
				$img['post_type_id'] = $last_post_type_id;
				$img['is_approved'] = $last_is_approved;
				$img['is_approved_date'] = $last_is_approved_date;
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
			$lastavatar = $row["avatar"];
			$lastuserid = $row["user_id"];
			$lastlogin = $row["yaklogin"];
			$last_user_liked_already = $row["user_liked_already"];
			$last_user_post_id = $row["user_post_id"];
			$last_is_approved = $row["is_approved"];
			$last_is_approved_date = $row["is_approved_date"];
			$lastcreated = $row["unix_created"];
			$last_post_type_id = $row["post_type_id"];
			$lastnow = $row["unix_now"];
			$ddiff =  (($lastnow - $lastcreated)/86400);
			$sdiff =  $lastnow - $lastcreated;


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
			//$src =  "../".$row["src"];
			$src =  "../../weirdoids/".$row["src"];
			//echo 'src = '. $src . "<br>";
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
			$img["url"] = $find_img_name;
			$img["fname"] = $lastfname;
			$img["lname"] = $lastlname;
			$img["avatar"] = $lastavatar;
			$img["user_liked_already"] = $last_user_liked_already;
			$img["yaklogin"] = $lastlogin;
			$img["user_id"] = $lastuserid;
			$img["daysago"] = floor($ddiff);
			$img["hrsago"] = floor(($ddiff - floor($ddiff))*3600/24);
			$img["minsago"] = floor(($ddiff - floor($ddiff))*86400/3600);
			$img["secsago"] = $sdiff;
			$img["unix_created"] = $lastcreated;
			$img['user_post_id'] = $last_user_post_id;
			$img['post_type_id'] = $last_post_type_id;
			$img['is_approved'] = $last_is_approved;
			$img['is_approved_date'] = $last_is_approved_date;
			$img["likes"] = getLikeCount($last_user_post_id);
			$img["comments"] = getPostComments($last_user_post_id);
			array_push($imgs, $img);

			// draw image
			//echo 'active image name ' . $active_imgname. '<br>';
			if (!file_exists ( $active_imgname))
			{
				// already exists
				echo 'did not find ' . $active_imgname . '<br>';
				drawImage($imgname, $jpeg,$head_png,$body_png, $leg_png,$xtra_png,$jpeg,
				$bkgd_width, $bkgd_height, $head_width, $head_height,$body_width, $body_height,$leg_height, $leg_width,$xtra_width, $xtra_height);
			};
		}
	}

	return $imgs;
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


?>