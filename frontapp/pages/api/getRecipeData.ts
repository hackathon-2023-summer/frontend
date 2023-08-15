import { NextApiRequest, NextApiResponse } from "next";
// import cookie from 'cookie';

const apiToken = process.env.NOTION_API_TOKEN;
const databaseId = process.env.NOTION_RECIPES_ID;
const apiUrl = `https://api.notion.com/v1/databases/${databaseId}/query`;

// 型宣言はNotionから送られるデータ型に合わせています。
// 環境に応じて適宜変更してください。
export interface RecipeData {
    id: string;
    date: string;
    relation: string;
    imageUrl: string;
    recipename: string;
    category: string;
    overview: string;
}

interface ObjectType {
    object: string;
    id: string;
    properties: {
        user_id: {
            type: string;
            relation: [
                {
                    id: string;
                }
            ];
        };
        photo: {
            type: string;
            rich_text: [
                {
                    text: {
                        content: string;
                    };
                }
            ];
        };
        recipeneme: {
            type: string;
            title: [
                {
                    text: {
                        content: string;
                    };
                }
            ];
        };
        category: {
            type: string;
            multi_select: [
                {
                    name: string;
                }
            ];
        };
        date: {
            date: {
                start: string;
            }
        };
        overview: {
            type: string;
            rich_text: [
                {
                    text: {
                        content: string;
                    };
                }
            ];
        };
    };
}


const getRecipeData = async (req: NextApiRequest, res: NextApiResponse) => {
    // try {
    //     const cookies = req.headers.cookie;
    //     const parsedCookies = cookie.parse(cookies || '');

    //     const user_id = parsedCookies['user_id'];

    //     if (!user_id) {
    //         return res.status(400).json({ message: 'cookieにuser_idがセットされていません。' });
    //     }

    //     const response = await fetch(apiUrl, {
    //         method: 'POST',
    //         headers: {
    //             Authorization: `Bearer ${apiToken}`,
    //             'Content-Type': 'application/json',
    //             'Notion-Version': '2022-06-28',
    //         },
    //         body: JSON.stringify({
    //             filter: {
    //                 or: [
    //                     {
    //                         property: 'user_id',
    //                         relation: {
    //                             contains: user_id,
    //                         },
    //                     },
    //                 ],
    //             },
    //         }),
    //     });

    //     if (!response.ok) {
    //         throw new Error('データベースとのfetchingに失敗しました。');
    //     }

    //     const { results } = await response.json();

    //     const filteredData: RecipeData[] = results.map((item: ObjectType) => {
    //         return {
    //             id: item.id,
    //             date: item.properties.date.date.start,
    //             relation: item.properties.user_id.relation[0].id,
    //             imageUrl: item.properties.photo.rich_text[0].text.content,
    //             recipename: item.properties.recipeneme.title[0].text.content,
    //             category: item.properties.category.multi_select[0].name,
    //             overview: item.properties.overview.rich_text[0].text.content,
    //         };
    //     });

    //     return res.status(200).json(filteredData);
    // } catch (error) {
    //     console.error('Notion fitching error:', error);
    //     return res.status(500).json({ message: 'Server error' });
    // }
}

export default getRecipeData;