
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.ChatWidget = {}));
})(this, (function (exports) {
    'use strict';

    let chatWidget = null;

    class ChatWidget {
        constructor(options = {}) {
            this.options = {
                apiEndpoint: '/api/chat',
                streamEndpoint: '/api/chat/stream',
                position: 'bottom-right',
                siteName: 'Support',
                welcomeMessage: 'Hi! How can we help you today?',
                ...options
            };

            this.isOpen = false;
            this.sessionId = this.generateSessionId();
            this.messages = [];
            this.elements = {};

            this.init();
        }

        generateSessionId() {
            return 'chat_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
        }

        init() {
            this.createElements();
            this.attachEventListeners();
            this.addWelcomeMessage();
        }

        createElements() {
            // Create chat button
            this.elements.button = document.createElement('button');
            this.elements.button.className = 'chat-widget-button';
            this.elements.button.innerHTML = `
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
            `;
            this.elements.button.setAttribute('aria-label', 'Open chat');

            // Create chat panel
            this.elements.panel = document.createElement('div');
            this.elements.panel.className = 'chat-widget-panel';
            this.elements.panel.setAttribute('aria-hidden', 'true');
            this.elements.panel.innerHTML = `
                <div class="chat-widget-header">
                    <div class="chat-widget-logo">
                        ${this.options.siteName.charAt(0).toUpperCase()}
                    </div>
                    <h3 class="chat-widget-title">Ask us anything</h3>
                    <button class="chat-widget-phone" aria-label="Start voice call">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                        </svg>
                    </button>
                </div>
                <div class="chat-widget-messages" aria-live="polite"></div>
                <div class="chat-widget-input-area">
                    <form class="chat-widget-input-form">
                        <textarea 
                            class="chat-widget-input" 
                            placeholder="Type your message..."
                            rows="1"
                            aria-label="Message input"
                        ></textarea>
                        <button type="submit" class="chat-widget-send" aria-label="Send message">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <line x1="22" y1="2" x2="11" y2="13"></line>
                                <polygon points="22,2 15,22 11,13 2,9 22,2"></polygon>
                            </svg>
                        </button>
                    </form>
                </div>
            `;

            // Get element references
            this.elements.messages = this.elements.panel.querySelector('.chat-widget-messages');
            this.elements.input = this.elements.panel.querySelector('.chat-widget-input');
            this.elements.form = this.elements.panel.querySelector('.chat-widget-input-form');
            this.elements.sendButton = this.elements.panel.querySelector('.chat-widget-send');
            this.elements.phoneButton = this.elements.panel.querySelector('.chat-widget-phone');

            // Append to body
            document.body.appendChild(this.elements.button);
            document.body.appendChild(this.elements.panel);
        }

        attachEventListeners() {
            // Toggle chat panel
            this.elements.button.addEventListener('click', () => this.toggleChat());

            // Handle form submission
            this.elements.form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.sendMessage();
            });

            // Handle textarea auto-resize and Enter key
            this.elements.input.addEventListener('input', () => {
                this.autoResizeTextarea();
            });

            this.elements.input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.sendMessage();
                }
            });

            // Voice call button
            this.elements.phoneButton.addEventListener('click', () => {
                this.startVoiceCall();
            });

            // Close on outside click
            document.addEventListener('click', (e) => {
                if (!this.elements.panel.contains(e.target) && 
                    !this.elements.button.contains(e.target) && 
                    this.isOpen) {
                    this.closeChat();
                }
            });

            // Escape key to close
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.isOpen) {
                    this.closeChat();
                    this.elements.button.focus();
                }
            });
        }

        toggleChat() {
            if (this.isOpen) {
                this.closeChat();
            } else {
                this.openChat();
            }
        }

        openChat() {
            this.isOpen = true;
            this.elements.panel.classList.add('open');
            this.elements.panel.setAttribute('aria-hidden', 'false');
            
            // Focus management
            setTimeout(() => {
                this.elements.input.focus();
            }, 300);
        }

        closeChat() {
            this.isOpen = false;
            this.elements.panel.classList.remove('open');
            this.elements.panel.setAttribute('aria-hidden', 'true');
        }

        addWelcomeMessage() {
            this.addMessage('assistant', this.options.welcomeMessage);
        }

        addMessage(sender, content, isTyping = false) {
            const messageElement = document.createElement('div');
            messageElement.className = `chat-widget-message ${sender}`;
            
            const avatar = sender === 'user' ? 'U' : 'A';
            const bubbleClass = isTyping ? 'chat-widget-typing' : 'chat-widget-message-bubble';
            const bubbleContent = isTyping ? this.createTypingIndicator() : content;

            messageElement.innerHTML = `
                <div class="chat-widget-message-avatar">${avatar}</div>
                <div class="${bubbleClass}">${bubbleContent}</div>
            `;

            this.elements.messages.appendChild(messageElement);
            this.scrollToBottom();

            if (!isTyping) {
                this.messages.push({ sender, content, timestamp: Date.now() });
            }

            return messageElement;
        }

        createTypingIndicator() {
            return `
                <div class="chat-widget-typing-dot"></div>
                <div class="chat-widget-typing-dot"></div>
                <div class="chat-widget-typing-dot"></div>
            `;
        }

        async sendMessage() {
            const message = this.elements.input.value.trim();
            if (!message) return;

            // Clear input and disable send button
            this.elements.input.value = '';
            this.elements.sendButton.disabled = true;
            this.autoResizeTextarea();

            // Add user message
            this.addMessage('user', message);

            // Show typing indicator
            const typingElement = this.addMessage('assistant', '', true);

            try {
                // Simulate API call - replace with actual implementation
                await this.simulateApiCall(message, typingElement);
            } catch (error) {
                console.error('Chat API Error:', error);
                typingElement.remove();
                this.addMessage('assistant', 'Sorry, I encountered an error. Please try again.');
            } finally {
                this.elements.sendButton.disabled = false;
                this.elements.input.focus();
            }
        }

        async simulateApiCall(message, typingElement) {
            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

            // Remove typing indicator
            typingElement.remove();

            // Simulate streaming response
            const responses = [
                "Thanks for your message! I'm here to help.",
                "That's a great question. Let me provide you with some information.",
                "I understand your concern. Here's what I can tell you about that.",
                "I'd be happy to assist you with that. Let me explain...",
                "That's interesting! Here's my perspective on this topic."
            ];

            const response = responses[Math.floor(Math.random() * responses.length)];
            await this.streamMessage(response);
        }

        async streamMessage(fullMessage) {
            const messageElement = this.addMessage('assistant', '');
            const bubble = messageElement.querySelector('.chat-widget-message-bubble');
            
            let currentText = '';
            const words = fullMessage.split(' ');
            
            for (let i = 0; i < words.length; i++) {
                currentText += (i > 0 ? ' ' : '') + words[i];
                bubble.textContent = currentText;
                this.scrollToBottom();
                await new Promise(resolve => setTimeout(resolve, 50 + Math.random() * 100));
            }

            // Update the message in history
            this.messages[this.messages.length - 1] = {
                sender: 'assistant',
                content: fullMessage,
                timestamp: Date.now()
            };
        }

        autoResizeTextarea() {
            const textarea = this.elements.input;
            textarea.style.height = 'auto';
            textarea.style.height = Math.min(textarea.scrollHeight, 80) + 'px';
        }

        scrollToBottom() {
            this.elements.messages.scrollTop = this.elements.messages.scrollHeight;
        }

        startVoiceCall() {
            // Placeholder for ElevenLabs integration
            console.log('Voice call initiated');
            
            // Show user feedback
            const notification = document.createElement('div');
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: var(--chat-accent);
                color: white;
                padding: 12px 20px;
                border-radius: 8px;
                font-family: var(--chat-font);
                font-size: 14px;
                z-index: 1000000;
                animation: slideInMessage 0.3s ease-out;
            `;
            notification.textContent = 'Voice call feature coming soon!';
            
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.remove();
            }, 3000);
        }

        // Public API methods
        destroy() {
            if (this.elements.button) this.elements.button.remove();
            if (this.elements.panel) this.elements.panel.remove();
            chatWidget = null;
        }

        open() {
            this.openChat();
        }

        close() {
            this.closeChat();
        }

        sendSystemMessage(message) {
            this.addMessage('assistant', message);
        }
    }

    // Global initialization function
    function initChatWidget(options) {
        if (chatWidget) {
            console.warn('Chat widget already initialized');
            return chatWidget;
        }

        chatWidget = new ChatWidget(options);
        return chatWidget;
    }

    // Export for UMD
    exports.initChatWidget = initChatWidget;
    exports.ChatWidget = ChatWidget;

    // Make available globally
    if (typeof window !== 'undefined') {
        window.initChatWidget = initChatWidget;
        window.ChatWidget = ChatWidget;
    }
}));
