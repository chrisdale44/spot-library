import React, { useState, useRef } from "react";
import axios from "axios";
import { useRecoilState } from "recoil";
import { format } from "date-fns";
import ImageGallery from "react-image-gallery";
import { mapState as mapRecoilState, popupState } from "../../../state";
import useSpotActions from "../../../state/spots/actions";
import DropZone from "../../FormComponents/DropZone";
import Tabs from "../../Tabs";
import LoadingSpinner from "../../SVGs/LoadingSpinner";
import uploadImagesToCloudinary from "./uploadImagesToCloudinary";
import { SPOT_FIELDS, IMAGES, MEDIA } from "../../../constants";
import uploadParams from "./uploadParams";
import styles from "./SpotForm.module.scss";

const SpotForm = ({ id, spot, latlng, relocatePin }) => {
  const [popup, setPopup] = useRecoilState(popupState);
  const [, setMapState] = useRecoilState(mapRecoilState);
  const { addSpot } = useSpotActions();
  const [isLoading, setIsLoading] = useState(false);
  const [acceptedSpotFiles, setAcceptedSpotFiles] = useState([]);
  const [acceptedMediaFiles, setAcceptedMediaFiles] = useState([]);
  const spotForm = useRef();

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Upload images to Cloudinary
    const generateSignatureEndpoint = `/api/cloudinary/sign`;

    // Call serverless fn to generate a hexadecimal auth signature from request params
    // Params should exclude: file, cloud_name, resource_type, api_key
    axios.post(generateSignatureEndpoint, uploadParams).then(({ data }) => {
      const payload = {
        ...SPOT_FIELDS,
        name: e.target.name.value,
        description: e.target.description.value,
        coordinates: popup.position,
      };
      let promises = [];
      const currentTime = format(Date.now(), "yyyy-MM-dd HH:mm:ss.SS");

      // upload images to cloudinary
      promises = promises.concat(
        uploadImagesToCloudinary(
          data,
          acceptedSpotFiles,
          uploadParams,
          setIsLoading,
          (cloudinaryImgData) => {
            // combine cloudinary img data with Exif data
            for (const file of acceptedSpotFiles) {
              payload.images.push({
                exif: file.exif,
                url: cloudinaryImgData.secure_url,
                created_at: currentTime,
              });
            }
          }
        )
      );

      // upload media images to cloudinary
      promises = promises.concat(
        uploadImagesToCloudinary(
          data,
          acceptedMediaFiles,
          uploadParams,
          setIsLoading,
          (cloudinaryImgData) => {
            // combine cloudinary img data with Exif data
            for (const file of acceptedMediaFiles) {
              payload.media.push({
                exif: file.exif,
                url: cloudinaryImgData.secure_url,
                created_at: currentTime,
              });
            }
          }
        )
      );

      // wait for all images to finish uploading
      Promise.all(promises)
        .then(() => {
          const apiUrl = id ? "/api/spot/update" : "/api/spot/create";
          // add spot to redis via api call
          return axios.post(apiUrl, payload);
        })
        .finally(() => {
          spotForm.current.reset();
          setAcceptedSpotFiles([]);
          setAcceptedMediaFiles([]);
          setIsLoading(false);
          setPopup(null);
          setMapState("default");
          addSpot(payload);
        })
        .catch(function (error) {
          console.error(error);
          setIsLoading(false);
        });
    });
  };

  return (
    <div className={styles.formWrapper}>
      <h3 className={styles.heading}>{id ? "Edit" : "Create new"} spot</h3>
      <form ref={spotForm} className={styles.spotForm} onSubmit={handleSubmit}>
        <input name="name" placeholder="Spot name" defaultValue={spot?.name} />
        <textarea
          name="description"
          placeholder="Description"
          defaultValue={spot?.description}
        />
        <Tabs headings={["Spot", "Media"]}>
          {[IMAGES, MEDIA].map((type, i) => {
            const acceptedFiles =
              type === MEDIA ? acceptedMediaFiles : acceptedSpotFiles;
            const setAcceptedFiles =
              type === MEDIA ? setAcceptedMediaFiles : setAcceptedSpotFiles;

            return (
              <React.Fragment key={i}>
                {spot && spot[type]?.length ? (
                  <div className={styles.galleryWrapper}>
                    <ImageGallery
                      items={spot[type].map((image) => ({
                        original: image.url,
                        originalHeight: 200,
                        loading: "lazy",
                      }))}
                      showPlayButton={false}
                      showFullscreenButton={true}
                    />
                  </div>
                ) : null}
                <DropZone
                  fileType={type}
                  acceptedFiles={acceptedFiles}
                  setAcceptedFiles={setAcceptedFiles}
                  spotLatLng={latlng}
                  relocatePin={relocatePin}
                />
              </React.Fragment>
            );
          })}
        </Tabs>
        <button disabled={isLoading} type="submit">
          {isLoading ? <LoadingSpinner size={22} /> : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default SpotForm;
