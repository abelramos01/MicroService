Fiz as requisições em um banco MYSQL utilizando o prisma como comunicador, armazenando a tabela necessária no endpoint "/api/orders", na qual é necessária apenas chamar um fetch() para obter os dados armazenados. Não consegui concluir o front end nem as conexões com os outros serviços, mas trabalhando com valores hipotéticos a seguinte requisições obteria todos os pedidos armazenados no banco:
`
fetch('/api/orders')
  .then(response => {
    if (!response.ok) {
      throw new Error('Erro ao buscar os pedidos');
    }
    return response.json();
  })
  .then(data => {
    console.log('Pedidos recebidos:', data);
  })
  .catch(error => {
    console.error('Erro ao buscar pedidos:', error);
  });

`
