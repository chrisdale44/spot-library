import React, { useState, useEffect } from "react";
import { useRecoilState } from "recoil";
import { useDropzone } from "react-dropzone";
import { MdDeleteForever } from "react-icons/md";
import { toastState } from "../../../state";
import { parseBytes, parseError } from "./helpers";
import { extractExifData } from "./exif";
import { bytesInMb } from "./constants";
import styles from "./DropZone.module.scss";

const DropZone = ({
  name,
  acceptedFiles,
  setAcceptedFiles,
  fileType,
  spotLatLng,
  handleExifLocationMismatch,
}) => {
  const [, setToast] = useRecoilState(toastState);
  const [rejectedFiles, setRejectedFiles] = useState([]);
  const maxFileSize = 5 * bytesInMb; // 3MB
  const minFileSize = 1000;

  const handleNoLocationDataFound = () => {
    setToast({ type: "warning", message: "No location data found" });
  };

  const onDropAccepted = async (droppedFiles) => {
    if (!droppedFiles.length) {
      return;
    }

    const uniqueFiles = [...rejectedFiles];
    for (const file of droppedFiles) {
      if (!uniqueFiles.includes((f) => f.path === file.path)) {
        const newFile = await extractExifData({
          file,
          fileType,
          spotLatLng,
          handleExifLocationMismatch,
          handleNoLocationDataFound,
        });
        uniqueFiles.push(newFile);
      }
    }

    setAcceptedFiles(uniqueFiles);
  };

  const onDropRejected = (droppedFiles) => {
    if (!droppedFiles.length) {
      return;
    }

    const uniqueFiles = [...rejectedFiles];
    droppedFiles.forEach((reject) => {
      if (!uniqueFiles.includes((file) => file.path === reject.file.path)) {
        uniqueFiles.push(reject);
      }
    });

    setRejectedFiles(uniqueFiles);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDropAccepted,
    onDropRejected,
    minSize: minFileSize,
    maxSize: maxFileSize,
    accept: {
      "image/*": [".jpeg", ".png"],
    },
  });

  const handleRemoveFile = (e, filePath) => {
    e.stopPropagation();
    setAcceptedFiles(acceptedFiles.filter((file) => file.path !== filePath));
  };

  const handleDismissRejectedFile = (e, filePath) => {
    e.stopPropagation();
    setRejectedFiles(
      rejectedFiles.filter((reject) => reject.file.path !== filePath)
    );
  };

  useEffect(() => {
    // Make sure to revoke the data uris to avoid memory leaks, will run on unmount
    return () =>
      acceptedFiles.forEach((file) => URL.revokeObjectURL(file.preview));
  }, []);

  return (
    <>
      <div className={styles.dropZone} {...getRootProps()}>
        <input name={name} {...getInputProps()} />
        <label htmlFor={name}>
          {`Drag 'n' drop ${fileType} here, or click to select`}
        </label>
      </div>

      <aside>
        {acceptedFiles?.length ? (
          <ul className={styles.filesList}>
            {acceptedFiles.map(({ path, size, preview }, i) => (
              <li className={styles.fileItem} key={i}>
                <img
                  src={preview}
                  className={styles.previewImg}
                  // Revoke data uri after image is loaded
                  onLoad={() => {
                    URL.revokeObjectURL(preview);
                  }}
                />
                {path} ({parseBytes(size)})
                <button
                  className={styles.removeFileButton}
                  onClick={(e) => handleRemoveFile(e, path)}
                >
                  <MdDeleteForever />
                </button>
              </li>
            ))}
          </ul>
        ) : null}

        {rejectedFiles.length ? (
          <ul className={styles.filesList}>
            {rejectedFiles.map(({ file, errors }, i) => (
              <li className={styles.fileItem} key={i}>
                <div>
                  {file.path} ({parseBytes(file.size)})
                  <ul>
                    {errors.map((err) => (
                      <li key={err.code}>
                        {parseError(err.message, minFileSize, maxFileSize)}
                      </li>
                    ))}
                  </ul>
                </div>
                <button
                  className={styles.removeFileButton}
                  onClick={(e) => handleDismissRejectedFile(e, file.path)}
                >
                  <MdDeleteForever />
                </button>
              </li>
            ))}
          </ul>
        ) : null}
      </aside>
    </>
  );
};

export default DropZone;
