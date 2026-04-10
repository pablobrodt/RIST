# Changelog

Todas as mudanças notáveis para este projeto serão documentadas neste arquivo.

O formato baseia-se em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Versionamento Semântico](https://semver.org/lang/pt-BR/).

## [0.0.2] - 10/04/2026

### Adicionado
- **Sistema de Temas Dinâmico e Customizável**: Toda a interface do jogo (Setup, Apresentador, Convidado e Resultado) agora suporta mudança de cor nativa e reativa através de variáveis CSS.
- **Painel de Configuração de Temas**: Inserida uma nova interface interativa acessível pela tela inicial contendo 34 *Color Pickers* individuais para cada elemento do sistema.
- **Importação e Exportação de Temas**: Lógica completa recém-criada permitindo que o usuário pinte uma paleta e a salve localmente em um `.json` seguro pronto para uso posterior.
- **Controle Fino de Componentes**: Ajustado para que as caixas de input (texto/placeholder) e o título da Tela de Espera tivessem independência de cor separada da "Cor de Destaque" original.
- **Marcador de Versão**: Inserida a visibilidade sutil no canto da tela inicial que é importada direto do `package.json`.

## [0.0.1] - 10/04/2026

### Adicionado
- **Internacionalização (i18n)**: Implementado um sistema robusto de tradução usando dicionários JSON, atualmente com suporte total para Português do Brasil (pt-BR) e Inglês (en-US), além de um seletor de idiomas na tela de Configuração do Jogo.

## [0.0.0] - 09/04/2026

### Adicionado
- **Sincronização em Tempo Real**: Implementada lógica usando `BroadcastChannel` e React Context para sincronizar perfeitamente o estado do jogo entre a aba do Apresentador e do Convidado.
- **Tela de Configuração (SetupScreen)**: Adicionada uma página de configuração inicial para definir nomes dos participantes e carregar perguntas dinamicamente através de um upload de arquivo CSV.
- **Painel do Apresentador (Host Dashboard)**: Criado um painel de controle protegido para o Apresentador gerenciar o fluxo do jogo, incluindo confirmação de respostas, avanço de etapa e uso de poderes (Dica 50:50).
- **Visão do Convidado (Guest View)**: Desenvolvido um visual limpo e otimizado para transmissão (broadcasting), contando com indicadores de "Ao Vivo" e reflexo das escolhas feitas.
- **Tela de Resultados (Result Screen)**: Adicionada uma tabela de fim de jogo com todos os resultados compilados.
- **Configuração para GitHub Pages**: Estruturou-se a saída de compilação da aplicação e uso de `HashRouter` para garantir implantação estática sem falhas.
