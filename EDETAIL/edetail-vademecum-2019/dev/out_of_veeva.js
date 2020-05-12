/**
 * Created by Ernest on 04/11/15.
 */
var com = com || {};
com.usacd = com.usacd || {};
com.usacd.presentation = (function () {
	/**
	 * Customize here your presentation
	 * flows and its slides
	 */
	var sMainPresentationName = 'edetail-vademecum-2019';
	var oFlows =
	{
		'edetail-vademecum-2019':
			[
				{ file: 'ES_ELO_00004_2019_4_Ed_Vadem_010_Home', order: 0 },
				{ file: 'ES_ELO_00004_2019_4_Ed_Vadem_020_Indice', order: 0 },
				{ file: 'ES_ELO_00004_2019_4_Ed_Vadem_030_Elonva_Presentaciones', order: 0 },
				{ file: 'ES_ELO_00004_2019_4_Ed_Vadem_040_Elonva_Indicacion', order: 0 },
				{ file: 'ES_ELO_00004_2019_4_Ed_Vadem_050_Elonva_Posologia', order: 0 },
				{ file: 'ES_ELO_00004_2019_4_Ed_Vadem_060_Elonva_Administracion', order: 0 },
				{ file: 'ES_ELO_00004_2019_4_Ed_Vadem_070_Elonva_Administracion', order: 0 },
				{ file: 'ES_ELO_00004_2019_4_Ed_Vadem_080_Puregon_Presentaciones', order: 0 },
				{ file: 'ES_ELO_00004_2019_4_Ed_Vadem_090_Puregon_Indicacion', order: 0 },
				{ file: 'ES_ELO_00004_2019_4_Ed_Vadem_0100_Puregon_Posologia', order: 0 },
				{ file: 'ES_ELO_00004_2019_4_Ed_Vadem_0110_Puregon_Administracion', order: 0 },
				{ file: 'ES_ELO_00004_2019_4_Ed_Vadem_0120_Puregon_Administracion', order: 0 },
				{ file: 'ES_ELO_00004_2019_4_Ed_Vadem_0130_Puregon_Pen_Caracteristicas', order: 0 },
				{ file: 'ES_ELO_00004_2019_4_Ed_Vadem_0140_Orgalutran_Presentaciones', order: 0 },
				{ file: 'ES_ELO_00004_2019_4_Ed_Vadem_0150_Orgalutran_Indicacion', order: 0 },
				{ file: 'ES_ELO_00004_2019_4_Ed_Vadem_0160_Orgalutran_Posologia', order: 0 },
				{ file: 'ES_ELO_00004_2019_4_Ed_Vadem_0170_Orgalutran_Posologia', order: 0 },
				{ file: 'ES_ELO_00004_2019_4_Ed_Vadem_0180_Orgalutran_Administracion', order: 0 },
				{ file: 'ES_ELO_00004_2019_4_Ed_Vadem_0190_Bibliografia', order: 0 },
				{ file: 'ES_ELO_00004_2019_4_Ed_Vadem_0200_Cierre', order: 0 }
			]
	};



	/**
	 * Enable/disable veeva swipe simulation
	 * @type {boolean}
	 */
	var bSimulateSwipe = false;

	var iSlideOrder, aCurrentFlow;
	var sIndex = '/index.html';
	/**
	 * Jump to next slide on the current presentation
	 */
	function nextSlide() {
		if (iSlideOrder < aCurrentFlow.length - 1) {
			window.location.href = '../' + aCurrentFlow[iSlideOrder + 1].file + sIndex;
		}
		else {
			console.error('(Out of veeva) com.usacd.presentation.nextSlide::', 'No more slides on this flow');
		}
	}
	/**
	 * Jump to previous slide on the current presentation
	 */
	function prevSlide() {
		if (iSlideOrder > 0) {
			window.location.href = '../' + aCurrentFlow[iSlideOrder - 1].file + sIndex;
		}
		else {
			console.error('(Out of veeva) com.usacd.presentation.prevSlide::', 'This is the first slide on this flow');
		}
	}
	/**
	 * Jump to the slide set by sSlide parameter
	 * @param sSlide
	 */
	function gotoSlide(sSlide, sPresentation) {
		if (sPresentation == undefined || sPresentation == '') {
			window.location.href = '../' + sSlide.split('.zip').shift() + sIndex;
		}
		else {
			window.location.href = '../../' + sPresentation + '/' + sSlide.split('.zip').shift() + sIndex;
		}
	}
	/**
	 * Override com.veeva.clm methods
	 * For next improvements add the new method here on
	 * com.usacd.presentation and override it inside
	 * this function
	 */
	function overrideVeevaMethods() {
		if (com.veeva && com.veeva.clm) {
			console.log('(Out of veeva) com.usacd.presentation.overrideVeevaMethods::');
			com.veeva.clm.gotoSlide = gotoSlide;
			com.veeva.clm.nextSlide = nextSlide;
			com.veeva.clm.prevSlide = prevSlide;
			com.veeva.clm.getDataForCurrentObject = function (psObject, psField, pfCallback) {
				var oResult = {};
				oResult.Account = {};
				oResult.User = {};
				// TODO: add needed result
				oResult.Account.ID = 'ABC123';
				oResult.User.Username = 'javier.gutierrez@usacd.com';
				oResult.User.Approved_Email_Admin_vod__c = 'true';
				oResult.User.CustomStorage__c = JSON.parse(localStorage.getItem('CustomStorage__c')) || {};

				oResult.success = (oResult[psObject][psField] ? true : false);
				setTimeout(function () { pfCallback(oResult) }, 100);
			};
			com.veeva.clm.getApprovedDocument = function (psObject, psField, pfCallback) {
				console.log('(Out of veeva) ::com.veeva.clm.getApprovedDocument::');
				setTimeout(function () { pfCallback({ success: true, Approved_Document_vod__c: { Id: 'AdBc00Ee*' + psField } }) }, 100);
				//setTimeout(function(){pfCallback({success:false})}, 100);
			};
			com.veeva.clm.launchApprovedEmail = function (psObject, psField, pfCallback) {
				console.log('(Out of veeva) ::com.veeva.clm.launchApprovedEmail::');
				setTimeout(function () { pfCallback({ success: true }) }, 100);
			};
			com.veeva.clm.queryRecord = function (psObject, fields, where, sort, limit, pfCallback) {
				console.log('(Out of veeva) ::com.veeva.clm.queryRecord::');
				var oResult = {};
				if (psObject === 'Veeva_Settings_vod__c') {
					oResult.success = true;
					oResult.Veeva_Settings_vod__c = [{ CLM_SELECT_ACCOUNT_PREVIEW_MODE_vod__c: true }];
				}
				if (psObject === 'Approved_Document_vod__c') {
					oResult.success = true;
					oResult.Approved_Document_vod__c = [{ Id: 'AdBc00Ee*' + where.split('=')[1].split(' AND')[0] }];
				}
				setTimeout(function () { pfCallback(oResult) }, 100);
			}
		}
		else {
			setTimeout(overrideVeevaMethods, 10);
		}
	}
	function startSwipeControl() {
		if ($ && $.EVENT_DOWN && !document.body.dataset.swipeNext && !document.body.dataset.swipePrev && !document.body.dataset.preventExternalSwipe) {
			console.log('(Out of veeva) com.usacd.presentation.startSwipeControl::');
			switch ($.EVENT_DOWN) {
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
				iStartX = poE.getX();
				iStartY = poE.getY();
				iTime = Date.now();
			}
			function endSwipe(poE) {
				iDeltaX = iStartX - poE.getX();
				iDeltaY = iStartY - poE.getY();
				if (iDeltaY < 50 && Math.abs(iDeltaX) > 50 && (Date.now() - iTime < 500)) {
					iDeltaX > 0 ? nextSlide() : prevSlide();
				}
			}
			document.body.addEventListener($.EVENT_DOWN, initSwipe);
			document.body.addEventListener($.EVENT_UP, endSwipe);
		}
		else {
			setTimeout(startSwipeControl, 10)
		}
	}
	/**
	 *
	 */
	function initialize() {
		overrideVeevaMethods();
		document.body.style.width = '1024px';
		document.body.style.height = '768px';
		document.ondragstart = function (e) { e.preventDefault(); };
		document.onselectstart = function (e) { e.preventDefault(); };
		var sSlideName = window.location.href.split('/');
		sSlideName = sSlideName[sSlideName.length - 2];
		var sFlowName, aFlow, oFile, bExit;
		var bFound = false;
		// Try to get current presentation from cache
		var sPresentationNameCache = localStorage.getItem(sMainPresentationName + '_navigation');
		if (!(sPresentationNameCache && oFlows[sPresentationNameCache])) {
			sPresentationNameCache = null;
		}

		for (sFlowName in oFlows) {
			if ((sPresentationNameCache && sFlowName === sPresentationNameCache) || !sPresentationNameCache) {
				aFlow = oFlows[sFlowName];
				aFlow.sort(function (a, b) {
					if (a.order > b.order) {
						return 1;
					}
					if (a.order < b.order) {
						return -1;
					}
					return 0;
				});

				for (var i = 0; i < aFlow.length; i++) {
					oFile = aFlow[i];
					if (oFile.file === sSlideName) {
						iSlideOrder = i;
						aCurrentFlow = aFlow;
						bExit = true;
						bFound = true;
						break
					}
				}
				if (bExit) break;
			}
		}
		if (bSimulateSwipe) startSwipeControl();
		if (bFound) {
			console.log('(Out of veeva) com.usacd.presentation.initialize::', 'Presentation:', sFlowName, ',Slide:', sSlideName, ',Order:', iSlideOrder);
		}
		else {
			console.error('(Out of veeva) com.usacd.presentation.initialize:: slide not found on available presentations')
		}
	}
	initialize();
}());

com.usacd.createStyle = (function () {
	var miLeft, miTop, mhTextArea, miWidth, miHeight;

	function startGet(poE) {
		if (poE.shiftKey) {
			poE.preventDefault();
			poE.stopImmediatePropagation();
			miLeft = poE.getX();
			miTop = poE.getY();
			mhTextArea = document.createElement("textarea");
			mhTextArea.style.position = 'absolute';
			mhTextArea.style.backgroundColor = 'rgba(255, 0, 0, 0.1)';
			mhTextArea.style.border = 'red 3px inset';
			mhTextArea.style.left = miLeft + 'px';
			mhTextArea.style.top = miTop + 'px';
			mhTextArea.style.width = '2px';
			mhTextArea.style.height = '2px';
			mhTextArea.style.boxShadow = 'none';
			mhTextArea.style.resize = 'none';
			mhTextArea.style.overflow = 'hidden';
			document.body.appendChild(mhTextArea);
			document.body.addEventListener($.EVENT_MOVE, onDraw);
			document.body.addEventListener($.EVENT_UP, finishGet);
		}
	}

	function onDraw(poE) {
		miWidth = Math.abs(miLeft - poE.getX()) - 9;
		miHeight = Math.abs(miTop - poE.getY()) - 9;
		mhTextArea.style.width = miWidth + 'px';
		mhTextArea.style.height = miHeight + 'px';
	}

	function finishGet(poE) {
		poE.preventDefault();
		poE.stopImmediatePropagation();
		document.body.removeEventListener($.EVENT_UP, finishGet);
		document.body.removeEventListener($.EVENT_MOVE, onDraw);
		var sStyle = 'left: ' + miLeft + 'px; top: ' + miTop + 'px; width: ' + miWidth + 'px; height: ' + miHeight + 'px;';
		mhTextArea.value = sStyle;
		mhTextArea.select();
		document.execCommand('copy');
	}
	setTimeout(function (poError) {
		try {
			document.body.addEventListener($.EVENT_DOWN, startGet);
		} catch (poError) {
			console.warn(poError + ' - veeva-slides.js not loaded')
		}
	}, 300);
}());