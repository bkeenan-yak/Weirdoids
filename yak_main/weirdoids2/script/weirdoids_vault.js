var $vaultCnt = 0;
var STD_VAULT_HEIGHT = 200;

var NARROW_VAULT_HEIGHT = 150;

var VAULT_DISPLAY_COUNT = 6;

$(document).ready(function() {
	console.log("in ready vault");
	

	
	$(document).delegate( '#vault','pageshow',	function() {
		var mh = Math.min(STD_HEIGHT, $(window).height());
		var hdrh = $(this).find('[data-role="header"]').height();
		var ftrh = $(this).find('[data-role="footer"]')	.height();
		var the_height = (mh - hdrh - ftrh - 35);
		console.log("vault: mh=" + mh + " hdrh=" + hdrh + " ftrh=" + ftrh);
		
		if (navigator.userAgent.match(/iPad/i))
		{
			var ch = parseInt($('#vault').css('height'));
			
			var nuh = (ch - 100)/mh * 100;
			console.log("vault: content hgt = " + ch + " nuh=" + nuh);
			$('#vault').css('height',nuh + '% !important');
			$('#vault').css('max-height',nuh + '% !important');
			
		}
		resizeVault();
		//$(this).height(mh).find('[data-role="content"]').height(the_height);
	});
	
	$("#btn_clear_vault_yes").click(function(e) {
		console.log("clearing cache");
		localStorage.removeItem($current_user_key);
		$weirdoids = new Array();
		$('#vaultgrid,#vaultlist').empty();

		return true;
	});

	$('#vault').live('pagebeforeshow', function(event) {
		// draw all the saved weirdoids
		$vault_start_idx = 0;
		$('#btn_vault_prev').addClass('deselected');
		$('#btn_vault_more').addClass('deselected');
		
		drawVault();
	});

	$('#btn_vault_prev').click(

	function(event) {
		if ($(this).hasClass('deselected')) 
			return;
		
		if ($vault_start_idx > 0) {
			$vault_start_idx = Math.max(0,$vault_start_idx - getVaultDivCount());
			drawVault();
		}
		event.preventDefault();

	});

	$('#btn_vault_more').click(

	function(event) {
		if ($(this).hasClass('deselected')) 
			return;
		if ($vault_start_idx < $weirdoids.length) {
			$vault_start_idx = Math.min($weirdoids.length - 1,$vault_start_idx 	+ getVaultDivCount());
			drawVault();
		}
		
		if ($vault_start_idx >=  $weirdoids.length)
			$('#btn_vault_more').addClass('deselected');

		event.preventDefault();
	});

	$('#saveInVaultBtn').click(function() {
		$srcPage = "#previewpage";
		$afterLoginPage = '#previewshare';
		$savingFromPreview = true;

		if (!$saved_new_weirdoid)
			storeLocalWeirdoid($lastweirdoid);
		gotoPage("#previewshare");
		return false;
	});
	
	$('#clearcachebtn').click(

			function(e) {
				$.mobile.changePage('#confirm_clear_pg', 'pop',	false, true);
				return false;

			});
	
	//$("#vaulthdr,#vaultfooter").fixedtoolbar({ visibleOnPageShow: true });
});

var $vault_start_idx = 0;

function getVaultDivCount() {

	var view_width = $(window).width();
	
	var vaultDivCount =  (navigator.userAgent.match(/iPad/i)) ? 2 : VAULT_DISPLAY_COUNT;

	if (view_width <= NARROW_WIDTH) {
		vaultDivCount = 1;
	}

	return vaultDivCount;
}

function drawVault(event) {

	$('#vaultcontent').empty();

	//var view_width = $(window).width();
	//var vaultHeight = STD_VAULT_HEIGHT;
	var vaultDivCount = getVaultDivCount();
	//var gridname = "vaultgrid";

	//$('#vaultcontent').append('<div class="ui-grid-b" id="vaultgrid" data-scroll="true"></div>');
	$('#vaultcontent').append('<div id="vaultgrid"><ul class="block-grid two-up mobile" id="vaultlist"></ul></div>');

//	if (view_width > NARROW_WIDTH) {
//		$('#vaultcontent').append('<div class="ui-grid-b" id="vaultgrid" data-scroll="true"></div>');
//
//	} else {
//
//		vaultHeight = NARROW_VAULT_HEIGHT;
//		vaultCount = 1;
//
//		//var gridname = "vault_narrow_wrapper";
//
//		$('#vaultcontent').append('<div class="narrow_vault_grid" id="vault_narrow_wrapper" data-scroll="true"></div>');
//
//	}

	$('body').addClass('ui-loading');

	var vaultCnt = 0;

	$drawingqueue = [];

	var reversedWeirdoids = new Array();

	if ($weirdoids == null) {
		console.log("$weirdoids is null, can't draw");
		$('body').removeClass('ui-loading');
	} else {

		var eidx = Math.min($vault_start_idx + vaultDivCount, $weirdoids.length);

		reversedWeirdoids = $weirdoids.slice(); // make a copy
		reversedWeirdoids = reversedWeirdoids.reverse().slice($vault_start_idx,	eidx); // reverse it, then slice

		if ($vault_start_idx > 0)
			$('#btn_vault_prev').removeClass('deselected');
		else
			$('#btn_vault_prev').addClass('deselected');

		if (eidx >= $weirdoids.length)
			$('#btn_vault_more').addClass('deselected');
		else
			$('#btn_vault_more').removeClass('deselected');
		
		//$('#vaultgrid').removeClass('ui-grid-b');

		jQuery.each(reversedWeirdoids,function() {

							var savedWeirdoid = this;
							// canvas is a
							// reference to a
							// <canvas> element
							// add a new grid
							// element in vault
							// and add canvas

							console.log("added from weirdoid array");

							var canvasName = "nmodalCanvas" + vaultCnt;
							var canvasdiv = canvasName + '_div';

							var fullname = "";

							if (savedWeirdoid.hasOwnProperty("fname")) {
								if (savedWeirdoid.fname != undefined && savedWeirdoid.fname.length > 0)
									fullname = savedWeirdoid.fname + " ";
							}

							if (savedWeirdoid.hasOwnProperty("lname")) {
								if (savedWeirdoid.lname != undefined && savedWeirdoid.lname.length > 0)
									fullname += savedWeirdoid.lname;
							}

							if (fullname.length == 0)
								fullname = "THE NAMELESS WEIRDOID";
							
							//var classname = "four mobile-one columns center";
							
							vaultCnt += 1;

								
								$('#vaultlist')
								.append('<li class=""><div id="'
												+ canvasdiv
												+ '" class=" vault_div" data-theme="b"></div><div class="vault-name">'
												+ fullname
												+ '</div></li>');


								//$('#vaultgrid').page();


							// var drawingCanvas =
							// document.getElementById(canvasName);

							$('#' + canvasdiv).data('weirdoid', savedWeirdoid);
							$('#' + canvasdiv).unbind('click').click(function(e) {
								$previewLastMessage = null;

								$lastweirdoid = $(this).data('weirdoid');

								console.log("clicked vault weirdoid");
								$('#preview-share-weirdoid-name').html(fullname);
								
								$('#saved_or_shared_msg_previewshare h1').empty();
								$('#shared_msg_previewshare h1').empty();
								
								$srcPage = "#vault";
								gotoPage("#preview");
								e.preventDefault();
							});

//							 var target_height = parseInt($('#' + canvasdiv).height());
//							 var target_width = parseInt($('#' + canvasdiv).width());
							//

//							if (view_width > NARROW_WIDTH) {
							// canvas needs fixed height
								var vaultheight = STD_VAULT_HEIGHT;
								var vaultwidth = (vaultheight / STD_HEIGHT)
								* STD_WIDTH;
								
								 //var docheight = parseInt($(document).height());

								$('#' + canvasdiv).height('auto');
								$('#' + canvasdiv).width('100%');

								//$('#' + canvasdiv).height(vaultheight + "px");
								//$('#' + canvasdiv).width(vaultwidth + "px");
//							}

							var btarget = $('#' + canvasdiv);
							composeWeirdoid(savedWeirdoid, btarget, true);

						});

		$('body').removeClass('ui-loading');

		//$("#vaultfooter").fixedtoolbar('updatePagePadding');

		// drawFromQueue();

	}
	resizeVault();

};
