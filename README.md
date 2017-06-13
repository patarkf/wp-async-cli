# Node.js WordPress Command Line Wrapper

This is a small Node.js wrapper used to asynchronously interact with the WP-CLI, which is the command line interface for WordPress.

## Introduction

The purpose of this application is to help users to write routines using the WP-CLI without needing to write commands directly on the bash. By using this application, you're also able to create business logic to interact with your WordPress instance in high level.

## Requirements

All you need here is `Node.js 8`, since we are not using Babel.

## Install

To install this application, you just have to run a `npm install` and everything will be (almost) ready for use.

## Configuration

The only necessary configuration here is to set your WordPress instance path in the `PATH` environment variable, which you can find at the `variables.env` file (make sure to rename the `variables.env.sample` into `variables.env`).

## Usage

You just have to run `npm start` and that's it. You will be ready to use and start to play around the wrapper.

## License

See the [LICENSE](https://github.com/patarkf/nodejs-wordpress-command-line-wrapper/blob/master/LICENSE) file for license rights and limitations (MIT).
