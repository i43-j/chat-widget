
import { generateSessionId, detectColorScheme, detectReducedMotion } from '../utils/helpers.js';
import { ElementCreator } from './ElementCreator.js';
import { UIManager } from './UIManager.js';
import { MessageHandler } from './MessageHandler.js';
import { EventHandler } from './EventHandler.js';

export class ChatWidget {
    constructor(options = {}) {
        this.options = {
            apiEndpoint: '/api/chat',
            streamEndpoint: '/api/chat/stream',
            position: 'bottom-right',
            siteName: 'Support',
            welcomeMessage: 'Hi! How can we help you today?',
            ...options
        };

        this.sessionId = generateSessionId();
        this.init();
    }

    init() {
        detectColorScheme();
        detectReducedMotion();
        
        const elementCreator = new ElementCreator();
        this.elements = elementCreator.createElements();
        
        this.uiManager = new UIManager(this.elements);
        this.messageHandler = new MessageHandler(this.elements, this.uiManager);
        this.eventHandler = new EventHandler(
            this.elements, 
            this.uiManager, 
            this.messageHandler, 
            this.options, 
            this.sessionId
        );
        
        this.eventHandler.attachEventListeners();
        this.addWelcomeMessage();
    }

    addWelcomeMessage() {
        this.messageHandler.addMessage('assistant', this.options.welcomeMessage);
    }

    // Public API methods
    destroy() {
        if (this.elements.button) this.elements.button.remove();
        if (this.elements.panel) this.elements.panel.remove();
    }

    open() {
        this.uiManager.openChat();
    }

    close() {
        this.uiManager.closeChat();
    }

    sendSystemMessage(message) {
        this.messageHandler.addMessage('assistant', message);
    }
}
