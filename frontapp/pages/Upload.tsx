import { NextPage } from "next";
import { useState } from "react";

const Upload: NextPage = () => {
  const [image, setImage] = useState<string | null>(null);
  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    const mimeType = file.type;
    if (file && file.type.startsWith("image")) {
      // MIMEタイプをクエリパラメータとして追加
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/fast/get_presigned_url?file_name=${file.name}&content_type=${mimeType}`);
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

  return (
    <div onDrop={handleDrop} onDragOver={handleDragOver} style={{ border: "2px dashed black", padding: "20px" }}>
      <p>Drag & Drop an image here</p>
      {image && <img src={image} alt="Uploaded Preview" />}
    </div>
  );
};

export default Upload;
