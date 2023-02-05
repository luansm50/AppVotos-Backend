import { Document } from "mongoose";

export interface RowParameters{
    value: String,
    color?: String,
    size?: String
}

export interface AnaliseRequest {
    anos: String[],
    tiposProposicao: String[]
}


export interface ProposicaoRequest{
    ano: String,
    tipoProposicao: String,
    page: number;
}

export interface ProposicaoResponse {
    id: String,
    uri: String,
    siglaTipo: String,
    codTipo: String,
    numero: String,
    ano: String,
    ementa: String,
    descricaoTipo: String,
    ementaDetalhada: String,
    tema: TemaProposicao
    statusProposicao: StatusProposicao
    votacao: VotacoesResponse
}

export interface StatusProposicao {
    dataHora: String,
    sequencia: String,
    siglaOrgao: String,
    uriUltimoRelator: String,
    regime: String,
    descricaoTramitacao: String,
    codTipoTramitacao: String,
    descricaoSituacao: String,
    codSituacao: String,
    despacho: String,
    ambito: String,
    apreciacao: String
}

export interface TemaProposicao {
    codTema: String,
    tema: String,
    relevancia: String
}

export interface VotacoesResponse{
    id: String, 
    uri: String,
    data: String,
    ano: String,
    mes: String,
    dataHoraRegistro: String,
    siglaOrgao: String,
    uriOrgao: String,
    uriEvento: String,
    proposicaoObjeto: String,
    uriProposicaoObjeto: String,
    descricao: String,
    aprovacao: String,
    votos: VotosResponse[],
    orientacoes: OrientacaoVotos[]
}

export interface VotosResponse {
    tipoVoto: String,
    dataRegistroVoto: String,
    deputado_: DeputadoResponse
}

export interface DeputadoResponse {
    id: String,
    uri: String,
    nome: String,
    siglaPartido: String,
    uriPartido: String,
    siglaUf: String,
    idLegislatura: String,
    urlFoto: String,
    email: String
}

export interface OrientacaoVotosResponse {
    orientacaoVoto: String,
    codTipoLideranca: String,
    siglaPartidoBloco: String,
    codPartidoBloco: String,
    uriPartidoBloco: String
}

const folderPath = `//opt/proposicao/service/shared/analises`;
const trabalho = `${folderPath}/trabalho` 
const gerando = `${folderPath}/gerando` 
const gerado = `${folderPath}/gerado` 
const erro = `${folderPath}/erro` 

const opcoes = {
    folderPath,
    trabalho,
    gerando,
    gerado,
    erro
}

exports.foo = 'foo';