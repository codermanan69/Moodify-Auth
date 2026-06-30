import { createContext, useState } from 'react';

export const SongContext = createContext()

export const SongContextProvider = ({ children }) => {
    const [song, setSong] = useState({
        "url": "https://ik.imagekit.io/2oqkubezc/cohort-2/moodify/songs/Matargashti_-_PagalNew_c-dKSafnO.mp3",
        "posterUrl": "https://ik.imagekit.io/2oqkubezc/cohort-2/moodify/posters/Matargashti_-_PagalNew_W0LE2fnBq.jpg",
        "title": "Matargashti - PagalNew",
        "mood": "happy",
    })

    const [loading, setLoading] = useState(false)


    return (
        <SongContext.Provider
            value={{ loading, setLoading, song, setSong }}
        >

            {children}
        </SongContext.Provider>
    )
}