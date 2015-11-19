/* ========================================================================
 * github.com/wearecolours/parallaxy
 * ========================================================================
 * Copyright 2015 Ivar Borthen.
 * No dependencies needed.
 * ======================================================================== */

/* Usage

--container--
data-parallaxy=true : inits parallaxy. (Autostarts)
data-parallaxy-maxspeed : maxspeed for parallaxy elements ( childrens data-parallaxy-speed will overwrite this)
data-parallaxy-minspeed : minspeed for parallaxy elements ( childrens data-parallaxy-speed will overwrite this)

--first-childs--
data-parallaxy-ignore=true : ignore this element in parallaxy
data-parallaxy-speed=XXX : makes element scroll according to this speed. overwrites autocalculated speeds.
data-parallaxy-dontresize=true : ignore resizing.

Update it:
Parallaxy.update();

Note to self:
Should autocalculated speeds substract values when another element has its "own" speed manually set?

*/

var Parallaxy = (function () {

  console.log('runds..');

  function parallaxy() {

    this.allElements = [];

    this.init = function(){
      this.getElements();
      this.update();
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
              isImage = (childrens[j].tagName === 'IMG');
              this.allElements[i].childrens[k] = {
                'element' : childrens[j],
                'scalable' : (childrens[j].getAttribute('data-parallaxy-dontresize') === null ? isImage : false),
                'ready' : true,
                'scale' : 1
              };
              if(isImage){
                if(childrens[j].naturalWidth === 0){
                  // image not loaded yet... add a loader event for image.
                  this.allElements[i].childrens[k].ready = false;
                  this.allElements[i].childrens[k].element.addEventListener('load', this.loadedImage.bind(this, this.allElements[i].childrens[k]));
                } else {
                  this.allElements[i].childrens[k].element.style.height = this.allElements[i].childrens[k].element.style.naturalHeight; 
                  this.allElements[i].childrens[k].element.style.width = this.allElements[i].childrens[k].element.style.naturalWidth;
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
            this.allElements[i].childrens[j]['speed'] = parseFloat(_el.getAttribute('data-parallaxy-speed'));
          }
        }
      }

    }

    this.loadedImage = function(_array){
      _array.ready = true;
      _array.element.style.height = _array.element.style.naturalHeight; 
      _array.element.style.width = _array.element.style.naturalWidth; 
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

            var _minimumImageHeight = ( ( window.innerHeight + (parentHeight) ) * ( 1-childrens[j].speed ) ) + parentHeight;
            var _minimumImageWidth = parentWidth;

            // base scaling on width or height?
            var minimumScalingX = _minimumImageWidth / childrens[j].element.naturalWidth;
            var minimumScalingY = _minimumImageHeight / childrens[j].element.naturalHeight;

            console.log('minimumScalingX', minimumScalingX);
            childrens[j].scale = Math.max(minimumScalingX, minimumScalingY);

          }
        }
      }
    }

    this.updateScroll = function(){

      console.log('updateScroll');
      var windowScrollPosition = (window.pageYOffset || document.documentElement.scrollTop) - (document.documentElement.clientTop || 0),
          childrens,
          offsetY,
          i,j,l,m;

      for(i=0, l=this.allElements.length; i<l; i++){

        childrens = this.allElements[i].childrens;
        offsetY = ((this.allElements[i].container.offsetTop - windowScrollPosition) + this.allElements[i].container.offsetHeight) / (window.innerHeight+(this.allElements[i].container.offsetHeight)); // returns value 0-1 (%) from min to max parallaxy scroll.

        if(offsetY>0 && offsetY<1){
          for(j=0, m=childrens.length; j<m; j++){
            if(childrens[j].ready){

              // based on offset we should be able to calculate Y position...
              var _translateY = -((childrens[j].element.naturalHeight * childrens[j].scale) - this.allElements[i].container.offsetHeight) * offsetY;
              var _translateX = -((childrens[j].element.naturalWidth * childrens[j].scale) - this.allElements[i].container.offsetWidth) * 0.5;
              console.log(_translateX);
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
      
    }

    document.addEventListener("DOMContentLoaded", this.init.bind(this));
    window.addEventListener("resize", this.update.bind(this));
    window.addEventListener("scroll", this.updateScroll.bind(this));

    return this.prototype;

  }
  
  return new parallaxy();

}());

console.log(Parallaxy);