/* ========================================================================
 * [githublink here] [docs are here too!]
 * ========================================================================
 * Copyright 2013 Ivar Borthen.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * Only supported by browsers that support CSS3 offset position ( elaborate )
 * ======================================================================== */




+function ($) { "use strict";

  // Utility
  if ( typeof Object.create !== 'function' ) {
    Object.create = function( obj ) {
      function F() {}
      F.prototype = obj;
      return new F();
    };
  }

  // init GLOBAL nailPluginCollection, used across all .nail plugins.
  if (typeof window.nailPluginCollection !== 'object' && window.ignoreParallaxy !== true){
  window.nailPluginCollection = Object.create({
    'update' : function(){},
    'resize' : function(){}
  });
  window.nailPluginCollectionResize = function(){
    window.nailPluginCollection.resize();
  }
  $(window).on('resize', window.nailPluginCollectionResize);
  }

  // PARALLAXY CLASS DEFINITION
  // ====================

  var Parallaxy = function (element, ignoreupdate) {

    this.element = $(element);
    this.image = $(element).find('.parallaxy-image').find('img');

    // Autospeed set or disabled?
    if(this.element.data('parallaxy-speed')==undefined){
      this.fixedSpeed=0.5; // 0 == fastest, 1 == standstill
    } else {
      this.fixedSpeed=this.element.data('parallaxy-speed');
    }

    this.resized();
    this.scrolled($.fn.parallaxy.Viewport.windowPostionY, $.fn.parallaxy.Viewport.windowHeight);

  }

  Parallaxy.prototype.resized = function() {

    this.elementHeight = this.element.outerHeight();
    this.elementWidth = this.element.outerWidth();

    this.imageHeight = (this.elementHeight)+(($.fn.parallaxy.Viewport.windowHeight-this.elementHeight)*this.fixedSpeed);
    this.image.height(this.imageHeight)
              .width('auto');

    if(this.elementWidth/this.image.width() > 1){
        this.image.width(this.elementWidth)
                  .height('auto');
        this.imageHeight = this.image.outerHeight();
    }

    this.translateX = -(this.image.outerWidth()-this.element.outerWidth())/2;
    this.elementY = this.element.offset().top;

  }

  Parallaxy.prototype.scrolled = function (windowPostionY, windowHeight) {

    // only bother continue if view of parallax in within the viewport of the browser
    if(this.elementY+this.elementHeight>windowPostionY && this.elementY<windowHeight+windowPostionY){
      // calculate scroll value
      var _scroll = -((this.elementY)-windowPostionY)*this.fixedSpeed;
      this.image.css('transform', 'translate('+this.translateX+'px,'+_scroll+'px)');
    }

  }


  // PARALLAXY PLUGIN DEFINITION
  // =====================

  $.fn.parallaxy = function () {
    $(this).data('parallaxy', 'enabled');
    return $.fn.parallaxy.Elements.push(new Parallaxy(this));
  }

  $.fn.parallaxy.update = function( ){
    // Add new parallaxy elements ( i.e. new content added via ajax )
    $.fn.parallaxy.Elements = [];
    if(window.ignoreParallaxy === true){
      return false;
    }
    $('[data-parallaxy]').each(function() {
      $(this).parallaxy();
    });

  }

  $.fn.parallaxy.Constructor = Parallaxy

  $.fn.parallaxy.Viewport = {
    'windowPostionY' : $(window).scrollTop(),
    'windowHeight' :  (typeof window.innerHeight != 'undefined') ? window.innerHeight : document.documentElement.clientHeight
  };

  // PARALLAXY DATA-API
  // ============
  $.fn.parallaxy.update();

  // EVENT LISTENERS
  // ============

  $.fn.parallaxy.resize = function(){
    // update viewport, fallback on
    if (typeof window.innerHeight != 'undefined') {
      $.fn.parallaxy.Viewport.windowHeight = window.innerHeight;
    } else {
      $.fn.parallaxy.Viewport.windowHeight = document.documentElement.clientHeight;
    }

    // update all parallxy heights data
    for(var i=0; i<$.fn.parallaxy.Elements.length; i++){
      $.fn.parallaxy.Elements[i].resized();
      $.fn.parallaxy.Elements[i].scrolled($.fn.parallaxy.Viewport.windowPostionY, $.fn.parallaxy.Viewport.windowHeight);
    }

  }

  if(window.ignoreParallaxy !== true){
    $(window).on('scroll', function(){
      // update scroll position
      $.fn.parallaxy.Viewport.windowPostionY = $(window).scrollTop();
      // update all parallxy heights data
      for(var i=0; i<$.fn.parallaxy.Elements.length; i++){
        $.fn.parallaxy.Elements[i].scrolled($.fn.parallaxy.Viewport.windowPostionY, $.fn.parallaxy.Viewport.windowHeight);
      }
    });
  }

  // bind events and trigger first time.
  $(document).on('parallaxy', $.fn.parallaxy.update()).trigger('parallaxy');

  // extend nailPluginCollection object with functions from zoombie
  window.nailPluginCollection.resize = (function(_super) {
    // return event
    return function() {
      _super.apply(this, arguments);
      $.fn.parallaxy.resize();
      return this;
    };
    // Pass control back to the original window.nailPluginCollection.resize
    // by using .apply on `_super`
  })(window.nailPluginCollection.resize);

}(jQuery);
