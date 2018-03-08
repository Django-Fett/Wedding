(function() {
	var $doc = $(document);
	var $win = $(window);
	var $body = $("body");
	var $mobileScreen = $win.width() <= 360;
	var dhtmlCollection = {
		ShowGallery : function() {
			$("#photos .zoom").on({
				click : function(e) {
					if ($mobileScreen) {
						return;
					}

					e.preventDefault();
					var imgSrc = this.href;

					var modal = $(document.createElement("div"));
					modal.attr("id", "modal");

					var modalWrapper = $(document.createElement("div"));
					modalWrapper.addClass("modalWrapper");

					var modalContent = $(document.createElement("div"));
					modalContent.addClass("modalContent");

					var photoWrapper = $(document.createElement("div"));
					photoWrapper.addClass("photoWrapper");

					var bodyElement = $("body");
					bodyElement.addClass("modalized");

					var photo = $(document.createElement("img"));
					photo.addClass("photo");
					photo.attr("src", imgSrc);

					if (photo.width() <= 0) {
						photo.on({
							load : function(e) {
								var imgRef = $(this);

								if (imgRef.height() >= imgRef.width()){
									imgRef.addClass("tall");
								}
							},
							error : function(e) {
								$(this).attr("src", "http://placehold.it/200x200");
							}
						});
					}

					var closeButton = $(document.createElement("span"));
					closeButton.attr({
						"class" : "closeButton offscreen"
					});
					closeButton.text("Close");

					var closeLink = $(document.createElement("a"));
					closeLink.addClass("closeLink");
					closeLink.on("click", function(e) {
						modal.fadeOut(500);
						bodyElement.removeClass("modalized");
						modal.promise().done(function() {
							modal.remove();
						});
					});

					closeButton.appendTo(closeLink);
					closeLink.appendTo(photoWrapper);
					photo.appendTo(photoWrapper);
					photoWrapper.appendTo(modalContent);
					modalContent.appendTo(modalWrapper);
					modalWrapper.appendTo(modal);
					modal.appendTo(bodyElement);
					modal.fadeIn(500);
				}
			});
		},
		LoadImages : function() {
			var elementInViewport = function(el) {
				var rect = el.getBoundingClientRect();

				return ($win.width() <= 768 && ((rect.top >= -200 && rect.top <= (window.innerHeight || document.documentElement.clientHeight)) || (rect.bottom >= -200 && rect.bottom <= (window.innerHeight || document.documentElement.clientHeight))
				) && rect.left >= 0
				);
			};

			var loadPanelImages = function(panel) {
				var panelCore = panel.get(0);
				if (panelCore.imgLoaded) {
					return;
				}

				var _imgs = panel.find("img");
				var _img;

				for (var i = 0, j = _imgs.length; i < j; i++) {
					_img = $(_imgs[i]);
					_img.attr("src", _img.attr("data-src"));
				}

				panelCore.imgLoaded = true;
			};

			var findPanelFromURL = function(url) {
				var panelNameIdx = url.indexOf('#');
				var panelName = url.substring(panelNameIdx);
				if (panelNameIdx > 0 && panelName.length > 1) {
					return $(url.substring(panelNameIdx));
				}

				return null;
			};

			$doc.on("click.loadimages", ".main-menu .menu-item, .more-info .bridal-party", function(e) {
				var panel = findPanelFromURL(this.href);
				loadPanelImages(panel);
				$(this).off("click.loadimages");
			});

			$doc.on("ready", function(e) {
				var panel = findPanelFromURL(window.location.href);
				if (panel) {
					loadPanelImages(panel);
				}

				var panels = $(".panel");
				for (var i = 0, j = panels.length; i < j; i++) {
					if (elementInViewport(panels[i])) {
						loadPanelImages($(panels[i]));
					}
				}

				$doc.on("scroll.loadImages", function(e) {
					var loadedPanelsCnt = 0;
					for (var i = 0, j = panels.length; i < j; i++) {
						if (panels[i].imgLoaded) {
							loadedPanelsCnt++;
						} else if (elementInViewport(panels[i])) {
							loadPanelImages($(panels[i]));
						}
					}

					if (loadedPanelsCnt === panels.length) {
						$(this).off("scroll.loadImages");
					}
				});
			});
		},
		LoadAudio : function() {
			var soundObj = $(document.createElement("object"));
			
			if ($mobileScreen){
				return;
			}
			
			soundObj.attr({
				"class" : "soundtrack offscreen",
				"type" : "application/x-shockwave-flash",
				"data" : "/media/emff_stuttgart.swf",
				"height" : 100,
				"width" : 200
			});

			var param1 = $(document.createElement("param"));
			param1.attr({
				"name" : "movie",
				"value" : "/media/emff_stuttgart.swf"
			});

			var param2 = $(document.createElement("param"));
			param2.attr({
				"name" : "FlashVars",
				"value" : "src=/media/CoupleofForevers.mp3&volume=10&autoload=yes&autostart=yes"
			});

			var toggler = $(document.createElement("button"));
			toggler.attr({
				"class" : "soundMuter",
				"name" : "muter",
				"height" : 30,
				"width" : 200
			});
			toggler.text("Mute Track");

			toggler.on("click", function(e) {
				var target = e.target;
				target.active = !target.active;

				if (target.active) {
					soundObj.hide();
					toggler.text("Play Track");
					toggler.addClass("enabled");
				} else {
					soundObj.show();
					toggler.text("Mute Track");
					toggler.removeClass("enabled");
				}
			});

			param1.appendTo(soundObj);
			param2.appendTo(soundObj);
			soundObj.appendTo($body);
			toggler.appendTo($body);
		},
		LoadImageRotator : function() {
			var gallery = $(".gallery");
			var imgs = gallery.attr("data-src");

			if (imgs) {
				imgs = imgs.split(",");

				var img;
				var numLoaded = 0;
				for (var i = 0, k = imgs.length; i < k; i++) {
					img = $(document.createElement("img"));
					img.on("load", function() {
						numLoaded++;
						if (numLoaded == k) {
							gallery.addClass("active");
						}
					});
					img.attr("src", imgs[i]);

					gallery.prepend(img);
				}
			}
		}
	};

	dhtmlCollection.LoadImages();
	dhtmlCollection.LoadImageRotator();
	dhtmlCollection.ShowGallery();
	dhtmlCollection.LoadAudio();
})();
