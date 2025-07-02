
export class MessageHandler {
    constructor(elements, uiManager) {
        this.elements = elements;
        this.uiManager = uiManager;
        this.messages = [];
        this.typingElement = null;
    }

    addMessage(sender, content, isTyping = false) {
        const messageElement = document.createElement('div');
        messageElement.className = `cbw-chat-widget-message cbw-${sender}`;
        
        const avatar = sender === 'user' ? 'U' : 'A';
        const bubbleClass = isTyping ? 'cbw-chat-widget-typing' : 'cbw-chat-widget-message-bubble';
        const bubbleContent = isTyping ? this.createTypingIndicator() : content;

        messageElement.innerHTML = `
            <div class="cbw-chat-widget-message-avatar cbw-theme-transition">${avatar}</div>
            <div class="${bubbleClass} cbw-theme-transition">${bubbleContent}</div>
        `;

        this.elements.messages.appendChild(messageElement);
        this.uiManager.scrollToBottom();

        if (!isTyping) {
            this.messages.push({ sender, content, timestamp: Date.now() });
            
            // Show unread badge if panel is closed and it's an assistant message
            if (!this.uiManager.isOpen && sender === 'assistant' && this.messages.length > 1) {
                this.uiManager.setUnreadBadge(true);
            }
        }

        return messageElement;
    }

    createTypingIndicator() {
        return `
            <div class="cbw-chat-widget-typing-dot"></div>
            <div class="cbw-chat-widget-typing-dot"></div>
            <div class="cbw-chat-widget-typing-dot"></div>
        `;
    }

    async simulateApiCall(message) {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

        // Remove typing indicator
        if (this.typingElement) {
            this.typingElement.remove();
            this.typingElement = null;
        }

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
        const bubble = messageElement.querySelector('.cbw-chat-widget-message-bubble');
        
        let currentText = '';
        const words = fullMessage.split(' ');
        
        for (let i = 0; i < words.length; i++) {
            currentText += (i > 0 ? ' ' : '') + words[i];
            bubble.textContent = currentText;
            this.uiManager.scrollToBottom();
            await new Promise(resolve => setTimeout(resolve, 50 + Math.random() * 100));
        }

        // Update the message in history
        this.messages[this.messages.length - 1] = {
            sender: 'assistant',
            content: fullMessage,
            timestamp: Date.now()
        };
    }
}
