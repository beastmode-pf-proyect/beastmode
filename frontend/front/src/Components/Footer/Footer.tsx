import React, { ReactElement } from "react";

// importamos estilos desde módulo CSS
import styles from "./Footer.module.css";

export const Footer: React.FC = (): ReactElement => {
    return (
        <footer className="flex flex-col items-center">
            <div className={`${styles.contenedorVer} w-full flex flex-col items-center`}>
                {/* Sección oculta (aparece en hover o siempre en móviles) */}
                <div className={`${styles.oculto} text-white p-6 rounded-lg w-full max-w-4xl`}>
                    <div className="flex flex-col md:flex-row md:justify-between text-center md:text-left gap-6">
                        {/* BeastMode */}
                        <div className="flex-1">
                            <h2 className="text-2xl font-bold">BeastMode</h2>
                            <p className="text-sm mt-2">
                                Transforming lives through elite fitness programs and nutrition guidance.
                            </p>
                        </div>

                        {/* Quick Links */}
                        <div className="flex-1">
                            <h3 className="text-xl font-semibold">Quick Links</h3>
                            <ul className="mt-2 space-y-1">
                                <li className="hover:text-gray-400 cursor-pointer">Home</li>
                                <li className="hover:text-gray-400 cursor-pointer">Features</li>
                                <li className="hover:text-gray-400 cursor-pointer">Testimonials</li>
                                <li className="hover:text-gray-400 cursor-pointer">Contact</li>
                            </ul>
                        </div>

                        {/* Services */}
                        <div className="flex-1">
                            <h3 className="text-xl font-semibold">Services</h3>
                            <ul className="mt-2 space-y-1">
                                <li className="hover:text-gray-400 cursor-pointer">Personal Training</li>
                                <li className="hover:text-gray-400 cursor-pointer">Nutrition Consulting</li>
                                <li className="hover:text-gray-400 cursor-pointer">Group Workouts</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Sección visible */}
                <div className="text-center text-white py-4 w-full max-w-4xl">
                    <hr className="border-t-2 border-gray-500 my-4" />
                    <span>© 2025 BeastMode. All rights reserved.</span>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
