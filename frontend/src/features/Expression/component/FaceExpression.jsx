import { useEffect, useRef, useState } from "react";
import {detect , init} from "../utils/utils.js"
import { useSong } from "../../home/hooks/usesong"

export default function FaceExpression() {
    const videoRef = useRef(null);
    const landmarkerRef = useRef(null);
    const streamRef = useRef(null);
    
    const [expression, setExpression] = useState("Ready");
    const { handleGetSong } = useSong();

    useEffect(() => {
        if (expression && expression !== "Ready" && expression !== "No Face Detected" && expression !== "Neutral") {
            const moodMap = {
                "Happy": "happy",
                "Happy 😄": "happy",
                "Sad": "sad",
                "Sad 😢": "sad",
                "Surprised": "surprised",
                "Surprised 😲": "surprised"
            };
            const mood = moodMap[expression];
            if (mood) {
                handleGetSong({ mood });
            }
        }
    }, [expression]);

    useEffect(() => {
        const currentVideoElement = videoRef.current;
        init({landmarkerRef,videoRef,streamRef});
        return () => {
            if (landmarkerRef.current) {
                landmarkerRef.current.close();
            }
            if (currentVideoElement?.srcObject) {
                currentVideoElement.srcObject
                    .getTracks()
                    .forEach((track) => track.stop());
            }
        };
    }, []);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
            <video
                ref={videoRef}
                style={{ 
                    width: "100%", 
                    maxWidth: "380px", 
                    borderRadius: "16px",
                    border: '2px solid rgba(255, 255, 255, 0.1)',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
                    backgroundColor: '#000'
                }}
                playsInline
            />
            <h2 style={{ fontSize: '22px', fontWeight: '700', color: '#ff6a00', margin: '10px 0 0 0' }}>
                {expression}
            </h2>
            <button 
                onClick={() => detect({landmarkerRef,videoRef,setExpression})}
                style={{
                    background: 'linear-gradient(135deg, #dd4200, #ff6a00)',
                    border: 'none',
                    color: '#fff',
                    padding: '12px 28px',
                    fontSize: '16px',
                    fontWeight: '600',
                    borderRadius: '30px',
                    cursor: 'pointer',
                    boxShadow: '0 4px 15px rgba(221, 66, 0, 0.4)',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    outline: 'none',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(221, 66, 0, 0.6)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 15px rgba(221, 66, 0, 0.4)'; }}
            >
                Detect Expression
            </button>
        </div>
    );
}