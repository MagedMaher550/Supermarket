// function magnify(imgID, zoom) {
//   var img, glass, w, h, bw;
//   img = document.getElementById(imgID);
//   /*create magnifier glass:*/
//   glass = document.createElement("DIV");
//   glass.setAttribute("class", "img-magnifier-glass");
//   /*insert magnifier glass:*/
//   img.parentElement.insertBefore(glass, img);
//   /*set background properties for the magnifier glass:*/
//   glass.style.backgroundImage = "url('" + img.src + "')";
//   glass.style.backgroundRepeat = "no-repeat";
//   glass.style.backgroundSize = (img.width * zoom) + "px " + (img.height * zoom) + "px";
//   bw = 3;
//   w = glass.offsetWidth / 2;
//   h = glass.offsetHeight / 2;
//   /*execute a function when someone moves the magnifier glass over the image:*/
//   glass.addEventListener("mousemove", moveMagnifier);
//   img.addEventListener("mousemove", moveMagnifier);
//   /*and also for touch screens:*/
//   glass.addEventListener("touchmove", moveMagnifier);
//   img.addEventListener("touchmove", moveMagnifier);
//   function moveMagnifier(e) {
//     var pos, x, y;
//     /*prevent any other actions that may occur when moving over the image*/
//     e.preventDefault();
//     /*get the cursor's x and y positions:*/
//     pos = getCursorPos(e);
//     x = pos.x;
//     y = pos.y;
//     /*prevent the magnifier glass from being positioned outside the image:*/
//     if (x > img.width - (w / zoom)) {x = img.width - (w / zoom);}
//     if (x < w / zoom) {x = w / zoom;}
//     if (y > img.height - (h / zoom)) {y = img.height - (h / zoom);}
//     if (y < h / zoom) {y = h / zoom;}
//     /*set the position of the magnifier glass:*/
//     glass.style.left = (x - w) + "px";
//     glass.style.top = (y - h) + "px";
//     /*display what the magnifier glass "sees":*/
//     glass.style.backgroundPosition = "-" + ((x * zoom) - w + bw) + "px -" + ((y * zoom) - h + bw) + "px";
//   }
//   function getCursorPos(e) {
//     var a, x = 0, y = 0;
//     e = e || window.event;
//     /*get the x and y positions of the image:*/
//     a = img.getBoundingClientRect();
//     /*calculate the cursor's x and y coordinates, relative to the image:*/
//     x = e.pageX - a.left;
//     y = e.pageY - a.top;
//     /*consider any page scrolling:*/
//     x = x - window.pageXOffset;
//     y = y - window.pageYOffset;
//     return {x : x, y : y};
//   }
// }



/**
 * blowup.js
 * Paul Krishnamurthy 2016
 *
 * https://paulkr.com
 * paul@paulkr.com
 */

 $(function ($) {
  $.fn.blowup = function (attributes) {

    var $element = this;

    // If the target element is not an image
    if (!$element.is("img")) {
      console.log("%c Blowup.js Error: " + "%cTarget element is not an image.", 
        "background: #FCEBB6; color: #F07818; font-size: 17px; font-weight: bold;",
        "background: #FCEBB6; color: #F07818; font-size: 17px;");
      return;
    }

    // Constants
    var $IMAGE_URL    = $element.attr("src");
    var NATIVE_IMG    = new Image();
    NATIVE_IMG.src    = $element.attr("src");

    // Default attributes
    var defaults = {
      round         : true,
      width         : 200,
      height        : 200,
      background    : "#FFF",
      shadow        : "0 8px 17px 0 rgba(0, 0, 0, 0.2)",
      border        : "6px solid #FFF",
      cursor        : true,
      zIndex        : 999999,
      scale         : 1,
      customClasses : ""
    }

    // Update defaults with custom attributes
    var $options = $.extend(defaults, attributes);

    // Modify target image
    $element.on('dragstart', function (e) { e.preventDefault(); });
    $element.css("cursor", $options.cursor ? "crosshair" : "none");

    // Create magnification lens element
    var lens = document.createElement("div");
    lens.id = "BlowupLens";

    // Attack the element to the body
    $("body").append(lens);

    // Updates styles
    $blowupLens = $("#BlowupLens");

    $blowupLens.css({
      "position"          : "absolute",
      "display"           : "none",
      "pointer-events"    : "none",
      "zIndex"            : $options.zIndex,
      "width"             : $options.width,
      "height"            : $options.height,
      "border"            : $options.border,
      "background"        : $options.background,
      "border-radius"     : $options.round ? "50%" : "none",
      "box-shadow"        : $options.shadow,
      "background-repeat" : "no-repeat",
    });

    // Add custom CSS classes
    $blowupLens.addClass($options.customClasses);

    // Show magnification lens
    $element.mouseenter(function () {
      $blowupLens.css("display", "block");
    })

    // Mouse motion on image
    $element.mousemove(function (e) {

      // Lens position coordinates
      var lensX = e.pageX - $options.width / 2;
      var lensY = e.pageY - $options.height / 2;

      // Relative coordinates of image
      var relX = e.pageX - $(this).offset().left;
      var relY = e.pageY - $(this).offset().top;
     
      // Zoomed image coordinates 
      var zoomX = -Math.floor(relX / $element.width() * (NATIVE_IMG.width * $options.scale) - $options.width / 2);
      var zoomY = -Math.floor(relY / $element.height() * (NATIVE_IMG.height * $options.scale) - $options.height / 2);

      var backPos = zoomX + "px " + zoomY + "px";
      var backgroundSize = NATIVE_IMG.width * $options.scale + "px " + NATIVE_IMG.height * $options.scale + "px";

      // Apply styles to lens
      $blowupLens.css({
        left                  : lensX,
        top                   : lensY,
        "background-image"    : "url(" + encodeURI($IMAGE_URL) + ")",
        "background-size"     : backgroundSize,
        "background-position" : backPos
      });
    })

    // Hide magnification lens
    $element.mouseleave(function () {
      $blowupLens.css("display", "none");
    });
  }
})