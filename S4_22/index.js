/* Amb aquestes dades ens dona resultat = 17 (nombre de dies
   que han passat entre 2021/01/01 i 2021/01/18. És un nombre
   enter, tal i com ha de ser.)

let start = new Date(2021, 00, 01);
let end = new Date(2021, 00, 18);
*/

/* Amb aquestes dades ens dona resultat = 30'9583333333333333 
   (nombre de dies que han passat entre 2021/02/01 i 2021/03/01. 
    NO és un nombre enter!. Això és degut a que és un any de 
    traspàs.)
*/

/* Problema amb dies amb decimals */
let start = new Date(2021, 02, 01);
let end = new Date(2021, 03, 01);

let miliSecondsDay = 24*60*60*1000;

let resultat = (end-start)/miliSecondsDay;

console.log('Dies transcorreguts (error): ' + resultat);


/* Problema resolt amb el modul d3-time */
const d3 = require('d3-time');

start = new Date(2021, 02, 01);
end = new Date(2021, 03, 01);

resultat = d3.timeDay.count(start, end);

console.log('Dies transcorreguts (correcte): ' + resultat);