
console.log("starting script");
const submitButton = document.getElementById("submit")
const lightChoices = document.getElementById("lightChoices");
const currentWindow = document.URL.split('/')[document.URL.split('/').length - 1];

console.log(currentWindow);
const drone = document.getElementById('drone');
const droneBtn = document.getElementById('droneBtn');

console.log(currentWindow);

if (currentWindow == "drone") {
    var state = 0;
    fetch('/info/drone/droneOn/1', {
        method: "GET"
    }).then(async response => {
        res = await response.json();
        console.log(res);
        console.log(res[0].droneOn);
        if (res[0].droneOn == 1) {
            state = 1
            drone.src = "/images/droneOn.gif"
        }
    })
    setInterval(async () => {
        fetch('/info/drone/droneOn/1', {
            method: "GET"
        }).then(async response => {
            res = await response.json();
            // console.log(res);
            // console.log(res[0].droneOn);
            if (res[0].droneOn == 1) {
                if (state == 0) {
                    drone.src = "/images/droneOn.gif";
                }
                state = 1
            } else {
                if (state == 1) {
                    drone.src = "/images/droneOff.png";
                }
                state = 0
            }
        })
    }, 1000);
    droneBtn.addEventListener("click", () => {
        if (state == 0) {
            drone.src = "/images/droneOn.gif";
            state = 1
            fetch("/info", {
                method: "POST",
                body: JSON.stringify({
                    type: 'drone',
                    droneOn: 1
                }),
                headers: { "Content-Type": "application/json" }
            })
        }
    });
}
if (currentWindow == "lights") {
    submitButton.addEventListener("click", () => {
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