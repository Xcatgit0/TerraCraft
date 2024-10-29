
function create() {
    const element = document.getElementById("control");
    const buttonUp = document.createElement("button");
    buttonUp.innerText = "^";
    
    //buttonUp.style.top = posx;
    

    element.appendChild(buttonUp);
    
}
export { create };