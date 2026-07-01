const songModel = require("../models/song.model")
const storageService = require("../services/storage.service")
const id3 = require("node-id3")

async function uploadSong(req, res) {

    const songBuffer = req.file.buffer
    const mood = req.body.mood?.toLowerCase().trim() || undefined
    const tags = id3.read(songBuffer)
    const title = tags.title || req.file.originalname.replace(/\.[^/.]+$/, "")

    const [ songFile, posterFile ] = await Promise.all([
        storageService.uploadFile({
            buffer: songBuffer,
            filename: title + ".mp3",
            folder: "/cohort-2/moodify/songs"
        }),
        tags.image?.imageBuffer ? storageService.uploadFile({
            buffer: tags.image.imageBuffer,
            filename: title + ".jpg",
            folder: "/cohort-2/moodify/posters"
        }) : { url: "https://imgs.search.brave.com/pzaGAX0z7xQ4EyGDItXc5KazrQhXDz2A3LTnTz8WS2U/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/bGl2ZW1pbnQuY29t/L2xtLWltZy9pbWcv/MjAyNi8wMy8xMC82/MDB4MzM4L1NjcmVl/bnNob3RfMjAyNi0w/My0xMF8xNjA5NTNf/MTc3MzEzOTI4NTcy/M18xNzczMTM5Mjkx/NDkxLnBuZw" }
    ])
    const song = await songModel.create({
        title,
        url: songFile.url,
        posterUrl: posterFile.url,
        mood
    })

    res.status(201).json({
        message: "Song uploaded successfully",
        song
    })


}

async function getSongs(req , res){
    const { mood } = req.query

    const songs = await songModel.find({
        mood 
    })

    res.status(200).json({
        message :"Songs fetched Successfully",
        songs
    })
}

module.exports = { uploadSong , getSongs}