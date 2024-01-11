# Spot Library

Spot Library is a personal project I have undertaken to fill a gap in the skateboarding community of mapping skateboarding spots around the globe in an easily searchable and filterable interface, with the ability to view existing, or share new, photos and videos of tricks done at each spot.

Spot Library has been built using a modern tech stack with scalability and performance in mind. As the solo developer of the project I have been responsible for each phase of the software development lifecycle from design and UX, to development, testing and deployment.

## Tech stack

- React (with React Hooks) for reusable reactive components
- Javascipt with ESLint and Prettier for clean scripting
- CSS Modules with SASS for scoped component styling
- React-icons for SVG based icons
- Recoil for atomic state management
- NextJS for pre-rendering pages (Static Site Generation) and API routes
- Redis as a primary NoSQL database, hosted by Aiven
- Axios for promise-based API requests
- LeafletJS with OpenStreetMaps for OpenSource map layer
- PixiJS for WebGL powered markers layer
- Leaflet-pixi-overlay with custom middleware for syncing map and markers layer
- React-image-gallery for mobile-friendly image carousels
- React-dropzone for handling image upload form element
- Exifr for extracting location data from uploaded images
- React-intersection-observer and Lodash chunking for lazyloading infinite-scoll image grid
- Cloudinary CDN for optimised image storage and delivery
- Github for Control Versioning
- Vercel for deployment and CI/CD pipeline

## Known issues/bugs

- Leaflet's pinch zoom functionality has poor performance on touchscreen devices
- Images are repeated in image-carousels
- Performance of tag filters can be optimised by pre-caching results
- No test coverage or type definitions yet as this has been a rapidly developed prototype

## Future developments

- User Account sign-up and login
- Integration with Instagram for adding images and video clips to each spot
- Filter spots by range

## Working demo

https://spot-library.vercel.app/

### Scalability demo (5000 spots)

http://demo-spot-library.vercel.app/
