# Sebez Visual Server

![License](https://img.shields.io/badge/license-ISC-blue.svg)

## Overview

This is the backend for the Sebez Visual Art eCommerce website. It provides the necessary APIs and services to manage user authentication, product listings, and other functionalities required for the website.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Scripts](#scripts)
- [Dependencies](#dependencies)
- [License](#license)

## Installation

To install the dependencies and set up the project, follow these steps:

1. Clone the repository:
    ```bash
    git clone https://github.com/Ermi-Tekk21/sebez_visual_backend.git
    ```
2. Navigate to the project directory:
    ```bash
    cd sebez_visual_server
    ```
3. Install the dependencies:
    ```bash
    npm install
    ```

## Usage

To start the server in development mode, use the following command:

```bash
npm start

This will run the server with nodemon, automatically restarting it when changes are detected.

Scripts
test: This is a placeholder for tests. Currently, it outputs an error message.
start: Runs the server using nodemon, which watches for file changes and automatically restarts the server.
Dependencies
The project relies on the following npm packages:

bcrypt: For hashing passwords.
config: For managing configuration files.
cors: To enable Cross-Origin Resource Sharing.
dotenv: For loading environment variables from a .env file.
express: A web framework for Node.js.
joi: For data validation.
jsonwebtoken: To manage JSON Web Tokens (JWT) for authentication.
lodash: A utility library for working with arrays, objects, and other data types.
mongoose: An Object Data Modeling (ODM) library for MongoDB and Node.js.
nodemon: A utility that monitors for any changes in your source and automatically restarts the server.


