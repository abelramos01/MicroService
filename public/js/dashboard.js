document.addEventListener('DOMContentLoaded', () => {

    function newDish(dish) {
        const div = document.createElement('div');
        div.className = 'column is-4';

        div.innerHTML = `
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
            <div class="card-content">
                <div class="content book" data-id="${dish.id}">
                    <div class="book-meta">
                        <p class="is-size-4">R$${Number(dish.price).toFixed(2)}</p>
                        <h4 class="is-size-3 title">${dish.name}</h4>
                        <p class="is-size-6">${dish.description}</p>
                    </div>
                    <button class="button button-buy is-success is-fullwidth">Pedir</button>
                </div>
            </div>
        </div>`;
        return div;
    }

    const container = document.querySelector('.dishes');

    fetch('http://localhost:3000/dishes')
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao buscar pratos');
            }
            return response.json();
        })
        .then(data => {

            const grouped = {};

            data.forEach(dish => {
                const categoryName = dish.categories?.name || 'Sem categoria';

                if (!grouped[categoryName]) {
                    grouped[categoryName] = [];
                }
                grouped[categoryName].push(dish);
            });


            for (const [category, dishes] of Object.entries(grouped)) {
                const title = document.createElement('h2');
                title.className = 'title is-3';
                title.textContent = category;

                const row = document.createElement('div');
                row.className = 'columns is-multiline';

                dishes.forEach(dish => {
                    const card = newDish(dish);
                    row.appendChild(card);
                });

                container.appendChild(title);
                container.appendChild(row);
            }
        })
        .catch(err => {
            console.error('Erro ao carregar os pratos:', err);
            alert('Erro ao carregar os pratos.');
        });
});
