/**
 * Called when the page is ready
 */
function initPage() {
	// preload sounds and images
	preload();
	
	// handle some ui effects
	uiEffects();
	
	// plays the welcome video
	playWelcomeVideo();
	
	keyPress();
	touchArrows();
	handlePopupClicks();
	about();
}

// global var to flag an ongoing move
var canMove = false;

// global var to flag if the popup is displayed
var popupDisplayed = false;

// global flag to check if the welcome video has been played
var playedWelcome = false;

// global var for the ambient sound
var sound = new Audio();

// the player
var player;


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
    {'top':'279', 'left':'505', 'duration':'1.5'},
	{'top':'188', 'left':'508', 'duration':'1.5'},
	{'top':'183', 'left':'513', 'duration':'0.16'}
    ]
};

/**
 * From the "prison" to the "centre"
 */
var prisonToCentre = 
{
'end': 'centre',
'moves': [
    {'top':'188', 'left':'508', 'duration':'0.16'},
    {'top':'279', 'left':'505', 'duration':'1.5'},
    {'top':'330', 'left':'423', 'duration':'1.5'}
    ]
};

/**
 * From the "prison" to the "cimetiere"
 */
var prisonToCimetiere = 
{
'end': 'cimetiere',
'moves': [
    {'top':'170', 'left':'447', 'duration':'1'},
    {'top':'145', 'left':'498', 'duration':'1'}
    ]
};

/**
 * From the "cimetiere" to the "prison"
 */
var cimetiereToPrison = 
{
'end': 'prison',
'moves': [
	{'top':'170', 'left':'447', 'duration':'1'},
    {'top':'183', 'left':'513', 'duration':'1'}
    ]
};

/**
 * From the "centre" to the "boucherie"
 */
var centreToBoucherie = 
{
'end': 'boucherie',
'moves': [
	{'top':'297', 'left':'337', 'duration':'1.3'},
	{'top':'258', 'left':'334', 'duration':'0.75'},
	{'top':'254', 'left':'326', 'duration':'0.16'}
    ]
};

/**
 * From the "boucherie" to the "centre"
 */
var boucherieToCentre = 
{
'end': 'centre',
'moves': [
	{'top':'258', 'left':'334', 'duration':'0.16'},
	{'top':'297', 'left':'337', 'duration':'0.75'},
	{'top':'330', 'left':'423', 'duration':'1.3'}
	]
};

/**
 * From the "boucherie" to the "tour"
 */
var boucherieToTour = 
{
'end': 'tour',
'moves': [
	{'top':'230', 'left':'385', 'duration':'1'}
    ]
};

/**
 * From the "tour" to the "boucherie"
 */
var tourToBoucherie = 
{
'end': 'boucherie',
'moves': [
	{'top':'254', 'left':'326', 'duration':'1'}
    ]
};

/**
 * From the "centre" to the "mur"
 */
var centreToMur = 
{
'end': 'mur',
'moves': [
	{'top':'346', 'left':'397', 'duration':'0.5'},
	{'top':'306', 'left':'385', 'duration':'0.3'},
	{'top':'327', 'left':'343', 'duration':'0.8'}
    ]
};

/**
 * From the "mur" to the "centre"
 */
var murToCentre = 
{
'end': 'centre',
'moves': [
	{'top':'306', 'left':'385', 'duration':'0.8'},
	{'top':'346', 'left':'397%', 'duration':'0.3'},
	{'top':'330', 'left':'423', 'duration':'0.5'}
    ]
};

/**
 * From the "mur" to the "hippodrome"
 */
var murToHippodrome = 
{
'end': 'hippodrome',
'moves': [
	{'top':'346', 'left':'313', 'duration':'0.65'},
	{'top':'443', 'left':'316', 'duration':'1.5'},
	{'top':'450', 'left':'307', 'duration':'0.16'}
    ]
};

/**
 * From the "hippodrome" to the "mur"
 */
var hippodromeToMur = 
{
'end': 'mur',
'moves': [
    {'top':'443', 'left':'316', 'duration':'0.16'},
	{'top':'346', 'left':'313', 'duration':'1.5'},
	{'top':'327', 'left':'343', 'duration':'0.65'}
    ]
};

/**
 * From the "centre" to the "usine"
 */
var centreToUsine = 
{
'end': 'usine',
'moves': [
	{'top':'361', 'left':'495', 'duration':'1'},
	{'top':'403', 'left':'496', 'duration':'0.5'},
	{'top':'426', 'left':'542', 'duration':'0.7'}
    ]
};

/**
 * From the "usine" to the "centre"
 */
var usineToCentre = 
{
'end': 'centre',
'moves': [
	{'top':'403', 'left':'496', 'duration':'0.7'},
	{'top':'361', 'left':'495', 'duration':'0.5'},
	{'top':'330', 'left':'423', 'duration':'1'}
	]
};

/**
 * From the "usine" to "erdre"
 */
var usineToErdre = 
{
'end': 'erdre',
'moves': [
	{'top':'446', 'left':'588', 'duration':'0.7'},
	{'top':'303', 'left':'603', 'duration':'1'},
	{'top':'328', 'left':'676', 'duration':'1'},
	{'top':'482', 'left':'667', 'duration':'1.5'},
	{'top':'490', 'left':'677', 'duration':'0.16'}
    ]
};

/**
 * From the "erdre" to "usine"
 */
var erdreToUsine = 
{
'end': 'usine',
'moves': [
	{'top':'482', 'left':'667', 'duration':'0.16'},
	{'top':'328', 'left':'676', 'duration':'1.5'},
	{'top':'303', 'left':'603', 'duration':'1'},
	{'top':'446', 'left':'588', 'duration':'1'},
	{'top':'426', 'left':'542', 'duration':'0.7'}
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
	
	// stops the sound manually for centre since there is no popup
	if (className == 'centre') {
		sound.pause();
	}
	// cannot move while already moving
	canMove = false;
	// the end className
	className = json.end;
	// plays the sound
	playSound(className);
	// the timeline handling the move
	var tl = new TimelineMax({onComplete:togglePopup, onCompleteParams:[true]});	
	tl.pause();
	// constructs the move
	$.each(json.moves, function() {
		tl.to($('#car'), this.duration, {css:{top:this.top*yRatio, left:this.left*xRatio}, ease:Linear.easeNone});
    });
	// adds end effects
	tl.to($('#car'), 0.5, {css:{scale:1.5}, ease:Linear.easeNone})
      .to($('#car'), 0.5, {css:{scale:1}, ease:Linear.easeNone});
	// changes the css class to know where is the map marker
	tl.call(function() {
		$('#car').removeClass().addClass(className);
	});
	tl.play();
}


/**
 * Toggles the popup visibility
 * @param visible true if the popup needs to be visible
 */
function togglePopup(visible) {
	// popup is visible
	popupDisplayed = visible;
	// can move again
	canMove = true;
	var currentClassName = $('#car').attr('class');
	// display the popup only when it's not the centre
	if (currentClassName != 'centre') {
		var margin = visible? '16.5%' : '-150%';
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
}

/**
 * Toggles the map visibility
 */
function toggleMap(visible) {
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
	$('#ko').live('click', function() {
		ko();
	});	
}

/**
 * Handles the ok click
 */
function ok() {
	if (popupDisplayed) {
		togglePopup(false);
		canMove = false;
		var className = $('#car').attr('class');
		stopSound();
		setTimeout(function() {
			playVideo(className);
		}, 1000);
	}
}

/**
 * Handles the ko click
 */
function ko() {
	if (typeof(player) != 'undefined') {
		player.pause();
	}
	if (popupDisplayed) {
		togglePopup(false);
		stopSound();
	}
}

/**
 * Plays the video
 * @param className the css class name of the current point position
 */
function playVideo(className) {
	// cannot move
	canMove = false;
	
	// creates the player
	player = _V_('video');
	player.src([
        {type: 'video/webm', src: 'video/' + className + '.webm'},
        {type: 'video/mp4', src: 'video/' + className + '.mp4'}
    ]);
	player.size($(window).width()/2,$(window).height()/2);
	player.ready(function(){
		// add html code for the video in the video div
		$.fancybox(
			{
				href : '#video',
				helpers : {
			        overlay : {
			            css : {
			                'background' : 'rgba(255, 255, 255, 0.3)'
			            }
			        }
			    }
			},
			{
				afterLoad: function() {
					setTimeout(function() {
						player.play();
					}, 1000);
				},
				afterClose:function() {
					player.pause();
					canMove = true;
				}
			}
		);
	});
	player.addEvent('ended', function() {
		$.fancybox.close(true);
	});
	
	
}

/**
 * Plays the welcome video
 */
function playWelcomeVideo() {
	if (!playedWelcome) {
		setTimeout(function() {
			adjustPOI();
			playVideo('centre');
		}, 1000);
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
		var newVolume = Math.round(sound.volume*10)/10;
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
	sound.pause();
}


/**
 * Search for the move to play in the json datas.
 * @param json the json data that handles the move from one to another point
 */
function changePosition(json) {
	if (canMove) {
		// gets the current css class name of the #car dom element
		var className = $("#car").attr('class');
		// iterates over the json message to find the class name in the src attribute
		$.each(json, function() {
	        if (this.src == className) {
	        	if (popupDisplayed) {
	        		ko();
	        	}
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
// Touch part
//
///////////////////////////////////////////////////////////////////////////////

/**
 * Handles the touch arrows
 */
function touchArrows() {
	var arrows = ['#left','#right','#up','#down'];
	var d, touchStartTime, touchEndTime, touchStartLocation, touchEndLocation;
	
	
	for (var i=0; i<arrows.length; i++) {
		$(arrows[i]).bind('touchstart', function() {
			d = new Date();
			touchStartTime = d.getTime();
			touchStartLocation = mouse.location(x,y);
		});

		$(arrows[i]).bind('touchend', function() {
			d = new Date();
			touchEndTime= d.getTime();
			touchEndLocation= mouse.location(x,y);
			var distance = touchEndLocation - touchStartLocation;
			var duration = touchEndTime - touchStartTime;
			if (distance<=10 && duration < 200) {
				moveWithArrows($(this));
			}
		});
		$(arrows[i]).bind('click', function() {
			moveWithArrows($(this));
		});
	}
}
/**
 * Move with arrows
 * @param distance
 * @param duration
 * @param element
 */
function moveWithArrows(element) {
	switch (element.attr('id')) {
		case 'left':
			changePosition(west);
			break;
		case 'right':
			changePosition(east);
			break;
		case 'up':
			changePosition(north);
			break;
		case 'down':
			changePosition(south);
			break;
		default:
			break;
	}
}


///////////////////////////////////////////////////////////////////////////////
//
// Web related part
//
///////////////////////////////////////////////////////////////////////////////

//global vars to store the map ratio according the screen resolution
var xRatio;
var yRatio;

// POIs names
var poiNames = ["boucherie", "cimetiere", "erdre", "hippodrome", "mur", "prison", "tour", "usine"];

/**
 * Preload images and sounds
 */
function preload() {
    if (!preload.cache) {
        preload.cache = [];
    }
    var preloaded;
    
    // preload the map first
    preloaded = new Image();
	preloaded.src = "images/map.png";
    preload.cache.push(preloaded);
    
    // preload images
    for (var i = 0; i < poiNames.length; i++) {
    	preloaded = new Image();
    	preloaded.src = "images/photos/" + poiNames[i] + ".jpg";
        preload.cache.push(preloaded);
    }
    // then preload sounds
    for (var i = 0; i < poiNames.length; i++) {
    	preloaded = new Audio();
    	preloaded.src = "son/" + poiNames[i] + ".ogg";
        preload.cache.push(preloaded);
    }
}

/**
 * Function to adjust size and placement of the POI given the map size.
 */
function adjustPOI() {
	xRatio = $('#map').width()/1170;
	yRatio = $('#map').height()/960;
	
	// adjsut left, top, width and height css attributes
	$('#car').css('left', function() {
		return (423*xRatio) + 'px';
	});
	$('#car').css('top', function() {
		return (330*yRatio) + 'px';
	});
	$('#car').css('width', function() {
		return (50*xRatio) + 'px';
	});
	$('#car').css('height', function() {
		return (50*yRatio) + 'px';
	});
	$('#car').removeClass('no-display');
}

/**
 * Handles some ui effects
 */
function uiEffects() {
	$('.vlipp, .linkVlipp').hover(
	  function () {
	    $('.vlipp').addClass('hovered');
	  }, 
	  function () {
	    $('.vlipp').removeClass('hovered');
	  }
	);
}

/**
 * Handle about popup
 */
function about() {
	$('#aboutLink,#vannLink').fancybox({
		helpers : {
	        overlay : {
	            css : {
	                'background' : 'rgba(255, 255, 255, 0.3)'
	            }
	        }
	    },
		beforeShow:function() {
			canMove = false;
		},	    
		afterClose:function() {
			canMove = true;
		}
	});
}