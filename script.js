function Redirect() {
  window.location.href = "components/homepage.html";
}

document.addEventListener("DOMContentLoaded", () => {
  // =======================
  // MENU BUTTONS (ARIA)
  // =======================
  const menuButtons = document.querySelectorAll(".menu-button");
  function closeAllMenus() {
    menuButtons.forEach(btn => btn.setAttribute("aria-expanded", "false"));
  }
  menuButtons.forEach(button => {
    button.addEventListener("click", () => {
      const expanded = button.getAttribute("aria-expanded") === "true";
      closeAllMenus();
      if (!expanded) {
        button.setAttribute("aria-expanded", "true");
      }
    });
    button.addEventListener("keydown", (e) => {
      const submenu = button.nextElementSibling;
      if (e.key === "ArrowDown" && submenu) {
        e.preventDefault();
        button.setAttribute("aria-expanded", "true");
        submenu.querySelector("a, .menu-button")?.focus();
      }
      if (e.key === "Escape") {
        closeAllMenus();
        button.focus();
      }
    });
  });
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".dropdown-nav")) {
      closeAllMenus();
    }
  });

  // =======================
  // JOB CARD DRAG & DROP
  // =======================
  const jobList = document.getElementById("job-list");
  if (jobList) {
    const jobCards = document.querySelectorAll(".job-card");
    jobCards.forEach(card => {
      card.addEventListener("dragstart", () => {
        card.classList.add("dragging");
      });
      card.addEventListener("dragend", () => {
        card.classList.remove("dragging");
        saveJobOrder();
      });
    });
    jobList.addEventListener("dragover", e => {
      e.preventDefault();
      const draggingCard = document.querySelector(".dragging");
      const afterElement = getDragAfterElement(jobList, e.clientY);
      if (draggingCard) {
        if (afterElement == null) {
          jobList.appendChild(draggingCard);
        } else {
          jobList.insertBefore(draggingCard, afterElement);
        }
      }
    });
    function getDragAfterElement(container, y) {
      const draggableElements = [...container.querySelectorAll(".job-card:not(.dragging)")];
      return draggableElements.reduce(
        (closest, child) => {
          const box = child.getBoundingClientRect();
          const offset = y - box.top - box.height / 2;
          if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
          } else {
            return closest;
          }
        },
        { offset: Number.NEGATIVE_INFINITY }
      ).element;
    }
    function saveJobOrder() {
      const order = [...jobList.querySelectorAll(".job-card")].map(card => card.textContent);
      localStorage.setItem("jobOrder", JSON.stringify(order));
    }
    function loadJobOrder() {
      const savedOrder = JSON.parse(localStorage.getItem("jobOrder"));
      if (savedOrder) {
        savedOrder.forEach(text => {
          const card = [...document.querySelectorAll(".job-card")].find(c => c.textContent === text);
          if (card) jobList.appendChild(card);
        });
      }
    }
    loadJobOrder();
  }

  // =======================
  // FILTER PANEL
  // =======================
  const filterPanel = document.getElementById("filter-panel");
  const pinBtn = document.getElementById("pin-panel");
  const resizeBtn = document.getElementById("resize-panel");
  if (filterPanel && pinBtn && resizeBtn) {
    pinBtn.addEventListener("click", () => {
      filterPanel.classList.toggle("pinned");
      localStorage.setItem("panelPinned", filterPanel.classList.contains("pinned"));
    });
    resizeBtn.addEventListener("click", () => {
      filterPanel.classList.toggle("resized");
      localStorage.setItem("panelResized", filterPanel.classList.contains("resized"));
    });
    // Restore filter panel state
    if (localStorage.getItem("panelPinned") === "true") {
      filterPanel.classList.add("pinned");
    }
    if (localStorage.getItem("panelResized") === "true") {
      filterPanel.classList.add("resized");
    }
  }

  // =======================
  // LAZY IMAGE LOADING
  // =======================
  const lazyImages = document.querySelectorAll("img.lazy-image");
  if (lazyImages.length > 0) {
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.getAttribute("data-src");
          img.onload = () => img.classList.add("fade-in");
          observer.unobserve(img);
        }
      });
    });
    lazyImages.forEach(img => observer.observe(img));
    lazyImages.forEach(img => {
      img.onerror = () => {
        img.src = "assets/placeholder.png";
      };
    });
  }

  // =======================
  // THEME TOGGLE (WORKS ACROSS SITE)
  // =======================
  const themeToggle = document.getElementById("themeToggle");
  const themeIcon = document.getElementById("theme-icon");
  function setTheme(dark) {
    document.body.classList.toggle("dark", dark);
    if (themeIcon) {
      themeIcon.classList.toggle("fa-moon", !dark);
      themeIcon.classList.toggle("fa-sun", dark);
    }
  }
  const darkMode = localStorage.getItem("theme") === "dark";
  setTheme(darkMode);
  if (themeToggle) {
    themeToggle.onclick = () => {
      const isDark = !document.body.classList.contains("dark");
      setTheme(isDark);
      localStorage.setItem("theme", isDark ? "dark" : "light");
    };
  }

  // =======================
  // MOBILE NAVIGATION TOGGLE
  // =======================
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      mobileToggle.classList.toggle('active');
    });
  }

  // =======================
  // MULTILEVEL DROPDOWN FOR MOBILE
  // =======================
  document.querySelectorAll('.nav-menu .dropdown > a').forEach(link => {
    link.addEventListener('click', function (e) {
      const submenu = this.nextElementSibling;
      if (submenu && submenu.classList.contains('dropdown-content')) {
        if (window.innerWidth <= 900) {
          e.preventDefault();
          const parentLi = this.parentElement.parentElement.querySelectorAll('.dropdown.open');
          parentLi.forEach(li => {
            if (li !== this.parentElement) li.classList.remove('open');
          });
          this.parentElement.classList.toggle('open');
        }
      }
    });
  });
  document.addEventListener('click', function (e) {
    document.querySelectorAll('.nav-menu .dropdown.open').forEach(drop => {
      if (!drop.contains(e.target)) drop.classList.remove('open');
    });
  });

  // =======================
  // SMOOTH SCROLLING FOR ANCHOR LINKS
  // =======================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // =======================
  // BACK TO TOP BUTTON
  // =======================
  const backToTopBtn = document.getElementById("backToTop") || document.getElementById("backToTopBtn");
  if (backToTopBtn) {
    window.addEventListener("scroll", () => {
      backToTopBtn.style.display =
        document.documentElement.scrollTop > 200 ? "block" : "none";
    });
    backToTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // =======================
  // SIGN IN / SIGN UP TOGGLE
  // =======================
  let sign_in_btn = document.querySelector(".sign-in");
  let sign_up_btn = document.querySelector(".sign-up");
  let sign_up_section = document.querySelector(".sign-section");
  let sign_in_section = document.querySelector(".sign-section-2");
  if (sign_in_btn && sign_up_section && sign_in_section) {
    sign_in_btn.addEventListener("click", () => {
      sign_up_section.style.visibility = "hidden";
      sign_in_section.style.visibility = "visible";
    });
  }
  if (sign_up_btn && sign_up_section && sign_in_section) {
    sign_up_btn.addEventListener("click", () => {
      sign_in_section.style.visibility = "hidden";
      sign_up_section.style.visibility = "visible";
    });
  }
  window.guestLogin = function () {
    window.location.href = "components/homepage.html";
  };

  // =======================
  // SAVE JOBS
  // =======================
  const saveButtons = document.querySelectorAll(".save-job-btn");
  const savedJobsContainer = document.getElementById("saved-jobs-container");
  const savedJobs = JSON.parse(localStorage.getItem("savedJobs")) || [];
  if (savedJobsContainer) {
    savedJobs.forEach(job => {
      const jobDiv = document.createElement("div");
      jobDiv.className = "job-card";
      jobDiv.innerHTML = job;
      savedJobsContainer.appendChild(jobDiv);
    });
    saveButtons.forEach(btn => {
      btn.addEventListener("click", function () {
        const jobCard = this.parentElement.outerHTML;
        savedJobs.push(jobCard);
        localStorage.setItem("savedJobs", JSON.stringify(savedJobs));
        this.disabled = true;
        this.innerText = "✅ Saved";
      });
    });
  }

  // =======================
  // CHATBOT
  // =======================
  const toggleBtn = document.getElementById("chatbot-toggle");
  const chatbot = document.getElementById("chatbot");
  const messages = document.getElementById("chatbot-messages");
  const inputField = document.getElementById("chatbot-input");
  const sendBtn = document.getElementById("chatbot-send");
  const closeBtn = document.getElementById("chatbot-close");
  let greeted = false;
  function appendMessage(sender, text) {
    if (!messages) return;
    const msg = document.createElement("div");
    msg.innerHTML = `<strong>${sender}:</strong> ${text}`;
    messages.appendChild(msg);
    messages.scrollTop = messages.scrollHeight;
  }
  if (toggleBtn && chatbot && inputField) {
    toggleBtn.addEventListener("click", () => {
      chatbot.style.display = "flex";
      toggleBtn.setAttribute("aria-expanded", "true");
      inputField.focus();
      if (!greeted) {
        appendMessage("Bot", "Hello! How can I help you today?");
        greeted = true;
      }
    });
  }
  if (closeBtn && chatbot && toggleBtn) {
    closeBtn.addEventListener("click", () => {
      chatbot.style.display = "none";
      toggleBtn.setAttribute("aria-expanded", "false");
      toggleBtn.focus();
    });
  }
  if (sendBtn && inputField) {
    sendBtn.addEventListener("click", sendMessage);
    inputField.addEventListener("keypress", (e) => {
      if (e.key === "Enter") sendMessage();
    });
  }
  function sendMessage() {
    if (!inputField || !messages) return;
    const userMsg = inputField.value.trim();
    if (!userMsg) return;
    appendMessage("You", userMsg);
    inputField.value = "";
    setTimeout(() => {
      appendMessage("Bot", getBotReply(userMsg));
    }, 600);
  }
  function getBotReply(input) {
    input = input.toLowerCase();
    if (input.includes("hello")) return "Hi there! How can I assist you?";
    if (input.includes("job")) return "You can browse job listings below.";
    if (input.includes("apply"))
      return "Click on a job card to view details and apply.";
    return "I'm here to help with job-related queries!";
  }

  // =======================
  // JOB ALERT MODAL
  // =======================
  const jobAlertForm = document.getElementById('jobAlertForm');
  const alertKeywordInput = document.getElementById('alertKeyword');
  const simulateJobBtn = document.getElementById('simulateJobBtn');
  const modal = document.getElementById('jobAlertModal');
  const alertMessage = document.getElementById('alertMessage');
  const closeModalBtn = document.querySelector('.close-btn');
  if (jobAlertForm && alertKeywordInput) {
    jobAlertForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const keyword = alertKeywordInput.value.trim();
      if (keyword) {
        localStorage.setItem('jobAlertKeyword', keyword);
        alert(`Subscribed for alerts with keyword: ${keyword}`);
        alertKeywordInput.value = '';
      }
    });
  }




  if (simulateJobBtn && modal && alertMessage) {
    simulateJobBtn.addEventListener('click', function () {
      const savedKeyword = localStorage.getItem('jobAlertKeyword');
      if (savedKeyword) {
        alertMessage.textContent = `New job matching "${savedKeyword}" is available!`;
        modal.style.display = 'block';
      } else {
        alert('No alert preferences found. Please subscribe first.');
      }
    });
  }



  if (closeModalBtn && modal) {
    closeModalBtn.addEventListener('click', function () {
      modal.style.display = 'none';
    });
    window.addEventListener('click', function (e) {
      if (e.target === modal) {
        modal.style.display = 'none';
      }
    });
  }

  const form = document.getElementById("applicationForm");
  const historyDiv = document.getElementById("applicationHistory");
  function loadApplications() {
    if (!historyDiv) return;
    historyDiv.innerHTML = "";
    let applications = JSON.parse(localStorage.getItem("applications")) || [];
    if (applications.length === 0) {
      historyDiv.innerHTML = "<p>No applications yet.</p>";
      return;
    }
    applications.forEach(app => {
      const card = document.createElement("div");
      card.classList.add("application-card");
      card.innerHTML = `
        <p><strong>Name:</strong> ${app.name}</p>
        <p><strong>Email:</strong> ${app.email}</p>
        <p><strong>Job Title:</strong> ${app.jobTitle}</p>
        <p><strong>Resume:</strong> ${app.resumeName}</p>
        <p class="status"><strong>Status:</strong> ${app.status}</p>
      `;
      historyDiv.appendChild(card);
    });
  }

  if (form && historyDiv) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const jobTitle = document.getElementById("jobTitle").value.trim();
      const resume = document.getElementById("resume").files[0];
      const status = document.getElementById("status").value;
      if (!name || !email || !jobTitle || !resume) {
        alert("Please fill all fields and upload a resume.");
        return;
      }

      const reader = new FileReader();
      reader.onload = function () {
        const newApp = {
          name,
          email,
          jobTitle,
          resumeName: resume.name,
          status,
          resumeData: reader.result
        };
        let applications = JSON.parse(localStorage.getItem("applications")) || [];
        applications.push(newApp);
        localStorage.setItem("applications", JSON.stringify(applications));
        form.reset();
        loadApplications();
        alert("Application submitted successfully!");
      };
      reader.readAsDataURL(resume);
    });
    loadApplications();
  }


  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (currentUser) {
    showProfile(currentUser.username);
  }
  function register() {
    const username = document.getElementById("register-username").value.trim();
    const password = document.getElementById("register-password").value.trim();
    if (!username || !password) {
      alert("Please fill all fields.");
      return;
    }
    let users = JSON.parse(localStorage.getItem("users")) || [];
    if (users.find(user => user.username === username)) {
      alert("Username already taken.");
      return;
    }
    users.push({ username, password });
    localStorage.setItem("users", JSON.stringify(users));
    alert("Registration successful! You can now login.");
  }
  function login() {
    const username = document.getElementById("login-username").value.trim();
    const password = document.getElementById("login-password").value.trim();
    let users = JSON.parse(localStorage.getItem("users")) || [];
    const foundUser = users.find(user => user.username === username && user.password === password);
    if (!foundUser) {
      alert("Invalid credentials.");
      return;
    }
    localStorage.setItem("currentUser", JSON.stringify(foundUser));
    showProfile(username);
  }
  function showProfile(username) {
    document.getElementById("login-section").style.display = "none";
    document.getElementById("register-section").style.display = "none";
    document.getElementById("profile-section").style.display = "block";
    document.getElementById("profile-username").innerText = username;
  }
  function updateProfile() {
    const newUsername = document.getElementById("profile-new-username").value.trim();
    if (!newUsername) {
      alert("Please enter a new username.");
      return;
    }
    let users = JSON.parse(localStorage.getItem("users")) || [];
    let currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (users.find(user => user.username === newUsername)) {
      alert("Username already exists.");
      return;
    }
    users = users.map(user => {
      if (user.username === currentUser.username) {
        return { ...user, username: newUsername };
      }
      return user;
    });
    currentUser.username = newUsername;
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("currentUser", JSON.stringify(currentUser));
    document.getElementById("profile-username").innerText = newUsername;
    alert("Profile updated!");
  }
  window.logout = function () {
    localStorage.removeItem("currentUser");
    location.reload();
  };
});

console.log("Script loaded");

// =======================
// LOADING INDICATOR FOR DYNAMIC CONTENT
// =======================

// Create loading spinner element
function createLoadingSpinner() {
  let spinner = document.getElementById("loading-spinner");
  if (!spinner) {
    spinner = document.createElement("div");
    spinner.id = "loading-spinner";
    spinner.setAttribute("role", "status");
    spinner.setAttribute("aria-live", "polite");
    spinner.style.position = "fixed";
    spinner.style.top = "50%";
    spinner.style.left = "50%";
    spinner.style.transform = "translate(-50%, -50%)";
    spinner.style.zIndex = "9999";
    spinner.style.background = "rgba(255,255,255,0.8)";
    spinner.style.borderRadius = "1rem";
    spinner.style.padding = "2rem";
    spinner.style.boxShadow = "0 4px 24px rgba(102,126,234,0.15)";
    spinner.innerHTML = `
      <div style="display:flex;flex-direction:column;align-items:center;">
        <div style="width:48px;height:48px;border:6px solid #667eea;border-top:6px solid #764ba2;border-radius:50%;animation:spin 1s linear infinite;"></div>
        <span style="margin-top:1rem;color:#3d55b4;font-weight:600;font-size:1.1rem;">Loading...</span>
      </div>
      <style>
        @keyframes spin {
          0% { transform: rotate(0deg);}
          100% { transform: rotate(360deg);}
        }

      </style>
    `;
    document.body.appendChild(spinner);
  }
  spinner.style.display = "block";
}

function removeLoadingSpinner() {
  const spinner = document.getElementById("loading-spinner");
  if (spinner) spinner.style.display = "none";
}

function fetchDynamicContent(url, callback) {
  createLoadingSpinner();
  

  setTimeout(() => {
    // ...fetch logic here...
    removeLoadingSpinner();
    if (typeof callback === "function") callback();
  }, 1500);
}

// Example: Show spinner when loading job listings
const jobList = document.getElementById("job-list");
if (jobList) {
  // Simulate dynamic fetch on page load
  createLoadingSpinner();
  setTimeout(() => {
    // After fetching jobs, remove spinner
    removeLoadingSpinner();
    // ...existing job rendering logic...
  }, 1200);
}

// You can wrap any async operation with createLoadingSpinner() and removeLoadingSpinner()
// For accessibility, the spinner uses role="status" and aria-live="polite"