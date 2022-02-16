import React, { useEffect, useState, ReactElement, useMemo } from 'react'
import styles from '../styles/City.module.css'
import Image from 'next/image'
import { Layout, Error, Daily, Hourly, Search } from '../components'
import { fetchData, getSpeed, getTemp, getDay } from '../dir/functions'
import { context, city_props, data, day, hourly } from '../dir/types'
import { hasFlag } from 'country-flag-icons';

export async function getServerSideProps(context: context) {
  const URIencoded = encodeURIComponent(context.query.city)
  const query = context.query.unit === 'metric' ? 'metric' : 'imperial';
  const res = await fetchData(URIencoded, query);
  console.assert(res.props.success, res.props.error?.message)
  return res;
}
const Top = (props: {
  unit: string,
  setUnit: (unit: string) => void,
  openSearch: () => void,
  data: data,
}) => {
  const current = props.data.hourly[0]
  const currentDay = getDay(props.data.hourly[0].dt);

  return (
    useMemo(() => <>
      <div className={styles.top_left}>
        <div className={styles.name_search}>
          <p className={`${styles.emphasize}${' '}${styles.name}`}>
            {props.data.name[0].toUpperCase() + props.data.name.substring(1)}
          </p >
          {hasFlag(props.data.country) &&
          <span className={styles.flag}
          
          >

            <Image
              alt={''}
              width={35}
              height={35}
              src={`https://purecatamphetamine.github.io/country-flag-icons/3x2/${props.data.country}.svg`} />
              </span>
          }
          <p
            className={styles.search}
            onClick={props.openSearch}
          >
            &#x1F50E;
          </p>
        </div>
        <p>
          {`${currentDay.localDay}${' '}${currentDay.localTime}`}
        </p>
        <p>
          {current && current?.weather[0].description[0].toUpperCase() +
            current?.weather[0].description.substring(1)}
        </p>
      </div>
      <div className={styles.top_right}>
        <div className={styles.top_right_left}>
          <p>
            Rain:{' '}{`${current?.rain ? current.rain['3h'] : 0}mm`}
          </p>
          <p>
            Humidity:{' '}{`${current ? current.main.humidity : 0}%`}
          </p>
          <p>
            Wind:{' '}{`${getSpeed(current ? current.wind.speed : 0, props.unit)}`}
          </p>
        </div>
        <div className={styles.top_right_temp_unit_image}>
          <div className={styles.top_right_temp_unit}>
            <div className={`${styles.top_right_temp}${' '}${styles.emphasize}`}>
              <span>
                {getTemp(current ? current.main.temp : 0, props.unit)}
              </span>
            </div>
            <div>
              <p>
                <span
                  className={styles.top_right_unit + ' ' + `${props.unit === 'imperial' ? styles.emphasize_unit + ' ' + styles.emphasize : ''}`}
                  id='unit_imperial'
                  onClick={() => props.setUnit('imperial')}>
                  °F
                </span>|
                <span
                  className={styles.top_right_unit + ' ' + `${props.unit === 'metric' ? styles.emphasize_unit + ' ' + styles.emphasize : ''}`}
                  id='unit_metric'
                  onClick={() => props.setUnit('metric')}>
                  °C
                </span>
              </p>
            </div>
          </div>
          <div className={styles.top_right_image}>
            <div className={styles.image}>
              <Image
                src={`https://openweathermap.org/img/wn/${current?.weather[0].icon}@2x.png`}
                alt=""
                width={500}
                height={500}
              />
            </div>
          </div>
        </div>
      </div>
    </>, [props.unit, props.data])
  )
}
const Middle = (props: {
  unit: string,
  hourly: hourly[][],
  day: number | undefined,
}) => {
  const [title, setTitle] = useState('temperature');
  const titles = ['temperature', 'rain', 'wind'];
  return (
    useMemo(() => <>
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
      <Hourly hourly={props.hourly} day={props.day} unit={props.unit} title={title} />
    </>, [props.unit, props.hourly, props.day, title])
  )
}
const Bottom = (props: {
  unit: string,
  daily: day[],
  changeDay: (day: number) => void
}) => {
  return (useMemo(() => <Daily
    unit={props.unit}
    changeDay={props.changeDay}
    daily={props.daily}
  />, [props.unit, props.daily]))
}

const City = (props: city_props) => {
  const [isMounted, setIsMounted] = useState(false);
  const [isSearch, setIsSearch] = useState(false);
  const [unit, setUnit] = useState(props.context.unit);
  const [day, setDay] = useState<number | undefined>();

  useEffect(() => {
    setIsMounted(true);
  
    return () => setIsMounted(false);
  }, [])
  if (!isMounted) return <></>
  if (props.error) return <Error error={props.error} />

  return (
    <div className={styles.container}>
      <div className={isSearch ? styles.blur : ''}>
        <div className={styles.top}>
          <Top
            unit={unit}
            setUnit={setUnit}
            openSearch={() => setIsSearch(true)}
            data={props.data}
          />
        </div>
        <div className={styles.middle}>
          <Middle
            unit={unit}
            hourly={props.data.days}
            day={day}
          />
        </div>
        <div className={styles.bottom}>
          <Bottom
            unit={unit}
            daily={props.data.daily}
            changeDay={setDay}
          />
        </div>
      </div>
      {isSearch && <Search closeSearch={() => setIsSearch(false)} />}
    </div>
  )
}

City.getLayout = (page: ReactElement) => <Layout>{page}</Layout>

export default City