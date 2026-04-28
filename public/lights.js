
const submitButton = document.getElementById("submit");
const sample = document.getElementById("sample");
const currentWindow = document.URL.split('/')[document.URL.split('/').length-1];
const redSlider = document.getElementById('red');
const greenSlider = document.getElementById('green');
const blueSlider = document.getElementById('blue');

redSlider.addEventListener("input", () => {
    sample.style.backgroundColor = `rgb(${redSlider.value}, ${greenSlider.value}, ${blueSlider.value})`;
});
greenSlider.addEventListener("input", () => {
    sample.style.backgroundColor = `rgb(${redSlider.value}, ${greenSlider.value}, ${blueSlider.value})`;
});
blueSlider.addEventListener("input", () => {
    sample.style.backgroundColor = `rgb(${redSlider.value}, ${greenSlider.value}, ${blueSlider.value})`;
});

submitButton.addEventListener("click", () => {
    fetch("/info", {
        method: "POST",
        body: JSON.stringify({
            red: redSlider.value,
            green: greenSlider.value,
            blue: blueSlider.value
        }),
        headers: {"Content-Type" : "application/json"}
    });
});