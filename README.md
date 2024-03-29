# [Z-commerce](https://zcommerce-silk.vercel.app/)

This is an ecommerce application built with React and Spotify Web API.

## Description

The project aims to create a brand new online shopping experience by implementing a simple and interactive music player that allows users to search and play songs from Spotify. It utilizes the Spotify Web API to authenticate users and fetch song data.

## music player Features 

- Search for songs by title, artist, or album.
- Play, pause, and control the playback of songs.
- Like and unlike songs.
- Create and manage playlists.
- Add songs to existing playlists.
- Shuffle and repeat playback options.
- Display song information and album covers.
- Volume control.

## Ecommerce Features

- Shopping Cart
- Home Page
- Product page
- Product Search 
- Order history
- User Authorization

## Technologies Used

- Next JS/React
- PostgresSQL
- Supabase
- prisma
- Tailwind CSS
  

### API Intergration
- Spotify Web API: Provides access to Spotify's music catalog and user-related data.
- Stripe: Provides third party payment solution to handle users'order data and transaction
- webhooks:send http request to predefined endpoint at order complete status

## Installation

1. Clone the repository:

2. Install the dependencies:

3. Create a Spotify Developer account and set up an application to obtain the required API credentials.

   Set up environment variables:

- Create a `.env` file in the root directory of the project.
- Add the following variables to the `.env` file:

  ```
  REACT_APP_SPOTIFY_CLIENT_ID=your-client-id
  REACT_APP_SPOTIFY_REDIRECT_URI=your-redirect-uri
  ```

4. Start the development server:

5. Open your web browser and visit `http://localhost:3000` to access the application.

## Usage

- Sign in with your Spotify account to access your music library.
- Use the search bar to find songs, artists, or albums.
- Click on a song to start playing it.
- Control the playback using the play/pause, previous, and next buttons.
- Adjust the volume using the volume slider.
- Like and unlike songs by clicking on the heart icon.
- Create and manage playlists.
- Add songs to existing playlists using the plus icon.
- Enable shuffle and repeat options for playback customization.

## Contributing

Contributions are welcome! If you find any bugs or want to suggest new features, please open an issue or submit a pull request.

## License

This project is licensed under the [MIT License](https://github.com/Opengundumstyle/Zcommerce/blob/main/LICENSE.txt).



