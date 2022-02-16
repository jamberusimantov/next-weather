import { Layout, Form } from '../components'
import React, { ReactElement } from 'react'

const Home = () => <Form />
Home.getLayout = (page: ReactElement) => <Layout>{page}</Layout>

export default Home
