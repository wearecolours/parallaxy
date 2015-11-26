 /*
 * Authors: Ivar Borthen
 * https://github.com/wearecolours/parallaxy
 * License: MIT license
 */

var Parallaxy = (function () {

  function parallaxy() {

    this.allElements = [];

    this.init = function(){
      this.getElements();
      this.update();
    }

    this.refresh = function(){
      this.allElements = [];
      this.init();
    }

    this.getElements = function(){

      var elements = document.querySelectorAll('[data-parallaxy]'),
      i,j,k,l,m,
      childrens,
      isImage;

      // Loop through all data-parallaxies and get immediate children elements //
      for(i=0, l=elements.length; i<l; i++){
        childrens = elements[i].childNodes;
        this.allElements[i] = {
          'container' : elements[i],
          'childrens' : [],
          'maxspeed' : elements[i].getAttribute('data-parallaxy-maxspeed') === null ? 0.9 : parseFloat(elements[i].getAttribute('data-parallaxy-maxspeed')),
          'minspeed' : elements[i].getAttribute('data-parallaxy-minspeed') === null ? 0.1 : parseFloat(elements[i].getAttribute('data-parallaxy-minspeed')),
        };
        k = 0;
        // Loop through childrens and get data.
        for(j=0, m=childrens.length; j<m; j++){
          if(childrens[j].nodeType === 1){ // is an element
            if(childrens[j].getAttribute('data-parallaxy-ignore') === null){ // should we ignore this element?
              isImage = (childrens[j].tagName === 'IMG' || childrens[j].tagName === 'VIDEO');
              this.allElements[i].childrens[k] = {
                'element' : childrens[j],
                'scalable' : (childrens[j].getAttribute('data-parallaxy-dontresize') === null ? isImage : false),
                'ready' : true,
                'scale' : 1,
                'originalWidth' : 0,
                'originalHeight' : 0
              };
              if(isImage){
                if(childrens[j].tagName === 'VIDEO'){
                  if(childrens[j].videoWidth === 0){
                    this.allElements[i].childrens[k].ready = false;
                    this.allElements[i].childrens[k].element.addEventListener('loadedmetadata', this.loadedImage.bind(this, this.allElements[i].childrens[k]));
                  } else {
                    this.allElements[i].childrens[k].originalWidth = this.allElements[i].childrens[k].element.style.width = childrens[j].videoWidth;
                    this.allElements[i].childrens[k].originalHeight = this.allElements[i].childrens[k].element.style.height = childrens[j].videoHeight; 
                  }
                } else {
                  if(childrens[j].naturalWidth === 0){
                    // image not loaded yet... add a loader event for image.
                    this.allElements[i].childrens[k].ready = false;
                    this.allElements[i].childrens[k].element.addEventListener('load', this.loadedImage.bind(this, this.allElements[i].childrens[k]));
                  } else {
                    this.allElements[i].childrens[k].originalWidth = this.allElements[i].childrens[k].element.style.width = childrens[j].naturalWidth;
                    this.allElements[i].childrens[k].originalHeight = this.allElements[i].childrens[k].element.style.height = childrens[j].naturalHeight;
                  }
                }
              }
              k++;
            }
          }
        }
        // calculate speed for elements.
        var speedDifference = this.allElements[i].maxspeed-this.allElements[i].minspeed;
        for(j=0; j<this.allElements[i].childrens.length; j++){
          var _el = this.allElements[i].childrens[j].element;
          if(_el.getAttribute('data-parallaxy-speed') === null){
            if(this.allElements[i].childrens.length === 1){
              this.allElements[i].childrens[j]['speed'] = (this.allElements[i].maxspeed + this.allElements[i].minspeed) / 2;
            } else {
              this.allElements[i].childrens[j]['speed'] = this.allElements[i].minspeed + (((1 / (this.allElements[i].childrens.length-1)) * j) * (speedDifference) );
            }
          } else {
            this.allElements[i].childrens[j]['speed'] = Math.min(1, Math.max(0, parseFloat(_el.getAttribute('data-parallaxy-speed'))));
          }
        }
      }

    }

    this.loadedImage = function(_array){
      _array.ready = true;
      if(_array.element.tagName === 'VIDEO'){
        _array.originalWidth = _array.element.videoWidth;
        _array.originalHeight = _array.element.videoHeight;
      } else {
        _array.originalHeight = _array.element.style.height = _array.element.style.naturalHeight; 
        _array.originalWidth = _array.element.style.width = _array.element.style.naturalWidth;
      }
      this.update();
    }

    this.update = function(){
      this.updateSize();
      this.updateScroll();
    }

    this.updateSize = function(){
      /* we use transform for scaling and positioning elements.... */

      var childrens,
          i,j,l,m,
          parentHeight,parentWidth;

      for(i=0, l=this.allElements.length; i<l; i++){

        childrens = this.allElements[i].childrens;
        // get heights and widths of container.
        parentHeight = this.allElements[i].container.offsetHeight;
        parentWidth = this.allElements[i].container.offsetWidth;

        for(j=0, m=childrens.length; j<m; j++){
          if(childrens[j].scalable && childrens[j].ready){

            var activeViewport = ( window.innerHeight + parentHeight ) * ( childrens[j].speed ); // correct if speed === 0.5 ??????

            var _minimumImageHeight = activeViewport + parentHeight - (parentHeight * 2 * childrens[j].speed);
            var _minimumImageWidth = parentWidth;

            // base scaling on width or height?
            var minimumScalingX = _minimumImageWidth / childrens[j].originalWidth;
            var minimumScalingY = _minimumImageHeight / childrens[j].originalHeight;

            childrens[j].adjustVerticalAlignToCenter = minimumScalingX < minimumScalingY ? 0 : (childrens[j].originalHeight * (minimumScalingX-minimumScalingY)) / 2;
            childrens[j].scale = Math.max(minimumScalingX, minimumScalingY);

          }
        }
      }
    }

    this.updateScroll = function(){

      var windowScrollPosition = (window.pageYOffset || document.documentElement.scrollTop) - (document.documentElement.clientTop || 0),
          childrens,
          _offsetInViewPort,
          i,j,l,m;

      for(i=0, l=this.allElements.length; i<l; i++){

        childrens = this.allElements[i].childrens;
        var _offsetInViewPort = this.allElements[i].container.offsetTop - windowScrollPosition;


          for(j=0, m=childrens.length; j<m; j++){
            if(childrens[j].ready){

              // based on offset we should be able to calculate Y position...

              var _translateY = -((childrens[j].speed) * _offsetInViewPort) - childrens[j].adjustVerticalAlignToCenter;
              var _translateX = -((childrens[j].originalWidth * childrens[j].scale) - this.allElements[i].container.offsetWidth) * 0.5;

              // translate the element
              childrens[j].element.style.webkitTransform =
              childrens[j].element.style.MozTransform =
              childrens[j].element.style.msTransform =
              childrens[j].element.style.transform =
                'translate(' + _translateX + 'px, ' + _translateY + 'px) scale('+childrens[j].scale+')';

            }
          }

      }
      
    }

    /**** Smooth scrollinging when using mousewheels ****/
    var smoothScrollWheelEvent = function(e) {
      this.scrollActions(document.body, -(e.wheelDeltaY*0.6) || 0);
      e.preventDefault();
    }

    this.scrollActions = function(e, _speed){
      
      this.smoothScrollFlippedDirections(_speed);

      this.smoothScrollStoredEvents.push({
          sp: _speed,
          ypos: _speed < 0 ? .999 : -.999,
          timed: new Date
      });

      if (this.smoothScrollActiveAnimation)
          return;

      var i = function () {

        var s = new Date;
        var u = 0;

        for (var a = 0; a < this.smoothScrollStoredEvents.length; a++) {

              var f = this.smoothScrollStoredEvents[a];
              var l = s - f.timed;
              var c = l >= this.smoothScrollAnimationTime;
              var h = this.smoothScrollBezier(c ? 1 : l / this.smoothScrollAnimationTime);
              var d = f.sp * h - f.ypos >> 0;

              u += d;
              f.ypos += d;
              if (c) {
                  this.smoothScrollStoredEvents.splice(a, 1);
                  a--
              }
          }
          e.scrollTop += u;

          if (this.smoothScrollStoredEvents.length)
              window.requestAnimationFrame(i.bind(this));
          else
              this.smoothScrollActiveAnimation = false;

        };

      window.requestAnimationFrame(i.bind(this));
      this.smoothScrollActiveAnimation = true;

    }

    this.smoothScrollFlippedDirections = function(t) {
        t = t > 0 ? 1 : -1;
        if (this.smoothScrollSpeed !== t) {
            this.smoothScrollSpeed = t;
            this.smoothScrollStoredEvents = [];
        }
    }

    this.smoothScrollBezier = function(e) {
        if (e >= 1) return 1;
        if (e <= 0) return 0;
        var n, r;
        e = e * 6.8;
        if (e < 1) {
            return e - (1 - Math.exp(-e));
        } else {
            n = Math.exp(-1);
            e -= 1;
            r = 1 - Math.exp(-e);
            return n + r * (1 - n);
        }
    }

    this.smoothScrollAnimationTime = 500; // length of animation
    this.smoothScrollSpeed = 0;
    this.smoothScrollStoredEvents = [];
    this.smoothScrollActiveAnimation = false;

    document.addEventListener("DOMContentLoaded", this.init.bind(this));
    window.addEventListener("resize", this.update.bind(this));
    window.addEventListener("scroll", this.updateScroll.bind(this));

    if(document.querySelectorAll('[data-parallaxy-ignoresmoothscroll]').length===0){
      window.addEventListener("mousewheel", smoothScrollWheelEvent.bind(this), false);
    }

    return this.prototype;

  }
  
  return new parallaxy();

}());


