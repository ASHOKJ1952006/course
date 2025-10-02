import React, { useState, useEffect, useRef } from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

const HomePage = ({ courses, categories, onPageChange }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVisible, setIsVisible] = useState({});
  const [stats, setStats] = useState({
    students: 0,
    courses: 0,
    instructors: 0,
    countries: 0
  });

  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const statsRef = useRef(null);

  // Intersection Observer for animations
  const heroVisible = useIntersectionObserver(heroRef, { threshold: 0.1 });
  const featuresVisible = useIntersectionObserver(featuresRef, { threshold: 0.1 });
  const statsVisible = useIntersectionObserver(statsRef, { threshold: 0.1 });

  // Auto-sliding hero
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Animated counters
  useEffect(() => {
    if (statsVisible) {
      const targetStats = { students: 2500000, courses: 15000, instructors: 5000, countries: 195 };
      const duration = 2000;
      const steps = 60;
      const stepDuration = duration / steps;

      Object.keys(targetStats).forEach(key => {
        let current = 0;
        const increment = targetStats[key] / steps;
        
        const timer = setInterval(() => {
          current += increment;
          if (current >= targetStats[key]) {
            current = targetStats[key];
            clearInterval(timer);
          }
          setStats(prev => ({ ...prev, [key]: Math.floor(current) }));
        }, stepDuration);
      });
    }
  }, [statsVisible]);

  const heroSlides = [
    {
      title: "AI-Powered Learning Revolution",
      subtitle: "Experience the future of education with personalized AI tutoring",
      description: "Our advanced AI analyzes your learning patterns to create the perfect educational journey",
      cta: "Start Your AI Journey",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      icon: "🤖"
    },
    {
      title: "Virtual Reality Classrooms",
      subtitle: "Step into immersive learning environments",
      description: "Learn complex concepts through interactive VR experiences and 3D simulations",
      cta: "Enter VR Learning",
      background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      icon: "🥽"
    },
    {
      title: "Blockchain Verified Certificates",
      subtitle: "Tamper-proof credentials for the digital age",
      description: "Earn certificates that are permanently verified on the blockchain",
      cta: "Explore Certificates",
      background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
      icon: "🔗"
    },
    {
      title: "Global Expert Network",
      subtitle: "Learn from industry leaders worldwide",
      description: "Connect with top professionals and get mentored by the best in your field",
      cta: "Meet Experts",
      background: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
      icon: "🌍"
    }
  ];

  const features = [
    {
      icon: "🧠",
      title: "Adaptive AI Learning",
      description: "Our AI continuously adapts to your learning style, pace, and preferences",
      details: ["Personalized curriculum", "Real-time difficulty adjustment", "Predictive analytics"],
      color: "#667eea"
    },
    {
      icon: "🎯",
      title: "Skill-Based Matching",
      description: "Advanced algorithms match you with perfect courses based on your goals",
      details: ["Career path optimization", "Skill gap analysis", "Industry alignment"],
      color: "#f093fb"
    },
    {
      icon: "🌐",
      title: "Metaverse Integration",
      description: "Learn in virtual worlds with immersive 3D environments",
      details: ["VR/AR experiences", "Virtual labs", "Social learning spaces"],
      color: "#4facfe"
    },
    {
      icon: "⚡",
      title: "Quantum Computing Ready",
      description: "Prepare for the future with quantum computing courses",
      details: ["Quantum algorithms", "Future-proof skills", "Cutting-edge research"],
      color: "#43e97b"
    },
    {
      icon: "🔮",
      title: "Predictive Career Insights",
      description: "AI predicts future job trends and recommends relevant skills",
      details: ["Market analysis", "Trend prediction", "Career roadmaps"],
      color: "#ff6b6b"
    },
    {
      icon: "🎨",
      title: "Creative AI Tools",
      description: "Use AI to enhance your creative learning projects",
      details: ["AI art generation", "Code assistance", "Content creation"],
      color: "#feca57"
    }
  ];

  const testimonials = [
    {
      name: "Dr. Sarah Chen",
      role: "AI Research Scientist at Google",
      image: "/api/placeholder/80/80",
      quote: "EduVerse's AI-powered learning helped me transition from traditional programming to quantum computing in just 6 months.",
      rating: 5,
      course: "Quantum Computing Fundamentals"
    },
    {
      name: "Marcus Rodriguez",
      role: "VR Developer at Meta",
      image: "/api/placeholder/80/80",
      quote: "The VR learning environments are incredibly immersive. I learned 3D modeling faster than I ever thought possible.",
      rating: 5,
      course: "Metaverse Development"
    },
    {
      name: "Aisha Patel",
      role: "Blockchain Engineer",
      image: "/api/placeholder/80/80",
      quote: "Having blockchain-verified certificates gave me a huge advantage in job interviews. Employers trust the authenticity.",
      rating: 5,
      course: "Blockchain Architecture"
    }
  ];

  return (
    <div className="homepage">
      {/* Hero Section */}
      <section ref={heroRef} className={`hero-section ${heroVisible ? 'visible' : ''}`}>
        <div className="hero-container">
          <div className="hero-slides">
            {heroSlides.map((slide, index) => (
              <div 
                key={index}
                className={`hero-slide ${index === currentSlide ? 'active' : ''}`}
                style={{ background: slide.background }}
              >
                <div className="hero-content">
                  <div className="hero-icon">{slide.icon}</div>
                  <h1 className="hero-title">{slide.title}</h1>
                  <h2 className="hero-subtitle">{slide.subtitle}</h2>
                  <p className="hero-description">{slide.description}</p>
                  <div className="hero-actions">
                    <button 
                      className="cta-button primary"
                      onClick={() => onPageChange('register')}
                    >
                      {slide.cta}
                    </button>
                    <button 
                      className="cta-button secondary"
                      onClick={() => onPageChange('courses')}
                    >
                      Explore Courses
                    </button>
                  </div>
                </div>
                <div className="hero-visual">
                  <div className="floating-elements">
                    <div className="element element-1">📚</div>
                    <div className="element element-2">🎓</div>
                    <div className="element element-3">⚡</div>
                    <div className="element element-4">🚀</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="hero-navigation">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                className={`nav-dot ${index === currentSlide ? 'active' : ''}`}
                onClick={() => setCurrentSlide(index)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section ref={statsRef} className={`stats-section ${statsVisible ? 'visible' : ''}`}>
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">{stats.students.toLocaleString()}+</div>
              <div className="stat-label">Global Learners</div>
              <div className="stat-icon">👨‍🎓</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">{stats.courses.toLocaleString()}+</div>
              <div className="stat-label">Courses Available</div>
              <div className="stat-icon">📚</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">{stats.instructors.toLocaleString()}+</div>
              <div className="stat-label">Expert Instructors</div>
              <div className="stat-icon">👨‍🏫</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">{stats.countries}+</div>
              <div className="stat-label">Countries Reached</div>
              <div className="stat-icon">🌍</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className={`features-section ${featuresVisible ? 'visible' : ''}`}>
        <div className="container">
          <div className="section-header">
            <h2>Revolutionary Learning Features</h2>
            <p>Experience the future of education with cutting-edge technology</p>
          </div>
          
          <div className="features-grid">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="feature-card"
                style={{ '--accent-color': feature.color }}
              >
                <div className="feature-icon">{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
                <ul className="feature-details">
                  {feature.details.map((detail, idx) => (
                    <li key={idx}>{detail}</li>
                  ))}
                </ul>
                <button className="feature-cta">Learn More</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Course Preview */}
      <section className="course-preview-section">
        <div className="container">
          <div className="section-header">
            <h2>Featured Courses</h2>
            <p>Handpicked courses from our premium collection</p>
          </div>
          
          <div className="courses-carousel">
            {courses.slice(0, 6).map((course, index) => (
              <div key={course._id} className="course-preview-card">
                <div className="course-image">
                  <img src={course.thumbnail || '/api/placeholder/300/200'} alt={course.title} />
                  <div className="course-overlay">
                    <button 
                      className="preview-button"
                      onClick={() => onPageChange('course-detail')}
                    >
                      Preview Course
                    </button>
                  </div>
                </div>
                <div className="course-content">
                  <div className="course-category">{course.category}</div>
                  <h3 className="course-title">{course.title}</h3>
                  <p className="course-instructor">by {course.instructor}</p>
                  <div className="course-meta">
                    <span className="course-rating">
                      ⭐ {course.rating?.toFixed(1)}
                    </span>
                    <span className="course-duration">
                      🕒 {course.duration}h
                    </span>
                    <span className="course-level">{course.level}</span>
                  </div>
                  <div className="course-price">${course.price}</div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="section-footer">
            <button 
              className="view-all-button"
              onClick={() => onPageChange('courses')}
            >
              View All Courses
            </button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials-section">
        <div className="container">
          <div className="section-header">
            <h2>Success Stories</h2>
            <p>Hear from learners who transformed their careers</p>
          </div>
          
          <div className="testimonials-grid">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="testimonial-card">
                <div className="testimonial-header">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name}
                    className="testimonial-avatar"
                  />
                  <div className="testimonial-info">
                    <h4 className="testimonial-name">{testimonial.name}</h4>
                    <p className="testimonial-role">{testimonial.role}</p>
                    <div className="testimonial-rating">
                      {'⭐'.repeat(testimonial.rating)}
                    </div>
                  </div>
                </div>
                <blockquote className="testimonial-quote">
                  "{testimonial.quote}"
                </blockquote>
                <div className="testimonial-course">
                  Course: {testimonial.course}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Transform Your Future?</h2>
            <p>Join millions of learners who are already building tomorrow's skills today</p>
            <div className="cta-actions">
              <button 
                className="cta-button primary large"
                onClick={() => onPageChange('register')}
              >
                Start Learning Now
              </button>
              <button 
                className="cta-button secondary large"
                onClick={() => onPageChange('courses')}
              >
                Explore Free Courses
              </button>
            </div>
          </div>
          <div className="cta-visual">
            <div className="floating-icons">
              <span className="icon">🚀</span>
              <span className="icon">💡</span>
              <span className="icon">🎯</span>
              <span className="icon">⚡</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
