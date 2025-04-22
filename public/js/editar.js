
document.addEventListener('DOMContentLoaded', () => {
    initEditForm(); 
});

// função principal para carregar os dados do prato e preencher o formulário de edição
async function initEditForm() {
    const container = document.querySelector('.dishes-edit-container'); // container onde o formulário será inserido

    // pega o parâmetro "id" da URL para saber qual prato deve ser editado
    const urlParams = new URLSearchParams(window.location.search);
    const dishId = urlParams.get('id');

    if (!dishId) {
        alert('ID do prato não especificado!');
        return;
    }

    try {
        // requisição à API para obter os dados do prato específico
        const response = await fetch(`http://localhost:3000/dishes/${dishId}`);
        if (!response.ok) throw new Error('Erro ao buscar prato');

        const dish = await response.json(); // converte a resposta em JSON

        // função que monta o formulário HTML com os dados do prato preenchidos
        function loadingForm(dish) {
            const div = document.createElement('div');
            div.className = "container";

            // formulário com valores preenchidos do prato
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

        // cria o formulário e adiciona ao container
        const formElement = loadingForm(dish);
        container.appendChild(formElement);

        // referência ao elemento select de categorias
        const categorySelect = document.querySelector('#category');

        // requisição para buscar as categorias disponíveis
        const catResponse = await fetch('http://localhost:3000/dishes/categories');
        if (!catResponse.ok) throw new Error('Erro ao buscar categorias');

        const categories = await catResponse.json(); // converte a resposta em JSON

        // adiciona as categorias ao select e seleciona a atual do prato
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.name;
            if (category.id === dish.categoryId) option.selected = true;
            categorySelect.appendChild(option);
        });

        // adiciona o event listener de envio do formulário
        document.getElementById('dishes_form').addEventListener('submit', async (event) => {
            event.preventDefault(); // evita o comportamento padrão de envio do formulário

            const form = event.target;

            // coleta os dados do formulário
            const data = {
                name: form.name.value,
                description: form.description.value,
                price: form.price.value,
                categoryId: form.categoryId.value,
            };

            try {
                // envia os dados atualizados para a API usando método PUT
                const response = await fetch(`http://localhost:3000/dishes/${dishId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });

                if (response.ok) {
                    alert('Prato editado com sucesso!');
                    window.location.href = '/'; // redireciona para a página principal
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
