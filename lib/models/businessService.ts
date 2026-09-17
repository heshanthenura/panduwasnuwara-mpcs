import { query } from '@/lib/db';
import { BusinessServiceItem } from '@/lib/types';
import { initDatabaseSchema } from '@/lib/db/schema';
import { businessesData } from '@/app/components/BusinessesSection';

export interface CreateBusinessServiceInput {
  business_key: string;
  title_si: string;
  title_en: string;
  desc_si?: string | null;
  desc_en?: string | null;
  features_si?: string[];
  features_en?: string[];
  display_order?: number;
  is_active?: boolean;
}

export async function getServicesByBusinessKey(
  businessKey: string,
  activeOnly: boolean = true
): Promise<BusinessServiceItem[]> {
  await initDatabaseSchema();
  await seedDefaultBusinessServices();

  const sql = activeOnly
    ? `SELECT * FROM business_services WHERE business_key = $1 AND is_active = true ORDER BY display_order ASC, id ASC;`
    : `SELECT * FROM business_services WHERE business_key = $1 ORDER BY display_order ASC, id ASC;`;

  const rows = await query<any>(sql, [businessKey]);
  return rows.map((r: any) => ({
    ...r,
    features_si: Array.isArray(r.features_si) ? r.features_si : (typeof r.features_si === 'string' ? JSON.parse(r.features_si) : []),
    features_en: Array.isArray(r.features_en) ? r.features_en : (typeof r.features_en === 'string' ? JSON.parse(r.features_en) : [])
  }));
}

export async function getAllBusinessServices(): Promise<BusinessServiceItem[]> {
  await initDatabaseSchema();
  await seedDefaultBusinessServices();

  const rows = await query<any>(`SELECT * FROM business_services ORDER BY business_key ASC, display_order ASC, id ASC;`);
  return rows.map((r: any) => ({
    ...r,
    features_si: Array.isArray(r.features_si) ? r.features_si : (typeof r.features_si === 'string' ? JSON.parse(r.features_si) : []),
    features_en: Array.isArray(r.features_en) ? r.features_en : (typeof r.features_en === 'string' ? JSON.parse(r.features_en) : [])
  }));
}

export async function createBusinessService(data: CreateBusinessServiceInput): Promise<BusinessServiceItem> {
  await initDatabaseSchema();
  const rows = await query<any>(
    `INSERT INTO business_services (
      business_key,
      title_si,
      title_en,
      desc_si,
      desc_en,
      features_si,
      features_en,
      display_order,
      is_active
    ) VALUES ($1, $2, $3, $4, $5, $6::jsonb, $7::jsonb, $8, $9)
    RETURNING *;`,
    [
      data.business_key,
      data.title_si,
      data.title_en,
      data.desc_si || null,
      data.desc_en || null,
      JSON.stringify(data.features_si || []),
      JSON.stringify(data.features_en || []),
      data.display_order ?? 0,
      data.is_active ?? true
    ]
  );
  const r = rows[0];
  return {
    ...r,
    features_si: Array.isArray(r.features_si) ? r.features_si : JSON.parse(r.features_si || '[]'),
    features_en: Array.isArray(r.features_en) ? r.features_en : JSON.parse(r.features_en || '[]')
  };
}

export async function updateBusinessService(
  id: number,
  data: Partial<CreateBusinessServiceInput>
): Promise<BusinessServiceItem | null> {
  await initDatabaseSchema();
  const rows = await query<any>(
    `UPDATE business_services
     SET title_si = COALESCE($2, title_si),
         title_en = COALESCE($3, title_en),
         desc_si = COALESCE($4, desc_si),
         desc_en = COALESCE($5, desc_en),
         features_si = COALESCE($6::jsonb, features_si),
         features_en = COALESCE($7::jsonb, features_en),
         display_order = COALESCE($8, display_order),
         is_active = COALESCE($9, is_active),
         updated_at = NOW()
     WHERE id = $1
     RETURNING *;`,
    [
      id,
      data.title_si,
      data.title_en,
      data.desc_si,
      data.desc_en,
      data.features_si ? JSON.stringify(data.features_si) : null,
      data.features_en ? JSON.stringify(data.features_en) : null,
      data.display_order,
      data.is_active
    ]
  );
  if (rows.length === 0) return null;
  const r = rows[0];
  return {
    ...r,
    features_si: Array.isArray(r.features_si) ? r.features_si : JSON.parse(r.features_si || '[]'),
    features_en: Array.isArray(r.features_en) ? r.features_en : JSON.parse(r.features_en || '[]')
  };
}

export async function deleteBusinessService(id: number): Promise<boolean> {
  await initDatabaseSchema();
  const rows = await query(`DELETE FROM business_services WHERE id = $1 RETURNING id;`, [id]);
  return rows.length > 0;
}

let isDefaultSeeded = false;

export async function seedDefaultBusinessServices(): Promise<void> {
  if (isDefaultSeeded) return;
  try {
    const existing = await query<{ count: string }>(`SELECT COUNT(*) as count FROM business_services;`);
    const count = parseInt(existing[0]?.count || '0', 10);
    if (count > 0) {
      isDefaultSeeded = true;
      return;
    }

    // Default Rural Bank services
    const ruralBankServices = [
      {
        titleEn: 'Savings Accounts',
        titleSi: 'තැන්පතු ගිණුම්',
        descEn: 'Flexible regular savings accounts with competitive interest rates and seamless withdrawals for daily needs.',
        descSi: 'දෛනික අවශ්‍යතා සඳහා පහසු මුදල් ආපසු ගැනීම් සහ ආකර්ෂණීය පොලී අනුපාත සහිත නම්‍යශීලී සාමාන්‍ය ඉතුරුම් ගිණුම්.',
        featuresEn: ['Instant account opening', 'High annual interest', 'Passbook facilities'],
        featuresSi: ['ක්ෂණික ගිණුම් විවෘත කිරීම', 'ඉහළ වාර්ෂික පොලියක්', 'ගිණුම් පොත් පහසුකම්']
      },
      {
        titleEn: 'Fixed Deposits',
        titleSi: 'නියමිත තැන්පතු (ස්ථාවර තැන්පතු)',
        descEn: 'Guaranteed high-yield investment options with flexible tenure terms ranging from 3 months to 5 years.',
        descSi: 'මාස 3 සිට වසර 5 දක්වා නම්‍යශීලී කාලසීමාවන් සහිත උපරිම පොලී ප්‍රතිලාභ සහතික කෙරෙන ආරක්ෂිත ස්ථාවර තැන්පතු.',
        featuresEn: ['Higher interest for seniors', 'Monthly/maturity payout', '100% security guarantee'],
        featuresSi: ['වැඩිහිටියන්ට විශේෂ පොලී අනුපාත', 'මාසික හෝ කල්පිරීමේ පොලිය', '100% සුරක්ෂිතතාවය']
      },
      {
        titleEn: 'Daily Loan Schemes',
        titleSi: 'දිනක ණය ක්‍රම',
        descEn: 'Accessible working capital loans for self-employed individuals, retail vendors, and small agricultural enterprises.',
        descSi: 'ස්වයං රැකියාලාභීන්, වෙළඳුන් සහ ගොවි ප්‍රජාව වෙනුවෙන් පහසු දෛනික ආපසු ගෙවීමේ ක්‍රම සහිත කාරක ප්‍රාග්ධන ණය.',
        featuresEn: ['Fast approval within 24h', 'Minimal documentation', 'Flexible daily repayments'],
        featuresSi: ['පැය 24ක් තුළ කඩිනම් අනුමැතිය', 'අවම ලියකියවිලි', 'පහසු දෛනික ආපසු ගෙවීම්']
      },
      {
        titleEn: 'Gold Pawning & Jewellery Loans',
        titleSi: 'රන් වටිකර ණය පහසුකම්',
        descEn: 'Confidential and highly secure gold pawning facilities with maximum valuation and lowest approved interest rates.',
        descSi: 'උපරිම තක්සේරු වටිනාකමක් සහ අවම පොලියක් සහිත අතිශය රහස්‍ය සහ ආරක්ෂිත රන් ආභරණ උකස් සේවාව.',
        featuresEn: ['Highest advance per sovereign', 'Vault security guarantee', 'Part payment options'],
        featuresSi: ['පවුමකට උපරිම මුදලක්', 'සුරක්ෂිත තැන්පතු සුරක්ෂිතතාව', 'කොටස් වශයෙන් පියවීමේ පහසුකම']
      },
      {
        titleEn: "Children's Savings Schemes",
        titleSi: 'ළමා තැන්පතු ගිණුම්',
        descEn: 'Dedicated savings plans to build a bright future for children with bonus interest and educational rewards.',
        descSi: 'දරුවන්ගේ අනාගතය සුරක්ෂිත කරන විශේෂ ත්‍යාග සහ අධ්‍යාපනික දිරිගැන්වීම් සහිත සුවිශේෂී ළමා ඉතුරුම් සැලසුම්.',
        featuresEn: ['Attractive annual gifts', 'Educational grant bonuses', 'Parental standing orders'],
        featuresSi: ['වාර්ෂික වටිනා ත්‍යාග', 'අධ්‍යාපනික ප්‍රදාන', 'ස්ථාවර නියෝග මඟින් බැර කිරීම']
      },
      {
        titleEn: 'Loan Repayment Orders & Transfers',
        titleSi: 'ණය ආපසු ගෙවීමේ නියෝග',
        descEn: 'Automated inter-branch transfers, standing orders, and institutional payroll deductions for smooth loan servicing.',
        descSi: 'ශාඛා අතර මුදල් මාරුකිරීම්, ස්ථාවර නියෝග සහ ආයතනික වැටුප් අඩුකිරීම් මඟින් ණය පියවීමේ පහසුකම්.',
        featuresEn: ['Network-wide inter-branch access', 'Zero hidden service fees', 'SMS payment updates'],
        featuresSi: ['ශාඛා 22 අතරම සේවා ප්‍රවේශය', 'සැඟවුණු ගාස්තු නොමැත', 'SMS පණිවිඩ මඟින් තහවුරු කිරීම']
      }
    ];

    for (let i = 0; i < ruralBankServices.length; i++) {
      const s = ruralBankServices[i];
      await createBusinessService({
        business_key: 'rural-bank',
        title_si: s.titleSi,
        title_en: s.titleEn,
        desc_si: s.descSi,
        desc_en: s.descEn,
        features_si: s.featuresSi,
        features_en: s.featuresEn,
        display_order: i + 1,
        is_active: true
      });
    }

    // Seed services for all businesses in businessesData (excluding rural-bank which we seeded above)
    for (const b of businessesData) {
      if (b.key === 'rural-bank') continue;
      const count = Math.max(b.services.length, b.servicesEn.length);
      for (let i = 0; i < count; i++) {
        const titleSi = b.services[i] || b.servicesEn[i] || `සේවාව ${i + 1}`;
        const titleEn = b.servicesEn[i] || b.services[i] || `Service ${i + 1}`;
        await createBusinessService({
          business_key: b.key,
          title_si: titleSi,
          title_en: titleEn,
          desc_si: `${b.titleSi} මඟින් පිරිනමන ප්‍රමුඛ සේවාවකි.`,
          desc_en: `Premier service offered by ${b.titleEn}.`,
          features_si: ['විශ්වාසදායක සේවය', 'සාමාජික වරප්‍රසාද'],
          features_en: ['Trusted quality', 'Member privileges'],
          display_order: i + 1,
          is_active: true
        });
      }
    }

    isDefaultSeeded = true;
  } catch (err) {
    console.error('Error seeding default business services:', err);
  }
}
