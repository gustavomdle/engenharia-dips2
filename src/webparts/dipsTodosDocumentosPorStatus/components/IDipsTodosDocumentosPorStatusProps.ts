import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface IDipsTodosDocumentosPorStatusProps {
  description: string;
  context: WebPartContext;
  siteurl: string;
  statusDocumento: string
}
