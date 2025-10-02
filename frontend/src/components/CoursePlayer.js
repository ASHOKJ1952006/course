import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import '../styles/professional-ui.css';

const CoursePlayer = ({ course, onClose, onShowNotification, onCourseComplete }) => {
  const { user } = useAuth();
  const [currentLesson, setCurrentLesson] = useState(0);
  const [progress, setProgress] = useState(0);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [showExam, setShowExam] = useState(false);
  const [examCompleted, setExamCompleted] = useState(false);
  const [courseCompleted, setCourseCompleted] = useState(false);
  const [certificate, setCertificate] = useState(null);
  const [similarCourses, setSimilarCourses] = useState([]);

  // Sample course content
  const courseContent = {
    lessons: [
      {
        id: 1,
        title: 'Introduction to ' + course.title,
        duration: '15 min',
        type: 'video',
        content: 'Welcome to this comprehensive course. In this lesson, we will cover the fundamentals...',
        videoUrl: '/api/placeholder/video/lesson1.mp4'
      },
      {
        id: 2,
        title: 'Core Concepts',
        duration: '25 min',
        type: 'video',
        content: 'Now let\'s dive into the core concepts that form the foundation...',
        videoUrl: '/api/placeholder/video/lesson2.mp4'
      },
      {
        id: 3,
        title: 'Practical Examples',
        duration: '30 min',
        type: 'interactive',
        content: 'Time to put theory into practice with hands-on examples...',
        exercises: [
          { id: 1, question: 'Complete this code snippet', answer: 'function example() { return true; }' }
        ]
      },
      {
        id: 4,
        title: 'Advanced Topics',
        duration: '20 min',
        type: 'video',
        content: 'Advanced concepts and best practices...',
        videoUrl: '/api/placeholder/video/lesson4.mp4'
      }
    ],
    exam: {
      questions: [
        {
          id: 1,
          question: 'What is the main concept covered in this course?',
          options: ['Option A', 'Option B', 'Option C', 'Option D'],
          correct: 0
        },
        {
          id: 2,
          question: 'Which of the following is a best practice?',
          options: ['Practice A', 'Practice B', 'Practice C', 'Practice D'],
          correct: 2
        }
      ]
    }
  };

  useEffect(() => {
    // Load similar courses
    const similar = [
      {
        id: 'similar1',
        title: 'Advanced ' + course.title,
        instructor: 'Expert Instructor',
        rating: 4.8,
        price: course.price + 50,
        thumbnail: '/api/placeholder/300/200'
      },
      {
        id: 'similar2',
        title: course.title + ' Masterclass',
        instructor: 'Master Teacher',
        rating: 4.9,
        price: course.price + 100,
        thumbnail: '/api/placeholder/300/200'
      }
    ];
    setSimilarCourses(similar);
  }, [course]);

  const completeLesson = (lessonId) => {
    if (!completedLessons.includes(lessonId)) {
      const newCompleted = [...completedLessons, lessonId];
      setCompletedLessons(newCompleted);
      const newProgress = (newCompleted.length / courseContent.lessons.length) * 100;
      setProgress(newProgress);
      
      onShowNotification?.(`Lesson ${lessonId} completed! 🎉`, 'success');
      
      if (newCompleted.length === courseContent.lessons.length) {
        onShowNotification?.('All lessons completed! Ready for final exam.', 'info');
      }
    }
  };

  const startExam = () => {
    if (completedLessons.length === courseContent.lessons.length) {
      setShowExam(true);
      onShowNotification?.('Starting final exam...', 'info');
    } else {
      onShowNotification?.('Complete all lessons before taking the exam.', 'warning');
    }
  };

  const completeExam = (score) => {
    setExamCompleted(true);
    setShowExam(false);
    
    if (score >= 70) {
      setCourseCompleted(true);
      const cert = {
        id: Date.now(),
        courseTitle: course.title,
        studentName: `${user?.firstName} ${user?.lastName}`,
        completionDate: new Date().toLocaleDateString(),
        score: score,
        instructor: course.instructor
      };
      setCertificate(cert);
      onShowNotification?.(`Congratulations! Course completed with ${score}% score! 🏆`, 'success');
      onCourseComplete?.(course, cert);
    } else {
      onShowNotification?.(`Exam score: ${score}%. You need 70% to pass. Try again!`, 'warning');
    }
  };

  const downloadCertificate = () => {
    // Simulate certificate download
    const link = document.createElement('a');
    link.href = '#';
    link.download = `${course.title}_Certificate.pdf`;
    onShowNotification?.('Certificate downloaded successfully!', 'success');
  };

  return (
    <div className="course-player-overlay">
      <div className="course-player">
        <div className="player-header">
          <div className="course-info">
            <h2>{course.title}</h2>
            <p>by {course.instructor}</p>
          </div>
          <div className="player-controls">
            <div className="progress-info">
              <span>{Math.round(progress)}% Complete</span>
              <div className="progress-bar">
                <div className="progress-fill" style={{width: `${progress}%`}}></div>
              </div>
            </div>
            <button className="close-btn" onClick={onClose}>✕</button>
          </div>
        </div>

        <div className="player-content">
          <div className="main-content">
            {!showExam && !courseCompleted && (
              <div className="lesson-player">
                <div className="video-container">
                  <div className="video-placeholder">
                    <div className="play-button">▶️</div>
                    <p>Lesson {currentLesson + 1}: {courseContent.lessons[currentLesson]?.title}</p>
                  </div>
                </div>
                
                <div className="lesson-content">
                  <h3>{courseContent.lessons[currentLesson]?.title}</h3>
                  <p>{courseContent.lessons[currentLesson]?.content}</p>
                  
                  <div className="lesson-actions">
                    <button 
                      className="btn-professional btn-primary"
                      onClick={() => completeLesson(courseContent.lessons[currentLesson]?.id)}
                      disabled={completedLessons.includes(courseContent.lessons[currentLesson]?.id)}
                    >
                      {completedLessons.includes(courseContent.lessons[currentLesson]?.id) ? '✅ Completed' : 'Mark Complete'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {showExam && (
              <ExamComponent 
                exam={courseContent.exam}
                onComplete={completeExam}
                onShowNotification={onShowNotification}
              />
            )}

            {courseCompleted && certificate && (
              <div className="completion-screen">
                <div className="certificate-preview">
                  <h2>🎉 Congratulations!</h2>
                  <div className="certificate">
                    <h3>Certificate of Completion</h3>
                    <p>This certifies that</p>
                    <h4>{certificate.studentName}</h4>
                    <p>has successfully completed</p>
                    <h4>{certificate.courseTitle}</h4>
                    <p>Score: {certificate.score}%</p>
                    <p>Date: {certificate.completionDate}</p>
                  </div>
                  <button 
                    className="btn-professional btn-primary"
                    onClick={downloadCertificate}
                  >
                    📥 Download Certificate
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="sidebar">
            <div className="course-outline">
              <h4>Course Outline</h4>
              {courseContent.lessons.map((lesson, index) => (
                <div 
                  key={lesson.id}
                  className={`lesson-item ${index === currentLesson ? 'active' : ''} ${completedLessons.includes(lesson.id) ? 'completed' : ''}`}
                  onClick={() => setCurrentLesson(index)}
                >
                  <span className="lesson-status">
                    {completedLessons.includes(lesson.id) ? '✅' : '📹'}
                  </span>
                  <div className="lesson-details">
                    <h5>{lesson.title}</h5>
                    <span>{lesson.duration}</span>
                  </div>
                </div>
              ))}
              
              <div className="exam-section">
                <button 
                  className={`exam-btn ${completedLessons.length === courseContent.lessons.length ? 'enabled' : 'disabled'}`}
                  onClick={startExam}
                  disabled={completedLessons.length !== courseContent.lessons.length}
                >
                  {examCompleted ? '✅ Exam Completed' : '📝 Final Exam'}
                </button>
              </div>
            </div>

            {similarCourses.length > 0 && (
              <div className="similar-courses">
                <h4>Similar Courses</h4>
                {similarCourses.map(similar => (
                  <div key={similar.id} className="similar-course-card">
                    <img src={similar.thumbnail} alt={similar.title} />
                    <div className="similar-info">
                      <h5>{similar.title}</h5>
                      <p>{similar.instructor}</p>
                      <div className="similar-meta">
                        <span>⭐ {similar.rating}</span>
                        <span>${similar.price}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .course-player-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.9);
          z-index: 10000;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .course-player {
          width: 95vw;
          height: 90vh;
          background: var(--bg-primary);
          border-radius: var(--radius-xl);
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .player-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem 2rem;
          border-bottom: 1px solid var(--border-color);
          background: var(--bg-secondary);
        }

        .progress-info {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .progress-bar {
          width: 200px;
          height: 6px;
          background: var(--bg-tertiary);
          border-radius: var(--radius-full);
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: var(--gradient-primary);
          transition: width 0.3s ease;
        }

        .player-content {
          display: flex;
          flex: 1;
          overflow: hidden;
        }

        .main-content {
          flex: 2;
          padding: 2rem;
          overflow-y: auto;
        }

        .video-container {
          width: 100%;
          height: 400px;
          background: #000;
          border-radius: var(--radius-lg);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 2rem;
        }

        .video-placeholder {
          text-align: center;
          color: white;
        }

        .play-button {
          font-size: 4rem;
          margin-bottom: 1rem;
          cursor: pointer;
        }

        .sidebar {
          flex: 1;
          background: var(--bg-secondary);
          padding: 1.5rem;
          overflow-y: auto;
          border-left: 1px solid var(--border-color);
        }

        .lesson-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          border-radius: var(--radius-lg);
          cursor: pointer;
          margin-bottom: 0.5rem;
          transition: all 0.2s ease;
        }

        .lesson-item:hover {
          background: var(--bg-tertiary);
        }

        .lesson-item.active {
          background: var(--gradient-primary);
          color: white;
        }

        .lesson-item.completed {
          background: rgba(16, 185, 129, 0.1);
        }

        .exam-btn {
          width: 100%;
          padding: 1rem;
          border-radius: var(--radius-lg);
          border: none;
          background: var(--gradient-primary);
          color: white;
          font-weight: 600;
          cursor: pointer;
          margin-top: 1rem;
        }

        .exam-btn.disabled {
          background: var(--bg-tertiary);
          color: var(--text-secondary);
          cursor: not-allowed;
        }

        .certificate {
          background: white;
          color: #333;
          padding: 3rem;
          border-radius: var(--radius-xl);
          text-align: center;
          border: 3px solid var(--primary-600);
          margin: 2rem 0;
        }

        .similar-course-card {
          display: flex;
          gap: 1rem;
          padding: 1rem;
          border-radius: var(--radius-lg);
          background: var(--bg-primary);
          margin-bottom: 1rem;
        }

        .similar-course-card img {
          width: 60px;
          height: 40px;
          border-radius: var(--radius-md);
          object-fit: cover;
        }

        .similar-meta {
          display: flex;
          gap: 1rem;
          font-size: 0.75rem;
          color: var(--text-secondary);
        }

        @media (max-width: 768px) {
          .course-player {
            width: 100vw;
            height: 100vh;
            border-radius: 0;
          }
          
          .player-content {
            flex-direction: column;
          }
          
          .sidebar {
            border-left: none;
            border-top: 1px solid var(--border-color);
          }
        }
      `}</style>
    </div>
  );
};

const ExamComponent = ({ exam, onComplete, onShowNotification }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);

  const handleAnswer = (questionId, answerIndex) => {
    setAnswers(prev => ({ ...prev, [questionId]: answerIndex }));
  };

  const submitExam = () => {
    const totalQuestions = exam.questions.length;
    const correctAnswers = exam.questions.filter(q => answers[q.id] === q.correct).length;
    const score = Math.round((correctAnswers / totalQuestions) * 100);
    
    setShowResults(true);
    setTimeout(() => {
      onComplete(score);
    }, 2000);
  };

  if (showResults) {
    return (
      <div className="exam-results">
        <h2>Exam Submitted!</h2>
        <p>Processing your results...</p>
        <div className="spinner"></div>
      </div>
    );
  }

  const question = exam.questions[currentQuestion];

  return (
    <div className="exam-container">
      <div className="exam-header">
        <h3>Final Exam</h3>
        <span>Question {currentQuestion + 1} of {exam.questions.length}</span>
      </div>
      
      <div className="question-container">
        <h4>{question.question}</h4>
        <div className="options">
          {question.options.map((option, index) => (
            <button
              key={index}
              className={`option ${answers[question.id] === index ? 'selected' : ''}`}
              onClick={() => handleAnswer(question.id, index)}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
      
      <div className="exam-navigation">
        <button 
          onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
          disabled={currentQuestion === 0}
        >
          Previous
        </button>
        
        {currentQuestion < exam.questions.length - 1 ? (
          <button 
            onClick={() => setCurrentQuestion(prev => prev + 1)}
            disabled={answers[question.id] === undefined}
          >
            Next
          </button>
        ) : (
          <button 
            onClick={submitExam}
            disabled={Object.keys(answers).length !== exam.questions.length}
            className="submit-btn"
          >
            Submit Exam
          </button>
        )}
      </div>

      <style jsx>{`
        .exam-container {
          max-width: 800px;
          margin: 0 auto;
        }
        
        .exam-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid var(--border-color);
        }
        
        .question-container {
          margin-bottom: 3rem;
        }
        
        .options {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-top: 1.5rem;
        }
        
        .option {
          padding: 1rem 1.5rem;
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
          background: var(--bg-secondary);
          cursor: pointer;
          text-align: left;
          transition: all 0.2s ease;
        }
        
        .option:hover {
          background: var(--bg-tertiary);
        }
        
        .option.selected {
          background: var(--gradient-primary);
          color: white;
          border-color: var(--primary-600);
        }
        
        .exam-navigation {
          display: flex;
          justify-content: space-between;
          gap: 1rem;
        }
        
        .exam-navigation button {
          padding: 0.75rem 2rem;
          border-radius: var(--radius-lg);
          border: 1px solid var(--border-color);
          background: var(--bg-secondary);
          cursor: pointer;
        }
        
        .submit-btn {
          background: var(--gradient-primary) !important;
          color: white !important;
          border: none !important;
        }
      `}</style>
    </div>
  );
};

export default CoursePlayer;
