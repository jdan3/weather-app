const weatherApi = {
    key: "bab281d79e5f1e9755a68d754cc313e7",
    baseUrl: "https://api.openweathermap.org/data/2.5/weather",
};

const backgroundImages = {
    Clear: "url('images/vedro01.jpg')",
    Clouds: "url('images/oblaci03.jpg')",
    Haze: "url('images/magla01.jpg')",
    Rain: "url('images/kisa01.jpg')",
    Snow: "url('images/snijeg01.jpg')",
    Thunderstorm: "url('images/oluja01.jpg')",
};

const weatherTexts = {
    Clear: "Vedro je.",
    Clouds: "Oblačno je.",
    Haze: "Magla je.",
    Rain: "Kiša je.",
    Snow: "Snijeg je.",
    Thunderstorm: "Oluja je.",
};

const traziLokaciju = document.getElementById('input-box');

traziLokaciju.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        const city = traziLokaciju.value;
        getVrijeme(city);
        document.querySelector('.vrijeme-body').style.display = "block";
    }
});


function getVrijeme(city) {
    fetch(`${weatherApi.baseUrl}?q=${city}&appid=${weatherApi.key}&units=metric`)
        .then(weather => {
            return weather.json();
        }).then(data => {
            prikaziVrijeme(data);

            // Get UTC offset from the API 
            const utcOffsetInSeconds = data.timezone;
            const actualLocationTime = getActualLocationTime(utcOffsetInSeconds);

            // Update the datum element with the actual location time
            const datum = document.getElementById('datum');
            datum.innerText = dateManage(actualLocationTime);



        });
}
function getActualLocationTime(utcOffsetInSeconds) {
    // Convert UTC offset to milliseconds
    const utcOffsetInMilliseconds = utcOffsetInSeconds * 1000;
    // Get the current UTC time
    const currentTimeInUTC = new Date().getTime();
    // Calculate the actual location time by adding the UTC offset
    const actualLocationTimeInMilliseconds = currentTimeInUTC + utcOffsetInMilliseconds;


    const desiredTimeZoneOffsetInHours = 2;
    const desiredTimeZoneOffsetInSeconds = -desiredTimeZoneOffsetInHours * 3600;
    const actualLocationTimeInDesiredTimeZone = actualLocationTimeInMilliseconds + (desiredTimeZoneOffsetInSeconds * 1000);


    return new Date(actualLocationTimeInDesiredTimeZone);
}


function prikaziVrijeme(weather) {
    console.log(weather);

    let city = document.getElementById('city');
    city.innerText = `${weather.name}, ${weather.sys.country}`;

    let temperature = document.getElementById('temp');
    temperature.innerHTML = `${Math.round(weather.main.temp)}&deg;C`;

    let minMaxTemp = document.getElementById('min-max');
    minMaxTemp.innerHTML = `${Math.floor(weather.main.temp_min)}&deg;C (min)/ ${Math.ceil(
        weather.main.temp_max
    )}&deg;C (max) `;

    let weatherType = document.getElementById('weather');
    weatherType.innerText = `${weather.weather[0].main}`;

    let datum = document.getElementById('datum');
    let todayDate = new Date();
    datum.innerText = dateManage(todayDate);



    updateBackgroundImageAndText(weather.weather[0].main);
}


function dateManage(dateArg) {

    let dani = ["Nedelja", "Ponedeljak", "Utorak", "Srijeda", "Četvrtak", "Petak", "Subota"];

    let mjeseci = ["Januar", "Februar", "Mart", "April", "Maj", "Juni", "Juli", "August", "Septembar", "Oktobar", "Novembar", "Decembar"];

    let godina = dateArg.getFullYear();
    let mjesec = mjeseci[dateArg.getMonth()];
    let datum = dateArg.getDate();
    let dan = dani[dateArg.getDay()];


    // return `${datum}. ${mjesec} (${dan}), ${godina}`;
    let hr = dateArg.getHours();
    let min = dateArg.getMinutes();
    let sec = dateArg.getSeconds();
    return `${datum}. ${mjesec} (${dan}), ${godina} | ${hr}:${min}:${sec}`;


}



function updateBackgroundImageAndText(weatherType) {
    document.body.style.backgroundImage = backgroundImages[weatherType];
    document.getElementById("weather").innerHTML = weatherTexts[weatherType];
}
