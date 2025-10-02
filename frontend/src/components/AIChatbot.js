import React, { useState, useRef, useEffect } from 'react';
import '../styles/design-system.css';

const AIChatbot = ({ user, currentCourse, onClose }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      content: `Hi ${user?.firstName || 'there'}! 👋 I'm your AI learning mentor. I'm here to help you with your studies, answer questions, and guide you through your learning journey. What would you like to know?`,
      timestamp: new Date()
    }
  ]);
  
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [chatMode, setChatMode] = useState('general'); // general, course-specific, career
  
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Predefined responses for different scenarios
  const aiResponses = {
    greeting: [
      "Hello! How can I help you with your learning today?",
      "Hi there! Ready to dive into some learning? What's on your mind?",
      "Welcome back! What would you like to explore today?"
    ],
    courseHelp: [
      "I'd be happy to help you with that topic! Let me break it down for you...",
      "That's a great question! Here's what you need to know...",
      "Let me explain that concept in a simple way..."
    ],
    motivation: [
      "You're doing great! Keep up the excellent work! 🌟",
      "Remember, every expert was once a beginner. You've got this! 💪",
      "Learning is a journey, not a destination. Enjoy the process! 🚀"
    ],
    career: [
      "Based on your learning path, here are some career opportunities...",
      "Your skills are developing nicely! Here's how they apply to real jobs...",
      "Let me suggest some next steps for your career development..."
    ]
  };

  const quickActions = [
    { id: 'explain', label: '🧠 Explain Concept', action: 'explain' },
    { id: 'quiz', label: '❓ Quick Quiz', action: 'quiz' },
    { id: 'progress', label: '📊 Check Progress', action: 'progress' },
    { id: 'career', label: '💼 Career Advice', action: 'career' },
    { id: 'motivation', label: '⚡ Motivate Me', action: 'motivation' }
  ];

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (inputRef.current && !isMinimized) {
      inputRef.current.focus();
    }
  }, [isMinimized]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const generateAIResponse = (userMessage, action = null) => {
    const message = userMessage.toLowerCase();
    
    // Determine response type based on message content or action
    if (action === 'motivation' || message.includes('motivate') || message.includes('encourage')) {
      return getRandomResponse(aiResponses.motivation);
    }
    
    if (action === 'career' || message.includes('career') || message.includes('job')) {
      return getRandomResponse(aiResponses.career);
    }
    
    if (action === 'progress') {
      return `Based on your current progress, you've completed ${Math.floor(Math.random() * 70 + 10)}% of your learning path! You're doing excellent work. Keep it up! 📈`;
    }
    
    if (action === 'quiz') {
      return generateQuizQuestion();
    }
    
    if (action === 'explain' || message.includes('explain') || message.includes('what is') || message.includes('how')) {
      return getRandomResponse(aiResponses.courseHelp);
    }
    
    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
      return getRandomResponse(aiResponses.greeting);
    }
    
    // Course-specific responses
    if (currentCourse && (message.includes(currentCourse.title.toLowerCase()) || message.includes('course'))) {
      return `Great question about "${currentCourse.title}"! This course covers ${currentCourse.description}. What specific aspect would you like me to explain?`;
    }
    
    // Default intelligent response
    return generateContextualResponse(message);
  };

  const getRandomResponse = (responses) => {
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const generateQuizQuestion = () => {
    const questions = [
      "Quick quiz time! 🧠 What's the difference between let and const in JavaScript?",
      "Pop quiz! 📝 Can you explain what React hooks are used for?",
      "Challenge time! ⚡ What are the benefits of using TypeScript over JavaScript?",
      "Brain teaser! 🤔 What's the purpose of the virtual DOM in React?"
    ];
    return getRandomResponse(questions);
  };

  const generateContextualResponse = (message) => {
    // Simple keyword-based responses
    if (message.includes('javascript') || message.includes('js')) {
      return "JavaScript is a powerful programming language! Are you working on a specific JavaScript concept? I can help explain functions, objects, async programming, or any other topic.";
    }
    
    if (message.includes('react')) {
      return "React is an amazing library for building user interfaces! What aspect of React would you like to explore? Components, hooks, state management, or something else?";
    }
    
    if (message.includes('python')) {
      return "Python is fantastic for beginners and experts alike! Whether you're interested in web development, data science, or automation, I can guide you through Python concepts.";
    }
    
    if (message.includes('help') || message.includes('stuck')) {
      return "I'm here to help! 🤝 Can you tell me more about what you're working on? The more specific you are, the better I can assist you.";
    }
    
    // Default response
    return "That's an interesting question! While I'm still learning to understand everything perfectly, I'd love to help you explore this topic. Can you provide a bit more context about what you're trying to learn?";
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const aiResponse = {
        id: Date.now() + 1,
        type: 'ai',
        content: generateAIResponse(inputMessage),
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 2000);
  };

  const handleQuickAction = (action) => {
    const actionMessage = {
      id: Date.now(),
      type: 'user',
      content: `[Quick Action: ${action}]`,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, actionMessage]);
    setIsTyping(true);

    setTimeout(() => {
      const aiResponse = {
        id: Date.now() + 1,
        type: 'ai',
        content: generateAIResponse('', action),
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (isMinimized) {
    return (
      <div className="chatbot-minimized" onClick={() => setIsMinimized(false)}>
        <div className="minimized-icon">🤖</div>
        <div className="minimized-text">AI Mentor</div>
        {messages.length > 1 && (
          <div className="unread-indicator">{messages.length - 1}</div>
        )}
      </div>
    );
  }

  return (
    <div className="ai-chatbot">
      <div className="chatbot-header">
        <div className="chatbot-avatar">🤖</div>
        <div className="chatbot-info">
          <div className="chatbot-name">AI Learning Mentor</div>
          <div className="chatbot-status">
            <div className="status-indicator online"></div>
            Always here to help
          </div>
        </div>
        <div className="chatbot-controls">
          <button 
            className="control-btn"
            onClick={() => setIsMinimized(true)}
            title="Minimize"
          >
            ➖
          </button>
          <button 
            className="control-btn"
            onClick={onClose}
            title="Close"
          >
            ✕
          </button>
        </div>
      </div>

      <div className="chat-modes">
        <button 
          className={`mode-btn ${chatMode === 'general' ? 'active' : ''}`}
          onClick={() => setChatMode('general')}
        >
          💬 General
        </button>
        <button 
          className={`mode-btn ${chatMode === 'course-specific' ? 'active' : ''}`}
          onClick={() => setChatMode('course-specific')}
        >
          📚 Course Help
        </button>
        <button 
          className={`mode-btn ${chatMode === 'career' ? 'active' : ''}`}
          onClick={() => setChatMode('career')}
        >
          💼 Career
        </button>
      </div>

      <div className="chatbot-messages">
        {messages.map(message => (
          <div key={message.id} className={`message ${message.type}`}>
            <div className="message-avatar">
              {message.type === 'ai' ? '🤖' : '👤'}
            </div>
            <div className="message-content">
              <div className="message-text">{message.content}</div>
              <div className="message-time">
                {message.timestamp.toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </div>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="message ai">
            <div className="message-avatar">🤖</div>
            <div className="message-content">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <div className="quick-actions">
        {quickActions.map(action => (
          <button
            key={action.id}
            className="quick-action-btn"
            onClick={() => handleQuickAction(action.action)}
          >
            {action.label}
          </button>
        ))}
      </div>

      <div className="chatbot-input">
        <div className="input-container">
          <textarea
            ref={inputRef}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything about your learning journey..."
            className="message-input"
            rows="1"
          />
          <button 
            className="send-btn"
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isTyping}
          >
            🚀
          </button>
        </div>
        <div className="input-hint">
          Press Enter to send, Shift+Enter for new line
        </div>
      </div>
    </div>
  );
};

export default AIChatbot;
