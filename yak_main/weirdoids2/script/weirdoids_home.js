$(document).ready(function()
{

	console.log("in ready home");

	$('#home').live('pagebeforeshow', function(event)
	{
		$.resizeHome();
	});

	$('#home').live('pageshow', function(event)
	{
		$.mobile.silentScroll(60);
	});

	// get orig location of home buttons
	$btn_build_top = $('#btn_build').css('top');
	$btn_vault_top = $('#btn_vault').css('top');
	$btn_packs_top = $('#btn_packs').css('top');

	$("#bldbtn,#packsbtn").removeClass('ui-disabled').css('opacity', '.5');

	$('#home_login_btn').click(function(e)
	{

		console.log("home login button clicked");
		$srcPage = "#home";
		$afterLoginPage = "#home";

		$('#logged_in_msg').hide();

		$.mobile.changePage("#loginaccount", {
			transition : "fade"
		});
		return false;

	});

	$('#homefooterbtns_afterlogin').children().hide();

	$('#btn_getpwd').click(function(e)
	{
		console.log("btn_getpwd button clicked");
		resetpwd();
		gotoPage("#home");
		return false;

	});

	$('#home_signup_btn').click(function(e)
	{

		console.log("home signup button clicked");

		$('.error').hide();

		$.mobile.changePage("#signup_pg", {
			transition : "fade"
		});

		// displayUserName("Bob Wiley");
		return false;
	});

	$('#btn_login').click(function(e)
	{
		loginToYak();
		return false;
	});

	$("#loginaccount").bind("keydown", function(event)
	{
		// track enter key
		var keycode = (event.keyCode ? event.keyCode : (event.which ? event.which : event.charCode));
		if (keycode == 13)
		{ // keycode for enter key
			// force the 'Enter Key' to implicitly click the Update button
			$('#btn_login').click();
			return false;
		} else
		{
			return true;
		}
	}); // end of function

	$('#btn_signup').click(function(e)
	{
		$srcPage = "#signup_pg";
		$afterLoginPage = '#home';
		signupToYak();
		return false;
	});

	$('#btn_getpwd').click(function(e)
	{

		getPassword();

		return false;

	});

	$('#loginaccount').live('pagebeforeshow', function(event)
	{

		// hide errors

		$('#logged_in_msg').hide();

		$('.error').hide();

	});

	$('.build_button').each(function()
	{

		$(this).click(function(event)
		{
			console.log("in bldbt click");
			if ($currentPack == '')
			{
				if ($loadedpacks.length > 0)
					$currentPack = $items[$loadedpacks[0]];
			}

			if ($currentPack == '')
			{

				$.mobile.changePage("#packs", {
					transition : "fade"
				});

				event.preventDefault();
				return false;
			} else
			{

				myWaitForImages(function()
				{

					console.log('Before bldbtn click show, all images loaded.');
					setTimeout(function()
					{
						// load
						// the
						// pack,
						// when
						// all
						// are
						// loaded,
						// transition
						// to
						// build
						console.log("before build show");

						loadPack($currentPack, true);

					}, 1000);

				}, function(loaded, count, success)
				{
					console.log("Loaded " + loaded + ' of ' + count + ' images has ' + (!success ? 'failed to load' : 'loaded') + '.');
				});

			}
			return true;
		});
	});

	$('#packsbtn').click(function(event)
	{
		console.log("in packs click");
		$.mobile.changePage("#packs", {
			transition : "fade"
		});
		event.preventDefault();
		return fasle;

	});

	$('#vaultbtn').click(function(event)
	{
		console.log("in packs vault");
		$.mobile.changePage("#vault", {
			transition : "fade"
		});
		event.preventDefault();

		return fasle;
	});
});

function loginToYak()
{
	$('.error').hide();

	var name = $("#username").val();

	if (name == "")
	{
		$("label#name_error").show();
		$("#name").focus();

		return false;
	}

	var password = $("#password").val();
	if (password == "")
	{
		$("label#password_error").show();
		$("input#password").focus();
		return false;
	}

	// cache the form element for use in this
	// function
	// var $this = $(this);
	// prevent the default submission of the form

	$is_logged_in = false;
	$('.logged-in-only').attr('disabled', '');

	$.ajax({
		url : '../yak/controllers/login.php',
		type : 'post',
		dataType : 'json',
		data : $('#loginform').serialize(),
		success : function(json)
		{
			// process the result
			if (json.errorcode == 0)
			{
				console.log("logged in!");

				$is_logged_in = true;

				process_user_info(json);

				$('#logged_in_msg').show();
				// myalert("User " + name + " logged in! userid=" + $userid);

				$('.logged-in-only').attr('disabled', '');

				displayUserName(name);
				// synch up user data
				afterLogin($userid);
				window.setTimeout(function()
				{
					chgPageAfterLoginOrShare();
				}, 2000);

			} else
			{
				serverAlert("Login failure", json);
				console.log("Login failure");
				console.log(json.errormsg);
			}
		},
		failure : function(data)
		{
			console.log("login failure");
		},
		complete : function(xhr, data)
		{
			if (xhr.status != 0 && xhr.status != 200)
				alert('Error calling server to login up. Status=' + xhr.status + " " + xhr.statusText);
		}
	});
}

function resetpwd()
{
	$.ajax({
		url : '../yak/controllers/reset_pwd.php',
		type : 'post',
		dataType : 'json',
		data : $('#resetpwdform').serialize(),
		success : function(json)
		{
			// process the result
			if (json.errorcode == 0)
			{
				console.log("Pwd reset request completed.");
				myalert("An email was sent to you to complete the reset process.");
			} else
			{
				serverAlert("Pwd reset request error", json);
				console.log("Pwd reset request error");
				console.log(json.errormsg);
			}
		},

		failure : function(data)
		{
			myalert("Pwd reset request failure");
		},

		complete : function(xhr, data)
		{
			if (xhr.status != 0 && xhr.status != 200)
				myalert('Error calling server to make Pwd reset request. Status=' + xhr.status + " " + xhr.statusText);
		}
	});
}

function signupToYak()
{
	$('.error').hide();
	var name = $("#signup_username").val();
	if (name == "")
	{
		$("label#signup_username_error").show();
		$("#signup_name").focus();
		return false;
	}

	var email = $('#email').val();
	if (email == "")
	{
		$("label#email_error").show();
		$("#email").focus();
		return false;
	}

	var password = $("#signup_password").val();
	if (password == "")
	{
		$("label#signup_password_error").show();
		$("input#signup_password").focus();
		return false;
	}

	var cpassword = $("#cpassword").val();
	if (cpassword == "")
	{
		$("label#cpassword_error").html("This field is required.").show();
		$("input#cpassword").focus();
		return false;

	} else if (cpassword != password)
	{
		$("label#cpassword_error").html("Passwords don't match.").show();
		$("input#cpassword").focus();
		return false;
	}

	// prevent the default submission of the form

	$is_logged_in = false;
	$('.logged-in-only').attr('disabled', '');

	$.ajax({
		url : '../yak/controllers/signup.php',
		type : 'post',
		dataType : 'json',
		data : $('#signupform').serialize(),
		success : function(json)
		{

			// process the result

			if (json.errorcode == 0)
			{
				console.log("logged in!");

				$is_logged_in = true;

				if (json.userid)
				{
					$userid = json.userid;
				}

				myalert("User " + name + " signed up! userid=" + $userid);

				$('.logged-in-only').attr('disabled', '');
				displayUserName(name);

				// synch up user data
				afterLogin($userid);
				chgPageAfterLoginOrShare();

			} else
			{
				serverAlert("Sign up failure", json);
				console.log("Sign up failure");
				console.log(json.errormsg);
			}
		},
		failure : function(data)
		{
			console.log("Sign up failure");
		},

		complete : function(xhr, data)
		{
			if (xhr.status != 0 && xhr.status != 200)
				myalert('Error calling server to sign up. Status=' + xhr.status + " " + xhr.statusText);
		}
	});
}

function displayUserName(uname)
{

	$('#homefooterbtns').hide();
	$('#homefooterbtns').children().hide();
	//$('#homefooterbtns_afterlogin,#homeftr_avatar').show();
	// $('#homefooterbtns_afterlogin a').css('display','block');

	//$('#homefooterbtns_afterlogin #user_name').html(uname);
	//$('#homefooterbtns_afterlogin').children().show();

	//$('#home_logout_btn').show();
//	$('#home_logout_btn').click(function(e)
//	{
//		// myalert("Log the user out");
//		reset_user_variables();
//
//		$is_logged_in = false;
//
//		$('#homefooterbtns').show();
//		$('#homefooterbtns').children().show();
//		// $('#homefooterbtns a').css('display','block');
//		//$('#homefooterbtns_afterlogin,#homeftr_avatar').hide();
//		//$('#home_logout_btn').hide();
//	});

	if ($avatar != null)
	{
		// avatars are in yakhq/img
		var rel_url = ($avatar.indexOf("yakhq") != -1) ? $avatar : '../yakhq/' + $avatar;

		$('.user_avatar').attr('src', rel_url);
	}

}

function getPassword()
{
	console.log("getPassword");
	$('.error').hide();
	var email = $('#forgotpwd_email').val();
	if (email == "")
	{
		$("label#forgotpwd_email_error").show();
		$("#forgotpwd_email").focus();
		return false;
	}
}

function checkAutoLogin()
{
	// cache the form element for use in this
	// function
	// var $this = $(this);

	// prevent the default submission of the form
	if ($is_logged_in)
	{
		console.log("checkAutoLogin: already logged in");
		return;
	}

	$.ajax({
		url : '../yak/controllers/checklogin.php',
		type : 'post',
		dataType : 'json',
		success : function(json)
		{
			// process the result
			if (json.errorcode == 0)
			{
				console.log(" auto logged in!");

				$is_logged_in = true;

				process_user_info(json);

				$('#logged_in_msg').show();
				// myalert("User " + name + " logged in! userid=" + $userid);

				$('.logged-in-only').attr('disabled', '');

				if (json.yakname)
					displayUserName(json.yakname);

				// synch up user data
				afterLogin($userid);

			} else if (json.errorcode == 1)
			{
				console.log("No previous login");
				console.log(json.errormsg);
			} else
			{
				serverAlert("Login check error", json);
				console.log("Login check error");
				console.log(json.errormsg);
			}
		},

		failure : function(data)
		{
			console.log("login check failure");
		},

		complete : function(xhr, data)
		{
			if (xhr.status != 0 && xhr.status != 200)
				alert('Error calling server to check login up. Status=' + xhr.status + " " + xhr.statusText);
		}
	});
}

function process_user_info(json)
{
	if (json.userid)
	{
		$userid = json.userid;
	}
	if (json.avatar)
	{
		$avatar = json.avatar;
	}
	if (json.is_kid)
	{
		$is_kid = json.is_kid;
	}
	if (json.is_parent)
	{
		$is_parent = json.is_parent;
	}
}

jQuery.resizeHome = function()
{
	console.log("resize home page " + $.mobile.activePage);
	return;

	// background image auto adjusts, but we need to move images accordingly
	var divheight = $('#home').outerHeight();

	if (divheight == 0)
		return;

	var scaleFactor = Math.max(Math.abs(Math.min(divheight / STD_HEIGHT, 1)), 0.5);

	console.log("scalefactor " + scaleFactor + '  divheight ' + divheight);
	$('#btn_vault').css('top', parseInt($('#btn_vault').attr('origtop')) * scaleFactor);

	$('#btn_packs').css('top', parseInt($('#btn_packs').attr('origtop')) * scaleFactor);

	$('#btn_build').css('top', parseInt($('#btn_build').attr('origtop')) * scaleFactor);

};
