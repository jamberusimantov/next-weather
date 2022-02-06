type context = {
    query: query
};
type city_props = {
    success: boolean,
    error?: error_props,
    data?: city,
    context: query
};
type error_props = {
    cod: string,
    message: string
};
type query = {
    unit: string
    city: string
};
type city = {
    name: string,
    list: hourly[],
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
type daily = {
    day: number,
    localDay: string,
    min: number,
    max: number,
    icons: { icon: string, counter: number, }[],
}[];
type themeType = {
    temperature: {
        primary: string,
        secondary: string
    },
    rain: {
        primary: string,
        secondary: string
    },
    wind: {
        primary: string,
        secondary: string
    },
};
type chartData = {
    time: string,
    temperature: string,
    rain: number,
    wind: number,
    windDeg: number,
}[];
export type {
    context,
    city_props,
    error_props,
    city,
    hourly,
    daily,
    themeType,
    chartData
}