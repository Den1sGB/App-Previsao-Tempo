App de Previsão do Tempo 🌦️

Este é um aplicativo móvel simples desenvolvido em React Native com Expo que exibe a previsão do tempo atual para uma cidade específica. O projeto foi criado como uma atividade prática de consumo de APIs REST.

📱 Funcionalidades

Busca Inteligente: Permite buscar pelo nome da cidade ou "Cidade, Estado" (ex: Maricá, RJ).

Geolocalização: Resolve ambiguidades de cidades com o mesmo nome utilizando a sigla do estado.

Dados em Tempo Real: Exibe temperatura atual, descrição do clima (céu limpo, chuva, etc.), umidade e velocidade do vento.

Ícones Dinâmicos: Mostra o ícone correspondente ao clima atual direto da API.

Tratamento de Erros: Avisa se a cidade não for encontrada ou se houver problemas de conexão.

🛠️ Tecnologias Utilizadas

React Native

Expo

OpenWeatherMap API (para dados meteorológicos e geocoding)

🚀 Como rodar o projeto

Clone este repositório ou baixe o código.

Instale as dependências:

npm install


Inicie o projeto com o Expo:

npx expo start


Escaneie o QR Code com o app Expo Go no seu celular (Android ou iOS) ou rode em um emulador.

⚙️ Configuração

O arquivo principal App.js já contém a lógica de conexão. A chave de API (API Key) está configurada diretamente no código para fins didáticos, mas em projetos reais recomenda-se o uso de variáveis de ambiente (.env).

Desenvolvido como Atividade Prática.
