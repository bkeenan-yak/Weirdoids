var $active_cycle;

var firstNameVar = null;
var lastNameVar = null;

var $weirdoids = [];
var $lastweirdoid = null;
var $toSaveWeirdoid = null;
var $savingFromPreview = false;
var $saveSuccessFunction = null;
var $srcPage = null;
var $saved_new_weirdoid = false;
var $packs = [];

var STD_HEIGHT = 1024;
var STD_WIDTH = 768;
var WIDTH_TO_HEIGHT = STD_WIDTH / STD_HEIGHT;
var NARROW_WIDTH = 600;


var $btn_build_top = 400;
var $btn_vault_top = 500;
var $btn_packs_top = 600;



var $online = navigator.onLine;
var $is_logged_in = false;
var $is_on_facebook = false;
var $is_trial_only = false;
var $username = 'Guest';
var $local_user_keys = [];
var $current_user_key = null;
var $userid = null;
var $facebook_userid = null;
var $userkey_prefix = "myWeirdoids_";
var $local_user_id = 0;

// easter egg variables
var $random_cycle = false;
var $random_eggs = 0;
var $current_eastereggs = [];
var iWebkit;

if (typeof console == "undefined" || typeof console.log == "undefined")

	var console = {

		log : function() {

		}

	};

$(document)
		.ready(
				function() {

					console.log("in ready weirdoids");

					// $('a').live('click', function(event) {
					// event.preventDefault();
					// window.location = $(this).attr("href");
					// });

					// localStorage.clear();

					if (navigator.userAgent.match(/iPad/i)) {
						console.log('on ipad');
					}

					document.ontouchmove = function(event) {
						// event.preventDefault();
					};

					console.log("browser " + navigator.userAgent);

					if (navigator.userAgent.match(/Android/i)

					|| navigator.userAgent.match(/webOS/i)

					|| navigator.userAgent.match(/iPhone/i)

					|| navigator.userAgent.match(/iPad/i)) {
						console.log('in match');
						$('.browser-nav-btn').remove();
					}

					$(window).bind("offline", function(e) {
						console.log("offline");
						$online = navigator.onLine;
						// OR you can set attr to ""
						$('.online-only').attr('disabled', 'disabled');

					});

					$(window).bind("online", function(e) {

						console.log("online");

						$online = navigator.onLine;

						// enable online functionality
						// log in buttons
						// To enable
						$('.online-only').removeAttr('disabled');

						synchProdKeys();
					});

					// get the json file

					

					//var packs = [];
					if ($online) {
						checkAutoLogin();
					}

					$('#btn_login_with_fb').click(function(e) {

						console.log("btn_login_with_fb clicked");

						if ($is_on_facebook) {
							console.log("already logged in to fb after login btn");
							$.mobile.changePage("#fbverify_pg",
							{
								transition : "pop"
							});
						} else
							fbLoginHandler(afterFirstFBLogin);
						return false;
					});


					$('#fbverify_pg').live('pagebeforeshow', function(event) {
						var prompt = "You are already logged into Facebook.";
						if ($fbdata.email)
							prompt += "as " + $fbdata.email;
						$('#fbverify_pg_h1_1').html(prompt);
					});

					$('#fbverify_pg_btn_login').click(function(e) {
						$srcPage = "#fbverify_pg";
						$afterLoginPage = '#home';
						fbLoginHandler(afterFirstFBLogin);
						return false;
					});


//					$(document).delegate('#simplebool', 'click', function() {
//
//						$(this).simpledialog({
//							'mode' : 'bool',
//							'prompt' : 'How about it?',
//							'useModal' : true,
//							'buttons' : {
//								'OK' : {
//									click : function() {
//										$('#dialogoutput').text('OK');
//									}
//								},
//
//								'Cancel' : {
//									click : function() {
//										$('#dialogoutput').text('Cancel');
//									},
//									icon : "delete",
//									theme : "c"
//								}
//							}
//
//						});
//
//					});

					$('#myModal').click(function(e) {
						e.preventDefault();
						return;
					});

					if (navigator.userAgent.match(/Android/i)

					|| navigator.userAgent.match(/webOS/i)

					|| navigator.userAgent.match(/iPhone/i)

					|| navigator.userAgent.match(/iPad/i)) {

						$(window).bind(
										'orientationchange',

										function(event) {

											console.log("new orientation "

											+ window.orientation);

											if (window.orientation == 90

											|| window.orientation == -90

											|| window.orientation == 270) {
												$('meta[name="viewport"]')
														.attr('content',
														'height=device-width,width=device-height,initial-scale=1.0,maximum-scale=1.0');

											} else {

												$('meta[name="viewport"]')
														.attr('content',
														'height=device-height,width=device-width,initial-scale=1.0,maximum-scale=1.0');

											}

											console.log("in anim");
										}).trigger('orientationchange');
					}

					// get array weirdoids from local storage
					get_weirdoids_from_local_storage();
					
					// get product keys

					synchProdKeys();


				});


function getUserKey() {
	if ($current_user_key == null)

		$current_user_key = $userkey_prefix + $userid;
}

function getNewUserKey(userid) {
	return $userkey_prefix + userid;
}

function afterFirstFBLogin(isloggedin, msg) {
	if (isloggedin) {
		$fbCompleteCallback = afterYakLogin;
		login_to_site($fbdata);
	} else
		history.back();
}

function afterYakLogin(isloggedin, msg) {

	console.log("in afterYakLogin");

	afterLogin($userid);

	$('.logged-in-only').attr('disabled', '');

	var nuid = "Logged in with Facebook";

	if ($fbdata.first_name)
		nuid = $fbdata.first_name;

	displayUserName(nuid);
	chgPageAfterLoginOrShare();
}

function afterFBLogin(success, msg) {
	console.log("afterFBLogin: " + success + " msg: " + msg);
	history.back();
}

function chgPageAfterLoginOrShare() {

	if ($srcPage == null) {
		myalert("chgPageAfterLoginOrShare: null $srcPage");
		return;
	}

	if ($srcPage == '#home') {
		gotoPage($srcPage);
		return;
	}

	if ($srcPage == '#previewpage') {
		saveWeirdoid($lastweirdoid);
		return;
	}

	console.log("$srcPage - " + $srcPage);

	if ($afterLoginPage == null) {
		myalert("Null $afterLoginPage");

	} else if ($afterLoginPage == 'back') {
		history.back();

	} else if ($afterLoginPage == 'beforeshare') {
		if ($savedReturnPage != null) {
			$afterLoginPage = $savedReturnPage;
			$savedReturnPage = null;
		}

		afterFBLoginBeforeShare(true, "null msg");
	} else if ($($afterLoginPage).length > 0) {

		$.mobile.changePage($afterLoginPage, {
			transition : "fade"
		});

	} else {
		myalert("Unknown $afterLoginPage " + $afterLoginPage);
	}

	$afterLoginPage = null;

}

function gotoPage(page) {

	$.mobile.changePage(page, {
		transition : "fade"
	});

}


function afterFBLoginBeforeShare(success, msg) {

	if (success) {
		console.log("afterFBLoginBeforeShare");
		shareClickHandler(false, $toSaveWeirdoid);
	} else
		myalert("Failed to log in to FB before sharing: " + msg);
}



$(window).load(function() {

	var dataurl = localStorage.getItem("myimg");

	$('#myimg').append(	'<img src="' + dataurl 	+ '" style="width:100%;height:100%;" />');

	var dataurl2 = localStorage.getItem("myimg2");

	$('#myimg').append(	'<img src="' + dataurl2
	+ '" style="width:100%;height:100%;" />');

	$('#home').waitForImages(function() {
		console.log('Home bg are loaded.');
		$.resizeHome();
		setTimeout(function() {
			console.log('got bg');
		}, 1000);
	});

	// Set a timeout...

	if (navigator.userAgent.match(/iPad/i)) {
		setTimeout(function() {
			// Hide the address bar!
			window.scrollTo(0, 100);
		}, 400);
	}

});

function isTouchDevice()
{
	console.log("$.mobile.support.touch = " + $.mobile.support.touch);
	  return $.mobile.support.touch;
}

function onAfterClickPack(curr, next, opts) {

	var index = opts.currSlide;

	var cycle = opts.$cont;

	// if (typeof $active_cycle == undefined || $active_cycle == '') {

	// console.log("$active_cycle undefined");

	// return;

	// }

	if (typeof cycle == undefined || cycle == '') {

		console.log("onAfter: cycle undefined");

		return;

	}

	cycle.currSlide = index;

	cycle.data('currSlide', index);

	console.log('Build Pack slide = ' + index + ' curr ' + cycle.currSlide);

}


function weirdoid(bkgd, head, body, leg, xtra, fname, lname) {
	this.bkgd = bkgd;
	this.head = head;
	this.body = body;
	this.leg = leg;
	this.xtra = xtra;
	this.fname = fname;
	this.lname = lname;

}

function cycleSprite(src, topoffset, sprite) {

	this.src = src;
	this.topoffset = topoffset;
	this.sprite = sprite;
}

function serverAlert(error, json) {

	var alertmsg = error + "\n\r";

	if (json.errormsg)

		alertmsg += json.errormsg + '\n\r';

	if (json.errmsg_arr) {

		jQuery.each(json.errmsg_arr, function() {

			alertmsg = alertmsg.concat(this + "\n\r");

		});

	}

	myalert(alertmsg, "Error on Server");

}

function myalert(message, title) {

	var msg_html = "";

	if (title != null) {

		msg_html += "<h1>" + title + "</h1>";

	}

	if (message != null) {

		msg_html += "<p>" + message + "</p>";

	}

	// $(document).simpledialog({

	// mode: 'blank',

	// headerText: 'Alert',

	// headerClose: true,

	// blankContent :

	// msg_html

	// });

	$('#modalcontent').html(msg_html);

	//

	$.mobile.changePage("#myModal", {

		transition : "pop"

	});

}
