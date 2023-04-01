const uploadParams = {
  folder: "spot-mapper",
  // Do not eagerly generate thumbnail transformations as we do not need thumbs for all images
  // uploaded. Thumbs generated on-the-fly are stored as derived assets in the same way as eager
  // transformations and done on an as-needed basis, reducing number of transformations overall
  // eager: THUMB_TRANSFORMATION,
  // eager_async: true,
};

export default uploadParams;
