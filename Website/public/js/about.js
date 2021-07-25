const minMedia992 = window.matchMedia('(min-width: 992px)')
const maxMedia992 = window.matchMedia('(max-width: 992px)')
let sections = document.getElementsByClassName("infoSection");


if(minMedia992.matches) {
    for(let i=0; i<sections.length; i++) {
        if( (i+1)%2 == 0) {            
            sections[i].children[0].classList.add("floatRight");
            sections[i].children[1].classList.add("floatLeft");
        }
    }
}

if(maxMedia992.matches) {
    for(let i=0; i<sections.length; i++) {    
        sections[i].children[0].classList.add("center")
        sections[i].children[1].children[0].classList.add("fillWidth", "pushDown")
    }
    for(let header of document.getElementsByClassName("sectionHeader")) {
        header.classList.add('center');
    }
}

