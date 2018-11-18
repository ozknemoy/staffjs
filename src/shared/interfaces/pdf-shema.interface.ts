
export module IPdfSchema {
  export interface SubStyle {
    fontSize?: number,
    bold?: boolean,
    margin?: [number, number, number, number],
    color?: string
  }
  export interface Root {
    content: any[],
    styles?: {
      header?: IPdfSchema.SubStyle,
      subheader?: IPdfSchema.SubStyle,
      tableExample?: IPdfSchema.SubStyle,
      tableHeader?: IPdfSchema.SubStyle
    },
    defaultStyle?: {
      layout?: any
      alignment?: string
    }
  }
}