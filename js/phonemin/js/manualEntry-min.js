/* © Clarify Cloud Limited 2013, 2014
All Rights Reserved
No part of this material or any of its contents may be reproduced, copied, modified or adapted, without prior written consent from Clarify Cloud Limited.
*/
(function(){function a(c,b){if(c<b){c=b}return c}$(document).ready(function(){var f=new Date();var b=f.getHours();var e=f.getMinutes();e<10?e="0"+e:e=e;b<10?b="0"+b:b=b;var c=b+":"+e;$("#manentrydate").datepicker();$("#manentrydate").datepicker("setDate","today");$("#manentertime").timepicker();$("#manentertime").timepicker({disableTouchKeyboard:"true"});$("#manentertime").timepicker("setTime",new Date())})})();