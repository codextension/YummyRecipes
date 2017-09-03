#!/bin/bash
cd api
nodemon --inspect app.js &
cd ../app
ionic cordova emulate android --livereload &
cd ..


