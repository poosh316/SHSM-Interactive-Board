const drone = document.getElementById('drone');
const droneBtn = document.getElementById('droneBtn');


droneBtn.addEventListener("click", async () => {
    drone.src = "/images/droneOn.gif";

    setTimeout(async () => {
        drone.src = "/images/droneOff.png";
    }, 10000);
});