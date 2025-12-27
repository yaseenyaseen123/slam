// Template generator for admin panel
function generateFullHTML(data) {
    const galleryHTML = data.gallery.map(img => `
                <li class="gallery-item">
                    <img src="${img}" alt="سلام حمود" onclick="openImagePopup('${img}')">
                    <a href="${img}" download class="download-link"><i class="download-icon">&#x2193;</i></a>
                </li>`).join('\n');

    const videosHTML = data.videos.map(video => `
                <li class="video-item">
                    <iframe src="https://www.youtube.com/embed/${video.id}" allowfullscreen></iframe>
                    <h3>${video.title}</h3>
                    <p>${video.description}</p>
                </li>`).join('\n');

    const programsHTML = data.programs.map(program => `
                <li>
                    <h3>${program.title}</h3>
                    <p>${program.description}</p>
                    <p>${program.note}</p>
                </li>`).join('\n');

    return `This template will be populated with full HTML`;
}
