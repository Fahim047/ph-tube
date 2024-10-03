console.log('script is running!');

const loadCategories = () => {
	const url = `https://openapi.programming-hero.com/api/phero-tube/categories`;

	fetch(url)
		.then((res) => res.json())
		.then((data) => showCategories(data.categories))
		.catch((err) => console.log(err));
};

const showCategories = (categories) => {
	const container = document.getElementById('categories-container');

	categories.map((item) => {
		const btn = document.createElement('button');
		btn.classList.add('btn', 'category-btn');
		btn.id = item.category_id;
		btn.addEventListener('click', () => loadVideosByCategory(item.category_id));
		btn.innerText = item.category;

		container.appendChild(btn);
	});
};

const loadVideos = (searchParam = '') => {
	const url = `https://openapi.programming-hero.com/api/phero-tube/videos?title=${searchParam}`;

	fetch(url)
		.then((res) => res.json())
		.then((data) => showVideos(data.videos))
		.catch((err) => console.log(err));
};

const loadVideosByCategory = (id) => {
	const url = `https://openapi.programming-hero.com/api/phero-tube/category/${id}`;

	fetch(url)
		.then((res) => res.json())
		.then((data) => {
			removeActiveClass();
			const activeBtn = document.getElementById(id);
			activeBtn.classList.add('active');
			showVideos(data.category);
		})
		.catch((err) => console.log(err));
};

const showVideos = (videos) => {
	const container = document.getElementById('videos-container');
	container.innerHTML = '';
	videos.map((video) => {
		const card = document.createElement('div');
		card.classList = 'card card-compact rounded-none cursor-pointer';
		card.innerHTML = `
      <figure class="h-[150px]">
        <img
          class="size-full object-cover rounded-md"
          src=${video.thumbnail}
          alt="Shoes"
        />
      </figure>
      <div class="py-2 flex gap-2 ">
        <img class="size-8 object-cover rounded-full" src=${
					video.authors[0].profile_picture
				} />
        <div>
          <h2 class="font-bold text-base">${video.title}</h2>
          <div class="flex items-center gap-1">
            <h4 class="text-sm text-gray-500">${
							video.authors[0].profile_name
						}</h4>
            ${
							video.authors[0].verified === true
								? `<img
									class="size-4"
									src="https://img.icons8.com/?size=48&id=D9RtvkuOe31p&format=png"
								/>`
								: ''
						}
          </div>
        </div>
      </div>
    `;
		card.addEventListener('click', () => showDetails(`${video.video_id}`));

		container.appendChild(card);
	});
};

const showDetails = async (videoId) => {
	const url = `https://openapi.programming-hero.com/api/phero-tube/video/${videoId}`;

	const res = await fetch(url);
	const data = await res.json();
	showModal(data.video);
};

const showModal = (videoData) => {
	const { thumbnail, title, description } = videoData;
	const modal = document.getElementById('video-details-modal');
	const modalContent = modal.querySelector('.modal-content');
	modalContent.classList.add('space-y-4');
	modalContent.innerHTML = `
    <img class="rounded-xl" src="${thumbnail}" />
    <h3 class="text-2xl font-bold">${title}</h3>
    <p>${description}</p>
  `;
	modal.showModal();
};
const removeActiveClass = () => {
	const btns = document.querySelectorAll('.category-btn');

	btns.forEach((btn) => btn.classList.remove('active'));
};

const searchInput = document.getElementById('search-input');
searchInput.addEventListener('keyup', (e) => loadVideos(e.target.value));
loadCategories();
loadVideos();
