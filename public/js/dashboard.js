document.addEventListener('DOMContentLoaded', () => {
    function newDish(dish) {
        const div = document.createElement('div');
        div.className = 'column is-4';

        div.innerHTML = `
        <a href="editar.html?id=${dish.id}" class="card is-shady" style="display: block; text-decoration: none; color: inherit;">
        <div class="card is-shady">
            <div class="card-image">
                <figure class="image is-4by3">
                    <img
                        src="/img/prato.png" 
                        alt="${dish.name}" 
                        class="modal-button"
                    />
                </figure>
            </div>
            <a href=>
            <div class="card-content">
                <div class="content book" data-id="${dish.id}">
                    <div class="book-meta">
                        <p class="is-size-4">R$${Number(dish.price).toFixed(2)}</p>
                        <h4 class="is-size-3 title">${dish.name}</h4>
                        <p class="is-size-6">${dish.description}</p>
                    </div>
                    <button 
                        class="button button-buy is-success is-fullwidth"
                        aria-label="Pedir o prato ${dish.name}"
                    >Pedir</button>
                </div>
            </div>
            
        </div>
        </a>`;
        return div;
    }

    const container = document.querySelector('.dishes');
    const loader = document.getElementById('loader');
    const errorMsg = document.getElementById('error-msg');

    fetch('http://localhost:3000/dishes')
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao buscar pratos');
            }
            return response.json();
        })
        .then(data => {
            loader.classList.add('hidden');

            const grouped = {};

            data.forEach(dish => {
                const categoryName = dish.categories?.name || 'Sem categoria';
                if (!grouped[categoryName]) {
                    grouped[categoryName] = [];
                }
                grouped[categoryName].push(dish);
            });

            const tabsContainer = document.getElementById('category-tabs');
            const tabsList = tabsContainer.querySelector('ul');
            const categories = ['Todos', ...Object.keys(grouped)];
            tabsContainer.classList.remove('hidden');


            categories.forEach((category, index) => {
                const li = document.createElement('li');
                if (index === 0) li.classList.add('is-active');

                const a = document.createElement('a');
                a.textContent = category;
                a.href = '#';
                a.setAttribute('data-category', category);

                li.appendChild(a);
                tabsList.appendChild(li);
            });


            function renderDishes(categoryFilter) {
                container.innerHTML = '';
                const entries = categoryFilter === 'Todos'
                    ? Object.entries(grouped)
                    : [[categoryFilter, grouped[categoryFilter]]];

                for (const [category, dishes] of entries) {
                    const section = document.createElement('section');
                    section.setAttribute('aria-labelledby', `categoria-${category}`);

                    const title = document.createElement('h2');
                    title.className = 'title is-3';
                    title.id = `categoria-${category}`;
                    title.textContent = category;

                    const row = document.createElement('div');
                    row.className = 'columns is-multiline';

                    dishes.forEach(dish => {
                        const card = newDish(dish);
                        row.appendChild(card);
                    });

                    section.appendChild(title);
                    section.appendChild(row);
                    container.appendChild(section);
                }
            }

            renderDishes('Todos');


            tabsList.querySelectorAll('a').forEach(tab => {
                tab.addEventListener('click', (e) => {
                    e.preventDefault();

                    const selected = tab.getAttribute('data-category');
                    tabsList.querySelectorAll('li').forEach(li => li.classList.remove('is-active'));
                    tab.parentElement.classList.add('is-active');

                    renderDishes(selected);
                });
            });
        })
        .catch(err => {
            loader.classList.add('hidden');
            errorMsg.classList.remove('hidden');
            console.error('Erro ao carregar os pratos:', err);
        });
});
