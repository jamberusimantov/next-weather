import React from "react";
import { daily } from '../dir/types'
import Image from "next/image";
import { getTemp } from '../dir/functions'
import styles from '../styles/Daily.module.css'

const Daily = (props: { cb: () => daily, unit: string }) => {

    const arr = props.cb();

    const getTheCommonIcon = (iconArr: { icon: string, counter: number }[]) => {
        let max: {
            icon: string,
            counter: number
        } = { icon: '', counter: 0 };
        iconArr.forEach((icon, i) => {
            if (icon.counter > max.counter) {
                max = icon
            }
        })
        return max.icon;
    }

    return (
        <div className={styles.container}>
            {React.Children.toArray(arr.map((obj) =>
                <div
                    key={`daily_obj_${obj.day}`}
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
                            <span>{getTemp(obj.min, props.unit)}</span>°-
                            <span>{getTemp(obj.max, props.unit)}</span>°
                        </p>
                    </div>
                </div>
            ))}
        </div>)
}

export default Daily
