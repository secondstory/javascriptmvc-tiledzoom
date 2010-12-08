SS.Controller.StateMachine.extend('Artifact.Controllers.MediumZoomController',
{
  states: {
    initial:    { readyForMediumImage: "showOnLoad", 
                  loaded:              "loaded" },
    
    loaded:     { readyForMediumImage: "visible" },
    
    showOnLoad: { "loaded": "visible" },
    
    visible:    { onEnter: "setImageSrc" }
  }
},
{
  mediumWidth:      null,
  mediumHeight:     null,
  mediumImage:      null,
  originalPosition: null,
  
  setup: function() {
    this._super.apply(this, arguments);
  },
  
  init: function(elem) {
    this.container    = $("#artifact-detail");
    this.offsetElem   = this.find(".offset");
    this.mediumWidth  = this.container.outerWidth();
    this.imageElem    = this.find("img");
    this.mediumHeight = Math.floor(this.mediumWidth * (this.imageElem.height() / this.imageElem.width()));

    this.loadMediumImage();
  },
  
  loadMediumImage: function() {
    var mediumSrc  = this.element.data("assetPath");
        mediumSrc += "$re-medium-zoom$";
    
    this.mediumImage = new Image;
    this.mediumImage.onload = this.callback(function() {
      this.publishState("loaded");
    });
    this.mediumImage.src = mediumSrc;
  },
  
  setImageSrc: function() {
    this.imageElem.attr({ src: this.mediumImage.src });
  },
  
  "zoomSmallToMedium subscribe": function() { this.zoomAnyToMedium(); },
  "zoomLargeToMedium subscribe": function() { this.zoomAnyToMedium(); },
  
  zoomAnyToMedium: function() {
    var self = this;

    this.find('.tile').remove();
    
    this.offsetElem.animate({ 
      top:  108,
      left: 0
    });
    
    var heightWithOffsetAndPadding = this.mediumHeight + 108 + 36;
    
    this.element.animate({
      width:  this.mediumWidth,
      height: heightWithOffsetAndPadding
    });
    
    this.container.animate({
      height: heightWithOffsetAndPadding
    });
    
    this.imageElem.animate({
      width:  this.mediumWidth,
      height: this.mediumHeight 
    }, this.callback(function() {
      this.publishState("readyForMediumImage");
      this.publish("didZoomToMedium");
    }));
  }
});
