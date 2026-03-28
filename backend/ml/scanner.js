const tf = require("@tensorflow/tfjs");
const toxicity = require("@tensorflow-models/toxicity");

let model = null;

const load = async () => {
  if (model) return;
  // Threshold can be adjusted. 0.8 is good default
  model = await toxicity.load(0.6);
};

const scanText = async (text) => {
  // If model fails to load or is not yet ready, return false (not harmful) for now
  if (!model) {
    console.warn("Toxicity model not loaded yet. Skipping check.");
    return false;
  }
  if (!text || typeof text !== "string") return false;

  const predictions = await model.classify([text.slice(0, 512)]);
  return predictions.some((p) => p.results[0].match === true);
};

module.exports = { load, scanText };
