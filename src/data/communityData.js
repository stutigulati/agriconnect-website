// ─── communityData.js — AgriConnect Community Dummy Data ─────────────────────
// Replace individual fetch calls with real API when backend is ready.

// Real crop disease images uploaded by the team
import pinkbollwormImg  from '../assets/pinkbollworm_cotton.jpeg';
import riceBlastImg     from '../assets/rice_blast.jpg';
import soybeanImg       from '../assets/soybean_chlorosis.jpeg';
import tomatoWiltImg    from '../assets/tomato_wilting.jpg';
import yellowLeavesWheatImg from '../assets/yellow_leaves_wheat.jpeg';

export const USERS = [
  { id: 'u1',  name: 'Rajesh Kumar Patel',  role: 'Farmer',     state: 'Madhya Pradesh', initials: 'RK', color: '#2e7d32', bio: 'Wheat & soybean farmer, Hoshangabad. 15 yrs experience.',   crops: ['Wheat','Soybean','Maize'] },
  { id: 'u2',  name: 'Sunita Devi',          role: 'Farmer',     state: 'Punjab',         initials: 'SD', color: '#1565c0', bio: 'Rice and paddy farmer from Ludhiana district.',              crops: ['Rice','Paddy','Wheat'] },
  { id: 'u3',  name: 'Mahendra Singh Yadav', role: 'Farmer',     state: 'Rajasthan',      initials: 'MY', color: '#e65100', bio: 'Mustard and bajra cultivation near Jodhpur.',                crops: ['Mustard','Bajra','Cotton'] },
  { id: 'u4',  name: 'Priya Patil',          role: 'Farmer',     state: 'Maharashtra',    initials: 'PP', color: '#6a1b9a', bio: 'Onion and tomato grower from Nashik region.',                crops: ['Onion','Tomato','Grapes'] },
  { id: 'u5',  name: 'Harish Chandra Verma', role: 'Farmer',     state: 'Uttar Pradesh',  initials: 'HV', color: '#00695c', bio: 'Sugarcane and potato farmer near Agra.',                     crops: ['Sugarcane','Potato','Wheat'] },
  { id: 'u6',  name: 'Dr. Amit Sharma',      role: 'Agronomist', state: 'Madhya Pradesh', initials: 'AS', color: '#1b5e20', bio: 'PhD Plant Pathology, ICAR-IARI. 12 yrs field research.',     expertise: 'Crop Disease & Pathology' },
  { id: 'u7',  name: 'Dr. Kavitha Reddy',    role: 'Agronomist', state: 'Karnataka',      initials: 'KR', color: '#1b5e20', bio: 'Soil scientist & precision agriculture specialist.',          expertise: 'Soil Health & Nutrition' },
  { id: 'u8',  name: 'Prof. Suresh Gupta',   role: 'Agronomist', state: 'Punjab',         initials: 'SG', color: '#1b5e20', bio: 'Retired professor, PAU Ludhiana. Wheat variety expert.',     expertise: 'Wheat & Cereal Crops' },
  { id: 'u9',  name: 'Dr. Anita Borse',      role: 'Agronomist', state: 'Maharashtra',    initials: 'AB', color: '#1b5e20', bio: 'Horticulture specialist, post-harvest technology.',           expertise: 'Horticulture & Post-Harvest' },
  { id: 'u10', name: 'Dr. Ramesh Nair',      role: 'Agronomist', state: 'Gujarat',        initials: 'RN', color: '#1b5e20', bio: 'Cotton & groundnut specialist, 20 yrs advisory.',            expertise: 'Cotton & Oilseeds' },
  { id: 'u11', name: 'Vikram Agrotech Ltd',  role: 'Buyer',      state: 'Gujarat',        initials: 'VA', color: '#bf360c', bio: 'Bulk grain procurement company across 8 states.',            crops: ['Wheat','Maize','Soybean'] },
  { id: 'u12', name: 'Fresh Farms Exports',  role: 'Buyer',      state: 'Maharashtra',    initials: 'FF', color: '#ad1457', bio: 'Organic vegetables exporter. Quality focused.',              crops: ['Tomato','Onion','Potato'] },
  { id: 'u13', name: 'Punjab Rice Mills',    role: 'Buyer',      state: 'Punjab',         initials: 'PR', color: '#6d4c41', bio: 'Rice processing and export, Amritsar.',                      crops: ['Rice','Basmati'] },
];

export const POST_TYPES = {
  problem:     { label: 'Problem',     color: 'bg-red-100 text-red-700 border-red-200',       dotColor: 'bg-red-400'    },
  advice:      { label: 'Advice',      color: 'bg-emerald-100 text-emerald-700 border-emerald-200', dotColor: 'bg-emerald-500' },
  requirement: { label: 'Requirement', color: 'bg-blue-100 text-blue-700 border-blue-200',    dotColor: 'bg-blue-400'   },
  discussion:  { label: 'Discussion',  color: 'bg-amber-100 text-amber-700 border-amber-200', dotColor: 'bg-amber-400'  },
};

export const CATEGORIES = [
  { id: 'disease',     label: 'Crop Disease',  color: 'bg-rose-100 text-rose-700 border-rose-200'       },
  { id: 'soil',        label: 'Soil Issues',   color: 'bg-amber-100 text-amber-700 border-amber-200'    },
  { id: 'pest',        label: 'Pest Control',  color: 'bg-orange-100 text-orange-700 border-orange-200' },
  { id: 'irrigation',  label: 'Irrigation',    color: 'bg-blue-100 text-blue-700 border-blue-200'       },
  { id: 'weather',     label: 'Weather',       color: 'bg-sky-100 text-sky-700 border-sky-200'          },
  { id: 'equipment',   label: 'Equipment',     color: 'bg-gray-100 text-gray-700 border-gray-200'       },
  { id: 'marketplace', label: 'Marketplace',   color: 'bg-purple-100 text-purple-700 border-purple-200' },
  { id: 'advisory',    label: 'Advisory',      color: 'bg-teal-100 text-teal-700 border-teal-200'       },
  { id: 'other',       label: 'Other',         color: 'bg-green-100 text-green-700 border-green-200'    },
];

export const URGENCY = {
  low:      { label: 'Low',      color: 'bg-green-100 text-green-700 border-green-200'   },
  medium:   { label: 'Medium',   color: 'bg-amber-100 text-amber-700 border-amber-200'   },
  high:     { label: 'High',     color: 'bg-orange-100 text-orange-700 border-orange-200'},
  critical: { label: 'Critical', color: 'bg-red-100 text-red-700 border-red-200'         },
};

export const POSTS = [
  {
    id:'p1', authorId:'u1', postType:'problem', category:'disease', urgency:'high',
    cropTags:['Wheat'], region:'Madhya Pradesh',
    title:'Yellow leaves appearing on wheat crop — urgent help needed',
    description:'My wheat crop in Hoshangabad has started showing yellow discoloration on lower leaves 4 days ago and is now spreading upward. Humidity has been high. Soil pH was 6.5 last season. 5 acres affected out of 12. Applied urea 3 weeks ago. Is this rust disease or nitrogen deficiency?',
    likes:47, dislikes:2, shares:8, saved:false, createdAt:'2026-05-08T06:30:00Z',
    image: yellowLeavesWheatImg,
    comments:[
      { id:'c1', authorId:'u6', isExpert:true, createdAt:'2026-05-08T07:15:00Z', likes:32,
        text:'Based on your symptoms — yellowing from lower leaves upward in high humidity — this is Yellow Rust (Puccinia striiformis). Apply Propiconazole 25% EC @ 0.1% immediately. Spray twice at 10-day intervals. Reduce nitrogen temporarily.',
        replies:[
          { id:'r1', authorId:'u1', createdAt:'2026-05-08T07:45:00Z', likes:4, text:'Thank you Doctor! Spray entire field or only affected areas?' },
          { id:'r2', authorId:'u6', isExpert:true, createdAt:'2026-05-08T08:00:00Z', likes:18, text:'Spray the entire field — yellow rust spreads rapidly through wind spores. Cover within 48 hours.' },
        ],
      },
      { id:'c2', authorId:'u2', createdAt:'2026-05-08T08:30:00Z', likes:11, text:'We had similar issue in Punjab last season. It was yellow rust. Quick fungicide spray saved our crop. Act fast!', replies:[] },
      { id:'c3', authorId:'u5', createdAt:'2026-05-08T09:00:00Z', likes:7, text:'Which wheat variety? HD-2967 is more susceptible. Check the variety susceptibility chart from PAU.', replies:[] },
    ],
  },
  {
    id:'p2', authorId:'u4', postType:'problem', category:'disease', urgency:'critical',
    cropTags:['Tomato'], region:'Maharashtra',
    title:'Tomato plants wilting suddenly — 3000 plants at risk in Nashik',
    description:'My tomato plants have started wilting suddenly. Leaves curl and stem shows brown discoloration when cut. Happening in patches. Drip irrigation on. Temperature 38°C for past week. Suspect Fusarium Wilt. This is my main income crop this season.',
    likes:63, dislikes:1, shares:15, saved:false, createdAt:'2026-05-07T14:00:00Z',
    image: tomatoWiltImg,
    comments:[
      { id:'c4', authorId:'u9', isExpert:true, createdAt:'2026-05-07T15:30:00Z', likes:41,
        text:'Brown vascular discoloration + sudden wilting in patches is classic Fusarium oxysporum. Remove and destroy affected plants immediately. Drench remaining plants with Carbendazim 50WP @ 1g/litre. Apply Trichoderma viride soil application at 5 kg/acre.',
        replies:[
          { id:'r3', authorId:'u4', createdAt:'2026-05-07T16:00:00Z', likes:6, text:'Should I stop drip irrigation? Water might spread the fungus.' },
          { id:'r4', authorId:'u9', isExpert:true, createdAt:'2026-05-07T16:30:00Z', likes:22, text:'Reduce frequency but do NOT stop. Add copper oxychloride to drip water @ 2g/litre.' },
        ],
      },
      { id:'c5', authorId:'u11', createdAt:'2026-05-07T17:00:00Z', likes:5, text:'If you have salvageable produce, Vikram Agrotech can arrange emergency procurement. DM with quantity and location.', replies:[] },
    ],
  },
  {
    id:'p3', authorId:'u6', postType:'advice', category:'advisory', urgency:'low',
    cropTags:['Soybean','Cotton','Wheat'], region:'Madhya Pradesh',
    title:'Advisory: Complete Kharif 2026 fertilizer schedule for Black Cotton Soil',
    description:'Given the questions I have been receiving, here is a comprehensive fertilizer schedule for black cotton soil (vertisol) during Kharif 2026. Black cotton soil is rich in calcium and magnesium but deficient in zinc and boron. Soybean — apply 20:60:20 NPK at sowing + foliar zinc sulfate at vegetative stage. Cotton — 60:40:40 NPK split in 3 doses. Avoid over-irrigation which causes nutrient leaching.',
    likes:89, dislikes:0, shares:34, saved:false, createdAt:'2026-05-06T10:00:00Z',
    image:null,
    comments:[
      { id:'c6', authorId:'u1', createdAt:'2026-05-06T11:00:00Z', likes:8, text:'Very helpful Dr. Sharma! What about micronutrient deficiency in soybean? I see interveinal chlorosis.',
        replies:[
          { id:'r5', authorId:'u6', isExpert:true, createdAt:'2026-05-06T11:30:00Z', likes:15, text:'Interveinal chlorosis in soybean indicates Iron or Manganese deficiency. Apply FeSO4 @ 0.5% foliar spray twice at 10-day interval.' },
        ],
      },
      { id:'c7', authorId:'u3', createdAt:'2026-05-06T12:00:00Z', likes:6, text:'What about mustard in Rajasthan? We have alkaline soil pH around 8.2.',
        replies:[
          { id:'r6', authorId:'u7', isExpert:true, createdAt:'2026-05-06T12:45:00Z', likes:19, text:'For alkaline soils, use gypsum @ 200 kg/acre before sowing. Apply sulfur-coated urea instead of regular urea.' },
        ],
      },
    ],
  },
  {
    id:'p4', authorId:'u3', postType:'problem', category:'pest', urgency:'high',
    cropTags:['Cotton'], region:'Rajasthan',
    title:'Pink bollworm attack on cotton — 30% crop affected near Jodhpur',
    description:'My 8-acre cotton field near Jodhpur is under severe pink bollworm attack. Entry holes on bolls, cotton fluff turning pink inside. About 30% crop affected. Very hot weather (42°C) this week. Last spray was 20 days ago with cypermethrin. What should I use now?',
    likes:38, dislikes:3, shares:6, saved:false, createdAt:'2026-05-07T08:00:00Z',
    image: pinkbollwormImg,
    comments:[
      { id:'c8', authorId:'u10', isExpert:true, createdAt:'2026-05-07T09:30:00Z', likes:29,
        text:'Pink bollworm is resistant to pyrethroids in many areas. Switch to: Emamectin benzoate 5% SG @ 0.5g/litre OR Chlorantraniliprole 18.5% SC @ 0.3ml/litre. Use pheromone traps @ 5/acre. Spray after 6 PM when temp is below 35°C.',
        replies:[] },
      { id:'c9', authorId:'u1', createdAt:'2026-05-07T10:00:00Z', likes:9, text:'We faced similar attack in MP. Pheromone traps worked well. Once you see 8+ moths/trap/week, spray immediately.', replies:[] },
    ],
  },
  {
    id:'p5', authorId:'u11', postType:'requirement', category:'marketplace', urgency:'medium',
    cropTags:['Wheat'], region:'Gujarat',
    title:'BUYING: Bulk wheat procurement — 500 MT required, Grade A quality',
    description:'Vikram Agrotech Ltd is looking to procure 500 metric tonnes of wheat directly from farmers. Price: ₹2,250/quintal (above MSP). Payment within 7 days. Pickup arranged by us. Quality: moisture below 12%, protein above 10%. Preferred states: MP, Rajasthan, Haryana. Zero middlemen, direct bank transfer.',
    likes:52, dislikes:0, shares:28, saved:false, createdAt:'2026-05-06T16:00:00Z',
    image:null,
    comments:[
      { id:'c10', authorId:'u1', createdAt:'2026-05-06T17:00:00Z', likes:7, text:'I have 50 quintal of HD-3086 wheat ready. Moisture 11.2%. Can deliver to nearest depot. How to contact your procurement team?',
        replies:[
          { id:'r7', authorId:'u11', createdAt:'2026-05-06T17:30:00Z', likes:12, text:'Please email procurement@vikramagro.com with details. Our team will visit within 48 hours for quality check.' },
        ],
      },
      { id:'c11', authorId:'u3', createdAt:'2026-05-06T18:00:00Z', likes:5, text:'Is this price for FAQ grade or bold grain? We have bold Rajasthan wheat — can we get premium?', replies:[] },
    ],
  },
  {
    id:'p6', authorId:'u5', postType:'problem', category:'irrigation', urgency:'medium',
    cropTags:['Sugarcane'], region:'Uttar Pradesh',
    title:'Drip irrigation pipes cracking after summer heat — seeking advice',
    description:'My drip irrigation system pipes (installed 2 years ago) have developed cracks in multiple places after this summer heat. Pipes become hard and brittle in morning then flexible in afternoon. Quality issue or normal degradation? Should I replace entire system or only affected sections? 4 acres sugarcane.',
    likes:24, dislikes:1, shares:4, saved:false, createdAt:'2026-05-07T11:00:00Z',
    image:null,
    comments:[
      { id:'c12', authorId:'u7', isExpert:true, createdAt:'2026-05-07T12:00:00Z', likes:17,
        text:'UV degradation of LLDPE pipes is common after 2-3 seasons in high-temp areas. Cover drip lines with mulch to reduce UV exposure. For replacement — only replace brittle sections. Use ISI-marked 16mm drip tape (200 micron minimum). Reduce system pressure slightly — high pressure accelerates cracking.',
        replies:[] },
    ],
  },
  {
    id:'p7', authorId:'u2', postType:'problem', category:'disease', urgency:'critical',
    cropTags:['Rice','Paddy'], region:'Punjab',
    title:'Rice blast disease spreading in paddy field — what to do?',
    description:'Seeing diamond-shaped lesions with brown borders and grey centers on rice leaves. Some nodes blackening. Started from one corner, spreading. Rainfall frequent. Paddy at tillering stage, variety PR-126. Please help urgently.',
    likes:71, dislikes:0, shares:19, saved:false, createdAt:'2026-05-05T09:00:00Z',
    image: riceBlastImg,
    comments:[
      { id:'c13', authorId:'u8', isExpert:true, createdAt:'2026-05-05T10:00:00Z', likes:48,
        text:'Classic rice blast (Pyricularia oryzae). Apply Tricyclazole 75% WP @ 6g/10L immediately. Spray twice at 10-day interval. Drain field water for 3-4 days. Do NOT apply excess nitrogen now — it increases blast susceptibility.',
        replies:[
          { id:'r8', authorId:'u2', createdAt:'2026-05-05T10:30:00Z', likes:5, text:'Should I spray healthy areas too as prevention?' },
          { id:'r9', authorId:'u8', isExpert:true, createdAt:'2026-05-05T11:00:00Z', likes:21, text:'Yes, preventive spray essential at tillering and panicle initiation. Blast spreads through air spores rapidly in humid conditions.' },
        ],
      },
    ],
  },
  {
    id:'p8', authorId:'u7', postType:'advice', category:'soil', urgency:'low',
    cropTags:['Wheat','Soybean','Cotton'], region:'Karnataka',
    title:'Advisory: How to test and improve soil health before Kharif sowing',
    description:'Before you sow your Kharif crop, every farmer should conduct a basic soil test. Step-by-step: 1) Collect soil sample from 6-8 spots in zigzag pattern, depth 15cm. 2) Mix all samples, air dry, send 500g to nearest KVK. 3) Test results give NPK status, pH, organic carbon, and micronutrients. 4) Apply only what your soil lacks. pH 6.0-7.5 is ideal. OC above 0.75% is good.',
    likes:94, dislikes:1, shares:47, saved:false, createdAt:'2026-05-04T10:00:00Z',
    image:null,
    comments:[
      { id:'c14', authorId:'u3', createdAt:'2026-05-04T11:00:00Z', likes:8, text:'Very useful! Where can soil testing be done in Rajasthan besides KVK?',
        replies:[
          { id:'r10', authorId:'u7', isExpert:true, createdAt:'2026-05-04T11:30:00Z', likes:14, text:'In Rajasthan: Agriculture Research Stations at Durgapura (Jaipur), Kota, Bikaner. Private labs in each district HQ do tests for ₹200-500 per sample.' },
        ],
      },
    ],
  },
  {
    id:'p9', authorId:'u12', postType:'requirement', category:'marketplace', urgency:'medium',
    cropTags:['Tomato'], region:'Maharashtra',
    title:'BUYING: Organic tomatoes required — 10 tonnes minimum, Nashik/Pune area',
    description:'Fresh Farms Exports looking for certified organic tomatoes for export. Requirements: Min 10 tonnes/lot. PGS-India or NPOP organic certification. Hybrid long shelf-life variety. Red uniform, 60-70mm size. Premium price 20% above market rate. Zero pesticide residue — we conduct residue testing before payment.',
    likes:35, dislikes:0, shares:14, saved:false, createdAt:'2026-05-06T09:00:00Z',
    image:null,
    comments:[
      { id:'c15', authorId:'u4', createdAt:'2026-05-06T10:00:00Z', likes:9, text:'I grow hybrid tomatoes in Nashik under PGS organic. Current crop about 8 tonnes. Can I partner with another farmer for 10-tonne requirement?',
        replies:[
          { id:'r11', authorId:'u12', createdAt:'2026-05-06T10:30:00Z', likes:11, text:'Yes, group procurement welcome. Coordinate with other certified farmers and we will do single inspection visit.' },
        ],
      },
    ],
  },
  {
    id:'p10', authorId:'u1', postType:'problem', category:'soil', urgency:'medium',
    cropTags:['Soybean'], region:'Madhya Pradesh',
    title:'Soybean leaves showing interveinal chlorosis — nutrient deficiency?',
    description:'My soybean crop (JS-9305) shows yellowing between leaf veins while veins remain green. More prominent on younger leaves. Soil pH 7.8 (slightly alkaline). Applied DAP and urea at recommended dose. Is this iron deficiency or manganese?',
    likes:29, dislikes:0, shares:5, saved:false, createdAt:'2026-05-06T14:00:00Z',
    image: soybeanImg,
    comments:[
      { id:'c16', authorId:'u6', isExpert:true, createdAt:'2026-05-06T15:00:00Z', likes:23,
        text:'Interveinal chlorosis on younger leaves at pH 7.8 — this is Iron deficiency. At high pH, iron becomes unavailable even if present. Apply chelated iron (Fe-EDTA) @ 0.5% foliar spray. Also add citric acid @ 1g/litre in spray water. 2-3 sprays at weekly intervals.',
        replies:[] },
    ],
  },
  {
    id:'p11', authorId:'u13', postType:'requirement', category:'marketplace', urgency:'medium',
    cropTags:['Rice','Basmati'], region:'Punjab',
    title:'BUYING: 200 MT Basmati Rice — premium rates for certified GI Basmati',
    description:'Punjab Rice Mills requires 200 MT of Pusa Basmati 1121 or 1509. Offering ₹3,800-4,200/quintal depending on quality. Requirements: Moisture below 13%, grain length above 7.5mm, broken below 2%. Direct payment in 15 days. Prefer Amritsar, Gurdaspur, Tarn Taran districts.',
    likes:44, dislikes:0, shares:21, saved:false, createdAt:'2026-05-05T16:00:00Z',
    image:null,
    comments:[
      { id:'c17', authorId:'u2', createdAt:'2026-05-05T17:00:00Z', likes:6, text:'I have 30 quintal Pusa 1509 ready. Just harvested. Moisture 12.4%. Located Tarn Taran district. Interested.', replies:[] },
    ],
  },
  {
    id:'p12', authorId:'u9', postType:'advice', category:'advisory', urgency:'low',
    cropTags:['Onion'], region:'Maharashtra',
    title:'Advisory: Pre-harvest & post-harvest management for onion to reduce storage losses',
    description:'Maharashtra farmers: Onion storage losses of 20-40% are preventable. Pre-harvest — stop irrigation 10 days before harvest. Harvest when 50% tops fall naturally. Post-harvest — cure in field for 7-10 days, then shift to ventilated storage. Temperature 25-30°C, RH 65-70%. Key mistake — storing wet onion. Ensure neck is dry.',
    likes:76, dislikes:0, shares:39, saved:false, createdAt:'2026-05-03T10:00:00Z',
    image:null,
    comments:[
      { id:'c18', authorId:'u4', createdAt:'2026-05-03T11:00:00Z', likes:7, text:'What about CIPC sprout suppressant treatment for long-term storage?',
        replies:[
          { id:'r12', authorId:'u9', isExpert:true, createdAt:'2026-05-03T11:45:00Z', likes:16, text:'CIPC is effective for 4-6 month storage at 30ppm. For export market, check residue limits as some countries restrict CIPC. For domestic — approved and works well.' },
        ],
      },
    ],
  },
  {
    id:'p13', authorId:'u1', postType:'discussion', category:'other', urgency:'low',
    cropTags:['Wheat','Rice'], region:'Madhya Pradesh',
    title:'Which drip irrigation brand is best for small farmers in central India?',
    description:'I am planning to install drip irrigation on my remaining 7 acres next season. I have used Jain Irrigation on my 5-acre plot for 2 years and it has been good. Has anyone used Netafim, Finolex or local brands? What is your experience with after-sales service in MP? Budget is limited so looking for best value.',
    likes:31, dislikes:2, shares:9, saved:false, createdAt:'2026-05-04T16:00:00Z',
    image:null,
    comments:[
      { id:'c19', authorId:'u5', createdAt:'2026-05-04T17:00:00Z', likes:8, text:'I have used Finolex on my potato field for 3 seasons. Very good quality. Service center in Agra is responsive.', replies:[] },
      { id:'c20', authorId:'u3', createdAt:'2026-05-04T18:00:00Z', likes:5, text:'Netafim is premium but expensive. For small farmers, Jain or Finolex give better value. Also check PMKSY subsidy — you can get 50% subsidy on drip installation.', replies:[] },
    ],
  },
  {
    id:'p14', authorId:'u8', postType:'advice', category:'advisory', urgency:'medium',
    cropTags:['Wheat'], region:'Punjab',
    title:'Wheat variety selection guide for Rabi 2026-27 season — Punjab & Haryana',
    description:'Farmers planning for Rabi 2026-27: Here is my updated variety recommendation. For rust resistance: HD-3226, PBW-677, GW-496. For yield potential: DBW-303, HD-3086. Avoid HD-2967 as it is susceptible to yellow rust. Sow between Oct 15 - Nov 15 for optimal yield. Late sowing reduces yield by 35 kg/day delay after Nov 25.',
    likes:67, dislikes:0, shares:52, saved:false, createdAt:'2026-05-02T10:00:00Z',
    image:null,
    comments:[
      { id:'c21', authorId:'u2', createdAt:'2026-05-02T11:00:00Z', likes:11, text:'Prof. Gupta, what about HD-3226 performance in high humidity areas near river belt?',
        replies:[
          { id:'r13', authorId:'u8', isExpert:true, createdAt:'2026-05-02T11:45:00Z', likes:19, text:'HD-3226 performs very well in high-humidity conditions. It has excellent stripe rust resistance and gives consistent 50-55 quintal/acre yield in such conditions.' },
        ],
      },
    ],
  },
  {
    id:'p15', authorId:'u4', postType:'discussion', category:'other', urgency:'low',
    cropTags:['Onion','Tomato'], region:'Maharashtra',
    title:'Organic farming experiences — is it worth the 3-year transition period?',
    description:'I have been considering converting 2 acres to organic farming. Many farmers in Nashik area have done it for export market. Transition period of 3 years is difficult financially. Has anyone gone through this? What was your experience? Did you get PGS certification? What premium did you receive in market? Any government support available?',
    likes:43, dislikes:1, shares:12, saved:false, createdAt:'2026-05-03T14:00:00Z',
    image:null,
    comments:[
      { id:'c22', authorId:'u12', createdAt:'2026-05-03T15:00:00Z', likes:14, text:'From buyer perspective — organic certified produce commands 20-40% premium. We at Fresh Farms Exports specifically look for PGS certified farmers. Transition period is hard but worth it if you have buyer tie-ups from start.', replies:[] },
      { id:'c23', authorId:'u9', isExpert:true, createdAt:'2026-05-03T16:00:00Z', likes:21,
        text:'Transition period financial planning: Apply for PKVY (Paramparagat Krishi Vikas Yojana) — you get ₹50,000/ha over 3 years for organic conversion. Also join a cluster group — marketing becomes easier.',
        replies:[] },
    ],
  },
];

export const MANDI_PRICES = [
  { crop:'Wheat',   hindi:'गेहूं',   price:2180, change:+45,  trend:'up',   mandi:'Bhopal',    state:'MP' },
  { crop:'Rice',    hindi:'चावल',    price:3250, change:-60,  trend:'down', mandi:'Amritsar',  state:'PB' },
  { crop:'Soybean', hindi:'सोयाबीन', price:4200, change:+120, trend:'up',   mandi:'Ujjain',    state:'MP' },
  { crop:'Cotton',  hindi:'कपास',    price:6800, change:+180, trend:'up',   mandi:'Rajkot',    state:'GJ' },
  { crop:'Onion',   hindi:'प्याज',   price:2200, change:+340, trend:'up',   mandi:'Lasalgaon', state:'MH' },
  { crop:'Tomato',  hindi:'टमाटर',   price:1800, change:-250, trend:'down', mandi:'Nasik',     state:'MH' },
  { crop:'Potato',  hindi:'आलू',     price:1200, change:+80,  trend:'up',   mandi:'Agra',      state:'UP' },
  { crop:'Mustard', hindi:'सरसों',   price:5100, change:+95,  trend:'up',   mandi:'Alwar',     state:'RJ' },
];

export const WEATHER_CITIES = [
  { city:'Bhopal',    temp:37, humidity:58, rain:15, condition:'Partly Cloudy' },
  { city:'Jaipur',    temp:41, humidity:32, rain:5,  condition:'Hot & Sunny'   },
  { city:'Nagpur',    temp:39, humidity:61, rain:20, condition:'Humid'         },
  { city:'Ahmedabad', temp:43, humidity:28, rain:0,  condition:'Clear & Hot'   },
  { city:'Raipur',    temp:35, humidity:72, rain:40, condition:'Overcast'      },
];

export const TRENDING_TAGS = [
  '#YellowLeaves','#RustDisease','#TomatoWilt','#LowYield',
  '#PestAttack','#WaterStress','#Heatwave','#SoilAcidity',
  '#FruitDrop','#DroughtStress','#PinkBollworm','#RiceBlast',
];

export const TOP_AGRONOMISTS = [
  { id:'u6',  name:'Dr. Amit Sharma',    initials:'AS', color:'#1b5e20', expertise:'Crop Disease & Pathology',  helpedCount:287, posts:34 },
  { id:'u7',  name:'Dr. Kavitha Reddy',  initials:'KR', color:'#1b5e20', expertise:'Soil Health & Nutrition',   helpedCount:214, posts:28 },
  { id:'u8',  name:'Prof. Suresh Gupta', initials:'SG', color:'#1b5e20', expertise:'Wheat & Cereal Crops',      helpedCount:189, posts:22 },
  { id:'u9',  name:'Dr. Anita Borse',    initials:'AB', color:'#1b5e20', expertise:'Horticulture & Post-Harvest',helpedCount:156, posts:19 },
];

export const CROP_CATEGORIES = ['All','Wheat','Rice','Tomato','Soybean','Cotton','Onion','Potato','Mustard','Maize','Sugarcane'];

export const REGIONS = ['All Regions','Madhya Pradesh','Punjab','Maharashtra','Rajasthan','Gujarat','Uttar Pradesh','Karnataka','Haryana','Chhattisgarh'];
