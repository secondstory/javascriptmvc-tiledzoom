SS.Controller.StateMachine.extend('Artifact.Controllers.LargeZoomController',
{
  states: {
    global:     { "zoomLargeToMedium subscribe": "loaded" },
  
    initial:    { "zoomSmallToLarge subscribe":  "showOnLoad", 
                  "zoomMediumToLarge subscribe": "showOnLoad", 
                  loaded: "loaded" },
    
    loaded:     { "zoomSmallToLarge subscribe":  "visible",
                  "zoomMediumToLarge subscribe": "visible" },
    
    showOnLoad: { "loaded": "visible" },
    
    visible:    { onEnter: "buildTiles" }
  }
},
{
  init: function() {
    this.container    = $("#artifact-detail");
    this.offsetElem   = this.find(".offset");
    this.mediumWidth  = this.container.outerWidth();
    this.imageElem    = this.find("img");
    this.mediumHeight = Math.floor(this.mediumWidth * (this.imageElem.height() / this.imageElem.width()));
    
    this.getLargeDimensions();
  },
  
  buildTiles: function() {
    if (!this.element) {
      return;
    }
  
    var massiveWidth  = this.largeWidth;
    var massiveHeight = this.largeHeight;
    
    var realHeight = this.mediumHeight;
    
    var largeX = 0;
    var largeY = 0;
    
    var marginX = 0;
    var marginY = 0;
    
    var largeMarginX = 0;
    var largeMarginY = 0;
    // trim v space
    var realHeight = (this.largeHeight / this.largeWidth) * this.mediumWidth;
    if (realHeight < this.mediumHeight) {
      marginY        = (this.mediumHeight - realHeight) / 2;
      largeMarginY   = (this.largeHeight / realHeight) * marginY;
      massiveHeight += (2 * largeMarginY);
    }
    
    // trim h space
    var realWidth = (this.largeWidth / this.largeHeight) * this.mediumHeight;
    if (realWidth < this.mediumWidth) {
      marginX       = (this.mediumWidth - realWidth) / 2;
      largeMarginX  = (this.largeWidth / realWidth) * marginX;
      massiveWidth += (2 * largeMarginX);
    }
    
    largeX = -largeMarginX;
    largeY = -largeMarginY;
    var ratioY   = this.mediumHeight / this.largeHeight;
    var ratioX   = realWidth / this.largeWidth;
    
    var self = this;
    
    this.element.position({
      my:        "left top",
      at:        "left top",
      of:        this.container,
      offset:    "0 1", // Take border into account
      collision: "none",
      using: function(params) {
        $.extend(params, { 
          width:      self.mediumWidth,
          height:     self.mediumHeight
        });
        
        $(this).animate(params);
      }
    });
    
    this.container.animate({ 
      height: this.mediumHeight 
    });
    
    this.imageElem.animate({ 
      width:  massiveWidth, 
      height: massiveHeight
    });
    
    this.offsetElem.animate({ 
                      top:        largeY, 
                      left:       largeX
                    }, this.callback(function() {
      var horizontalTiles = Math.ceil(this.largeWidth / Artifact.Controllers.TileController.tileWidth);
          verticalTiles   = Math.ceil(this.largeHeight / Artifact.Controllers.TileController.tileHeight);
      
      for (var y = 0; y < verticalTiles; y++) {
        for (var x = 0; x < horizontalTiles; x++) {
          $("<div class='tile' />").artifact_tile({
            imageSrc: this.element.data("assetPath"),
            marginX:  largeMarginX,
            marginY:  largeMarginY,
            x:        x,
            y:        y
          }).appendTo(this.offsetElem);
        }
      }
      
      this.loadViewport();
      this.offsetElem.live("dragend", this.callback("loadViewport"));
      
      this.publish("didZoomToLarge");
    }));
  },
  
  loadViewport: function() {
    var topOffset  = this.element.offset().top,
        leftOffset = this.element.offset().left;
        
    this.offsetElem.find(".tile")
                   .withinBox(leftOffset, topOffset, 
                              this.element.width(), this.element.height())
                   .trigger("loadTile");
  },
  
  // Specific to Adobe Scene7, should be generalized
  getLargeDimensions: function() {
    var largeWidth1pxSrc  = this.element.data("assetPath");
        largeWidth1pxSrc += "scl=2&rgn=0,0,0,1";
  
    var largeWidthImage = new Image;
    largeWidthImage.onload = this.callback(function() {
      this.largeWidth   = largeWidthImage.width * 2;
      
      var largeHeight1pxSrc  = this.element.data("assetPath");
          largeHeight1pxSrc += "scl=2&rgn=0,0,1,0";
    
      var largeHeightImage = new Image;
      largeHeightImage.onload = this.callback(function() {
        this.largeHeight   = largeHeightImage.height * 2;
        this.publishState("loaded");
      });
      largeHeightImage.src = largeHeight1pxSrc;
    });
    
    largeWidthImage.src = largeWidth1pxSrc;
  }
});
