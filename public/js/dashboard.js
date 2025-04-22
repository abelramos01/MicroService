// Aguarda o carregamento completo do DOM antes de executar o script
document.addEventListener('DOMContentLoaded', () => {

    // Função responsável por criar um card HTML para um prato
    function newDish(dish) {
        const div = document.createElement('div');
        div.className = 'column is-4';

        // cria o conteúdo HTML do card com os dados do prato
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
            <div class="card-content">
                <div class="content book" data-id="${dish.id}">
                    <div class="book-meta">
                        <p class="is-size-4">R$${Number(dish.price).toFixed(2)}</p> <!-- Preço formatado -->
                        <h4 class="is-size-3 title">${dish.name}</h4> <!-- Nome do prato -->
                        <p class="is-size-6">${dish.description}</p> <!-- Descrição do prato -->
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

    // sleciona os elementos do DOM que serão manipulados
    const container = document.querySelector('.dishes'); // container onde os pratos serão exibidos
    const loader = document.getElementById('loader');    // loader de carregamento
    const errorMsg = document.getElementById('error-msg'); // mensagem de erro

    // faz uma requisição para a API de pratos
    fetch('http://localhost:3000/dishes')
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao buscar pratos');
            }
            return response.json(); // converte a resposta em JSON
        })
        .then(data => {
            loader.classList.add('hidden'); // esconde o loader

            const grouped = {}; // objeto para agrupar os pratos por categoria

            // organiza os pratos por categoria
            data.forEach(dish => {
                const categoryName = dish.categories?.name || 'Sem categoria';
                if (!grouped[categoryName]) {
                    grouped[categoryName] = [];
                }
                grouped[categoryName].push(dish);
            });

            // cria as abas de categorias no topo
            const tabsContainer = document.getElementById('category-tabs');
            const tabsList = tabsContainer.querySelector('ul');
            const categories = ['Todos', ...Object.keys(grouped)];
            tabsContainer.classList.remove('hidden');

            // adiciona uma aba para cada categoria
            categories.forEach((category, index) => {
                const li = document.createElement('li');
                if (index === 0) li.classList.add('is-active'); // Ativa a primeira aba

                const a = document.createElement('a');
                a.textContent = category;
                a.href = '#';
                a.setAttribute('data-category', category);

                li.appendChild(a);
                tabsList.appendChild(li);
            });

            // Função para renderizar os pratos com base na categoria selecionada
            function renderDishes(categoryFilter) {
                container.innerHTML = ''; // Limpa os pratos exibidos

                // Se categoria for "Todos", mostra todos os grupos
                const entries = categoryFilter === 'Todos'
                    ? Object.entries(grouped)
                    : [[categoryFilter, grouped[categoryFilter]]];

                // Para cada categoria/grupo, cria uma seção com os pratos
                for (const [category, dishes] of entries) {
                    const section = document.createElement('section');
                    section.setAttribute('aria-labelledby', `categoria-${category}`);

                    const title = document.createElement('h2');
                    title.className = 'title is-3';
                    title.id = `categoria-${category}`;
                    title.textContent = category;

                    const row = document.createElement('div');
                    row.className = 'columns is-multiline';

                    // Adiciona cada prato ao layout
                    dishes.forEach(dish => {
                        const card = newDish(dish);
                        row.appendChild(card);
                    });

                    section.appendChild(title);
                    section.appendChild(row);
                    container.appendChild(section);
                }
            }

            // renderiza todos os pratos inicialmente
            renderDishes('Todos');

            // adiciona evento de clique nas abas para filtrar os pratos
            tabsList.querySelectorAll('a').forEach(tab => {
                tab.addEventListener('click', (e) => {
                    e.preventDefault(); // Evita recarregar a página

                    const selected = tab.getAttribute('data-category'); // Obtém a categoria clicada
                    tabsList.querySelectorAll('li').forEach(li => li.classList.remove('is-active')); // Remove o destaque das outras abas
                    tab.parentElement.classList.add('is-active'); // Destaca a aba clicada

                    renderDishes(selected); // Atualiza a exibição com base na categoria
                });
            });
        })
        .catch(err => {
            // rm caso de erro, esconde o loader e mostra a mensagem de erro
            loader.classList.add('hidden');
            errorMsg.classList.remove('hidden');
            console.error('Erro ao carregar os pratos:', err);
        });
});
