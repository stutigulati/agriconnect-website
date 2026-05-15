import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema(
  {
    userId:          { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    postId:          { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
    parentCommentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment', default: null },
    content:         { type: String, required: true, trim: true, maxlength: 1000 },
    upvotes:         { type: Number, default: 0 },
    downvotes:       { type: Number, default: 0 },
    depth:           { type: Number, default: 0 },   // 0=top-level, 1=reply, 2=nested reply
  },
  { timestamps: true }
);

commentSchema.index({ postId: 1, createdAt: 1 });
commentSchema.index({ parentCommentId: 1 });

export default mongoose.model('Comment', commentSchema);
