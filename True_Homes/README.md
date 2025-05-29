# TrueHomes

TrueHomes is a MERN stack project designed to facilitate real estate management. The application allows users to list, search, and manage properties efficiently.

## Features

- **Property Listing**: Users can add new property listings with detailed descriptions and images.
- **Property Search**: Advanced search functionality to find properties based on various criteria.
- **User Authentication**: Secure user registration and login system.
- **Responsive Design**: Optimized for various devices.

## Technologies Used

- **MongoDB**: Database
- **Express.js**: Backend framework
- **React**: Frontend framework
- **Node.js**: Server environment

## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/shejsran/True-Homes.git
    cd TrueHomes
    ```

2. Install dependencies for both server and client:
    ```bash
    cd api
    npm install
    cd ../client
    npm install
    ```

3. Create a `.env` file in the `api` directory and add your environment variables:
    ```env
    MONGO_URI=your_mongodb_uri
    JWT_SECRET=your_jwt_secret
    ```

4. Run the development servers:
    ```bash
    cd api
    npm start
    cd ../client
    npm start
    ```

## Usage

- Access the client at `http://localhost:3000`
- Access the server at `http://localhost:5000`

## Contributing

1. Fork the repository
2. Create a new branch (`git checkout -b feature-branch`)
3. Make your changes
4. Commit your changes (`git commit -am 'Add new feature'`)
5. Push to the branch (`git push origin feature-branch`)
6. Create a new Pull Request

## License

This project is licensed under the MIT License.

## Acknowledgements

- [MongoDB](https://www.mongodb.com/)
- [Express](https://expressjs.com/)
- [React](https://reactjs.org/)
- [Node.js](https://nodejs.org/)
