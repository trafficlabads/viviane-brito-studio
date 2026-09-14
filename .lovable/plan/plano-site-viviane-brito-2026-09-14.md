# Plano — Site Viviane Brito

## Objetivo
Construir uma versão visual e funcional fiel ao site Harmonise, reimplementada de forma independente para Viviane Brito, preservando sua composição editorial, navegação fluida, animações de entrada, transições, ritmo de rolagem e comportamento responsivo. O conteúdo, a marca, as cores e as imagens serão próprios.

## Estrutura pública
- **Home longa** com o conteúdo aprovado do documento, nesta ordem:
  1. Abertura com a frase “Toda pessoa carrega uma história que merece ser compreendida” e dois botões.
  2. Boas-vindas.
  3. “Como podemos caminhar juntos”, mantendo a ordem Grupos, Pessoas e Empresas.
  4. “Quem é Viviane Brito?”.
  5. “Minha forma de trabalhar”, com os três movimentos.
  6. Destaque do podcast “Alma e Caminhos”.
  7. Depoimentos não clínicos, preparados como campos pendentes.
  8. Contato final com WhatsApp e formulário.
- **Sobre** em página própria, seguindo a linguagem visual e a leitura editorial da referência.
- **Artigos** com listagem, filtros por categoria e páginas individuais de leitura.
- **Podcasts** com uma seleção na home, página “Ver todos” inspirada na composição da página Música do projeto indicado e página individual por episódio.
- Cabeçalho flutuante, menu móvel, rodapé, navegação entre páginas e estados de página não encontrada.

## Identidade visual e imagens
- Aplicar a paleta enviada: roxo `#603E72`, lilás `#D4B4D7` e branco, com contrastes complementares discretos para leitura.
- Usar **Actioness** nos títulos e **Josefin Sans** nos textos, respeitando alternativas compatíveis caso o arquivo/licença da fonte principal não esteja disponível.
- Usar a marca roxa enviada no cabeçalho, rodapé e ícone do navegador.
- Gerar uma coleção coerente de fotografias autorais, naturais e contemplativas, com presença humana, desenvolvimento, escuta e caminhos; nenhuma imagem do site de referência será copiada.
- Recriar os efeitos observados: entradas suaves ao rolar, sobreposições, mudanças sutis de escala, contadores quando fizerem sentido e transições de página, respeitando preferência por movimento reduzido.

## Artigos
- Categorias iniciais obrigatórias: **Artigo** e **Texto reflexivo**.
- Filtro público por categoria, cards editoriais e página individual com título, capa, data, categoria e conteúdo formatado.
- No painel: criar, editar, publicar/despublicar e excluir artigos; criar, editar e excluir categorias.
- Impedir a exclusão de categorias que ainda estejam vinculadas a artigos sem antes realocar o conteúdo.

## Podcast e player imersivo
- No painel: criar, editar, publicar/despublicar e excluir episódios, com título, descrição, capa, data, link do YouTube e links opcionais para Spotify, SoundCloud, YouTube Music, Amazon Music e Apple Music.
- Mostrar somente as marcas das plataformas que tiverem link preenchido.
- Usar o YouTube vinculado como fonte de reprodução incorporada.
- Ao tocar, abrir um player em tela cheia com capa, título, controles essenciais, progresso e uma cena relaxante animada; incluir fechar, pausar/continuar e navegação acessível por teclado.
- A página de podcasts adotará a força visual da página Música indicada — capas em destaque, grade editorial e transições — adaptada integralmente à marca Viviane Brito.

## Painel privado e conteúdo
- Ativar o Lovable Cloud para banco de dados, armazenamento de capas/imagens e acesso administrativo.
- Criar um único acesso administrativo, sem cadastro público e sem tabela de perfil.
- O identificador visual será **admin**. A credencial inicial informada será configurada de forma segura no serviço de autenticação, nunca escrita no código; por ser muito fraca, o painel indicará a troca após o primeiro acesso.
- Proteger tanto as telas quanto todas as operações de criar, editar e excluir no servidor.
- Manter CRP, WhatsApp, depoimentos, contatos e episódios como campos pendentes administráveis, sem inventar informações profissionais.

## Conteúdo e dados
- Estruturar dados para artigos, categorias e episódios, com status de publicação, datas, endereços amigáveis e metadados de busca/compartilhamento.
- Incluir as categorias iniciais no banco desde a criação.
- Preparar formulários com validação, mensagens de sucesso/erro e confirmações antes de exclusões.
- Fazer o formulário de contato funcionar e armazenar mensagens para consulta administrativa, sem agendamento automático.

## Qualidade e validação
- Garantir títulos e descrições próprios em cada página, um título principal por página, textos alternativos e navegação semântica.
- Validar desktop e celular, menus, filtros, formulários, reprodução, tela cheia, links externos e operações administrativas.
- Conferir contraste, legibilidade, foco por teclado, redução de movimento, carregamento das imagens e ausência de erros antes da entrega.

## Limites claros
- O código-fonte e os recursos proprietários do site Harmonise não serão extraídos ou copiados; será feita uma reprodução independente e fiel da experiência visual e funcional.
- Dados profissionais ainda não fornecidos permanecerão explicitamente pendentes no painel e não serão inventados.
