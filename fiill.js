
  
        async function fetchAndInsertContent(containerId, contentUrl) {
          try {
            const response = await fetch(contentUrl);
            if (response.status === 200) {
              const htmlContent = await response.text();
              document.getElementById(containerId).innerHTML = htmlContent;
            } else {
              throw new Error(`Failed to load ${contentUrl}`);
            }
          } catch (error) {
            console.error(error);
            // You can add error handling here (e.g., display an error message).
          }
        }
        
        const contentMappings = [
          { containerId: "header-container", contentUrl: "header.html" },
            { containerId: "home-container", contentUrl: "home.html" },
            { containerId: "about-container", contentUrl: "about.html" },
            { containerId: "services-container", contentUrl: "services.html" },
            { containerId: "portfolio-container", contentUrl: "portfolio.html" },
            { containerId: "education-container", contentUrl: "education.html" },
            { containerId: "ext-container", contentUrl: "ext.html" },
            { containerId: "skills-container", contentUrl: "skills.html" },
            { containerId: "contact-container", contentUrl: "contact.html" },
            { containerId: "footer-container", contentUrl: "footer.html" },
          // Add other mappings here...
        ];
        
        async function fetchAndInsertAllContent() {
          const promises = contentMappings.map((mapping) =>
            fetchAndInsertContent(mapping.containerId, mapping.contentUrl)
          );
        
          try {
            await Promise.all(promises);
          } catch (error) {
            // Handle any errors that may occur during content loading.
            console.error("Content loading error:", error);
            // You can display an error message or take other appropriate actions.
          }
        }
        
        // Call the function to fetch and insert all content
        fetchAndInsertAllContent();
        
        
      