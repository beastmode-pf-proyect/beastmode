import styles from "./not-found.module.css";
import Link from "next/link";

export default function PageNotFound() {

    return (
        <>
            <div className={styles.wrapper}>
                <div className={styles.page}>
                    <div className={styles.container}>
                        <div className={styles.ring}></div>
                        <div className={styles.ring}></div>
                        <div className={styles.ring}></div>
                        <div className={styles.ring}></div>
                        <div className={styles.text}>Error 404</div>
                    </div>
                </div>


                <div className={styles.tooltip_container}>
                    <Link href="/">
                        <button className={styles.tooltip_trigger}>Home</button>
                    </Link>
                    <div className={styles.tooltip}>Pagina No Encontrada, Click Para Retornar a Home</div>
                </div>
            </div>
        </>
    )
}
