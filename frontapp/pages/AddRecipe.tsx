import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { useDropzone, FileWithPath } from 'react-dropzone';
import formStyles from '../styles/addRecipe.module.css';

interface FormData {
    date: string;
    recipename: string;
    category: string;
    imageURL: string;
    overview: string;
    is_favorite: boolean;
}

interface ImageUploaderProps {
    onDrop: (acceptedFiles: FileWithPath[]) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onDrop }) => {
    const { getRootProps, getInputProps } = useDropzone({ onDrop });

    return (
        <div {...getRootProps()} className="dropzone">
            <input {...getInputProps()} />
            <p>画像をここにドラッグ＆ドロップするか、クリックして選択してください。</p>
        </div>
    );
};

const handleImageDrop = (acceptedFiles: FileWithPath[]) => {
    // ドロップされたファイルを取得し、アップロード処理などを実装する
    console.log(acceptedFiles);
};

const AddRecipe: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({
        recipename: '',
        date: '',
        category: '',
        imageURL: '',
        overview: '',
        is_favorite: false,
    });

    const [categoryOptions, setCategoryOptions] = useState<string[]>([]);

    useEffect(() => {
        const fetchCategories = async () => {
            const response = await fetch('api/getCategories');
            if (response.ok) {
                const data: string[] = await response.json();
                setCategoryOptions(data);
            } else {
                console.error('Failed to fetch categories');
            }
        };

        fetchCategories();
    }, []);

    const handleInputChange = <T extends keyof FormData>(field: T, value: FormData[T]) => {
        setFormData((prevData) => ({
            ...prevData,
            [field]: value,
        }));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // try {
        //     const updatedCategory = formData.newCategory;
        //     // ? [...formData.category, formData.newCategory]
        //     // : formData.category;

        //     const response = await fetch('api/insertRecipe', {
        //         method: 'POST',
        //         headers: {
        //             'Content-Type': 'application/json',
        //         },
        //         body: JSON.stringify({
        //             ...formData,
        //             category: updatedCategory,
        //         }),
        //     });

        //     if (response.ok) {
        //         console.log('Recipe and details added successfully');
        //         // リダイレクト処理を記述
        //     } else {
        //         console.error('Failed to add recipe and details FR');
        //     }
        // } catch (error) {
        //     console.error('Error:', error);
        // }
    };



    return (
        <div className={`${formStyles.flxcol} ${formStyles.pdg20}`}>
            {/* Example of input fields, replicate as needed */}

            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="recipe_name" className={formStyles.label}>レシピ名</label>
                    <input
                        type="text"
                        id="recipe_name"
                        placeholder="Recipe Name"
                        value={formData.recipename}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            handleInputChange('recipename', e.target.value)
                        }
                    />
                </div>
                <div>
                    <label>Category</label>
                    <select
                        value={formData.category}
                        onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                            handleInputChange('category', e.target.value)
                        }
                    >
                        {categoryOptions.map((option) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                </div>
                <ImageUploader onDrop={handleImageDrop} />
                <input
                    type="text"
                    placeholder="Image URL"
                    value={formData.imageURL}
                    onChange={
                        (e: ChangeEvent<HTMLInputElement>) =>
                            handleInputChange('imageURL', e.target.value)
                    }
                />
                <label>
                    <input
                        type="checkbox"
                        checked={formData.is_favorite}
                        onChange={
                            (e: ChangeEvent<HTMLInputElement>) =>
                                handleInputChange('is_favorite', e.target.checked)
                        }
                    />
                    Like
                </label>
                {/* <h2>手順</h2>
                {formData.steps.map((step, index) => (
                    <div key={index}>
                        <input
                            type="text"
                            placeholder={`Step ${index + 1}`}
                            value={step.step_no}
                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                handleStepChange(index, 'step_no', e.target.value)
                            }
                        />
                        <input
                            type="text"
                            placeholder="Comment"
                            value={step.comment}
                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                handleStepChange(index, 'comment', e.target.value)
                            }
                        />
                        <input
                            type="text"
                            placeholder="Photo URL"
                            value={step.photo}
                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                handleStepChange(index, 'photo', e.target.value)
                            }
                        />
                    </div>
                ))} */}
                <button type="button">下書き保存</button>
                <button type="submit">投稿</button>
            </form>
        </div>
    );
};

export default AddRecipe;




// import React, { useState, ChangeEvent, FormEvent, useCallback, useEffect } from 'react';
// import { useDropzone, FileWithPath } from 'react-dropzone';
// import formStyles from '../styles/addRecipe.module.css';

// interface Step {
//     step_no: string;
//     comment: string;
//     photo: string;
// }

// interface CategoryOption {
//     value: string;
//     label: string;
// }

// interface FormData {
//     date: string;
//     recipename: string;
//     category: string;
//     imageURL: string;
//     overview: string;
//     is_favorite: boolean;
// }

// interface ImageUploaderProps {
//     onDrop: (acceptedFiles: FileWithPath[]) => void;
// }

// const ImageUploader: React.FC<ImageUploaderProps> = ({ onDrop }) => {
//     const { getRootProps, getInputProps } = useDropzone({ onDrop });

//     return (
//         <div {...getRootProps()} className="dropzone">
//             <input {...getInputProps()} />
//             <p>画像をここにドラッグ＆ドロップするか、クリックして選択してください。</p>
//         </div>
//     );
// };

// const AddRecipe: React.FC = () => {
//     const [formData, setFormData] = useState<FormData>({
//         user_id: "",
//         recipe_name: '',
//         date: '',
//         category: [],
//         newCategory: '',
//         image_url: '',
//         favorite: false,
//         steps: [{ step_no: '', comment: '', photo: '' }],
//     });

//     const [categoryOptions, setCategoryOptions] = useState<CategoryOption[]>([]);

//     // 追加
//     useEffect(() => {
//         // サーバーサイドからカテゴリデータを取得する関数を実装
//         // 以下は仮想的な例です。実際のデータ取得処理を行ってください。
//         const fetchCategories = async () => {
//             try {
//                 const response = await fetch('api/getCategories'); // カテゴリデータを取得するAPIのエンドポイント
//                 if (response.ok) {
//                     const data = await response.json();
//                     const options: CategoryOption[] = data.map((category: string) => ({
//                         value: category,
//                         label: category,
//                     }));
//                     setCategoryOptions(options);
//                 } else {
//                     console.error('Failed to fetch categories');
//                 }
//             } catch (error) {
//                 console.error('Error:', error);
//             }
//         };

//         fetchCategories();
//     }, []);
//     //ここまで

//     const handleImageDrop = (acceptedFiles: FileWithPath[]) => {
//         // ドロップされたファイルを取得し、アップロード処理などを実装する
//         console.log(acceptedFiles);
//     };

//     const handleInputChange = <T extends keyof FormData>(field: T, value: FormData[T]) => {
//         setFormData((prevData) => ({
//             ...prevData,
//             [field]: value,
//         }));
//     };

//     const handleStepChange = (index: number, field: keyof Step, value: string) => {
//         const updatedSteps = [...formData.steps];
//         updatedSteps[index][field] = value;
//         setFormData((prevData) => ({
//             ...prevData,
//             steps: updatedSteps,
//         }));
//     };

//     const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
//         e.preventDefault();

//         try {
//             const updatedCategory = formData.newCategory;
//             // ? [...formData.category, formData.newCategory]
//             // : formData.category;

//             const response = await fetch('api/insertRecipe', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({
//                     ...formData,
//                     category: updatedCategory,
//                 }),
//             });

//             if (response.ok) {
//                 console.log('Recipe and details added successfully');
//                 // リダイレクト処理を記述
//             } else {
//                 console.error('Failed to add recipe and details FR');
//             }
//         } catch (error) {
//             console.error('Error:', error);
//         }
//     };

//     return (
//         <div className={`${formStyles.flxcol} ${formStyles.pdg20}`}>
//             <h1 className={formStyles.formHeader}>レシピを投稿する</h1>
//             <form onSubmit={handleSubmit}>
//                 <div>
//                     <input
//                         type="text"
//                         placeholder="User ID"
//                         value={formData.user_id}
//                         onChange={(e: ChangeEvent<HTMLInputElement>) =>
//                             handleInputChange('user_id', e.target.value)
//                         }
//                     />
//                 </div>
//                 <div className={formStyles.flxcol}>
//                     <label htmlFor="recipe_name" className={formStyles.label}>レシピ名</label>
//                     <input
//                         type="text"
//                         id="recipe_name"
//                         placeholder="Recipe Name"
//                         value={formData.recipe_name}
//                         onChange={(e: ChangeEvent<HTMLInputElement>) =>
//                             handleInputChange('recipe_name', e.target.value)
//                         }
//                     />
//                 </div>
//                 <div className={formStyles.flxcol}>
//                     <label htmlFor="recipe_name" className={formStyles.label}>料理を作成した日</label>
//                     <input
//                         type="date"
//                         className={formStyles.w150}
//                         value={formData.date}
//                         onChange={(e: ChangeEvent<HTMLInputElement>) =>
//                             handleInputChange('date', e.target.value)
//                         }
//                     />
//                 </div>
//                 <input
//                     type="text"
//                     placeholder="New Category"
//                     value={formData.newCategory}
//                     onChange={(e: ChangeEvent<HTMLInputElement>) =>
//                         handleInputChange('newCategory', e.target.value)
//                     }
//                 />
//                 <div>
//                     <label>Category</label>
//                     <select
//                         value={formData.category}
//                         onChange={(e: ChangeEvent<HTMLSelectElement>) =>
//                             handleInputChange('category', [e.target.value])
//                         }
//                     >
//                         {categoryOptions.map((option) => (
//                             <option key={option.value} value={option.value}>
//                                 {option.label}
//                             </option>
//                         ))}
//                     </select>
//                 </div>
//                 <ImageUploader onDrop={handleImageDrop} />
//                 <input
//                     type="text"
//                     placeholder="Image URL"
//                     value={formData.image_url}
//                     onChange={
//                         (e: ChangeEvent<HTMLInputElement>) =>
//                             handleInputChange('image_url', e.target.value)
//                     }
//                 />
//                 <label>
//                     <input
//                         type="checkbox"
//                         checked={formData.favorite}
//                         onChange={
//                             (e: ChangeEvent<HTMLInputElement>) =>
//                                 handleInputChange('favorite', e.target.checked)
//                         }
//                     />
//                     Like
//                 </label>
//                 <h2>手順</h2>
//                 {formData.steps.map((step, index) => (
//                     <div key={index}>
//                         <input
//                             type="text"
//                             placeholder={`Step ${index + 1}`}
//                             value={step.step_no}
//                             onChange={(e: ChangeEvent<HTMLInputElement>) =>
//                                 handleStepChange(index, 'step_no', e.target.value)
//                             }
//                         />
//                         <input
//                             type="text"
//                             placeholder="Comment"
//                             value={step.comment}
//                             onChange={(e: ChangeEvent<HTMLInputElement>) =>
//                                 handleStepChange(index, 'comment', e.target.value)
//                             }
//                         />
//                         <input
//                             type="text"
//                             placeholder="Photo URL"
//                             value={step.photo}
//                             onChange={(e: ChangeEvent<HTMLInputElement>) =>
//                                 handleStepChange(index, 'photo', e.target.value)
//                             }
//                         />
//                     </div>
//                 ))}
//                 <button type="button">下書き保存</button>
//                 <button type="submit">投稿</button>
//             </form>
//         </div>
//     );
// };

// export default AddRecipe;
