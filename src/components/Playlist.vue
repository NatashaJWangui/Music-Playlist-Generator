<script setup>
import { ref } from "vue";
import axios from "axios";
import { useToast } from "vue-toastification";
import { onMounted } from "vue";

// Initialize toast
const toast = useToast();

const apiUrl = import.meta.env.VITE_MUSIC_PLAYLIST_API_URL;

// Reactive variables
const selectedGenre = ref("");
const genres = ["Afrobeats", "Hip Hop", "jazz", "latin", "opera", "pop rock", "pop", "Reggae", "rnb", "soul"];
const playlist = ref([]);
const showGenrePopup = ref(false);
const showStartButton = ref(true);
const showGenreMessage = ref(false);
const genreMessage = ref("");
const loading = ref(false); // Loading state
const loadingText = ref("Generating Playlist");


const genreMessages = {
  Afrobeats: "Feel the vibrant energy! Let's groove to Afrobeats! 💃",
  "Hip Hop": "Get ready to vibe with the latest beats and bars! 🎤",
  jazz: "Smooth and classy! Time to enjoy a jazzy vibe! 🎷",
  latin: "Spicy and bold! Let’s turn up the Latin heat! 🔥",
  opera: "A grand selection! Prepare for a majestic experience! 🎭",
  "pop rock": "High energy, good vibes! Let’s rock this playlist! 🎸",
  pop: "Catchy and fun! Let’s make your playlist pop! 🎉",
  Reggae: "Laid-back and feel-good! Let’s catch the Reggae vibes! 🌿",
  rnb: "Smooth and sultry! Let’s get into the rhythm of R&B! 🎶",
  soul: "Deep and rich! Let’s get lost in the groove of soul! 🎺",
};

// For animated loading dots
let loadingInterval = null;

// Function to start loading animation
const startLoadingAnimation = () => {
  let dots = "";
  loadingInterval = setInterval(() => {
    dots = dots.length < 3 ? dots + "." : "";
    loadingText.value = `Generating Playlist${dots}`;
  }, 500);
};

// Function to stop loading animation
const stopLoadingAnimation = () => {
  clearInterval(loadingInterval);
  loadingText.value = "Generating Playlist";
};

// Function to generate a playlist with songs
const generateSonglist = async () => {
  if (!selectedGenre.value) return;

  loading.value = true; // Set loading to true before starting the request
  startLoadingAnimation();

  try {
    const response = await axios.post(`${apiUrl}/generate_song_list/`, {
      genre: selectedGenre.value,
    });

    playlist.value = response.data.playlist || [];
    showGenreMessage.value = false;
    showStartButton.value = false;
  } catch (error) {
    console.error("Error fetching playlist:", error);
    playlist.value = [];

    // Show error toast
    toast.error("Failed to generate songlist. Please try again.", {
      timeout: 3000,
    });
  } finally {
    loading.value = false; // Set loading to false after the request completes
    stopLoadingAnimation(); // Stop animated dots
  }
};

// Function to open genre selection popup
const openGenrePopup = () => {
  showGenrePopup.value = true;
  showStartButton.value = false;
  playlist.value = [];
  selectedGenre.value = "";
  showGenreMessage.value = false;
};

// Function to close genre popup
const closeGenrePopup = () => {
  showGenrePopup.value = false;
  showStartButton.value = true;
};

// Function to close the playlist and show start button again
const closePlaylist = () => {
  playlist.value = [];
  showStartButton.value = true;
};

// Function to select genre and close popup
const selectGenre = (genre) => {
  selectedGenre.value = genre;
  showGenrePopup.value = false;
  showGenreMessage.value = true;
  genreMessage.value = genreMessages[genre];
};

// Function to show toast when Sign Up is clicked
const showSignUpToast = () => {
  toast.info("Sign up feature is coming soon! Stay tuned! ✨", {
    timeout: 3000,
  });
};

// Function to show toast when Sign In is clicked
const showSignInToast = () => {
  toast.info("Sign in feature is coming soon! Stay tuned! 🔐", {
    timeout: 3000,
  });
};
</script>

<template>
  <div class="min-h-screen flex flex-col items-center text-white p-6 w-full bg-transparent relative overflow-hidden">
    <!-- Navbar (Fixed with Solid Background) -->
    <nav class="w-full flex justify-between items-center px-6 py-4 bg-transparent fixed top-0 left-0 right-0 z-50">
      <img src="/mylogoblack.png" alt="My Logo" class="h-18 ml-2">
      <div class="hidden md:flex space-x-4">
        <button class="text-white hover:text-pink-400 bg-black !bg-black" @click="showSignUpToast">Sign Up</button>
        <button class="text-white bg-gradient-to-br from-black via-pink-500 to-black" @click="showSignInToast">Sign In</button>
      </div>
      <div class="md:hidden">
        <button class="text-white bg-gradient-to-br from-black via-pink-500 to-black" @click="showSignInToast">Sign In</button>
      </div>
    </nav>

    <!-- Main Content (Starts Below Navbar) -->
    <div class="w-full max-w-4xl flex flex-col items-center text-center bg-transparent p-8 rounded-3xl min-h-[600px] gap-10 pt-[120px] lg:pt-[200px]">
      <h1 class="text-5xl font-bold text-pink-200 mt-6">Make Your Music</h1>
      <p class="text-2xl text-gray-300">Create any playlist. Just imagine it.</p>

      <!-- Start Creating Button -->
      <div class="relative mt-6 w-full flex justify-center items-center lg:-ml-10">
        <button
          v-if="showStartButton"
          @click="openGenrePopup"
          class="relative px-8 py-4 bg-gradient-to-br from-black via-pink-500 to-black text-white font-semibold rounded-full shadow-lg hover:bg-pink-800 transition duration-300 overflow-hidden group"
        >
          <span class="relative z-10 text-lg">🎶 Start Creating</span>
        </button>
      </div>

      <!-- Genre Selection Popup -->
      <div v-if="showGenrePopup" class="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gradient-to-br from-black via-pink-500 to-black p-6 rounded-xl shadow-lg text-center w-11/12 max-w-md z-50">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-2xl font-bold text-white">Select a Genre</h2>
          <button @click="closeGenrePopup" class="text-gray-200 hover:text-pink-400 !bg-black bg-black text-2xl">&times;</button>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <button v-for="genre in genres" :key="genre" @click="selectGenre(genre)" class="px-4 py-2 hover:text-pink-400 bg-black !bg-black text-white rounded-xl">
            {{ genre }}
          </button>
        </div>
      </div>

      <!-- Genre Message Section -->
      <p v-if="showGenreMessage" class="text-xl font-semibold text-pink-300 mt-10 md:mt-8">{{ genreMessage }}</p>
      <button v-if="showGenreMessage" @click="generateSonglist" :disabled="loading" class="mt-4 px-6 py-3 bg-gradient-to-br from-black via-pink-500 to-black text-white">
        <span v-if="!loading" class="transition-opacity duration-300">Generate Playlist</span>
        <span v-else class="text-xl text-pink-300 mt-4 animate-pulse transition-opacity duration-300">Generating Playlist<span class="dot">...</span></span>
      </button>

      <!-- Songlist Section -->
      <div v-if="playlist.length" class="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl bg-gradient-to-br from-black via-pink-500 to-black text-center p-6 sm:p-10 rounded-3xl shadow-xl z-50">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-2xl sm:text-3xl font-semibold text-center">Your generated playlist for <span class="capitalize">{{ selectedGenre }}</span></h2>
          <button @click="closePlaylist" class="text-gray-200 hover:text-pink-400 !bg-black bg-black text-2xl">&times;</button>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <div v-for="(song, index) in playlist" :key="index" class="px-4 py-2 bg-pink-700 hover:text-pink-300 p-4 sm:p-6 rounded-xl shadow-lg w-full">
            <div>
              <p class="text-lg sm:text-xl font-medium break-words">{{ song.title }}</p>
              <p class="text-gray-400 text-md sm:text-lg break-words">{{ song.artist }}</p>
            </div>
            🎵
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
