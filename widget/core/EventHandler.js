
export class EventHandler {
    constructor(elements, uiManager, messageHandler, options, sessionId) {
        this.elements = elements;
        this.uiManager = uiManager;
        this.messageHandler = messageHandler;
        this.options = options;
        this.sessionId = sessionId;
        this.streamModule = null;
    }

    attachEventListeners() {
        // Toggle chat panel
        this.elements.button.addEventListener('click', () => this.uiManager.toggleChat());

        // Handle form submission
        this.elements.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.sendMessage();
        });

        // Handle textarea auto-resize and keyboard shortcuts
        this.elements.input.addEventListener('input', () => {
            this.uiManager.autoResizeTextarea();
            this.uiManager.updateSendButtonState();
        });

        this.elements.input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            } else if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault();
                this.sendMessage();
            }
        });

        // Voice call button
        this.elements.phoneButton.addEventListener('click', () => {
            this.uiManager.startVoiceCall();
        });

        // Close on outside click
        document.addEventListener('click', (e) => {
            if (!this.elements.panel.contains(e.target) && 
                !this.elements.button.contains(e.target) && 
                this.uiManager.isOpen) {
                this.uiManager.closeChat();
            }
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.uiManager.isOpen) {
                this.uiManager.closeChat();
                this.elements.button.focus();
            }
        });
    }

    async loadStreamModule() {
        if (!this.streamModule) {
            try {
                this.streamModule = await import('../stream.js');
            } catch (error) {
                console.error('Failed to load stream module:', error);
                throw error;
            }
        }
        return this.streamModule;
    }

    async sendMessage() {
        const message = this.elements.input.value.trim();
        if (!message) return;

        // Clear input and disable send button
        this.elements.input.value = '';
        this.elements.sendButton.disabled = true;
        this.uiManager.updateSendButtonState();
        this.uiManager.autoResizeTextarea();

        // Add user message
        this.messageHandler.addMessage('user', message);

        // Show typing indicator
        this.messageHandler.typingElement = this.messageHandler.addMessage('assistant', '', true);

        try {
            // Load stream module lazily
            const streamMod = await this.loadStreamModule();
            const streamHandler = new streamMod.StreamHandler(this.options.streamEndpoint, this.sessionId);

            // Simulate streaming for demo
            await this.messageHandler.simulateApiCall(message);
        } catch (error) {
            console.error('Chat API Error:', error);
            this.uiManager.showErrorToast('Something went wrong — retrying…');
            
            if (this.messageHandler.typingElement) {
                this.messageHandler.typingElement.remove();
                this.messageHandler.typingElement = null;
            }
            this.messageHandler.addMessage('assistant', 'Sorry, I encountered an error. Please try again.');
        } finally {
            this.elements.sendButton.disabled = false;
            this.elements.input.focus();
        }
    }
}
