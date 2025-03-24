import React, { useState, useRef } from "react";
import { X, Plus } from "lucide-react";
import styles from "./PhotoUploadModal.module.scss";
import Image from "next/image";
import useTranslate from "@/appPages/site/hooks/translate/translate";

interface PhotoUploadModalProps {
  onClose: () => void;
  onSend: (files: File[]) => void;
}

interface UploadBlock {
  id: number;
  size: string;
  file: File | null;
  preview: string | null;
}

const PhotoUploadModal: React.FC<PhotoUploadModalProps> = ({
  onClose,
  onSend,
}) => {
  const [selectedBlock, setSelectedBlock] = useState<number>(2);
  const [uploadBlocks, setUploadBlocks] = useState<UploadBlock[]>([
    { id: 0, size: "15x20", file: null, preview: null },
    { id: 1, size: "15x20", file: null, preview: null },
    { id: 2, size: "15x20", file: null, preview: null },
  ]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t } = useTranslate();
  
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => {
        setUploadBlocks((blocks) =>
          blocks.map((block) =>
            block.id === selectedBlock
              ? { ...block, file, preview: reader.result as string }
              : block
          )
        );
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBlockClick = (blockId: number) => {
    setSelectedBlock(blockId);
    fileInputRef.current?.click();
  };

  const handleSendClick = () => {
    const files = uploadBlocks
      .filter((block) => block.file)
      .map((block) => block.file) as File[];
    onSend(files);
    onClose();
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>
          <X size={24} />
        </button>

        <h2 className={styles.title}>
          {t("Здесь вы можете загрузить фото", "هنا يمكنك تحميل صورة", "Here you can upload a photo")}
        </h2>

        <div className={styles.uploadContainer}>
          {uploadBlocks.map((block) => (
            <div
              key={block.id}
              className={`${styles.uploadBlock} ${
                selectedBlock === block.id ? styles.selected : ""
              }`}
              onClick={() => handleBlockClick(block.id)}
            >
              {block.preview ? (
                <div className={styles.previewContainer}>
                  <Image
                    src={block.preview}
                    alt={t("Предпросмотр", "معاينة", "Preview")}
                    className={styles.preview}
                    width={150}
                    height={150}
                    style={{ objectFit: "cover" }}
                    unoptimized={true}
                  />
                </div>
              ) : (
                <>
                  <Plus className={styles.uploadIcon} size={32} />
                  <span className={styles.uploadText}>
                    {t("Загрузить фото", "تحميل صورة", "Upload photo")}
                  </span>
                  <span className={styles.sizeText}>{block.size}</span>
                </>
              )}
            </div>
          ))}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className={styles.hiddenInput}
        />

        <div className={styles.btn}>
          <button className={styles.sendButton} onClick={onClose}>
            {t("Отмена", "إلغاء", "Cancel")}
          </button>
          <button
            className={styles.sendButton}
            onClick={handleSendClick}
          >
            {t("Далее", "التالي", "Next")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PhotoUploadModal;