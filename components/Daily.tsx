import React from "react";
import { iconObj, day } from '../dir/types'
import Image from "next/image";
import { getTemp } from '../dir/functions'
import styles from '../styles/Daily.module.css'

const getTheCommonIcon = (iconArr: iconObj[]) => {
    let max: iconObj = { icon: '', counter: 0 };
    iconArr.forEach((obj) => {
        if (obj.counter > max.counter) {
            max = obj
        }
    })
    return max.icon;
}

const Daily = (props: { daily: day[], unit: string, changeDay: (day: number) => void }) => {
    return (
        <div className={styles.container}>
            {React.Children.toArray(props.daily.map((obj, i) =>
                <div
                    key={`daily_obj_${obj.day}`}
                    onClick={() => props.changeDay(i)}
                    className={styles.day}>
                    <p>{obj.localDay}</p>
                    <div className={styles.image_unit}>
                        <div className={styles.image}>
                            <Image
                                src={`https://openweathermap.org/img/wn/${getTheCommonIcon(obj.icons)}@2x.png`}
                                alt=""
                                width={500}
                                height={500}
                            />
                        </div>
                        <p>
                            <span>{getTemp(obj.temp.min, props.unit)}</span>°-
                            <span>{getTemp(obj.temp.max, props.unit)}</span>°
                        </p>
                    </div>
                </div>
            ))}
        </div>)
}

export default Daily
