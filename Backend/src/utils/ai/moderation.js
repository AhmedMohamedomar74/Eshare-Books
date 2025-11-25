// moderation.js
import axios from 'axios';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = 'gemini-2.5-flash'; // ✅ Stable and available
const MODERATION_FAIL_CLOSED = process.env.MODERATION_FAIL_CLOSED === 'true';

/**
 * Moderate text using Gemini 1.5 Flash
 * Supports Arabic and English content
 * @param {string} text - Text to moderate
 * @returns {Promise<{flagged: boolean, reason: string, source: string}>}
 */
export const moderateText = async (text) => {
  if (!text || text.trim() === '') {
    return { flagged: false, reason: '', source: 'gemini' };
  }

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                text: `You are an EXTREMELY STRICT content moderator for a family-friendly book-sharing platform serving users of all ages including children.

Your ONLY job is to detect and REJECT inappropriate content in ANY language (English, Arabic, or any other language).

REJECT IMMEDIATELY if the text contains:

1. SEXUAL CONTENT:
   - Any sexual, pornographic, or erotic content
   - Sexual acts, body parts, or intimate situations
   - Dating or romantic content intended for adults
   - Words related to sex, porn, adult content
   - In Arabic: محتوى جنسي، إباحي، علاقات حميمية

2. VIOLENCE & THREATS:
   - Threats, violence, harm, weapons, killing
   - Graphic descriptions of violence or gore
   - Encouraging dangerous behavior
   - In Arabic: عنف، تهديدات، قتل، أسلحة

3. HATE SPEECH & DISCRIMINATION:
   - Hate speech, racism, discrimination
   - Slurs, insults based on identity, religion, race, gender
   - Content attacking specific groups
   - In Arabic: خطاب كراهية، تمييز عنصري، إهانات

4. PROFANITY & OFFENSIVE LANGUAGE:
   - Swear words, curses, vulgar language
   - Insults, offensive terms, derogatory language
   - Examples: fuck, shit, damn, bastard, ass, bitch, hell
   - In Arabic: شتائم، ألفاظ نابية، كلام بذيء

5. ILLEGAL ACTIVITIES:
   - Drugs, weapons, illegal substances
   - Criminal activities, fraud, hacking
   - In Arabic: مخدرات، أنشطة غير قانونية

CRITICAL INSTRUCTIONS:
- You MUST be EXTREMELY strict and cautious
- When you see ANY inappropriate word or concept → IMMEDIATELY flag it as true
- Even ONE inappropriate word means you MUST reject the entire text
- If you're unsure → REJECT IT (better safe than sorry)
- Check BOTH the title AND description carefully
- Respond ONLY in valid JSON format

Text to analyze:
"""
${text}
"""

Respond with ONLY this exact JSON format (nothing else):
{"flagged": true, "reason": "brief explanation of what inappropriate content was found"}

OR if completely safe:
{"flagged": false, "reason": ""}`,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0,
          maxOutputTokens: 300,
        },
        safetySettings: [
          {
            category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
            threshold: 'BLOCK_NONE',
          },
          {
            category: 'HARM_CATEGORY_HATE_SPEECH',
            threshold: 'BLOCK_NONE',
          },
          {
            category: 'HARM_CATEGORY_HARASSMENT',
            threshold: 'BLOCK_NONE',
          },
          {
            category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
            threshold: 'BLOCK_NONE',
          },
        ],
      }
    );

    const candidate = response.data.candidates?.[0];

    console.log('🔍 Gemini Full Response:', JSON.stringify(response.data, null, 2));

    // Check if blocked by Gemini's safety filters
    if (candidate?.finishReason === 'SAFETY') {
      const safetyRatings = candidate.safetyRatings || [];
      const highRiskReasons = safetyRatings
        .filter((r) => r.probability === 'HIGH' || r.probability === 'MEDIUM')
        .map((r) => r.category.replace('HARM_CATEGORY_', ''))
        .join(', ');

      console.log('🚫 BLOCKED BY SAFETY FILTERS:', highRiskReasons);

      return {
        flagged: true,
        reason: `Contains inappropriate content: ${highRiskReasons}`,
        source: 'gemini-safety-filter',
      };
    }

    // Check if response exists
    if (!candidate?.content?.parts?.[0]?.text) {
      console.error('❌ No response from Gemini');
      return {
        flagged: MODERATION_FAIL_CLOSED,
        reason: 'Moderation service returned no response',
        source: 'gemini',
      };
    }

    const resultText = candidate.content.parts[0].text;

    console.log('📝 Raw Gemini Response Text:', resultText);

    // Clean and extract JSON
    let jsonText = resultText.trim();
    jsonText = jsonText.replace(/```json\s*/g, '').replace(/```\s*/g, '');

    const jsonMatch = jsonText.match(/\{[\s\S]*?\}/);
    if (jsonMatch) {
      jsonText = jsonMatch[0];
    }

    let moderationResult;
    try {
      moderationResult = JSON.parse(jsonText);
      console.log('✅ Parsed Result:', moderationResult);
    } catch (parseError) {
      console.error('❌ JSON Parse Error:', parseError.message);
      console.error('Attempted to parse:', jsonText);

      // Fallback: if can't parse, check for danger words in response
      const dangerWords = [
        'inappropriate',
        'offensive',
        'explicit',
        'sexual',
        'violence',
        'hate',
        'profanity',
      ];
      const foundDanger = dangerWords.some((word) => resultText.toLowerCase().includes(word));

      if (foundDanger) {
        console.log('⚠️ Found danger words in response, flagging as inappropriate');
        return {
          flagged: true,
          reason: 'Content flagged by AI moderator',
          source: 'gemini-fallback',
        };
      }

      return {
        flagged: MODERATION_FAIL_CLOSED,
        reason: 'Unable to parse moderation response',
        source: 'gemini',
      };
    }

    // Validate response structure
    if (typeof moderationResult.flagged !== 'boolean') {
      console.error('❌ Invalid response structure:', moderationResult);
      return {
        flagged: MODERATION_FAIL_CLOSED,
        reason: 'Invalid moderation response format',
        source: 'gemini',
      };
    }

    console.log(moderationResult.flagged ? '🚫 CONTENT REJECTED' : '✅ CONTENT APPROVED');

    return {
      flagged: moderationResult.flagged,
      reason: moderationResult.reason || '',
      source: 'gemini',
    };
  } catch (error) {
    console.error('❌ Text Moderation Error:', error.response?.data || error.message);

    return {
      flagged: MODERATION_FAIL_CLOSED,
      reason: 'Moderation service temporarily unavailable',
      source: 'gemini-error',
    };
  }
};

/**
 * Moderate image using Gemini Vision
 * @param {string} imageUrl - URL of image to moderate
 * @returns {Promise<{safe: boolean, reason: string, source: string}>}
 */
export const moderateImage = async (imageUrl) => {
  if (!imageUrl) {
    return { safe: true, reason: '', source: 'gemini' };
  }

  try {
    console.log('🖼️ Starting image moderation for:', imageUrl);

    // Download and convert image
    const imageResponse = await axios.get(imageUrl, {
      responseType: 'arraybuffer',
      timeout: 15000,
      maxContentLength: 10 * 1024 * 1024,
    });

    const base64Image = Buffer.from(imageResponse.data, 'binary').toString('base64');
    const mimeType = imageResponse.headers['content-type'] || 'image/jpeg';

    const validMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!validMimeTypes.includes(mimeType)) {
      console.log('❌ Invalid image type:', mimeType);
      return {
        safe: false,
        reason: 'Unsupported image format',
        source: 'validation',
      };
    }

    console.log('🔍 Analyzing image with Gemini Vision...');

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                text: `You are an EXTREMELY STRICT image content moderator for a family-friendly platform with users of all ages.

REJECT this image if it contains ANY of:

1. Sexual/Adult Content:
   - Nudity, sexual acts, or sexually suggestive content
   - Inappropriate body exposure or intimate situations
   - Adult or erotic imagery

2. Violence:
   - Graphic violence, gore, blood, injuries
   - Weapons being used to harm
   - Disturbing or frightening imagery

3. Hate Symbols:
   - Hate symbols, offensive gestures
   - Discriminatory or racist imagery

4. Inappropriate Content:
   - Drug use, illegal activities
   - Any content unsuitable for children

BE EXTREMELY STRICT. When in doubt, REJECT the image.

Respond with ONLY this JSON:
{"safe": false, "reason": "what you found"}
OR
{"safe": true, "reason": ""}`,
              },
              {
                inline_data: {
                  mime_type: mimeType,
                  data: base64Image,
                },
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0,
          maxOutputTokens: 200,
        },
        safetySettings: [
          {
            category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
            threshold: 'BLOCK_LOW_AND_ABOVE',
          },
          {
            category: 'HARM_CATEGORY_HATE_SPEECH',
            threshold: 'BLOCK_LOW_AND_ABOVE',
          },
          {
            category: 'HARM_CATEGORY_HARASSMENT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE',
          },
          {
            category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE',
          },
        ],
      }
    );

    const candidate = response.data.candidates?.[0];

    console.log('🔍 Image Analysis Response:', JSON.stringify(candidate, null, 2));

    // Blocked by safety filters
    if (candidate?.finishReason === 'SAFETY') {
      const safetyRatings = candidate.safetyRatings || [];
      const blockedReasons = safetyRatings
        .filter((r) => r.probability === 'HIGH' || r.probability === 'MEDIUM')
        .map((r) => r.category.replace('HARM_CATEGORY_', ''))
        .join(', ');

      console.log('🚫 IMAGE BLOCKED BY SAFETY FILTERS:', blockedReasons);

      return {
        safe: false,
        reason: `Image contains inappropriate content: ${blockedReasons}`,
        source: 'gemini-safety-filter',
      };
    }

    if (!candidate?.content?.parts?.[0]?.text) {
      console.error('❌ No image analysis response');
      return {
        safe: !MODERATION_FAIL_CLOSED,
        reason: 'Unable to analyze image',
        source: 'gemini',
      };
    }

    const resultText = candidate.content.parts[0].text;
    console.log('📝 Image Analysis Text:', resultText);

    let jsonText = resultText.trim();
    jsonText = jsonText.replace(/```json\s*/g, '').replace(/```\s*/g, '');

    const jsonMatch = jsonText.match(/\{[\s\S]*?\}/);
    if (jsonMatch) {
      jsonText = jsonMatch[0];
    }

    let moderationResult;
    try {
      moderationResult = JSON.parse(jsonText);
      console.log('✅ Image Result:', moderationResult);
    } catch (parseError) {
      console.error('❌ Image JSON Parse Error:', parseError.message);

      const dangerWords = ['unsafe', 'inappropriate', 'explicit', 'sexual', 'violence'];
      const foundDanger = dangerWords.some((word) => resultText.toLowerCase().includes(word));

      return {
        safe: !foundDanger,
        reason: foundDanger ? 'Image flagged by moderator' : 'Unable to parse response',
        source: 'gemini-fallback',
      };
    }

    if (typeof moderationResult.safe !== 'boolean') {
      console.error('❌ Invalid image response structure');
      return {
        safe: !MODERATION_FAIL_CLOSED,
        reason: 'Invalid response format',
        source: 'gemini',
      };
    }

    console.log(moderationResult.safe ? '✅ IMAGE APPROVED' : '🚫 IMAGE REJECTED');

    return {
      safe: moderationResult.safe,
      reason: moderationResult.reason || '',
      source: 'gemini',
    };
  } catch (error) {
    console.error('❌ Image Moderation Error:', error.response?.data || error.message);

    if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
      return { safe: !MODERATION_FAIL_CLOSED, reason: 'Image download timeout', source: 'timeout' };
    }

    if (error.response?.status === 404) {
      return { safe: false, reason: 'Image not accessible', source: 'not-found' };
    }

    return {
      safe: !MODERATION_FAIL_CLOSED,
      reason: 'Image moderation service error',
      source: 'gemini-error',
    };
  }
};
