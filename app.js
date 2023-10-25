window.addEventListener('load', () => {
	let long;
	let lat;
	let temperatureDescription = document.querySelector('.temperature-description');
	let temperatureDegree = document.querySelector('.temperature-degree');
	let locationTimezon = document.querySelector('.location-timezone');
	let cityName = document.querySelector('.city-name');
	let temperatureSection = document.querySelector('.degree-section');
	let temperatureSpan = document.querySelector('.degree-section span');
	let windspeed = document.querySelector('.wind-speed');

	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(showPosition, showError);
		function showPosition(position) {
			long = position.coords.longitude;
			lat = position.coords.latitude;

			const proxy = 'https://cors-anywhere.herokuapp.com/';
			const api = `https://api.darksky.net/forecast/fd9d9c6418c23d94745b836767721ad1/${lat},${long}`;
			const apiT = `https://api.ipgeolocation.io/timezone?apiKey=5599e7b8e58f4fb49b12b4c173f6b9ee&lat=${lat}&${long}`;
			const apiT2 = `https://api.weatherbit.io/v2.0/current?&lat=${lat}&lon=${long}&key=7d7646024ffa49e3b5af69856c3476d3`;

			fetch(api)
				.then((response) => {
					return response.json();
				})
				.then((data) => {
					console.log(data);
					const { temperature, summary, icon, windSpeed } = data.currently;
					//Formula for Celsius
					let windSpeedKph = windSpeed * 1.609;
					let celsius = (temperature - 32) * (5 / 9);
					//set DOM elements from the API
					temperatureDegree.textContent = Math.floor(celsius) + '˚';
					temperatureDescription.textContent = summary;
					windspeed.textContent = 'Wind: ' + Math.floor(windSpeedKph) + ' kph';
					//set Icon
					setIcons(icon, document.querySelector('.icon'));

					//change F to C
					temperatureSection.addEventListener('click', () => {
						if (temperatureSpan.textContent === 'F') {
							temperatureSpan.textContent = 'C';
							temperatureDegree.textContent = Math.floor(celsius) + '˚';
							windspeed.textContent = 'Wind: ' + Math.floor(windSpeedKph) + ' kph';
						} else {
							temperatureSpan.textContent = 'F';
							temperatureDegree.textContent = Math.floor(temperature) + '˚';
							windspeed.textContent = 'Wind: ' + Math.floor(windSpeed) + ' mph';
						}
					});
				});

			fetch(apiT)
				.then((response) => {
					return response.json();
				})
				.then((dataT) => {
					console.log(dataT);
					locationTimezon.textContent = dataT.geo.country_name;
					/* cityName.textContent = dataT.geo.city; */
				});

			fetch(apiT2)
				.then((response) => {
					return response.json();
				})
				.then((dataT2) => {
					console.log(dataT2);
					/* locationTimezon.textContent = dataT2.data[0].timezone; */
					cityName.textContent = dataT2.data[0].city_name;
				});
		}
	} else {
		temperatureDescription.textContent = 'Geolocation is not supported by this browser.';
	}

	function showError(error) {
		switch (error.code) {
			case error.PERMISSION_DENIED:
				temperatureDescription.textContentL = 'User denied the request for Geolocation.';
				break;
			case error.POSITION_UNAVAILABLE:
				temperatureDescription.textContent = 'Location information is unavailable in your country.';
				break;
			case error.TIMEOUT:
				temperatureDescription.textContent = 'The request to get user location timed out.';
				break;
			case error.UNKNOWN_ERROR:
				temperatureDescription.textContent = 'An unknown error occurred.';
				break;
		}
	}

	function setIcons(icon, iconID) {
		const skycons = new Skycons({ color: 'white' });
		const currentIcon = icon.replace(/-/g, '_').toUpperCase();
		skycons.play();
		return skycons.set(iconID, Skycons[currentIcon]);
	}
});
