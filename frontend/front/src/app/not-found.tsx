import React from "react";
import Image from "next/image";
import styles from "./not-found.module.css";
import box from "../../public/img/box.gif";

import Link from "next/link";

export default function PageNotFound() {
    return (
        <div className="flex justify-center h-full items-center m-10">
            <div className="flex flex-col md:flex-row items-center justify-center text-center w-full">
                <div className="m-5">
                    <Image src={box} alt="box" className={`${styles.imagen} rounded-3xl`} />
                </div>

                <div className="flex justify-center flex-col items-center">
                <div className={styles.glitch} data-text="404">404</div>
                <p>Oops! Estas Perdido</p>
                <p>Pagnina no encontrada</p>
                <p className="mt-5">👇</p>
                    <Link href={"/"} className="relative  text-black text-3xl hover:text-red-600 transition-colors duration-300 group">
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-600 group-hover:w-full transition-all duration-300" />
                        Home
                    </Link>
                    
                </div>
            </div>
        </div>
    );
}
