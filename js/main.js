
/**
 * Called when the page is ready
 */
function initPage() {
	//playWelcomeVideo();
	keyPress();	
	handlePopupClicks();
	//initArduino();
}

// global var to flag an ongoing move
var moving = false;

// global var to flag if the popup is displayed
var popupDisplayed = false;

// global flag to check if the welcome video has been played
var playedWelcome = false;

// global var for the ambient sound
var sound = new Audio();


///////////////////////////////////////////////////////////////////////////////
//
// Data maps
//
///////////////////////////////////////////////////////////////////////////////

/**
 * From the "centre" to the "prison"
 */
var centreToPrison = 
{
'end': 'prison',
'moves': [
    {'top':'25.5%', 'left':'46.75%', 'duration':'1.5'},
	{'top':'15.65%', 'left':'46.95%', 'duration':'1.5'},
	{'top':'15%', 'left':'47.3%', 'duration':'0.16'}
    ]
};

/**
 * From the "prison" to the "centre"
 */
var prisonToCentre = 
{
'end': 'centre',
'moves': [
    {'top':'15.65%', 'left':'46.95%', 'duration':'0.16'},
    {'top':'25.5%', 'left':'46.75%', 'duration':'1.5'},
    {'top':'31.3%', 'left':'39.7%', 'duration':'1.5'}
    ]
};

/**
 * From the "prison" to the "cimetiere"
 */
var prisonToCimetiere = 
{
'end': 'cimetiere',
'moves': [
    {'top':'13.5%', 'left':'41.6%', 'duration':'1'},
    {'top':'10.7%', 'left':'46.1%', 'duration':'1'}
    ]
};

/**
 * From the "cimetiere" to the "prison"
 */
var cimetiereToPrison = 
{
'end': 'prison',
'moves': [
	{'top':'13.5%', 'left':'41.6%', 'duration':'1'},
    {'top':'15%', 'left':'47.3%', 'duration':'1'}
    ]
};

/**
 * From the "centre" to the "boucherie"
 */
var centreToBoucherie = 
{
'end': 'boucherie',
'moves': [
	{'top':'27.55%', 'left':'32.25%', 'duration':'1.3'},
	{'top':'23.25%', 'left':'32.05%', 'duration':'0.75'},
	{'top':'22.8%', 'left':'31.2%', 'duration':'0.16'}
    ]
};

/**
 * From the "boucherie" to the "centre"
 */
var boucherieToCentre = 
{
'end': 'centre',
'moves': [
	{'top':'23.25%', 'left':'32.05%', 'duration':'0.16'},
	{'top':'27.55%', 'left':'32.25%', 'duration':'0.75'},
	{'top':'31.3%', 'left':'39.7%', 'duration':'1.3'}
	]
};

/**
 * From the "boucherie" to the "tour"
 */
var boucherieToTour = 
{
'end': 'tour',
'moves': [
	{'top':'20.1%', 'left':'36.5%', 'duration':'1'}
    ]
};

/**
 * From the "tour" to the "boucherie"
 */
var tourToBoucherie = 
{
'end': 'boucherie',
'moves': [
	{'top':'22.8%', 'left':'31.2%', 'duration':'1'}
    ]
};

/**
 * From the "centre" to the "mur"
 */
var centreToMur = 
{
'end': 'mur',
'moves': [
	{'top':'33.2%', 'left':'37.3%', 'duration':'0.5'},
	{'top':'28.2%', 'left':'36.3%', 'duration':'0.3'},
	{'top':'30.7%', 'left':'32.8%', 'duration':'0.8'}
    ]
};

/**
 * From the "mur" to the "centre"
 */
var murToCentre = 
{
'end': 'centre',
'moves': [
	{'top':'28.2%', 'left':'36.3%', 'duration':'0.8'},
	{'top':'33.2%', 'left':'37.3%', 'duration':'0.3'},
	{'top':'31.3%', 'left':'39.7%', 'duration':'0.5'}
    ]
};

/**
 * From the "mur" to the "hippodrome"
 */
var murToHippodrome = 
{
'end': 'hippodrome',
'moves': [
	{'top':'32.9%', 'left':'30.1%', 'duration':'0.65'},
	{'top':'43.5%', 'left':'30.3%', 'duration':'1.5'},
	{'top':'44.5%', 'left':'29.6%', 'duration':'0.16'}
    ]
};

/**
 * From the "hippodrome" to the "mur"
 */
var hippodromeToMur = 
{
'end': 'mur',
'moves': [
    {'top':'43.5%', 'left':'30.3%', 'duration':'0.16'},
	{'top':'32.9%', 'left':'30.1%', 'duration':'1.5'},
	{'top':'30.7%', 'left':'32.8%', 'duration':'0.65'}
    ]
};

/**
 * From the "centre" to the "usine"
 */
var centreToUsine = 
{
'end': 'usine',
'moves': [
	{'top':'34.6%', 'left':'45.9%', 'duration':'1'},
	{'top':'39.3%', 'left':'46%', 'duration':'0.5'},
	{'top':'41.9%', 'left':'50.1%', 'duration':'0.7'}
    ]
};

/**
 * From the "usine" to the "centre"
 */
var usineToCentre = 
{
'end': 'centre',
'moves': [
	{'top':'39.3%', 'left':'46%', 'duration':'0.7'},
	{'top':'34.6%', 'left':'45.9%', 'duration':'0.5'},
	{'top':'31.3%', 'left':'39.7%', 'duration':'1'}
	]
};

/**
 * From the "usine" to "erdre"
 */
var usineToErdre = 
{
'end': 'erdre',
'moves': [
	{'top':'44.5%', 'left':'53.9%', 'duration':'0.7'},
	{'top':'28.2%', 'left':'55.2%', 'duration':'1'},
	{'top':'30.9%', 'left':'61.6%', 'duration':'1'},
	{'top':'47.9%', 'left':'60.8%', 'duration':'1.5'},
	{'top':'48.9%', 'left':'61.8%', 'duration':'0.16'}
    ]
};

/**
 * From the "erdre" to "usine"
 */
var erdreToUsine = 
{
'end': 'usine',
'moves': [
	{'top':'47.9%', 'left':'60.8%', 'duration':'0.16'},
	{'top':'30.9%', 'left':'61.6%', 'duration':'1.5'},
	{'top':'28.2%', 'left':'55.2%', 'duration':'1'},
	{'top':'44.5%', 'left':'53.9%', 'duration':'1'},
	{'top':'41.9%', 'left':'50.1%', 'duration':'0.7'}
    ]
};

/**
 * Titles and texts
 */
var titles =
[
 {'className':'mur', 'title':'LE MUR', 'subtitle':'VU PAR FRANCIS PESLERBE - AMATEUR D\'HISTOIRE'},
 {'className':'boucherie', 'title':'LA BOUCHERIE', 'subtitle':'VU PAR SAÏD SIDI AISSA ET SES CLIENTS'},
 {'className':'tour', 'title':'LA TOUR', 'subtitle':'VU PAR AMANDINE QAMAR - RÉSIDENTE'},
 {'className':'erdre', 'title':'L\'ERDRE', 'subtitle':'VU PAR PHILIPPE BARRET - ANIMATEUR CANOË'},
 {'className':'prison', 'title':'LA PRISON', 'subtitle':'VU PAR ANDRÉ PAGE - DIRECTEUR'},
 {'className':'usine', 'title':'L\'USINE', 'subtitle':'VU PAR FRANCIS PESLERBE - AMATEUR D\'HISTOIRE'},
 {'className':'cimetiere', 'title':'LE CIMETIÈRE', 'subtitle':'VU PAR FRÉDÉRIC BERNARD - AGENT D\'ACCUEIL'},
 {'className':'hippodrome', 'title':'L\'HIPPODROME', 'subtitle':'VU PAR LES TURFISTES'}
];

/**
 * East mapping
 */
var east = 
[
 {'src':'boucherie', 'target':boucherieToCentre},
 {'src':'centre', 'target':centreToUsine},
 {'src':'usine', 'target':usineToErdre}
];

/**
 * West mapping
 */
var west = 
[
 {'src':'erdre', 'target':erdreToUsine},
 {'src':'usine', 'target':usineToCentre},
 {'src':'prison', 'target':prisonToCimetiere},
 {'src':'centre', 'target':centreToBoucherie}
];

/**
 * North mapping
 */
var north = 
[
 {'src':'hippodrome', 'target':hippodromeToMur},
 {'src':'mur', 'target':murToCentre},
 {'src':'centre', 'target':centreToPrison},
 {'src':'boucherie', 'target':boucherieToTour}
];

/**
 * South mapping
 */
var south = 
[
 {'src':'cimetiere', 'target':cimetiereToPrison},
 {'src':'prison', 'target':prisonToCentre},
 {'src':'centre', 'target':centreToMur},
 {'src':'mur', 'target':murToHippodrome},
 {'src':'tour', 'target':tourToBoucherie}
];

///////////////////////////////////////////////////////////////////////////////
//
// General part
//
///////////////////////////////////////////////////////////////////////////////

/**
 * Handles the move of the marker
 * @param json the json data about the move to handle
 */
function move(json) {
	var className = $("#car").attr('class');
	if (className == 'centre') {
		sound.pause();
	}
	
	moving = true;
	// the end className
	var className = json.end;
	// plays the sound
	playSound(className)
	// the timeline handling the move
	var tl = new TimelineMax({onComplete:togglePopup, onCompleteParams:[true]});	
	tl.pause();
	// constructs the move
	$.each(json.moves, function() {
		tl.to($('#car'), this.duration, {css:{top:this.top, left:this.left}, ease:Linear.easeNone});
    });
	// adds end effects
	tl.to($('#car'), 0.5, {css:{scale:1.5}, ease:Linear.easeNone})
      .to($('#car'), 0.5, {css:{scale:1}, ease:Linear.easeNone});
	// changes the css class to know where is the map marker
	tl.call(function() {
		$('#car').removeClass().addClass(className);
	})
	tl.play();
}


/**
 * Toggles the popup visibility
 * @param visible true if the popup needs to be visible
 */
function togglePopup(visible) {
	popupDisplayed = visible;
	var currentClassName = $('#car').attr('class');
	// display the popup only when it's not the centre
	if (currentClassName != 'centre') {
		var margin = visible? '20%' : '-79%';
		toggleMap(!visible);
		// sets the good names and photo
		$.each(titles, function() {
			if (this.className == currentClassName) {
				$('#title').text(this.title);
				$('#subtitle').text(this.subtitle);
				$('#innerBlack').html('<img id="photo" alt="photo" src="images/photos/' + this.className + '.jpg">');
			}
		});
		// displays the popup
		TweenMax.to($('#popup'), 1.5, {css:{marginLeft:margin}, ease:Back.easeOut});
	}
	// else, says the point is not moving anymore
	else {
		moving = false;
	}
}

/**
 * Toggles the map visibility
 */
function toggleMap(visible) {
	var bgColor = visible? 'transparent' : 'black';
	var opacity = visible? '1' : '0.3';
	// toggles the map
	TweenMax.to($('#mapDiv'), 1, {css:{opacity:opacity}, ease:Linear.easeNone});	
}

/**
 * Handles clicks on the ok/ko buttons of the popup
 */
function handlePopupClicks() {
	$('#ok').click(function() {
		ok();
	});
	$('#ko').click(function() {
		ko();
	});
}

/**
 * Handles the ok click
 */
function ok() {
	if (popupDisplayed) {
		togglePopup(false);
		var className = $('#car').attr('class');
		stopSound();
		playVideo(className);
	}
}

/**
 * Handles the ko click
 */
function ko() {
	if (popupDisplayed) {
		togglePopup(false);
		stopSound();
		moving = false;
	}
	else if(!$("#video")[0].paused) {
		hideVideo();
		$("#video")[0].pause();
	}
}

/**
 * Plays the video
 * @param className the css class name of the current point position
 */
function playVideo(className) {
	// add html code for the video in the video div
	$("#videoDiv").html(
			"<video id=\"video\" src=\"video/" + className + ".webm\"></video>" +
			"<img id=\"ko\" alt=\"ko\" src=\"images/ko.png\">");
   	// animates the video div
	TweenMax.to($('#videoDiv'), 1, {css:{opacity:'1'}, ease:Linear.easeNone});
   	// plays the video
	setTimeout(function() {
		$("#video")[0].play();
	}, 2000);
	// adds a handler for the end of video event
	$("#video").bind("ended", function() {
   		hideVideo();
   	});
}

/**
 * Hides the video
 */
function hideVideo() {
	TweenMax.to($('#videoDiv'), 1, {css:{opacity:'0'}, ease:Linear.easeNone});
	moving = false;
}

/**
 * Plays the welcome video
 */
function playWelcomeVideo() {
	if (!playedWelcome) {
		setTimeout(function() {
			playVideo('centre');
		}, 2000);
		playedWelcome = true;
	}
}

/**
 * Plays the ambient sound
 * @param className the css class name of the current point position
 */
function playSound(className) {
	// buffers automatically when created
	sound = new Audio('son/' + className + '.ogg'); 
	sound.addEventListener('ended', function() {
	    this.currentTime = 0;
	    this.play();
	}, false);
	sound.volume = 0;
	sound.play();
	// raise the volume slowly
	var interval = setInterval(function() { 
		var newVolume = Math.round(sound.volume*10)/10
		sound.volume = newVolume + 0.1;
        if(sound.volume >= 1) {
        	clearInterval(interval);
        }
	}, 150);
	
}

/**
 * Stops the sound with a fading effect
 */
function stopSound() {
//	var interval = setInterval(function() { 
//		var newVolume = Math.round(sound.volume*10)/10
//		sound.volume = newVolume - 0.1;
//        if(sound.volume <= 0) {
//        	sound.pause();
//        	clearInterval(interval);
//        }
//	}, 50);
	sound.pause();
}


/**
 * Search for the move to play in the json datas.
 * @param json the json data that handles the move from one to another point
 */
function changePosition(json) {
	if (!moving) {
		// gets the current css class name of the #car dom element
		var className = $("#car").attr('class');
		// iterates over the json message to find the class name in the src attribute
		$.each(json, function() {
	        if (this.src == className) {
	        	move(this.target);
	        }
		});
	}
}

///////////////////////////////////////////////////////////////////////////////
//
// Keyboard part
//
///////////////////////////////////////////////////////////////////////////////

/**
 * Handles the keys when pressed
 */
function keyPress() {
	$(document).keydown(function(e){
		// only handles arrow keys and enter/esc
		switch(e.which) {
	        case 37: // west
				changePosition(west);
				break;
	        case 38: // north
				changePosition(north);
				break;
	        case 39: // east
				changePosition(east);				
				break;
	        case 40: // south
				changePosition(south);				
				break;
	        case 27: //esc : skip this video
	        	ko();
	        	break;
	        case 13: // enter : see the video
	        	ok();
	        	break;
	        default: return; // exit this handler for other keys
	    }
	    e.preventDefault();
	});
}

///////////////////////////////////////////////////////////////////////////////
//
// Arduino part
//
///////////////////////////////////////////////////////////////////////////////

//convenient breakoutjs vars
var IOBoard = BO.IOBoard;
var IOBoardEvent = BO.IOBoardEvent;
var Pin = BO.Pin;
var PinEvent = BO.PinEvent;
var Potentiometer = BO.io.Potentiometer;
var PotEvent = BO.io.PotEvent;
var LED = BO.io.LED;
var Oscillator = BO.generators.Oscillator;

// arduino board
var arduino = new IOBoard(location.hostname, 8887);

/**
 * Init the arduino board
 */ 
function initArduino() {
	// add a listener to be notified when the board is ready
	arduino.addEventListener(IOBoardEvent.READY, onReady);
}

/**
 * Called when the arduino board is ready
 * @param evt the event that is sent when the board is ready
 */
function onReady(evt) {
	// remove the event listener because it is no longer needed
	arduino.removeEventListener(IOBoardEvent.READY, onReady);

	// digital pins
	// pins are 2,3,4,5,6 and 7
	// enable and add a change event listener for each pin (i.e. each button)
	for (var pin = 2; pin < 8; ++ pin) {
		arduino.setDigitalPinMode(pin, Pin.DIN);
		var button = arduino.getDigitalPin(pin);
		button.addEventListener(PinEvent.CHANGE, onChange);
	};
	
	// welcome door 
	arduino.setDigitalPinMode(8, Pin.DIN);
	var button = arduino.getDigitalPin(8);
	button.addEventListener(PinEvent.FALLING_EDGE, onChange);
	
	// reload button
	arduino.setDigitalPinMode(9, Pin.DIN);
	var button = arduino.getDigitalPin(9);
	button.addEventListener(PinEvent.CHANGE, function() {
		location.reload();
	});
	
}

/**
 * Handles the changed state of a button
 * @param evt the event sent when the state of a button has changed
 */
function onChange(evt) {
	// get the pin number and the value
	var pin = evt.target.number;
	var value = evt.target.value;
	console.log("pin " + pin +" : " + value);
	// launches the right move given the pin
	switch (pin) {
		case 2: // north
			changePosition(north);
	        break;
		case 3: // south
			changePosition(south);
	        break;
		case 4: // west
			changePosition(west);
	        break;
		case 5: // east
			changePosition(east);
			break;
		case 6: // skip the video
			ko();
			break;
		case 7: // plays the video
			ok();
			break;
		case 8: // welcome video
			playWelcomeVideo();
		default:
			break;
	}
}