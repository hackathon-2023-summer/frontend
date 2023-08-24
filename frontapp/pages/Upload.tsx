/*--------------------------- */
/*       レシピ投稿画面         */
/*---------------------------*/
import { NextPage } from "next";
import  React,{ useState, useEffect, useRef, ChangeEvent } from "react";
// import Image from 'next/image';　//※new Image()とバッティングするので使用不可
import { FileWithPath } from 'react-dropzone';
import formStyles from '../styles/form.module.css';
import generalStyle from "../styles/generalStyle.module.css";
import Layout from "../components/postingLayout/Layout";
// import flatpickr from 'flatpickr';//※モジュールアンインストール
// import 'flatpickr/dist/flatpickr.min.css';//※モジュールアンインストール
import ImageResizer from 'react-image-file-resizer';//※追加モジュール
import DatePicker, { registerLocale } from "react-datepicker";//※追加モジュール
import 'react-datepicker/dist/react-datepicker.css';
import sanitizeHtml from 'sanitize-html';//※追加モジュール
import ja from 'date-fns/locale/ja';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendarDays } from '@fortawesome/free-solid-svg-icons'
// 外部コンポーネントの読み込み
import CreateSteps from '../components/UploadComponents/CreateSteps';
import { ImageUploader } from '../components/UploadComponents/ImageUploader';
// 外部関数の読み込み
import { ImageDropedAction } from '../functions/UploadFunctions/ImageDoropedAction';


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
  date: string;
  category: string[];
  image_url: string;
  over_view: string;
  sequences: RecipeSequences[];
}

const Upload: NextPage = () => {
const [imageUrl, setImageUrl] = useState<string>();
const [isDisplayImage, setIsDisplayImage] = useState(false);

const handleImageDrop = (acceptedFiles: FileWithPath[]) => {
  ImageDropedAction(acceptedFiles, setImageUrl);
};

useEffect(() => {
  const cookie = document.cookie;
  console.log("Current cookies:", cookie);
}, []);

/* imageUrlがセットされた場合に、画像を表示するよう制御 */
useEffect(() => {
  if (imageUrl) {
    setIsDisplayImage(true);
  }
}, [imageUrl]);

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
  //

  /* 日付の表示 */
  const Today = new Date();
  const [date, setDate] = React.useState(Today);
  registerLocale('ja', ja);

  const [inputText, setInputText] = useState('');

  const handleInputChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(event.target.value);
  };

  const sanitizedHtml = sanitizeHtml(inputText.replace(/\n/g, '<br>'));

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
            <div className={`${generalStyle.flxrow}`}>
              <div className={generalStyle.flxcol}>
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
                <div className={generalStyle.flxrow}>
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
                </div>
                <div className={`${generalStyle.flxcol} ${formStyles.createDate}`}>
                  <div className={formStyles.dateFormBox}>
                  <p className={formStyles.label}>作成日</p>
                    <DatePicker
                      dateFormat="yyyy/MM/dd"
                      locale='ja'
                      selected={date}
                      className={formStyles.pickerInput}
                      onChange={selectedDate => {setDate(selectedDate || Today)}}
                    />
                    <FontAwesomeIcon icon={faCalendarDays} className={formStyles.calendarPicker}/>
                  </div>
                </div>
              </div>
              <div className={formStyles.compImgBox}>
                <p className={formStyles.completeImageTitle}>完成画像</p>
                <ImageUploader onDrop={handleImageDrop} />
                { isDisplayImage && imageUrl && <img src={imageUrl} alt="Uploaded Preview" className={formStyles.completeImg}/>}
              </div>
            </div>
            <div>
                <p>概要</p>
                <textarea value={inputText} onChange={handleInputChange} />
                <div dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />
            </div>
            <div className={`${generalStyle.flxcol}`}>
              <p className={formStyles.procedureTitle}>作成手順</p>
              <div id="procedures">
                <CreateSteps />
              </div>
            </div>
        </form>
      </div>
    </Layout>
  );
};

export default Upload;
