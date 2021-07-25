document.getElementById("cancelCheckBtn").addEventListener("click", () => {
    const checkRows = document.getElementsByClassName("brandCheckRow");
    for(let i=0; i<checkRows.length; i++)  {
        checkRows[i].children[0].checked = false;
    }
    let productsContainer = document.getElementById("productsSearchResult");

    for(let product of productsContainer.children) {
        product.style.display = "inline-block";
    }
})


document.getElementById("filterBtn").addEventListener("click", () => {
    let checkMarks = document.getElementsByClassName("checkmark");
    let brandsChecked = [];
    let productsContainer = document.getElementById("productsSearchResult");

    for(let product of productsContainer.children) {
        product.style.display = "inline-block";
    }

    for(let checkMark of checkMarks) {
        if(checkMark.checked) {
            brandsChecked.push(checkMark.name.trim());
        }
    }

    for(let product of productsContainer.children) {
        if( !brandsChecked.includes(product.getAttribute("data-brand").trim()) && brandsChecked.length != 0 ) {
            product.style.display = "none";
        }
    }
})
