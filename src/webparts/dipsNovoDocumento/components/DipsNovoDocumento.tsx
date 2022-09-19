import * as React from 'react';
import styles from './DipsNovoDocumento.module.scss';
import { IDipsNovoDocumentoProps } from './IDipsNovoDocumentoProps';
import { escape } from '@microsoft/sp-lodash-subset';

import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';

import * as jquery from 'jquery';
import * as $ from "jquery";
import * as jQuery from "jquery";
import { sp, IItemAddResult, DateTimeFieldFormatType } from "@pnp/sp/presets/all";
import "bootstrap";
import "@pnp/sp/webs";
import "@pnp/sp/folders";
import { Web } from "sp-pnp-js";
import pnp from "sp-pnp-js";
import { ICamlQuery } from '@pnp/sp/lists';
import { PeoplePicker, PrincipalType } from "@pnp/spfx-controls-react/lib/PeoplePicker";
import { allowOverscrollOnElement, DatePicker } from 'office-ui-fabric-react';
import { PrimaryButton, Stack, MessageBar, MessageBarType } from 'office-ui-fabric-react';
import { DateTimePicker, DateConvention, TimeConvention } from '@pnp/spfx-controls-react/lib/DateTimePicker';
import { RichText } from "@pnp/spfx-controls-react/lib/RichText";
import { SiteUser } from 'sp-pnp-js/lib/sharepoint/siteusers';

require("../../../../node_modules/bootstrap/dist/css/bootstrap.min.css");
require("../../../../css/estilos.css");

var _web;
var _outrasInformacoes = "";
var _addUsersResponsavelEngenhariaHardware = [];
var _caminho;
var _documentoID;
var _size: number = 0;

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

}

export default class DipsNovoDocumento extends React.Component<IDipsNovoDocumentoProps, IReactGetItemsState> {


  public constructor(props: IDipsNovoDocumentoProps, state: IReactGetItemsState) {
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

    };
  }


  public componentDidMount() {

    _web = new Web(this.props.context.pageContext.web.absoluteUrl);
    _caminho = this.props.context.pageContext.web.serverRelativeUrl;

    document
      .getElementById("btnCriarDocumento")
      .addEventListener("click", (e: Event) => this.validar());

    document
      .getElementById("btnConfirmaCriarDocumento")
      .addEventListener("click", (e: Event) => this.salvar());

    document
      .getElementById("btnSucesso")
      .addEventListener("click", (e: Event) => this.fecharSucesso());

    jQuery('#divSistemaOperacionalOutros').hide();

    jQuery("#conteudoLoading").html(`<br/><br/><img style="height: 80px; width: 80px" src='${_caminho}/SiteAssets/loading.gif'/>
    <br/>Aguarde....<br/><br/>
    Dependendo do tamanho do anexo e a velocidade<br>
     da Internet essa ação pode demorar um pouco. <br>
     Não fechar a janela!<br/><br/>`);

    this.handler();




  }

  public render(): React.ReactElement<IDipsNovoDocumentoProps> {
    return (

      <><div id="container">

        <div id="accordion">

          <div className="card">
            <div className="card-header btn" id="headingInformacoesProduto" data-toggle="collapse" data-target="#collapseInformacoesProduto" aria-expanded="true" aria-controls="collapseInformacoesProduto">
              <h5 className="mb-0 text-info">
                Informações do produto
              </h5>
            </div>
            <div id="collapseInformacoesProduto" className="collapse show" aria-labelledby="headingOne">
              <div className="card-body">

                <div className="form-group">
                  <div className="form-row">
                    <div className="form-group col-md">
                      <label htmlFor="txtNomeProduto">Nome do produto</label><span className="required"> *</span>
                      <input type="text" className="form-control" id="txtNomeProduto" />
                    </div>
                    <div className="form-group col-md">
                      <label htmlFor="txtNomeProduto">Cliente</label><span className="required"> *</span>
                      <select id="ddlCliente" className="form-control">
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
                      <DatePicker style={{ "width": "210px" }} minDate={new Date()} formatDate={this.onFormatDate} isMonthPickerVisible={false} className="datePicker" id='dtDataLiberacaoMidiaMatriz' />
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
                            <input className="form-check-input" name='checkInstalacaoMidiaMatriz' type="checkbox" value={item} />
                            <label className="form-check-label">
                              {item}
                            </label>
                          </div>

                        );
                      })}
                    </div>
                    <div className="form-group col-md-3">

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
              </h5>
            </div>
            <div id="collapsePreStageSoftware" className="collapse show" aria-labelledby="headingOne">
              <div className="card-body">

                <div className="form-group">
                  <div className="form-row">
                    <div className="form-group col-md">
                      <label htmlFor="txtTitulo">Pacote Adicional ao S.O. OEM</label><span className="required"> *</span><br></br>
                      {this.state.itemsPacoteAdicionalSO.map(function (item, key) {

                        return (

                          <div className="form-check">
                            <input className="form-check-input" name='checkPacoteAdicionalSO' type="radio" value={item} />
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
                        return (

                          <div className="form-check">
                            <input className="form-check-input" name='checkMidiaMatriz' type="radio" value={item} />
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
                      <select id="ddlSistemaOperacional" className="form-control" style={{ "width": "290px" }} onChange={(e) => this.onChangeSistemaOperacional(e.target.value)}>
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
                      <RichText className="editorRichTex" value=""
                        onChange={(text) => this.onTextChange(text)} />
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header btn" id="headingInformacoesProduto" data-toggle="collapse" data-target="#collapseInformacoesProduto" aria-expanded="true" aria-controls="collapseInformacoesProduto">
              <h5 className="mb-0 text-info">
                Imagens
              </h5>
            </div>
            <div id="collapseInformacoesProduto" className="collapse show" aria-labelledby="headingOne">
              <div className="card-body">

                <div className="form-group">
                  <div className="form-row ">
                    <div className="form-group col-md" >
                      <label htmlFor="txtTitulo">Imagem </label><br></br>
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

        </div>

      </div><br></br><div className="text-right">
          <button id="btnCriarDocumento" className="btn btn-success">Criar documento</button>
        </div>


        <div className="modal fade" id="modalConfirmar" tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Confirmação</h5>
              </div>
              <div className="modal-body">
                Deseja realmente criar o Documento?
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-dismiss="modal">Cancelar</button>
                <button id="btnConfirmaCriarDocumento" type="button" className="btn btn-primary">Criar Documento</button>
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


        <div className="modal fade" id="modalSucesso" tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Alerta</h5>
              </div>
              <div className="modal-body">
                Documento criado com sucesso!
              </div>
              <div className="modal-footer">
                <button type="button" id="btnSucesso" className="btn btn-primary">OK</button>
              </div>
            </div>
          </div>
        </div>

      </>


    );
  }

  protected async handler() {

    var reactSistemaOperacional = this;

    jquery.ajax({
      url: `${this.props.siteurl}/_api/web/lists/getbytitle('Sistema Operacional')/items?$top=50&$filter=Ativo eq 1&$orderby= Title`,
      type: "GET",
      headers: { 'Accept': 'application/json; odata=verbose;' },
      success: function (resultData) {
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

    var reactEmailElaboracao = this;

    jquery.ajax({
      url: `${this.props.siteurl}/_api/web/lists/GetByTitle('Documentos')/fields?$filter=EntityPropertyName eq 'EmailElaboracao'`,
      type: "GET",
      headers: { 'Accept': 'application/json; odata=verbose;' },
      success: function (resultData) {
        reactEmailElaboracao.setState({
          itemsEmailElaboracao: resultData.d.results[0].Choices.results
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


  }


  private onFormatDate = (date: Date): string => {
    //return date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
    return ("0" + date.getDate()).slice(-2) + '/' + ("0" + (date.getMonth() + 1)).slice(-2) + '/' + date.getFullYear();
  };

  private onTextChange = (newText: string) => {
    _outrasInformacoes = newText;
    return newText;
  }

  private getPeoplePickerItemsAprovadorEngenharia(items: any[]) {
    console.log('Items:', items);
    this.setState({ addUsersResponsavelEngenhariaHardware: items as any });
    _addUsersResponsavelEngenhariaHardware = items;
  }

  private onChangeSistemaOperacional = (val) => {

    if (val == "Outros") {

      jQuery('#txtSistemaOperacionalOutros').val("");
      jQuery('#divSistemaOperacionalOutros').show();

    } else {

      jQuery('#txtSistemaOperacionalOutros').val("");
      jQuery('#divSistemaOperacionalOutros').hide();

    }

    console.log("val", val);
    this.setState({

    });
  }


  protected validar() {

    var nomeProduto = jQuery("#txtNomeProduto").val();
    var cliente = jQuery("#ddlCliente option:selected").text();
    var SSTGira = jQuery("#txtSSTGira").val();
    var codIndustrial = jQuery("#txtCodIndustrial").val();

    var arrInstalacaoMidiaMatriz = [];
    $.each(jQuery("input[name='checkInstalacaoMidiaMatriz']:checked"), function () {
      arrInstalacaoMidiaMatriz.push(jQuery(this).val());
    });

    // var arrEmailElaboracao = [];
    // $.each(jQuery("input[name='checkEmailElaboracao']:checked"), function () {
    //   arrEmailElaboracao.push(jQuery(this).val());
    // });

    var arrPacoteAdicionalSO = [];
    $.each(jQuery("input[name='checkPacoteAdicionalSO']:checked"), function () {
      arrPacoteAdicionalSO.push(jQuery(this).val());
    });

    var arrMidiaMatriz = [];
    $.each(jQuery("input[name='checkMidiaMatriz']:checked"), function () {
      arrMidiaMatriz.push(jQuery(this).val());
    });

    var sistemaOperacional = jQuery("#ddlSistemaOperacional").val();

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

    // if (arrEmailElaboracao.length == 0) {
    //   alert("Escolha uma opção para 'Notificar Elaboração?'!");
    //   document.getElementById('headingInformacoesProduto').scrollIntoView();
    //   return false;
    // }

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
      var sistemaOperacionalOutros = jQuery("#txtSistemaOperacionalOutros").val();
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


    jQuery("#modalConfirmar").modal({ backdrop: 'static', keyboard: false });

  }


  protected async salvar() {

    jQuery("#modalConfirmarIniciarFluxo").modal('hide');
    jQuery("#modalCarregando").modal({ backdrop: 'static', keyboard: false });

    var nomeProduto = jQuery("#txtNomeProduto").val();
    var cliente = jQuery("#ddlCliente").val();
    var SSTGira = jQuery("#txtSSTGira").val();
    var codIndustrial = jQuery("#txtCodIndustrial").val();
    var descricaoPacoteAdicional = jQuery("#txtDescricaoPacoteAdicional").val();
    var responsavelPacoteAdicional = jQuery("#txtResponsavelPacoteAdicional").val();
    var versaoMidiaMatriz = jQuery("#txtVersaoMidiaMatriz").val();

    var dataLiberacaoMidiaMatriz = "" + jQuery("#dtDataLiberacaoMidiaMatriz-label").val() + "";
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

    // var arrEmailElaboracao = [];
    // $.each(jQuery("input[name='checkEmailElaboracao']:checked"), function () {
    //   arrEmailElaboracao.push(jQuery(this).val());
    // });

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

    //var emailElaboracao;
    var pacoteAdicionalSO;
    var midiaMatriz;

    // if (arrEmailElaboracao.length == 0) {
    //   emailElaboracao = null;
    // } else {
    //   emailElaboracao = arrEmailElaboracao[0];
    // }

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
    //  console.log("SSTGira", SSTGira);
    //  console.log("codIndustrial", codIndustrial);
    //   console.log("descricaoPacoteAdicional", descricaoPacoteAdicional);
    //  console.log("responsavelPacoteAdicional", responsavelPacoteAdicional);
    //  console.log("versaoMidiaMatriz", versaoMidiaMatriz);
    //  console.log("formLiberacaoMidiaMatriz", formDataLiberacaoMidiaMatriz);
    //  console.log("arquivoRoteiro", arquivoRoteiro);
    //   console.log("responsavelGeracaoMidiaMatriz", responsavelGeracaoMidiaMatriz);
    //console.log("arrInstalacaoMidiaMatriz", arrInstalacaoMidiaMatriz);
    //   console.log("arrEmailElaboracao", arrEmailElaboracao[0]);
    //   console.log("arrPacoteAdicionalSO", arrPacoteAdicionalSO[0]);
    //  console.log("arrMidiaMatriz", arrMidiaMatriz[0]);
    //   console.log("sistemaOperacional", sistemaOperacional);
    //   console.log("outrasInformacoes", outrasInformacoes);


    await _web.lists
      .getByTitle("Documentos")
      .items.add({
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
        //EmailElaboracao: emailElaboracao,
        PacoteAdicionalSO: pacoteAdicionalSO,
        MidiaMatriz: midiaMatriz,
        SistemaOperacionalSiteNovo: vlrSistemaOpercional,
        OutrasInformacoes: outrasInformacoes

      })
      .then(response => {

        _documentoID = response.data.ID;

        console.log("criou!!");
        this.upload();

      })
      .catch((error: any) => {
        console.log(error);
      })

  }


  protected async fecharSucesso() {

    jQuery("#modalSucesso").modal('hide');
    window.location.href = `Documentos-Editar.aspx?DocumentoID=` + _documentoID;

  }


  protected upload() {

    console.log("Entrou no upload");

    var files = (document.querySelector("#input") as HTMLInputElement).files;
    var file = files[0];

    //console.log("files.length", files.length);

    if (files.length != 0) {

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
                    jQuery("#conteudoLoading").modal('hide');
                    jQuery("#modalSucesso").modal({ backdrop: 'static', keyboard: false })
                  }
                });
            }


          }).catch(err => {
            console.log("err", err);
          });



      }).catch(err => {
        console.log("err", err);
      });

      //const folderAddResult = _web.folders.add(`${_caminho}/Anexos/${_idProposta}`);
      //console.log("foi");

    } else {

      _web.lists.getByTitle("Imagens").rootFolder.folders.add(`${_documentoID}`).then(data => {

        console.log("Gravou!!");
        jQuery("#conteudoLoading").modal('hide');
        jQuery("#modalSucesso").modal({ backdrop: 'static', keyboard: false });

      }).catch(err => {
        console.log("err", err);
      });

    }



  }

  /*

  var files = (document.querySelector("#input") as HTMLInputElement).files;
  var file = files[0];

  if (files.length != 0) {


  jQuery("#modalSucesso").modal('hide');
  window.location.href = `Novo-documento.aspx`;

}
*/


}

