// setup canvas

// Esse script obtém uma referência ao elemento <canvas> e, em seguida, chama o método getContext() para nos fornecer um contexto no qual podemos começar a desenhar. A variável resultante (ctx) é o objeto que representa diretamente a área de desenho da tela e nos permite desenhar formas

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');


// definimos variáveis chamadas width e height, e a largura e altura do elemento canvas (representado pelas propriedades canvas.width e canvas.height) para igualar a largura e a altura da viewport do navegador (a área em que a página da Web aparece — isso pode ser obtido das propriedades Window.innerWidth e Window.innerHeight ).

const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;

// function to generate random number

//Essa função usa dois números como argumentos e retorna um número aleatório no intervalo entre os dois.
function random(min, max) {
    const num = Math.floor(Math.random() * (max - min + 1)) + min;
    return num;
}

//Como todas essas bolas se comportarão da mesma maneira, faz sentido representá-las com um objeto. Vamos começar adicionando o construtor a seguir.
function Ball(x, y, velX, velY, color, size) {
    //coordenadas horizontal e vertical onde a bola vai começar na tela.
    //Isso pode variar entre 0 (canto superior esquerdo) à largura e altura da janela de visualização do navegador (canto inferior direito).
    this.x = x;
    this.y = y;
    //cada bola recebe uma velocidade horizontal e vertical
    this.velX = velX;
    this.velY = velY;
    //cada bola recebe uma cor
    this.color = color;
    // cada bola recebe um tamanho — este será o seu raio, em pixels.
    this.size = size;
}
//Usando esta função, podemos dizer a nossa bola para desenhar-se na tela, chamando uma série de membros do contexto de tela 2D que definimos anteriormente (ctx).
Ball.prototype.draw = function() {
    //declarar que queremos desenhar uma forma no papel.
    ctx.beginPath();
    //definir a cor que queremos que a forma seja 
    ctx.fillStyle = this.color;
    //traçar uma forma de arco no papel
    //A posição x e y do centro do arco
    //O raio do nosso arco
    //número inicial e final de graus em volta do círculo em que o arco é desenhado entre eles. Aqui nós especificamos 0 graus e 2 * PI, que é o equivalente a 360 graus em radianos
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    //terminar de desenhar o caminho que começamos com beginPath(), e preencher a área que ocupa com a cor que especificamos anteriormente em fillStyle.
    ctx.fill();
}

//para começar a mover a bola, precisamos de uma função de atualização de algum tipo.
Ball.prototype.update = function() {
    //verificam se a bola atingiu a borda da tela. Se tiver, invertemos a polaridade da velocidade relevante para fazer a bola viajar na direção oposta.

    //Se a coordenada x é maior que a largura da tela (a bola está saindo da borda direita).
    if ((this.x + this.size) >= width) {
        this.velX = -(this.velX);
    }
    //Se a coordenada x é menor que 0 (a bola está saindo da borda esquerda).
    if ((this.x - this.size) <= 0) {
        this.velX = -(this.velX);
    }
    //Se a coordenada y é maior que a altura da tela (a bola está saindo da borda inferior).
    if ((this.y + this.size) >= height) {
        this.velY = -(this.velY);
    }
    //Se a coordenada y é menor que 0 (a bola está saindo da borda superior).
    if ((this.y - this.size) <= 0) {
        this.velY = -(this.velY);
    }

    //adicionam o valor velX à coordenada x, e o valor velY à coordenada y —  a bola é efitivamente movida cada vez que este método é chamado.
    this.x += this.velX;
    this.y += this.velY;
}

Ball.prototype.collisionDetect = function() {
    //Para cada bola, precisamos checar todas as outras bolas para ver se ela colidiu com a bola atual. Para fazer isso, abrimos outro loop for para percorrer todas as bolas no array balls[].
    for (let j = 0; j < balls.length; j++) {
        //verificar se a bola atual em loop é a mesma bola que estamos verificando no momento. Não queremos verificar se uma bola colidiu consigo mesma! Para fazer isso, verificamos se a bola atual (ou seja, a bola cujo método collisionDetect está sendo invocado) é a mesma que a bola de loop (ou seja, a bola que está sendo referenciada pela iteração atual do loop for no collisionDetect método). Nós então usamos ! para negar a verificação, para que o código dentro da instrução if seja executado apenas se eles não forem iguais.
        if (!(this === balls[j])) {
            //Em seguida, usamos um algoritmo comum para verificar a colisão de dois círculos. Estamos basicamente verificando se alguma das áreas dos dois círculos se sobrepõe. Isso é explicado ainda mais na 2D collision detection.
            const dx = this.x - balls[j].x;
            const dy = this.y - balls[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            //Se uma colisão for detectada, o código dentro da instrução if interna será executado. Neste caso, estamos apenas definindo a propriedade color de ambos os círculos para uma nova cor aleatória.
            if (distance < this.size + balls[j].size) {
                balls[j].color = this.color = 'rgb(' + random(0, 255) + ',' + random(0, 255) + ',' + random(0, 255) + ')';
            }
        }
    }
}

//precisamos de um lugar para armazenar todas as nossas bolas. O array a seguir fará esse trabalho
let balls = [];


function loop() {
    //Define a cor de preenchimento da tela como preto semitransparente
    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
    //desenha um retângulo com a cor em toda a largura e altura da tela, usando fillRect()
    ctx.fillRect(0, 0, width, height);

    //Cria uma nova instância de nossa  Ball() usando valores aleatórios gerados com a nossa função  random() então push()para o final de nosso array de bolas, mas somente enquanto o número de bolas no array é menor que 25
    while (balls.length < 25) {
        let size = random(10, 20);
        let ball = new Ball(
            // ball position always drawn at least one ball width
            // away from the edge of the canvas, to avoid drawing errors
            random(0 + size, width - size),
            random(0 + size, height - size),
            random(-7, 7),
            random(-7, 7),
            'rgb(' + random(0, 255) + ',' + random(0, 255) + ',' + random(0, 255) + ')',
            size
        );
        balls.push(ball);
    }


    //Faz um loop em todas as balls no array de bolas e executa a função draw() e update() de cada bola para desenhar cada uma delas na tela, depois faz as atualizações necessárias para a posição e a velocidade no tempo para o próximo quadro.
    //executa a função collisionDetect()
    for (let i = 0; i < balls.length; i++) {
        balls[i].draw();
        balls[i].update();
        balls[i].collisionDetect();
    }


    //Executa a função novamente usando o método requestAnimationFrame() — quando esse método é executado constantemente e passa o mesmo nome de função, ele executará essa função um número definido de vezes por segundo para criar uma animação suave. Isso geralmente é feito de forma recursiva — o que significa que a função está chamando a si mesma toda vez que é executada, portanto, ela será executada repetidas vezes.
    requestAnimationFrame(loop);
}

//precisamos chamar a função uma vez para iniciar a animação.
loop();