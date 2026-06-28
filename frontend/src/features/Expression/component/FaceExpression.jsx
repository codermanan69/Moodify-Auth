import { useEffect, useRef, useState } from "react";
import {detect , init} from "../utils/utils.js"

export default function FaceExpression() {
    const videoRef = useRef(null);
    const landmarkerRef = useRef(null);
    const streamRef = useRef(null);
    
    const [expression, setExpression] = useState("Ready");


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
        <div style={{ textAlign: "center" }}>
            <video
                ref={videoRef}
                style={{ width: "400px", borderRadius: "12px" }}
                playsInline
            />
            <h2>{expression}</h2>
            <button onClick={() => detect({landmarkerRef,videoRef,setExpression})}>Detect expression</button>
        </div>
    );
}