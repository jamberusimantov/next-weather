import React, { useEffect, useState, ReactElement } from 'react'
import styles from '../styles/City.module.css'
import Image from 'next/image'
import { Layout, Error, Daily, Hourly, Search } from '../components'
import { fetchData, getSpeed, getTemp, getDaily } from '../dir/functions'
import { context, city_props } from '../dir/types'
import { hasFlag } from 'country-flag-icons';

export async function getServerSideProps(context: context) {
  const URIencoded = encodeURIComponent(context.query.city)
  const query = context.query.unit === 'metric' ? 'metric' : 'imperial';
  const res = await fetchData(URIencoded, query);
  console.assert(res.props.success, res.props.error?.message)
  return res;
}

const City = (props: city_props) => {
  const [isMounted, setIsMounted] = useState(false);
  const [isSearch, setIsSearch] = useState(false);
  const [unit, setUnit] = useState(props.context.unit);
  const [day, setDay] = useState<number | undefined>();
  const isImperial = unit === 'imperial';

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, [])

  if (!isMounted) return <></>
  if (props.error) return <Error error={props.error} />

  const currentDay = getDaily(props.data.days[0][0].dt);
  const anotherDay = props.data.daily[day || 0]
  const forecast = Number.isInteger(day) ? {
    rain: `${~~anotherDay.rain.min}-${~~anotherDay.rain.max}`,
    humidity: `${anotherDay.humidity.min}-${anotherDay.humidity.max}`,
    wind: getSpeed(anotherDay.wind.min, unit) + '-' +
      getSpeed(anotherDay.wind.max, unit) + ' ' +
      `${isImperial ? 'mph' : 'ms'}`,
    temp: getTemp(anotherDay.temp.min, unit) + '-' +
      getTemp(anotherDay.temp.max, unit),
    icon: anotherDay.icon.icon,
  } : {
    rain: props.data.days[0][0].rain?.['3h'] || 0,
    humidity: props.data.days[0][0].main.humidity,
    wind: getSpeed(props.data.days[0][0].wind.speed, unit) + ' ' +
      `${isImperial ? 'mph' : 'ms'}`,
    temp: getTemp(props.data.days[0][0].main.temp, unit),
    icon: props.data.days[0][0].weather[0].icon,
  };


  return (
    <div className={styles.container}>
      <div className={isSearch ? styles.blur : ''}>
        <div className={styles.top}>
          <div className={styles.top_left}>
            <div className={styles.name_search}>
              <p className={`${styles.emphasize}${' '}${styles.name}`}>
                {props.data.city.name[0].toUpperCase() + props.data.city.name.substring(1)}
              </p >
              {hasFlag(props.data.city.country) &&
                <span className={styles.flag}>
                  <Image
                    alt={''}
                    width={35}
                    height={35}
                    src={`https://purecatamphetamine.github.io/country-flag-icons/3x2/${props.data.city.country}.svg`} />
                </span>
              }
              <p
                className={styles.search}
                onClick={() => setIsSearch(true)}
              >
                &#x1F50E;
              </p>
            </div>
            <p>
              {`${currentDay.localDay}${' '}${currentDay.localTime}`}
            </p>
            <p>
              {
                props.data.days[0][0].weather[0].description[0].toUpperCase() +
                props.data.days[0][0].weather[0].description.substring(1)
              }
            </p>
            {Number.isInteger(day) &&
              <p className={`${styles.emphasize}${' '}${styles.bactToCurrent}`}
                onClick={() => setDay(undefined)}
              >
                current &raquo;
              </p>
            }
          </div>
          <div className={styles.top_right}>
            <div className={styles.top_right_left}>
              <p>
                Rain:{' '}{`${forecast.rain} mm`}
              </p>
              <p>
                Humidity:{' '}{`${forecast.humidity} %`}
              </p>
              <p>
                Wind:{' '}{`${forecast.wind}`}
              </p>
            </div>
            <div className={styles.top_right_temp_unit_image}>
              <div className={styles.top_right_temp_unit}>
                <div className={`${styles.top_right_temp}${' '}${styles.emphasize}`}>
                  <span>
                    {forecast.temp}
                  </span>
                </div>
                <div>
                  <p>
                    <span
                      className={styles.top_right_unit + ' ' +
                        `${isImperial ? styles.emphasize_unit + ' ' + styles.emphasize : ''}`
                      }
                      id='unit_imperial'
                      onClick={() => setUnit('imperial')}>
                      &#8457;
                    </span>|
                    <span
                      className={styles.top_right_unit + ' ' +
                        `${!isImperial ? styles.emphasize_unit + ' ' + styles.emphasize : ''}`
                      }
                      id='unit_metric'
                      onClick={() => setUnit('metric')}>
                      &#8451;
                    </span>
                  </p>
                </div>
              </div>
              <div className={styles.top_right_image}>
                <div className={styles.image}>
                  <Image
                    src={`https://openweathermap.org/img/wn/${forecast.icon}@2x.png`}
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
          <Hourly
            unit={unit}
            hourly={props.data.days}
            day={day}
          />
        </div>
        <div className={styles.bottom}>
          <Daily
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