export const SITE_ORIGIN = "https://www.aksharestate.in";

export function slugifyLocation(value) {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/\./g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const primaryRegions = [
  {
    slug: "gandhinagar",
    name: "Gandhinagar",
    city: "Gandhinagar",
    title: "Properties for Sale in Gandhinagar | Akshar Estate",
    h1: "Properties for Sale in Gandhinagar",
    intro: "Gandhinagar is a planned capital city with strong demand around civic offices, education hubs, GIFT City connectivity and emerging residential corridors.",
    nearbyAreas: ["Kudasan", "Sargasan", "Vavol", "Pethapur", "Palaj", "Dhanap", "Adalaj"],
    landmarks: ["GIFT City", "IIT Gandhinagar", "Akshardham", "Mahatma Mandir", "Sargasan Cross Road"],
    connectivity: "The city connects to Ahmedabad through SG Highway, Gift City Road, Airport Road and the expanding metro-led urban corridor.",
    verified: true,
  },
  {
    slug: "ahmedabad",
    name: "Ahmedabad",
    city: "Ahmedabad",
    title: "Properties for Sale in Ahmedabad | Akshar Estate",
    h1: "Properties for Sale in Ahmedabad",
    intro: "Ahmedabad has a wide real estate mix, from apartments and plotted developments to commercial corridors across the west, north and south belts.",
    nearbyAreas: ["Bopal", "South Bopal", "Shela", "Thaltej", "Gota", "Science City"],
    landmarks: ["SG Highway", "SP Ring Road", "Science City", "Gujarat University", "Sabarmati Riverfront"],
    connectivity: "SG Highway, SP Ring Road, BRTS routes, metro access and airport connectivity shape the major property corridors.",
    verified: true,
  },
  {
    slug: "ahmedabad-west",
    name: "Ahmedabad West",
    city: "Ahmedabad",
    locations: ["Bopal", "South Bopal", "Shela", "Ghuma", "Science City", "Thaltej", "Gota", "S.G. Highway"],
    title: "Properties for Sale in Ahmedabad West | Akshar Estate",
    h1: "Properties for Sale in Ahmedabad West",
    intro: "Ahmedabad West is preferred for premium apartments, family housing, schools, hospitals and strong SG Highway and SP Ring Road access.",
    nearbyAreas: ["Bopal", "South Bopal", "Shela", "Ghuma", "Science City", "Thaltej"],
    landmarks: ["SG Highway", "Sindhu Bhavan Road", "Science City", "SP Ring Road", "ISKCON Cross Road"],
    connectivity: "This belt connects quickly to commercial offices, education zones and ring-road exits toward Sanand and Gandhinagar.",
    verified: true,
  },
  {
    slug: "north-ahmedabad",
    name: "North Ahmedabad",
    city: "Ahmedabad",
    locations: ["Chandkheda", "Motera", "Tragad", "Zundal", "Vaishnodevi"],
    title: "Properties for Sale in North Ahmedabad | Akshar Estate",
    h1: "Properties for Sale in North Ahmedabad",
    intro: "North Ahmedabad draws buyers looking for airport access, metro proximity, Motera sports district connectivity and Gandhinagar-side growth.",
    nearbyAreas: ["Chandkheda", "Motera", "Zundal", "Tragad", "Vaishnodevi"],
    landmarks: ["Narendra Modi Stadium", "Sabarmati", "Vaishnodevi Circle", "Tapovan Circle", "Airport Road"],
    connectivity: "The corridor benefits from metro stations, SG Highway, SP Ring Road and routes toward Gandhinagar and the airport.",
    verified: true,
  },
  {
    slug: "south-west-ahmedabad",
    name: "South West Ahmedabad",
    city: "Ahmedabad",
    locations: ["Bopal", "South Bopal", "Shela", "Ghuma", "Shantipura", "Sanathal"],
    title: "Properties for Sale in South West Ahmedabad | Akshar Estate",
    h1: "Properties for Sale in South West Ahmedabad",
    intro: "South West Ahmedabad is a high-demand residential belt with gated communities, plotted projects and easy SP Ring Road access.",
    nearbyAreas: ["South Bopal", "Shela", "Ghuma", "Shantipura", "Sanathal"],
    landmarks: ["SP Ring Road", "Bopal Circle", "Shantipura Circle", "Club 07 Road", "Sanathal Cross Road"],
    connectivity: "The area links efficiently to SG Highway, Sanand, Sarkhej and corporate zones around Prahladnagar and Sindhu Bhavan.",
    verified: true,
  },
  {
    slug: "east-ahmedabad",
    name: "East Ahmedabad",
    city: "Ahmedabad",
    locations: ["Naroda", "Kathwada", "Odhav", "Bapunagar", "Vatva", "Singarva"],
    title: "Properties for Sale in East Ahmedabad | Akshar Estate",
    h1: "Properties for Sale in East Ahmedabad",
    intro: "East Ahmedabad offers industrial access, affordable homes and investment options around Naroda, Odhav, Kathwada and Vatva.",
    nearbyAreas: ["Naroda", "Kathwada", "Odhav", "Bapunagar", "Vatva"],
    landmarks: ["Naroda GIDC", "Odhav GIDC", "SP Ring Road", "Express Highway", "Bapunagar Market"],
    connectivity: "The eastern belt connects with industrial estates, ring-road routes and highway movement toward Vadodara and Gandhinagar.",
    verified: true,
  },
  {
    slug: "south-ahmedabad",
    name: "South Ahmedabad",
    city: "Ahmedabad",
    locations: ["Isanpur", "Mota Isanpur", "Lambha", "Vatva", "Bareja", "Changodar"],
    title: "Properties for Sale in South Ahmedabad | Akshar Estate",
    h1: "Properties for Sale in South Ahmedabad",
    intro: "South Ahmedabad has practical residential and land options around industrial, logistics and ring-road corridors.",
    nearbyAreas: ["Isanpur", "Lambha", "Vatva", "Bareja", "Changodar"],
    landmarks: ["Narol", "Vatva GIDC", "Narol-Naroda Road", "SP Ring Road", "Changodar Industrial Estate"],
    connectivity: "Connectivity comes through Narol, SP Ring Road, NH routes and access toward Bavla, Changodar and Dholera corridors.",
    verified: true,
  },
  {
    slug: "central-gujarat",
    name: "Central Gujarat",
    locations: ["Ahmedabad", "Gandhinagar", "Nadiad", "Anand", "Mahemdavad"],
    title: "Properties for Sale in Central Gujarat | Akshar Estate",
    h1: "Properties for Sale in Central Gujarat",
    intro: "Central Gujarat combines mature city markets, highway-linked towns and land corridors across Ahmedabad, Gandhinagar, Anand and Nadiad.",
    nearbyAreas: ["Ahmedabad", "Gandhinagar", "Anand", "Nadiad", "Mahemdavad"],
    landmarks: ["Ahmedabad-Vadodara Expressway", "GIFT City", "SP Ring Road", "Anand-Nadiad Corridor"],
    connectivity: "The region is supported by expressway, railway and industrial links between Ahmedabad, Vadodara and Saurashtra-bound routes.",
    verified: true,
  },
  {
    slug: "north-gujarat",
    name: "North Gujarat",
    locations: ["Gandhinagar", "Kalol", "Kadi", "Dehgam", "Vijapur", "Prantij"],
    title: "Properties for Sale in North Gujarat | Akshar Estate",
    h1: "Properties for Sale in North Gujarat",
    intro: "North Gujarat has a mix of capital-region housing, plotted investments, agricultural land and highway-led growth pockets.",
    nearbyAreas: ["Gandhinagar", "Kalol", "Kadi", "Dehgam", "Vijapur"],
    landmarks: ["Gandhinagar", "Kalol Industrial Belt", "Mahudi Road", "Mehsana Highway"],
    connectivity: "State highways, industrial routes and Gandhinagar-Ahmedabad access support residential and land demand across this region.",
    verified: true,
  },
];

const localityDefinitions = [
  ["gandhinagar", "Kudasan", "Gandhinagar", "A preferred apartment and commercial pocket between Gandhinagar and GIFT City, popular for new housing and everyday convenience.", ["Sargasan", "Raysan", "GIFT City", "Vavol"], ["Kudasan Cross Road", "GIFT City Road", "Sargasan Circle"], "Kudasan connects quickly to GIFT City, Sargasan, Infocity and Ahmedabad through SG Highway and capital-region roads."],
  ["gandhinagar", "Sargasan", "Gandhinagar", "A fast-growing Gandhinagar locality with apartment projects, retail activity and strong access to Kudasan, Raysan and GIFT City.", ["Kudasan", "Vavol", "Raysan", "Palaj"], ["Sargasan Cross Road", "GIFT City Road", "PDPU Road"], "Sargasan benefits from arterial roads toward GIFT City, Infocity, Gandhinagar city centre and Ahmedabad."],
  ["gandhinagar", "Vavol", "Gandhinagar", "A practical residential locality in Gandhinagar with family housing, plotted pockets and access to Sargasan and Pethapur.", ["Sargasan", "Pethapur", "Kudasan", "Randheja"], ["Vavol Road", "Pethapur Road", "Gandhinagar Sector Access"], "Vavol links with central Gandhinagar, Pethapur and the Sargasan-Kudasan corridor."],
  ["gandhinagar", "Pethapur", "Gandhinagar", "A traditional Gandhinagar-side locality with residential plots, independent homes and access toward Vavol and Randheja.", ["Vavol", "Randheja", "Mahudi Road", "Gandhinagar"], ["Pethapur Road", "Randheja Road", "Gandhinagar Sector Area"], "Pethapur connects with Gandhinagar city roads and north-side routes toward Randheja and Mahudi."],
  ["gandhinagar", "Dhanap", "Gandhinagar", "A Gandhinagar-side land and residential pocket for buyers comparing quieter property options near the capital city and nearby north-side areas.", ["Gandhinagar", "Pundrasan", "Pethapur", "Lavarpur"], ["Dhanap", "Gandhinagar side", "North Gandhinagar approach"], "Dhanap connects with Gandhinagar city access roads and nearby north-side localities such as Pundrasan, Pethapur and Lavarpur.", [], { rolloutPhase: 17 }],
  ["gandhinagar", "GIFT City", "Gandhinagar", "A premium business district and investment corridor for buyers looking near offices, finance-sector growth and modern infrastructure.", ["Kudasan", "Raysan", "Sargasan", "PDPU Road"], ["GIFT City", "GIFT City Club", "PDPU", "Sabarmati Riverfront GIFT Link"], "GIFT City connects to Gandhinagar, Ahmedabad airport, SG Highway and the expanding metro corridor."],
  ["north-gujarat", "Dehgam", "Gujarat", "A north Gujarat market to prepare for future land, residential and plotted inventory once listings and local verification are available.", ["Gandhinagar", "Mahudi", "Vijapur", "Prantij"], ["Dehgam", "North Gujarat corridor", "Gandhinagar-side routes"], "Dehgam connects with Gandhinagar-side routes and north Gujarat road movement.", [], { rolloutPhase: 17, verificationNote: "No active verified inventory during Phase 17." }],
  ["north-gujarat", "Mahudi", "Gujarat", "A north Gujarat location prepared for future land and residential inventory after manual locality verification and active listings are available.", ["Dehgam", "Vijapur", "Gandhinagar", "Prantij"], ["Mahudi", "North Gujarat", "Pilgrimage-side locality"], "Mahudi connects with nearby north Gujarat towns and Gandhinagar-side routes.", [], { rolloutPhase: 17, verificationNote: "No active verified inventory during Phase 17." }],
  ["north-gujarat", "Vijapur", "Gujarat", "A north Gujarat town page held for future property inventory and manual verification before SEO indexing.", ["Mahudi", "Dehgam", "Prantij", "Gandhinagar"], ["Vijapur", "North Gujarat", "Town centre"], "Vijapur connects with nearby north Gujarat towns and broader regional roads.", [], { rolloutPhase: 17, verificationNote: "No active verified inventory during Phase 17." }],
  ["north-gujarat", "Chhatral", "Gujarat", "An industrial-side north Gujarat location prepared for future property inventory once verified listings are available.", ["Kalol", "Kadi", "Gandhinagar", "Sanand"], ["Chhatral", "Industrial corridor", "North Gujarat"], "Chhatral connects with Kalol, Kadi, Gandhinagar and industrial corridor routes.", [], { rolloutPhase: 17, verificationNote: "No active verified inventory during Phase 17." }],
  ["north-gujarat", "Prantij", "Gujarat", "A north Gujarat location held for future residential, land and highway-side property inventory after verification.", ["Gandhinagar", "Dehgam", "Vijapur", "Mahudi"], ["Prantij", "North Gujarat", "Highway-side routes"], "Prantij connects with Gandhinagar-side and north Gujarat route networks.", [], { rolloutPhase: 17, verificationNote: "No active verified inventory during Phase 17." }],
  ["central-gujarat", "Nadiad", "Gujarat", "A central Gujarat city page prepared for future property inventory and local content expansion after active listings are available.", ["Anand", "Mahemdavad", "Ahmedabad", "Bareja"], ["Nadiad", "Central Gujarat", "Ahmedabad-Vadodara corridor"], "Nadiad connects with Ahmedabad, Anand and central Gujarat corridor routes.", [], { rolloutPhase: 17, verificationNote: "No active verified inventory during Phase 17." }],
  ["central-gujarat", "Anand", "Gujarat", "A central Gujarat city page held for future residential and investment inventory once Akshar Estate has active listings.", ["Nadiad", "Mahemdavad", "Ahmedabad", "Vadodara corridor"], ["Anand", "Central Gujarat", "Ahmedabad-Vadodara corridor"], "Anand connects with Nadiad, Ahmedabad, Vadodara-side movement and central Gujarat routes.", [], { rolloutPhase: 17, verificationNote: "No active verified inventory during Phase 17." }],
  ["central-gujarat", "Mahemdavad", "Gujarat", "A central Gujarat location prepared for future land and residential inventory after manual verification and active listings.", ["Nadiad", "Bareja", "Ahmedabad", "Anand"], ["Mahemdavad", "Central Gujarat", "Ahmedabad-Nadiad side"], "Mahemdavad connects with Ahmedabad, Nadiad and central Gujarat route networks.", [], { rolloutPhase: 17, verificationNote: "No active verified inventory during Phase 17." }],
  ["ahmedabad", "Viramgam", "Ahmedabad", "A wider Ahmedabad-side market prepared for future land and residential inventory once listings are verified.", ["Sanand", "Bavla", "Bagodara", "Kadi"], ["Viramgam", "Ahmedabad-side corridor", "Regional road network"], "Viramgam connects with Sanand, Bavla, Kadi-side routes and wider regional roads.", [], { rolloutPhase: 17, verificationNote: "No active verified inventory during Phase 17." }],
  ["ahmedabad", "Dholera", "Ahmedabad", "A planned investment corridor page held noindex until Akshar Estate has active verified Dholera inventory and useful listing depth.", ["Bavla", "Bagodara", "Bareja", "Lothal"], ["Dholera", "Dholera SIR corridor", "Ahmedabad-side route"], "Dholera connects with Ahmedabad-side and coastal corridor routes through Bavla and Bagodara-side movement.", [], { rolloutPhase: 17, verificationNote: "No active verified inventory during Phase 17." }],
  ["ahmedabad", "Bavla", "Ahmedabad", "An Ahmedabad-side land and industrial corridor page prepared for active inventory before indexing.", ["Changodar", "Bagodara", "Dholera", "Sanand"], ["Bavla", "Ahmedabad outskirts", "Industrial-side corridor"], "Bavla connects with Changodar, Bagodara, Dholera-side routes and Ahmedabad outskirts roads.", [], { rolloutPhase: 17, verificationNote: "No active verified inventory during Phase 17." }],
  ["ahmedabad", "Bareja", "Ahmedabad", "An Ahmedabad-side locality page held noindex until useful local inventory and manually verified content are available.", ["Mahemdavad", "Vatva", "Lambha", "Ahmedabad"], ["Bareja", "Ahmedabad-side route", "South Ahmedabad approach"], "Bareja connects with Ahmedabad-side, Vatva/Lambha-side and central Gujarat approach routes.", [], { rolloutPhase: 17, verificationNote: "No active verified inventory during Phase 17." }],
  ["ahmedabad", "Bagodara", "Ahmedabad", "A highway-side Ahmedabad outskirts location prepared for future land and industrial inventory after verification.", ["Bavla", "Dholera", "Changodar", "Viramgam"], ["Bagodara", "Highway-side locality", "Ahmedabad outskirts"], "Bagodara connects with Bavla, Dholera-side movement, Changodar and wider highway routes.", [], { rolloutPhase: 17, verificationNote: "No active verified inventory during Phase 17." }],
  ["ahmedabad", "Bopal", "Ahmedabad", "A mature west Ahmedabad residential market with apartments, shops and family-friendly access to schools and daily services.", ["South Bopal", "Ghuma", "Shela", "Ambli"], ["Bopal Circle", "SP Ring Road", "Ambli Road"], "Bopal connects to South Bopal, Ambli, SG Highway and SP Ring Road."],
  ["ahmedabad", "South Bopal", "Ahmedabad", "A premium residential belt known for gated communities, modern apartments and strong ring-road connectivity.", ["Bopal", "Shela", "Ghuma", "Shantipura"], ["South Bopal Extension", "SP Ring Road", "Club 07 Road"], "South Bopal has quick access to SP Ring Road, Shela, Shantipura, Bopal and SG Highway."],
  ["ahmedabad", "Shela", "Ahmedabad", "A high-growth south-west Ahmedabad location with new apartments, plotted schemes and good access to education and clubs.", ["South Bopal", "Ghuma", "Shantipura", "Sanathal"], ["Shela Road", "Club 07", "SP Ring Road"], "Shela connects with South Bopal, Sanathal, SP Ring Road and SG Highway via Ambli and Bopal routes."],
  ["ahmedabad", "Ghuma", "Ahmedabad", "A residential locality near Bopal and South Bopal with practical apartment and plot options for end users.", ["Bopal", "South Bopal", "Shela", "Manipur"], ["Ghuma Road", "Bopal-Ghuma Road", "SP Ring Road"], "Ghuma links with Bopal, South Bopal, Shela and Sanand-side routes."],
  ["ahmedabad", "Science City", "Ahmedabad", "A popular west Ahmedabad address for families who want apartment living near schools, hospitals and Science City Road.", ["Sola", "Thaltej", "Gota", "S.G. Highway"], ["Science City", "Science City Road", "Sola Civil Hospital"], "Science City connects to Sola, Thaltej, SG Highway, Gota and SP Ring Road."],
  ["ahmedabad", "Thaltej", "Ahmedabad", "A premium west Ahmedabad locality with established housing, offices, hospitals and fast access to SG Highway.", ["Science City", "Sola", "Bodakdev", "S.G. Highway"], ["Thaltej Cross Road", "SG Highway", "Zydus Hospital"], "Thaltej offers metro, SG Highway and Sindhu Bhavan side connectivity."],
  ["ahmedabad", "Gota", "Ahmedabad", "A north-west Ahmedabad residential hub with apartments, commercial activity and access to SG Highway and Vandematram Road.", ["Sola", "Chandlodia", "Science City", "Ognaj"], ["Gota Cross Road", "Vandematram Road", "SG Highway"], "Gota connects with SG Highway, Sola, Chandlodia, Ognaj and SP Ring Road."],
  ["ahmedabad", "S.G. Highway", "Ahmedabad", "A major commercial and residential corridor with offices, malls, apartments and premium connectivity across west Ahmedabad.", ["Thaltej", "Bodakdev", "Gota", "Vaishnodevi"], ["SG Highway", "ISKCON Cross Road", "Zydus Hospital"], "S.G. Highway is the main north-south connector for west Ahmedabad, Gandhinagar and Sanand-side movement."],
  ["ahmedabad", "Chandkheda", "Ahmedabad", "A north Ahmedabad locality with metro access, residential societies and quick connectivity to Motera and Gandhinagar.", ["Motera", "Tragad", "Zundal", "Sabarmati"], ["Chandkheda", "ONGC", "Metro Corridor"], "Chandkheda connects to Motera, Sabarmati, Gandhinagar Highway and the airport side."],
  ["ahmedabad", "Motera", "Ahmedabad", "A north Ahmedabad residential and sports district location near the stadium, metro and Sabarmati connectivity.", ["Chandkheda", "Sabarmati", "Bhat", "Zundal"], ["Narendra Modi Stadium", "Motera Stadium Metro", "Sabarmati"], "Motera connects through metro, airport road access, Chandkheda and Gandhinagar Highway."],
  ["ahmedabad", "Adalaj", "Gandhinagar", "A strategic location between Ahmedabad and Gandhinagar with plotted, residential and highway-facing investment demand.", ["Kudasan", "Vaishnodevi", "Zundal", "Gandhinagar"], ["Adalaj Stepwell", "Adalaj Circle", "SG Highway"], "Adalaj connects to Gandhinagar, Vaishnodevi, SG Highway, SP Ring Road and GIFT City-side routes."],
  ["ahmedabad", "Sanand", "Ahmedabad", "A major industrial and investment corridor with land, plotting and residential demand driven by manufacturing growth.", ["Shela", "Changodar", "Bavla", "Kolat"], ["Sanand GIDC", "Tata Motors", "Sanand Highway"], "Sanand connects to Ahmedabad through Sarkhej-Sanand Road, SP Ring Road and industrial highway networks."],
  ["ahmedabad", "Zundal", "Ahmedabad", "A north Ahmedabad growth pocket near Vaishnodevi and Chandkheda with new residential projects and ring-road access.", ["Chandkheda", "Tragad", "Vaishnodevi", "Motera"], ["Zundal Circle", "Vaishnodevi Circle", "SP Ring Road"], "Zundal connects to SG Highway, Chandkheda, Motera, Gandhinagar and airport-side routes."],
  ["ahmedabad", "Tragad", "Ahmedabad", "A north Ahmedabad locality near the Chandkheda and Vaishnodevi side, useful for buyers comparing apartment and plotted options along the Gandhinagar corridor.", ["Chandkheda", "Zundal", "Vaishnodevi", "Motera"], ["Tragad", "Vaishnodevi side", "Chandkheda side"], "Tragad connects with Chandkheda, Zundal, Vaishnodevi and north Ahmedabad routes toward Gandhinagar."],
  ["ahmedabad", "Chharodi", "Ahmedabad", "A developing Ahmedabad-side locality for buyers comparing quieter residential pockets, plotted options and access toward the north-west growth belt.", ["Vaishnodevi", "Tragad", "Gota", "Ognaj"], ["Chharodi", "Vaishnodevi side", "North-west Ahmedabad corridor"], "Chharodi connects with Vaishnodevi, Gota, Ognaj and north-west Ahmedabad approach roads."],
  ["ahmedabad", "Bodakdev", "Ahmedabad", "An established west Ahmedabad locality with residential and commercial demand near premium city services and office-led corridors.", ["Thaltej", "S.G. Highway", "Gurukul", "Memnagar"], ["Bodakdev", "S.G. Highway side", "West Ahmedabad"], "Bodakdev connects with Thaltej, Gurukul, Memnagar and S.G. Highway routes."],
  ["ahmedabad", "Sola", "Ahmedabad", "A west Ahmedabad locality near Science City and Gota, useful for buyers comparing apartments, family housing and hospital-side access.", ["Science City", "Gota", "Thaltej", "Ognaj"], ["Sola", "Science City side", "Gota side"], "Sola connects with Science City, Gota, Thaltej and north-west Ahmedabad roads."],
  ["ahmedabad", "Ognaj", "Ahmedabad", "A north-west Ahmedabad locality with bungalow, plotted and residential demand around ring-road side neighborhoods.", ["Gota", "Sola", "Science City", "Chharodi"], ["Ognaj", "S.P. Ring Road side", "North-west Ahmedabad"], "Ognaj connects with Gota, Sola, Science City and ring-road side routes."],
  ["ahmedabad", "Chandlodia", "Ahmedabad", "A practical west Ahmedabad residential locality for buyers comparing city access, apartments and nearby Gota and Ghatlodia areas.", ["Gota", "Ghatlodia", "Sola", "Naranpura"], ["Chandlodia", "Gota side", "West Ahmedabad"], "Chandlodia connects with Gota, Ghatlodia, Sola and established west Ahmedabad roads."],
  ["ahmedabad", "Ghatlodia", "Ahmedabad", "An established west Ahmedabad residential locality with everyday services and access to nearby Memnagar, Chandlodia and Sola.", ["Memnagar", "Chandlodia", "Sola", "Gurukul"], ["Ghatlodia", "Memnagar side", "West Ahmedabad"], "Ghatlodia connects with Memnagar, Chandlodia, Sola and Gurukul side routes."],
  ["ahmedabad", "Memnagar", "Ahmedabad", "An established west Ahmedabad locality with apartment, retail and office-side demand near Gurukul and Drive-In Road.", ["Gurukul", "Ghatlodia", "Bodakdev", "Thaltej"], ["Memnagar", "Gurukul side", "Drive-In Road side"], "Memnagar connects with Gurukul, Ghatlodia, Bodakdev and Thaltej side routes."],
  ["ahmedabad", "Gurukul", "Ahmedabad", "A west Ahmedabad locality known for mature residential stock and access to nearby Memnagar, Bodakdev and S.G. Highway side areas.", ["Memnagar", "Bodakdev", "Thaltej", "Ghatlodia"], ["Gurukul", "Memnagar side", "West Ahmedabad"], "Gurukul connects with Memnagar, Bodakdev, Thaltej and S.G. Highway side routes."],
  ["ahmedabad", "C.G. Road", "Ahmedabad", "A central Ahmedabad commercial and retail corridor for buyers comparing offices, shops and city-centre property options.", ["Navrangpura", "Gurukul", "Memnagar", "Bodakdev"], ["C.G. Road", "Central Ahmedabad", "Retail corridor"], "C.G. Road connects with central Ahmedabad, Navrangpura and west Ahmedabad routes."],
  ["ahmedabad", "New C.G. Road", "Ahmedabad", "A north Ahmedabad address around the Chandkheda side for buyers comparing residential options near established local services.", ["Chandkheda", "Motera", "Tragad", "Zundal"], ["New C.G. Road", "Chandkheda side", "North Ahmedabad"], "New C.G. Road connects with Chandkheda, Motera, Tragad and Gandhinagar-side movement.", ["new-c-g-road"], { duplicateOf: "/properties-for-sale/ahmedabad/chandkheda", verificationNote: "Search Console live test reported Soft 404 on July 22, 2026. Keep noindex and out of sitemap until the page has stronger unique content or more inventory." }],
  ["ahmedabad", "Naroda", "Ahmedabad", "An east Ahmedabad locality with residential and industrial-side demand for buyers comparing practical city and highway access.", ["Kathwada", "Odhav", "Bapunagar", "Singarva"], ["Naroda", "East Ahmedabad", "Industrial-side corridor"], "Naroda connects with Kathwada, Odhav, Bapunagar and eastern Ahmedabad routes."],
  ["ahmedabad", "Odhav", "Ahmedabad", "An east Ahmedabad locality useful for buyers comparing residential, warehouse and industrial-side property options.", ["Naroda", "Kathwada", "Bapunagar", "Vatva"], ["Odhav", "East Ahmedabad", "Industrial-side corridor"], "Odhav connects with Naroda, Kathwada, Bapunagar and Vatva side movement."],
  ["ahmedabad", "Kathwada", "Ahmedabad", "An east Ahmedabad locality with industrial-side and residential demand around the Naroda and Odhav belt.", ["Naroda", "Odhav", "Singarva", "Bapunagar"], ["Kathwada", "East Ahmedabad", "Naroda side"], "Kathwada connects with Naroda, Odhav, Singarva and eastern Ahmedabad roads."],
  ["ahmedabad", "Vatva", "Ahmedabad", "A south-east Ahmedabad locality with residential and industrial-side property demand near practical transport corridors.", ["Odhav", "Maninagar", "Lambha", "Isanpur"], ["Vatva", "South-east Ahmedabad", "Industrial-side corridor"], "Vatva connects with Maninagar, Odhav, Isanpur, Lambha and south Ahmedabad routes."],
  ["ahmedabad", "Maninagar", "Ahmedabad", "An established Ahmedabad locality with mature residential demand and strong access to central and south-east city areas.", ["Isanpur", "Vatva", "Khokhra", "Lambha"], ["Maninagar", "Central-south Ahmedabad", "Established residential area"], "Maninagar connects with Isanpur, Vatva, Khokhra and central Ahmedabad routes."],
  ["ahmedabad", "Changodar", "Ahmedabad", "A south-west industrial and logistics-side corridor with land, warehouse and practical residential demand around Ahmedabad outskirts.", ["Sanand", "Bavla", "Moraiya", "Sarkhej"], ["Changodar", "Industrial corridor", "Ahmedabad outskirts"], "Changodar connects with Sanand, Bavla, Moraiya, Sarkhej and highway-led industrial routes."],
  ["ahmedabad", "Moraiya", "Ahmedabad", "A south-west Ahmedabad outskirts locality for buyers comparing land, warehouse and industrial-side options near Changodar and Sanand.", ["Changodar", "Sanand", "Bavla", "Sarkhej"], ["Moraiya", "Changodar side", "Industrial-side corridor"], "Moraiya connects with Changodar, Sanand, Bavla and Ahmedabad outskirts routes."],
  ["ahmedabad", "Sanathal", "Ahmedabad", "A south-west Ahmedabad locality near Shela and Shantipura, useful for buyers comparing plotted, residential and investment options.", ["Shela", "Shantipura", "South Bopal", "Changodar"], ["Sanathal", "Shela side", "South-west Ahmedabad"], "Sanathal connects with Shela, Shantipura, South Bopal and Changodar-side roads."],
  ["ahmedabad", "Shantipura", "Ahmedabad", "A south-west Ahmedabad locality near South Bopal and Sanathal, useful for buyers comparing residential and plotted options.", ["South Bopal", "Shela", "Sanathal", "Ghuma"], ["Shantipura", "South Bopal side", "South-west Ahmedabad"], "Shantipura connects with South Bopal, Shela, Sanathal and Ghuma side routes."],
  ["ahmedabad", "Godhavi", "Ahmedabad", "A south-west Ahmedabad outskirts locality for buyers comparing land, plotted and quieter residential options around the Bopal-Sanand side.", ["Bopal", "Ghuma", "Sanand", "Shela"], ["Godhavi", "Bopal-Sanand side", "Ahmedabad outskirts"], "Godhavi connects with Bopal, Ghuma, Sanand and Shela-side routes."],
  ["ahmedabad", "Vaishnodevi", "Ahmedabad", "A north Ahmedabad growth location for buyers comparing apartments and plotted options near Zundal, Tragad and Gandhinagar-side access.", ["Zundal", "Tragad", "Chharodi", "Chandkheda"], ["Vaishnodevi", "North Ahmedabad", "Gandhinagar-side corridor"], "Vaishnodevi connects with Zundal, Tragad, Chharodi and Chandkheda side routes."],
  ["gandhinagar", "Kalol", "Gandhinagar", "A north Gujarat and Gandhinagar-side market with residential, land and industrial-side property demand.", ["Gandhinagar", "Kadi", "Chhatral", "Adalaj"], ["Kalol", "North Gujarat corridor", "Gandhinagar side"], "Kalol connects with Gandhinagar, Kadi, Chhatral and north Gujarat routes."],
  ["gandhinagar", "Kadi", "Gandhinagar", "A north Gujarat market for buyers comparing land, residential and industrial-side opportunities near Kalol and Gandhinagar routes.", ["Kalol", "Chhatral", "Gandhinagar", "Sanand"], ["Kadi", "North Gujarat corridor", "Kalol side"], "Kadi connects with Kalol, Chhatral, Gandhinagar and wider north Gujarat routes."],
];

const localityPages = localityDefinitions.map(([regionSlug, name, city, intro, nearbyAreas, landmarks, connectivity, matchSlugsOrOptions = [], options = {}]) => {
  const matchSlugs = Array.isArray(matchSlugsOrOptions) ? matchSlugsOrOptions : [];
  const pageOptions = Array.isArray(matchSlugsOrOptions) ? options : matchSlugsOrOptions || {};
  return {
    regionSlug,
    slug: slugifyLocation(name),
    name,
    city,
    title: `Properties for Sale in ${name}, ${city} | Akshar Estate`,
    h1: `Properties for Sale in ${name}, ${city}`,
    intro,
    nearbyAreas,
    landmarks,
    connectivity,
    matchSlugs,
    verified: pageOptions.verified ?? true,
    rolloutPhase: pageOptions.rolloutPhase || null,
    verificationNote: pageOptions.verificationNote || "",
    duplicateOf: pageOptions.duplicateOf || "",
  };
});

function locationMetaDescription(page) {
  const place = page.kind === "locality" || page.regionSlug ? `${page.name}, ${page.city}` : page.name;
  const nearby = (page.nearbyAreas || []).slice(0, 3).join(", ");
  const text = `Explore properties for sale in ${place} with active listings${nearby ? `, nearby areas like ${nearby}` : ""}, FAQs and Akshar Estate contact.`;
  return text.length > 160 ? `${text.slice(0, 157).replace(/\s+\S*$/, "")}...` : text;
}

primaryRegions.forEach((page) => {
  page.metaDescription = page.metaDescription || locationMetaDescription(page);
});

localityPages.forEach((page) => {
  page.metaDescription = page.metaDescription || locationMetaDescription({ ...page, kind: "locality" });
});

export const SALE_LANDING_PAGES = {
  regions: primaryRegions,
  localities: localityPages,
};

const bhkIntentPages = [
  {
    regionSlug: "ahmedabad",
    localitySlug: "chandkheda",
    localityName: "Chandkheda",
    city: "Ahmedabad",
    bhk: 4,
    title: "4 BHK Properties for Sale in Chandkheda, Ahmedabad | Akshar Estate",
    h1: "4 BHK Properties for Sale in Chandkheda, Ahmedabad",
    intro: "Compare active 4 BHK homes and bungalow-style properties in Chandkheda with verified Akshar Estate listing details, supervisor contact and locality guidance.",
    demand: true,
    verified: true,
  },
  {
    regionSlug: "ahmedabad",
    localitySlug: "shela",
    localityName: "Shela",
    city: "Ahmedabad",
    bhk: 3,
    title: "3 BHK Properties for Sale in Shela, Ahmedabad | Akshar Estate",
    h1: "3 BHK Properties for Sale in Shela, Ahmedabad",
    intro: "Track 3 BHK property options in Shela with clean inventory signals, nearby-area context and Akshar Estate contact support.",
    demand: true,
    verified: true,
  },
  {
    regionSlug: "gandhinagar",
    localitySlug: "kudasan",
    localityName: "Kudasan",
    city: "Gandhinagar",
    bhk: 2,
    title: "2 BHK Properties for Sale in Kudasan, Gandhinagar | Akshar Estate",
    h1: "2 BHK Properties for Sale in Kudasan, Gandhinagar",
    intro: "Track 2 BHK property options in Kudasan with inventory-backed listings, GIFT City-side connectivity and verified supervisor contact when stock is available.",
    demand: true,
    verified: true,
  },
  {
    regionSlug: "gandhinagar",
    localitySlug: "kudasan",
    localityName: "Kudasan",
    city: "Gandhinagar",
    bhk: 3,
    title: "3 BHK Properties for Sale in Kudasan, Gandhinagar | Akshar Estate",
    h1: "3 BHK Properties for Sale in Kudasan, Gandhinagar",
    intro: "Track 3 BHK property options in Kudasan with locality context, nearby areas and clean canonical handling until active inventory is available.",
    demand: true,
    verified: true,
  },
  {
    regionSlug: "ahmedabad",
    localitySlug: "south-bopal",
    localityName: "South Bopal",
    city: "Ahmedabad",
    bhk: 2,
    title: "2 BHK Properties for Sale in South Bopal, Ahmedabad | Akshar Estate",
    h1: "2 BHK Properties for Sale in South Bopal, Ahmedabad",
    intro: "Track 2 BHK property options in South Bopal with SP Ring Road connectivity, nearby-area links and noindex protection until matching inventory exists.",
    demand: true,
    verified: true,
  },
].map((page) => ({
  ...page,
  kind: "bhk",
  intentSlug: `${page.bhk}-bhk`,
  path: `/properties-for-sale/${page.regionSlug}/${page.localitySlug}/${page.bhk}-bhk`,
  name: `${page.bhk} BHK in ${page.localityName}`,
}));

const propertyTypeIntentPages = [
  {
    kind: "property-type",
    prefix: "plots-for-sale",
    locationSlug: "palaj",
    locationName: "Palaj",
    city: "Gandhinagar",
    typeMatchers: ["plot"],
    title: "Plots for Sale in Palaj, Gandhinagar | Akshar Estate",
    h1: "Plots for Sale in Palaj, Gandhinagar",
    intro: "Explore active plots for sale in Palaj with verified location context, nearby landmarks and Akshar Estate supervisor contact.",
    demand: true,
    verified: true,
  },
  {
    kind: "property-type",
    prefix: "plots-for-sale",
    locationSlug: "dholera",
    locationName: "Dholera",
    city: "Ahmedabad",
    typeMatchers: ["plot"],
    title: "Plots for Sale in Dholera | Akshar Estate",
    h1: "Plots for Sale in Dholera",
    intro: "Track plot inventory in Dholera with clean canonical signals. This page remains noindex until active verified listings are available.",
    demand: true,
    verified: true,
  },
  {
    kind: "property-type",
    prefix: "commercial-property",
    locationSlug: "sg-highway",
    locationName: "S.G. Highway",
    city: "Ahmedabad",
    typeMatchers: ["commercial", "office", "shop", "retail"],
    title: "Commercial Property on S.G. Highway, Ahmedabad | Akshar Estate",
    h1: "Commercial Property on S.G. Highway, Ahmedabad",
    intro: "Track commercial property options on S.G. Highway with clean canonical signals and noindex protection until active listings exist.",
    demand: true,
    verified: true,
  },
  {
    kind: "property-type",
    prefix: "industrial-property",
    locationSlug: "changodar",
    locationName: "Changodar",
    city: "Ahmedabad",
    typeMatchers: ["industrial", "warehouse", "factory", "commercial"],
    title: "Industrial Property in Changodar, Ahmedabad | Akshar Estate",
    h1: "Industrial Property in Changodar, Ahmedabad",
    intro: "Track industrial property inventory in Changodar with clean canonical signals and noindex protection until active listings exist.",
    demand: true,
    verified: true,
  },
].map((page) => ({
  ...page,
  name: page.locationName,
  path: `/${page.prefix}/${page.locationSlug}`,
}));

export const INTENT_LANDING_PAGES = {
  bhk: bhkIntentPages,
  propertyTypes: propertyTypeIntentPages,
  all: [...bhkIntentPages, ...propertyTypeIntentPages],
};

export function getSaleLandingPage(regionSlug = "", localitySlug = "") {
  const region = primaryRegions.find((page) => page.slug === regionSlug);
  if (!region) return null;
  if (!localitySlug) return { ...region, kind: "region", path: `/properties-for-sale/${region.slug}` };
  const locality = localityPages.find((page) => page.regionSlug === region.slug && page.slug === localitySlug);
  if (!locality) return null;
  return { ...locality, regionName: region.name, kind: "locality", path: `/properties-for-sale/${region.slug}/${locality.slug}` };
}

export function getBhkIntentPage(regionSlug = "", localitySlug = "", intentSlug = "") {
  const page = bhkIntentPages.find((item) => item.regionSlug === regionSlug && item.localitySlug === localitySlug && item.intentSlug === intentSlug);
  if (!page) return null;
  const region = primaryRegions.find((item) => item.slug === regionSlug);
  return { ...page, regionName: region?.name || page.city };
}

export function getPropertyTypeIntentPage(prefix = "", locationSlug = "") {
  return propertyTypeIntentPages.find((page) => page.prefix === prefix && page.locationSlug === locationSlug) || null;
}

export function landingStateForPage(page) {
  if (!page) return {};
  const activeCity = page.kind === "locality" ? page.name : page.city || page.name;
  const isTypeIntent = page.kind === "property-type";
  const isBhkIntent = page.kind === "bhk";
  return {
    category: "Buy",
    type: isTypeIntent ? page.typeMatchers?.[0] || "All" : "All",
    city: activeCity,
    filters: {
      activeCity,
      activeType: isTypeIntent ? page.typeMatchers?.[0] || "All" : "All",
      query: "",
      searchType: "Buy",
      advancedFilters: {
        areaWise: "",
        propertyType: isTypeIntent ? page.typeMatchers?.[0] || "" : "",
        propertyCategory: "",
        minPrice: "",
        maxPrice: "",
        bhk: isBhkIntent ? String(page.bhk) : "",
      },
    },
  };
}
