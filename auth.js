 document.addEventListener('DOMContentLoaded', () => {
  injectIcons();
  setupMobileMenu();
  setCurrentYear();

  // LOGIN
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const password = document.getElementById('password').value;
      if (password.length < 8) {
        alert('Password must be at least 8 characters.');
        return;
      }
      alert('Logged in successfully!');
      window.location.href = 'index.html';
    });
  }

  // REGISTER
  const registerForm = document.getElementById('registerForm');
  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const password = document.getElementById('password').value;
      if (password.length < 8) {
        alert('Password must be at least 8 characters.');
        return;
      }
      alert('Registered successfully with profile picture!');
      window.location.href = 'login.html';
    });

    // Profile picture preview
    const profilePicInput = document.getElementById('profilePic');
    const preview = document.getElementById('preview');
    if (profilePicInput) {
      profilePicInput.addEventListener('change', () => {
        const file = profilePicInput.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (e) => {
            preview.innerHTML = `<img src="${e.target.result}" alt="Profile Preview">`;
          };
          reader.readAsDataURL(file);
        }
      });
    }
  }
});
