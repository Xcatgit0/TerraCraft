
function create() {
    const element = document.getElementById("control");
    const buttonUp = document.createElement("button");
    buttonUp.innerText = "^";
    buttonUp.id = "moveUp";
    //buttonUp.style.top = posx;
    

    element.appendChild(buttonUp);
    
}
export { create };