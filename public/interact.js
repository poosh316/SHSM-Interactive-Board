const sample = document.getElementById("sample");
const redSlider = document.getElementById('red');
const greenSlider = document.getElementById('green');
const blueSlider = document.getElementById('blue');

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
        // console.log(res);
        // console.log(res[0].droneOn);
        if (res[0].droneOn == 1) {
            state = 1
            drone.src = "/images/droneOn.gif"
        }
    });
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
        });
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
    const setSample = async () => {
        sample.style.backgroundColor = `rgb(${redSlider.value}, ${greenSlider.value}, ${blueSlider.value})`;
    }
    
    fetch('/info/lights/*', {
        method: "GET"
    }).then(async response => {
        res = await response.json();
        console.log(res);
        redSlider.value = res[0].lightValue;
        greenSlider.value = res[1].lightValue;
        blueSlider.value = res[2].lightValue;
        setSample();
    });
    
    submitButton.addEventListener("click", () => {
        fetch("/info", {
            method: "POST",
            body: JSON.stringify({
                type: 'lights',
                red: redSlider.value,
                green: greenSlider.value,
                blue: blueSlider.value
            }),
            headers: { "Content-Type": "application/json" }
        });
    });

    redSlider.addEventListener("input", () => {
        setSample();
    });
    greenSlider.addEventListener("input", () => {
        setSample();
    });
    blueSlider.addEventListener("input", () => {
        setSample();
    });
}