import axios from 'axios';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = 'gemini-2.5-flash-lite';
const MODERATION_FAIL_CLOSED = process.env.MODERATION_FAIL_CLOSED === 'true';

/**
 * Moderate text using Gemini 2.5 Flash
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
                text: `You are a STRICT content moderator for a family-friendly book platform.

Your job: Analyze text and return ONLY JSON.

REJECT if text contains:
1. Sexual/pornographic content (explicit, porn, xxx, sexual acts)
2. Violence/threats (violent, kill, harm, threats, weapons)
3. Hate speech (racist, discrimination, slurs)
4. Profanity (fuck, shit, damn, bastard, offensive words)
5. Illegal content (drugs, illegal activities)

BE STRICT: If you see ANY inappropriate word → flag it immediately.

Text to check:
"""
${text}
"""

Respond with ONLY this JSON (nothing else):
{"flagged": true, "reason": "brief explanation"}
OR
{"flagged": false, "reason": ""}`,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0,
          maxOutputTokens: 500, // ✅ Increased for safety
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
                text: `You are a STRICT image content moderator.

REJECT if image contains:
1. Sexual/nude content
2. Violence/gore
3. Hate symbols
4. Inappropriate content

Respond ONLY with JSON:
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
          maxOutputTokens: 300, // ✅ Increased for image analysis
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
