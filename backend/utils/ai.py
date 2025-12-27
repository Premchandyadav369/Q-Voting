import os
import httpx
from typing import Dict, Any

class GeminiClient:
    """Client for interacting with Google Gemini API"""
    
    def __init__(self, api_key: str = None):
        self.api_key = api_key or os.environ.get("GEMINI_API_KEY")
        self.model = "gemini-2.5-flash"
        self.endpoint = f"https://generativelanguage.googleapis.com/v1beta/models/{self.model}:generateContent"

    async def generate_insights(self, election_data: Dict[str, Any]) -> str:
        """Generate AI insights based on provided election data"""
        if not self.api_key:
            return "AI Insights are currently disabled. Please provide a Gemini API key to enable real-time election analysis."

        prompt = f"""
        Analyze the following real-time election data from the Andhra Pradesh 2024 simulation and provide 3-4 professional, concise insights for an admin dashboard.
        Focus on:
        1. Leading trends
        2. District participation patterns
        3. Predicted outcomes based on current momentum
        4. Security health (Quantum encrypted channel status)

        Data:
        {election_data}

        Return the insights as a bulleted list in markdown format. Keep it concise and academic.
        """

        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    f"{self.endpoint}?key={self.api_key}",
                    json={
                        "contents": [{
                            "parts": [{"text": prompt}]
                        }]
                    },
                    timeout=30.0
                )
                
                if response.status_code == 200:
                    return response.json()['candidates'][0]['content']['parts'][0]['text']
                else:
                    return f"Error generating insights: {response.text}"
        except Exception as e:
            return f"AI Analysis temporarily unavailable: {str(e)}"

    async def generate_candidate_names(self, constituency: str, parties: list) -> list:
        """Generate realistic candidate names for a constituency"""
        if not self.api_key:
            return []
            
        party_str = ", ".join(parties)
        prompt = f"Generate {len(parties)} realistic fictional South Indian politician names for the constituency '{constituency}' in Andhra Pradesh representing these parties: {party_str}. Return ONLY the names as a comma-separated list, nothing else."
        
        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    f"{self.endpoint}?key={self.api_key}",
                    json={"contents": [{"parts": [{"text": prompt}]}]},
                    timeout=5.0
                )
                if response.status_code == 200:
                    text = response.json()['candidates'][0]['content']['parts'][0]['text']
                    return [name.strip() for name in text.split(',')]
        except:
            return []

# Singleton instance
gemini_client = GeminiClient()
