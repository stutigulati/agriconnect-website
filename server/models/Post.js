import mongoose from 'mongoose';

const postSchema = new mongoose.Schema(
  {
    title:         { type: String, required: true, trim: true, maxlength: 180 },
    description:   { type: String, required: true, trim: true, maxlength: 3000 },
    imageUrl:      { type: String, default: '' },
    userId:        { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    tags:          [{ type: String, trim: true }],
    region:        { type: String, default: 'General' },
    upvotes:       { type: Number, default: 0 },
    downvotes:     { type: Number, default: 0 },
    commentsCount: { type: Number, default: 0 },
    savedBy:       [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    shareCount:    { type: Number, default: 0 },
  },
  { timestamps: true }
);

postSchema.index({ createdAt: -1 });
postSchema.index({ upvotes: -1 });
postSchema.index({ tags: 1 });
postSchema.index({ region: 1 });

export default mongoose.model('Post', postSchema);
