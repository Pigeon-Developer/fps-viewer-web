import { decode } from './browser';
import { Problem, TestItem } from './type';

export function parseXML(content: string) {
  const doc = decode(content);

  const list = doc.querySelectorAll('fps > item');

  const ret: Problem[] = [];
  for (const el of list) {
    ret.push(fromXMLNode(el));
  }

  return ret;
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

function parseLanguage(result: Problem['language'], el: Element) {
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

    test: [],

    language: {},
    remote: {
      oj: get('remote_oj'),
      id: get('remote_id'),
    },
  };

  // 处理 language 部分
  parseLanguage(p.language, el);

  // 处理测试数据部分
  p.test = parseTestData(el);

  return p;
}
