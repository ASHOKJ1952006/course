import React, { useState, useEffect } from 'react';
import '../styles/QuizSystem.css';

const QuizSystem = ({ courseId, onComplete }) => {
  const [quiz, setQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchQuiz();
  }, [courseId]);

  useEffect(() => {
    let timer;
    if (quizStarted && timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            submitQuiz();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [quizStarted, timeRemaining]);

  const fetchQuiz = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/courses/${courseId}/quiz`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const quizData = await response.json();
        setQuiz(quizData);
        setTimeRemaining(quizData.timeLimit * 60); // Convert minutes to seconds
      } else {
        setError('Failed to load quiz');
      }
    } catch (error) {
      setError('Error loading quiz');
    } finally {
      setLoading(false);
    }
  };

  const startQuiz = () => {
    setQuizStarted(true);
  };

  const selectAnswer = (questionId, selectedOption) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: selectedOption
    }));
  };

  const nextQuestion = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const submitQuiz = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/courses/${courseId}/quiz/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ answers })
      });

      if (response.ok) {
        const result = await response.json();
        setScore(result.score);
        setShowResults(true);
        if (onComplete) {
          onComplete(result.score, result.passed);
        }
      } else {
        setError('Failed to submit quiz');
      }
    } catch (error) {
      setError('Error submitting quiz');
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = () => {
    return ((currentQuestion + 1) / quiz.questions.length) * 100;
  };

  const getAnsweredCount = () => {
    return Object.keys(answers).length;
  };

  if (loading) {
    return <div className="loading">Loading quiz...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!quiz) {
    return <div className="no-quiz">No quiz available for this course.</div>;
  }

  if (!quizStarted) {
    return (
      <div className="quiz-intro">
        <div className="quiz-info-card">
          <h2>{quiz.title}</h2>
          <div className="quiz-details">
            <div className="detail-item">
              <span className="label">Questions:</span>
              <span className="value">{quiz.questions.length}</span>
            </div>
            <div className="detail-item">
              <span className="label">Time Limit:</span>
              <span className="value">{quiz.timeLimit} minutes</span>
            </div>
            <div className="detail-item">
              <span className="label">Passing Score:</span>
              <span className="value">{quiz.passingScore}%</span>
            </div>
          </div>
          <div className="quiz-instructions">
            <h3>Instructions:</h3>
            <ul>
              <li>Read each question carefully before selecting an answer</li>
              <li>You can navigate between questions using the navigation buttons</li>
              <li>Make sure to answer all questions before submitting</li>
              <li>The quiz will auto-submit when time runs out</li>
            </ul>
          </div>
          <button onClick={startQuiz} className="start-quiz-btn">
            Start Quiz
          </button>
        </div>
      </div>
    );
  }

  if (showResults) {
    const passed = score >= quiz.passingScore;
    return (
      <div className="quiz-results">
        <div className="results-card">
          <div className={`score-display ${passed ? 'passed' : 'failed'}`}>
            <h2>Quiz Complete!</h2>
            <div className="score-circle">
              <span className="score-number">{score}%</span>
            </div>
            <p className={`result-status ${passed ? 'passed' : 'failed'}`}>
              {passed ? '🎉 Congratulations! You passed!' : '😔 You need to retake the quiz'}
            </p>
          </div>
          
          <div className="results-summary">
            <div className="summary-item">
              <span className="label">Correct Answers:</span>
              <span className="value">{Math.round((score / 100) * quiz.questions.length)} / {quiz.questions.length}</span>
            </div>
            <div className="summary-item">
              <span className="label">Passing Score:</span>
              <span className="value">{quiz.passingScore}%</span>
            </div>
            <div className="summary-item">
              <span className="label">Your Score:</span>
              <span className="value">{score}%</span>
            </div>
          </div>

          <div className="results-actions">
            {!passed && (
              <button onClick={() => window.location.reload()} className="retake-btn">
                Retake Quiz
              </button>
            )}
            <button onClick={() => setShowResults(false)} className="review-btn">
              Review Answers
            </button>
          </div>
        </div>
      </div>
    );
  }

  const question = quiz.questions[currentQuestion];

  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <div className="quiz-progress">
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${getProgressPercentage()}%` }}
            ></div>
          </div>
          <span className="progress-text">
            Question {currentQuestion + 1} of {quiz.questions.length}
          </span>
        </div>
        
        <div className="quiz-timer">
          <span className={`timer ${timeRemaining < 300 ? 'warning' : ''}`}>
            ⏰ {formatTime(timeRemaining)}
          </span>
        </div>
      </div>

      <div className="question-card">
        <h3 className="question-title">
          Question {currentQuestion + 1}
        </h3>
        <p className="question-text">{question.question}</p>
        
        <div className="options-list">
          {question.options.map((option, index) => (
            <label key={index} className="option-item">
              <input
                type="radio"
                name={`question-${question._id}`}
                value={option}
                checked={answers[question._id] === option}
                onChange={() => selectAnswer(question._id, option)}
              />
              <span className="option-text">{option}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="quiz-navigation">
        <button 
          onClick={prevQuestion}
          disabled={currentQuestion === 0}
          className="nav-btn prev-btn"
        >
          ← Previous
        </button>
        
        <div className="quiz-status">
          <span>Answered: {getAnsweredCount()} / {quiz.questions.length}</span>
        </div>
        
        {currentQuestion === quiz.questions.length - 1 ? (
          <button 
            onClick={submitQuiz}
            className="submit-btn"
            disabled={getAnsweredCount() < quiz.questions.length}
          >
            Submit Quiz
          </button>
        ) : (
          <button 
            onClick={nextQuestion}
            className="nav-btn next-btn"
          >
            Next →
          </button>
        )}
      </div>
    </div>
  );
};

export default QuizSystem;
