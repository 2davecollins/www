/* © Clarify Cloud Limited 2013, 2014
All Rights Reserved
No part of this material or any of its contents may be reproduced, copied, modified or adapted, without prior written consent from Clarify Cloud Limited.
*/
(function(){function e(){document.addEventListener("deviceready",OnDeviceReady,false)}function f(){window.requestFileSystem(LocalFileSystem.PERSISTENT,0,h,c)}function h(i){i.root.getFile("readme.txt",null,g,c)}function g(i){i.file(b,c)}function b(i){d(i);a(i)}function d(j){var i=new FileReader();i.onloadend=function(k){};i.readAsDataURL(j)}function a(j){var i=new FileReader();i.onloadend=function(k){};i.readAsText(j)}function c(i){}})();