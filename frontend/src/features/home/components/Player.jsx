import React, { useRef, useState, useEffect, useContext } from 'react'
import { SongContext } from '../song.context'

const Player = () => {
  const { playlist, currentSongIndex, setCurrentSongIndex, song } = useContext(SongContext)
  const audioRef = useRef(null)
  
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [speed, setSpeed] = useState(1)
  const [volume, setVolume] = useState(0.8)

  // Sync song URL change
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.load()
      audioRef.current.playbackRate = speed
      if (isPlaying) {
        audioRef.current.play().catch(err => console.log("Play failed:", err))
      }
    }
  }, [song])

  // Sync speed changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = speed
    }
  }, [speed])

  const togglePlay = () => {
    if (!audioRef.current) return
    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play().catch(err => console.log("Play failed:", err))
    }
    setIsPlaying(!isPlaying)
  }

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime)
    }
  }

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration)
    }
  }

  const handleSeek = (e) => {
    const time = parseFloat(e.target.value)
    if (audioRef.current) {
      audioRef.current.currentTime = time
      setCurrentTime(time)
    }
  }

  const skipForward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.min(audioRef.current.currentTime + 5, duration)
    }
  }

  const skipBackward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(audioRef.current.currentTime - 5, 0)
    }
  }

  const skipNext = () => {
    if (playlist && currentSongIndex < playlist.length - 1) {
      setCurrentSongIndex(currentSongIndex + 1)
      setIsPlaying(true) // Keep playing when skipping
    }
  }

  const skipPrev = () => {
    if (playlist && currentSongIndex > 0) {
      setCurrentSongIndex(currentSongIndex - 1)
      setIsPlaying(true) // Keep playing when skipping
    }
  }

  const handleTrackEnded = () => {
    if (playlist && currentSongIndex < playlist.length - 1) {
      setCurrentSongIndex(currentSongIndex + 1)
      setIsPlaying(true)
    } else {
      setIsPlaying(false)
    }
  }

  const formatTime = (time) => {
    if (isNaN(time)) return '0:00'
    const mins = Math.floor(time / 60)
    const secs = Math.floor(time % 60)
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`
  }

  if (!song) {
    return (
      <div style={styles.noSong}>
        <p>No song loaded. Scan your face to find a playlist matching your mood!</p>
      </div>
    )
  }

  return (
    <div style={styles.container}>
      <audio
        ref={audioRef}
        src={song.url}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleTrackEnded}
      />

      {/* Album Art & Details */}
      <div style={styles.songDetails}>
        <div style={{
          ...styles.posterContainer,
          animation: isPlaying ? 'spin 12s linear infinite' : 'none'
        }}>
          <img
            src={song.posterUrl}
            alt={song.title}
            style={styles.poster}
          />
        </div>
        <div style={styles.textDetails}>
          <h3 style={styles.title}>{song.title}</h3>
          <span style={styles.moodBadge}>
            {song.mood.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Progress Slider */}
      <div style={styles.progressArea}>
        <span style={styles.timeLabel}>{formatTime(currentTime)}</span>
        <input
          type="range"
          min="0"
          max={duration || 100}
          value={currentTime}
          onChange={handleSeek}
          style={styles.slider}
        />
        <span style={styles.timeLabel}>{formatTime(duration)}</span>
      </div>

      {/* Controls Container (Playback buttons centered) */}
      <div style={styles.controlsArea}>
        <div style={styles.playbackButtons}>
          {/* Previous Track */}
          <button 
            onClick={skipPrev} 
            disabled={currentSongIndex === 0} 
            style={{ ...styles.controlButton, opacity: currentSongIndex === 0 ? 0.3 : 1 }} 
            title="Previous Track"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
            </svg>
          </button>

          {/* Skip Backward 5s */}
          <button onClick={skipBackward} style={styles.controlButton} title="Backward 5s">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M11 18V6l-8.5 6 8.5 6zm.5-6l8.5 6V6l-8.5 6z"/>
            </svg>
            <span style={styles.skipSec}>-5s</span>
          </button>

          {/* Play / Pause */}
          <button onClick={togglePlay} style={styles.playButton} title={isPlaying ? "Pause" : "Play"}>
            {isPlaying ? (
              <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
              </svg>
            ) : (
              <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" style={{ marginLeft: '4px' }}>
                <path d="M8 5v14l11-7z"/>
              </svg>
            )}
          </button>

          {/* Skip Forward 5s */}
          <button onClick={skipForward} style={styles.controlButton} title="Forward 5s">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M4 18l8.5-6L4 6v12zm9-12v12l8.5-6L13 6z"/>
            </svg>
            <span style={styles.skipSec}>+5s</span>
          </button>

          {/* Next Track */}
          <button 
            onClick={skipNext} 
            disabled={playlist && currentSongIndex === playlist.length - 1} 
            style={{ ...styles.controlButton, opacity: (playlist && currentSongIndex === playlist.length - 1) ? 0.3 : 1 }} 
            title="Next Track"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 18l8.5-6L6 6zm9-12h2v12h-2z"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Extra Secondary Controls (Speed and Volume in a separated row) */}
      <div style={styles.extraControlsArea}>
        {/* Speed Option */}
        <div style={styles.speedControl}>
          <span style={styles.speedLabel}>Speed:</span>
          <select
            value={speed}
            onChange={(e) => setSpeed(parseFloat(e.target.value))}
            style={styles.speedSelect}
          >
            <option value="0.5">0.5x</option>
            <option value="0.75">0.75x</option>
            <option value="1">1.0x (Normal)</option>
            <option value="1.25">1.25x</option>
            <option value="1.5">1.5x</option>
            <option value="2">2.0x</option>
          </select>
        </div>

        {/* Volume controls */}
        <div style={styles.volumeControl}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{ opacity: 0.7 }}>
            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
          </svg>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            onChange={(e) => {
              const v = parseFloat(e.target.value)
              setVolume(v)
              if (audioRef.current) audioRef.current.volume = v
            }}
            style={styles.volumeSlider}
          />
        </div>
      </div>

      {/* Playlist Queue */}
      {playlist && playlist.length > 0 && (
        <div style={styles.queueContainer}>
          <h4 style={styles.queueHeader}>Up Next ({playlist.length} songs)</h4>
          <div style={styles.queueList}>
            {playlist.map((track, idx) => (
              <div
                key={idx}
                onClick={() => {
                  setCurrentSongIndex(idx)
                  setIsPlaying(true)
                }}
                style={{
                  ...styles.queueItem,
                  ...(idx === currentSongIndex ? styles.activeQueueItem : {})
                }}
              >
                <img src={track.posterUrl} alt="" style={styles.queueItemPoster} />
                <div style={styles.queueItemInfo}>
                  <span style={{
                    ...styles.queueItemTitle,
                    ...(idx === currentSongIndex ? styles.activeQueueItemTitle : {})
                  }}>
                    {track.title}
                  </span>
                  <span style={styles.queueItemMood}>{track.mood}</span>
                </div>
                {idx === currentSongIndex && (
                  <span style={styles.playingBadge}>Playing</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Adding Rotation Keyframes into DOM */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

const styles = {
  container: {
    background: 'rgba(25, 25, 25, 0.85)',
    backdropFilter: 'blur(16px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '20px',
    padding: '24px',
    width: '100%',
    maxWidth: '480px',
    margin: '30px auto',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    fontFamily: 'system-ui, sans-serif',
    color: '#fff',
  },
  noSong: {
    textAlign: 'center',
    padding: '20px',
    color: '#aaa',
  },
  songDetails: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  posterContainer: {
    width: '64px',
    height: '64px',
    borderRadius: '50%',
    overflow: 'hidden',
    border: '2px solid rgba(221, 66, 0, 0.7)',
    boxShadow: '0 0 15px rgba(221, 66, 0, 0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'transform 0.5s ease',
  },
  poster: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  textDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    alignItems: 'flex-start',
  },
  title: {
    fontSize: '18px',
    fontWeight: '600',
    margin: 0,
    letterSpacing: '-0.5px',
    textAlign: 'left',
  },
  moodBadge: {
    fontSize: '11px',
    fontWeight: '700',
    padding: '3px 8px',
    borderRadius: '12px',
    background: '#dd4200',
    color: '#fff',
    letterSpacing: '0.5px',
  },
  progressArea: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    width: '100%',
  },
  timeLabel: {
    fontSize: '12px',
    color: '#aaa',
    minWidth: '35px',
  },
  slider: {
    flex: 1,
    height: '6px',
    borderRadius: '3px',
    background: '#444',
    outline: 'none',
    cursor: 'pointer',
    accentColor: '#dd4200',
  },
  controlsArea: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    margin: '4px 0',
  },
  extraControlsArea: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    borderTop: '1px solid rgba(255, 255, 255, 0.05)',
    paddingTop: '14px',
    marginTop: '4px',
  },
  speedControl: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  speedLabel: {
    fontSize: '12px',
    color: '#aaa',
  },
  speedSelect: {
    background: '#333',
    border: '1px solid #555',
    color: '#fff',
    borderRadius: '6px',
    padding: '4px 8px',
    fontSize: '12px',
    cursor: 'pointer',
    outline: 'none',
  },
  playbackButtons: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  controlButton: {
    background: 'none',
    border: 'none',
    color: '#ccc',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    transition: 'color 0.2s, transform 0.1s',
    outline: 'none',
    padding: '4px',
  },
  skipSec: {
    fontSize: '9px',
    marginTop: '2px',
    fontWeight: 'bold',
  },
  playButton: {
    background: '#dd4200',
    border: 'none',
    color: '#fff',
    width: '52px',
    height: '52px',
    borderRadius: '50%',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'transform 0.2s, background-color 0.2s, box-shadow 0.2s',
    boxShadow: '0 4px 15px rgba(221, 66, 0, 0.4)',
    outline: 'none',
  },
  volumeControl: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  volumeSlider: {
    width: '80px',
    height: '4px',
    accentColor: '#dd4200',
    cursor: 'pointer',
  },
  queueContainer: {
    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
    paddingTop: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  queueHeader: {
    fontSize: '12px',
    fontWeight: '700',
    color: '#aaa',
    margin: 0,
    textTransform: 'uppercase',
    letterSpacing: '1px',
    textAlign: 'left',
  },
  queueList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    maxHeight: '150px',
    overflowY: 'auto',
    paddingRight: '4px',
  },
  queueItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '8px 12px',
    borderRadius: '10px',
    cursor: 'pointer',
    background: 'rgba(255, 255, 255, 0.02)',
    transition: 'background 0.2s, transform 0.1s',
    border: '1px solid transparent',
  },
  activeQueueItem: {
    background: 'rgba(221, 66, 0, 0.12)',
    borderColor: 'rgba(221, 66, 0, 0.3)',
  },
  queueItemPoster: {
    width: '36px',
    height: '36px',
    borderRadius: '6px',
    objectFit: 'cover',
  },
  queueItemInfo: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    alignItems: 'flex-start',
    overflow: 'hidden',
  },
  queueItemTitle: {
    fontSize: '13px',
    fontWeight: '500',
    color: '#eee',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    width: '100%',
    textAlign: 'left',
  },
  activeQueueItemTitle: {
    color: '#ff6a00',
    fontWeight: '600',
  },
  queueItemMood: {
    fontSize: '10px',
    color: '#aaa',
    textTransform: 'uppercase',
  },
  playingBadge: {
    fontSize: '10px',
    fontWeight: '700',
    color: '#ff6a00',
    background: 'rgba(221, 66, 0, 0.15)',
    padding: '2px 6px',
    borderRadius: '8px',
  }
}

export default Player