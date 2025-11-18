import { $ as e } from "./utils.js";

export class VideoPlayer {
  constructor() {
    this.video = e("#hero-video");
    this.overlay = e("#video-overlay");
    this.playButton = e("#play-button");
    if (this.video && this.overlay && this.playButton) {
      this.init();
    } else {
      console.warn("Video elements not found");
    }
  }

  init() {
    this.setupEventListeners();
  }

  setupEventListeners() {
    this.playButton.addEventListener("click", () => this.playVideo());
    this.overlay.addEventListener("click", () => this.playVideo());
    this.video.addEventListener("play", () => this.hideOverlay());
    this.video.addEventListener("pause", () => this.showOverlay());
    this.video.addEventListener("ended", () => this.showOverlay());
    this.playButton.addEventListener("keydown", (e) => {
      if (e.key !== "Enter" && e.key !== " ") return;
      e.preventDefault();
      this.playVideo();
    });
  }

  playVideo() {
    try {
      this.video.play();
    } catch (e) {
      console.error("Error playing video:", e);
      this.video.controls = true;
      this.hideOverlay();
    }
  }

  hideOverlay() {
    this.overlay.classList.add("hidden");
    this.video.controls = true;
    this.video.classList.add("playing");
  }

  showOverlay() {
    this.overlay.classList.remove("hidden");
    this.video.controls = false;
    this.video.classList.remove("playing");
  }

  destroy() {
    this.video.removeEventListener("play", this.hideOverlay);
    this.video.removeEventListener("pause", this.showOverlay);
    this.video.removeEventListener("ended", this.showOverlay);
  }
}

export const initVideoPlayer = () => new VideoPlayer;
