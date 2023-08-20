import Head from "next/head";
import type { FC, ReactNode } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from "./postingLayout.module.css";
import Image from "next/image";

type Props = {
    children: ReactNode;
}

const Layout: FC<Props> = ({ children }) => {
    return (
        <div className={styles.bodyContainer}>
            <Head>
                <title>Antoquino</title>
            </Head>
            <div className={styles.backgroundContainer}>
                <header className={styles.header}>
                    <div className={styles.flxrow}>
                        <img src="/imgs/antoquino.png" alt="antoquinoロゴ" />
                        <h1><span>a</span>ntoquino</h1>
                    </div>
                </header>
                <main>{ children }</main>
            </div>
        </div>
    );
}

export default Layout;