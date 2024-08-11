document.addEventListener('DOMContentLoaded', () => {
    const temperatureDisplay = document.getElementById('temperatureDisplay');

    // ページがロードされたときに直接天気情報を取得
    getLocation();

    function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(getWeather, showError);
        } else {
            temperatureDisplay.innerHTML = `<p>このブラウザは位置情報取得をサポートしていません。</p>`;
        }
    }

    async function getWeather(position) {
        const apiKey = '86808765a6e53f486acc76859059185d';
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        const urlCurrent = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=ja`;
        const urlForecast = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=ja`;

        try {
            const [responseCurrent, responseForecast] = await Promise.all([
                fetch(urlCurrent),
                fetch(urlForecast)
            ]);
            const dataCurrent = await responseCurrent.json();
            const dataForecast = await responseForecast.json();

            if (dataCurrent.cod === 200 && dataForecast.cod === "200") {
                // ここに表示処理
            } else {
                temperatureDisplay.innerHTML = `<p>天気情報を取得できませんでした: ${dataCurrent.message || dataForecast.message}</p>`;
            }
        } catch (error) {
            temperatureDisplay.innerHTML = `<p>天気情報の取得中にエラーが発生しました。</p>`;
            console.error('Error fetching weather data:', error);
        }
    }

    function showError(error) {
        switch (error.code) {
            case error.PERMISSION_DENIED:
                temperatureDisplay.innerHTML = "<p>ユーザーが位置情報の取得を拒否しました。</p>";
                break;
            case error.POSITION_UNAVAILABLE:
                temperatureDisplay.innerHTML = "<p>位置情報が利用できません。</p>";
                break;
            case error.TIMEOUT:
                temperatureDisplay.innerHTML = "<p>位置情報の取得がタイムアウトしました。</p>";
                break;
            case error.UNKNOWN_ERROR:
                temperatureDisplay.innerHTML = "<p>不明なエラーが発生しました。</p>";
                break;
        }
    }
});
