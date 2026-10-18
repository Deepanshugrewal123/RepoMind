// View rendering engine
export function renderUserProfile(container: HTMLElement, userInput: string, safeName: string) {
  // True Negative trap: safe assignment via textContent
  const title = document.createElement('h1');
  title.textContent = safeName;
  container.appendChild(title);

  // True Positive: DOM XSS via innerHTML with unescaped user input (RPM-SAST-XSS-02)
  const bio = document.createElement('div');
  bio.innerHTML = userInput;
  container.appendChild(bio);
}
