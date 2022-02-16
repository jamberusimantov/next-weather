import { Form } from '../components'
import styles from '../styles/Search.module.css'

const Search = (props: { closeSearch: () => void }) => {

    return (
        <div className={styles.form}>
            <div className={styles.form_container}>
                <button
                    className={styles.form_close}
                    onClick={props.closeSearch}
                >
                    &#x2715;
                </button>
                <Form close={props.closeSearch} />
            </div>
        </div>
    )
}
export default Search;