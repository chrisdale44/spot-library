# Spot Library

A Web App for mapping skateboarding spots worldwide, designed and built by myself following a serverless approach with a focus on performance and scalability.

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
- Cloudinary CDN for optimised image storage and delivery
- React-intersection-observer and Lodash chunking for lazyloading infinite-scoll image grid
- Github for Control Versioning
- Vercel for deployment and CI/CD pipeline

## Known issues

- Leaflet's pinch zoom functionality has poor performance on touchscreen devices
- Images are repeated in image-carousels
- Performance of tag filters can be optimised by pre-caching results
- No automated test coverage yet as this has been a rapidly developed prototype
