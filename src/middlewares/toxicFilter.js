const { Filter } = require('bad-words');
const filter = new Filter();

// Original + Common Hindi/Hinglish Gaaliyan
const hindiGaaliyan = [
    'madarchod', 'maadarchod', 'maderchod', 'madarchod',
    'behenchod', 'bhenchod', 'bhenchood', 'behen ke lode',
    'chutiya', 'chutiye', 'chutia', 'chutiyaa', 'chootiya',
    'bhosdi', 'bhosdike', 'bhosdi ke', 'bhosdiwala',
    'gaand', 'gaandu', 'gandu', 'gaand mar',
    'lund', 'lode', 'laude', 'lavde', 'lodu', 'lawda', 'lawde',
    'chut', 'choot', 'chootmar',
    'randi', 'randibaaz', 'randi ka',
    'harami', 'haramzaade', 'haramkhor',
    'kamine', 'kamina', 'kamini',
    'saala', 'saale',
    'bc', 'mc', 'bsdk', 'bhen ke', 'maa ki',
    'maa chod', 'behen chod', 'tera baap', 'teri maa',
    'bakchod', 'bakchodi', 'jhantu', 'jhaantu', 'gandmasti'
];

// Smart Bypass / Leetspeak / Symbol Variations (Anti-Bypass List)
const bypassVariations = [
    // English + Hindi mixed common bypasses
    'm@d@rc#@d', 'm@darch0d', 'mad@rc0d', 'm4d4rch0d', 'm@d@rch0d',
    'bh3nch0d', 'bhench0d', 'bh3nch0d', 'b$dk', 'bsdk', 'bhen ke l0de',
    'chut1ya', 'chut!ya', 'ch00tiya', 'chut!yaa', 'chutiya4',
    'bh0sdike', 'bhosd!ke', 'bh0sdi', 'b#0sd1',
    'g@andu', 'ga@ndu', 'g4andu', 'gaand$', 'g@nd',
    'l0de', 'l4wda', 'l4ude', 'l@ude', 'l@nd', 'l0nd',
    'ch00t', 'chut!', 'chut$', 'ch0ot',
    'r@ndi', 'r4ndi', 'rand!', 'r@ndibaaz',
    'h@r@mi', 'haramz@d3', 'k@m!na', 'k4m!na',
    's4ala', 's@ale', 'saal3',
    'm@ ki chut', 'm@ ki ch00t', 'bhen ki ch00t',
    't3ri m@', 't3ri m4a', 'm4a ch0d', 'beh3n ch0d',
    
    // More aggressive variations
    '@ss', 'f@ck', 'fucker', 'b!tch', 'b!tc#',
    'm@darch0d', 'm@d@rch0d', 'madarch0d',
    'bhench0d', 'bh3nch0d', 'b$h3nch0d',
    'chut!y@', 'chut!ya', 'ch00tiya',
    'g@ndu', 'g@ndm@st!', 'l@wd@',
    '#arami', 'k@min@', 'r@ndi',
    'bsdk', 'b$dk', 'mc', 'bc', 'm$c'
];

// Combine both lists
const allBadWords = [...hindiGaaliyan, ...bypassVariations];

// Add all words to the filter at once
filter.addWords(...allBadWords);

const toxicFilter = (req, res, next) => {
  if (req.body.caption) {
    const caption = req.body.caption.toLowerCase(); // Extra safety

    if (filter.isProfane(caption) || filter.isProfane(req.body.caption)) {
      return res.status(400).json({ 
        message: 'Aura Check Failed: Toxic language is not allowed in the Arena. Keep it clean!' 
      });
    }
  }
  
  next();
};

module.exports = { toxicFilter };