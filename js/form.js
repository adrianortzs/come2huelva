import { $, $$ } from './utils.js';
import { CONFIG } from './config.js';

export class ContactForm {
  constructor(formSelector = '.form') {
    this.form = $(formSelector);
    if (!this.form) return;
    
    this.init();
  }
  
  init() {
    this.form.addEventListener('submit', (e) => this.handleSubmit(e));
  }
  
  async handleSubmit(event) {
    event.preventDefault(); // Evita el envío del formulario
    
    const formData = this.getFormData();
    
    if (!this.validateForm(formData)) {
      this.showError('Por favor, completa todos los campos requeridos.');
      return;
    }
    
    try {
      await this.sendEmail(formData);
      this.showSuccess('¡Correo enviado exitosamente!');
      this.form.reset(); // Limpia el formulario
    } catch (error) {
      console.error('Form submission error:', error);
      this.showError('Hubo un error al enviar el correo. Por favor, inténtalo de nuevo.');
    }
  }
  
  getFormData() {
    return {
      name: $('#name')?.value || '',
      email: $('#email')?.value || '',
      phone: $('#telf')?.value || '',
      people: $('#people')?.value || '',
      message: $('#message')?.value || ''
    };
  }
  
  validateForm(data) {
    return data.name && 
           data.email && 
           data.message &&
           this.isValidEmail(data.email);
  }
  
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  
  async sendEmail(formData) {
    const controller = new AbortController(); // Cancela la solicitud si no se recibe respuesta en el tiempo configurado
    const timeoutId = setTimeout(() => controller.abort(), CONFIG.API.TIMEOUT);
    
    try {
      const response = await fetch(CONFIG.API.EMAIL_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      return await response.text();
    } catch (error) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') throw new Error('La solicitud ha superado el tiempo de espera');
      throw error;
    }
  }
  
  showSuccess(message) {
    alert(message);
  }
  
  showError(message) {
    alert(message);
  }
}

export const initForm = () => new ContactForm();
