import { Schema, model, models } from 'mongoose';

// Define the Blog schema
const BlogSchema = new Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
    },
    content: {
        type: String,
        required: [true, 'Content is required'],
    },
    author: {
        type: String,
        required: [true, 'Author is required'],
    },
    tags: {
        type: [String],
        default: [],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    }
})

// Check if the model exists before creating a new one
const Blog = models.Blog || model('Blog', BlogSchema);

export default Blog;