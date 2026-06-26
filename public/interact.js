const sample = document.getElementById("sample");
const redSlider = document.getElementById('red');
const greenSlider = document.getElementById('green');
const blueSlider = document.getElementById('blue');
//debug zero will send no console messages, debug 1 is recommended and will only send stuff if there is an error and debug 2 is to log most actions
const debug = 0;

if(debug >= 2){
console.log("starting script");
}
const submitButton = document.getElementById("submit")
const currentWindow = document.URL.split('/')[document.URL.split('/').length - 1];

if(debug >= 2){
    console.log(currentWindow);
}
const drone = document.getElementById('drone');
const droneBtn = document.getElementById('droneBtn');

//we want to use the same script for all interact pages so there is less imports so as to make sure there are no errors it will only run this when the page is one the drone page
if (currentWindow == "drone") {
    //state what the tab beleaves for the drone being on or off
    var state = 0;
    //updates state by getting the drone state from the server
    fetch('/info/drone/droneOn/1', {
        method: "GET"
    }).then(async response => {
        res = await response.json();
        if (res[0].droneOn == 1) {
            state = 1
            drone.src = "/images/droneOn.gif"
        }
    });
    //as we want the image to change whenever the drone is turned on, it checks the server every one second
    setInterval(async () => {
        fetch('/info/drone/droneOn/1', {
            method: "GET"
        }).then(async response => {
            res = await response.json();
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
    //sends a request to the server to change the drone state as long as the drone is not already on
    droneBtn.addEventListener("click", () => {
        if (state == 0) {
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

//if the user is on the lights page
if (currentWindow == "lights") {
    const setSample = async () => {
        sample.style.backgroundColor = `rgb(${redSlider.value}, ${greenSlider.value}, ${blueSlider.value})`;
    }
    //gets the initial positions of the lights
    fetch('/info/lights/*', {
        method: "GET"
    }).then(async response => {
        try {
            res = await response.json();
            if(debug >= 3){
                console.log(res);
            }
            redSlider.value = res[0].lightValue;
            greenSlider.value = res[1].lightValue;
            blueSlider.value = res[2].lightValue;
            setSample();
        } catch (err) {
            if(debug >= 1){
                console.log("database not avaliable");
            }
        }
    });
    //when the user presses the button it sends a request to the server to change the lights
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