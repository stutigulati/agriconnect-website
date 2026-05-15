import User from './models/User.js';
import Post from './models/Post.js';
import Comment from './models/Comment.js';
import Vote from './models/Vote.js';

export async function seedCommunityData() {
  try {
    const count = await Post.countDocuments();
    if (count > 0) {
      console.log(`[seed] Skipped — ${count} posts already in DB.`);
      return;
    }
    console.log('[seed] Seeding initial community data...');

    const farmer = await User.findOneAndUpdate(
      { email: 'ramesh.patel@seed.agriconnect' },
      { name: 'Ramesh Patel', email: 'ramesh.patel@seed.agriconnect', role: 'Farmer', location: 'Sehore, MP', isVerified: false },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    const agro = await User.findOneAndUpdate(
      { email: 'dr.kavita@seed.agriconnect' },
      { name: 'Dr. Kavita Singh', email: 'dr.kavita@seed.agriconnect', role: 'Agronomist', location: 'Lucknow, UP', isVerified: true },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    const buyer = await User.findOneAndUpdate(
      { email: 'anil.traders@seed.agriconnect' },
      { name: 'Anil Traders', email: 'anil.traders@seed.agriconnect', role: 'Buyer', location: 'Indore, MP', isVerified: false },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    const post1 = await Post.create({
      title: 'Tomato leaves have white spots after rain — what should I do?',
      description: 'Leaves in lower rows are getting white patches and curling. I used drip irrigation and rainfall was heavy this week. I have 2 acres of tomato and the problem is spreading fast. Need expert advice.',
      tags: ['Tomato', 'Disease'], region: 'Madhya Pradesh',
      userId: farmer._id, upvotes: 18, downvotes: 2, commentsCount: 1,
    });

    const post2 = await Post.create({
      title: 'Verified advisory: Wheat options for delayed sowing in UP',
      description: 'Recommended expert approach: choose medium-duration seed and protect tillering stage with timely irrigation. HD 2967 works well after October 25 sowing.',
      tags: ['Wheat', 'Soil'], region: 'Uttar Pradesh',
      userId: agro._id, upvotes: 26, downvotes: 1, commentsCount: 2,
    });

    const post3 = await Post.create({
      title: 'Best price for soybean in Madhya Pradesh this season?',
      description: 'I have 40 quintals of soybean ready. Current mandi price seems low at ₹4,200. Looking for direct buyers who can offer better rates. Quality is A-grade, moisture 12%.',
      tags: ['Soybean', 'Market'], region: 'Madhya Pradesh',
      userId: farmer._id, upvotes: 9, downvotes: 0, commentsCount: 1,
    });

    await Comment.create({ postId: post1._id, userId: agro._id, content: 'This looks like early blight. Spray copper oxychloride @ 2.5g/L in early morning. Remove severely affected leaves.', depth: 0 });
    await Comment.create({ postId: post2._id, userId: farmer._id, content: 'Very helpful, will try HD 2967. What about K 307 for late sowing?', depth: 0 });
    await Comment.create({ postId: post2._id, userId: agro._id, content: 'K 307 is also good but HD 2967 is more widely tested for UP conditions after October 20.', depth: 0 });
    await Comment.create({ postId: post3._id, userId: buyer._id, content: 'We can offer ₹4,500/quintal for A-grade soybean. Please contact us with your location.', depth: 0 });

    console.log('[seed] ✅ Seeded 3 posts, 4 comments.');
  } catch (err) {
    console.error('[seed] Error:', err.message);
  }
}
