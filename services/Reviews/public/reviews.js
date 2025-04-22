async function getReviews() {

    const params = new URLSearchParams(document.location.search)
    let restaurante = params.get("restaurant");

    const reviews = await fetch("http://localhost:3000/api/reviews");
    const restaurantinho = await fetch("http://localhost:3000/api/restaurants");
    const pessoa = await fetch("http://localhost:3000/api/users");
    const pedido = await fetch("http://localhost:3000/api/orders");
    const itemsOrdemF = await fetch("http://localhost:3000/api/order_items");
    const dishesF = await fetch("http://localhost:3000/api/dishes");

    const totalAvaliacoes = document.getElementById("avaliadores");
    const comentariosTotal = document.getElementById("comentarios");
    const ratingMedio = document.getElementById("ratingMedio");
    const estrelasMedia = document.getElementById("estrelasMedia")

    const mano = await pessoa.json();
    const pedidos = await pedido.json(); 
    const resposta = await reviews.json();
    const itemsOrdem = await itemsOrdemF.json();
    const dishes = await dishesF.json();
    const lojinha = await restaurantinho.json();

    let comentarioExiste = false;

    let total = 0;
    let comentarios = 0;
    let Qtrating = 0;
    let ratingM = 0


    if (resposta) {
        resposta.forEach( (item, index) => { // Percorre o array de reviews
            if (item.restaurant_id == restaurante) { // verifica enquanto percorre se o id de restaurante na corrida é igual o passado ao url

                if (item.comment) {
                    const nomeDaLoja = document.getElementById('nomeLoja');
                    const enderecoLoja = document.getElementById('endeJoja');

                    comentarioExiste = true;
    
                    lojinha.forEach( loja => {
                        if (restaurante == loja.id) {
                            nomeDaLoja.textContent = loja.name;
                            enderecoLoja.textContent = loja.address
                        }
                    });
    
    
                    const idCara = item.user_id; // Pega o id do usuário equivalente ao restautante da página na parte dos reviews
                    let nomeSujeito;
                    Qtrating++;
                    ratingM += item.rating;
    
                    mano.forEach( stats => {
                        if (idCara == stats.id) {
                            nomeSujeito = stats.name;
                        } // Pega o id apartir da tabela de usuário se o id do usuário das reviews for igual ao da lista servindo apenas para pegar as informações dele
                    });
    
                    const rating = item.rating;
                    let estrelas = '';
    
                    for (i=0; i < rating; i++) {
                        estrelas += '<img src="/imgs/estrela.png" alt="">';
                        

                    };
    
                    let pedidos = '';
                    
                    itemsOrdem.forEach( comida => {
                        if (comida.order_id == item.order_id) {
                            const dishe = comida.dish_id;
                            dishes.forEach( ixi => {
                                if (ixi.id == dishe) {
                                    pedidos += `<p>${comida.quantity} ${ixi.name}</p>`;
                                }
                            });
                        }
                    });
    
                    let comentario = item.comment;
    
                    const artigo2 = document.getElementById('article2');
                    
                    artigo2.innerHTML += `
                        <div class="card" id="${index}">
                            <div class="textoEstrela">
                                <h1 class="nomePessoa">${nomeSujeito}</h1>
                                <div class="estrelasComn">
                                    ${estrelas}
                                </div>
                            </div>
                            <div class="prato"><p class="pedidos">Pedidos:</p>${pedidos}</div>
                            <div class="comentarios">
                                <p>${comentario}</p>
                            </div>
                        </div>
                        <hr>
                    `
                    comentarios++
                }
                total++
            }
        })

    } else {
        console.log("Não existe não!");
    }

    if (!comentarioExiste) {
        const artigo2 = document.getElementById('article2');

        artigo2.innerHTML = `<p>Não há comentários</p>`;
    }


    let mediaTotal = ratingM/Qtrating;
    let numeroVerdadeiro = 0;

    if (Number.isInteger(mediaTotal)) {
        numeroVerdadeiro = Math.round(mediaTotal)
    } else {
        numeroVerdadeiro = mediaTotal.toFixed(2)
    }
    let totalEstrelas = "";

    totalAvaliacoes.innerHTML = "Total de avaliadores: " + total;
    comentariosTotal.innerHTML = "Total de comentários: " + comentarios;
    ratingMedio.innerHTML = `${numeroVerdadeiro}/5`;
    
    for(i = 1; i <= mediaTotal; i++) {totalEstrelas += `<img src="/imgs/estrela.png" alt="">`}
    estrelasMedia.innerHTML = totalEstrelas;

    console.log(totalEstrelas);


    // <img src="/imgs/estrela.png" alt="">

  }

  /*
    <div class="card">
        <div class="textoEstrela">
            <h1 class="nomePessoa">Nome da pessoa</h1>
            <div class="estrelasComn">
                <img src="/imgs/estrela.png" alt="">
                <img src="/imgs/estrela.png" alt="">
                <img src="/imgs/estrela.png" alt="">
            </div>
        </div>
        <div class="prato"><p>quantidade e pedido</p></div>
        <div class="comentarios">
            <p>Este é um exemplo de comentário que foi feito por uma pessoa aleatória que avaliou Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempora odit distinctio maxime dolore, corporis aliquid officiis sint nam optio nulla possimus, laboriosam inventore, qui facere eligendi. Nisi quas harum animi.</p>
        </div>
    </div>
  */