
function create() {
    const element = document.getElementById("control");
    const buttonUp = document.createElement("button");
    buttonUp.innerText = "^";
    const pox = window.innerHeight - 30;
    const posx = String(pox);
    posx.concat("px");
    buttonUp.style.top = posx;
    

    element.appendChild(buttonUp);
    
}
export { create };