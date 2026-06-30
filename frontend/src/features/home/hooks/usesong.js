import { getSong } from "../service/song.api";
import { useContext } from 'react';
import { SongContext } from '../song.context'

export const useSong = () => {
    const context = useContext(SongContext)

    const { loading, setLoading, song, setSong } = context

    async function handleGetSong({ mood }) {
        setLoading(true)
        try {
            const data = await getSong({ mood })
            if (data && data.song) {
                setSong(data.song)
            }
        } catch (error) {
            console.error("Error fetching song:", error)
        } finally {
            setLoading(false)
        }
    }

    return { loading, song, handleGetSong }
}