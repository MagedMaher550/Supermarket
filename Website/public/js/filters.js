// // dd/mm/yyyy - hh:mm:ss

// const reFormateDate = date => {
//     date = date.toString();
//     const ddmmyy = date.split(" - ")[0];
//     const hhmmss = date.split(" - ")[1];

//     const day = ddmmyy.split("/")[0]
//     const month = ddmmyy.split("/")[1]
//     const year = ddmmyy.split("/")[2]

//     let hour = (hhmmss.split(":")[0].length == 1) ? '0' + hhmmss.split(":")[0] : hhmmss.split(":")[0]
//     let minute = (hhmmss.split(":")[1].length == 1) ? '0' + hhmmss.split(":")[1] : hhmmss.split(":")[1]
//     let second = (hhmmss.split(":")[2].length == 1) ? '0' + hhmmss.split(":")[2] : hhmmss.split(":")[2];

//     return year + "-" + month + "-" + day + "T" + hour + ":" + minute + ":" + second;
// }


// const compareDates = (date1, date2) => {
//     const date1Parsed = Date.parse(reFormateDate(date1.trim()));
//     const date2Parsed = Date.parse(reFormateDate(date2.trim()));
//     return date1Parsed > date2Parsed;
// }



// function sortTable(ascendingOrDescending, dateOrPrice) {
//     let table, rows, switching, i, x, y, shouldSwitch;
//     table = document.getElementById("table_id");
//     switching = true;
//     /*Make a loop that will continue until
//     no switching has been done:*/
//     while (switching) {
//       //start by saying: no switching is done:
//       switching = false;
//       rows = table.rows;
//       /*Loop through all table rows (except the
//       first, which contains table headers):*/
//       for (i = 1; i < (rows.length - 1); i++) {
//         //start by saying there should be no switching:
//         shouldSwitch = false;
//         /*Get the two elements you want to compare,
//         one from current row and one from the next:*/
//         if(dateOrPrice == "price") {
//           x = rows[i].getElementsByTagName("TD")[4].innerHTML;
//           y = rows[i + 1].getElementsByTagName("TD")[4].innerHTML;
//           //check if the two rows should switch place:
//           if (ascendingOrDescending == "ascending") {
//             //if so, mark as a switch and break the loop:
//             if(parseFloat(x) > parseFloat(y)) {
//                 shouldSwitch = true;
//                 break;
//             }
//           } else {
//               if(parseFloat(x) < parseFloat(y)) {
//                   shouldSwitch = true;
//                   break;
//               }
//           }
//         } else {
//           x = rows[i].getElementsByTagName("TD")[1].innerHTML;
//           y = rows[i + 1].getElementsByTagName("TD")[1].innerHTML;
//           //check if the two rows should switch place:
//           if (ascendingOrDescending == "ascending") {
//             //if so, mark as a switch and break the loop:
//             if(compareDates(x,y)) {
//                 shouldSwitch = true;
//                 break;
//             }
//           } else {
//               if(compareDates(y,x)) {
//                   shouldSwitch = true;
//                   break;
//               }
//           }
//         }
//       }
//       if (shouldSwitch) {
//         /*If a switch has been marked, make the switch
//         and mark that a switch has been done:*/
//         rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
//         switching = true;
//       }
//     }
//   }

//   document.getElementById("sortByDate").addEventListener("change", changeFunc)

//   function changeFunc() {
//     if(this.value == "DateAscending")
//       sortTable("ascending", "date");

//     else if(this.value == "DateDescending") 
//       sortTable("descending", "date");

//     else if(this.value == "priceLowToHigh")
//       sortTable("ascending", "price");

//     else if(this.value == "priceHighToLow") 
//         sortTable("descending", "price");

//   }

$(document).ready( function () {
    $('#table_id').DataTable();
});


