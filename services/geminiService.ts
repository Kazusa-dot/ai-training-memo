import { GoogleGenAI } from "@google/genai";
import { WorkoutSession } from "../types";
import { SYSTEM_PROMPT } from "../constants";

export const generateWorkoutFeedback = async (
  currentWorkout: WorkoutSession,
  history: WorkoutSession[]
): Promise<string> => {
  try {
    const apiKey = process.env.API_KEY;
    
    // In a real app, we might handle missing keys differently, but here we strictly follow the requirement
    // to use process.env.API_KEY and not ask the user.
    // If it's missing, the API call will fail, which we catch below.
    if (!apiKey) {
      console.warn("API Key is missing. Returning mock response for demo purposes.");
      return "Excellent workout! Since the API key is missing in this demo environment, I can't generate a live AI analysis, but you crushed those chest presses! Next time, try increasing the weight by 2.5kg.";
    }

    const ai = new GoogleGenAI({ apiKey });

    // 1. Calculate stats for current workout
    const currentVolume = currentWorkout.exercises.reduce((total, ex) => {
      return total + ex.sets.reduce((sTotal, set) => sTotal + (set.weight * set.reps), 0);
    }, 0);

    // 2. Find previous workout (simple logic: find first history item that is not this one)
    // Note: History passed here doesn't include currentWorkout yet usually, so index 0 is previous.
    const lastWorkout = history.length > 0 ? history[0] : null;

    let previousVolume = 0;
    let comparisonText = "First recorded session.";

    if (lastWorkout) {
      previousVolume = lastWorkout.exercises.reduce((total, ex) => {
        return total + ex.sets.reduce((sTotal, set) => sTotal + (set.weight * set.reps), 0);
      }, 0);
      
      const diff = currentVolume - previousVolume;
      const percent = previousVolume > 0 ? ((diff / previousVolume) * 100).toFixed(1) : "0";
      comparisonText = `Previous Date: ${new Date(lastWorkout.date).toLocaleDateString()}\nPrevious Volume: ${previousVolume}kg\nChange: ${diff > 0 ? '+' : ''}${percent}%`;
    }

    // 3. Construct Prompt
    const exerciseSummary = currentWorkout.exercises.map(ex => {
      const setDetails = ex.sets.map((s, i) => `Set ${i+1}: ${s.weight}kg x ${s.reps}`).join(", ");
      return `- ${ex.name}: ${setDetails}`;
    }).join("\n");

    const prompt = `
    [Today's Workout]
    Date: ${new Date(currentWorkout.date).toLocaleDateString()}
    Total Volume: ${currentVolume}kg
    
    Exercises:
    ${exerciseSummary}

    [Comparison with Previous]
    ${comparisonText}
    `;

    // 4. Call API
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_PROMPT,
      }
    });

    return response.text || "Great job on your workout! (No specific analysis generated)";

  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Great workout! (AI Analysis currently unavailable due to network or key issues)";
  }
};