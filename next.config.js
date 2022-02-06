/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        domains: ['openweathermap.org'],
    },
    serverRuntimeConfig: {
        // Will only be available on the server side
        api_key: process.env.api_key,
        api_host: process.env.api_host,
    },
    publicRuntimeConfig: {
        // Will be available on both server and client
    },
}

module.exports = nextConfig