/* Foundation v2.2.1 http://foundation.zurb.com */

var $is_logged_in = false;
var $userid = null;
var $userfname = '';
var $is_parent = false;
var $is_in_signup_process = false;
var $yaklogin = null;
var $my_avatar = null;
var $is_kid = 0;

function resetGlobal() {
	$is_logged_in = false;
	$userid = null;
	$userfname = '';
	$is_parent = false;
	$is_in_signup_process = false;
	$yaklogin = null;
	$my_avatar = null;
	$is_kid = 0;
}

function resetScreens() {
	// clear signup screen fields
	$('#signup form')[0].reset();
	$('#signup2 form')[0].reset();
	$('#signup3 form')[0].reset();
	$('#signup3a form')[0].reset();
	$('#signup3b form')[0].reset();
	$('#signup3c form')[0].reset();
	$('#signup3d form')[0].reset();
	$('#signup4 form')[0].reset();
	$('#signup5 form')[0].reset();
	$('.error').hide();
	// assume parent
	$('.yakbar_request_btn').parent().show();

	// dont show counters until they are > 0
	$('.notifycount').hide();

	resetAllDateSelectors();

}

$.urlParam = function(name) {
	var results = new RegExp('[\\?&]' + name + '=([^&#]*)')
			.exec(window.location.href);
	if (!results)
		return 0;
	if (results[1])
		return results[1];
	return 0;
};

jQuery(document)
		.ready(
				function($) {

					/* Use this js doc for all application specific JS */

					/* TABS --------------------------------- */
					/* Remove if you don't need :) */

					function activateTab($tab) {
						var $activeTab = $tab.closest('dl').find('a.active'), contentLocation = $tab
								.attr("href")
								+ 'Tab';

						// Strip off the current url that IE adds
						contentLocation = contentLocation.replace(/^.+#/, '#');

						// Make Tab Active
						$activeTab.removeClass('active');
						$tab.addClass('active');

						// Show Tab Content
						$(contentLocation).closest('.tabs-content').children(
								'li').hide();
						$(contentLocation).css('display', 'block');
					}

					$('dl.tabs').each(function() {
						// Get all tabs
						var tabs = $(this).children('dd').children('a');
						tabs.click(function(e) {
							activateTab($(this));
						});
					});

					if (window.location.hash) {
						activateTab($('a[href="' + window.location.hash + '"]'));
						$.foundation.customForms.appendCustomMarkup();
					}

					/* ALERT BOXES ------------ */
					$(".alert-box").delegate(
							"a.close",
							"click",
							function(event) {
								event.preventDefault();
								$(this).closest(".alert-box").fadeOut(
										function(event) {
											$(this).remove();
										});
							});

					/* PLACEHOLDER FOR FORMS ------------- */
					/*
					 * Remove this and jquery.placeholder.min.js if you don't
					 * need :)
					 */

					$('input, textarea').placeholder();

					/* TOOLTIPS ------------ */
					$(this).tooltips();

					/*
					 * UNCOMMENT THE LINE YOU WANT BELOW IF YOU WANT IE6/7/8
					 * SUPPORT AND ARE USING .block-grids
					 */
					// $('.block-grid.two-up>li:nth-child(2n+1)').css({clear:
					// 'left'});
					// $('.block-grid.three-up>li:nth-child(3n+1)').css({clear:
					// 'left'});
					// $('.block-grid.four-up>li:nth-child(4n+1)').css({clear:
					// 'left'});
					// $('.block-grid.five-up>li:nth-child(5n+1)').css({clear:
					// 'left'});
					/* DROPDOWN NAV ------------- */

					var lockNavBar = false;
					$('.nav-bar a.flyout-toggle').live('click', function(e) {
						e.preventDefault();
						var flyout = $(this).siblings('.flyout');
						if (lockNavBar === false) {
							$('.nav-bar .flyout').not(flyout).slideUp(500);
							flyout.slideToggle(500, function() {
								lockNavBar = false;
							});
						}
						lockNavBar = true;
					});
					if (Modernizr.touch) {
						$('.nav-bar>li.has-flyout>a.main').css({
							'padding-right' : '75px'
						});
						$('.nav-bar>li.has-flyout>a.flyout-toggle').css({
							'border-left' : '1px dashed #eee'
						});
					} else {
						$('.nav-bar>li.has-flyout').hover(function() {
							$(this).children('.flyout').show();
						}, function() {
							$(this).children('.flyout').hide();
						});
					}

					/* DISABLED BUTTONS ------------- */
					/*
					 * Gives elements with a class of 'disabled' a return:
					 * false;
					 */

				});

$(document).ready(function() {
	var bar = $('#headerSlideContainer');
	var top = bar.css('top');
	$(window).scroll(function() {
		if ($(this).scrollTop() > 50) {
			bar.stop().animate({
				'top' : '0px'
			}, 500);
		} else {
			bar.stop().animate({
				'top' : top
			}, 500);
		}
	});

	// var $container = $('#masonryfeed');

	// $container.imagesLoaded(function() {
	// $container.masonry({
	// itemSelector : '.box'
	// });
	// });

	// / login menu
	$('body').bind('hideOpenMenus', function() {
		$("ul:jqmData(role='menu')").find('li > ul').hide();
	});
	var menuHandler = function(e) {
		$('body').trigger('hideOpenMenus');
		$(this).find('li > ul').show();
		e.stopPropagation();
	};
	$("ul:jqmData(role='menu') li > ul li").click(function(e) {
		$('body').trigger('hideOpenMenus');
		e.stopPropagation();
	});
	$('body').delegate("ul:jqmData(role='menu')", 'click', menuHandler);
	$('body').click(function(e) {
		$('body').trigger('hideOpenMenus');
	});
	$('body').trigger('hideOpenMenus');

});

$(document)
		.ready(
				function() {

					$('.error').hide();
					
					// fill in fastlogin
					get_fastlogins();

					// initialize sliders: home, apps, appdetails
					$('#s0').cycle({
						fx : 'scrollHorz',
						speed : 'fast',
						timeout : 0,
						next : '#next0',
						prev : '#prev0'
					});
					$('#s1').cycle({
						fx : 'scrollHorz',
						speed : 'fast',
						timeout : 0,
						next : '#next1',
						prev : '#prev1'
					});
					$('#s2').cycle({
						fx : 'scrollHorz',
						speed : 'fast',
						timeout : 0,
						next : '#next2',
						prev : '#prev2'
					});

					$('#avatar_cycle').cycle({
						fx : 'scrollHorz',
						speed : 'fast',
						timeout : 0,
						next : '#avatars_next',
						prev : '#avatars_prev',
						before : onBefore

					});

					$('.avatar_image').live(
							'click',
							function(e, data) {
								// check to see if pending requests
								// TO DO
								e.preventDefault();
								console.log("clicked avatar image");
								var selected_avatar = $(this).find('img').attr(
										'src');
								$('.avatar_image.highlight_avatar')
										.removeClass('highlight_avatar');
								$(this).addClass('highlight_avatar');
								if ($my_avatar != selected_avatar) {
									$my_avatar = selected_avatar;
									$('.yakbar_user_img').attr('src',
											$my_avatar);
								}

								set_user_avatar($my_avatar);

							});

					// should be logged in already
					$('#hq').live(
							"pageshow",
							function(e, data) {
								// check to see if pending requests
								// TO DO
								console.log("pageshow #hq");
								if ($is_parent) {

									checkPendingKidVerificationRequest(
											verifyKidsPostLoginHandler,
											verifyKidsFailureHandler);
									return false;
								} else {
									$('.yakbar_request_btn').parent().hide();
								}
								return false;

							});

					$("#hq").live("pagebeforeshow", function(e, data) {
						if (!$userid) {
							alert("no logged in user");
							$.mobile.changePage($('#home'), {
								transition : "fade"
							});
						} else {

							// $('#yakbar_login_logout_btn').html('Log Out');
							$('#yakbar_user_img').show();

							// get request info for display in yakbar
							// yakbar_friend_req_count,
							// yakbar_approval_count, yakbar_notify_count
							$('.notifycount').hide();
							get_req_msg_note_counts();

						}
					});

					// TO DO
					$('#yakbar_notify_btn').click(function(e) {
						console.log("yakbar_notify_btn next  button clicked");

						return false;
					});

					$('#yakbar_login_logout_btn').click(function(e) {
						console.log("yakbar_login_logout_btn  button clicked");

						logoutYak();

						return false;
					});

					//
					// home button event handlers
					//
					$('.yaklogin_btn').click(function(e) {
						console.log("hdr_login_btn clicked");
						$('.error').hide();

						$.mobile.changePage($('#login'), {
							transition : "fade"
						});

						return false;
					});

					$('.profile_link').click(function(e) {
						console.log("profile_link clicked");

						friend_profile_handler($userid);

						return false;
					});

					$('.signup_btn').click(function(e) {
						console.log("signup_btn clicked");

						resetGlobal();
						resetScreens();

						$('.error').hide();

						$.mobile.changePage($('#signup'), {
							transition : "fade"
						});

						return false;
					});

					$('#login_next_btn').click(function(e) {
						console.log("login next  button clicked");
						$('.error').hide();

						loginHandler();

						return false;
					});

					$('#login').keypress(function(e) {
						if (e.which == 13) {
							jQuery(this).blur();
							jQuery('#login_next_btn').focus().click();
						}
					});

					$('#signup1_next_btn').click(function(e) {
						console.log("signup1 next  button clicked");
						$('.error').hide();

						signupToYak1();

						return false;
					});

					$('#signup2_next_btn').click(function(e) {
						console.log("signup2 next  button clicked");
						$('.error').hide();

						signupToYak2();

						return false;
					});

					$('#signup_child_done_btn')
							.click(
									function(e) {
										console
												.log("signup_child_done_btn next  button clicked");
										signupToYak3();

										return false;
									});

					$('#signup3a_next_btn').click(function(e) {
						console.log("signup3a next  button clicked");
						$('.error').hide();

						signupToYak3a();

						return false;
					});

					$('#signup3b_next_btn')
							.click(
									function(e) {
										console
												.log("signup3b_next_btn next  button clicked");

										$('#add_child_btn')
												.addClass('disabled');

										if (new_user.is_adult) {
											// check if parent
											$.mobile.changePage($('#signup3c'),
													{
														transition : "fade"
													});
										} else {
											// log in and goto home
											// nonparent adult. log in to home
											$is_parent = false;
											loginToYak(new_user.login,
													new_user.password,
													gotoHome, loginFailure);
										}

										return false;
									});

					$('#is_parent').click(
							function(e) {
								console.log("is_parent  button clicked");
								new_user.is_parent = true;
								new_user.kid_count = 0;
								$is_parent = true;

								// check to see if there are pending requests
								checkPendingKidVerificationRequest(
										verifyKidsHandler,
										verifyKidsFailureHandler);

							});

					$('#is_parent_no').click(
							function(e) {
								console.log("is_parent  button clicked");
								new_user.is_parent = true;
								new_user.kid_count = 0;
								$is_parent = false;
								// log in and goto home
								// nonparent adult. log in to home
								loginToYak(new_user.login, new_user.password,
										gotoHome, loginFailure);

							});

					$('#yes_add_another_child_btn')
							.click(
									function(e) {
										console
												.log("yes_add_another_child_btn  button clicked");

										if (new_user.is_parent) {

											// reset the form
											$('#addchild_form')
													.find(
															'input:text, input:password, input:file, select')
													.val('');
											$('#addchild_form')
													.find(
															'input:radio, input:checkbox')
													.removeAttr('checked')
													.removeAttr('selected');
											$('#radio_child_is_boy').attr(
													'checked', 'checked');
											$('#select-choice-month-child')
													.prop('selectedIndex', 0);
											$('#select-choice-day-child').prop(
													'selectedIndex', 0);
											$('#select-choice-year-child')
													.prop('selectedIndex', 0);

											$is_parent = true;
											$.mobile.changePage($('#signup4'),
													{
														transition : "fade"
													});
										} else
											alert('Sorry, only parents can add children');

									});

					$('#kids_verified_btn')
							.click(
									function(e) {
										console
												.log("kids_verified_btn clicked");
										new_user.is_parent = true;
										new_user.kid_count = 0;
										$is_parent = true;

										// TODO: process verification
										// iterate through each
										// to-be-verified-kid, update data
										// on server
										//
										var kid_arr = [];

										$('#kid_requests li')
												.each(
														function() {
															var item = $(this);
															var kidrequest = item
																	.data('kidrequest');

															// TODO, kidrequests
															// are screwed up
															if (kidrequest) {
																console
																		.log("ready to process kidrequest ");

																// create json
																// array
																// of kid
																// requests
																// with
																// appropriate
																// value for
																// is_my_kid
																// item.find('#radio_is_parent_yes
																// ').value() ==
																// "is_parent"
																var pval = $(
																		"input[type='radio']:checked",
																		this)
																		.val();

																kidrequest.is_my_kid = (pval == "is_parent");
																kid_arr
																		.push(kidrequest);
															}

														});

										// if kid_arr h
										if (kid_arr.length > 0) {
											// verify the kids
											// TODO

											verify_or_reject(kid_arr);
											return false;
										}

										// make sure to update number of
										// children added
										// TODO put in real count
										new_user.kid_count = 1;

										if ($is_in_signup_process) {
											// go see if there are more children
											$.mobile.changePage($('#signup5'),
													{
														transition : "fade"
													});
										} else {
											$.mobile.changePage($('#hq'), {
												transition : "fade",
												type : "post",
												data : {
													userid : $userid,
													userfname : $userfname
												}
											});

										}

									});

					$('#no_add_another_child_btn, #skip_add_child_btn')
							.click(
									function(e) {
										console
												.log("no_add_another_child_btn or skip_add_child_btn clicked");
										if (new_user.kid_count == 0)
											loginToYak(new_user.login,
													new_user.password,
													gotoHome, loginFailure);
										else
											parentVerifyCharge($userid);
									});

					$('#signup3c_next_btn')
							.click(
									function(e) {
										console
												.log("signup3c_next_btn next  button clicked");

										new_user.is_parent = $(
												'#radio_is_parent_yes').is(
												':checked');
										new_user.kid_count = 0;

										if (new_user.is_parent) {
											signupParent();
										} else {
											// nonparent adult. log in to home
											$is_parent = false;
											loginToYak(new_user.login,
													new_user.password,
													gotoHome, loginFailure);
										}
										return false;
									});

					$('#add_next_child_btn')
							.click(
									function(e) {
										console
												.log("add_next_child_btn next  button clicked");

										// validate the input
										$('.error').hide();

										var login = $("#childYakName").val();
										if (login == "") {
											$("label#childYakName_error")
													.show();
											$("input#childYakName").focus();
											return false;
										}

										var fname = $("#childYakFname").val();
										if (fname == "") {
											$("label#childYakFname_error")
													.show();
											$("input#childYakFname").focus();
											return false;
										}

										var password = $("#add_child_password")
												.val();
										if (password == "") {
											$("label#add_child_cpassword_error")
													.text(
															"This field is required.");
											$("label#add_child_password_error")
													.show();
											$("input#add_child_password")
													.focus();
											return false;
										}

										var cpassword = $("#child_cpassword")
												.val();
										if (cpassword != password) {
											$("label#add_child_cpassword_error")
													.text(
															"Passwords don't match!");
											$("label#add_child_cpassword_error")
													.show();
											$("input#add_child_cpassword")
													.focus();
											return false;
										}

										var byear = $(
												'#select-choice-year-child :selected')
												.val();
										var bmonth = $(
												'#select-choice-month-child :selected')
												.val();
										var bday = $(
												'#select-choice-day-child :selected')
												.val();
										var bdatestr = bday + '/' + bmonth
												+ '/' + byear;

										if (!checkdate(bdatestr)) {
											$("label#bday_error").show();
											return false;
										}

										// save this child, then reload screen
										new_kid = new Object();

										new_kid.login = login;
										new_kid.fname = fname;
										new_kid.password = password;
										new_kid.cpassword = cpassword;
										new_kid.bday = byear + '-' + bmonth
												+ '-' + bday;
										new_kid.is_boy = $('#radio-is-boy').is(
												':checked');
										new_kid.is_adult = false;
										new_kid.is_parent = false;
										new_kid.is_kid = true;
										new_kid.userid = $userid;

										// save this child, then reload screen
										addChildOnYak(new_kid,
												addedChildHandler,
												addedChildFailureHandler);
									});

					$('#verify_parent_acct_btn')
							.click(
									function(e) {
										console
												.log("verify_parent_acct_btn next  button clicked");

										// verify the account
										$('.error').hide();

										var login = $("#cardname").val();
										if (login == "") {
											$("label#cardname_error").show();
											$("input#cardname").focus();
											return false;
										}

										var fname = $("#cardnumber").val();
										if (fname == "") {
											$("label#cardnumber_error").show();
											$("input#cardnumber").focus();
											return false;
										}

										var byear = $(
												'#select-choice-year-cc :selected')
												.val();
										var bmonth = $(
												'#select-choice-month-cc :selected')
												.val();
										var bday = 1; // fixed

										var bdatestr = bday + '/' + bmonth
												+ '/' + byear;

										if (!checkdate(bdatestr)) {
											$("label#ccdate_error").show();
											return false;
										}

										// TODO: add verification

										alert("Add Credit Card Processing here.");

										if (!$('#agree_terms').is(':checked')) {

											$("label#agree_terms_error").show();
											return false;
										}

										// log user in
										loginToYak(new_user.login,
												new_user.password, gotoHome,
												loginFailure);

										return false;
									});

					$('#signup').live('pagebeforeshow', function(event) {
						$('.error').hide();

					});
					$('#signup2').live('pagebeforeshow', function(event) {
						$('.error').hide();

					});
					$('#signup3').live('pagebeforeshow', function(event) {
						$('.error').hide();

					});

					$('.notification_btn').click(function(e) {
						console.log("notification_btn clicked");

						load_notifications();

						return false;
					});

					$('.yakbar_request_btn').click(function(e) {
						console.log("yakbar_request_btn clicked");

						load_approvals();

						return false;
					});

					$('.yakbar_friend_req_btn').click(
							function(e) {
								console.log("yakbar_friend_req_btn clicked");

								checkPendingFriendRequests(
										friendRequestHandler,
										friendRequestFailureHandler);

								return false;
							});

					$('.activity_btn').click(function(e) {
						console.log("notification_btn clicked");

						get_user_activity();
						// get activity data for user and all my friends
						// get_activity_data(friends[fid],
						// friend_profile_success_handler,
						// std_failure_handler);

						return false;
					});

					$('#hq_friends_btn').click(function(e) {
						console.log("hq_friends_btn clicked");

						get_friend_list();

						return false;
					});

					$('.friend_profile_btn')
							.live(
									'click',
									function(e) {
										e.preventDefault();
										var fid = $(this).attr('fid');

										if (typeof friends[fid] == 'undefined') {
											alert("No friend in friends list for index "
													+ fid);
											return false;
										}

										var target_id = friends[fid];

										console
												.log("friend profile button clicked "
														+ fid
														+ " target_id "
														+ target_id);

										friend_profile_handler(target_id);

										return false;
									});
					
					$('.refresh_activity').live(
							'click',
							function(e) {
								e.preventDefault();
								get_user_activity();
								
							});

					$('.profilebtn')
							.live(
									'click',
									function(e) {
										e.preventDefault();
										var user_post = $(this).data(
												'user_post');
										if (user_post == undefined) {
											alert("undefined user_post for button");
											return false;
										}

										var target_id = user_post.user_id;

										console
												.log("activity profile button clicked - target_id "
														+ target_id);

										friend_profile_handler(target_id);

										return false;
									});

					$('.commentor').live(
							'click',
							function(e) {
								e.preventDefault();
								var target_id = $(this).attr('commentor_id');

								console.log("commentor profile button clicked "
										+ target_id);

								friend_profile_handler(target_id);

								return false;
							});

					// add friend
					$('#add_friend_next_btn').click(function(e) {
						console.log("add_friend_next_btn clicked");

						add_friend_handler();

						return false;
					});

					$('.add_friend_btn').click(function(e) {
						console.log("add_friend_btn clicked");

						$.mobile.changePage($('#addFriend'), {
							transition : "fade",
							type : "post"
						});

						return false;
					});
					
					// post approval handlers
					
					
					$('.approve_button').live(
							'click',
							function(e) {
								e.preventDefault();
								console
										.log("post approval button clicked "
												+ this.id);

								
								approve_post_handler(e, this, 1);

								return false;
							});

					$('.deny_button').live(
							'click',
							function(e) {
								e.preventDefault();
								console
										.log("post approval button clicked "
												+ this.id);

								
								approve_post_handler(e, this, 0);

								return false;
							});

					// friend management handlers
					$(
							'.kidapprovebtn, .kidrejectbtn, .kidrejectflagbtn, .kidemailparentbtn')
							.live(
									'click',
									function(e) {
										e.preventDefault();
										console
												.log("friend mgmt button clicked "
														+ this.id);

										kid_friendmgmt_handler(e, this);

										return false;
									});

					$('.approvebtn, .rejectbtn').live('click', function(e) {
						e.preventDefault();
						console.log("friend mgmt button clicked " + this.id);

						friendmgmt_handler(e, this);

						return false;
					});

					// set up status message typeahead
					$("#userstatus")
							.autocomplete(
									{
										source : "../yak/controllers/search_status_messages.php",
										select : function(event, ui) {
											$('#userstatus').val(ui.item.label);
											$('#userstatus_val')
													.val(ui.item.id);
										}
									});

					$('#userstatus_post_btn').live('click', function(e) {

						// get the value from the hidden field userstatus_val
						var user_status_id = $('#userstatus_val').val();
						console.log("selected status msg # " + user_status_id);
						post_status_message(user_status_id);
					});

					// post comment, like and other button handlers
					$('.likebtn')
							.live(
									'click',
									function(e) {
										e.preventDefault();
										var likeit = $(this).html() == 'Like';
										var user_post = $(this).data(
												'user_post');
										if (user_post) {
											console.log("clicked like "
													+ user_post.user_post_id);
											likebtn_handler(user_post, likeit);
										} else
											console
													.log("clicked like but no user_post data");

										$(this)
												.html(
														likeit ? 'Unlike'
																: 'Like');
										// if (user_post.likecount_id) {
										// var likecount_id =
										// user_post.likecount_id;
										// var likecount = $('#' +
										// likecount_id).html();
										// if (likeit) {
										// // TODO increment count
										//
										// likecount++;
										// } else {
										//
										// likecount--;
										// }
										// $('#' +
										// likecount_id).html(likecount);
										// }
									});
					$('.commentbtn')
							.live(
									'click',
									function(e) {
										e.preventDefault();
										var user_post = $(this).data(
												'user_post');

										if (user_post) {
											console.log("clicked comment "
													+ user_post.user_post_id);
										} else
											console
													.log("clicked comment but no user_post data!");

										commentbtn_handler(user_post);

									});

					$('.otherbtn').live('click', function(e) {
						e.preventDefault();
						var user_post = $(this).data('user_post');
						console.log("clicked other " + user_post.user_post_id);
						otherbtn_handler(user_post);

					});

					$('.getCommentsAnchor').live(
							'click',
							function(e) {
								e.preventDefault();
								var comment_text = $(this).text();
								console.log("clicked comment " + comment_text);

								// post comment
								var scripted_comment = $(this).data(
										'scripted_comment');
								if (scripted_comment) {
									post_scripted_comment(scripted_comment);
								}

								$('#getCommentsModal').trigger('reveal:close');

							});

					// get the scripted comments
					get_scripted_comments();

				});

var new_user = new Object();
var new_kid = null;

function signupToYak1() {

	$('.error').hide();

	var name = $("#yak_user_name").val();
	if (name == "") {
		$("label#signup_username_error").html('This field is required.').show();
		$("#yak_user_name").focus();
		return false;
	}

	var fname = $("#yak_user_fname").val();
	if (fname == "") {
		$("label#signup_userfname_error").show();
		$("#yak_user_fname").focus();
		return false;
	}

	$.ajax({
		url : '../yak/controllers/check_uniq_id.php',
		type : 'post',
		dataType : 'json',
		data : {
			login : name
		},
		success : function(json) {
			// process the result
			if (json.errorcode == 0) {
				console.log("uniq user name!");

				new_user.login = name;
				new_user.fname = fname;

				$.mobile.changePage($('#signup2'), {
					transition : "fade"
				});

			} else {
				$("label#signup_username_error").html(
						'Name is not unique, try again').show();
			}
		},
		failure : function(data) {
			alert("Error checking unique user name: ", data);
			console.log("Failure checking unique user name.");
		},
		complete : function(xhr, data) {
			if (xhr.status != 0 && xhr.status != 200)
				alert('Error calling server to check unique user name. Status='
						+ xhr.status + " " + xhr.statusText);
		}
	});

	return false;

}

function signupToYak2() {

	var byear = $('#select-choice-year :selected').val();
	var bmonth = $('#select-choice-month :selected').val();
	var bday = $('#select-choice-day :selected').val();
	var bdatestr = bday + '/' + bmonth + '/' + byear;

	if (!checkdate(bdatestr)) {
		$("label#bday_error").show();
		return false;
	}

	new_user.bday = byear + '-' + bmonth + '-' + bday;
	new_user.is_boy = $('#radio-is-boy').is(':checked');
	new_user.is_adult = (byear < 1994);
	new_user.is_parent = false;
	new_user.is_kid = false;
	$is_parent = false;

	// TODO make year variable
	if (byear >= 1999) {
		new_user.is_kid = true;

		$.mobile.changePage($('#signup3'), {
			transition : "fade"
		});
	} else {

		$.mobile.changePage($('#signup3a'), {
			transition : "fade"
		});
	}

	return false;

}

function signupToYak3() {

	// cache the form element for use in this function
	$('.error').hide();

	var password = $("#child_password").val();
	if (password == "") {
		$("label#child_password_error").show();
		$("input#child_password").focus();
		return false;
	}

	var cpassword = $("#child_cpassword").val();
	if (cpassword != password) {
		$("label#child_cpassword_error").text("Passwords don't match!");
		$("label#child_cpassword_error").show();
		$("input#child_cpassword").focus();
		return false;
	}

	var child_parent_email = $("#child_parent_email").val();
	if (child_parent_email == "") {
		$("label#child_parent_email_error").show();
		$("input#child_parent_email").focus();
		return false;
	}

	new_user.email = child_parent_email;
	new_user.password = password;
	new_user.cpassword = cpassword;
	//
	// we have all the new child user registration info
	// call signin
	//

	goSignUp(kidSignupHandler, kidSignupFailureHandler);
}

function signupParent() {
	// check to see if there are pending requests
	var ckey = $.urlParam('request_key');
	if (ckey) {
		// this is from a verify sign in
		// TO DO
		// see if there is really some pending verification requests
		checkPendingVerifRequests(ckey);
	} else {
		$.mobile.changePage($('#signup4'), {
			transition : "fade"
		});
	}
}

function checkPendingVerifRequests(ckey) {
	// if there are requests, then show the new verification screen
	//
	console.log("TO DO: check pending requests");
	$.mobile.changePage($('#signup4'), {
		transition : "fade"
	});
}

function kidSignupHandler(json) {
	if (json.userid) {
		$userid = json.userid;
	}

	myalert("Child " + name + " signed up! userid=" + $userid);

	//
	loginToYak(new_user.login, new_user.password, gotoHome, loginFailure);

}

function kidSignupFailureHandler(json) {
	serverAlert("Sign up error", json);
	console.log("Sign up error");
	if (json)
		console.log(json.errormsg);

	if (json && json.errorcode && (json.errorcode == 1 || json.errorcode == 2))
		gotoHome(json.userid, json.fname);
}

function signupFailureHandler(json) {

	serverAlert("Sign up failure", json);
	console.log("Sign up failure");
	if (json && json.errormsg)
		console.log(json.errormsg);
}

function afterAdultLogin() {
	$('#add_child_btn').addClass('disabled');

	$.mobile.changePage($('#signup3c'), {
		transition : "fade"
	});
}

function adultSignupHandler(json) {
	if (json.userid) {
		$userid = json.userid;
	}
	var astatus = (new_user.is_adult) ? 'Adult' : 'Tween';
	myalert(astatus + ' ' + new_user.fname + " signed up! userid=" + $userid);

	// user is signed up
	$.mobile.changePage($('#signup3b'), {
		transition : "fade"
	});
}

function afterSocialMediaConnect() {
	if (new_user.is_adult) {
		console.log("after social media connect: go check if parent");
		$('#add_child_btn').addClass('disabled');
		$.mobile.changePage($('#signup3c'), {
			transition : "fade"
		});

	} else {
		console.log("after social media connect: is tween, go login");
		loginToYak(new_user.login, new_user.password, gotoHome, loginFailure);
	}
}

function goSignUp(signupHandler, signupFailureHandler) {
	$is_logged_in = false;
	// $('.logged-in-only').attr('disabled', '');

	var url = (new_user.is_kid) ? '../yak/controllers/signup_kid.php'
			: '../yak/controllers/signup.php';
	$.ajax({
		url : url,
		type : 'post',
		dataType : 'json',
		data : new_user,
		success : function(json) {
			// process the result
			if (json.errorcode == 0) {
				console.log("signed up!");
				if (signupHandler)
					signupHandler(json);
				else
					alert('Need signupHandler');
			} else {

				if (signupFailureHandler)
					signupFailureHandler(json);
				else
					alert('Need signupFailureHandler');

			}
		},
		failure : function(data) {
			alert("Sign up failure " + data);
			if (signupFailureHandler)
				signupFailureHandler(null);
		},
		complete : function(xhr, data) {
			if (xhr.status != 0 && xhr.status != 200) {
				myalert('Error calling server to sign up. Status=' + xhr.status
						+ " " + xhr.statusText);
				if (signupFailureHandler)
					signupFailureHandler(null);
			}
		}
	});
}

function checkPendingKidVerificationRequest(successHandler, failureHandler) {
	if (!$is_parent) {
		console.log("checkPendingKidVerificationRequest but not parent.");
		successHandler();
	}

	var url = '../yak/controllers/checkPendingKidRequests.php';
	$.ajax({
		url : url,
		type : 'post',
		dataType : 'json',
		data : {
			userid : $userid
		},
		success : function(json) {
			// process the result
			if (json.errorcode == 0) {
				console.log("got verification data for the kids!");
				if (successHandler)
					successHandler(json);
				else
					alert('Need successHandler');
			} else {

				if (failureHandler)
					failureHandler(json);
				else
					alert('Need failureHandler');

			}
		},
		failure : function(data) {
			alert("Sign up failure " + data);
			if (failureHandler)
				failureHandler(json);
		},
		complete : function(xhr, data) {
			if (xhr.status != 0 && xhr.status != 200) {
				myalert('Error calling server to sign up. Status=' + xhr.status
						+ " " + xhr.statusText);
				if (failureHandler)
					failureHandler();
			}
		}
	});
}

function verifyKidsPostLoginHandler(json) {

	if (json.kidrequests && json.kidrequests.length > 0) {
		addKidRequests(json);

		// $('#kid_requests').listview('refresh');
		$.mobile.changePage($('#confirm_your_kids'), {
			transition : "fade"
		});

	} else // no pending requests
	{
		console.log("no pending kid requests");
		return false;
	}
}

function addKidRequests(json) {
	for ( var x = 0; x < json.kidrequests.length; x++) {
		console.log("Add kid data to list");

		var kidrequest = json.kidrequests[x];
		var reqid = 'kidreq_' + kidrequest.child_id;

		// Brian: kid request page: classes: kidrequest_avatar,kidrequest_name
		var html = '<li id="' + reqid + '">';
		if (kidrequest.avatar)
			html += '<img class="kidrequest_avatar"src="' + kidrequest.avatar
					+ '" />';

		if (kidrequest.login)
			html += '<label class="kidrequest_name">' + kidrequest.login
					+ '</label>';

		var not_label = "radio_not_my_kid" + +kidrequest.child_id;
		var yes_label = "radio_is_my_kid" + +kidrequest.child_id;
		var radio_name = "radio_verify_kid" + +kidrequest.child_id;

		html += '<div data-role="fieldcontain"><fieldset data-role="controlgroup">\n';
		html += '<input type="radio" name="' + radio_name + '"	id="'
				+ not_label + '" ';
		html += 'value="not_parent" checked="checked"';
		html += 'data-theme="b" /> <label for="' + radio_name + '">No</label>';
		html += '<input type="radio" name="' + radio_name + '"	id="'
				+ yes_label + '" ';
		html += 'value="is_parent" data-theme="b" />';
		html += '<label for="' + radio_name + '">Yes</label></fieldset></div>';

		$('#kid_requests').append(html + "</li>");
		$('#' + reqid).data('kidrequest', kidrequest);

	}
}

function verifyKidsHandler(json) {
	if (json.kidrequests && json.kidrequests.length > 0) {
		addKidRequests(json);

		$.mobile.changePage($('#confirm_your_kids'), {
			transition : "fade"
		});
		// $('#kid_requests').listview('refresh');
	} else // no pending requests
	{
		$.mobile.changePage($('#signup4'), {
			transition : "fade"
		});

	}
}

function verifyKidsFailureHandler(json) {
	serverAlert("verifyFailureHandler failure", json);
	console.log("verifyFailureHandler up failure");
	console.log(json.errormsg);

	$.mobile.changePage($('#signup4'), {
		transition : "fade"
	});

}

function checkPendingFriendRequests(successHandler, failureHandler) {

	var url = '../yak/controllers/checkPendingFriendRequests.php';
	$.ajax({
		url : url,
		type : 'post',
		dataType : 'json',
		data : {
			userid : $userid
		},
		success : function(json) {
			// process the result
			if (json.errorcode == 0) {
				console.log("got Friend Request data!");
				if (successHandler)
					successHandler(json);
				else
					alert('Need successHandler');
			} else {

				if (failureHandler)
					failureHandler(json);
				else
					alert('Need failureHandler');

			}
		},
		failure : function(data) {
			alert("Sign up failure " + data);
			if (failureHandler)
				failureHandler(json);
		},
		complete : function(xhr, data) {
			if (xhr.status != 0 && xhr.status != 200) {
				myalert('Error calling server to sign up. Status=' + xhr.status
						+ " " + xhr.statusText);
				if (failureHandler)
					failureHandler();
			}
		}
	});
}

function friendRequestHandler(json) {

	if (json.friendrequests
			&& json.kidfriendrequests
			&& (json.friendrequests.length > 0 || json.kidfriendrequests.length > 0)) {
		setupFriendRequests(json);

		// $('#kid_requests').listview('refresh');
		$('#approveFriendRequestModal').reveal();

	} else // no pending requests
	{
		console.log("no pending Friend requests");
		return false;
	}
}

function friendRequestFailureHandler(json) {
	serverAlert("friendRequestFailureHandler failure", json);
	console.log("friendRequestFailureHandler up failure");
	console.log(json.errormsg);

	$.mobile.changePage($('#hq'), {
		transition : "fade"
	});

}

function setupFriendRequests(json) {
	$('#kid_friend_requests').empty();
	$('#friend_requests').empty();

	if (json.friendrequests.length > 0)
		$('#friendRequestsDiv').show();
	else
		$('#friendRequestsDiv').hide();

	for ( var x = 0; x < json.friendrequests.length; x++) {
		console.log("Add Friend Request data to list");

		// Brian: friend requests: classes:friendrequest,friend_req_text,friend_req_relationship
		// friend_req_status_div,approve_friend_btns,approvebtn,rejectbtn

		var k = json.friendrequests[x];
		var reqid = 'friendreq_' + k.user_friend_id;
		var approve_reqid = 'approvefriendreq_' + k.user_friend_id;
		var reject_reqid = 'rejectfriendreq_' + k.user_friend_id;

		var html = '<li id="' + reqid + '" class="friendrequest">';
		var isFriend1Initiator = (k.initiating_friend_id == k.friend1_id);
		var initiator_id = k.friend1_id;
		var initiator_fname = k.friend1_fname;
		var initiator_yaklogin = k.friend1_yaklogin;
		var target_id = k.friend2_id;
		var target_fname = k.friend2_fname;
		var target_yaklogin = k.friend2_yaklogin;
		var reqstatus = 'Pending';

		if (!isFriend1Initiator) {
			initiator_id = k.friend2_id;
			initiator_fname = k.friend2_fname;
			initiator_yaklogin = k.friend2_yaklogin;
			target_id = k.friend1_id;
			target_fname = k.friend1_fname;
			target_yaklogin = k.friend1_yaklogin;
		}

		// Brian: friend requests: classes 
		var html = '<li id="' + reqid + '"><div class="row">';
		html += '<div class="friend_req_text">' + initiator_fname
				+ ' wants to be your friend</div>';
		if (k.relationship == null)
			k.relationship = 'Not Specified';

		html += '<div class="friend_req_relationship">' + initiator_fname
				+ ' says they know you as ' + k.relationship + '</div>';

		html += '<div class="friend_req_status_div"> Status: <div class="friend_req_status">'
				+ reqstatus + '</div></div>';

		html += '<div class="approve_friend_btns">';
		html += '<a href="#" class="approvebtn small button" id="'
				+ approve_reqid + '">Approve</a>';
		html += '<a href="#" class="rejectbtn small button" id="'
				+ reject_reqid + '">Reject</a>';
		html += '</div>';

		$('#friend_requests').append(html + "</div></li>");
		$('#' + reqid).data('friendrequest', k);

	}

	if (json.kidfriendrequests.length > 0)
		$('#kidRequestsDiv').show();
	else
		$('#kidRequestsDiv').hide();

	for ( var x = 0; x < json.kidfriendrequests.length; x++) {
		console.log("Add Friend Request data to list");

		// Brian: kid friend request classes: kidfriendrequest,friend_req_text,friend_req_relationship
		// friend_req_status_div,friend_req_status,approve_friend_btns,kidapprovebtn,kidrejectbtn,
		// kidrejectflagbtn,kidemailparentbtn
		
		var k = json.kidfriendrequests[x];
		var reqid = 'kidfriendreq_' + k.user_friend_id;
		var approve_reqid = 'approvekidfriendreq_' + k.user_friend_id;
		var reject_reqid = 'rejectkidfriendreq_' + k.user_friend_id;
		var flag_reqid = 'flagkidfriendreq_' + k.user_friend_id;
		var email_reqid = 'emailkidfriendreq_' + k.user_friend_id;

		var html = '<li id="' + reqid + '" class="kidfriendrequest">';
		var isFriend1Initiator = (k.initiating_friend_id == k.friend1_id);
		var initiator_id = k.friend1_id;
		var initiator_fname = k.friend1_fname;
		var initiator_yaklogin = k.friend1_yaklogin;
		var target_id = k.friend2_id;
		var target_fname = k.friend2_fname;
		var target_yaklogin = k.friend2_yaklogin;

		if (!isFriend1Initiator) {
			initiator_id = k.friend2_id;
			initiator_fname = k.friend2_fname;
			initiator_yaklogin = k.friend2_yaklogin;
			target_id = k.friend1_id;
			target_fname = k.friend1_fname;
			target_yaklogin = k.friend1_yaklogin;
		}

		html += '<div class="friend_req_text">' + initiator_fname
				+ ' wants to be the friend of ' + target_fname + '</div>';
		if (k.relationship == null)
			k.relationship = 'Not Specified';
		html += '<div class="friend_req_relationship">' + initiator_fname
				+ ' says they know each other as ' + k.relationship + '</div>';

		html += '<div class="friend_req_status_div"> Status: <div class="friend_req_status">'
				+ reqstatus + '</div></div>';

		html += '<div class="approve_friend_btns">';
		html += '<a href="#" class="kidapprovebtn small button" id="'
				+ approve_reqid + '">Approve</a>';
		html += '<a href="#" class="kidrejectbtn small button" id="'
				+ reject_reqid + '">Reject</a>';
		html += '<a href="#" class="kidrejectflagbtn small button" id="'
				+ flag_reqid + '">Reject and Flag Request as Suspect</a>';
		html += '<a href="#" class="kidemailparentbtn small button" id="'
				+ email_reqid + '">Email other Parent</a>';
		html += '</div>';

		$('#kid_friend_requests').append(html + "</li>");
		$('#' + reqid).data('kidfriendrequest', k);

	}

}

function verify_or_reject(kidrequests) {

	var url = '../yak/controllers/verify_kid_in_app.php';
	$
			.ajax({
				url : url,
				type : 'post',
				dataType : 'json',
				data : {
					userid : $userid,
					kidrequests : kidrequests
				},
				success : function(json) {
					// process the result
					if (json.errorcode == 0) {
						console
								.log("successfully processed verify request on server!");

					} else {

						serverAlert(
								"Error processing child verification requests on server. ",
								json);
						console
								.log("Error processing child verification requests on server");
						console.log(json.errormsg);
					}
					after_kid_verify();
				},
				failure : function(data) {
					alert("Processing child verification requests failure "
							+ data);
					after_kid_verify();
				},
				complete : function(xhr, data) {
					if (xhr.status != 0 && xhr.status != 200) {
						myalert("Processing child verification requests failure, status = "
								+ xhr.status + " " + xhr.statusText);
						after_kid_verify();
					}
				}
			});

}

function after_kid_verify() {
	// make sure to update number of
	// children added
	// TODO put in real count
	// new_user.kid_count = 1;

	if ($is_in_signup_process) {
		// go see if there are more children
		$.mobile.changePage($('#signup5'), {
			transition : "fade"
		});
	} else {
		$.mobile.changePage($('#hq'), {
			transition : "fade",
			type : "post",
			data : {
				userid : $userid,
				userfname : $userfname
			}
		});

	}
}

function signupToYak3a() {

	// cache the form element for use in this function
	$('.error').hide();

	var password = $("#password").val();
	if (password == "") {
		$("label#password_error").show();
		$("input#password").focus();
		return false;
	}

	var cpassword = $("#cpassword").val();
	if (cpassword != password) {
		$("label#cpassword_error").text("Passwords don't match!");
		$("label#cpassword_error").show();
		$("input#cpassword").focus();
		return false;
	}

	var email = $("#email").val();
	if (email == "") {
		$("label#email_error").show();
		$("input#email").focus();
		return false;
	}

	new_user.email = email;
	new_user.password = password;
	new_user.cpassword = cpassword;
	//
	// we have all the new non-kid user registration info
	// call signin
	//
	goSignUp(adultSignupHandler, signupFailureHandler);
	return false;

}

function signupToYakTween() {
	// tween. log in to home
	goSignUp(adultSignupHandler, signupFailureHandler);

}

function signupToYakAdult() {
	// tween. log in to home
	goSignUp(adultSignupHandler, signupFailureHandler);

}

function loginHandler() {

	// cache the form element for use in this function
	$('.error').hide();

	var login = $("#login_id").val();
	if (login == "") {
		$("label#login_id_error").html('This field is required.').show();
		$("#login_id").focus();
		return false;
	}

	var password = $("#login_password").val();
	if (password == "") {
		$("label#login_password_error").show();
		$("input#login_password").focus();
		return false;
	}

	new_user = new Object();
	new_user.login = login;
	new_user.password = password;

	loginToYak(new_user.login, new_user.password, gotoHome, loginFailure);
}

function get_req_msg_note_counts() {
	// get notifications

	$
			.ajax({
				url : '../yak/controllers/get_req_msg_note_counts.php',
				type : 'post',
				dataType : 'json',
				data : {
					user_id : $userid
				},
				success : function(json) {
					// process the result
					if (json.errorcode == 0) {
						console.log("got req_msg_note_counts!");

						// put data on page
						reset_yakbar_friend_req_count(json.friend_req_count);
						reset_yakbar_request_count(json.approval_count);
						reset_yakbar_notify_count(json.notify_count);

					} else {

						serverAlert(
								"Error retrieving user req_msg_note_counts",
								json);
						console
								.log("Error retrieving user req_msg_note_counts");
						console.log(json.errormsg);

					}
				},
				failure : function(data) {
					alert("Failure retrieving user req_msg_note_counts");
				},
				complete : function(xhr, data) {
					if (xhr.status != 0 && xhr.status != 200)
						alert('Error calling server to retrieve user req_msg_note_counts. Status='
								+ xhr.status + " " + xhr.statusText);
				}
			});
}

function reset_yakbar_notify_count(cnt) {
	$('div#yakbar_notify_count').each(function() {
		if (cnt > 0) {
			$(this).html(cnt).show();
		} else
			$(this).hide();
	});
}

function reset_yakbar_friend_req_count(cnt) {
	$('div#yakbar_friend_req_count').each(function() {

		if (cnt > 0) {
			$(this).html(cnt).show();
		} else
			$(this).hide();
	});
}

function reset_yakbar_request_count(cnt) {
	$('div#yakbar_request_count').each(function() {

		if (cnt > 0) {
			$(this).html(cnt).show();
		} else
			$(this).hide();
	});
}

function addedChildHandler(json) {
	if (json.userid) {
		myalert("added child, userid = " + json.userid);
	}

	new_user.kid_count++;

	$.mobile.changePage($('#signup5'), {
		transition : "fade"
	});
}

function addedChildFailureHandler(json) {
	serverAlert("addedChild failure", json);
	console.log("addedChild up failure");
	console.log(json.errormsg);
}

function addChildOnYak(new_kid, addedChildHandler, addedChildFailureHandler) {
	$.ajax({
		url : '../yak/controllers/addchild.php',
		type : 'post',
		dataType : 'json',
		data : new_kid,
		success : function(json) {
			// process the result
			if (json.errorcode == 0) {
				console.log("added kid up!");
				if (addedChildHandler)
					addedChildHandler(json);
				else
					alert('Need addedChildHandler');
			} else if (json.errorcode == 1) {
				$("label#childYakName_error").html(
						'Name is not unique, try again').show();
			} else {

				if (addedChildFailureHandler)
					addedChildFailureHandler(json);
				else
					alert('Need addedChildFailureHandler');

			}
		},
		failure : function(data) {
			alert("Add child failure " + data);
			if (addedChildFailureHandler)
				addedChildFailureHandler(json);
		},
		complete : function(xhr, data) {
			if (xhr.status != 0 && xhr.status != 200) {
				myalert('Error calling server to add child. Status='
						+ xhr.status + " " + xhr.statusText);
				if (addedChildFailureHandler)
					addedChildFailureHandler(json);
			}
		}
	});

}

function load_notifications_success_handler(json) {
	console.log("got notifications!");

	// put data on page
	var item = '';
	jQuery
			.each(
					json.notifications,
					function() {
						var notification = $(this)[0];
						var avatar = notification.avatar;
						if (avatar == null || avatar.length == 0)
							avatar = "./img/avatar_0.jpg";

						var options = notification.options;
						if (typeof options != undefined) {
							console.log("notification options: " + options);
						}

						// Brian: notification code
						// Classes: notification_div,notification_avatar_div,notification_body,notification_clock_div,notification_date
						item += '<li><div class="row"><div class="notification_div eight columns centered ">';

						item += '<div class="one columns notification_avatar_div"><img class="" src="'
								+ avatar + '" /></div>';

						item += '<div class="notification_body nine columns">';
						item += notification.message;
						item += '</div>';

						item += '<div class="notification_clock_div one columns"><img src="./img/icon_datetime.png" ></div>';

						item += '<div class="one columns notification_date">';
						item += notification.created_delta;
						item += '</div>';

						item += '</div></div></li>';

					});

	$('#notifications_list').empty().html(item);
	reset_yakbar_notify_count(0);

	// goto #notifications
	$.mobile.changePage($('#notifications'), {
		transition : "fade",
		type : "post"
	});
}

function load_notifications() {

	// get notifications
	var inputdata = {
		user_id : $userid
	};

	post_ajax('../yak/controllers/get_user_notifications.php', inputdata,
			load_notifications_success_handler, std_failure_handler);

}

function load_approvals_success_handler(json) {
	console.log("got approvals!");

	// put data on page
	var item = '';
	jQuery
			.each(
					json.notifications,
					function() {
						var notification = $(this)[0];

						var avatar = notification.avatar;
						if (avatar == null)
							avatar = "./img/avatar_0.jpg";

						var options = jQuery.parseJSON(notification.options);
//						if (typeof options != undefined) {
//							console.log("notification options: " + options);
//						}

						
						// TODO: Brian: notifications have classes of notification_div, notification_avatar_div,
						// notification_body, notification_body_message,
						item += '<li><div class="row"><div class="notification_div eight columns centered ">';

						item += '<div class="one columns notification_avatar_div"><img class="" src="'
								+ avatar + '" /></div>';

						item += '<div class="notification_body nine columns">';

						item += '<div class="notification_body_message twelve columns">';
						item += notification.message;
						item += '</div>';

						// TODO: based on type of approval required, show one or
						// more buttons
						// kid's content (status message and weirdoid can be
						// approved or denied
						// kid's comments and likes can be be denied

//						console.log("notification_const :"
//								+ options.notification_const);
						var show_approve_btn = false;
						var show_deny_btn = false;
						var approve_data = [];

						switch (options.notification_const) {
							case 'CHILD_POSTED_CONTENT':
								// get the type of content
								if (options.post_type_id == 1) // weirdoid
								{
									var imgname = options.imgname;
									var fname = options.fname;
									var lname = options.lname;
									console.log("imgname = " + imgname + " fname "+ fname);
									
									// Brian: weirdoid in notification approval
									// classes: approval_weirdoid_div,approval_weirdoid,approval_weirdoid_name
									item += '<div class="approval_weirdoid_div twelve columns">';
									item += '<div class="approval_weirdoid three columns"><img src="' + imgname + '"></div>';
									item += '<div class="approval_weirdoid_name three columns">' + fname + ' ' + lname + '</div>';
									item += '<div class="six columns"></div>';
									item += '</div>';
									show_approve_btn = true;
									show_deny_btn = true;
									approve_data["user_post_id"] = options.user_post_id;
									
								} 
								break;
							case 'CHILD_CHANGED_STATUS' :
									// status message
									var msg = options.msg;
//									item += '<div class="approval_status_div twelve columns">';
//									item += '<div class="approval_status three columns">' + msg + '</div>';
//									item += '<div class="nine columns"></div>';
//									item += '</div>';
									//show_approve_btn = true;
									show_deny_btn = true;
									approve_data["user_post_id"] = options.user_post_id;
					
								break;
							default:
	
								break;
						}

						if (options.is_parent_actionable > 0
								&& (show_approve_btn || show_deny_btn)) {

							// Brian: buttons in notification approval
							// classes: approval_buttons_div,approve_button,deny_button,approval_status

							item += '<div class="approval_buttons_div twelve columns">';
							if (show_approve_btn)
								item += '<a href="#" class="approve_button small radius red button" upid="' + options.user_post_id + '">Approve</a>';
							if (show_deny_btn)
								item += '<a href="#" class="deny_button small radius red button" upid="' + options.user_post_id + '">Deny</a>';
							item += '<div class="approval_status two columns">' + get_approved_status_value(options.is_approved)  + '</div>';
							item += '</div>';

						}

						item += '</div>'; // notification_body

						// Brian: clock/time 
						// classes: notification_clock_div,notification_date

						item += '<div class="notification_clock_div one columns"><img src="./img/icon_datetime.png" ></div>';

						item += '<div class="one columns notification_date">';
						item += notification.created_delta;
						item += '</div>';

						item += '</div></li>';

					});
	$('#approvals_list').empty().html(item);
	reset_yakbar_request_count(0);

	// goto #notifications
	$.mobile.changePage($('#approvals'), {
		transition : "fade",
		type : "post"
	});
}

function get_approved_status_value(is_approved) 
{
	var approved_status = "Pending";
	if (is_approved == 1)
		approved_status = "Approved";
	else if (is_approved == 0)
		approved_status = "Denied";
	return approved_status;
}

function load_approvals() {

	// get notifications
	var inputdata = {
		user_id : $userid
	};

	post_ajax('../yak/controllers/get_child_approval_requests.php', inputdata,
			load_approvals_success_handler, std_failure_handler);

}

function checkdate(value) {
	var validformat = /^\d{2}\/\d{2}\/\d{4}$/; // Basic check for format
	// validity

	if (!validformat.test(value))
		return false;

	var dayfield = value.split("/")[0];
	var monthfield = value.split("/")[1];
	var yearfield = value.split("/")[2];
	var dayobj = new Date(yearfield, monthfield - 1, dayfield);
	if ((dayobj.getMonth() + 1 != monthfield) || (dayobj.getDate() != dayfield)
			|| (dayobj.getFullYear() != yearfield))
		return false;
	else
		return true;
};

function serverAlert(error, json) {
	var alertmsg = error + "\n\r";
	if (json.errormsg)
		alertmsg += json.errormsg + '\n\r';
	if (json.errmsg_arr) {
		jQuery.each(json.errmsg_arr, function() {
			alertmsg = alertmsg.concat(this + "\n\r");
		});

	}
	alert(alertmsg);
}

function isValidEmailAddress(emailAddress) {
	var pattern = new RegExp(
			/^(("[\w-+\s]+")|([\w-+]+(?:\.[\w-+]+)*)|("[\w-+\s]+")([\w-+]+(?:\.[\w-+]+)*))(@((?:[\w-+]+\.)*\w[\w-+]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][\d]\.|1[\d]{2}\.|[\d]{1,2}\.))((25[0-5]|2[0-4][\d]|1[\d]{2}|[\d]{1,2})\.){2}(25[0-5]|2[0-4][\d]|1[\d]{2}|[\d]{1,2})\]?$)/i);
	return pattern.test(emailAddress);
};

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
	alert(message);
}

function gotoHome(userid, fname) {
	$userfname = fname;
	$userid = userid;

	// see if there may be pending requests
	// TO DO
	console.log("TO DO: check for pending requests " + userid + ' name '
			+ fname + ' is_parent ' + $is_parent);
	// check to see if there are pending requests
	// if parent, see if there are requests from kids
	// verifykid, buy, credits, friends, permissions, etc
	// if ($is_parent) {
	// checkPendingKidVerificationRequest(verifyKidsPostLoginHandler,
	// verifyKidsFailureHandler);
	// return false;
	// }

	$('.yakbar_user_fname').html($yaklogin);
	var tmp_id = Math.floor(Math.random() * 4);
	var avatar = "./img/avatar_" + tmp_id + ".jpg";
	if ($my_avatar == null)
		$my_avatar = avatar;
	else
		avatar = $my_avatar;

	$('.yakbar_user_img').attr('src', avatar);

	$.mobile.changePage($("#hq"), {
		transition : "fade",
		type : "post",
		allowSamePageTransition : true,
		data : {
			userid : userid,
			userfname : fname
		}
	});

	return false;

}

function preGotoHome(userid, fname) {

}
function logoutYak() {
	$userid = null;
	$userfname = null;
	$is_logged_in = false;
	$yaklogin = null;

	$('#yakbar_login_logout_btn').html('Log In');
	$('#yakbar_user_img').hide();
}

function loginFailure(json) {
	serverAlert("Login failure", json);
	console.log("Login failure");
	console.log(json.errormsg);
}

function loginToYak(name, password, successcb, failurecb) {

	if (!name || !password) {
		alert("Can't log in: null login or password.");
		return;
	}
	$.ajax({
		url : '../yak/controllers/login.php',
		type : 'post',
		dataType : 'json',
		data : {
			login : name,
			password : password
		},
		success : function(json) {
			// process the result
			if (json.errorcode == 0) {
				console.log("logged in to yak!");
				$is_logged_in = true;
				if (json.userid) {
					$userid = json.userid;
					$userfname = json.fname;
					$yaklogin = json.yaklogin;
					$is_parent = (json.is_parent > 0);
					$my_avatar = json.avatar;
					highlight_avatar($my_avatar);
					$is_kid = json.is_kid;
				}

				if (successcb) {
					successcb(json.userid, json.fname);
				} else {
					// default login success
					alert("need login successcb");
				}

			} else {

				if (failurecb) {
					failurecb(json);
				} else {
					alert("need failurecb");
				}

			}
		},
		failure : function(data) {
			alert("login failure");
		},
		complete : function(xhr, data) {
			if (xhr.status != 0 && xhr.status != 200)
				alert('Error calling server to login up. Status=' + xhr.status
						+ " " + xhr.statusText);
		}
	});
}

function resetDateSelectors(page) {
	page
			.find(
					'.childyearselect,.yearselect,.ccyearselect,.monthselect,.dayselect')
			.each(function() {
				$(this).prop('selectedIndex', 0);
				$(this).selectmenu().selectmenu("refresh", true);
			});

}

function resetAllDateSelectors() {
	$('.childyearselect,.yearselect,.ccyearselect,.monthselect,.dayselect')
			.each(function() {
				$(this).prop('selectedIndex', 0);
				$(this).selectmenu().selectmenu("refresh", true);
			});

}

function get_user_activity_success_handler(json) {
	console.log("Retrieved list of posts in get_user_activity_success_handler");

	var target_div = $('#weirdoid_post_list');

	display_user_posts(target_div, 'activity', json);

	// goto
	$.mobile.changePage($('#activity'), {
		transition : "fade",
		type : "post"
	});

}

function get_profile_activity_success_handler(json) {

	console
			.log("Retrieved list of posts in get_profile_activity_success_handler");

	// set up info about user
	var is_friend = false;

	if (json.user_data) {
		if (json.user_data["is_friend"])
			is_friend = parseInt(json.user_data["is_friend"]) > 0;

		$('#profile_avatar').attr('src', json.user_data["avatar"]);
		$('#profile_yaklogin').text(json.user_data["yaklogin"]);
		$('#profile_friend_count').text(Math.floor(Math.random() * 21));
		// $('#profile_photo_count').text(Math.floor(Math.random() * 13));
		$('#profile_likes_count').text(Math.floor(Math.random() * 57));
	}

	var target_div = $('#profile_weirdoid_post_list');
	if (is_friend)
		display_user_posts(target_div, 'profile', json);
	else
		console.log("Don't show posts for non-friend "
				+ json.user_data["yaklogin"]);

	// goto
	$.mobile.changePage($('#profile'), {
		transition : "fade",
		type : "post"
	});

}

function SortByUnixTimestampDesc(a, b) {
	var ats = a.unix_created;
	var bts = b.unix_created;

	return ((ats < bts) ? 1 : ((ats > bts) ? -1 : 0));
}

function display_user_posts(target_div, id_prefix, json) {

	console.log("in display_user_posts");

	// sort the posts by datetime
	var posts = [];

	if (json.gallery) {

		jQuery.each(json.gallery, function(objidx) {

			var post = [];
			post["post_type_id"] = this.post_type_id;
			post["unix_created"] = this.unix_created;
			post["objidx"] = objidx;
			post["object"] = this;
			posts.push(post);
		});
	}

	if (json.status_updates) {

		jQuery.each(json.status_updates, function(objidx) {

			var post = [];
			post["post_type_id"] = this.post_type_id;
			post["unix_created"] = this.unix_created;
			post["objidx"] = objidx;
			post["object"] = this;
			posts.push(post);
		});
	}

	// sort them
	posts.sort(SortByUnixTimestampDesc);

	target_div.empty();

	if (posts.length == 0) {
		target_div.append("<h1>No Posts Found</h1>");
		return;
	}

	for ( var x = 0; x < posts.length; x++) {
		var nxtpost = posts[x];

		display_post(target_div, id_prefix, nxtpost.object, x,
				parseInt(nxtpost.post_type_id));
	}

}

function display_status_msg_post(target_div, message) {
	console.log("displaying user status message post for: " + message.yaklogin
			+ " msg: " + message.message);

	// Brian: status message post has class of status_msg_post

	myhtml = '<div class="status_msg_post">' + message.message + '</div>';

	return myhtml;
}

function display_post_header(profile_btn_id, avatar, yaklogin, daysago, hrsago,
		minsago, secsago) {
	
	// Brian: here is the post header for both weirdoids and status messages
	// Classes: posthrd, profilebtn, icon_datetime, gallery-age

	var myhtml = '';
	myhtml += '<div class="posthdr row">';
	myhtml += '<div class="two mobile-one columns"><a href="#" class="profilebtn" id="'
			+ profile_btn_id + '"><img src="' + avatar + '"/></a></div>';
	myhtml += '<div class="six mobile-two columns">' + yaklogin + '</div>';
	myhtml += '<div class="two mobile-one columns"><img src="./img/icon_datetime.png" class="icon_datetime"></div>';

	var tunit = '';
	if (daysago && daysago > 0) {
		tunit = daysago + 'd';
	} else if (hrsago && hrsago > 0) {
		tunit = hrsago + 'h';
	} else if (minsago && minsago > 0) {
		tunit = minsago + 'm';
	} else if (secsago && secsago > 0)
		tunit = secsago + 's';

	myhtml += '<div class="two mobile-one columns gallery-age">' + tunit
			+ '</div>';

	myhtml += '</div>'; // post header
	return myhtml;
}

function display_post(target_div, id_prefix, post, objidx, post_type_id) {

	var docroot = "../weirdoids/";
	// var docroot = "http://yrcreative.com/clients/yakbooks/weirdoids/";
	// var docroot = "http://yak.com/yakbooks/weirdoids/";

	var likecount = 0;
	var yaklogin = post.yaklogin; // TODO
	// get
	// correct
	// name
	var like_btn_id = id_prefix + '_like_' + objidx;
	var comment_btn_id = id_prefix + '_comment_' + objidx;
	var other_btn_id = id_prefix + '_other_' + objidx;
	var likecount_id = id_prefix + '_likecount_' + objidx;
	var post_id = id_prefix + '_post_' + objidx;
	var profile_btn_id = id_prefix + '_profile_btn_id_' + objidx;

	if (post['likes'])
		likecount = post['likes'];
	
	/*
	 * TODO: Brian look here! class: post_post
	 * 
	 */

	var myhtml = '<li><div class="post_post" id="' + post_id + '">';

	myhtml += display_post_header(profile_btn_id, post.avatar, yaklogin,
			post.daysago, post.hrsago, post.minsago, post.secsago);

	// post content
	switch (post_type_id) {
	case 1:
		// weirdoid post
		// Brian: image has class of gallery-image
		myhtml += '<img src="' +  post["url"]
				+ '" class="gallery-image" ><br>';

		var wholename = " ";
		if (post.fname && post.fname.length > 0)
			wholename = post.fname;
		if (post.lname && post.lname.length > 0) {
			if (wholename.length > 0) {
				wholename += ' ';
			}
			wholename += post.lname;
		}
		
		// Brian: weirdoid name has class of gallery-name
		if (wholename.length > 0)
			myhtml += '<div class="gallery-name">' + wholename + '</div>';
		break;
	case 2:
		// status msg post
		myhtml += display_status_msg_post(target_div, post);
		break;
	default:
		console.log("unknown post type: " + nxtpost.post_type_id);
		alert("unknown post type: " + nxtpost.post_type_id);
		break;
	}

	// post comments
	myhtml += display_post_comments(post, like_btn_id, comment_btn_id,
			other_btn_id, likecount_id, likecount);

	// complete post div and li
	myhtml += '</div></li>';

	target_div.append(myhtml);

	post.likecount_id = likecount_id;
	post.post_id = post_id;
	post.like_btn_id = like_btn_id;

	$('#' + like_btn_id).data('user_post', post);
	$('#' + comment_btn_id).data('user_post', post);
	$('#' + other_btn_id).data('user_post', post);
	$('#' + profile_btn_id).data('user_post', post);
}

function display_post_comments(post, like_btn_id, comment_btn_id, other_btn_id,
		likecount_id, likecount) {
	
	// Brian: post comments: classes: like_comment_btns,likebtn,commentbtn,otherbtn
	// post_likes_comments,post_likes,post_comments,post_comments_list
	var myhtml = '<div class="like_comment_btns">';
	var btntext = (post.user_liked_already > 0) ? 'Unlike' : 'Like';
	myhtml += '<a href="#" class="likebtn small button" id="' + like_btn_id
			+ '">' + btntext + '</a>';
	myhtml += '<a href="#" class="commentbtn small button" id="'
			+ comment_btn_id + '">Comment</a>';
	myhtml += '<a href="#" class="otherbtn small button" id="' + other_btn_id
			+ '">...</a>';
	myhtml += '</div>';

	myhtml += '<div class="post_likes_comments" >';

	myhtml += '<div class="post_likes row">';
	myhtml += '<div class="three mobile-one columns ">';
	myhtml += '<img src="img/icon_like.png" />';
	myhtml += '</div>';
	myhtml += '<div class="nine mobile-three columns ">';
	myhtml += '<span id="' + likecount_id + '">' + likecount + '</span>';
	myhtml += '<span> Likes</span></div>';
	myhtml += '</div>';

	// 
	myhtml += '<div class="post_comments row comment">';

	myhtml += '<div class="two mobile-one columns ">';
	myhtml += '<img src="img/icon_comment.png" />';
	myhtml += '</div><div class="nine mobile-four columns">';
	myhtml += '<ul class="post_comments_list">';

	if (post['comments']) {
		var comments = post['comments'];
		if (!comments)
			comments = [];

		for ( var i = 0; i < comments.length; i++) {
			var comment = comments[i];

			// iterate through
			// comments
			myhtml += get_comment_html(comment);
		}
	}

	myhtml += '</ul>';

	myhtml += '</div></div>';

	return myhtml;

}

function get_user_activity() {

	$('#weirdoid_post_list').empty();

	var inputdata = {
		userid : $userid,
		target_id : $userid,
		getfriends : 1
	};

	post_ajax('../yak/controllers/get_user_activity.php', inputdata,
			get_user_activity_success_handler, std_failure_handler);

}

function refresh_post_activity_success_handler(json) {
	console.log("Retrieved activity data for this user_post");
	// console.log("$current_user_post = " + $current_user_post.user_post_id
	// + ' user_post_id ' + user_post.user_post_id);
	if (json.user_post_data) {

		var user_post_data = json.user_post_data;

		if (!$current_user_post) {
			alert("no current user post selected.");
			return;
		}

		// get the update like count and comments
		if (user_post_data['likes'])
			likecount = user_post_data['likes'];

		// find the associated div
		if (!$current_user_post.post_id) {
			alert("no current post_id.");
			return;
		}

		var wdiv = $('#' + $current_user_post.post_id);

		// update the like count
		if (!$current_user_post.likecount_id) {
			alert("no current likecount_id.");
			return;
		}
		$('#' + $current_user_post.likecount_id).html(likecount);

		if (!user_post_data['user_liked_already']) {
			alert("no current user_liked_already.");
			return;
		} else {
			var btntext = (user_post_data['user_liked_already'] > 0) ? 'Unlike'
					: 'Like';
			$('#' + $current_user_post.like_btn_id).text(btntext);
		}

		// find the comments, empty them
		var clist = wdiv.find('.post_comments_list:first');
		if (!clist) {
			alert("no current clist.");
			return;
		}
		clist.empty();

		// loop through comments

		var myhtml = ' ';
		var comments = [];

		if (user_post_data['comments']) {
			comments = user_post_data['comments'];
			if (!comments)
				comments = [];

			for ( var i = 0; i < comments.length; i++) {
				var comment = comments[i];

				// iterate through
				// comments
				myhtml += get_comment_html(comment);

			}

			clist.append(myhtml);
		}
	}
}

function refresh_post_activity(user_post) {

	var inputdata = {
		user_post_id : user_post.user_post_id,
		userid : $userid
	};

	post_ajax('../yak/controllers/refresh_post_activity.php', inputdata,
			refresh_post_activity_success_handler, std_failure_handler);
}

function likebtn_handler_success_handler(json) {
	var likes = '?';

	if (json.likes)
		likes = json.likes;

	$('#' + $current_user_post.likecount_id).html(likes);
}

function likebtn_handler(user_post, likeit) {

	// TOOD increase like count for this user_post.user_post_id

	if (!user_post || !user_post.user_post_id) {
		alert("Can't like: null user_post data.");
		return;
	}

	$current_user_post = user_post;

	var inputdata = {
		userid : $userid,
		user_post_id : user_post.user_post_id,
		like : likeit
	};

	post_ajax('../yak/controllers/like_post.php', inputdata,
			likebtn_handler_success_handler, std_failure_handler);
}

var $current_user_post = null;

function commentbtn_handler(user_post) {

	// TOOD get comment for this user_post.user_post_id
	if (user_post != null) {
		$current_user_post = user_post;

		$('#getCommentsModal').reveal();
	}

}

function get_comment_html(comment) {
	var comment_html = ' ';

	// Brian: comment text
	// classes: post_comment,commentor
	if (comment && comment['comment_text']) {

		comment_html += '<li class="post_comment">';
		comment_html += '<div class="ten mobile-three columns ">';
		if (comment['yaklogin'])
			comment_html += '<a href="#" class="commentor" commentor_id="'
					+ comment['user_id'] + '">' + comment['yaklogin'] + '</a>';
		comment_html += ' ' + comment['comment_text'];

		comment_html += '</div></li>';
	}
	return comment_html;
}

function post_scripted_comment_success_handler(json) {
	console.log("posted scripted comment!");

	refresh_post_activity($current_user_post);
}

function post_scripted_comment(scripted_comment) {

	// TOOD increase like count for this user_post.user_post_id

	if (!scripted_comment) {
		alert("Can't post comment: null scripted_comment data.");
		return;
	}

	if (!$current_user_post || !$current_user_post.user_post_id) {
		alert("Can't post comment: null user_post data.");
		return;
	}

	var inputdata = {
		userid : $userid,
		user_post_id : $current_user_post.user_post_id,
		scripted_comment_id : scripted_comment.scripted_comment_id
	};

	post_ajax('../yak/controllers/post_scripted_comment.php', inputdata,
			post_scripted_comment_success_handler, std_failure_handler);

}

function otherbtn_handler(user_post) {

	// TOOD do something this user_post.user_post_id

}

function get_scripted_comments_success_handler(json) {
	if (json.scripted_comments) {

		jQuery.each(json.scripted_comments, function(idx) {
			// create image
			var sc = this;

			var anchor_id = 'sc_' + idx;
			// var scripted_comment_id = -1;

			if (sc['scripted_comment_id'])
				scripted_comment_id = sc['scripted_comment_id'];

			// Brian: comments list elements: classes: getCommentsListItem,getCommentsAnchor
			var myhtml = '<li class="getCommentsListItem">';
			myhtml += '<a class="getCommentsAnchor"	href="#" id="' + anchor_id
					+ '" >' + sc['comment_text'] + '</a></li>';
			$('#getCommentsList').append(myhtml);

			$('#' + anchor_id).data('scripted_comment', this);
		});
	}
}

function get_scripted_comments() {

	$('#getCommentsList').empty();

	var inputdata = null;
	var options = {
		function_name : "get_scripted_comments"
	};

	post_ajax('../yak/controllers/get_scripted_comments.php', inputdata,
			get_scripted_comments_success_handler, std_failure_handler, options);
}

function add_friend_handler_success_handler(json) {
	console.log("Made friend request!");

	alert("Friend Request made!");
	$("#friendlogin_id").val("");
}

function add_friend_handler() {
	console.log("in add_friend_handler");

	// TODO

	$('.error').hide();

	var name = $("#friendlogin_id").val();
	if (name == "") {
		$("label#friendlogin_id_error").html('This field is required.').show();
		$("#friendlogin_id").focus();
		return false;
	}

	var inputdata = {
		login : name,
		userid : $userid
	};

	post_ajax('../yak/controllers/add_friend.php', inputdata,
			add_friend_handler_success_handler, std_failure_handler);

	return false;

}

/*
 * 
 * var userStatusMessages = [ { label : "I'm playing Weirdoids", user_status_id :
 * "1" }, { label : "Yak is fun!", user_status_id : "2" }, { label : "What's
 * going on?", user_status_id : "3" }, { label : "Hello everyone!",
 * user_status_id : "4" }, { label : "Who wants to play?", user_status_id : "5" }, {
 * label : "What a great day!", user_status_id : "6" }, { label : "Wowzers",
 * user_status_id : "7" }, { label : "Moo.", user_status_id : "8" }, { label :
 * "Hmm...", user_status_id : "9" }, { label : "What's up?", user_status_id :
 * "10" }, { label : "=)", user_status_id : "11" }, { label : "Hi!",
 * user_status_id : "12" } ];
 */

var currentFriendRequestContainer = null;

function friendmgmt_handler_success_handler(json) {
	console.log("Friend mgmt cmd handled successfully!");

	// TODO change current status of friend, update window
	if (json.friendstatus) {
		// find status box
		if (currentFriendRequestContainer != null) {
			currentFriendRequestContainer.find('.friend_req_status').text(
					json.friendstatus);
		}
	}

}

function friendmgmt_handler(evt, evtbtn) {

	currentFriendRequestContainer = null;

	var btn = $(evtbtn);

	console.log("in friendmgmt_handler" + btn);

	var container = btn.closest('li');
	if (!container) {
		alert("null friend request container");
		return;
	}

	var fr_req = container.data('friendrequest');
	if (!fr_req) {
		alert("null friend request data");
		return;
	}

	currentFriendRequestContainer = container;

	var cmd = 'Approve';
	if (btn.hasClass('rejectbtn'))
		cmd = 'Reject';

	// send data to server
	var inputdata = {
		userid : $userid,
		fr_req : fr_req,
		cmd : cmd
	};

	post_ajax('../yak/controllers/approve_friend.php', inputdata,
			friendmgmt_handler_success_handler, std_failure_handler);

}

function kid_friendmgmt_handler(evt, evtbtn) {

	currentFriendRequestContainer = null;

	var btn = $(evtbtn);

	console.log("in kid_friendmgmt_handler" + btn);

	var container = btn.closest('li');
	if (!container) {
		alert("null friend request container");
		return;
	}

	var fr_req = container.data('kidfriendrequest');
	if (!fr_req) {
		alert("null kid friend request data");
		return;
	}

	currentFriendRequestContainer = container;

	var cmd = 'Approve';
	if (btn.hasClass('kidrejectbtn'))
		cmd = 'Reject';
	else if (btn.hasClass('kidrejectflagbtn'))
		cmd = 'RejectFlag';
	else if (btn.hasClass('kidemailparentbtn')) {
		cmd = 'EmailParent';

		// TODO call email client
	}

	// send data to server

	$.ajax({
		url : '../yak/controllers/approve_friend_for_kid.php',
		type : 'post',
		dataType : 'json',
		data : {
			userid : $userid,
			fr_req : fr_req,
			cmd : cmd
		},
		success : function(json) {
			// process the result
			if (json.errorcode == 0) {
				console.log("Friend mgmt cmd handled successfully!");

				// TODO change current status of friend, update window
				if (json.friendstatus) {
					// find status box
					if (currentFriendRequestContainer != null) {
						currentFriendRequestContainer
								.find('.friend_req_status').text(
										json.friendstatus);
					}
				}

			} else {
				serverAlert("Friend Request error", json);
			}
		},
		failure : function(data) {
			alert("Error adding friend: ", data);
			console.log("Failure checking unique user name.");
		},
		complete : function(xhr, data) {
			if (xhr.status != 0 && xhr.status != 200)
				alert('Error calling server to add friend. Status='
						+ xhr.status + " " + xhr.statusText);
		}
	});

}

var friends = null;

function get_friend_list_success_handler(json) {
	console.log("got friends!");

	// put data on page
	var item = '';
	var fid = 0;
	friends = [];

	jQuery.each(json.friends, function() {
		var friend = $(this)[0];
		if (friend.avatar == null) {
			// TODO - figure out default avatar
			var tmp_id = Math.floor(Math.random() * 4);
			friend.avatar = "./img/avatar_" + tmp_id + ".jpg";
		}
		// Brian: friend list buttons: class: friend_profile_btn
		item += '<li><a href="#" class="friend_profile_btn" fid="' + fid
				+ '"><img src="' + friend.avatar + '" />' + friend.yaklogin
				+ '</a></li>';
		friends.push(friend.user_id);
		fid++;
	});
	$('#friend_list').empty().html(item);

	// goto #notifications
	$.mobile.changePage($('#friends'), {
		transition : "fade",
		type : "post"
	});

}

function std_failure_handler(json, options) {

	var funcname = "unknown server function";
	var opt_msg = "";
	if (typeof options != 'undefined') {
		if (options.function_name != null)
			funcname = options.function_name;
		if (options.bad_msg)
			opt_msg = options.bad_msg;
	}

	var emsg = "Call to " + funcname + " server returned error. " + opt_msg;

	serverAlert(emsg, json);
	console.log(emsg);
	console.log(json.errormsg);

}

function std_success_handler(json, options) {

	var funcname = "unknown server function";
	var good_msg = "";
	if (typeof options != 'undefined') {
		if (options.function_name != null)
			funcname = options.function_name;
		if (options.good_msg)
			good_msg = options.good_msg;
	}
	var emsg = "Call to " + funcname + " server succeeded. " + good_msg;

	console.log(emsg);
}

function get_friend_list() {
	friends = null;

	// get activity data for user

	var inputdata = {
		user_id : $userid
	};

	post_ajax('../yak/controllers/get_friend_list.php', inputdata,
			get_friend_list_success_handler, std_failure_handler);

}

function friend_profile_handler(target_id) {

	console.log("in friend_profile_handler " + target_id);

	if (typeof friends == 'undefined')
		friends = [];

	// get activity data for friend only

	$('#profile_weirdoid_post_list').empty();

	var inputdata = {
		userid : $userid,
		target_id : target_id,
		getfriends : 0
	};

	post_ajax('../yak/controllers/get_user_activity.php', inputdata,
			get_profile_activity_success_handler, std_failure_handler);

	// get_activity_data(friends[fid], friend_profile_success_handler,
	// std_failure_handler);

}

function friend_profile_success_handler(json) {
	// TODO put data on profile page

	// goto #profile
	$.mobile.changePage($('#profile'), {
		transition : "fade",
		type : "post"
	});
}

// function get_activity_data(target_id, success_handler, failure_handler) {
// // send data to server
// var inputdata = {
// userid : $userid,
// target_id : target_id
// };
//
// post_ajax('../yak/controllers/get_activity_data.php', inputdata,
// success_handler, failure_handler);
//
// }

function post_ajax(url, inputdata, success_handler, failure_handler, options) {
	// send data to server

	if (typeof inputdata == 'undefined')
		inputdata = {};

	$.ajax({
		url : url,
		type : 'post',
		dataType : 'json',
		data : inputdata,
		success : function(json) {
			// process the result
			if (json.errorcode == 0) {
				console.log("post_ajax handled successfully!");

				// TODO change current status of friend, update window
				if (success_handler) {
					return success_handler(json, options);
				}

			} else {
				serverAlert("post_ajax server reported error", json);
				if (failure_handler) {
					return failure_handler(json, options);
				}
			}
		},
		failure : function(data) {
			alert("Failure reported for post_ajax: ", data);
			console.log("Failure post_ajax.");
		},
		complete : function(xhr, data) {
			if (xhr.status != 0 && xhr.status != 200)
				alert('Error calling server to post_ajax. Status=' + xhr.status
						+ " " + xhr.statusText);
		}
	});

}

function get_fastlogins() {

	// get default fast logins
	$
			.ajax({
				url : "fastlogins.json",
				type : 'post',
				dataType : 'json',
				success : function(json) {
					// process the result
					var user_pwds = json.fastlogins;
					var html = "";
					for ( var i = 0; i < user_pwds.length; i++) {
						html += '<li data-icon="false"><a href="#" class="fastlogin_name">'
								+ user_pwds[i] + '</a></li>';
					}
					$('.fastlogin_ul').empty().append(html);

					$('.fastlogin_name')
							.click(
									function(e) {
										e.preventDefault();
										console.log("fastlogin_name clicked");

										var txt = $(this).text();
										var arrayOfStrings = txt.split("|");
										var login = arrayOfStrings[0];
										var password = (arrayOfStrings.length > 1) ? arrayOfStrings[1]
												: "ddd";

										new_user = new Object();
										new_user.login = login;
										new_user.password = password;

										resetGlobal();
										resetScreens();

										loginToYak(new_user.login,
												new_user.password, gotoHome,
												loginFailure);
										$('body').trigger('hideOpenMenus');
										return false;
									});
				},
				failure : function(data) {
					alert("Failure reported getting fastlogins: ", data);
					console.log("Failure fastlogins.");
				},
				complete : function(xhr, data) {
					if (xhr.status != 0 && xhr.status != 200)
						alert('Error calling server to get  fastlogins. Status='
								+ xhr.status + " " + xhr.statusText);
				}
			});

}

function onBefore(curr, next, opts) {

	var slidesrc = $(next).find('img').attr('src');
	if ($my_avatar != null) {
		if (slidesrc != null && slidesrc == $my_avatar) {
			$(next).addClass('highlight_avatar');
			return;

		}
	}
	$(next).removeClass('highlight_avatar');
}

function highlight_avatar(avatar) {

	$('.avatar_image').each(function() {

		var selected_avatar = $(this).find('img').attr('src');
		if (avatar == selected_avatar) {
			$(this).addClass('highlight_avatar');
		} else {
			$(this).removeClass('highlight_avatar');
		}
	});
}

function set_user_avatar(avatar) {
	friends = null;

	// get activity data for user

	var inputdata = {
		user_id : $userid,
		avatar : avatar
	};

	var options = {
		function_name : "get_scripted_comments",
		good_msg : "Set user avatar"
	};
	post_ajax('../yak/controllers/set_user_avatar.php', inputdata,
			std_success_handler, std_failure_handler, options);

}

function post_status_message_success_handler(json, options) {
	get_user_activity();
}

function post_status_message(scripted_status_message_id) {

	var inputdata = {
		user_id : $userid,
		scripted_status_message_id : scripted_status_message_id
	};

	var options = {
		function_name : "post_status_message",
		good_msg : "Posted user status message."
	};

	post_ajax('../yak/controllers/post_status_message.php', inputdata,
			post_status_message_success_handler, std_failure_handler, options);
}


function approve_post_handler(e, btn, is_approved) {

	var inputdata = {
		user_id : $userid,
		cmd : is_approved,
		user_post_id : $(btn).attr("upid")
	};

	var approval_status = 'Pending';
	
	var options = {
		function_name : "approve_post",
		good_msg : "Approved/denied child's post.",
		approval_status_div : $(btn).parent().find('.approval_status'),
		is_approved : is_approved
		
	};

	post_ajax('../yak/controllers/approve_post.php', inputdata,
			approve_post_success_handler, std_failure_handler, options);
}


function approve_post_success_handler(json, options) {

	var funcname = "unknown server function";
	var good_msg = "";
	if (typeof options != 'undefined') {
		if (options.function_name != null)
			funcname = options.function_name;
		if (options.good_msg)
			good_msg = options.good_msg;
		
		// udpate approval status
		if (options.approval_status_div)
			{
				
				options.approval_status_div.text(get_approved_status_value(options.is_approved));
			}
	}
	var emsg = "Call to " + funcname + " server succeeded. " + good_msg;

	console.log(emsg);
	
}
