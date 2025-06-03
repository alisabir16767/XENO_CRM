const runGeminiPrompt = require("../config/gemini");
const Segment = require("../models/Segment");

exports.generateMessage = async (req, res) => {
  try {
    const { topic } = req.body;

    if (!topic) {
      return res
        .status(400)
        .json({ success: false, error: "Topic is required" });
    }
    const result = await runGeminiPrompt(
      `Generate 5 campaign  message on ${topic}`
    );
    res.status(200).json({
      success: true,
      message: result,
    });
  } catch (error) {
    console.error("Gemini Error:", error);
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
    });
  }
};

const operatorMap = {
  equals: "==",
  "equal to": "==",
  is: "==",
  "greater than": ">",
  "less than": "<",
  contains: "contains",
  "starts with": "startsWith",
  "ends with": "endsWith",
};

const fieldMap = {
  age: "age",
  location: "location",
  country: "location.country",
  city: "location.city",
  purchase: "purchaseHistory",
  purchased: "purchaseHistory.items",
  email: "email",
};

async function generateRulesFromText(prompt) {
  const rules = [];

  if (prompt.includes("aged over") || prompt.includes("age greater than")) {
    const ageMatch = prompt.match(/(\d+)/);
    if (ageMatch) {
      rules.push({
        field: "age",
        operator: ">",
        value: parseInt(ageMatch[1]),
      });
    }
  }

  if (prompt.includes("from") || prompt.includes("in")) {
    const locationMatch = prompt.match(/from (\w+)|in (\w+)/i);
    const location = locationMatch
      ? locationMatch[1] || locationMatch[2]
      : null;
    if (location) {
      rules.push({
        field: "location.city",
        operator: "==",
        value: location,
      });
    }
  }

  return rules;
}

exports.createSegmentFromPrompt = async (req, res) => {
  try {
    const { prompt, name } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const segmentRules = await generateRulesFromText(prompt);

    const audienceSize = Math.floor(Math.random() * 10000);

    const segment = new Segment({
      name: name || `Segment from "${prompt.substring(0, 20)}..."`,
      audienceSize,
      segmentRule: segmentRules,
      active: true,
    });

    await segment.save();

    res.status(201).json({
      success: true,
      segment,
      message: "Segment created successfully",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
