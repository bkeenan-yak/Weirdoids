


function storeLocalWeirdoid(tmpWeirdoid) {

	$toSaveWeirdoid = tmpWeirdoid;

	if (typeof $toSaveWeirdoid == undefined || $toSaveWeirdoid == null) {
		console.log(" saveclick $toSaveWeirdoid undefined");
		return;
	}

	if ($savingFromPreview) {

		setWeirdoidNameFromSelect($toSaveWeirdoid);
	}

	saveWeirdoidLocal();

	return (true);
}

function saveWeirdoid(tmpWeirdoid) {
	$toSaveWeirdoid = tmpWeirdoid;

	if (typeof $toSaveWeirdoid == undefined || $toSaveWeirdoid == null) {
		console.log(" saveclick $toSaveWeirdoid undefined");
		return;
	}

	if ($savingFromPreview) {
		setWeirdoidNameFromSelect($toSaveWeirdoid);
	}

	// is user online?
	if (navigator.onLine) {
		if ($is_logged_in) {
			saveWeirdoidInDB(onSavedWeirdoidInDB);
		} else {
			// user must log in first
			console.log("User must log in first.");
			$.mobile.changePage("#wanttoshare", {
				transition : "fade",
				role: "dialog"
			});
			return false;
		}
	}
	return (true);
}

function onSavedWeirdoidInDB(savedok, id) {
	//
	if ($srcPage == '#previewpage') {
		if (savedok) {
			console.log("after save in database, switch to previewshare");
			gotoPage('#vault'); // skipping previewshare
			return;
		} else {
			console.log("after failing to save in database, switch to src page");
			gotoPage($srcPage);
			return;
		}
	}

	if ($srcPage == '#previewshare') {
		if (savedok) {
			console.log("after save in database, create the image");
			readyToCreateImage();
			return;
		} else {
			console.log("previewshare: after failing to save in database, switch to src page");
			gotoPage($srcPage);
			return;
		}
	}
	console.log("onSavedWeirdoidInDB: unk $srcPage " + $srcPage);
	return;
}

function saveWeirdoidInDB(callback) {

	if (typeof $toSaveWeirdoid == undefined || $toSaveWeirdoid == null) {
		myalert("saveWeirdoidInDB $toSaveWeirdoid undefined");
		return;
	}

	try {
		console.log("Ready to save in database.");

		if (!$is_logged_in || $userid == null) {
			// we need user to select among possible user keys if more than 1
			myalert("You must log in before you can save your Weirdoid!");
			return false;
		}

		// send user id and weirdoid to server

		$toSaveWeirdoid.userid = $userid;

		var datastr = JSON.stringify($toSaveWeirdoid);

		$.ajax({
			url : 'server/save_weirdoid.php',
			type : 'post',
			dataType : 'json',
			data : {
				data : datastr
			}, // store,

			success : function(json) {
				// process the result

				if (json.errorcode == 0) {

					console.log("saved the weirdoid! "
					+ json.user_weirdoid_id);

					// myalert("Saved the weiroid. ID = "+
					// json.user_weirdoid_id);

					$previewLastMessage = "Your Weirdoid was saved on Yakhq!";

					$toSaveWeirdoid.user_weirdoid_id = json.user_weirdoid_id;

					// call callback function;
					window.setTimeout(function() {

						if (callback != null)
							callback(true, json.user_weirdoid_id);

					}, 2000);

				} else {
					serverAlert("Error saving weirdoid in DB", json);
					console.log("Error saving weirdoid in DB");
					console.log(json.errormsg);

					if (callback != null)
						callback(false, -1);
				}

			},

			failure : function(data) {
				console.log("saving weirdoid in DB failure");

				if (callback != null)
					callback(false, -1);
			},

			complete : function(xhr, data) {
				if (xhr.status != 0 && xhr.status != 200)
					myalert('Error calling server to save weirdoid. Status='
					+ xhr.status + " " + xhr.statusText);
			}

		});

	} catch (e) {
		myalert("Error saving weirdoid to Server database: " + e.message);
	}
};

function canSaveLocal() {

	if ($current_user_key == null) {

		// see if we know who user is
		if (!$is_logged_in) {

			// we need user to select among possible user keys if more than 1

			if ($local_user_keys != null) {
				if ($local_user_keys.length == 0) {

					// no keys, user cannot save locally
					return false;

				} else if ($local_user_keys.length == 0) {

					// use only user key
					$current_user_key = $local_user_keys[0];

				} else {

					// need to pick among possible keys
					// TO DO - select user
					$current_user_key = $local_user_keys[0];

				}

			} else {
				console.log("Null $local_user_keys");
				return false;
			}
		} else {
			// current_user_key is null, but logged in
			// set

			if ($userid == null) {
				console.log("No User ID, can't save local");
				return false;
			} else
				$current_user_key = "myWeirdoids_" + $userid;
		}

	} else {

		console.log("Can save local using $current_user_key "
		+ $current_user_key);

	}

	return true;

};

function saveWeirdoidsLocal() {

	// see if user saved before

	if (!canSaveLocal())
		return false;

	try {

		var saveKey = $current_user_key;

		console.log("saveWeirdoidLocal: key = " + saveKey);
		localStorage.setItem(saveKey, JSON.stringify($weirdoids)); // store

		// make sure to save key

		if ($local_user_keys == null)
			$local_user_keys = new Array();

		if ($.inArray(saveKey, $local_user_keys) > -1) {
			console.log("User key already saved");

		} else {

			$local_user_keys.push(saveKey);

			localStorage.setItem("local_user_keys", JSON
			.stringify($local_user_keys)); // store

			console.log("Saved key in local_user_keys");
		}

	} catch (e) {
		myalert("Error saving to local storage: " + e.message);
		return false;
	}

	return true;

}

function saveWeirdoidLocal() {

	if (typeof $toSaveWeirdoid == undefined || $toSaveWeirdoid == null) {
		myalert("saveWeirdoidLocal $toSaveWeirdoid undefined");
		return false;
	}

	if ($.inArray($toSaveWeirdoid, $weirdoids) < 0)
		$weirdoids.push($toSaveWeirdoid);
	else
		console.log("weirdoid already in array");

	return saveWeirdoidsLocal();
};

jQuery.saveCreation = function() {
	var o = $(this[0]); // It's your element
};


function readyToCreateImage() {

	// create image on server (if it doesn't already exist), retrieve image url

	console.log("Creating image for previously saved weirdoid "
	+ $toSaveWeirdoid.user_weirdoid_id);

	// call server command

	try {

		console.log("Ready to create image file on server.");

		if (!$is_logged_in || $userid == null) {
			// we need user to select among possible user keys if more than 1
			myalert("You must log in before you can save your Weirdoid!");
			return false;

		}

		// send user id and weirdoid to server

		$toSaveWeirdoid.userid = $userid;

		var datastr = JSON.stringify($toSaveWeirdoid);

		$.ajax({
			url : 'server/create_weirdoid_image.php',
			type : 'post',
			dataType : 'json',
			data : {
				data : datastr
			}, // store,

			success : function(json) {

				// process the result

				if (json.errorcode == 0) {

					console.log("created image on server: " + json.serverUrl
					+ " msg: " + json.errormsg);

					// alert("Created image on server " + json.serverUrl);

					$toSaveWeirdoid.serverUrl = json.serverUrl;

					// call callback function;
					// with good response, call imgCreatedOnServer

					imgCreatedOnServer();

				} else {
					serverAlert("Error creating image", json);
					console.log("Error creating image");
					console.log(json.errormsg);

					if ($srcPage != null)
						gotoPage($srcPage);
					return;

				}
			},

			failure : function(data) {
				console.log("create image failure");

				if ($srcPage != null)
					gotoPage($srcPage);
			},

			complete : function(xhr, data) {
				if (xhr.status != 0 && xhr.status != 200)
					myalert('Error calling server to create image. Status='
					+ xhr.status + " " + xhr.statusText);
			}
		});

	} catch (e) {
		myalert("Error creating image on server: " + e.message);
	}

}

function imgCreatedOnServer() {

	if (typeof $toSaveWeirdoid.serverUrl == undefined || $toSaveWeirdoid.serverUrl == null) {
		myalert("imgCreatedOnServerf: saveclick serverUrl undefined");
		if ($srcPage != null)
			gotoPage($srcPage);

		return;
	}

	// share it
	try {
		console.log("Ready to share on facebook: " + $toSaveWeirdoid.serverUrl);

		if (!$is_logged_in || $userid == null) {
			// we need user to select among possible user keys if more than 1
			myalert("You must log in before you can share your Weirdoid!");

			window.setTimeout(function() {

				if ($srcPage != null)

					gotoPage($srcPage);

			}, 1000);

			return;
		}
		readyToShare($toSaveWeirdoid);

	} catch (e) {
		myalert("Error saving weirdoid to Server database: " + e.message);
		if ($srcPage != null)
			gotoPage($srcPage);
	}

}

function getLocalWeirdoids(getKey) {

	$current_user_key = getKey;

	$weirdoids = eval('(' + localStorage.getItem(getKey) + ')');

	if ($weirdoids != null) {
		console.log("retreived weirdoids for " + getKey + " Count="
		+ $weirdoids.length);
	} else {
		console.log("No weirdoids in localStorage for " + getKey);
		$weirdoids = new Array();
	}

	if ($.cookies.test()) {
		$.cookies.set('last_user_key', getKey);
	}

}

function getUserKey() {
	if ($current_user_key == null)
		$current_user_key = $userkey_prefix + $userid;
}

function getNewUserKey(userid) {
	return $userkey_prefix + userid;
}

function get_weirdoids_from_local_storage() {
	// can have multiple IDs
	// $local_user_keys

	var getKey = getUserKey();

	$weirdoids = new Array();

	var lastUserKey = $.cookies.get('last_user_key');

	if (lastUserKey != null) {
		console.log("Found last_user_key " + lastUserKey);
		getLocalWeirdoids(lastUserKey);

	} else {

		$local_user_keys = eval('('
		+ localStorage.getItem('local_user_keys') + ')');

		if ($local_user_keys != null) {
			// have previously saved some keys
			if ($local_user_keys.length == 1) {
				getKey = $local_user_keys[0];
			} else if ($local_user_keys.length) {

				// TO DO: more than one key
				console.log("More than one local_user_keys. Must select one before restore.");

				$current_user_key = $local_user_keys[0];
				getKey = $current_user_key;
				console.log("getKey: " + getKey);

			} else {
				alert("Zero length $local_user_keys");
			}

			getLocalWeirdoids(getKey);

		} else {

			console.log("No record of $local_user_keys");

		}
	}
}

