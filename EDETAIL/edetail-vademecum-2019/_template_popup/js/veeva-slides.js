var com;
var $;
/**
 * @namespace
 */
com = com || {};
/**
 * @namespace
 * @memberOf com
 */
com.usacd = com.usacd || {};
/**
 * Version: 2.0 r181113 <br>
 * Main module for Veeva key messages creation<br>
 * Also accessible via $.[property || method]
 * @namespace
 * @memberOf com.usacd
 */
com.usacd.slides = (function () {
	var msVersion = '2.0 r181016';
	var _this = this;
	var body;

	/**
	 * Down event (platform depending)
	 * @alias com.usacd.slides.EVENT_DOWN
	 * @memberof! com.usacd.slides#
	 * @property {string}
	 */
	var EVENT_DOWN;
	/**
	 * Up event (platform depending)
	 * @alias com.usacd.slides.EVENT_UP
	 * @memberof! com.usacd.slides#
	 * @type {string}
	 */
	var EVENT_UP;
	/**
	 * Move event (platform depending)
	 * @alias com.usacd.slides.EVENT_MOVE
	 * @memberof! com.usacd.slides#
	 * @public
	 * @type {string}
	 */
	var EVENT_MOVE;
	/**
	 * Scroll event (platform depending)
	 * @alias com.usacd.slides.EVENT_SCROLL
	 * @memberof! com.usacd.slides#
	 * @type {string}
	 */
	var EVENT_SCROLL;
	/**
	 * Transition end event (platform depending)
	 * @alias com.usacd.slides.TRANSITION_END
	 * @memberof! com.usacd.slides#
	 *  @type {string}
	 */
	var TRANSITION_END;

	var oApi = {};
	oApi.slide = {};
	oApi.__defineGetter__('EVENT_DOWN', function () { return EVENT_DOWN; });
	oApi.__defineGetter__('EVENT_UP', function () { return EVENT_UP; });
	oApi.__defineGetter__('EVENT_MOVE', function () { return EVENT_MOVE; });
	oApi.__defineGetter__('EVENT_SCROLL', function () { return EVENT_MOVE; });
	oApi.__defineGetter__('TRANSITION_END', function () { return TRANSITION_END; });

	function setPlatformDependantEvents() {
		if (window.navigator.pointerEnabled) {
			EVENT_DOWN = 'pointerdown';
			EVENT_UP = 'pointerup';
			EVENT_MOVE = 'pointermove';
			EVENT_SCROLL = 'pointermove';
		}
		else if ('ontouchstart' in window) {
			EVENT_DOWN = 'touchstart';
			EVENT_UP = 'touchend';
			EVENT_MOVE = 'touchmove';
			EVENT_SCROLL = 'touchmove';
		}
		else {
			EVENT_DOWN = 'mousedown';
			EVENT_UP = 'mouseup';
			EVENT_MOVE = 'mousemove';
			EVENT_SCROLL = 'mousewheel';
		}
		var hDiv = document.createElement('div');
		TRANSITION_END = (hDiv.style.transition !== undefined ? 'transitionend' : 'webkitTransitionEnd');
		hDiv = null;
	}

	var bCustomSwipeInitialized = false;
	var miHorizontalPage;
	var miVerticalPage = 0;
	function initCustomSwipe() {
		var hVerticalSection = getElement('section');
		var iVerticalTotalPages = getElement('.page').length - 1 || 0;

		var hHorizontalSection = getElement('horizontalSection');
		miHorizontalPage = 0;
		var iHorizontalTotalPages = getElement('.horizontalPage').length - 1 || 0;

		if (body.dataset.swipeNext || document.body.dataset.swipePrev || document.body.dataset.swipeDown || document.body.dataset.swipeUp || iVerticalTotalPages > 0 || iHorizontalTotalPages > 0) {
			com.usacd.screenConsole.log('::com::usacd::slides::initCustomSwipe');
			// Vertical pages >
			function onEntryVerticalPage() {
				try { Slide.aPages[miVerticalPage].onEntry(); } catch (e) { }
			}
			// < Vertical pages
			// Horizontal pages >
			function onEntryHorizontalPage() {
				try { Slide.aHorizontalPages[miHorizontalPage].onEntry(); } catch (e) { }
			}
			// < Horizontal pages
			bCustomSwipeInitialized = true;
			document.body.style.width = '1024px';
			document.body.style.height = '768px';
			switch (EVENT_DOWN) {
				case 'pointerdown':
					PointerEvent.prototype.getX = function () { return this.pageX; };
					PointerEvent.prototype.getY = function () { return this.pageY; };
					break;
				case 'mousedown':
					MouseEvent.prototype.getX = function () { return this.pageX; };
					MouseEvent.prototype.getY = function () { return this.pageY; };
					break;
				default:
					TouchEvent.prototype.getX = function () { return (this.changedTouches ? this.changedTouches[0].pageX : this.targetTouches[0].pageX); };
					TouchEvent.prototype.getY = function () { return (this.changedTouches ? this.changedTouches[0].pageY : this.targetTouches[0].pageY); };
			}
			var iStartX, iStartY, iDeltaX, iDeltaY, iTime;
			function initSwipe(poE) {
				if (!poE.target.dataset.preventSwipe && !poE.target.parentElement.dataset.preventSwipe) {
					iStartX = poE.getX();
					iStartY = poE.getY();
					iTime = Date.now();
					document.body.addEventListener($.EVENT_UP, endSwipe, true);
				}
			}
			function endSwipe(poE) {
				document.body.removeEventListener($.EVENT_UP, endSwipe);
				iDeltaX = iStartX - poE.getX();
				iDeltaY = iStartY - poE.getY();
				var iAbsDeltaX = Math.abs(iStartX - poE.getX());
				var iAbsDeltaY = Math.abs(iStartY - poE.getY());
				if (!poE.target.dataset.preventSwipe && !poE.target.parentElement.dataset.preventSwipe && (iAbsDeltaX > 50 || iAbsDeltaY > 50) && (Date.now() - iTime < 1000)) {
					poE.stopPropagation();
					// Horizontal swipe
					if (iAbsDeltaX > iAbsDeltaY) {
						// Internal Horizontal swipe left
						if (hHorizontalSection && iDeltaX > 0 && miHorizontalPage < iHorizontalTotalPages) {
							try { Slide.aHorizontalPages[miHorizontalPage].onExit(1); } catch (e) { }
							miHorizontalPage++;
							hHorizontalSection.style.webkitTransform = 'translateX(' + (miHorizontalPage * -1024) + 'px)';
							hHorizontalSection.addEventListener(TRANSITION_END, onEntryHorizontalPage);
						}
						// Internal Horizontal swipe right
						else if (hHorizontalSection && iDeltaX < 0 && miHorizontalPage > 0) {
							try { Slide.aHorizontalPages[miHorizontalPage].onExit(-1); } catch (e) { }
							miHorizontalPage--;
							hHorizontalSection.style.webkitTransform = 'translateX(' + (miHorizontalPage * -1024) + 'px)';
							hHorizontalSection.addEventListener(TRANSITION_END, onEntryHorizontalPage);
						}
						// Horizontal swipe over Key messages
						else {
							var aNext = (body.dataset.swipeNext ? body.dataset.swipeNext.split(',') : false);
							var aPrev = (body.dataset.swipePrev ? body.dataset.swipePrev.split(',') : false);
							if (iDeltaX > 0 && aNext) {
								jumpToSlide(aNext[0], aNext[1]);
							} else if (iDeltaX < 0 && aPrev) {
								jumpToSlide(aPrev[0], aPrev[1]);
							}
						}
					}
					// Internal Vertical swipe
					else if (hVerticalSection) {
						if (iDeltaY > 0 && miVerticalPage < iVerticalTotalPages) {
							try { Slide.aPages[miVerticalPage].onExit(1); } catch (e) { }
							miVerticalPage++;
							hVerticalSection.style.webkitTransform = 'translateY(' + (miVerticalPage * -768) + 'px)';
							hVerticalSection.addEventListener(TRANSITION_END, onEntryVerticalPage);
						}
						else if (iDeltaY < 0 && miVerticalPage > 0) {
							try { Slide.aPages[miVerticalPage].onExit(-1); } catch (e) { }
							miVerticalPage--;
							hVerticalSection.style.webkitTransform = 'translateY(' + (miVerticalPage * -768) + 'px)';
							hVerticalSection.addEventListener(TRANSITION_END, onEntryVerticalPage);
						}
					}
					// Vertical swipe over Key messages
					else if (iAbsDeltaY > iAbsDeltaX) {
						var aDown = (body.dataset.swipeDown ? body.dataset.swipeDown.split(',') : false);
						var aUp = (body.dataset.swipeUp ? body.dataset.swipeUp.split(',') : false);
						if (iDeltaY > 0 && aDown) {
							jumpToSlide(aDown[0], aDown[1]);
						} else if (iDeltaY < 0 && aUp) {
							jumpToSlide(aUp[0], aUp[1]);
						}
					}
				}
			}
			document.body.addEventListener($.EVENT_DOWN, initSwipe, true);
		}
	}

	function setTransitionEvents() {
		Element.prototype.fadeIn = function (psDuration) {
			this.style.display = 'block';
			this.style.opacity = 0;
			var oE = this;
			var sD = (psDuration ? psDuration + 'ms' : '500ms');
			setTimeout(function () {
				oE.style.webkitTransitionDuration = sD;
				if (oE.style.webkitTransitionProperty.indexOf('opacity') === -1) {
					oE.style.webkitTransitionProperty = oE.style.webkitTransitionProperty + ',opacity';
				}
				oE.style.opacity = 1;
			}, 10);
		};
		Element.prototype.fadeOut = function (psDuration) {
			var sD = (psDuration ? psDuration + 'ms' : '500ms');
			this.style.webkitTransitionDuration = sD;
			this.style.opacity = 0;
			var oE = this;
			setTimeout(function () {
				oE.style.display = 'none';
			}, psDuration || 500);
		};
		Element.prototype.hide = function () {
			this.style.display = 'none';
		}
	}

	function getElement(psIdOrClass) {
		var hElement;
		if (psIdOrClass.substring(0, 1) !== '.') {
			hElement = document.getElementById(psIdOrClass);
		} else {
			hElement = [];
			var elements = document.getElementsByClassName(psIdOrClass.substring(1));
			var iLen = elements.length;
			for (var ii = 0; ii < iLen; ii++) {
				hElement.push(elements[ii]);
			}
		}
		return hElement;
	}

	function jumpToSlide(psSlide, psPresentation) {
		if (psSlide === 'next') {
			com.veeva.clm.nextSlide();
		}
		else if (psSlide === 'prev') {
			com.veeva.clm.prevSlide();
		}
		else {
			com.veeva.clm.gotoSlide(psSlide + '.zip', psPresentation);
		}
	}

	oApi.getHorizontalPage = function () {
		return miHorizontalPage;
	};

	oApi.setHorizontalPage = function (i) {
		miHorizontalPage = i;
		var hSection = getElement('horizontalSection');
		hSection.style.transitionDuration = '0s';
		hSection.style.webkitTransitionDuration = '0s';
		hSection.style.webkitTransform = 'translateX(' + (miHorizontalPage * -1024) + 'px)';
		setTimeout(function () {
			hSection.style.transitionDuration = '0.6s';
			hSection.style.webkitTransitionDuration = '0.6s';
		}, 100);
	};

	oApi.getVerticalPage = function () {
		return miVerticalPage;
	};

	oApi.setVerticalPage = function (i) {
		miVerticalPage = i;
		var hSection = getElement('section')
		hSection.style.transitionDuration = '0s';
		hSection.style.webkitTransitionDuration = '0s';
		hSection.style.webkitTransform = 'translateY(' + (miVerticalPage * -768) + 'px)';
		setTimeout(function () {
			hSection.style.transitionDuration = '0.6s';
			hSection.style.webkitTransitionDuration = '0.6s';
		}, 100);
	};

	function initCLicksByClasses() {
		// Popups
		oApi.click('.openPopup', function (e) {
			getElement(e.currentTarget.dataset.popup).fadeIn();
		});
		oApi.click('.closePopup', function (e) {
			e.currentTarget.parentElement.fadeOut();
		});
		// Next prev navigation buttons
		oApi.click('.btn_next', function () {
			com.veeva.clm.nextSlide();
		});
		oApi.click('.btn_back', function () {
			com.veeva.clm.prevSlide();
		});
		// Go to slide buttons
		oApi.click('.veeva-goto', function (e) {
			jumpToSlide(e.currentTarget.dataset.gotoVeeva, e.currentTarget.dataset.gotoVeevaPresentation || '');
		});
		oApi.click('.slide-goto', function (e) {
			var iSlideIndex = parseInt(e.currentTarget.dataset.slideIndex);
			if (!isNaN(iSlideIndex)) {
				oApi.setHorizontalPage(iSlideIndex);
			} else {
				com.usacd.screenConsole.log('::com::usacd::slides::setHorizontalPage - data-slide-index ERROR', 'ERROR');
			}
		});
		oApi.click('.slide-vertical-goto', function (e) {
			var iSlideIndex = parseInt(e.currentTarget.dataset.slideIndex);
			if (!isNaN(iSlideIndex)) {
				oApi.setVerticalPage(iSlideIndex);
			} else {
				com.usacd.screenConsole.log('::com::usacd::slides::setVerticalPage - data-slide-index ERROR', 'ERROR');
			}
		});
		// Scrollable elements
		var scrolls = getElement('.scrollable');
		var iLen = scrolls.length;
		for (var ii = 0; ii < iLen; ii++) {
			scrolls[ii].addEventListener('touchmove', function (e) {
				e.cancelBubble = true;
				return true;
			});
			scrolls[ii].addEventListener('touchstart', function (e) {
				e.cancelBubble = true;
				return true;
			});
		}
	}

	_this.msPresentationId = null;
	_this.msKeyMessageViewedStorageKey = null;
	_this.mfCallback = null;
	function storeKeyMessageViewedByAccountId(psPresentationId, pfCallback) {
		com.usacd.screenConsole.log('::com::usacd::slides::storeKeyMessageViewedByAccountId');
		_this.mfCallback = pfCallback;
		_this.msPresentationId = psPresentationId;
		oApi.getAccountId(onAccountIdGet);
	}

	function onAccountIdGet() {
		_this.msKeyMessageViewedStorageKey = _this.msPresentationId + oApi.gsAccountId + '_KeyMViewed';
		Date.now = Date.now || function () { return +new Date; };
		var oDefaultKMV =
		{
			time: Date.now(),
			lastKM: oApi.gsSlideName,
			viewedKM: {}
		};
		var oStoredKeyMessageViewed = JSON.parse(localStorage.getItem(_this.msKeyMessageViewedStorageKey)) || oDefaultKMV;
		oStoredKeyMessageViewed.viewedKM[oApi.gsSlideName] = true;
		oStoredKeyMessageViewed.time = Date.now();
		oStoredKeyMessageViewed.lastKM = oApi.gsSlideName;
		// Store as viewed after 500 ms
		setTimeout(function () {
			localStorage.setItem(_this.msKeyMessageViewedStorageKey, JSON.stringify(oStoredKeyMessageViewed));
		}, 500);
		_this.mfCallback();
	}

	function onVeevaSlidesReady() {
		com.usacd.screenConsole.log('::com::usacd::slides::onVeevaSlidesReady');
		_this.dispatchEvent(new CustomEvent('veevaSlidesReady'));
		Slide.init();
	}

	/**
	 *  Veeva Account ID
	 * @alias com.usacd.slides.gsAccountId
	 * @memberof! com.usacd.slides#
	 *  @type {string}
	 */
	oApi.gsAccountId;
	var msDefaultAccountId = '_NO_ACCOUNT';
	/**
	 * Gets the Veeva Account Id
	 * @alias com.usacd.slides.getAccountId
	 * @memberof! com.usacd.slides#
	 * @param {function} pfCallback
	 */
	oApi.getAccountId = function (pfCallback) {
		com.usacd.screenConsole.log('::com::usacd::slides::getAccountId');
		try {
			// Get surname, name
			com.veeva.clm.getDataForCurrentObject('Account', 'ID', function (poResult) {
				if (poResult.success) {
					oApi.gsAccountId = poResult.Account.ID;
				}
				else {
					oApi.gsAccountId = msDefaultAccountId;
				}
				com.usacd.screenConsole.log('::com::usacd::slides::getAccountId - ' + oApi.gsAccountId);
				pfCallback();
			});
		}
		catch (e) {
			oApi.gsAccountId = msDefaultAccountId;
			com.usacd.screenConsole.log('::com::usacd::slides::getAccountId:: - ' + oApi.gsAccountId);
			pfCallback();
		}
	};
	/**
	 * Get the key messages viewed object (if store is active)
	 * @alias com.usacd.slides.getKeyMessagesViewed
	 * @memberof! com.usacd.slides#
	 * @returns {object} {time: number, lastKM: string, viewedKM: {}}
	 */
	oApi.getKeyMessagesViewed = function () {
		var oDefaultKMV =
		{
			time: Date.now(),
			lastKM: '',
			viewedKM: {}
		};
		var oStoredKeyMessageViewed;
		if (msKeyMessageViewedStorageKey) {
			oStoredKeyMessageViewed = JSON.parse(localStorage.getItem(msKeyMessageViewedStorageKey)) || {};
		}
		return oStoredKeyMessageViewed || oDefaultKMV;
	};

	/**
	 * Removes the stored key messages viewed
	 * @alias com.usacd.slides.removeKeyMessageViewed
	 * @memberof! com.usacd.slides#
	 */
	oApi.removeKeyMessageViewed = function () {
		localStorage.removeItem(msKeyMessageViewedStorageKey);
	};

	/**
	 * Sets a goto veeva link
	 * @alias com.usacd.slides.setGotoVeeva
	 * @memberof! com.usacd.slides#
	 * @param {string} psIdOrClass HTML id or class
	 */
	oApi.setGotoVeeva = function (psIdOrClass) {
		oApi.click(psIdOrClass, function (e) {
			jumpToSlide(e.currentTarget.dataset.gotoVeeva, e.currentTarget.dataset.gotoVeevaPresentation || '');
		});
	};
    /**
     * Get an HTMLElement by id or an Array of HTMLElements by class
	 * @alias com.usacd.slides.getElement
	 * @memberof! com.usacd.slides#
     * @param {string} psIdOrClass HTML Element id or Class
     * @returns {array | HTMLElement}
     */
	oApi.getElement = function (psIdOrClass) {
		return getElement(psIdOrClass);
	};
	/**
	 * Set a fade in for one ore more HTML elements
	 * @alias com.usacd.slides.show
	 * @memberof! com.usacd.slides#
	 * @param {string} psIdOrClass HTML Element id or Class
	 * @param {integer} durationTime Milliseconds
	 */
	oApi.show = function (psIdOrClass, durationTime) {
		durationTime = durationTime || 500;
		var pElements = getElement(psIdOrClass);
		if (Array.isArray(pElements)) {
			var iLen = pElements.length;
			for (var ii = 0; ii < iLen; ii++) {
				pElements[ii].fadeIn(durationTime);
			}
		} else {
			pElements.fadeIn(durationTime);
		}
	};
	/**
	 * Set style display for one ore more HTML elements
	 * @alias com.usacd.slides.display
	 * @memberof! com.usacd.slides#
	 * @param {string} psIdOrClass
	 * @param {string} style block or none
	 */
	oApi.display = function (psIdOrClass, style) {
		style = style || 'block';
		var pElements = getElement(psIdOrClass);
		if (Array.isArray(pElements)) {
			var iLen = pElements.length;
			for (var ii = 0; ii < iLen; ii++) {
				pElements[ii].style.display = style;
			}
		} else {
			pElements.style.display = style;
		}
	};
	/**
	 * Set a fade out in for one ore more HTML elements
	 * @alias com.usacd.slides.hide
	 * @memberof! com.usacd.slides#
	 * @param {string} psIdOrClass HTML Element id or Class
	 * @param {integer} durationTime Milliseconds
	 */
	oApi.hide = function (psIdOrClass, durationTime) {
		durationTime = durationTime || 500;
		var pElements = getElement(psIdOrClass);
		if (Array.isArray(pElements)) {
			var iLen = pElements.length;
			for (var ii = 0; ii < iLen; ii++) {
				pElements[ii].fadeOut(durationTime);
			}
		} else {
			pElements.fadeOut(durationTime);
		}
	};
	/**
	 * Set a "click" event for one ore more HTML elements
	 * @alias com.usacd.slides.click
	 * @memberof! com.usacd.slides#
	 * @param {string} psIdOrClass HTML Element id or Class
	 * @param {function} psFunction
	 */
	oApi.click = function (psIdOrClass, psFunction) {
		var element = getElement(psIdOrClass);
		if (Array.isArray(element)) {
			var iLen = element.length;
			for (var ii = 0; ii < iLen; ii++) {
				element[ii].addEventListener(EVENT_UP, psFunction);
				element[ii].style.cursor = 'pointer';
			}
		} else {
			element.addEventListener(EVENT_UP, psFunction);
			element.style.cursor = 'pointer';
		}
	};
	/**
	 * Remove a "click" event for one ore more HTML elements
	 * @alias com.usacd.slides.removeClick
	 * @memberof! com.usacd.slides#
	 * @param {string} psIdOrClass HTML Element id or Class
	 * @param {function} psFunction
	 */
	oApi.removeClick = function (psIdOrClass, psFunction) {
		var element = getElement(psIdOrClass);
		if (Array.isArray(element)) {
			var iLen = element.length;
			for (var ii = 0; ii < iLen; ii++) {
				element[ii].removeEventListener(EVENT_UP, psFunction);
			}
		} else {
			element.removeEventListener(EVENT_UP, psFunction);
		}
	};

	/**
	 *
	 * @param {string} psName   cookie name
	 * @returns {string} {Boolean} cookie value or false
	 */
	oApi.getCookie = function (psName) {

		var value = localStorage.getItem(psName);

		if (value) {
			return value;
		} else {
			return null;
		}
	};
	/**
	 *
	 * @param {string} psName
	 * @param {string} psValue
	 */
	oApi.setCookie = function (psName, psValue) {

		localStorage.setItem(psName, psValue);
	};
	/**
	 * Init custom swipe external
	 * @alias com.usacd.slides.initCustomSwipe
	 * @memberof! com.usacd.slides#
	 */
	oApi.initCustomSwipe = function () {
		if (!bCustomSwipeInitialized) initCustomSwipe();
	};
	/**
	 * Slide name
	 * @alias com.usacd.slides.gsSlideName
	 * @memberof! com.usacd.slides#
	 * @type {string}
	 */
	oApi.gsSlideName;
	/**
	 * Main initializer
	 */
	oApi.init = function (poOptions) {
		function initialize() {
			com.usacd.screenConsole.log('::com::usacd::slides::init - Version: ' + msVersion);
			com.usacd.screenConsole.log('&nbsp;&nbsp;&nbsp;&nbsp;options: ' + JSON.stringify(poOptions));
			var aHref = window.location.href.split('/');
			aHref.pop();
			oApi.gsSlideName = aHref.pop();
			body = document.body;
			setTransitionEvents();
			setPlatformDependantEvents();
			initCustomSwipe();
			initCLicksByClasses();
			if (poOptions.storeViewedKMKey) {
				storeKeyMessageViewedByAccountId(poOptions.storeViewedKMKey, function () {
					onVeevaSlidesReady();
				});
			}
			else if (poOptions.getAccountId) {
				oApi.getAccountId(onVeevaSlidesReady);
			}
			else {
				onVeevaSlidesReady();
			}
		}

		if (poOptions.debugMode) {
			if (com.usacd.screenConsole) {
				com.usacd.screenConsole.initialize();
			}
			initialize();
		}
		else {
			com.usacd.screenConsole = { log: function () { return; } };
			initialize();
		}
	};

	return oApi;
}());

document.addEventListener("DOMContentLoaded", function (event) {
	$ = com.usacd.slides;
	$.init(com.usacd.slidesOptions);
});
/**
 * On screen console.<br>
 * Three levels: log, warning and error.<br>
 * Click on the blue square to open console.<br>
 * Click on the title to clean console.<br>
 * @namespace
 * @memberOf com.usacd
 */
com.usacd.screenConsole = (function () {
	var goApi = {};
	var mhConsole;
	var mhHeader;
	var mhContent;
	var moColors =
	{
		log: 'black',
		warn: 'orangered',
		error: 'darkred'
	};

	function initialize() {
		console.log('::com::usacd::screenConsole::initialize');
		mhConsole = document.createElement('div');
		mhConsole.className = 'screenConsoleOverlay';

		var hOpenBtn = document.createElement('div');
		hOpenBtn.className = 'screenOpenBtn';
		document.body.appendChild(hOpenBtn);

		var hChild = document.createElement('div');
		hChild.className = 'screenConsole';

		mhHeader = document.createElement('h2');
		mhHeader.innerHTML = 'CONSOLE';

		var hClose = document.createElement('a');
		hClose.className = 'close';
		hClose.innerHTML = '&times;';

		mhContent = document.createElement('pre');
		mhContent.className = 'consoleContent';

		hChild.appendChild(mhHeader);
		hChild.appendChild(hClose);
		hChild.appendChild(mhContent);
		mhConsole.appendChild(hChild);

		if (window.navigator.pointerEnabled) {
			EVENT_UP = 'pointerup';
		}
		else if ('ontouchstart' in window) {
			EVENT_UP = 'touchend';
		}
		else {
			EVENT_UP = 'mouseup';
		}

		hClose.addEventListener(EVENT_UP, close);
		hOpenBtn.addEventListener(EVENT_UP, open);
		mhHeader.addEventListener(EVENT_UP, clean);
	}

	function clean() {
		mhContent.innerHTML = '';
	}

	function open() {
		document.body.appendChild(mhConsole);
	}

	function close() {
		document.body.removeChild(mhConsole);
	}

	/**
	 *
	 * @alias com.usacd.screenConsole.log
	 * @memberof! com.usacd.screenConsole#
	 * @param {string} psText Text to print
	 * @param {string} psType log, warn or error
	 */
	goApi.log = function (psText, psType) {
		var sType = psType || 'log';
		console[sType](psText);
		mhContent.innerHTML += '<span style="color: ' + moColors[sType] + ';">' + psText + '</span><br/>';
	};

	goApi.initialize = initialize;
	return goApi;
}());
(function () {

	if (typeof CustomEvent !== 'function') {
		function customEvent(event, params) {
			params = params || { bubbles: false, cancelable: false, detail: undefined };
			var evt = document.createEvent('CustomEvent');
			evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
			return evt;
		}
		customEvent.prototype = window.Event.prototype;
		window.CustomEvent = customEvent;
	}
})();
/**
 * Basic set for com.usacd.slides customization.<br>
 * @namespace
 * @memberOf com.usacd
 * @property {string}  storeViewedKMKey A string identifying the presentation or null if you don't want to store the viewed KM
 * @property {boolean} getAccountId If true the account id will be accessible via: com.usacd.slides.gsAccountId
 * @property {boolean} debugMode Don't forget set to false when deploying on prod!
 */
com.usacd.slidesOptions =
	{
		storeViewedKMKey: null,
		getAccountId: false,
		debugMode: false
	};