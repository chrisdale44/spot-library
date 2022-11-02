# Terminology

Leaflet = Javascript library for interactive maps
PixiJS = A lightweight Javascript library for rendering 2D WebGL graphics that seamlessly falls back to HTML5's canvas if needed
Application = The root class for creating a Pixi application
Stage = The root Container of the Application class
DisplayObject = The base class for all objects that are rendered on the screen
DisplayList = The order in which DisplayObjects are rendered to screen. More like a tree structure
Container = General-purpose display object that holds children, including Graphics and Sprites. It also adds built-in support for advanced rendering features like masking and filtering. You can add a Container to another Container and keep going as deep as you need your rabbit hole to go
Particle Container = A simplified Container for speed. One level of children. No masks or filters. Single texture.
Overlay = An overlay class for Leaflet. Allows drawing an overlay using Pixi.js
Graphic = Primitive shapes like rectangles, circles, and lines
Sprite = The Sprite object is the base for all textured objects that are rendered to the screen. Sprites can show graphics. The Sprite class inherits from the Container class, meaning Sprites can be used as Containers
Texture = A texture stores the information that represents an image or part of an image, added to the display list via Sprites. You can directly create a texture from an image and then reuse it multiple times as Sprites. Textures made from SVGs, loaded or not, cannot be used before the file finishes processing
Loader = Responsible for loading all assets, such as images, spritesheets etc. It does not do anything clever with URLs - it just loads stuff! Behind the scenes all things are cached using promises. This means it's impossible to load an asset more than once.
Assets = A modern replacement for the old PIXI.Loader class. It is a promise-based resource management solution that will download, cache and parse your assets into something you can use. The downloads can be simultaneous and in the background, meaning faster startup times for your app, the cache ensures that you never download the same asset twice and the extensible parser system allows you to easily extend and customize the process to your needs.
Filters = A special shader that applies post-processing effects to single display objects or entire containers. Such as blur, displacement, noise. For WebGL objects only. https://github.com/pixijs/filters
Mask System = Any display object can now be masked by a Graphics object. There are three built-in types of masking: scissor masking (discard pixels outside scissor rectangle), stencil masking (discards pixels that don't overlap with th stencil), sprite mask filtering (discards pixels based on the red channel of the sprite-mask's texture)
Renderer = Draws the scene and all its contents onto a WebGL enabled canvas. The renderer is composed of systems that manage specific tasks, such as MaskSystem, FilterSystem, ShaderSystem
Shader = A shader is a piece of code that runs on the GPU, written in GLSL (OpenGL Shading Language). The benefit of GPU processing is speed due to parallelisation.
