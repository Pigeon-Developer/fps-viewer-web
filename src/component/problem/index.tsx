import React from 'react';
import { Col, Collapse, Divider, Row } from 'antd';
import { Problem as _Problem, Language } from 'src/codec/type';
import * as styles from './style.module.less';

function Attr(props: React.PropsWithChildren<{ label: string }>) {
  return (
    <Row className={styles.row}>
      <Col span={6} className={styles.label}>
        <div className={styles.sticky}>{props.label}</div>
      </Col>
      <Col span={18} className={styles.content}>
        {props.children}
      </Col>
    </Row>
  );
}

function Html(props: { label: string; html: string }) {
  return (
    <Row className={styles.row}>
      <Col span={6} className={styles.label}>
        <div className={styles.sticky}>{props.label}</div>
      </Col>
      <Col span={18} className={styles.content}>
        <div dangerouslySetInnerHTML={{ __html: props.html }} />
      </Col>
    </Row>
  );
}

function LanguageConfig(props: { language: Language }) {
  const langSet = Object.keys(props.language);

  if (langSet.length === 0) {
    return <div>无</div>;
  }
  return (
    <div>
      {langSet.map((lang) => {
        const data = props.language[lang];
        return (
          <div key={lang} className={styles.languageItem}>
            <Divider orientation="left" className={styles.divider}>
              {lang}
            </Divider>
            <Collapse
              items={[
                {
                  key: 'solution',
                  label: '标程',
                  children: <div>{data.solution}</div>,
                },
                {
                  key: 'template',
                  label: '模板',
                  children: <div>{data.template}</div>,
                },
                {
                  key: 'prepend',
                  label: '附加 - 前缀',
                  children: <div>{data.prepend}</div>,
                },
                {
                  key: 'append',
                  label: '附加 - 后缀',
                  children: <div>{data.append}</div>,
                },
              ]}
            />
          </div>
        );
      })}
    </div>
  );
}

export function Problem(props: { data: _Problem }) {
  const data = props.data;
  return (
    <div className={styles.comp}>
      <Html label="标题" html={data.title} />
      <Attr label="时间限制">
        {data.time_limit.value} {data.time_limit.unit}
      </Attr>
      <Attr label="内存限制">
        {data.memory_limit.value} {data.memory_limit.unit}
      </Attr>
      <Html label="描述" html={data.description} />
      <Html label="提示" html={data.hint} />
      <Attr label="来源">{data.source}</Attr>
      <Attr label="链接">{data.url}</Attr>
      <Html label="输入" html={data.input} />
      <Html label="输出" html={data.output} />
      <Attr label="远程判题配置">
        {data.remote.oj.length ? (
          <div>
            OJ: {data.remote.oj} ID: {data.remote.id}
          </div>
        ) : (
          <div>无</div>
        )}
      </Attr>
      <Attr label="示例输入">{data.sample_input}</Attr>
      <Attr label="示例输出">{data.sample_output}</Attr>
      <Row className={`${styles.row} ${styles.noHover}`}>
        <Col span={6} className={styles.label}>
          <div className={styles.sticky}>测试数据</div>
        </Col>
        <Col span={18} className={styles.content}>
          <div className={styles.test}>
            {data.test.map((it, index) => {
              return (
                <div key={index} className={styles.testItem}>
                  <Divider orientation="left" className={styles.divider}>
                    TEST-{index}
                    {it.name.length ? `[${it.name}]` : ''}
                  </Divider>
                  <Collapse
                    items={[
                      {
                        key: 'in',
                        label: '输入',
                        children: <div>{it.input}</div>,
                      },
                      {
                        key: 'out',
                        label: '输出',
                        children: <div>{it.output}</div>,
                      },
                    ]}
                  />
                </div>
              );
            })}
          </div>
        </Col>
      </Row>
      <Row className={`${styles.row} ${styles.noHover}`}>
        <Col span={6} className={styles.label}>
          <div className={styles.sticky}>语言设置</div>
        </Col>
        <Col span={18} className={styles.content}>
          <div className={styles.language}>
            <LanguageConfig language={data.language} />
          </div>
        </Col>
      </Row>
    </div>
  );
}
