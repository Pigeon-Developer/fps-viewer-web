export interface UnitValue {
  unit: string;
  value: string;
}

export interface TestItem {
  input: string;
  output: string;
  /**
   * 可能为空
   */
  name: string;
}

export interface LanguageConfig {
  /**
   * 标程
   */
  solution: string;
  template: string;

  prepend: string;
  append: string;
}

export type Language = {
  [lang: string]: LanguageConfig;
};

export interface Problem {
  title: string;
  url: string;
  time_limit: UnitValue;
  memory_limit: UnitValue;

  description: string;

  input: string;
  output: string;

  sample_input: string;
  sample_output: string;

  hint: string;
  source: string;

  test: TestItem[];

  /**
   * 不同语言下的配置
   */
  language: Language;

  remote: {
    oj: string;
    id: string;
  };
}
