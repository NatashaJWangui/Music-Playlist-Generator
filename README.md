# Music Playlist Generator

This project is a **Music Playlist Generator** built with **FastAPI** for the backend and **Vue.js** for the frontend. The app generates music playlists based on the genre specified by the user. It leverages **Cohere AI** for song recommendations.

## Features

- **Song Recommendations**: Using Cohere AI to generate song recommendations based on a given genre.
- **Playlist Generation**: Returns a list of 5 songs in the specified genre, with song title and artist.
- **CORS Support**: Configured to allow access from specific frontend origins (Vue.js app).

## Demo

- **Frontend**: [Music Playlist Generator (Vue.js App)](https://music-playlist-generator.netlify.app/)
- **Backend**: [Music Playlist Generator API (FastAPI)](https://music-playlist-generator-backend.onrender.com)

## Technologies

- **Backend**: FastAPI (Python)
- **Frontend**: Vue.js, Tailwind CSS
- **APIs**: Cohere AI, An AI service that uses advanced NLP models to generate song recommendations based on the genre provided by the user.
- **Environment Variables**: `.env` for storing sensitive data like API keys.

## Prerequisites

- Python 3.x
- Node.js (for Vue.js frontend)
- Cohere API Key

## Setup Instructions

### Backend Setup

1. Clone the repository:

    ```bash
    git clone https://gridirontest.com/bootcamp-cohort-5/natasha-j-wangui.git
    cd music-playlist-generator/music-backend
    ```

2. Install the required Python dependencies:

    ```bash
    pip install -r requirements.txt
    ```

3. Create a `.env` file in the `music-backend` directory and add your **Cohere API Key**:

    ```env
    COHERE_API_KEY=your_cohere_api_key_here
    ALLOWED_ORIGINS=http://localhost:5173,https://music-playlist-generator.netlify.app
    ```

4. Start the backend server using the provided script:

    ```bash
    bash start_server.sh
    ```

    The server will start running at `http://localhost:8000`.

### Frontend Setup

1. Clone the repository (if not already done):

    ```bash
    git clone https://gridirontest.com/bootcamp-cohort-5/natasha-j-wangui.git
    cd music-playlist-generator
    ```

2. Install the required Node.js dependencies:

    ```bash
    npm install
    ```

3. Start the frontend development server:

    ```bash
    npm run dev
    ```

    The frontend will be available at `http://localhost:5173`.

### Usage

- Open the frontend in your browser at `http://localhost:5173`.
- Start creating your playlist
- Input a genre in the form,
- Generate a playlist with a list of 5 songs.

## API Documentation

### POST `/generate_song_list/`

- **CORS Support**: This API endpoint is configured to allow cross-origin requests from specific frontend origins (e.g., `http://localhost:5173` for local development and `https://music-playlist-generator.netlify.app` for the deployed frontend).

**Request**:
- `genre`: (string) The genre for the playlist (e.g., "soul", "Afrobeats").

**Response**:
- Returns a JSON object with the `genre` and a list of 5 songs (title and artist) from the generated playlist.

### Example Request:

```json
{
  "genre": "soul"
}
```

### Example Response:

```json
{
  "genre": "soul",
  "playlist": [
    { "title": "Song 1", "artist": "Artist 1" },
    { "title": "Song 2", "artist": "Artist 2" },
    { "title": "Song 3", "artist": "Artist 3" },
    { "title": "Song 4", "artist": "Artist 4" },
    { "title": "Song 5", "artist": "Artist 5" }
  ]
}
```

## Development

To contribute or run tests locally, follow the steps below:

### Testing

- For testing FastAPI, use the following command:

    ```bash
    pytest
    ```

- For frontend testing, ensure Jest or your preferred testing framework is set up, run the following command:

    ```bash
    npm run test
    ```

### Environment Variables

Make sure to add your **COHERE_API_KEY** in the `.env` file. You can also configure additional environment variables like `ALLOWED_ORIGINS`.

## Roadmap

- Integrate additional music APIs for better recommendations.
- Add user authentication to save and manage personal playlists.
- Improve frontend design with more interactive features (e.g., user comments, ratings).
- Add YouTube API integration for song previews ("Currently disabled due to API issues but planned for future implementation").

## Contributing

We welcome contributions! If you'd like to contribute to this project, please fork the repository, make your changes, and submit a pull request. Ensure that all tests pass before submitting.

### Steps to contribute:

1. Fork the repository.
2. Clone your fork locally.
3. Create a new branch (`git checkout -b feature-name`).
4. Make your changes and commit them (`git commit -am 'Add new feature'`).
5. Push to your branch (`git push origin feature-name`).
6. Open a pull request to the main repository.

## Authors and Acknowledgment

- **Natasha J Wangui**: Project creator and developer.
- Special thanks to the Gridiron Bootcamp for providing this exercise.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Project Status

- Current status: **Active**
- Development is ongoing with future plans for API enhancements and additional features.

---
