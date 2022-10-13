import * as React from 'react';
import { IDipsEditarDocumentoProps } from './IDipsEditarDocumentoProps';
import * as jquery from 'jquery';
import * as $ from "jquery";
import * as jQuery from "jquery";
import { sp, IItemAddResult, DateTimeFieldFormatType } from "@pnp/sp/presets/all";
import "bootstrap";
import "@pnp/sp/webs";
import "@pnp/sp/folders";
import { Web } from "sp-pnp-js";
import { allowOverscrollOnElement, DatePicker } from 'office-ui-fabric-react';
import { RichText } from "@pnp/spfx-controls-react/lib/RichText";
import { UrlQueryParameterCollection, Version } from '@microsoft/sp-core-library';
import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import { OutTable, ExcelRenderer } from 'react-excel-renderer';

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
var _dataLiberacaoMidiaMatriz;
var _instalacaoMidiaMatriz = [];
var _arrEmailElaboracao = [];
var _pacoteAdicionalSO = [];
var _midiaMatriz = [];
var _pos = 0;
var _pos2 = 0;
var _idParaExcluir;
var _preStageSoftwareObservacao = "";
var _preStageSoftwareObservacaoEditar = "";
var _setupBIOSParametrosEditar = "";
var _modulosParametrosEditar = "";
var _checkListDivergenciasEditar = "";
var _setupBIOSParametros = "";
var _modulosParametros = "";
var _checkListDivergencias = "";
var _idParaExcluirPreStage;
var _outrasInformacoes = "";
var _pastaCriada = "";
var _representante;
var _arrAreaTexto = [];
var _areaAnexo;
var _arrAreaId = [];
var _size: number = 0;
var _status;
var _versao;
var _novaVersao = 0;
var _grupos = [];
var _novoStatus;

var _nomeProdutoAtual;
var _clienteAtual;
var _SSTJiraAtual;
var _codigoIndustrialAtual;
var _descricaoPacoteAdicionalSOAtual;
var _responsavelPacoteAdicionalSOAtual;
var _versaoMidiaMatrizAtual;
var _dataLiberacaoMidiaMatrizAtual;
var _arquivoInstalacaoMidiaMatrizAtual;
var _responsavelGeracaoMidiaMatrizAtual;
var _instalacaoMidiaMatrizAtual = [];
var _pacoteAdicionalSOAtual;
var _midiaMatrizAtual;
var _sistemaOperacionalAtual;
var _outrasInformacoesatual;
var _arrAlteracoesFormPrincipal = [];
var _arrAlteracoesPreStage = [];
var _colunasExcel = [];
var _duplicado;

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
  itemsListImagensItem: [
    {
      "FileName": any,
      "ServerRelativeUrl": any,
    }
  ],
  itemsListImagens: [
    {
      "Name": any,
      "ServerRelativeUrl": any,
    }
  ],
  itemsPacoteAdicionalSO: [],
  itemsMidiaMatriz: [],
  itemsInstalacaoMidiaMatriz: [],
  addUsersResponsavelEngenhariaHardware: [],
  itemsListPreStageSoftware: [],
  itemsListSetupBios: [],
  itemsCheckList: [],
  itemsSetupItensModulos: [],
  itemsFluxoAprovacaoDIPS: [],
  itemsHistorico: [],
  valorItemsCliente: "",
  valorObservacao: "",
  valorSistemaOperacional: "",
  cols: [],
  rows: [],
}

const customFilter = textFilter({
  placeholder: ' ',  // custom the input placeholder
});

const tablecolumnsPreStageSoftware = [
  {
    dataField: "Title",
    text: "Componente",
    headerStyle: { "backgroundColor": "#bee5eb" },
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
    headerStyle: { "backgroundColor": "#bee5eb" },
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
    headerStyle: { "backgroundColor": "#bee5eb" },
    classes: 'headerPreStage',
    headerClasses: 'text-center',
    formatter: (rowContent, row) => {
      var valor = row.Fabricante;
      if (valor == "undefined") valor = "";
      return valor;
    }
  },
  {
    dataField: "Created",
    text: "Data de criação",
    headerStyle: { "backgroundColor": "#bee5eb" },
    classes: 'headerPreStage text-center',
    headerClasses: 'text-center',
    formatter: (rowContent, row) => {
      var dataCriacao = new Date(row.Created);
      var dtdataCriacao = ("0" + dataCriacao.getDate()).slice(-2) + '/' + ("0" + (dataCriacao.getMonth() + 1)).slice(-2) + '/' + dataCriacao.getFullYear() + ' ' + ("0" + (dataCriacao.getHours())).slice(-2) + ':' + ("0" + (dataCriacao.getMinutes())).slice(-2);
      return dtdataCriacao;
    }
  },
  {
    dataField: "Author.Title",
    classes: 'headerPreStage',
    headerClasses: 'text-center',
    text: "Criado por",
    headerStyle: { "backgroundColor": "#bee5eb" },
  },
  {
    dataField: "",
    text: "",
    headerStyle: { "backgroundColor": "#bee5eb", "width": "210px" },
    headerClasses: 'text-center',
    formatter: (rowContent, row) => {
      var id = row.ID;

      var mostraBotao = false;

      if (_status == "Em elaboração (Engenharia)") {

        if (_grupos.indexOf("DIPS - Engenharia (Elaborador)") !== -1) {

          mostraBotao = true;

        }

      }

      else if (_status == "Em revisão (Engenharia)") {

        if (_grupos.indexOf("DIPS - Engenharia (Elaborador)") !== -1) {

          mostraBotao = true;

        }

      }

      else if (_status == "Em revisão (Suporte)") {

        if (_grupos.indexOf("DIPS - Suporte") !== -1) {

          mostraBotao = true;

        }

      }

      else if (_status == "Aguardando aprovação do Suporte") {

        if (_grupos.indexOf("DIPS - Suporte") !== -1) {

          if (_versao == "-1") {

            mostraBotao = true;

          }

        }

      }

      if (mostraBotao) {

        return (
          <>
            <div>
              <button onClick={async () => {

                if (confirm("Deseja realmente excluir o Pre Stage de Hardware: " + row.Title + "?") == true) {

                  const list = _web.lists.getByTitle("Pre Stage de Hardware");
                  await list.items.getById(id).recycle()
                    .then(async response => {

                      var texto = `O item ${row.Title} foi eliminado da lista Pre Stage de Hardware`

                      await _web.lists
                        .getByTitle("Reprovações do Suporte")
                        .items.add({
                          Title: texto,
                          DIPSId: _documentoID,
                          VersaoReprovada: _versao.toString(),
                          StatusAnterior: "Item eliminado",
                          StatusAtual: _status
                        })
                        .then(response => {

                          console.log("Item excluido!");
                          jQuery("#modalSucessoExcluirPreStage").modal({ backdrop: 'static', keyboard: false });

                        })
                        .catch((error: any) => {
                          console.log(error);
                        })


                    })
                    .catch((error: any) => {
                      console.log(error);

                    })


                } else {

                  return false.valueOf;
                }




              }} className="btn btn-info btnCustom btn-sm btnEdicaoListas">Excluir</button>&nbsp;


              <button onClick={() => {

                jQuery('#txtID').val(row.ID);
                jQuery('#txtComponenteEditar').val(row.Title);
                jQuery('#txtModeloEditar').val(row.Modelo);
                jQuery('#txtFabricanteEditar').val(row.Fabricante);
                jQuery('#txtFWEditar').val(row.FW);
                jQuery('#txtBIOSEditar').val(row.BIOS);
                jQuery('#txtConexaoEditar').val(row.Conexao);
                jQuery('#txtPORTEditar').val(row.PORT);
                jQuery('#txtSLOTEditar').val(row.SLOT);
                jQuery('#txtItemObrigatorioEditar').val(row.ItemObrigatorio);

                var observacao = row.Observacao;
                var txtObservacao = "";

                console.log("observacao", observacao);

                if (observacao != null) {

                  txtObservacao = observacao.replace(/<[\/]{0,1}(div)[^><]*>/g, "");
                  console.log("txtObservacao", txtObservacao);

                  if (txtObservacao.includes("<font")) {

                    txtObservacao = txtObservacao.replace("font", "span");
                    txtObservacao = txtObservacao.replace("font", "span");

                  }

                  if (txtObservacao.includes("color")) {

                    txtObservacao = txtObservacao.replace('color="', 'style="color:');

                  }

                  txtObservacao = txtObservacao.trim();

                }

                console.log("txtObservacao", txtObservacao);

                jQuery('#RichTextObservacao').find('.ql-editor').html(`${txtObservacao}`);

                _preStageSoftwareObservacaoEditar = observacao;

                jQuery("#modalEditarPreStageSoftware").modal({ backdrop: 'static', keyboard: false })

              }} className="btn btn-info btnCustom btn-sm btnEdicaoListas">Editar</button>&nbsp;




              <button onClick={() => {

                var dataCriacao = new Date(row.Created);
                var dtdataCriacao = ("0" + dataCriacao.getDate()).slice(-2) + '/' + ("0" + (dataCriacao.getMonth() + 1)).slice(-2) + '/' + dataCriacao.getFullYear() + ' ' + ("0" + (dataCriacao.getHours())).slice(-2) + ':' + ("0" + (dataCriacao.getMinutes())).slice(-2);

                var componente = row.Title;
                var modelo = row.Modelo;
                var fabricante = row.Fabricante;
                var FW = row.FW;
                var BIOS = row.BIOS;
                var conexao = row.Conexao;
                var PORT = row.PORT;
                var SLOT = row.SLOT;
                var itemObrigatorio = row.ItemObrigatorio;
                var observacao = row.Observacao;

                console.log("observacao", observacao);

                if (componente == "undefined") componente = "";
                if (modelo == "undefined") modelo = "";
                if (fabricante == "undefined") fabricante = "";
                if (FW == "undefined") FW = "";
                if (BIOS == "undefined") BIOS = "";
                if (conexao == "undefined") conexao = "";
                if (PORT == "undefined") PORT = "";
                if (SLOT == "undefined") SLOT = "";
                if (itemObrigatorio == "undefined") itemObrigatorio = "";

                if (observacao != null) if (observacao.includes("undefined")) observacao = "";

                jQuery('#txtComponente').html(componente);
                jQuery('#txtModelo').html(modelo);
                jQuery('#txtFabricante').html(fabricante);
                jQuery('#txtFW').html(FW);
                jQuery('#txtBIOS').html(BIOS);
                jQuery('#txtConexao').html(conexao);
                jQuery('#txtPORT').html(PORT);
                jQuery('#txtSLOT').html(SLOT);
                jQuery('#txtItemObrigatorio').html(itemObrigatorio);
                jQuery('#txtObservacao').html(observacao);
                jQuery('#txtCriado').html(dtdataCriacao);
                jQuery('#txtCriadoPor').html(row.Author.Title);
                jQuery("#modalDetalhesPreStageSoftware").modal({ backdrop: 'static', keyboard: false })

              }} className="btn btn-info btnCustom btn-sm ">Detalhes</button>
            </div>
          </>
        )

      }
      else {

        return (
          <>
            <div>

              <button onClick={() => {

                var dataCriacao = new Date(row.Created);
                var dtdataCriacao = ("0" + dataCriacao.getDate()).slice(-2) + '/' + ("0" + (dataCriacao.getMonth() + 1)).slice(-2) + '/' + dataCriacao.getFullYear() + ' ' + ("0" + (dataCriacao.getHours())).slice(-2) + ':' + ("0" + (dataCriacao.getMinutes())).slice(-2);

                var componente = row.Title;
                var modelo = row.Modelo;
                var fabricante = row.Fabricante;
                var FW = row.FW;
                var BIOS = row.BIOS;
                var conexao = row.Conexao;
                var PORT = row.PORT;
                var SLOT = row.SLOT;
                var itemObrigatorio = row.ItemObrigatorio;
                var observacao = row.Observacao;

                console.log("observacao", observacao);

                if (componente == "undefined") componente = "";
                if (modelo == "undefined") modelo = "";
                if (fabricante == "undefined") fabricante = "";
                if (FW == "undefined") FW = "";
                if (BIOS == "undefined") BIOS = "";
                if (conexao == "undefined") conexao = "";
                if (PORT == "undefined") PORT = "";
                if (SLOT == "undefined") SLOT = "";
                if (itemObrigatorio == "undefined") itemObrigatorio = "";

                if (observacao != null) if (observacao.includes("undefined")) observacao = "";

                jQuery('#txtComponente').html(componente);
                jQuery('#txtModelo').html(modelo);
                jQuery('#txtFabricante').html(fabricante);
                jQuery('#txtFW').html(FW);
                jQuery('#txtBIOS').html(BIOS);
                jQuery('#txtConexao').html(conexao);
                jQuery('#txtPORT').html(PORT);
                jQuery('#txtSLOT').html(SLOT);
                jQuery('#txtItemObrigatorio').html(itemObrigatorio);
                jQuery('#txtObservacao').html(observacao);
                jQuery('#txtCriado').html(dtdataCriacao);
                jQuery('#txtCriadoPor').html(row.Author.Title);
                jQuery("#modalDetalhesPreStageSoftware").modal({ backdrop: 'static', keyboard: false })

              }} className="btn btn-info btnCustom btn-sm ">Detalhes</button>
            </div>
          </>
        )



      }

    }
  }


]

const tablecolumnsSetupBios = [
  {
    dataField: "Title",
    text: "Itens",
    headerStyle: { backgroundColor: '#bee5eb' },
  },
  {
    dataField: "Itens",
    text: "Parâmetros",
    headerStyle: { backgroundColor: '#bee5eb' },

    formatter: (rowContent, row) => {

      return <div dangerouslySetInnerHTML={{ __html: `${row.Itens}` }} />;
    },

  },
  {
    dataField: "Created",
    text: "Data de criação",
    headerStyle: { backgroundColor: '#bee5eb' },
    classes: 'text-center',
    formatter: (rowContent, row) => {
      var dataCriacao = new Date(row.Created);
      var dtdataCriacao = ("0" + dataCriacao.getDate()).slice(-2) + '/' + ("0" + (dataCriacao.getMonth() + 1)).slice(-2) + '/' + dataCriacao.getFullYear() + ' ' + ("0" + (dataCriacao.getHours())).slice(-2) + ':' + ("0" + (dataCriacao.getMinutes())).slice(-2);
      return dtdataCriacao;
    }
  },
  {
    dataField: "Author.Title",
    text: "Criado por",
    headerStyle: { backgroundColor: '#bee5eb' },
  },
  {
    dataField: "",
    text: "",
    headerStyle: { "backgroundColor": "#bee5eb", "width": "210px" },
    formatter: (rowContent, row) => {

      var id = row.ID;

      var mostraBotao = false;

      if (_status == "Em elaboração (Engenharia)") {

        if (_grupos.indexOf("DIPS - Engenharia (Elaborador)") !== -1) {

          mostraBotao = true;

        }

      }

      else if (_status == "Em revisão (Engenharia)") {

        if (_grupos.indexOf("DIPS - Engenharia (Elaborador)") !== -1) {

          mostraBotao = true;

        }

      }

      else if (_status == "Em revisão (Suporte)") {

        if (_grupos.indexOf("DIPS - Suporte") !== -1) {

          mostraBotao = true;

        }

      }

      else if (_status == "Aguardando aprovação do Suporte") {

        if (_grupos.indexOf("DIPS - Suporte") !== -1) {

          if (_versao == "-1") {

            mostraBotao = true;

          }

        }

      }


      if (mostraBotao) {

        return (
          <>
            <button onClick={async () => {

              if (confirm("Deseja realmente excluir o Setup de BIOS: " + row.Title + "?") == true) {

                const list = _web.lists.getByTitle("Setup de BIOS");
                await list.items.getById(id).recycle()
                  .then(async response => {

                    var texto = `O item ${row.Title} foi eliminado da lista Setup de BIOS`

                    await _web.lists
                      .getByTitle("Reprovações do Suporte")
                      .items.add({
                        Title: texto,
                        DIPSId: _documentoID,
                        VersaoReprovada: _versao.toString(),
                        StatusAnterior: "Item eliminado",
                        StatusAtual: _status
                      })
                      .then(response => {

                        console.log("Item excluido!");
                        jQuery("#modalSucessoExcluirSetupBIOS").modal({ backdrop: 'static', keyboard: false });

                      })
                      .catch((error: any) => {
                        console.log(error);
                      })



                  })
                  .catch((error: any) => {
                    console.log(error);

                  })

              } else {

                return false.valueOf;
              }

            }} className="btn btn-info btnCustom btn-sm btnEdicaoListas">Excluir</button>&nbsp;
            <button onClick={() => {

              jQuery('#txtSetupBIOSID').val(row.ID);
              jQuery('#txtItensSetupBIOSEditar').val(row.Title);
              jQuery('#txtParametrosSetupBIOSEditar').val(row.Itens);

              var parametros = row.Itens;

              var txtParametros = "";

              if (parametros != null) {

                txtParametros = parametros.replace(/<[\/]{0,1}(div)[^><]*>/g, "");
                console.log("txtParametros", txtParametros);

                if (txtParametros.includes("<font")) {

                  txtParametros = txtParametros.replace("font", "span");
                  txtParametros = txtParametros.replace("font", "span");

                }

                if (txtParametros.includes("color")) {

                  txtParametros = txtParametros.replace('color="', 'style="color:');

                }

                txtParametros = txtParametros.trim();

              }

              jQuery('#RichTextParametrosSetupBIOSEditar').find('.ql-editor').html(`${txtParametros}`);

              _setupBIOSParametrosEditar = parametros;

              jQuery("#modalEditarSetupBIOS").modal({ backdrop: 'static', keyboard: false })

            }} className="btn btn-info btnCustom btn-sm btnEdicaoListas">Editar</button>&nbsp;

            <button onClick={() => {

              var dataCriacao = new Date(row.Created);
              var dtdataCriacao = ("0" + dataCriacao.getDate()).slice(-2) + '/' + ("0" + (dataCriacao.getMonth() + 1)).slice(-2) + '/' + dataCriacao.getFullYear() + ' ' + ("0" + (dataCriacao.getHours())).slice(-2) + ':' + ("0" + (dataCriacao.getMinutes())).slice(-2);

              jQuery('#txtItensBIOS').html(row.Title);
              jQuery('#txtParametrosBIOS').html(row.Itens);
              jQuery('#txtCriadoSetupBIOS').html(dtdataCriacao);
              jQuery('#txtCriadoPorSetupBIOS').html(row.Author.Title);
              jQuery("#modalDetalhesSetupBIOS").modal({ backdrop: 'static', keyboard: false })

            }} className="btn btn-info btnCustom btn-sm">Detalhes</button>

          </>
        )
      }
      else {

        return (
          <>
            <button onClick={() => {

              var dataCriacao = new Date(row.Created);
              var dtdataCriacao = ("0" + dataCriacao.getDate()).slice(-2) + '/' + ("0" + (dataCriacao.getMonth() + 1)).slice(-2) + '/' + dataCriacao.getFullYear() + ' ' + ("0" + (dataCriacao.getHours())).slice(-2) + ':' + ("0" + (dataCriacao.getMinutes())).slice(-2);

              jQuery('#txtItensBIOS').html(row.Title);
              jQuery('#txtParametrosBIOS').html(row.Itens);
              jQuery('#txtCriadoSetupBIOS').html(dtdataCriacao);
              jQuery('#txtCriadoPorSetupBIOS').html(row.Author.Title);
              jQuery("#modalDetalhesSetupBIOS").modal({ backdrop: 'static', keyboard: false })

            }} className="btn btn-info btnCustom btn-sm">Detalhes</button>

          </>
        )

      }

    }
  }

]

const tablecolumnsSetupitensModulos = [
  {
    dataField: "Title",
    text: "Itens",
    headerStyle: { backgroundColor: '#bee5eb' },
  },
  {
    dataField: "Parametros",
    text: "Parâmetros",
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
    formatter: (rowContent, row) => {
      var dataCriacao = new Date(row.Created);
      var dtdataCriacao = ("0" + dataCriacao.getDate()).slice(-2) + '/' + ("0" + (dataCriacao.getMonth() + 1)).slice(-2) + '/' + dataCriacao.getFullYear() + ' ' + ("0" + (dataCriacao.getHours())).slice(-2) + ':' + ("0" + (dataCriacao.getMinutes())).slice(-2);
      return dtdataCriacao;
    }
  },
  {
    dataField: "Author.Title",
    text: "Criado por",
    headerStyle: { backgroundColor: '#bee5eb' },
  },
  {
    dataField: "",
    text: "",
    headerStyle: { "backgroundColor": "#bee5eb", "width": "210px" },
    formatter: (rowContent, row) => {

      var id = row.ID;

      var mostraBotao = false;

      if (_status == "Em elaboração (Engenharia)") {

        if (_grupos.indexOf("DIPS - Engenharia (Elaborador)") !== -1) {

          mostraBotao = true;

        }

      }

      else if (_status == "Em revisão (Engenharia)") {

        if (_grupos.indexOf("DIPS - Engenharia (Elaborador)") !== -1) {

          mostraBotao = true;

        }

      }

      else if (_status == "Em revisão (Suporte)") {

        if (_grupos.indexOf("DIPS - Suporte") !== -1) {

          mostraBotao = true;

        }

      }

      else if (_status == "Aguardando aprovação do Suporte") {

        if (_grupos.indexOf("DIPS - Suporte") !== -1) {

          if (_versao == "-1") {

            mostraBotao = true;

          }

        }

      }

      if (mostraBotao) {

        return (
          <>
            <button onClick={async () => {

              if (confirm("Deseja realmente excluir o Módulo: " + row.Title + "?") == true) {

                const list = _web.lists.getByTitle("SetupItensModulos");
                await list.items.getById(id).recycle()
                  .then(async response => {

                    var texto = `O item ${row.Title} foi eliminado da lista Setup de Itens/Módulos`

                    await _web.lists
                      .getByTitle("Reprovações do Suporte")
                      .items.add({
                        Title: texto,
                        DIPSId: _documentoID,
                        VersaoReprovada: _versao.toString(),
                        StatusAnterior: "Item eliminado",
                        StatusAtual: _status
                      })
                      .then(response => {

                        console.log("Item excluido!");
                        jQuery("#modalSucessoExcluirModulos").modal({ backdrop: 'static', keyboard: false });

                      })
                      .catch((error: any) => {
                        console.log(error);
                      })


                  })
                  .catch((error: any) => {
                    console.log(error);

                  })

              } else {

                return false.valueOf;
              }

            }} className="btn btn-info btnCustom btn-sm btnEdicaoListas">Excluir</button>&nbsp;
            <button onClick={() => {

              jQuery('#txtModulosID').val(row.ID);
              jQuery('#txtItensModulosEditar').val(row.Title);
              //jQuery('#txtParametrosSetupBIOSEditar').val(row.Itens);

              var parametros = row.Parametros;
              var txtParametros = "";

              console.log("parametros", parametros);

              if (parametros != null) {

                txtParametros = parametros.replace(/<[\/]{0,1}(div)[^><]*>/g, "");
                console.log("txtParametros", txtParametros);

                if (txtParametros.includes("<font")) {

                  txtParametros = txtParametros.replace("font", "span");
                  txtParametros = txtParametros.replace("font", "span");

                }

                if (txtParametros.includes("color")) {

                  txtParametros = txtParametros.replace('color="', 'style="color:');

                }

                txtParametros = txtParametros.trim();

              }

              jQuery('#RichTextParametrosModulosEditar').find('.ql-editor').html(`${txtParametros}`);


              _modulosParametros = parametros;

              jQuery("#modalEditarModulos").modal({ backdrop: 'static', keyboard: false })

            }} className="btn btn-info btnCustom btn-sm btnEdicaoListas">Editar</button>&nbsp;

            <button onClick={() => {

              var dataCriacao = new Date(row.Created);
              var dtdataCriacao = ("0" + dataCriacao.getDate()).slice(-2) + '/' + ("0" + (dataCriacao.getMonth() + 1)).slice(-2) + '/' + dataCriacao.getFullYear() + ' ' + ("0" + (dataCriacao.getHours())).slice(-2) + ':' + ("0" + (dataCriacao.getMinutes())).slice(-2);

              jQuery('#txtParametrosModulo').html(row.Parametros);
              jQuery('#txtItensModulos').html(row.Title);
              jQuery('#txtCriadoModulos').html(dtdataCriacao);
              jQuery('#txtCriadoPorModulos').html(row.Author.Title);
              jQuery("#modalDetalhesModulos").modal({ backdrop: 'static', keyboard: false })

            }} className="btn btn-info btnCustom btn-sm">Detalhes</button>

          </>
        )
      }

      else {

        return (
          <>

            <button onClick={() => {

              var dataCriacao = new Date(row.Created);
              var dtdataCriacao = ("0" + dataCriacao.getDate()).slice(-2) + '/' + ("0" + (dataCriacao.getMonth() + 1)).slice(-2) + '/' + dataCriacao.getFullYear() + ' ' + ("0" + (dataCriacao.getHours())).slice(-2) + ':' + ("0" + (dataCriacao.getMinutes())).slice(-2);

              jQuery('#txtParametrosModulo').html(row.Parametros);
              jQuery('#txtItensModulos').html(row.Title);
              jQuery('#txtCriadoModulos').html(dtdataCriacao);
              jQuery('#txtCriadoPorModulos').html(row.Author.Title);
              jQuery("#modalDetalhesModulos").modal({ backdrop: 'static', keyboard: false })

            }} className="btn btn-info btnCustom btn-sm">Detalhes</button>

          </>
        )

      }

    }
  }


]

const tablecolumnsCheckList = [
  {
    dataField: "Title",
    text: "S/N",
    headerClasses: 'text-center',
    headerStyle: { backgroundColor: '#bee5eb' },
  },
  {
    dataField: "Divergencias",
    text: "Divergências",
    headerClasses: 'text-center',
    headerStyle: { backgroundColor: '#bee5eb' },
    formatter: (rowContent, row) => {

      return <div dangerouslySetInnerHTML={{ __html: `${row.Divergencias}` }} />;

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
      var dtdataCriacao = ("0" + dataCriacao.getDate()).slice(-2) + '/' + ("0" + (dataCriacao.getMonth() + 1)).slice(-2) + '/' + dataCriacao.getFullYear() + ' ' + ("0" + (dataCriacao.getHours())).slice(-2) + ':' + ("0" + (dataCriacao.getMinutes())).slice(-2);
      return dtdataCriacao;
    }
  },
  {
    dataField: "Author.Title",
    text: "Criado por",
    headerClasses: 'text-center',
    headerStyle: { backgroundColor: '#bee5eb' },
  },
  {
    dataField: "",
    text: "",
    headerStyle: { "backgroundColor": "#bee5eb", "width": "210px" },
    headerClasses: 'text-center',
    formatter: (rowContent, row) => {

      var id = row.ID;

      var mostraBotao = false;

      if (_status == "Em elaboração (Engenharia)") {

        if (_grupos.indexOf("DIPS - Engenharia (Elaborador)") !== -1) {

          mostraBotao = true;

        }

      }

      else if (_status == "Em revisão (Engenharia)") {

        if (_grupos.indexOf("DIPS - Engenharia (Elaborador)") !== -1) {

          mostraBotao = true;

        }

      }

      else if (_status == "Em revisão (Suporte)") {

        if (_grupos.indexOf("DIPS - Suporte") !== -1) {

          mostraBotao = true;

        }

      }

      else if (_status == "Aguardando aprovação do Suporte") {

        if (_grupos.indexOf("DIPS - Suporte") !== -1) {

          if (_versao == "-1") {

            mostraBotao = true;

          }

        }

      }


      if (mostraBotao) {
        return (
          <>
            <button onClick={async () => {

              if (confirm("Deseja realmente excluir o Checklist: " + row.Title + "?") == true) {

                const list = _web.lists.getByTitle("Checklist");
                await list.items.getById(id).recycle()
                  .then(async response => {

                    var texto = `O item ${row.Title} foi eliminado da lista Checklist`

                    await _web.lists
                      .getByTitle("Reprovações do Suporte")
                      .items.add({
                        Title: texto,
                        DIPSId: _documentoID,
                        VersaoReprovada: _versao.toString(),
                        StatusAnterior: "Item eliminado",
                        StatusAtual: _status
                      })
                      .then(response => {

                        console.log("Item excluido!");
                        jQuery("#modalSucessoExcluirCheckList").modal({ backdrop: 'static', keyboard: false });

                      })
                      .catch((error: any) => {
                        console.log(error);
                      })



                  })
                  .catch((error: any) => {
                    console.log(error);

                  })

              } else {

                return false.valueOf;
              }

            }} className="btn btn-info btnCustom btn-sm btnEdicaoListas">Excluir</button>&nbsp;
            <button onClick={() => {

              jQuery('#txtCheckListID').val(row.ID);
              jQuery('#txtSNEditarCheckList').val(row.Title);
              jQuery('#txtParametrosSetupBIOSEditar').val(row.Itens);

              var divergencias = row.Divergencias;
              var txtDivergencias = "";

              console.log("divergencias", divergencias);

              if (divergencias != null) {

                txtDivergencias = divergencias.replace(/<[\/]{0,1}(div)[^><]*>/g, "");
                console.log("txtParametros", txtDivergencias);

                if (txtDivergencias.includes("<font")) {

                  txtDivergencias = txtDivergencias.replace("font", "span");
                  txtDivergencias = txtDivergencias.replace("font", "span");

                }

                if (txtDivergencias.includes("color")) {

                  txtDivergencias = txtDivergencias.replace('color="', 'style="color:');

                }

                txtDivergencias = txtDivergencias.trim();

              }

              jQuery('#RichTextCheckListEditar').find('.ql-editor').html(`${txtDivergencias}`);

              jQuery("#modalEditarCheckList").modal({ backdrop: 'static', keyboard: false })

            }} className="btn btn-info btnCustom btn-sm btnEdicaoListas">Editar</button>&nbsp;

            <button onClick={() => {

              var dataCriacao = new Date(row.Created);
              var dtdataCriacao = ("0" + dataCriacao.getDate()).slice(-2) + '/' + ("0" + (dataCriacao.getMonth() + 1)).slice(-2) + '/' + dataCriacao.getFullYear() + ' ' + ("0" + (dataCriacao.getHours())).slice(-2) + ':' + ("0" + (dataCriacao.getMinutes())).slice(-2);

              jQuery('#txtSN').html(row.Title);
              jQuery('#txtDivergencias').html(row.Divergencias);
              jQuery('#txtCriadoCheckList').html(dtdataCriacao);
              jQuery('#txtCriadoPorCheckList').html(row.Author.Title);
              jQuery("#modalDetalhesCheckList").modal({ backdrop: 'static', keyboard: false })

            }} className="btn btn-info btnCustom btn-sm">Detalhes</button>

          </>
        )
      } else {

        return (
          <>
            <button onClick={() => {

              var dataCriacao = new Date(row.Created);
              var dtdataCriacao = ("0" + dataCriacao.getDate()).slice(-2) + '/' + ("0" + (dataCriacao.getMonth() + 1)).slice(-2) + '/' + dataCriacao.getFullYear() + ' ' + ("0" + (dataCriacao.getHours())).slice(-2) + ':' + ("0" + (dataCriacao.getMinutes())).slice(-2);

              jQuery('#txtSN').html(row.Title);
              jQuery('#txtDivergencias').html(row.Divergencias);
              jQuery('#txtCriadoCheckList').html(dtdataCriacao);
              jQuery('#txtCriadoPorCheckList').html(row.Author.Title);
              jQuery("#modalDetalhesCheckList").modal({ backdrop: 'static', keyboard: false })

            }} className="btn btn-info btnCustom btn-sm">Detalhes</button>

          </>
        )

      }

    }
  }

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


export default class DipsEditarDocumento extends React.Component<IDipsEditarDocumentoProps, IReactGetItemsState> {

  public constructor(props: IDipsEditarDocumentoProps, state: IReactGetItemsState) {

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
          "Title": "",
        }],
      itemsListImagensItem: [
        {
          "FileName": "",
          "ServerRelativeUrl": ""
        }
      ],
      itemsListImagens: [
        {
          "Name": "",
          "ServerRelativeUrl": "",
        }
      ],
      itemsPacoteAdicionalSO: [],
      itemsMidiaMatriz: [],
      itemsInstalacaoMidiaMatriz: [],
      addUsersResponsavelEngenhariaHardware: [],
      itemsListPreStageSoftware: [],
      itemsListSetupBios: [],
      itemsCheckList: [],
      itemsSetupItensModulos: [],
      itemsFluxoAprovacaoDIPS: [],
      itemsHistorico: [],
      valorItemsCliente: "",
      valorObservacao: "",
      valorSistemaOperacional: "",
      cols: [],
      rows: [],
    };
  }

  public async componentDidMount() {

    // jQuery("#modalSucessoExcluirSetupBIOS").modal({ backdrop: 'static', keyboard: false });
    //jQuery("#modalSucessoExcluirPreStage").modal({ backdrop: 'static', keyboard: false });

    // document
    //   .getElementById("btnExcluirPreStage")
    //   .addEventListener("click", (e: Event) => this.excluirPreStage());

    // document
    //   .getElementById("btnExcluirSetupBIOS")
    //   .addEventListener("click", (e: Event) => this.excluirPreStageSetupBIOS());

    document
      .getElementById("btnValidarSalvar")
      .addEventListener("click", (e: Event) => this.validar("Salvar"));

    document
      .getElementById("btnValidarAprovacaoSuporte")
      .addEventListener("click", (e: Event) => this.validar("EnviarAprovacao"));

    document
      .getElementById("btnValidarRevisaoSuporte")
      .addEventListener("click", (e: Event) => this.validar("EnviarRevisaoSuporte"));

    document
      .getElementById("btnValidarRevisaoEngenharia")
      .addEventListener("click", (e: Event) => this.validar("EnviarRevisaoEngenharia"));

    document
      .getElementById("btnValidarReprovar")
      .addEventListener("click", (e: Event) => this.validar("Reprovar"));

    document
      .getElementById("btnValidarAprovar")
      .addEventListener("click", (e: Event) => this.validar("Aprovar"));

    document
      .getElementById("btEditar")
      .addEventListener("click", (e: Event) => this.editar("Salvar"));

    document
      .getElementById("btEnviarAprovacaoSuporte")
      .addEventListener("click", (e: Event) => this.editar("EnviarAprovacao"));

    document
      .getElementById("btEnviarRevisaoSuporte")
      .addEventListener("click", (e: Event) => this.editar("EnviarRevisaoSuporte"));

    document
      .getElementById("btEnviarRevisaoEngenharia")
      .addEventListener("click", (e: Event) => this.editar("EnviarRevisaoEngenharia"));

    document
      .getElementById("btEnviarAprovado")
      .addEventListener("click", (e: Event) => this.editar("Aprovar"));

    document
      .getElementById("btEnviarReprovado")
      .addEventListener("click", (e: Event) => this.editar("Reprovar"));

    document
      .getElementById("btnSucesso")
      .addEventListener("click", (e: Event) => this.fecharSucesso());

    document
      .getElementById("btnSucessoAprovacao")
      .addEventListener("click", (e: Event) => this.fecharSucessoAprovacao());

    document
      .getElementById("btnSucessoRevisaoSuporte")
      .addEventListener("click", (e: Event) => this.fecharSucessoAprovacao());

    document
      .getElementById("btnSucessoRevisaoEngenharia")
      .addEventListener("click", (e: Event) => this.fecharSucessoAprovacao());

    document
      .getElementById("btnSucessoReprovado")
      .addEventListener("click", (e: Event) => this.fecharSucessoAprovacao());

    document
      .getElementById("btnSucessoAprovado")
      .addEventListener("click", (e: Event) => this.fecharSucessoAprovacao());

    document
      .getElementById("btnAbrirModalCadastrarPreStage")
      .addEventListener("click", (e: Event) => this.abrirModalCadastrarPreStage());

    document
      .getElementById("btnAbrirModalCadastrarPreStageEmLote")
      .addEventListener("click", (e: Event) => this.abrirModalCadastrarPreStageEmLote());

    document
      .getElementById("btnAbrirModalCadastrarSetupBIOS")
      .addEventListener("click", (e: Event) => this.abrirModalCadastrarSetupBIOS());

    document
      .getElementById("btnAbrirModalCadastrarModulos")
      .addEventListener("click", (e: Event) => this.abrirModalCadastrarModulos());

    document
      .getElementById("btnAbrirModalCadastrarCheckList")
      .addEventListener("click", (e: Event) => this.abrirModalCadastrarCheckList());

    document
      .getElementById("btnSucessoExcluirPreStage")
      .addEventListener("click", (e: Event) => this.fecharSucessoPreStage());

    document
      .getElementById("btnSucessoExcluirSetupBIOS")
      .addEventListener("click", (e: Event) => this.fecharSucessoSetupBIOS());

    document
      .getElementById("btnSucessoExcluirCheckList")
      .addEventListener("click", (e: Event) => this.fecharSucessoCheckList());

    document
      .getElementById("btnSucessoExcluirModulos")
      .addEventListener("click", (e: Event) => this.fecharSucessoModulos());

    document
      .getElementById("btnCadastrarPreStage")
      .addEventListener("click", (e: Event) => this.cadastrarPreStage());

    document
      .getElementById("btnCadastrarPreStageEmLote")
      .addEventListener("click", (e: Event) => this.cadastrarPreStageEmLote());

    document
      .getElementById("btnCadastrarSetupBIOS")
      .addEventListener("click", (e: Event) => this.cadastrarSetupBIOS());

    document
      .getElementById("btnCadastrarModulos")
      .addEventListener("click", (e: Event) => this.cadastrarModulos());

    document
      .getElementById("btnCadastrarCheckList")
      .addEventListener("click", (e: Event) => this.cadastrarCheckList());

    document
      .getElementById("btnEditarPreStageSoftware")
      .addEventListener("click", (e: Event) => this.editarPreStage());

    document
      .getElementById("btnEditarSetupBIOS")
      .addEventListener("click", (e: Event) => this.editarSetupBIOS());

    document
      .getElementById("btnEditarModulos")
      .addEventListener("click", (e: Event) => this.editarModulos());

    document
      .getElementById("btnEditarCheckList")
      .addEventListener("click", (e: Event) => this.editarCheckList());

    document
      .getElementById("btnSucessoCadastrarPreStage")
      .addEventListener("click", (e: Event) => this.fecharSucessoPreStage());

    document
      .getElementById("btnSucessoCadastrarPreStageEmLote")
      .addEventListener("click", (e: Event) => this.fecharSucessoPreStage());

    document
      .getElementById("btnSucessoCadastrarSetupBIOS")
      .addEventListener("click", (e: Event) => this.fecharSucessoSetupBIOS());

    document
      .getElementById("btnSucessoCadastrarModulos")
      .addEventListener("click", (e: Event) => this.fecharSucessoModulos());

    document
      .getElementById("btnSucessoCadastrarCheckList")
      .addEventListener("click", (e: Event) => this.fecharSucessoCheckList());

    document
      .getElementById("btnSucessoEditarPreStage")
      .addEventListener("click", (e: Event) => this.fecharSucessoPreStage());

    document
      .getElementById("btnSucessoEditarSetupBIOS")
      .addEventListener("click", (e: Event) => this.fecharSucessoSetupBIOS());

    document
      .getElementById("btnSucessoEditarModulos")
      .addEventListener("click", (e: Event) => this.fecharSucessoModulos());

    document
      .getElementById("btnSucessoEditarCheckList")
      .addEventListener("click", (e: Event) => this.fecharSucessoCheckList());

    document
      .getElementById("btnVoltar")
      .addEventListener("click", (e: Event) => this.voltar());

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
      .getElementById("headingAnexar")
      .addEventListener("click", (e: Event) => this.mostraOculta("headingAnexar", "iconUpAnexarArquivos", "iconDownAnexarArquivos"));


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
      .getElementById("headingAcoes")
      .addEventListener("click", (e: Event) => this.mostraOculta("headingFluxoAprovacaoDIPS", "iconUpAcoes", "iconDownAcoes"));


    _web = new Web(this.props.context.pageContext.web.absoluteUrl);
    _caminho = this.props.context.pageContext.web.serverRelativeUrl;

    var queryParms = new UrlQueryParameterCollection(window.location.href);
    _documentoID = parseInt(queryParms.getValue("DocumentoID"));

    await _web.currentUser.get().then(f => {
      // console.log("user", f);
      var id = f.Id;

      var grupos = [];

      jQuery.ajax({
        url: `${this.props.siteurl}/_api/web/GetUserById(${id})/Groups`,
        type: "GET",
        headers: { 'Accept': 'application/json; odata=verbose;' },
        async: false,
        success: async function (resultData) {

          //console.log("resultDataGrupo", resultData);

          if (resultData.d.results.length > 0) {

            for (var i = 0; i < resultData.d.results.length; i++) {

              grupos.push(resultData.d.results[i].Title);

            }

          }

        },
        error: function (jqXHR, textStatus, errorThrown) {
          console.log(jqXHR.responseText);
        }

      })

      console.log("grupos", grupos);
      _grupos = grupos;

    })

    jQuery("#btnValidarSalvar").hide();
    jQuery("#btnValidarAprovacaoSuporte").hide();
    jQuery("#btnValidarRevisaoSuporte").hide();
    jQuery("#btnValidarRevisaoEngenharia").hide();
    jQuery("#btnValidarReprovar").hide();
    jQuery("#btnValidarAprovar").hide();
    jQuery("#divMotivoAprovacao").hide();
    jQuery("#cardAnexar").hide();

    jQuery("#btnAbrirModalCadastrarPreStage").hide();
    jQuery("#btnAbrirModalCadastrarPreStageEmLote").hide();
    jQuery("#btnAbrirModalCadastrarSetupBIOS").hide();
    jQuery("#btnAbrirModalCadastrarModulos").hide();
    jQuery("#btnAbrirModalCadastrarCheckList").hide();

    this.getDocumento();
    this.getImagens();
    this.handler();

    $("#conteudoLoading").html(`<br/><br/><img style="height: 80px; width: 80px" src='${_caminho}/SiteAssets/loading.gif'/>
    <br/>Aguarde....<br/><br/>
    Dependendo do tamanho do anexo e a velocidade<br>
     da Internet essa ação pode demorar um pouco. <br>
     Não fechar a janela!<br/><br/>`);


  }

  public render(): React.ReactElement<IDipsEditarDocumentoProps> {

    return (

      <><div id="container">

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
                    <div className="form-group col-md text-secondary infoDIPS">

                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <div className="form-row">
                    <div className="form-group col-md">
                      <label htmlFor="txtNomeProduto">Nome do produto</label><span className="required"> *</span>
                      <input type="text" className="form-control" id="txtNomeProduto" />
                    </div>
                    <div className="form-group col-md">
                      <label htmlFor="txtNomeProduto">Cliente</label><span className="required"> *</span>
                      <select id="ddlCliente" className="form-control" value={this.state.valorItemsCliente} onChange={(e) => this.onChangeCliente(e.target.value)}>
                        <option value="0" selected>Selecione...</option>
                        {this.state.itemsClientes.map(function (item, key) {
                          return (
                            <option value={item.Title}>{item.Title}</option>
                          );
                        })}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <div className="form-row">
                    <div className="form-group col-md">
                      <label htmlFor="txtSSTGira">SST/JIRA</label><span className="required"> *</span>
                      <input type="text" className="form-control" id="txtSSTGira" />
                    </div>
                    <div className="form-group col-md">
                      <label htmlFor="txtCodIndustrial">Código Industrial</label><span className="required"> *</span>
                      <input type="text" className="form-control" id="txtCodIndustrial" />
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <div className="form-row">
                    <div className="form-group col-md">
                      <label htmlFor="txtDescricaoPacoteAdicional">Descrição (Pacote Adicional ao S.O. OEM)</label>
                      <input type="text" className="form-control" id="txtDescricaoPacoteAdicional" />
                    </div>
                    <div className="form-group col-md">
                      <label htmlFor="txtResponsavelPacoteAdicional">Responsável (Pacote Adicional ao S.O. OEM)</label>
                      <input type="text" className="form-control" id="txtResponsavelPacoteAdicional" />
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <div className="form-row">
                    <div className="form-group col-md-3">
                      <label htmlFor="txtVersaoMidiaMatriz">Versão da Mídia (Mídia Matriz)</label>
                      <input type="text" className="form-control" id="txtVersaoMidiaMatriz" />
                    </div>
                    <div className="form-group col-md-3">
                      <label htmlFor="dtDataLiberacaoMidiaMatriz">Data de Liberação (Mídia Matriz)</label>
                      <DatePicker style={{ "width": "210px" }} value={_dataLiberacaoMidiaMatriz} minDate={new Date()} formatDate={this.onFormatDate} isMonthPickerVisible={false} className="datePicker" id='dtDataLiberacaoMidiaMatriz' />
                    </div>
                    <div className="form-group col-md-6">
                      <label htmlFor="txtArquivoRoteiro">Arquivo de Roteiro para Instalação (Mídia Matriz)</label>
                      <input type="text" className="form-control" id="txtArquivoRoteiro" />
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <div className="form-row">
                    <div className="form-group col-md-6">
                      <label htmlFor="txtResponsavelGeracaoMidiaMatriz">Responsável pela Geração (Mídia Matriz)</label>
                      <input type="text" className="form-control" id="txtResponsavelGeracaoMidiaMatriz" />
                    </div>
                    <div className="form-group col-md-3">
                      <label htmlFor="txtTitulo">Instalação (Mídia Matriz)</label><br></br>
                      {this.state.itemsInstalacaoMidiaMatriz.map(function (item, key) {
                        return (

                          <div className="form-check">
                            <input className="form-check-input" name='checkInstalacaoMidiaMatriz' defaultChecked={_instalacaoMidiaMatriz.indexOf(item) !== -1} type="checkbox" value={item} />
                            <label className="form-check-label">
                              {item}
                            </label>
                          </div>

                        );
                      })}
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
                    <div className="form-group col-md">
                      <label htmlFor="txtTitulo">Pacote Adicional ao S.O. OEM</label><span className="required"> *</span><br></br>
                      {this.state.itemsPacoteAdicionalSO.map(function (item, key) {

                        var checado = false;
                        if (_pacoteAdicionalSO == item) checado = true;

                        return (

                          <div className="form-check">
                            <input className="form-check-input" name='checkPacoteAdicionalSO' defaultChecked={checado} type="radio" value={item} />
                            <label className="form-check-label radioHorizontal">
                              {item}
                            </label>
                          </div>
                        );
                      })}
                    </div>
                    <div className="form-group col-md">
                      <label htmlFor="txtTitulo">Mídia Matriz</label><span className="required"> *</span><br></br>

                      {this.state.itemsMidiaMatriz.map(function (item, key) {

                        var checado = false;
                        if (_midiaMatriz == item) checado = true;

                        return (

                          <div className="form-check">
                            <input className="form-check-input" name='checkMidiaMatriz' defaultChecked={checado} type="radio" value={item} />
                            <label className="form-check-label radioHorizontal">
                              {item}
                            </label>
                          </div>

                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <div className="form-row">
                    <div className="form-group col-md-4">
                      <label htmlFor="ddlSistemaOperacional">Sistema Operacional</label><span className="required"> *</span>
                      <select id="ddlSistemaOperacional" className="form-control" style={{ "width": "290px" }} value={this.state.valorSistemaOperacional} onChange={(e) => this.onChangeSistemaOperacional(e.target.value)}>
                        <option value="0" selected>Selecione...</option>
                        {this.state.itemsSistemaOperacional.map(function (item, key) {

                          return (
                            <option value={item.Title}>{item.Title}</option>
                          );
                        })}
                      </select>
                    </div>
                    <div className="form-group col-md-6">
                      <div id='divSistemaOperacionalOutros'>
                        <label htmlFor="txtSistemaOperacionalOutros">Especifique seu próprio valor</label><span className="required"> *</span>
                        <input type="text" className="form-control" id="txtSistemaOperacionalOutros" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <div className="form-row">
                    <div className="form-group col-md">
                      <label htmlFor="txtTitulo">Outras Informações</label>
                      <div id='richTextOutrasInformacoes'>
                        <RichText className="editorRichTex" value=""
                          onChange={(text) => this.onTextChange(text)} />
                      </div>
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
                      {this.state.itemsListImagensItem.map((item, key) => {

                        var checkNomeArquivoJPG = false;
                        var checkNomeArquivojpg = false;
                        var checkNomeArquivoPNG = false;
                        var checkNomeArquivopng = false;
                        var checkNomeArquivoGIF = false;
                        var checkNomeArquivogif = false;

                        var nomeArquivo = item.FileName;

                        checkNomeArquivoJPG = nomeArquivo.includes(".JPG");
                        checkNomeArquivojpg = nomeArquivo.includes(".jpg");
                        checkNomeArquivoPNG = nomeArquivo.includes(".PNG");
                        checkNomeArquivopng = nomeArquivo.includes(".png");
                        checkNomeArquivoGIF = nomeArquivo.includes(".GIF");
                        checkNomeArquivogif = nomeArquivo.includes(".gif");

                        if ((checkNomeArquivoJPG) || (checkNomeArquivojpg) || (checkNomeArquivoPNG) || (checkNomeArquivopng) || (checkNomeArquivoGIF) || (checkNomeArquivogif)) {

                          _pos2++;
                          var txtAnexoItem = "anexoItem" + _pos2;
                          var btnExcluirAnexoitem = "btnExcluirAnexoitem" + _pos2;

                          var url = `${this.props.siteurl}/_api/web/lists/getByTitle('Documentos')/items('${_documentoID}')/AttachmentFiles`;
                          url = this.props.siteurl;

                          var caminho = `${url}/Lists/Documentos/Attachments/${_documentoID}/${item.FileName}`;

                          return (

                            <>

                              <img id={txtAnexoItem} className='imagensDIPS' src={caminho}></img><br /><br />
                              &nbsp;<a onClick={() => this.excluirAnexoItem(`${item.ServerRelativeUrl}`, `${item.FileName}`, `${txtAnexoItem}`, `${btnExcluirAnexoitem}`)} id={btnExcluirAnexoitem} style={{ "cursor": "pointer" }}>Excluir esta imagem</a><br />

                            </>
                          );

                        }

                      })}
                      {this.state.itemsListImagens.map((item, key) => {


                        var checkNomeArquivoJPG = false;
                        var checkNomeArquivojpg = false;
                        var checkNomeArquivoPNG = false;
                        var checkNomeArquivopng = false;
                        var checkNomeArquivoGIF = false;
                        var checkNomeArquivogif = false;

                        var nomeArquivo = item.Name;

                        checkNomeArquivoJPG = nomeArquivo.includes(".JPG");
                        checkNomeArquivojpg = nomeArquivo.includes(".jpg");
                        checkNomeArquivoPNG = nomeArquivo.includes(".PNG");
                        checkNomeArquivopng = nomeArquivo.includes(".png");
                        checkNomeArquivoGIF = nomeArquivo.includes(".GIF");
                        checkNomeArquivogif = nomeArquivo.includes(".gif");

                        if ((checkNomeArquivoJPG) || (checkNomeArquivojpg) || (checkNomeArquivoPNG) || (checkNomeArquivopng) || (checkNomeArquivoGIF) || (checkNomeArquivogif)) {

                          _pos2++;
                          var txtAnexoItem = "anexoItem" + _pos2;
                          var btnExcluirAnexoitem = "btnExcluirAnexoitem" + _pos2;

                          var url = `${this.props.siteurl}/_api/web/lists/getByTitle('Documentos')/items('${_documentoID}')/AttachmentFiles`;
                          url = this.props.siteurl;

                          var caminho = item.ServerRelativeUrl;

                          var relativeURL = window.location.pathname;

                          var strRelativeURL = relativeURL.replace("SitePages/Documentos-Editar.aspx", "");

                          var idBotao = `btnExcluirAnexo${_pos2}`;
                          var idImagem = `anexo${_pos2}`;

                          return (

                            <>

                              <img id={idImagem} className='imagensDIPS' src={caminho}></img><br /><br />
                              &nbsp;<a onClick={() => this.excluirAnexo(`${strRelativeURL}/Imagens/${_documentoID}`, `${item.Name}`, `${idImagem}`, `${idBotao}`)} id={idBotao} style={{ "cursor": "pointer" }}>Excluir esta imagem</a><br /><br />

                            </>
                          );

                        }

                      })}
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
                      {this.state.itemsListImagensItem.map((item, key) => {

                        var checkNomeArquivoJPG = false;
                        var checkNomeArquivojpg = false;
                        var checkNomeArquivoPNG = false;
                        var checkNomeArquivopng = false;
                        var checkNomeArquivoGIF = false;
                        var checkNomeArquivogif = false;

                        var nomeArquivo = item.FileName;

                        checkNomeArquivoJPG = nomeArquivo.includes(".JPG");
                        checkNomeArquivojpg = nomeArquivo.includes(".jpg");
                        checkNomeArquivoPNG = nomeArquivo.includes(".PNG");
                        checkNomeArquivopng = nomeArquivo.includes(".png");
                        checkNomeArquivoGIF = nomeArquivo.includes(".GIF");
                        checkNomeArquivogif = nomeArquivo.includes(".gif");

                        if ((checkNomeArquivoJPG) || (checkNomeArquivojpg) || (checkNomeArquivoPNG) || (checkNomeArquivopng) || (checkNomeArquivoGIF) || (checkNomeArquivogif)) {

                        } else {

                          _pos++;
                          var txtAnexoItem = "anexoItem" + _pos;
                          var btnExcluirAnexoitem = "btnExcluirAnexoitem" + _pos;

                          var url = `${this.props.siteurl}/_api/web/lists/getByTitle('Documentos')/items('${_documentoID}')/AttachmentFiles`;
                          url = this.props.siteurl;

                          var caminho = `${url}/Lists/Documentos/Attachments/${_documentoID}/${item.FileName}`;

                          return (

                            <><a id={txtAnexoItem} target='_blank' data-interception="off" href={caminho} title="">{item.FileName}</a><a style={{ "cursor": "pointer" }} onClick={() => this.excluirAnexoItem(`${item.ServerRelativeUrl}`, `${item.FileName}`, `${txtAnexoItem}`, `${btnExcluirAnexoitem}`)} id={btnExcluirAnexoitem}>&nbsp;Excluir</a><br></br></>


                          );

                        }

                      })}
                      {this.state.itemsListImagens.map((item, key) => {

                        var checkNomeArquivoJPG = false;
                        var checkNomeArquivojpg = false;
                        var checkNomeArquivoPNG = false;
                        var checkNomeArquivopng = false;
                        var checkNomeArquivoGIF = false;
                        var checkNomeArquivogif = false;

                        var nomeArquivo = item.Name;

                        checkNomeArquivoJPG = nomeArquivo.includes(".JPG");
                        checkNomeArquivojpg = nomeArquivo.includes(".jpg");
                        checkNomeArquivoPNG = nomeArquivo.includes(".PNG");
                        checkNomeArquivopng = nomeArquivo.includes(".png");
                        checkNomeArquivoGIF = nomeArquivo.includes(".GIF");
                        checkNomeArquivogif = nomeArquivo.includes(".gif");

                        if ((checkNomeArquivoJPG) || (checkNomeArquivojpg) || (checkNomeArquivoPNG) || (checkNomeArquivopng) || (checkNomeArquivoGIF) || (checkNomeArquivogif)) {

                        } else {

                          _pos++;
                          var txtAnexoItem = "anexoItem" + _pos;
                          var btnExcluirAnexoitem = "btnExcluirAnexoitem" + _pos;

                          var url = `${this.props.siteurl}/_api/web/lists/getByTitle('Documentos')/items('${_documentoID}')/AttachmentFiles`;
                          url = this.props.siteurl;

                          var caminho = item.ServerRelativeUrl;

                          var idBotao = `btnExcluirAnexo2${_pos2}`;
                          var idImagem = `anexo2${_pos2}`;

                          var relativeURL = window.location.pathname;
                          var strRelativeURL = relativeURL.replace("SitePages/Documentos-Editar.aspx", "");

                          return (

                            <><a id={idImagem} target='_blank' data-interception="off" href={caminho} title="">{item.Name}</a><a style={{ "cursor": "pointer" }} onClick={() => this.excluirAnexo(`${strRelativeURL}/Imagens/${_documentoID}`, `${item.Name}`, `${idImagem}`, `${idBotao}`)} id={idBotao}>&nbsp;Excluir</a><br></br></>

                          );

                        }

                      })}
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

          <div className="card" id='cardAnexar'>
            <div className="card-header btn" id="headingAnexar" data-toggle="collapse" data-target="#collapseAnexar" aria-expanded="true" aria-controls="collapseAnexar">
              <h5 className="mb-0 text-info">
                Anexar imagens/arquivos
                <span id='iconDownAnexarArquivos' style={{ "display": "none" }} className="float-right cinza">
                  <FontAwesomeIcon icon={faChevronDown} />
                </span>
                <span id='iconUpAnexarArquivos' className="float-right cinza">
                  <FontAwesomeIcon icon={faChevronUp} />
                </span>
              </h5>
            </div>
            <div id="collapseAnexar" className="collapse show" aria-labelledby="headingOne">
              <div className="card-body">
                <div className="form-group">
                  <div className="form-row ">
                    <div className="form-group col-md" >
                      <label htmlFor="txtTitulo">Imagem / Arquivo </label><br></br>
                      <input className="multi" data-maxsize="1024" type="file" id="input" multiple />
                    </div>
                    <div className="form-group col-md" >

                    </div>

                  </div>
                  <br />
                  <p className='text-info'>Total máximo permitido: 15 MB</p>

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
                  <BootstrapTable bootstrap4 striped responsive condensed hover={false} className="gridTodosItens" id="gridTodosItensPreStageSoftware" keyField='id' data={this.state.itemsListPreStageSoftware} columns={tablecolumnsPreStageSoftware} headerClasses="header-class" />

                </div>
                <button id='btnAbrirModalCadastrarPreStage' className="btn btn-secondary btnCustom btn-sm">Adicionar</button>&nbsp;
                <button id='btnAbrirModalCadastrarPreStageEmLote' className="btn btn-secondary btnCustom btn-sm">Adicionar em lote</button>
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
                  <BootstrapTable bootstrap4 striped responsive condensed hover={false} className="gridTodosItens" id="gridTodosItensSetupBios" keyField='id' data={this.state.itemsListSetupBios} columns={tablecolumnsSetupBios} headerClasses="header-class" />
                </div>
                <button id='btnAbrirModalCadastrarSetupBIOS' className="btn btn-secondary btnCustom btn-sm">Adicionar</button>
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
                <button id='btnAbrirModalCadastrarModulos' className="btn btn-secondary btnCustom btn-sm">Adicionar</button>
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
                <button id='btnAbrirModalCadastrarCheckList' className="btn btn-secondary btnCustom btn-sm">Adicionar</button>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header btn" id="headingAcoes" data-toggle="collapse" data-target="#collapseAcoes" aria-expanded="true" aria-controls="collapseAcoes">
              <h5 className="mb-0 text-info">
                Ações
                <span id='iconDownAcoes' style={{ "display": "none" }} className="float-right cinza">
                  <FontAwesomeIcon icon={faChevronDown} />
                </span>
                <span id='iconUpAcoes' className="float-right cinza">
                  <FontAwesomeIcon icon={faChevronUp} />
                </span>
              </h5>
            </div>
            <div id="collapseAcoes" className="collapse show" aria-labelledby="headingOne">
              <div className="card-body">

                <div className="form-group" id='divMotivoAprovacao'>
                  <div className="form-row">
                    <div className="form-group col-md">
                      <label htmlFor="txtSSTGira">Motivo</label>
                      <textarea id="txtMotivoAprovacao" className="form-control" rows={4}></textarea>
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <div className="form-row">
                    <div className="form-group col-md">
                      <div className='right'>
                        <button style={{ "margin": "2px" }} type="submit" id="btnVoltar" className="btn btn-secondary">Voltar</button>
                        <button style={{ "margin": "2px" }} id="btnValidarSalvar" className="btn btn-secondary">Salvar</button>
                        <button style={{ "margin": "2px" }} id="btnValidarAprovacaoSuporte" className="btn btn-success">Enviar aprovação Suporte</button>
                        <button style={{ "margin": "2px" }} id="btnValidarRevisaoSuporte" className="btn btn-success">Enviar revisão Suporte</button>
                        <button style={{ "margin": "2px" }} id="btnValidarRevisaoEngenharia" className="btn btn-success">Enviar revisão Engenharia</button>
                        <button style={{ "margin": "2px" }} id="btnValidarReprovar" className="btn btn btn-danger">Reprovar</button>
                        <button style={{ "margin": "2px" }} id="btnValidarAprovar" className="btn btn-success">Aprovar</button>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>


      </div>

        <div className="modal fade" id="modalConfirmar" tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Confirmação</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                Deseja realmente editar o documento?
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-dismiss="modal">Cancelar</button>
                <button id="btEditar" type="button" className="btn btn-primary">Sim</button>
              </div>
            </div>
          </div>
        </div>

        <div className="modal fade" id="modalConfirmarEnviarAprovacao" tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Confirmação</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                Deseja realmente enviar para a aprovação do Suporte?
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-dismiss="modal">Cancelar</button>
                <button id="btEnviarAprovacaoSuporte" type="button" className="btn btn-primary">Sim</button>
              </div>
            </div>
          </div>
        </div>

        <div className="modal fade" id="modalConfirmarRevisaoSuporte" tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Confirmação</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                Deseja realmente enviar para a revisão do Suporte?
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-dismiss="modal">Cancelar</button>
                <button id="btEnviarRevisaoSuporte" type="button" className="btn btn-primary">Sim</button>
              </div>
            </div>
          </div>
        </div>

        <div className="modal fade" id="modalConfirmarRevisaoEngenharia" tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Confirmação</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                Deseja realmente enviar para a revisão da Engenharia?
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-dismiss="modal">Cancelar</button>
                <button id="btEnviarRevisaoEngenharia" type="button" className="btn btn-primary">Sim</button>
              </div>
            </div>
          </div>
        </div>

        <div className="modal fade" id="modalConfirmarAprovar" tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Confirmação</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                Deseja realmente aprovar o documento?
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-dismiss="modal">Cancelar</button>
                <button id="btEnviarAprovado" type="button" className="btn btn-primary">Sim</button>
              </div>
            </div>
          </div>
        </div>

        <div className="modal fade" id="modalConfirmarReprovar" tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Confirmação</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                Deseja realmente reprovar o documento?
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-dismiss="modal">Cancelar</button>
                <button id="btEnviarReprovado" type="button" className="btn btn-primary">Sim</button>
              </div>
            </div>
          </div>
        </div>


        <div className="modal fade" id="modalCadastrarModulos" tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Setup de Itens / Módulos - Cadastrar</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">

                <div className="form-row">
                  <div className="form-group col-md">
                    <label htmlFor="txtItensModulosCadastrar">Itens</label><span className="required"> *</span><br></br>
                    <input type="text" className="form-control" id="txtItensModulosCadastrar" />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group col-md">
                    <label htmlFor="txtModulosCadastrar">Parâmetros</label><span className="required"> *</span><br></br>
                    <div id='RichTextParametrosModulosCadastrar'>
                      <RichText className="editorRichTex" value=""
                        onChange={(text) => this.onTextChangeCadastrarModulosParametros(text)} />
                    </div>
                  </div>
                </div>

              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-dismiss="modal">Cancelar</button>
                <button id="btnCadastrarModulos" className="btn btn-success">Salvar</button>
              </div>
            </div>
          </div>
        </div>

        <div className="modal fade" id="modalCadastrarPreStageSoftware" tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Pre Stage de Hardware - Cadastrar</h5>
              </div>
              <div className="modal-body">

                <div className="form-row">
                  <div className="form-group col-md">
                    <label htmlFor="txtComponenteCadastrar">Componente</label><span className="required"> *</span><br></br>
                    <input type="text" className="form-control" id="txtComponenteCadastrar" />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group col-md">
                    <label htmlFor="txtModeloCadastrar">Modelo</label><br></br>
                    <input type="text" className="form-control" id="txtModeloCadastrar" />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group col-md">
                    <label htmlFor="txtFabricanteCadastrar">Fabricante</label><br></br>
                    <input type="text" className="form-control" id="txtFabricanteCadastrar" />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group col-md">
                    <label htmlFor="txtFWCadastrar">FW</label><br></br>
                    <input type="text" className="form-control" id="txtFWCadastrar" />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group col-md">
                    <label htmlFor="txtBIOSCadastrar">BIOS</label><br></br>
                    <input type="text" className="form-control" id="txtBIOSCadastrar" />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group col-md">
                    <label htmlFor="txtConexaoCadastrar">Conexão</label><br></br>
                    <input type="text" className="form-control" id="txtConexaoCadastrar" />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group col-md">
                    <label htmlFor="txtPORTCadastrar">PORT</label><br></br>
                    <input type="text" className="form-control" id="txtPORTCadastrar" />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group col-md">
                    <label htmlFor="txtSLOTCadastrar">SLOT</label><br></br>
                    <input type="text" className="form-control" id="txtSLOTCadastrar" />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group col-md">
                    <label htmlFor="txtItemObrigatorioCadastrar">Item obrigatório</label><br></br>
                    <input type="text" className="form-control" id="txtItemObrigatorioCadastrar" />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group col-md">
                    <label htmlFor="txtObservacaoCadastrar">Observação</label><br></br>
                    <div id='RichTextObservacaoPreStageCadastrar'>
                      <RichText className="editorRichTex" value=""
                        onChange={(text) => this.onTextChangeCadastrarPreStageSoftwareObservacao(text)} />
                    </div>
                  </div>
                </div>

              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-dismiss="modal">Cancelar</button>
                <button id="btnCadastrarPreStage" className="btn btn-success">Salvar</button>
              </div>
            </div>
          </div>
        </div>

        <div className="modal fade" id="modalCadastrarPreStageSoftwareEmLote" tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Pre Stage de Hardware - Cadastrar em lote</h5>
              </div>
              <div className="modal-body">

                <input type="file" onChange={this.fileHandler.bind(this)} style={{ "padding": "10px" }} />

              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-dismiss="modal">Cancelar</button>
                <button id="btnCadastrarPreStageEmLote" className="btn btn-success">Salvar</button>
              </div>
            </div>
          </div>
        </div>

        <div className="modal fade" id="modalCadastrarSetupBIOS" tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Setup de BIOS - Cadastrar</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">

                <div className="form-row">
                  <div className="form-group col-md">
                    <label htmlFor="txtItensSetupBIOSCadastrar">Itens</label><span className="required"> *</span><br></br>
                    <input type="text" className="form-control" id="txtItensSetupBIOSCadastrar" />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group col-md">
                    <label htmlFor="txtParametrosSetupBIOSCadastrar">Parâmetros</label><span className="required"> *</span><br></br>
                    <div id='RichTextObservacaoSetupBIOSCadastrar'>
                      <RichText className="editorRichTex" value=""
                        onChange={(text) => this.onTextChangeCadastrarSetupBIOSParametros(text)} />
                    </div>
                  </div>
                </div>

              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-dismiss="modal">Cancelar</button>
                <button id="btnCadastrarSetupBIOS" className="btn btn-success">Salvar</button>
              </div>
            </div>
          </div>
        </div>

        <div className="modal fade" id="modalCadastrarCheckList" tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Checklist - Cadastrar</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">

                <div className="form-row">
                  <div className="form-group col-md">
                    <label htmlFor="txtItensModulosEditar">S/N</label><span className="required"> *</span><br></br>
                    <input type="text" className="form-control" id="txtSNCadastrarCheckList" />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group col-md">
                    <label htmlFor="txtCheckListEditar">Divergências</label><span className="required"> *</span><br></br>
                    <div id='RichTextDivergenciasCheckListCadastrar'>
                      <RichText className="editorRichTex" value=""
                        onChange={(text) => this.onTextChangeCadastrarCheckListDivergencias(text)} />
                    </div>
                  </div>
                </div>

              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-dismiss="modal">Cancelar</button>
                <button id="btnCadastrarCheckList" className="btn btn-success">Salvar</button>
              </div>
            </div>
          </div>
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
                    <label className="text-info" htmlFor="txtComponente">Componente</label><br></br>
                    <span className='labelDetalhes' id='txtComponente'></span>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group col-md border m-1">
                    <label className="text-info" htmlFor="txtModelo">Modelo</label><br></br>
                    <span className='labelDetalhes' id='txtModelo'></span>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group col-md border m-1">
                    <label className="text-info" htmlFor="txtFabricante">Fabricante</label><br></br>
                    <span className='labelDetalhes' id='txtFabricante'></span>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group col-md border m-1">
                    <label className="text-info" htmlFor="txtFW">FW</label><br></br>
                    <span className='labelDetalhes' id='txtFW'></span>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group col-md border m-1">
                    <label className="text-info" htmlFor="txtBIOS">BIOS</label><br></br>
                    <span className='labelDetalhes' id='txtBIOS'></span>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group col-md border m-1">
                    <label className="text-info" htmlFor="txtConexao">Conexão</label><br></br>
                    <span className='labelDetalhes' id='txtConexao'></span>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group col-md border m-1">
                    <label className="text-info" htmlFor="txtPORT">PORT</label><br></br>
                    <span className='labelDetalhes' id='txtPORT'></span>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group col-md border m-1">
                    <label className="text-info" htmlFor="txtSLOT">SLOT</label><br></br>
                    <span className='labelDetalhes' id='txtSLOT'></span>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group col-md border m-1">
                    <label className="text-info" htmlFor="txtItemObrigatorio">Item obrigatório</label><br></br>
                    <span className='labelDetalhes' id='txtItemObrigatorio'></span>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group col-md border m-1">
                    <label className="text-info" htmlFor="txtObservacao">Observação</label><br></br>
                    <span className='labelDetalhes' id='txtObservacao'></span>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group col-md border m-1">
                    <label className="text-info" htmlFor="txtCriado">Criado</label><br></br>
                    <span className='labelDetalhes' id='txtCriado'></span>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group col-md border m-1">
                    <label className="text-info" htmlFor="txtCriadoPor">Criado por</label><br></br>
                    <span className='labelDetalhes' id='txtCriadoPor'></span>
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
                    <label className="text-info" htmlFor="txtItensBIOS">Itens</label><br></br>
                    <span className='labelDetalhes' id='txtItensBIOS'></span>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group col-md border m-1">
                    <label className="text-info" htmlFor="txtParametrosBIOS">Parâmetros</label><br></br>
                    <span className='labelDetalhes' id='txtParametrosBIOS'></span>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group col-md border m-1">
                    <label className="text-info" htmlFor="txtCriadoSetupBIOS">Criado</label><br></br>
                    <span className='labelDetalhes' id='txtCriadoSetupBIOS'></span>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group col-md border m-1">
                    <label className="text-info" htmlFor="txtCriadoPorSetupBIOS">Criado por</label><br></br>
                    <span className='labelDetalhes' id='txtCriadoPorSetupBIOS'></span>
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
                    <label className="text-info" htmlFor="txtItensModulos">Itens</label><br></br>
                    <span className='labelDetalhes' id='txtItensModulos'></span>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group col-md border m-1">
                    <label className="text-info" htmlFor="txtParametros">Parâmetros</label><br></br>
                    <span className='labelDetalhes' id='txtParametrosModulo'></span>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group col-md border m-1">
                    <label className="text-info" htmlFor="txtCriadoModulos">Criado</label><br></br>
                    <span className='labelDetalhes' id='txtCriadoModulos'></span>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group col-md border m-1">
                    <label className="text-info" htmlFor="txtCriadoPorModulos">Criado por</label><br></br>
                    <span className='labelDetalhes' id='txtCriadoPorModulos'></span>
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
                    <label className="text-info" htmlFor="txtItens">S/N</label><br></br>
                    <span className='labelDetalhes' id='txtSN'></span>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group col-md border m-1">
                    <label className="text-info" htmlFor="txtParametros">Divergências</label><br></br>
                    <span className='labelDetalhes' id='txtDivergencias'></span>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group col-md border m-1">
                    <label className="text-info" htmlFor="txtCriadoSetupBIOS">Criado</label><br></br>
                    <span className='labelDetalhes' id='txtCriadoCheckList'></span>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group col-md border m-1">
                    <label className="text-info" htmlFor="txtCriadoPorSetupBIOS">Criado por</label><br></br>
                    <span className='labelDetalhes' id='txtCriadoPorCheckList'></span>
                  </div>
                </div>

              </div>
              <div className="modal-footer">
              </div>
            </div>
          </div>
        </div>

        <div className="modal fade" id="modalEditarPreStageSoftware" tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Pre Stage de Hardware - Editar</h5>
              </div>
              <div className="modal-body">

                <div className="form-row hidden">
                  <div className="form-group col-md">
                    <label className="text-info" htmlFor="txtID">ID</label><br></br>
                    <input type="text" className="form-control" id="txtID" />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group col-md">
                    <label className="text-info" htmlFor="txtComponenteEditar">Componente</label><br></br>
                    <input type="text" className="form-control" id="txtComponenteEditar" />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group col-md">
                    <label className="text-info" htmlFor="txtModeloEditar">Modelo</label><br></br>
                    <input type="text" className="form-control" id="txtModeloEditar" />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group col-md">
                    <label className="text-info" htmlFor="txtFabricanteEditar">Fabricante</label><br></br>
                    <input type="text" className="form-control" id="txtFabricanteEditar" />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group col-md">
                    <label className="text-info" htmlFor="txtFWEditar">FW</label><br></br>
                    <input type="text" className="form-control" id="txtFWEditar" />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group col-md">
                    <label className="text-info" htmlFor="txtBIOSEditar">BIOS</label><br></br>
                    <input type="text" className="form-control" id="txtBIOSEditar" />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group col-md">
                    <label className="text-info" htmlFor="txtConexaoEditar">Conexão</label><br></br>
                    <input type="text" className="form-control" id="txtConexaoEditar" />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group col-md">
                    <label className="text-info" htmlFor="txtPORTEditar">PORT</label><br></br>
                    <input type="text" className="form-control" id="txtPORTEditar" />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group col-md">
                    <label className="text-info" htmlFor="txtSLOTEditar">SLOT</label><br></br>
                    <input type="text" className="form-control" id="txtSLOTEditar" />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group col-md">
                    <label className="text-info" htmlFor="txtItemObrigatorioEditar">Item obrigatório</label><br></br>
                    <input type="text" className="form-control" id="txtItemObrigatorioEditar" />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group col-md">
                    <label className="text-info" htmlFor="txtObservacaoEditar">Observação</label><br></br>
                    <div id='RichTextObservacao'>
                      <RichText className="editorRichTex" value=""
                        onChange={(text) => this.onTextChangeEditarPreStageSoftwareObservacao(text)} />
                    </div>
                  </div>
                </div>

              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-dismiss="modal">Cancelar</button>
                <button id="btnEditarPreStageSoftware" className="btn btn-success">Salvar</button>
              </div>
            </div>
          </div>
        </div>

        <div className="modal fade" id="modalEditarSetupBIOS" tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Setup de BIOS - Editar</h5>
              </div>
              <div className="modal-body">

                <div className="form-row hidden">
                  <div className="form-group col-md">
                    <label className="text-info" htmlFor="txtSetupBIOSID">ID</label><br></br>
                    <input type="text" className="form-control" id="txtSetupBIOSID" />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group col-md">
                    <label className="text-info" htmlFor="txtItensSetupBIOSEditar">Itens</label><br></br>
                    <input type="text" className="form-control" id="txtItensSetupBIOSEditar" />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group col-md">
                    <label className="text-info" htmlFor="txtParametrosSetupBIOSEditar">Parâmetros</label><br></br>
                    <div id='RichTextParametrosSetupBIOSEditar'>
                      <RichText className="editorRichTex" value=""
                        onChange={(text) => this.onTextChangeCadastrarSetupBIOSParametros(text)} />
                    </div>
                  </div>
                </div>

              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-dismiss="modal">Cancelar</button>
                <button id="btnEditarSetupBIOS" className="btn btn-success">Salvar</button>
              </div>
            </div>
          </div>
        </div>

        <div className="modal fade" id="modalEditarModulos" tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Setup de Itens / Módulos - Editar</h5>
              </div>
              <div className="modal-body">

                <div className="form-row hidden">
                  <div className="form-group col-md">
                    <label className="text-info" htmlFor="txtModulosID">ID</label><br></br>
                    <input type="text" className="form-control" id="txtModulosID" />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group col-md">
                    <label className="text-info" htmlFor="txtItensModulosEditar">Itens</label><br></br>
                    <input type="text" className="form-control" id="txtItensModulosEditar" />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group col-md">
                    <label className="text-info" htmlFor="txtModulosEditar">Parâmetros</label><br></br>
                    <div id='RichTextParametrosModulosEditar'>
                      <RichText className="editorRichTex" value=""
                        onChange={(text) => this.onTextChangeEditarModulosParametros(text)} />
                    </div>
                  </div>
                </div>

              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-dismiss="modal">Cancelar</button>
                <button id="btnEditarModulos" className="btn btn-success">Salvar</button>
              </div>
            </div>
          </div>
        </div>

        <div className="modal fade" id="modalEditarCheckList" tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Checklist - Detalhes</h5>
              </div>
              <div className="modal-body">

                <div className="form-row hidden">
                  <div className="form-group col-md">
                    <label className="text-info" htmlFor="txtCheckListID">ID</label><br></br>
                    <input type="text" className="form-control" id="txtCheckListID" />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group col-md">
                    <label className="text-info" htmlFor="txtItensModulosEditar">S/N</label><br></br>
                    <input type="text" className="form-control" id="txtSNEditarCheckList" />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group col-md">
                    <label className="text-info" htmlFor="txtCheckListEditar">Divergências</label><br></br>
                    <div id='RichTextCheckListEditar'>
                      <RichText className="editorRichTex" value=""
                        onChange={(text) => this.onTextChangeCadastrarCheckListDivergencias(text)} />
                    </div>
                  </div>
                </div>

              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-dismiss="modal">Cancelar</button>
                <button id="btnEditarCheckList" className="btn btn-success">Salvar</button>
              </div>
            </div>
          </div>
        </div>

        <div className="modal fade" id="modalSucesso" tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Alerta</h5>
              </div>
              <div className="modal-body">
                Documento alterado com sucesso!
              </div>
              <div className="modal-footer">
                <button type="button" id="btnSucesso" className="btn btn-primary">OK</button>
              </div>
            </div>
          </div>
        </div>

        <div className="modal fade" id="modalSucessoAprovacao" tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Alerta</h5>
              </div>
              <div className="modal-body">
                Documento enviado para aprovação do Suporte!
              </div>
              <div className="modal-footer">
                <button type="button" id="btnSucessoAprovacao" className="btn btn-primary">OK</button>
              </div>
            </div>
          </div>
        </div>

        <div className="modal fade" id="modalSucessoRevisaoSuporte" tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Alerta</h5>
              </div>
              <div className="modal-body">
                Documento enviado para revisão do Suporte!
              </div>
              <div className="modal-footer">
                <button type="button" id="btnSucessoRevisaoSuporte" className="btn btn-primary">OK</button>
              </div>
            </div>
          </div>
        </div>

        <div className="modal fade" id="modalSucessoRevisaoEngenharia" tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Alerta</h5>
              </div>
              <div className="modal-body">
                Documento enviado para revisão da Engenharia!
              </div>
              <div className="modal-footer">
                <button type="button" id="btnSucessoRevisaoEngenharia" className="btn btn-primary">OK</button>
              </div>
            </div>
          </div>
        </div>

        <div className="modal fade" id="modalSucessoReprovado" tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Alerta</h5>
              </div>
              <div className="modal-body">
                Documento reprovado com sucesso!
              </div>
              <div className="modal-footer">
                <button type="button" id="btnSucessoReprovado" className="btn btn-primary">OK</button>
              </div>
            </div>
          </div>
        </div>


        <div className="modal fade" id="modalSucessoAprovado" tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Alerta</h5>
              </div>
              <div className="modal-body">
                Documento aprovado com sucesso!
              </div>
              <div className="modal-footer">
                <button type="button" id="btnSucessoAprovado" className="btn btn-primary">OK</button>
              </div>
            </div>
          </div>
        </div>

        <div className="modal fade" id="modalSucessoExcluirPreStage" tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Alerta</h5>
              </div>
              <div className="modal-body">
                Pré Stage de Hardware excluido com sucesso!
              </div>
              <div className="modal-footer">
                <button type="button" id="btnSucessoExcluirPreStage" className="btn btn-primary">OK</button>
              </div>
            </div>
          </div>
        </div>

        <div className="modal fade" id="modalSucessoExcluirSetupBIOS" tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Alerta</h5>
              </div>
              <div className="modal-body">
                Setup de BIOS excluido com sucesso!
              </div>
              <div className="modal-footer">
                <button type="button" id="btnSucessoExcluirSetupBIOS" className="btn btn-primary">OK</button>
              </div>
            </div>
          </div>
        </div>

        <div className="modal fade" id="modalSucessoExcluirModulos" tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Alerta</h5>
              </div>
              <div className="modal-body">
                Setup de Itens/Módulo excluido com sucesso!
              </div>
              <div className="modal-footer">
                <button type="button" id="btnSucessoExcluirModulos" className="btn btn-primary">OK</button>
              </div>
            </div>
          </div>
        </div>

        <div className="modal fade" id="modalSucessoExcluirCheckList" tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Alerta</h5>
              </div>
              <div className="modal-body">
                Checklist excluido com sucesso!
              </div>
              <div className="modal-footer">
                <button type="button" id="btnSucessoExcluirCheckList" className="btn btn-primary">OK</button>
              </div>
            </div>
          </div>
        </div>

        <div className="modal fade" id="modalSucessoCadastrarPreStage" tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Alerta</h5>
              </div>
              <div className="modal-body">
                Pre Stage de Hardware criado com sucesso!
              </div>
              <div className="modal-footer">
                <button type="button" id="btnSucessoCadastrarPreStage" className="btn btn-primary">OK</button>
              </div>
            </div>
          </div>
        </div>

        <div className="modal fade" id="modalSucessoCadastrarPreStageEmLote" tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Alerta</h5>
              </div>
              <div className="modal-body">
                Arquivo importado com sucesso!
              </div>
              <div className="modal-footer">
                <button type="button" id="btnSucessoCadastrarPreStageEmLote" className="btn btn-primary">OK</button>
              </div>
            </div>
          </div>
        </div>

        <div className="modal fade" id="modalSucessoCadastrarSetupBIOS" tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Alerta</h5>
              </div>
              <div className="modal-body">
                Setup de BIOS criado com sucesso!
              </div>
              <div className="modal-footer">
                <button type="button" id="btnSucessoCadastrarSetupBIOS" className="btn btn-primary">OK</button>
              </div>
            </div>
          </div>
        </div>

        <div className="modal fade" id="modalSucessoCadastrarModulos" tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Alerta</h5>
              </div>
              <div className="modal-body">
                Setup de Itens/Módulos criado com sucesso!
              </div>
              <div className="modal-footer">
                <button type="button" id="btnSucessoCadastrarModulos" className="btn btn-primary">OK</button>
              </div>
            </div>
          </div>
        </div>

        <div className="modal fade" id="modalSucessoCadastrarCheckList" tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Alerta</h5>
              </div>
              <div className="modal-body">
                Checklist criado com sucesso!
              </div>
              <div className="modal-footer">
                <button type="button" id="btnSucessoCadastrarCheckList" className="btn btn-primary">OK</button>
              </div>
            </div>
          </div>
        </div>

        <div className="modal fade" id="modalSucessoEditarPreStage" tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Alerta</h5>
              </div>
              <div className="modal-body">
                Pre Stage de Hardware alterado com sucesso!
              </div>
              <div className="modal-footer">
                <button type="button" id="btnSucessoEditarPreStage" className="btn btn-primary">OK</button>
              </div>
            </div>
          </div>
        </div>

        <div className="modal fade" id="modalSucessoEditarSetupBIOS" tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Alerta</h5>
              </div>
              <div className="modal-body">
                Setup de BIOS alterado com sucesso!
              </div>
              <div className="modal-footer">
                <button type="button" id="btnSucessoEditarSetupBIOS" className="btn btn-primary">OK</button>
              </div>
            </div>
          </div>
        </div>

        <div className="modal fade" id="modalSucessoEditarModulos" tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Alerta</h5>
              </div>
              <div className="modal-body">
                Módulo alterado com sucesso!
              </div>
              <div className="modal-footer">
                <button type="button" id="btnSucessoEditarModulos" className="btn btn-primary">OK</button>
              </div>
            </div>
          </div>
        </div>

        <div className="modal fade" id="modalSucessoEditarCheckList" tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Alerta</h5>
              </div>
              <div className="modal-body">
                Checklist alterado com sucesso!
              </div>
              <div className="modal-footer">
                <button type="button" id="btnSucessoEditarCheckList" className="btn btn-primary">OK</button>
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







      </>


    );



  }

  protected async handler() {

    jQuery("#tabelaPreStageSoftware").hide();
    jQuery("#tabelaSetupBios").hide();
    jQuery("#tabelaCheckList").hide();
    jQuery("#tabelaSetupItensModulos").hide();
    jQuery("#tabelaFluxoAprovacaoDIPS").hide();
    jQuery("#tabelaHistorico").hide();

    var reactSistemaOperacional = this;

    jquery.ajax({
      url: `${this.props.siteurl}/_api/web/lists/getbytitle('Sistema Operacional')/items?$top=50&$filter=Ativo eq 1&$orderby= Title`,
      type: "GET",
      headers: { 'Accept': 'application/json; odata=verbose;' },
      success: async (resultData) => {

        reactSistemaOperacional.setState({
          itemsSistemaOperacional: resultData.d.results
        });
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(jqXHR.responseText);
      }
    });

    var reactPacoteAdicionalSO = this;

    jquery.ajax({
      url: `${this.props.siteurl}/_api/web/lists/GetByTitle('Documentos')/fields?$filter=EntityPropertyName eq 'PacoteAdicionalSO'`,
      type: "GET",
      headers: { 'Accept': 'application/json; odata=verbose;' },
      success: function (resultData) {
        reactPacoteAdicionalSO.setState({
          itemsPacoteAdicionalSO: resultData.d.results[0].Choices.results
        });
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(jqXHR.responseText);
      }
    });


    var reactMidiaMatriz = this;

    jquery.ajax({
      url: `${this.props.siteurl}/_api/web/lists/GetByTitle('Documentos')/fields?$filter=EntityPropertyName eq 'MidiaMatriz'`,
      type: "GET",
      headers: { 'Accept': 'application/json; odata=verbose;' },
      success: function (resultData) {
        reactMidiaMatriz.setState({
          itemsMidiaMatriz: resultData.d.results[0].Choices.results
        });
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(jqXHR.responseText);
      }
    });

    var reactInstalacaoMidiaMatriz = this;

    jquery.ajax({
      url: `${this.props.siteurl}/_api/web/lists/GetByTitle('Documentos')/fields?$filter=EntityPropertyName eq 'MidiaMatrizInstalacao'`,
      type: "GET",
      headers: { 'Accept': 'application/json; odata=verbose;' },
      success: function (resultData) {
        reactInstalacaoMidiaMatriz.setState({
          itemsInstalacaoMidiaMatriz: resultData.d.results[0].Choices.results
        });
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(jqXHR.responseText);
      }
    });


    var reactHandlerClientes = this;

    jquery.ajax({
      url: `https://dieboldnixdorf.sharepoint.com/sites/PropostasSAP/_api/web/lists/getbytitle('Clientes')/items?$top=4999&$filter=Ativo eq 1&$orderby= Title`,
      type: "GET",
      headers: { 'Accept': 'application/json; odata=verbose;' },
      success: function (resultData) {
        reactHandlerClientes.setState({
          itemsClientes: resultData.d.results
        });
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(jqXHR.responseText);
      }
    });


    var reactHandlerPreStageSoftware = this;

    jQuery.ajax({
      url: `${this.props.siteurl}/_api/web/lists/getbytitle('Pre Stage de Hardware')/items?$top=50&$orderby= ID asc&$select=ID,Title,Modelo,Fabricante,Created,Author/Title,FW,BIOS,PORT,SLOT,ItemObrigatorio,Observacao,Conexao&$expand=Author&$filter=DIP/ID eq ` + _documentoID,
      type: "GET",
      headers: { 'Accept': 'application/json; odata=verbose;' },
      success: function (resultData) {
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
      url: `${this.props.siteurl}/_api/web/lists/getbytitle('Setup de BIOS')/items?$top=50&$orderby= ID asc&$select=ID,Title,Itens,Created,Author/Title&$expand=Author&$filter=DIP/ID eq ` + _documentoID,
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
      url: `${this.props.siteurl}/_api/web/lists/getbytitle('SetupItensModulos')/items?$top=50&$orderby= ID asc&$select=ID,Title,Created,Author/Title,Parametros&$expand=Author&$filter=DIPS/ID eq ` + _documentoID,
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
      url: `${this.props.siteurl}/_api/web/lists/getbytitle('Checklist')/items?$top=50&$orderby= ID asc&$select=ID,Title,Created,Author/Title,Divergencias&$expand=Author&$filter=DIPS/ID eq ` + _documentoID,
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



  }

  protected getDocumento() {

    jQuery.ajax({
      url: `${this.props.siteurl}/_api/web/lists/getbytitle('Documentos')/items?$select=ID,Title,NomeProduto,Cliente,SST,PacoteAdicionalSODescricao,PacoteAdicionalSOResponsavel,MidiaMatrizVersaoMidia,Versao,MidiaMatrizDataLiberacao,MidiaMatrizArquivoRoteiroInstala,MidiaMatrizResponsavelGeracao,MidiaMatrizInstalacao,EmailElaboracao,PacoteAdicionalSO,MidiaMatriz,SistemaOperacionalSiteNovo,SistemaOperacional,SiteAntigo,OutrasInformacoes,Status,PastaCriada,Duplicado&$filter=ID eq ` + _documentoID,
      type: "GET",
      headers: { 'Accept': 'application/json; odata=verbose;' },
      async: false,
      success: async (resultData) => {

        //  console.log("resultData doc", resultData);

        if (resultData.d.results.length > 0) {

          for (var i = 0; i < resultData.d.results.length; i++) {

            _pastaCriada = resultData.d.results[i].PastaCriada;

            var id = resultData.d.results[i].ID;
            var nomeProduto = resultData.d.results[i].NomeProduto;
            var cliente = resultData.d.results[i].Cliente;
            var SSTJira = resultData.d.results[i].SST;
            var codigoIndustrial = resultData.d.results[i].Title;
            var descricaoPacoteAdicionalSO = resultData.d.results[i].PacoteAdicionalSODescricao;
            var responsavelPacoteAdicionalSO = resultData.d.results[i].PacoteAdicionalSOResponsavel;
            var versaoMidiaMatriz = resultData.d.results[i].MidiaMatrizVersaoMidia;
            var status = resultData.d.results[i].Status;
            _status = status;
            _duplicado = resultData.d.results[i].Duplicado;

            var versao = resultData.d.results[i].Versao;
            _versao = versao;
            _novaVersao = resultData.d.results[i].Versao;
            _novaVersao++;

            if (_grupos.indexOf("DIPS - Engenharia (Elaborador)") !== -1) {

              jQuery("#cardAnexar").show();

            }


            if (status == "Em elaboração (Engenharia)") {

              if (_grupos.indexOf("DIPS - Engenharia (Elaborador)") !== -1) {

                jQuery("#btnValidarSalvar").show();
                jQuery("#btnValidarAprovacaoSuporte").show();

                jQuery("#btnAbrirModalCadastrarPreStage").show();
                jQuery("#btnAbrirModalCadastrarPreStageEmLote").show();
                jQuery("#btnAbrirModalCadastrarSetupBIOS").show();
                jQuery("#btnAbrirModalCadastrarModulos").show();
                jQuery("#btnAbrirModalCadastrarCheckList").show();

              }

            }

            else if ((status == "Aprovado")) {

              if (_grupos.indexOf("DIPS - Engenharia (Elaborador)") !== -1) {

                //jQuery("#btnValidarRevisaoSuporte").show();
                jQuery("#btnValidarRevisaoEngenharia").show();
                jQuery("#divMotivoAprovacao").show();

              }

              if (_grupos.indexOf("DIPS - Suporte") !== -1) {

                jQuery("#btnValidarRevisaoSuporte").show();
                jQuery("#divMotivoAprovacao").show();
                //jQuery("#btnValidarRevisaoEngenharia").show();

              }

            }

            else if (status == "Em revisão (Engenharia)") {

              if (_grupos.indexOf("DIPS - Engenharia (Elaborador)") !== -1) {

                jQuery("#btnValidarSalvar").show();
                jQuery("#btnValidarAprovacaoSuporte").show();

                jQuery("#btnAbrirModalCadastrarPreStage").show();
                jQuery("#btnAbrirModalCadastrarPreStageEmLote").show();
                jQuery("#btnAbrirModalCadastrarSetupBIOS").show();
                jQuery("#btnAbrirModalCadastrarModulos").show();
                jQuery("#btnAbrirModalCadastrarCheckList").show();

              }

            }

            else if (status == "Aguardando aprovação do Suporte") {

              if (_grupos.indexOf("DIPS - Suporte") !== -1) {

                jQuery("#btnValidarReprovar").show();
                jQuery("#btnValidarAprovar").show();
                jQuery("#divMotivoAprovacao").show();

                if (_versao == "-1") {

                  jQuery("#btnAbrirModalCadastrarPreStage").show();
                  jQuery("#btnAbrirModalCadastrarPreStageEmLote").show();
                  jQuery("#btnAbrirModalCadastrarSetupBIOS").show();
                  jQuery("#btnAbrirModalCadastrarModulos").show();
                  jQuery("#btnAbrirModalCadastrarCheckList").show();

                }


              }

            }

            else if (status == "Em revisão (Suporte)") {

              if (_grupos.indexOf("DIPS - Suporte") !== -1) {

                jQuery("#btnValidarAprovar").show();
                jQuery("#divMotivoAprovacao").show();
                jQuery("#btnValidarSalvar").show();

                jQuery("#btnAbrirModalCadastrarPreStage").show();
                jQuery("#btnAbrirModalCadastrarPreStageEmLote").show();
                jQuery("#btnAbrirModalCadastrarSetupBIOS").show();
                jQuery("#btnAbrirModalCadastrarModulos").show();
                jQuery("#btnAbrirModalCadastrarCheckList").show();

              }

            }


            var dataLiberacaoMidiaMatriz = resultData.d.results[i].MidiaMatrizDataLiberacao;
            var arquivoInstalacaoMidiaMatriz = resultData.d.results[i].MidiaMatrizArquivoRoteiroInstala;
            var responsavelGeracaoMidiaMatriz = resultData.d.results[i].MidiaMatrizResponsavelGeracao;

            if (resultData.d.results[i].MidiaMatrizInstalacao != null) {

              var arrInstalacaoMidiaMatriz = resultData.d.results[i].MidiaMatrizInstalacao.results;
              var arrTituloInstalacaoMidiaMatriz = [];

              if (arrInstalacaoMidiaMatriz.length > 0) {
                for (var x = 0; x < arrInstalacaoMidiaMatriz.length; x++) {
                  //console.log("arrInstalacaoMidiaMatriz[x]", arrInstalacaoMidiaMatriz[x]);
                  arrTituloInstalacaoMidiaMatriz.push(arrInstalacaoMidiaMatriz[x]);
                }
              }

              _instalacaoMidiaMatriz = arrInstalacaoMidiaMatriz;

            }

            //var strInstalacaoMidiaMatriz = arrTituloInstalacaoMidiaMatriz.toString();

            var notificarElaboracao = resultData.d.results[i].EmailElaboracao;
            var pacoteAdicionalSO = resultData.d.results[i].PacoteAdicionalSO;
            var midiaMatriz = resultData.d.results[i].MidiaMatriz;

            var siteAntigo = resultData.d.results[i].SiteAntigo;

            console.log("siteAntigo", siteAntigo);

            var sistemaOperacional;
            var vlrAntigoSistemaOperacional;

            if (siteAntigo != true) {
              sistemaOperacional = resultData.d.results[i].SistemaOperacionalSiteNovo;
              vlrAntigoSistemaOperacional = resultData.d.results[i].SistemaOperacionalSiteNovo;
            } else {
              sistemaOperacional = resultData.d.results[i].SistemaOperacional;
              vlrAntigoSistemaOperacional = resultData.d.results[i].SistemaOperacional;
            }

            jquery.ajax({
              url: `${this.props.siteurl}/_api/web/lists/getbytitle('Sistema Operacional')/items?$top=50&$filter=Ativo eq 1&$orderby= Title`,
              type: "GET",
              headers: { 'Accept': 'application/json; odata=verbose;' },
              success: async (resultData) => {

                var arrSistemaOperacional = [];

                if (resultData.d.results.length > 0) {

                  for (var i = 0; i < resultData.d.results.length; i++) {

                    arrSistemaOperacional.push(resultData.d.results[i].Title);

                  }

                }

                if (arrSistemaOperacional.indexOf(sistemaOperacional) == -1) {
                  console.log("entrou");
                  sistemaOperacional = "Outros";
                  jQuery("#txtSistemaOperacionalOutros").val(vlrAntigoSistemaOperacional);
                  jQuery('#ddlSistemaOperacional option[value="Outros"]').prop('selected', true)
                  jQuery('#divSistemaOperacionalOutros').show();
                }


                this.setState({
                  valorItemsCliente: cliente,
                  valorSistemaOperacional: sistemaOperacional
                });

              },
              error: function (jqXHR, textStatus, errorThrown) {
                console.log(jqXHR.responseText);
              }
            });


            if (sistemaOperacional != "Outros") {
              jQuery('#divSistemaOperacionalOutros').hide();
            }

            var outrasInformacoes = resultData.d.results[i].OutrasInformacoes;
            var cleanOutrasInformacoes = "";
            var txtOutrasInformacoes = "";


            if (outrasInformacoes != null) {

              txtOutrasInformacoes = outrasInformacoes.replace(/<[\/]{0,1}(div)[^><]*>/g, "");
              console.log("txtParametros", txtOutrasInformacoes);

              if (txtOutrasInformacoes.includes("<font")) {

                txtOutrasInformacoes = txtOutrasInformacoes.replace("font", "span");
                txtOutrasInformacoes = txtOutrasInformacoes.replace("font", "span");

              }

              if (txtOutrasInformacoes.includes("color")) {

                txtOutrasInformacoes = txtOutrasInformacoes.replace('color="', 'style="color:');

              }

              txtOutrasInformacoes = txtOutrasInformacoes.trim();

            }

            jQuery('#richTextOutrasInformacoes').find('.ql-editor').html(`${txtOutrasInformacoes}`);


            _pacoteAdicionalSO = pacoteAdicionalSO;
            _midiaMatriz = midiaMatriz;

            jQuery("#txtID").html(id);
            jQuery("#txtVersao").html(versao);
            jQuery("#txtNomeProduto").val(nomeProduto);
            jQuery("#txtSSTGira").val(SSTJira);
            jQuery("#txtCodIndustrial").val(codigoIndustrial);
            jQuery("#txtStatus").html(status);
            jQuery("#txtDescricaoPacoteAdicional").val(descricaoPacoteAdicionalSO);
            jQuery("#txtResponsavelPacoteAdicional").val(responsavelPacoteAdicionalSO);

            // console.log("versaoMidiaMatriz", versaoMidiaMatriz);

            jQuery("#txtVersaoMidiaMatriz").val(versaoMidiaMatriz);

            if (dataLiberacaoMidiaMatriz != null) {

              var dtdataLiberacaoMidiaMatriz = new Date(dataLiberacaoMidiaMatriz);

              _dataLiberacaoMidiaMatriz = dtdataLiberacaoMidiaMatriz;

            } else _dataLiberacaoMidiaMatriz = null;

            jQuery("#txtArquivoRoteiro").val(arquivoInstalacaoMidiaMatriz);

            jQuery("#txtResponsavelGeracaoMidiaMatriz").val(responsavelGeracaoMidiaMatriz);

            _arrEmailElaboracao = notificarElaboracao;

            //jQuery("#txtInstalacaoMidiaMatriz").val(strInstalacaoMidiaMatriz);
            //jQuery("#txtNotificarElaboracao").val(notificarElaboracao);
            //jQuery("#txtPacoteAdicionalSO").val(pacoteAdicionalSO);
            //jQuery("#txtMidiaMatriz").val(midiaMatriz);

            _nomeProdutoAtual = nomeProduto;
            _clienteAtual = cliente;
            _SSTJiraAtual = SSTJira;
            _codigoIndustrialAtual = codigoIndustrial;
            //_descricaoPacoteAdicionalSOAtual = descricaoPacoteAdicionalSO;

            if (responsavelPacoteAdicionalSO == null) {
              _responsavelPacoteAdicionalSOAtual = ""
            } else {
              _responsavelPacoteAdicionalSOAtual = responsavelPacoteAdicionalSO;
            }

            if (versaoMidiaMatriz == null) {
              _versaoMidiaMatrizAtual = ""
            } else {
              _versaoMidiaMatrizAtual = versaoMidiaMatriz;
            }

            _dataLiberacaoMidiaMatrizAtual = _dataLiberacaoMidiaMatriz;

            if (arquivoInstalacaoMidiaMatriz == null) {
              _arquivoInstalacaoMidiaMatrizAtual = ""
            } else {
              _arquivoInstalacaoMidiaMatrizAtual = arquivoInstalacaoMidiaMatriz;
            }


            if (responsavelGeracaoMidiaMatriz == null) {
              _responsavelGeracaoMidiaMatrizAtual = ""
            } else {
              _responsavelGeracaoMidiaMatrizAtual = responsavelGeracaoMidiaMatriz;
            }

            if (descricaoPacoteAdicionalSO == null) {
              _descricaoPacoteAdicionalSOAtual = ""
            } else {
              _descricaoPacoteAdicionalSOAtual = descricaoPacoteAdicionalSO;
            }


            if (_instalacaoMidiaMatriz == null) {
              _instalacaoMidiaMatrizAtual = []
            } else {
              _instalacaoMidiaMatrizAtual = _instalacaoMidiaMatriz;
            }


            _pacoteAdicionalSOAtual = _pacoteAdicionalSO;


            if (midiaMatriz == null) {
              _midiaMatrizAtual = ""
            } else {
              _midiaMatrizAtual = midiaMatriz;
            }

            _sistemaOperacionalAtual = sistemaOperacional;
            _outrasInformacoesatual = txtOutrasInformacoes;


          }

        }

      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(jqXHR.responseText);
      }

    })

  }

  private onFormatDate = (date: Date): string => {
    //return date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
    return ("0" + date.getDate()).slice(-2) + '/' + ("0" + (date.getMonth() + 1)).slice(-2) + '/' + date.getFullYear();
  };

  private onChangeCliente = (val) => {
    this.setState({
      valorItemsCliente: val,
    });
  }


  protected async getImagens() {

    var montaImagem = "";
    var montaOutros = "";

    var url = `${this.props.siteurl}/_api/web/lists/getByTitle('Documentos')/items('${_documentoID}')/AttachmentFiles`;
    var _url = this.props.siteurl;
    // console.log("url", url);

    $.ajax
      ({
        url: url,
        method: "GET",
        async: false,
        headers:
        {
          // Accept header: Specifies the format for response data from the server.
          "Accept": "application/json;odata=verbose"
        },
        success: async (resultData) => {

          var dataresults = resultData.d.results;

          var reactHandler = this;

          reactHandler.setState({
            itemsListImagensItem: dataresults
          });

        },
        error: function (xhr, status, error) {
          console.log("Falha anexo");
        }
      }).catch((error: any) => {
        console.log("Erro Anexo do item: ", error);
      });


    var relativeURL = window.location.pathname;

    var strRelativeURL = relativeURL.replace("SitePages/Documentos-Editar.aspx", "");

    await _web.getFolderByServerRelativeUrl(`${strRelativeURL}/Imagens/${_documentoID}`).files.orderBy('TimeLastModified', true)

      .expand('ListItemAllFields', 'Author').get().then(r => {

        console.log("r", r);

        var reactHandler = this;

        reactHandler.setState({
          itemsListImagens: r
        });

      }).catch((error: any) => {
        console.log("Erro onChangeCliente: ", error);
      });


  }


  async excluirAnexoItem(ServerRelativeUr, name, elemento, elemento2) {

    if (confirm("Deseja realmente excluir o arquivo " + name + "?") == true) {

      var relativeURL = window.location.pathname;
      var strRelativeURL = relativeURL.replace("SitePages/Documentos-Editar.aspx", "");

      // console.log("(`${strRelativeURL}/Lists/Documentos/Attachments/${_documentoID}`)", (`${strRelativeURL}/Lists/Documentos/Attachments/${_documentoID}`))

      await _web.getFolderByServerRelativeUrl(`${strRelativeURL}/Lists/Documentos/Attachments/${_documentoID}`).files.getByName(name).delete()
        .then(async response => {
          jQuery(`#${elemento}`).hide();
          jQuery(`#${elemento2}`).hide();
          alert("Arquivo excluido com sucesso.");
        }).catch(console.error());

    } else {
      return false;
    }
  }


  async excluirAnexo(ServerRelativeUr, name, elemento, elemento2) {


    if (confirm("Deseja realmente excluir o arquivo " + name + "?") == true) {

      //  console.log("ServerRelativeUr", ServerRelativeUr);
      //  console.log("name", name);
      await _web.getFolderByServerRelativeUrl(ServerRelativeUr).files.getByName(name).delete()
        .then(async response => {
          jQuery(`#${elemento}`).hide();
          jQuery(`#${elemento2}`).hide();
          alert("Arquivo excluido com sucesso.");
        }).catch(console.error());

    } else {
      return false;
    }

  }

  private onTextChange = (newText: string) => {
    _outrasInformacoes = newText;
    return newText;
  }

  private onTextChangeCadastrarPreStageSoftwareObservacao = (newText: string) => {

    _preStageSoftwareObservacao = newText;
    return newText;
  }

  private onTextChangeCadastrarSetupBIOSParametros = (newText: string) => {

    _setupBIOSParametros = newText;
    return newText;
  }

  private onTextChangeCadastrarModulosParametros = (newText: string) => {

    _modulosParametros = newText;
    return newText;
  }

  private onTextChangeCadastrarCheckListDivergencias = (newText: string) => {

    _checkListDivergencias = newText;
    return newText;
  }

  private onTextChangeEditarPreStageSoftwareObservacao = (newText: string) => {

    _preStageSoftwareObservacaoEditar = newText;
    return newText;
  }

  private onTextChangeEditarSetupBIOSParametros = (newText: string) => {

    _setupBIOSParametrosEditar = newText;
    return newText;
  }

  private onTextChangeEditarModulosParametros = (newText: string) => {

    _modulosParametrosEditar = newText;
    return newText;
  }

  private onTextChangeEditarCheckListDivergencias = (newText: string) => {

    _checkListDivergenciasEditar = newText;
    return newText;
  }



  private onChangeSistemaOperacional = (val) => {

    if (val == "Outros") {

      jQuery('#txtSistemaOperacionalOutros').val("");
      jQuery('#divSistemaOperacionalOutros').show();

    } else {

      jQuery('#txtSistemaOperacionalOutros').val("");
      jQuery('#divSistemaOperacionalOutros').hide();

    }

    this.setState({
      valorSistemaOperacional: val,
    });

  }


  protected async fecharSucesso() {

    $("#modalSucesso").modal('hide');
    window.location.href = `Documentos-Editar.aspx?DocumentoID=` + _documentoID;

  }

  protected async fecharSucessoAprovacao() {

    $("#modalSucessoAprovacao").modal('hide');
    $("#modalSucessoRevisaoSuporte").modal('hide');
    $("#modalSucessoRevisaoEngenharia").modal('hide');
    $("#modalSucessoReprovado").modal('hide');
    $("#modalSucessoAprovado").modal('hide');
    window.location.href = `Documentos-Todos.aspx`;

  }

  protected fecharSucessoPreStage() {

    var reactHandlerPreStageSoftware = this;

    jQuery.ajax({
      url: `${this.props.siteurl}/_api/web/lists/getbytitle('Pre Stage de Hardware')/items?$top=200&$orderby= ID asc&$select=ID,Title,Modelo,Fabricante,Created,Author/Title,FW,BIOS,PORT,SLOT,ItemObrigatorio,Observacao,Conexao&$expand=Author&$filter=DIP/ID eq ` + _documentoID,
      type: "GET",
      headers: { 'Accept': 'application/json; odata=verbose;' },
      success: function (resultData) {
        if (resultData.d.results.length > 0) {
          jQuery("#tabelaPreStageSoftware").show();
          reactHandlerPreStageSoftware.setState({
            itemsListPreStageSoftware: resultData.d.results
          });
        } else {
          jQuery("#tabelaPreStageSoftware").hide();
          reactHandlerPreStageSoftware.setState({
            itemsListPreStageSoftware: resultData.d.results
          });
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(jqXHR.responseText);
      }
    });

    $("#modalSucessoCadastrarPreStage").modal('hide');
    $("#modalSucessoEditarPreStage").modal('hide');
    $("#modalSucessoExcluirPreStage").modal('hide');
    $("#modalSucessoCadastrarPreStageEmLote").modal('hide');

  }


  protected fecharSucessoSetupBIOS() {

    var reactHandlerSetupBios = this;

    jQuery.ajax({
      url: `${this.props.siteurl}/_api/web/lists/getbytitle('Setup de BIOS')/items?$top=50&$orderby= ID asc&$select=ID,Title,Itens,Created,Author/Title&$expand=Author&$filter=DIP/ID eq ` + _documentoID,
      type: "GET",
      headers: { 'Accept': 'application/json; odata=verbose;' },
      success: function (resultData) {
        if (resultData.d.results.length > 0) {
          jQuery("#tabelaSetupBios").show();
          reactHandlerSetupBios.setState({
            itemsListSetupBios: resultData.d.results
          });
        } else {
          jQuery("#tabelaSetupBios").hide();
          reactHandlerSetupBios.setState({
            itemsListSetupBios: resultData.d.results
          });
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(jqXHR.responseText);
      }
    });

    $("#modalSucessoCadastrarSetupBIOS").modal('hide');
    $("#modalSucessoEditarSetupBIOS").modal('hide');
    $("#modalSucessoExcluirSetupBIOS").modal('hide');

  }

  protected fecharSucessoModulos() {

    var reactHandlerSetupItensModulos = this;

    jQuery.ajax({
      url: `${this.props.siteurl}/_api/web/lists/getbytitle('SetupItensModulos')/items?$top=50&$orderby= ID asc&$select=ID,Title,Created,Author/Title,Parametros&$expand=Author&$filter=DIPS/ID eq ` + _documentoID,
      type: "GET",
      headers: { 'Accept': 'application/json; odata=verbose;' },
      success: function (resultData) {
        if (resultData.d.results.length > 0) {
          jQuery("#tabelaSetupItensModulos").show();
          reactHandlerSetupItensModulos.setState({
            itemsSetupItensModulos: resultData.d.results
          });
        } else {
          jQuery("#tabelaSetupItensModulos").hide();
          reactHandlerSetupItensModulos.setState({
            itemsSetupItensModulos: resultData.d.results
          });
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(jqXHR.responseText);
      }
    });

    $("#modalSucessoCadastrarModulos").modal('hide');
    $("#modalSucessoEditarModulos").modal('hide');
    $("#modalSucessoExcluirModulos").modal('hide');

  }

  protected fecharSucessoCheckList() {

    var reactHandlerCheckList = this;

    jQuery.ajax({
      url: `${this.props.siteurl}/_api/web/lists/getbytitle('Checklist')/items?$top=50&$orderby= ID asc&$select=ID,Title,Created,Author/Title,Divergencias&$expand=Author&$filter=DIPS/ID eq ` + _documentoID,
      type: "GET",
      headers: { 'Accept': 'application/json; odata=verbose;' },
      success: function (resultData) {
        if (resultData.d.results.length > 0) {
          console.log("entrou no reactHandlerCheckList");
          jQuery("#tabelaCheckList").show();
          reactHandlerCheckList.setState({
            itemsCheckList: resultData.d.results
          });
        } else {
          jQuery("#tabelaCheckList").hide();
          reactHandlerCheckList.setState({
            itemsCheckList: resultData.d.results
          });
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(jqXHR.responseText);
      }
    });

    $("#modalSucessoCadastrarCheckList").modal('hide');
    $("#modalSucessoEditarCheckList").modal('hide');
    $("#modalSucessoExcluirCheckList").modal('hide');

  }

  protected async cadastrarPreStage() {

    jQuery("#btnCadastrarPreStage").prop("disabled", true);

    //var observacao = _preStageSoftwareObservacao;

    var componente = jQuery("#txtComponenteCadastrar").val();
    var modelo = jQuery("#txtModeloCadastrar").val();
    var fabricante = jQuery("#txtFabricanteCadastrar").val();
    var fw = jQuery("#txtFWCadastrar").val();
    var bios = jQuery("#txtBIOSCadastrar").val();
    var conexao = jQuery("#txtConexaoCadastrar").val();
    var port = jQuery("#txtPORTCadastrar").val();
    var slot = jQuery("#txtSLOTCadastrar").val();
    var itemObrigatorio = jQuery("#txtItemObrigatorioCadastrar").val();
    var observacao = _preStageSoftwareObservacao;

    //validacao
    if (componente == "") {
      alert("Forneça o nome do componente!");
      jQuery("#btnCadastrarPreStage").prop("disabled", false);
      return false;
    }

    //cadastrar
    await _web.lists
      .getByTitle("Pre Stage de Hardware")
      .items.add({
        DIPId: _documentoID,
        Title: componente,
        Modelo: modelo,
        Fabricante: fabricante,
        FW: fw,
        BIOS: bios,
        Conexao: conexao,
        PORT: port,
        SLOT: slot,
        ItemObrigatorio: itemObrigatorio,
        Observacao: observacao,
      })
      .then(response => {

        var texto = `O item ${componente} foi adicionado a lista Pre Stage`
        this.gravaHistoricoAdicionarItem(texto, "PreStage");

      })
      .catch((error: any) => {
        console.log(error);
      })

  }

  protected async cadastrarPreStageEmLote() {

    jQuery("#btnCadastrarPreStageEmLote").prop("disabled", true);

    console.log("_colunasExcel", _colunasExcel);

    console.log("_colunasExcel.length", _colunasExcel.length);

    if (_colunasExcel.length > 0) {

      var ultimo = _colunasExcel.length - 1;

      for (var i = 1; i < _colunasExcel.length; i++) {

        console.log("i", i);

        var title = _colunasExcel[i][0];
        var modelo = _colunasExcel[i][1];
        var fabricante = _colunasExcel[i][2];
        var FW = _colunasExcel[i][3];
        var BIOS = _colunasExcel[i][4];
        var conexao = _colunasExcel[i][5];
        var PORT = _colunasExcel[i][6];
        var SLOT = _colunasExcel[i][7];
        var itemObrigatorio = _colunasExcel[i][8];
        var observacao = _colunasExcel[i][9];

        console.log("_documentoID", _documentoID);
        console.log("title", title);
        console.log("modelo", modelo);
        console.log("fabricante", fabricante);
        console.log("FW", FW);
        console.log("BIOS", BIOS);
        console.log("conexao", conexao);
        console.log("PORT", PORT);
        console.log("SLOT", SLOT);
        console.log("itemObrigatorio", itemObrigatorio);
        console.log("observacao", observacao);

        if (title == undefined) title = "";
        if (modelo == undefined) modelo = "";
        if (fabricante == undefined) fabricante = "";
        if (FW == undefined) FW = "";
        if (BIOS == undefined) BIOS = "";
        if (conexao == undefined) conexao = "";
        if (PORT == undefined) PORT = "";
        if (SLOT == undefined) SLOT = "";
        if (itemObrigatorio == undefined) itemObrigatorio = "";
        if (observacao == undefined) observacao = "";

        if (title != null) {

          await _web.lists
            .getByTitle("Pre Stage de Hardware")
            .items.add({
              DIPId: _documentoID,
              Title: `${title}`,
              Modelo: `${modelo}`,
              Fabricante: `${fabricante}`,
              FW: `${FW}`,
              BIOS: `${BIOS}`,
              Conexao: `${conexao}`,
              PORT: `${PORT}`,
              SLOT: `${SLOT}`,
              ItemObrigatorio: `${itemObrigatorio}`,
              Observacao: `<p>${observacao}</p>`,
            })
            .then(response => {

              console.log("gravou pre stage do lote");

              if (ultimo == i) {

                jQuery("#modalCadastrarPreStageSoftwareEmLote").modal('hide');
                jQuery("#modalSucessoCadastrarPreStageEmLote").modal({ backdrop: 'static', keyboard: false })

              }


            })
            .catch((error: any) => {
              console.log(error);
            })

        }


      }

    } else {

      jQuery("#btnCadastrarPreStageEmLote").prop("disabled", false);
      alert("Nenhum registro encontrado!");
      return false;

    }
  }

  protected async cadastrarSetupBIOS() {

    jQuery("#btnCadastrarSetupBIOS").prop("disabled", true);

    var itens = $("#txtItensSetupBIOSCadastrar").val();

    var parametros = _setupBIOSParametros;

    console.log("parametros", parametros);

    if (itens == "") {
      alert("Forneça o nome do item!");
      jQuery("#btnCadastrarSetupBIOS").prop("disabled", false);
      return false;
    }

    if (parametros == "") {
      alert("Forneça um parâmetro!");
      jQuery("#btnCadastrarSetupBIOS").prop("disabled", false);
      return false;
    }

    if (parametros == "<p><br></p>") {
      alert("Forneça um parâmetro!");
      jQuery("#btnCadastrarSetupBIOS").prop("disabled", false);
      return false;
    }


    await _web.lists
      .getByTitle("Setup de BIOS")
      .items.add({
        DIPId: _documentoID,
        Title: itens,
        Itens: parametros,
      })
      .then(response => {

        var texto = `O item ${itens} foi adicionado a lista Setup BIOS`
        this.gravaHistoricoAdicionarItem(texto, "SetupBIOS");

      })
      .catch((error: any) => {
        console.log(error);
      })


  }

  protected async cadastrarModulos() {

    jQuery("#btnCadastrarModulos").prop("disabled", true);

    var itens = $("#txtItensModulosCadastrar").val();

    var parametros = _modulosParametros;

    if (itens == "") {
      jQuery("#btnCadastrarModulos").prop("disabled", false);
      alert("Forneça o nome do item!");
      return false;
    }

    if (parametros == "") {
      jQuery("#btnCadastrarModulos").prop("disabled", false);
      alert("Forneça um parâmetro!");
      return false;
    }

    await _web.lists
      .getByTitle("SetupItensModulos")
      .items.add({
        DIPSId: _documentoID,
        Title: itens,
        Parametros: parametros,
      })
      .then(response => {

        var texto = `O item ${itens} foi adicionado a lista Setup de Itens/Módulos`
        this.gravaHistoricoAdicionarItem(texto, "Modulos");

      })
      .catch((error: any) => {
        console.log(error);
      })


  }

  protected async cadastrarCheckList() {

    jQuery("#btnCadastrarCheckList").prop("disabled", true);

    var sn = jQuery("#txtSNCadastrarCheckList").val();

    var parametros = _checkListDivergencias;

    if (sn == "") {
      jQuery("#btnCadastrarCheckList").prop("disabled", false);
      alert("Forneça o S/N");
      return false;
    }

    if (parametros == "") {
      jQuery("#btnCadastrarCheckList").prop("disabled", false);
      alert("Forneça um parâmetro!");
      return false;
    }

    await _web.lists
      .getByTitle("Checklist")
      .items.add({
        DIPSId: _documentoID,
        Title: sn,
        Divergencias: parametros,
      })
      .then(response => {

        var texto = `O item ${sn} foi adicionado a lista Checklist`
        this.gravaHistoricoAdicionarItem(texto, "CheckList");

      })
      .catch((error: any) => {
        console.log(error);
      })


  }

  protected abrirModalCadastrarPreStage() {

    jQuery("#txtComponenteCadastrar").val("");
    jQuery("#txtModeloCadastrar").val("");
    jQuery("#txtFabricanteCadastrar").val("");
    jQuery("#txtFWCadastrar").val("");
    jQuery("#txtBIOSCadastrar").val("");
    jQuery("#txtConexaoCadastrar").val("");
    jQuery("#txtPORTCadastrar").val("");
    jQuery("#txtSLOTCadastrar").val("");
    jQuery("#txtItemObrigatorioCadastrar").val("");
    jQuery('#RichTextObservacaoPreStageCadastrar').find('.ql-editor').html("<p><br></p>");
    jQuery("#modalCadastrarPreStageSoftware").modal({ backdrop: 'static', keyboard: false });

  }

  protected abrirModalCadastrarPreStageEmLote() {

    jQuery("#btnEditarPreStageSoftware").prop("disabled", false);
    jQuery("#modalCadastrarPreStageSoftwareEmLote").modal({ backdrop: 'static', keyboard: false });

  }

  protected async editarPreStage() {

    jQuery("#btnEditarPreStageSoftware").prop("disabled", true);

    var id = jQuery("#txtID").val();
    var componente = jQuery("#txtComponenteEditar").val();
    var modelo = jQuery("#txtModeloEditar").val();
    var fabricante = jQuery("#txtFabricanteEditar").val();
    var fw = jQuery("#txtFWEditar").val();
    var bios = jQuery("#txtBIOSEditar").val();
    var conexao = jQuery("#txtConexaoEditar").val();
    var port = jQuery("#txtPORTEditar").val();
    var slot = jQuery("#txtSLOTEditar").val();
    var itemObrigatorio = jQuery("#txtItemObrigatorioEditar").val();
    var observacao = _preStageSoftwareObservacaoEditar;

    //validacao
    if (componente == "") {
      alert("Forneça o nome do componente!");
      jQuery("#btnEditarPreStageSoftware").prop("disabled", false);
      return false;
    }
    //cadastrar
    await _web.lists
      .getByTitle("Pre Stage de Hardware")
      .items.getById(id).update({
        DIPId: _documentoID,
        Title: componente,
        Modelo: modelo,
        Fabricante: fabricante,
        FW: fw,
        BIOS: bios,
        Conexao: conexao,
        PORT: port,
        SLOT: slot,
        ItemObrigatorio: itemObrigatorio,
        Observacao: observacao,
      })
      .then(response => {

        var texto = `O item ${componente} foi alterado na lista Pre Stage`
        this.gravaHistoricoAlterarItem(texto, "PreStage");

      })
      .catch((error: any) => {
        console.log(error);
      })

  }

  protected async editarSetupBIOS() {

    jQuery("#btnEditarSetupBIOS").prop("disabled", true);

    var id = $("#txtSetupBIOSID").val();
    var itens = $("#txtItensSetupBIOSEditar").val();
    var parametros = _setupBIOSParametros;

    console.log("parametros", parametros);

    if (itens == "") {
      jQuery("#btnEditarSetupBIOS").prop("disabled", false);
      alert("Forneça o nome do item!");
      return false;
    }

    if (parametros == "") {
      jQuery("#btnEditarSetupBIOS").prop("disabled", false);
      alert("Forneça um parâmetro!");
      return false;
    }

    if (parametros == "<p><br></p>") {
      jQuery("#btnEditarSetupBIOS").prop("disabled", false);
      alert("Forneça um parâmetro!");
      return false;
    }

    await _web.lists
      .getByTitle("Setup de BIOS")
      .items.getById(id).update({
        DIPId: _documentoID,
        Title: itens,
        Itens: parametros,
      })
      .then(response => {

        var texto = `O item ${itens} foi alterado na lista Setup de BIOS`
        this.gravaHistoricoAlterarItem(texto, "SetupBIOS");

      })
      .catch((error: any) => {
        console.log(error);
      })



  }

  protected async editarModulos() {

    jQuery("#btnEditarModulos").prop("disabled", true);

    var id = $("#txtModulosID").val();
    var itens = $("#txtItensModulosEditar").val();
    var parametros = _modulosParametrosEditar;

    if (itens == "") {
      jQuery("#btnEditarModulos").prop("disabled", false);
      alert("Forneça o nome do item!");
      return false;
    }

    if (parametros == "") {
      jQuery("#btnEditarModulos").prop("disabled", false);
      alert("Forneça um parâmetro!");
      return false;
    }

    await _web.lists
      .getByTitle("SetupItensModulos")
      .items.getById(id).update({
        DIPSId: _documentoID,
        Title: itens,
        Parametros: parametros,
      })
      .then(response => {

        var texto = `O item ${itens} foi alterado na lista Setup de Itens/Módulos`
        this.gravaHistoricoAlterarItem(texto, "Modulos");

      })
      .catch((error: any) => {
        console.log(error);
      })



  }

  protected async editarCheckList() {

    var id = $("#txtCheckListID").val();

    jQuery("#btnEditarCheckList").prop("disabled", true);

    var sn = jQuery("#txtSNEditarCheckList").val();

    var parametros = _checkListDivergencias;

    if (sn == "") {
      jQuery("#btnEditarCheckList").prop("disabled", false);
      alert("Forneça o S/N");
      return false;
    }

    if (parametros == "") {
      jQuery("#btnEditarCheckList").prop("disabled", false);
      alert("Forneça um parâmetro!");
      return false;
    }

    await _web.lists
      .getByTitle("Checklist")
      .items.getById(id).update({
        DIPSId: _documentoID,
        Title: sn,
        Divergencias: parametros,
      })
      .then(response => {

        var texto = `O item ${sn} foi alterado na lista Checklist`
        this.gravaHistoricoAlterarItem(texto, "CheckList");

      })
      .catch((error: any) => {
        console.log(error);
      })

  }

  protected abrirModalCadastrarSetupBIOS() {

    jQuery("#txtItensSetupBIOSCadastrar").val("");
    jQuery('#RichTextObservacaoSetupBIOSCadastrar').find('.ql-editor').html("<p><br></p>");
    jQuery("#modalCadastrarSetupBIOS").modal({ backdrop: 'static', keyboard: false });

  }

  protected abrirModalCadastrarModulos() {

    jQuery("#txtItensModulosCadastrar").val("");
    jQuery('#RichTextParametrosModulosCadastrar').find('.ql-editor').html("<p><br></p>");
    jQuery("#modalCadastrarModulos").modal({ backdrop: 'static', keyboard: false });

  }

  protected abrirModalCadastrarCheckList() {

    jQuery("#txtSNCadastrarCheckList").val("");
    jQuery('#RichTextDivergenciasCheckListCadastrar').find('.ql-editor').html("<p><br></p>");
    jQuery("#modalCadastrarCheckList").modal({ backdrop: 'static', keyboard: false });

  }

  protected validar(opcao) {

    var nomeProduto = $("#txtNomeProduto").val();
    var cliente = $("#ddlCliente option:selected").text();
    var SSTGira = $("#txtSSTGira").val();
    var codIndustrial = $("#txtCodIndustrial").val();
    var motivo = $("#txtMotivoAprovacao").val();

    var arrInstalacaoMidiaMatriz = [];
    $.each($("input[name='checkInstalacaoMidiaMatriz']:checked"), function () {
      arrInstalacaoMidiaMatriz.push($(this).val());
    });

    var arrPacoteAdicionalSO = [];
    $.each($("input[name='checkPacoteAdicionalSO']:checked"), function () {
      arrPacoteAdicionalSO.push($(this).val());
    });

    var arrMidiaMatriz = [];
    $.each($("input[name='checkMidiaMatriz']:checked"), function () {
      arrMidiaMatriz.push($(this).val());
    });

    var sistemaOperacional = $("#ddlSistemaOperacional").val();

    if (nomeProduto == "") {
      alert("Forneça o nome do produto!");
      document.getElementById('headingInformacoesProduto').scrollIntoView();
      return false;
    }

    if (cliente == "Selecione...") {
      alert("Escolha um cliente!");
      document.getElementById('headingInformacoesProduto').scrollIntoView();
      return false;
    }

    if (SSTGira == "") {
      alert("Forneça o código SST/GIRA!");
      document.getElementById('headingInformacoesProduto').scrollIntoView();
      return false;
    }

    if (codIndustrial == "") {
      alert("Forneça o código industrial!");
      document.getElementById('headingInformacoesProduto').scrollIntoView();
      return false;
    }

    if (arrPacoteAdicionalSO.length == 0) {
      alert("Escolha uma opção para 'Pacote Adicional ao S.O. OEM'!");
      document.getElementById('headingPreStageSoftware').scrollIntoView();
      return false;
    }

    if (arrMidiaMatriz.length == 0) {
      alert("Escolha uma opção para 'Mídia Matriz'!");
      document.getElementById('headingPreStageSoftware').scrollIntoView();
      return false;
    }

    if (sistemaOperacional == "0") {
      alert("Escolha um Sistema Operacional!");
      document.getElementById('headingPreStageSoftware').scrollIntoView();
      return false;
    }

    else if (sistemaOperacional == "Outros") {
      var sistemaOperacionalOutros = $("#txtSistemaOperacionalOutros").val();
      if (sistemaOperacionalOutros == "") {
        alert("Escolha um Sistema Operacional!");
        document.getElementById('headingPreStageSoftware').scrollIntoView();
        return false;
      }
    }

    var files = (document.querySelector("#input") as HTMLInputElement).files;

    if (files.length > 0) {

      console.log("files.length", files.length);

      for (var i = 0; i <= files.length - 1; i++) {

        var fsize = files.item(i).size;
        _size = _size + fsize;

        console.log("fsize", fsize);

      }

      if (_size > 15000000) {
        alert("A soma dos arquivos não pode ser maior que 15mega!");
        _size = 0;
        return false;
      }

    }

    if (opcao == "Salvar") {
      jQuery("#modalConfirmar").modal({ backdrop: 'static', keyboard: false });
    }

    else if (opcao == "EnviarAprovacao") {

      jQuery("#modalConfirmarEnviarAprovacao").modal({ backdrop: 'static', keyboard: false });

    }

    else if (opcao == "EnviarRevisaoSuporte") {

      if (motivo == "") {

        alert("Forneça um motivo para revisão!");
        document.getElementById('headingAcoes').scrollIntoView();
        return false;

      }

      jQuery("#modalConfirmarRevisaoSuporte").modal({ backdrop: 'static', keyboard: false });

    }

    else if (opcao == "EnviarRevisaoEngenharia") {

      if (motivo == "") {

        alert("Forneça um motivo para revisão!");
        document.getElementById('headingAcoes').scrollIntoView();
        return false;

      }

      jQuery("#modalConfirmarRevisaoEngenharia").modal({ backdrop: 'static', keyboard: false });

    }

    else if (opcao == "Aprovar") {

      jQuery("#modalConfirmarAprovar").modal({ backdrop: 'static', keyboard: false });

    }

    else if (opcao == "Reprovar") {

      if (_status == "Aguardando aprovação do Suporte") {

        if (motivo == "") {

          alert("Forneça um motivo para reprovação!");
          document.getElementById('headingAcoes').scrollIntoView();
          return false;

        }

      }
      jQuery("#modalConfirmarReprovar").modal({ backdrop: 'static', keyboard: false });
    }

  }

  protected async editar(opcao) {

    $("#modalConfirmar").modal('hide');
    jQuery("#modalCarregando").modal({ backdrop: 'static', keyboard: false });

    var nomeProduto = $("#txtNomeProduto").val();
    var cliente = $("#ddlCliente").val();
    var SSTGira = $("#txtSSTGira").val();
    var codIndustrial = $("#txtCodIndustrial").val();
    var descricaoPacoteAdicional = $("#txtDescricaoPacoteAdicional").val();
    var responsavelPacoteAdicional = $("#txtResponsavelPacoteAdicional").val();
    var versaoMidiaMatriz = $("#txtVersaoMidiaMatriz").val();

    var dataLiberacaoMidiaMatriz = `${jQuery("#dtDataLiberacaoMidiaMatriz-label").val()}`;
    var dataLiberacaoMidiaMatrizDia = dataLiberacaoMidiaMatriz.substring(0, 2);
    var dataLiberacaoMidiaMatrizMes = dataLiberacaoMidiaMatriz.substring(3, 5);
    var dataLiberacaoMidiaMatrizAno = dataLiberacaoMidiaMatriz.substring(6, 10);
    var formDataLiberacaoMidiaMatriz = dataLiberacaoMidiaMatrizAno + "-" + dataLiberacaoMidiaMatrizMes + "-" + dataLiberacaoMidiaMatrizDia;
    var formDataLiberacaoMidiaMatrizHistorico = dataLiberacaoMidiaMatrizDia + "/" + dataLiberacaoMidiaMatrizMes + "/" + dataLiberacaoMidiaMatrizAno;

    if (dataLiberacaoMidiaMatriz == "") formDataLiberacaoMidiaMatriz = null;

    var arquivoRoteiro = $("#txtArquivoRoteiro").val();
    var responsavelGeracaoMidiaMatriz = $("#txtResponsavelGeracaoMidiaMatriz").val();

    var arrInstalacaoMidiaMatriz = [];
    $.each($("input[name='checkInstalacaoMidiaMatriz']:checked"), function () {
      arrInstalacaoMidiaMatriz.push($(this).val());
    });

    var arrPacoteAdicionalSO = [];
    $.each($("input[name='checkPacoteAdicionalSO']:checked"), function () {
      arrPacoteAdicionalSO.push($(this).val());
    });

    var arrMidiaMatriz = [];
    $.each($("input[name='checkMidiaMatriz']:checked"), function () {
      arrMidiaMatriz.push($(this).val());
    });

    var sistemaOperacional = $("#ddlSistemaOperacional").val();

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

    // console.log("nomeProduto", nomeProduto);
    // console.log("cliente", cliente);
    // console.log("SSTGira", SSTGira);
    // console.log("codIndustrial", codIndustrial);
    // console.log("descricaoPacoteAdicional", descricaoPacoteAdicional);
    // console.log("responsavelPacoteAdicional", responsavelPacoteAdicional);
    // console.log("versaoMidiaMatriz", versaoMidiaMatriz);
    // console.log("formLiberacaoMidiaMatriz", formDataLiberacaoMidiaMatriz);
    // console.log("arquivoRoteiro", arquivoRoteiro);
    // console.log("responsavelGeracaoMidiaMatriz", responsavelGeracaoMidiaMatriz);
    // console.log("arrInstalacaoMidiaMatriz", arrInstalacaoMidiaMatriz);
    // console.log("arrEmailElaboracao", arrEmailElaboracao[0]);
    // console.log("arrPacoteAdicionalSO", arrPacoteAdicionalSO[0]);
    // console.log("arrMidiaMatriz", arrMidiaMatriz[0]);
    // console.log("sistemaOperacional", sistemaOperacional);
    // console.log("outrasInformacoes", outrasInformacoes);

    var status;

    var versao;

    if (opcao == "Salvar") {
      status = _status;
      versao = _versao;
    }

    else if (opcao == "EnviarAprovacao") {
      status = "Aguardando aprovação do Suporte";
      versao = _versao;
    }

    else if (opcao == "EnviarRevisaoSuporte") {
      status = "Em revisão (Suporte)";
      versao = _versao;
    }

    else if (opcao == "EnviarRevisaoEngenharia") {
      status = "Em revisão (Engenharia)";
      versao = _versao;
    }

    else if (opcao == "Aprovar") {
      status = "Aprovado";
      versao = _novaVersao;
    }

    else if (opcao == "Reprovar") {
      if (_status == "Em revisão (Suporte)") {
        status = "Em revisão (Engenharia)";
        versao = _versao;
      }
      else {
        status = "Em elaboração (Engenharia)";
        versao = _versao;
      }
    }

    _novoStatus = status;

    console.log("opcao", opcao);

    if (opcao != "EnviarAprovacao") {

      console.log("Entrou nas validações de alterações");

      if (_nomeProdutoAtual != nomeProduto) {
        _arrAlteracoesFormPrincipal.push(`O campo "Nome do produto" foi alterado de "${_nomeProdutoAtual}" para "${nomeProduto}"`);
        console.log(`O campo "Nome do produto" foi alterado de "${_nomeProdutoAtual}" para "${nomeProduto}"`);
      }
      if (_clienteAtual != cliente) {
        _arrAlteracoesFormPrincipal.push(`O campo "Cliente" foi alterado de "${_clienteAtual}" para "${cliente}"`);
        console.log(`O campo "Cliente" foi alterado de "${_clienteAtual}" para "${cliente}"`);
      }
      if (_SSTJiraAtual != SSTGira) {
        _arrAlteracoesFormPrincipal.push(`O campo "SST/JIRA" foi alterado de "${_SSTJiraAtual}" para "${SSTGira}"`);
        console.log(`O campo "SST/JIRA" foi alterado de "${_SSTJiraAtual}" para "${SSTGira}"`);
      }
      if (_codigoIndustrialAtual != codIndustrial) {
        _arrAlteracoesFormPrincipal.push(`O campo "Código Industrial" foi alterado de "${_codigoIndustrialAtual}" para "${codIndustrial}"`);
        console.log(`O campo "Código Industrial" foi alterado de "${_codigoIndustrialAtual}" para "${codIndustrial}"`);
      }
      if (_descricaoPacoteAdicionalSOAtual != descricaoPacoteAdicional) {
        _arrAlteracoesFormPrincipal.push(`O campo "Descrição (Pacote Adicional ao S.O. OEM)" foi alterado de "${_descricaoPacoteAdicionalSOAtual}" para "${descricaoPacoteAdicional}"`);
        console.log(`O campo "Descrição (Pacote Adicional ao S.O. OEM)" foi alterado de "${_descricaoPacoteAdicionalSOAtual}" para "${descricaoPacoteAdicional}"`);
      }
      if (_responsavelPacoteAdicionalSOAtual != responsavelPacoteAdicional) {
        _arrAlteracoesFormPrincipal.push(`O campo "Responsável (Pacote Adicional ao S.O. OEM)" foi alterado de "${_responsavelPacoteAdicionalSOAtual}" para "${responsavelPacoteAdicional}"`);
        console.log(`O campo "Responsável (Pacote Adicional ao S.O. OEM)" foi alterado de "${_responsavelPacoteAdicionalSOAtual}" para "${responsavelPacoteAdicional}"`);
      };
      if (_versaoMidiaMatrizAtual != versaoMidiaMatriz) {
        _arrAlteracoesFormPrincipal.push(`O campo "Versão da Mídia (Mídia Matriz)" foi alterado de "${_versaoMidiaMatrizAtual}" para "${versaoMidiaMatriz}"`);
        console.log(`O campo "Versão da Mídia (Mídia Matriz)" foi alterado de "${_versaoMidiaMatrizAtual}" para "${versaoMidiaMatriz}"`);
      }

      var strDataLiberacaoMidiaMAtriz = "";
      var validaFormDataLiberacaoMidiaMatriz;
      var strDataLiberacaoMidiaMAtrizHistorico = "";

      if (formDataLiberacaoMidiaMatriz == null) {

        validaFormDataLiberacaoMidiaMatriz = "";

      }
      else {

        validaFormDataLiberacaoMidiaMatriz = formDataLiberacaoMidiaMatriz;
      }

      if (_dataLiberacaoMidiaMatriz != null) {

        var strDataLiberacaoMidiaMAtriz = _dataLiberacaoMidiaMatriz.getFullYear() + '-' + ("0" + (_dataLiberacaoMidiaMatriz.getMonth() + 1)).slice(-2) + '-' + ("0" + _dataLiberacaoMidiaMatriz.getDate()).slice(-2);
        var strDataLiberacaoMidiaMAtrizHistorico = ("0" + _dataLiberacaoMidiaMatriz.getDate()).slice(-2) + '/' + ("0" + (_dataLiberacaoMidiaMatriz.getMonth() + 1)).slice(-2) + '/' + _dataLiberacaoMidiaMatriz.getFullYear();

      }

      //console.log("strDataLiberacaoMidiaMAtriz",strDataLiberacaoMidiaMAtriz);
      //console.log("formDataLiberacaoMidiaMatriz",formDataLiberacaoMidiaMatriz);

      if (strDataLiberacaoMidiaMAtriz != validaFormDataLiberacaoMidiaMatriz) {
        _arrAlteracoesFormPrincipal.push(`O campo "Data de Liberação (Mídia Matriz)" foi alterado de "${strDataLiberacaoMidiaMAtrizHistorico}" para "${formDataLiberacaoMidiaMatrizHistorico}"`);
        console.log(`O campo "Data de Liberação (Mídia Matriz)" foi alterado de "${strDataLiberacaoMidiaMAtrizHistorico}" para "${formDataLiberacaoMidiaMatrizHistorico}"`);
      }


      if (_arquivoInstalacaoMidiaMatrizAtual != arquivoRoteiro) {
        _arrAlteracoesFormPrincipal.push(`O campo "Arquivo de Roteiro para Instalação (Mídia Matriz)" foi alterado de "${_arquivoInstalacaoMidiaMatrizAtual}" para "${arquivoRoteiro}"`);
        console.log(`O campo "Arquivo de Roteiro para Instalação (Mídia Matriz)" foi alterado de "${_arquivoInstalacaoMidiaMatrizAtual}" para "${arquivoRoteiro}"`);
      }

      if (_responsavelGeracaoMidiaMatrizAtual != responsavelGeracaoMidiaMatriz) {
        _arrAlteracoesFormPrincipal.push(`O campo "Responsável pela Geração (Mídia Matriz)" foi alterado de "${_responsavelGeracaoMidiaMatrizAtual}" para "${responsavelGeracaoMidiaMatriz}"`);
        console.log(`O campo "Responsável pela Geração (Mídia Matriz)" foi alterado de "${_responsavelGeracaoMidiaMatrizAtual}" para "${responsavelGeracaoMidiaMatriz}"`);
      }

      if (_instalacaoMidiaMatrizAtual.length == arrInstalacaoMidiaMatriz.length) {

        var teveModificacao;

        arrInstalacaoMidiaMatriz.every((element, index) => {
          if (element === _instalacaoMidiaMatrizAtual[index]) {
            teveModificacao = false;
          } else teveModificacao = true;
        })

        if (teveModificacao) {
          _arrAlteracoesFormPrincipal.push(`O campo "Instalação (Mídia Matriz)" foi alterado de "${_instalacaoMidiaMatrizAtual}" para "${arrInstalacaoMidiaMatriz}"`);
          console.log(`O campo "Instalação (Mídia Matriz)" foi alterado de "${_instalacaoMidiaMatrizAtual}" para "${arrInstalacaoMidiaMatriz}"`);
        }

      } else {
        _arrAlteracoesFormPrincipal.push(`O campo "Instalação (Mídia Matriz)" foi alterado de "${_instalacaoMidiaMatrizAtual}" para "${arrInstalacaoMidiaMatriz}"`);
        console.log(`O campo "Instalação (Mídia Matriz)" foi alterado de "${_instalacaoMidiaMatrizAtual}" para "${arrInstalacaoMidiaMatriz}"`);
      }


      if (_pacoteAdicionalSOAtual != pacoteAdicionalSO) {
        _arrAlteracoesFormPrincipal.push(`O campo "Pacote Adicional ao S.O. OEM" foi alterado de "${_pacoteAdicionalSOAtual}" para "${pacoteAdicionalSO}"`);
        console.log(`O campo "Pacote Adicional ao S.O. OEM" foi alterado de "${_pacoteAdicionalSOAtual}" para "${pacoteAdicionalSO}"`);
      }

      if (_midiaMatrizAtual != midiaMatriz) {
        _arrAlteracoesFormPrincipal.push(`O campo "Mídia Matriz" foi alterado de "${_midiaMatrizAtual}" para "${midiaMatriz}"`);
        console.log(`O campo "Mídia Matriz" foi alterado de "${_midiaMatrizAtual}" para "${midiaMatriz}"`);
      }

      if (_sistemaOperacionalAtual != vlrSistemaOpercional) {
        _arrAlteracoesFormPrincipal.push(`O campo "Sistema Operacional" foi alterado de "${_sistemaOperacionalAtual}" para "${vlrSistemaOpercional}"`);
        console.log(`O campo "Sistema Operacional" foi alterado de "${_sistemaOperacionalAtual}" para "${vlrSistemaOpercional}"`);
      }

      var cleanOutrasInformacoes = ""
      var cleanOutrasInformacoesAtual = ""

      if (outrasInformacoes != null) {
        cleanOutrasInformacoes = outrasInformacoes.replace(/<\/?[^>]+(>|$)/g, "");
        cleanOutrasInformacoes = cleanOutrasInformacoes.replace("&quot;", '"');
        cleanOutrasInformacoes = cleanOutrasInformacoes.replace("&quot;", '"');
      }

      if (_outrasInformacoesatual != null) {
        cleanOutrasInformacoesAtual = _outrasInformacoesatual.replace(/<\/?[^>]+(>|$)/g, "");
        cleanOutrasInformacoesAtual = cleanOutrasInformacoesAtual.replace("&quot;", '"');
        cleanOutrasInformacoesAtual = cleanOutrasInformacoesAtual.replace("&quot;", '"');
      }

      console.log("cleanOutrasInformacoesAtual", cleanOutrasInformacoesAtual);
      console.log("cleanOutrasInformacoes", cleanOutrasInformacoes);

      if (cleanOutrasInformacoes != cleanOutrasInformacoesAtual) {
        _arrAlteracoesFormPrincipal.push(`O campo "Outras Informações" foi alterado de "${cleanOutrasInformacoesAtual}" para "${cleanOutrasInformacoes}"`);
        console.log(`O campo "Outras Informações" foi alterado de "${cleanOutrasInformacoesAtual}" para "${cleanOutrasInformacoes}"`);
      }

    }

    await _web.lists
      .getByTitle("Documentos")
      .items.getById(_documentoID).update({
        NomeProduto: nomeProduto,
        Cliente: cliente,
        SST: SSTGira,
        Title: codIndustrial,
        PacoteAdicionalSODescricao: descricaoPacoteAdicional,
        PacoteAdicionalSOResponsavel: responsavelPacoteAdicional,
        MidiaMatrizVersaoMidia: versaoMidiaMatriz,
        MidiaMatrizDataLiberacao: formDataLiberacaoMidiaMatriz,
        MidiaMatrizArquivoRoteiroInstala: arquivoRoteiro,
        MidiaMatrizResponsavelGeracao: responsavelGeracaoMidiaMatriz,
        MidiaMatrizInstalacao: { "results": arrInstalacaoMidiaMatriz },
        PacoteAdicionalSO: pacoteAdicionalSO,
        MidiaMatriz: midiaMatriz,
        SistemaOperacionalSiteNovo: vlrSistemaOpercional,
        OutrasInformacoes: outrasInformacoes,
        Status: status,
        Versao: versao,
      })
      .then(response => {
        console.log("criou!!");
        this.upload(opcao);
      })
      .catch((error: any) => {
        console.log(error);
      })

  }


  protected async upload(opcao) {

    console.log("Entrou no upload");

    var files = (document.querySelector("#input") as HTMLInputElement).files;
    var file = files[0];

    //console.log("files.length", files.length);

    if (files.length != 0) {

      if (_pastaCriada != "Sim") {

        _web.lists.getByTitle("Imagens").rootFolder.folders.add(`${_documentoID}`).then(async data => {

          await _web.lists
            .getByTitle("Documentos")
            .items.getById(_documentoID).update({
              PastaCriada: "Sim",
            })
            .then(async response => {

              for (var i = 0; i < files.length; i++) {

                var nomeArquivo = files[i].name;
                var rplNomeArquivo = nomeArquivo.replace(/[^0123456789.,a-zA-Z]/g, '');

                //alert(rplNomeArquivo);
                //Upload a file to the SharePoint Library
                _web.getFolderByServerRelativeUrl(`${_caminho}/Imagens/${_documentoID}`)
                  //.files.add(files[i].name, files[i], true)
                  .files.add(rplNomeArquivo, files[i], true)
                  .then(async data => {

                    if (i == files.length) {
                      console.log("anexou:" + rplNomeArquivo);
                      this.criarTarefa(opcao);
                    }
                  });
              }


            }).catch(err => {
              console.log("err", err);
            });



        }).catch(err => {
          console.log("err", err);
        });

      }
      else {

        await _web.lists
          .getByTitle("Documentos")
          .items.getById(_documentoID).update({
            PastaCriada: "Sim",
          })
          .then(async response => {

            for (var i = 0; i < files.length; i++) {

              var nomeArquivo = files[i].name;
              var rplNomeArquivo = nomeArquivo.replace(/[^0123456789.,a-zA-Z]/g, '');

              //alert(rplNomeArquivo);
              //Upload a file to the SharePoint Library
              _web.getFolderByServerRelativeUrl(`${_caminho}/Imagens/${_documentoID}`)
                //.files.add(files[i].name, files[i], true)
                .files.add(rplNomeArquivo, files[i], true)
                .then(async data => {

                  if (i == files.length) {
                    console.log("anexou:" + rplNomeArquivo);
                    this.criarTarefa(opcao);
                  }
                });
            }


          }).catch(err => {
            console.log("err", err);
          });



        //const folderAddResult = _web.folders.add(`${_caminho}/Anexos/${_idProposta}`);
        //console.log("foi");
      }

    } else {

      if (_pastaCriada != "Sim") {

        _web.lists.getByTitle("Imagens").rootFolder.folders.add(`${_documentoID}`).then(data => {

          console.log("Gravou!!");
          this.criarTarefa(opcao);

        }).catch(err => {
          console.log("err", err);
        });

      } else {

        console.log("Gravou!!");
        this.criarTarefa(opcao);

      }

    }



  }

  protected async criarTarefa(opcao) {

    var motivo = $("#txtMotivoAprovacao").val();

    if (opcao == "Salvar") {

      if (_arrAlteracoesFormPrincipal.length != 0) {

        this.gravaHistoricoAlteracaoFormularioPrincipal(opcao);

      } else {

        $("#modalCarregando").modal('hide');
        jQuery("#modalSucesso").modal({ backdrop: 'static', keyboard: false });

      }

    }

    else if (opcao == "EnviarAprovacao") {

      await _web.lists
        .getByTitle("Reprovações do Suporte")
        .items.add({
          Title: "Aguardando aprovação do Suporte",
          DIPSId: _documentoID,
          VersaoReprovada: _versao.toString(),
          StatusAnterior: _status,
          StatusAtual: _novoStatus
        })
        .then(response => {

          if (_arrAlteracoesFormPrincipal.length != 0) {

            this.gravaHistoricoAlteracaoFormularioPrincipal(opcao);

          } else {

            $("#modalCarregando").modal('hide');
            jQuery("#modalSucessoAprovacao").modal({ backdrop: 'static', keyboard: false });

          }


        })
        .catch((error: any) => {
          console.log(error);
        })


    }

    else if (opcao == "EnviarRevisaoSuporte") {

      var titulo;

      if (motivo == "") {
        titulo = "DIPS enviado para revisão do Suporte"
      } else {
        titulo = "DIPS enviado para revisão do Suporte: " + motivo
      }

      await _web.lists
        .getByTitle("Reprovações do Suporte")
        .items.add({
          Title: titulo,
          DIPSId: _documentoID,
          VersaoReprovada: _versao.toString(),
          StatusAnterior: _status,
          StatusAtual: _novoStatus
        })
        .then(response => {

          if (_arrAlteracoesFormPrincipal.length != 0) {

            this.gravaHistoricoAlteracaoFormularioPrincipal(opcao);

          } else {

            $("#modalCarregando").modal('hide');
            jQuery("#modalSucessoRevisaoSuporte").modal({ backdrop: 'static', keyboard: false });

          }


        })
        .catch((error: any) => {
          console.log(error);
        })

    }

    else if (opcao == "EnviarRevisaoEngenharia") {

      var titulo;

      if (motivo == "") {
        titulo = "DIPS enviado para revisão da Engenharia"
      } else {
        titulo = "DIPS enviado para revisão da Engenharia: " + motivo
      }

      await _web.lists
        .getByTitle("Reprovações do Suporte")
        .items.add({
          Title: titulo,
          DIPSId: _documentoID,
          VersaoReprovada: _versao.toString(),
          StatusAnterior: _status,
          StatusAtual: _novoStatus
        })
        .then(response => {

          if (_arrAlteracoesFormPrincipal.length != 0) {

            this.gravaHistoricoAlteracaoFormularioPrincipal(opcao);

          } else {

            $("#modalCarregando").modal('hide');
            jQuery("#modalSucessoRevisaoEngenharia").modal({ backdrop: 'static', keyboard: false });

          }


        })
        .catch((error: any) => {
          console.log(error);
        })

    }

    else if (opcao == "Aprovar") {


      var titulo;

      if (motivo == "") {
        titulo = "Aprovado pelo Suporte"
      } else {
        titulo = "Aprovado pelo Suporte: " + motivo
      }


      await _web.lists
        .getByTitle("Reprovações do Suporte")
        .items.add({
          Title: titulo,
          DIPSId: _documentoID,
          VersaoReprovada: _novaVersao.toString(),
          StatusAnterior: _status,
          StatusAtual: _novoStatus
        })
        .then(async response => {

          if (_arrAlteracoesFormPrincipal.length != 0) {

            this.gravaHistoricoAlteracaoFormularioPrincipal(opcao);

          } else {

            $("#modalCarregando").modal('hide');
            jQuery("#modalSucessoAprovado").modal({ backdrop: 'static', keyboard: false });

          }

        })
        .catch((error: any) => {
          console.log(error);
        })

    }

    else if (opcao == "Reprovar") {

      console.log("entrou no segundo nivel");

      await _web.lists
        .getByTitle("Reprovações do Suporte")
        .items.add({
          Title: "Reprovação do Suporte: " + motivo,
          DIPSId: _documentoID,
          VersaoReprovada: _versao.toString(),
          StatusAnterior: _status,
          StatusAtual: _novoStatus
        })
        .then(response => {

          if (_arrAlteracoesFormPrincipal.length != 0) {

            this.gravaHistoricoAlteracaoFormularioPrincipal(opcao);

          } else {

            $("#modalCarregando").modal('hide');
            jQuery("#modalSucessoReprovado").modal({ backdrop: 'static', keyboard: false });

          }

        })
        .catch((error: any) => {
          console.log(error);
        })


    }

  }

  protected async gravaHistoricoAlteracaoFormularioPrincipal(opcao) {

    for (var i = 0; i < _arrAlteracoesFormPrincipal.length; i++) {

      await _web.lists
        .getByTitle("Reprovações do Suporte")
        .items.add({
          Title: _arrAlteracoesFormPrincipal[i],
          DIPSId: _documentoID,
          VersaoReprovada: _versao.toString(),
          StatusAnterior: "Alteração",
          StatusAtual: _status
        })
        .then(response => {

          $("#modalCarregando").modal('hide');

          if (opcao == "Salvar") jQuery("#modalSucesso").modal({ backdrop: 'static', keyboard: false });
          else if (opcao == "EnviarAprovacao") jQuery("#modalSucessoAprovacao").modal({ backdrop: 'static', keyboard: false });
          else if (opcao == "Aprovar") jQuery("#modalSucessoAprovado").modal({ backdrop: 'static', keyboard: false });
          else if (opcao == "Reprovar") jQuery("#modalSucessoReprovado").modal({ backdrop: 'static', keyboard: false });
          else if (opcao == "EnviarRevisaoSuporte") jQuery("#modalSucessoRevisaoSuporte").modal({ backdrop: 'static', keyboard: false });
          else if (opcao == "EnviarRevisaoEngenharia") jQuery("#modalSucessoRevisaoEngenharia").modal({ backdrop: 'static', keyboard: false });

        })
        .catch((error: any) => {
          console.log(error);
        })

    }


  }


  protected async gravaHistoricoAdicionarItem(texto, lista) {

    await _web.lists
      .getByTitle("Reprovações do Suporte")
      .items.add({
        Title: texto,
        DIPSId: _documentoID,
        VersaoReprovada: _versao.toString(),
        StatusAnterior: "Inclusão",
        StatusAtual: _status
      })
      .then(response => {

        if (lista == "PreStage") {
          jQuery("#btnCadastrarPreStage").prop("disabled", false);
          jQuery("#modalCadastrarPreStageSoftware").modal('hide');
          jQuery("#modalSucessoCadastrarPreStage").modal({ backdrop: 'static', keyboard: false });
        }

        else if (lista == "SetupBIOS") {
          jQuery("#btnCadastrarSetupBIOS").prop("disabled", false);
          $("#modalCadastrarSetupBIOS").modal('hide');
          jQuery("#modalSucessoCadastrarSetupBIOS").modal({ backdrop: 'static', keyboard: false });
        }

        else if (lista == "Modulos") {
          jQuery("#btnCadastrarModulos").prop("disabled", false);
          $("#modalCadastrarModulos").modal('hide');
          jQuery("#modalSucessoCadastrarModulos").modal({ backdrop: 'static', keyboard: false });
        }

        else if (lista == "CheckList") {
          jQuery("#btnCadastrarCheckList").prop("disabled", false);
          $("#modalCadastrarCheckList").modal('hide');
          jQuery("#modalSucessoCadastrarCheckList").modal({ backdrop: 'static', keyboard: false });

        }

      })
      .catch((error: any) => {
        console.log(error);
      })

  }

  protected async gravaHistoricoAlterarItem(texto, lista) {

    await _web.lists
      .getByTitle("Reprovações do Suporte")
      .items.add({
        Title: texto,
        DIPSId: _documentoID,
        VersaoReprovada: _versao.toString(),
        StatusAnterior: "Alteração",
        StatusAtual: _status
      })
      .then(response => {

        if (lista == "PreStage") {
          jQuery("#btnEditarPreStageSoftware").prop("disabled", false);
          jQuery("#modalEditarPreStageSoftware").modal('hide');
          jQuery("#modalSucessoEditarPreStage").modal({ backdrop: 'static', keyboard: false });
        }

        else if (lista == "SetupBIOS") {

          jQuery("#btnEditarSetupBIOS").prop("disabled", false);
          $("#modalEditarSetupBIOS").modal('hide');
          jQuery("#modalSucessoEditarSetupBIOS").modal({ backdrop: 'static', keyboard: false });

        }

        else if (lista == "Modulos") {

          jQuery("#btnEditarModulos").prop("disabled", false);
          $("#modalEditarModulos").modal('hide');
          jQuery("#modalSucessoEditarModulos").modal({ backdrop: 'static', keyboard: false });

        }

        else if (lista == "CheckList") {

          jQuery("#btnEditarCheckList").prop("disabled", false);
          $("#modalEditarCheckList").modal('hide');
          jQuery("#modalSucessoEditarCheckList").modal({ backdrop: 'static', keyboard: false });

        }

      })
      .catch((error: any) => {
        console.log(error);
      })

  }

  protected async gravaHistoricoExcluirItem(texto, lista) {



  }

  protected voltar() {
    history.back();
  }


  fileHandler = (event) => {

    console.log("err");

    let fileObj = event.target.files[0];

    //just pass the fileObj as parameter
    ExcelRenderer(fileObj, (err, resp) => {
      if (err) {
        console.log(err);
      }
      else {

        //console.log(resp);

        _colunasExcel = resp.rows;

        console.log("_colunasExcel", _colunasExcel);


        // this.setState({

        //   cols: resp.cols,
        //   rows: resp.rows

        // });
      }
    });

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

