

$drawingqueue = [];
$drawingImageQueue = [];

function queueDraw(context, weirdoid, scaleBy, lmargin) {

	var drawing = [];
	drawing.context = context;
	drawing.weirdoid = weirdoid;
	drawing.scaleBy = scaleBy;
	drawing.lmargin = lmargin;
	$drawingqueue.push(drawing);

}

function queueImageDraw(weirdoid, lmargin) {

	var drawing = [];
	drawing.context = context;
	drawing.weirdoid = weirdoid;
	drawing.lmargin = lmargin;
	$drawingImageQueue.push(drawing);

}

function drawFromImageQueue() {
	if ($drawingImageQueue.length > 0) {
		drawing = $drawingImageQueue.shift();
		drawInDiv(drawing.weirdoid, drawing.lmargin);
	} else {
		$('body').removeClass('ui-loading');
		$('#vault .vaultcanvas-hidden').removeClass('vaultcanvas-hidden');
	}

}

function drawInDiv(weirdoid, lmargin) {
	var img = new Image();
	img.sprite = weirdoid.sprite;
	img.scaleBy = scaleBy;
	img.lmargin = lmargin;
	img.onload = function() {

		var ximg = this;

		var sprite = ximg.sprite;

		var context = img.context;

		// console.log("drawinCanvas " + this.id + " " + sprite.xloc + " ");
		// if (img.sprite.dataurl != null) {
		// console.log("drawinCanvas loaded " + img.src + " h " + sprite.height
		// + " w " + sprite.width + " scaleby " + scaleBy + ' lmargin '
		// + lmargin + ' ' + img.height + ' ' + img.width);
		// console.log(sprite.width + ' ' + sprite.height + ' ' + lmargin
		// / scaleBy + ' ' + weirdoid.topoffset / scaleBy + ' '
		// + sprite.width / scaleBy + ' ' + sprite.height / scaleBy);

		if (img.lmargin == undefined || img.lmargin == null) {

			img.lmargin = 0;

			console.log("lmargin not set");

		}

		var scaleBy=null;

		//var nu_x = Math.round(lmargin * scaleBy);
		//var nu_y = Math.round(weirdoid.topoffset * scaleBy);
		//var nu_w = Math.round(sprite.width * scaleBy);
		//var nu_h = Math.round(sprite.height * scaleBy);

		// var nu_x = Math.round(lmargin / scaleBy);
		// var nu_y = Math.round(weirdoid.topoffset / scaleBy);
		// var nu_w = Math.round(sprite.width / scaleBy);
		// var nu_h = Math.round(sprite.height / scaleBy);

		if (ximg == null)

			myalert("null img in drawInCanvas");

		if (nu_w == undefined || nu_h == undefined || nu_w <= 0 || nu_h <= 0)

			myalert("Bad image values: offset=" + weirdoid.topoffset
			+ " scaleBy=" + scaleBy + " width=" + sprite.width
			+ " height=" + sprite.height);

		context.drawImage(ximg, 0, 0, sprite.width, sprite.height, nu_x, nu_y,nu_w, nu_h);
		drawFromQueue();

		// }
	};
	img.src = img.sprite.src;// weirdoid.src;

}

function drawFromQueue() {
	if ($drawingqueue.length > 0) {
		drawing = $drawingqueue.shift();
		drawInCanvas(drawing.context, drawing.weirdoid, drawing.scaleBy,
		drawing.lmargin);
	} else {
		$('body').removeClass('ui-loading');
		$('#vault .vaultcanvas-hidden').removeClass('vaultcanvas-hidden');
	}

}

function drawInCanvas(context, weirdoid, scaleBy, lmargin) {
	var img = new Image();
	img.sprite = weirdoid.sprite;
	img.scaleBy = scaleBy;
	img.lmargin = lmargin;
	img.context = context;
	img.onload = function() {

		var ximg = this;

		var sprite = ximg.sprite;

		var context = img.context;

		// console.log("drawinCanvas " + this.id + " " + sprite.xloc + " ");

		// if (img.sprite.dataurl != null) {
		// console.log("drawinCanvas loaded " + img.src + " h " + sprite.height
		// + " w " + sprite.width + " scaleby " + scaleBy + ' lmargin '
		// + lmargin + ' ' + img.height + ' ' + img.width);
		// console.log(sprite.width + ' ' + sprite.height + ' ' + lmargin
		// / scaleBy + ' ' + weirdoid.topoffset / scaleBy + ' '
		// + sprite.width / scaleBy + ' ' + sprite.height / scaleBy);

		if (img.lmargin == undefined || img.lmargin == null) {
			img.lmargin = 0;
			console.log("lmargin not set");
		}

		var scaleBy = img.scaleBy;
		var nu_x = Math.round(lmargin * scaleBy);
		var nu_y = Math.round(weirdoid.topoffset * scaleBy);

		var nu_w = Math.round(sprite.width * scaleBy);
		var nu_h = Math.round(sprite.height * scaleBy);

		// var nu_x = Math.round(lmargin / scaleBy);
		// var nu_y = Math.round(weirdoid.topoffset / scaleBy);
		// var nu_w = Math.round(sprite.width / scaleBy);
		// var nu_h = Math.round(sprite.height / scaleBy);

		if (ximg == null)
			myalert("null img in drawInCanvas");

		if (nu_w == undefined || nu_h == undefined || nu_w <= 0 || nu_h <= 0)
			myalert("Bad image values: offset=" + weirdoid.topoffset
			+ " scaleBy=" + scaleBy + " width=" + sprite.width
			+ " height=" + sprite.height);

		context.drawImage(ximg, 0, 0, sprite.width, sprite.height, nu_x, nu_y,nu_w, nu_h);

		drawFromQueue();

		// }

	};

	img.src = img.sprite.src;// weirdoid.src;

};

//pass in weirdoid and div target. Must set height and width of target.

function composeWeirdoid(weirdoid, btarget, is_centered) {

	var std_height = (weirdoid.std_height) ? weirdoid.std_height : STD_HEIGHT;
	var std_width = (weirdoid.std_width) ? weirdoid.std_width : STD_WIDTH;
	
	is_centered = typeof is_centered !== 'undefined' ? is_centered : false;

	// var width_to_height = (weirdoid.width_to_height)
	// ? weirdoid.width_to_height
	// : WIDTH_TO_HEIGHT;
	//
	// var yfactor = std_height * 100.0;
	// var xfactor = std_width * 100.0;

	compose_band(weirdoid.bkgd, "bkgd", btarget, std_height, std_width,	is_centered);
	compose_band(weirdoid.leg, "leg", btarget, std_height, std_width,is_centered);
	compose_band(weirdoid.body, "body", btarget, std_height, std_width,	is_centered);
	compose_band(weirdoid.head, "head", btarget, std_height, std_width,	is_centered);
	compose_band(weirdoid.xtra, "xtra", btarget, std_height, std_width,	is_centered);

	// add any eastereggs

	if (weirdoid.eastereggs) {
		$.each(weirdoid.eastereggs, function(i, easteregg) {
			compose_easteregg(easteregg, btarget, std_height, std_width);
		});
	}
}

function compose_easteregg(easteregg, target, std_height, std_width) {

	var divname = target.attr('id') + '_' + easteregg.divname;
	var divid = '#' + divname;
	var location_class = (easteregg.location_class != undefined && easteregg.location_class.length > 0) ? easteregg.location_class
			: "none";

	var showit = (target.find('.' + location_class).length == 0);

	if (!showit) {
		console.log("already have an egg with this class");
		return;
	}

	console.log("Adding easteregg: " + easteregg.src + " at top_pct: "
	+ easteregg.top_pct + " left_pct: " + easteregg.left_pct);

	target.append('<div id="' + divname + '" class="easteregg '
	+ location_class + '"><img src="' + easteregg.src
	+ '"></img></div>');

	$(divid).hide();
	$(divid).css('top', easteregg.top_pct + '%');
	$(divid).css('left', easteregg.left_pct + '%');
	$(divid).width(easteregg.width_pct + '%');
	$(divid).height(easteregg.height_pct + '%');

	$(divid).fadeIn('slow', function() {

		// Animation complete.
		$(this).css('background-color', 'transparent');
	});
}

var div_ctr = 0;

function compose_band(band, bandname, btarget, std_height, std_width,is_centered) {

	var top_pct = (band.topoffset / std_height) * 100;
	var left_pct = (band.sprite.xloc / std_width) * 100;
	var divname = 'preview_' + bandname + '_' + div_ctr;

	is_centered = typeof is_centered !== 'undefined' ? is_centered : false;

	div_ctr++;

	btarget.append('<div id="' + divname + '" class="preview_div"><img src="'
	+ band.sprite.src + '"></img></div>');

	$('#' + divname).css("top", top_pct + '%');

	if (!is_centered)
		$('#' + divname).css("left", left_pct + '%');

	var cycle_height = (band.sprite.height / std_height) * 100.0;
	$('#' + divname).height(cycle_height + '%');

}
