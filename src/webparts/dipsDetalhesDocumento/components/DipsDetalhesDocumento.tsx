import * as React from 'react';
import { IDipsDetalhesDocumentoProps } from './IDipsDetalhesDocumentoProps';

import * as $ from "jquery";
import * as jQuery from "jquery";
import "bootstrap";
import "@pnp/sp/webs";
import "@pnp/sp/folders";
import { Web } from "sp-pnp-js";
import { UrlQueryParameterCollection, Version } from '@microsoft/sp-core-library';
import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";


import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';

require("../../../../node_modules/bootstrap/dist/css/bootstrap.min.css");
require("../../../../css/estilos.css");

var _web;
var _caminho;
var _documentoID;

var _versao;
var _nomeProduto;
var _cliente;
var _SSTJira;
var _codigoIndustrial;
var _status;
var _descricaoPacoteAdicionalSO;
var _responsavelPacoteAdicionalSO;
var _versaoMidiaMatriz;
var _dtdataLiberacaoMidiaMatriz;
var _arquivoInstalacaoMidiaMatriz;
var _responsavelGeracaoMidiaMatriz;
var _arrInstalacaoMidiaMatriz = [];
var _pacoteAdicionalSO;
var _midiaMatriz;
var _sistemaOperacional;
var _outrasInformacoes;
var _arrNomeArquivo = [];
var _arrNomeArquivoAttachmentFiles = [];
var _arrNomeArquivoFolder = [];
var _url;
var _documentoDuplicadoID;
var _grupos;

export interface IShowEmployeeStates {
  itemsListPreStageSoftware: any[]
}

export interface IReactGetItemsState {

  itemsClientes: [
    {
      "ID": any,
      "Title": any,
    }],
  itemsSistemaOperacional: [
    {
      "ID": "",
      "Title": any,
    }],
  itemsPacoteAdicionalSO: [],
  itemsMidiaMatriz: [],
  itemsInstalacaoMidiaMatriz: [],
  itemsEmailElaboracao: [],
  addUsersResponsavelEngenhariaHardware: [],
  itemsListPreStageSoftware: [],
  itemsListSetupBios: [],
  itemsCheckList: [],
  itemsSetupItensModulos: [],
  itemsFluxoAprovacaoDIPS: [],
  itemsHistorico: [],

}

const customFilter = textFilter({
  placeholder: ' ',  // custom the input placeholder
});

const tablecolumnsPreStageSoftware = [
  {
    dataField: "Title",
    text: "Componente",
    headerStyle: { "backgroundColor": "#bee5eb", "width": "100px" },
    classes: 'headerPreStage',
    headerClasses: 'text-center',
    formatter: (rowContent, row) => {
      var valor = row.Title;
      if (valor == "undefined") valor = "";
      return valor;
    }
  },
  {
    dataField: "Modelo",
    text: "Modelo",
    headerStyle: { "backgroundColor": "#bee5eb", "width": "80px" },
    classes: 'headerPreStage',
    headerClasses: 'text-center',
    formatter: (rowContent, row) => {
      var valor = row.Modelo;
      if (valor == "undefined") valor = "";
      return valor;
    }
  },
  {
    dataField: "Fabricante",
    text: "Fabricante",
    headerStyle: { "backgroundColor": "#bee5eb", "width": "90px" },
    classes: 'headerPreStage',
    headerClasses: 'text-center',
    formatter: (rowContent, row) => {
      var valor = row.Fabricante;
      if (valor == "undefined") valor = "";
      return valor;
    }
  },
  {
    dataField: "FW",
    text: "FW",
    headerStyle: { "backgroundColor": "#bee5eb" },
    classes: 'headerPreStage',
    headerClasses: 'text-center',
    formatter: (rowContent, row) => {
      var valor = row.FW;
      if (valor == "undefined") valor = "";
      return valor;
    }
  },
  {
    dataField: "BIOS",
    text: "BIOS",
    headerStyle: { "backgroundColor": "#bee5eb", "width": "48px" },
    classes: 'headerPreStage',
    headerClasses: 'text-center',
    formatter: (rowContent, row) => {
      var valor = row.BIOS;
      if (valor == "undefined") valor = "";
      return valor;
    }
  },
  {
    dataField: "Conexao",
    text: "Conexão",
    headerStyle: { "backgroundColor": "#bee5eb", "width": "70px" },
    classes: 'headerPreStage',
    headerClasses: 'text-center',
    formatter: (rowContent, row) => {
      var valor = row.Conexao;
      if (valor == "undefined") valor = "";
      return valor;
    }
  },
  {
    dataField: "PORT",
    text: "PORT",
    headerStyle: { "backgroundColor": "#bee5eb", "width": "48px"  },
    classes: 'headerPreStage',
    headerClasses: 'text-center',
    formatter: (rowContent, row) => {
      var valor = row.PORT;
      if (valor == "undefined") valor = "";
      return valor;
    }
  },
  {
    dataField: "SLOT",
    text: "SLOT",
    headerStyle: { "backgroundColor": "#bee5eb", "width": "48px"  },
    classes: 'headerPreStage',
    headerClasses: 'text-center',
    formatter: (rowContent, row) => {
      var valor = row.SLOT;
      if (valor == "undefined") valor = "";
      return valor;
    }
  },
  {
    dataField: "ItemObrigatorio",
    text: "Item obrigatório",
    headerStyle: { "backgroundColor": "#bee5eb", "width": "90px" },
    classes: 'headerPreStage',
    headerClasses: 'text-center',
    formatter: (rowContent, row) => {
      var valor = row.ItemObrigatorio;
      if (valor == "undefined") valor = "";
      return valor;
    }
  },
  {
    dataField: "Observacao",
    text: "Observação",
    headerStyle: { "backgroundColor": "#bee5eb" , "width": "90px" },
    classes: 'headerPreStage',
    headerClasses: 'text-center',
    formatter: (rowContent, row) => {

      var valor = row.Observacao;
      if (valor == null) {
        valor = "";
      } else {

        if (valor.includes("undefined")) valor = "";

      }

      return <div dangerouslySetInnerHTML={{ __html: `${valor}` }} />;

    }
  },
  {
    dataField: "Created",
    text: "Data de criação",
    headerStyle: { "backgroundColor": "#bee5eb", "width": "67px" },
    classes: 'headerPreStage text-center',
    headerClasses: 'text-center',
    formatter: (rowContent, row) => {
      var dataCriacao = new Date(row.Created);
      var dtdataCriacao = ("0" + dataCriacao.getDate()).slice(-2) + '/' + ("0" + (dataCriacao.getMonth() + 1)).slice(-2) + '/' + dataCriacao.getFullYear().toString().substr(-2) + '<br/>' + ("0" + (dataCriacao.getHours())).slice(-2) + ':' + ("0" + (dataCriacao.getMinutes())).slice(-2);
      //return dtdataCriacao;
      return <div dangerouslySetInnerHTML={{ __html: `${dtdataCriacao}` }} />;
    }
  },
  {
    dataField: "Author.Title",
    classes: 'headerPreStage',
    text: "Criado por",
    headerStyle: { "backgroundColor": "#bee5eb", "width": "67px"  },
    headerClasses: 'text-center',
  },


]

const tablecolumnsSetupBios = [
  {
    dataField: "Title",
    text: "Itens",
    headerStyle: { backgroundColor: '#bee5eb' },
    headerClasses: 'text-center',
  },
  {
    dataField: "Itens",
    text: "Parâmetros",
    headerStyle: { backgroundColor: '#bee5eb' },
    headerClasses: 'text-center',
    formatter: (rowContent, row) => {

      return <div dangerouslySetInnerHTML={{ __html: `${row.Itens}` }} />;
    }

  },
  {
    dataField: "Created",
    text: "Data de criação",
    headerStyle: { backgroundColor: '#bee5eb' },
    headerClasses: 'text-center',
    classes: 'text-center',
    formatter: (rowContent, row) => {
      var dataCriacao = new Date(row.Created);
      var dtdataCriacao = ("0" + dataCriacao.getDate()).slice(-2) + '/' + ("0" + (dataCriacao.getMonth() + 1)).slice(-2) + '/' + dataCriacao.getFullYear().toString().substr(-2) + ' ' + ("0" + (dataCriacao.getHours())).slice(-2) + ':' + ("0" + (dataCriacao.getMinutes())).slice(-2);
      return dtdataCriacao;
    }
  },
  {
    dataField: "Author.Title",
    headerClasses: 'text-center',
    text: "Criado por",
    headerStyle: { backgroundColor: '#bee5eb' },
  },
]

const tablecolumnsCheckList = [
  {
    dataField: "Title",
    headerClasses: 'text-center',
    text: "S/N",
    headerStyle: { backgroundColor: '#bee5eb' },
  },
  {
    dataField: "Divergencias",
    headerClasses: 'text-center',
    text: "Divergências",
    headerStyle: { backgroundColor: '#bee5eb' },
    formatter: (rowContent, row) => {

      return <div dangerouslySetInnerHTML={{ __html: `${row.Divergencias}` }} />;
    }
  },
  {
    dataField: "Created",
    text: "Data de criação",
    headerClasses: 'text-center',
    headerStyle: { backgroundColor: '#bee5eb' },
    classes: 'text-center',
    formatter: (rowContent, row) => {
      var dataCriacao = new Date(row.Created);
      var dtdataCriacao = ("0" + dataCriacao.getDate()).slice(-2) + '/' + ("0" + (dataCriacao.getMonth() + 1)).slice(-2) + '/' + dataCriacao.getFullYear().toString().substr(-2) + ' ' + ("0" + (dataCriacao.getHours())).slice(-2) + ':' + ("0" + (dataCriacao.getMinutes())).slice(-2);
      return dtdataCriacao;
    }
  },
  {
    dataField: "Author.Title",
    text: "Criado por",
    headerClasses: 'text-center',
    headerStyle: { backgroundColor: '#bee5eb' },
  },
]

const tablecolumnsSetupitensModulos = [
  {
    dataField: "Title",
    text: "Itens",
    headerClasses: 'text-center',
    headerStyle: { backgroundColor: '#bee5eb' },
  },
  {
    dataField: "Parametros",
    text: "Parâmetros",
    headerClasses: 'text-center',
    headerStyle: { backgroundColor: '#bee5eb' },
    formatter: (rowContent, row) => {

      return <div dangerouslySetInnerHTML={{ __html: `${row.Parametros}` }} />;
    }
  },
  {
    dataField: "Created",
    text: "Data de criação",
    headerStyle: { backgroundColor: '#bee5eb' },
    classes: 'text-center',
    headerClasses: 'text-center',
    formatter: (rowContent, row) => {
      var dataCriacao = new Date(row.Created);
      var dtdataCriacao = ("0" + dataCriacao.getDate()).slice(-2) + '/' + ("0" + (dataCriacao.getMonth() + 1)).slice(-2) + '/' + dataCriacao.getFullYear().toString().substr(-2) + ' ' + ("0" + (dataCriacao.getHours())).slice(-2) + ':' + ("0" + (dataCriacao.getMinutes())).slice(-2);
      return dtdataCriacao;
    }
  },
  {
    dataField: "Author.Title",
    text: "Criado por",
    headerClasses: 'text-center',
    headerStyle: { backgroundColor: '#bee5eb' },
  },

]

const tablecolumnsFluxoAprovacaoDIPS = [
  {
    dataField: "VersaoReprovada",
    text: "Versão avaliada",
    headerClasses: 'text-center',
    headerStyle: { backgroundColor: '#bee5eb' },
    classes: 'text-center',
  },
  {
    dataField: "StatusAnterior",
    text: "Status anterior",
    headerClasses: 'text-center',
    headerStyle: { backgroundColor: '#bee5eb' },
  },
  {
    dataField: "StatusAtual",
    text: "Status atual",
    headerClasses: 'text-center',
    headerStyle: { backgroundColor: '#bee5eb' },
  },
  {
    dataField: "Title",
    text: "Motivo",
    headerClasses: 'text-center',
    headerStyle: { backgroundColor: '#bee5eb' },
  },
  {
    dataField: "Created",
    text: "Data de criação",
    headerStyle: { "backgroundColor": "#bee5eb" },
    classes: 'text-center',
    headerClasses: 'text-center',
    formatter: (rowContent, row) => {
      var dataCriacao = new Date(row.Created);
      var dtdataCriacao = ("0" + dataCriacao.getDate()).slice(-2) + '/' + ("0" + (dataCriacao.getMonth() + 1)).slice(-2) + '/' + dataCriacao.getFullYear().toString().substr(-2) + ' ' + ("0" + (dataCriacao.getHours())).slice(-2) + ':' + ("0" + (dataCriacao.getMinutes())).slice(-2);
      return dtdataCriacao;
    }
  },
  {
    dataField: "Author.Title",
    classes: 'headerPreStage',
    text: "Criado por",
    headerStyle: { "backgroundColor": "#bee5eb" },
    headerClasses: 'text-center',
  },
]

const tablecolumnsHistorico = [
  {
    dataField: "VersaoReprovada",
    text: "Versão avaliada",
    headerClasses: 'text-center',
    headerStyle: { backgroundColor: '#bee5eb' },
    classes: 'text-center',
  },
  {
    dataField: "StatusAnterior",
    text: "Status anterior",
    headerClasses: 'text-center',
    headerStyle: { backgroundColor: '#bee5eb' },
  },
  {
    dataField: "StatusAtual",
    text: "Status atual",
    headerClasses: 'text-center',
    headerStyle: { backgroundColor: '#bee5eb' },
  },
  {
    dataField: "Title",
    text: "Motivo",
    headerClasses: 'text-center',
    headerStyle: { backgroundColor: '#bee5eb' },
  },
  {
    dataField: "Created",
    text: "Data de criação",
    headerStyle: { backgroundColor: '#bee5eb' },
    headerClasses: 'text-center',
    classes: 'text-center',
    formatter: (rowContent, row) => {
      var dataCriacao = new Date(row.Created);
      var dtdataCriacao = ("0" + dataCriacao.getDate()).slice(-2) + '/' + ("0" + (dataCriacao.getMonth() + 1)).slice(-2) + '/' + dataCriacao.getFullYear().toString().substr(-2) + ' ' + ("0" + (dataCriacao.getHours())).slice(-2) + ':' + ("0" + (dataCriacao.getMinutes())).slice(-2);
      return dtdataCriacao;
    }
  },
  {
    dataField: "Author.Title",
    text: "Criado por",
    headerClasses: 'text-center',
    headerStyle: { backgroundColor: '#bee5eb' },
  },

]

const paginationOptions = {
  sizePerPage: 10,
  hideSizePerPage: true,
  hidePageListOnlyOnePage: true
};

const paginationOptions5 = {
  sizePerPage: 5,
  hideSizePerPage: true,
  hidePageListOnlyOnePage: true
};

export default class DipsDetalhesDocumento extends React.Component<IDipsDetalhesDocumentoProps, IReactGetItemsState> {

  public constructor(props: IDipsDetalhesDocumentoProps, state: IReactGetItemsState) {

    super(props);
    this.state = {

      itemsClientes: [
        {
          "ID": "",
          "Title": "",
        }],
      itemsSistemaOperacional: [
        {
          "ID": "",
          "Title": "any",
        }],
      itemsPacoteAdicionalSO: [],
      itemsMidiaMatriz: [],
      itemsInstalacaoMidiaMatriz: [],
      itemsEmailElaboracao: [],
      addUsersResponsavelEngenhariaHardware: [],
      itemsListPreStageSoftware: [],
      itemsListSetupBios: [],
      itemsCheckList: [],
      itemsSetupItensModulos: [],
      itemsFluxoAprovacaoDIPS: [],
      itemsHistorico: [],

    };
  }


  public async componentDidMount() {

    jQuery("#btnEditarDocumento").hide();
    jQuery("#btnEditarDocumento2").hide();
    jQuery("#btnImprimir1").hide();
    jQuery("#btnConfirmarDeletar").hide();
    jQuery("#btnCofirmarDuplicar").hide();


    document
      .getElementById("btnImprimir")
      .addEventListener("click", (e: Event) => this.print());

    document
      .getElementById("btnImprimir1")
      .addEventListener("click", (e: Event) => this.print());

    document
      .getElementById("btnCofirmarDuplicar")
      .addEventListener("click", (e: Event) => this.confirmarDuplicar());

    document
      .getElementById("btnVoltar")
      .addEventListener("click", (e: Event) => this.voltar());

    document
      .getElementById("btnEditarDocumento")
      .addEventListener("click", (e: Event) => this.editar());

    document
      .getElementById("btnEditarDocumento2")
      .addEventListener("click", (e: Event) => this.editar());

    document
      .getElementById("btnDuplicar")
      .addEventListener("click", (e: Event) => this.duplicar());

    document
      .getElementById("btnConfirmarDeletar")
      .addEventListener("click", (e: Event) => this.confirmarExcluirDIPS());

    document
      .getElementById("btnSucessoDuplicar")
      .addEventListener("click", (e: Event) => this.fecharSucesso());

    document
      .getElementById("btnSucessoExcluirDIPS")
      .addEventListener("click", (e: Event) => this.fecharSucessoExcluirDIPS());

    document
      .getElementById("btnExcluirDIPS")
      .addEventListener("click", (e: Event) => this.excluirDIPS());

    document
      .getElementById("headingInformacoesProduto")
      .addEventListener("click", (e: Event) => this.mostraOculta("headingInformacoesProduto", "iconUpInformacoesProduto", "iconDownInformacoesProduto"));

    document
      .getElementById("headingPreStageSoftware")
      .addEventListener("click", (e: Event) => this.mostraOculta("headingPreStageSoftware", "iconUpPreStage", "iconDownPreStage"));

    document
      .getElementById("headingAnexos")
      .addEventListener("click", (e: Event) => this.mostraOculta("headingAnexos", "iconUpImagens", "iconDownImagens"));

    document
      .getElementById("headingArquivos")
      .addEventListener("click", (e: Event) => this.mostraOculta("headingArquivos", "iconUpArquivos", "iconDownArquivos"));

    document
      .getElementById("headingPreStageHardware")
      .addEventListener("click", (e: Event) => this.mostraOculta("headingPreStageHardware", "iconUpPreStageHardware", "iconDownPreStageHardware"));

    document
      .getElementById("headingSetupBios")
      .addEventListener("click", (e: Event) => this.mostraOculta("headingSetupBios", "iconUpSetupBios", "iconDownSetupBios"));

    document
      .getElementById("headingSetupItensModulos")
      .addEventListener("click", (e: Event) => this.mostraOculta("headingSetupItensModulos", "iconUpModulos", "iconDownModulos"));


    document
      .getElementById("headingCheckList")
      .addEventListener("click", (e: Event) => this.mostraOculta("headingCheckList", "iconUpCheckList", "iconDownCheckList",));

    document
      .getElementById("headingFluxoAprovacaoDIPS")
      .addEventListener("click", (e: Event) => this.mostraOculta("headingFluxoAprovacaoDIPS", "iconUpFluxoAprovacaoDIPS", "iconDownFluxoAprovacaoDIPS"));

    document
      .getElementById("headingHistorico")
      .addEventListener("click", (e: Event) => this.mostraOculta("headingHistorico", "iconUpHistorico", "iconDownHistorico"));


    _web = new Web(this.props.context.pageContext.web.absoluteUrl);
    _caminho = this.props.context.pageContext.web.serverRelativeUrl;

    await _web.currentUser.get().then(f => {
      console.log("user", f);
      var id = f.Id;

      var grupos = [];

      jQuery.ajax({
        url: `${this.props.siteurl}/_api/web/GetUserById(${id})/Groups`,
        type: "GET",
        headers: { 'Accept': 'application/json; odata=verbose;' },
        async: false,
        success: async function (resultData) {

          console.log("resultDataGrupo", resultData);

          if (resultData.d.results.length > 0) {

            for (var i = 0; i < resultData.d.results.length; i++) {

              grupos.push(resultData.d.results[i].Title);

            }

          }

        },
        error: function (jqXHR, textStatus, errorThrown) {
          console.log(textStatus);
        }

      })

      console.log("grupos", grupos);
      _grupos = grupos;

    })

    var queryParms = new UrlQueryParameterCollection(window.location.href);
    _documentoID = parseInt(queryParms.getValue("DocumentoID"));

    jQuery("#conteudoLoading").html(`<br/><br/><img style="height: 80px; width: 80px" src='${_caminho}/SiteAssets/loading.gif'/>
    <br/>Aguarde....<br/><br/>
    Dependendo do tamanho do anexo e a velocidade<br>
     da Internet essa ação pode demorar um pouco. <br>
     Não fechar a janela!<br/><br/>`);

    setTimeout(() => {

      console.log("_status", _status);

      if (_grupos.indexOf("DIPS - Engenharia (Elaborador)") !== -1) {

        if ((_status == "Em elaboração (Engenharia)") || (_status == "Em revisão (Engenharia)") || (_status == "Aprovado")) {

          jQuery("#btnEditarDocumento").show();
          jQuery("#btnEditarDocumento2").show();

        }

      }

      if (_grupos.indexOf("DIPS - Suporte") !== -1) {

        if ((_status == "Aguardando aprovação do Suporte") || (_status == "Em revisão (Suporte)") || (_status == "Aprovado")) {

          jQuery("#btnEditarDocumento").show();
          jQuery("#btnEditarDocumento2").show();

        }

      }

      jQuery("#btnImprimir1").show();


    }, 1000);


    this.getDocumento();
    this.getImagens();
    this.handler();

  }


  public render(): React.ReactElement<IDipsDetalhesDocumentoProps> {

    return (

      <><div id="container">

        <div className="text-right">
          <button style={{ "margin": "2px" }} id="btnImprimir1" className="btn btn-secondary">Imprimir</button>
          <button style={{ "margin": "2px" }} id="btnEditarDocumento2" className="btn btn-success">Editar</button><br></br><br></br>
        </div>





        <div id="accordion">

          <div className="card">
            <div className="card-header btn" id="headingInformacoesProduto" data-toggle="collapse" data-target="#collapseInformacoesProduto" aria-expanded="true" aria-controls="collapseInformacoesProduto">
              <h5 className="mb-0 text-info">
                Informações do produto
                <span id='iconDownInformacoesProduto' style={{ "display": "none" }} className="float-right cinza">
                  <FontAwesomeIcon icon={faChevronDown} />
                </span>
                <span id='iconUpInformacoesProduto' className="float-right cinza">
                  <FontAwesomeIcon icon={faChevronUp} />
                </span>
              </h5>
            </div>
            <div id="collapseInformacoesProduto" className="collapse show" aria-labelledby="headingOne">
              <div className="card-body">

                <div className="form-group">
                  <div className="form-row">
                    <div className="form-group col-md text-info ">
                      <b>DIPS <span id='txtID'></span></b><br></br>
                      Versão: <span id='txtVersao'> </span><br></br>
                      Status: <span id='txtStatus'></span>
                    </div>
                    <div className="form-group col-md text-secondary right ">

                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <div className="form-row">
                    <div className="form-group col-md border m-1">
                      <label htmlFor="txtNomeProduto">Nome do produto</label><br></br>
                      <span className="text-info" id='txtNomeProduto'></span>
                    </div>
                    <div className="form-group col-md border m-1">
                      <label htmlFor="txtCliente">Cliente</label><br></br>
                      <span className="text-info" id='txtCliente'></span>
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <div className="form-row">
                    <div className="form-group col-md border m-1">
                      <label htmlFor="txtSSTJira">SST/JIRA</label><br></br>
                      <span className="text-info" id='txtSSTJira'></span>
                    </div>
                    <div className="form-group col-md border m-1">
                      <label htmlFor="txtCodigoIndustrial">Código Industrial</label><br></br>
                      <span className="text-info" id='txtCodigoIndustrial'></span>
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <div className="form-row">
                    <div className="form-group col-md border m-1">
                      <label htmlFor="txtDescricaoPacoteAdicionalSO">Descrição (Pacote Adicional ao S.O. OEM)</label><br></br>
                      <span className="text-info" id='txtDescricaoPacoteAdicionalSO'></span>
                    </div>
                    <div className="form-group col-md border m-1">
                      <label htmlFor="txtResponsavelPacoteAdicionalSO">Responsável (Pacote Adicional ao S.O. OEM)</label><br></br>
                      <span className="text-info" id='txtResponsavelPacoteAdicionalSO'></span>
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <div className="form-row">
                    <div className="form-group col-md border m-1">
                      <label htmlFor="txtDataLiberacaoMidiaMatriz">Data de Liberação (Mídia Matriz)</label><br></br>
                      <span className="text-info" id='txtDataLiberacaoMidiaMatriz'></span>
                    </div>
                    <div className="form-group col-md border m-1">
                      <label htmlFor="txtArquivoInstalacaoMidiaMatriz">Arquivo para Instalação (Mídia Matriz)</label><br></br>
                      <span className="text-info" id='txtArquivoInstalacaoMidiaMatriz'></span>
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <div className="form-row">
                    <div className="form-group col-md border m-1">
                      <label htmlFor="txtResponsavelGeracaoMidiaMatriz">Responsável pela Geração (Mídia Matriz)</label><br></br>
                      <span className="text-info" id='txtResponsavelGeracaoMidiaMatriz'></span>
                    </div>
                    <div className="form-group col-md border m-1">
                      <label htmlFor="txtInstalacaoMidiaMatriz">Instalação (Mídia Matriz)</label><br></br>
                      <span className="text-info" id='txtInstalacaoMidiaMatriz'></span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header btn" id="headingPreStageSoftware" data-toggle="collapse" data-target="#collapsePreStageSoftware" aria-expanded="true" aria-controls="collapsePreStageSoftware">
              <h5 className="mb-0 text-info">
                Pré Stage de Software
                <span id='iconDownPreStage' style={{ "display": "none" }} className="float-right cinza">
                  <FontAwesomeIcon icon={faChevronDown} />
                </span>
                <span id='iconUpPreStage' className="float-right cinza">
                  <FontAwesomeIcon icon={faChevronUp} />
                </span>
              </h5>
            </div>
            <div id="collapsePreStageSoftware" className="collapse show" aria-labelledby="headingOne">
              <div className="card-body">

                <div className="form-group">
                  <div className="form-row">
                    <div className="form-group col-md border m-1">
                      <label htmlFor="txtPacoteAdicionalSO">Pacote Adicional ao S.O. OEM</label><br></br>
                      <span className="text-info" id='txtPacoteAdicionalSO'></span>
                    </div>
                    <div className="form-group col-md border m-1">
                      <label htmlFor="txtMidiaMatriz">Mídia Matriz</label><br></br>
                      <span className="text-info" id='txtMidiaMatriz'></span>
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <div className="form-row">
                    <div className="form-group col-md border m-1">
                      <label htmlFor="txtSistemaOperacional">Sistema Operacional</label><br></br>
                      <span className="text-info" id='txtSistemaOperacional'></span>
                    </div>

                  </div>
                </div>

                <div className="form-group">
                  <div className="form-row">
                    <div className="form-group col-md border m-1">
                      <label htmlFor="txtOutrasInformacoes">Outras Informações</label><br></br>
                      <span className="text-info" id='txtOutrasInformacoes'></span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header btn" id="headingAnexos" data-toggle="collapse" data-target="#collapseAnexos" aria-expanded="true" aria-controls="collapseAnexos">
              <h5 className="mb-0 text-info">
                Imagens
                <span id='iconDownImagens' style={{ "display": "none" }} className="float-right cinza">
                  <FontAwesomeIcon icon={faChevronDown} />
                </span>
                <span id='iconUpImagens' className="float-right cinza">
                  <FontAwesomeIcon icon={faChevronUp} />
                </span>
              </h5>
            </div>
            <div id="collapseAnexos" className="collapse show" aria-labelledby="headingOne">
              <div className="card-body">

                <div className="form-group">
                  <div className="form-row ">
                    <div className="form-group col-md" >
                      <div className="form-group" id='conteudoImagens'></div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header btn" id="headingArquivos" data-toggle="collapse" data-target="#collapseArquivos" aria-expanded="true" aria-controls="collapseArquivos">
              <h5 className="mb-0 text-info">
                Arquivos
                <span id='iconDownArquivos' style={{ "display": "none" }} className="float-right cinza">
                  <FontAwesomeIcon icon={faChevronDown} />
                </span>
                <span id='iconUpArquivos' className="float-right cinza">
                  <FontAwesomeIcon icon={faChevronUp} />
                </span>
              </h5>
            </div>
            <div id="collapseArquivos" className="collapse show" aria-labelledby="headingOne">
              <div className="card-body">

                <div className="form-group">
                  <div className="form-row ">
                    <div className="form-group col-md" >
                      <div id='conteudoOutros'></div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header btn" id="headingPreStageHardware" data-toggle="collapse" data-target="#collapsePreStageHardware" aria-expanded="true" aria-controls="collapsePreStageHardware">
              <h5 className="mb-0 text-info">
                Pre Stage de Hardware
                <span id='iconDownPreStageHardware' style={{ "display": "none" }} className="float-right cinza">
                  <FontAwesomeIcon icon={faChevronDown} />
                </span>
                <span id='iconUpPreStageHardware' className="float-right cinza">
                  <FontAwesomeIcon icon={faChevronUp} />
                </span>
              </h5>
            </div>
            <div id="collapsePreStageHardware" className="collapse show" aria-labelledby="headingOne">
              <div className="card-body">
                <div id='tabelaPreStageSoftware'>
                  <BootstrapTable bootstrap4 responsive striped condensed hover={false} className="gridTodosItens" id="gridTodosItensPreStageSoftware" keyField='id' data={this.state.itemsListPreStageSoftware} columns={tablecolumnsPreStageSoftware} headerClasses="header-class" />
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header btn" id="headingSetupBios" data-toggle="collapse" data-target="#collapseSetupBios" aria-expanded="true" aria-controls="collapseSetupBios">
              <h5 className="mb-0 text-info">
                Setup de BIOS
                <span id='iconDownSetupBios' style={{ "display": "none" }} className="float-right cinza">
                  <FontAwesomeIcon icon={faChevronDown} />
                </span>
                <span id='iconUpSetupBios' className="float-right cinza">
                  <FontAwesomeIcon icon={faChevronUp} />
                </span>
              </h5>
            </div>
            <div id="collapseSetupBios" className="collapse show" aria-labelledby="headingOne">
              <div className="card-body">
                <div id='tabelaSetupBios'>
                  <BootstrapTable bootstrap4 responsive striped condensed hover={false} className="gridTodosItens" id="gridTodosItensSetupBios" keyField='id' data={this.state.itemsListSetupBios} columns={tablecolumnsSetupBios} headerClasses="header-class" />
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header btn" id="headingSetupItensModulos" data-toggle="collapse" data-target="#collapseSetupItensModulos" aria-expanded="true" aria-controls="collapseSetupItensModulos">
              <h5 className="mb-0 text-info">
                Setup de Itens/Módulos
                <span id='iconDownModulos' style={{ "display": "none" }} className="float-right cinza">
                  <FontAwesomeIcon icon={faChevronDown} />
                </span>
                <span id='iconUpModulos' className="float-right cinza">
                  <FontAwesomeIcon icon={faChevronUp} />
                </span>
              </h5>
            </div>
            <div id="collapseSetupItensModulos" className="collapse show" aria-labelledby="headingOne">
              <div className="card-body">
                <div id='tabelaSetupItensModulos'>
                  <BootstrapTable bootstrap4 striped responsive condensed hover={false} className="gridTodosItens" id="gridTodosItensSetupItensModulos" keyField='id' data={this.state.itemsSetupItensModulos} columns={tablecolumnsSetupitensModulos} headerClasses="header-class" />
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header btn" id="headingCheckList" data-toggle="collapse" data-target="#collapseCheckList" aria-expanded="true" aria-controls="collapseCheckList">
              <h5 className="mb-0 text-info">
                Checklist
                <span id='iconDownCheckList' style={{ "display": "none" }} className="float-right cinza">
                  <FontAwesomeIcon icon={faChevronDown} />
                </span>
                <span id='iconUpCheckList' className="float-right cinza">
                  <FontAwesomeIcon icon={faChevronUp} />
                </span>
              </h5>
            </div>
            <div id="collapseCheckList" className="collapse show" aria-labelledby="headingOne">
              <div className="card-body">
                <div id='tabelaCheckList'>
                  <BootstrapTable bootstrap4 striped responsive condensed hover={false} className="gridTodosItens" id="gridTodosItensCheckList" keyField='id' data={this.state.itemsCheckList} columns={tablecolumnsCheckList} headerClasses="header-class" />
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header btn" id="headingFluxoAprovacaoDIPS" data-toggle="collapse" data-target="#collapseFluxoAprovacaoDIPS" aria-expanded="true" aria-controls="collapseFluxoAprovacaoDIPS">
              <h5 className="mb-0 text-info">
                Fluxo de aprovação do DIPS
                <span id='iconDownFluxoAprovacaoDIPS' style={{ "display": "none" }} className="float-right cinza">
                  <FontAwesomeIcon icon={faChevronDown} />
                </span>
                <span id='iconUpFluxoAprovacaoDIPS' className="float-right cinza">
                  <FontAwesomeIcon icon={faChevronUp} />
                </span>
              </h5>
            </div>
            <div id="collapseFluxoAprovacaoDIPS" className="collapse show" aria-labelledby="headingOne">
              <div className="card-body">
                <div id='tabelaFluxoAprovacaoDIPS'>
                  <BootstrapTable bootstrap4 responsive condensed striped hover={false} className="gridTodosItens" id="gridTodosItensFluxoAprovacaoDIPS" keyField='id' data={this.state.itemsFluxoAprovacaoDIPS} columns={tablecolumnsFluxoAprovacaoDIPS} headerClasses="header-class" />
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header btn" id="headingHistorico" data-toggle="collapse" data-target="#collapseHistorico" aria-expanded="true" aria-controls="collapseHistorico">
              <h5 className="mb-0 text-info">
                Histórico de alteração
                <span id='iconDownHistorico' style={{ "display": "none" }} className="float-right cinza">
                  <FontAwesomeIcon icon={faChevronDown} />
                </span>
                <span id='iconUpHistorico' className="float-right cinza">
                  <FontAwesomeIcon icon={faChevronUp} />
                </span>
              </h5>
            </div>
            <div id="collapseHistorico" className="collapse show" aria-labelledby="headingOne">
              <div className="card-body">
                <div id='tabelaHistorico'>
                  <BootstrapTable bootstrap4 striped responsive condensed hover={false} className="gridTodosItens" id="gridTodosItensHistorico" keyField='id' data={this.state.itemsHistorico} columns={tablecolumnsHistorico} headerClasses="header-class" />
                </div>
              </div>
            </div>
          </div>

        </div>

      </div><br></br><div className="text-right">
          <button style={{ "margin": "2px" }} type="submit" id="btnVoltar" className="btn btn-secondary">Voltar</button>
          <button style={{ "margin": "2px" }} id="btnConfirmarDeletar" className="btn btn-danger">Deletar</button>
          <button style={{ "margin": "2px" }} id="btnImprimir" className="btn btn-secondary">Imprimir</button>
          <button style={{ "margin": "2px" }} id="btnCofirmarDuplicar" className="btn btn-secondary">Duplicar</button>
          <button style={{ "margin": "2px" }} id="btnEditarDocumento" className="btn btn-success">Editar</button>
        </div>

        <div className="modal fade" id="modalDetalhesPreStageSoftware" tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Pre Stage de Hardware - Detalhes</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">

                <div className="form-row">
                  <div className="form-group col-md border m-1">
                    <label htmlFor="txtComponente">Componente</label><br></br>
                    <span className="text-info" id='txtComponente'></span>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group col-md border m-1">
                    <label htmlFor="txtModelo">Modelo</label><br></br>
                    <span className="text-info" id='txtModelo'></span>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group col-md border m-1">
                    <label htmlFor="txtFabricante">Fabricante</label><br></br>
                    <span className="text-info" id='txtFabricante'></span>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group col-md border m-1">
                    <label htmlFor="txtFW">FW</label><br></br>
                    <span className="text-info" id='txtFW'></span>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group col-md border m-1">
                    <label htmlFor="txtBIOS">BIOS</label><br></br>
                    <span className="text-info" id='txtBIOS'></span>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group col-md border m-1">
                    <label htmlFor="txtConexao">Conexão</label><br></br>
                    <span className="text-info" id='txtConexao'></span>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group col-md border m-1">
                    <label htmlFor="txtPORT">PORT</label><br></br>
                    <span className="text-info" id='txtPORT'></span>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group col-md border m-1">
                    <label htmlFor="txtSLOT">SLOT</label><br></br>
                    <span className="text-info" id='txtSLOT'></span>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group col-md border m-1">
                    <label htmlFor="txtItemObrigatorio">Item obrigatório</label><br></br>
                    <span className="text-info" id='txtItemObrigatorio'></span>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group col-md border m-1">
                    <label htmlFor="txtObservacao">Observação</label><br></br>
                    <span className="text-info" id='txtObservacao'></span>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group col-md border m-1">
                    <label htmlFor="txtCriado">Criado</label><br></br>
                    <span className="text-info" id='txtCriado'></span>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group col-md border m-1">
                    <label htmlFor="txtCriadoPor">Criado por</label><br></br>
                    <span className="text-info" id='txtCriadoPor'></span>
                  </div>
                </div>

              </div>
              <div className="modal-footer">
              </div>
            </div>
          </div>
        </div>


        <div className="modal fade" id="modalDetalhesSetupBIOS" tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Setup de BIOS - Detalhes</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">

                <div className="form-row">
                  <div className="form-group col-md border m-1">
                    <label htmlFor="txtItens">Itens</label><br></br>
                    <span className="text-info" id='txtItens'></span>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group col-md border m-1">
                    <label htmlFor="txtParametros">Parâmetros</label><br></br>
                    <span className="text-info" id='txtParametros'></span>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group col-md border m-1">
                    <label htmlFor="txtCriadoSetupBIOS">Criado</label><br></br>
                    <span className="text-info" id='txtCriadoSetupBIOS'></span>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group col-md border m-1">
                    <label htmlFor="txtCriadoPorSetupBIOS">Criado por</label><br></br>
                    <span className="text-info" id='txtCriadoPorSetupBIOS'></span>
                  </div>
                </div>

              </div>
              <div className="modal-footer">
              </div>
            </div>
          </div>
        </div>

        <div className="modal fade" id="modalDetalhesCheckList" tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Setup de BIOS - Detalhes</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">

                <div className="form-row">
                  <div className="form-group col-md border m-1">
                    <label htmlFor="txtItens">S/N</label><br></br>
                    <span className="text-info" id='txtSN'></span>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group col-md border m-1">
                    <label htmlFor="txtParametros">Divergências</label><br></br>
                    <span className="text-info" id='txtDivergencias'></span>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group col-md border m-1">
                    <label htmlFor="txtCriadoSetupBIOS">Criado</label><br></br>
                    <span className="text-info" id='txtCriadoCheckList'></span>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group col-md border m-1">
                    <label htmlFor="txtCriadoPorSetupBIOS">Criado por</label><br></br>
                    <span className="text-info" id='txtCriadoPorCheckList'></span>
                  </div>
                </div>

              </div>
              <div className="modal-footer">
              </div>
            </div>
          </div>
        </div>


        <div className="modal fade" id="modalDetalhesModulos" tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Setup de Itens / Módulos - Detalhes</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">

                <div className="form-row">
                  <div className="form-group col-md border m-1">
                    <label htmlFor="txtItensModulos">Itens</label><br></br>
                    <span className="text-info" id='txtItensModulos'></span>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group col-md border m-1">
                    <label htmlFor="txtParametros">Parâmetros</label><br></br>
                    <span className="text-info" id='txtParametrosModulo'></span>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group col-md border m-1">
                    <label htmlFor="txtCriadoModulos">Criado</label><br></br>
                    <span className="text-info" id='txtCriadoModulos'></span>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group col-md border m-1">
                    <label htmlFor="txtCriadoPorModulos">Criado por</label><br></br>
                    <span className="text-info" id='txtCriadoPorModulos'></span>
                  </div>
                </div>

              </div>
              <div className="modal-footer">
              </div>
            </div>
          </div>
        </div>


        <div className="modal fade" id="modalDetalhesFluxoAprovacaoDIPS" tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Fluxo de Aprovação DIPS - Detalhes</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">

                <div className="form-row">
                  <div className="form-group col-md border m-1">
                    <label htmlFor="txtItensModulos">Versão avalidada</label><br></br>
                    <span className="text-info" id='txtVersaoAvalida'></span>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group col-md border m-1">
                    <label htmlFor="txtParametros">Status anterior</label><br></br>
                    <span className="text-info" id='txtStatusAnterior'></span>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group col-md border m-1">
                    <label htmlFor="txtCriadoModulos">Status atual</label><br></br>
                    <span className="text-info" id='txtStatusAtual'></span>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group col-md border m-1">
                    <label htmlFor="txtCriadoPorModulos">Motivo</label><br></br>
                    <span className="text-info" id='txtMotivo'></span>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group col-md border m-1">
                    <label htmlFor="txtCriadoPorModulos">Criado</label><br></br>
                    <span className="text-info" id='txtCriadoFluxoAprovacaoDIPS'></span>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group col-md border m-1">
                    <label htmlFor="txtCriadoPorModulos">CriadoPor</label><br></br>
                    <span className="text-info" id='txtCriadoPorFluxoAprovacaoDIPS'></span>
                  </div>
                </div>

              </div>
              <div className="modal-footer">
              </div>
            </div>
          </div>
        </div>

        <div className="modal fade" id="modalConfirmarDuplicar" tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Confirmação</h5>
              </div>
              <div className="modal-body">
                Deseja realmente duplicar o Documento?
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-dismiss="modal">Cancelar</button>
                <button id="btnDuplicar" type="button" className="btn btn-primary">Duplicar Documento</button>
              </div>
            </div>
          </div>
        </div>

        <div className="modal fade" id="modalConfirmarExcluirDIPS" tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Confirmação</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                Deseja realmente excluir esse DIPS?
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-dismiss="modal">Cancelar</button>
                <button id="btnExcluirDIPS" type="button" className="btn btn-primary">Sim</button>
              </div>
            </div>
          </div>
        </div>

        <div className="modal fade" id="modalCarregando" tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div>
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div id='conteudoLoading' className='carregando'></div>
              </div>
            </div>
          </div>
        </div>


        <div className="modal fade" id="modalSucessoDuplicar" tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Alerta</h5>
              </div>
              <div className="modal-body">
                Documento duplicado com sucesso!
              </div>
              <div className="modal-footer">
                <button type="button" id="btnSucessoDuplicar" className="btn btn-primary">OK</button>
              </div>
            </div>
          </div>
        </div>

        <div className="modal fade" id="modalSucessoExcluirDIPS" tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Alerta</h5>
              </div>
              <div className="modal-body">
                DIPS excluido com sucesso!
              </div>
              <div className="modal-footer">
                <button type="button" id="btnSucessoExcluirDIPS" className="btn btn-primary">OK</button>
              </div>
            </div>
          </div>
        </div>



      </>


    );


  }


  protected getDocumento() {

    jQuery.ajax({
      url: `${this.props.siteurl}/_api/web/lists/getbytitle('Documentos')/items?$select=ID,Title,NomeProduto,Cliente,SST,PacoteAdicionalSODescricao,Versao,PacoteAdicionalSOResponsavel,MidiaMatrizVersaoMidia,MidiaMatrizDataLiberacao,MidiaMatrizArquivoRoteiroInstala,MidiaMatrizResponsavelGeracao,MidiaMatrizInstalacao,EmailElaboracao,PacoteAdicionalSO,MidiaMatriz,SistemaOperacionalSiteNovo,SistemaOperacional,SiteAntigo,OutrasInformacoes,Status&$filter=ID eq ` + _documentoID,
      type: "GET",
      headers: { 'Accept': 'application/json; odata=verbose;' },
      async: false,
      success: async function (resultData) {

        console.log("resultData doc", resultData);

        if (resultData.d.results.length > 0) {

          for (var i = 0; i < resultData.d.results.length; i++) {

            var id = resultData.d.results[i].ID;
            var nomeProduto = resultData.d.results[i].NomeProduto;
            var cliente = resultData.d.results[i].Cliente;
            var SSTJira = resultData.d.results[i].SST;
            var codigoIndustrial = resultData.d.results[i].Title;
            var descricaoPacoteAdicionalSO = resultData.d.results[i].PacoteAdicionalSODescricao;
            var responsavelPacoteAdicionalSO = resultData.d.results[i].PacoteAdicionalSOResponsavel;
            var versaoMidiaMatriz = resultData.d.results[i].MidiaMatrizVersaoMidia;
            var status = resultData.d.results[i].Status;
            var versao = resultData.d.results[i].Versao;
            var dataLiberacaoMidiaMatriz = new Date(resultData.d.results[i].MidiaMatrizDataLiberacao);
            var dtdataLiberacaoMidiaMatriz = ("0" + dataLiberacaoMidiaMatriz.getDate()).slice(-2) + '/' + ("0" + (dataLiberacaoMidiaMatriz.getMonth() + 1)).slice(-2) + '/' + dataLiberacaoMidiaMatriz.getFullYear();
            if (dtdataLiberacaoMidiaMatriz == "31/12/1969") dtdataLiberacaoMidiaMatriz = "";
            var arquivoInstalacaoMidiaMatriz = resultData.d.results[i].MidiaMatrizArquivoRoteiroInstala;
            var responsavelGeracaoMidiaMatriz = resultData.d.results[i].MidiaMatrizResponsavelGeracao;
            var strInstalacaoMidiaMatriz;
            var instalacaoMidiaMatriz = resultData.d.results[i].MidiaMatrizInstalacao;
            var arrTituloInstalacaoMidiaMatriz = [];

            if (instalacaoMidiaMatriz != null) {

              var arrInstalacaoMidiaMatriz = resultData.d.results[i].MidiaMatrizInstalacao.results;

              console.log("arrInstalacaoMidiaMatriz", arrInstalacaoMidiaMatriz);

              for (var x = 0; x < arrInstalacaoMidiaMatriz.length; x++) {
                console.log("arrInstalacaoMidiaMatriz[x]", arrInstalacaoMidiaMatriz[x]);
                arrTituloInstalacaoMidiaMatriz.push(arrInstalacaoMidiaMatriz[x]);
              }

              console.log("arrTituloInstalacaoMidiaMatriz", arrTituloInstalacaoMidiaMatriz);

              strInstalacaoMidiaMatriz = arrTituloInstalacaoMidiaMatriz.toString();

            } else strInstalacaoMidiaMatriz = "";

            var pacoteAdicionalSO = resultData.d.results[i].PacoteAdicionalSO;
            var midiaMatriz = resultData.d.results[i].MidiaMatriz;
            var siteAntigo = resultData.d.results[i].SiteAntigo;
            var sistemaOperacional;

            if (siteAntigo != true) {
              sistemaOperacional = resultData.d.results[i].SistemaOperacionalSiteNovo;
            } else {
              sistemaOperacional = resultData.d.results[i].SistemaOperacional;
            }

            var outrasInformacoes = resultData.d.results[i].OutrasInformacoes;

            _versao = versao;
            _nomeProduto = nomeProduto;
            _cliente = cliente;
            _SSTJira = SSTJira;
            _codigoIndustrial = codigoIndustrial;
            _status = status;
            _descricaoPacoteAdicionalSO = descricaoPacoteAdicionalSO;
            _responsavelPacoteAdicionalSO = responsavelPacoteAdicionalSO;
            _versaoMidiaMatriz = versaoMidiaMatriz;
            _dtdataLiberacaoMidiaMatriz = dtdataLiberacaoMidiaMatriz;
            _arquivoInstalacaoMidiaMatriz = arquivoInstalacaoMidiaMatriz;
            _responsavelGeracaoMidiaMatriz = responsavelGeracaoMidiaMatriz;
            _arrInstalacaoMidiaMatriz = arrTituloInstalacaoMidiaMatriz;
            _pacoteAdicionalSO = pacoteAdicionalSO;
            _midiaMatriz = midiaMatriz;
            _sistemaOperacional = sistemaOperacional;
            _outrasInformacoes = outrasInformacoes;

            jQuery("#txtID").html(id);
            jQuery("#txtVersao").html(versao);
            jQuery("#txtNomeProduto").html(nomeProduto);
            jQuery("#txtCliente").html(cliente);
            jQuery("#txtSSTJira").html(SSTJira);
            jQuery("#txtCodigoIndustrial").html(codigoIndustrial);
            jQuery("#txtStatus").html(status);
            jQuery("#txtDescricaoPacoteAdicionalSO").html(descricaoPacoteAdicionalSO);
            jQuery("#txtResponsavelPacoteAdicionalSO").html(responsavelPacoteAdicionalSO);
            jQuery("#txtVersaoMidiaMatriz").html(versaoMidiaMatriz);
            jQuery("#txtDataLiberacaoMidiaMatriz").html(dtdataLiberacaoMidiaMatriz);
            jQuery("#txtArquivoInstalacaoMidiaMatriz").html(arquivoInstalacaoMidiaMatriz);
            jQuery("#txtResponsavelGeracaoMidiaMatriz").html(responsavelGeracaoMidiaMatriz);
            jQuery("#txtInstalacaoMidiaMatriz").html(strInstalacaoMidiaMatriz);
            jQuery("#txtPacoteAdicionalSO").html(pacoteAdicionalSO);
            jQuery("#txtMidiaMatriz").html(midiaMatriz);
            jQuery("#txtSistemaOperacional").html(sistemaOperacional);
            jQuery("#txtOutrasInformacoes").html(outrasInformacoes);

            if (status != "Aguardando aprovação do Suporte") {

              if (_grupos.indexOf("DIPS - Engenharia (Elaborador)") !== -1) {

                jQuery("#btnCofirmarDuplicar").show();

              }

            }

            if (versao == "-1") {

              if (_grupos.indexOf("DIPS - Engenharia (Elaborador)") !== -1) {

                if (status == "Em elaboração (Engenharia)") {

                  jQuery("#btnConfirmarDeletar").show();

                }

              }

            }

          }

        }else {
          alert("DIPS não encontrado!");
          window.location.href = `Documentos-Todos.aspx`;
        }

      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(jqXHR.responseText);
      }

    })

  }



  protected async getImagens() {

    var montaImagem = "";
    var montaOutros = "";

    var url = `${this.props.siteurl}/_api/web/lists/getByTitle('Documentos')/items('${_documentoID}')/AttachmentFiles`;
    _url = this.props.siteurl;

    $.ajax
      ({
        url: url,
        method: "GET",
        async: false,
        headers:
        {
          "Accept": "application/json;odata=verbose"
        },

        success: async (data) => {

          var dataresults = data.d.results;

          console.log("dataresults", dataresults);

          for (var i = 0; i < dataresults.length; i++) {

            var checkNomeArquivoJPG = false;
            var checkNomeArquivojpg = false;
            var checkNomeArquivoPNG = false;
            var checkNomeArquivopng = false;
            var checkNomeArquivoGIF = false;
            var checkNomeArquivogif = false;

            var nomeArquivo = dataresults[i]["FileName"];
            // _arrNomeArquivo.push(nomeArquivo);
            _arrNomeArquivoAttachmentFiles.push(nomeArquivo);

            checkNomeArquivoJPG = nomeArquivo.includes(".JPG");
            checkNomeArquivojpg = nomeArquivo.includes(".jpg");
            checkNomeArquivoPNG = nomeArquivo.includes(".PNG");
            checkNomeArquivopng = nomeArquivo.includes(".png");
            checkNomeArquivoGIF = nomeArquivo.includes(".GIF");
            checkNomeArquivogif = nomeArquivo.includes(".gif");

            if ((checkNomeArquivoJPG) || (checkNomeArquivojpg) || (checkNomeArquivoPNG) || (checkNomeArquivopng) || (checkNomeArquivoGIF) || (checkNomeArquivogif)) {

              montaImagem += `<img class='imagensDIPS' src='${_url}/Lists/Documentos/Attachments/${_documentoID}/${dataresults[i]["FileName"]}'></img><br/><br/>`;

            } else {

              montaOutros += `<a target ="_blank" data-interception="off" title="" href="${_url}/Lists/Documentos/Attachments/${_documentoID}/${dataresults[i]["FileName"]}">${dataresults[i]["FileName"]}</a><br/>`;
            }


          }


        },
        error: function (xhr, status, error) {
          console.log("Falha anexo");
        }
      }).catch((error: any) => {
        console.log("Erro Anexo do item: ", error);
      });

    var relativeURL = window.location.pathname;
    var strRelativeURL = relativeURL.replace("SitePages/Documentos-Detalhes.aspx", "");

    await _web.getFolderByServerRelativeUrl(`${strRelativeURL}/Imagens/${_documentoID}`).files.orderBy('TimeLastModified', true)
      .expand('ListItemAllFields', 'Author').get().then(r => {

        console.log("r", r);

        r.forEach(item => {

          console.log("entrou");

          var checkNomeArquivoJPG = false;
          var checkNomeArquivojpg = false;
          var checkNomeArquivoPNG = false;
          var checkNomeArquivopng = false;
          var checkNomeArquivoGIF = false;
          var checkNomeArquivogif = false;

          var nomeArquivo = item.Name;

          // _arrNomeArquivo.push(nomeArquivo);
          _arrNomeArquivoFolder.push(nomeArquivo);

          checkNomeArquivoJPG = nomeArquivo.includes(".JPG");
          checkNomeArquivojpg = nomeArquivo.includes(".jpg");
          checkNomeArquivoPNG = nomeArquivo.includes(".PNG");
          checkNomeArquivopng = nomeArquivo.includes(".png");
          checkNomeArquivoGIF = nomeArquivo.includes(".GIF");
          checkNomeArquivogif = nomeArquivo.includes(".gif");

          if ((checkNomeArquivoJPG) || (checkNomeArquivojpg) || (checkNomeArquivoPNG) || (checkNomeArquivopng) || (checkNomeArquivoGIF) || (checkNomeArquivogif)) {

            montaImagem += `<img class='imagensDIPS' src='${item.ServerRelativeUrl}'></img><br/><br/>`;

          } else {

            montaOutros += `<a data-interception="off" target="_blank" title="" href="${item.ServerRelativeUrl}">${item.Name}</a> <br/>`;
          }


        })

      }).catch((error: any) => {
        console.log("Erro onChangeCliente: ", error);
      });

    $("#conteudoImagens").append(montaImagem);
    $("#conteudoOutros").append(montaOutros);

    console.log("_arrNomeArquivoAttachmentFiles", _arrNomeArquivoAttachmentFiles);
    console.log("_arrNomeArquivoFolder", _arrNomeArquivoFolder);

  }


  protected handler() {

    jQuery("#tabelaPreStageSoftware").hide();
    jQuery("#tabelaSetupBios").hide();
    jQuery("#tabelaCheckList").hide();
    jQuery("#tabelaSetupItensModulos").hide();
    jQuery("#tabelaFluxoAprovacaoDIPS").hide();
    jQuery("#tabelaHistorico").hide();

    var reactHandlerPreStageSoftware = this;

    jQuery.ajax({
      url: `${this.props.siteurl}/_api/web/lists/getbytitle('Pre Stage de Hardware')/items?$top=50&$orderby= Created asc&$select=ID,Title,Modelo,Fabricante,Created,Author/Title,FW,BIOS,PORT,SLOT,ItemObrigatorio,Observacao,Conexao&$expand=Author&$filter=DIP/ID eq ` + _documentoID,
      type: "GET",
      headers: { 'Accept': 'application/json; odata=verbose;' },
      success: function (resultData) {

        console.log("resultData prestage", resultData);

        if (resultData.d.results.length > 0) {

          jQuery("#tabelaPreStageSoftware").show();
          reactHandlerPreStageSoftware.setState({
            itemsListPreStageSoftware: resultData.d.results
          });

        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(jqXHR.responseText);
      }
    });

    var reactHandlerSetupBios = this;

    jQuery.ajax({
      url: `${this.props.siteurl}/_api/web/lists/getbytitle('Setup de BIOS')/items?$top=50&$orderby= Created asc&$select=ID,Title,Itens,Created,Author/Title&$expand=Author&$filter=DIP/ID eq ` + _documentoID,
      type: "GET",
      headers: { 'Accept': 'application/json; odata=verbose;' },
      success: function (resultData) {
        if (resultData.d.results.length > 0) {
          jQuery("#tabelaSetupBios").show();
          reactHandlerSetupBios.setState({
            itemsListSetupBios: resultData.d.results
          });
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(jqXHR.responseText);
      }
    });

    var reactHandlerSetupItensModulos = this;

    jQuery.ajax({
      url: `${this.props.siteurl}/_api/web/lists/getbytitle('SetupItensModulos')/items?$top=50&$orderby= Created asc&$select=ID,Title,Created,Author/Title,Parametros&$expand=Author&$filter=DIPS/ID eq ` + _documentoID,
      type: "GET",
      headers: { 'Accept': 'application/json; odata=verbose;' },
      success: function (resultData) {
        if (resultData.d.results.length > 0) {
          jQuery("#tabelaSetupItensModulos").show();
          reactHandlerSetupItensModulos.setState({
            itemsSetupItensModulos: resultData.d.results
          });
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(jqXHR.responseText);
      }
    });


    var reactHandlerCheckList = this;

    jQuery.ajax({
      url: `${this.props.siteurl}/_api/web/lists/getbytitle('Checklist')/items?$top=50&$orderby= Created asc&$select=ID,Title,Created,Author/Title,Divergencias&$expand=Author&$filter=DIPS/ID eq ` + _documentoID,
      type: "GET",
      headers: { 'Accept': 'application/json; odata=verbose;' },
      success: function (resultData) {
        if (resultData.d.results.length > 0) {
          jQuery("#tabelaCheckList").show();
          reactHandlerCheckList.setState({
            itemsCheckList: resultData.d.results
          });
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(jqXHR.responseText);
      }
    });

    var reactHandlerFluxoAprovacaoDIPS = this;

    jQuery.ajax({
      url: `${this.props.siteurl}/_api/web/lists/getbytitle('Reprovações do Suporte')/items?$top=50&$orderby=Ordem,Created&$select=ID,Title,Created,Ordem,Author/Title,VersaoReprovada,StatusAnterior,StatusAtual&$expand=Author&$filter=((DIPS/ID eq ${_documentoID}) and (StatusAnterior ne 'Alteração') and (StatusAnterior ne 'Inclusão') and (StatusAnterior ne 'Item eliminado'))`,
      type: "GET",
      headers: { 'Accept': 'application/json; odata=verbose;' },
      success: function (resultData) {
        console.log("resultData FluxoAprovacaoDIPS",resultData);
        if (resultData.d.results.length > 0) {
          jQuery("#tabelaFluxoAprovacaoDIPS").show();
          reactHandlerFluxoAprovacaoDIPS.setState({
            itemsFluxoAprovacaoDIPS: resultData.d.results
          });
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(jqXHR.responseText);
      }
    });

    var reactHandlerFluxoHistorico = this;


    jQuery.ajax({
      url: `${this.props.siteurl}/_api/web/lists/getbytitle('Reprovações do Suporte')/items?$top=50&$orderby=VersaoReprovada,Created,Ordem&$select=ID,Title,Created,Author/Title,VersaoReprovada,StatusAnterior,StatusAtual&$expand=Author&$filter=(DIPS/ID eq ${_documentoID}) and (VersaoReprovada ne '-1') and ((StatusAnterior eq 'Alteração') or (StatusAnterior eq 'Inclusão') or (StatusAnterior eq 'Item eliminado'))`,
      type: "GET",
      headers: { 'Accept': 'application/json; odata=verbose;' },
      success: function (resultData) {
        if (resultData.d.results.length > 0) {
          jQuery("#tabelaHistorico").show();
          reactHandlerFluxoHistorico.setState({
            itemsHistorico: resultData.d.results
          });
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(jqXHR.responseText);
      }
    });


  }

  protected confirmarDuplicar() {

    jQuery("#modalConfirmarDuplicar").modal({ backdrop: 'static', keyboard: false });
  }

  protected async duplicar() {

    jQuery("#modalConfirmarDuplicar").modal('hide');
    jQuery("#modalCarregando").modal({ backdrop: 'static', keyboard: false });


    var dataLiberacaoMidiaMatriz = _dtdataLiberacaoMidiaMatriz;
    var dataLiberacaoMidiaMatrizDia = dataLiberacaoMidiaMatriz.substring(0, 2);
    var dataLiberacaoMidiaMatrizMes = dataLiberacaoMidiaMatriz.substring(3, 5);
    var dataLiberacaoMidiaMatrizAno = dataLiberacaoMidiaMatriz.substring(6, 10);
    var formDataLiberacaoMidiaMatriz = dataLiberacaoMidiaMatrizAno + "-" + dataLiberacaoMidiaMatrizMes + "-" + dataLiberacaoMidiaMatrizDia;

    if (dataLiberacaoMidiaMatriz == "") formDataLiberacaoMidiaMatriz = null;

    var arquivoRoteiro = jQuery("#txtArquivoRoteiro").val();
    var responsavelGeracaoMidiaMatriz = jQuery("#txtResponsavelGeracaoMidiaMatriz").val();

    var arrInstalacaoMidiaMatriz = [];
    $.each(jQuery("input[name='checkInstalacaoMidiaMatriz']:checked"), function () {
      arrInstalacaoMidiaMatriz.push(jQuery(this).val());
    });

    var arrPacoteAdicionalSO = [];
    $.each(jQuery("input[name='checkPacoteAdicionalSO']:checked"), function () {
      arrPacoteAdicionalSO.push(jQuery(this).val());
    });

    var arrMidiaMatriz = [];
    $.each(jQuery("input[name='checkMidiaMatriz']:checked"), function () {
      arrMidiaMatriz.push(jQuery(this).val());
    });

    var sistemaOperacional = jQuery("#ddlSistemaOperacional").val();

    var vlrSistemaOpercional;

    if (sistemaOperacional == "Outros") {
      vlrSistemaOpercional = jQuery("#txtSistemaOperacionalOutros").val();
    } else {
      vlrSistemaOpercional = jQuery("#ddlSistemaOperacional").val();
    }

    var outrasInformacoes = _outrasInformacoes;

    var pacoteAdicionalSO;
    var midiaMatriz;

    if (arrPacoteAdicionalSO.length == 0) {
      pacoteAdicionalSO = null;
    } else {
      pacoteAdicionalSO = arrPacoteAdicionalSO[0];
    }

    if (arrMidiaMatriz.length == 0) {
      midiaMatriz = null;
    } else {
      midiaMatriz = arrMidiaMatriz[0];
    }


    console.log("_arrInstalacaoMidiaMatriz ", _arrInstalacaoMidiaMatriz);

    await _web.lists
      .getByTitle("Documentos")
      .items.add({
        NomeProduto: `Cópia de ${_nomeProduto}`,
        Cliente: _cliente,
        SST: _SSTJira,
        Title: _codigoIndustrial,
        PacoteAdicionalSODescricao: _descricaoPacoteAdicionalSO,
        PacoteAdicionalSOResponsavel: _responsavelPacoteAdicionalSO,
        MidiaMatrizVersaoMidia: _versaoMidiaMatriz,
        MidiaMatrizDataLiberacao: formDataLiberacaoMidiaMatriz,
        MidiaMatrizArquivoRoteiroInstala: _arquivoInstalacaoMidiaMatriz,
        MidiaMatrizResponsavelGeracao: _responsavelGeracaoMidiaMatriz,
        MidiaMatrizInstalacao: { "results": _arrInstalacaoMidiaMatriz },
        PacoteAdicionalSO: _pacoteAdicionalSO,
        MidiaMatriz: _midiaMatriz,
        SistemaOperacionalSiteNovo: _sistemaOperacional,
        OutrasInformacoes: _outrasInformacoes,
        Duplicado: "Sim"
      })
      .then(async response => {

        var documentoDuplicadoID = response.data.ID;
        _documentoDuplicadoID = documentoDuplicadoID;

        console.log("documentoDuplicadoID:", documentoDuplicadoID);
        this.upload(documentoDuplicadoID);

      })
      .catch((error: any) => {
        console.log(error);
      })
  }

  protected async upload(id): Promise<void> {

    await _web.lists.getByTitle("Imagens").rootFolder.folders.add(`${id}`).then(async data => {

      console.log("_arrNomeArquivoAttachmentFiles", _arrNomeArquivoAttachmentFiles);

      if (_arrNomeArquivoAttachmentFiles.length > 0) {

        for (var y = 0; y < _arrNomeArquivoAttachmentFiles.length; y++) {

          var relativeURL = window.location.pathname;
          var strRelativeURL = relativeURL.replace("SitePages/Documentos-Detalhes.aspx", "");

          const destinationUrl = `${strRelativeURL}/Imagens/${id}/${_arrNomeArquivoAttachmentFiles[y]}`;
          const enderecoArquivo = `${strRelativeURL}/Lists/Documentos/Attachments/${_documentoID}/${_arrNomeArquivoAttachmentFiles[y]}`;

          await this.copiarArquivo(enderecoArquivo, destinationUrl);

        }

      }


      if (_arrNomeArquivoFolder.length > 0) {

        console.log("_arrNomeArquivoFolder", _arrNomeArquivoFolder);

        for (var i = 0; i < _arrNomeArquivoFolder.length; i++) {

          var relativeURL = window.location.pathname;
          var strRelativeURL = relativeURL.replace("SitePages/Documentos-Detalhes.aspx", "");

          const destinationUrl = `${strRelativeURL}/Imagens/${id}/${_arrNomeArquivoFolder[i]}`;
          const enderecoArquivo = `${strRelativeURL}Imagens/${_documentoID}/${_arrNomeArquivoFolder[i]}`;

          await this.copiarArquivo(enderecoArquivo, destinationUrl);

        }

      }

      this.cadastrarPreStage(id);


    })
      .catch((error: any) => {
        console.log(error);
      })

  }

  protected copiarArquivo(enderecoArquivo, destinationUrl): Promise<number> {
    return new Promise<number>(resolve => {
      setTimeout(async () => {
        resolve(

          await _web.getFileByServerRelativePath(enderecoArquivo).copyTo(destinationUrl, false)

            .then(async response => {

              console.log(`duplicou arquivo "${enderecoArquivo}"!!`);

            })
            .catch((error: any) => {
              console.log(error);
            })

        );
      }, 1500);
    });
  }




  protected cadastrarPreStage(id) {

    //console.log("entrou no prestage");
    //return false;

    jQuery.ajax({
      url: `${this.props.siteurl}/_api/web/lists/getbytitle('Pre Stage de Hardware')/items?$top=50&$orderby= Created asc&$select=ID,Title,Modelo,Fabricante,Created,Author/Title,FW,BIOS,PORT,SLOT,ItemObrigatorio,Observacao,Conexao&$expand=Author&$filter=DIP/ID eq ` + _documentoID,
      type: "GET",
      headers: { 'Accept': 'application/json; odata=verbose;' },
      success: async (resultData) => {

        if (resultData.d.results.length > 0) {

          var ultimo = (resultData.d.results.length) - 1;

          for (var i = 0; i < resultData.d.results.length; i++) {

            await _web.lists
              .getByTitle("Pre Stage de Hardware")
              .items.add({
                DIPId: id,
                Title: resultData.d.results[i].Title,
                Modelo: resultData.d.results[i].Modelo,
                Fabricante: resultData.d.results[i].Fabricante,
                FW: resultData.d.results[i].FW,
                BIOS: resultData.d.results[i].BIOS,
                Conexao: resultData.d.results[i].Conexao,
                PORT: resultData.d.results[i].PORT,
                SLOT: resultData.d.results[i].SLOT,
                ItemObrigatorio: resultData.d.results[i].ItemObrigatorio,
                Observacao: resultData.d.results[i].Observacao,
              })
              .then(response => {

                console.log(`duplicou prestage: ultimo: ${ultimo} - i: ${i}`);
                if (ultimo == i) this.cadastrarSetupBIOS(id);

              })
              .catch((error: any) => {
                console.log(error);
              })

          }

        } else this.cadastrarSetupBIOS(id);

      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(jqXHR.responseText);
      }
    });


  }

  protected cadastrarSetupBIOS(id) {

    console.log("entrou no duplicar cadastrarSetupBIOS");

    jQuery.ajax({
      url: `${this.props.siteurl}/_api/web/lists/getbytitle('Setup de BIOS')/items?$top=50&$orderby= Created asc&$select=ID,Title,Itens,Created,Author/Title&$expand=Author&$filter=DIP/ID eq ` + _documentoID,
      type: "GET",
      headers: { 'Accept': 'application/json; odata=verbose;' },
      success: async (resultData) => {

        if (resultData.d.results.length > 0) {

          var ultimo = (resultData.d.results.length) - 1;

          for (var i = 0; i < resultData.d.results.length; i++) {

            await _web.lists
              .getByTitle("Setup de BIOS")
              .items.add({
                DIPId: id,
                Title: resultData.d.results[i].Title,
                Itens: resultData.d.results[i].Itens,
              })
              .then(response => {

                console.log(`duplicou setup BIOS: ultimo: ${ultimo} - i: ${i}`);

                if (ultimo == i) this.cadastrarModulos(id);

              })
              .catch((error: any) => {
                console.log(error);
              })

          }


        } else this.cadastrarModulos(id);

      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(jqXHR.responseText);
      }
    });


  }

  protected cadastrarModulos(id) {

    jQuery.ajax({
      url: `${this.props.siteurl}/_api/web/lists/getbytitle('SetupItensModulos')/items?$top=50&$orderby= Created asc&$select=ID,Title,Created,Author/Title,Parametros&$expand=Author&$filter=DIPS/ID eq ` + _documentoID,
      type: "GET",
      headers: { 'Accept': 'application/json; odata=verbose;' },
      success: async (resultData) => {

        if (resultData.d.results.length > 0) {

          for (var i = 0; i < resultData.d.results.length; i++) {

            var ultimo = (resultData.d.results.length) - 1;

            await _web.lists
              .getByTitle("SetupItensModulos")
              .items.add({
                DIPSId: id,
                Title: resultData.d.results[i].Title,
                Parametros: resultData.d.results[i].Parametros,
              })
              .then(response => {

                console.log(`duplicou modulos: ultimo: ${ultimo} - i: ${i}`);
                if (ultimo == i) this.cadastrarCheckList(id);

              })
              .catch((error: any) => {
                console.log(error);
              })

          }

        } else this.cadastrarCheckList(id);

      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(jqXHR.responseText);
      }
    });


  }


  protected cadastrarCheckList(id) {

    jQuery.ajax({
      url: `${this.props.siteurl}/_api/web/lists/getbytitle('Checklist')/items?$top=50&$orderby= Created asc&$select=ID,Title,Created,Author/Title,Divergencias&$expand=Author&$filter=DIPS/ID eq ` + _documentoID,
      type: "GET",
      headers: { 'Accept': 'application/json; odata=verbose;' },
      success: async (resultData) => {

        if (resultData.d.results.length > 0) {

          var ultimo = (resultData.d.results.length) - 1;

          for (var i = 0; i < resultData.d.results.length; i++) {

            await _web.lists
              .getByTitle("Checklist")
              .items.add({
                DIPSId: id,
                Title: resultData.d.results[i].Title,
                Divergencias: resultData.d.results[i].Divergencias,
              })
              .then(response => {

                console.log(`duplicou checklist: ultimo: ${ultimo} - i: ${i}`);

                jQuery("#modalCarregando").modal('hide');
                jQuery("#modalSucessoDuplicar").modal({ backdrop: 'static', keyboard: false });

              })
              .catch((error: any) => {
                console.log(error);
              })

          }

        } else {

          jQuery("#modalCarregando").modal('hide');
          jQuery("#modalSucessoDuplicar").modal({ backdrop: 'static', keyboard: false });

        }

      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(jqXHR.responseText);
      }
    });

  }

  protected confirmarExcluirDIPS() {

    jQuery("#modalConfirmarExcluirDIPS").modal({ backdrop: 'static', keyboard: false });

  }

  protected print() {
    window.print();
  }

  protected voltar() {
    history.back();
  }

  protected editar() {
    window.location.href = `Documentos-Editar.aspx?DocumentoID=` + _documentoID;
  }

  protected async fecharSucesso() {

    jQuery("#modalSucessoDuplicar").modal('hide');
    window.location.href = `Documentos-Editar.aspx?DocumentoID=` + _documentoDuplicadoID;

  }

  protected async fecharSucessoExcluirDIPS() {

    jQuery("#modalSucessoExcluirDIPS").modal('hide');
    window.location.href = `Documentos-Todos.aspx`;

  }

  protected async excluirDIPS() {

    jQuery("#btnExcluirDIPS").prop("disabled", true);

    const list = _web.lists.getByTitle("Documentos");
    await list.items.getById(_documentoID).recycle()
      .then(async response => {
        console.log("Item excluido!");
        jQuery("#modalConfirmarExcluirDIPS").modal('hide');
        jQuery("#modalSucessoExcluirDIPS").modal({ backdrop: 'static', keyboard: false });
      })
      .catch((error: any) => {
        console.log(error);

      })

  }

  protected async mostraOculta(heading, up, down) {

    var val = jQuery(`#${heading}`).attr('aria-expanded');

    console.log("val", val);

    if (val == "true") {

      jQuery(`#${down}`).css("display", "block");
      jQuery(`#${up}`).css("display", "none");

    }
    else {

      jQuery(`#${down}`).css("display", "none");
      jQuery(`#${up}`).css("display", "block");



    }



  }


}
