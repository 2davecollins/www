/* � Clarify Cloud Limited 2013, 2014
All Rights Reserved
No part of this material or any of its contents may be reproduced, copied, modified or adapted, without prior written consent from Clarify Cloud Limited.
*/
var accelWatchId=null;(function(){var e=null;var N;var v=null;var ai=50;var W=60;var R=10;var C=17;var au=50;var am=Math.round(60000/(ai*au));var P=Math.round(60000/(ai*C));var b=1.3;var af=40;var o=0.2;var r=0.5;var Y=0.3;var aq=0;$("#divSlider").change(function(){var az=$("#accelSetting1").slider().val();var ay=$.jStorage.get("setingKey");if(ay){if(ay.proportionOfIdealAcceptableAsFitness){ay.proportionOfIdealAcceptableAsFitness=az;$.jStorage.set("setingKey",ay);Y=ay.proportionOfIdealAcceptableAsFitness}else{Y=0.3;ay.proportionOfIdealAcceptableAsFitness=Y;$.jStorage.set("setingKey",ay)}}else{Y=0.3;var ay=[];ay.proportionOfIdealAcceptableAsFitness=Y;$.jStorage.set("setingKey",ay)}});var g=false;var y=(1000/ai);var ag=W/60;var al=R/60;var aj=Math.round(y/al);var an=Math.round(y/ag);var ab=aj*2;var ac={frequency:ai};var s=1;var ah=0;var u=10;var I=[ab];var D=new Array(u);var V=new Array(u);var L=0;var j=0;var S=0;var ar=0;var ak=0;var O=false;document.addEventListener("deviceready",ap,false);function Z(){for(i=0;i<u;i++){V[i]={};D[i]={};V[i].x=V[i].y=V[i].z=1;D[i].x=D[i].y=D[i].z=V[i].x;D[i].t=((new Date()).getTime())}}Z();function w(){y=1000/ai;ag=W/60;al=R/60;aj=Math.round(y/al);an=Math.round(y/ag);ab=aj*2;ac={frequency:ai};s=1;ah=0;u=10;I=[ab];D=new Array(u);V=new Array(u);L=0;j=0;S=0;ar=0;ak=0}function ap(){document.addEventListener("pause",x,false);document.addEventListener("resume",f,false)}$(document).delegate("#dashboard","pageshow",function(){O=true;k()});$(document).delegate("#dashboard","pagehide",function(){O=false;q()});function k(){if(!e){aw()}}function q(){if(e){navigator.accelerometer.clearWatch(e);e=null;clearInterval(N);N=null;clearTimeout(v);v=null;ak=0}}function aw(){if(navigator.accelerometer){e=navigator.accelerometer.watchAcceleration(n,F,ac);N=setInterval(p,(1000/s))}}function x(){if(e){q()}}function f(){if(!e){w();Z();aw()}}function d(){if(navigator.accelerometer){navigator.accelerometer.getCurrentAcceleration(n,F)}}function F(){if(D.length>aj){D.push(D[D.length-1]);D.shift()}}function n(az){var ay=new Object();ay.x=az.x;ay.y=az.y;ay.z=az.z;ay.t=((new Date()).getTime());D.push(ay);A()}function A(){while((D.length>2)&&(D[D.length-1].t-D[1].t)>ab*ai){D.shift()}}var ad;var B;var T;var a=[];var l;var X=0;var c;var h;var t;var M;var H;var Q;var U=false;var K=0;function p(){ae();h=rData.getStrokeRate();t=z();if(t>af){rData.setStrokeRate(-1);clearTimeout(v);v=null;ak=0}else{if(t<o){rData.setStrokeRate(-2);clearTimeout(v);v=null;ak=0}else{T=Math.max(t*Y,r);a=[];l=0;X=0;c=rData.getStrokeRate();if(c>0){X=Math.round(60000/(c*ai))}l=0;if((X>=am)&&(X<=P)){M=Math.min(X+5,aj);H=Math.max(X-5,an);l=ao(T,H,M,a)}if(l==0){l=ao(T,an,aj,a);var ay=J(l,an,aj,a);if((a[l]-a[ay])<0.2*a[l]){if((Math.abs(l-ay)>1.6*l)||(Math.abs(l-ay)>l/1.6)){if(Math.abs(l-X)>Math.abs(ay-X)){l=ay}}}}K=0;if(l==0){j=0;if(rData.getStrokeRate()>=0){clearTimeout(v);v=null}}else{ar=l*ai;K=60000/ar;if(v===null){G()}}rData.setStrokeRate(K)}}}function at(aB,az){if(az[aB]!==undefined){return az[aB]}else{var aA;var aC=0;var ay=new Object();ay.x=0;ay.y=0;ay.z=0;if(V.length>aB){aA=V.length-aB;while(aA<V.length){ay.x=ay.x+V[aA].x*V[aA-aB].x;ay.y=ay.y+V[aA].y*V[aA-aB].y;ay.z=ay.z+V[aA].z*V[aA-aB].z;aA++}ay.x=ay.x/aB;ay.y=ay.y/aB;ay.z=ay.z/aB;aC=ay.x+ay.y+ay.z;if((aB>am)&&(aB<P)){aC=aC*b}az[aB]=aC}return aC}}function ao(aF,aA,aG,ay){aF=Math.max(aF,at(aA,ay),at(aG,ay));var az=aF;var aC=false;var aE=aA;var aB=0;while(aE<=aG){var aD=at(aE,ay);if(aD<0){aE++}else{if(aD>az){az=aD;aB=aE;aC=true}else{if(aC==true&&(aE>=aB+4||aE==aG)){B=az;if((aE*2)<=aG){B=B+0.2*at(2*aB,ay)-0.2*at(Math.round(1.5*aB),ay);if((aE*3)<=aG){B=B+0.1*at(3*aB,ay)-0.1*at(Math.round(2.5*aB),ay)}B=B/aF}aC=false;if(B<0.9){az=aF;aB=0}}}}aE++}if(az!=aF){L=az}else{L=0}return aB}function J(aD,az,aG,ay){var aA=az;var aF=az;var aB=at(aD,ay);var aC=at(aA,ay);while((aA<=aG)&&(aA<aD-4)&&(aA>aD+4)){var aE=at(aA,ay);if((aE>aC)&&(aE<aB)){aC=aE;aF=aA;aA++}}return aF}function z(){var aA=new Object();aA.x=0;aA.y=0;aA.z=0;var ay;ay=0;if(V.length>0){while(ay<V.length&&ay<aj){if(V[ay]!==undefined){aA.x=aA.x+V[ay].x*V[ay].x}if(V[ay]!==undefined){aA.y=aA.y+V[ay].y*V[ay].y}if(V[ay]!==undefined){aA.z=aA.z+V[ay].z*V[ay].z}ay++}if(ay>0){aA.x=aA.x/ay;aA.y=aA.y/ay;aA.z=aA.z/ay}}var az=aA.x+aA.y+aA.z;return az}function G(){rData.setStrokeCount(rData.getStrokeCount()+1);if(ak===0){ak=new Date().getTime()+ar}else{ak+=ar}v=setTimeout(G,ak-new Date().getTime())}function aa(aA,ay){var az=new Object();az.x=aA.x/ay;az.y=aA.y/ay;az.z=aA.z/ay;return az}function m(aA,ay){var az=new Object();az.x=aA.x*ay;az.y=aA.y*ay;az.z=aA.z*ay;return az}function av(aA,ay){var az=new Object();az.x=aA.x*ay.x;az.y=aA.y*ay.y;az.z=aA.z*ay.z;return az}function ax(aA,ay){var az=new Object();az.x=aA.x+ay.x;az.y=aA.y+ay.y;az.z=aA.z+ay.z;return az}function E(aA,ay){var az=new Object();az.x=aA.x-ay.x;az.y=aA.y-ay.y;az.z=aA.z-ay.z;return az}function ae(){var aB=new Object();aB.x=0;aB.y=0;aB.z=0;if(D.length<=0){return}var aD=0;while(aD<D.length){aB.x+=D[aD].x;aB.y+=D[aD].y;aB.z+=D[aD].z;aD++}aB.x=aB.x/D.length;aB.y=aB.y/D.length;aB.z=aB.z/D.length;var aA=0;var az=D[D.length-1].t-D[0].t;var aF=ai*(D.length-1);var aE=aF/az;if(aE<1.01&&aE>0.99){while(aA<D.length){V[ab-1-aA]=E(D[D.length-1-aA],aB);aA++}}else{var ay=D.length-1;var aC=D[D.length-1].t;for(aA=0;aA<ab;aA++){while(aA*ai>aC-D[ay-1].t&&ay>1){ay--}if(ay>=0){kFactor=((aC-D[ay-1].t)-aA*ai)/(D[ay].t-D[ay-1].t);kMinus1Factor=(aA*ai-(aC-D[ay].t))/(D[ay].t-D[ay-1].t);I[ab-1-aA]=ax(m(D[ay],kFactor),m(D[ay-1],kMinus1Factor))}else{I[ab-1-aA]=D[0]}V[ab-1-aA]=E(I[ab-1-aA],aB)}}}})();