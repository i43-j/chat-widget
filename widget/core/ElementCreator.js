
export class ElementCreator {
    createElements() {
        const elements = {};

        // Create chat button
        elements.button = document.createElement('button');
        elements.button.className = 'cbw-chat-widget-button cbw-theme-transition';
        elements.button.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
        `;
        elements.button.setAttribute('aria-label', 'Open chat');

        // Create chat panel
        elements.panel = document.createElement('div');
        elements.panel.className = 'cbw-chat-widget-panel cbw-theme-transition';
        elements.panel.setAttribute('aria-hidden', 'true');
        elements.panel.setAttribute('role', 'dialog');
        elements.panel.setAttribute('aria-modal', 'true');
        elements.panel.innerHTML = `
            <div class="cbw-chat-widget-header">
                <h3 class="cbw-chat-widget-title">Ask us anything</h3>
                <button class="cbw-chat-widget-phone" aria-label="Start voice call">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                    </svg>
                </button>
            </div>
            <div class="cbw-chat-widget-messages cbw-theme-transition" aria-live="polite"></div>
            <div class="cbw-chat-widget-input-area">
                <form class="cbw-chat-widget-input-form">
                    <textarea 
                        class="cbw-chat-widget-input cbw-theme-transition" 
                        placeholder="Type your message..."
                        rows="1"
                        aria-label="Message input"
                    ></textarea>
                    <button type="submit" class="cbw-chat-widget-send" aria-label="Send message">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="22" y1="2" x2="11" y2="13"></line>
                            <polygon points="22,2 15,22 11,13 2,9 22,2"></polygon>
                        </svg>
                    </button>
                </form>
            </div>
        `;

        // Get element references
        elements.messages = elements.panel.querySelector('.cbw-chat-widget-messages');
        elements.input = elements.panel.querySelector('.cbw-chat-widget-input');
        elements.form = elements.panel.querySelector('.cbw-chat-widget-input-form');
        elements.sendButton = elements.panel.querySelector('.cbw-chat-widget-send');
        elements.phoneButton = elements.panel.querySelector('.cbw-chat-widget-phone');

        // Append to body
        document.body.appendChild(elements.button);
        document.body.appendChild(elements.panel);

        return elements;
    }
}
