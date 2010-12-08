$.Controller.extend("Artifact.Controllers.TileController", {
  tileWidth:  200,
  tileHeight: 200,
  listensTo:  ["loadTile"]
},
{
  init: function(elem, options) {
    this.verticalOffset   = (this.Class.tileHeight * options.y);
    this.horizontalOffset = this.Class.tileWidth * options.x;
    this.tileSrc          = this.getTileSrc(options.imageSrc);
          
    this.element.css({ 
      width:  this.Class.tileWidth, 
      height: this.Class.tileHeight,
      top:    this.verticalOffset + options.marginY,
      left:   this.horizontalOffset + options.marginX
    });
  },
  
  loadTile: function() {
    this.element.css({
      background: "url(" + this.tileSrc + ") no-repeat"
    });
  },
  
  // Specific to Adobe Scene7, should be generalized
  getTileSrc: function(tileSrc) {
    tileSrc += "align=-1,-1&scl=1&rgn=" + this.horizontalOffset + "," +
                              this.verticalOffset + "," + 
                              (this.Class.tileWidth) + "," +
                              (this.Class.tileHeight);
    return tileSrc;
  }
});
