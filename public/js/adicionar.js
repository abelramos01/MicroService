document.addEventListener('DOMContentLoaded', () => {
    // carregar as categorias no select
    const categorySelect = document.querySelector('#category');

    fetch('http://localhost:3000/dishes/categories')
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao buscar categorias');
            }
            return response.json();
        })
        .then(categories => {
            categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category.id;
                option.textContent = category.name;
                categorySelect.appendChild(option);
            });
        })
        .catch(err => {
            console.error('Erro ao carregar as categorias:', err);
            alert('Erro ao carregar as categorias.');
        });

    // pegar dados do formulário
    document.getElementById('dishes_form').addEventListener('submit', async (event) => {
        event.preventDefault();

        const form = event.target;
        const data = {
            name: form.name.value,
            description: form.description.value,
            price: form.price.value,
            categoryId: form.category.value,
        };

        try {
            const response = await fetch('http://localhost:3000/dishes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                alert('Prato adicionado com sucesso!');
                form.reset();
            } else {
                alert('Erro ao adicionar prato.');
            }
        } catch (error) {
            console.error('Erro:', error);
            alert('Erro na requisição.');
        }
    });
});    
