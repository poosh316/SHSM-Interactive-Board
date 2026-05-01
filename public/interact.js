
console.log("starting script");
submitButton = document.getElementById("on")
lightChoices = document.getElementById("lightChoices");
currentWindow = document.URL.split('/')[document.URL.split('/').length - 1];

console.log(currentWindow);

const drone = document.getElementById('drone');
const droneBtn = document.getElementById('droneBtn');

if (currentWindow == "drone") {
    droneBtn.addEventListener("click", () => {
        drone.src = "../../images/droneOn.gif";
    });
}
if (currentWindow == "lights") {
    console.log("hi");
    console.log(lightChoices.children[1].value);
    submitButton.addEventListener("click", () => {
        console.log("banana");
        console.log(lightChoices.children[1].value)
        fetch("/info", {
            method: "POST",
            body: JSON.stringify({
                type: 'lights',
                red: lightChoices.children[1].value,
                green: lightChoices.children[3].value,
                blue: lightChoices.children[5].value
            }),
            headers: { "Content-Type": "application/json" }
        });
    });
}