/*--------------------------- */
/*       レシピ投稿画面       */
/*--------------------------- */

import Layout from "../components/postingLayout/Layout";
import generalStyle from "../styles/generalStyle.module.css";
import formStyles from '../styles/upload.module.css';
import crypto from 'crypto';
import router from "next/router";
import CreateSteps from '../components/UploadComponents/CreateSteps';
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendarDays } from '@fortawesome/free-solid-svg-icons'
import { ImageUploader } from '../components/UploadComponents/ImageUploader';

import { withAuthCheck } from '../components/AuthCheck'
import React from "react";

//アップロードするレシピのデータ型
interface FormData {
  date: string;
  recipename: string;
  category: string;
  imageURL: string;
  overview: string;
  is_favorite: boolean;
}

//料理カテゴリの型
interface CategoryOption {
  value: string;
  label: string;
}

const Upload: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    date: router.query.date?.toString() || "",
    recipename: "",
    category: "",
    imageURL: "",
    overview: "",
    is_favorite: false,
  });
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [uploadURL, setUploadURL] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null); (null)
  const [imageType, setImageType] = useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // cookieを取得
  const getCookie = (name: string): string | undefined => {
    const value = `; ${document.cookie}`;
    const parts: string[] = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift();
  }

  //s3アップロード用のランダム文字列生成
  const generateRandomFileName = (originalName: string) => {
    const extension = originalName.split(".").pop();
    const randomString = crypto.randomBytes(4).toString('hex'); // 8文字のランダムなヘキサデシマル文字列
    return `${randomString}.${extension}`;
  };

  // Uploadページのロードで実行。カテゴリを取得
  useEffect(() => {
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/fast/categories`;
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

        if (formattedCategories.length > 0) {
          setFormData(prev => ({ ...prev, category: formattedCategories[0].value }));
        }
      })

      .catch(error => console.error('バックエンドから料理カテゴリの取得に失敗しました:', error));
  }, [formData.date]);

  //画像ファイルドロップイベント
  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image")) {
      // アップロードするファイル名をランダムにする。
      const randomFileName = generateRandomFileName(file.name);
      const newFile = new File([file], randomFileName, { type: file.type });

      const previewURL = URL.createObjectURL(newFile);
      setPreviewImage(previewURL);
      setImageFile(newFile)
      setImageType(newFile.type)

      // MIMEタイプをクエリパラメータとして追加
      const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/fast/get_presigned_url?file_name=${randomFileName}&content_type=${newFile.type}`

      //s3にアップロード・ダウンロードするurlを取得
      const response = await fetch(url);
      const { presigned_upload_url, download_url } = await response.json();

      //アップロード・ダウンロードurlを保持
      setUploadURL(presigned_upload_url)
      setFormData(prev => ({ ...prev, imageURL: download_url }));
    } else {
      console.error("ファイル形式が不正です。画像ファイルをドラッグ&ドロップして下さい。");
    }
  };

  //画像ファイルドラッグオーバーイベント　何もしない
  const handleDragOver = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleFileInputClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file && file.type.startsWith("image")) {
        // アップロードするファイル名をランダムにする。
        const randomFileName = generateRandomFileName(file.name);
        const newFile = new File([file], randomFileName, { type: file.type });

        const previewURL = URL.createObjectURL(newFile);
        setPreviewImage(previewURL);
        setImageFile(newFile)
        setImageType(newFile.type)

        // MIMEタイプをクエリパラメータとして追加
        const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/fast/get_presigned_url?file_name=${randomFileName}&content_type=${newFile.type}`

        //s3にアップロード・ダウンロードするurlを取得
        const response = await fetch(url);
        const { presigned_upload_url, download_url } = await response.json();

        //アップロード・ダウンロードurlを保持
        setUploadURL(presigned_upload_url)
        setFormData(prev => ({ ...prev, imageURL: download_url }));
      } else {
        console.error("ファイル形式が不正です。画像ファイルを選択して下さい。");
      }
    };
  }
  // プレビュー削除
  const handleDeletePreview = async (e: React.MouseEvent<HTMLButtonElement>) => {
    setPreviewImage("")
    setImageFile(null)
    setUploadURL("")
    setFormData(prev => ({ ...prev, imageURL: "" }));
  }

  // 料理カテゴリ 変更イベント
  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, category: value }));
  }

  // お気に入りスライドスイッチ イベント
  const handleSwitchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, is_favorite: event.target.checked }));
  };

  // レシピ名 入力イベント
  const handleRecipeNameText = (event: ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, recipename: event.target.value }));
  }

  // 感想 入力イベント
  const handleOverviewText = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, overview: event.target.value }));
  }

  //レシピデータ　アップロード
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {

      const token = getCookie('userToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/fast/recipes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        console.log('Recipeの投稿に成功しました。');
      } else {
        console.error('Recipeの投稿に失敗しました。');
      }

      if (uploadURL && imageType) {
        const result = await fetch(uploadURL, {
          method: "PUT",
          body: imageFile,
          headers: {
            "Content-Type": imageType,
          },
        });

        if (result.ok) {
          console.log("画像の投稿に成功しました。");
        } else {
          console.error("画像の投稿に失敗しました。");
        }
      }

    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <Layout>
      <div className={`${generalStyle.flxcol} ${generalStyle.pdg20} ${formStyles.mainContainer}`}>
        <p className={formStyles.actionName}>- レシピを投稿する -</p>
        <div className={formStyles.flexContainer}>
          <div>
            {formData.date ? (
              <p>投稿対象: {formData.date}</p>
            ) : (
              <p>Loading...</p>
            )}
          </div>
          <div className={formStyles.dragDropArea} onDrop={handleDrop} onDragOver={handleDragOver} onClick={handleFileInputClick}>
            <p>画像をドロップするか、クリックしてファイルを選択してください。</p>
            {previewImage && <img src={previewImage} style={{ maxWidth: "100%" }} />}
            <input type="file" style={{ display: 'none' }} ref={fileInputRef} onChange={handleFileInputChange} />
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          <div>
            <label className={formStyles.label}>料理のカテゴリ</label>
            <select
              value={formData.category}
              onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                handleSelectChange(e.target.value)
              }>
              {categories.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <div >
              <label htmlFor="recipename" className={formStyles.label}>レシピ名</label>
              <input
                type="text"
                id="recipename"
                placeholder="レシピ名"
                value={formData.recipename}
                onChange={handleRecipeNameText}
              />
            </div>
            <div >
              <label htmlFor="overview" className={formStyles.label}>感想</label>
              <textarea
                id="overview"
                placeholder="感想"
                value={formData.overview}
                onChange={handleOverviewText}
              />
            </div>

            <div className={formStyles.switchContainer}>
              <label className={formStyles.label}>気に入った？</label>
              <label className={formStyles.switch}>
                <input
                  className={formStyles.input}
                  type="checkbox"
                  checked={formData.is_favorite}
                  onChange={handleSwitchChange}
                />
                <span className={`${formStyles.slider} ${formStyles.round}`}></span>
              </label>
            </div>


          </div>
          <button type="button" onClick={handleDeletePreview}>プレビュー削除</button>
          <button type="submit">投稿</button>
        </form>
        <a href='/Main'>カレンダーに戻る</a>
      </div>
    </Layout>
  );
}

export const getServerSideProps = withAuthCheck();

export default Upload;



// /*--------------------------- */
// /*       レシピ投稿画面       */
// /*--------------------------- */

// import crypto from 'crypto';
// import router from "next/router";
// import { ChangeEvent, FormEvent, useEffect, useState } from "react";
// import Layout from "../components/postingLayout/Layout";
// import generalStyle from "../styles/generalStyle.module.css";
// import formStyles from '../styles/form.module.css';
// import { withAuthCheck } from '../components/AuthCheck'

// //アップロードするレシピのデータ型
// interface FormData {
//   date: string;
//   recipename: string;
//   category: string;
//   imageURL: string;
//   overview: string;
//   is_favorite: boolean;
// }

// //料理カテゴリの型
// interface CategoryOption {
//   value: string;
//   label: string;
// }

// const Upload: React.FC = () => {
//   const [formData, setFormData] = useState<FormData>({
//     date: router.query.date?.toString() || "",
//     recipename: "",
//     category: "",
//     imageURL: "",
//     overview: "",
//     is_favorite: false,
//   });
//   const [categories, setCategories] = useState<CategoryOption[]>([]);
//   const [previewImage, setPreviewImage] = useState<string | null>(null);
//   const [uploadURL, setUploadURL] = useState<string | null>(null);
//   const [imageFile, setImageFile] = useState<File | null>(null); (null)
//   const [imageType, setImageType] = useState<string | null>(null);

//   // cookieを取得
//   const getCookie = (name: string): string | undefined => {
//     const value = `; ${document.cookie}`;
//     const parts: string[] = value.split(`; ${name}=`);
//     if (parts.length === 2) return parts.pop()?.split(';').shift();
//   }

//   //s3アップロード用のランダム文字列生成
//   const generateRandomFileName = (originalName: string) => {
//     const extension = originalName.split(".").pop();
//     const randomString = crypto.randomBytes(4).toString('hex'); // 8文字のランダムなヘキサデシマル文字列
//     return `${randomString}.${extension}`;
//   };

//   // Uploadページのロードで実行。カテゴリを取得
//   useEffect(() => {
//     const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/fast/categories`;
//     const token = getCookie('userToken');
//     const headers = {
//       'accept': 'application/json',
//       'Authorization': `Bearer ${token}`
//     };

//     fetch(url, { headers })
//       .then(response => response.json())
//       .then((data) => {
//         const formattedCategories = data.map((category: any) => ({
//           value: category,
//           label: category
//         }));
//         setCategories(formattedCategories);

//         if (formattedCategories.length > 0) {
//           setFormData(prev => ({ ...prev, category: formattedCategories[0].value }));
//         }
//       })

//       .catch(error => console.error('バックエンドから料理カテゴリの取得に失敗しました:', error));
//   }, [formData.date]);

//   //画像ファイルドロップイベント
//   const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
//     e.preventDefault();
//     const file = e.dataTransfer.files[0];
//     if (file && file.type.startsWith("image")) {
//       // アップロードするファイル名をランダムにする。
//       const randomFileName = generateRandomFileName(file.name);
//       const newFile = new File([file], randomFileName, { type: file.type });

//       const previewURL = URL.createObjectURL(newFile);
//       setPreviewImage(previewURL);
//       setImageFile(newFile)
//       setImageType(newFile.type)

//       // MIMEタイプをクエリパラメータとして追加
//       const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/fast/get_presigned_url?file_name=${randomFileName}&content_type=${newFile.type}`

//       //s3にアップロード・ダウンロードするurlを取得
//       const response = await fetch(url);
//       const { presigned_upload_url, download_url } = await response.json();

//       //アップロード・ダウンロードurlを保持
//       setUploadURL(presigned_upload_url)
//       setFormData(prev => ({ ...prev, imageURL: download_url }));
//     } else {
//       console.error("ファイル形式が不正です。画像ファイルをドラッグ&ドロップして下さい。");
//     }
//   };

//   //画像ファイルドラッグオーバーイベント　何もしない
//   const handleDragOver = async (e: React.DragEvent<HTMLDivElement>) => {
//     e.preventDefault();
//   };

//   // プレビュー削除
//   const handleDeletePreview = async (e: React.MouseEvent<HTMLButtonElement>) => {
//     setPreviewImage("")
//     setImageFile(null)
//     setUploadURL("")
//     setFormData(prev => ({ ...prev, imageURL: "" }));
//   }


//   // 料理カテゴリ 変更イベント
//   const handleSelectChange = (value: string) => {
//     setFormData(prev => ({ ...prev, category: value }));
//   }

//   // お気に入りスライドスイッチ イベント
//   const handleSwitchChange = (event: ChangeEvent<HTMLInputElement>) => {
//     setFormData(prev => ({ ...prev, is_favorite: event.target.checked }));
//   };

//   // レシピ名 入力イベント
//   const handleRecipeNameText = (event: ChangeEvent<HTMLInputElement>) => {
//     setFormData(prev => ({ ...prev, recipename: event.target.value }));
//   }

//   // 感想 入力イベント
//   const handleOverviewText = (event: ChangeEvent<HTMLTextAreaElement>) => {
//     setFormData(prev => ({ ...prev, overview: event.target.value }));
//   }

//   //レシピデータ　アップロード
//   const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     try {

//       const token = getCookie('userToken');
//       const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/fast/recipes`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`
//         },
//         body: JSON.stringify(formData)
//       });

//       if (response.ok) {
//         console.log('Recipeの投稿に成功しました。');
//       } else {
//         console.error('Recipeの投稿に失敗しました。');
//       }

//       if (uploadURL && imageType) {
//         const result = await fetch(uploadURL, {
//           method: "PUT",
//           body: imageFile,
//           headers: {
//             "Content-Type": imageType,
//           },
//         });

//         if (result.ok) {
//           console.log("画像の投稿に成功しました。");
//         } else {
//           console.error("画像の投稿に失敗しました。");
//         }
//       }

//     } catch (error) {
//       console.error('Error:', error);
//     }
//   };

//   return (
//     <Layout>
//       <div className={`${generalStyle.flxcol} ${generalStyle.pdg20} ${formStyles.mainContainer}`}>
//         <p className={formStyles.actionName}>- レシピを投稿する -</p>
//         <div>
//           {formData.date ? (
//             <p>投稿対象: {formData.date}</p>
//           ) : (
//             <p>Loading...</p>
//           )}
//         </div>
//         <form onSubmit={handleSubmit}>
//           <div>
//             <label htmlFor="recipe_name" className={formStyles.label}>料理のカテゴリ</label>
//             <select
//               value={formData.category}
//               onChange={(e: ChangeEvent<HTMLSelectElement>) =>
//                 handleSelectChange(e.target.value)
//               }
//               className={formStyles.category} >
//               {categories.map((option) => (
//                 <option key={option.value} value={option.value}>
//                   {option.label}
//                 </option>
//               ))}
//             </select>
//             <div className={generalStyle.flxcol}>
//               <label htmlFor="recipename" className={formStyles.label}>レシピ名</label>
//               <input
//                 type="text"
//                 id="recipename"
//                 placeholder="レシピ名"
//                 value={formData.recipename}
//                 onChange={handleRecipeNameText}
//                 className={formStyles.recipeName}
//               />
//             </div>
//             <div className={generalStyle.flxcol}>
//               <label htmlFor="overview" className={formStyles.label}>感想</label>
//               <textarea
//                 id="overview"
//                 placeholder="感想"
//                 value={formData.overview}
//                 onChange={handleOverviewText}
//                 className={formStyles.overview}
//               />
//             </div>

//             <div className={formStyles.switchContainer}>
//               <label className={formStyles.label}>お気に入り</label>
//               <label className={formStyles.switch}>
//                 <input
//                   className={formStyles.input}
//                   type="checkbox"
//                   checked={formData.is_favorite}
//                   onChange={handleSwitchChange}
//                 />
//                 <span className={`${formStyles.slider} ${formStyles.round}`}></span>
//               </label>
//             </div>
//             <div onDrop={handleDrop} onDragOver={handleDragOver} style={{ border: "2px dashed black", padding: "20px" }}>
//               <p>Drag & Drop an image here</p>
//               {previewImage && <img src={previewImage} style={{ maxWidth: "100%" }} />}
//             </div>
//           </div>
//           <button type="button" onClick={handleDeletePreview}>プレビュー削除</button>
//           <button type="submit">投稿</button>
//         </form>
//         <a href='/Main'>カレンダーに戻る</a>
//       </div>
//     </Layout>
//   );
// }

// export const getServerSideProps = withAuthCheck();

// export default Upload;