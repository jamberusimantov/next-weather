import React, { useState } from 'react'
import styles from '../styles/Hourly.module.css'
import { Chart } from '.'
import { hourly, chartData } from '../dir/types'
import { getDaily, getTemp } from '../dir/functions';

const Hourly = (props: { unit: string, hourly: hourly[][], day: number | undefined }) => {
    const [title, setTitle] = useState('temperature');
    const titles = ['temperature', 'rain', 'wind'];

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

    return (<>
        <div className={styles.titleToggle}>
            {React.Children.toArray(titles.map((name: string) =>
                <p
                    key={`title_${name}`}
                    className={styles.title + ' ' + `${title === name ? styles.emphasize_unit + ' ' + styles.emphasize : ''}`}
                    onClick={() => setTitle(name)}
                >
                    {name[0].toUpperCase() + name.substring(1)}
                </p>
            ))}
        </div>
        <Chart data={data} title={title} />
    </>
    )
}

export default Hourly