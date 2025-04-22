As requisições foram feitas através do Prisma em conexão com uma banco de dados local MySql

Inicialmente puxando e conectando o prisma ao banco de dados utilizando o arquivo .env com o /prisma/schema.prisma

iniciado a conexão então é atribuido a páginas como /api/nome_tabela a tabela puxada com o prisma usando findMany() assim:
`app.get('/api/reviews', async (req, res) => {
      const reviews = await prisma.reviews.findMany();
      res.send(reviews)
});
`
Isso deixa como parâmetro na url http://localhost:3000/api/reviews a tabela em formato de array com object dentro ou melhor, conforme são as API's.

No meu index.html na view, foi puxado do reviews.js um GET da url. O parâmetro de id do restaurante será passado pela url.
o parâmetro é buscado com:
`    const params = new URLSearchParams(document.location.search)
    let restaurante = params.get("restaurant");`

Com o parâmetro basta procurar com fetch usando o js através da Url e usar um método json().
`    const reviews = await fetch("http://localhost:3000/api/reviews");
    const resposta = await reviews.json();`

Apartir disso a variável resposta terá todas as tabelas e valores dos campos das tabelas em array com cada insert sendo um objeto possível de buscar os valores isso foi feito com todas as tabelas.

    const reviews = await fetch("http://localhost:3000/api/reviews");
    const restaurantinho = await fetch("http://localhost:3000/api/restaurants");
    const pessoa = await fetch("http://localhost:3000/api/users");
    const pedido = await fetch("http://localhost:3000/api/orders");
    const itemsOrdemF = await fetch("http://localhost:3000/api/order_items");
    const dishesF = await fetch("http://localhost:3000/api/dishes");

    const mano = await pessoa.json();
    const pedidos = await pedido.json(); 
    const resposta = await reviews.json();
    const itemsOrdem = await itemsOrdemF.json();
    const dishes = await dishesF.json();
    const lojinha = await restaurantinho.json();
    `
