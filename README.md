## Credit Engine
## 1. Pré-requisitos

- **Node.js \>= 18**
- **npm ou yarn**

## 2. Instalar dependências
### 2.1 Backend (`backend/`)

```bash
cd backend
yarn install
```

### 2.2 Frontend (`frontend/`)

```bash
cd frontend
yarn install
```

---

## 3. Executar o Backend

No diretório `backend/`:

1. **Configurar variáveis de ambiente**:

   No `.env`, defina:

   ```env
   OPENWEATHER_API_KEY=your_key_here
   PORT=3000
   ```

2. **Executar em modo desenvolvimento**:

   ```bash
   yarn start:dev
   ```

   - API: `http://localhost:3000`
   - GraphQL playground: `http://localhost:3000/graphql`


## 4. Executar o Frontend

No diretório `frontend/`:

1. **Inicializar o service worker do MSW** (apenas na primeira vez):

   ```bash
   cd frontend
   npx msw init public/ --save
   ```

2. **Configurar variáveis de ambiente**:

   No `.env`, defina:

   ```env
   VITE_API_URL=http://localhost:3000
   ```

3. **Rodar em modo desenvolvimento**:

   ```bash
   yarn dev
   ```

   Frontend: `http://localhost:5173`.


## 5. Rodar os testes (Backend e Frontend)

### 5.1 Backend

Executar nos respectivos diretórios:

```bash
# Executar todos os testes
yarn test

# Modo watch
yarn test:watch
```
