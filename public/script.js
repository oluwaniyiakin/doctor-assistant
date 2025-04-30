window.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const age = params.get('age');
    const sex = params.get('sex');
    const symptoms = params.get('symptoms');
  
    if (age && sex && symptoms) {
      const prompt = `A ${age}-year-old ${sex} is experiencing the following symptoms: ${symptoms}. What could be the possible medical conditions and what should they do next?`;
  
      const resultDiv = document.getElementById('result');
      resultDiv.innerHTML = "<p>🧠 Thinking...</p>";
  
      try {
        const response = await fetch('/ask', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt })
        });
  
        const data = await response.json();
  
        if (data.response) {
          resultDiv.innerHTML = `<p><strong>AI Response:</strong></p><p>${data.response}</p>`;
        } else {
          resultDiv.innerHTML = `<p>⚠️ Error: No response from AI.</p>`;
        }
  
      } catch (error) {
        resultDiv.innerHTML = `<p>❌ An error occurred: ${error.message}</p>`;
      }
    }
  });
  