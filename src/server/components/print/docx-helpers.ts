import {Paragraph, TextRun} from "docx";

export function setStandartStyles(doc, font = 'Arial') {
  doc.Styles.createParagraphStyle('10', "10")
    .font(font)
    .size(20);
  doc.Styles.createParagraphStyle('12', "12")
    .font(font)
    .size(24);
  doc.Styles.createParagraphStyle('9', "9")
    .font(font)
    .size(18);
  doc.Styles.createParagraphStyle('7', "7")
    .font(font)
    .size(14);
  doc.Styles.createParagraphStyle('8', "8")
    .font(font)
    .size(16);
}

export const pageMargins = {
  top: -500,
  right: 500,
  bottom: -100,
  left: 500,
};

export const redI = '              ';
export const emptyLine = '____________________________________________________________________________________________________________';
export const maxRightTabStop = 10900;
  export function addEmptyLineUnderlined(withComma = false) {
  return new Paragraph(emptyLine + (withComma ? ',' : ''))
    .center()
    .spacing({before: 200});
}

export function getEmptyLinePlusText(text: string, line = emptyLine): string {
  return text + line.slice(text.length) + (line === emptyLine ? '__' : '');
}

export function addEmptyLineWithTextUnderlined(doc, text: string, withComma = false, style = '9', spacing = 0) {
  const p = new Paragraph()
    .center()
    .thematicBreak();
  if (spacing) {
    p.spacing({before: spacing});
  }
  const _text = new TextRun(text);
  p.addRun(_text);
  if (style) {
    p.style(style);
  }
  if (withComma) {
    p.addRun(new TextRun(','));
  }
  doc.addParagraph(p);
}

export function getLRText(textL: string, textR: string) {
  return new Paragraph()
    .rightTabStop(maxRightTabStop)
    .addRun(new TextRun(textL))
    // правый таб обязателен. видимо из-за rightTabStop
    .addRun(new TextRun(textR).tab());
}

export function addUnderlineText(left: number, text = 'нужное подчеркнуть') {
  return new Paragraph()
    .style('8')
    .indent({left}) // 720 TWIP === 720 / 20 pt === .5 in
    .addRun(new TextRun(`(${text})`).italic());
}

export function getTitle(text: string) {
  return new Paragraph()
    .center()
    .style('10')
    .addRun(new TextRun(text).break().bold());
}

export function multiTab(n: number, size = 8, text = '(нужное подчеркнуть)') {

  let i = ' ';
  while (i.length < n) {
    i += ' ';
  }
  let t = new TextRun(i + text);
  t.size(size * 2);
  return t.break()
}
