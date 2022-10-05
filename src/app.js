/***********************************************************************************
*   Objetivo: arquivo que contém os EndPoints para o funcionamento da API do projeto
*   Autor: Eduardo Moreira
*   Data de criacao: 15/09/2022
*   Versao: 1.0
***********************************************************************************/

//import da biblioteca do express para criar a API
const express = require('express');

//import da biblioteca do cors para manipular as permissoes do protocolo http
const cors = require('cors');

//import da biblioteca do body-parser para manipular o corpo do protocolo http
const bodyParser = require('body-parser');

//import do arquivo de alunos
const { getCursoAlunos, getDisciplinasAlunos, getAlunosAno, getAlunosStatus } = require('../js/alunos.js');

//import do arquivo de cursos
const { getCursos } = require('../js/cursos.js');

const app = express();

//cria um objeto chamado app que sera especialista nas funcoes do express
app.use((request, response, next) => {

    //permite expecificar quais serao os IPs que podem acessar a API ('*' significa todos)
    response.header('Access-Control-Allow-Origin', '*');

    //permite especificar quais serao os verbos (metodos) que a API ira reconhecer
    response.header('Acess-Controll-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');

    //estabelece que as permissoes acima serao representadas pelo cors
    app.use(cors());

    next();

});

//EndPoint: listagem de cursos
app.get('/.netlify/functions/api/cursos/', cors(), async function(request, response, next) {

    //chama a funcao que vai localizar as informacoes solicitadas
    let curso = getCursos();

    if(curso) {

        response.status(200);
        response.json(curso);

    } else {

        response.status(404);
        response.json('{message : "Nenhum item encontrado"}');

    }

});

//EndPoint: listagem de alunos pelo nome do curso
app.get('/.netlify/functions/api//alunos/', cors(), async function(request, response, next) {

    //recebe a variavel sigla por QueryString (indicada quando precisamos criar filtros)
    let sigla = request.query.sigla;

    //chama a funcao que vai localizar as informacoes solicitadas com base no nome do curso
    let alunos = getCursoAlunos(sigla);

    if(alunos) {

        response.status(200);
        response.json(alunos);

    } else {

        response.status(400);
        response.json('{message : "Nenhum item encontrado"}');

    }

});

//EndPoint: listagem de discplinas pelo numero de matricula do aluno
app.get('/.netlify/functions/api//disciplinas/', cors(), async function(request, response, next) {

    //recebe a variavel nome por QueryString (indicada quando precisamos criar filtros)
    let matricula = request.query.matricula;

    //chama a funcao que vai localizar as informacoes solicitadas com base no nome do aluno
    let disciplinas = getDisciplinasAlunos(matricula);

    if(disciplinas) {

        response.status(200);
        response.json(disciplinas);

    } else {

        response.status(404);
        response.json('{message : "Nenhum item encontrado"}');
    }

});

//EndPoint: listagem de alunos pelo ano de conclusao do curso 
app.get('/.netlify/functions/api//alunosAno/', cors(), async function(request, response, next) {

    //recebe a variavel ano por QueryString (indicada quando precisamos criar filtros)
    let ano = request.query.ano;

    //recebe a variavel curso por QueryString
    let curso = request.query.sigla;

    //chama a funcao que vai localizar as informacoes solicitadas com base no ano
    let alunos = getAlunosAno(ano, curso);

    if(alunos) {

        response.status(200);
        response.json(alunos);

    } else {

        response.status(404);
        response.json('{message : "Nenhum item encontrado"}');

    }

});

//EndPoint: listagem de alunos pelo status de conclusao do curso
app.get('/.netlify/functions/api//alunosStatus/', cors(), async function(request, response, next) {

    //recebe a variavel status por QueryString (indicada quando precisamos criar filros)
    let status = request.query.status;

    //recebe a variavel curso por QueryString
    let curso = request.query.sigla;

    //chama a funcao que vai localizar as informacoes solicitadas com base no status
    let alunos = getAlunosStatus(status, curso);

    if(alunos) {

        response.status(200);
        response.json(alunos);

    } else {

        response.status(404);
        response.json('{message : "Nenhum item encontrado"}')
        
    }

});

//para que o EndPoint possa estar funcionando precisamos obrigatoriamente finalizar com essa function que representa o start da API
app.listen(3030, function(){

    console.log('Servidor aguardando requisições');

});

module.exports = app