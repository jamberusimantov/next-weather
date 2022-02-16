import Image from 'next/image'
import styles from '../styles/Error.module.css'
import { error_props } from '../dir/types'



export default function Error(props: { error: error_props }) {

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>
                Oops... <span>no Weather!</span>
            </h1>
            <p className={styles.description}>
                Error - {`${props.error.cod}${' '}${props.error.message}`}
            </p>
            <p className={styles.description}>
                gathering information before redirecting
            </p>
            <Image src="/sunny day.svg" alt="" width={45} height={45} />
        </div>
    )
}