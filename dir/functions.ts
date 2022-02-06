import getConfig from 'next/config';
import { hourly, daily } from './types';

const { serverRuntimeConfig } = getConfig();
const fetchData = async (city: string, unit: string) => {
    try {
        const response = await fetch(`https://community-open-weather-map.p.rapidapi.com/forecast?q=${city}&units=metric&cnt=40`, {
            "method": "GET",
            "headers": {
                "x-rapidapi-host": serverRuntimeConfig.api_host,
                "x-rapidapi-key": serverRuntimeConfig.api_key
            },
        })
        if (!response) return {
            props: {
                success: false,
                error: {
                    message: 'API not responding',
                    cod: 0
                },
                context: { city, unit }
            }
        }
        const result = await response.json()
        if (result.cod !== '200') return {
            props: {
                success: false,
                error: {
                    cod: result.cod,
                    message: result.message
                },
                context: { city, unit }
            }
        }
        return {
            props: {
                success: true,
                data: {
                    name: result.city.name,
                    country: result.city.country,
                    list: result.list.map((item: hourly) => ({
                        clouds: item.clouds,
                        dt: item.dt,
                        dt_txt: item.dt_txt,
                        main: item.main,
                        rain: item.rain || { '3h': 0 },
                        weather: item.weather,
                        wind: item.wind,
                    })),
                },
                context: { city, unit }
            }
        };
    } catch (error) { throw error }
    finally { }
}
const fetchMap = async () => {
    try {
        const res = await fetch('./api/map')
        if (!res) return
        const result = await res.json()
        console.log(result.data);
    } catch (error) { throw error }
    finally { }
}
const getTemp = (temp: number, unit: string) =>
    unit === "imperial" ? `${~~(temp * 9 / 5 + 32)}` : `${~~temp}`;
const getSpeed = (speed: number, unit: string) =>
    unit === "imperial" ? `${~~(speed * 2.24)}mph` : `${~~speed}ms`;
const getDay = (time: number) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    const day = new Date(time * 1000);
    return ({
        localTime: day.toLocaleTimeString().substring(0, day.toLocaleTimeString().lastIndexOf(':')),
        localDay: days[day.getDay()],
        localDate: day.toLocaleDateString(),
        day: day.getDay(),
    })
}
const getMinMaxTempDaily = (list: hourly[]) => {
    const days: daily = [];
    let day: { day: number, localDay: string };
    let counter = 0

    list.forEach((sample) => {
        if (!day) {
            day = getDay(sample.dt)
            return days.push({
                day: day.day,
                localDay: day.localDay,
                min: sample.main.temp_min,
                max: sample.main.temp_max,
                icons: [{
                    icon: sample.weather[0].icon,
                    counter: 1,
                }]
            })
        }
        const tmpDay = getDay(sample.dt)
        if (tmpDay.day !== day.day) {
            counter++;
            day = tmpDay
            return days.push({
                day: day.day,
                localDay: day.localDay,
                min: sample.main.temp_min,
                max: sample.main.temp_max,
                icons: [{
                    icon: sample.weather[0].icon,
                    counter: 1,
                }]
            })
        }
        days[counter].max = Math.max(sample.main.temp_max, days[counter].max)
        days[counter].min = Math.min(sample.main.temp_min, days[counter].min)
        let isMatch = false;
        days[counter].icons.forEach((iconObj) => {
            if (!isMatch) {
                if (iconObj.icon === sample.weather[0].icon) {
                    iconObj.counter += 1;
                    isMatch = true;
                }
            }
        })
        if (!isMatch) {
            days[counter].icons.push({
                icon: sample.weather[0].icon,
                counter: 1,
            })
        }
    })
    return days;
}

export { fetchData, fetchMap, getTemp, getSpeed, getMinMaxTempDaily, getDay }