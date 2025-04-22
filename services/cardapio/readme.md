Aluno: Abel Vitor Martins Ramos


Exemplos de Requisição do Cardápio


1. GET /dishes

*Objetivo:* Buscar todos os pratos

Essa requisição retorna todos os pratos cadastrados no sistema, incluindo os dados relacionados à categoria de cada um. É útil para exibir o cardápio completo no front-end.

    curl http://localhost:3000/dishes

*Routes:*

    router.get('/', getAllDishes);

*Controller:*

    export const getAllDishes = async (req, res) => {
    try {
        // busca todos os pratos e inclui os dados da categoria relacionada
        const dishes = await prisma.dishes.findMany({
            include: {
                categories: true 
            }
        });
        // retorna os pratos encontrados
        res.json(dishes);
    } catch (error) {
        // em caso de erro, retorna status 500 com mensagem de erro
        res.status(500).json({ error: 'Erro ao buscar dishes' });
    }
    };


2.GET /dishes/:id

*Objetivo:* Buscar um prato específico por ID.

Essa requisição busca um prato individualmente, com base no ID fornecido na URL. É útil para exibir detalhes de um prato selecionado.

    curls http://loacalhost:3000/dishes/1

*Routes:*

    router.get('/:id', getDishById);


*Controller:*

    export const getDishById = async (req, res) => {
    // extrai o ID da rota (URL)
    const { id } = req.params;

    try {
        // busca o prato pelo ID e inclui os dados da categoria relacionada
        const dish = await prisma.dishes.findUnique({
            where: {
                id: parseInt(id)
            },
            include: {
                categories: true
            }
        });

        // se o prato não for encontrado, retorna status 404
        if (!dish) {
            return res.status(404).json({ error: 'Prato não encontrado' });
        }

        // retorna o prato encontrado
        res.status(200).json(dish);
    } catch (error) {
        // em caso de erro, loga no console e retorna status 500
        console.error('Erro ao buscar prato por ID:', error);
        res.status(500).json({ error: 'Erro ao buscar prato' });
    }
    };
`


3. POST /dishes

*Objetivo:* Criar um novo prato.

Essa requisição adiciona um novo prato ao banco de dados. O corpo da requisição deve conter nome, descrição, preço e categoria. Ideal para formulários de cadastro de pratos no painel do restaurante.


    curl -X POST http://localhost:3000/dishes \
    -H "Content-Type: application/json" \
    -d '{
    "name": "Feijoada",
    "description": "Prato típico brasileiro com feijão preto",
    "price": 25.50,
    "categoryId": 1,
    "restaurantId": 1,
    }'


*Routes:*

    router.post('/', createDish);


*Controller:*

    export const createDish = async (req, res) => {
    // extrai os dados enviados no corpo da requisição
    const { name, description, price, categoryId } = req.body;

    try {
        // cria um novo registro na tabela "dishes"
        const newDish = await prisma.dishes.create({
            data: {
                name,
                description,
                price: parseFloat(price), 
                category_id: parseInt(categoryId), 
            }
        });
        // Retorna o prato criado com status 201 (criado)
        res.status(201).json(newDish);
    } catch (error) {
        // em caso de erro, loga no console e retorna status 500
        console.error('Erro ao criar prato:', error);
        res.status(500).json({ error: 'Erro ao criar produto' });
    }
    };


4. PUT/dishes/:id

*Objetivo:* Atualizar um prato existente.

Essa requisição altera os dados de um prato previamente cadastrado, identificado pelo ID na URL. É usada em páginas de edição de prato no sistema de administração.

    curl -X PUT http://localhost:3000/dishes/1 \
    -H "Content-Type: application/json" \
    -d '{
    "name": "Feijoada Completa",
    "description": "Feijão preto com carnes, arroz, farofa e couve",
    "price": 29.90,
    "categoryId": 1
     }'

*Routes:* 

    router.put('/:id', editDish);


*Controller:*

    export const editDish = async (req, res) => {
    // extrai o ID da rota e os dados do corpo da requisição
    const { id } = req.params; 
    const { name, description, price, categoryId } = req.body;

    try {
        // Atualiza o prato com os novos dados
        const modifyDish = await prisma.dishes.update({
            where: {
                id: Number(id) // converte o ID para número
            },
            data: {
                name,
                description,
                price: parseFloat(price), 
                category_id: parseInt(categoryId) 
            }
        });

        // retorna o prato atualizado
        res.status(200).json(modifyDish);
    } catch (error) {
        // em caso de erro, loga no console e retorna status 500
        console.error('Erro ao editar o prato:', error);
        res.status(500).json({ error: 'Erro ao editar o prato' });
    }
    };
 

5. GET /dishes/categories

*Objetivo:* Listar todas as categorias de pratos.

Essa requisição retorna todas as categorias disponíveis no sistema. Normalmente é usada para preencher dropdowns ou filtros de categorias no formulário de cadastro/edição de pratos.

    curl http://localhost:3000/dishes/categories

*Routes:* 
    
    router.get('/categories', getCategories);


*Controller:*

    export const getCategories = async (req, res) => {
    try {
        // busca todas as categorias na tabela "categories"
        const categories = await prisma.categories.findMany();
        // retorna as categorias em formato JSON
        res.json(categories);
    } catch (error) {
        // em caso de erro, retorna status 500 com mensagem de erro
        res.status(500).json({ error: 'Erro ao buscar categorias' });
    }
    }; 
