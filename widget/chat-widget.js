
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.ChatWidget = {}));
})(this, (function (exports) {
    'use strict';

    let chatWidget = null;

    // Import the main ChatWidget class
    import('./core/ChatWidget.js').then(module => {
        const { ChatWidget } = module;

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
    });

    // Fallback exports for immediate access
    exports.initChatWidget = function(options) {
        console.warn('ChatWidget is loading...');
        return Promise.resolve().then(() => {
            return import('./core/ChatWidget.js').then(module => {
                const { ChatWidget } = module;
                if (chatWidget) {
                    console.warn('Chat widget already initialized');
                    return chatWidget;
                }
                chatWidget = new ChatWidget(options);
                return chatWidget;
            });
        });
    };
}));
