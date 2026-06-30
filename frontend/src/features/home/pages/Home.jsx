import React from 'react';
import FaceExpression from '../../Expression/component/FaceExpression';
import Player from '../components/Player';

const Home = () => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '40px 20px',
      background: 'radial-gradient(circle at top, #1e1e30, #0a0a0f)',
      fontFamily: 'system-ui, sans-serif',
      color: '#fff',
      gap: '24px'
    }}>
      <div style={{
        textAlign: 'center',
        marginBottom: '20px'
      }}>
        <h1 style={{
          fontSize: '42px',
          fontWeight: '800',
          background: 'linear-gradient(135deg, #ff7e5f, #feb47b)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          margin: '0 0 10px 0',
          letterSpacing: '-1px'
        }}>Moodify</h1>
        <p style={{ color: '#aaa', fontSize: '16px' }}>Scan your face to detect your expression and automatically match a song!</p>
      </div>

      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'flex-start',
        gap: '40px',
        maxWidth: '1000px',
        width: '100%'
      }}>
        {/* Webcam / Detection card */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.03)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '24px',
          padding: '30px 24px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px',
          minWidth: '320px',
          flex: 1
        }}>
          <FaceExpression />
        </div>

        {/* Player card */}
        <div style={{ flex: 1, maxWidth: '480px', width: '100%' }}>
          <Player />
        </div>
      </div>
    </div>
  );
};

export default Home;
