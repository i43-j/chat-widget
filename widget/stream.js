
/**
 * Stream module for chat widget
 * Handles SSE and long-polling fallback
 */

export class StreamHandler {
    constructor(streamEndpoint, sessionId) {
        this.streamEndpoint = streamEndpoint;
        this.sessionId = sessionId;
        this.controller = null;
    }

    async streamMessage(message, onChunk, onComplete, onError) {
        try {
            // Try SSE first
            if (typeof EventSource !== 'undefined') {
                await this.handleSSE(message, onChunk, onComplete, onError);
            } else {
                // Fallback to long polling
                await this.handleLongPolling(message, onChunk, onComplete, onError);
            }
        } catch (error) {
            onError(error);
        }
    }

    async handleSSE(message, onChunk, onComplete, onError) {
        const url = `${this.streamEndpoint}?session=${this.sessionId}&message=${encodeURIComponent(message)}`;
        
        return new Promise((resolve, reject) => {
            const eventSource = new EventSource(url);
            let fullMessage = '';

            eventSource.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    
                    if (data.chunk) {
                        fullMessage += data.chunk;
                        onChunk(data.chunk, fullMessage);
                    }
                    
                    if (data.done) {
                        eventSource.close();
                        onComplete(fullMessage);
                        resolve();
                    }
                } catch (err) {
                    eventSource.close();
                    onError(err);
                    reject(err);
                }
            };

            eventSource.onerror = (error) => {
                eventSource.close();
                onError(error);
                reject(error);
            };

            // Cleanup after 30 seconds
            setTimeout(() => {
                eventSource.close();
                onComplete(fullMessage);
                resolve();
            }, 30000);
        });
    }

    async handleLongPolling(message, onChunk, onComplete, onError) {
        let fullMessage = '';
        let offset = 0;
        
        while (true) {
            try {
                const response = await fetch(`${this.streamEndpoint}?session=${this.sessionId}&message=${encodeURIComponent(message)}&offset=${offset}`);
                
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }
                
                const data = await response.json();
                
                if (data.chunk) {
                    fullMessage += data.chunk;
                    onChunk(data.chunk, fullMessage);
                    offset = fullMessage.length;
                }
                
                if (data.done) {
                    onComplete(fullMessage);
                    break;
                }
                
                // Wait before next poll
                await new Promise(resolve => setTimeout(resolve, 500));
                
            } catch (error) {
                onError(error);
                break;
            }
        }
    }

    abort() {
        if (this.controller) {
            this.controller.abort();
        }
    }
}
