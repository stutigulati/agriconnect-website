import { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext.jsx';
import {
  FaThumbsUp, FaThumbsDown, FaComment, FaShare, FaBookmark,
  FaRegBookmark, FaChevronDown, FaChevronUp, FaFilter,
  FaPaperPlane, FaTimes, FaCheckCircle, FaMapMarkerAlt,
  FaSearch, FaFire, FaBell, FaLeaf, FaStore,
  FaSeedling, FaExclamationTriangle, FaArrowUp, FaArrowDown,
  FaPlus, FaCamera, FaStar, FaLightbulb, FaCommentDots,
  FaReply, FaLevelDownAlt, FaLock, FaSignInAlt, FaUserPlus,
} from 'react-icons/fa';
import { MdVerified, MdAgriculture } from 'react-icons/md';
import { GiWheat, GiFarmer, GiPlantRoots } from 'react-icons/gi';
import { WiDaySunny, WiRain, WiCloudy } from 'react-icons/wi';
import Navbar from './Navbar';
import Footer from './Footer';
import { getCurrentUser } from '../lib/communityApi';
import { translateText, detectLanguage } from '../lib/translationService';
import {
  POSTS, USERS, CATEGORIES, URGENCY, POST_TYPES,
  MANDI_PRICES, WEATHER_CITIES, TRENDING_TAGS,
  TOP_AGRONOMISTS, CROP_CATEGORIES, REGIONS,
} from '../data/communityData';

// ─── Helpers ──────────────────────────────────────────────────────────────────
function timeAgo(d) {
  const m = Math.floor((Date.now() - new Date(d)) / 60000);
  if (m < 1)  return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}
const getUser = (id) => {
  // First check static users list
  const staticUser = USERS.find(u => u.id === id);
  if (staticUser) return staticUser;
  // Then check if it's the currently logged-in user
  try {
    const cu = getCurrentUser();
    if (cu && (cu.id === id || cu._id === id || String(cu._id) === String(id))) {
      const name = cu.name || 'You';
      return {
        id,
        name,
        role: cu.role || 'Farmer',
        initials: name.slice(0, 2).toUpperCase(),
        color: '#2e7d32',
        state: cu.location || '',
      };
    }
  } catch {}
  return { name: 'Unknown', role: 'Farmer', initials: '?', color: '#888', state: '' };
};
const getCat  = (id) => CATEGORIES.find(c => c.id === id);

// ─── Role config ──────────────────────────────────────────────────────────────
const ROLE_CFG = {
  Farmer:     { icon: <GiFarmer className="text-[11px]"/>,   cls: 'bg-green-100 text-green-800 border-green-200'     },
  Agronomist: { icon: <MdVerified className="text-[11px]"/>, cls: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
  Buyer:      { icon: <FaStore className="text-[11px]"/>,    cls: 'bg-amber-100 text-amber-800 border-amber-200'     },
};

// ─── Atoms ────────────────────────────────────────────────────────────────────
function Avatar({ user, size = 9 }) {
  const px = size * 4;
  return (
    <div className={`rounded-full flex items-center justify-center text-white font-bold flex-shrink-0 text-xs shadow-sm`}
      style={{ width: px, height: px, minWidth: px, background: user.color }}>
      {user.initials}
    </div>
  );
}

function RoleBadge({ role }) {
  const cfg = ROLE_CFG[role] || ROLE_CFG.Farmer;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[11px] font-semibold ${cfg.cls}`}>
      {cfg.icon} {role}
    </span>
  );
}

function PostTypeBadge({ type }) {
  const cfg = POST_TYPES[type] || POST_TYPES.discussion;
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border text-[11px] font-bold uppercase tracking-wide ${cfg.color}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dotColor}`} />
      {cfg.label}
    </span>
  );
}

function UrgencyBadge({ level }) {
  const cfg = URGENCY[level] || URGENCY.low;
  const pulse = level === 'critical' ? 'animate-pulse' : '';
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[11px] font-semibold ${cfg.color}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${pulse}`}
        style={{ background: level === 'critical' ? '#ef4444' : level === 'high' ? '#f97316' : level === 'medium' ? '#f59e0b' : '#22c55e' }} />
      {cfg.label}
    </span>
  );
}

function CropTag({ tag }) {
  return (
    <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-teal-50 text-teal-700 border border-teal-200">
      #{tag}
    </span>
  );
}

// ─── Single comment / reply node ──────────────────────────────────────────────
function CommentItem({ comment, depth = 0, parentAuthorName = null, onAddReply }) {
  const { t } = useLanguage();
  const [open,        setOpen]        = useState(true);
  const [upvotes,     setUpvotes]     = useState(comment.likes || 0);
  const [downvotes,   setDownvotes]   = useState(comment.dislikes || 0);
  const [upvoted,     setUpvoted]     = useState(false);
  const [downvoted,   setDownvoted]   = useState(false);
  const [showReply,   setShowReply]   = useState(false);
  const [replyDraft,  setReplyDraft]  = useState('');
  const [localReplies, setLocalReplies] = useState(comment.replies || []);
  const replyRef = useRef(null);
  const user = getUser(comment.authorId);

  const handleUpvote = () => {
    if (upvoted) { setUpvoted(false); setUpvotes(v => v - 1); }
    else {
      if (downvoted) { setDownvoted(false); setDownvotes(v => v - 1); }
      setUpvoted(true); setUpvotes(v => v + 1);
    }
  };
  const handleDownvote = () => {
    if (downvoted) { setDownvoted(false); setDownvotes(v => v - 1); }
    else {
      if (upvoted) { setUpvoted(false); setUpvotes(v => v - 1); }
      setDownvoted(true); setDownvotes(v => v + 1);
    }
  };

  const submitReply = () => {
    if (!replyDraft.trim()) return;
    const newReply = {
      id: `r-${Date.now()}`,
      authorId: 'u1',
      likes: 0, dislikes: 0,
      createdAt: new Date().toISOString(),
      text: replyDraft.trim(),
      replyingTo: user.name,
      replies: [],
    };
    setLocalReplies(prev => [...prev, newReply]);
    setReplyDraft('');
    setShowReply(false);
    setOpen(true);
  };

  // Indent cap at depth 3 so it doesn't go off screen
  const indentClass = depth === 0 ? '' : 'ml-4';

  return (
    <div className={`${indentClass} mt-2`}>
      {/* Thread line connector for depth > 0 */}
      <div className={depth > 0 ? 'flex gap-3' : ''}>
        {depth > 0 && (
          <div className="flex flex-col items-center flex-shrink-0">
            <div className="w-px flex-1 bg-gray-200 mt-1" />
          </div>
        )}

        <div className="flex-1 min-w-0">
          {/* Comment bubble */}
          <div className={`rounded-2xl px-4 py-3 ${
            comment.isExpert
              ? 'bg-emerald-50 border-2 border-emerald-300 shadow-sm'
              : depth === 0
                ? 'bg-gray-50 border border-gray-100'
                : 'bg-white border border-gray-100'
          }`}>
            {/* Expert badge */}
            {comment.isExpert && (
              <div className="flex items-center gap-1.5 mb-2 pb-2 border-b border-emerald-200">
                <MdVerified className="text-emerald-600 text-sm flex-shrink-0" />
                <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">{t('community.post.expertVerified')}</span>
              </div>
            )}

            {/* Author row */}
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <Avatar user={user} size={7} />
              <span className="font-bold text-xs text-gray-900">{user.name}</span>
              <RoleBadge role={user.role} />
              <span className="text-[10px] text-gray-400">{timeAgo(comment.createdAt)}</span>
            </div>

            {/* Reply-to context badge — Instagram style */}
            {comment.replyingTo && (
              <div className="flex items-center gap-1 mb-1.5">
                <FaLevelDownAlt className="text-[9px] text-blue-400 flex-shrink-0 rotate-90" />
                <span className="text-[10px] text-blue-500 font-semibold">@{comment.replyingTo}</span>
              </div>
            )}

            {/* Text */}
            <p className="text-sm text-gray-700 leading-relaxed">{comment.text}</p>

            {/* Actions row */}
            <div className="flex items-center gap-3 mt-2.5 flex-wrap">
              {/* Thumbs up */}
              <motion.button
                onClick={handleUpvote}
                whileTap={{ scale: 0.82 }}
                animate={upvoted ? { scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 0.2 }}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-all duration-150 ${
                  upvoted
                    ? 'bg-green-500 text-white border-green-500 shadow-sm shadow-green-200'
                    : 'bg-white text-gray-500 border-gray-200 hover:border-green-400 hover:text-green-600'
                }`}>
                <FaThumbsUp className="text-[10px]" />
                <motion.span key={upvotes} initial={{ scale: 1.4 }} animate={{ scale: 1 }} transition={{ duration: 0.18 }}>
                  {upvotes}
                </motion.span>
              </motion.button>

              {/* Thumbs down */}
              <motion.button
                onClick={handleDownvote}
                whileTap={{ scale: 0.82 }}
                animate={downvoted ? { scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 0.2 }}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-all duration-150 ${
                  downvoted
                    ? 'bg-red-500 text-white border-red-500 shadow-sm shadow-red-200'
                    : 'bg-white text-gray-500 border-gray-200 hover:border-red-400 hover:text-red-500'
                }`}>
                <FaThumbsDown className="text-[10px]" />
                <motion.span key={downvotes} initial={{ scale: 1.4 }} animate={{ scale: 1 }} transition={{ duration: 0.18 }}>
                  {downvotes}
                </motion.span>
              </motion.button>

              {/* Reply button */}
              <button
                onClick={() => { setShowReply(!showReply); setTimeout(() => replyRef.current?.focus(), 50); }}
                className="flex items-center gap-1 text-[11px] font-semibold text-gray-400 hover:text-agri-primary transition-colors duration-150">
                <FaReply className="text-[10px]" /> {t('community.post.reply')}
              </button>

              {/* Show/hide thread toggle */}
              {localReplies.length > 0 && (
                <button
                  onClick={() => setOpen(!open)}
                  className="flex items-center gap-1 text-[11px] font-semibold text-agri-primary hover:text-green-700 transition-colors ml-auto">
                  {open
                    ? <><FaChevronUp className="text-[9px]" /> {t('community.post.hideReplies').replace('{{count}}', localReplies.length)}</>
                    : <><FaChevronDown className="text-[9px]" /> {t('community.post.viewReplies').replace('{{count}}', localReplies.length)}</>
                  }
                </button>
              )}
            </div>
          </div>

          {/* Inline reply input */}
          <AnimatePresence>
            {showReply && (
              <motion.div
                initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22 }}
                className="overflow-hidden mt-2 ml-2">
                <div className="flex items-center gap-2 bg-white rounded-xl border border-green-200 px-3 py-2 shadow-sm">
                  <span className="text-[11px] text-blue-500 font-semibold whitespace-nowrap flex-shrink-0">@{user.name}</span>
                  <input
                    ref={replyRef}
                    value={replyDraft}
                    onChange={e => setReplyDraft(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && !e.shiftKey && submitReply()}
                    {...{placeholder: t('community.post.writeReply')}}
                    className="flex-1 text-xs text-gray-800 bg-transparent focus:outline-none placeholder-gray-400"
                  />
                  <button onClick={submitReply}
                    className="flex-shrink-0 w-7 h-7 bg-agri-primary text-white rounded-lg flex items-center justify-center hover:bg-agri-secondary transition-colors">
                    <FaPaperPlane className="text-[10px]" />
                  </button>
                  <button onClick={() => setShowReply(false)} className="text-gray-400 hover:text-gray-600">
                    <FaTimes className="text-[10px]" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Nested replies */}
          <AnimatePresence>
            {open && localReplies.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                {localReplies.map(reply => (
                  <CommentItem
                    key={reply.id}
                    comment={reply}
                    depth={Math.min(depth + 1, 3)}
                    parentAuthorName={user.name}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// ─── Post Card ────────────────────────────────────────────────────────────────
// ── TranslatableText — one-click translate for any piece of text ──────────────
function TranslatableText({ text }) {
  const { lang: currentLang, t } = useLanguage();
  const [translated,   setTranslated]   = useState(null);
  const [translating,  setTranslating]  = useState(false);
  const [showOriginal, setShowOriginal] = useState(false);

  const sourceLang = detectLanguage(text || '');
  const targetLang = currentLang;
  const canTranslate = sourceLang !== targetLang && text && text.length > 10;

  const handleTranslate = async () => {
    if (showOriginal)     { setShowOriginal(false); return; }
    if (translated)       { setShowOriginal(false); return; }
    if (!canTranslate)    return;
    setTranslating(true);
    try {
      const result = await translateText(text, targetLang);
      setTranslated(result);
    } finally {
      setTranslating(false);
    }
  };

  const display     = (!showOriginal && translated) ? translated : text;
  const isXlated    = !!translated && !showOriginal;
  const langName    = { en: 'English', hi: 'हिन्दी', gu: 'ગુજરાતી' }[sourceLang] || sourceLang;

  return (
    <div>
      <p>{display}</p>
      {canTranslate && (
        <div className="flex items-center gap-2 mt-1">
          {isXlated && (
            <span className="text-[10px] text-gray-400 italic">
              {t('community.translateKeys.translatedFrom')} {langName} ·
            </span>
          )}
          <button
            onClick={isXlated ? () => setShowOriginal(true) : handleTranslate}
            disabled={translating}
            className="text-[10px] text-green-600 hover:text-green-800 font-semibold underline underline-offset-2 transition-colors disabled:opacity-50"
          >
            {translating ? t('community.translateKeys.translating') : isXlated ? t('community.translateKeys.viewOriginal') : t('community.translateKeys.translate')}
          </button>
        </div>
      )}
    </div>
  );
}

function PostCard({ post }) {
  const { t } = useLanguage();
  const [expanded,  setExpanded]  = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [votes,     setVotes]     = useState({ up: post.likes, down: post.dislikes, voted: null });
  const [saved,     setSaved]     = useState(false);
  const [comments,  setComments]  = useState(post.comments || []);
  const [draft,     setDraft]     = useState('');
  const author = getUser(post.authorId);
  const cat    = getCat(post.category);

  const handleVote = (dir) => {
    setVotes(v => {
      const same = v.voted === dir;
      return {
        up:    dir === 'up'   ? v.up   + (same ? -1 : 1) : v.up   - (v.voted === 'up'   ? 1 : 0),
        down:  dir === 'down' ? v.down + (same ? -1 : 1) : v.down - (v.voted === 'down' ? 1 : 0),
        voted: same ? null : dir,
      };
    });
  };

  const submit = () => {
    if (!draft.trim()) return;
    const currentUser = getCurrentUser();
    const authorId = currentUser?.id || currentUser?._id || 'u1';
    setComments(prev => [{
      id: `c-${Date.now()}`, authorId, likes: 0,
      createdAt: new Date().toISOString(), text: draft.trim(), replies: [],
    }, ...prev]);
    setDraft('');
    setShowComments(true);
  };

  // Left accent color by postType
  const accentColor = {
    problem:     'border-l-red-400',
    advice:      'border-l-emerald-500',
    requirement: 'border-l-blue-400',
    discussion:  'border-l-amber-400',
  }[post.postType] || 'border-l-green-400';

  return (
    <motion.article
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
      className={`bg-white/85 backdrop-blur-sm rounded-2xl border border-green-100 border-l-4 ${accentColor} shadow-sm hover:shadow-md transition-all duration-300`}
    >
      {/* ── Tag strip ─────────────────────────────────────────────── */}
      <div className="flex items-center gap-1.5 flex-wrap px-5 pt-4 pb-2">
        <PostTypeBadge type={post.postType} />
        {cat && (
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full border text-[11px] font-semibold ${cat.color}`}>
            {cat.label}
          </span>
        )}
        <UrgencyBadge level={post.urgency} />
        {post.cropTags.map(t => <CropTag key={t} tag={t} />)}
        <span className="ml-auto text-[11px] text-gray-400 flex-shrink-0">{timeAgo(post.createdAt)}</span>
      </div>

      {/* ── Author ────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2.5 px-5 py-2">
        <Avatar user={author} />
        <div>
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-semibold text-sm text-gray-900">{author.name}</span>
            <RoleBadge role={author.role} />
          </div>
          <div className="flex items-center gap-1 text-[11px] text-gray-400 mt-0.5">
            <FaMapMarkerAlt className="text-[9px]" /> {author.state}
          </div>
        </div>
      </div>

      {/* ── Content ───────────────────────────────────────────────── */}
      <div className="px-5 pb-3">
        <h3 className="font-bold text-gray-900 text-[15px] leading-snug mb-1.5">{post.title}</h3>
        <div className={`text-sm text-gray-600 leading-relaxed ${expanded ? '' : 'line-clamp-3'}`}>
          <TranslatableText text={post.description} />
        </div>
        {post.description.length > 220 && (
          <button onClick={() => setExpanded(!expanded)}
            className="text-xs text-green-600 hover:text-green-700 font-medium mt-1">
            {expanded ? t('community.post.showLess') + ' ↑' : t('community.post.readMore') + ' ↓'}
          </button>
        )}
      </div>

      {/* ── Image ─────────────────────────────────────────────────── */}
      {post.image && (
        <div className="mx-5 mb-3 rounded-xl overflow-hidden h-52 border border-green-50">
          <img src={post.image} alt="Crop" loading="lazy"
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
        </div>
      )}

      {/* ── Actions ───────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 px-4 py-3 border-t border-gray-100 flex-wrap">

        {/* Thumbs Up pill — green pop on active */}
        <motion.button
          onClick={() => handleVote('up')}
          whileTap={{ scale: 0.82 }}
          whileHover={{ scale: 1.04 }}
          animate={votes.voted === 'up' ? { scale: [1, 1.18, 1] } : { scale: 1 }}
          transition={{ duration: 0.22 }}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border-2 transition-all duration-150 ${
            votes.voted === 'up'
              ? 'bg-green-500 text-white border-green-500 shadow-md shadow-green-200'
              : 'bg-white text-gray-600 border-gray-200 hover:border-green-400 hover:text-green-600 hover:bg-green-50'
          }`}>
          <FaThumbsUp className="text-sm" />
          <motion.span
            key={votes.up}
            initial={{ scale: 1.5 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.2 }}>
            {votes.up}
          </motion.span>
        </motion.button>

        {/* Thumbs Down pill — red pop on active */}
        <motion.button
          onClick={() => handleVote('down')}
          whileTap={{ scale: 0.82 }}
          whileHover={{ scale: 1.04 }}
          animate={votes.voted === 'down' ? { scale: [1, 1.18, 1] } : { scale: 1 }}
          transition={{ duration: 0.22 }}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border-2 transition-all duration-150 ${
            votes.voted === 'down'
              ? 'bg-red-500 text-white border-red-500 shadow-md shadow-red-200'
              : 'bg-white text-gray-600 border-gray-200 hover:border-red-400 hover:text-red-500 hover:bg-red-50'
          }`}>
          <FaThumbsDown className="text-sm" />
          <motion.span
            key={votes.down}
            initial={{ scale: 1.5 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.2 }}>
            {votes.down}
          </motion.span>
        </motion.button>

        {/* Comment */}
        <motion.button
          onClick={() => setShowComments(!showComments)}
          whileTap={{ scale: 0.88 }}
          whileHover={{ scale: 1.04 }}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border-2 transition-all duration-150 ${
            showComments
              ? 'bg-gray-800 text-white border-gray-800'
              : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400 hover:bg-gray-50'
          }`}>
          <FaComment className="text-sm" />
          <span>{comments.length}</span>
        </motion.button>

        {/* Share */}
        <motion.button
          whileTap={{ scale: 0.88 }}
          whileHover={{ scale: 1.04, y: -1 }}
          className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold bg-white text-gray-600 border-2 border-gray-200 hover:border-gray-400 hover:bg-gray-50 transition-all duration-150">
          <FaShare className="text-sm" />
          <span>{t('community.post.share')}</span>
        </motion.button>

        {/* Bookmark */}
        <motion.button
          onClick={() => setSaved(!saved)}
          whileTap={{ scale: 0.82 }}
          whileHover={{ scale: 1.08 }}
          animate={saved ? { scale: [1, 1.25, 1] } : { scale: 1 }}
          transition={{ duration: 0.25 }}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-semibold border-2 transition-all duration-150 ml-auto ${
            saved
              ? 'text-amber-600 bg-amber-50 border-amber-400'
              : 'text-gray-400 bg-white border-gray-200 hover:text-amber-500 hover:border-amber-300 hover:bg-amber-50'
          }`}>
          {saved ? <FaBookmark /> : <FaRegBookmark />}
        </motion.button>
      </div>

      {/* ── Comments ──────────────────────────────────────────────── */}
      <AnimatePresence>
        {showComments && (
          <motion.div
            initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.28 }}
            className="overflow-hidden">
            <div className="px-5 pb-5 pt-3 border-t border-gray-50">
              {/* Input */}
              <div className="flex gap-2 mb-3">
                {(() => {
                  const cu = getCurrentUser();
                  const authorId = cu?.id || cu?._id || 'u1';
                  const commentUser = getUser(authorId);
                  const displayUser = cu
                    ? { ...commentUser, name: cu.name || commentUser.name, initials: (cu.name || commentUser.name).slice(0,2).toUpperCase(), color: commentUser.color }
                    : commentUser;
                  return <Avatar user={displayUser} size={7} />;
                })()}
                <div className="flex-1 flex gap-2">
                  <input value={draft} onChange={e => setDraft(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && !e.shiftKey && submit()}
                    placeholder={t('community.post.writeReply') + ' (Enter to send)'}
                    className="flex-1 px-3 py-2 text-sm rounded-xl border border-green-100 bg-green-50/40 focus:outline-none focus:ring-2 focus:ring-green-300 focus:bg-white transition-all" />
                  <button onClick={submit}
                    className="px-3 py-2 bg-agri-primary text-white rounded-xl hover:bg-agri-secondary transition-colors flex-shrink-0">
                    <FaPaperPlane className="text-xs" />
                  </button>
                </div>
              </div>
              {comments.map(c => <CommentItem key={c.id} comment={c} />)}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
}

// ─── Login Gate (shown after 4th post for guests) ─────────────────────────────
function LoginGate({ onLoginOpen, onSignupOpen, totalRemaining = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="relative my-4"
    >
      {/* Soft top fade hinting more content below */}
      <div className="absolute -top-16 left-0 right-0 h-16 bg-gradient-to-b from-transparent to-[#f5faf6] pointer-events-none" />

      <div className="relative bg-white rounded-3xl border-2 border-green-200 shadow-xl overflow-hidden">
        {/* Decorative gradient header strip */}
        <div
          className="h-2 w-full"
          style={{ background: 'linear-gradient(90deg,#1b5e20,#2e7d32,#4caf50,#2e7d32,#1b5e20)' }}
        />

        <div className="px-6 py-8 sm:px-10 sm:py-10 text-center relative">
          {/* Decorative blur circles */}
          <div className="absolute top-0 right-0 w-40 h-40 rounded-full blur-3xl opacity-20 pointer-events-none"
            style={{ background: '#86efac', transform: 'translate(30%,-30%)' }} />
          <div className="absolute bottom-0 left-0 w-40 h-40 rounded-full blur-3xl opacity-20 pointer-events-none"
            style={{ background: '#fde68a', transform: 'translate(-30%,30%)' }} />

          {/* Lock icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1, type: 'spring', stiffness: 200, damping: 15 }}
            className="relative inline-flex items-center justify-center w-20 h-20 rounded-full mb-5 shadow-lg"
            style={{ background: 'linear-gradient(135deg,#1b5e20,#2e7d32)' }}
          >
            <FaLock className="text-white text-2xl" />
            <motion.div
              animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2.4, repeat: Infinity }}
              className="absolute inset-0 rounded-full border-2 border-green-300"
            />
          </motion.div>

          {/* Headline */}
          <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2 tracking-tight relative">
            Join the AgriConnect Community
          </h3>
          <p className="text-sm sm:text-base text-gray-600 max-w-md mx-auto leading-relaxed mb-1 relative">
            You've explored the first 4 posts. Sign in or create a free account to keep reading
            {totalRemaining > 0 && (
              <> <span className="font-semibold text-agri-primary">{totalRemaining} more</span> farmer discussions</>
            )}
            , ask experts, and share your own crop problems.
          </p>

          {/* Feature pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-5 mb-6 relative">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-50 border border-green-200 rounded-full text-xs font-semibold text-green-700">
              <FaCheckCircle className="text-[10px]" /> Free forever
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-full text-xs font-semibold text-emerald-700">
              <MdVerified className="text-[12px]" /> Verified experts
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-full text-xs font-semibold text-amber-700">
              <GiFarmer className="text-[12px]" /> 10,000+ farmers
            </span>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 relative">
            <motion.button
              whileHover={{ scale: 1.03, y: -1 }}
              whileTap={{ scale: 0.97 }}
              onClick={onLoginOpen}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold text-white shadow-lg hover:shadow-xl transition-all"
              style={{ background: 'linear-gradient(135deg,#1b5e20,#2e7d32)' }}
            >
              <FaSignInAlt /> Log In
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03, y: -1 }}
              whileTap={{ scale: 0.97 }}
              onClick={onSignupOpen}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold bg-white text-agri-primary border-2 border-green-500 hover:bg-green-50 transition-all shadow-md"
            >
              <FaUserPlus /> Create Free Account
            </motion.button>
          </div>

          <p className="text-[11px] text-gray-400 mt-5 relative">
            Already have an account? <button onClick={onLoginOpen} className="text-green-600 font-semibold hover:underline">Sign in here</button>
          </p>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Create Post Modal ────────────────────────────────────────────────────────
function CreatePostModal({ onClose, onSubmit }) {
  const { t, lang } = useLanguage();
  // Steps are an array in locale files, access via t() with numeric index
  const stepKeys = ['community.createPost.steps.0','community.createPost.steps.1','community.createPost.steps.2','community.createPost.steps.3'];
  const STEPS_FALLBACK = ['Type','Crop','Details','Submit'];
  const STEPS_HI = ['प्रकार','फसल','विवरण','प्रकाशित'];
  const STEPS_GU = ['પ્રકાર','પાક','વિગત','સબમિટ'];
  const STEPS = lang === 'hi' ? STEPS_HI : lang === 'gu' ? STEPS_GU : STEPS_FALLBACK;
  const [step, setStep]     = useState(0);
  const [form, setForm]     = useState({
    postType:'problem', cropTag:'', category:'disease',
    urgency:'medium', region:'Madhya Pradesh', title:'', description:'',
  });
  const [preview, setPreview] = useState(null);
  const fileRef = useRef(null);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleFile = (e) => {
    const f = e.target.files?.[0];
    if (f) setPreview(URL.createObjectURL(f));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim()) return;
    const currentUser = getCurrentUser();
    const authorId = currentUser?.id || currentUser?._id || 'u1';
    onSubmit({
      ...form,
      cropTags: form.cropTag ? [form.cropTag] : [],
      image: preview, id: `p-${Date.now()}`, authorId,
      likes: 0, dislikes: 0, shares: 0, saved: false,
      createdAt: new Date().toISOString(), comments: [],
    });
    onClose();
  };

  const postTypeList = Object.entries(POST_TYPES).map(([id, cfg]) => ({ id, ...cfg }));

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[92vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div>
            <h3 className="font-bold text-gray-900">{t('community.createPost.title')}</h3>
            <p className="text-xs text-gray-400 mt-0.5">{t('community.createPost.subtitle')}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors flex items-center justify-center">
            <FaTimes className="text-sm" />
          </button>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-0 px-5 pt-4">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center flex-1 last:flex-none">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-all ${i <= step ? 'bg-agri-primary text-white' : 'bg-gray-100 text-gray-400'}`}>
                {i < step ? <FaCheckCircle className="text-xs" /> : i + 1}
              </div>
              <span className={`ml-1.5 text-xs font-medium hidden sm:block ${i <= step ? 'text-agri-primary' : 'text-gray-400'}`}>{s}</span>
              {i < STEPS.length - 1 && <div className={`flex-1 h-px mx-2 ${i < step ? 'bg-agri-primary' : 'bg-gray-200'}`} />}
            </div>
          ))}
        </div>

        <div className="p-5">
          {/* Step 0: Post Type */}
          {step === 0 && (
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-3">{t('community.createPost.postTypeQuestion')}</p>
              <div className="grid grid-cols-2 gap-3">
                {postTypeList.map(pt => (
                  <button key={pt.id} type="button" onClick={() => set('postType', pt.id)}
                    className={`flex flex-col items-start p-4 rounded-2xl border-2 transition-all duration-150 text-left ${form.postType === pt.id ? 'border-agri-primary bg-green-50 shadow-sm' : 'border-gray-100 hover:border-green-300 bg-gray-50'}`}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`w-2.5 h-2.5 rounded-full ${pt.dotColor}`} />
                      <span className="font-bold text-sm text-gray-900">{pt.label}</span>
                    </div>
                    <p className="text-xs text-gray-500 leading-snug">
                      {pt.id === 'problem' && t('community.createPost.typeDescriptions.problem')}
                      {pt.id === 'advice' && t('community.createPost.typeDescriptions.advice')}
                      {pt.id === 'requirement' && t('community.createPost.typeDescriptions.requirement')}
                      {pt.id === 'discussion' && t('community.createPost.typeDescriptions.discussion')}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 1: Crop + Category + Urgency */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2 block">{t('community.createPost.cropName')}</label>
                <div className="flex flex-wrap gap-2">
                  {['Wheat','Rice','Tomato','Soybean','Cotton','Onion','Potato','Mustard','Maize','Other'].map(c => (
                    <button key={c} type="button" onClick={() => set('cropTag', c)}
                      className={`px-3 py-1.5 rounded-full border text-xs font-medium transition-all ${form.cropTag === c ? 'bg-green-600 text-white border-green-600' : 'bg-green-50 text-green-700 border-green-100 hover:border-green-400'}`}>
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2 block">{t('community.createPost.region')}</label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map(c => (
                    <button key={c.id} type="button" onClick={() => set('category', c.id)}
                      className={`px-3 py-1.5 rounded-full border text-xs font-medium transition-all ${form.category === c.id ? c.color + ' ring-2 ring-offset-1 ring-green-400' : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-green-300'}`}>
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2 block">Urgency</label>
                <div className="flex gap-2">
                  {Object.entries(URGENCY).map(([key, val]) => (
                    <button key={key} type="button" onClick={() => set('urgency', key)}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${form.urgency === key ? val.color + ' shadow-sm' : 'bg-gray-50 text-gray-500 border-gray-200 hover:border-green-300'}`}>
                      {val.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Title + Description + Image */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5 block">{t('community.createPost.titleLabel')} *</label>
                  <input value={form.title} onChange={e => set('title', e.target.value)}
                    placeholder="Describe your issue briefly"
                    className="w-full px-3 py-2.5 rounded-xl border border-green-100 bg-green-50/30 text-sm focus:outline-none focus:ring-2 focus:ring-green-300 focus:bg-white transition-all" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5 block">{t('community.createPost.region')}</label>
                  <select value={form.region} onChange={e => set('region', e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-green-100 bg-green-50/30 text-sm focus:outline-none focus:ring-2 focus:ring-green-300 focus:bg-white transition-all">
                    {REGIONS.filter(r => r !== 'All Regions').map(r => <option key={r}>{r}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5 block">{t('community.createPost.descriptionLabel')} *</label>
                <textarea value={form.description} onChange={e => set('description', e.target.value)}
                  rows={4} placeholder="Describe symptoms, when it started, crop stage, recent weather, previous treatments…"
                  className="w-full px-3 py-2.5 rounded-xl border border-green-100 bg-green-50/30 text-sm focus:outline-none focus:ring-2 focus:ring-green-300 focus:bg-white transition-all resize-none" />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5 block">{t('community.createPost.uploadImage')}</label>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
                {preview
                  ? <div className="relative rounded-xl overflow-hidden h-32 border border-green-200">
                      <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                      <button type="button" onClick={() => setPreview(null)}
                        className="absolute top-2 right-2 bg-black/60 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs hover:bg-black/80">
                        <FaTimes />
                      </button>
                    </div>
                  : <button type="button" onClick={() => fileRef.current?.click()}
                      className="w-full border-2 border-dashed border-green-200 rounded-xl h-20 flex flex-col items-center justify-center gap-1.5 text-gray-400 hover:border-green-400 hover:text-green-600 transition-all">
                      <FaCamera className="text-lg" />
                      <span className="text-xs font-medium">{t('community.createPost.uploadHint')}</span>
                    </button>
                }
              </div>
            </div>
          )}

          {/* Step 3: Summary preview */}
          {step === 3 && (
            <div className="space-y-3">
              <p className="text-sm font-semibold text-gray-700 mb-2">{t('community.createPost.review')}</p>
              <div className="bg-green-50/60 rounded-2xl border border-green-100 p-4 space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <PostTypeBadge type={form.postType} />
                  {form.category && (() => { const c = getCat(form.category); return c ? <span className={`px-2 py-0.5 rounded-full border text-[11px] font-semibold ${c.color}`}>{c.label}</span> : null; })()}
                  <UrgencyBadge level={form.urgency} />
                  {form.cropTag && <CropTag tag={form.cropTag} />}
                </div>
                <p className="font-bold text-gray-900 text-sm">{form.title || <span className="text-gray-400 italic">No title entered</span>}</p>
                <p className="text-xs text-gray-600 line-clamp-3">{form.description || <span className="text-gray-400 italic">No description</span>}</p>
                {preview && <img src={preview} alt="preview" className="rounded-lg h-20 object-cover" />}
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex gap-3 mt-6">
            {step > 0 && (
              <button type="button" onClick={() => setStep(s => s - 1)}
                className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors">
                Back
              </button>
            )}
            {step < STEPS.length - 1
              ? <button type="button" onClick={() => setStep(s => s + 1)} disabled={step === 2 && (!form.title.trim() || !form.description.trim())}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-agri-primary to-agri-secondary text-white text-sm font-semibold hover:shadow-md hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0">
                  Next →
                </button>
              : <button type="button" onClick={handleSubmit}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-agri-primary to-agri-secondary text-white text-sm font-semibold hover:shadow-md hover:-translate-y-0.5 transition-all">
                  Post to Community
                </button>
            }
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Left Sidebar ─────────────────────────────────────────────────────────────
function LeftSidebar({ activeFilter, setActiveFilter, activeCrop, setActiveCrop, activeType, setActiveType }) {
  const { t } = useLanguage();
  return (
    <aside className="w-56 flex-shrink-0 space-y-4">
      {/* Post Type Filter */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-green-100 shadow-sm p-4">
        <h4 className="font-bold text-gray-800 text-xs uppercase tracking-wider mb-3 flex items-center gap-2">
          <FaFilter className="text-green-600" /> {t('community.postType')}
        </h4>
        {[{ id:'all', label:'All Posts', color:'text-gray-600' },
          ...Object.entries(POST_TYPES).map(([id, c]) => ({ id, label: c.label + 's', color: c.color }))
        ].map(f => (
          <button key={f.id} onClick={() => setActiveType(f.id)}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-150 mb-0.5 text-left ${activeType === f.id ? 'bg-green-100 text-agri-primary font-semibold' : 'text-gray-600 hover:bg-green-50'}`}>
            <span className={`w-2 h-2 rounded-full flex-shrink-0 ${f.id === 'all' ? 'bg-gray-400' : POST_TYPES[f.id]?.dotColor || 'bg-gray-400'}`} />
            {f.label}
          </button>
        ))}
      </div>

      {/* Category Filter */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-green-100 shadow-sm p-4">
        <h4 className="font-bold text-gray-800 text-xs uppercase tracking-wider mb-3 flex items-center gap-2">
          <MdAgriculture className="text-green-600 text-sm" /> {t('community.category')}
        </h4>
        {[{ id:'all', label:'All Categories' }, ...CATEGORIES].map(f => (
          <button key={f.id} onClick={() => setActiveFilter(f.id)}
            className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-150 mb-0.5 ${activeFilter === f.id ? 'bg-green-100 text-agri-primary font-semibold' : 'text-gray-600 hover:bg-green-50'}`}>
            {f.label}
          </button>
        ))}
      </div>

      {/* Crop Pills */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-green-100 shadow-sm p-4">
        <h4 className="font-bold text-gray-800 text-xs uppercase tracking-wider mb-3 flex items-center gap-2">
          <GiWheat className="text-green-600 text-sm" /> {t('community.crops')}
        </h4>
        <div className="flex flex-wrap gap-1.5">
          {CROP_CATEGORIES.map(c => (
            <button key={c} onClick={() => setActiveCrop(c)}
              className={`px-2.5 py-1 rounded-full text-[11px] font-medium border transition-all ${activeCrop === c ? 'bg-green-600 text-white border-green-600' : 'bg-green-50 text-green-700 border-green-100 hover:border-green-400'}`}>
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Trending Tags */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-green-100 shadow-sm p-4">
        <h4 className="font-bold text-gray-800 text-xs uppercase tracking-wider mb-3 flex items-center gap-2">
          <FaFire className="text-orange-500" /> {t('community.trending')}
        </h4>
        <div className="flex flex-wrap gap-1.5">
          {TRENDING_TAGS.slice(0, 8).map(tag => (
            <span key={tag} className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-orange-50 text-orange-700 border border-orange-100 cursor-pointer hover:bg-orange-100 transition-colors">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Weather alert */}
      <div className="rounded-2xl p-4 text-white" style={{ background: 'linear-gradient(135deg,#1b5e20,#2e7d32)' }}>
        <h4 className="font-bold text-xs mb-1.5 flex items-center gap-1.5">
          <FaBell className="text-yellow-300 text-[10px]" /> {t('community.weatherAlert')}
        </h4>
        <p className="text-[11px] text-green-200 leading-relaxed">
          Heatwave in MP & RJ for next 3 days. Irrigate early morning. Protect nurseries.
        </p>
        <div className="mt-2.5 flex items-center gap-2">
          <WiDaySunny className="text-2xl text-yellow-300 flex-shrink-0" />
          <div>
            <p className="text-white font-bold text-xs">Bhopal 37°C</p>
            <p className="text-green-200 text-[10px]">Partly Cloudy · Humidity 58%</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

// ─── Right Sidebar ────────────────────────────────────────────────────────────
function RightSidebar() {
  const { t } = useLanguage();
  return (
    <aside className="w-60 flex-shrink-0 space-y-4">
      {/* Mandi Prices — amber accent */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl border-l-4 border-l-amber-400 border border-amber-100 shadow-sm p-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-bold text-gray-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
            <FaStore className="text-amber-500" /> {t('community.liveMandiPrices')}
          </h4>
          <Link to="/mandi-prices" className="text-[11px] text-amber-600 hover:underline font-semibold">All →</Link>
        </div>
        <div className="space-y-1.5">
          {MANDI_PRICES.slice(0, 6).map(p => (
            <div key={p.crop} className="flex items-center justify-between py-1 border-b border-gray-50 last:border-0">
              <div>
                <span className="text-xs font-semibold text-gray-800">{p.crop}</span>
                <span className="text-[10px] text-gray-400 ml-1">{p.hindi}</span>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-gray-900">₹{p.price.toLocaleString()}</span>
                <div className={`flex items-center justify-end gap-0.5 text-[10px] font-semibold ${p.trend === 'up' ? 'text-green-600' : 'text-red-500'}`}>
                  {p.trend === 'up' ? <FaArrowUp className="text-[8px]" /> : <FaArrowDown className="text-[8px]" />}
                  {p.trend === 'up' ? '+' : ''}{p.change}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Weather — sky blue accent */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl border-l-4 border-l-sky-400 border border-sky-100 shadow-sm p-4">
        <h4 className="font-bold text-gray-800 text-xs uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <WiDaySunny className="text-sky-500 text-base" /> {t('community.weatherSnapshot')}
        </h4>
        <div className="space-y-2">
          {WEATHER_CITIES.slice(0, 4).map(w => (
            <div key={w.city} className="flex items-center justify-between">
              <span className="text-xs text-gray-700 font-medium">{w.city}</span>
              <div className="flex items-center gap-1.5">
                {w.rain > 20 ? <WiRain className="text-blue-500 text-sm" /> : w.rain > 5 ? <WiCloudy className="text-gray-400 text-sm" /> : <WiDaySunny className="text-amber-400 text-sm" />}
                <span className="text-xs font-bold text-gray-900">{w.temp}°C</span>
                <span className="text-[10px] text-gray-400">{w.humidity}%</span>
              </div>
            </div>
          ))}
        </div>
        <Link to="/#weather" className="block mt-3 text-center text-[11px] text-sky-600 hover:underline font-medium">
          Full Forecast →
        </Link>
      </div>

      {/* Ask AI */}
      <div className="rounded-2xl overflow-hidden shadow-md">
        <div className="p-4 text-white" style={{ background: 'linear-gradient(135deg, #1b5e20, #2e7d32)' }}>
          <h4 className="font-bold text-sm mb-1 flex items-center gap-2">
            <FaStar className="text-yellow-300" /> {t('community.askAI')}
          </h4>
          <p className="text-green-200 text-xs mb-3 leading-relaxed">{t('community.askAIDesc')}</p>
          <div className="flex flex-col gap-2">
            <input placeholder={t('community.askPlaceholder')}
              className="w-full px-3 py-2 rounded-xl bg-white/15 border border-white/25 text-white placeholder-white/60 text-xs focus:outline-none focus:ring-2 focus:ring-white/30 focus:bg-white/20" />
            <button className="w-full py-2 bg-white text-agri-primary rounded-xl text-xs font-bold hover:shadow-lg hover:brightness-105 transition-all duration-150">
              Ask
            </button>
          </div>
        </div>
      </div>

      {/* Top Agronomists — teal accent */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl border-l-4 border-l-teal-400 border border-teal-100 shadow-sm p-4">
        <h4 className="font-bold text-gray-800 text-xs uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <MdVerified className="text-teal-600 text-sm" /> {t('community.topAgronomists')}
        </h4>
        <div className="space-y-2.5">
          {TOP_AGRONOMISTS.map(a => (
            <div key={a.id} className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0"
                style={{ background: a.color }}>{a.initials}</div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-gray-900 truncate">{a.name}</p>
                <p className="text-[10px] text-gray-400 truncate">{a.expertise}</p>
              </div>
              <span className="text-[10px] text-teal-600 font-bold flex-shrink-0">{a.helpedCount}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Emerging Problems — orange accent */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl border-l-4 border-l-orange-400 border border-orange-100 shadow-sm p-4">
        <h4 className="font-bold text-gray-800 text-xs uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <FaExclamationTriangle className="text-orange-500" /> {t('community.emergingProblems')}
        </h4>
        <div className="flex flex-wrap gap-1.5">
          {TRENDING_TAGS.map(tag => (
            <span key={tag} className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-red-50 text-red-700 border border-red-100 cursor-pointer hover:bg-red-100 transition-colors">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </aside>
  );
}

// ─── Floating Login Popup Modal (appears when user scrolls past 4th post) ─────
function LoginPromptModal({ onClose, onLoginOpen, onSignupOpen }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.9, y: 30, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.9, y: 30, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 280, damping: 24 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden relative"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/95 hover:bg-gray-100 flex items-center justify-center text-gray-500 hover:text-gray-800 shadow-sm border border-gray-100 transition-all"
          aria-label="Close"
        >
          <FaTimes className="text-sm" />
        </button>

        {/* Top gradient banner with icon */}
        <div
          className="px-6 pt-8 pb-6 text-center text-white relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg,#1b5e20 0%,#2e7d32 50%,#43a047 100%)' }}
        >
          <div className="absolute top-0 right-0 w-40 h-40 rounded-full blur-3xl opacity-25 pointer-events-none"
            style={{ background: '#86efac', transform: 'translate(40%,-40%)' }} />
          <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full blur-2xl opacity-25 pointer-events-none"
            style={{ background: '#fef08a', transform: 'translate(-40%,40%)' }} />

          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.15, type: 'spring', stiffness: 200, damping: 14 }}
            className="relative inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl mb-3 border border-white/30 shadow-lg"
          >
            <FaLock className="text-2xl" />
          </motion.div>

          <h2 className="relative text-2xl font-extrabold tracking-tight mb-1">
            Want to see more?
          </h2>
          <p className="relative text-sm text-green-100/90 max-w-sm mx-auto leading-relaxed">
            Sign in or create a free account to keep exploring posts from farmers across India.
          </p>
        </div>

        {/* Body */}
        <div className="px-6 py-6">
          {/* Benefits */}
          <ul className="space-y-2.5 mb-5">
            {[
              { icon: <MdVerified className="text-emerald-600" />, text: 'Get answers from verified agronomists' },
              { icon: <FaCommentDots className="text-blue-500" />, text: 'Comment, vote and share your own problems' },
              { icon: <GiPlantRoots className="text-green-600" />, text: 'Save useful posts and follow farmers' },
              { icon: <FaLightbulb className="text-amber-500" />, text: 'Free forever — no credit card needed' },
            ].map((b, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.06 }}
                className="flex items-center gap-3 text-sm text-gray-700"
              >
                <span className="w-8 h-8 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center flex-shrink-0">
                  {b.icon}
                </span>
                <span className="font-medium">{b.text}</span>
              </motion.li>
            ))}
          </ul>

          {/* CTAs */}
          <div className="flex flex-col gap-2.5">
            <motion.button
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => { onLoginOpen?.(); onClose(); }}
              className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-bold text-white shadow-lg hover:shadow-xl transition-all"
              style={{ background: 'linear-gradient(135deg,#1b5e20,#2e7d32)' }}
            >
              <FaSignInAlt /> Log In
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => { onSignupOpen?.(); onClose(); }}
              className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-bold bg-white text-agri-primary border-2 border-green-500 hover:bg-green-50 transition-all"
            >
              <FaUserPlus /> Create Free Account
            </motion.button>
            <button
              onClick={onClose}
              className="w-full py-2 text-xs font-medium text-gray-400 hover:text-gray-600 transition-colors"
            >
              Maybe later
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function CommunityPage({ onLoginOpen, onSignupOpen } = {}) {
  const { t } = useLanguage();
  const [posts,        setPosts]        = useState(POSTS);
  const [activeFilter, setActiveFilter] = useState('all');
  const [activeCrop,   setActiveCrop]   = useState('All');
  const [activeType,   setActiveType]   = useState('all');
  const [activeRegion, setActiveRegion] = useState('All Regions');
  const [sortBy,       setSortBy]       = useState('latest');
  const [search,       setSearch]       = useState('');
  const [showCreate,   setShowCreate]   = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(() => getCurrentUser());

  // Login prompt state
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [hasShownPrompt,  setHasShownPrompt]  = useState(false); // only auto-trigger once per session

  // Keep loggedInUser in sync whenever auth state changes (login / logout)
  useEffect(() => {
    const sync = () => {
      const u = getCurrentUser();
      setLoggedInUser(u);
      // If user just logged in, hide the prompt
      if (u) setShowLoginPrompt(false);
    };
    window.addEventListener('agriUserUpdated', sync);
    return () => window.removeEventListener('agriUserUpdated', sync);
  }, []);

  const filtered = useMemo(() => {
    let d = [...posts];
    if (activeType !== 'all')         d = d.filter(p => p.postType === activeType);
    if (activeFilter !== 'all')       d = d.filter(p => p.category === activeFilter);
    if (activeCrop !== 'All')         d = d.filter(p => p.cropTags.some(t => t.toLowerCase() === activeCrop.toLowerCase()));
    if (activeRegion !== 'All Regions') d = d.filter(p => p.region === activeRegion);
    if (search.trim()) {
      const q = search.toLowerCase();
      d = d.filter(p => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.cropTags.some(t => t.toLowerCase().includes(q)));
    }
    if (sortBy === 'latest') d.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    else d.sort((a, b) => b.likes - a.likes);
    return d;
  }, [posts, activeFilter, activeCrop, activeType, activeRegion, sortBy, search]);

  // Sentinel ref placed right after the 4th post to detect when user has scrolled past it
  const sentinelRef = useRef(null);
  useEffect(() => {
    if (loggedInUser) return;            // logged-in users never see the prompt
    if (hasShownPrompt) return;          // don't re-trigger after user has dismissed
    if (!sentinelRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setShowLoginPrompt(true);
            setHasShownPrompt(true);
            observer.disconnect();
          }
        });
      },
      { root: null, threshold: 0.1, rootMargin: '0px 0px -80px 0px' }
    );

    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [loggedInUser, hasShownPrompt, filtered.length]);

  const clearAll = () => { setActiveFilter('all'); setActiveCrop('All'); setActiveType('all'); setActiveRegion('All Regions'); setSearch(''); };
  const hasFilters = activeFilter !== 'all' || activeCrop !== 'All' || activeType !== 'all' || activeRegion !== 'All Regions' || search;

  // Decide how many posts to show to guests. Guests only see the first 4 posts,
  // followed by an inline LoginGate. Logged-in users see everything.
  const GUEST_LIMIT = 4;
  const isGuest = !loggedInUser;
  const visiblePosts = isGuest ? filtered.slice(0, GUEST_LIMIT) : filtered;
  const hiddenCount  = isGuest ? Math.max(0, filtered.length - GUEST_LIMIT) : 0;

  return (
    <div className="min-h-screen" style={{ background: '#f5faf6' }}>
      <Navbar onLoginOpen={onLoginOpen} onSignupOpen={onSignupOpen} />

      {/* ── Header ───────────────────────────────────────────────────── */}
      <div className="pt-20">
        <div className="px-6 lg:px-8 py-8 relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg,#1b5e20 0%,#2e7d32 50%,#1b5e20 100%)' }}>
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl opacity-15 pointer-events-none"
            style={{ background: '#86efac', transform: 'translate(30%,-30%)' }} />
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-full border border-white/20 mb-2">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-xs text-white/90 font-medium">{t('community.liveLabel')} · {POSTS.length} {t('community.posts')}</span>
              </div>
              <h1 className="text-3xl lg:text-4xl font-extrabold text-white tracking-tight">{t('community.title')}</h1>
              <p className="text-green-200 mt-1 text-sm">{t('community.subtitle')}</p>
              {/* Welcome message for logged-in users */}
              {loggedInUser && (
                <div className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-white/15 border border-white/25 rounded-2xl backdrop-blur-sm">
                  <div className="w-6 h-6 rounded-full bg-green-400 flex items-center justify-center text-green-900 text-[10px] font-bold flex-shrink-0">
                    {loggedInUser.name?.slice(0, 2).toUpperCase() || 'U'}
                  </div>
                  <span className="text-white text-sm font-semibold">
                    Welcome, <span className="text-green-300">{loggedInUser.name?.split(' ')[0] || loggedInUser.name}</span> 👋
                  </span>
                  <span className="text-white/50 text-xs hidden sm:block">· {loggedInUser.role || 'Member'}</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-3">
              {/* Post type legend */}
              <div className="hidden md:flex items-center gap-2 bg-white/10 rounded-2xl px-4 py-2 border border-white/15">
                {Object.entries(POST_TYPES).map(([id, c]) => (
                  <span key={id} className="flex items-center gap-1 text-white/80 text-xs">
                    <span className={`w-2 h-2 rounded-full ${c.dotColor}`} /> {c.label}
                  </span>
                ))}
              </div>
              <button
                onClick={() => {
                  // Guests can't create posts — show login prompt instead
                  if (!loggedInUser) {
                    setShowLoginPrompt(true);
                    return;
                  }
                  setShowCreate(true);
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-agri-primary font-bold rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all text-sm">
                <FaPlus className="text-xs" /> {t('community.newPost')}
              </button>
            </div>
          </div>
        </div>

        {/* ── Filter bar ─────────────────────────────────────────────── */}
        <div className="bg-white/90 backdrop-blur-sm border-b border-green-100 shadow-sm sticky top-16 z-30">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-2.5 flex items-center gap-3 flex-wrap">
            <div className="relative min-w-[180px] max-w-xs">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder={t('community.searchPlaceholder')}
                className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-green-100 bg-green-50/50 focus:outline-none focus:ring-2 focus:ring-green-300 transition-all" />
            </div>
            <select value={activeRegion} onChange={e => setActiveRegion(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl border border-green-100 bg-green-50/50 focus:outline-none focus:ring-2 focus:ring-green-300 transition-all cursor-pointer">
              {REGIONS.map(r => <option key={r}>{r}</option>)}
            </select>
            <div className="flex items-center gap-1.5 ml-auto">
              <span className="text-xs text-gray-500 hidden sm:block">Sort:</span>
              {[{ id:'latest', label: t('community.sortLatest') || 'Latest' },{ id:'top', label: t('community.sortTop') || 'Top Voted' }].map(s => (
                <button key={s.id} onClick={() => setSortBy(s.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${sortBy === s.id ? 'bg-green-600 text-white border-green-600' : 'bg-white text-gray-600 border-gray-200 hover:border-green-300'}`}>
                  {s.label}
                </button>
              ))}
              {hasFilters && (
                <button onClick={clearAll}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-red-600 bg-red-50 border border-red-100 hover:bg-red-100 transition-all flex items-center gap-1">
                  <FaTimes className="text-[10px]" /> {t('mandi.clear')}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── 3-Column Layout ───────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
        <div className="flex gap-5 items-start">

          {/* Left Sidebar */}
          <div className="hidden lg:block sticky top-32 self-start">
            <LeftSidebar
              activeFilter={activeFilter} setActiveFilter={setActiveFilter}
              activeCrop={activeCrop} setActiveCrop={setActiveCrop}
              activeType={activeType} setActiveType={setActiveType}
            />
          </div>

          {/* Center Feed */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              <span className="text-xs font-semibold text-gray-600">{filtered.length} {t('community.posts')}</span>
              {activeType !== 'all' && (
                <span className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full border text-[11px] font-semibold ${POST_TYPES[activeType]?.color}`}>
                  {POST_TYPES[activeType]?.label}s <FaTimes className="text-[9px] ml-0.5 cursor-pointer" onClick={() => setActiveType('all')} />
                </span>
              )}
              {activeCrop !== 'All' && (
                <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-green-100 text-green-700 border border-green-200 text-[11px] font-semibold">
                  #{activeCrop} <FaTimes className="text-[9px] ml-0.5 cursor-pointer" onClick={() => setActiveCrop('All')} />
                </span>
              )}
            </div>

            <div className="space-y-4">
              {filtered.length === 0
                ? <div className="py-24 text-center">
                    <GiWheat className="text-5xl text-gray-200 mx-auto mb-3" />
                    <p className="text-gray-500 font-medium">{t('community.noPostsFound')}</p>
                    <button onClick={clearAll} className="mt-2 text-sm text-green-600 hover:underline">{t('community.clearFilters')}</button>
                  </div>
                : (
                  <>
                    {visiblePosts.map((post, idx) => (
                      <div key={post.id}>
                        <PostCard post={post} />
                        {/* Place a sentinel right after the 4th post for guests, so we can
                            fire the popup precisely when it scrolls into view. */}
                        {isGuest && idx === GUEST_LIMIT - 1 && (
                          <div ref={sentinelRef} style={{ height: 1, width: '100%' }} aria-hidden="true" />
                        )}
                      </div>
                    ))}

                    {/* Inline gate card for guests (shown in place of remaining posts) */}
                    {isGuest && hiddenCount > 0 && (
                      <LoginGate
                        onLoginOpen={() => onLoginOpen?.()}
                        onSignupOpen={() => onSignupOpen?.()}
                        totalRemaining={hiddenCount}
                      />
                    )}
                  </>
                )
              }
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="hidden xl:block sticky top-32 self-start">
            <RightSidebar />
          </div>
        </div>
      </div>

      {/* Create Post Modal */}
      <AnimatePresence>
        {showCreate && (
          <CreatePostModal
            onClose={() => setShowCreate(false)}
            onSubmit={post => setPosts(prev => [post, ...prev])}
          />
        )}
      </AnimatePresence>

      {/* Floating Login Prompt — appears once when guest scrolls past the 4th post */}
      <AnimatePresence>
        {showLoginPrompt && !loggedInUser && (
          <LoginPromptModal
            onClose={() => setShowLoginPrompt(false)}
            onLoginOpen={onLoginOpen}
            onSignupOpen={onSignupOpen}
          />
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}