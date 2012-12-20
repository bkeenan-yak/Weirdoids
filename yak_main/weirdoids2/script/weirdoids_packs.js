var $currentPack = '';
var lastLoadedPack = '';

var $packlist_key = null;
var $pack_key = null;
var $loadedpacks = null;
var $preloadQueue = [];
var $items = [];
var $eastereggs = [];
//var $waitForPreload = false;

var blank = new Image();
blank.src = 'imgs/blank.gif';

$(document).ready(function()
{

	$packlist_key = "packlist";

	// if (localStorage.getItem($packlist_key) === null) {
	// did not found key

	$('#packs').live('pageinit', function()
	{
		console.log("created packs");

	});

	$('#packs').live('pagebeforeshow', function()
	{
		console.log("correcting prices for installed packs");
		checkInstalledProducts();
	});

	if ($online)
	{
		getProductList();

	} else
	{
		myalert("Not online and no packlist info available for " + packlist_url + " key " + $packlist_key);
	}
});

function loadPack(newPack, fromBuild)
{

	// var o = $(this[0]); // It's your element
	if (fromBuild === undefined)
		fromBuild = true;

	if (newPack == '' || newPack === undefined)
	{
		return;
	}

	console.log("newPack " + newPack.id + " currentPack " + $currentPack.id + ' lastLoadedPack ' + lastLoadedPack.id);

	if ($loadedpacks == null)
		$loadedpacks = [];

	// see if newPack in loadedpacks

	if ($.inArray(newPack.id, $loadedpacks) > -1)
	{
		console.log("Pack previously loaded");
		if (fromBuild == true)
		{

			$.mobile.changePage("#build", {
				transition : "fade"
			});
		}
		return;
	}

	if (newPack.id == lastLoadedPack.id)
	{
		console.log("Old pack already loaded");
		if (fromBuild == true)
		{
			$.mobile.changePage("#build", {
				transition : "fade"
			});
		}
		return;
	}

	if (fromBuild == true)
	{
		$('#band_wrapper').hide();
		$.mobile.showPageLoadingMsg();
		$currentPack = newPack;
	}


	lastLoadedPack = newPack;

	console.log("in loadpack " + newPack.id);

	// see if in localstorage
	$pack_key = "pack1_" + newPack.id;

	// var cycleid = currentPack.id;
	// if (localStorage.getItem($pack_key) === null) {
	// did not found key
	var image_manifest_url = newPack.manifest; // "imgs/pack2_classic_manifest.txt";
	image_manifest_url = "server/read_p1.php"; // + '&cycleid=' +

	if ($online)
	{
		// newPack.id;
		console.log("getting pack " + image_manifest_url);

		var request = $.ajax({
			cache : false,
			data : ({
				cycleid : newPack.id,
				packfamilyid : newPack.familyid,
				packfile : newPack.packfile
			}),
			success : function(json)
			{
				// do something now that the data is loaded
				if (json.errorcode == 0)
				{
					console.log("Read the pack file!");
					$loadedpacks.push(newPack.id);
					processPackJson(json.bands, newPack.id,fromBuild);
					if (fromBuild == false) // preloading
						preloadPacks();
				} else
				{
					if (fromBuild == true)
					{
						$.mobile.hidePageLoadingMsg();
					}
					serverAlert("Read pack failure", json);
					console.log("Read pack failure");
					console.log(json.errormsg);
				}
			},
			url : image_manifest_url,
			complete : function(xhr, data)
			{
				if (fromBuild == true)
				{
					$.mobile.hidePageLoadingMsg();
				}
				if (xhr.status != 0 && xhr.status != 200)
					alert('Error calling server to read pack. Status=' + xhr.status + " " + xhr.statusText);
			}
		});
		request.fail(function(jqXHR, textStatus, excObject)
		{
			if (fromBuild == true)
			{
				$.mobile.hidePageLoadingMsg();
			}

			alert("get pack Request failed: " + textStatus);

		});
	} else
	{
		if (fromBuild == true)
		{
			$.mobile.hidePageLoadingMsg();
		}
		alert("Not online and no pack info available for " + image_manifest_url + " key " + $pack_key);
	}
};

function checkInstalledProducts()
{
	console.log("checkInstalledProducts");

	// iterate through all listitems
	$('.packprice').each(function()
	{
		// list item
		packid = $(this).attr('passed-parameter');
		curpack = $items[packid];

		if (curpack == null)
		{
			alert("Pack referenced in packlist missing in $items: " + packid);
		} else
		{
			// look for pack id in user prodkeys
			var prev_installed = ($.inArray(curpack.id, $loadedpacks) >= 0);
			if (userHasPurchased(packid) || prev_installed)
			{
				$(this).html('Installed');
			} else
			{
				$(this).html(curpack.cost_str);
			}
		}
	});
}

function processProductList(json)
{
	$items = [];
	//$waitForPreload = false;

	//var loadcnt = 0;
	
	if (localStorage.getItem($packlist_key) === null)
	{
		localStorage.setItem($packlist_key, JSON.stringify(json));
	}

	$.each(json.families, function(i, family)
	{
		console.log("processProductList: family " + family.familyid + " " + family.familyname);

		$.each(family.items, function(i, item)
		{

			console.log("next item " + item.id);
			$items["familyid"] = family.familyid;
			$items[item.id] = item;

			var nuli = '<li class="packprice-li" passed-parameter="' + item.id + '"><div class="packprice" passed-parameter="' + item.id
					+ '">xxx</div><div class="packdesc">' + item.heading1 + '</div><a href="#" id="btn_get_pack"  data-role="button" passed-parameter="'
					+ item.id + '"><img src="' + item.thumbnail + '"></a></li>';

			$("#packlist").append(nuli);
			

			if (userHasPurchased(item.id) || item.cost == 0)
				{
					$preloadQueue.push(item);
					//loadcnt++;
				}

		});

		preloadPacks();
		
	});

	$.each($('#packlist a'), function()
	{

		$(this).click(function(e)
		{
			passedParameter = $(this).get(0).getAttribute('passed-parameter');
			console.log('clicked list ' + passedParameter);
			console.log($items[passedParameter]);
			$currentPack = $items[passedParameter];

			if (userHasPurchased($currentPack.id) || $currentPack.cost == 0)
			{
				// all loading done in build screen click handler
				$('#bldbtn').trigger('click');
			} else
			{
				// begin purchase process

				console.log("begin purchase flow");

				if (!$is_logged_in || $userid == null)
				{
					// we need user to select among possible user keys if more
					// than 1

					alert("You must log in before you can buy new Packs!");

					$srcPage = "#packs";
					$afterLoginPage = "#packs";

					$.mobile.changePage("#loginaccount", {
						transition : "fade"
					});
					return false;
				}
				beginPackPurchase($currentPack, $userid);

			}

			return false;
		});
	});
};

function preloadPacks()
{
	if ($preloadQueue.length > 0)
		{
		
			loadPack($preloadQueue.shift(),false);
		}
}


function getProductList()
{

	// var packlist_url = "server/readpacks2.php"; // "imgs/packlist.txt";
	var packlist_url = "server/read_catalog.php"; // "imgs/packlist.txt";


	// get the json file
	console.log("getting catalog " + packlist_url);

	var request = $.ajax({
		cache : false,
		success : function(json)
		{
			// do something now that the data is loaded

			if (json.errorcode == 0)
			{
				console.log("Read catalog!");
				processProductList(json.catalog);
			} else
			{
				serverAlert("Read catalog failure", json);
				console.log("Read catalog failure");
				console.log(json.errormsg);
			}
		},

		url : packlist_url,
		complete : function(xhr, data)
		{
			if (xhr.status != 0 && xhr.status != 200)
				alert('Error calling server to get catalog. Status=' + xhr.status + " " + xhr.statusText);
		}

	});

	request.fail(function(jqXHR, textStatus, errorThrown)
	{
		alert("get catalog Request failed: " + textStatus + " " + errorThrown);
		console.log("incoming Text " + jqXHR.responseText);
	});
}

function unload_pack(pack)
{

	// iterate through all cycles, delete those that are in this pack
	$('.cycle_element').each(function()
	{
		var packid = $(this).attr('packid');
		if (packid == pack.id)
		{
			// find parent
			$(this).remove();
		}

	});

	// remove from loaded packs
	$loadedpacks.splice($.inArray(pack.id, $loadedpacks), 1);
	if ($currentPack.id == pack.id)
	{
		$currentPack = '';
		lastLoadedPack = '';
	}

	if ($loadedpacks.length == 0)
	{
		console.log("removed last pack from builder");
	}
}

function process_easteregg(easteregg)
{
	console.log("Adding an easter egg: src= " + easteregg.src + " pct = " + easteregg.easteregg);
	$eastereggs.push(easteregg);
}

function process_band(i, band, packid)
{
	console.log("next band " + band.divname);

	// append to div bands
	var divid = band.divname + "_w";
	var cycleid = 'cycle_' + band.divname;
	var view_width = $('body').width();

	// if ($("#" + divid + " #" + cycleid).length > 0)

	if ($("#bands #" + cycleid).length > 0)
		console.log("cycle already exists");
	else
	{
		console.log("no pre-existing cycle");

		// $("#bands").append('<div class="cyclediv" id="' + cycleid + '">');
		$("#bands").append('<div id ="' + divid + '" class="scalable_wrapper" ><div id="'

		+ cycleid + '" class="scalable_div  bandcycle">');

		$('#' + cycleid).css("z-index", band.zindex);
		$('#' + cycleid).css("margin", "0px auto");
		$('#' + cycleid).width(view_width);
		$('#' + divid).css('margin-top', band.top + "px");
		$('#' + divid).css('position', 'absolute');

		$('#' + divid).attr('bandtop', band.top);
	}

	$.each(band.images, function(i, sprite)
	{

		// console.log("next image " +
		// var src = sprite.src;

		var show_pct = (sprite.show_pct) ? sprite.show_pct/100.0 : 1.0;
		var easteregg_id = (sprite.easteregg_id) ? sprite.easteregg_id : -1;

		if (check_show_easteregg(show_pct, easteregg_id))
		{
			$('#' + cycleid).append('<div class="cycle_element" packid="' + packid + '" ><img id="' + sprite.id + '" class="cycleimg" src="' + sprite.src // dataurl
					+ '"></image></div>');
		}
	});

	$('#' + cycleid).attr('bandtop', band.top);
	$('#' + cycleid).attr('bandleft', band.left);
	$('#' + cycleid).attr('bandheight', band.height);
	$('#' + cycleid).attr('bandwidth', band.width);

	$('#' + cycleid).append('</div></div>');
	$('#' + cycleid + " div").width(view_width + "px");
	$('#' + cycleid + " div").css("height", band.height);
	$('#' + cycleid).data('currSlide', 0);

	// if cycle previously had images saved, then just append new ones, else
	if ($('#' + cycleid).data('band') == undefined)
	{
		$('#' + cycleid).data('band', band);
	} else
	{
		$oldband = $('#' + cycleid).data('band');

		$.merge($oldband.images, band.images);
		$('#' + cycleid).data('band', $oldband);
	}

	if ($('#' + cycleid).children().length > 0)
	{

		var slidecnt = $('#' + cycleid).children().length;

		$('#' + cycleid).cycle({
			speed : 400,
			fx : 'scrollHorz',
			easing : 'easeOutBounce',
			delay : -2000,
			timeout : 0,
			cleartype : false,
			cleartypeNoBg : true,
			after : onAfter,
			startingSlide : Math.floor(Math.random() * slidecnt),
			slideResize : 0
		});

		$('#' + divid).data('cycleid', cycleid);

		if ($active_cycle == '')
			$active_cycle = $('#' + cycleid);
	}
};

var egg_cnt = 0;

function onAfter(curr, next, opts)
{

	var index = opts.currSlide;
	var cycle = opts.$cont;

	// if (typeof $active_cycle == undefined || $active_cycle == '') {
	// console.log("$active_cycle undefined");
	// return;
	// }

	if (typeof cycle == undefined || cycle == '')
	{
		console.log("onAfter: cycle undefined");
		return;

	}

	cycle.currSlide = index;
	cycle.data('currSlide', index);

	console.log('current slide = ' + index + ' curr ' + cycle.currSlide);

	var erase_prior = ($random_cycle && ($random_eggs == 0)) || (!$random_cycle);

	if (erase_prior)
	{
		$current_eastereggs = [];

		$(".easteregg").each(function()
		{

			console.log(" fading prior egg " + $(this).attr('id'));

			if ($(this).css('opacity') == 0)
			{

				console.log("removing opaque egg " + $(this).attr('id'));

				$(this).remove();

			} else
			{

				$(this).fadeOut('slow', function()
				{
					// Animation complete.
					console.log("removing prior egg " + $(this).attr('id'));
					$(this).remove();
				});
			}
		});

	}

	if ($eastereggs)
	{
		var target = $('#bands');
		$.each($eastereggs, function(i, easteregg)
		{

			var randval = Math.random() * 100.0 ;

			var location_class = (easteregg.location_class && easteregg.location_class.length > 0) ? easteregg.location_class : "none";
			egg_cnt++;

			if (easteregg.divname == undefined)
			{
				var divname = "eastereggdiv" + '_' + location_class + '_' + egg_cnt;

				easteregg.divname = divname;
			}

			var showit = (randval <= easteregg.show_pct) && (target.find('.' + location_class).length == 0);

			if (showit)
			{
				compose_easteregg(easteregg, target, STD_HEIGHT, STD_WIDTH);
				$random_eggs++;
				$current_eastereggs.push(easteregg);
			}

		});

	}
}

function check_show_easteregg(show_pct, easteregg_id)
{

	var showit = true;

//	if ($.inArray(easteregg_id, pack_easteregg_ids) >= 0)
//	{
//		return true;
//	}

	if (show_pct < 1.0)
	{
		var randval = Math.random();
		showit = (randval <= show_pct);
	}

	if (!showit)
		console.log("Skipping easteregg image " + show_pct);
	else if (show_pct < 1.0)
	{
		console.log("showing easteregg image " + show_pct);
		//pack_easteregg_ids.push(easteregg_id);
	}

	return showit;
}

function processPackJson(json, packid,fromBuild)
{

	console.log("processPackJson ");

	if (localStorage.getItem($pack_key) === null)
	{
		localStorage.setItem($pack_key, JSON.stringify(json));
	}

	// we'll store the search term here
	if ($('link[title="packstyles"]').length > 0)
	{
		$('link[title="packstyles"]').attr('disabled', 'disabled');
		$('link[title="packstyles"]').remove();
	}

	$active_cycle = '';
	//var pack_easteregg_ids = [];

	$.each(json.bands, function(i, band)
	{
		process_band(i, band, packid);
	});

	if (json.eastereggs)
	{
		$.each(json.eastereggs, function(i, easteregg)
		{
			process_easteregg(easteregg);
		});
	}

	// console.log("clicking headbtn");
	// $('#headbtn').trigger('click');

	if (navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/webOS/i) || navigator.userAgent.match(/iPhone/i)
			|| navigator.userAgent.match(/iPad/i))
	{
		console.log('on iPad');
	} else
	{
		$('#btn_next_head').unbind('click');
		$('#btn_next_head').click(function(e)
		{

			// if doing xtra or bkgd, do not reset cycle
			if ($cycling_body == true)
				$active_cycle = $('#cycle_heads');
			if ($active_cycle.children().length > 0)
			{
				$random_cycle = false;
				$active_cycle.cycle('next');
			}
			console.log("clicknext");
			e.preventDefault();
		});

		$('#btn_prev_head').unbind('click');
		$('#btn_prev_head').click(function(e)
		{
			if ($cycling_body == true)
				$active_cycle = $('#cycle_heads');
			if ($active_cycle.children().length > 0)
			{
				$random_cycle = false;
				$active_cycle.cycle('prev');
			}
			console.log("clickprev");
			e.preventDefault();
		});

		$('#btn_next_body').unbind('click');
		$('#btn_next_body').click(function(e)
		{
			if ($cycling_body == true)
				$active_cycle = $('#cycle_bodies');
			if ($active_cycle.children().length > 0)
			{
				$random_cycle = false;
				$active_cycle.cycle('next');
			}
			console.log("clicknext");
			e.preventDefault();
		});

		$('#btn_prev_body').unbind('click');
		$('#btn_prev_body').click(function(e)
		{
			if ($cycling_body == true)
				$active_cycle = $('#cycle_bodies');
			if ($active_cycle.children().length > 0)
			{
				$random_cycle = false;
				$active_cycle.cycle('prev');
			}
			console.log("clickprev");
			e.preventDefault();
		});

		$('#btn_next_leg').unbind('click');
		$('#btn_next_leg').click(function(e)
		{
			if ($cycling_body == true)
				$active_cycle = $('#cycle_legs');
			if ($active_cycle.children().length > 0)
			{
				$random_cycle = false;
				$active_cycle.cycle('next');
			}
			console.log("clicknext");
			e.preventDefault();
		});

		$('#btn_prev_leg').unbind('click');
		$('#btn_prev_leg').click(function(e)
		{
			if ($cycling_body == true)
				$active_cycle = $('#cycle_legs');
			if ($active_cycle.children().length > 0)
			{
				$random_cycle = false;
				$active_cycle.cycle('prev');
			}
			console.log("clickprev");
			e.preventDefault();
		});

	}

	if (fromBuild == true)
		$('#build').trigger('create');


	myWaitForImages(function()
	{

		console.log('Before show, all images loaded.');
		if (fromBuild == true)
			readyToResize();
		
		$("#bldbtn,#packsbtn").removeClass('ui-disabled').css('opacity', '1');
		
	}, function(loaded, count, success)
	{
		console.log("Loaded " + loaded + ' of ' + count + ' images has ' + (!success ? 'failed to load' : 'loaded') + '.');
	});
};

/*
 * $(window).load(function() { // $('#btn_vault').attr('origtop',
 * $('#btn_vault').css('top')); // $('#btn_packs').attr('origtop',
 * $('#btn_packs').css('top')); // $('#btn_build').attr('origtop',
 * $('#btn_build').css('top')); // $.resizeHome();
 * 
 * });
 * 
 */

// function loadCarousel(items) {
//
// // Simply add all items at once and set the size accordingly.
// var itemcnt = 0;
//
// jQuery.each(items, function(i, item) {
// if (item != undefined) {
// var packid = 'build_packid_' + item.id;
//
// $('#mycarousel').append(mycarousel_getItemHTML(item, packid));
//
// if ($.inArray(item.id, $loadedpacks) < 0) {
// $('#' + packid).addClass('notloaded_pack');
// } else
// $('#' + packid).removeClass('notloaded_pack');
//
// $('#' + packid).data('item', item);
// itemcnt++;
// }
// });
//
// jQuery('#mycarousel').jcarousel({
// scroll : 1,
// size : itemcnt
// });
//
// $('.build_pack').click(function(e) {
// var item = $(this).data('item');
// console.log("clicked build pack: item = " + item.id);
// e.preventDefault();
//
// // see if newPack in loadedpacks
// if ($.inArray(item.id, $loadedpacks) < 0) {
// console.log("Pack not previously loaded");
// currentPack = item;
// beginPackPurchase(item, $userid);
// return;
//
// } else {
// // pack already loaded. Now what?
// console.log("Pack already loaded");
// console.log("unloading pack");
// unload_pack(item);
// $(this).addClass('notloaded_pack');
// return;
// }
// });
// };
//
// function mycarousel_getItemHTML(item, packid) {
// return '<li><a href="#" id="' + packid + '" class="build_pack"><img src="'
// + item.thumbnail + '" alt="' + item.heading1 + '" /></a></li>';
// };
