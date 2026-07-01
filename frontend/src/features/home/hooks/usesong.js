import { getSong } from "../service/song.api";
import { useContext } from 'react';
import { SongContext } from '../song.context'

export const useSong = () => {
    const context = useContext(SongContext)

    const { loading, setLoading, playlist, setPlaylist, currentSongIndex, setCurrentSongIndex, song } = context

    async function handleGetSong({ mood }) {
        setLoading(true)
        try {
            const data = await getSong({ mood })
            if (data && data.songs && data.songs.length > 0) {
                setPlaylist(data.songs)
                setCurrentSongIndex(0)
            }
        } catch (error) {
            console.error("Error fetching playlist:", error)
        } finally {
            setLoading(false)
        }
    }

    return { loading, playlist, currentSongIndex, setCurrentSongIndex, song, handleGetSong }
}