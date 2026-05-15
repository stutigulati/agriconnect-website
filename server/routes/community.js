import express from 'express';
import jwt from 'jsonwebtoken';
import Comment from '../models/Comment.js';
import Vote from '../models/Vote.js';
import Post from '../models/Post.js';
import User from '../models/User.js';
import { authMiddleware, optionalAuth } from '../middleware/auth.js';
import { uploadS3, getUploadedFileUrl } from '../config/s3.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'agriconnect-dev-secret';

// ─── Helpers ──────────────────────────────────────────────────────────────────
function buildRoleBadge(role) {
  if (role === 'Agronomist') return { text: 'Agronomist', tone: 'emerald' };
  if (role === 'Buyer')      return { text: 'Buyer',      tone: 'amber'   };
  return                            { text: 'Farmer',     tone: 'green'   };
}

function signToken(userId) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
}

async function getUserVote(userId, targetId, targetType) {
  if (!userId) return 0;
  const v = await Vote.findOne({ userId, targetId, targetType });
  return v ? v.value : 0;
}

async function toPostDto(post, currentUserId) {
  const author = post.userId;

  // Guard: if populate failed or user was deleted, skip this post
  if (!author || !author._id) return null;

  const [userVote, isSaved] = await Promise.all([
    getUserVote(currentUserId, post._id, 'post'),
    currentUserId ? post.savedBy?.some(id => String(id) === String(currentUserId)) : false,
  ]);

  return {
    id:            post._id,
    title:         post.title,
    description:   post.description,
    imageUrl:      post.imageUrl,
    tags:          post.tags,
    region:        post.region,
    upvotes:       post.upvotes,
    downvotes:     post.downvotes,
    score:         post.upvotes - post.downvotes,
    commentsCount: post.commentsCount,
    shareCount:    post.shareCount || 0,
    createdAt:     post.createdAt,
    userVote,
    isSaved,
    author: {
      id:           author._id,
      name:         author.name,
      role:         author.role,
      roleBadge:    buildRoleBadge(author.role),
      profileImage: author.profileImage,
      location:     author.location,
      isVerified:   author.isVerified,
    },
  };
}

function mapComment(comment, byParent, currentUserId, voteMap) {
  const key = String(comment._id);
  const replies = (byParent.get(key) || []).map(c => mapComment(c, byParent, currentUserId, voteMap));
  return {
    id:              comment._id,
    postId:          comment.postId,
    content:         comment.content,
    createdAt:       comment.createdAt,
    upvotes:         comment.upvotes,
    downvotes:       comment.downvotes,
    depth:           comment.depth || 0,
    parentCommentId: comment.parentCommentId,
    userVote:        voteMap[key] || 0,
    user: {
      id:           comment.userId._id,
      name:         comment.userId.name,
      role:         comment.userId.role,
      roleBadge:    buildRoleBadge(comment.userId.role),
      profileImage: comment.userId.profileImage,
      isVerified:   comment.userId.isVerified,
    },
    isVerifiedExpertAnswer: comment.userId.role === 'Agronomist' && comment.userId.isVerified,
    replies,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// AUTH ROUTES
// ─────────────────────────────────────────────────────────────────────────────

// Demo login — no password
router.post('/auth/demo-login', async (req, res) => {
  try {
    const { name, role, location } = req.body;
    const email = `${(name || 'farmer').toLowerCase().replace(/\s+/g, '.')}@demo.agriconnect.local`;
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        name:     name     || 'Demo Farmer',
        email,
        role:     role     || 'Farmer',
        location: location || 'Madhya Pradesh',
        isVerified: role === 'Agronomist',
      });
    }
    res.json({ token: signToken(user._id), user: { id: user._id, name: user.name, role: user.role, location: user.location, profileImage: user.profileImage, roleBadge: buildRoleBadge(user.role) } });
  } catch (err) {
    console.error('demo-login:', err);
    res.status(500).json({ message: 'Login failed' });
  }
});

// Register
router.post('/auth/register', async (req, res) => {
  try {
    const { name, email, password, role, location } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'Name, email, and password are required' });
    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) return res.status(409).json({ message: 'Email already registered' });
    const user = await User.create({ name, email, password, role: role || 'Farmer', location: location || 'India' });
    res.status(201).json({ token: signToken(user._id), user: { id: user._id, name: user.name, role: user.role, location: user.location, profileImage: user.profileImage, roleBadge: buildRoleBadge(user.role) } });
  } catch (err) {
    console.error('register:', err);
    res.status(500).json({ message: 'Registration failed' });
  }
});

// Login
router.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' });
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    const ok = await user.comparePassword(password);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
    res.json({ token: signToken(user._id), user: { id: user._id, name: user.name, role: user.role, location: user.location, profileImage: user.profileImage, roleBadge: buildRoleBadge(user.role) } });
  } catch (err) {
    console.error('login:', err);
    res.status(500).json({ message: 'Login failed' });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// POST ROUTES
// ─────────────────────────────────────────────────────────────────────────────

// GET /posts
router.get('/posts', optionalAuth, async (req, res) => {
  try {
    const { cursor, limit = 8, sort = 'latest', cropType, region, q } = req.query;
    const filters = {};
    if (cropType && cropType !== 'All')       filters.tags   = cropType;
    if (region  && region  !== 'All Regions') filters.region = region;
    if (q) {
      filters.$or = [
        { title:       { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { tags:        { $regex: q, $options: 'i' } },
      ];
    }
    if (cursor && sort === 'latest') filters.createdAt = { $lt: new Date(cursor) };

    const sortBy = sort === 'mostLiked'
      ? { upvotes: -1, createdAt: -1 }
      : { createdAt: -1 };

    const posts = await Post.find(filters)
      .populate('userId')
      .sort(sortBy)
      .limit(Number(limit) + 1);

    const hasMore   = posts.length > Number(limit);
    const pagePosts = hasMore ? posts.slice(0, Number(limit)) : posts;
    const rawPayload = await Promise.all(pagePosts.map(p => toPostDto(p, req.userId)));
    const payload    = rawPayload.filter(Boolean); // remove nulls from broken references
    const nextCursor = hasMore && payload.length > 0 ? payload[payload.length - 1].createdAt : null;

    res.json({ posts: payload, nextCursor, hasMore });
  } catch (err) {
    console.error('GET /posts:', err);
    res.status(500).json({ message: 'Failed to fetch posts' });
  }
});

// POST /posts
router.post('/posts', authMiddleware, uploadS3.single('image'), async (req, res) => {
  try {
    const { title, description, tags = '', region = 'General' } = req.body;
    if (!title?.trim())       return res.status(400).json({ message: 'Title is required' });
    if (!description?.trim()) return res.status(400).json({ message: 'Description is required' });

    const post = await Post.create({
      title:       title.trim(),
      description: description.trim(),
      imageUrl:    getUploadedFileUrl(req.file),
      tags:        tags.split(',').map(t => t.trim()).filter(Boolean),
      region,
      userId:      req.user._id,
    });

    const populated = await Post.findById(post._id).populate('userId');
    res.status(201).json(await toPostDto(populated, req.user._id));
  } catch (err) {
    console.error('POST /posts:', err);
    res.status(500).json({ message: 'Failed to create post' });
  }
});

// DELETE /posts/:postId
router.delete('/posts/:postId', authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (String(post.userId) !== String(req.user._id)) {
      return res.status(403).json({ message: 'You can only delete your own posts' });
    }
    await Promise.all([
      Post.findByIdAndDelete(post._id),
      Comment.deleteMany({ postId: post._id }),
      Vote.deleteMany({ targetId: post._id, targetType: 'post' }),
    ]);
    res.json({ message: 'Post deleted' });
  } catch (err) {
    console.error('DELETE /posts:', err);
    res.status(500).json({ message: 'Failed to delete post' });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// VOTING (posts)
// ─────────────────────────────────────────────────────────────────────────────

router.post('/posts/:postId/vote', authMiddleware, async (req, res) => {
  try {
    const { postId } = req.params;
    const value = Number(req.body.value); // 1 or -1
    if (value !== 1 && value !== -1) return res.status(400).json({ message: 'Vote value must be 1 or -1' });

    const existing = await Vote.findOne({ userId: req.user._id, targetId: postId, targetType: 'post' });

    let upDelta = 0, downDelta = 0, newVote = 0;

    if (existing) {
      if (existing.value === value) {
        // Toggle off
        await Vote.deleteOne({ _id: existing._id });
        if (value === 1) upDelta = -1; else downDelta = -1;
        newVote = 0;
      } else {
        // Switch vote
        existing.value = value;
        await existing.save();
        if (value === 1) { upDelta = 1; downDelta = -1; }
        else             { upDelta = -1; downDelta = 1; }
        newVote = value;
      }
    } else {
      await Vote.create({ userId: req.user._id, targetId: postId, targetType: 'post', value });
      if (value === 1) upDelta = 1; else downDelta = 1;
      newVote = value;
    }

    const post = await Post.findByIdAndUpdate(
      postId,
      { $inc: { upvotes: upDelta, downvotes: downDelta } },
      { new: true }
    );

    res.json({
      upvotes:   Math.max(post.upvotes,   0),
      downvotes: Math.max(post.downvotes, 0),
      userVote:  newVote,
    });
  } catch (err) {
    console.error('POST /vote:', err);
    res.status(500).json({ message: 'Failed to vote' });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// BOOKMARKS / SAVE
// ─────────────────────────────────────────────────────────────────────────────

router.post('/posts/:postId/save', authMiddleware, async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const uid = req.user._id;
    const alreadySaved = post.savedBy.some(id => String(id) === String(uid));

    if (alreadySaved) {
      await Post.findByIdAndUpdate(postId, { $pull: { savedBy: uid } });
      return res.json({ saved: false });
    } else {
      await Post.findByIdAndUpdate(postId, { $addToSet: { savedBy: uid } });
      return res.json({ saved: true });
    }
  } catch (err) {
    console.error('POST /save:', err);
    res.status(500).json({ message: 'Failed to save post' });
  }
});

// Share (increment counter)
router.post('/posts/:postId/share', async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(req.params.postId, { $inc: { shareCount: 1 } }, { new: true });
    res.json({ shareCount: post.shareCount });
  } catch (err) {
    res.status(500).json({ message: 'Failed to track share' });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// COMMENTS
// ─────────────────────────────────────────────────────────────────────────────

// GET comments — nested tree
router.get('/posts/:postId/comments', optionalAuth, async (req, res) => {
  try {
    const comments = await Comment.find({ postId: req.params.postId })
      .populate('userId')
      .sort({ createdAt: 1 });

    // Build vote map for current user
    let voteMap = {};
    if (req.userId && comments.length > 0) {
      const ids = comments.map(c => c._id);
      const votes = await Vote.find({ userId: req.userId, targetId: { $in: ids }, targetType: 'comment' });
      votes.forEach(v => { voteMap[String(v.targetId)] = v.value; });
    }

    const byParent = new Map();
    for (const c of comments) {
      const key = c.parentCommentId ? String(c.parentCommentId) : 'root';
      if (!byParent.has(key)) byParent.set(key, []);
      byParent.get(key).push(c);
    }

    res.json({ comments: (byParent.get('root') || []).map(c => mapComment(c, byParent, req.userId, voteMap)) });
  } catch (err) {
    console.error('GET /comments:', err);
    res.status(500).json({ message: 'Failed to fetch comments' });
  }
});

// POST comment or reply
router.post('/posts/:postId/comments', authMiddleware, async (req, res) => {
  try {
    const { postId } = req.params;
    const { content, parentCommentId = null } = req.body;
    if (!content?.trim()) return res.status(400).json({ message: 'Comment cannot be empty' });

    let depth = 0;
    if (parentCommentId) {
      const parent = await Comment.findById(parentCommentId);
      if (parent) depth = Math.min((parent.depth || 0) + 1, 5); // max 5 levels
    }

    const comment = await Comment.create({
      postId,
      userId:          req.user._id,
      content:         content.trim(),
      parentCommentId: parentCommentId || null,
      depth,
    });

    await Post.findByIdAndUpdate(postId, { $inc: { commentsCount: 1 } });
    const populated = await Comment.findById(comment._id).populate('userId');

    res.status(201).json(mapComment(populated, new Map(), req.user._id, {}));
  } catch (err) {
    console.error('POST /comments:', err);
    res.status(500).json({ message: 'Failed to add comment' });
  }
});

// Vote on comment
router.post('/comments/:commentId/vote', authMiddleware, async (req, res) => {
  try {
    const { commentId } = req.params;
    const value = Number(req.body.value);
    if (value !== 1 && value !== -1) return res.status(400).json({ message: 'Vote value must be 1 or -1' });

    const existing = await Vote.findOne({ userId: req.user._id, targetId: commentId, targetType: 'comment' });

    let upDelta = 0, downDelta = 0, newVote = 0;

    if (existing) {
      if (existing.value === value) {
        await Vote.deleteOne({ _id: existing._id });
        if (value === 1) upDelta = -1; else downDelta = -1;
        newVote = 0;
      } else {
        existing.value = value;
        await existing.save();
        if (value === 1) { upDelta = 1; downDelta = -1; }
        else             { upDelta = -1; downDelta = 1; }
        newVote = value;
      }
    } else {
      await Vote.create({ userId: req.user._id, targetId: commentId, targetType: 'comment', value });
      if (value === 1) upDelta = 1; else downDelta = 1;
      newVote = value;
    }

    const comment = await Comment.findByIdAndUpdate(
      commentId,
      { $inc: { upvotes: upDelta, downvotes: downDelta } },
      { new: true }
    );

    res.json({
      upvotes:   Math.max(comment.upvotes,   0),
      downvotes: Math.max(comment.downvotes, 0),
      userVote:  newVote,
    });
  } catch (err) {
    console.error('POST /comments/vote:', err);
    res.status(500).json({ message: 'Failed to vote on comment' });
  }
});

// DELETE comment
router.delete('/posts/:postId/comments/:commentId', authMiddleware, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });
    if (String(comment.userId) !== String(req.user._id)) {
      return res.status(403).json({ message: 'You can only delete your own comments' });
    }
    await Comment.deleteMany({
      $or: [{ _id: comment._id }, { parentCommentId: comment._id }],
    });
    await Post.findByIdAndUpdate(req.params.postId, { $inc: { commentsCount: -1 } });
    res.json({ message: 'Comment deleted' });
  } catch (err) {
    console.error('DELETE /comments:', err);
    res.status(500).json({ message: 'Failed to delete comment' });
  }
});

export default router;
