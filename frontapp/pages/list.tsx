import Link from "next/link";
import Layout from "../components/mainLayout/Layout";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashCan } from '@fortawesome/free-solid-svg-icons'
import listStyle from "../styles/list.module.css";

const ListPage: React.FC = () => {
    const imageUrl = '/imgs/26649380_s.jpg';
    const title = "ぶり大根";

    return (
        <Layout>
            <ul className={listStyle.list}>
                <li>
                    <Link href="/link">
                        <div className={listStyle.listBox}>
                            <img src={imageUrl} alt="reciipe image" />
                            <h2>{title}</h2>
                            <span className={listStyle["icon-trash"]}>
                                    <FontAwesomeIcon icon={faTrashCan} />
                            </span>
                        </div>
                    </Link>
                </li>
            </ul>
        </Layout>
    );
}

export default ListPage;