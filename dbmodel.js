import mongoose from "mongoose";

const shortVideoSchema = mongoose.Schema({
    url: String,
    channel: String,
    song: String,
    likes: String,
    messages: String,
    description: String,
    shares: String
})

export default mongoose.model('shortVideo', shortVideoSchema)