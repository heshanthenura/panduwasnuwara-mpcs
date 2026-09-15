const INITIAL_BUSINESSES = [
  { key: 'rural-bank', titleSi: 'ග්‍රාමීය බැංකුව', titleEn: 'Rural Bank', manager: 'කේ ඩබ් ජදසිංහ', hotline: '037 229 1012' },
  { key: 'consumer', titleSi: 'පාරිභෝගික අංශය', titleEn: 'Consumer Section', manager: 'එස් එම් රණසිංහ', hotline: '037 229 1013' },
  { key: 'maliban-biscuits', titleSi: 'මාලිබන් බිස්කට් නියෝජිතායතනය', titleEn: 'Maliban Biscuits Agency', manager: 'ජී කේ කුමාර', hotline: '037 229 1014' },
  { key: 'fuel-shed', titleSi: 'ලංකා ඛනිජ තෙල් ඉන්ධන පිරවුම්හල', titleEn: 'Ceypetco Fuel Station', manager: 'එච් පී ප්‍රනාන්දු', hotline: '037 229 1015' },
  { key: 'micro-finance', titleSi: 'ක්ෂුද්‍ර මූල්‍ය සේවා ඒකකය', titleEn: 'Micro Financial Services', manager: 'ඩබ් එම් වික්‍රමසිංහ', hotline: '037 229 1016' },
  { key: 'coop-city', titleSi: 'සමූපකාර නගර සුපිරි වෙළඳසැල', titleEn: 'Co-op City Supermarket', manager: 'ආර් බී දිසානායක', hotline: '037 229 1017' },
  { key: 'transport', titleSi: 'ප්‍රවාහන හා බෙදාහැරීමේ අංශය', titleEn: 'Transport & Distribution Division', manager: 'ටී එම් ජයවර්ධන', hotline: '037 229 1018' },
  { key: 'fertilizer', titleSi: 'කෘෂිකාර්මික පොහොර ගබඩාව', titleEn: 'Agricultural Fertilizer Depot', manager: 'එස් ඒ සෙනෙවිරත්න', hotline: '037 229 1019' },
  { key: 'funeral-services', titleSi: 'අවමංගල්‍ය සුබසාධන සේවාව', titleEn: 'Funeral Welfare & Services', manager: 'කේ ඒ පී කුලරත්න', hotline: '037 229 1020' },
  { key: 'insurance', titleSi: 'සමූපකාර රක්ෂණ නියෝජිතායතනය', titleEn: 'Co-op Insurance Agency', manager: 'එන් එල් හේරත්', hotline: '037 229 1021' }
];

async function seedBusinesses(client) {
  console.log('Seeding initial businesses...');
  for (const b of INITIAL_BUSINESSES) {
    await client.query(`
      INSERT INTO businesses (key, title_si, title_en, manager, hotline, is_active)
      VALUES ($1, $2, $3, $4, $5, true)
      ON CONFLICT (key) DO UPDATE
      SET title_si = $2, title_en = $3, manager = $4, hotline = $5, is_active = true;
    `, [b.key, b.titleSi, b.titleEn, b.manager, b.hotline]);
  }
}

module.exports = { seedBusinesses };
