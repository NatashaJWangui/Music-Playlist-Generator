import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import axios from 'axios'
import { useToast } from 'vue-toastification'
import Playlist from "../Playlist.vue";

// Mock axios
vi.mock('axios')

// Mock vue-toastification
vi.mock('vue-toastification', () => ({
  useToast: vi.fn(() => ({
    info: vi.fn(),
    error: vi.fn()
  }))
}))

// Mock environment variables
vi.stubGlobal('import.meta', { env: { VITE_MUSIC_PLAYLIST_API_URL: 'https://music-playlist-generator-backend.onrender.com' } })

describe("Playlist.vue", () => {
  const mockToast = {
    info: vi.fn(),
    error: vi.fn()
  }
  
  beforeEach(() => {
    vi.clearAllMocks()
    useToast.mockReturnValue(mockToast)
    vi.useFakeTimers()
  })
  
  afterEach(() => {
    vi.useRealTimers()
  })

  it("renders the component", () => {
    const wrapper = mount(Playlist);
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find('h1').text()).toBe('Make Your Music');
    expect(wrapper.find('p').text()).toBe('Create any playlist. Just imagine it.');
    expect(wrapper.find('[data-testid="start-creating-button"]').text()).toContain('Start Creating')
  });

  it('shows sign up toast when Sign Up button is clicked', async () => {
    const wrapper = mount(Playlist)
    const signUpButton = wrapper.find('[data-testid="sign-up-button"]')
    await signUpButton.trigger('click')
    
    expect(mockToast.info).toHaveBeenCalledWith(
      'Sign up feature is coming soon! Stay tuned! ✨',
      { timeout: 3000 }
    )
  });

  it('shows sign in toast when Sign In button is clicked', async () => {
    const wrapper = mount(Playlist)
    const signInButton = wrapper.find('[data-testid="sign-in-button"]')
    await signInButton.trigger('click')
    
    expect(mockToast.info).toHaveBeenCalledWith(
      'Sign in feature is coming soon! Stay tuned! 🔐',
      { timeout: 3000 }
    )
  });

  it('opens genre popup when Start Creating button is clicked', async () => {
    const wrapper = mount(Playlist)
    await wrapper.find('[data-testid="start-creating-button"]').trigger('click')
    
    expect(wrapper.vm.showGenrePopup).toBe(true)
    expect(wrapper.vm.showStartButton).toBe(false)
    
    const popup = wrapper.find('[data-testid="genre-popup"]')
    expect(popup.exists()).toBe(true)
    expect(popup.find('h2').text()).toBe('Select a Genre')
    expect(wrapper.findAll('[data-testid="genre-button"]').length).toBe(10) // 10 genres
  });

  it('closes genre popup when close button is clicked', async () => {
    const wrapper = mount(Playlist)
    await wrapper.find('[data-testid="start-creating-button"]').trigger('click')

    expect(wrapper.vm.showGenrePopup).toBe(true)
    expect(wrapper.vm.showStartButton).toBe(false)
    
    const popup = wrapper.find('[data-testid="genre-popup"]')
    expect(popup.exists()).toBe(true)
    expect(popup.find('h2').text()).toBe('Select a Genre')
    expect(wrapper.findAll('[data-testid="genre-button"]').length).toBe(10) // 10 genres
    
    const closeButton = wrapper.find('[data-testid="close-genre-popup"]')
    await closeButton.trigger('click')
    
    expect(wrapper.vm.showGenrePopup).toBe(false)
    expect(wrapper.vm.showStartButton).toBe(true)
  });

  it('selects a genre and shows genre message', async () => {
    const wrapper = mount(Playlist)
    await wrapper.find('[data-testid="start-creating-button"]').trigger('click')
    
    expect(wrapper.vm.showGenrePopup).toBe(true)
    expect(wrapper.vm.showStartButton).toBe(false)
    await wrapper.find('[data-testid="genre-popup"]').trigger('click') // Open genre popup
    
    const genreButtons = wrapper.findAll('[data-testid="genre-button"]')
    await genreButtons[0].trigger('click') // Select first genre (Afrobeats)
    
    expect(wrapper.vm.selectedGenre).toBe('Afrobeats')
    expect(wrapper.vm.showGenrePopup).toBe(false)
    expect(wrapper.vm.showGenreMessage).toBe(true)
    expect(wrapper.vm.genreMessage).toBe('Feel the vibrant energy! Let\'s groove to Afrobeats! 💃')
    
    // Check if the message is displayed
    const message = wrapper.find('[data-testid="genre-message"]')
    expect(message.exists()).toBe(true)
    expect(message.text()).toBe('Feel the vibrant energy! Let\'s groove to Afrobeats! 💃')
  });

  it('generates playlist when Generate Playlist button is clicked', async () => {
    // Mock API response
    const mockPlaylist = {
      playlist: [
        { title: 'Test Song 1', artist: 'Test Artist 1' },
        { title: 'Test Song 2', artist: 'Test Artist 2' }
      ]
    };
    
    // Setup API mock
    axios.post.mockResolvedValue({ data: mockPlaylist });
    
    const wrapper = mount(Playlist);
    
    await wrapper.find('[data-testid="start-creating-button"]').trigger('click');
    
    const genreButtons = wrapper.findAll('[data-testid="genre-button"]');
    await genreButtons[0].trigger('click');
    
    const generateButton = wrapper.find('[data-testid="generate-playlist-button"]');
    await generateButton.trigger('click');
    
    // Wait for API call to complete
    await flushPromises();
    
    // Verify API was called correctly
    expect(axios.post).toHaveBeenCalledWith(
      `${wrapper.vm.apiUrl}/generate_song_list/`, 
      { genre: 'Afrobeats' }
    );
    
    // Wait for Vue to update the DOM
    await wrapper.vm.$nextTick();
    
    // Verify playlist is displayed
    expect(wrapper.find('[data-testid="playlist-section"]').exists()).toBe(true);
    
    // Verify playlist items
    const playlistItems = wrapper.findAll('[data-testid="playlist-item"]');
    expect(playlistItems.length).toBe(2);
    
    // Check first song details
    const firstItemTitle = wrapper.find('[data-testid="playlist-item"] [data-testid="playlist-item-title"]');
    const firstItemArtist = wrapper.find('[data-testid="playlist-item"] [data-testid="playlist-item-artist"]');
    
    expect(firstItemTitle.text()).toBe('Test Song 1');
    expect(firstItemArtist.text()).toBe('Test Artist 1');
  });

  it('shows error toast when API call fails', async () => {
    // Mock the API to reject with an error
    axios.post.mockRejectedValue(new Error('Network Error'));
    
    const wrapper = mount(Playlist);
    
    await wrapper.find('[data-testid="start-creating-button"]').trigger('click');
    
    const genreButtons = wrapper.findAll('[data-testid="genre-button"]');
    await genreButtons[0].trigger('click');
    
    const generateButton = wrapper.find('[data-testid="generate-playlist-button"]');
    await generateButton.trigger('click');
    
    // Wait for all promises to resolve
    await flushPromises();
    
    // Verify toast error was called with the correct message
    expect(mockToast.error).toHaveBeenCalledWith(
      'Failed to generate songlist. Please try again.',
      { timeout: 3000 }
    );
    
    // Verify component returned to expected state
    expect(wrapper.vm.playlist).toEqual([]);
    expect(wrapper.vm.loading).toBe(false);
  });

  it('closes playlist when close button is clicked', async () => {
    const mockPlaylist = {
      playlist: [
        { title: 'Test Song 1', artist: 'Test Artist 1' }
      ]
    }
    
    axios.post.mockResolvedValue({ data: mockPlaylist })
    
    const wrapper = mount(Playlist)
    wrapper.vm.selectedGenre = 'jazz'
    wrapper.vm.playlist = mockPlaylist.playlist
    
    await wrapper.vm.$nextTick()
    
    const closeButton = wrapper.find('[data-testid="close-playlist-button"]')
    await closeButton.trigger('click')
    
    expect(wrapper.vm.playlist).toEqual([])
    expect(wrapper.vm.showStartButton).toBe(true)
  })

});
