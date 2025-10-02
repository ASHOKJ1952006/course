import React, { useState, useEffect, useRef } from 'react';
import * as api from '../services/api';

const AIRecommendations = ({ user, courses, onNotification }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [aiInsights, setAiInsights] = useState(null);
  const [selectedRecommendation, setSelectedRecommendation] = useState(null);
  const [learningGoals, setLearningGoals] = useState([]);
  const [careerPath, setCareerPath] = useState(null);
  const [skillGaps, setSkillGaps] = useState([]);
  const [marketTrends, setMarketTrends] = useState([]);
  const [personalityType, setPersonalityType] = useState(null);
  const [learningStyle, setLearningStyle] = useState(null);
  const [aiChat, setAiChat] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const chatRef = useRef(null);

  useEffect(() => {
    initializeAIRecommendations();
  }, [user]);

  const initializeAIRecommendations = async () => {
    try {
      setLoading(true);
      setIsAnalyzing(true);

      // Simulate AI analysis
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Generate AI insights
      const insights = generateAIInsights();
      setAiInsights(insights);

      // Generate recommendations
      const recs = generateSmartRecommendations();
      setRecommendations(recs);

      // Generate career analysis
      const career = generateCareerPath();
      setCareerPath(career);

      // Generate skill gap analysis
      const gaps = generateSkillGaps();
      setSkillGaps(gaps);

      // Generate market trends
      const trends = generateMarketTrends();
      setMarketTrends(trends);

      // Determine learning style
      const style = determineLearningStyle();
      setLearningStyle(style);

      onNotification('AI analysis complete! Your personalized recommendations are ready.', 'success');

    } catch (error) {
      console.error('AI analysis failed:', error);
      onNotification('AI analysis failed. Showing general recommendations.', 'error');
    } finally {
      setLoading(false);
      setIsAnalyzing(false);
    }
  };

  const generateAIInsights = () => {
    return {
      learningVelocity: Math.floor(Math.random() * 40) + 60, // 60-100%
      skillProgression: Math.floor(Math.random() * 30) + 70, // 70-100%
      engagementLevel: Math.floor(Math.random() * 20) + 80, // 80-100%
      recommendationAccuracy: Math.floor(Math.random() * 15) + 85, // 85-100%
      nextMilestone: 'Complete 3 more courses to reach Advanced level',
      aiConfidence: Math.floor(Math.random() * 10) + 90, // 90-100%
      learningPattern: 'Consistent evening learner with high retention',
      optimalStudyTime: '7:00 PM - 9:00 PM',
      preferredDifficulty: 'Progressive challenge seeker'
    };
  };

  const generateSmartRecommendations = () => {
    const smartRecs = [
      {
        id: 'ai-1',
        title: 'Advanced Neural Networks with TensorFlow',
        instructor: 'Dr. Andrew Ng',
        category: 'AI/ML',
        level: 'Advanced',
        duration: 45,
        rating: 4.9,
        price: 199.99,
        aiScore: 98,
        reasons: [
          'Matches your ML learning trajectory',
          'Builds on your Python expertise',
          'High demand skill in your target role',
          'Optimal difficulty progression'
        ],
        futureValue: 'High',
        marketDemand: 'Extremely High',
        salaryImpact: '+$25,000',
        completionPrediction: '87%',
        thumbnail: '/api/placeholder/300/200',
        aiTags: ['Trending', 'Career Boost', 'High ROI']
      },
      {
        id: 'ai-2',
        title: 'Quantum Computing Fundamentals',
        instructor: 'Dr. Sarah Chen',
        category: 'Quantum Computing',
        level: 'Intermediate',
        duration: 30,
        rating: 4.8,
        price: 149.99,
        aiScore: 95,
        reasons: [
          'Future-proofing your career',
          'Emerging technology leader',
          'Limited competition in field',
          'Perfect timing for entry'
        ],
        futureValue: 'Extremely High',
        marketDemand: 'Emerging',
        salaryImpact: '+$40,000',
        completionPrediction: '92%',
        thumbnail: '/api/placeholder/300/200',
        aiTags: ['Future Tech', 'First Mover', 'Quantum Leap']
      },
      {
        id: 'ai-3',
        title: 'Metaverse Development with Unity',
        instructor: 'Marcus Rodriguez',
        category: 'VR/AR',
        level: 'Intermediate',
        duration: 35,
        rating: 4.7,
        price: 179.99,
        aiScore: 93,
        reasons: [
          'Aligns with metaverse trends',
          'Combines your 3D and coding skills',
          'High creativity satisfaction',
          'Growing market opportunity'
        ],
        futureValue: 'Very High',
        marketDemand: 'High',
        salaryImpact: '+$20,000',
        completionPrediction: '89%',
        thumbnail: '/api/placeholder/300/200',
        aiTags: ['Metaverse', 'Creative', 'Immersive']
      }
    ];

    return smartRecs;
  };

  const generateCareerPath = () => {
    return {
      currentRole: 'Software Developer',
      targetRole: 'AI/ML Engineer',
      progressPercentage: 65,
      timeToTarget: '8-12 months',
      nextSteps: [
        'Complete Advanced ML course',
        'Build 2 ML projects',
        'Get TensorFlow certification',
        'Contribute to open source ML projects'
      ],
      salaryProgression: {
        current: '$85,000',
        target: '$130,000',
        increase: '+$45,000'
      },
      skillsNeeded: ['Deep Learning', 'MLOps', 'Computer Vision', 'NLP'],
      marketOutlook: 'Excellent - 35% growth expected'
    };
  };

  const generateSkillGaps = () => {
    return [
      {
        skill: 'Deep Learning',
        currentLevel: 40,
        targetLevel: 80,
        priority: 'High',
        timeToAcquire: '3-4 months',
        recommendedCourses: ['Neural Networks Mastery', 'Deep Learning Specialization']
      },
      {
        skill: 'MLOps',
        currentLevel: 20,
        targetLevel: 70,
        priority: 'Medium',
        timeToAcquire: '2-3 months',
        recommendedCourses: ['MLOps Pipeline', 'Production ML Systems']
      },
      {
        skill: 'Computer Vision',
        currentLevel: 30,
        targetLevel: 75,
        priority: 'High',
        timeToAcquire: '4-5 months',
        recommendedCourses: ['OpenCV Mastery', 'Advanced Computer Vision']
      }
    ];
  };

  const generateMarketTrends = () => {
    return [
      {
        technology: 'AI/Machine Learning',
        growth: '+45%',
        demand: 'Extremely High',
        avgSalary: '$140,000',
        jobOpenings: '125,000+',
        trend: 'up'
      },
      {
        technology: 'Quantum Computing',
        growth: '+200%',
        demand: 'Emerging',
        avgSalary: '$180,000',
        jobOpenings: '2,500+',
        trend: 'up'
      },
      {
        technology: 'Metaverse/VR',
        growth: '+80%',
        demand: 'High',
        avgSalary: '$120,000',
        jobOpenings: '45,000+',
        trend: 'up'
      }
    ];
  };

  const determineLearningStyle = () => {
    return {
      primaryStyle: 'Visual-Kinesthetic',
      characteristics: [
        'Learns best through interactive demos',
        'Prefers hands-on projects',
        'Visual learner with practical application',
        'Benefits from step-by-step tutorials'
      ],
      recommendations: [
        'Choose courses with lots of practical exercises',
        'Look for video-based content',
        'Prioritize project-based learning',
        'Use visualization tools and diagrams'
      ]
    };
  };

  const handleAIChat = async (message) => {
    if (!message.trim()) return;

    const newMessage = {
      id: Date.now(),
      type: 'user',
      content: message,
      timestamp: new Date()
    };

    setAiChat(prev => [...prev, newMessage]);
    setChatInput('');

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(message);
      setAiChat(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const generateAIResponse = (userMessage) => {
    const responses = {
      career: "Based on your learning pattern and current skills, I recommend focusing on AI/ML specialization. The market demand is extremely high, and your mathematical background gives you a strong foundation.",
      courses: "I've analyzed thousands of learning paths similar to yours. The Neural Networks course has a 98% AI match score for your profile and could increase your salary potential by $25,000.",
      skills: "Your skill gap analysis shows Deep Learning as the highest priority. I recommend starting with the fundamentals and building 2-3 projects to demonstrate practical knowledge.",
      time: "Based on your learning velocity of 85%, you could complete the recommended learning path in 8-12 months with 10-15 hours of study per week.",
      default: "I'm here to help optimize your learning journey! Ask me about career paths, course recommendations, skill development, or market trends."
    };

    let responseContent = responses.default;
    const lowerMessage = userMessage.toLowerCase();

    if (lowerMessage.includes('career') || lowerMessage.includes('job')) {
      responseContent = responses.career;
    } else if (lowerMessage.includes('course') || lowerMessage.includes('recommend')) {
      responseContent = responses.courses;
    } else if (lowerMessage.includes('skill') || lowerMessage.includes('learn')) {
      responseContent = responses.skills;
    } else if (lowerMessage.includes('time') || lowerMessage.includes('how long')) {
      responseContent = responses.time;
    }

    return {
      id: Date.now() + 1,
      type: 'ai',
      content: responseContent,
      timestamp: new Date()
    };
  };

  if (loading) {
    return (
      <div className="ai-recommendations-loading">
        <div className="ai-analysis-animation">
          <div className="brain-icon">🧠</div>
          <div className="analysis-text">
            <h2>AI is analyzing your learning profile...</h2>
            <div className="analysis-steps">
              <div className="step active">📊 Analyzing learning patterns</div>
              <div className="step active">🎯 Identifying skill gaps</div>
              <div className="step active">📈 Calculating market trends</div>
              <div className="step">🚀 Generating recommendations</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="ai-recommendations-page">
      {/* AI Insights Dashboard */}
      <section className="ai-insights-section">
        <div className="section-header">
          <h1>🤖 AI-Powered Learning Insights</h1>
          <p>Personalized recommendations powered by advanced machine learning</p>
        </div>

        <div className="insights-grid">
          <div className="insight-card primary">
            <div className="insight-icon">🎯</div>
            <div className="insight-content">
              <h3>AI Confidence Score</h3>
              <div className="score">{aiInsights?.aiConfidence}%</div>
              <p>Recommendation accuracy based on your profile</p>
            </div>
          </div>

          <div className="insight-card">
            <div className="insight-icon">⚡</div>
            <div className="insight-content">
              <h3>Learning Velocity</h3>
              <div className="score">{aiInsights?.learningVelocity}%</div>
              <p>Faster than 78% of similar learners</p>
            </div>
          </div>

          <div className="insight-card">
            <div className="insight-icon">📈</div>
            <div className="insight-content">
              <h3>Skill Progression</h3>
              <div className="score">{aiInsights?.skillProgression}%</div>
              <p>On track for advanced certification</p>
            </div>
          </div>

          <div className="insight-card">
            <div className="insight-icon">🔥</div>
            <div className="insight-content">
              <h3>Engagement Level</h3>
              <div className="score">{aiInsights?.engagementLevel}%</div>
              <p>Highly engaged learner profile</p>
            </div>
          </div>
        </div>
      </section>

      {/* Smart Recommendations */}
      <section className="smart-recommendations-section">
        <div className="section-header">
          <h2>🎯 AI-Curated Course Recommendations</h2>
          <p>Courses selected specifically for your learning journey</p>
        </div>

        <div className="recommendations-grid">
          {recommendations.map(course => (
            <div key={course.id} className="smart-recommendation-card">
              <div className="ai-score-badge">
                <span className="score">{course.aiScore}</span>
                <span className="label">AI Match</span>
              </div>

              <div className="course-image">
                <img src={course.thumbnail} alt={course.title} />
                <div className="ai-tags">
                  {course.aiTags.map(tag => (
                    <span key={tag} className="ai-tag">{tag}</span>
                  ))}
                </div>
              </div>

              <div className="course-content">
                <h3 className="course-title">{course.title}</h3>
                <p className="course-instructor">by {course.instructor}</p>
                
                <div className="course-meta">
                  <span className="rating">⭐ {course.rating}</span>
                  <span className="duration">🕒 {course.duration}h</span>
                  <span className="level">{course.level}</span>
                </div>

                <div className="ai-insights">
                  <div className="insight-row">
                    <span className="label">Completion Prediction:</span>
                    <span className="value">{course.completionPrediction}</span>
                  </div>
                  <div className="insight-row">
                    <span className="label">Salary Impact:</span>
                    <span className="value positive">{course.salaryImpact}</span>
                  </div>
                  <div className="insight-row">
                    <span className="label">Market Demand:</span>
                    <span className="value">{course.marketDemand}</span>
                  </div>
                </div>

                <div className="ai-reasons">
                  <h4>Why AI recommends this:</h4>
                  <ul>
                    {course.reasons.map((reason, index) => (
                      <li key={index}>{reason}</li>
                    ))}
                  </ul>
                </div>

                <div className="course-actions">
                  <button className="enroll-button">
                    Enroll Now - ${course.price}
                  </button>
                  <button 
                    className="details-button"
                    onClick={() => setSelectedRecommendation(course)}
                  >
                    AI Analysis
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Career Path Analysis */}
      <section className="career-path-section">
        <div className="section-header">
          <h2>🚀 AI Career Path Analysis</h2>
          <p>Your personalized roadmap to career success</p>
        </div>

        <div className="career-path-card">
          <div className="career-progression">
            <div className="current-role">
              <div className="role-icon">👨‍💻</div>
              <div className="role-info">
                <h3>{careerPath?.currentRole}</h3>
                <p>Current Position</p>
                <span className="salary">{careerPath?.salaryProgression.current}</span>
              </div>
            </div>

            <div className="progression-arrow">
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ width: `${careerPath?.progressPercentage}%` }}
                ></div>
              </div>
              <span className="progress-text">{careerPath?.progressPercentage}% Complete</span>
            </div>

            <div className="target-role">
              <div className="role-icon">🎯</div>
              <div className="role-info">
                <h3>{careerPath?.targetRole}</h3>
                <p>Target Position</p>
                <span className="salary">{careerPath?.salaryProgression.target}</span>
              </div>
            </div>
          </div>

          <div className="career-details">
            <div className="detail-section">
              <h4>Next Steps</h4>
              <ul className="next-steps">
                {careerPath?.nextSteps.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ul>
            </div>

            <div className="detail-section">
              <h4>Timeline</h4>
              <p>{careerPath?.timeToTarget}</p>
              <p className="market-outlook">{careerPath?.marketOutlook}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Skill Gap Analysis */}
      <section className="skill-gaps-section">
        <div className="section-header">
          <h2>📊 AI Skill Gap Analysis</h2>
          <p>Identify and bridge your skill gaps with precision</p>
        </div>

        <div className="skill-gaps-grid">
          {skillGaps.map((gap, index) => (
            <div key={index} className="skill-gap-card">
              <div className="skill-header">
                <h3>{gap.skill}</h3>
                <span className={`priority ${gap.priority.toLowerCase()}`}>
                  {gap.priority} Priority
                </span>
              </div>

              <div className="skill-progress">
                <div className="progress-labels">
                  <span>Current</span>
                  <span>Target</span>
                </div>
                <div className="progress-bars">
                  <div className="current-bar">
                    <div 
                      className="fill current"
                      style={{ width: `${gap.currentLevel}%` }}
                    ></div>
                  </div>
                  <div className="target-bar">
                    <div 
                      className="fill target"
                      style={{ width: `${gap.targetLevel}%` }}
                    ></div>
                  </div>
                </div>
                <div className="progress-values">
                  <span>{gap.currentLevel}%</span>
                  <span>{gap.targetLevel}%</span>
                </div>
              </div>

              <div className="skill-details">
                <p><strong>Time to acquire:</strong> {gap.timeToAcquire}</p>
                <div className="recommended-courses">
                  <h4>Recommended courses:</h4>
                  <ul>
                    {gap.recommendedCourses.map((course, idx) => (
                      <li key={idx}>{course}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* AI Chat Assistant */}
      <section className="ai-chat-section">
        <div className="section-header">
          <h2>💬 Ask Your AI Learning Advisor</h2>
          <p>Get instant answers about your learning journey</p>
        </div>

        <div className="ai-chat-container">
          <div className="chat-messages" ref={chatRef}>
            {aiChat.length === 0 && (
              <div className="chat-welcome">
                <div className="ai-avatar">🤖</div>
                <div className="welcome-message">
                  <p>Hi! I'm your AI Learning Advisor. Ask me anything about:</p>
                  <ul>
                    <li>Career path recommendations</li>
                    <li>Course suggestions</li>
                    <li>Skill development strategies</li>
                    <li>Market trends and opportunities</li>
                  </ul>
                </div>
              </div>
            )}

            {aiChat.map(message => (
              <div key={message.id} className={`chat-message ${message.type}`}>
                <div className="message-avatar">
                  {message.type === 'user' ? '👤' : '🤖'}
                </div>
                <div className="message-content">
                  <p>{message.content}</p>
                  <span className="message-time">
                    {message.timestamp.toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="chat-input-container">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask your AI advisor anything..."
              onKeyPress={(e) => e.key === 'Enter' && handleAIChat(chatInput)}
              className="chat-input"
            />
            <button 
              onClick={() => handleAIChat(chatInput)}
              className="send-button"
            >
              Send
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AIRecommendations;
