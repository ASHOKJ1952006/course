import React, { useState, useEffect } from 'react';

const AIRecommendationEngine = ({ user, courses, onRecommendationUpdate }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [skillGapAnalysis, setSkillGapAnalysis] = useState(null);
  const [learningPath, setLearningPath] = useState(null);
  const [loading, setLoading] = useState(false);

  // AI-powered recommendation algorithm
  const generateRecommendations = async () => {
    setLoading(true);
    try {
      // Simulate AI analysis
      const userSkills = user?.skills || [];
      const userInterests = user?.interests || [];
      const completedCourses = user?.completedCourses || [];
      
      // Calculate skill gaps
      const targetSkills = ['React', 'Node.js', 'Python', 'AI/ML', 'Blockchain'];
      const skillGaps = targetSkills.filter(skill => 
        !userSkills.some(userSkill => userSkill.name === skill)
      );

      // Generate personalized recommendations
      const scored = courses.map(course => ({
        ...course,
        aiScore: calculateAIScore(course, userSkills, userInterests, completedCourses)
      }));

      const topRecommendations = scored
        .sort((a, b) => b.aiScore - a.aiScore)
        .slice(0, 6);

      setRecommendations(topRecommendations);
      setSkillGapAnalysis({ gaps: skillGaps, target: targetSkills });
      
      // Generate learning path
      const path = generateLearningPath(topRecommendations, skillGaps);
      setLearningPath(path);

      onRecommendationUpdate?.(topRecommendations);
    } catch (error) {
      console.error('AI recommendation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateAIScore = (course, userSkills, interests, completed) => {
    let score = 50; // Base score

    // Skill matching
    const skillMatch = course.skills?.filter(skill =>
      userSkills.some(userSkill => userSkill.name === skill)
    ).length || 0;
    score += skillMatch * 10;

    // Interest matching
    const interestMatch = interests.filter(interest =>
      course.category.toLowerCase().includes(interest.toLowerCase()) ||
      course.tags?.some(tag => tag.toLowerCase().includes(interest.toLowerCase()))
    ).length;
    score += interestMatch * 15;

    // Difficulty progression
    if (course.level === 'Beginner' && userSkills.length < 3) score += 20;
    if (course.level === 'Intermediate' && userSkills.length >= 3) score += 20;
    if (course.level === 'Advanced' && userSkills.length >= 6) score += 20;

    // Popularity boost
    score += Math.min(course.enrolledStudents / 1000, 10);

    // Rating boost
    score += (course.rating - 4) * 5;

    return Math.min(score, 100);
  };

  const generateLearningPath = (recommendations, skillGaps) => {
    return {
      title: "Personalized Learning Journey",
      duration: "6-8 months",
      courses: recommendations.slice(0, 4),
      milestones: [
        { week: 2, title: "Foundation Complete", skills: ["Basics"] },
        { week: 6, title: "Intermediate Level", skills: ["Core Skills"] },
        { week: 12, title: "Advanced Projects", skills: ["Specialization"] },
        { week: 16, title: "Portfolio Ready", skills: ["Job Ready"] }
      ]
    };
  };

  useEffect(() => {
    if (user && courses.length > 0) {
      generateRecommendations();
    }
  }, [user, courses]);

  return (
    <div className="ai-recommendation-engine">
      {loading && <div className="ai-loading">🤖 Analyzing your profile...</div>}
      
      {recommendations.length > 0 && (
        <div className="ai-recommendations-panel">
          <h3>🎯 Personalized for You</h3>
          <div className="recommendation-grid">
            {recommendations.slice(0, 3).map(course => (
              <div key={course._id} className="recommendation-card">
                <div className="ai-score">AI Match: {course.aiScore}%</div>
                <h4>{course.title}</h4>
                <p>{course.description.substring(0, 100)}...</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {skillGapAnalysis && (
        <div className="skill-gap-analysis">
          <h3>📊 Skill Gap Analysis</h3>
          <div className="skill-gaps">
            {skillGapAnalysis.gaps.map(skill => (
              <span key={skill} className="skill-gap-tag">{skill}</span>
            ))}
          </div>
        </div>
      )}

      {learningPath && (
        <div className="learning-path">
          <h3>🛤️ Your Learning Path</h3>
          <div className="path-timeline">
            {learningPath.milestones.map((milestone, index) => (
              <div key={index} className="milestone">
                <div className="milestone-week">Week {milestone.week}</div>
                <div className="milestone-title">{milestone.title}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AIRecommendationEngine;
