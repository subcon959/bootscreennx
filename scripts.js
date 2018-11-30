/* global $ */
$.jCanvas.defaults.fromCenter = false;

// The vertical distance between where strings are drawn
const FONT_HEIGHT = 32;
// The padding from the left of the screen for all text
const FONT_X_PADDING = 32;
// The width of the main canvas
const CANVAS_WIDTH = 1280;
// The height of the main canvas
const CANVAS_HEIGHT = 720;

// The canvas that all information is drawn to
var mainCanvas = $('#topscreen');

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
	// The Switch firmware version
	var firmwareVersion = $('select[name=firmware] option:selected', "#settings").val();
	// The size of the SD card
	var sdSize = $('select[name=sd] option:selected', "#settings").val();
	// The type of CFW, given it has not been customised by the user
	var cfwType = $('select[name=type] option:selected', "#settings").val();
	// Text on the copyright line
	var copyrightLine = '';
	// Whether to draw the custom bootloader given by the user
	var useCustomBootInput = false;
	// Whether to draw the custom CFW, and Copyright info, given by the user
	var useCustomCfw = false;

	// Changes selection box in input for custom bootloader
	if ($('select[name=boottool] option:selected', "#settings").val() == 'custom') {
		$('input[name=boottool]', "#settings").show();
		$('select[name=boottool]', "#settings").parent().hide();
		useCustomBootInput = true;
	}

	// Changes selection box in input for custom CFW
	if ($('select[name=type] option:selected', "#settings").val() == 'custom') {
		$('input[name=type]', "#settings").show();
		$('input[name=typecopyright]', "#settings").show();
		$('select[name=type]', "#settings").parent().hide();
		useCustomCfw = true;
	}

	// Format the copyright line based on the users selection or custom input
	copyrightLine = 'Copyright(C) 2018, ';
	if(!useCustomCfw){
		switch(cfwType) {
			case 'atmosphere':
				mainCanvas.attr('width', CANVAS_WIDTH);
				copyrightLine += 'Team ReSwitched';
				break;
			case 'reinx':
				mainCanvas.attr('width', CANVAS_WIDTH);
				copyrightLine += 'Rei';
				break;
			case 'rajnx':
				mainCanvas.attr('width', CANVAS_WIDTH);
				copyrightLine += 'rajkosto';
				break;
			case 'sxos':
				mainCanvas.attr('width', CANVAS_WIDTH);
				copyrightLine += 'Team Xecuter';
				break;
		}
	}else{
		copyrightLine += $('input[name=typecopyright]', "#settings").val();
	}

	// Draw the "little man" logo on the left side of the screen
	mainCanvas.clearCanvas().drawRect({
		fillStyle: 'black',
		x: 0, y: 0,
		width: CANVAS_WIDTH,
		height: CANVAS_HEIGHT
	}).drawImage({
		source: 'images/symbols.png',
		x: 8, y: 16,
		sWidth: 21,
		sHeight: 29,
		width: 42,
		height: 58,
		sx: 40, sy: 10
	});
	
	// Draw the chosen logo to the right side of the screen
	switch ($('select[name=logoOptions] option:selected', "#settings").val()) {
		case 'energyStar':
			mainCanvas.drawImage({
				source: 'images/symbols.png',
				x: 966, y: 16,
				sWidth: 133,
				sHeight: 84,
				width: 266,
				height: 168,
				sx: 0, sy: 0
			}).drawRect({ // Cover the little blue man in the energy star logo
				fillStyle: 'black',
				x: 1040, y: 36,
				width: 50,
				height: 60
			});
			break;
		case 'energyStarAtmosphere':
			mainCanvas.drawImage({
				source: 'images/symbols.png',
				x: 966, y: 16,
				sWidth: 133,
				sHeight: 84,
				width: 266,
				height: 168,
				sx: 0, sy: 84
			});
			break;
		case 'atmosphere':
			mainCanvas.drawImage({
				source: 'images/symbols.png',
				x: 1100, y: 16,
				sWidth: 101,
				sHeight: 84,
				width: 151,
				height: 134,
				sx: 30, sy: 168
			});
			break;
	}
	
	// Set the custom bootloader input box to the users last selection
	if (!useCustomBootInput)
		$('input[name=boottool]', "#settings").val($('select[name=boottool] option:selected', "#settings").text());

	// Set the custom cfw input box to the users last selection
	if (!useCustomCfw)
		$('input[name=type]', "#settings").val($('select[name=type] option:selected', "#settings").text());
	
	// Whether or not to display the bootloader message at the bottom of the screen
	var shouldDrawCustomBootString = $('input[name=hold]', "#settings").is(':checked');
	// The key to be held when entering the bootloader
	var bootloaderKey = $('select[name=onboot] option:selected', "#settings").val();
	// The bootloader to enter when the user presses the boot key
	var bootloader = $('input[name=boottool]', "#settings").val();
	// The formatted string from the previous boot variables
	var bootloaderText = '_Hold ' + bootloaderKey + ' '+ $('select[name=firstTime] option:selected').text() +'_ to enter _' + bootloader + '_.';
	
	if (shouldDrawCustomBootString)
		write(FONT_X_PADDING, CANVAS_HEIGHT - (FONT_HEIGHT * 2), bootloaderText);

	write(FONT_X_PADDING * 2, (FONT_HEIGHT / 2) * 1, $('input[name=type]', "#settings").val());
	write(FONT_X_PADDING * 2, (FONT_HEIGHT / 2) * 3, copyrightLine);

	write(FONT_X_PADDING, FONT_HEIGHT * 5, 'Nintendo Switch (ver '+firmwareVersion+')');

	write(FONT_X_PADDING, FONT_HEIGHT * 7, 'Main Processor		: Nvidia Tegra X1 SoC');
	write(FONT_X_PADDING, FONT_HEIGHT * 8, 'Memory Testing		: 4194000K OK');

	write(FONT_X_PADDING, FONT_HEIGHT * 9, 'Primary Master		: 32G Internal Storage');
	write(FONT_X_PADDING, FONT_HEIGHT *10, 'Primary Slave 		: '+ sdSize +' SD Card');

});

window.onload = function() {
	$('canvas').drawImage({
		source: 'images/symbols.png',
		x: 0, y: 0,
		load: function() {
			$("select[name=firmware]", "#settings").trigger('change');
		}
	});
	
};

$('input[name=boottool]', "#settings").keyup(function() { $("#settings input").trigger('change'); });
$('input[name=type]', "#settings").keyup(function() { $("#settings input").trigger('change'); });
$('input[name=typecopyright]', "#settings").keyup(function() { $("#settings input").trigger('change'); });

// Creates a downloadable PNG of the canvas
$('#downloadPNG').click(function() {
	var filename = 'bootlogo.png';
	var filedata = mainCanvas.getCanvasImage();
	download(filedata, filename, "image/png");
});

// Creates a downloadable BMP of the canvas
$('#downloadBMP').click(function() {
	var filename = 'bootlogo.bmp';
	var filedata = mainCanvas.getCanvasImage();
	download(filedata, filename, "image/bmp");
});

