// pages/app.js
// The actual AI chat application
// This page is protected - only logged-in users can access

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { Send, Loader } from 'lucide-react';

export default function App() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [remainingRequests, setRemainingRequests] = useState(null);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      // Call YOUR backend API, not Claude directly
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          max_tokens: 1024,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle errors (rate limit, subscription required, etc.)
        if (response.status === 429) {
          alert(data.message || 'Rate limit exceeded');
        } else if (response.status === 403) {
          alert(data.message || 'Subscription required');
        } else {
          alert(data.message || 'Something went wrong');
        }
        setLoading(false);
        return;
      }

      // Add Claude's response to messages
      const assistantMessage = {
        role: 'assistant',
        content: data.content[0].text,
      };
      setMessages(prev => [...prev, assistantMessage]);
      setRemainingRequests(data.usage.requests_remaining);

    } catch (error) {
      console.error('Error:', error);
      alert('Failed to send message');
    }

    setLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Show loading state while checking auth
  if (!isLoaded) {
    return <div style={styles.loading}>Loading...</div>;
  }

  // Redirect if not signed in
  if (!isSignedIn) {
    return (
      <div style={styles.container}>
        <div style={styles.authMessage}>
          <h2>Please sign in to use the app</h2>
          <a href="/sign-in" style={styles.button}>Sign In</a>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>AI Chat Assistant</h1>
        <div style={styles.userInfo}>
          <span>Welcome, {user.firstName || 'User'}!</span>
          {remainingRequests !== null && (
            <span style={styles.badge}>{remainingRequests} requests left today</span>
          )}
        </div>
      </div>

      <div style={styles.chatContainer}>
        <div style={styles.messagesArea}>
          {messages.length === 0 && (
            <div style={styles.emptyState}>
              <p>Start a conversation with Claude!</p>
              <p style={styles.hint}>Try asking: "Explain quantum computing in simple terms"</p>
            </div>
          )}
          
          {messages.map((msg, idx) => (
            <div
              key={idx}
              style={{
                ...styles.message,
                ...(msg.role === 'user' ? styles.userMessage : styles.assistantMessage),
              }}
            >
              <strong>{msg.role === 'user' ? 'You' : 'Claude'}:</strong>
              <p style={styles.messageText}>{msg.content}</p>
            </div>
          ))}

          {loading && (
            <div style={styles.message}>
              <Loader size={20} style={styles.spinner} />
              <span>Claude is thinking...</span>
            </div>
          )}
        </div>

        <div style={styles.inputArea}>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            style={styles.input}
            disabled={loading}
            rows={3}
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || loading}
            style={{
              ...styles.sendButton,
              ...((!input.trim() || loading) && styles.sendButtonDisabled),
            }}
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '20px',
  },
  loading: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.2rem',
    color: '#666',
  },
  authMessage: {
    textAlign: 'center',
    padding: '60px 20px',
    background: 'white',
    borderRadius: '12px',
    maxWidth: '500px',
    margin: '100px auto',
  },
  header: {
    maxWidth: '1000px',
    margin: '0 auto 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    color: 'white',
  },
  title: {
    fontSize: '2rem',
    fontWeight: 'bold',
    margin: 0,
  },
  userInfo: {
    display: 'flex',
    gap: '15px',
    alignItems: 'center',
  },
  badge: {
    background: 'rgba(255,255,255,0.2)',
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '0.9rem',
  },
  chatContainer: {
    maxWidth: '1000px',
    margin: '0 auto',
    background: 'white',
    borderRadius: '12px',
    height: 'calc(100vh - 160px)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  messagesArea: {
    flex: 1,
    overflowY: 'auto',
    padding: '20px',
  },
  emptyState: {
    textAlign: 'center',
    color: '#999',
    padding: '60px 20px',
  },
  hint: {
    fontSize: '0.9rem',
    fontStyle: 'italic',
    marginTop: '10px',
  },
  message: {
    marginBottom: '20px',
    padding: '15px',
    borderRadius: '8px',
  },
  userMessage: {
    background: '#e3f2fd',
    marginLeft: '60px',
  },
  assistantMessage: {
    background: '#f5f5f5',
    marginRight: '60px',
  },
  messageText: {
    margin: '8px 0 0',
    lineHeight: '1.6',
    whiteSpace: 'pre-wrap',
  },
  spinner: {
    animation: 'spin 1s linear infinite',
  },
  inputArea: {
    borderTop: '1px solid #eee',
    padding: '20px',
    display: 'flex',
    gap: '10px',
  },
  input: {
    flex: 1,
    padding: '12px',
    border: '2px solid #e0e0e0',
    borderRadius: '8px',
    fontSize: '1rem',
    resize: 'none',
    fontFamily: 'inherit',
  },
  sendButton: {
    padding: '12px 24px',
    background: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    background: '#ccc',
    cursor: 'not-allowed',
  },
  button: {
    display: 'inline-block',
    padding: '12px 24px',
    background: '#667eea',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '8px',
    marginTop: '20px',
  },
};
