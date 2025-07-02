
export class UIManager {
    constructor(elements) {
        this.elements = elements;
        this.isOpen = false;
        this.hasUnreadMessages = false;
        this.errorToast = null;
    }

    setUnreadBadge(show) {
        this.hasUnreadMessages = show;
        this.elements.button.classList.toggle('cbw-has-unread', show);
    }

    openChat() {
        this.isOpen = true;
        this.elements.panel.classList.add('cbw-open', 'cbw-opening');
        this.elements.panel.classList.remove('cbw-closing');
        this.elements.panel.setAttribute('aria-hidden', 'false');
        
        // Clear unread badge when opening
        this.setUnreadBadge(false);
        
        // Focus management
        setTimeout(() => {
            this.elements.input.focus();
            this.elements.panel.classList.remove('cbw-opening');
        }, 200);
    }

    closeChat() {
        this.elements.panel.classList.add('cbw-closing');
        this.elements.panel.classList.remove('cbw-opening');
        
        setTimeout(() => {
            this.isOpen = false;
            this.elements.panel.classList.remove('cbw-open', 'cbw-closing');
            this.elements.panel.setAttribute('aria-hidden', 'true');
        }, 200);
    }

    toggleChat() {
        if (this.isOpen) {
            this.closeChat();
        } else {
            this.openChat();
        }
    }

    updateSendButtonState() {
        const hasContent = this.elements.input.value.trim().length > 0;
        this.elements.sendButton.classList.toggle('cbw-active', hasContent);
    }

    autoResizeTextarea() {
        const textarea = this.elements.input;
        textarea.style.height = 'auto';
        textarea.style.height = Math.min(textarea.scrollHeight, 80) + 'px';
    }

    scrollToBottom() {
        this.elements.messages.scrollTop = this.elements.messages.scrollHeight;
    }

    showErrorToast(message) {
        if (this.errorToast) {
            this.errorToast.remove();
        }

        this.errorToast = document.createElement('div');
        this.errorToast.className = 'cbw-error-toast';
        this.errorToast.textContent = message;
        
        this.elements.panel.appendChild(this.errorToast);
        
        // Show toast
        setTimeout(() => {
            this.errorToast.classList.add('cbw-show');
        }, 100);

        // Auto-hide after 4 seconds
        setTimeout(() => {
            if (this.errorToast) {
                this.errorToast.classList.remove('cbw-show');
                setTimeout(() => {
                    if (this.errorToast) {
                        this.errorToast.remove();
                        this.errorToast = null;
                    }
                }, 300);
            }
        }, 4000);
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
            background: var(--cbw-accent);
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            font-family: var(--cbw-font);
            font-size: 14px;
            z-index: 1000000;
            animation: cbw-slideInMessage 0.3s ease-out;
        `;
        notification.textContent = 'Voice call feature coming soon!';
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}
