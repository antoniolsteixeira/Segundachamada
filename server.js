const express = require('express');
const { response } = require('express');
const servidor = express();



const funcionarios = [
    {matricula: 1, nome :'João', funcao: 'Analista', salario: 1500},
    {matricula: 2, nome :'Maria', funcao: 'DBA', salario: 5000}
    ]

function calcularDesconto() {
    for (let i = 0; i < funcionarios.length; i++ ){
        if(funcionarios [i].salario <= 1.045) {
            funcionarios[i].inss = funcionarios[i].salario * 0.075
        }else if (funcionarios[i].salario >= 1045.00 && funcionarios[i].salario <= 2089.69){
            funcionarios[i].inss = funcionarios[i].salario * (9 /100)
        }else if (funcionarios[i].salario >= 2089.61 && funcionarios[i].salario <= 3134.40){
            funcionarios[i].inss = funcionarios[i].salario * (12 /100)
        }else if (funcionarios[i].salario >= 3134.41 && funcionarios[i].salario <= 6101.06){
            funcionarios[i].inss = funcionarios[i].salario * ( 14 /100)
            

        }else if(funcionarios[i].salario > 6101.06){
            funcionarios[i].inss = funcionarios[i].salario - 650
        }
        funcionarios[i].planodesaude = 150
        funcionarios[i].valetransporte = funcionarios[i].salario * (2 /100)
        funcionarios[i].fgts = funcionarios[i].salario * (8 /100)
        funcionarios[i].alimentacao = funcionarios[i].salario * (1 /100)

        if(funcionarios[i].salario < 1903.99){
            funcionarios[i].irf = 0 
         } else if (funcionarios[i].salario >= 1903.99 && funcionarios[i].salario <= 2826.65){
             funcionarios[i].irf = (funcionarios[i].salario * (7.5 /100)) - 142.80
         } else if (funcionarios[i].salario >= 2826.66 && funcionarios[i].salario <= 3751.05){
            funcionarios[i].irf = (funcionarios[i].salario * (15 /100)) - 354.80
        }else if (funcionarios[i].salario >= 3751.06 && funcionarios[i].salario <= 4664.68){
            funcionarios[i].irf = (funcionarios[i].salario * (22.5 /100)) - 636.13
        }else if (funcionarios[i].salario >= 4664.69){
            funcionarios[i].irf = (funcionarios[i].salario * (27.5 /100)) - 869.36  

        }
          funcionarios[i].salarioliquido = funcionarios[i].salario - funcionarios[i].planodesaude -funcionarios[i].valetransporte -funcionarios[i].alimentacao -funcionarios[i].irf
    }

}

function checarMatricula(request, response, next) {
    const matricula = request.params.matricula
    const funcionarioMatricula = funcionarios.filter( funcionario => funcionario.matricula === Number(matricula))
    if(funcionarioMatricula.length === 0) {
      return response.status(400).json({ erro: 'Não existe Funcionário com esta matricula.' })
    }
    return next()
  }
  function checarCampos(request, response, next) {
    const { matricula, nome, funcao, salario } = request.body;
    if((matricula === undefined || (matricula === '') || (nome === undefined || nome === '') || (funcao === undefined || funcao === '' ) || (salario === undefined  || salario === ''))) {
      return response.status(400).json({ erro: 'O campo matricula ou nome do funcionário ou função ou salário não existe no corpo da requisição.' })
    }
    return next()
  }
  


servidor.use(express.json())
servidor.use((request, response, next) => {
    console.log('Avaliação da segunda chamada de LPW.')
    return next()

})

servidor.get('/funcionarios', (request, response) => {
    calcularDesconto()
    return response.json(funcionarios)

})

servidor.get('/funcionarios/:matricula', checarMatricula,(request, response) => {
    calcularDesconto()
    const matricula = request.params.matricula
    const funcionarioEspecifico = funcionarios.find(funcionario => funcionario.matricula === Number(matricula))
    return response.json(funcionarioEspecifico)
})

servidor.post ('/funcionarios',checarCampos,(request,response) => {
    funcionarios.push(request.body)
    calcularDesconto()
    const ultimoFuncionario = funcionarios[funcionarios.length -1]
    return response.json (ultimoFuncionario)
})

servidor.put('/funcionarios',checarCampos,(request, response)=> {
    const matricula = request.body.matricula
    let indice = 0
    const funcionarioEspecifico = funcionarios.filter( (funcionario, posicao) =>{
        if(funcionario.matricula ===matricula){
            indice = posicao
            return funcionario.matricula === matricula
        }
    })
    if (funcionarioEspecifico.length ===0){
        return response.status(400).json({ erro: 'Não existe Funcionário com esta matricula.' })
    }

    funcionarios[indice] = request.body
    calcularDesconto()
    return response.json(funcionarios[indice])
})
servidor.delete('/funcionarios/:matricula', checarMatricula, (request,response)=> {
    const matricula = request.params.matricula
    const funcionariosEspecifico = funcionarios.filter((funcionario,indice) => {
        if(funcionario.matricula === Number(matricula)){
            funcionarios.splice(indice, 1)
            return funcionario.matricula === Number(matricula)

        }
    })
 return response.json(funcionarios)
})
servidor.listen(3333)