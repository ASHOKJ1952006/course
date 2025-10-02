import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import '../styles/design-system.css';
import '../styles/professional-ui.css';

const CareerPage = ({ onShowNotification }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [jobRecommendations, setJobRecommendations] = useState([]);
  const [careerPath, setCareerPath] = useState(null);
  const [skillGaps, setSkillGaps] = useState([]);
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    // Generate career data based on completed courses
    const completedCourses = user?.completedCourses || [];
    
    const sampleJobs = [
      {
        id: 1,
        title: 'Senior Full Stack Developer',
        company: 'TechCorp Inc.',
        location: 'San Francisco, CA',
        salary: '$120,000 - $160,000',
        type: 'Full-time',
        remote: true,
        matchScore: 95,
        requiredSkills: ['React', 'Node.js', 'Python', 'AI/ML'],
        description: 'Join our innovative team building AI-powered web applications...',
        postedDate: '2 days ago',
        applicants: 45,
        relatedCourses: ['AI-Powered Full Stack Development'],
        benefits: ['Health Insurance', 'Stock Options', 'Remote Work', '401k']
      },
      {
        id: 2,
        title: 'Blockchain Developer',
        company: 'CryptoStart',
        location: 'New York, NY',
        salary: '$140,000 - $180,000',
        type: 'Full-time',
        remote: false,
        matchScore: 88,
        requiredSkills: ['Solidity', 'Ethereum', 'Smart Contracts', 'DeFi'],
        description: 'Build the future of decentralized finance with cutting-edge blockchain technology...',
        postedDate: '1 week ago',
        applicants: 23,
        relatedCourses: ['Blockchain & Web3 Development'],
        benefits: ['Crypto Bonus', 'Health Insurance', 'Learning Budget']
      },
      {
        id: 3,
        title: 'Data Scientist',
        company: 'DataFlow Analytics',
        location: 'Austin, TX',
        salary: '$110,000 - $140,000',
        type: 'Full-time',
        remote: true,
        matchScore: 92,
        requiredSkills: ['Python', 'Machine Learning', 'TensorFlow', 'Statistics'],
        description: 'Analyze complex datasets and build predictive models...',
        postedDate: '3 days ago',
        applicants: 67,
        relatedCourses: ['Data Science with Python & AI'],
        benefits: ['Remote Work', 'Health Insurance', 'Conference Budget']
      }
    ];

    const careerPathData = {
      current: 'Junior Developer',
      target: 'Senior Full Stack Developer',
      progress: 75,
      nextSteps: [
        { skill: 'Advanced React Patterns', completed: true },
        { skill: 'System Design', completed: false },
        { skill: 'Leadership Skills', completed: false },
        { skill: 'Cloud Architecture', completed: false }
      ],
      timeline: '6-12 months',
      salary: {
        current: '$70,000',
        target: '$120,000',
        increase: '+71%'
      }
    };

    const skillGapData = [
      {
        skill: 'System Design',
        importance: 'High',
        gap: 60,
        recommendedCourse: 'System Design Masterclass',
        timeToLearn: '3 months'
      },
      {
        skill: 'Cloud Computing (AWS)',
        importance: 'Medium',
        gap: 40,
        recommendedCourse: 'AWS Solutions Architect',
        timeToLearn: '2 months'
      },
      {
        skill: 'Leadership & Management',
        importance: 'High',
        gap: 80,
        recommendedCourse: 'Tech Leadership Program',
        timeToLearn: '4 months'
      }
    ];

    setJobRecommendations(sampleJobs);
    setCareerPath(careerPathData);
    setSkillGaps(skillGapData);
  }, [user]);

  const renderDashboard = () => (
    <div className="career-dashboard">
      {/* Career Progress */}
      <div className="career-progress-card">
        <h3>🎯 Career Progress</h3>
        <div className="progress-path">
          <div className="current-role">
            <span className="role-label">Current</span>
            <h4>{careerPath?.current}</h4>
          </div>
          <div className="progress-arrow">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${careerPath?.progress}%` }}
              ></div>
            </div>
            <span className="progress-text">{careerPath?.progress}%</span>
          </div>
          <div className="target-role">
            <span className="role-label">Target</span>
            <h4>{careerPath?.target}</h4>
          </div>
        </div>
        
        <div className="career-stats">
          <div className="stat">
            <span className="stat-value">{careerPath?.timeline}</span>
            <span className="stat-label">Estimated Timeline</span>
          </div>
          <div className="stat">
            <span className="stat-value">{careerPath?.salary?.increase}</span>
            <span className="stat-label">Salary Increase</span>
          </div>
          <div className="stat">
            <span className="stat-value">{careerPath?.salary?.target}</span>
            <span className="stat-label">Target Salary</span>
          </div>
        </div>
      </div>

      {/* Skill Gaps */}
      <div className="skill-gaps-card">
        <h3>📈 Skill Development Plan</h3>
        {skillGaps.map((gap, index) => (
          <div key={index} className="skill-gap-item">
            <div className="skill-info">
              <h4>{gap.skill}</h4>
              <span className={`importance ${gap.importance.toLowerCase()}`}>
                {gap.importance} Priority
              </span>
            </div>
            <div className="skill-progress">
              <div className="skill-bar">
                <div 
                  className="skill-fill" 
                  style={{ width: `${100 - gap.gap}%` }}
                ></div>
              </div>
              <span className="skill-percentage">{100 - gap.gap}%</span>
            </div>
            <div className="skill-action">
              <button className="recommend-btn">
                📚 {gap.recommendedCourse}
              </button>
              <span className="time-estimate">{gap.timeToLearn}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="quick-stats">
        <div className="stat-card">
          <div className="stat-icon">🎓</div>
          <div className="stat-content">
            <h4>{user?.completedCourses?.length || 0}</h4>
            <p>Courses Completed</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🏆</div>
          <div className="stat-content">
            <h4>{user?.certificates?.length || 0}</h4>
            <p>Certificates Earned</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">💼</div>
          <div className="stat-content">
            <h4>{jobRecommendations.length}</h4>
            <p>Job Matches</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderJobs = () => (
    <div className="jobs-section">
      <div className="jobs-header">
        <h2>🎯 Recommended Jobs</h2>
        <div className="job-filters">
          <select className="filter-select">
            <option>All Locations</option>
            <option>Remote</option>
            <option>San Francisco</option>
            <option>New York</option>
          </select>
          <select className="filter-select">
            <option>All Types</option>
            <option>Full-time</option>
            <option>Contract</option>
            <option>Internship</option>
          </select>
        </div>
      </div>

      <div className="jobs-list">
        {jobRecommendations.map(job => (
          <div key={job.id} className="job-card">
            <div className="job-header">
              <div className="job-info">
                <h3>{job.title}</h3>
                <p className="company">{job.company}</p>
                <div className="job-meta">
                  <span>📍 {job.location}</span>
                  <span>💰 {job.salary}</span>
                  <span>⏰ {job.type}</span>
                  {job.remote && <span className="remote-badge">🏠 Remote</span>}
                </div>
              </div>
              <div className="match-score">
                <div className="score-circle">
                  <span>{job.matchScore}%</span>
                </div>
                <p>Match</p>
              </div>
            </div>

            <p className="job-description">{job.description}</p>

            <div className="job-skills">
              <strong>Required Skills:</strong>
              <div className="skills-tags">
                {job.requiredSkills.map(skill => (
                  <span key={skill} className="skill-tag">{skill}</span>
                ))}
              </div>
            </div>

            {job.relatedCourses && (
              <div className="related-courses">
                <strong>✅ You completed:</strong>
                {job.relatedCourses.map(course => (
                  <span key={course} className="course-badge">{course}</span>
                ))}
              </div>
            )}

            <div className="job-benefits">
              <strong>Benefits:</strong>
              <div className="benefits-list">
                {job.benefits.map(benefit => (
                  <span key={benefit} className="benefit-tag">{benefit}</span>
                ))}
              </div>
            </div>

            <div className="job-footer">
              <div className="job-stats">
                <span>📅 {job.postedDate}</span>
                <span>👥 {job.applicants} applicants</span>
              </div>
              <div className="job-actions">
                <button 
                  className="apply-btn"
                  onClick={() => {
                    onShowNotification?.(`Applied to ${job.title} at ${job.company}!`, 'success');
                    // Simulate application tracking
                    setApplications(prev => [...prev, {
                      id: Date.now(),
                      jobId: job.id,
                      jobTitle: job.title,
                      company: job.company,
                      status: 'Applied',
                      appliedDate: new Date().toLocaleDateString()
                    }]);
                  }}
                >
                  🚀 Apply Now
                </button>
                <button 
                  className="save-btn"
                  onClick={() => onShowNotification?.(`Saved ${job.title} to your favorites!`, 'info')}
                >
                  🔖 Save
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderResume = () => (
    <div className="resume-section">
      <div className="resume-header">
        <h2>📄 AI-Powered Resume Builder</h2>
        <p>Generate a professional resume based on your completed courses and skills</p>
      </div>

      <div className="resume-builder">
        <div className="resume-preview">
          <div className="resume-content">
            <div className="resume-header-section">
              <h3>{user?.firstName} {user?.lastName}</h3>
              <p>{user?.email}</p>
              <p>Full Stack Developer | AI Enthusiast</p>
            </div>

            <div className="resume-section-item">
              <h4>🎓 Education & Certifications</h4>
              <div className="education-list">
                <div className="education-item">
                  <strong>AI-Powered Full Stack Development</strong>
                  <span>LearnNext Platform - 2024</span>
                  <p>Completed comprehensive course covering React, Node.js, AI integration, and modern web development practices.</p>
                </div>
                <div className="education-item">
                  <strong>Data Science with Python & AI</strong>
                  <span>LearnNext Platform - 2024</span>
                  <p>Mastered data analysis, machine learning, and AI model development using Python and TensorFlow.</p>
                </div>
              </div>
            </div>

            <div className="resume-section-item">
              <h4>💼 Skills</h4>
              <div className="skills-section">
                <div className="skill-category">
                  <strong>Programming Languages:</strong>
                  <span>JavaScript, Python, Solidity</span>
                </div>
                <div className="skill-category">
                  <strong>Frameworks & Libraries:</strong>
                  <span>React, Node.js, TensorFlow, Express</span>
                </div>
                <div className="skill-category">
                  <strong>Technologies:</strong>
                  <span>AI/ML, Blockchain, Web3, Data Science</span>
                </div>
              </div>
            </div>

            <div className="resume-section-item">
              <h4>🏆 Achievements</h4>
              <ul className="achievements-list">
                <li>Completed {user?.completedCourses?.length || 0} professional courses</li>
                <li>Earned {user?.certificates?.length || 0} industry-recognized certificates</li>
                <li>Built AI-powered web applications with modern frameworks</li>
                <li>Developed smart contracts and DeFi protocols</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="resume-actions">
          <button 
            className="resume-btn primary"
            onClick={() => {
              // Simulate PDF download
              const link = document.createElement('a');
              link.href = '#';
              link.download = `${user?.firstName}_${user?.lastName}_Resume.pdf`;
              onShowNotification?.('Resume PDF downloaded successfully!', 'success');
            }}
          >
            📥 Download PDF
          </button>
          <button 
            className="resume-btn secondary"
            onClick={() => onShowNotification?.('Resume customization feature coming soon!', 'info')}
          >
            ✏️ Customize
          </button>
          <button 
            className="resume-btn secondary"
            onClick={() => {
              navigator.clipboard.writeText(window.location.href + '/resume/' + user?.id);
              onShowNotification?.('Resume link copied to clipboard!', 'success');
            }}
          >
            🔗 Share Link
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="career-page">
      <div className="career-header">
        <h1>💼 Career Center</h1>
        <p>Accelerate your career with AI-powered recommendations</p>
      </div>

      <div className="career-tabs">
        <button 
          className={`tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          📊 Dashboard
        </button>
        <button 
          className={`tab-btn ${activeTab === 'jobs' ? 'active' : ''}`}
          onClick={() => setActiveTab('jobs')}
        >
          💼 Job Board
        </button>
        <button 
          className={`tab-btn ${activeTab === 'resume' ? 'active' : ''}`}
          onClick={() => setActiveTab('resume')}
        >
          📄 Resume Builder
        </button>
        <button 
          className={`tab-btn ${activeTab === 'interview' ? 'active' : ''}`}
          onClick={() => setActiveTab('interview')}
        >
          🎤 Interview Prep
        </button>
      </div>

      <div className="career-content">
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'jobs' && renderJobs()}
        {activeTab === 'resume' && renderResume()}
        {activeTab === 'interview' && (
          <div className="interview-prep">
            <h2>🎤 Interview Preparation</h2>
            <p>AI-powered interview practice based on your target roles</p>
            
            {/* Application Tracking */}
            {applications.length > 0 && (
              <div className="applications-section">
                <h3>📋 Your Applications</h3>
                <div className="applications-list">
                  {applications.map(app => (
                    <div key={app.id} className="application-item">
                      <div className="app-info">
                        <h4>{app.jobTitle}</h4>
                        <p>{app.company}</p>
                        <small>Applied: {app.appliedDate}</small>
                      </div>
                      <span className={`status-badge status-info`}>
                        {app.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="prep-options">
              <div className="prep-card">
                <h3>🤖 AI Mock Interviews</h3>
                <p>Practice with AI interviewer for your target role</p>
                <button 
                  className="prep-btn"
                  onClick={() => {
                    onShowNotification?.('Starting AI mock interview session...', 'info');
                    setTimeout(() => {
                      onShowNotification?.('Mock interview completed! Check your performance report.', 'success');
                    }, 3000);
                  }}
                >
                  Start Practice
                </button>
              </div>
              <div className="prep-card">
                <h3>📚 Technical Questions</h3>
                <p>Course-specific technical interview questions</p>
                <button 
                  className="prep-btn"
                  onClick={() => {
                    onShowNotification?.('Loading technical questions based on your completed courses...', 'info');
                  }}
                >
                  View Questions
                </button>
              </div>
              <div className="prep-card">
                <h3>💼 Behavioral Questions</h3>
                <p>Practice common behavioral interview scenarios</p>
                <button 
                  className="prep-btn"
                  onClick={() => {
                    onShowNotification?.('Behavioral interview prep started!', 'info');
                  }}
                >
                  Practice Now
                </button>
              </div>
              <div className="prep-card">
                <h3>📊 Interview Analytics</h3>
                <p>Track your interview performance and improvement</p>
                <button 
                  className="prep-btn"
                  onClick={() => {
                    onShowNotification?.('Generating your interview performance report...', 'info');
                  }}
                >
                  View Analytics
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .career-page {
          padding: 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .career-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .career-header h1 {
          font-size: 2.5rem;
          margin-bottom: 0.5rem;
          background: var(--gradient-primary);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .career-tabs {
          display: flex;
          gap: 1rem;
          margin-bottom: 2rem;
          border-bottom: 1px solid var(--border-color);
        }

        .tab-btn {
          padding: 1rem 1.5rem;
          border: none;
          background: none;
          cursor: pointer;
          font-size: 1rem;
          font-weight: 500;
          color: var(--text-secondary);
          border-bottom: 2px solid transparent;
          transition: all 0.2s;
        }

        .tab-btn.active {
          color: var(--primary-600);
          border-bottom-color: var(--primary-600);
        }

        .career-progress-card {
          background: var(--bg-secondary);
          border-radius: var(--radius-xl);
          padding: 2rem;
          margin-bottom: 2rem;
          border: 1px solid var(--border-color);
        }

        .progress-path {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin: 2rem 0;
        }

        .current-role, .target-role {
          text-align: center;
          flex: 1;
        }

        .role-label {
          display: block;
          font-size: 0.875rem;
          color: var(--text-secondary);
          margin-bottom: 0.5rem;
        }

        .progress-arrow {
          flex: 2;
          display: flex;
          align-items: center;
          gap: 1rem;
          margin: 0 2rem;
        }

        .progress-bar {
          flex: 1;
          height: 8px;
          background: var(--bg-tertiary);
          border-radius: var(--radius-full);
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: var(--gradient-primary);
          transition: width 0.3s ease;
        }

        .career-stats {
          display: flex;
          justify-content: space-around;
          margin-top: 2rem;
          padding-top: 2rem;
          border-top: 1px solid var(--border-color);
        }

        .stat {
          text-align: center;
        }

        .stat-value {
          display: block;
          font-size: 1.5rem;
          font-weight: bold;
          color: var(--primary-600);
        }

        .stat-label {
          font-size: 0.875rem;
          color: var(--text-secondary);
        }

        .skill-gaps-card {
          background: var(--bg-secondary);
          border-radius: var(--radius-xl);
          padding: 2rem;
          margin-bottom: 2rem;
          border: 1px solid var(--border-color);
        }

        .skill-gap-item {
          display: grid;
          grid-template-columns: 1fr 200px 1fr;
          gap: 1rem;
          align-items: center;
          padding: 1rem 0;
          border-bottom: 1px solid var(--border-color);
        }

        .skill-gap-item:last-child {
          border-bottom: none;
        }

        .importance.high {
          color: var(--accent-error);
        }

        .importance.medium {
          color: var(--accent-warning);
        }

        .skill-progress {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .skill-bar {
          flex: 1;
          height: 6px;
          background: var(--bg-tertiary);
          border-radius: var(--radius-full);
          overflow: hidden;
        }

        .skill-fill {
          height: 100%;
          background: var(--gradient-success);
        }

        .recommend-btn {
          background: var(--gradient-primary);
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: var(--radius-lg);
          cursor: pointer;
          font-size: 0.875rem;
          margin-bottom: 0.5rem;
        }

        .quick-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
        }

        .stat-card {
          background: var(--bg-secondary);
          border-radius: var(--radius-xl);
          padding: 1.5rem;
          border: 1px solid var(--border-color);
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .stat-icon {
          font-size: 2rem;
        }

        .job-card {
          background: var(--bg-secondary);
          border-radius: var(--radius-xl);
          padding: 1.5rem;
          margin-bottom: 1.5rem;
          border: 1px solid var(--border-color);
        }

        .job-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1rem;
        }

        .job-meta {
          display: flex;
          gap: 1rem;
          margin-top: 0.5rem;
          font-size: 0.875rem;
          color: var(--text-secondary);
        }

        .remote-badge {
          background: var(--gradient-success);
          color: white;
          padding: 0.25rem 0.5rem;
          border-radius: var(--radius-full);
          font-size: 0.75rem;
        }

        .match-score {
          text-align: center;
        }

        .score-circle {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: var(--gradient-primary);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          margin-bottom: 0.5rem;
        }

        .skills-tags, .benefits-list {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
          margin-top: 0.5rem;
        }

        .skill-tag {
          background: var(--bg-tertiary);
          padding: 0.25rem 0.75rem;
          border-radius: var(--radius-full);
          font-size: 0.75rem;
        }

        .course-badge {
          background: var(--gradient-success);
          color: white;
          padding: 0.25rem 0.75rem;
          border-radius: var(--radius-full);
          font-size: 0.75rem;
          margin-left: 0.5rem;
        }

        .benefit-tag {
          background: var(--gradient-info);
          color: white;
          padding: 0.25rem 0.5rem;
          border-radius: var(--radius-md);
          font-size: 0.75rem;
        }

        .job-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid var(--border-color);
        }

        .job-actions {
          display: flex;
          gap: 1rem;
        }

        .apply-btn {
          background: var(--gradient-primary);
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: var(--radius-lg);
          cursor: pointer;
          font-weight: 600;
        }

        .save-btn {
          background: transparent;
          color: var(--primary-600);
          border: 1px solid var(--primary-600);
          padding: 0.75rem 1.5rem;
          border-radius: var(--radius-lg);
          cursor: pointer;
        }

        .resume-builder {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 2rem;
        }

        .resume-preview {
          background: white;
          border-radius: var(--radius-xl);
          padding: 2rem;
          border: 1px solid var(--border-color);
          color: #333;
        }

        .resume-section-item {
          margin-bottom: 2rem;
        }

        .resume-section-item h4 {
          color: var(--primary-600);
          margin-bottom: 1rem;
        }

        .education-item {
          margin-bottom: 1rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid #eee;
        }

        .skill-category {
          margin-bottom: 0.5rem;
        }

        .resume-actions {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .resume-btn {
          padding: 1rem;
          border-radius: var(--radius-lg);
          cursor: pointer;
          font-weight: 600;
        }

        .resume-btn.primary {
          background: var(--gradient-primary);
          color: white;
          border: none;
        }

        .resume-btn.secondary {
          background: transparent;
          color: var(--primary-600);
          border: 1px solid var(--primary-600);
        }

        .interview-prep {
          text-align: center;
          padding: 2rem;
        }

        .applications-section {
          background: var(--bg-secondary);
          border-radius: var(--radius-xl);
          padding: 2rem;
          margin-bottom: 2rem;
          border: 1px solid var(--border-color);
        }

        .applications-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-top: 1rem;
        }

        .application-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          background: var(--bg-tertiary);
          border-radius: var(--radius-lg);
          border: 1px solid var(--border-color);
        }

        .app-info h4 {
          margin: 0 0 0.25rem 0;
          color: var(--text-primary);
        }

        .app-info p {
          margin: 0 0 0.25rem 0;
          color: var(--text-secondary);
          font-size: 0.875rem;
        }

        .app-info small {
          color: var(--text-tertiary);
          font-size: 0.75rem;
        }

        .prep-options {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
          margin-top: 2rem;
        }

        .prep-card {
          background: var(--bg-secondary);
          border-radius: var(--radius-xl);
          padding: 2rem;
          border: 1px solid var(--border-color);
        }

        .prep-btn {
          background: var(--gradient-primary);
          color: white;
          border: none;
          padding: 1rem 2rem;
          border-radius: var(--radius-lg);
          cursor: pointer;
          font-weight: 600;
          margin-top: 1rem;
        }

        @media (max-width: 768px) {
          .career-page {
            padding: 1rem;
          }
          
          .career-tabs {
            flex-wrap: wrap;
          }
          
          .progress-path {
            flex-direction: column;
            gap: 1rem;
          }
          
          .skill-gap-item {
            grid-template-columns: 1fr;
            gap: 0.5rem;
          }
          
          .resume-builder {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default CareerPage;
