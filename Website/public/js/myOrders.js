const reFormateDate = date => {
    date = date.toString();
    const ddmmyy = date.split(" - ")[0];
    const hhmmss = date.split(" - ")[1];

    const day = ddmmyy.split("/")[0]
    const month = ddmmyy.split("/")[1]
    const year = ddmmyy.split("/")[2]

    let hour = (hhmmss.split(":")[0].length == 1) ? '0' + hhmmss.split(":")[0] : hhmmss.split(":")[0]
    let minute = (hhmmss.split(":")[1].length == 1) ? '0' + hhmmss.split(":")[1] : hhmmss.split(":")[1]
    let second = (hhmmss.split(":")[2].length == 1) ? '0' + hhmmss.split(":")[2] : hhmmss.split(":")[2];

    return year + "-" + month + "-" + day + "T" + hour + ":" + minute + ":" + second;
}

document.getElementById("ordersSortBy").addEventListener("change", changeFunc)

function changeFunc() {
  let orderItems = $(".orderItem");
  if(this.value == "dateAscending"){
    orderItems.sort(function(a, b) { 
      return Date.parse(reFormateDate($(a).data("date")).trim()) - Date.parse(reFormateDate($(b).data("date")).trim())
    });
    $("#ordersContainer").append(orderItems);
  }
  
  else if(this.value == "dateDescending") {
    orderItems.sort(function(a, b) { 
        return Date.parse(reFormateDate($(b).data("date")).trim()) - Date.parse(reFormateDate($(a).data("date")).trim())
    });
    $("#ordersContainer").append(orderItems);
  }

  if(this.value == "priceLowToHigh") {
    orderItems.sort(function(a, b) { 
      return $(a).data("price") - $(b).data("price")
    });
    $("#ordersContainer").append(orderItems);
  }
  
  else if(this.value == "priceHighToLow") {
    orderItems.sort(function(a, b) { 
      return $(b).data("price") - $(a).data("price")
    });
    $("#ordersContainer").append(orderItems);
  }
  
}