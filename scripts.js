/* global $ */
$.jCanvas.defaults.fromCenter = false;

// The vertical distance between where strings are drawn
const FONT_HEIGHT = 32;
// The width of the main canvas
const CANVAS_WIDTH = 1280;
// The height of the main canvas
const CANVAS_HEIGHT = 720;

// The canvas that all information is drawn to
var mainCanvas = $('#topscreen');

mainCanvas.width = CANVAS_WIDTH;
mainCanvas.height = CANVAS_HEIGHT;

/* jCanvas has an option for write full strings but don't have a option for control letter spacing.
The font has a letter spacing of 2px, and the generator needs a spacing of 1px.
This function allows to write character by character with only 1px of spacing. */
var write = function(x, y, text, color = 'gray') {
	while (text != '') {
		var letter = text.substr(0,1);
	
		/* Search for specials characters */
		if (letter == '_') {
			text = text.substr(1);
			letter = text.substr(0,1);
			if (color == 'gray') color = 'white';
			else if (color == 'white') color = 'gray';
		}

		/* Draw 1 character */
		mainCanvas.drawText({
			fillStyle: color,
			x: x+2, y: y,
			fontSize: 32,
			fontFamily: 'PerfectDOSVGA437Win',
			align: 'left',
			text: letter
		});
	
		/* Remove the character writed from the string, and if itn't empty, continue recursive */
		text = text.substr(1);
		x = x + 16;
	}
}

/* This draw the entire splash screen with any change on the form */
$("#settings input, #settings select").on('change', function() {
	var region = $('select[name=region] option:selected', "#settings").val();
	var sd = $('select[name=sd] option:selected', "#settings").val();
	var type = $('select[name=type] option:selected', "#settings").val();
	
	var line1 = $('select[name=type] option:selected', "#settings").text();
	var line2 = ''; var processor = 0; var use_bootinput = false; var use_auxinput = false;

	if ($('select[name=boottool] option:selected', "#settings").val() == 'custom') {
		$('input[name=boottool]', "#settings").show();
		$('select[name=boottool]', "#settings").parent().hide();
		use_bootinput = true;
	}
	
	if ($('select[name=secondTool] option:selected', "#settings").val() == 'custom') {
		$('input[name=secondTool]', "#settings").show();
		$('select[name=secondTool]', "#settings").parent().hide();
		use_auxinput = true;
	}

	switch(type) {
		case 'luma2016':
			mainCanvas.attr('width', CANVAS_WIDTH);
			line2 = 'Copyright(C) 2016, AuroraWright';
			break;
		case 'luma2017':
			mainCanvas.attr('width', CANVAS_WIDTH);
			line2 = 'Copyright(C) 2017, AuroraWright';
			break;
		case 'luma2018':
			mainCanvas.attr('width', CANVAS_WIDTH);
			line2 = 'Copyright(C) 2018, AuroraWright';
			break;
		case 'menuhax2015':
			mainCanvas.attr('width', CANVAS_WIDTH);
			line2 = 'Copyright(C) 2015, yellow8';
			break;
		case 'menuhax2016':
			mainCanvas.attr('width', CANVAS_WIDTH);
			line2 = 'Copyright(C) 2016, yellow8';
			break;
	}

	mainCanvas.clearCanvas().drawRect({
		fillStyle: 'black',
		x: 0, y: 0,
		width: CANVAS_WIDTH,
		height: CANVAS_HEIGHT
	}).drawImage({
		source: 'images/symbols.png',
		x: 1, y: 16,
		sWidth: 21,
		sHeight: 29,
		sx: 40, sy: 10
	});
	
	switch ($('select[name=logoOptions] option:selected', "#settings").val()) {
		case 'energyStar':
			mainCanvas.drawImage({
				source: 'images/symbols.png',
				x: 266, y: 16,
				sWidth: 133,
				sHeight: 84,
				sx: 0, sy: 0
			}).drawRect({
				fillStyle: 'black',
				x: 306, y: 26,
				width: 21,
				height: 29
			});
			break;
		case 'energyLuma':
			mainCanvas.drawImage({
				source: 'images/symbols.png',
				x: 266, y: 16,
				sWidth: 133,
				sHeight: 84,
				sx: 0, sy: 84
			});
			break;
		case 'lumaIcon':
			mainCanvas.drawImage({
				source: 'images/symbols.png',
				x: 266, y: 8,
				sWidth: 133,
				sHeight: 84,
				sx: 0, sy: 84*2
			});
			break;
	}

	write(24, FONT_HEIGHT * 1, line1);
	write(24, FONT_HEIGHT * 2, line2);

	write(0, FONT_HEIGHT * 5, 'Nintendo Switch ('+region+')');
	sd += ' SD'

	write(0, FONT_HEIGHT * 7, 'Main Processor       : Dual-core ARM11 MPCore');
	write(0, FONT_HEIGHT * 8, 'Memory Testing       : 131072K OK');

	write(0, FONT_HEIGHT * 9,  'Detecting Primary Master ... '+ processor/2 +'G Internal Memory');
	write(0, FONT_HEIGHT *10, 'Detecting Primary Slave  ... '+ sd +' Card');
	
	if (!use_bootinput)
		$('input[name=boottool]', "#settings").val($('select[name=boottool] option:selected', "#settings").text());
		
	if (!use_auxinput)
		$('input[name=secondTool]', "#settings").val($('select[name=secondTool] option:selected', "#settings").text());
	
	var boot_bool = $('input[name=hold]', "#settings").is(':checked');
	var boot_keys = $('select[name=onboot] option:selected', "#settings").val();
	var boot_tool = $('input[name=boottool]', "#settings").val();
	var boot_text = '_Hold ' + boot_keys + ' '+ $('select[name=firstTime] option:selected').text() +'_ to enter _' + boot_tool + '_.';

	var aux_bool = $('input[name=secondLine]', "#settings").is(':checked');
	var aux_keys = $('select[name=secondButton] option:selected').val();
	var aux_tool = $('input[name=secondTool]').val();
	var aux_text = '_Hold ' + aux_keys + ' '+ $('select[name=secondTime] option:selected').text() +'_ to enter _' + aux_tool + '_.';
	
	if (boot_bool && !aux_bool)
		write(0, FONT_HEIGHT * 14, boot_text);
	else if (boot_bool)
		write(0, FONT_HEIGHT * 13, boot_text);
	
	if (aux_bool)
		write(0, FONT_HEIGHT * 14, aux_text);

	if (mainCanvas.width() == CANVAS_WIDTH) {
		mainCanvas.drawImage({
			source: mainCanvas.getCanvasImage(),
			x: 400, y: 0
		});
	}

});

window.onload = function() {
	
	$('canvas').drawImage({
		source: 'images/symbols.png',
		x: 0, y: 0,
		load: function() {
			$("select[name=region]", "#settings").trigger('change');
			if ($('#offline_warning').is(':hidden'))
				$('#downloadPNG, #downloadBIN').removeClass('disabled');
		}
	});
	
};

$('input[name=boottool]', "#settings").keyup(function() { $("#settings input").trigger('change'); });
$('input[name=auxtool]', "#settings").keyup(function() { $("#settings input").trigger('change'); });


/* Create a PNG downloadable of the canvas */
/* global download */
$('#downloadPNG').click(function() {
	if (!$(this).hasClass('disabled')) {
		var filename = (mainCanvas.width() == CANVAS_WIDTH) ? 'splash.png' : 'imagedisplay.png';
		var filedata = mainCanvas.getCanvasImage();
		download(filedata, filename, "image/png");
	}
});
