/*--------------------------- */
/*       レシピ投稿画面         */
/*---------------------------*/
import { NextPage } from "next";
import  React,{ useState, useEffect, useRef  } from "react";
// import Image from 'next/image';　//※new Image()とバッティングするので使用不可
import { useDropzone, FileWithPath } from 'react-dropzone';
import formStyles from '../styles/form.module.css';
import generalStyle from "../styles/generalStyle.module.css";
import Layout from "../components/postingLayout/Layout";
import flatpickr from 'flatpickr';//※追加モジュール
import 'flatpickr/dist/flatpickr.min.css';
import ImageResizer from 'react-image-file-resizer';//※追加モジュール
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { faCalendarDays } from '@fortawesome/free-solid-svg-icons'

/*--- テーブルへ出力するデータ型を定義 ---*/
interface RecipeSequences {
  relation_id: number;
  step_no: number;
  comment: string;
  photo: string;
}

interface FormData {
  relation_id: number;
  recipe_name: string;
  date: Date;
  category: string[];
  image_url: string;
  over_view: string;
  sequences: RecipeSequences[];
}

/*  */
interface CategoryOption {
  value: string;
  label: string;
}

/*--- ドロップダウンに関する型を定義 ---*/
interface ImageUploaderProps {
  onDrop: (acceptedFiles: FileWithPath[]) => void;
}

const Upload: NextPage = () => {
  /* S3に画像を格納  */
  const [image, setImage] = useState<string | null>(null);
  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    // 変数にドロップされた画像を設定、存在しない場合nullを返す。
    const file = e.dataTransfer.files[0];
    const fileName = file.name;
    const mimeType = file.type;

    // MIMEタイプがimageの場合、処理を行う。
    if (file && file.type.startsWith("image")) {
      // MIMEタイプをクエリパラメータとして追加
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/fast/get_presigned_url?file_name=${fileName}&content_type=${mimeType}`);

      const { presigned_upload_url, download_url } = await response.json();

      const result = await fetch(presigned_upload_url, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": mimeType,
        },
      });

      if (result.ok) {
        console.log("Successfully uploaded to S3.");
        setImage(download_url); // ここでダウンロードURLをセット
      } else {
        console.error("Failed to upload to S3.");
      }
    } else {
      console.error("Invalid file type. Please upload an image.");
    }
  };

  const handleDragOver = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  /* 日付の表示 */
  const [selectedDate, setSelectedDate] = useState(new Date());
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) {
      const datepicker = flatpickr(inputRef.current, {
        dateFormat: 'Y/m/d',
        onChange: selectedDates => {
          setSelectedDate(selectedDates[0]);
        },
      });

      return () => {
        datepicker.destroy();
      };
    }
  }, []);

  const formatSelectedDate = () => {
    return selectedDate.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Layout>
      <div className={`${generalStyle.flxcol} ${generalStyle.pdg20} ${formStyles.mainContainer}`}>
        <p className={formStyles.actionName}>- レシピを投稿する -</p>
        <form>
            <input
                type="text"
                placeholder="User ID"
                value=""
                className={formStyles.hidden}
            />
            <div className={generalStyle.flxcol}>
                <label htmlFor="recipe_name" className={formStyles.label}>レシピ名</label>
                <input
                    type="text"
                    id="recipe_name"
                    placeholder="Recipe Name"
                    value=""
                    className={formStyles.recipeName}
                />
            </div>
            <div className={generalStyle.flxcol}>
              <label htmlFor="category" className={formStyles.label}>カテゴリ</label>
                <input
                  type="text"
                  id="category"
                  placeholder="category"
                  value=""
                  className={formStyles.category}
                />
            </div>
            <div className={`${generalStyle.flxcol} ${formStyles.createDate}`}>
              <label htmlFor="create_date" className={formStyles.label}>作成日</label>
              <div className="isCalendar">
                <input
                    id="create_date"
                    type="text"
                    ref={inputRef}
                    value={formatSelectedDate()}
                    className={`${formStyles.inputDate}`}
                />
              </div>

            </div>
            <div onDrop={handleDrop} onDragOver={handleDragOver} style={{ border: "2px dashed black", padding: "20px" }}>
              <p>Drag & Drop an image here</p>
              {image && <img src={image} alt="Uploaded Preview" />}
            </div>
            <div className={generalStyle.flxcol}>
              <p>作成手順</p>
            </div>
        </form>
      </div>
    </Layout>
  );
};

export default Upload;
