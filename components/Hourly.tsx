import React from 'react';
import { hourly, chartData } from '../dir/types'
import { getDaily, getTemp } from '../dir/functions';
import { Chart } from '.';

const Hourly = (props: { hourly: hourly[][], unit: string, title: string, day: number | undefined }) => {
    const data: chartData = [];
    let arr: hourly[] = [];

    arr = props.hourly[props.day || 0]
    arr.forEach((obj) => {
        data.push({
            time: getDaily(obj.dt).localTime,
            temperature: getTemp(obj.main.temp, props.unit),
            rain: obj.rain ? obj.rain['3h'] : 0,
            wind: obj.wind.speed,
        })
    })

    return (<Chart data={data} title={props.title} />)
}

export default Hourly

