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
