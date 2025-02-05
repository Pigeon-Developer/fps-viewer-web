import { Problem, TestItem } from './type';

function decode(content: string): Document {
  const parser = new DOMParser();
  const doc = parser.parseFromString(content, 'application/xml');

  return doc;
}

function encode(doc: Document): string {
  const s = new XMLSerializer();

  return s.serializeToString(doc);
}

const CDataStart = '<![CDATA';
const CDataEnd = ']]>';

function getCData(data: string) {
  if (data.startsWith(CDataStart)) {
    const len = data.length;
    return data.substring(CDataStart.length, len - CDataStart.length - CDataEnd.length);
  }

  return data;
}

function getCDataContent(node: Element) {
  if (node && node.textContent) {
    return getCData(node.textContent);
  }
  return '';
}

function getNodeValue(el: Element, nodeName: string): string {
  const node = el.querySelector(nodeName);
  if (node && node.textContent) {
    return getCData(node.textContent);
  }
  return '';
}

function getNodeAttr(el: Element, nodeName: string, attrName: string): string {
  const node = el.querySelector(nodeName);
  if (node) {
    return node.getAttribute(attrName) || '';
  }
  return '';
}

function parseLanguage(el: Element) {
  const result: Problem['language'] = {};
  const infoTag = ['solution', 'template', 'prepend', 'append'];

  for (const tag of infoTag) {
    const list = el.querySelectorAll(tag);
    for (const node of list) {
      const lang = node.getAttribute('language')!;

      if (!result[lang]) {
        result[lang] = {
          solution: '',
          template: '',

          prepend: '',
          append: '',
        };
      }

      if (node.textContent) {
        result[lang][tag] = getCData(node.textContent);
      }
    }
  }

  return result;
}

function parseTestData(el: Element): TestItem[] {
  const inputList = el.querySelectorAll('test_input');
  const outputList = el.querySelectorAll('test_output');

  const ret: TestItem[] = [];
  const end = inputList.length;
  for (let index = 0; index < end; index++) {
    const inputNode = inputList[index];
    const outputNode = outputList[index];

    const current: TestItem = {
      input: getCDataContent(inputNode),
      output: getCDataContent(outputNode),
      name: inputNode.getAttribute('name') || '',
    };

    ret.push(current);
  }

  return ret;
}

function fromXMLNode(el: Element) {
  function get(nodeName: string) {
    return getNodeValue(el, nodeName);
  }

  const p: Problem = {
    title: get('title'),
    url: get('url'),
    time_limit: {
      unit: getNodeAttr(el, 'time_limit', 'unit'),
      value: get('time_limit'),
    },
    memory_limit: {
      unit: getNodeAttr(el, 'memory_limit', 'unit'),
      value: get('memory_limit'),
    },

    description: get('description'),

    input: get('input'),
    output: get('output'),

    sample_input: get('sample_input'),
    sample_output: get('sample_output'),

    hint: get('hint'),
    source: get('source'),

    test: parseTestData(el),

    language: parseLanguage(el),
    remote: {
      oj: get('remote_oj'),
      id: get('remote_id'),
    },
  };

  return p;
}

export function parse(content: string): Problem[] {
  const doc = decode(content);

  const list = doc.querySelectorAll('fps > item');

  const ret: Problem[] = [];
  for (const el of list) {
    ret.push(fromXMLNode(el));
  }

  return ret;
}

function languageToXMLNode(doc: Document, langConfig: Problem['language']) {
  const ret: HTMLElement[] = [];

  for (const [lang, config] of Object.entries(langConfig)) {
    const infoTag = ['solution', 'template', 'prepend', 'append'] as const;
    for (const tag of infoTag) {
      if (config[tag] && config[tag].length) {
        const node = doc.createElement(tag);
        node.appendChild(doc.createCDATASection(config[tag]));

        node.setAttribute('language', lang);
        ret.push(node);
      }
    }
  }

  return ret;
}

function testDataToXMLNode(doc: Document, test: TestItem[]): HTMLElement[] {
  const ret: HTMLElement[] = [];

  for (const item of test) {
    const input = doc.createElement('test_input');
    input.appendChild(doc.createCDATASection(item.input));
    if (item.name && item.name.length) {
      input.setAttribute('name', item.name);
    }

    const output = doc.createElement('test_output');
    output.appendChild(doc.createCDATASection(item.output));
    if (item.name && item.name.length) {
      output.setAttribute('name', item.name);
    }

    ret.push(input);
    ret.push(output);
  }

  return ret;
}

const XMLTemplate = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE fps PUBLIC "-//freeproblemset//An opensource XML standard for AlgorithmContest Problem Set//EN" "http://hustoj.com/fps.current.dtd">
<fps version="1.5" url="https://github.com/zhblue/freeproblemset/">
  <generator name="fps-viewer-web" url="https://github.com/Pigeon-Developer/fps-viewer-web" />
</fps>
`;

function toXMLNode(doc: Document, p: Problem): Element {
  const ret = doc.createElement('item');

  function set(nodeName: string, value: string, attrs?: Record<string, string>) {
    const node = doc.createElement(nodeName);
    node.appendChild(doc.createCDATASection(value));

    if (attrs) {
      const attrList = Object.entries(attrs);
      for (const [key, value] of attrList) {
        node.setAttribute(key, value);
      }
    }
    ret.appendChild(node);
  }

  // 无需做多余格式处理的部分
  const simpleTag = [
    'title',
    'url',
    'description',
    'input',
    'output',
    'sample_input',
    'sample_output',
    'hint',
    'source',
  ] as const;

  for (const tag of simpleTag) {
    set(tag, p[tag]);
  }

  set('time_limit', p.time_limit.value, { unit: p.time_limit.unit });
  set('memory_limit', p.memory_limit.value, { unit: p.memory_limit.unit });

  set('remote_oj', p.remote.oj);
  set('remote_id', p.remote.id);

  ret.append(...languageToXMLNode(doc, p.language));
  ret.append(...testDataToXMLNode(doc, p.test));

  return ret;
}

export function stringify(list: Problem[]): string {
  const doc = decode(XMLTemplate);

  const fps = doc.querySelector('fps')!;
  for (const p of list) {
    const item = toXMLNode(doc, p);
    fps.appendChild(item);
  }

  return encode(doc);
}
