import React, { useEffect, useState, ReactElement, useCallback, useMemo } from 'react'
import Image from 'next/image'
import { fetchData, getSpeed, getTemp, getMinMaxTempDaily, getDay } from '../dir/functions'
import { context, city_props, city } from '../dir/types'
import styles from '../styles/City.module.css'
import { Layout, Error, Daily, Hourly, Form } from '../components'

const City = (props: city_props) => {
  console.clear();
  const [isMounted, setIsMounted] = useState(false);
  const [unit, setUnit] = useState(props.context.unit);
  const [title, setTitle] = useState('temperature');
  const [isSearch, setIsSearch] = useState(false);

  const city: city = props.data || {
    name: '',
    list: [{
      clouds: {
        all: 0
      },
      dt: 0,
      dt_txt: '',
      wind: {
        speed: 0,
        deg: 0,
      },
      rain: {
        '3h': 0
      },
      weather: [{
        id: 0,
        main: '',
        description: '',
        icon: ''
      }],
      main: {
        humidity: 0,
        temp: 0,
        temp_min: 0,
        temp_max: 0,
      }
    }]
  }
  const current = city.list[0]
  const minMax = useCallback(() => getMinMaxTempDaily(city.list), [city.list])
  const MemoDaily = useMemo(() => <Daily cb={minMax} unit={unit} />, [unit, minMax])
  const MemoHourly = useMemo(() => <Hourly list={city.list} unit={unit} title={title} />, [unit, title, city.list])
  const MemoSearch = useMemo(() => <Form close={() => setIsSearch(false)} />, [])
  const titles = ['temperature', 'rain', 'wind'];
  useEffect(() => {
    setIsMounted(true);
    return () => { setIsMounted(false); }
  }, [])

  if (!isMounted) return <></>
  if (props.error) return <Error error={props.error} />
  const day = getDay(current.dt);
  return (
    <div className={styles.container}>
      <div className={isSearch ? styles.blur : ''}>
        <div className={styles.top}>
          <div className={styles.top_left}>
            <div className={styles.name_search}>
              <p className={`${styles.emphasize}${' '}${styles.name}`}>
                {city.name}
              </p >
              <p
                className={styles.search}
                onClick={() => setIsSearch(true)}
              >
                &#x1F50E;
              </p>
            </div>
            <p>
              {`${day.localDay}${' '}${day.localTime}`}
            </p>
            <p>
              {current.weather[0].description[0].toUpperCase() + current.weather[0].description.substring(1)}
            </p>
          </div>
          <div className={styles.top_right}>
            <div className={styles.top_right_left}>
              <p>
                Rain:{' '}{`${current.rain ? current.rain['3h'] : 0}mm`}
              </p>
              <p>
                Humidity:{' '}{`${current.main.humidity}%`}
              </p>
              <p>
                Wind:{' '}{`${getSpeed(current.wind.speed, unit)}`}
              </p>
            </div>
            <div className={styles.top_right_temp_unit_image}>
              <div className={styles.top_right_temp_unit}>
                <div className={`${styles.top_right_temp}${' '}${styles.emphasize}`}>
                  <span>
                    {getTemp(current.main.temp, unit)}
                  </span>
                </div>
                <div>
                  <p>
                    <span
                      className={styles.top_right_unit + ' ' + `${unit === 'imperial' ? styles.emphasize_unit + ' ' + styles.emphasize : ''}`}
                      id='unit_imperial'
                      onClick={() => setUnit('imperial')}>
                      °F
                    </span>|
                    <span
                      className={styles.top_right_unit + ' ' + `${unit === 'metric' ? styles.emphasize_unit + ' ' + styles.emphasize : ''}`}
                      id='unit_metric'
                      onClick={() => setUnit('metric')}>
                      °C
                    </span>
                  </p>
                </div>
              </div>
              <div className={styles.top_right_image}>
                <div className={styles.image}>
                  <Image
                    src={`https://openweathermap.org/img/wn/${current.weather[0].icon}@2x.png`}
                    alt=""
                    width={500}
                    height={500}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.middle}>
          <div className={styles.titleToggle}>
            {React.Children.toArray(titles.map((name: string) =>
              <p
                key={`title_${name}`}
                className={styles.title + ' ' + `${title === name ? styles.emphasize_unit + ' ' + styles.emphasize : ''}`}
                onClick={() => setTitle(name)}>
                {name[0].toUpperCase() + name.substring(1)}
              </p>
            ))}
          </div>
          {MemoHourly}
        </div>
        {MemoDaily}
      </div>
      {isSearch && <>
        <div className={styles.form}>
          <div className={styles.form_container}>
            <button
              className={styles.form_close}
              onClick={() => setIsSearch(false)}
            >
              &#x2715;
            </button>
            {MemoSearch}
          </div>
        </div>
      </>}
    </div>)
}

City.getLayout = (page: ReactElement) => <Layout>{page}</Layout>

export async function getServerSideProps(context: context) {
  const URIencoded = encodeURIComponent(context.query.city)
  const query = context.query.unit === 'metric' ? 'metric' : 'imperial';
  const res = await fetchData(URIencoded, query);
  console.assert(res.props.success, res.props.error?.message)
  return res;
}

export default City