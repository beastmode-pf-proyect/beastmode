import React, { ReactElement } from "react";
import styles from "./not-found.module.css";

export const pageNotFound: React.FC = (): ReactElement => {

    return (
        <>
        <div className={styles.page}>
            <div className={styles.container}>
                <div className={styles.ring}></div>
                <div className={styles.ring}></div>
                <div className={styles.ring}></div>
                <div className={styles.ring}></div>
                <div className={styles.text}>404...</div>
            </div>
        </div>
        </>
    )
}

export default pageNotFound;