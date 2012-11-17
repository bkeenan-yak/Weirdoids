var $fnames_url = "data/firstnames_json.txt";
var $lnames_url = "data/last_names_json.txt";
var $fnames = [];
var $lnames = [];
var $combined_name = '';

$(document).ready(

function()
{

	console.log("in ready preview");

	if ($online)
	{
		$.ajax({
			url : $fnames_url,
			type : 'get',
			dataType : 'json',
			success : function(json)
			{
				// process the result
				console.log("getting fname json " + $fnames_url);
				processNameJson(json, $fnames_url);
			},
			failure : function(data)
			{
				console.log("fname json failure");
			},
			complete : function(xhr, data)
			{
				if (xhr.status != 0 && xhr.status != 200)
					alert('Error calling server to read json name. Status=' + xhr.status + " " + xhr.statusText);
			}
		});

	} else if (localStorage.getItem($fnames_url) === null)
	{
		alert("Not online and no local version of JSON for " + $fnames_url);
	} else
	{

		processNameJson(JSON.parse(localStorage.getItem($fnames_url)), $fnames_url);
	}

	if ($online)
	{

		$.getJSON($lnames_url, function(json)
		{
			console.log("getting lname json " + $lnames_url);
			processNameJson(json, $lnames_url);

		});

	} else if (localStorage.getItem($lnames_url) === null)
	{
		alert("Not online and no local version of JSON for " + $lnames_url);

	} else
	{
		console.log("found lname json in localStorage");
		processNameJson(JSON.parse(localStorage.getItem($lnames_url)), $lnames_url);

	}

	$('.firstname_link').live('click', function(event)
	{
		var target = $(this);
		var name = target.attr('name');
		console.log("Clicked a fname " + name);
		$('#firstname_value').html(name);
		combine_names();

	});

	$('.lastname_link').live('click', function(event)
	{
		var target = $(this);
		var name = target.attr('name');
		console.log("Clicked a lname " + name);
		$('#lastname_value').html(name);
		combine_names();

	});

	$('#random_name_btn').click(function(event)
	{
		var randcnt = Math.max(Math.floor(Math.random() * 60), 10);
		showRandomName2(randcnt);
		combine_names2();
	});

	$('#btn_random_fname').click(function(event)
	{
		var name = random_name($('#firstname_listview'));
		$('#firstname_value').html(name);
		combine_names();
	});

	$('#btn_random_lname').click(function(event)
	{
		var name = random_name($('#lastname_listview'));
		$('#lastname_value').html(name);
		combine_names();
	});

	$('#btn_share_on_fb').click(function(e)
	{

		console.log("share on fb clicked");
		$savingFromPreview = true;
		$saveSuccessFunction = null;
		$afterLoginPage = "#vault";
		shareClickHandler(true, $lastweirdoid);

		return false;

	});

	$('#btn_post_gallery').click(function(e)
	{
		console.log("post to gallery clicked");
		$savingFromPreview = true;

		$saveSuccessFunction = null;

		$afterLoginPage = "#previewpage";

		postGalleryClickHandler(true, $lastweirdoid);

		return false;
	});

	$('#wanttoshare_btn_login').click(function(e)
	{
		console.log("wanttoshare_btn_login button clicked");

		// $srcPage = "#wanttoshare"

		$afterLoginPage = "#previewpage";
		$.mobile.changePage("#loginaccount", {
			transition : "fade"
		});

		return false;

	});

	$('#wanttoshare_btn_nothanks').click(function(e)
	{
		console.log("wanttoshare_btn_nothanks button clicked");
		$.mobile.changePage("#previewshare", {
			transition : "fade"
		});

		return false;
	});

	$('#preview').live('pagebeforeshow', function(event)
	{

	});

	$('#previewpage').live('pagebeforeshow', function(event)
	{
		$('#saved_or_shared_msg').hide();
		$('#fname_suggestions').listview('refresh');
		$('#lname_suggestions').listview('refresh');
		drawPreview(event, "previewpage");
	});

	$('#previewshare').live('pagebeforeshow', function(event)
	{
		$('#saved_or_shared_msg_previewshare').hide();
		$('#shared_msg_previewshare').hide();
		drawPreview(event, "previewshare");

	});

	$('#btn_previewpage_save').click(function()
	{

		$srcPage = "#previewpage";
		$afterLoginPage = '#previewshare';

		setWeirdoidNameFromSelect($lastweirdoid);

		storeLocalWeirdoid($lastweirdoid);

		$savingFromPreview = true;
		$saveSuccessFunction = afterPreviewSave;

		$srcPage = "#previewpage";
		$afterLoginPage = '#previewshare';
		saveWeirdoid($lastweirdoid);
		return false;
	});

	$('#previewpage').live('pagebeforeshow', function(event)
	{
		if ($online)
			$('btn_login').show();
		else
			$('btn_login').hide();
	});

});

function showRandomName(count)
{

	(function step()
	{
		var name = random_name2($fnames);
		$('#Firstname').val(name);

		name = random_name2($lnames);
		$('#Lastname').val(name);

		if (count-- > 0)
		{
			// decrement counter and stop when counter reaches 0
			var sleepms = 1 / count * 400;
			setTimeout(step, sleepms); // if counter is not 0, then issue the
			// next timeout
		}
	})();
}

function showRandomName2(count)
{

	var idx = random_name_idx($fnames);
	$('#Firstname').scroller('setValue', [ idx ], true, 2);

	idx = random_name_idx($lnames);
	$('#Lastname').scroller('setValue', [idx ], true, 2);
}

function postGalleryClickHandler(isFromPreview, tmpWeirdoid)
{

	$toSaveWeirdoid = tmpWeirdoid;

	if (typeof $toSaveWeirdoid == undefined || $toSaveWeirdoid == null)
	{

		console.log("postGalleryClickHandler $lastweirdoid undefined");

		return;

	}

	if (!navigator.onLine)
	{
		// user must log in first
		myalert("You cannot post to the gallery unless you are online.");
		return;
	}

	// was weirdoid previously saved on server?
	if (typeof $toSaveWeirdoid.user_weirdoid_id == undefined || $toSaveWeirdoid.user_weirdoid_id == null)
	{

		// first save the weirdoid
		$saveSuccessFunction = readyToPostToGallery;
		saveBeforeShare();

	} else
	{
		// create image on server
		// calls share it when done
		readyToPostToGallery();
	}

}

function shareClickHandler(isFromPreview, $tmpWeirdoid)
{
	$toSaveWeirdoid = $tmpWeirdoid;

	if (typeof $toSaveWeirdoid == undefined || $toSaveWeirdoid == null)
	{
		console.log("shareClickHandler $lastweirdoid undefined");
		return;

	}

	if (!navigator.onLine)
	{
		// user must log in first
		myalert("Not online.");
		return;
	}

	// if not logged into fb, do so now

	if (!$is_on_facebook)
	{
		console.log("User must log on to Facebook first.");
		$savedReturnPage = $afterLoginPage;
		$afterLoginPage = "beforeshare";

		fbLoginHandler(afterFBLoginBeforeShare);

		return;

	}

	// was weirdoid previously saved on server?

	if (typeof $toSaveWeirdoid.user_weirdoid_id == undefined || $toSaveWeirdoid.user_weirdoid_id == null)
	{
		// first save the weirdoid
		$saveSuccessFunction = readyToCreateImage;
		saveBeforeShare();

	} else
	{

		// create image on server
		// calls share it when done

		readyToCreateImage();

	}

}

function drawPreview(event, target)
{
	//
	// draw the current
	//
	console.log("drawPreview - target = " + target);

	if (typeof $lastweirdoid == undefined || $lastweirdoid == null)
	{
		console.log(" $lastweirdoid undefined");
		return;

	}

	canvasname = "preview-canvas";
	bkgdname = "preview-canvas-background";
	canvasdiv = "preview-canvas-div";

	var name = getWeirdoidName($lastweirdoid);

	var showimage = (target == "previewshare");
	if (target == "previewshare")
	{
		canvasname = "preview-share-canvas";
		bkgdname = "preview-share-canvas-background";
		canvasdiv = "preview-share-canvas-div";
		$('#preview-share-weirdoid-name').html(name);
	} else
	{

		// var myselect = $('#select-choice-firstname');
		// myselect[0].selectedIndex = 0;

		var fname = '';
		var lname = '';
		if (name.length == 0)
		{
			fname = random_name($('#firstname_listview'));
			$('#firstname_value').html(fname);
			// $('#select-choice-firstname option').eq(idx).attr('selected',
			// 'selected');
		}

		// myselect.selectmenu("refresh");
		// myselect = $('#select-choice-lastname');
		// myselect[0].selectedIndex = 0;

		if (name.length == 0)
		{
			lname = random_name($('#lastname_listview'));
			$('#lastname_value').html(lname);
			// $('#select-choice-lastname option').eq(idx).attr('selected',
			// 'selected');
		}

		// myselect.selectmenu("refresh");

		if (name.length == 0)
		{
			combine_names();
		}
	}

	if (target == "previewshare")
	{
		var btarget = $('#previewshare_body_wrapper');
		btarget.empty();

		// queueImageDraw( $lastweirdoid.bkgd,0);
		// var body_width = btarget.width();
		// var body_height = $('body').height();

		var hdrheight = $('#previewshare_header').outerHeight() + parseInt($('#previewshare_header').css("border-top-width"))
				+ parseInt($('#previewshare_header').css("border-bottom-width"));

		var footer_height = $('#previewshare_footer').outerHeight();

		if (hdrheight == 0 || footer_height == 0)
		{

		}

		var nusize = $('body').height() - hdrheight - footer_height;
		var previewsize = nusize * 0.8; // 80% of space

		// var previewpct = (nusize / body_height) * 100.0;
		// btarget.height(previewpct + '%');
		btarget.height(previewsize + 'px');

		// var body_width = $('body').width();
		var factor = previewsize / STD_HEIGHT;
		var nuwidth = STD_WIDTH * factor;

		// var wpct = (nuwidth / body_width) * 100.0;
		// btarget.width(wpct + '%');

		btarget.width(nuwidth + 'px');

		composeWeirdoid($lastweirdoid, btarget, true);

	}

	showimage = false;

	var ctx = null;

	if (showimage)
	{

		$('#' + canvasname).hide();

		if ($.browser.msie && parseInt($.browser.version, 10) < 9)
		{
			$('#' + canvasdiv).empty();
			var el = document.createElement(canvasname);
			el.setAttribute("width", 220);
			el.setAttribute("height", 300);
			el.setAttribute("class", "mapping");
			$('#' + canvasdiv).append(el);
			G_vmlCanvasManager.initElement(el);
			ctx = el.getContext('2d');

		} else
		{
			var drawingCanvas = document.getElementById(canvasname);
			ctx = drawingCanvas.getContext('2d');
		}

		// var drawingCanvasBkgd = document.getElementById(bkgdname);
		// var back_height = STD_HEIGHT;
		// var back_width = STD_WIDTH;

		if ($.browser.msie && parseInt($.browser.version, 10) < 9)
		{
			// var back_height = 300;
			// var back_width = STD_WIDTH;
			// var back_el = document.createElement(bkgdname);
			// back_el.setAttribute("width", 150);
			// back_el.setAttribute("height", 300);
			// back_el.setAttribute("class", "mapping");
			// 

			// $('#' + canvasdiv).append(back_el);
			// G_vmlCanvasManager.initElement(back_el); //
			// var back_ctx = back_el.getContext('2d');

		} else
		{
			// var back_height = STD_HEIGHT;
			// var back_width = drawingCanvasBkgd.width;

		}

		// back_ctx.clearRect(0, 0, back_width, back_height);

		var target_height = parseInt($('#' + canvasdiv).height());
		$('#' + canvasname).height(target_height);

		var target_width = parseInt($('#' + canvasdiv).width());
		$('#' + canvasname).width(target_width);

		ctx.clearRect(0, 0, target_width, target_height);

		var scaleBy = target_height / $lastweirdoid.bkgd.sprite.height;

		// var lmargin = 170;
		queueDraw(ctx, $lastweirdoid.bkgd, scaleBy, 0);
		queueDraw(ctx, $lastweirdoid.leg, scaleBy, $lastweirdoid.leg.sprite.xloc);
		queueDraw(ctx, $lastweirdoid.body, scaleBy, $lastweirdoid.body.sprite.xloc);
		queueDraw(ctx, $lastweirdoid.head, scaleBy, $lastweirdoid.head.sprite.xloc);
		queueDraw(ctx, $lastweirdoid.xtra, scaleBy, $lastweirdoid.xtra.sprite.xloc);

		drawFromQueue();

		$('#' + canvasname).show();
	}

	if ($previewLastMessage != null)
	{
		$('#shared_msg_previewshare h1').html($previewLastMessage);
		$('#shared_msg_previewshare').show();
		$previewLastMessage = null;
	}
}

function random_name(selector)
{

	if (selector == undefined)
	{
		console.log("random_name: null selector");
		return null;
	}

	var idx = Math.floor(Math.random() * selector.children().length - 1);
	var element = selector.children()[idx];
	return $(element).attr('name');

}

function random_name2(names)
{

	if (names == undefined)
	{
		console.log("random_name: null names");
		return null;
	}

	var idx = Math.floor(Math.random() * names.length - 1);
	return names[idx];

}

function random_name_idx(names)
{

	if (names == undefined)
	{
		console.log("random_name: null names");
		return 0;
	}

	var idx = Math.floor(Math.random() * names.length - 1);
	return idx;

}

function combine_names()
{
	var fname = $("#firstname_value").html();
	var lname = $("#lastname_value").html();
	var combined = (fname) ? fname : '';

	if (lname)
	{
		combined += ' ' + lname;
	}

	$('#previewpage-weirdoid-name').html(combined);
}

function combine_names2()
{

	var fname = $("#Firstname").val();
	var lname = $("#Lastname").val();

	$combined_name = (fname) ? fname : '';
	if (lname)
	{
		$combined_name += ' ' + lname;
	}

	// $('#previewpage-weirdoid-name').html(combined);
}

var $previewLastMessage = null;

function readyToPostToGallery()
{

	// create image on server (if it doesn't already exist), retrieve image url

	console.log("Posting previously saved weirdoid " + $toSaveWeirdoid.user_weirdoid_id);

	// call server command

	try
	{

		console.log("Ready to post to gallery.");

		if (!$is_logged_in || $userid == null)
		{

			// we need user to select among possible user keys if more than 1

			myalert("You must log in before you can Post to the Gallery!");

			return false;

		}

		// send user id and weirdoid to server

		$toSaveWeirdoid.userid = $userid;

		var datastr = JSON.stringify($toSaveWeirdoid);

		$.ajax({

			url : 'server/post_to_gallery.php',
			type : 'post',
			dataType : 'json',
			data : {
				data : datastr
			}, // store,

			success : function(json)
			{
				// process the result

				if (json.errorcode == 0)
				{
					console.log("Weirdoid poseted: " + " msg: " + json.errormsg);

					$previewLastMessage = "Your Weiroid was posted to the gallery!";
					$('#shared_msg_previewshare h1').html(

					$previewLastMessage);
					$('#shared_msg_previewshare').show();

					gotoPage("#previewshare");

				} else
				{
					serverAlert("Error posting to gallery", json);
					console.log("Error posting to gallery");
					console.log(json.errormsg);

					if ($srcPage != null)
						gotoPage($srcPage);
					return;
				}

			},

			failure : function(data)
			{
				console.log("Post to gallery failure");
				if ($srcPage != null)
					gotoPage($srcPage);
			},
			complete : function(xhr, data)
			{
				if (xhr.status != 0 && xhr.status != 200)
					myalert('Error calling server to post to gallery. Status=' + xhr.status + " " + xhr.statusText);
			}
		});

	} catch (e)
	{
		myalert("Error posting to gallery on server: " + e.message);
	}

}

var $last_shared_weirdoid = null;
var $previewLastMessage = null;

function readyToShare(weirdoid)
{

	// share on facebook

	var name = getWeirdoidName(weirdoid);
	name = (name.length > 0) ? name : 'My Weirdoid';
	shareImageOnFB("Check out my newest Weirdoid", 'http://www.weirdoids.com', weirdoid.serverUrl, name, 'Checkout weirdoids.com!', shareComplete);
}

function shareComplete(wasShared)
{
	console.log("Back from sharing. wasShared = " + wasShared);

	if (wasShared)
	{
		$previewLastMessage = "Your Weirdoid was shared on Facebook!";
		console.log("Image Shared!");
		$('#shared_msg_previewshare h1').html($previewLastMessage);
		$('#shared_msg_previewshare').show();

	} else
	{
		myalert("Image share failed.");
	}

	gotoPage("#previewshare");
}

function afterPreviewSave(myweirdoid)
{

	console.log("Saved Weirdoid on server, now in callback afterPreviewSave");
	$previewLastMessage = "Your Weirdoid was saved on Yakhq!";

	$('#saved_or_shared_msg_preview h1').html($previewLastMessage);
	$('#saved_or_shared_msg_preview').show();

	$.mobile.changePage("#previewshare", {
		transition : "fade"
	});
}

function setWeirdoidNameFromSelect(weirdoid)
{

	// dont overwrite a prev selection unless something is selected
	// fname = $('#select-choice-firstname option:selected').val();
	// lname = $('#select-choice-lastname option:selected').val();

	var fname_idx = $('#Firstname').val();
	var lname_idx = $('#Lastname').val();
	var fname = $fnames[fname_idx];
	var lname = $lnames[lname_idx];

	if (weirdoid.fname == undefined || weirdoid.fname.length == 0)
		weirdoid.fname = (fname === null || fname == '') ? '' : fname;
	else if (fname != null && fname.length > 0)
		weirdoid.fname = fname;

	if (weirdoid.lname == undefined || weirdoid.lname.length == 0)
		weirdoid.lname = (lname === null || lname == '') ? '' : lname;
	else if (lname != null && lname.length > 0)
		weirdoid.lname = lname;
}

function saveBeforeShare()
{

	if ($savingFromPreview)
	{
		setWeirdoidNameFromSelect($toSaveWeirdoid);
	}

	// is user online?

	if (navigator.onLine)
	{
		if ($is_logged_in)
		{
			saveWeirdoidInDB(onSavedWeirdoidInDB);
		} else
		{
			// user must log in first
			console.log("User must log in first.");

			$.mobile.changePage("#wanttoshare", {
				transition : "fade"
			});

			return false;
		}
	}
}

function getWeirdoidName(weirdoid)
{

	var name = '';

	if (weirdoid.fname != undefined)
		name = weirdoid.fname;

	if (weirdoid.lname != undefined)
	{
		if (name.length > 0)
			name += " ";
		name += weirdoid.lname;
	}

	return name;
}

function processNameJson(json, url)
{

	console.log("processNameJson " + url);

	if (localStorage.getItem(url) === null)
	{

		localStorage.setItem(url, JSON.stringify(json));

	}

	console.log("processNameJson " + url);

	var is_first_name = (url == $fnames_url);
	// var selector = is_first_name ? $("#firstname_listview") :
	// $("#lastname_listview");
	var selector = is_first_name ? $("#Firstname") : $("#Lastname");
	var cnt = json.length;
	var arr = is_first_name ? $fnames : $lnames;

	$.each(json, function(i, name)
	{
		// console.log("next first name " + name);
		if (--cnt > 0 && name.length > 0)
		{

			arr.push(name);

		}

	});

	arr.sort();

	var grp = '';
	var myhtml = '';

	$.each(arr, function(i, name)
	{
		// console.log("next first name " + name);
		var nugrp = name.substring(0, 1);
		if (nugrp != grp)
		{
			if (grp.length > 0)
				myhtml += '</optgroup>';

			myhtml += '<optgroup label="' + nugrp + '">';
		}
		grp = nugrp;

		myhtml += '<option value="' + i + '">' + name + '</option>';

	});

	selector.append(myhtml);

	var fld = (is_first_name) ? $("#Firstname") : $("#Lastname");
	var src = (is_first_name) ? $fnames : $lnames;
	var sugg_ul = (is_first_name) ? '#fname_suggestions' : '#lname_suggestions';
	//
	// fld.autocomplete(
	// {
	//
	// icon : 'arrow-r', // option to specify icon
	// target : $(sugg_ul), // the listview to receive results
	// source : src,
	// callback : function(e)
	// {
	// var $a = $(e.currentTarget); // access the selected item
	// fld.val($a.text()); // place the value of the selection into the
	// // search box
	// fld.autocomplete('clear'); // clear the listview
	// },
	// minLength : 1, // minimum length of search string
	// transition : 'fade',// page transition, default is fade
	// matchFromStart : true
	// // search from start, or anywhere in the string
	// });

	fld.scroller({
		preset : 'select',
		theme : 'ios',
		rows : 7,
		width : 50,
		groupLabel: undefined,
		showLabel: false,
		label : undefined,
		display : 'inline',
		mode : 'scroller',
		inputClass : 'i-txt',
		group : true
	});

	// console.log("select length " + selector[0].length);
};

