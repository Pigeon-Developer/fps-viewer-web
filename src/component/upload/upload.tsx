import React from 'react';
import * as styles from './upload.module.less';
import { parseXML } from '../../codec';

async function readFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result as string);
    };
    reader.onerror = () => {
      reject('Error reading the file. Please try again.');
    };
    reader.readAsText(file);
  });
}

async function handleFile(file: File) {
  const content = await readFile(file);
  console.log(parseXML(content));
}

export function Upload() {
  return (
    <label
      className={styles.comp}
      onDrop={(e) => {
        e.preventDefault();
        console.log(e);
        if (e.dataTransfer.files && e.dataTransfer.files.length) {
          handleFile(e.dataTransfer.files[0]);
        }
      }}
      onDragOver={(e) => {
        e.preventDefault();
      }}
    >
      <input
        onChange={(e) => {
          if (e.target.files && e.target.files.length) {
            handleFile(e.target.files[0]);
          }
        }}
        type="file"
        className={styles.input}
      ></input>
    </label>
  );
}
