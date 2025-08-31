export const useCodeSharer = () => {
    const shareCode = async (code: string, language: string , explanations: string[]) => {
      const sharableText = `Check out this ${language} code converted from "https://code-scribe-ai.vercel.app/":
       \n\n> ${code}\n\n${explanations.join('\n')}`;
  
      if (navigator.share) {
        try {
          await navigator.share({
            title: `Code Snippet (${language})`,
            text: sharableText,
          });
        } catch (error) {
          console.error('Sharing failed', error);
        }
      } else {
        // Fallback: copy to clipboard
        try {
          await navigator.clipboard.writeText(sharableText);
          alert('Code copied to clipboard. Share it anywhere!');
        } catch {
          alert('Unable to copy to clipboard');
        }
      }
    };
  
    return { shareCode };
  };
  