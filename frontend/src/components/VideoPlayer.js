import React, { useState, useRef, useEffect } from 'react';
import '../styles/VideoPlayer.css';

const VideoPlayer = ({ videoUrl, title, onProgress, onComplete, currentTime = 0 }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentVideoTime, setCurrentVideoTime] = useState(currentTime);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [isBuffering, setIsBuffering] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (video && currentTime > 0) {
      video.currentTime = currentTime;
    }
  }, [currentTime]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    setCurrentVideoTime(video.currentTime);
    
    // Report progress to parent component
    if (onProgress) {
      const progress = (video.currentTime / video.duration) * 100;
      onProgress(progress, video.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    const video = videoRef.current;
    setDuration(video.duration);
  };

  const handleEnded = () => {
    setIsPlaying(false);
    if (onComplete) {
      onComplete();
    }
  };

  const handleSeek = (e) => {
    const video = videoRef.current;
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    video.currentTime = percent * video.duration;
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    videoRef.current.volume = newVolume;
  };

  const toggleFullscreen = () => {
    const video = videoRef.current;
    if (!document.fullscreenElement) {
      video.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const changePlaybackRate = (rate) => {
    setPlaybackRate(rate);
    videoRef.current.playbackRate = rate;
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleWaiting = () => setIsBuffering(true);
  const handleCanPlay = () => setIsBuffering(false);

  return (
    <div className="video-player-container">
      <div 
        className="video-wrapper"
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
      >
        <video
          ref={videoRef}
          src={videoUrl}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={handleEnded}
          onWaiting={handleWaiting}
          onCanPlay={handleCanPlay}
          className="video-element"
        />
        
        {isBuffering && (
          <div className="buffering-indicator">
            <div className="spinner"></div>
            <span>Loading...</span>
          </div>
        )}

        {showControls && (
          <div className="video-controls">
            <div className="progress-bar" onClick={handleSeek}>
              <div 
                className="progress-filled"
                style={{ width: `${(currentVideoTime / duration) * 100}%` }}
              ></div>
            </div>
            
            <div className="controls-row">
              <div className="left-controls">
                <button onClick={togglePlay} className="play-btn">
                  {isPlaying ? '⏸️' : '▶️'}
                </button>
                
                <div className="volume-control">
                  <span>🔊</span>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="volume-slider"
                  />
                </div>
                
                <div className="time-display">
                  {formatTime(currentVideoTime)} / {formatTime(duration)}
                </div>
              </div>
              
              <div className="right-controls">
                <div className="speed-control">
                  <select 
                    value={playbackRate} 
                    onChange={(e) => changePlaybackRate(parseFloat(e.target.value))}
                    className="speed-select"
                  >
                    <option value={0.5}>0.5x</option>
                    <option value={0.75}>0.75x</option>
                    <option value={1}>1x</option>
                    <option value={1.25}>1.25x</option>
                    <option value={1.5}>1.5x</option>
                    <option value={2}>2x</option>
                  </select>
                </div>
                
                <button onClick={toggleFullscreen} className="fullscreen-btn">
                  {isFullscreen ? '🗗' : '⛶'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="video-info">
        <h3>{title}</h3>
      </div>
    </div>
  );
};

export default VideoPlayer;
