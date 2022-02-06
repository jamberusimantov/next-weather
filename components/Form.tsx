import { FormEvent } from 'react'
import React, { useState } from 'react'
import styles from '../styles/Form.module.css'
import { useRouter } from 'next/router'
import Image from 'next/image'


const Form = (props: { close?: () => void }) => {
    const [city, setCity] = useState('');
    const [unit, setUnit] = useState('imperial');
    const router = useRouter();

    const getForecast = (e: FormEvent) => {
        e.preventDefault();
        if (!city) return;
        router.push(`/${encodeURIComponent(city)}?unit=${unit}`)
        if (props.close) {
            props.close();
        }
    }

    return (
        <div>
            <div className={styles.image}>
                <Image
                    src="/sunny day.svg"
                    alt=""
                    width={45}
                    height={45}
                />
            </div>
            {!props.close && <>
                <h1 className={styles.title}>
                    Welcome to <span>Weather!</span>
                </h1>
            </>}
            <p className={styles.description}>
                <q>Keep your face to the sun
                    and you will never see the shadows.</q>
            </p>
            <form
                className={styles.form}
                onSubmit={getForecast}
            >
                <input
                    type="text"
                    placeholder="Enter City"
                    maxLength={50}
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className={styles.textInput}
                />
                <div className="raioToggle">
                    <label className={styles.radio}>
                        <input
                            type="radio"
                            name="units"
                            checked={unit === "imperial"}
                            value="imperial"
                            onChange={(e) => setUnit(e.target.value)}
                        />
                        Fahrenheit
                    </label>
                    <label className={styles.radio}>
                        <input
                            type="radio"
                            name="units"
                            checked={unit === "metric"}
                            value="metric"
                            onChange={(e) => setUnit(e.target.value)}
                        />
                        Celcius
                    </label>
                </div>
                <button
                    type="submit"
                    className={styles.submitButton}>
                    Get Forecast
                </button>
            </form>
        </div>
    )
}

export default Form;