import React, { useEffect, useState } from 'react';
import { chartTheme, chartData } from '../dir/types'
import { AreaChart, Area, XAxis, LabelList } from "recharts";
import styles from '../styles/Hourly.module.css'

const theme: chartTheme = {
    temperature: {
        primary: '#c9510c',
        secondary: '#F4CBB2'
    },
    rain: {
        primary: '#4078c0',
        secondary: '#7DBBE6'
    },
    wind: {
        primary: '#F4CBB2',
        secondary: '#6e5494'
    },
}

const Chart = (props: { data: chartData, title: string }) => {
    const [width, setWidth] = useState(window.innerWidth);

    useEffect(() => {
        const resize = () => setWidth(window.innerWidth);
        window.addEventListener('resize', resize)
        return (() => window.removeEventListener('resize', resize))
    }, [])

    return (
        <div id={styles.chart} className={styles.container}>
            <AreaChart
                width={width}
                compact
                height={200}
                data={props.data}
                margin={{
                    top: 20,
                    right: 20,
                    left: 20,
                    bottom: 0
                }}
            >
                <XAxis
                    dataKey="time"
                    // ltr
                    reversed={false}
                />
                <Area
                    type="monotone"
                    dataKey={props.title}
                    fill={theme[props.title].primary}
                    stroke={theme[props.title].secondary}
                >
                    <LabelList dataKey={props.title} position="top" />
                </Area>
            </AreaChart>
        </div>)
}

export default Chart