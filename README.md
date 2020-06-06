# Today I Learned (TIL) Documentation

This repository houses a small suite of tools for the continuos development and deployment of new today I learned notes to my personal notes website - www.seanrichtil.com.

This repository handles the pipeline converting from markdown to HTML, deploying the static content, and sending invalidation requests to the CDN server upon content updating.

# Usage

`yarn docs`: Generate HTML structure from markdown files in the `til_docs` directory
`yarn serve`: Serve static HTML files locally

Pushes to this repository will deploy to www.seanrichtil.com
