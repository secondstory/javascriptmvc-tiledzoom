$.Controller.extend('Artifact.Controllers.SmallZoomController',
{
},
{
  // Specific to HTML, should be generalized
  setup: function(elem, options) {
    this.originalElem = $(elem);
    this.container    = $("#artifact-detail");
    
    var wrapper = $("<div class='zoomWrapper'><div class='offset'></div></div>").appendTo(this.container);
    wrapper.css({ width: this.originalElem.width(), height: $("#artifact-detail").outerHeight() });
    wrapper.find('.offset').append(this.originalElem.clone());
    wrapper.data("assetPath", elem.src.split("?")[0] + "?");
    
    wrapper.position({
      my:        "left top",
      at:        "left top",
      of:        this.container,
      offset:    "0 1", // Take border into account
      collision: "none"
    });

    this._super.apply(this, [wrapper.get(0), options]);
  },
  
  init: function() {
    this.offsetElem   = this.find(".offset");
    this.imageElem    = this.find("img");
    
    this.originalPosition = {
      "containerHeight": this.container.outerHeight()
    };
  
    this.element.artifact_medium_zoom();
    this.element.artifact_large_zoom();
  },
  
  "zoomMediumToSmall subscribe": function() { this.zoomAnyToSmall(); },
  "zoomLargeToSmall subscribe":  function() { this.zoomAnyToSmall(); },
  
  zoomAnyToSmall: function() {
    this.find('.tile').remove();
    
    this.offsetElem.animate({ 
      top:        108,
      left:       23
    });
    
    this.container.animate({ 
      height: this.originalPosition.containerHeight 
    });

    this.imageElem.animate({
      width:  this.originalElem.width(), 
      height: this.originalElem.height()
    }, this.callback(function() {
      this.publish("didZoomToSmall");
      this.element.remove();
    }));
  }
});
