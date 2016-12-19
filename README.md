# [![Build Status](https://travis-ci.org/moodysalem/react-sync.svg)](https://travis-ci.org/moodysalem/react-sync) [![npm version](https://img.shields.io/npm/v/react-sync.svg)](https://www.npmjs.com/package/react-sync) react-sync


A declarative approach to fetching data using [HTML5 Fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)

## Status
This project has been rewritten between versions 0.5 to 0.6 to be only responsible for fetching data. A demo is available in the index.html file. It provides a simple declarative approach to retrieving data from your APIs. Manipulating the data is your responsibility, but refreshing the data from the API is as simple as changing an arbitrary unused query parameter. The source is relatively short and very easy to understand (< 100 LOC) and the UMD module is < 15kb uncompressed and unminified.

## Install
`npm install --save react-sync`

OR

`yarn add react-sync`

Alternately this project builds to a UMD module named ReactSync, so you can include a rawgit script tag in your page referencing v0.6.4 or later and look for `window.ReactSync`, e.g.: 

`<script src="https://cdn.rawgit.com/moodysalem/react-sync/ef1770eb582abe6da474134e0c663233833275e4/dist/react-sync.js" type="text/javascript"></script>`
