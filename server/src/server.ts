import express from 'express';
import routes from './routes';
import cors from 'cors';

const app = express();

app.use(express.json());
app.use(cors());
app.use(routes);

app.listen(3333);

//GET: BUSCAR OU LISTAR UMA INFORMACAO
//POST: CRIAR UMA NOVA INFORMACAO
//PUT: ATUALIZAR UMA INFORMACAO EXISTENTE
//DELETE: DELETAR UMA INFORMACAO EXISTENTE

//Corpo (REQUEST BODY): Dados para criação ou atualização de um registro
//Route Params: Identificar qual recurso eu quero deletar ou atualizar
//Query Params: Paginacao, filtros, ordenacao

//localhost:3333/users