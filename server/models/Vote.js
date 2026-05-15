import mongoose from 'mongoose';

const voteSchema = new mongoose.Schema(
  {
    userId:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    targetId:  { type: mongoose.Schema.Types.ObjectId, required: true },        // postId or commentId
    targetType:{ type: String, enum: ['post', 'comment'], required: true },
    value:     { type: Number, enum: [1, -1], required: true },                 // 1=up, -1=down
  },
  { timestamps: true }
);

// Unique: one vote per user per target
voteSchema.index({ userId: 1, targetId: 1, targetType: 1 }, { unique: true });

export default mongoose.model('Vote', voteSchema);
