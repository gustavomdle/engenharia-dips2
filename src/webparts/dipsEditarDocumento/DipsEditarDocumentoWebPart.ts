import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'DipsEditarDocumentoWebPartStrings';
import DipsEditarDocumento from './components/DipsEditarDocumento';
import { IDipsEditarDocumentoProps } from './components/IDipsEditarDocumentoProps';

export interface IDipsEditarDocumentoWebPartProps {
  description: string;
}

export default class DipsEditarDocumentoWebPart extends BaseClientSideWebPart<IDipsEditarDocumentoWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IDipsEditarDocumentoProps> = React.createElement(
      DipsEditarDocumento,
      {
        description: this.properties.description
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
