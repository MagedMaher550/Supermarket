// get the container of all products
const productsContainer = document.getElementById("productsBlock");

// add an event listener to the grid icon
document.getElementById("toGrid").addEventListener("click", () => {
    // iterate over all the products
    for(let product of productsContainer.children) {
        //restore the grid system of the product
        product.className = "col-xs-12 col-sm-6 col-md-4 col-lg-3 whiteBlock productDiv";

        //restore the style classes of the products
        product.children[0].className = "row center"; // to center the info beneath the image

        product.children[0].classList.add("productImageContainer");
        product.children[0].children[0].children[0].classList.remove("fullWidth");

        product.children[1].children[0].className = "row center";
        product.children[1].children[1].className = "row center";
        product.children[1].children[2].className = "row center";

        //hide the row of icon buttons
        product.children[1].children[3].style.visibility = "hidden";
    }
})

document.getElementById("toList").addEventListener("click", () => {
    for(let product of productsContainer.children) {
        //show the row of icon buttons
        product.children[1].children[3].style.visibility = "visible";

        product.children[1].children[1].classList.add("customImage");

        product.children[0].children[0].children[0].classList.add("fullWidth");
        product.children[1].children[3].children[0].classList.add("addBorderToIcons");
        product.children[1].children[3].children[1].classList.add("addBorderToIcons");


        //let each product be in a single row
        product.className = "col-xs-12 whiteBlock productDiv";

        //remove the 'row center' class from each grandchild of the products 
        for(let element of product.children[1].children) {
            element.className = "";
        }

        //handle the product information styling in each row
        product.children[0].className = "col-xs-5 col-sm-3"
        product.children[1].className = "col-xs-7 col-sm-9 pushUp Info"

    }
})


document.getElementById("specialsSortBy").addEventListener("change", changeFunc)


function changeFunc() {
  let products = $(".productDiv");
  
  if(this.value == "nameAToZ"){
    products.sort(function(a, b) { 
      return $(a).data("name")[0].toLowerCase().charCodeAt(0) - $(b).data("name")[0].toLowerCase().charCodeAt(0);
    });
    $("#productsBlock").append(products);
  }
  
  else if(this.value == "nameZToA") {
    products.sort(function(a, b) { 
      return $(b).data("name")[0].toLowerCase().charCodeAt(0) - $(a).data("name")[0].toLowerCase().charCodeAt(0);
    });
    $("#productsBlock").append(products);
  }

  if(this.value == "priceLowToHigh") {
    products.sort(function(a, b) { 
      return $(a).data("price") - $(b).data("price")
    });
    $("#productsBlock").append(products);
  }
  
  else if(this.value == "priceHighToLow") {
    products.sort(function(a, b) { 
      return $(b).data("price") - $(a).data("price")
    });
    $("#productsBlock").append(products);
  }
  
}