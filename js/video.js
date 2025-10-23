import { $ } from './utils.js';

export class VideoPlayer {
  constructor() {
    this.video = $('#hero-video');
    this.overlay = $('#video-overlay');
    this.playButton = $('#play-button');
    
    if (!this.video || !this.overlay || !this.playButton) {
      console.warn('Video elements not found');
      return;
    }
    
    this.init();
  }
  
  init() {
    this.setupEventListeners();
  }
  
  setupEventListeners() {
    // Click en el botón de play
    this.playButton.addEventListener('click', () => this.playVideo());
    
    // Click en el overlay (área completa)
    this.overlay.addEventListener('click', () => this.playVideo());
    
    // Cuando el video empieza a reproducir
    this.video.addEventListener('play', () => this.hideOverlay());
    
    // Cuando el video se pausa
    this.video.addEventListener('pause', () => this.showOverlay());
    
    // Cuando el video termina
    this.video.addEventListener('ended', () => this.showOverlay());
    
    // Tecla Enter o Espacio en el botón
    this.playButton.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.playVideo();
      }
    });
  }
  
  playVideo() {
    try {
      this.video.play();
    } catch (error) {
      console.error('Error playing video:', error);
      // Mostrar controles nativos
      this.video.controls = true;
      this.hideOverlay();
    }
  }
  
  hideOverlay() {
    this.overlay.classList.add('hidden');
    this.video.controls = true; // Mostrar controles nativos
  }
  
  showOverlay() {
    this.overlay.classList.remove('hidden');
    this.video.controls = false; // Ocultar controles nativos
  }
  
  destroy() {
    // Limpiar event listeners si es necesario
    this.video.removeEventListener('play', this.hideOverlay);
    this.video.removeEventListener('pause', this.showOverlay);
    this.video.removeEventListener('ended', this.showOverlay);
  }
}

export const initVideoPlayer = () => new VideoPlayer();
