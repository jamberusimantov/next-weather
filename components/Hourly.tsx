import React from 'react';
import { hourly, chartData } from '../dir/types'
import { getDay, getTemp } from '../dir/functions';
import { Chart } from '.';

const Hourly = (props: { list: hourly[], unit: string, title: string }) => {

    const data: chartData = [];
    props.list.slice(0, 8).forEach((obj) => {
        data.push({
            time: getDay(obj.dt).localTime,
            temperature: getTemp(obj.main.temp, props.unit),
            rain: obj.rain ? obj.rain['3h'] : 0,
            wind: obj.wind.speed,
            windDeg: obj.wind.deg,
        })
    })

    return (<Chart data={data} title={props.title} />)
}

export default Hourly

