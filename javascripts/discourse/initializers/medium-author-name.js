import { apiInitializer } from "discourse/lib/api";

export default apiInitializer("0.11.1", (api) => {
  api.onPageChange(() => {
    document.querySelectorAll('.topic-list-item').forEach(item => {
      // Skip if already processed
      if (item.querySelector('.medium-author-name')) return;

      // Find the first avatar
      const avatar = item.querySelector('img.avatar');
      if (!avatar) return;

      // Get username from title (format: "Username - Original Poster, Most Recent Poster")
      const title = avatar.getAttribute('title') || '';
      const username = title.split(' - ')[0].trim();

      if (username) {
        // Create author name element (just the name, category handled by CSS)
        const authorSpan = document.createElement('span');
        authorSpan.className = 'medium-author-name';
        authorSpan.textContent = username;

        // Insert into the main-link area at the top
        const mainLink = item.querySelector('.main-link, td.main-link');
        if (mainLink) {
          mainLink.insertBefore(authorSpan, mainLink.firstChild);
        }
      }
    });
  });
});
