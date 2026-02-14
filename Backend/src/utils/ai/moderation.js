import axios from 'axios';

const MODERATION_MODE = process.env.MODERATION_MODE || 'strict';
const sensitivityThreshold = {
  strict: 0.4,
  normal: 0.7,
  lenient: 0.9,
}[MODERATION_MODE];

const FAIL_CLOSED = process.env.MODERATION_FAIL_CLOSED === 'true';

const DANGER_LABEL_KEYWORDS = [
  'toxic',
  'threat',
  'insult',
  'sexual',
  'obscene',
  'violence',
  'hate',
  'porn',
  'explicit',
];

const arabicBannedWords = [
  'قتل',
  'أقتل',
  'سأقتل',
  'اغتصاب',
  'تحرش',
  'انتحار',
  'انفجار',
  'تفجير',
  'مخدرات',
  'حشيش',
  'تهديد',
  'إرهاب',
  'قنبلة',
  'قنابل',
  'سلاح',
  'رصاص',
  'عنف',
  'كراهية',
  'سب',
  'شتيمة',
  'لعنة',
  'اباحي',
  'فاحشة',
  'اغتصب',
  'قاتل',
  'اذبح',
  'اذبحك',
  'انتقم',
  'انتحاري',
  'مسيء',
  'حقير',
  'وسخ',
];

const normalizeArabic = (str = '') =>
  str
    .normalize('NFKC')
    .replace(/[\u064B-\u0652]/g, '')
    .replace(/[إأآا]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/ؤ/g, 'و')
    .replace(/ئ/g, 'ي')
    .replace(/ة/g, 'ه')
    .toLowerCase()
    .trim();

/* ──────────────────────────────
   Moderate Text (Hugging Face) — robust normalization + logging
────────────────────────────── */
export const moderateText = async (title = '', description = '') => {
  const text = `${title}\n${description}`.trim();
  if (!text) return { flagged: false, details: [], source: 'empty-text' };

  const normalizedText = normalizeArabic(text);
  const foundArabic = arabicBannedWords.find((word) =>
    normalizedText.includes(normalizeArabic(word))
  );

  if (foundArabic) {
    return {
      flagged: true,
      reason: `تم اكتشاف كلمة محظورة بالعربية: "${foundArabic}"`,
      source: 'local-arabic-filter',
    };
  }

  try {
    const resp = await axios.post(
      'https://router.huggingface.co/hf-inference/models/unitary/toxic-bert',
      { inputs: text },
      {
        headers: { Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}` },
        timeout: 15000,
      }
    );

    console.log('Hugging Face text moderation raw response:', JSON.stringify(resp.data, null, 2));

    let raw = resp.data;
    let labels = [];

    if (Array.isArray(raw)) {
      if (raw.length === 1 && Array.isArray(raw[0])) raw = raw[0];
      if (Array.isArray(raw)) {
        labels = raw
          .map((item) => {
            if (!item) return null;
            if (Array.isArray(item))
              return { label: String(item[0] ?? ''), score: Number(item[1] ?? 0) };
            if (typeof item === 'object')
              return {
                label: String(item.label ?? item[0] ?? ''),
                score: Number(item.score ?? item[1] ?? 0),
              };
            return null;
          })
          .filter(Boolean);
      }
    } else if (raw && typeof raw === 'object') {
      labels = Object.entries(raw).map(([label, score]) => ({ label, score: Number(score) }));
    }

    if (!labels.length) {
      return { flagged: false, details: labels, source: 'huggingface-no-labels' };
    }

    const flaggedLabels = labels.filter((l) => {
      const name = (l.label || '').toLowerCase();
      const score = Number(l.score || 0);
      const hasDangerKeyword = DANGER_LABEL_KEYWORDS.some((kw) => name.includes(kw));
      return hasDangerKeyword && score >= sensitivityThreshold;
    });

    const flagged = flaggedLabels.length > 0;

    return { flagged, details: labels, flaggedLabels, source: 'huggingface' };
  } catch (err) {
    console.error('Text moderation error:', err?.message || err);
    if (err?.response) {
      console.error('HuggingFace status:', err.response.status, err.response.data);
    }
    if (FAIL_CLOSED) {
      return { flagged: true, error: true, source: 'huggingface-fallback-closed' };
    }
    return { flagged: false, error: true, source: 'huggingface-fallback-open' };
  }
};

/* ──────────────────────────────
   Moderate Image (Hugging Face NSFW model)
────────────────────────────── */
export const moderateImage = async (imageUrl) => {
  if (!imageUrl) return { safe: true, predictions: [], source: 'no-image' };

  try {
    const resp = await axios.post(
      'https://router.huggingface.co/hf-inference/models/Falconsai/nsfw_image_detection',
      { inputs: imageUrl },
      {
        headers: { Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}` },
        timeout: 15000,
      }
    );

    console.log('Hugging Face image moderation raw response:', JSON.stringify(resp.data, null, 2));

    const raw = resp.data;
    let predictions = [];

    if (Array.isArray(raw)) {
      predictions = raw.map((r) => ({ label: String(r.label ?? ''), score: Number(r.score ?? 0) }));
    } else if (raw && typeof raw === 'object') {
      predictions = Object.entries(raw).map(([label, score]) => ({ label, score: Number(score) }));
    }

    const unsafe = predictions.some((p) => {
      const name = (p.label || '').toLowerCase();
      const score = Number(p.score || 0);
      return (
        (name.includes('nsfw') || name.includes('porn') || name.includes('explicit')) &&
        score >= sensitivityThreshold
      );
    });

    return { safe: !unsafe, predictions, source: 'huggingface' };
  } catch (err) {
    console.error('Image moderation error:', err?.message || err);
    if (err?.response) {
      console.error('HuggingFace status:', err.response.status, err.response.data);
    }
    if (FAIL_CLOSED) {
      return { safe: false, error: true, source: 'huggingface-fallback-closed' };
    }
    return { safe: true, error: true, source: 'huggingface-fallback-open' };
  }
};

/* ──────────────────────────────
   Moderate whole book (text + image)
────────────────────────────── */
export const moderateBookContent = async (bookData) => {
  const { Title, Description, image } = bookData || {};

  const [textCheck, imageCheck] = await Promise.all([
    moderateText(Title || '', Description || ''),
    image?.secure_url
      ? moderateImage(image.secure_url)
      : Promise.resolve({ safe: true, predictions: [], source: 'no-image' }),
  ]);

  if (textCheck.flagged) {
    const reason =
      textCheck.reason ||
      (textCheck.flaggedLabels && textCheck.flaggedLabels.length
        ? `Text flagged by labels: ${textCheck.flaggedLabels
            .map((l) => `${l.label}(${l.score})`)
            .join(', ')}`
        : 'Text content contains harmful or disallowed language.');
    return { allowed: false, reason, source: textCheck.source || 'text' };
  }

  if (!imageCheck.safe) {
    return {
      allowed: false,
      reason: 'Image contains inappropriate/NSFW content.',
      source: imageCheck.source || 'image',
    };
  }

  return { allowed: true };
};
