import Image from 'next/image'
import styles from '../styles/Layout.module.css'

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <span>
        Made with ❤ in Israel © 2022 Siman tov Jamberu. All rights reserved.
      </span>
      <div>
        <a
          href="https://github.com/jamberusimantov"
          target="_blank"
          rel="noopener noreferrer">
          <span>
            <Image
              className={styles.logo_linkedin}
              src="/linked in.svg"
              alt=""
              width={35}
              height={35}
            />
          </span>
        </a>
        <a
          href="https://www.linkedin.com/in/siman-tov-jamberu/"
          target="_blank"
          rel="noopener noreferrer">
          <span>
            <Image
              className={styles.logo_github}
              src="/github.svg"
              alt=""
              width={35}
              height={35} />
          </span>
        </a>
      </div>
    </footer>
  )
}

export default Footer