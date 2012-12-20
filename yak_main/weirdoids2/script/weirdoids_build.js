var helptimer;

$(document).ready(function()
{
	console.log("in ready build");

	$('#build').live('pagebeforeshow', function(event)
	{
		// $('#headbtn').trigger('click');
		// $('#randombtn').trigger('click');

		$current_eastereggs = [];

		// var clist_items = $('#mycarousel').children();
		//
		// jQuery.each(clist_items, function(i, item)
		// {
		//
		// if (item != undefined)
		// {
		//
		// var packobj = $(item).find('a');
		//
		// if (packobj != undefined)
		// {
		//
		// var packitem = $(packobj).data('item');
		//
		// if (packitem != undefined && packitem.id)
		// {
		//
		// var packitemid = packitem.id;
		// if ($.inArray(packitemid, $loadedpacks) < 0)
		// {
		// $(packobj).addClass('notloaded_pack');
		// $(packobj).attr('title', 'Click to load');
		// } else
		// {
		// $(packobj).removeClass('notloaded_pack');
		// $(packobj).attr('title', 'Loaded');
		// }
		// }
		// }
		// }
		// });

		// make sure there is at least one image in each cycle
		$('.bandcycle').each(function()
		{
			var imgcnt = $(this).children().length;
			if (imgcnt == 0)
			{
				myalert("Error: at least one image must be loaded in each cycle: " + $(this).attr('id'));

			}
		});

		// set all the images
		if ($.browser.msie)
		{

			$('.cycleimg').each(function()
			{
				// list item
				var src = $(this).attr('src');

				$(this).css('filter', 'progid:DXImageTransform.Microsoft.AlphaImageLoader(src="' + src + '", sizingMethod="scale";');
			});
		}
	});

	$('#build').live('pageshow', function(event)
	{
		resizeImages();
		setDoneBtnLogic();

		// $.mobile.hidePageLoadingMsg();
		// $('#band_wrapper').fadeIn('fast');

		// start timer, if no action, show help

		if ($firstTimeShowHelp == true)
		{

			helptimer = setTimeout(function countdown()
			{
				if ($.mobile.activePage.attr("id") != "build")
					return;
				$('#build_help_popup').popup();
				$('#build_help_popup').popup("open", {
					positionTo : 'window'
				}).css('display', 'block');
			}, 10000);
		}

		$('#build body, #build a').live('click keydown swiperight swipeleft', function(e)
		{
			e.preventDefault();
			clearHelpTimer();
		});

		$firstTimeShowHelp = false; // first time through build cycle
	});

	// $('#headbtn').click(function(e)
	// {
	// $active_cycle = $('#cycle_heads');
	// console.log("in head click");
	// // e.preventDefault();
	// return true;
	// });
	//
	// $('#legbtn').click(function(e)
	// {
	// console.log("in legs click");
	// $active_cycle = $('#cycle_legs');
	// e.preventDefault();
	// return true;
	// });
	//
	// $('#bodybtn').click(function(e)
	// {
	// $active_cycle = $('#cycle_bodies');
	// // e.preventDefault();
	// return true;
	// });

	// $('#xtrabtn').click(function(e)
	// {
	// $active_cycle = $('#cycle_xtras');
	// // e.preventDefault();
	// return true;
	// });
	//
	// $('#bkgdbtn').click(function(e)
	// {
	// $active_cycle = $('#cycle_bkgds');
	// // e.preventDefault();
	// return true;
	// });

	// new cycle select btns
	$('#cycle_body_btn').click(function(e)
	{
		clearHelpTimer();

		$('.build_cycle_btns').removeClass('selected');
		$(this).addClass('selected');
		$cycling_body = true;
		$active_cycle = $('#cycle_heads');

		// show all body/leg btns in browser
		$('#btn_next_body, #btn_next_leg, #btn_prev_body, #btn_prev_leg').show();

		return true;
	});

	$('#cycle_xtra_btn').click(function(e)
	{
		clearHelpTimer();

		$('.build_cycle_btns').removeClass('selected');
		$(this).addClass('selected');
		$cycling_body = false;
		$active_cycle = $('#cycle_xtras');

		// hide all body/leg btns in browser
		$('#btn_next_body, #btn_next_leg, #btn_prev_body, #btn_prev_leg').hide();
		// e.preventDefault();
		return true;
	});

	$('#cycle_bkgd_btn').click(function(e)
	{
		clearHelpTimer();

		$('.build_cycle_btns').removeClass('selected');
		$(this).addClass('selected');
		$cycling_body = false;
		$active_cycle = $('#cycle_bkgds');

		// hide all body/leg btns in browser
		$('#btn_next_body, #btn_next_leg, #btn_prev_body, #btn_prev_leg').hide();

		return true;
	});

	// $('#bandds').swipeleft(function(e) {
	// if (typeof $active_cycle == undefined || $active_cycle == '') {
	// console.log("swipeleft $active_cycle undefined");
	// return;
	// }
	//
	// if ($active_cycle.children().length > 0) {
	// $random_cycle = false;
	// $active_cycle.cycle('next');
	// }
	// console.log("swipeleft");
	//
	// var xPos = e.pageX;
	// var yPos = e.pageY;
	//						  
	// //console.log("bands touchstart x=" + xPos + " y=" + yPos);
	// e.preventDefault();
	// });
	//
	// $('#bandds').swiperight(function(e) {
	// if (typeof $active_cycle == undefined || $active_cycle == '') {
	// console.log("swiperight $active_cycle undefined");
	// return;
	// }
	//
	// if ($active_cycle.children().length > 0) {
	// $random_cycle = false;
	// $active_cycle.cycle('prev');
	// }
	// console.log("swiperight");
	// e.preventDefault();
	// });

	// $('#xtras_w').css("pointer-events","none");
	//					
	// $('#heads_w,#legs_w,#bodies_w').live('swiperight',function(e) {
	// console.log('swiperight band = ' + e.target.nodeName + ' >' +
	// $(this).attr('id') + '<');
	//						
	// var id = $(this).attr('id');
	//						
	// if (id == 'heads_w')
	// $active_cycle = $('#cycle_heads');
	// else if (id == 'bodies_w')
	// $active_cycle = $('#cycle_bodies');
	// else if (id == 'legs_w')
	// $active_cycle = $('#cycle_legs');
	// else
	// {
	// console.log("return true: id= " + id);
	// return true;
	// }
	//						
	//						
	// event.stopImmediatePropagation();
	//						
	// if (typeof $active_cycle == undefined || $active_cycle == '') {
	// console.log("swiperight $active_cycle undefined");
	// return;
	// }
	//
	// if ($active_cycle.children().length > 0) {
	// $random_cycle = false;
	// $active_cycle.cycle('prev');
	// }
	// else
	// console.log("no kids");
	//							
	// console.log("swiperight");
	// e.preventDefault();
	// });

	// $('#heads_w,#legs_w,#bodies_w').live('swipeleft',function(e) {
	// console.log('swipeleft band = ' + e.target.nodeName + ' >' +
	// $(this).attr('id') + '<');
	//						
	// var id = $(this).attr('id');
	//						
	// if (id == 'heads_w')
	// $active_cycle = $('#cycle_heads');
	// else if (id == 'bodies_w')
	// $active_cycle = $('#cycle_bodies');
	// else if (id == 'legs_w')
	// $active_cycle = $('#cycle_legs');
	// else
	// {
	// console.log("return true: id= " + id);
	// return true;
	// }
	//						
	//						
	// event.stopImmediatePropagation();
	//						
	// if (typeof $active_cycle == undefined || $active_cycle == '') {
	// console.log("swiperight $active_cycle undefined");
	// return;
	// }
	//
	// if ($active_cycle.children().length > 0) {
	// $random_cycle = false;
	// $active_cycle.cycle('next');
	// }
	// else
	// console.log("no kids");
	//							
	// console.log("swipeleft");
	// e.preventDefault();
	// });

	$('#cancelbtn').click(function(e)
	{
		clearHelpTimer();

		$.mobile.changePage("#wanttoleavebuild", {
			transition : "fade",
			role : "dialog"
		});

		e.preventDefault();
		return false;
	});

	$('#wanttoleavebuild_yes_btn').click(function(e)
	{
		gotoPage("#home");
		e.preventDefault();
		return false;
	});

	$('#build_packs_btn').click(function(e)
	{
		clearHelpTimer();

		$.mobile.changePage("#packs", {
			transition : "fade"
		});

		// e.preventDefault();
		return true;
	});

	$(window).resize(function()
	{
		console.log("in resize");
		resizeImages(null);
	});

	$('#donebtn').click(function(event)
	{
		console.log("click donebtn");
		clearHelpTimer();

		$.mobile.changePage("#previewpage", {
			transition : "fade"
		});

		// event.preventDefault();
		return true;

	});

	$('#randombtn').click(function(event)
	{

		console.log("click randombtn");
		clearHelpTimer();

		$random_cycle = true;
		$random_eggs = 0;

		// for each cycle, find count of images,
		// go to random
		// one

		if ($('#cycle_legs').data('band') != undefined)
		{
			var band = $('#cycle_legs').data('band');

			var maxval = band.images.length;

			if (maxval > 0)
			{
				var numRand = Math.floor(Math.random() * maxval);
				$('#cycle_legs').cycle(numRand);
			}
		}

		if ($('#cycle_heads').data('band') != undefined)
		{
			var band = $('#cycle_heads').data('band');
			var maxval = band.images.length;

			if (maxval > 0)
			{
				var numRand = Math.floor(Math.random() * maxval);
				$('#cycle_heads').cycle(numRand);

			}
		}

		if ($('#cycle_bodies').data('band') != undefined)
		{
			var band = $('#cycle_bodies').data('band');
			var maxval = band.images.length;

			if (maxval > 0)
			{
				var numRand = Math.floor(Math.random() * maxval);
				$('#cycle_bodies').cycle(numRand);
			}
		}

		if ($('#cycle_xtras').data('band') != undefined)
		{
			var band = $('#cycle_xtras').data('band');
			var maxval = band.images.length;
			if (maxval > 0)
			{
				var numRand = Math.floor(Math.random() * maxval);
				$('#cycle_xtras').cycle(numRand);
			}
		}

		if ($('#cycle_bkgds').data('band') != undefined)
		{
			var band = $('#cycle_bkgds').data('band');
			var maxval = band.images.length;
			if (maxval > 0)
			{
				var numRand = Math.floor(Math.random() * maxval);
				$('#cycle_bkgds').cycle(numRand);
			}
		}
		return true;
	});
});

function clearHelpTimer()
{
	if (helptimer != null)
		clearInterval(helptimer);
	helptimer = null;
	seconds = 0;
}

function readyToResize()
{
	resizeImages(afterResizeImages);
}

function setDoneBtnLogic()
{
	$('#donebtn').unbind('click');
	$('#donebtn').click(function(e)
	{
		// console.log("in packs vault");
		console.log('#cycle_heads current slide = ' + $('#cycle_heads').data('currSlide') + ' divname ' + $('#cycle_heads').data('band').divname);

		// canvas is a reference to a
		// <canvas> element
		// add a new grid element in vault
		// and add canvas

		var canvasName = "nmodalCanvas" + $vaultCnt;
		// var idx = $vaultCnt % 3;

		$vaultCnt += 1;

		// var classname;
		//
		// switch (idx) {
		// case 2 :
		// classname = "ui-block-c";
		// break;
		// case 1 :
		// classname = "ui-block-b";
		// break;
		// default :
		// classname = "ui-block-a";
		// }

		// $('#vaultgrid').append(
		// '<div class="' + classname
		// + '"><div class="ui-bar" data-theme="b">'
		// + '<canvas id="' + canvasName
		// + '" height="300"></canvas></div></div>');

		$('#vaultlist').append('<li class=""><div class="ui-bar" data-theme="b">' + '<canvas id="' + canvasName + '" height="300"></canvas></div></li>');

		var weirdoid = new Object();
		weirdoid.fname = "";
		weirdoid.lname = "";

		var mybkgd = new Object();
		var myhead = new Object();
		var mybody = new Object();
		var myleg = new Object();
		var myxtra = new Object();

		var imgidx = $('#cycle_bkgds').data('currSlide');
		var band = $('#cycle_bkgds').data('band');
		var sprite = band.images[imgidx];

		mybkgd.src = band.background;
		mybkgd.topoffset = band.top;
		sprite.xloc = band.left;
		sprite.yloc = band.top;
		sprite.height = band.height;
		sprite.width = band.width;
		mybkgd.sprite = sprite;
		weirdoid.bkgd = mybkgd;

		imgidx = $('#cycle_heads').data('currSlide');
		band = $('#cycle_heads').data('band');
		sprite = band.images[imgidx];

		myhead.src = band.background;
		myhead.topoffset = band.top;
		sprite.xloc = band.left;
		sprite.yloc = band.top;
		sprite.height = band.height;
		sprite.width = band.width;
		myhead.sprite = sprite;
		weirdoid.head = myhead;

		// var image = new Image();

		imgidx = $('#cycle_bodies').data('currSlide');
		band = $('#cycle_bodies').data('band');
		sprite = band.images[imgidx];
		mybody.src = band.background;
		mybody.topoffset = band.top;
		sprite.xloc = band.left;
		sprite.yloc = band.top;
		sprite.height = band.height;
		sprite.width = band.width;
		mybody.sprite = sprite;
		weirdoid.body = mybody;

		imgidx = $('#cycle_legs').data('currSlide');
		band = $('#cycle_legs').data('band');
		sprite = band.images[imgidx];
		myleg.src = band.background;
		myleg.topoffset = band.top;
		sprite.xloc = band.left;
		sprite.yloc = band.top;
		sprite.height = band.height;
		sprite.width = band.width;
		myleg.sprite = sprite;
		weirdoid.leg = myleg;

		imgidx = $('#cycle_xtras').data('currSlide');
		band = $('#cycle_xtras').data('band');
		sprite = band.images[imgidx];
		myxtra.src = band.background;
		myxtra.topoffset = band.top;
		sprite.xloc = band.left;
		sprite.yloc = band.top;
		sprite.height = band.height;
		sprite.width = band.width;
		myxtra.sprite = sprite;
		weirdoid.xtra = myxtra;

		// save easter eggs
		weirdoid.eastereggs = $current_eastereggs;
		weirdoid.std_width = STD_WIDTH;
		weirdoid.std_height = STD_HEIGHT;
		weirdoid.width_to_height = WIDTH_TO_HEIGHT;

		$lastweirdoid = weirdoid;

		$.mobile.changePage("#previewpage", {
			transition : "fade"
		});

		e.preventDefault();
		return false;
	});

}
function afterResizeImages()
{

	setDoneBtnLogic();

	$.mobile.hidePageLoadingMsg();
	$('#band_wrapper').fadeIn('fast');

	$.mobile.changePage("#build", {
		transition : "fade"
	});
};

function resizeImages(callback)
{

	// var o = $(this[0]); // It's your element
	// $.resizeHome();

	console.log("resizeImages ");

	// remove any masks
	$('#band_masks').remove();

	var buildheight = $('#build').outerHeight();
	console.log("#buildheight height " + buildheight);

	var bandheight = $('#bands').outerHeight();
	console.log("#bands height " + bandheight);

	// console.log("banks-nav-bar height " + $('#banks-nav-bar').outerHeight());
	// var bankheight = $('#banks-nav-bar').outerHeight();

	// var hdrheight = $('#buildhdr').outerHeight()
	// + parseInt($('#buildhdr').css("border-top-width"))
	// + parseInt($('#buildhdr').css("border-bottom-width"));

	var hdrheight = 0;
	var buildbar_height = $('#ftr').outerHeight(); // buildbar
	var body_height = $('body').height();

	console.log("resizeImages: hdr:" + hdrheight + " buildbar:" + buildbar_height + " body: " + body_height);

	// if (hdrheight == 0 || hdrheight == 0 || buildbar_height == 0 ||
	// body_height == 0) {
	if (buildbar_height == 0 || body_height == 0)
	{
		if (callback != undefined && callback != null)
		{
			callback();
		}
		console.log("bad vals");
		return;
	}

	var nu_bands_height = body_height - hdrheight - buildbar_height;
	console.log("userAgent=" + navigator.userAgent);
	if (navigator.userAgent.match(/iPad/i))
	{
		nu_bands_height -= 100;
		console.log("set ipad height: " + nu_bands_height);
	}

	$('#band_wrapper').height(Math.min(STD_HEIGHT, nu_bands_height));
	$('#band_wrapper').css("min-height", Math.min(STD_HEIGHT, nu_bands_height));

	// var divwidth = $("#bands").outerWidth();
	// var wfactor = Math.min(divwidth / STD_WIDTH, 1);
	var hfactor = Math.min(nu_bands_height / STD_HEIGHT, 1);
	// var factor = Math.min(wfactor, hfactor);

	console.log("resizeImages hfactor " + hfactor + " nu_bands_height " + nu_bands_height + " body_height " + body_height);

	var hpct = (nu_bands_height / body_height) * 100;
	console.log("calculated band pct = " + hpct);

	var width_to_height = STD_WIDTH / STD_HEIGHT;
	var nu_width = width_to_height * $('#band_wrapper').height();
	var body_width = $('body').width();

	var wpct = (nu_width / body_width) * 100.0;
	console.log("new wrapper width: " + nu_width + " body_width: " + body_width + " wpct" + wpct);

	$("#band_wrapper").width(wpct + '%');
	// $("#band_wrapper").width(nu_width);

	$(".scalable_wrapper").each(function()
	{
		// console.log("scalable div ");
		// var band = $(this).attr('band');
		var normtop = $(this).attr('bandtop');
		// var normleft = $(this).attr('bandleft');
		var h = Math.min(normtop * hfactor, normtop);

		// set margin top as pct

		$(this).css('margin-top', h + "px");

	});

	$(".scalable_div").each(function()
	{

		// console.log("scalable div ");
		// var band = $(this).attr('band');
		// var normtop = $(this).attr('bandtop');
		// var normleft = $(this).attr('bandleft');
		// $(this).css('margin-top', normtop * hfactor);

		// $(this).css('margin-left', normleft * wfactor);
		var normwidth = $(this).attr('bandwidth');
		var normheight = $(this).attr('bandheight');
		var w = Math.min(normwidth * hfactor, $('#band_wrapper').width());
		var h = Math.min(normheight * hfactor, $('#band_wrapper').height());

		$(this).width("100%");
		$(this).height(h);

		// set new width of each image

		$(this).find("img").each(function()
		{
			$(this).height(h);
			$(this).width(w);
		});
	});

	$(".cycle_element").each(function()
	{
		$(this).width("100%");
	});

	if (callback != undefined && callback != null)
		callback();

	// add masks over bandwrapper
	if (navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/webOS/i) || navigator.userAgent.match(/iPhone/i)
			|| navigator.userAgent.match(/iPad/i))
	{

		var band_mask_json = [ {
			"cycleid" : "cycle_heads",
			"height" : "30%"
		}, {
			"cycleid" : "cycle_bodies",
			"height" : "35%"
		}, {
			"cycleid" : "cycle_legs",
			"height" : "35%"
		} ];

		$('#bands').append('<div id="band_masks"></div>');
		$('#band_masks').height($("#band_wrapper").height());
		$('#band_masks').width($("#band_wrapper").width());
		$('#band_masks').css('position', 'absolute');
		$('#band_masks').css('z-index', 10000);

		$.each(band_mask_json, function(index, value)
		{
			var div_id = value.cycleid + '_' + index;
			console.log("adding mask " + div_id);
			$('#band_masks').append('<div class="band_mask" cycleid="' + value.cycleid + '" id="' + div_id + '"></div>');
			$('#' + div_id).css('height', value.height);
		});

		$('.band_mask').css('z-index', 10000);

		$('.band_mask').swiperight(function(e)
		{
			event.stopImmediatePropagation();

			if ($cycling_body == true)
			{
				// use masks - we are not swiping the bkgds or xtras

				// figure out which mask
				var mask_div = $(this);
				console.log("swiperight: band_mask: this = " + mask_div);

				var cycleid = mask_div.attr('cycleid');
				$active_cycle = $('#' + cycleid);
			}

			if (typeof $active_cycle == undefined || $active_cycle == '')
			{
				console.log("swiperight $active_cycle undefined");
				return;
			}

			if ($active_cycle.children().length > 0)
			{
				$random_cycle = false;
				$active_cycle.cycle('prev');
			}

			e.preventDefault();
		});

		$('.band_mask').swipeleft(function(e)
		{
			event.stopImmediatePropagation();

			if ($cycling_body == true)
			{
				// use masks - we are not swiping the bkgds or xtras

				// figure out which mask
				var mask_div = $(this);
				console.log("swipeleft: band_mask: this = " + mask_div);

				var cycleid = mask_div.attr('cycleid');
				$active_cycle = $('#' + cycleid);
			}

			if (typeof $active_cycle == undefined || $active_cycle == '')
			{
				console.log("swipeleft $active_cycle undefined");
				return;
			}

			if ($active_cycle.children().length > 0)
			{
				$random_cycle = false;
				$active_cycle.cycle('next');
			}

			e.preventDefault();
		});

	}

	resizeVault();

	// $('#btn_build').css('top', $btn_build_top * hfactor);
	// $('#btn_packs').css('top', $btn_packs_top * hfactor);
	// $('#btn_vault').css('top', $btn_vault_top * hfactor);
	// $("#bands").trigger('create');
};

function resizeVault()
{
	// resizeVault2();
	// return;

	var stdfactor = Math.min(STD_WIDTH / STD_HEIGHT, 1);
	$('.vault_div').each(function()
	{
		var vh = parseInt($(this).parent().height());
		var vw = parseInt($(this).parent().width());

		// var maxheight = (vw/stdfactor) - 30;
		// console.log("vault: stdfactor="+ stdfactor + " vh=" + vh + " vw=" +
		// vw + " maxh=" + maxheight);

		// want to use maxw
		var nuw = vw;
		var nuh = (vw / stdfactor);
		while (nuh > (vh - 40))
		{
			nuw--;
			nuh = nuw / stdfactor;
		}

		// console.log("vault: nuw=" + nuw + " nuh=" + nuh);
		$(this).width(nuw);
		$(this).height(nuh);
	});

}

function myWaitForImages(finishedCallback, eachCallback)
{
	var eventNamespace = 'myWaitForImages';
	var allImgs = $('#build').find('img');

	var allImgsLength = allImgs.length, allImgsLoaded = 0;
	// If no images found, don't bother.
	if (allImgsLength == 0)
	{
		finishedCallback();
	}
	;

	$.each(allImgs, function(i, img)
	{
		var image = new Image;
		// Handle the image loading and error with the same callback.
		$(image).bind('load.' + eventNamespace + ' error.' + eventNamespace, function(event)
		{
			allImgsLoaded++;

			// If an error occurred with loading the image, set the
			// third argument accordingly.
			eachCallback.call(img.element, allImgsLoaded, allImgsLength, event.type == 'load');

			if (allImgsLoaded == allImgsLength)
			{
				finishedCallback();
				return false;
			}

		});
		image.src = img.src;
	});
}

// function fixPng(png)
// {
//
// // get src
// var src = png.src;
// if (!src.match(/png$/))
// return;
//
// // set width and height
// if (!png.style.width)
// {
// png.style.width = $(png).width();
// }
// if (!png.style.height)
// {
// png.style.height = $(png).height();
// }
//
// // replace by blank image
// png.onload = function()
// {
// console.log("onload");
// };
// png.src = blank.src;
//
// // set filter (display original image)
// png.runtimeStyle.filter =
// "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + src +
// "',sizingMethod='scale')";
// }
