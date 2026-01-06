import { apiInitializer } from "discourse/lib/api";

export default apiInitializer("0.11.1", (api) => {
  api.onPageChange(() => {
    document.querySelectorAll('.topic-list-item').forEach(item => {
      // Skip if already processed
      if (item.querySelector('.medium-author-line')) return;

      // Find the first avatar
      const avatar = item.querySelector('img.avatar');
      if (!avatar) return;

      // Get username from title (format: "Username - Original Poster, Most Recent Poster")
      const title = avatar.getAttribute('title') || '';
      const username = title.split(' - ')[0].trim();

      // Find the category name element first, then get its wrapper
      const categoryNameEl = item.querySelector('.badge-category__name, .category-name');
      // Get the wrapper containing the full badge (icon + name)
      const categoryWrapper = categoryNameEl
        ? categoryNameEl.closest('.badge-wrapper, .badge-category-wrapper, .badge-category__wrapper, [class*="badge-wrapper"]')
        : item.querySelector('.badge-wrapper, .badge-category-wrapper');

      if (username) {
        // Create author line container
        const authorLine = document.createElement('div');
        authorLine.className = 'medium-author-line';

        // Build content: "Username in "
        const authorSpan = document.createElement('span');
        authorSpan.className = 'medium-author-name';
        authorSpan.textContent = username;
        authorLine.appendChild(authorSpan);

        // Add " in " separator
        const separator = document.createElement('span');
        separator.className = 'medium-in-separator';
        separator.innerHTML = '&nbsp;in&nbsp;';
        authorLine.appendChild(separator);

        // Clone the category badge wrapper and add to author line
        if (categoryWrapper) {
          const categoryClone = categoryWrapper.cloneNode(true);
          categoryClone.classList.add('medium-category-inline');
          authorLine.appendChild(categoryClone);
          // Hide the original
          categoryWrapper.style.display = 'none';
        } else if (categoryNameEl) {
          // Fallback: just use the text
          const catSpan = document.createElement('span');
          catSpan.className = 'medium-category-name';
          catSpan.textContent = categoryNameEl.textContent;
          authorLine.appendChild(catSpan);
          // Hide the original
          const parent = categoryNameEl.closest('[class*="badge"]');
          if (parent) parent.style.display = 'none';
        }

        // Insert at the top of the topic list item
        const mainLink = item.querySelector('.main-link, td.main-link');
        if (mainLink) {
          mainLink.insertBefore(authorLine, mainLink.firstChild);
        }
      }

    });
  });
});
