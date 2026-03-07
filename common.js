// common.js — Shared functions for Dashboard

var API = 'http://' + location.hostname + ':8085';

// ===== Theme =====
function initTheme() {
  // Theme flash is handled by inline script in <head>
  // This is for any additional init if needed
}

function toggleTheme() {
  document.documentElement.classList.toggle('dark');
  localStorage.setItem('theme', document.documentElement.classList.contains('dark') ? 'dark' : 'light');
}

// ===== Escape HTML =====
function esc(s) {
  if (!s) return '';
  var d = document.createElement('div');
  d.textContent = s;
  return d.innerHTML;
}

// ===== Format Date =====
function formatDate(d) {
  if (!d) return '';
  var dt = new Date(d + 'T00:00:00');
  var days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return days[dt.getDay()] + ' ' + dt.getDate() + ' ' + months[dt.getMonth()] + ' ' + dt.getFullYear();
}

// ===== Greeting =====
function updateGreeting(elementId) {
  var el = document.getElementById(elementId || 'greeting');
  if (!el) return;
  var h = new Date().getHours();
  var g = h < 12 ? 'Morning' : h < 17 ? 'Afternoon' : 'Evening';
  el.textContent = g + ', Sean';
}

// ===== Connection Check =====
function checkConnection(dotId) {
  var dot = document.getElementById(dotId || 'connDot');
  if (!dot) return;
  fetch(API + '/api/health')
    .then(function(r) { dot.classList.toggle('ok', r.ok); })
    .catch(function() { dot.classList.remove('ok'); });
}

// ===== Tab Navigation Highlighting =====
function highlightTab() {
  var page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.tab[data-page]').forEach(function(t) {
    t.classList.toggle('active', t.dataset.page === page);
  });
}

// ===== Toast Notifications =====
function showToast(message, type) {
  type = type || 'info';
  var container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  var toast = document.createElement('div');
  toast.className = 'toast toast-' + type;
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(function() {
    if (toast.parentNode) toast.parentNode.removeChild(toast);
  }, 2500);
}

// ===== Service Worker Registration =====
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').catch(function() {});
}

// ===== Init on DOM Ready =====
document.addEventListener('DOMContentLoaded', function() {
  highlightTab();

  // Close modals on overlay click
  document.querySelectorAll('.modal-overlay').forEach(function(m) {
    m.addEventListener('click', function(e) {
      if (e.target === m) m.classList.remove('open');
    });
  });
});
