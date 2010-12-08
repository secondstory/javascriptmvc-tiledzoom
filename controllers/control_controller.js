SS.Controller.StateMachine.extend('Artifact.Controllers.ControlController',
{
  states: {
    initial:              { loaded:                       "small" },
    
    zoomingMediumToSmall: { "didZoomToSmall subscribe":   "small",
                            onEnter:                      "zoomMediumToSmall" },
    zoomingLargeToSmall:  { "didZoomToSmall subscribe":   "small",
                            onEnter:                      "zoomLargeToSmall" },
                       
    small:                { ".medium click":              "zoomingSmallToMedium",
                            ".large click":               "zoomingSmallToLarge",
                            ".plus click":                "zoomingSmallToMedium",
                            onEnter:                      "enterSmall" },
               
    zoomingSmallToMedium: { "didZoomToMedium subscribe":  "medium",
                            onEnter:                      "zoomSmallToMedium" },
    zoomingLargeToMedium: { "didZoomToMedium subscribe":  "medium",
                            onEnter:                      "zoomLargeToMedium" },
                       
    medium:               { "backToSmall subscribe":      "zoomingMediumToSmall",
                            ".small click":               "zoomingMediumToSmall",
                            ".large click":               "zoomingMediumToLarge",
                            ".minus click":               "zoomingMediumToSmall",
                            ".plus click":                "zoomingMediumToLarge",
                            onEnter:                      "enterMedium" },
               
    zoomingSmallToLarge:  { "didZoomToLarge subscribe":   "large",
                            onEnter:                      "zoomSmallToLarge" },
    zoomingMediumToLarge: { "didZoomToLarge subscribe":   "large",
                            onEnter:                      "zoomMediumToLarge" },
    large:                { "backToSmall subscribe":      "zoomingLargeToSmall",
                            ".small click":               "zoomingLargeToSmall",
                            ".medium click":              "zoomingLargeToMedium",
                            ".minus click":               "zoomingLargeToMedium",
                            onEnter:                      "enterLarge"  }
  }
},
{
  zoomExists: false,
  moveToIndexAfterEnterSmall: false,

  init: function() {
    this.publishState("loaded");
    
    $(".big-scrollable").bind("onBeforeSeek", this.callback(function(event, index) {
      if (this.currentStateName !== "small") {
        this.moveToIndexAfterEnterSmall = index;
        event.preventDefault();
      }
      
      this.publish("backToSmall");
    }));
  },
  
  getAPI: function() {
    return $(".big-scrollable").data("scrollable");
  },
  
  getCurrentImage: function() {
    var api = $(".big-scrollable").data("scrollable");
    return this.getAPI().getItems().eq(api.getIndex()).find("img");
  },
  
  zoomSmallToMedium: function() { 
    this.getCurrentImage().artifact_small_zoom();
    this.publish("zoomSmallToMedium");
  },
  
  zoomSmallToLarge: function() { 
    this.getCurrentImage().artifact_small_zoom();
    this.publish("zoomSmallToLarge");
  },
  
  enterMedium: function() {
    this.setActiveState(".medium");
  },
  
  enterSmall: function() {
    this.setActiveState(".small");
    
    if (this.moveToIndexAfterEnterSmall !== false) {
      this.getAPI().seekTo(this.moveToIndexAfterEnterSmall);
      this.moveToIndexAfterEnterSmall = false;
    }
  },
  
  enterLarge:  function() { 
    this.setActiveState(".large");
  },
  
  setActiveState: function(activeClass) {
    this.find(activeClass).addClass("active");
    this.find(".small, .medium, .large").not(activeClass).removeClass("active");
  }
});
