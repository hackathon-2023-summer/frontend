import  React from "react";
import { FileWithPath } from 'react-dropzone';

export const ImageDropedAction = (acceptedFiles: FileWithPath[], setImageUrl: React.Dispatch<React.SetStateAction<string | undefined>>) => {
    if (acceptedFiles.length > 0) {
      // ドロップしたファイルのファイルパスを格納
        const file = acceptedFiles[0];
        // FileReader を使ってファイルのバイナリデータをローカルストレージに保存
        const reader = new FileReader();
        reader.onload = (event) => {
            if (event.target === null) {
                return;
            }
            const arrayBuffer = event.target.result;

            // バイナリデータを Uint8Array に変換して Blob インスタンスを生成
            const uint8Array = new Uint8Array(arrayBuffer as ArrayBuffer);
            const blob = new Blob([uint8Array]);
            // Blob インスタンスを URL 形式に変換して img 要素の src 属性に設定
            const localUrl = URL.createObjectURL(blob);
            setImageUrl(localUrl);
        };

        reader.readAsArrayBuffer(acceptedFiles[0]);
    }
};