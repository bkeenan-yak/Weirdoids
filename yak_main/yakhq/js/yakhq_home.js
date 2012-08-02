/* Foundation v2.2.1 http://foundation.zurb.com */

var $is_logged_in = false;
var $userid = null;
var $userfname = '';



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
						})
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

	var $container = $('#masonryfeed');

	// $container.imagesLoaded(function() {
	// $container.masonry({
	// itemSelector : '.box'
	// });
	// });

});

$(document).ready(function() {
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

});

//
// home button event handlers
//
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
