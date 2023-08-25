import { ChangeEvent, useEffect, useState } from "react"
import { useRouter } from "next/router";
import Layout from "../components/mainLayout/Layout";
import detailStyle from "../styles/detail.module.css";
import formStyles from '../styles/form.module.css';
import { withAuthCheck } from '../components/AuthCheck'

interface RecipeData {
    date: string;
    recipename: string;
    category: string;
    imageURL: string;
    overview: string;
    is_favorite: boolean;
}

interface CategoryOption {
    value: string;
    label: string;
}

const Detail: React.FC = () => {
    const router = useRouter();
    const [categories, setCategories] = useState<CategoryOption[]>([]);
    const [recipeData, setRecipeData] = useState<RecipeData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const getCookie = (name: string): string | undefined => {
        const value = `; ${document.cookie}`;
        const parts: string[] = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop()?.split(';').shift();
    }

    // 料理カテゴリ 変更イベント
    const handleSelectChange = (value: string) => {
        setRecipeData(prev => {
            if (prev) {
                return { ...prev, category: value };
            } else {
                // 初期値やデフォルト値をここで設定することができます。
                return {
                    date: '', // 例：new Date().toISOString()
                    recipename: '',
                    category: value,
                    imageURL: '',
                    overview: '',
                    is_favorite: false
                };
            }
        });
    };

    useEffect(() => {
        //FastAPIのrecipe_idで改めて取得することにした。
        if (router.query.id) {
            const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/fast/recipe/?recipe_id=${router.query.id.toString()}`;
            const token = getCookie('userToken');
            const headers = {
                'accept': 'application/json',
                'Authorization': `Bearer ${token}`
            };

            //recipeを取得し、RecipeDataに格納        
            fetch(url, { headers })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('データの取得に失敗しました');
                    }
                    return response.json();
                })
                .then((data) => {
                    setRecipeData(data);
                    setLoading(false);
                })
                .catch(error => {
                    console.error('バックエンドから料理カテゴリの取得に失敗しました:', error);
                    setError(error.message);
                    setLoading(false);
                });
        }
    }, [router.query.id]);

    // Uploadページのロードで実行。カテゴリを取得
    useEffect(() => {
        const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/fast/categories/`;
        const token = getCookie('userToken');
        const headers = {
            'accept': 'application/json',
            'Authorization': `Bearer ${token}`
        };

        fetch(url, { headers })
            .then(response => response.json())
            .then((data) => {
                const formattedCategories = data.map((category: any) => ({
                    value: category,
                    label: category
                }));
                setCategories(formattedCategories);

                // if (formattedCategories.length > 0) {
                //     setFormData(prev => ({ ...prev, category: formattedCategories[0].value }));
                // }
            })

            .catch(error => console.error('バックエンドから料理カテゴリの取得に失敗しました:', error));
    }, [router.query.id]);





    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <Layout>
            <div className={detailStyle.centering}>
                {recipeData && (
                    <div>
                        <div className={detailStyle.recipe_title}>{recipeData.recipename}</div>
                        <div className={detailStyle.create_date}>{recipeData.date}</div>
                        <div className={detailStyle.parentElementSelector}>
                            <select
                                value={recipeData.category}
                                onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                                    handleSelectChange(e.target.value)
                                }
                                className={detailStyle.category} >
                                {categories.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className={detailStyle.photo_layout}>
                            <img src={recipeData.imageURL} alt={recipeData.recipename} />
                        </div>
                        <textarea className={detailStyle.recipe_summary}>{recipeData.overview}</textarea>
                    </div>
                )}
            </div>
        </Layout>
    );
}
export const getServerSideProps = withAuthCheck();

export default Detail;
