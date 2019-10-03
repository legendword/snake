/*
    L  J  S
Author => Legendword
Version => beta
Copyright => 2014 - 2015 Legendword, All rights reserved
*/

window.ljs = {
  //version
  version: "beta",
  //main function ---- get DOM element(s)
  get: function(selector, method, num) {
      if (method==null) {
        method = 'id';
        }
      var methods = ['id','name','tag','class'];
      for (var i=0;i<methods.length;i++) {
        if (method==methods[i]) {
          var fullselect;
          switch(i) {
            case 0:
                 fullselect = document.getElementById(selector);
                 break;
            case 1:
                 if (num==null) {
                   fullselect = document.getElementsByName(selector);
                   }
                 else {
                   fullselect = document.getElementsByName(selector)[num];
                   }
                 break;
            case 2:
                 if (num==null) {
                   fullselect = document.getElementsByTagName(selector);
                   }
                 else {
                   fullselect = document.getElementsByTagName(selector)[num];
                   }
                 break;
            case 3:
                 if (num==null) {
                   fullselect = document.getElementsByClassName(selector);
                   }
                 else {
                   fullselect = document.getElementsByClassName(selector)[num];
                   }
                 break;
            }
          var success = true;
          break;
          }
        }
      if (success==null) {
        throw new ljs.error("Method name not defined");
        }
      else if (fullselect==undefined) {
        ljs.exception("Element(s) not found");
        }
      else {
        return fullselect;
        }
  },
  //LjsException (console.log w/ color) and LjsError (new Error())
  exception: function(message, ename) {
    if (ename==null) {
      ename = 'LjsException';
      }
    if (console.log) {
      console.log("%c "+ename+": "+message, "color:#FF8000;");
      }
  },
  error: function(message, ename, efile, eline) {
    if (ename==null) {
      ename = 'LjsError';
      }
    this.message = message;
    this.name = ename;
    if (efile!==null) {
      this.fileName = efile;
      }
    if (eline!==null) {
      this.lineNumber = eline;
      }
    this.prototype = new Error();
  }
};

//path query variable predefine
window._GET = [];
//path hash variable predefine
window._HASH = [];

//ljs error prototype = error
ljs.error.prototype = new Error();

//document.push, add html to body
window.HTMLDocument.prototype.push = function(pushCont) {
  document.body.innerHTML+=pushCont;
};
//element.push
window.HTMLElement.prototype.push = function(pushCont) {
  this.innerHTML+=pushCont;
};
//element remove
window.HTMLElement.prototype.remove = function() {
  this.parentNode.removeChild(this);
};
//find links and add tag / replace / remove / list 'em
window.String.prototype.parseLink = function(action, content) {
  //first find all links
  /* var urlreg = /(http|https|ftp|ftps)\:\/\/[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,3}(\/\S*)?/g; */ //old regex
  var urlreg = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
  var links = this.match(urlreg);
  var times = 0;
  var result = this;
  if (links==null) {return false;}
  for (var i=0; i<links.length; i++) {
    switch(action) {
      case "addTag":
      case "addtag":  //add <a>
        var toreplace = '<a href="' + links[i] + '">' + links[i] + '</a>';
        result = result.replace(links[i], toreplace);
        times = times + 1;
        break;
      case "replace":  //replace em w a custom val
        if (content==null&&i==0) {content = "";}
        result = result.replace(links[i], content);
        times = times + 1;
        break;
      case "remove":  //remove em all
        result = result.replace(links[i], "");
        times = times + 1;
        break;
      default:  //list em all
        if (i==0) {result = Array(links[i]);}
        else {result.push(links[i]);}
        times = times + 1;
        break;
      }
    }
  return result;
  //this = result;
};

//window.cookie
window.cookie = {
   get: function(cookiename) {
            var cname = "";
            var allcookies = new Array();
            allcookies = document.cookie.split('; ');
            for(var i = 0; i < allcookies.length; i++){
                var ccookie  = new Array();
		ccookie  = allcookies[i].split('=');
		if(ccookie[0] == cookiename){
			cname = unescape(ccookie[1]);
		}
            }
            return cname;
          },
   set: function(cname, cvalue, cexdays) {
            var cdate = new Date();
            cdate.setTime(cdate.getTime() + (cexdays*24*60*60*1000));
            var cexpires = "expires="+cdate.toUTCString();
            document.cookie = cname + "=" + cvalue + "; " + cexpires;
          },
   clear: function(cname) {
            //clear by set it to past
            document.cookie = cname + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
          }
};

//set color for a DOM element
//element can be the return value of lget function
function color(celement, colorcode, options) {
  if (options!==null) {
    switch(options) {
      case 'bg':
      case 'background':
        celement.style.backgroundColor = colorcode;
        break;
      default:
        celement.style.color = colorcode;
        break;
      }
    }
  else {
    celement.style.color = colorcode;
    }
}

//stylize: sets available screen width/height to all elements that have a class name of 'device-width'/'device-height' and more
function stylize() {
  var widthClassDetection = document.getElementsByClassName('device-width');
  if (widthClassDetection!==undefined) {
    var deviceWidth = screen.availWidth;
    for (var i=0;i<widthClassDetection.length;i++) {
      document.getElementsByClassName('device-width')[i].style.width = deviceWidth;
      }
    }
  //height not working...
  var heightClassDetection = document.getElementsByClassName('device-height');
  if (heightClassDetection!==undefined) {
    var deviceHeight = screen.availHeight;
    for (var i=0;i<heightClassDetection.length;i++) {
      document.getElementsByClassName('device-height')[i].style.height = deviceHeight;
      }
    }
}

//wait time is in millionsec
function redirect(chref, wait) {
  if (wait==null) {
     wait = 0;
     }
  if (isNaN(wait)==true) {
    ljs.exception("Wait time is not a valid number");
    return false;
    }
  if (wait==0) {
    window.location.href = chref;
    }
  else {
    setTimeout('window.location.href=chref;', wait);
    }
}

//functions occur at load
window.addEventListener("load", function() {
    //url query (?name=value)
    var search = location.search.substring(1);
    var ans = search.split("&");
    for (var i=0; i<ans.length; i++) {
        var answ = ans[i].split("=");
        var answ0 = answ[0];
        var answ1 = answ[1];
        if (answ1==null&&answ0!==null) {
          window._GET[answ0] = "";
          }
        else {
          window._GET[answ0] = answ1;
          }
       }
    //url hash (#name=value)
    var search = location.hash.substring(1);
    var ans = search.split("&");
    for (var i=0; i<ans.length; i++) {
        var answ = ans[i].split("=");
        var answ0 = answ[0];
        var answ1 = answ[1];
        if (answ1==null&&answ0!==null) {
          window._HASH[answ0] = "";
          }
        else {
          window._HASH[answ0] = answ1;
          }
       }
});

//set lget to window.something
window.lget = window.l = window.L = window.ljs.get;