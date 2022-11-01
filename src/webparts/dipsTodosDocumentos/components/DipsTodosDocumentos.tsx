import * as React from 'react';
import styles from './DipsTodosDocumentos.module.scss';
import { IDipsTodosDocumentosProps } from './IDipsTodosDocumentosProps';
import { escape } from '@microsoft/sp-lodash-subset';

import * as jQuery from "jquery";
import BootstrapTable from 'react-bootstrap-table-next';
//Import from @pnp/sp    
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists/web";
import "@pnp/sp/items/list";
import { Web } from "sp-pnp-js";

import paginationFactory from 'react-bootstrap-table2-paginator';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import { selectFilter } from 'react-bootstrap-table2-filter';
import { numberFilter } from 'react-bootstrap-table2-filter';
import { Comparator } from 'react-bootstrap-table2-filter';

import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';

require("../../../../node_modules/bootstrap/dist/css/bootstrap.min.css");
require("../../../../css/estilos.css");

var _web;
var _grupos;
var _statusDocumento;

export interface IShowEmployeeStates {
  itemsList: any[],

}

const customFilter = textFilter({
  placeholder: ' ',  // custom the input placeholder
});

const selectOptions = {
  'Aguardando aprovação do Suporte': 'Aguardando aprovação do Suporte',
  'Aprovado': 'Aprovado',
  'Em elaboração (Engenharia)': 'Em elaboração (Engenharia)',
  'Em revisão (Engenharia)': 'Em revisão (Engenharia)',
  'Em revisão (Suporte)': 'Em revisão (Suporte)',
};

const empTablecolumns = [
  {
    dataField: "ID",
    text: "ID",
    headerStyle: { backgroundColor: '#bee5eb' },
    sort: true,
    classes: 'text-center',
    filter: customFilter
  },
  {
    dataField: "NomeProduto",
    text: "Nome do produto",
    headerStyle: { backgroundColor: '#bee5eb' },
    sort: true,
    filter: customFilter
  },
  {
    dataField: "Title",
    text: "Código industrial",
    headerStyle: { backgroundColor: '#bee5eb' },
    sort: true,
    classes: 'text-center',
    filter: customFilter
  },
  {
    dataField: "Versao",
    text: "Versão",
    headerStyle: { backgroundColor: '#bee5eb' },
    sort: true,
    classes: 'text-center',
    filter: customFilter
  },
  {
    dataField: "Status",
    text: "Status",
    headerStyle: { backgroundColor: '#bee5eb' },
    sort: true,
    filter: selectFilter({
      options: selectOptions
    }),
  },
  {
    dataField: "Cliente",
    text: "Cliente",
    headerStyle: { backgroundColor: '#bee5eb' },
    sort: true,
    filter: customFilter
  },
  {
    dataField: "Created",
    text: "Data de criação",
    headerStyle: { backgroundColor: '#bee5eb' },
    sort: true,
    filter: customFilter,
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
    sort: true,
    filter: customFilter
  },
  {
    dataField: "",
    text: "",
    headerStyle: { "backgroundColor": "#bee5eb", "width": "130px" },
    formatter: (rowContent, row) => {
      var id = row.ID;
      var status = row.Status
      var urlDetalhes = `Documentos-Detalhes.aspx?DocumentoID=` + id;
      var urlEditar = `Documentos-Editar.aspx?DocumentoID=` + id;

      if ((status == "Em elaboração (Engenharia)") || (status == "Em revisão (Engenharia)")) {

        if (_grupos.indexOf("DIPS - Engenharia (Elaborador)") !== -1) {

          return (
            <>
              <a href={urlDetalhes}><button className="btn btn-info btnCustom btn-sm">Exibir</button></a>&nbsp;
              <a href={urlEditar}><button className="btn btn-danger btnCustom btn-sm">Editar</button></a>
            </>
          )

        } else {

          return (
            <>
              <a href={urlDetalhes}><button className="btn btn-info btnCustom btn-sm">Exibir</button></a>&nbsp;
            </>
          )

        }

      }

      else if ((status == "Aguardando aprovação do Suporte") || (status == "Em revisão (Suporte)")) {

        if (_grupos.indexOf("DIPS - Suporte") !== -1) {

          return (
            <>
              <a href={urlDetalhes}><button className="btn btn-info btnCustom btn-sm">Exibir</button></a>&nbsp;
              <a href={urlEditar}><button className="btn btn-danger btnCustom btn-sm">Editar</button></a>
            </>
          )

        } else {

          return (
            <>
              <a href={urlDetalhes}><button className="btn btn-info btnCustom btn-sm">Exibir</button></a>&nbsp;
            </>
          )

        }

      }

      else if (status == "Aprovado") {

        if ((_grupos.indexOf("DIPS - Engenharia (Elaborador)") !== -1) || (_grupos.indexOf("DIPS - Suporte") !== -1)) {

          return (
            <>
              <a href={urlDetalhes}><button className="btn btn-info btnCustom btn-sm">Exibir</button></a>&nbsp;
              <a href={urlEditar}><button className="btn btn-danger btnCustom btn-sm">Editar</button></a>
            </>
          )

        } else {

          return (
            <>
              <a href={urlDetalhes}><button className="btn btn-info btnCustom btn-sm">Exibir</button></a>&nbsp;
            </>
          )

        }

      }


      else {

        return (
          <>
            <a href={urlDetalhes}><button className="btn btn-info btnCustom btn-sm">Exibir</button></a>&nbsp;
          </>
        )

      }


    }
  }


]


const paginationOptions = {
  sizePerPage: 20,
  hideSizePerPage: true,
  hidePageListOnlyOnePage: true
};

export default class DipsTodosDocumentos extends React.Component<IDipsTodosDocumentosProps, IShowEmployeeStates> {

  constructor(props: IDipsTodosDocumentosProps) {
    super(props);
    this.state = {
      itemsList: []
    }
  }

  public async componentDidMount() {

    _web = new Web(this.props.context.pageContext.web.absoluteUrl);

    jQuery('#txtCount').html("0");

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

    var reactHandlerDocumentos = this;

    var url = `${this.props.siteurl}/_api/web/lists/getbytitle('Documentos')/items?$top=4999&$orderby= ID desc&$select=ID,NomeProduto,Title,Versao,Status,Cliente,Created,Author/Title&$expand=Author`;

    jQuery.ajax({
      url: url,
      type: "GET",
      headers: { 'Accept': 'application/json; odata=verbose;' },
      success: function (resultData) {
        jQuery('#txtCount').html(resultData.d.results.length);
        reactHandlerDocumentos.setState({
          itemsList: resultData.d.results
        });
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(jqXHR.responseText);
      }
    });


  }

  public render(): React.ReactElement<IDipsTodosDocumentosProps> {


    return (

      <><p>Resultado: <span className="text-info" id="txtCount"></span> DIPS encontrado(s)</p>
        <div className={styles.container}>
          <BootstrapTable bootstrap4 striped responsive condensed hover={false} className="gridTodosItens" id="gridTodosItens" keyField='id' data={this.state.itemsList} columns={empTablecolumns} headerClasses="header-class" pagination={paginationFactory(paginationOptions)} filter={filterFactory()} />
        </div></>


    );


  }
}

