const disableButton = (buttonId, disableCondition) => {
    if(disableCondition)
        document.getElementById(buttonId).disabled = true;
}