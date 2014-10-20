(function() {
	'use strict';
	var SwipeVideo, root;

	SwipeVideo = (function() {

		function SwipeVideo(params) {
			this.options = {
				intervaltime: 10,			// The video will update every __ms
				framerate: 0.01,			// This is the step in framerate every amount of ms set in intervaltime
				swipelength: 200,			// Min swipe length in pixels to advance (Won't work when animating on swipe)
				element: 'swipe-video',		// Default name of the Swipe-Video element
				animateonswipe: false,		// Will update the animation frame by frame while swiping
				aroundthehorn: false		// Around the horn only works when animating on swipe. Allows the video to loop on swipe
			};

			// overwrite any of the above default settings if set
			var option, value;
			if (typeof params === 'object') {
				for (option in params) {
					value = params[option];
					this.options[option] = value;
				}
			}

			// Touch vs Mouse settings
			var touch = ('ontouchstart' in document.documentElement) ? true : false;
			var ontouchStart = (touch) ? 'touchstart' : 'mousedown';
			var ontouchMove = (touch) ? 'touchmove' : 'mousemove';
			var ontouchEnd = (touch) ? 'touchend' : 'mouseup';

			// Grab all elements necessary
			if (!document.getElementById(this.options.element)) {
				console.error('You do not have a valid id on your gallery');
				return;
			}
			this.videoWrapper = document.getElementById(this.options.element);
			this.video = this.videoWrapper.getElementsByTagName('video')[0];
			this.screens = this.videoWrapper.querySelectorAll('[data-overlay]');

			if (this.videoWrapper.querySelectorAll('[data-moment]').length > 0) {
				this.moments = this.videoWrapper.querySelectorAll('[data-moment]');
				this.dotNav = true;
			}
			else {
				this.moments = this.videoWrapper.querySelectorAll('[data-overlay]');
			}

			this.timeStops = [];
			for (var i = 0, len = this.screens.length; i < len; i++) {
				this.timeStops.push(this.screens[i].getAttribute('data-time'));
			}

			// Setting the first screen as the current screen
			this.currentScreen = this.screens[0];

			// Initial display settings
			this.setOverlay(this.screens[0]);
			if (this.dotNav) { this.updateDotNav(this.moments[0]) };

			// Add necessary click events
			if (this.dotNav) { this.addEventHandlers(this.moments, this.scrubTimeClick, ontouchStart) };
			this.addEventHandlers(this.video, this.swipeStart, ontouchStart);
			if (this.options.animateonswipe) { this.addEventHandlers(this.video, this.swipeMove, ontouchMove); }
			this.addEventHandlers(this.video, this.swipeEnd, ontouchEnd);
		}


		// Fired when the click/touch begins
		// event = the click/touch event
		SwipeVideo.prototype.swipeStart = function(event) {
			this.swipeStartX = event.layerX;

			if (this.options.animateonswipe) {
				this.mousedown = true;
				this.clearOverlays();
			}
		};


		// Fired on click/touch move. Returns out if click/touch hasn't engaged
		// event = the click/touch move
		SwipeVideo.prototype.swipeMove = function(event) {
			if (!this.mousedown) {
				return;
			}

			var currentSwipePosition = event.layerX;
			var distanceSwiped = (this.oldSwipePosition) ? currentSwipePosition - this.oldSwipePosition : 0;

			this.video.currentTime -= distanceSwiped * this.options.framerate;

			if ((this.video.currentTime >= this.video.duration) && this.options.aroundthehorn) {
				this.video.currentTime = 0;
			}
			else if ((this.video.currentTime <= 0) && this.options.aroundthehorn) {
				this.video.currentTime = this.video.duration;
			}

			this.oldSwipePosition = currentSwipePosition;
		};


		// Fired when the click/touch ends
		// event = the click/touch event
		SwipeVideo.prototype.swipeEnd = function(event) {
			if (this.options.animateonswipe) {
				this.animateOnSwipeEnd();
			}
			else {
				this.defaultSwipeEnd(event);
			}
		};


		// When Animating on swipe, the bottom fires on swipe end
		SwipeVideo.prototype.animateOnSwipeEnd = function() {
			this.mousedown = false;
			this.oldSwipePosition = 0;

			var spotToSwipeTo = this.findClosestNumberInArray(this.timeStops, this.video.currentTime);

			this.scrubTimeClick(this.moments[spotToSwipeTo]);
		};


		// The default action when swipe ends
		// event = the click/touch event
		SwipeVideo.prototype.defaultSwipeEnd = function(event) {
	        var swipeEndPosition = event.layerX;

	        // Jumps out of swipe event if minimum swipe length isn't met
	        if (Math.abs(swipeEndPosition - this.swipeStartX) < this.options.swipelength) {
	            return;
	        }

	        var swipeDirection = (swipeEndPosition < this.swipeStartX) ? 1 : -1;

	        var currentScreenAttribute = this.currentScreen.getAttribute('data-overlay');

	        for (var i = 0, len = this.moments.length; i < len; i++) {
	            if (this.moments[i].getAttribute('data-moment') === currentScreenAttribute || this.moments[i].getAttribute('data-overlay') === currentScreenAttribute) {
	                if (i + swipeDirection < 0 || i + swipeDirection === len) {
	                    return;
	                }
	                else {
	                    this.scrubTimeClick(this.moments[i + swipeDirection]);
	                }
	            }
	        }
		};


		// Removes the active class from all overlays
		SwipeVideo.prototype.clearOverlays = function() {
			for (var i = 0, len = this.screens.length; i < len; i++) {
				this.screens[i].classList.remove('active');
			}
		};


		// Adds the active class to the current overlay
		SwipeVideo.prototype.setOverlay = function() {
			this.currentScreen.classList.toggle('active');
		};


		// Removes the active class from all dot-nav elements, and adds it to the selected one
		// element = the dot-nav element to be set as active
		SwipeVideo.prototype.updateDotNav = function(element) {
			for (var i = 0, len = this.moments.length; i < len; i++) {
				this.moments[i].classList.remove('active');
			}
			element.classList.add('active');
		};


		// Determines where to scrub the video to, and sets the interval for it
		// It leads to the scrubVideoInterval function, passing in the time to scrub to
		// Calls the clearOverlays and the updateDotNav functions
		SwipeVideo.prototype.scrubTimeClick = function(event) {
			var clicked = (event.target) ? event.target : event;

			this.clearOverlays();
			if (this.dotNav) { this.updateDotNav(clicked) };

			this.currentScreen = this.getElementsByAttributeValue('data-overlay', clicked.getAttribute('data-moment') || clicked.getAttribute('data-overlay'));

			clearInterval(this.scrubInterval);
			var scrubTo = parseFloat(this.currentScreen.getAttribute('data-time'));

			var self = this;
			this.scrubInterval = setInterval( function() { self.scrubVideoInterval(scrubTo); }, this.options.intervaltime );
		};


		// Adjusts the video forward or backward in time
		// scrubTo = passed in from scrubTimeClick, is the ending time of the video after scrubbing has completed
		SwipeVideo.prototype.scrubVideoInterval = function(scrubTo) {
			var seconds = (scrubTo > this.video.currentTime) ? this.options.framerate : -this.options.framerate;

			if ((this.video.currentTime > scrubTo - this.options.framerate) && (this.video.currentTime < scrubTo + this.options.framerate)) {
				this.video.currentTime = scrubTo;
				clearInterval(this.scrubInterval);

				this.setOverlay();
			}

			this.video.currentTime += seconds;
		};


		// Adds Event Listener to elements within an array as well as sets the event type and the function to call
		// elements = Element, or array of elements to add an event to
		// toCall = Function to call when the eventType is fulfilled
		// eventType = The event type
		SwipeVideo.prototype.addEventHandlers = function(elements, toCall, eventType) {
			if (elements.length > 0) {
				for (var i = 0, len = elements.length; i < len; i++) {
					elements[i].addEventListener(eventType, toCall.bind(this), false);
				}
			}
			else {
				elements.addEventListener(eventType, toCall.bind(this), false);
			}
		};


		// Function to find the closest number in an array
		// returns the Array position of the closest number
		// array = the array to search for a number
		// num = the number you are using for your search
		SwipeVideo.prototype.findClosestNumberInArray = function(array, num) {
			var i = 0;
			var minDiff = this.video.duration;
			var ans;
			for (i in array) {
				var m = Math.abs(num - array[i]);
				if (m < minDiff) {
					minDiff = m;
					ans = i;
				}
			}
			return ans;
		};


		// Function to find an element by a specific attribute value
		// returns the attribute
		// attribute = the type of attribute you're searching for
		// value = the assigned value the above attribute has to have
		SwipeVideo.prototype.getElementsByAttributeValue = function(attribute, value) {
			var dom = this.videoWrapper.getElementsByTagName('*');
			var match = [];
			for (var i in dom) {
				if ((typeof dom[i]) === 'object'){
					if (dom[i].getAttribute(attribute) === value){
						match.push(dom[i]);
					}
				}
			}
			return match[0];
		};

		return SwipeVideo;

	})();

	root = (typeof exports !== 'undefined' && exports !== null) ? exports : window;

	root.SwipeVideo = SwipeVideo;

}).call(this);

// Below is needed to call the function. This way you can include any settings:
// new SwipeVideo(); straight implementation
// new SwipeVideo({swipelength: 600})
