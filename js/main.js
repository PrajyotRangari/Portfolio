// This file contains JavaScript code for interactive features such as the dark/light mode toggle, smooth scrolling, and any other animations or dynamic content loading.

document.addEventListener("DOMContentLoaded", function() {
        // Dark / Light Mode Toggle (Responsive)
    const toggleButton = document.getElementById("theme-toggle");
    const root = document.documentElement;

    function applyTheme(theme) {
        root.setAttribute("data-theme", theme);
        localStorage.setItem("theme", theme);
        // optional: swap button icon
        const icon = toggleButton.querySelector("i");
        if (icon) {
            icon.className = theme === "dark" ? "fa-solid fa-sun" : "fa-solid fa-moon";
        }
    }

    // On toggle click
    toggleButton.addEventListener("click", () => {
        const current = root.getAttribute("data-theme") === "dark" ? "dark" : "light";
        const next = current === "dark" ? "light" : "dark";
        applyTheme(next);
    });

    // Initialize theme from saved preference or system setting
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
        applyTheme(savedTheme);
    } else {
        // Default to dark theme when no preference is stored
        applyTheme('dark');
    }

    // Smooth Scrolling
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener("click", function(e) {
            e.preventDefault();
            const targetId = this.getAttribute("href");
            const targetElement = document.querySelector(targetId);
            targetElement.scrollIntoView({ behavior: "smooth" });
        });
    });

    // Dynamically load projects from projects.json
    fetch('data/projects.json')
      .then(response => response.json())
      .then(data => {
        const container = document.getElementById('projects-container');
        data.projects.forEach(project => {
          const card = document.createElement('div');
          card.className = 'project-card';

          // Project image
          const img = document.createElement('img');
          img.src = project.image;
          img.alt = project.alt || project.title;
          card.appendChild(img);

          // Title
          const title = document.createElement('h3');
          title.textContent = project.title;
          card.appendChild(title);

          // Description
          const desc = document.createElement('p');
          desc.textContent = project.description;
          card.appendChild(desc);

          // Tech stack (optional)
          if (project.tech) {
            const tech = document.createElement('div');
            tech.className = 'project-tech';
            tech.textContent = Array.isArray(project.tech) ? project.tech.join(', ') : project.tech;
            card.appendChild(tech);
          }

          // Links
          const links = document.createElement('div');
          links.className = 'project-links';
          if (project.liveDemo) {
            const live = document.createElement('a');
            live.href = project.liveDemo;
            live.target = '_blank';
            live.rel = 'noopener';
            live.innerHTML = '<i class="fa-solid fa-arrow-up-right-from-square"></i> Live Demo';
            links.appendChild(live);
          }
          if (project.github) {
            const github = document.createElement('a');
            github.href = project.github;
            github.target = '_blank';
            github.rel = 'noopener';
            github.innerHTML = '<i class="fa-brands fa-github"></i> GitHub';
            links.appendChild(github);
          }
          card.appendChild(links);

          container.appendChild(card);
        });
      })
      .catch(err => {
        document.getElementById('projects-container').innerHTML = "<p>Unable to load projects at this time.</p>";
      });

  const faders = document.querySelectorAll('.fade-in');
  const appearOptions = {
    threshold: 0.3,
    rootMargin: "0px 0px -50px 0px"
  };

  const appearOnScroll = new IntersectionObserver(function(entries, observer) {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    });
  }, appearOptions);

  faders.forEach(fader => {
      appearOnScroll.observe(fader);
  });

  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      // Calculate rotation limits (adjust as needed)
      const rotateY = ((x - centerX) / centerX) * 10; 
      const rotateX = -((y - centerY) / centerY) * 10;
      
      card.querySelector('.project-card-inner').style.transform = `rotateY(${rotateY}deg) rotateX(${rotateX}deg)`;
    });
    
    card.addEventListener('mouseleave', () => {
      card.querySelector('.project-card-inner').style.transform = 'rotateY(0deg) rotateX(0deg)';
    });
  });
});