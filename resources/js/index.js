// resources/js/index.js
import { magazines } from '../data/magazines.js';

const topics = [
  {
    id: "Space",
    title: "Space",
    url: "https://flipboard.com/topic/science.rss",
  },
  {
    id: "Politics",
    title: "Politics",
    url: "https://flipboard.com/topic/technology.rss",
  },
  {
    id: "sports",
    title: "Sports",
    url: "https://flipboard.com/topic/sports.rss",
  },
];

window.onload = () => {
  topics.forEach((topic, topicIndex) => {
    fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(topic.url)}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data.items) return;

        const accordionContainer = document.getElementById("newsAccordion");

        const accordionItem = `
          <div class="accordion-item">
            <h2 class="accordion-header" id="heading-${topic.id}">
              <button class="accordion-button ${topicIndex === 0 ? "" : "collapsed"}" 
                type="button" data-bs-toggle="collapse" data-bs-target="#collapse-${topic.id}" 
                aria-expanded="${topicIndex === 0 ? "true" : "false"}" 
                aria-controls="collapse-${topic.id}">
                ${topic.title}
              </button>
            </h2>
            <div id="collapse-${topic.id}" class="accordion-collapse collapse ${topicIndex === 0 ? "show" : ""}" 
              aria-labelledby="heading-${topic.id}" data-bs-parent="#newsAccordion">
              <div class="accordion-body">
                <div id="${topic.id}NewsCarousel" class="carousel slide" data-bs-ride="carousel">
                  <div class="carousel-inner">
                    ${data.items.slice(0, 10).map((article, index) => {
                      const isActive = index === 0 ? "active" : "";
                      return `
                        <div class="carousel-item ${isActive}">
                          <div class="card h-100 news-card mx-auto" style="max-width: 90%; border: none" onclick="window.open('${article.link}', '_blank')">
                            <img src="${article.enclosure?.link || "https://via.placeholder.com/600x300"}" class="card-img-top" alt="Image">
                            <div class="card-body">
                              <h5 class="card-title">${article.title}</h5>
                              <p class="card-text">${article.description.slice(0, 100)}...</p>
                            </div>
                          </div>
                        </div>`;
                    }).join("")}
                  </div>
                  <button class="carousel-control-prev" type="button" data-bs-target="#${topic.id}NewsCarousel" data-bs-slide="prev">
                    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Previous</span>
                  </button>
                  <button class="carousel-control-next" type="button" data-bs-target="#${topic.id}NewsCarousel" data-bs-slide="next">
                    <span class="carousel-control-next-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Next</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        `;

        accordionContainer.innerHTML += accordionItem;
      })
      .catch((err) => console.error("Failed to load RSS feed", err));
  });
};
