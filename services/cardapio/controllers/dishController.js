document.addEventListener('DOMContentLoaded', () => {
    initEditForm(); 
});

async function initEditForm() {
    const container = document.querySelector('.dishes-edit-container');

    const urlParams = new URLSearchParams(window.location.search);
    const dishId = urlParams.get('id');

    if (!dishId) {
        alert('ID do prato não especificado!');
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/dishes/${dishId}`);
        if (!response.ok) throw new Error('Erro ao buscar prato');

        const dish = await response.json();

        function loadingForm(dish) {
            const div = document.createElement('div');
            div.className = "container";

            div.innerHTML = `
            <center>
                <div id="container-form">
                    <form id="dishes_form" enctype="multipart/form-data">
                        <label for="dishes-name">Nome do prato</label>
                        <input type="text" id="dishes-name" name="name" value="${dish.name}" required>
                        <br>
                        <label for="dishes-price">Preço do prato</label>
                        <input type="number" id="dishes-price" name="price" value="${dish.price}" required>
                        <br>
                        <label for="category">Categoria do prato</label>
                        <select id="category" name="categoryId" required>
                            <option value="">Selecione uma categoria</option>
                        </select>

                        <p>Descrição</p>
                        <textarea id="description" name="description" required>${dish.description}</textarea>
                        <br>
                        <button class="botao" type="submit">Editar</button>
                    </form>
                </div>
            </center>`;

            return div;
        }

        const formElement = loadingForm(dish);
        container.appendChild(formElement);

        // carregar categorias
        const categorySelect = document.querySelector('#category');

        const catResponse = await fetch('http://localhost:3000/dishes/categories');
        if (!catResponse.ok) throw new Error('Erro ao buscar categorias');

        const categories = await catResponse.json();
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.name;
            if (category.id === dish.categoryId) option.selected = true;
            categorySelect.appendChild(option);
        });

        // adicionar event listener após criar o form
        document.getElementById('dishes_form').addEventListener('submit', async (event) => {
            event.preventDefault();

            const form = event.target;
            const data = {
                name: form.name.value,
                description: form.description.value,
                price: form.price.value,
                categoryId: form.categoryId.value,
            };

            try {
                const response = await fetch(`http://localhost:3000/dishes/${dishId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });

                if (response.ok) {
                    alert('Prato editado com sucesso!');
                    window.location.href = '/'; 
                } else {
                    alert('Erro ao editar prato.');
                }
            } catch (error) {
                console.error('Erro:', error);
                alert('Erro na requisição.');
            }
        });

    } catch (err) {
        console.error('Erro ao carregar prato:', err);
        alert('Erro ao carregar prato.');
    }
}
