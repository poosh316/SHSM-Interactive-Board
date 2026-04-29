
console.log("starting script");
submitButton = document.getElementById("on")
lightChoices = document.getElementById("lightChoices");
currentWindow = document.URL.split('/')[document.URL.split('/').length-1];
console.log(currentWindow);

submitButton.addEventListener("click", () => {
    console.log(lightChoices.children[0].children[1].value)
    fetch("/info", {
        method: "POST",
        body: JSON.stringify({
            type: 'lights',
            red: lightChoices.children[0].children[1].value,
            green: lightChoices.children[1].children[1].value,
            blue: lightChoices.children[2].children[1].value
        }),
        headers: {"Content-Type" : "application/json"}
    });
});