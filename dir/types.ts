import type { AppProps } from 'next/app'
import { ReactElement, ReactNode } from 'react'
import type { NextPage } from 'next'

type NextPageWithLayout = NextPage & {
    getLayout: (page: ReactElement) => ReactNode
}
type AppPropsWithLayout = AppProps & {
    Component: NextPageWithLayout
}
type query = {
    unit: string
    city: string
}
type context = {
    query: query
};
type error_props = {
    cod: string,
    message: string
};
type data = {
    city: {
        name: string,
        country: string,
    }
    daily: day[],
    days: hourly[][],
};
type city_props = {
    success: boolean,
    context: query,
    error?: error_props,
    data: data,
};
type hourly = {
    clouds: {
        all: number
    },
    dt: number,
    dt_txt: string,
    wind: {
        speed: number,
        deg: number,
    },
    rain?: {
        '3h': number
    },
    weather: [{
        id: number,
        main: string,
        description: string,
        icon: string
    }],
    main: {
        humidity: number,
        temp: number,
        temp_min: number,
        temp_max: number,
    }
};
type chartTheme = {
    [key: string]: {
        primary: string,
        secondary: string,
    },
};
type minMax = {
    min: number,
    max: number
}
type iconObj = {
    icon: string,
    counter: number,
}
type day = {
    day: number,
    localDay: string,
    localDate: string,
    clouds: minMax,
    temp: minMax,
    rain: minMax,
    humidity: minMax,
    wind: minMax,
    icon:iconObj,
};
type chartData = {
    time: string,
    temperature: string,
    rain: number,
    wind: number,
}[];


export type {
    AppPropsWithLayout,
    context,
    city_props,
    error_props,
    hourly,
    chartTheme,
    day,
    iconObj,
    data,
    chartData,
}