import { createContext, useState } from 'react';

export const SongContext = createContext()

export const SongContextProvider = ({ children }) => {
    const [playlist, setPlaylist] = useState([
        {
            "url": "https://ik.imagekit.io/2oqkubezc/cohort-2/moodify/songs/Matargashti_-_PagalNew_c-dKSafnO.mp3",
            "posterUrl": "https://ik.imagekit.io/2oqkubezc/cohort-2/moodify/posters/Matargashti_-_PagalNew_W0LE2fnBq.jpg",
            "title": "Matargashti - PagalNew",
            "mood": "happy",
        }
    ])
    const [currentSongIndex, setCurrentSongIndex] = useState(0)
    const [loading, setLoading] = useState(false)

    const song = playlist[currentSongIndex] || null

    return (
        <SongContext.Provider
            value={{ 
                loading, 
                setLoading, 
                playlist, 
                setPlaylist, 
                currentSongIndex, 
                setCurrentSongIndex, 
                song 
            }}
        >

            {children}
        </SongContext.Provider>
    )
}