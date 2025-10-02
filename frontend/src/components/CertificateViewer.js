import React, { useState, useEffect, useRef } from 'react';
import '../styles/CertificateViewer.css';

const CertificateViewer = ({ certificateId, courseTitle, userName, completionDate, score }) => {
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const canvasRef = useRef(null);

  useEffect(() => {
    if (certificateId) {
      fetchCertificate();
    } else {
      generateCertificate();
    }
  }, [certificateId, courseTitle, userName, completionDate, score]);

  const fetchCertificate = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/certificates/${certificateId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setCertificate(data);
        drawCertificate(data);
      } else {
        setError('Certificate not found');
      }
    } catch (error) {
      setError('Error loading certificate');
    } finally {
      setLoading(false);
    }
  };

  const generateCertificate = () => {
    const certData = {
      id: `CERT-${Date.now()}`,
      courseTitle,
      userName,
      completionDate: completionDate || new Date().toLocaleDateString(),
      score,
      verificationCode: generateVerificationCode()
    };
    setCertificate(certData);
    drawCertificate(certData);
    setLoading(false);
  };

  const generateVerificationCode = () => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  };

  const drawCertificate = (certData) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = 800;
    const height = 600;
    
    canvas.width = width;
    canvas.height = height;

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#f8f9fa');
    gradient.addColorStop(1, '#e9ecef');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Border
    ctx.strokeStyle = '#007bff';
    ctx.lineWidth = 8;
    ctx.strokeRect(20, 20, width - 40, height - 40);

    // Inner border
    ctx.strokeStyle = '#28a745';
    ctx.lineWidth = 2;
    ctx.strokeRect(40, 40, width - 80, height - 80);

    // Title
    ctx.fillStyle = '#2c3e50';
    ctx.font = 'bold 36px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Certificate of Completion', width / 2, 120);

    // Decorative line
    ctx.strokeStyle = '#007bff';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(width / 2 - 150, 140);
    ctx.lineTo(width / 2 + 150, 140);
    ctx.stroke();

    // "This is to certify that"
    ctx.fillStyle = '#6c757d';
    ctx.font = '18px Arial';
    ctx.fillText('This is to certify that', width / 2, 180);

    // Student name
    ctx.fillStyle = '#007bff';
    ctx.font = 'bold 28px Arial';
    ctx.fillText(certData.userName, width / 2, 220);

    // "has successfully completed"
    ctx.fillStyle = '#6c757d';
    ctx.font = '18px Arial';
    ctx.fillText('has successfully completed the course', width / 2, 260);

    // Course title
    ctx.fillStyle = '#28a745';
    ctx.font = 'bold 24px Arial';
    const maxWidth = width - 100;
    const courseTitle = certData.courseTitle;
    
    // Word wrap for long course titles
    const words = courseTitle.split(' ');
    let line = '';
    let y = 300;
    
    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
      
      if (testWidth > maxWidth && n > 0) {
        ctx.fillText(line, width / 2, y);
        line = words[n] + ' ';
        y += 30;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, width / 2, y);

    // Score (if provided)
    if (certData.score) {
      ctx.fillStyle = '#dc3545';
      ctx.font = 'bold 20px Arial';
      ctx.fillText(`with a score of ${certData.score}%`, width / 2, y + 40);
      y += 40;
    }

    // Date
    ctx.fillStyle = '#6c757d';
    ctx.font = '16px Arial';
    ctx.fillText(`Completed on ${certData.completionDate}`, width / 2, y + 60);

    // Verification code
    ctx.fillStyle = '#adb5bd';
    ctx.font = '12px Arial';
    ctx.fillText(`Verification Code: ${certData.verificationCode}`, width / 2, height - 60);

    // Signature line
    ctx.strokeStyle = '#6c757d';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(width / 2 - 100, height - 120);
    ctx.lineTo(width / 2 + 100, height - 120);
    ctx.stroke();

    ctx.fillStyle = '#6c757d';
    ctx.font = '14px Arial';
    ctx.fillText('Course Instructor', width / 2, height - 100);

    // Add decorative elements
    drawSeal(ctx, width - 120, height - 120);
  };

  const drawSeal = (ctx, x, y) => {
    // Outer circle
    ctx.strokeStyle = '#007bff';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(x, y, 40, 0, 2 * Math.PI);
    ctx.stroke();

    // Inner circle
    ctx.strokeStyle = '#28a745';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x, y, 30, 0, 2 * Math.PI);
    ctx.stroke();

    // Star in center
    ctx.fillStyle = '#ffc107';
    drawStar(ctx, x, y, 5, 15, 8);
  };

  const drawStar = (ctx, cx, cy, spikes, outerRadius, innerRadius) => {
    let rot = Math.PI / 2 * 3;
    let x = cx;
    let y = cy;
    const step = Math.PI / spikes;

    ctx.beginPath();
    ctx.moveTo(cx, cy - outerRadius);

    for (let i = 0; i < spikes; i++) {
      x = cx + Math.cos(rot) * outerRadius;
      y = cy + Math.sin(rot) * outerRadius;
      ctx.lineTo(x, y);
      rot += step;

      x = cx + Math.cos(rot) * innerRadius;
      y = cy + Math.sin(rot) * innerRadius;
      ctx.lineTo(x, y);
      rot += step;
    }

    ctx.lineTo(cx, cy - outerRadius);
    ctx.closePath();
    ctx.fill();
  };

  const downloadCertificate = () => {
    const canvas = canvasRef.current;
    const link = document.createElement('a');
    link.download = `certificate-${certificate.id}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  const shareCertificate = async () => {
    if (navigator.share) {
      try {
        const canvas = canvasRef.current;
        canvas.toBlob(async (blob) => {
          const file = new File([blob], `certificate-${certificate.id}.png`, { type: 'image/png' });
          await navigator.share({
            title: 'My Course Certificate',
            text: `I've completed ${certificate.courseTitle}!`,
            files: [file]
          });
        });
      } catch (error) {
        console.error('Error sharing certificate:', error);
      }
    } else {
      // Fallback: copy link to clipboard
      const url = `${window.location.origin}/verify/${certificate.verificationCode}`;
      navigator.clipboard.writeText(url);
      alert('Certificate verification link copied to clipboard!');
    }
  };

  const verifyCertificate = () => {
    const url = `${window.location.origin}/verify/${certificate.verificationCode}`;
    window.open(url, '_blank');
  };

  if (loading) {
    return <div className="loading">Generating certificate...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="certificate-viewer">
      <div className="certificate-container">
        <canvas ref={canvasRef} className="certificate-canvas"></canvas>
      </div>
      
      <div className="certificate-actions">
        <button onClick={downloadCertificate} className="action-btn download-btn">
          📥 Download
        </button>
        <button onClick={shareCertificate} className="action-btn share-btn">
          📤 Share
        </button>
        <button onClick={verifyCertificate} className="action-btn verify-btn">
          ✅ Verify
        </button>
      </div>

      <div className="certificate-info">
        <h3>Certificate Details</h3>
        <div className="info-grid">
          <div className="info-item">
            <span className="label">Certificate ID:</span>
            <span className="value">{certificate.id}</span>
          </div>
          <div className="info-item">
            <span className="label">Verification Code:</span>
            <span className="value">{certificate.verificationCode}</span>
          </div>
          <div className="info-item">
            <span className="label">Issue Date:</span>
            <span className="value">{certificate.completionDate}</span>
          </div>
          {certificate.score && (
            <div className="info-item">
              <span className="label">Final Score:</span>
              <span className="value">{certificate.score}%</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CertificateViewer;
