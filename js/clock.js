var myhour, myminute, mysecond;

function flipNumber(el, newnumber) {
  var thistop = el.find(".top").clone();
  var thisbottom = el.find(".bottom").clone();
  thistop.addClass("new");
  thisbottom.addClass("new");
  thisbottom.find(".text").text(newnumber);
  el.find(".top").after(thistop);
  el.find(".top.new").append(thisbottom);
  el.addClass("flipping");
  el.find(".top:not(.new)").find(".text").text(newnumber);
  setTimeout(function () {
    el.find(".bottom:not(.new)").find(".text").text(newnumber);
  }, 500);
}
const setTime = (minutes, seconds) => {
  jQuery(".flipper").removeClass("flipping");
  jQuery(".flipper .new").remove();    
  if (seconds.toString().length === 1) {
    seconds = "0" + seconds;
  }  
  if (minutes.toString().length == 1) {
    minutes = "0" + minutes;
  }
  if (parseInt(jQuery(myminute[0]).text()) !== minutes) {
    flipNumber(jQuery(myminute[0]).closest(".flipper"), minutes);
  }
  if (parseInt(jQuery(mysecond[0]).text()) !== seconds) {
    flipNumber(jQuery(mysecond[0]).closest(".flipper"), seconds);
  }
}

jQuery(function () {
  myminute = jQuery(".clock .flipper:nth-child(1) div:not(.new) .text");
  mysecond = jQuery(".clock .flipper:nth-child(2) div:not(.new) .text");  
});
