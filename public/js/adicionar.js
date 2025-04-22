// aguarda o carregamento completo do DOM antes de executar o código
document.addEventListener('DOMContentLoaded', () => {
    // seleciona o elemento <select> do formulário onde as categorias serão carregadas
    const categorySelect = document.querySelector('#category');

    // faz uma requisição para buscar todas as categorias disponíveis na API
    fetch('http://localhost:3000/dishes/categories')
        .then(response => {
            // verifica se a resposta da API foi bem-sucedida
            if (!response.ok) {
                throw new Error('Erro ao buscar categorias');
            }
            return response.json(); // converte a resposta em JSON
        })
        .then(categories => {
            // para cada categoria recebida, cria uma <option> no <select>
            categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category.id;
                option.textContent = category.name;
                categorySelect.appendChild(option);
            });
        })
        .catch(err => {
            // em caso de erro na requisição, exibe no console e mostra alerta
            console.error('Erro ao carregar as categorias:', err);
            alert('Erro ao carregar as categorias.');
        });

    // adiciona um event listener para lidar com o envio do formulário
    document.getElementById('dishes_form').addEventListener('submit', async (event) => {
        event.preventDefault(); // impede o comportamento padrão do formulário (recarregar a página)

        const form = event.target;

        // cria um objeto com os dados do formulário
        const data = {
            name: form.name.value,
            description: form.description.value,
            price: form.price.value,
            categoryId: form.category.value,
        };

        try {
            // envia os dados para a API para criar um novo prato (POST)
            const response = await fetch('http://localhost:3000/dishes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                alert('Prato adicionado com sucesso!');
                window.location.href = '/'; // redireciona para a página inicial
                form.reset(); // limpa o formulário
            } else {
                alert('Erro ao adicionar prato.');
            }
        } catch (error) {
            // em caso de erro na requisição, exibe no console e alerta o usuário
            console.error('Erro:', error);
            alert('Erro na requisição.');
        }
    });
});
