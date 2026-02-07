# Frontend da Plataforma Classroom

Este repositório contém o código frontend da plataforma Classroom, uma aplicação web construída com React e o framework Refine. Ele oferece uma interface completa para gerenciamento de recursos educacionais, incluindo autenticação de usuários, listagem e criação de turmas, disciplinas, departamentos e gerenciamento de matrículas. A aplicação suporta temas claro/escuro e utiliza componentes de UI interativos para uma experiência de usuário rica.

## Tecnologias Utilizadas

O projeto utiliza um conjunto moderno de tecnologias para o desenvolvimento frontend:

*   **React 19.1.0**: Biblioteca JavaScript para construção de interfaces de usuário.
*   **Refine**: Framework para construção de aplicações web, com módulos para:
    *   `@refinedev/core`: Funcionalidades principais do Refine.
    *   `@refinedev/react-router`: Integração com roteamento.
    *   `@refinedev/react-hook-form`: Integração com formulários.
    *   `@refinedev/react-table`: Gerenciamento de tabelas de dados.
    *   `@refinedev/devtools`: Ferramentas de desenvolvimento.
    *   `@refinedev/kbar`: Barra de comandos.
    *   `@refinedev/rest`: Provedor de dados REST.
*   **Tailwind CSS**: Framework CSS utilitário para estilização rápida e responsiva.
*   **tw-animate-css**: Biblioteca para animações CSS.
*   **Lucide-React**: Coleção de ícones.
*   **Zod**: Biblioteca para validação de esquemas.
*   **React Hook Form**: Biblioteca para gerenciamento de formulários.
*   **Cloudinary**: Integração para upload e gerenciamento de imagens.
    *   `@cloudinary/react`
    *   `@cloudinary/url-gen`
*   **Better-Auth**: Biblioteca para autenticação de usuários.
*   **Sonner**: Biblioteca para notificações de toast.
*   **Componentes de UI**: Baseados em Radix UI (comumente referidos como Shadcn/ui), incluindo:
    *   Accordion, AlertDialog, Alert, Avatar, Badge, Breadcrumb, Button, Calendar, Card, Carousel, Chart, Checkbox, Collapsible, Command, ContextMenu, Dialog, Drawer, DropdownMenu, Form, HoverCard, Input, InputOTP, Label, Menubar, NavigationMenu, Pagination, Popover, Progress, RadioGroup, Resizable, ScrollArea, Select, Separator, Sheet, Sidebar, Skeleton, Slider, Switch, Table, Tabs, Textarea, Toggle, ToggleGroup, Tooltip.
*   **react-day-picker**: Componente de calendário.
*   **recharts**: Biblioteca para gráficos.
*   **embla-carousel-react**: Componente de carrossel.
*   **input-otp**: Componente para entrada de código OTP.
*   **react-resizable-panels**: Componentes para painéis redimensionáveis.
*   **vaul**: Componente de drawer.

## Funcionalidades

A aplicação Classroom Frontend oferece as seguintes funcionalidades principais:

*   **Autenticação de Usuários**:
    *   **Login**: Acesso seguro à plataforma.
    *   **Registro**: Criação de novas contas com seleção de papel (Estudante, Professor).
    *   **Recuperação de Senha**: Funcionalidade para redefinir senhas esquecidas.
*   **Dashboard**:
    *   Visão geral com estatísticas de usuários por papel.
    *   Gráficos de disciplinas por departamento e turmas por disciplina.
    *   Lista das turmas mais recentes.
*   **Gerenciamento de Usuários (Faculty)**:
    *   Listagem e visualização de detalhes de usuários, incluindo nome, email, papel e imagem de perfil.
*   **Gerenciamento de Disciplinas (Subjects)**:
    *   Listagem, criação e visualização de detalhes de disciplinas (código, nome, descrição, departamento associado).
*   **Gerenciamento de Departamentos (Departments)**:
    *   Listagem, criação e visualização de detalhes de departamentos (código, nome, descrição, total de disciplinas, turmas e alunos matriculados).
*   **Gerenciamento de Turmas (Classes)**:
    *   Listagem, criação e visualização de detalhes de turmas (nome, descrição, status, capacidade, professor, disciplina, URL do banner, horários e alunos matriculados).
*   **Matrículas (Enrollments)**:
    *   Matrícula em turmas existentes (via seleção ou código de convite).
    *   Página de confirmação de matrícula.
*   **Upload de Imagens**:
    *   Integração com Cloudinary para upload de banners de turmas e imagens de perfil de usuário.
*   **Interface do Usuário**:
    *   Sistema de rotas robusto com Refine e React Router.
    *   Layout responsivo com barra lateral e cabeçalho.
    *   Suporte a temas claro e escuro.
    *   Notificações interativas (com opção de desfazer).
    *   Tabelas de dados com paginação, filtros e ordenação.
    *   Breadcrumbs para facilitar a navegação.
    *   Formulários com validação de esquema (Zod).

## Configuração e Instalação

Para configurar e executar o projeto localmente, siga os passos abaixo:

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/LucasLira-dev/classroom-frontend.git
    cd classroom-frontend
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    # ou
    yarn install
    ```

3.  **Configure as variáveis de ambiente:**
    Crie um arquivo `.env` na raiz do projeto e adicione as seguintes variáveis. Os valores devem ser obtidos do seu backend e da configuração do Cloudinary:

    ```env
    VITE_CLOUDINARY_UPLOAD_URL=sua_url_de_upload_cloudinary
    VITE_CLOUDINARY_CLOUD_NAME=seu_cloud_name_cloudinary
    VITE_BACKEND_BASE_URL=sua_url_base_do_backend
    VITE_CLOUDINARY_UPLOAD_PRESET=seu_upload_preset_cloudinary
    ```

    *   `VITE_CLOUDINARY_UPLOAD_URL`: URL para upload no Cloudinary.
    *   `VITE_CLOUDINARY_CLOUD_NAME`: Nome da sua conta Cloudinary.
    *   `VITE_BACKEND_BASE_URL`: URL base da API do backend.
    *   `VITE_CLOUDINARY_UPLOAD_PRESET`: Preset de upload configurado no Cloudinary.

4.  **Inicie o servidor de desenvolvimento:**
    ```bash
    npm run dev
    # ou
    yarn dev
    ```
    A aplicação será iniciada e estará acessível em `http://localhost:5173` (ou outra porta disponível).
