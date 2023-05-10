import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useRecoilState } from "recoil";
import { format } from "date-fns";
import ImageGallery from "react-image-gallery";
import { MdDeleteForever } from "react-icons/md";
import { FaPlus } from "react-icons/fa";
import {
  mapState as mapRecoilState,
  popupState,
  toastState,
  tagsState,
} from "../../../state";
import useSpotActions from "../../../state/spots/actions";
import DropZone from "../../FormComponents/DropZone";
import ViewSpot from "../../Map/PopupContent/ViewSpot";
import Tabs from "../../Tabs";
import TagWithX from "../../Tag/TagWithX.js";
import ComboBox from "../../ComboBox";
import LoadingSpinner from "../../SVGs/LoadingSpinner";
import uploadImagesToCloudinary from "./uploadImagesToCloudinary";
import { SPOT_FIELDS, IMAGES, MEDIA } from "../../../constants";
import uploadParams from "./uploadParams";
import { getCloudinaryId } from "./utils";
import { getPopupClassNames, calcOffset } from "../../Map/utils";
import styles from "./SpotForm.module.scss";

// todo: can this mega-component be broken down?
const SpotForm = ({
  id,
  spot,
  latlng,
  handleExifLocationMismatch,
  scaleFactor,
}) => {
  const [popup, setPopup] = useRecoilState(popupState);
  const [, setMapState] = useRecoilState(mapRecoilState);
  const [, setToast] = useRecoilState(toastState);
  const [tags, setTags] = useRecoilState(tagsState);
  const { addSpot, updateSpot, deleteSpot } = useSpotActions();
  const [isLoading, setIsLoading] = useState(false);
  const [acceptedSpotFiles, setAcceptedSpotFiles] = useState([]);
  const [acceptedMediaFiles, setAcceptedMediaFiles] = useState([]);
  const [deletedSpotFiles, setDeletedSpotFiles] = useState([]);
  const [deletedMediaFiles, setDeletedMediaFiles] = useState([]);
  const [spotTags, setSpotTags] = useState([]);
  const [newTags, setNewTags] = useState([]);
  const spotForm = useRef();
  const imageGallery = useRef();

  useEffect(() => {
    if (spot.tags) {
      setSpotTags(
        spot.tags.map((tagId) => tags.find((tag) => tag.id === tagId))
      );
    }
  }, [spot.tags]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    let promises = [];
    const payload = {
      ...SPOT_FIELDS,
      ...spot,
      name: e.target.name.value,
      description: e.target.description.value,
      coordinates: popup.position,
      tags: spotTags.map((tag) => tag.id),
    };

    if (newTags.length) {
      promises = promises.concat(axios.post("/api/tags/create", newTags));
      setTags([...tags, ...newTags]);
    }

    if (deletedSpotFiles.length || deletedMediaFiles.length) {
      if (deletedSpotFiles.length) {
        // Delete images from cloudinary
        promises = promises.concat(
          axios.post("/api/cloudinary/delete", deletedSpotFiles)
        );

        deletedSpotFiles.forEach((cloudinaryId) => {
          payload[IMAGES] = spot[IMAGES].filter(
            (img) => img.cloudinaryId !== cloudinaryId
          );
        });
      }

      if (deletedMediaFiles.length) {
        // Delete media from cloudinary
        promises = promises.concat(
          axios.post("/api/cloudinary/delete", deletedMediaFiles)
        );

        deletedMediaFiles.forEach((cloudinaryId) => {
          payload[MEDIA] = spot[MEDIA].filter(
            (img) => img.cloudinaryId !== cloudinaryId
          );
        });
      }
    }

    if (acceptedSpotFiles.length || acceptedMediaFiles.length) {
      const generateSignatureEndpoint = `/api/cloudinary/sign`;

      // Call serverless fn to generate a hexadecimal auth signature from request params
      // Params should exclude: file, cloud_name, resource_type, api_key
      await axios
        .post(generateSignatureEndpoint, uploadParams)
        .then(({ data: signatureData }) => {
          const currentTime = format(Date.now(), "yyyy-MM-dd HH:mm:ss.SS");

          // Upload images to cloudinary
          promises = promises.concat(
            uploadImagesToCloudinary(
              signatureData,
              acceptedSpotFiles,
              uploadParams,
              setIsLoading,
              (cloudinaryImgData) => {
                // combine cloudinary img data with Exif data
                for (const file of acceptedSpotFiles) {
                  payload.images = [
                    ...payload.images,
                    {
                      exif: file.exif,
                      cloudinaryId: getCloudinaryId(
                        cloudinaryImgData.secure_url
                      ),
                      url: cloudinaryImgData.secure_url,
                      created_at: currentTime,
                    },
                  ];
                }
              }
            )
          );

          // Upload media images to cloudinary
          promises = promises.concat(
            uploadImagesToCloudinary(
              signatureData,
              acceptedMediaFiles,
              uploadParams,
              setIsLoading,
              (cloudinaryImgData) => {
                // combine cloudinary img data with Exif data
                for (const file of acceptedMediaFiles) {
                  payload.media = [
                    ...payload.media,
                    {
                      exif: file.exif,
                      cloudinaryId: getCloudinaryId(
                        cloudinaryImgData.secure_url
                      ),
                      url: cloudinaryImgData.secure_url,
                      created_at: currentTime,
                    },
                  ];
                }
              }
            )
          );
        });
    }

    // Wait for all files to finish uploading/deleting
    Promise.all(promises)
      .then(() => {
        const apiUrl = id ? "/api/spot/update" : "/api/spot/create";
        // add spot to redis via api call
        return axios.post(apiUrl, payload);
      })
      .then((res) => {
        if (!id) {
          payload.id = res.data.id;
        }
      })
      .finally(() => {
        spotForm.current.reset();
        setAcceptedSpotFiles([]);
        setAcceptedMediaFiles([]);
        setIsLoading(false);
        setMapState(null);
        setToast({ type: "success", message: "Spot saved successfully" });
        setPopup({
          props: {
            offset: [0, calcOffset(scaleFactor)],
            className: getPopupClassNames(payload),
          },
          position: payload.coordinates,
          content: <ViewSpot spot={payload} scaleFactor={scaleFactor} />,
        });
        if (!id) {
          addSpot(payload);
        } else {
          updateSpot(payload);
        }
      })
      .catch((error) => {
        console.error(error);
        setIsLoading(false);
        setToast({ type: "error", message: "Spot save failed" });
      });
  };

  const handleDeleteFile = (spot, type) => {
    const { cloudinaryId } = spot[type][imageGallery.current.getCurrentIndex()];
    if (!cloudinaryId) {
      setToast({
        type: "warning",
        message: "Cloudinary ID unknown, delete image manually",
      });
      return;
    }

    if (type === IMAGES) {
      setDeletedSpotFiles((deletedSpotFiles) => {
        return [...deletedSpotFiles, cloudinaryId];
      });
    } else if (type === MEDIA) {
      setDeletedMediaFiles((deletedMediaFiles) => [
        ...deletedMediaFiles,
        cloudinaryId,
      ]);
    }
  };

  const handleDeleteSpot = () => {
    console.log(id);
    // todo: open dialog

    // delete images and media from cloudinary
    const imagesToDelete = spot.images.map(({ url }) => getCloudinaryId(url));
    const mediaToDelete = spot.media.map(({ url }) => getCloudinaryId(url));
    if (imagesToDelete.length || mediaToDelete.length) {
      axios.post("/api/cloudinary/delete", [
        ...imagesToDelete,
        ...mediaToDelete,
      ]);
    }

    // delete spot from redis
    axios
      .post("/api/spot/delete", { id })
      .then(() => {
        setPopup(null);
        deleteSpot(id);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleRemoveTag = (e, tagId) => {
    e.stopPropagation();
    setSpotTags((prevSpotTags) =>
      [...prevSpotTags].filter(({ id }) => id !== tagId)
    );
    if (newTags.find(({ id }) => id === tagId)) {
      setNewTags((prevNewTags) =>
        [...prevNewTags].filter(({ id }) => id !== tagId)
      );
    }
    // todo: clear unused tags from redis
  };

  const handleTagSelection = (tagId) => {
    setSpotTags((prevSpotTags) => [...prevSpotTags, tagId]);
  };

  const handleAddTag = (value) => {
    if (!value) return;
    if (newTags.find(({ name }) => name === value)) return;

    const existingTag = tags.find(({ name }) => name === value);

    if (existingTag) {
      if (spotTags.find(({ id }) => id === existingTag.id)) return;
      setSpotTags((prevSpotTags) => [...prevSpotTags, existingTag.id]);
    } else {
      const nextId =
        (tags.length ? tags[tags.length - 1].id + 1 : 0) + newTags.length;
      const newTag = { id: nextId, name: value };
      setSpotTags((prevSpotTags) => [...prevSpotTags, newTag]);
      setNewTags((prevNewTags) => [...prevNewTags, newTag]);
    }
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
            const deletedFiles =
              type === MEDIA ? deletedMediaFiles : deletedSpotFiles;

            return (
              <React.Fragment key={i}>
                {spot && spot[type]?.length ? (
                  <div className={styles.galleryWrapper}>
                    <ImageGallery
                      ref={imageGallery}
                      items={spot[type].reduce((acc, image) => {
                        // filter files which have been deleted
                        if (deletedFiles.includes(image.cloudinaryId)) {
                          return acc;
                        }

                        return [
                          ...acc,
                          {
                            original: image.url,
                            originalHeight: 200,
                            loading: "lazy",
                            cloudinaryId: image.cloudinaryId,
                          },
                        ];
                      }, [])}
                      showPlayButton={false}
                      showFullscreenButton={false}
                      renderCustomControls={() => (
                        <button
                          type="button"
                          className={styles.removeFileButton}
                          onClick={() => {
                            handleDeleteFile(spot, type);
                          }}
                        >
                          <MdDeleteForever />
                        </button>
                      )}
                    />
                  </div>
                ) : null}
                <DropZone
                  fileType={type}
                  acceptedFiles={acceptedFiles}
                  setAcceptedFiles={setAcceptedFiles}
                  spotLatLng={latlng}
                  handleExifLocationMismatch={handleExifLocationMismatch}
                />
              </React.Fragment>
            );
          })}
        </Tabs>

        {spotTags.length ? (
          <div className={styles.tagsWrapper}>
            {spotTags.map((tag, i) => {
              return <TagWithX key={i} tag={tag} onDelete={handleRemoveTag} />;
            })}
          </div>
        ) : null}
        <ComboBox
          allOptions={tags}
          onSelection={handleTagSelection}
          submitIcon={<FaPlus />}
          onSubmit={handleAddTag}
          placeholder="Add tag"
        />

        <div className={styles.buttonWrapper}>
          {id && (
            <button
              disabled={isLoading}
              type="button"
              className={styles.deleteSpot}
              onClick={handleDeleteSpot}
            >
              <MdDeleteForever size={22} />
            </button>
          )}
          <button
            disabled={isLoading}
            type="submit"
            className={styles.saveSpot}
          >
            {isLoading ? <LoadingSpinner size={22} /> : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
};

SpotForm.defaultProps = {
  spot: {},
};

export default SpotForm;
