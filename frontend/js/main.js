// Highlight the nav link that matches the current page
const currentFile = location.pathname.split('/').pop() || 'index.html';

document.querySelectorAll('nav a').forEach(a => {
  const href = a.getAttribute('href');
  const isHome = (href === 'index.html' || href === './') && (currentFile === 'index.html' || currentFile === '');
  const isMatch = href === currentFile;
  if (isHome || isMatch) a.classList.add('active');
});
