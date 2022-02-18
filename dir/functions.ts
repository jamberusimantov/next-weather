import getConfig from 'next/config';
import { day, iconObj, hourly } from './types';

const fetchData = async (city: string, unit: string) => {
    const { serverRuntimeConfig } = getConfig();
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
                data: {},
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
                data: {},
                context: { city, unit }
            }
        }
        const data = prepareProps(result)
        return {
            props: {
                success: true,
                context: { city, unit },
                data,
            }
        };
    } catch (error) { throw error }
    finally { }
}
const getTemp = (temp: number, unit: string) => {
    return unit === "imperial" ? `${~~(temp * 9 / 5 + 32)}` : `${~~temp}`;
}
const getSpeed = (speed: number, unit: string) => {
    return unit === "imperial" ? `${~~(speed * 2.24)}` : `${~~speed}`;
}
const getDaily = (time: number) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    const day = new Date(time * 1000);
    return ({
        day: day.getDay(),
        localTime: day.toLocaleTimeString().substring(0, day.toLocaleTimeString().lastIndexOf(':')),
        localDay: days[day.getDay()],
        localDate: day.toLocaleDateString(),
    })
}
const getTheCommonIcon = (iconArr: iconObj[]) => {
    let max: iconObj = { icon: '', counter: 0 };
    iconArr.forEach((obj) => {
        if (obj.counter > max.counter) {
            max = obj
        }
    })
    return max;
}
const prepareProps = (result: { list: hourly[], city: {} }) => {
    const days: hourly[][] = [];
    const dailyArr: day[] = [];
    const iconsArr: iconObj[] = []
    let day: day;
    let counter = 0
    result.list.forEach((timeForecastObj: hourly) => {
        let isMatch = false;
        const temp = getDaily(timeForecastObj.dt)
        const tempDay = {
            day: temp.day,
            localDay: temp.localDay,
            localDate: temp.localDate,
            clouds: {
                min: timeForecastObj.clouds.all,
                max: timeForecastObj.clouds.all,
            },
            temp: {
                min: timeForecastObj.main.temp_min,
                max: timeForecastObj.main.temp_max,
            },
            rain: {
                min: timeForecastObj.rain?.['3h'] || 0,
                max: timeForecastObj.rain?.['3h'] || 0,
            },
            humidity: {
                min: timeForecastObj.main.humidity,
                max: timeForecastObj.main.humidity,
            },
            wind: {
                min: timeForecastObj.wind.speed,
                max: timeForecastObj.wind.speed,
            },
            icon: {
                icon: timeForecastObj.weather[0].icon,
                counter: 1,
            }
        }
        if (!day) {
            day = tempDay;
            days.push([timeForecastObj])
            dailyArr.push(day);
            iconsArr.push(tempDay.icon);
            return
        }
        if (temp.day !== day.day) {
            dailyArr[counter].icon = getTheCommonIcon(iconsArr)
            iconsArr.length = 0
            counter++;
            day = tempDay;
            days.push([timeForecastObj])
            dailyArr.push(day);
            return
        }
        days[counter].push(timeForecastObj);
        dailyArr[counter].clouds.max = Math.max(timeForecastObj.clouds.all, dailyArr[counter].clouds.max)
        dailyArr[counter].clouds.min = Math.min(timeForecastObj.clouds.all, dailyArr[counter].clouds.min)
        dailyArr[counter].temp.max = Math.max(timeForecastObj.main.temp_max, dailyArr[counter].temp.max)
        dailyArr[counter].temp.min = Math.min(timeForecastObj.main.temp_min, dailyArr[counter].temp.min)
        dailyArr[counter].rain.max = Math.max(timeForecastObj.rain?.['3h'] || 0, dailyArr[counter].rain.max)
        dailyArr[counter].rain.min = Math.min(timeForecastObj.rain?.['3h'] || 0, dailyArr[counter].rain.min)
        dailyArr[counter].humidity.max = Math.max(timeForecastObj.main.humidity, dailyArr[counter].humidity.max)
        dailyArr[counter].humidity.min = Math.min(timeForecastObj.main.humidity, dailyArr[counter].humidity.min)
        dailyArr[counter].wind.max = Math.max(timeForecastObj.wind.speed, dailyArr[counter].wind.max)
        dailyArr[counter].wind.min = Math.min(timeForecastObj.wind.speed, dailyArr[counter].wind.min)

        iconsArr.forEach((iconObj: iconObj) => {
            if (!isMatch && iconObj.icon === timeForecastObj.weather[0].icon) {
                iconObj.counter += 1;
                isMatch = true;
            }
        })
        if (!isMatch) iconsArr.push({
            icon: timeForecastObj.weather[0].icon,
            counter: 1,
        })
    })

    return ({
        city: result.city,
        daily: dailyArr,
        days,
    })

}
export { fetchData, getTemp, getSpeed, getDaily }