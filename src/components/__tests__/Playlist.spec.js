import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import Playlist from "../Playlist.vue";

describe("Playlist.vue", () => {
  it("renders the component", () => {
    const wrapper = mount(Playlist);
    expect(wrapper.exists()).toBe(true);
  });
});
