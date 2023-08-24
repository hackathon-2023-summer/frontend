import  React from "react";
import { useDropzone, FileWithPath } from 'react-dropzone';
import formStyles from '../../styles/form.module.css';

interface ImageUploaderProps {
    onDrop: (acceptedFiles: FileWithPath[]) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onDrop }) => {
    const { getRootProps, getInputProps } = useDropzone({ onDrop });

    return (
        <div {...getRootProps()} className={`${formStyles.completeDropZone}`}>
            <input {...getInputProps()} />
            <p>画像をドロップするか、クリックしてファイルを選択してください。</p>
        </div>
    );
};