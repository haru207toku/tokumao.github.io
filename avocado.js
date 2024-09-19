document.addEventListener('DOMContentLoaded', () => {
    const temperatureDisplay = document.getElementById('temperatureDisplay');

    // ページがロードされたときに直接天気情報を取得
    getWeather();

    async function getWeather() {
        const apiKey = '86808765a6e53f486acc76859059185d';
        const city = 'Tokyo';  // 必要に応じて都市名を変更してください
        const urlCurrent = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=ja`;
        const urlForecast = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric&lang=ja`;

        try {
            const [responseCurrent, responseForecast] = await Promise.all([
                fetch(urlCurrent),
                fetch(urlForecast)
            ]);
            const dataCurrent = await responseCurrent.json();
            const dataForecast = await responseForecast.json();

            if (dataCurrent.cod === 200 && dataForecast.cod === "200") {
                const currentTemp = dataCurrent.main.temp;
                const tempMin = dataForecast.list[0].main.temp_min;
                const tempMax = dataForecast.list[0].main.temp_max;
                const avgTemp = (tempMin + tempMax) / 2;
                const weather = dataCurrent.weather[0].description;
                const icon = dataCurrent.weather[0].icon;
                const precipitationProb = dataForecast.list[0].pop * 100;
                const windSpeed = dataCurrent.wind.speed;
                const uvIndex = dataCurrent.uvi; // UVインデックスが含まれている場合

              
                temperatureDisplay.innerHTML = `
                <img src="http://openweathermap.org/img/wn/${icon}.png" alt="天気アイコン" class="weather-icon">
                <p>現在の気温: <span class="number">${currentTemp}</span>°C</p>
                <p>平均気温: <span class="number">${avgTemp.toFixed(1)}</span>°C</p>
                <p>降水確率: <span class="number">${precipitationProb}</span>% </p> 
                <p>風速: <span class="number">${windSpeed}</span> m/s</p>
            `;
                temperatureDisplay.dataset.temp = avgTemp.toFixed(1); // 平均気温をデータ属性に保存

                // 日付から季節を判断
                const currentDate = new Date();
                const month = currentDate.getMonth() + 1;
                let season = '';

                if (month >= 3 && month <= 5) {
                    season = 'spring';
                } else if (month >= 6 && month <= 8) {
                    season = 'summer';
                } else if (month >= 9 && month <= 11) {
                    season = 'autumn';
                } else {
                    season = 'winter';
                }

                showCoordinate(season, parseFloat(avgTemp));
            } else {
                temperatureDisplay.innerHTML = `<p>天気情報を取得できませんでした: ${dataCurrent.message || dataForecast.message}</p>`;
            }
        } catch (error) {
            temperatureDisplay.innerHTML = `<p>天気情報の取得中にエラーが発生しました。</p>`;
            console.error('Error fetching weather data:', error);
        }
    }

    function showCoordinate(season, avgTemp) {
        const coordinateInfo = document.getElementById('coordinateInfo');
        const coordinateImage = document.getElementById('coordinateImage');
        let imgUrl = '';
        let coordinateText = '';

        // シーズンごとのコーディネート情報を表示
 if (season === 'spring') {
            if (avgTemp < 15) {
                imgUrl = 'images/ダウンベスト.png';
                coordinateText = '日中は過ごしやすいが、朝晩は冷え込むので軽めのアウターがあると◎<br> <a href="https://zozo.jp/search/?p_keyv=%83X%83E%83F%83b%83g%83p%81%5B%83J%81%5B" target="_blank">#パーカー</a>';
            } else if (avgTemp < 20) {
                imgUrl = 'images/デニムシャツ.png';
                coordinateText = '少しずつあったかくなってきたのでニットなら一枚で過ごせそう！<br> <a href="https://zozo.jp/category/tops/shirt-blouse/?p_gttagid=5493_21159&p_keyv=%83f%83j%83%80" target="_blank">#デニムシャツ</a> <a href="https://zozo.jp/category/tops/knit-sweater/?p_gttagid=5493_21159" target="_blank">#ニット</a>';
            } else {
                imgUrl = 'images/ピンクT.png';
                coordinateText = '薄手の長袖一枚か、半袖インナーにシャツ羽織がおすすめ！春っぽい色を取り入れよう！　<br> <a href="https://zozo.jp/category/tops/tshirt-cutsew/?p_gttagid=5493_21159" target="_blank">#長袖Ｔシャツ</a>';
            }
        } else if (season === 'summer') {
            if (avgTemp < 27) {
                imgUrl = 'images/シアー.png';
                coordinateText = 'サンダルデビュー！<br>蒸し暑いので、風通しの良い服を！<br> <a href="https://zozo.jp/search/?p_keyv=%83V%83A%81%5B%83V%83%83%83c+%92%B7%91%B3" target="_blank">#シアーシャツ</a>  <a href="https://zozo.jp/category/shoes/sandal/" target="_blank">#サンダル</a>';
            } else if (avgTemp < 30) {
                imgUrl = 'images/夏ワンピ.png';
                coordinateText = '冷房対策で羽織を持っておくと便利！<br> <a href="https://zozo.jp/category/onepiece/onepiece-dress/?p_gttagid=5493_21161-5493_21158" target="_blank">#ワンピース</a> <a href="https://zozo.jp/search/?p_keyv=%89H%90D%82%E8+%94%96%8E%E8+%89%C4+%92%B7%91%B3" target="_blank">#薄手の羽織り</a>';
            } else {
                imgUrl = 'images/ノースリ.png';
                coordinateText = 'とにかく涼しく!UV対策忘れずに! <br> <a href="https://zozo.jp/search/?p_keyv=%91%B3%82%C8%82%B5" target="_blank">#ノースリーブ</a>  <a href="https://www.amazon.co.jp/s?k=%E6%97%A5%E5%82%98" target="_blank">#日傘</a>';
            }
        } else if (season === 'autumn') {
            if (avgTemp < 15) {
                imgUrl = 'images/ニットカーデ.png';
                coordinateText = '季節の変わり目は油断禁物。温度調節できる格好がベスト！<br><a href="https://zozo.jp/category/tops/cardigan/?p_gttagid=5493_21159&p_keyv=%83j%83b%83g+%8C%FA%8E%E8" target="_blank">#ニット</a>';
            } else if (avgTemp < 18) {
                imgUrl = 'images/パーカ.png';
                coordinateText = 'ファッションの秋！色や素材で楽しもう❤ベロア素材がおすすめ！ <br> <a href="https://zozo.jp/category/tops/parka/?p_gttagid=8539_1100124-8539_1100125-5493_21159" target="_blank">#パーカー</a> <a href="https://zozo.jp/shop/bonjoursagan/goods-sale/78872229/?did=128786295" target="_blank">#ベロア</a>';
            } else if (avgTemp < 20) {
                imgUrl = 'images/白ワンピ.png';
                coordinateText = '一日を通して過ごしやすい気温！適度な肌みせで抜け感を！ブレスレットやネックレスを足しておしゃれしよう！　<br> <a href="https://zozo.jp/category/tops/shirt-blouse/?p_gttagid=5493_21160" target="_blank">#トップス</a> <a href="https://zozo.jp/category/tops/shirt-blouse/?p_gttagid=5493_21160" target="_blank">#アクセサリー</a>';
            } else {
                imgUrl = 'images/黒七分.png';
                coordinateText = 'ハーフスリーブでもハリのある素材で秋感を出すのがおすすめ<br> <a href="https://zozo.jp/search/?p_keyv=%83n%81%5B%83t%83X%83%8A%81%5B%83u" target="_blank">#ハーフスリーブ</a>';

            }
        } else if (season === 'winter') {
            if (avgTemp < 5) {
                imgUrl = 'images/チェックコート.png';
                coordinateText = '足元、首元は念入りに防寒対策を！手袋・帽子もあるとなお良し！ <br> <a href="https://zozo.jp/category/fashion-accessories/gloves/?p_keyv=%93%7E" target="_blank">#手袋</a> <a href="https://zozo.jp/category/hat/knit-cap-beanies/" target="_blank">#ニット帽</a>';
            } else {
                imgUrl = 'images/ボアフリース.png';
                coordinateText = 'さわやかなインナーで春を先取り！まだまだ寒いので厚手アウターとマフラー必須 <br> <a href="https://zozo.jp/category/fashion-accessories/muffler/" target="_blank">#マフラー</a> <a href="https://zozo.jp/category/jacket-outerwear/?p_keyv=%8C%FA%8E%E8" target="_blank">#厚手アウター</a>';
            }
        }

        coordinateInfo.innerHTML = coordinateText;
        coordinateImage.src = imgUrl;
        coordinateImage.alt = coordinateText;
    }
});
