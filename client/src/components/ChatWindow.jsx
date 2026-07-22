import React, { useState } from 'react';
import './ChatWindow.css';

export default function ChatWindow() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userText = input;
    setInput(''); // Clear input box immediately

    // 1. Optimistic Update: Add user message to UI immediately
    const userMessage = { id: Date.now(), role: 'user', content: userText };
    setMessages((prev) => [...prev, userMessage]);

    setLoading(true);

    try {
      // 2. Fetch call to your Express backend
      const response = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: 1, // Using fixed conversation 1 for now
          message: userText,
        }),
      });

      if (!response.ok) throw new Error('Failed to send message');

      const data = await response.json(); // Returns saved assistant row from DB

      // 3. Add returned Assistant message to UI state
      setMessages((prev) => [...prev, data]);
    } catch (err) {
      console.error('Chat error:', err);
      setMessages((prev) => [
        ...prev,
        { id: Date.now(), role: 'assistant', content: '❌ Error connecting to server.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-container">
      {/* Header */}
      <header className="chat-header">
        <h2>AI Companion</h2>
        <span className="status-indicator">Online</span>
      </header>

      {/* Message List */}
      <div className="messages-list">
        {messages.length === 0 && (
          <div className="empty-state">No messages yet. Say hello!</div>
        )}
        {messages.map((msg) => (
          <div key={msg.id} className={`message-bubble ${msg.role}`}>
            <strong>{msg.role === 'user' ? 'You' : 'AI'}:</strong> {msg.content}
          </div>
        ))}
        {loading && (
          <div className="message-bubble assistant loading-bubble">
            <em>AI is thinking...</em>
          </div>
        )}
      </div>

      {/* Input Box & Send Button */}
      <form onSubmit={handleSend} className="input-form">
        <input
          type="text"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
        />
        <button type="submit" disabled={loading || !input.trim()}>
          {loading ? 'Sending...' : 'Send'}
        </button>
      </form>
    </div>
  );
}