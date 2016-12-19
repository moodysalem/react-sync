# [![Build Status](https://travis-ci.org/moodysalem/react-sync.svg)](https://travis-ci.org/moodysalem/react-sync) [![npm version](https://img.shields.io/npm/v/react-sync.svg)](https://www.npmjs.com/package/react-sync) react-sync


A declarative approach to fetching data using [HTML5 Fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)

## Status
This project has been rewritten between versions 0.5 to 0.6 to be only responsible for fetching data. A demo is available in the [index.html](https://github.com/moodysalem/react-sync/blob/gh-pages/index.html) file.

## Purpose
`react-sync` provides a single higher order component used for retrieving data from your APIs. Manipulating and rendering the data is your responsibility, but refreshing the data from the API is as simple as changing a query parameter.

## Size
The source is relatively short and very easy to understand (< 100 LOC) and the UMD module is < 15kb uncompressed and unminified.

## API
See [props.jsx](https://github.com/moodysalem/react-sync/blob/gh-pages/src/props.jsx) for an annotated description of the props accepted by this component

## Install
`npm install --save react-sync`

OR

`yarn add react-sync`

Alternately this project builds to a UMD module named ReactSync, so you can include a rawgit script tag in your page e.g. v0.6.4: 

`<script src="https://cdn.rawgit.com/moodysalem/react-sync/ef1770eb582abe6da474134e0c663233833275e4/dist/react-sync.js" type="text/javascript"></script>`

## Usage
If you are using npm, simply `import ReactSync from 'react-sync';`

If you have included the script as a tag on the page and are not using webpack, then you should look for `window.ReactSync`
